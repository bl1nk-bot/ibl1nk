import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { type Express, type Request, type Response } from "express";
import { createStoryMcpServer } from "./storyMcpServer";

export function registerMcpHttpRoutes(app: Express) {
  let transport: SSEServerTransport | null = null;
  const mcpServer = createStoryMcpServer();

  // SSE endpoint for AI clients to connect
  app.get("/api/mcp/sse", async (req: Request, res: Response) => {
    console.log("[MCP] New SSE client connection established.");
    transport = new SSEServerTransport("/api/mcp/messages", res);
    await mcpServer.connect(transport);
  });

  // Message endpoint for AI clients to send tool call requests
  app.post("/api/mcp/messages", async (req: Request, res: Response) => {
    if (!transport) {
      res.status(400).json({ error: "No active SSE connection found." });
      return;
    }
    await transport.handlePostMessage(req, res);
  });

  // REST Discovery endpoint for MCP tools list & server info
  app.get("/api/mcp/info", (_req: Request, res: Response) => {
    res.json({
      name: "story-architect-mcp",
      version: "1.0.0",
      description:
        "Model Context Protocol Server for Human-First Novel & Story Studio",
      endpoints: {
        sse: "/api/mcp/sse",
        messages: "/api/mcp/messages",
        stdioScript: "server/mcp/cli.ts",
      },
      tools: [
        "list_stories",
        "get_story_structure",
        "get_chapter_scenes",
        "create_scene_beat",
        "list_character_cast",
        "get_character_dossier",
        "add_character_relationship",
        "log_writing_session",
      ],
    });
  });
}
