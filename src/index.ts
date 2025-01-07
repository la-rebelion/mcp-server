#!/usr/bin/env node

import MCPServer from './MCPServer.js';

const myServer = new MCPServer('La Rebelion MCP Server', '1.0.0');

async function main() {
  console.log("Empty server, implement your tools.");
  console.log("Learn how to create tools: https://www.npmjs.com/package/@la-rebelion/mcp-server");
  // Register your tools, i.e.:
  // myServer.registerTool("echo", EchoTool);
  await myServer.run();
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});