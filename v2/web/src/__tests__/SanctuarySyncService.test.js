import { describe, it, expect, beforeEach } from 'vitest';
import { SanctuarySyncService } from '../services/SanctuarySyncService';

describe('SanctuarySyncService Habit & Cloud Engine', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('formats today and yesterday dates as YYYY-MM-DD', () => {
    const today = SanctuarySyncService.getTodayDateString();
    const yesterday = SanctuarySyncService.getYesterdayDateString();

    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(yesterday).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(today).not.toEqual(yesterday);
  });

  it('records listening seconds accurately in daily and lifetime buckets', () => {
    const res1 = SanctuarySyncService.recordListeningSeconds(60);
    expect(res1.todaySeconds).toBe(60);
    expect(res1.lifetimeSeconds).toBe(60);
    expect(res1.isGoalMetToday).toBe(false);

    const res2 = SanctuarySyncService.recordListeningSeconds(240);
    expect(res2.todaySeconds).toBe(300);
    expect(res2.lifetimeSeconds).toBe(300);
    expect(res2.isGoalMetToday).toBe(true);
    expect(res2.streak).toBe(1);
  });

  it('calculates habit streak progress percentage correctly', () => {
    SanctuarySyncService.recordListeningSeconds(150);
    const info = SanctuarySyncService.getStreakInfo();

    expect(info.todaySeconds).toBe(150);
    expect(info.progressPercent).toBe(50);
    expect(info.isGoalMetToday).toBe(false);
  });

  it('links and unlinks Google accounts seamlessly', async () => {
    expect(SanctuarySyncService.getGoogleUser()).toBeNull();

    const mockUser = { email: 'mindful@still.app', name: 'Stillness Seeker' };
    const linkRes = await SanctuarySyncService.linkGoogleAccount(mockUser);
    expect(linkRes.success).toBe(true);

    const savedUser = SanctuarySyncService.getGoogleUser();
    expect(savedUser).toBeDefined();
    expect(savedUser.email).toBe('mindful@still.app');

    const unlinked = SanctuarySyncService.unlinkGoogleAccount();
    expect(unlinked).toBe(true);
    expect(SanctuarySyncService.getGoogleUser()).toBeNull();
  });

  it('exports and imports portable sanctuary backup data', () => {
    SanctuarySyncService.recordListeningSeconds(350);

    const backup = SanctuarySyncService.exportSanctuaryData();
    expect(backup.version).toBe('2.2.0');
    expect(backup.streak).toBe(1);
    expect(backup.todaySeconds).toBe(350);

    localStorage.clear();
    expect(SanctuarySyncService.getStreakInfo().streak).toBe(0);

    const imported = SanctuarySyncService.importSanctuaryData(backup);
    expect(imported).toBe(true);
    expect(SanctuarySyncService.getStreakInfo().streak).toBe(1);
  });
});
