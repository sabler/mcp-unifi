import { z } from 'zod'

export const pingToolSchema = {
  title: "MCP Heartbeat",
  description: "Simple test to see if the server is active",
  inputSchema: { message: z.string() }
}

export const pingToolHandler = async ({ message }: { message: string }) => ({
  content: [{ 
    type: "text" as const, 
    text: `Pong: ${message}` 
  }]
})