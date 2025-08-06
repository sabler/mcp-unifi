import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getClientDetailsHandler, getClientDetailsSchema } from '../tools/mcpGetClientDetails';

// Mock the unifiLocalClient
vi.mock('../common/headers', () => ({
  unifiLocalClient: {
    get: vi.fn(),
  },
  UNIFI_SITE_ID: 'mock-site-id',
}));

describe('mcpGetClientDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getClientDetailsSchema', () => {
    it('should have correct schema properties', () => {
      expect(getClientDetailsSchema.title).toBe('Get Client Details');
      expect(getClientDetailsSchema.description).toBe('With a provided client ID, returns granular details about the client device');
      expect(getClientDetailsSchema.inputSchema.clientid).toBeDefined();
    });
  });

  describe('getClientDetailsHandler', () => {
    it('should return formatted client details on success', async () => {
      const mockClientId = 'client-123';
      const mockClientDetails = {
        id: 'client-123',
        name: 'Test Device',
        mac: '00:11:22:33:44:55',
        ip: '192.168.1.100',
        connected: true,
      };

      const { unifiLocalClient } = await import('../common/headers');
      vi.mocked(unifiLocalClient.get).mockResolvedValue({
        data: mockClientDetails,
      });

      const result = await getClientDetailsHandler({ clientid: mockClientId });

      expect(unifiLocalClient.get).toHaveBeenCalledWith(`mock-site-id/clients/${mockClientId}`);
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toBe(JSON.stringify(mockClientDetails, null, 2));
    });

    it('should throw error on network failure', async () => {
      const { unifiLocalClient } = await import('../common/headers');
      const mockError = new Error('Client not found');
      vi.mocked(unifiLocalClient.get).mockRejectedValue(mockError);

      await expect(getClientDetailsHandler({ clientid: 'invalid-id' })).rejects.toThrow('Network error: Client not found');
    });

    it('should handle special characters in client ID', async () => {
      const specialClientId = 'client-with-special@chars_123';
      const mockClientDetails = { id: specialClientId, name: 'Special Device' };

      const { unifiLocalClient } = await import('../common/headers');
      vi.mocked(unifiLocalClient.get).mockResolvedValue({
        data: mockClientDetails,
      });

      const result = await getClientDetailsHandler({ clientid: specialClientId });

      expect(unifiLocalClient.get).toHaveBeenCalledWith(`mock-site-id/clients/${specialClientId}`);
      expect(result.content[0].text).toBe(JSON.stringify(mockClientDetails, null, 2));
    });

    it('should handle empty client details response', async () => {
      const { unifiLocalClient } = await import('../common/headers');
      vi.mocked(unifiLocalClient.get).mockResolvedValue({
        data: null,
      });

      const result = await getClientDetailsHandler({ clientid: 'test-id' });

      expect(result.content[0].text).toBe('null');
    });
  });
});