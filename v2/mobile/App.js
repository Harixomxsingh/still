import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, StatusBar, Platform, SafeAreaView, AppState } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import { BackgroundAudioService } from './src/audio/BackgroundAudioService';
import { MindfulnessNotificationService } from './src/services/MindfulnessNotificationService';
import { NativeAudioEngine } from './src/services/NativeAudioEngine';
import { setMediaBridgeWebview } from './src/services/TrackPlayerService';
import { WEB_APP_HTML } from './src/assets/webAppBundle';

// Safe defensive loader for native volume manager to prevent crashes in Expo Go
let VolumeManager = null;
try {
  const mod = require('react-native-volume-manager');
  if (mod && mod.VolumeManager && typeof mod.VolumeManager.getVolume === 'function') {
    VolumeManager = mod.VolumeManager;
  }
} catch (e) {
  VolumeManager = null;
}

// Configure notification behavior: keep the ongoing daily stillness progress card completely silent (no sound, no banner)
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const notifId = notification?.request?.identifier;
    const notifCategory = notification?.request?.content?.categoryIdentifier;
    const notifType = notification?.request?.content?.data?.type;

    const isOngoingProgressCard =
      notifId === 'still_active_session' ||
      notifCategory === 'still_session_active' ||
      notifType === 'ACTIVE_SESSION_NOTIFICATION';

    return {
      shouldShowBanner: !isOngoingProgressCard,
      shouldShowList: true,
      shouldPlaySound: false, // Strictly silent foreground behavior
      shouldSetBadge: false,
    };
  },
});

