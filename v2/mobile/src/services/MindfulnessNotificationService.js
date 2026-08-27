import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import defaultPrompts from '../data/prompts.json';

const MINDFULNESS_CHANNEL_ID = 'still_mindfulness_channel';
const CLOUD_PROMPTS_URL = 'https://harixomxsingh.github.io/still/data/notifications.json';

let cachedPrompts = defaultPrompts;
let isInitialized = false;

// Strict future Date calculation (guarantees date is always strictly in the future)
function getNextFutureDate(targetHour, targetMinute) {
  const now = new Date();
  const target = new Date();
  target.setHours(targetHour, targetMinute, 0, 0);

  // If the time has already passed today (or within the next 2 minutes), schedule for tomorrow
  if (target.getTime() <= now.getTime() + 120000) {
    target.setDate(target.getDate() + 1);
  }
  return target;
}

export class MindfulnessNotificationService {
  /**
   * Initializes notification channels and schedules FUTURE alarms only
   */
  static async init() {
    if (isInitialized) return;
    isInitialized = true;

    try {
      // 1. Request notification permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        return;
      }

      // 2. Setup Android Notification Channel
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync(MINDFULNESS_CHANNEL_ID, {
          name: 'Still Mindfulness Reminders',
          description: 'Gentle, thought-provoking daily reminders for calm and focus',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#38bdf8',
          lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
          sound: 'default',
        });
      }

      // 3. Retrieve and print Expo Push Token for remote push delivery
      try {
        const tokenData = await Notifications.getExpoPushTokenAsync();
        console.log('🔥 [REMOTE_PUSH_TOKEN]:', tokenData.data);
      } catch (tokenErr) {
        console.log('Remote push token note:', tokenErr.message);
      }

      // 3. Purge all old stuck notifications so no backlog can ever fire
      await Notifications.cancelAllScheduledNotificationsAsync();

      // 4. Silently fetch cloud prompts if online
      this.syncCloudPrompts();

      // 5. Schedule the 3 daily reminders using strict FUTURE DATE objects
      await this.scheduleAutonomousDailyReminders();

      console.log('✨ Mindfulness Reminders successfully scheduled strictly in the future.');
    } catch (e) {
      console.log('Mindfulness service init error:', e);
    }
  }

  /**
   * Silently updates prompts from GitHub when phone has internet
   */
  static async syncCloudPrompts() {
    try {
      const response = await fetch(CLOUD_PROMPTS_URL, {
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (response.ok) {
        const data = await response.json();
        if (data && data.morning && data.afternoon && data.evening) {
          cachedPrompts = data;
        }
      }
    } catch (e) {
      // Offline fallback
    }
  }

  /**
   * Schedules the 3 daily reminders using strict future Date objects.
   * Android OS will NEVER fire a future Date immediately.
   */
  static async scheduleAutonomousDailyReminders() {
    try {
      const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);

      // Morning (8:30 AM)
      const morningDate = getNextFutureDate(8, 30);
      const mList = cachedPrompts.morning || defaultPrompts.morning;
      const mPrompt = mList[dayOfYear % mList.length];

      await Notifications.scheduleNotificationAsync({
        identifier: 'daily_morning_reminder',
        content: {
          title: mPrompt.title,
          body: mPrompt.body,
          data: { slot: 'morning' },
          color: '#38bdf8',
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: morningDate,
          channelId: MINDFULNESS_CHANNEL_ID,
        },
      });

      // Afternoon (2:00 PM / 14:00)
      const afternoonDate = getNextFutureDate(14, 0);
      const aList = cachedPrompts.afternoon || defaultPrompts.afternoon;
      const aPrompt = aList[dayOfYear % aList.length];

      await Notifications.scheduleNotificationAsync({
        identifier: 'daily_afternoon_reminder',
        content: {
          title: aPrompt.title,
          body: aPrompt.body,
          data: { slot: 'afternoon' },
          color: '#38bdf8',
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: afternoonDate,
          channelId: MINDFULNESS_CHANNEL_ID,
        },
      });

      // Evening (9:45 PM / 21:45)
      const eveningDate = getNextFutureDate(21, 45);
      const eList = cachedPrompts.evening || defaultPrompts.evening;
      const ePrompt = eList[dayOfYear % eList.length];

      await Notifications.scheduleNotificationAsync({
        identifier: 'daily_evening_reminder',
        content: {
          title: ePrompt.title,
          body: ePrompt.body,
          data: { slot: 'evening' },
          color: '#38bdf8',
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: eveningDate,
          channelId: MINDFULNESS_CHANNEL_ID,
        },
      });

      console.log(`📅 Next Alarms: Morning at ${morningDate.toLocaleString()}, Afternoon at ${afternoonDate.toLocaleString()}, Evening at ${eveningDate.toLocaleString()}`);
    } catch (e) {
      console.log('Error scheduling future daily reminders:', e);
    }
  }

  /**
   * Schedules a custom timed notification (e.g. in 2 minutes / 120s)
   * Android OS will fire this on the lock screen even if the app is completely closed.
   */
  static async scheduleCustomNotification(delaySeconds = 120, message = 'make your self calm 🪷') {
    try {
      await this.init();
      const notifId = `custom_push_${Date.now()}`;

      await Notifications.scheduleNotificationAsync({
        identifier: notifId,
        content: {
          title: 'Still',
          body: message,
          data: { type: 'CUSTOM_PUSH', message },
          color: '#38bdf8',
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          seconds: delaySeconds,
          channelId: MINDFULNESS_CHANNEL_ID,
        },
      });

      console.log(`⏱️ Custom notification scheduled in ${delaySeconds} seconds: "${message}"`);
      return true;
    } catch (e) {
      console.log('Error scheduling custom notification:', e);
      return false;
    }
  }

  /**
   * Cancel all notifications helper
   */
  static async cancelAll() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (e) {}
  }
}
