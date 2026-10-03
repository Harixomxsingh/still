import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, StatusBar, Platform, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import { BackgroundAudioService } from './src/audio/BackgroundAudioService';
import { MediaNotificationService } from './src/services/MediaNotificationService';
import { MindfulnessNotificationService } from './src/services/MindfulnessNotificationService';
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

// Configure notification behavior to show drop-down heads-up banner & sound in foreground & background
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    return {
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    };
  },
});

export default function App() {
  const webViewRef = useRef(null);
  const [statusBarBg, setStatusBarBg] = useState('#05070d');

  useEffect(() => {
    // 0. Request Notification Permissions on Android & iOS
    Notifications.requestPermissionsAsync().catch(() => {});

    // 1. Initialize native background audio keep-alive driver
    BackgroundAudioService.init();
    MediaNotificationService.setup();

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

    // 4. Milestone Achievement Notification Channel (Sound, Vibration & MAX Priority)
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('still_milestone_channel', {
        name: 'Stillness Milestones & Achievements',
        importance: Notifications.AndroidImportance.MAX,
        sound: 'default',
        enableVibrate: true,
        vibrationPattern: [0, 250, 100, 250],
        showBadge: true,
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      });
    }

    // 5. Version Update Arrival Broadcast Notification
    Notifications.scheduleNotificationAsync({
      content: {
        title: '✨ Still Sanctuary v2.2.0 Update is Live!',
        body: 'Daily Stillness Streaks, 1-Tap SOS State Rescues, and Cross-Device Sync are now active. Tap to enter.',
        data: { type: 'APP_UPDATE_NOTIFICATION' },
        sound: 'default',
        color: '#38bdf8',
        priority: Notifications.AndroidNotificationPriority.MAX,
      },
      trigger: {
        channelId: 'still_milestone_channel',
      },
    }).catch(() => {});

    return () => {
      if (volumeSubscription) volumeSubscription.remove();
      MediaNotificationService.dismiss();
    };
  }, []);

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      switch (data.type) {
        case 'SYNC_STREAK_STATS':
          MindfulnessNotificationService.updateActiveStreak(data.streak, data.todaySeconds);
          break;

        case 'AUDIO_PLAY':
          BackgroundAudioService.playTrack();
          break;

        case 'AUDIO_PAUSE':
          BackgroundAudioService.pause();
          break;

        case 'SET_HARDWARE_VOLUME':
          if (typeof data.volume === 'number') {
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
          global.__stillWebviewRef = ref;
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
