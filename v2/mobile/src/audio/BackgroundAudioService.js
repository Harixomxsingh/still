import { Audio } from 'expo-av';

let nativeSound = null;
let isInitialized = false;

export class BackgroundAudioService {
  static async init() {
    if (isInitialized) return;
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false
      });
      isInitialized = true;
      console.log('🔊 Native Android Background Audio & MediaSession Initialized');
    } catch (e) {
      console.log('Background audio init note:', e);
    }
  }

  static async startNativeSession() {
    try {
      await this.init();
      if (!nativeSound) {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/ambient_carrier.wav'),
          { shouldPlay: true, isLooping: true, volume: 0.1 }
        );
        nativeSound = sound;
      } else {
        const status = await nativeSound.getStatusAsync();
        if (status.isLoaded && !status.isPlaying) {
          await nativeSound.playAsync();
        }
      }
    } catch (e) {
      console.log('Native audio session note:', e);
    }
  }

  static async pauseNativeSession() {
    try {
      if (nativeSound) {
        const status = await nativeSound.getStatusAsync();
        if (status.isLoaded && status.isPlaying) {
          await nativeSound.pauseAsync();
        }
      }
    } catch (e) {}
  }
}
