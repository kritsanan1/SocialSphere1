import { describe, it, expect } from 'vitest';

// Test utility functions for formatting
describe('Format Utilities', () => {
  describe('Number formatting', () => {
    it('should format numbers with commas', () => {
      expect((1000).toLocaleString()).toBe('1,000');
      expect((1000000).toLocaleString()).toBe('1,000,000');
      expect((123456789).toLocaleString()).toBe('123,456,789');
    });

    it('should handle zero and negative numbers', () => {
      expect((0).toLocaleString()).toBe('0');
      expect((-1000).toLocaleString()).toBe('-1,000');
    });
  });

  describe('Date formatting', () => {
    it('should format dates consistently', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      expect(date.toISOString()).toBe('2024-01-15T10:30:00.000Z');
    });

    it('should handle invalid dates', () => {
      const invalidDate = new Date('invalid');
      expect(isNaN(invalidDate.getTime())).toBe(true);
    });
  });

  describe('String utilities', () => {
    it('should truncate text correctly', () => {
      const truncate = (text: string, length: number) => {
        return text.length > length ? text.substring(0, length) + '...' : text;
      };

      expect(truncate('Hello world', 5)).toBe('Hello...');
      expect(truncate('Hi', 10)).toBe('Hi');
      expect(truncate('Exactly ten', 10)).toBe('Exactly ten');
    });

    it('should validate email format', () => {
      const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };

      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@domain.co.uk')).toBe(true);
      expect(isValidEmail('invalid.email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
    });
  });
});