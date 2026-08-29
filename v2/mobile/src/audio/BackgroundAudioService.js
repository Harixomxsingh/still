import { Audio } from 'expo-av';

let nativeSound = null;
let isInitialized = false;
let currentVolume = 0.75;
let currentTrackId = 'alpha_sanctuary';

const SOUNDSCAPE_FILES = {
  alpha_sanctuary: require('../../assets/alpha_sanctuary.wav'),
  deep_delta: require('../../assets/deep_delta.wav'),
  brownian_rain: require('../../assets/brownian_rain.wav'),
  theta_clarity: require('../../assets/theta_clarity.wav'),
  gamma_flow: require('../../assets/gamma_flow.wav'),
  schumann_resonance: require('../../assets/schumann_resonance.wav'),
  solfeggio_528: require('../../assets/solfeggio_528.wav'),
};

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

  static async playTrack(track, volume = currentVolume) {
    try {
      await this.init();
      currentVolume = volume;
      const trackId = track?.id || 'alpha_sanctuary';
      currentTrackId = trackId;

      const audioSource = SOUNDSCAPE_FILES[trackId] || SOUNDSCAPE_FILES.alpha_sanctuary;

      if (nativeSound) {
        try {
          await nativeSound.stopAsync();
          await nativeSound.unloadAsync();
        } catch (e) {}
        nativeSound = null;
      }

      const { sound } = await Audio.Sound.createAsync(
        audioSource,
        { shouldPlay: true, isLooping: true, volume: Math.max(0.01, Math.min(1, currentVolume)) }
      );
      nativeSound = sound;
      console.log('🎵 Native Track Playing:', track?.title || trackId);
    } catch (e) {
      console.log('Native audio play error:', e);
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
      console.log('⏸️ Native Audio Paused Instantly');
    } catch (e) {
      console.log('Native pause note:', e);
    }
  }

  static async resume() {
    try {
      await this.init();
      if (!nativeSound) {
        await this.playTrack({ id: currentTrackId }, currentVolume);
        return;
      }
      const status = await nativeSound.getStatusAsync();
      if (status.isLoaded && !status.isPlaying) {
        await nativeSound.playAsync();
      }
      console.log('▶️ Native Audio Resumed Instantly');
    } catch (e) {
      console.log('Native resume note:', e);
    }
  }

  static async setVolume(val) {
    try {
      currentVolume = Math.max(0, Math.min(1, val));
      if (nativeSound) {
        const status = await nativeSound.getStatusAsync();
        if (status.isLoaded) {
          await nativeSound.setVolumeAsync(currentVolume);
        }
      }
    } catch (e) {}
  }
}
