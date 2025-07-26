import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'

const server = new McpServer({
    name: 'UniFi MCP Server (Local)',
    version: '1.0'
});

server.registerTool("add",
  {
    title: "Addition Tool",
    description: "Add two numbers",
    inputSchema: { a: z.number(), b: z.number() }
  },
  async ({ a, b }) => ({
    content: [{ type: "text", text: String(a + b) }]
  })
);




server.registerTool(
  "ping",
  {
    title: "MCP Heartbeat",
    description: "Simple test to see if the server is active",
    inputSchema: { message: z.string() } // Put the schema back
  },
  async ({ message }) => {  // Direct destructuring of expected params
    return {
      content: [{ 
        type: "text", 
        text: `Pong: ${message}` 
      }]
    };
  }
);

server.registerResource(
    "mcpHeartbeat",
    new ResourceTemplate("pulse://{string}", { 
    list: async () => {
      // Return an array of objects, each containing the parameter values
      return {
        resources: [
            {name:"ping", uri:"pulse://ping"}
        ]
      }
    }
  }),
    {
        "title":"Ping/Pong",
        "description":"General test of the server's connection"
    },

    async (uri, {string}) => ({
        contents: [{
                uri:uri.href,
                text:`${string}/pong!`
            }]
    })
);

const transport = new StdioServerTransport()
await server.connect(transport);