import { describe, it, expect } from 'vitest';

describe('Mobile <-> Web Bridge Protocol Contract', () => {
  const VALID_IPC_TYPES = [
    'PLAY_STATE_CHANGE',
    'SET_VOLUME',
    'HAPTIC_BREATHE',
    'HAPTIC_TICK',
    'MILESTONE_UNLOCKED',
    'APP_UPDATE_AVAILABLE',
    'SET_NOTIFICATION_PREFERENCES',
  ];

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

  it('validates milestone unlock message payload', () => {
    const milestoneMessage = {
      type: 'MILESTONE_UNLOCKED',
      milestone: {
        seconds: 300,
        label: '5 Minutes',
        title: 'The Gateway to Presence',
      },
      quote: {
        text: 'Calm is a superpower.',
        author: 'Naval Ravikant',
      },
    };

    const parsed = JSON.parse(JSON.stringify(milestoneMessage));
    expect(parsed.type).toBe('MILESTONE_UNLOCKED');
    expect(parsed.milestone.seconds).toBe(300);
    expect(parsed.quote.author).toBe('Naval Ravikant');
  });
});
