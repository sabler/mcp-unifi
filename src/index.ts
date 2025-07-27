import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { getClientsSchema, getClientsHandler } from './tools/mcpGetClients.js'
import { getClientDetailsSchema, getClientDetailsHandler } from './tools/mcpGetClientDetails.js'
import { getDateAndTimeSchema, getDateAndTimeHandler } from './tools/mcpGetDateAndTime.js'
import { pingToolSchema, pingToolHandler } from './tools/mcpPing.js'

const server = new McpServer({
    name: 'UniFi MCP Server (Local)',
    version: '1.0'
});



server.registerTool("getClients", getClientsSchema, getClientsHandler)
server.registerTool("getClientDetails", getClientDetailsSchema, getClientDetailsHandler)
server.registerTool("ping", pingToolSchema, pingToolHandler);
server.registerTool("getDateAndTime", getDateAndTimeSchema, getDateAndTimeHandler)

const transport = new StdioServerTransport()
await server.connect(transport);