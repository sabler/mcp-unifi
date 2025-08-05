import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCustomISPMetricsHandler, getCustomISPMetricsSchema } from '../tools/mcpGetCustomISPMetrics';

// Mock the unifiRemoteClient
vi.mock('../common/headers', () => ({
  unifiRemoteClient: {
    get: vi.fn(),
  },
  UNIFI_SITE_ID: 'mock-site-id',
}));

describe('mcpGetCustomISPMetrics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCustomISPMetricsSchema', () => {
    it('should have correct schema properties', () => {
      expect(getCustomISPMetricsSchema.title).toBe('[EXPERIMENTAL] Get ISP Metrics');
      expect(getCustomISPMetricsSchema.description).toContain('Get ISP connection health telemetry');
      expect(getCustomISPMetricsSchema.description).toContain('ISO 8601 format');
      expect(getCustomISPMetricsSchema.inputSchema.startDate).toBeDefined();
      expect(getCustomISPMetricsSchema.inputSchema.endDate).toBeDefined();
    });
  });

  describe('getCustomISPMetricsHandler', () => {
    it('should return ISP metrics for valid date range', async () => {
      const startDate = '2024-01-01T00:00:00.000Z';
      const endDate = '2024-01-02T00:00:00.000Z';
      const mockMetricsData = {
        metrics: [
          { timestamp: '2024-01-01T12:00:00Z', latency: 15, download: 95, upload: 45 },
        ],
      };

      const { unifiRemoteClient } = await import('../common/headers');
      vi.mocked(unifiRemoteClient.get).mockResolvedValue({
        data: mockMetricsData,
      });

      const result = await getCustomISPMetricsHandler({ startDate, endDate });

      expect(unifiRemoteClient.get).toHaveBeenCalledWith(
        `/isp-metrics/1h?beginTimestamp=${startDate}&endTimestamp=${endDate}`
      );
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toBe(JSON.stringify(mockMetricsData, null, 2));
    });

    it('should handle same start and end dates', async () => {
      const sameDate = '2024-01-01T12:00:00.000Z';
      const mockMetricsData = { metrics: [] };

      const { unifiRemoteClient } = await import('../common/headers');
      vi.mocked(unifiRemoteClient.get).mockResolvedValue({
        data: mockMetricsData,
      });

      const result = await getCustomISPMetricsHandler({ startDate: sameDate, endDate: sameDate });

      expect(unifiRemoteClient.get).toHaveBeenCalledWith(
        `/isp-metrics/1h?beginTimestamp=${sameDate}&endTimestamp=${sameDate}`
      );
      expect(result.content[0].text).toBe(JSON.stringify(mockMetricsData, null, 2));
    });

    it('should handle network errors', async () => {
      const { unifiRemoteClient } = await import('../common/headers');
      const mockError = new Error('Remote API unavailable');
      vi.mocked(unifiRemoteClient.get).mockRejectedValue(mockError);

      const startDate = '2024-01-01T00:00:00.000Z';
      const endDate = '2024-01-02T00:00:00.000Z';

      await expect(getCustomISPMetricsHandler({ startDate, endDate })).rejects.toThrow('Remote API unavailable');
    });

    it('should correctly encode dates in URL parameters', async () => {
      const startDate = '2024-01-01T00:00:00.000Z';
      const endDate = '2024-01-02T23:59:59.999Z';
      const mockMetricsData = { metrics: [] };

      const { unifiRemoteClient } = await import('../common/headers');
      vi.mocked(unifiRemoteClient.get).mockResolvedValue({
        data: mockMetricsData,
      });

      await getCustomISPMetricsHandler({ startDate, endDate });

      expect(unifiRemoteClient.get).toHaveBeenCalledWith(
        `/isp-metrics/1h?beginTimestamp=${startDate}&endTimestamp=${endDate}`
      );
    });

    it('should handle empty metrics response', async () => {
      const { unifiRemoteClient } = await import('../common/headers');
      vi.mocked(unifiRemoteClient.get).mockResolvedValue({
        data: null,
      });

      const startDate = '2024-01-01T00:00:00.000Z';
      const endDate = '2024-01-02T00:00:00.000Z';

      const result = await getCustomISPMetricsHandler({ startDate, endDate });

      expect(result.content[0].text).toBe('null');
    });
  });
});