export default function App() {
  const webViewRef = useRef(null);
  const [statusBarBg, setStatusBarBg] = useState('#05070d');
  
  // Real-time playback and stillness progress refs
  const isPlayingRef = useRef(false);
  const currentTrackNameRef = useRef('Sanctuary');
  const streakRef = useRef(0);
  const todaySecondsRef = useRef(0);
  const sessionStartTimeRef = useRef(0);
  const sessionBaseSecondsRef = useRef(0);

  useEffect(() => {
    // 0. Request Notification Permissions on Android & iOS
    Notifications.requestPermissionsAsync().catch(() => {});

    // 1. Initialize native background audio keep-alive driver and Spotify-grade MediaSession
    NativeAudioEngine.setup();
    BackgroundAudioService.init();

    // 2. Initialize autonomous mindfulness reminders (Morning, Midday, Evening)
    MindfulnessNotificationService.init();

    // 3. 2-Way Hardware Volume Sync
    let volumeSubscription = null;
    if (VolumeManager) {
      try {
        VolumeManager.getVolume()
          .then((initialVol) => {
            if (initialVol && typeof initialVol.volume === 'number') {
              webViewRef.current?.injectJavaScript(
                `window.__syncVolume && window.__syncVolume(${initialVol.volume}); true;`
              );
            }
          })
          .catch(() => {});

        volumeSubscription = VolumeManager.addVolumeListener((result) => {
          if (result && typeof result.volume === 'number') {
            webViewRef.current?.injectJavaScript(
              `window.__syncVolume && window.__syncVolume(${result.volume}); true;`
            );
          }
        });
      } catch (volErr) {
        console.log('VolumeManager init note:', volErr);
      }
    }

    // 4. Milestone Achievement Notification Channel (Gentle sound, Vibration)
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('still_milestone_channel', {
        name: 'Stillness Milestones & Achievements',
        importance: Notifications.AndroidImportance.DEFAULT,
        sound: 'default',
        enableVibrate: true,
        vibrationPattern: [0, 250, 100, 250],
        showBadge: true,
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      }).catch(() => {});
    }

    // 5. AppState Lifecycle Listener (Minimizing / Backgrounding instant sync)
    const appStateSub = AppState.addEventListener('change', (nextAppState) => {
      if ((nextAppState === 'background' || nextAppState === 'inactive') && isPlayingRef.current) {
        const elapsedSec = sessionStartTimeRef.current > 0 
          ? Math.floor((Date.now() - sessionStartTimeRef.current) / 1000) 
          : 0;
        const currentTotalSec = sessionBaseSecondsRef.current + elapsedSec;
        todaySecondsRef.current = currentTotalSec;
      } else if (nextAppState === 'active' && isPlayingRef.current) {
        // App resumed to foreground: inject background accumulated seconds back to WebView
        const elapsedSec = sessionStartTimeRef.current > 0 
          ? Math.floor((Date.now() - sessionStartTimeRef.current) / 1000) 
          : 0;
        const currentTotalSec = sessionBaseSecondsRef.current + elapsedSec;
        todaySecondsRef.current = currentTotalSec;

        webViewRef.current?.injectJavaScript(`
          if (window.__syncSanctuarySeconds) {
            window.__syncSanctuarySeconds(${currentTotalSec});
          }
          true;
        `);
      }
    });

    return () => {
      if (volumeSubscription) volumeSubscription.remove();
      if (appStateSub) appStateSub.remove();
    };
  }, []);

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      switch (data.type) {
        case 'SYNC_STREAK_STATS': {
          const incomingStreak = Number(data.streak ?? data.payload?.streak) || 0;
          const incomingToday = Number(data.todaySeconds ?? data.payload?.todaySeconds) || 0;
          
          if (incomingStreak > 0) streakRef.current = incomingStreak;
          if (incomingToday > 0) {
            todaySecondsRef.current = incomingToday;
            sessionBaseSecondsRef.current = incomingToday;
            sessionStartTimeRef.current = Date.now();
            NativeAudioEngine.updateStreakProgress(incomingToday, 1200);
          }
          
          MindfulnessNotificationService.updateActiveStreak(streakRef.current, todaySecondsRef.current);
          break;
        }

        case 'AUDIO_PLAY':
          isPlayingRef.current = true;
          if (data.track && (data.track.name || data.track.title)) {
            currentTrackNameRef.current = data.track.name || data.track.title;
          }
          sessionStartTimeRef.current = Date.now();
          sessionBaseSecondsRef.current = todaySecondsRef.current;
          
          // 1. Play via Native MediaSession with 3 permanent buttons, streak position, and zero clutter
          NativeAudioEngine.playSoundscape({
            id: data.track?.id || 'alpha_sanctuary',
            title: data.track?.title || data.track?.name || 'Alpha Wave Sanctuary',
            artist: '', // No subtitle text clutter
            position: todaySecondsRef.current || 0,
            duration: 1200, // 20-min daily target
          });
          break;

        case 'AUDIO_PAUSE':
          isPlayingRef.current = false;
          sessionStartTimeRef.current = 0;
          NativeAudioEngine.pause();
          break;

        case 'SET_HARDWARE_VOLUME':
          if (typeof data.volume === 'number') {
            NativeAudioEngine.setVolume(data.volume);
            if (VolumeManager) {
              try {
                VolumeManager.setVolume(data.volume, { showUI: false });
              } catch (e) {}
            }
          }
          break;

        case 'HAPTIC_BREATHE':
          if (Platform.OS === 'android' || Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          break;

        case 'HAPTIC_SELECTION':
          if (Platform.OS === 'android' || Platform.OS === 'ios') {
            Haptics.selectionAsync();
          }
          break;

        case 'MILESTONE_UNLOCKED':
          if (Platform.OS === 'android' || Platform.OS === 'ios') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
          if (data.milestone) {
            console.log('🏆 Triggering System Notification for:', data.milestone.label);
            Notifications.scheduleNotificationAsync({
              content: {
                title: `✨ ${data.milestone.label} Milestone Unlocked!`,
                body: data.quote ? `"${data.quote.text}" — ${data.quote.author}` : data.milestone.message,
                data: { action: 'MILESTONE' },
                sound: 'default',
                color: '#38bdf8',
                priority: Notifications.AndroidNotificationPriority.MAX,
              },
              trigger: {
                channelId: 'still_milestone_channel',
              },
            }).then(() => {
              console.log('🔔 System milestone notification delivered with sound');
            }).catch((err) => {
              console.log('System notification schedule note:', err);
            });
          }
          break;

        case 'SET_NOTIFICATION_PREFERENCES':
          if (data.preferences) {
            console.log('🎛️ Updating native mindfulness preferences:', data.preferences);
            MindfulnessNotificationService.updatePreferences(data.preferences);
          }
          break;

        case 'APP_UPDATE_AVAILABLE':
          console.log('✨ Broadcasting App Update Notification to user:', data.version);
          Notifications.scheduleNotificationAsync({
            content: {
              title: data.title || '✨ Still Sanctuary v2.1.1 Update is Live!',
              body: data.body || 'Compounding mindfulness rewards (5m–80m), calm analytics, and notification sovereignty are now active. Tap to enter.',
              data: { action: 'UPDATE' },
              sound: 'default',
              color: '#38bdf8',
              priority: Notifications.AndroidNotificationPriority.MAX,
            },
            trigger: {
              channelId: 'still_milestone_channel',
            },
          }).catch((err) => {
            console.log('Update notification note:', err);
          });
          break;

        case 'THEME_CHANGE':
          if (data.bg) {
            setStatusBarBg(data.bg);
          }
          break;

        default:
          break;
      }
    } catch (err) {
      // Ignored
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: statusBarBg }]}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={statusBarBg} 
        translucent={false}
      />
      
      <WebView
        ref={(ref) => {
          webViewRef.current = ref;
          setMediaBridgeWebview(ref);
        }}
        source={{ html: WEB_APP_HTML }}
        style={styles.webview}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        domStorageEnabled={true}
        cacheEnabled={true}
        cacheMode="LOAD_NO_CACHE"
        javaScriptEnabled={true}
        androidLayerType="hardware"
        pullToRefreshEnabled={true}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        onMessage={handleMessage}
        originWhitelist={['*']}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05070d',
  },
  webview: {
    flex: 1,
    backgroundColor: '#05070d',
  },
});
