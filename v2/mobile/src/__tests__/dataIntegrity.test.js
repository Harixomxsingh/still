import { describe, it, expect } from 'vitest';
import defaultPrompts from '../data/prompts.json';

describe('Mobile Prompts Data Integrity', () => {
  it('contains valid morning, afternoon, and evening prompt lists', () => {
    expect(defaultPrompts).toBeDefined();
    expect(Array.isArray(defaultPrompts.morning)).toBe(true);
    expect(Array.isArray(defaultPrompts.afternoon)).toBe(true);
    expect(Array.isArray(defaultPrompts.evening)).toBe(true);

    expect(defaultPrompts.morning.length).toBeGreaterThan(0);
    expect(defaultPrompts.afternoon.length).toBeGreaterThan(0);
    expect(defaultPrompts.evening.length).toBeGreaterThan(0);
  });

  it('validates that each prompt has non-empty title and body', () => {
    ['morning', 'afternoon', 'evening'].forEach((slot) => {
      defaultPrompts[slot].forEach((item, idx) => {
        expect(item.title, `${slot}[${idx}] missing title`).toBeTruthy();
        expect(typeof item.title).toBe('string');
        expect(item.body, `${slot}[${idx}] missing body`).toBeTruthy();
        expect(typeof item.body).toBe('string');
      });
    });
  });
});
