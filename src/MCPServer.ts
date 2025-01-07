import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { Tool } from "./Tool.js";

class MCPServer {
  private tools: Map<string, Tool>;
  server: Server;

  constructor(name: string, version: string) {
    this.tools = new Map();
    this.server = new Server(
      {
        name: name,
        version: version,
      },
      {
        capabilities: {
          resources: {},
          tools: {},
          prompts: {},
        },
      }
    )
  }

  /**
   * Update the server with the registered tools and their schemas
   */
  private updateTools() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        // get the list of tools from the map and return them in array form
        tools: Array.from(this.tools.values()).map((tool) => tool.toolSchema)
      };
    });
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const tool = this.getTool(request.params.name);
      this.server.sendLoggingMessage({
        level: "info",
        data: `Executing tool ${tool.toolSchema.name}`,
      });

      return await tool.execute(request.params.arguments);
    });
  }
  registerTool(name: string, tool: Tool) {
    // const instance = new tool();
    // must be an instance that implements the Tool interface
    if (!(tool instanceof Tool)) {
      throw new Error(`Tool ${name} is not an instance of Tool, please extend Tool or review the class definition`);
    }
    this.tools.set(name, tool);
  }

  /**
   * Pull a tool from the registered tools
   * @param name The name of the tool to get from registered tools
   * @returns the tool instance
   */
  private getTool(name: string): Tool {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`Tool ${name} not found`);
    }
    return tool;
  }

  public async run() {
    this.updateTools();
    // Start the server using stdio transport.
    // This allows the server to communicate via standard input/output streams.
    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    // Cleanup on exit
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }
}
export default MCPServer;