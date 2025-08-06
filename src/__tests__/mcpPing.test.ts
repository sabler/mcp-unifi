import { describe, it, expect } from 'vitest';
import { pingToolHandler, pingToolSchema } from '../tools/mcpPing';

describe('mcpPing', () => {
  describe('pingToolSchema', () => {
    it('should have correct schema properties', () => {
      expect(pingToolSchema.title).toBe('MCP Heartbeat');
      expect(pingToolSchema.description).toBe('Simple test to see if the server is active');
      expect(pingToolSchema.inputSchema.message).toBeDefined();
    });
  });

  describe('pingToolHandler', () => {
    it('should return pong with the provided message', async () => {
      const testMessage = 'Hello World';
      const result = await pingToolHandler({ message: testMessage });

      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toBe(`Pong: ${testMessage}`);
    });

    it('should handle empty message', async () => {
      const result = await pingToolHandler({ message: '' });

      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toBe('Pong: ');
    });

    it('should handle special characters in message', async () => {
      const specialMessage = '!@#$%^&*()_+{}|:"<>?';
      const result = await pingToolHandler({ message: specialMessage });

      expect(result.content[0].text).toBe(`Pong: ${specialMessage}`);
    });
  });
});