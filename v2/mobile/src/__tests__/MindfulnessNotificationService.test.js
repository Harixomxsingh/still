import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as Notifications from 'expo-notifications';
import { MindfulnessNotificationService } from '../services/MindfulnessNotificationService';

describe('MindfulnessNotificationService', () => {
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
      })
    );
    expect(Notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalled();
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalled();
  });

  it('schedules morning, midday, and evening reminders', async () => {
    await MindfulnessNotificationService.scheduleAutonomousDailyReminders();

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
  });

  it('handles offline cloud sync gracefully without throwing', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network offline'));

    await expect(MindfulnessNotificationService.syncCloudPrompts()).resolves.not.toThrow();
  });
});
