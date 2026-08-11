import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createStoryMcpServer } from "./storyMcpServer";

async function runStdioServer() {
  const mcpServer = createStoryMcpServer();
  const transport = new StdioServerTransport();
  await mcpServer.connect(transport);
  console.error("[MCP] Story Architect MCP Server is running on stdio.");
}

runStdioServer().catch(err => {
  console.error("[MCP] Fatal error running stdio MCP server:", err);
  process.exit(1);
});
