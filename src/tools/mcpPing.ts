import { z } from "zod";
import { TextContent } from "@modelcontextprotocol/sdk/types";

export const pingToolSchema = {
  title: "MCP Heartbeat",
  description: "Simple test to see if the server is active",
  inputSchema: { message: z.string() },
};

export const pingToolHandler = async ({ message }: { message: string }):Promise<{content: TextContent[]}> => ({
  content: [
    {
      type: "text",
      text: `Pong: ${message}`,
    },
  ],
});
