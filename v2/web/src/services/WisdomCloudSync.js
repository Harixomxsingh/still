import { CALM_QUOTES } from '../../../shared/quotes';

const CLOUD_QUOTES_URL = 'https://harixomxsingh.github.io/still/data/quotes.json';
const LOCAL_DATA_URL = './data/quotes.json';
const SYNC_KEY = 'still_last_quote_sync';
const STORAGE_KEY = 'still_dynamic_quotes';
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export class WisdomCloudSync {
  static getAllQuotes() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length >= CALM_QUOTES.length) {
          return parsed;
        }
      }
    } catch (e) {}
    return CALM_QUOTES;
  }

  /**
   * Autonomous weekly background synchronization engine
   */
  static async syncWeekly() {
    try {
      const lastSync = Number(localStorage.getItem(SYNC_KEY) || 0);
      const now = Date.now();

      if (now - lastSync < SEVEN_DAYS_MS) {
        return; // Already synced this week
      }

      // Try fetching from local static JSON and cloud repository
      let fetchedQuotes = [];
      try {
        const res = await fetch(LOCAL_DATA_URL);
        if (res.ok) {
          fetchedQuotes = await res.json();
        }
      } catch (err) {
        try {
          const cloudRes = await fetch(CLOUD_QUOTES_URL, { headers: { 'Cache-Control': 'no-cache' } });
          if (cloudRes.ok) {
            fetchedQuotes = await cloudRes.json();
          }
        } catch (cloudErr) {}
      }

      if (Array.isArray(fetchedQuotes) && fetchedQuotes.length > 0) {
        // Merge & deduplicate by text
        const currentList = this.getAllQuotes();
        const existingTexts = new Set(currentList.map(q => q.text.toLowerCase().trim()));
        
        const newAdditions = fetchedQuotes.filter(
          q => q.text && !existingTexts.has(q.text.toLowerCase().trim())
        );

        if (newAdditions.length > 0) {
          const merged = [...currentList, ...newAdditions];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          console.log(`✨ [WISDOM_SYNC] Successfully merged ${newAdditions.length} new quotes. Total library: ${merged.length}`);
        }
      }

      localStorage.setItem(SYNC_KEY, String(now));
    } catch (e) {
      console.log('Wisdom sync note:', e);
    }
  }

  /**
   * Smart non-repeating quote retriever
   */
  static getQuoteByIndex(index) {
    const list = this.getAllQuotes();
    return list[Math.abs(index) % list.length];
  }
}
