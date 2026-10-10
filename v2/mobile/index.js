import { registerRootComponent } from 'expo';
import { NativeModules } from 'react-native';
import App from './App';

// Register root UI component
registerRootComponent(App);

// Conditionally register native Android MediaSession background service when native module is present
if (NativeModules?.TrackPlayerModule) {
  try {
    const TrackPlayer = require('react-native-track-player').default;
    const { TrackPlayerService } = require('./src/services/TrackPlayerService');
    TrackPlayer.registerPlaybackService(() => TrackPlayerService);
  } catch (e) {
    console.log('TrackPlayer service registration note:', e);
  }
}
