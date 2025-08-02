import { TextContent } from "@modelcontextprotocol/sdk/types";
import { UNIFI_SITE_ID, unifiRemoteClient } from "../common/headers";
import { z } from "zod";

export const getCustomISPMetricsSchema = {
  title: "[EXPERIMENTAL] Get ISP Metrics",
  description:
    "Get ISP connection health telemetry from the UniFi Dream Machine. Provided dates must be in ISO 8601 format (e.g., 2020-01-01T06:15:00.000Z)",
  inputSchema: {
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
  },
};

export const getCustomISPMetricsHandler = async ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}): Promise<{
  content: TextContent[];
}> => {
  const response = await unifiRemoteClient.get(`/isp-metrics/1h?beginTimestamp=${startDate}&endTimestamp=${endDate}`);

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(response.data, null, 2),
      },
    ],
  };
};
