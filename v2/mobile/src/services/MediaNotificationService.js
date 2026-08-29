import * as Notifications from 'expo-notifications';

const MEDIA_NOTIFICATION_ID = 'still_media_player';

export class MediaNotificationService {
  static async setup() {
    // Option 1 Radical Zen: Keep lock screen pure, dark, and distraction-free
    await this.dismiss();
  }

  static async showPlaying(track) {
    // Radical Zen: No persistent lock screen widgets
    await this.dismiss();
  }

  static async showPaused(track) {
    // Radical Zen: No persistent lock screen widgets
    await this.dismiss();
  }

  static async dismiss() {
    try {
      await Notifications.dismissNotificationAsync(MEDIA_NOTIFICATION_ID);
      await Notifications.dismissAllNotificationsAsync();
    } catch (e) {}
  }
}
