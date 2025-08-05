# mcp-unifi

[!IMPORTANT]
This software is a personal project that I'm [releasing via the MIT License](https://github.com/sabler/mcp-unifi/blob/main/LICENSE). Furthermore, this project has no affiliation with Ubiquiti Networks. UniFi, Unifi Dream Machine, and UniFi Site Manager are registered trademarks of Ubiquiti Inc.

[!WARNING]
This MCP server should be considered early beta. I don't plan on introducing any breaking changes, but please keep in mind that it may nonetheless twitch a little between updates.


This is a tiny MCP server designed to allow MCP-capable clients (e.g., Claude Desktop) to directly interact with UniFi site manager and UniFi Dream Machine. It has the following tools:

- mcpGetClientDetails
- mcpGetClients
- mcpGetISPMetrics
- mcpGetDateAndTime
- mcpPing


Schema for each tool are documented in their respective files, and test coverage is available for observation/validation purposes.

[!TIP]
A Dockerfile is provided and has been tested in [Podman](http://podman.io). This is the recommended approach to running the server.

## JSON configuration for your MCP client

    ```json
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
    ```