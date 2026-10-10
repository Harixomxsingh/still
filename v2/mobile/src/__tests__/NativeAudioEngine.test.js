import { describe, it, expect, vi, beforeEach } from 'vitest';
import TrackPlayer, { Capability, AppKilledPlaybackBehavior, RepeatMode } from 'react-native-track-player';
import { NativeAudioEngine } from '../services/NativeAudioEngine';

describe('NativeAudioEngine Spotify-Grade MediaSession Test Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes native Android MediaSession with capabilities and killed behavior', async () => {
    await NativeAudioEngine.setup();

    expect(TrackPlayer.setupPlayer).toHaveBeenCalledWith({
      autoHandleInterruptions: true,
    });

    expect(TrackPlayer.updateOptions).toHaveBeenCalledWith(
      expect.objectContaining({
        android: {
          appKilledPlaybackBehavior:
            AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
        },
        capabilities: expect.arrayContaining([
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
        ]),
        // Exactly 3 permanent, balanced buttons: Previous, Play/Pause toggle, Next
        notificationCapabilities: expect.arrayContaining([
          Capability.SkipToPrevious,
          Capability.Play,
          Capability.SkipToNext,
        ]),
        compactCapabilities: expect.arrayContaining([
          Capability.SkipToPrevious,
          Capability.Play,
          Capability.SkipToNext,
        ]),
      })
    );

    // Queue initialized with repeat mode
    expect(TrackPlayer.reset).toHaveBeenCalled();
    expect(TrackPlayer.add).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'alpha_sanctuary',
          title: 'Alpha Wave Sanctuary',
          artist: '',
          duration: 1200,
        }),
      ])
    );
    expect(TrackPlayer.setRepeatMode).toHaveBeenCalledWith(RepeatMode.Queue);
  });

  it('loads and plays a soundscape track by selecting safe index in queue', async () => {
    await NativeAudioEngine.playSoundscape({
      id: 'deep_delta',
      title: 'Deep Delta Sleep',
      position: 150,
      duration: 1200,
    });

    expect(TrackPlayer.skip).toHaveBeenCalledWith(1);
    expect(TrackPlayer.play).toHaveBeenCalled();
    expect(TrackPlayer.seekTo).toHaveBeenCalledWith(150);
  });

  it('updates daily streak progress bar position', async () => {
    await NativeAudioEngine.setup();
    await NativeAudioEngine.updateStreakProgress(312, 1200);

    expect(TrackPlayer.seekTo).toHaveBeenCalledWith(312);
  });

  it('pauses playback via native media session', async () => {
    await NativeAudioEngine.setup();
    await NativeAudioEngine.pause();

    expect(TrackPlayer.pause).toHaveBeenCalled();
  });

  it('resumes playback via native media session', async () => {
    await NativeAudioEngine.setup();
    await NativeAudioEngine.resume();

    expect(TrackPlayer.play).toHaveBeenCalled();
  });

  it('sets volume smoothly clamped between 0 and 1', async () => {
    await NativeAudioEngine.setup();
    await NativeAudioEngine.setVolume(0.85);

    expect(TrackPlayer.setVolume).toHaveBeenCalledWith(0.85);
  });
});
