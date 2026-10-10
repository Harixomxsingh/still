import { vi } from 'vitest';

// --- Mock expo-notifications ---
vi.mock('expo-notifications', () => ({
  setNotificationHandler: vi.fn(),
  getPermissionsAsync: vi.fn().mockResolvedValue({ status: 'granted' }),
  requestPermissionsAsync: vi.fn().mockResolvedValue({ status: 'granted' }),
  setNotificationChannelAsync: vi.fn().mockResolvedValue(true),
  getExpoPushTokenAsync: vi.fn().mockResolvedValue({ data: 'ExponentPushToken[mock-token-123]' }),
  cancelAllScheduledNotificationsAsync: vi.fn().mockResolvedValue(true),
  cancelScheduledNotificationAsync: vi.fn().mockResolvedValue(true),
  scheduleNotificationAsync: vi.fn().mockResolvedValue('mock-notification-id'),
  dismissNotificationAsync: vi.fn().mockResolvedValue(true),
  dismissAllNotificationsAsync: vi.fn().mockResolvedValue(true),
  setNotificationCategoryAsync: vi.fn().mockResolvedValue(true),
  addNotificationResponseReceivedListener: vi.fn().mockReturnValue({ remove: vi.fn() }),
  DEFAULT_ACTION_IDENTIFIER: 'expo.modules.notifications.actions.DEFAULT',
  AndroidImportance: {
    DEFAULT: 3,
    HIGH: 4,
    MAX: 5,
  },
  AndroidNotificationPriority: {
    HIGH: 'high',
    MAX: 'max',
  },
  AndroidNotificationVisibility: {
    PUBLIC: 1,
  },
  SchedulableTriggerInputTypes: {
    DATE: 'date',
  },
}));

// --- Mock expo-av ---
vi.mock('expo-av', () => ({
  Audio: {
    setAudioModeAsync: vi.fn().mockResolvedValue(true),
    Sound: {
      createAsync: vi.fn().mockResolvedValue({
        sound: {
          getStatusAsync: vi.fn().mockResolvedValue({ isLoaded: true, isPlaying: false }),
          playAsync: vi.fn().mockResolvedValue(true),
          pauseAsync: vi.fn().mockResolvedValue(true),
        },
      }),
    },
  },
}));

// --- Mock react-native ---
vi.mock('react-native', () => ({
  Platform: {
    OS: 'android',
    select: vi.fn((obj) => obj.android || obj.default),
  },
  StyleSheet: {
    create: vi.fn((styles) => styles),
  },
  View: 'View',
  StatusBar: {
    setBackgroundColor: vi.fn(),
    setBarStyle: vi.fn(),
  },
  NativeModules: {
    TrackPlayerModule: {
      CAPABILITY_PLAY: 'play',
    },
  },
  SafeAreaView: 'SafeAreaView',
}));

// --- Mock expo-haptics ---
vi.mock('expo-haptics', () => ({
  impactAsync: vi.fn().mockResolvedValue(true),
  notificationAsync: vi.fn().mockResolvedValue(true),
  selectionAsync: vi.fn().mockResolvedValue(true),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
}));

// --- Mock react-native-volume-manager ---
vi.mock('react-native-volume-manager', () => ({
  VolumeManager: {
    getVolume: vi.fn().mockResolvedValue({ volume: 0.75 }),
    addVolumeListener: vi.fn().mockReturnValue({ remove: vi.fn() }),
    setVolume: vi.fn().mockResolvedValue(true),
  },
}));

// --- Mock expo-constants ---
vi.mock('expo-constants', () => ({
  default: {
    appOwnership: 'standalone',
    executionEnvironment: 'standalone',
  },
  ExecutionEnvironment: {
    Bare: 'bare',
    Standalone: 'standalone',
    StoreClient: 'storeClient',
  },
}));

// --- Mock react-native-track-player ---
vi.mock('react-native-track-player', () => ({
  default: {
    setupPlayer: vi.fn().mockResolvedValue(true),
    updateOptions: vi.fn().mockResolvedValue(true),
    add: vi.fn().mockResolvedValue(true),
    play: vi.fn().mockResolvedValue(true),
    pause: vi.fn().mockResolvedValue(true),
    stop: vi.fn().mockResolvedValue(true),
    reset: vi.fn().mockResolvedValue(true),
    skip: vi.fn().mockResolvedValue(true),
    skipToNext: vi.fn().mockResolvedValue(true),
    skipToPrevious: vi.fn().mockResolvedValue(true),
    seekTo: vi.fn().mockResolvedValue(true),
    setVolume: vi.fn().mockResolvedValue(true),
    getActiveTrackIndex: vi.fn().mockResolvedValue(0),
    setRepeatMode: vi.fn().mockResolvedValue(true),
    registerPlaybackService: vi.fn(),
    addEventListener: vi.fn().mockReturnValue({ remove: vi.fn() }),
  },
  Capability: {
    Play: 'play',
    Pause: 'pause',
    Stop: 'stop',
    SkipToNext: 'skipToNext',
    SkipToPrevious: 'skipToPrevious',
    SeekTo: 'seekTo',
  },
  RepeatMode: {
    Off: 0,
    Track: 1,
    Queue: 2,
  },
  AppKilledPlaybackBehavior: {
    StopPlaybackAndRemoveNotification: 'stopPlaybackAndRemoveNotification',
  },
  Event: {
    RemotePlay: 'remote-play',
    RemotePause: 'remote-pause',
    RemoteStop: 'remote-stop',
    RemoteNext: 'remote-next',
    RemotePrevious: 'remote-previous',
    RemoteSeek: 'remote-seek',
    RemoteDuck: 'remote-duck',
    PlaybackState: 'playback-state',
    PlaybackActiveTrackChanged: 'playback-active-track-changed',
  },
  State: {
    None: 'none',
    Ready: 'ready',
    Playing: 'playing',
    Paused: 'paused',
    Stopped: 'stopped',
  },
}));

// --- Mock global fetch ---
globalThis.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve({}),
});
