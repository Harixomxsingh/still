import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, StatusBar, Platform, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Haptics from 'expo-haptics';
import { BackgroundAudioService } from './src/audio/BackgroundAudioService';

const LIVE_WEB_APP_URL = 'https://harixomxsingh.github.io/still/';

export default function App() {
  const webViewRef = useRef(null);
  const [statusBarBg, setStatusBarBg] = useState('#05070d');
  // Timestamp and native platform flag to guarantee instant live sync and environment detection
  const [launchUrl] = useState(() => `${LIVE_WEB_APP_URL}?platform=android&_live=${Date.now()}`);

  useEffect(() => {
    // Initialize native background audio driver
    BackgroundAudioService.init();
  }, []);

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      switch (data.type) {
        case 'AUDIO_PLAY':
          BackgroundAudioService.startNativeSession();
          break;

        case 'AUDIO_PAUSE':
          BackgroundAudioService.pauseNativeSession();
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
        ref={webViewRef}
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
