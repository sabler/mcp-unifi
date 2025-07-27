import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js'

export const heartbeatResourceTemplate = new ResourceTemplate("pulse://{string}", { 
  list: async () => {
    return {
      resources: [
        { name: "ping", uri: "pulse://ping" }
      ]
    }
  }
})

export const heartbeatResourceMeta = {
  title: "Ping/Pong",
  description: "General test of the server's connection"
}

export const heartbeatResourceHandler = async (uri: URL, variables: Record<string, string | string[]>) => ({
  contents: [{
    uri: uri.href,
    text: `${variables.string}/pong!`
  }]
})