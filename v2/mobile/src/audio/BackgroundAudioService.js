import { Audio } from 'expo-av';

export class BackgroundAudioService {
  static async init() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false
      });
      console.log('Native background audio mode active');
    } catch (e) {
      console.log('Background audio init note:', e);
    }
  }
}
