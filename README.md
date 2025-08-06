# UniFi MCP Server

> [!IMPORTANT]
> This software is a personal project that I'm [releasing via the MIT License](https://github.com/sabler/mcp-unifi/blob/main/LICENSE). Furthermore, this project has no affiliation with Ubiquiti, Inc. UniFi, UniFi Dream Machine, and UniFi Site Manager are registered trademarks of Ubiquiti Inc.

> [!WARNING]
> This MCP server should be considered early beta. I don't plan on introducing any breaking changes, but please keep in mind that it may nonetheless twitch a little between updates. Tools will be added as the UniFi SM and Network APIs mature, but more realistically as often as time permits on my side.


## About This Project
This MCP server's intended use is to allow MCP-capable clients (e.g., Claude Desktop) to directly interact with UniFi Site Manager and UniFi Dream Machine and make the available telemetry usable in a conversational context. It has not been tested outside of this scope (but it's probably *fine*). 

This server provides the following tools:

- mcpGetClientDetails
- mcpGetClients
- mcpGetISPMetrics
- mcpGetDateAndTime
- mcpPing


Schema and decriptions for each tool are documented in their respective files. Test coverage is available for observation/validation purposes.

> [!TIP]
> A Dockerfile is provided and has been tested in [Podman](http://podman.io). This is the recommended approach to running the server.

## API Keys
Instructions for obtaining API keys are in the **sample.env** file. It's beyond the scope of this project to dictate how you manage these secrets. The JSON blob provided below is obviously the fastest way to get started, but you're encouraged to handle these keys in a way that is in accordance with your policies, or, more bluntly, in a way that doesn't keep you up at night.

## JSON configuration for your MCP client

    
    {
        "mcp-unifi": {
            "command": "<path/to/podman>",
            "args": [
                "run",
                "--rm",
                "-i",
                "--env-file",
                "<path/to/.env>",
                "mcp-unifi:latest"
            ]
        }
    }


## Statement on AI
This project was pair-programmed with Claude Code. Claude wrote the unit tests, Dockerfile, and assisted with answering the odd question I had about the inner-workings of the MCP SDK.
