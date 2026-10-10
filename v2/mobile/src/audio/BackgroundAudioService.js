import { NativeAudioEngine } from '../services/NativeAudioEngine';

export class BackgroundAudioService {
  static async init() {
    return NativeAudioEngine.setup();
  }

  static async playTrack(soundscapeId = 'alpha_sanctuary', volume = 0.8) {
    return NativeAudioEngine.playSoundscape({ id: soundscapeId, volume });
  }

  static async pause() {
    return NativeAudioEngine.pause();
  }

  static async resume() {
    return NativeAudioEngine.resume();
  }

  static async setVolume(val) {
    return NativeAudioEngine.setVolume(val);
  }
}
