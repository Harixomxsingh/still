import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

export const MEDIA_NOTIFICATION_ID = 'still_active_session';
export const MEDIA_CHANNEL_ID = 'still_active_session_channel';
export const MEDIA_CATEGORY_ID = 'still_session_active';
export const PAUSE_ACTION_ID = 'PAUSE_ACTION';
export const DEFAULT_DAILY_GOAL_SECONDS = 1200; // 20 Minutes Daily Sanctuary Goal

/**
 * Returns dynamic flame states: totally dark/black when 0%, igniting and blazing as % progresses
 */
export function getFlameIcon(pct) {
  const bounded = Math.max(0, Math.min(100, Number(pct) || 0));
  if (bounded <= 0) return '⚫'; // Totally dark / unlit
  if (bounded < 25) return '🕯️'; // First spark / kindle
  if (bounded < 50) return '🔥'; // Ignited calm fire
  if (bounded < 75) return '🔥✨'; // Radiant glowing flame
  if (bounded < 100) return '✨🔥'; // Blazing stillness
  return '🌟🔥'; // Transcendent goal achieved
}

/**
 * Calculates a progressive color gradient based on the daily stillness completion percentage
 */
export function getProgressGradientColor(pct) {
  if (pct >= 100) return '#10b981'; // Zen Mastery Emerald (100% Goal Met)
  if (pct >= 75) return '#f59e0b';  // Radiant Sunset Amber (75% - 99%)
  if (pct >= 50) return '#a855f7';  // Deep Amethyst Purple (50% - 74%)
  if (pct >= 25) return '#818cf8';  // Calm Iris Lavender (25% - 49%)
  return '#38bdf8';                 // Tranquil Dawn Sky (0% - 24%)
}

/**
 * Formats a clean, transparent-feel Unicode progress range bar.
 * Uses solid block '█' for the filled range and translucent light shade '░' for the background track.
 * Shows pure percentage without minute clutter or text.
 */
export function getProgressUnicodeBar(pct, totalSegments = 14) {
  const boundedPct = Math.max(0, Math.min(100, Number(pct) || 0));
  const filled = Math.min(totalSegments, Math.max(0, Math.round((boundedPct / 100) * totalSegments)));
  const empty = totalSegments - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

export class MediaNotificationService {
  static isSetup = false;
  static lastScheduledPct = -1;
  static lastScheduledTime = 0;
  static lastTrackName = '';

  /**
   * Initializes a completely silent Android notification channel (MIN importance, NO sound, NO vibration)
   * and sets up the interactive one-tap "❚❚ Pause" category.
   */
  static async setup() {
    if (this.isSetup) return;
    this.isSetup = true;

    try {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync(MEDIA_CHANNEL_ID, {
          name: 'Still Daily Stillness Progress',
          description: 'Silent ongoing card showing daily stillness progress and one-tap pause',
          importance: Notifications.AndroidImportance.MIN, // MIN = completely silent, NO sound, NO vibration, NO heads-up popup
          lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
          vibrationPattern: [0],
          enableVibrate: false,
          sound: null,
          showBadge: false,
        }).catch(() => {});
      }

      // Configure the interactive notification category with realistic '❚❚ Pause' action
      await Notifications.setNotificationCategoryAsync(MEDIA_CATEGORY_ID, [
        {
          identifier: PAUSE_ACTION_ID,
          buttonTitle: '❚❚ Pause',
          options: {
            opensAppToForeground: true, // Opens the app automatically so wave pauses gracefully
          },
        },
      ]).catch(() => {});
    } catch (e) {
      // Graceful fallback in development environments
    }
  }

  /**
   * Displays or updates the persistent sticky notification card in the notification shade.
   * Throttles updates so it never buzzes or spams the OS every second.
   */
  static async showProgressNotification({
    isPlaying = true,
    trackName = 'Sanctuary',
    streak = 0,
    todaySeconds = 0,
    dailyGoalSeconds = DEFAULT_DAILY_GOAL_SECONDS,
    force = false,
  } = {}) {
    if (!isPlaying) {
      await this.dismiss();
      return;
    }

    try {
      await this.setup();

      const now = Date.now();
      const pct = Math.min(100, Math.round((Math.max(0, todaySeconds) / dailyGoalSeconds) * 100));

      // Anti-buzz throttle: do not reschedule if percentage is unchanged and updated recently (unless force is true)
      if (!force && this.lastScheduledPct === pct && (now - this.lastScheduledTime < 10000)) {
        return;
      }

      const flame = getFlameIcon(pct);
      const progressBar = getProgressUnicodeBar(pct, 14);
      const gradientColor = getProgressGradientColor(pct);

      // Clean, minimalist design matching hand-drawn sketch: flame, range bar, pure percentage, zero text
      const title = `${flame}   ${pct}%`;
      const body = `${progressBar}   ${pct}%`;

      await Notifications.scheduleNotificationAsync({
        identifier: MEDIA_NOTIFICATION_ID,
        content: {
          title,
          body,
          data: {
            action: PAUSE_ACTION_ID,
            type: 'ACTIVE_SESSION_NOTIFICATION',
          },
          categoryIdentifier: MEDIA_CATEGORY_ID,
          sticky: true,
          autoDismiss: false,
          color: gradientColor,
          sound: false,
          vibrate: [0],
          priority: Notifications.AndroidNotificationPriority.MIN, // Purely silent ongoing card
        },
        trigger: Platform.OS === 'android' ? { channelId: MEDIA_CHANNEL_ID } : null,
      });

      this.lastScheduledPct = pct;
      this.lastScheduledTime = now;
      this.lastTrackName = trackName;
    } catch (e) {
      console.log('Error showing active session notification:', e);
    }
  }

  /**
   * Dismisses the persistent notification card immediately when playback is stopped/paused
   */
  static async dismiss() {
    try {
      await Notifications.dismissNotificationAsync(MEDIA_NOTIFICATION_ID).catch(() => {});
      this.lastScheduledPct = -1;
      this.lastScheduledTime = 0;
      this.lastTrackName = '';
    } catch (e) {
      console.log('Error dismissing active session notification:', e);
    }
  }
}
