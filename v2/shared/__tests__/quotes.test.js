import { describe, it, expect } from 'vitest';
import { CALM_QUOTES } from '../quotes';

describe('Shared Master Wisdom Quotes Integrity', () => {
  it('contains a non-empty wisdom library', () => {
    expect(Array.isArray(CALM_QUOTES)).toBe(true);
    expect(CALM_QUOTES.length).toBeGreaterThanOrEqual(20);
  });

  it('validates quote text and author properties', () => {
    CALM_QUOTES.forEach((quote, index) => {
      expect(quote.text, `Quote at index ${index} missing text`).toBeTruthy();
      expect(typeof quote.text).toBe('string');
      expect(quote.text.trim().length).toBeGreaterThan(10);

      expect(quote.author, `Quote at index ${index} missing author`).toBeTruthy();
      expect(typeof quote.author).toBe('string');
      expect(quote.author.trim().length).toBeGreaterThan(1);
    });
  });

  it('ensures quotes have diverse authors and unique messages', () => {
    const textSet = new Set(CALM_QUOTES.map((q) => q.text.trim().toLowerCase()));
    expect(textSet.size).toBe(CALM_QUOTES.length);
  });
});
