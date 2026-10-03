import { describe, it, expect } from 'vitest';
import { SOUNDSCAPES, THEMES } from '../../../shared/soundscapes';

describe('Shared Soundscapes Database Integrity', () => {
  it('contains a valid non-empty list of soundscapes', () => {
    expect(Array.isArray(SOUNDSCAPES)).toBe(true);
    expect(SOUNDSCAPES.length).toBeGreaterThanOrEqual(5);
  });

  it('guarantees unique IDs across all soundscapes', () => {
    const ids = SOUNDSCAPES.map((s) => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('validates required fields and data types for every soundscape', () => {
    const validKeys = ['pads', 'brownian', 'rain', 'binaural', 'piano'];

    SOUNDSCAPES.forEach((track, index) => {
      expect(track.id, `Soundscape at index ${index} missing id`).toBeTruthy();
      expect(typeof track.id).toBe('string');

      expect(track.title, `Soundscape ${track.id} missing title`).toBeTruthy();
      expect(typeof track.title).toBe('string');

      expect(track.purpose, `Soundscape ${track.id} missing purpose`).toBeTruthy();
      expect(track.science, `Soundscape ${track.id} missing science string`).toBeTruthy();
      expect(track.description, `Soundscape ${track.id} missing description`).toBeTruthy();

      // Audio Frequency Physics
      expect(track.baseFreq, `Soundscape ${track.id} baseFreq must be a positive number`).toBeGreaterThan(0);
      expect(track.binauralDiff, `Soundscape ${track.id} binauralDiff must be positive`).toBeGreaterThan(0);
      expect(track.binauralDiff, `Soundscape ${track.id} binauralDiff should be within brainwave range (0-40Hz)`).toBeLessThanOrEqual(40);

      // Chords Array
      expect(Array.isArray(track.chordNotes), `Soundscape ${track.id} chordNotes must be array`).toBe(true);
      expect(track.chordNotes.length).toBeGreaterThanOrEqual(2);
      track.chordNotes.forEach((freq) => {
        expect(typeof freq).toBe('number');
        expect(freq).toBeGreaterThan(0);
      });

      // Default Stems (Volume bounds 0.0 to 1.0)
      expect(track.defaultStems, `Soundscape ${track.id} defaultStems missing`).toBeDefined();
      validKeys.forEach((stemKey) => {
        expect(track.defaultStems[stemKey], `Soundscape ${track.id} missing stem: ${stemKey}`).toBeDefined();
        expect(typeof track.defaultStems[stemKey]).toBe('number');
        expect(track.defaultStems[stemKey]).toBeGreaterThanOrEqual(0.0);
        expect(track.defaultStems[stemKey]).toBeLessThanOrEqual(1.0);
      });
    });
  });
});

describe('Shared Theme Palettes Integrity', () => {
  it('contains valid theme definitions', () => {
    expect(Array.isArray(THEMES)).toBe(true);
    expect(THEMES.length).toBeGreaterThanOrEqual(4);
  });

  it('guarantees unique theme IDs', () => {
    const ids = THEMES.map((t) => t.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('validates theme colors and styling structure', () => {
    THEMES.forEach((theme) => {
      expect(theme.id).toBeTruthy();
      expect(theme.name).toBeTruthy();
      expect(theme.icon).toBeTruthy();

      expect(theme.bg, `Theme ${theme.id} invalid bg`).toMatch(/^#[0-9a-fA-F]{3,8}$|^rgba?\(/);
      expect(theme.cardBg, `Theme ${theme.id} invalid cardBg`).toMatch(/^#[0-9a-fA-F]{3,8}$|^rgba?\(/);
      expect(theme.accent, `Theme ${theme.id} invalid accent`).toMatch(/^#[0-9a-fA-F]{3,8}$|^rgba?\(/);
      expect(theme.border, `Theme ${theme.id} invalid border`).toMatch(/^#[0-9a-fA-F]{3,8}$|^rgba?\(/);
    });
  });
});
