import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AudioEngine } from '../AudioEngine';
import { SOUNDSCAPES } from '../../../../shared/soundscapes';

describe('AudioEngine Synthesis & State Machine', () => {
  let engine;

  beforeEach(() => {
    engine = new AudioEngine();
  });

  afterEach(() => {
    if (engine) {
      engine.pause();
    }
  });

  it('initializes default stems with expected ranges (0.0 to 1.0)', () => {
    expect(engine.stems.pads).toBe(0.8);
    expect(engine.stems.brownian).toBe(0.4);
    expect(engine.stems.rain).toBe(0.2);
    expect(engine.stems.binaural).toBe(0.4);
    expect(engine.stems.piano).toBe(0.5);
    expect(engine.isPlaying).toBe(false);
  });

  it('creates AudioContext, master gain, and stems on init()', () => {
    engine.init();
    expect(engine.ctx).toBeDefined();
    expect(engine.masterGain).toBeDefined();
    expect(engine.padMasterGain).toBeDefined();
    expect(engine.pianoMasterGain).toBeDefined();
    expect(engine.brownGain).toBeDefined();
    expect(engine.rainGain).toBeDefined();
    expect(engine.binauralGain).toBeDefined();
  });

  it('clamps stem gain between 0 and 1 safely', () => {
    engine.init();

    engine.setStemGain('pads', 1.5);
    expect(engine.stems.pads).toBe(1.0);

    engine.setStemGain('pads', -0.5);
    expect(engine.stems.pads).toBe(0.0);

    engine.setStemGain('rain', 0.65);
    expect(engine.stems.rain).toBe(0.65);
  });

  it('applies soundscape track without runtime exceptions', async () => {
    const testTrack = SOUNDSCAPES[0];
    await engine.applySoundscape(testTrack, 0.5);

    expect(engine.isPlaying).toBe(true);
    expect(engine.currentTrack).toBe(testTrack);
    expect(engine.padNodes.length).toBe(testTrack.chordNotes.length);
  });

  it('transitions soundscapes smoothly when switching tracks', async () => {
    const track1 = SOUNDSCAPES[0];
    const track2 = SOUNDSCAPES[1];

    await engine.applySoundscape(track1, 0.2);
    expect(engine.currentTrack.id).toBe(track1.id);

    await engine.applySoundscape(track2, 0.2);
    expect(engine.currentTrack.id).toBe(track2.id);
  });

  it('pauses and resumes without crashing', async () => {
    const track = SOUNDSCAPES[0];
    await engine.applySoundscape(track, 0.2);
    expect(engine.isPlaying).toBe(true);

    engine.pause();
    expect(engine.isPlaying).toBe(false);

    engine.resume();
    expect(engine.isPlaying).toBe(true);
  });

  it('plays celebration chime for milestones without error', () => {
    engine.init();
    expect(() => {
      engine.playCelebrationChime();
    }).not.toThrow();
  });

  it('handles master volume adjustment smoothly', () => {
    engine.init();
    expect(() => {
      engine.setMasterVolume(0.5);
      engine.setMasterVolume(0.0);
      engine.setMasterVolume(1.0);
    }).not.toThrow();
  });
});
