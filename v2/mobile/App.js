import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, StatusBar, Platform, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import { BackgroundAudioService } from './src/audio/BackgroundAudioService';
import { MediaNotificationService } from './src/services/MediaNotificationService';
import { MindfulnessNotificationService } from './src/services/MindfulnessNotificationService';
import { SOUNDSCAPES } from './src/shared/soundscapes';

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

const LIVE_WEB_APP_URL = 'https://harixomxsingh.github.io/still/';

export default function App() {
  const webViewRef = useRef(null);
  const [statusBarBg, setStatusBarBg] = useState('#05070d');
  const [launchUrl] = useState(() => `${LIVE_WEB_APP_URL}?platform=android&_live=${Date.now()}`);

  const currentTrackIndexRef = useRef(0);

  const handleNotificationAction = async (actionIdentifier) => {
    console.log('⚡ Native Action Triggered:', actionIdentifier);
    if (actionIdentifier === 'ACTION_PAUSE') {
      await BackgroundAudioService.pause();
      await MediaNotificationService.showPaused(SOUNDSCAPES[currentTrackIndexRef.current]);
      webViewRef.current?.injectJavaScript(
        'window.__mediaTogglePlay && window.__mediaTogglePlay(); true;'
      );
    } else if (actionIdentifier === 'ACTION_PLAY') {
      await BackgroundAudioService.resume();
      await MediaNotificationService.showPlaying(SOUNDSCAPES[currentTrackIndexRef.current]);
      webViewRef.current?.injectJavaScript(
        'window.__mediaTogglePlay && window.__mediaTogglePlay(); true;'
      );
    } else if (actionIdentifier === 'ACTION_NEXT') {
      currentTrackIndexRef.current = (currentTrackIndexRef.current + 1) % SOUNDSCAPES.length;
      const nextTrack = SOUNDSCAPES[currentTrackIndexRef.current];
      await BackgroundAudioService.playTrack(nextTrack);
      await MediaNotificationService.showPlaying(nextTrack);
      webViewRef.current?.injectJavaScript(
        `window.__mediaSelectTrack && window.__mediaSelectTrack(${currentTrackIndexRef.current}); true;`
      );
    } else {
      webViewRef.current?.injectJavaScript(
        'window.__mediaTogglePlay && window.__mediaTogglePlay(); true;'
      );
    }
  };

  useEffect(() => {
    global.__stillNotificationActionHandler = handleNotificationAction;

    // 1. Initialize native background audio driver & notification channels
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

    // 4. Listen for Lock Screen and Notification Action Clicks
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      handleNotificationAction(response.actionIdentifier);
    });

    // 5. Check if app was resumed via notification action
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response && response.actionIdentifier && response.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER) {
        handleNotificationAction(response.actionIdentifier);
      }
    });

    return () => {
      subscription.remove();
      if (volumeSubscription) volumeSubscription.remove();
      MediaNotificationService.dismiss();
    };
  }, []);

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      switch (data.type) {
        case 'AUDIO_PLAY':
          if (typeof data.index === 'number') currentTrackIndexRef.current = data.index;
          const playTrackObj = data.track || SOUNDSCAPES[currentTrackIndexRef.current];
          BackgroundAudioService.playTrack(playTrackObj);
          MediaNotificationService.showPlaying(playTrackObj);
          break;

        case 'AUDIO_PAUSE':
          if (typeof data.index === 'number') currentTrackIndexRef.current = data.index;
          const pauseTrackObj = data.track || SOUNDSCAPES[currentTrackIndexRef.current];
          BackgroundAudioService.pause();
          MediaNotificationService.showPaused(pauseTrackObj);
          break;

        case 'TRACK_CHANGE':
          if (typeof data.index === 'number') currentTrackIndexRef.current = data.index;
          const changeTrackObj = data.track || SOUNDSCAPES[currentTrackIndexRef.current];
          if (data.isPlaying) {
            BackgroundAudioService.playTrack(changeTrackObj);
            MediaNotificationService.showPlaying(changeTrackObj);
          }
          break;

        case 'SET_HARDWARE_VOLUME':
          if (typeof data.volume === 'number') {
            if (VolumeManager) {
              try {
                VolumeManager.setVolume(data.volume, { showUI: false });
              } catch (e) {}
            }
            BackgroundAudioService.setVolume(data.volume);
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
        source={{ uri: launchUrl }}
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
