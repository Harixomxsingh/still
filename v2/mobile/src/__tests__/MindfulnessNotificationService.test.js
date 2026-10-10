import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as Notifications from 'expo-notifications';
import { MindfulnessNotificationService } from '../services/MindfulnessNotificationService';

describe('MindfulnessNotificationService Universal Test Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes notification channel and schedules reminders', async () => {
    await MindfulnessNotificationService.init();

    expect(Notifications.getPermissionsAsync).toHaveBeenCalled();
    expect(Notifications.setNotificationChannelAsync).toHaveBeenCalledWith(
      'still_mindfulness_channel',
      expect.objectContaining({
        name: 'Still Mindfulness Reminders',
        importance: Notifications.AndroidImportance.HIGH,
      })
    );
    expect(Notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalled();
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalled();
  });

  it('schedules morning, midday, and evening reminders with strict date triggers', async () => {
    await MindfulnessNotificationService.scheduleAutonomousDailyReminders();

    // Verify morning reminder
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        identifier: 'daily_morning_reminder',
        content: expect.objectContaining({
          data: expect.objectContaining({ slot: 'morning' }),
        }),
        trigger: expect.objectContaining({
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          channelId: 'still_mindfulness_channel',
        }),
      })
    );

    // Verify afternoon reminder
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        identifier: 'daily_afternoon_reminder',
        content: expect.objectContaining({
          data: expect.objectContaining({ slot: 'afternoon' }),
        }),
        trigger: expect.objectContaining({
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          channelId: 'still_mindfulness_channel',
        }),
      })
    );

    // Verify evening reminder
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        identifier: 'daily_evening_reminder',
        content: expect.objectContaining({
          data: expect.objectContaining({ slot: 'evening' }),
        }),
        trigger: expect.objectContaining({
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          channelId: 'still_mindfulness_channel',
        }),
      })
    );
  });

  it('dynamically injects streak number into morning reminders when streak > 0', async () => {
    MindfulnessNotificationService.updateActiveStreak(14, 600);
    expect(MindfulnessNotificationService.activeStreak).toBe(14);

    await MindfulnessNotificationService.scheduleAutonomousDailyReminders();

    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        identifier: 'daily_morning_reminder',
        content: expect.objectContaining({
          title: expect.stringContaining('🔥 Day 14 Streak:'),
        }),
      })
    );
  });

  it('respects user preferences when selective reminders are toggled off', async () => {
    await MindfulnessNotificationService.updatePreferences({
      morning: false,
      midday: true,
      evening: false,
    });

    const calls = Notifications.scheduleNotificationAsync.mock.calls;
    const scheduledIdentifiers = calls.map((call) => call[0].identifier);

    expect(scheduledIdentifiers).not.toContain('daily_morning_reminder');
    expect(scheduledIdentifiers).toContain('daily_afternoon_reminder');
    expect(scheduledIdentifiers).not.toContain('daily_evening_reminder');
  });

  it('schedules custom timed notification for instant mindfulness triggers', async () => {
    const success = await MindfulnessNotificationService.scheduleCustomNotification(60, 'Breathe deeply');
    expect(success).toBe(true);

    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.objectContaining({
          title: 'Still',
          body: 'Breathe deeply',
        }),
        trigger: expect.objectContaining({
          seconds: 60,
          channelId: 'still_mindfulness_channel',
        }),
      })
    );
  });

  it('handles offline cloud sync gracefully without throwing', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network offline'));
    await expect(MindfulnessNotificationService.syncCloudPrompts()).resolves.not.toThrow();
  });

  it('updates prompts and schedules cloud announcements when online', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          morning: [{ title: 'Morning Dew', body: 'Start fresh.' }],
          afternoon: [{ title: 'Sun Zenith', body: 'Pause and breathe.' }],
          evening: [{ title: 'Nightfall', body: 'Let go of the day.' }],
          announcement: {
            id: 'announcement_v2',
            title: 'New Stillness Journey',
            body: 'Explore deeper soundscapes.',
          },
        }),
    });

    await MindfulnessNotificationService.syncCloudPrompts();

    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        identifier: 'announcement_v2',
        content: expect.objectContaining({
          title: 'New Stillness Journey',
          body: 'Explore deeper soundscapes.',
        }),
      })
    );
  });
});
