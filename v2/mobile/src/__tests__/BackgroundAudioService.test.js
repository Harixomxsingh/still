import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BackgroundAudioService } from '../audio/BackgroundAudioService';

describe('BackgroundAudioService Universal Test Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('provides safe static interface for background audio lifecycle', () => {
    expect(typeof BackgroundAudioService.init).toBe('function');
    expect(typeof BackgroundAudioService.playTrack).toBe('function');
    expect(typeof BackgroundAudioService.pause).toBe('function');
    expect(typeof BackgroundAudioService.resume).toBe('function');
    expect(typeof BackgroundAudioService.setVolume).toBe('function');
  });

  it('initializes background audio without throwing exceptions', async () => {
    await expect(BackgroundAudioService.init()).resolves.not.toThrow();
  });

  it('handles playTrack call safely', async () => {
    await expect(BackgroundAudioService.playTrack('carrier', 0.01)).resolves.not.toThrow();
  });

  it('handles pause call safely', async () => {
    await expect(BackgroundAudioService.pause()).resolves.not.toThrow();
  });

  it('handles resume call safely', async () => {
    await expect(BackgroundAudioService.resume()).resolves.not.toThrow();
  });

  it('handles setVolume safely with arbitrary volume levels', async () => {
    await expect(BackgroundAudioService.setVolume(0.5)).resolves.not.toThrow();
    await expect(BackgroundAudioService.setVolume(0.0)).resolves.not.toThrow();
    await expect(BackgroundAudioService.setVolume(1.0)).resolves.not.toThrow();
  });
});
