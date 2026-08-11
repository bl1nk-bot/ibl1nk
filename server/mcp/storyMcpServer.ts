/**
 * ============================================================================
 * Model Context Protocol (MCP) Server for Human-First Story Studio
 * ============================================================================
 *
 * 🔄 Data Flow Pathway:
 * 1. AI Connection: External AI clients (Claude Desktop / Cursor / Antigravity)
 *    connect via stdio (server/mcp/cli.ts) or Server-Sent Events (/api/mcp/sse)
 * 2. Protocol Handshake: @modelcontextprotocol/sdk initializes tools & resources
 * 3. Tool Invocations: External LLM requests story context (list_stories, get_chapter_scenes, etc.)
 * 4. Safe Execution: MCP tools execute queries/mutations against server/db.ts directly
 * 5. Context Response: Structured JSON responses returned to LLM for context-aware collaboration
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  getUserOutlines,
  getOutlineById,
  getChaptersByOutlineId,
  getScenesByChapterId,
  createScene,
  getCharactersByUserId,
  getCharacterByIdForUser,
  getCharacterRelationships,
  createCharacterRelationship,
  createWritingProgress,
} from "../db";

const DEFAULT_WRITER_USER_ID = 1;

export function createStoryMcpServer() {
  const server = new McpServer({
    name: "story-architect-mcp",
    version: "1.0.0",
  });

  // ── Tool 1: List Writer's Stories / Outlines ──────────────────
  server.tool(
    "list_stories",
    "List all stories, novels, and outlines created by the human writer in their studio",
    {},
    async () => {
      const outlines = await getUserOutlines(DEFAULT_WRITER_USER_ID);
      const formatted = outlines.map(o => ({
        id: o.id,
        title: o.title,
        status: o.status,
        description: o.description,
        wordCount: o.wordCount,
      }));
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(formatted, null, 2),
          },
        ],
      };
    }
  );

  // ── Tool 2: Get Story Structure & Chapters ───────────────────
  server.tool(
    "get_story_structure",
    "Get full structural breakdown of a story including chapters, summaries, and notes",
    {
      storyId: z.number().describe("The ID of the story outline"),
    },
    async ({ storyId }) => {
      const [story, chapters] = await Promise.all([
        getOutlineById(storyId),
        getChaptersByOutlineId(storyId),
      ]);

      if (!story) {
        return {
          isError: true,
          content: [
            { type: "text", text: `Story with ID ${storyId} not found.` },
          ],
        };
      }

      const result = {
        story: {
          id: story.id,
          title: story.title,
          description: story.description,
          status: story.status,
          wordCount: story.wordCount,
        },
        chapters: chapters.map(c => ({
          id: c.id,
          chapterNumber: c.chapterNumber,
          title: c.title,
          description: c.description,
          status: c.status,
        })),
      };

      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ── Tool 3: Get Chapter Scenes & Beats ────────────────────────
  server.tool(
    "get_chapter_scenes",
    "Get all scenes, narrative beats, and pacing notes for a specific chapter",
    {
      chapterId: z.number().describe("The ID of the chapter"),
    },
    async ({ chapterId }) => {
      const scenes = await getScenesByChapterId(chapterId);
      const formatted = scenes.map(s => ({
        id: s.id,
        sceneNumber: s.sceneNumber,
        title: s.title,
        description: s.description,
        status: s.status,
        wordCount: s.wordCount,
      }));

      return {
        content: [{ type: "text", text: JSON.stringify(formatted, null, 2) }],
      };
    }
  );

  // ── Tool 4: Create Scene Beat ─────────────────────────────────
  server.tool(
    "create_scene_beat",
    "Insert a new scene beat or milestone into the human writer's chapter outline",
    {
      chapterId: z
        .number()
        .describe("The ID of the chapter to add the scene to"),
      title: z.string().describe("Title or headline of the scene"),
      description: z
        .string()
        .describe("Narrative description, conflict, and key revelations"),
      targetWordCount: z
        .number()
        .optional()
        .default(1500)
        .describe("Target word count for this scene"),
      status: z
        .enum(["planning", "writing", "completed"])
        .optional()
        .default("planning"),
    },
    async ({ chapterId, title, description, targetWordCount, status }) => {
      const existing = await getScenesByChapterId(chapterId);
      const newSceneNumber = existing.length + 1;

      const res = await createScene({
        chapterId,
        title,
        description,
        sceneNumber: newSceneNumber,
        status,
        wordCount: targetWordCount,
        order: newSceneNumber,
      });

      return {
        content: [
          {
            type: "text",
            text: `Successfully added Scene ${newSceneNumber}: "${title}" to Chapter #${chapterId}. Insert ID: ${res[0]?.insertId}`,
          },
        ],
      };
    }
  );

  // ── Tool 5: List Character Cast ───────────────────────────────
  server.tool(
    "list_character_cast",
    "Get the full cast of characters created by the writer with their roles and traits",
    {},
    async () => {
      const characters = await getCharactersByUserId(DEFAULT_WRITER_USER_ID);
      const formatted = characters.map(c => ({
        id: c.id,
        name: c.name,
        role: c.role,
        traits: c.traits,
        description: c.description,
      }));

      return {
        content: [{ type: "text", text: JSON.stringify(formatted, null, 2) }],
      };
    }
  );

  // ── Tool 6: Get Character Dossier & Relationships ─────────────
  server.tool(
    "get_character_dossier",
    "Get in-depth psychological profile, personality traits, and interpersonal relationships of a character",
    {
      characterId: z.number().describe("The ID of the character"),
    },
    async ({ characterId }) => {
      const [character, relationships, allCharacters] = await Promise.all([
        getCharacterByIdForUser(characterId, DEFAULT_WRITER_USER_ID),
        getCharacterRelationships(characterId),
        getCharactersByUserId(DEFAULT_WRITER_USER_ID),
      ]);

      if (!character) {
        return {
          isError: true,
          content: [
            { type: "text", text: `Character #${characterId} not found.` },
          ],
        };
      }

      const mappedRelationships = relationships.map(r => {
        const otherId =
          r.character1Id === characterId ? r.character2Id : r.character1Id;
        const other = allCharacters.find(c => c.id === otherId);
        return {
          relationshipId: r.id,
          targetCharacter: other?.name || `Character #${otherId}`,
          type: r.relationshipType,
          description: r.description,
        };
      });

      const dossier = {
        id: character.id,
        name: character.name,
        role: character.role,
        traits: character.traits,
        backstory: character.description,
        relationships: mappedRelationships,
      };

      return {
        content: [{ type: "text", text: JSON.stringify(dossier, null, 2) }],
      };
    }
  );

  // ── Tool 7: Add Character Dynamic / Relationship ──────────────
  server.tool(
    "add_character_relationship",
    "Define a relational dynamic (ally, rival, mentor, enemy, family, love_interest) between two characters",
    {
      character1Id: z.number().describe("Source character ID"),
      character2Id: z.number().describe("Target character ID"),
      relationshipType: z.enum([
        "ally",
        "rival",
        "mentor",
        "enemy",
        "family",
        "love_interest",
      ]),
      description: z
        .string()
        .optional()
        .describe("Description of their dynamic and history"),
    },
    async ({ character1Id, character2Id, relationshipType, description }) => {
      const res = await createCharacterRelationship({
        character1Id,
        character2Id,
        relationshipType,
        description,
      });

      return {
        content: [
          {
            type: "text",
            text: `Successfully linked Character #${character1Id} and Character #${character2Id} as "${relationshipType}". Relationship ID: ${res[0]?.insertId}`,
          },
        ],
      };
    }
  );

  // ── Tool 8: Log Writing Session Progress ──────────────────────
  server.tool(
    "log_writing_session",
    "Record words written during the AI session so the human writer's dashboard progress is updated",
    {
      wordsWritten: z
        .number()
        .min(0)
        .describe("Number of words drafted in this session"),
      notes: z
        .string()
        .optional()
        .describe("Summary of what was written or achieved"),
      storyId: z.number().optional().describe("Optional Story Outline ID"),
    },
    async ({ wordsWritten, notes, storyId }) => {
      const today = new Date().toISOString().split("T")[0];
      const res = await createWritingProgress({
        userId: DEFAULT_WRITER_USER_ID,
        outlineId: storyId,
        wordsWritten,
        sessionsCompleted: 1,
        notes,
        date: today,
      });

      return {
        content: [
          {
            type: "text",
            text: `Logged ${wordsWritten} words for ${today}. Dashboard stats updated!`,
          },
        ],
      };
    }
  );

  return server;
}
