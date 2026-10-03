/**
 * Still v2.2.0 — Sanctuary Sync & Daily Habit Engine
 * Handles daily presence tracking, streak calculation, optional Google 1-Tap sync, and backup export/import
 */

const STORAGE_KEYS = {
  STREAK: 'still_streak_count',
  LAST_STREAK_DATE: 'still_last_streak_date',
  LIFETIME_SECONDS: 'still_lifetime_seconds',
  TODAY_SECONDS_PREFIX: 'still_calm_day_',
  GOOGLE_USER: 'still_google_user',
  LAST_CLOUD_SYNC: 'still_last_cloud_sync',
};

export class SanctuarySyncService {
  /**
   * Returns today's date formatted as YYYY-MM-DD in local time
   */
  static getTodayDateString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Returns yesterday's date formatted as YYYY-MM-DD
   */
  static getYesterdayDateString() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Retrieves today's total calm seconds
   */
  static getTodaySeconds() {
    try {
      const todayKey = STORAGE_KEYS.TODAY_SECONDS_PREFIX + this.getTodayDateString();
      return Number(localStorage.getItem(todayKey) || 0);
    } catch (e) {
      return 0;
    }
  }

  /**
   * Retrieves all recorded daily calm practice history mapping 'YYYY-MM-DD' -> seconds
   */
  static getPracticesHistory() {
    try {
      const history = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_KEYS.TODAY_SECONDS_PREFIX)) {
          const dateStr = key.replace(STORAGE_KEYS.TODAY_SECONDS_PREFIX, '');
          history[dateStr] = Number(localStorage.getItem(key) || 0);
        }
      }
      return history;
    } catch (e) {
      return {};
    }
  }

  static getPracticeHistory() {
    return this.getPracticesHistory();
  }

  /**
   * Records newly added seconds and updates the daily streak
   */
  static recordListeningSeconds(addedSeconds = 1) {
    try {
      const todayStr = this.getTodayDateString();
      const todayKey = STORAGE_KEYS.TODAY_SECONDS_PREFIX + todayStr;
      const currentToday = Number(localStorage.getItem(todayKey) || 0) + addedSeconds;
      localStorage.setItem(todayKey, String(currentToday));

      // Lifetime seconds
      const currentLifetime = Number(localStorage.getItem(STORAGE_KEYS.LIFETIME_SECONDS) || 0) + addedSeconds;
      localStorage.setItem(STORAGE_KEYS.LIFETIME_SECONDS, String(currentLifetime));

      // Check daily habit threshold: 300 seconds (5 minutes)
      const lastStreakDate = localStorage.getItem(STORAGE_KEYS.LAST_STREAK_DATE);
      let currentStreak = Number(localStorage.getItem(STORAGE_KEYS.STREAK) || 0);

      if (currentToday >= 300 && lastStreakDate !== todayStr) {
        const yesterdayStr = this.getYesterdayDateString();
        if (lastStreakDate === yesterdayStr) {
          // Practiced yesterday ➔ increment streak
          currentStreak += 1;
        } else if (!lastStreakDate) {
          // First time ever achieving 5 minutes
          currentStreak = 1;
        } else {
          // Missed one or more days ➔ restart streak at 1
          currentStreak = 1;
        }

        localStorage.setItem(STORAGE_KEYS.STREAK, String(currentStreak));
        localStorage.setItem(STORAGE_KEYS.LAST_STREAK_DATE, todayStr);
      }

      return {
        todaySeconds: currentToday,
        lifetimeSeconds: currentLifetime,
        streak: currentStreak,
        isGoalMetToday: currentToday >= 300,
      };
    } catch (e) {
      return { todaySeconds: 0, lifetimeSeconds: 0, streak: 0, isGoalMetToday: false };
    }
  }

  /**
   * Retrieves the current streak count and goal completion state
   */
  static getStreakInfo() {
    try {
      const streak = Number(localStorage.getItem(STORAGE_KEYS.STREAK) || 0);
      const lastStreakDate = localStorage.getItem(STORAGE_KEYS.LAST_STREAK_DATE);
      const todayStr = this.getTodayDateString();
      const yesterdayStr = this.getYesterdayDateString();

      // If last streak date was before yesterday, the active streak has lapsed
      let activeStreak = streak;
      if (lastStreakDate && lastStreakDate !== todayStr && lastStreakDate !== yesterdayStr) {
        activeStreak = 0;
      }

      const todaySeconds = this.getTodaySeconds();
      return {
        streak: activeStreak,
        todaySeconds,
        isGoalMetToday: todaySeconds >= 300,
        goalTargetSeconds: 300,
        progressPercent: Math.min(100, Math.round((todaySeconds / 300) * 100)),
      };
    } catch (e) {
      return { streak: 0, todaySeconds: 0, isGoalMetToday: false, goalTargetSeconds: 300, progressPercent: 0 };
    }
  }

  /**
   * Optional 1-Tap Google Sync Authentication
   */
  static getGoogleUser() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.GOOGLE_USER);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  }

  static async linkGoogleAccount(mockUser = null) {
    const user = mockUser || {
      email: 'sanctuary.user@gmail.com',
      name: 'Sanctuary Explorer',
      picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      syncedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEYS.GOOGLE_USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.LAST_CLOUD_SYNC, String(Date.now()));
      return { success: true, user };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  static unlinkGoogleAccount() {
    try {
      localStorage.removeItem(STORAGE_KEYS.GOOGLE_USER);
      localStorage.removeItem(STORAGE_KEYS.LAST_CLOUD_SYNC);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Export all Sanctuary data as a portable JSON file
   */
  static exportSanctuaryData() {
    const streakInfo = this.getStreakInfo();
    const lifetimeSeconds = Number(localStorage.getItem(STORAGE_KEYS.LIFETIME_SECONDS) || 0);
    const prefs = localStorage.getItem('still_notif_prefs');

    return {
      version: '2.2.0',
      exportedAt: new Date().toISOString(),
      streak: streakInfo.streak,
      todaySeconds: streakInfo.todaySeconds,
      lifetimeSeconds,
      notificationPrefs: prefs ? JSON.parse(prefs) : null,
      googleUser: this.getGoogleUser(),
    };
  }

  /**
   * Import Sanctuary data from JSON
   */
  static importSanctuaryData(data) {
    if (!data || typeof data !== 'object') return false;
    try {
      if (typeof data.streak === 'number') {
        localStorage.setItem(STORAGE_KEYS.STREAK, String(data.streak));
        localStorage.setItem(STORAGE_KEYS.LAST_STREAK_DATE, this.getTodayDateString());
      }
      if (typeof data.lifetimeSeconds === 'number') {
        localStorage.setItem(STORAGE_KEYS.LIFETIME_SECONDS, String(data.lifetimeSeconds));
      }
      if (typeof data.todaySeconds === 'number') {
        localStorage.setItem(STORAGE_KEYS.TODAY_SECONDS_PREFIX + this.getTodayDateString(), String(data.todaySeconds));
      }
      if (data.notificationPrefs) {
        localStorage.setItem('still_notif_prefs', JSON.stringify(data.notificationPrefs));
      }
      return true;
    } catch (e) {
      return false;
    }
  }
}
