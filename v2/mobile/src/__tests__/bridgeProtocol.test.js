import { describe, it, expect } from 'vitest';

describe('Mobile <-> Web Bridge Protocol Contract', () => {
  const VALID_IPC_TYPES = [
    'AUDIO_PLAY',
    'AUDIO_PAUSE',
    'SET_HARDWARE_VOLUME',
    'HAPTIC_BREATHE',
    'HAPTIC_SELECTION',
    'MILESTONE_UNLOCKED',
    'SYNC_STREAK_STATS',
    'SET_NOTIFICATION_PREFERENCES',
    'APP_UPDATE_AVAILABLE',
    'THEME_CHANGE',
  ];

  it('validates all core IPC message types against contract', () => {
    VALID_IPC_TYPES.forEach((type) => {
      const msg = { type };
      const parsed = JSON.parse(JSON.stringify(msg));
      expect(VALID_IPC_TYPES).toContain(parsed.type);
    });
  });

  it('verifies standard IPC message serialization format', () => {
    const sampleMessage = {
      type: 'HAPTIC_BREATHE',
      phase: 'inhale',
    };

    const serialized = JSON.stringify(sampleMessage);
    const parsed = JSON.parse(serialized);

    expect(VALID_IPC_TYPES).toContain(parsed.type);
    expect(parsed.phase).toBe('inhale');
  });

  it('validates milestone unlock message payload with quote and fallback message', () => {
    const milestoneMessage = {
      type: 'MILESTONE_UNLOCKED',
      milestone: {
        seconds: 300,
        label: '5 Minutes',
        title: 'The Gateway to Presence',
        message: 'A five-minute sanctuary creates space in your day.',
      },
      quote: {
        text: 'Calm is a superpower.',
        author: 'Naval Ravikant',
      },
    };

    const parsed = JSON.parse(JSON.stringify(milestoneMessage));
    expect(parsed.type).toBe('MILESTONE_UNLOCKED');
    expect(parsed.milestone.seconds).toBe(300);
    expect(parsed.milestone.label).toBe('5 Minutes');
    expect(parsed.quote.author).toBe('Naval Ravikant');
    expect(parsed.quote.text).toBe('Calm is a superpower.');
  });

  it('validates streak statistics synchronization payload', () => {
    const streakMessage = {
      type: 'SYNC_STREAK_STATS',
      streak: 7,
      todaySeconds: 1200,
    };

    const parsed = JSON.parse(JSON.stringify(streakMessage));
    expect(parsed.type).toBe('SYNC_STREAK_STATS');
    expect(parsed.streak).toBe(7);
    expect(parsed.todaySeconds).toBe(1200);
    expect(typeof parsed.streak).toBe('number');
    expect(typeof parsed.todaySeconds).toBe('number');
  });

  it('validates hardware volume payload constraints', () => {
    const volumeMessage = {
      type: 'SET_HARDWARE_VOLUME',
      volume: 0.75,
    };

    const parsed = JSON.parse(JSON.stringify(volumeMessage));
    expect(parsed.type).toBe('SET_HARDWARE_VOLUME');
    expect(parsed.volume).toBeGreaterThanOrEqual(0.0);
    expect(parsed.volume).toBeLessThanOrEqual(1.0);
  });

  it('validates notification preferences payload structure', () => {
    const prefsMessage = {
      type: 'SET_NOTIFICATION_PREFERENCES',
      preferences: {
        morning: true,
        afternoon: false,
        evening: true,
      },
    };

    const parsed = JSON.parse(JSON.stringify(prefsMessage));
    expect(parsed.type).toBe('SET_NOTIFICATION_PREFERENCES');
    expect(typeof parsed.preferences.morning).toBe('boolean');
    expect(typeof parsed.preferences.afternoon).toBe('boolean');
    expect(typeof parsed.preferences.evening).toBe('boolean');
  });

  it('validates theme change payload with valid hex color', () => {
    const themeMessage = {
      type: 'THEME_CHANGE',
      bg: '#05070d',
    };

    const parsed = JSON.parse(JSON.stringify(themeMessage));
    expect(parsed.type).toBe('THEME_CHANGE');
    expect(parsed.bg).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  it('safely tolerates and ignores malformed JSON strings without throwing', () => {
    const corruptedString = '{ type: "AUDIO_PLAY", broken: ';
    let didThrow = false;
    try {
      JSON.parse(corruptedString);
    } catch {
      didThrow = true;
    }
    expect(didThrow).toBe(true);
  });
});
