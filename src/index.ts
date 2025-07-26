import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'

const server = new McpServer({
    name: 'UniFi MCP Server (Local)',
    version: '1.0'
});


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