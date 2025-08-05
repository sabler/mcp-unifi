import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getClientsHandler, getClientsSchema } from '../tools/mcpGetClients';

// Mock the unifiLocalClient
vi.mock('../common/headers', () => ({
  unifiLocalClient: {
    get: vi.fn(),
  },
  UNIFI_SITE_ID: 'mock-site-id',
}));

describe('mcpGetClients', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getClientsSchema', () => {
    it('should have correct schema properties', () => {
      expect(getClientsSchema.title).toBe('Get Connected Clients');
      expect(getClientsSchema.description).toBe('Get all clients currently connected to the network');
    });
  });

  describe('getClientsHandler', () => {
    it('should return formatted client data on success', async () => {
      const mockClientData = [
        { id: '1', name: 'Device 1', mac: '00:11:22:33:44:55' },
        { id: '2', name: 'Device 2', mac: '00:11:22:33:44:66' },
      ];

      const { unifiLocalClient } = await import('../common/headers');
      vi.mocked(unifiLocalClient.get).mockResolvedValue({
        data: mockClientData,
      });

      const result = await getClientsHandler();

      expect(unifiLocalClient.get).toHaveBeenCalledWith('mock-site-id/clients');
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toBe(JSON.stringify(mockClientData, null, 2));
    });

    it('should throw error on network failure', async () => {
      const { unifiLocalClient } = await import('../common/headers');
      const mockError = new Error('Network timeout');
      vi.mocked(unifiLocalClient.get).mockRejectedValue(mockError);

      await expect(getClientsHandler()).rejects.toThrow('Network error: Network timeout');
      expect(unifiLocalClient.get).toHaveBeenCalledWith('mock-site-id/clients');
    });

    it('should handle empty client list', async () => {
      const { unifiLocalClient } = await import('../common/headers');
      vi.mocked(unifiLocalClient.get).mockResolvedValue({
        data: [],
      });

      const result = await getClientsHandler();

      expect(result.content[0].text).toBe('[]');
    });
  });
});