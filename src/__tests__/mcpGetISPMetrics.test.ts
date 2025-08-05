import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getISPMetricsHandler, getISPMetricsSchema } from '../tools/mcpGetISPMetrics';

// Mock the unifiRemoteClient
vi.mock('../common/headers', () => ({
  unifiRemoteClient: {
    get: vi.fn(),
  },
  UNIFI_SITE_ID: 'mock-site-id',
}));

describe('mcpGetISPMetrics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getISPMetricsSchema', () => {
    it('should have correct schema properties', () => {
      expect(getISPMetricsSchema.title).toBe('[EXPERIMENTAL] Get ISP Metrics');
      expect(getISPMetricsSchema.description).toContain('Get ISP connection health telemetry');
      expect(getISPMetricsSchema.inputSchema.timeFrame).toBeDefined();
      expect(getISPMetricsSchema.inputSchema.duration).toBeDefined();
    });
  });

  describe('getISPMetricsHandler', () => {
    it('should return ISP metrics for valid 5m/24h combination', async () => {
      const mockMetricsData = {
        metrics: [
          { timestamp: '2024-01-01T00:00:00Z', latency: 10, download: 100, upload: 50 },
        ],
      };

      const { unifiRemoteClient } = await import('../common/headers');
      vi.mocked(unifiRemoteClient.get).mockResolvedValue({
        data: mockMetricsData,
      });

      const result = await getISPMetricsHandler({ timeFrame: '5m', duration: '24h' });

      expect(unifiRemoteClient.get).toHaveBeenCalledWith('https://api.ui.com/ea/isp-metrics/5m?duration=24h');
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toBe(JSON.stringify(mockMetricsData, null, 2));
    });

    it('should return ISP metrics for valid 1h/7d combination', async () => {
      const mockMetricsData = { metrics: [] };

      const { unifiRemoteClient } = await import('../common/headers');
      vi.mocked(unifiRemoteClient.get).mockResolvedValue({
        data: mockMetricsData,
      });

      const result = await getISPMetricsHandler({ timeFrame: '1h', duration: '7d' });

      expect(unifiRemoteClient.get).toHaveBeenCalledWith('https://api.ui.com/ea/isp-metrics/1h?duration=7d');
      expect(result.content[0].text).toBe(JSON.stringify(mockMetricsData, null, 2));
    });

    it('should return ISP metrics for valid 1h/30d combination', async () => {
      const mockMetricsData = { metrics: [] };

      const { unifiRemoteClient } = await import('../common/headers');
      vi.mocked(unifiRemoteClient.get).mockResolvedValue({
        data: mockMetricsData,
      });

      const result = await getISPMetricsHandler({ timeFrame: '1h', duration: '30d' });

      expect(unifiRemoteClient.get).toHaveBeenCalledWith('https://api.ui.com/ea/isp-metrics/1h?duration=30d');
    });

    it('should throw error for invalid 5m/7d combination', async () => {
      await expect(getISPMetricsHandler({ timeFrame: '5m', duration: '7d' })).rejects.toThrow(
        'Invalid combination: 5m intervals only available for 24h period, 1h intervals only available for 7d or 30d period'
      );
    });

    it('should throw error for invalid 5m/30d combination', async () => {
      await expect(getISPMetricsHandler({ timeFrame: '5m', duration: '30d' })).rejects.toThrow(
        'Invalid combination: 5m intervals only available for 24h period, 1h intervals only available for 7d or 30d period'
      );
    });

    it('should throw error for invalid 1h/24h combination', async () => {
      await expect(getISPMetricsHandler({ timeFrame: '1h', duration: '24h' })).rejects.toThrow(
        'Invalid combination: 5m intervals only available for 24h period, 1h intervals only available for 7d or 30d period'
      );
    });

    it('should handle network errors', async () => {
      const { unifiRemoteClient } = await import('../common/headers');
      const mockError = new Error('API timeout');
      vi.mocked(unifiRemoteClient.get).mockRejectedValue(mockError);

      await expect(getISPMetricsHandler({ timeFrame: '5m', duration: '24h' })).rejects.toThrow('API timeout');
    });
  });
});