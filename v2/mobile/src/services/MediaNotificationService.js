import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure immediate display
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const MEDIA_NOTIFICATION_ID = 'still_media_player';
const CHANNEL_ID = 'still_media_playback';

let isChannelConfigured = false;

export class MediaNotificationService {
  static async setup() {
    if (Platform.OS === 'android' && !isChannelConfigured) {
      try {
        await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
          name: 'Still Media Playback',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0],
          enableVibrate: false,
          showBadge: false,
          lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
        });

        await Notifications.setNotificationCategoryAsync('still_media_playing', [
          {
            identifier: 'ACTION_PAUSE',
            buttonTitle: '⏸️ Pause',
            options: { opensAppToForeground: false },
          },
          {
            identifier: 'ACTION_NEXT',
            buttonTitle: '⏭️ Next',
            options: { opensAppToForeground: false },
          },
        ]);

        await Notifications.setNotificationCategoryAsync('still_media_paused', [
          {
            identifier: 'ACTION_PLAY',
            buttonTitle: '▶️ Play',
            options: { opensAppToForeground: false },
          },
          {
            identifier: 'ACTION_NEXT',
            buttonTitle: '⏭️ Next',
            options: { opensAppToForeground: false },
          },
        ]);

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
          categoryIdentifier: 'still_media_playing',
        },
        trigger: null,
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
          categoryIdentifier: 'still_media_paused',
        },
        trigger: null,
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
