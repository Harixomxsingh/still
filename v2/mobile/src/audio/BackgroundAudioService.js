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
      console.log('🔊 Native Android Background Audio Anchor Initialized');
    } catch (e) {
      console.log('Background audio init note:', e);
    }
  }

  static async playTrack(track, volume = 0.01) {
    try {
      await this.init();
      if (!nativeSound) {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/ambient_carrier.wav'),
          { shouldPlay: true, isLooping: true, volume: 0.01 }
        );
        nativeSound = sound;
      } else {
        const status = await nativeSound.getStatusAsync();
        if (status.isLoaded && !status.isPlaying) {
          await nativeSound.playAsync();
        }
      }
      console.log('🎵 Background Carrier Active');
    } catch (e) {
      console.log('Native carrier play error:', e);
    }
  }

  static async pause() {
    try {
      if (nativeSound) {
        const status = await nativeSound.getStatusAsync();
        if (status.isLoaded && status.isPlaying) {
          await nativeSound.pauseAsync();
        }
      }
      console.log('⏸️ Background Session Paused');
    } catch (e) {}
  }

  static async resume() {
    try {
      await this.init();
      if (!nativeSound) {
        await this.playTrack();
        return;
      }
      const status = await nativeSound.getStatusAsync();
      if (status.isLoaded && !status.isPlaying) {
        await nativeSound.playAsync();
      }
      console.log('▶️ Background Session Resumed');
    } catch (e) {}
  }

  static async setVolume(val) {}
}
