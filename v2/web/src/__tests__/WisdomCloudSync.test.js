import { describe, it, expect, beforeEach, vi } from 'vitest';
import { WisdomCloudSync } from '../services/WisdomCloudSync';
import { CALM_QUOTES } from '../../../shared/quotes';

describe('WisdomCloudSync Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns default CALM_QUOTES when storage is empty', () => {
    const quotes = WisdomCloudSync.getAllQuotes();
    expect(quotes).toEqual(CALM_QUOTES);
  });

  it('retrieves quotes reliably by index without out-of-bounds error', () => {
    const quote0 = WisdomCloudSync.getQuoteByIndex(0);
    const quoteLarge = WisdomCloudSync.getQuoteByIndex(9999);
    const quoteNeg = WisdomCloudSync.getQuoteByIndex(-5);

    expect(quote0).toBeDefined();
    expect(quote0.text).toBeTruthy();
    expect(quoteLarge).toBeDefined();
    expect(quoteNeg).toBeDefined();
  });

  it('safely handles cloud sync without throwing network exceptions', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network offline'));

    await expect(WisdomCloudSync.syncWeekly()).resolves.not.toThrow();
  });
});
