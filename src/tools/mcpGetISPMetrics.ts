import { TextContent } from "@modelcontextprotocol/sdk/types";
import { ISPMetricsResponse } from "../types";
import { unifiRemoteClient } from "../common/headers";
import { z } from "zod";


// 5m minute intervals only available for 24h period
// 1h intervals only available for 7d or 30d period

const inputValidation = z.discriminatedUnion("timeFrame", [
  z.object({
    timeFrame: z.literal("5m"),
    duration: z.literal("24h"),
  }),
  z.object({
    timeFrame: z.literal("1h"),
    duration: z.enum(["7d", "30d"]),
  }),
]);

export const getISPMetricsSchema = {
  title: "Get ISP Metrics",
  description:
    "Get ISP connection health telemetry from the UniFi Dream Machine. Valid combinations: 5m intervals with 24h duration, or 1h intervals with 7d/30d duration",
  inputSchema: {
    timeFrame: z.enum(["5m", "1h"]),
    duration: z.enum(["24h", "7d", "30d"]),
  },
};

export const getISPMetricsHandler = async ({
  timeFrame,
  duration,
}: {
  timeFrame: string;
  duration: string;
}): Promise<{
  content: TextContent[];
}> => {
  // Validate input combinations
  const validationResult = inputValidation.safeParse({ timeFrame, duration });
  if (!validationResult.success) {
    throw new Error("Invalid combination: 5m intervals only available for 24h period, 1h intervals only available for 7d or 30d period");
  }

  const response = await unifiRemoteClient.get<ISPMetricsResponse>(`https://api.ui.com/ea/isp-metrics/${timeFrame}?duration=${duration}`);

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(response.data, null, 2),
      },
    ],
  };
};
