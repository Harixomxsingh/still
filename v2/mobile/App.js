import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, StatusBar, Platform, SafeAreaView, AppState } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import { BackgroundAudioService } from './src/audio/BackgroundAudioService';
import { MediaNotificationService } from './src/services/MediaNotificationService';
import { MindfulnessNotificationService } from './src/services/MindfulnessNotificationService';

const LIVE_WEB_APP_URL = 'https://harixomxsingh.github.io/still/';

export default function App() {
  const webViewRef = useRef(null);
  const [statusBarBg, setStatusBarBg] = useState('#05070d');
  // Timestamp and native platform flag to guarantee instant live sync and environment detection
  const [launchUrl] = useState(() => `${LIVE_WEB_APP_URL}?platform=android&_live=${Date.now()}`);

  const lastActiveTrackRef = useRef(null);

  const handleNotificationAction = async (actionIdentifier) => {
    console.log('⚡ LockScreen/Background Action Triggered:', actionIdentifier);
    if (actionIdentifier === 'ACTION_PAUSE') {
      await BackgroundAudioService.pauseNativeSession();
      await MediaNotificationService.showPaused(lastActiveTrackRef.current);
      webViewRef.current?.injectJavaScript(
        'window.__mediaTogglePlay && window.__mediaTogglePlay(); true;'
      );
    } else if (actionIdentifier === 'ACTION_PLAY') {
      await BackgroundAudioService.startNativeSession();
      await MediaNotificationService.showPlaying(lastActiveTrackRef.current);
      webViewRef.current?.injectJavaScript(
        'window.__mediaTogglePlay && window.__mediaTogglePlay(); true;'
      );
    } else if (actionIdentifier === 'ACTION_NEXT') {
      webViewRef.current?.injectJavaScript(
        'window.__mediaNextTrack && window.__mediaNextTrack(); true;'
      );
    } else {
      webViewRef.current?.injectJavaScript(
        'window.__mediaTogglePlay && window.__mediaTogglePlay(); true;'
      );
    }
  };

  useEffect(() => {
    // 1. Initialize native background audio driver & notification channels
    BackgroundAudioService.init();
    MediaNotificationService.setup();

    // 2. Initialize autonomous mindfulness reminders (Morning, Midday, Evening)
    MindfulnessNotificationService.init();

    // 3. Listen for Lock Screen and Notification Action Clicks
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      handleNotificationAction(response.actionIdentifier);
    });

    // 4. Check if app was resumed via notification action
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response && response.actionIdentifier && response.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER) {
        handleNotificationAction(response.actionIdentifier);
      }
    });

    return () => {
      subscription.remove();
      MediaNotificationService.dismiss();
    };
  }, []);

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      switch (data.type) {
        case 'AUDIO_PLAY':
          if (data.track) lastActiveTrackRef.current = data.track;
          BackgroundAudioService.startNativeSession();
          MediaNotificationService.showPlaying(data.track);
          break;

        case 'AUDIO_PAUSE':
          if (data.track) lastActiveTrackRef.current = data.track;
          BackgroundAudioService.pauseNativeSession();
          MediaNotificationService.showPaused(data.track);
          break;

        case 'TRACK_CHANGE':
          if (data.track) lastActiveTrackRef.current = data.track;
          if (data.isPlaying) {
            MediaNotificationService.showPlaying(data.track);
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
