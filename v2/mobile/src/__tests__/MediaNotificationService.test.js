import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as Notifications from 'expo-notifications';
import {
  MediaNotificationService,
  getProgressGradientColor,
  getProgressUnicodeBar,
  getFlameIcon,
  MEDIA_NOTIFICATION_ID,
  MEDIA_CHANNEL_ID,
  MEDIA_CATEGORY_ID,
  PAUSE_ACTION_ID,
} from '../services/MediaNotificationService';

describe('MediaNotificationService Sticky Stillness Progress Test Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    MediaNotificationService.isSetup = false;
  });

  describe('Dynamic Flame Ignition Icon', () => {
    it('returns totally dark/unlit ⚫ when progress is 0%', () => {
      expect(getFlameIcon(0)).toBe('⚫');
    });

    it('returns gentle kindling 🕯️ for 1% - 24%', () => {
      expect(getFlameIcon(10)).toBe('🕯️');
      expect(getFlameIcon(24)).toBe('🕯️');
    });

    it('returns ignited fire 🔥 for 25% - 49%', () => {
      expect(getFlameIcon(25)).toBe('🔥');
      expect(getFlameIcon(40)).toBe('🔥');
    });

    it('returns radiant flame 🔥✨ for 50% - 74%', () => {
      expect(getFlameIcon(50)).toBe('🔥✨');
      expect(getFlameIcon(70)).toBe('🔥✨');
    });

    it('returns blazing fire ✨🔥 for 75% - 99%', () => {
      expect(getFlameIcon(75)).toBe('✨🔥');
      expect(getFlameIcon(95)).toBe('✨🔥');
    });

    it('returns transcendent golden flame 🌟🔥 for 100%+', () => {
      expect(getFlameIcon(100)).toBe('🌟🔥');
      expect(getFlameIcon(120)).toBe('🌟🔥');
    });
  });

  describe('Progress Gradient Color Calculation', () => {
    it('returns tranquil dawn sky (#38bdf8) for 0% - 24%', () => {
      expect(getProgressGradientColor(0)).toBe('#38bdf8');
      expect(getProgressGradientColor(10)).toBe('#38bdf8');
      expect(getProgressGradientColor(24)).toBe('#38bdf8');
    });

    it('returns calm iris lavender (#818cf8) for 25% - 49%', () => {
      expect(getProgressGradientColor(25)).toBe('#818cf8');
      expect(getProgressGradientColor(40)).toBe('#818cf8');
    });

    it('returns deep amethyst purple (#a855f7) for 50% - 74%', () => {
      expect(getProgressGradientColor(50)).toBe('#a855f7');
      expect(getProgressGradientColor(70)).toBe('#a855f7');
    });

    it('returns radiant sunset amber (#f59e0b) for 75% - 99%', () => {
      expect(getProgressGradientColor(75)).toBe('#f59e0b');
      expect(getProgressGradientColor(95)).toBe('#f59e0b');
    });

    it('returns zen mastery emerald (#10b981) for 100%+', () => {
      expect(getProgressGradientColor(100)).toBe('#10b981');
      expect(getProgressGradientColor(120)).toBe('#10b981');
    });
  });

  describe('Progress Unicode Range Bar Formatting', () => {
    it('formats 0% progress with empty translucent segments', () => {
      expect(getProgressUnicodeBar(0, 10)).toBe('░░░░░░░░░░');
    });

    it('formats 50% progress with 5 filled and 5 translucent segments', () => {
      expect(getProgressUnicodeBar(50, 10)).toBe('█████░░░░░');
    });

    it('formats 100% progress with all filled segments', () => {
      expect(getProgressUnicodeBar(100, 10)).toBe('██████████');
    });
  });

  describe('Setup and Interactive Category Configuration', () => {
    it('configures notification channel and category with one-tap PAUSE action', async () => {
      await MediaNotificationService.setup();

      expect(Notifications.setNotificationChannelAsync).toHaveBeenCalledWith(
        MEDIA_CHANNEL_ID,
        expect.objectContaining({
          name: 'Still Daily Stillness Progress',
          importance: Notifications.AndroidImportance.MIN,
          enableVibrate: false,
          sound: null,
        })
      );

      expect(Notifications.setNotificationCategoryAsync).toHaveBeenCalledWith(
        MEDIA_CATEGORY_ID,
        expect.arrayContaining([
          expect.objectContaining({
            identifier: PAUSE_ACTION_ID,
            buttonTitle: '❚❚ Pause',
            options: expect.objectContaining({
              opensAppToForeground: true,
            }),
          }),
        ])
      );
    });
  });

  describe('Showing Sticky Progress Card', () => {
    it('schedules sticky rectangular progress card with gradient color and pause action', async () => {
      await MediaNotificationService.showProgressNotification({
        isPlaying: true,
        trackName: 'Brownian Noise',
        streak: 5,
        todaySeconds: 600, // 10 minutes out of 20 = 50%
        dailyGoalSeconds: 1200,
      });

      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          identifier: MEDIA_NOTIFICATION_ID,
          content: expect.objectContaining({
            title: expect.stringContaining('50%'),
            body: expect.stringContaining('50%'),
            color: '#a855f7', // 50% = Amethyst
            sticky: true,
            autoDismiss: false,
            categoryIdentifier: MEDIA_CATEGORY_ID,
            sound: false,
            vibrate: [0],
            priority: Notifications.AndroidNotificationPriority.MIN,
            data: expect.objectContaining({
              action: PAUSE_ACTION_ID,
            }),
          }),
        })
      );
    });

    it('dismisses sticky card automatically when isPlaying is false', async () => {
      await MediaNotificationService.showProgressNotification({
        isPlaying: false,
      });

      expect(Notifications.dismissNotificationAsync).toHaveBeenCalledWith(MEDIA_NOTIFICATION_ID);
    });
  });

  describe('Dismissal Safety', () => {
    it('dismisses notification safely without throwing', async () => {
      await expect(MediaNotificationService.dismiss()).resolves.not.toThrow();
      expect(Notifications.dismissNotificationAsync).toHaveBeenCalledWith(MEDIA_NOTIFICATION_ID);
    });
  });
});
