export interface SingleClient {
  type: string;
  id: string;
  name: string;
  connectedAt: string;
  ipAddress: string;
  macAddress: string;
  uplinkDeviceId: string;
  access: {
    type: string;
  };
}

export interface AllClients {
  offset: number;
  limit: number;
  count: number;
  totalCount: number;
  data: SingleClient[];
}

export interface ISPWanMetrics {
  avgLatency: number;
  download_kbps: number;
  downtime: number;
  ispAsn: string;
  ispName: string;
  maxLatency: number;
  packetLoss: number;
  upload_kbps: number;
  uptime: number;
}

export interface ISPMetricsPeriod {
  data: {
    wan: ISPWanMetrics;
  };
  metricTime: string;
  version: string;
}

export interface ISPMetricsData {
  metricType: string;
  periods: ISPMetricsPeriod[];
}

export interface ISPMetricsResponse {
  data: ISPMetricsData[];
}

