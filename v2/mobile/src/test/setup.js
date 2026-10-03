import { vi } from 'vitest';

// --- Mock expo-notifications ---
vi.mock('expo-notifications', () => ({
  setNotificationHandler: vi.fn(),
  getPermissionsAsync: vi.fn().mockResolvedValue({ status: 'granted' }),
  requestPermissionsAsync: vi.fn().mockResolvedValue({ status: 'granted' }),
  setNotificationChannelAsync: vi.fn().mockResolvedValue(true),
  getExpoPushTokenAsync: vi.fn().mockResolvedValue({ data: 'ExponentPushToken[mock-token-123]' }),
  cancelAllScheduledNotificationsAsync: vi.fn().mockResolvedValue(true),
  scheduleNotificationAsync: vi.fn().mockResolvedValue('mock-notification-id'),
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

// --- Mock global fetch ---
globalThis.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve({}),
});
