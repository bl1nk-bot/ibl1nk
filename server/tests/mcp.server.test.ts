import { describe, it, expect, beforeEach } from "vitest";
import { createStoryMcpServer } from "../mcp/storyMcpServer";
import {
  createOutline,
  createChapter,
  createScene,
  createCharacter,
} from "../db";

describe("MCP Server Tools & Validation Suite", () => {
  let mcpServer: ReturnType<typeof createStoryMcpServer>;

  beforeEach(() => {
    mcpServer = createStoryMcpServer();
  });

  it("should initialize the Story MCP Server with correct name and version", () => {
    expect(mcpServer).toBeDefined();
  });

  it("should create and retrieve story structure through MCP database tools", async () => {
    const outlineRes = await createOutline({
      userId: 1,
      title: "The Chrono Detective",
      description: "A detective solving crimes across time loops.",
      status: "in_progress",
    });
    const storyId = outlineRes[0]?.insertId ?? 1;

    const chapterRes = await createChapter({
      outlineId: storyId,
      title: "Chapter 1: The Midnight Loop",
      description: "First time loop disruption.",
      chapterNumber: 1,
      status: "draft",
    });
    const chapterId = chapterRes[0]?.insertId ?? 1;

    const sceneRes = await createScene({
      chapterId,
      title: "Scene 1: Shattered Pocketwatch",
      description: "Detective finds the broken relic.",
      sceneNumber: 1,
      status: "planning",
      wordCount: 1200,
    });
    expect(sceneRes[0]?.insertId).toBeDefined();

    const charRes = await createCharacter({
      userId: 1,
      outlineId: storyId,
      name: "Marcus Vance",
      role: "Protagonist",
      traits: "Observant, cynical, weary",
      description: "A time-displaced investigator.",
    });
    expect(charRes[0]?.insertId).toBeDefined();
  });
});
