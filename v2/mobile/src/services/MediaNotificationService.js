import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { Platform } from 'react-native';

export const BACKGROUND_NOTIFICATION_TASK = 'STILL_BACKGROUND_NOTIFICATION_TASK';

// Define the background execution task for Android Lock Screen & Notification Shade buttons
try {
  TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async ({ data, error }) => {
    if (error) return;
    if (data) {
      const actionIdentifier = data.actionIdentifier;
      console.log('⚡ Background Media Action:', actionIdentifier);
      if (global.__stillWebviewRef) {
        if (actionIdentifier === 'ACTION_PAUSE' || actionIdentifier === 'ACTION_PLAY') {
          global.__stillWebviewRef.injectJavaScript(
            'window.__mediaTogglePlay && window.__mediaTogglePlay(); true;'
          );
        } else if (actionIdentifier === 'ACTION_NEXT') {
          global.__stillWebviewRef.injectJavaScript(
            'window.__mediaNextTrack && window.__mediaNextTrack(); true;'
          );
        }
      }
    }
  });
} catch (e) {}

// Configure notification behavior: media player controls stay completely silent (no sound, no heads-up popup banner)
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const isMedia = notification?.request?.content?.data?.action === 'MEDIA_PLAYER';
    return {
      shouldShowAlert: true,
      shouldShowBanner: !isMedia,
      shouldShowList: true,
      shouldPlaySound: !isMedia,
      shouldSetBadge: false,
    };
  },
});

const MEDIA_NOTIFICATION_ID = 'still_media_player';
const CHANNEL_ID = 'still_media_playback_silent';

let isChannelConfigured = false;

export class MediaNotificationService {
  static async setup() {
    if (Platform.OS === 'android' && !isChannelConfigured) {
      try {
        await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
          name: 'Still Media Playback',
          importance: Notifications.AndroidImportance.LOW,
          sound: null,
          enableVibrate: false,
          vibrationPattern: [0],
          showBadge: false,
          lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
        });

        await Notifications.setNotificationCategoryAsync('still_media_playing', [
          {
            identifier: 'ACTION_PAUSE',
            buttonTitle: '⏸️ Pause',
            options: { opensAppToForeground: false, isAuthenticationRequired: false },
          },
          {
            identifier: 'ACTION_NEXT',
            buttonTitle: '⏭️ Next',
            options: { opensAppToForeground: false, isAuthenticationRequired: false },
          },
        ]);

        await Notifications.setNotificationCategoryAsync('still_media_paused', [
          {
            identifier: 'ACTION_PLAY',
            buttonTitle: '▶️ Play',
            options: { opensAppToForeground: false, isAuthenticationRequired: false },
          },
          {
            identifier: 'ACTION_NEXT',
            buttonTitle: '⏭️ Next',
            options: { opensAppToForeground: false, isAuthenticationRequired: false },
          },
        ]);

        // Register background task with Notifications
        try {
          await Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
        } catch (taskErr) {}

        isChannelConfigured = true;
      } catch (e) {
        console.log('Notification channel note:', e);
      }
    }
  }

  static async showPlaying(track) {
    if (Platform.OS !== 'android') return;
    try {
      await this.setup();
      const trackTitle = track?.title || 'Ambient Calm Space';
      const trackScience = track?.science ? track.science.split('•')[0].trim() : '432 Hz Solfeggio';

      await Notifications.scheduleNotificationAsync({
        identifier: MEDIA_NOTIFICATION_ID,
        content: {
          title: trackTitle,
          body: `Still • ${trackScience}`,
          data: { action: 'MEDIA_PLAYER' },
          sticky: true,
          autoDismiss: false,
          color: '#38bdf8',
          sound: false,
          categoryIdentifier: 'still_media_playing',
        },
        trigger: {
          channelId: CHANNEL_ID,
        },
      });
    } catch (e) {
      console.log('Media notification show note:', e);
    }
  }

  static async showPaused(track) {
    if (Platform.OS !== 'android') return;
    try {
      await this.setup();
      const trackTitle = track?.title || 'Ambient Calm Space';

      await Notifications.scheduleNotificationAsync({
        identifier: MEDIA_NOTIFICATION_ID,
        content: {
          title: `${trackTitle} (Paused)`,
          body: 'Still • Tap to Resume Sanctuary',
          data: { action: 'MEDIA_PLAYER' },
          sticky: false,
          autoDismiss: true,
          color: '#64748b',
          sound: false,
          categoryIdentifier: 'still_media_paused',
        },
        trigger: {
          channelId: CHANNEL_ID,
        },
      });
    } catch (e) {
      console.log('Media notification pause note:', e);
    }
  }

  static async dismiss() {
    try {
      await Notifications.dismissNotificationAsync(MEDIA_NOTIFICATION_ID);
    } catch (e) {}
  }
}
