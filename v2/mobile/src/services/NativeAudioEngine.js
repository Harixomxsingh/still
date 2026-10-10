import TrackPlayer, {
  Capability,
  AppKilledPlaybackBehavior,
  RepeatMode,
  State,
} from 'react-native-track-player';
import { Platform, NativeModules } from 'react-native';
import { TrackPlayerService, setLastDispatchedTrackIndex } from './TrackPlayerService';
import { SOUNDSCAPES } from '../shared/soundscapes';

let isPlayerSetup = false;

// Check if native Android/iOS TrackPlayerModule is linked
const hasNativeTrackPlayer = !!NativeModules.TrackPlayerModule;

// Soundscape audio source resolver mapping track IDs to authentic 20-minute (1200s) audio waveforms
function getAudioSource(id) {
  try {
    switch (id) {
      case 'alpha_sanctuary':
        return require('../../assets/audio_20m/alpha_sanctuary_20m.m4a');
      case 'deep_delta':
        return require('../../assets/audio_20m/deep_delta_20m.m4a');
      case 'brownian_rain':
        return require('../../assets/audio_20m/brownian_rain_20m.m4a');
      case 'zen_garden':
        return require('../../assets/audio_20m/zen_garden_20m.m4a');
      case 'forest_dusk':
        return require('../../assets/audio_20m/forest_dusk_20m.m4a');
      case 'cosmic_float':
        return require('../../assets/audio_20m/cosmic_float_20m.m4a');
      case 'flow_state':
        return require('../../assets/audio_20m/flow_state_20m.m4a');
      default:
        return require('../../assets/audio_20m/alpha_sanctuary_20m.m4a');
    }
  } catch (e) {
    return `asset://soundscapes/${id || 'alpha_sanctuary'}.m4a`;
  }
}

// Artwork resolver guaranteeing valid high-res cover art in Android MediaStyle notification
function getArtworkSource(artwork, id) {
  try {
    switch (id) {
      case 'alpha_sanctuary':
        return require('../../assets/thumb_alpha_sanctuary.jpg');
      case 'deep_delta':
        return require('../../assets/thumb_night_sleep.jpg');
      case 'brownian_rain':
        return require('../../assets/thumb_rain_nature.jpg');
      case 'zen_garden':
        return require('../../assets/thumb_alpine_starlight.jpg');
      case 'forest_dusk':
        return require('../../assets/thumb_deep_flow.jpg');
      case 'cosmic_float':
        return require('../../assets/thumb_alpine_starlight.jpg');
      case 'flow_state':
        return require('../../assets/thumb_deep_flow.jpg');
      default:
        return require('../../assets/thumb_alpha_sanctuary.jpg');
    }
  } catch (e) {
    return 'thumb_alpha_sanctuary';
  }
}

// Build the full 7-soundscape queue with 1200s (20m) duration for daily progress
const SOUNDSCAPES_QUEUE = SOUNDSCAPES.map((s) => ({
  id: s.id,
  url: getAudioSource(s.id),
  title: s.title,
  artist: '', // Pure minimal typography: zero subtitle clutter
  artwork: getArtworkSource(s.artwork, s.id),
  duration: 1200, // 20-min daily target
}));

export class NativeAudioEngine {
  /**
   * Initializes the native Android/iOS MediaSession player
   */
  static async setup() {
    if (isPlayerSetup || !hasNativeTrackPlayer) return;

    try {
      await TrackPlayer.setupPlayer({
        autoHandleInterruptions: true,
      });

      await TrackPlayer.updateOptions({
        android: {
          appKilledPlaybackBehavior:
            AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
        },
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.SeekTo,
          Capability.Stop,
        ],
        // Exactly 3 permanent, balanced buttons: Previous, Play/Pause toggle, Next
        notificationCapabilities: [
          Capability.SkipToPrevious,
          Capability.Play,
          Capability.SkipToNext,
        ],
        compactCapabilities: [
          Capability.SkipToPrevious,
          Capability.Play,
          Capability.SkipToNext,
        ],
      });

      // Load all soundscapes into the persistent queue and enable Queue repeat mode
      await TrackPlayer.reset();
      await TrackPlayer.add(SOUNDSCAPES_QUEUE);
      await TrackPlayer.setRepeatMode(RepeatMode.Queue);

      // Register OS remote media listeners (Play, Pause, Next, Previous) in foreground runtime
      try {
        await TrackPlayerService();
      } catch (serviceErr) {
        console.log('TrackPlayerService attach note:', serviceErr);
      }

      isPlayerSetup = true;
      console.log('✅ Native TrackPlayer MediaSession Initialized with 3 Permanent Controls & Palette Artwork');
    } catch (error) {
      console.log('Native TrackPlayer setup note:', error);
    }
  }

  /**
   * Loads and plays a track with full Android MediaStyle metadata
   */
  static async playSoundscape({
    id = 'alpha_sanctuary',
    title = 'Alpha Wave Sanctuary',
    artist = '',
    artwork = '',
    position = 0,
    duration = 1200, // 20-min daily target
  } = {}) {
    if (!hasNativeTrackPlayer) return;
    try {
      await this.setup();

      // Find track index in predefined queue
      const targetIndex = SOUNDSCAPES.findIndex((s) => s.id === id);
      const safeIndex = targetIndex >= 0 ? targetIndex : 0;

      setLastDispatchedTrackIndex(safeIndex);

      const activeIndex = await TrackPlayer.getActiveTrackIndex().catch(() => null);
      if (activeIndex !== safeIndex) {
        await TrackPlayer.skip(safeIndex).catch(() => {});
      }

      await TrackPlayer.play();

      if (typeof position === 'number' && position > 0) {
        await TrackPlayer.seekTo(position).catch(() => {});
      }

      console.log(`🎵 Native MediaSession playing: index ${safeIndex} (${id}), streak: ${position}/${duration}s`);
    } catch (e) {
      console.log('Native playSoundscape note:', e);
    }
  }

  /**
   * Synchronizes notification progress slider with Daily Stillness progress
   */
  static async updateStreakProgress(todaySeconds, goalSeconds = 1200) {
    if (!hasNativeTrackPlayer || !isPlayerSetup) return;
    try {
      if (typeof todaySeconds === 'number' && todaySeconds >= 0) {
        await TrackPlayer.seekTo(todaySeconds).catch(() => {});
      }
    } catch (e) {}
  }

  /**
   * Pauses native media session
   */
  static async pause() {
    if (!hasNativeTrackPlayer) return;
    try {
      if (isPlayerSetup) {
        await TrackPlayer.pause();
      }
    } catch (e) {
      console.log('Native pause note:', e);
    }
  }

  /**
   * Resumes native media session
   */
  static async resume() {
    if (!hasNativeTrackPlayer) return;
    try {
      if (isPlayerSetup) {
        await TrackPlayer.play();
      }
    } catch (e) {
      console.log('Native resume note:', e);
    }
  }

  /**
   * Sets master hardware volume (0.0 to 1.0)
   */
  static async setVolume(level) {
    if (!hasNativeTrackPlayer) return;
    try {
      if (isPlayerSetup && typeof level === 'number') {
        await TrackPlayer.setVolume(Math.max(0, Math.min(1, level)));
      }
    } catch (e) {
      console.log('Native setVolume note:', e);
    }
  }
}
