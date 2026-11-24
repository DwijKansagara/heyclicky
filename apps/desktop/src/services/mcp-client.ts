import { MCPServerConfig } from '@heyclicky/shared';

class MCPClientManager {
  private servers: MCPServerConfig[] = [
    {
      id: 'mcp_filesystem',
      name: 'Local Filesystem MCP',
      type: 'stdio',
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-filesystem', 'C:\\Users'],
      enabled: true,
    },
    {
      id: 'mcp_brave_search',
      name: 'Web Research MCP',
      type: 'stdio',
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-brave-search'],
      enabled: false,
    },
  ];

  public getServers(): MCPServerConfig[] {
    return [...this.servers];
  }

  public addServer(server: Omit<MCPServerConfig, 'id'>) {
    const newServer: MCPServerConfig = {
      ...server,
      id: `mcp_${Date.now()}`,
    };
    this.servers.push(newServer);
  }

  public toggleServer(id: string, enabled: boolean) {
    const s = this.servers.find((srv) => srv.id === id);
    if (s) {
      s.enabled = enabled;
    }
  }

  public removeServer(id: string) {
    this.servers = this.servers.filter((srv) => srv.id !== id);
  }
}

export const mcpClientManager = new MCPClientManager();
