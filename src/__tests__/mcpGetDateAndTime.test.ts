import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getDateAndTimeHandler, getDateAndTimeSchema } from '../tools/mcpGetDateAndTime';

describe('mcpGetDateAndTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getDateAndTimeSchema', () => {
    it('should have correct schema properties', () => {
      expect(getDateAndTimeSchema.title).toBe('Get current date and time');
      expect(getDateAndTimeSchema.description).toBe('Get the current data and time in RFC3339 format');
    });
  });

  describe('getDateAndTimeHandler', () => {
    it('should return current date and time in two formats', async () => {
      const mockDate = new Date('2024-01-01T12:00:00.000Z');
      vi.setSystemTime(mockDate);

      const result = await getDateAndTimeHandler();

      expect(result.content).toHaveLength(2);
      expect(result.content[0].type).toBe('text');
      expect(result.content[1].type).toBe('text');
      
      // First format is toString()
      expect(result.content[0].text).toBe(mockDate.toString());
      
      // Second format is ISO string
      expect(result.content[1].text).toBe('2024-01-01T12:00:00.000Z');
    });

    it('should return different times when called at different moments', async () => {
      const firstDate = new Date('2024-01-01T12:00:00.000Z');
      vi.setSystemTime(firstDate);
      const firstResult = await getDateAndTimeHandler();

      const secondDate = new Date('2024-01-01T13:00:00.000Z');
      vi.setSystemTime(secondDate);
      const secondResult = await getDateAndTimeHandler();

      expect(firstResult.content[1].text).not.toBe(secondResult.content[1].text);
      expect(firstResult.content[1].text).toBe('2024-01-01T12:00:00.000Z');
      expect(secondResult.content[1].text).toBe('2024-01-01T13:00:00.000Z');
    });
  });
});