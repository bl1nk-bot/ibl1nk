import type {
  AgentDefinition,
  SecretAgentDefinition,
} from "../../shared/agent-types";
import baseDeepDefinition from "./definitions/base-deep";

export const IBL1NK_STORY_AGENTS: (AgentDefinition | SecretAgentDefinition)[] =
  [
    baseDeepDefinition,
    {
      id: "story-architect",
      version: "0.0.1",
      publisher: "ibl1nk",
      displayName: "Story Architect & Plot Master",
      description:
        "Designs overarching 3-act narrative structures, turning points, and major plot climaxes.",
      category: "plotting",
      model: "anthropic/claude-3.5-sonnet",
      reasoningOptions: {
        enabled: true,
        effort: "high",
      },
      mcpServers: {
        "story-studio": {
          url: "http://localhost:3000/api/mcp/sse",
          tools: [
            "list_stories",
            "get_story_structure",
            "get_chapter_scenes",
            "create_scene_beat",
          ],
        },
      },
      toolNames: [
        "story-studio/list_stories",
        "story-studio/get_story_structure",
        "story-studio/get_chapter_scenes",
        "story-studio/create_scene_beat",
      ],
      spawnableAgents: [
        "ibl1nk/character-psychologist@0.0.1",
        "ibl1nk/scene-pacing-expert@0.0.1",
      ],
      inputSchema: {
        prompt: {
          type: "string",
          description:
            "What story element or structural arc do you want to brainstorm or refine?",
        },
      },
      systemPrompt: `You are the Lead Story Architect for ibl1nk Story Studio.
Your role is to help the human writer build gripping narrative structures, ensuring strong cause-and-effect progression, escalating stakes, and satisfying thematic payoffs.`,
      instructionsPrompt: `1. Always respect the human writer's core premise and voice.
2. Query the writer's story structure using MCP tools when needed.
3. Propose high-stakes conflicts and clear midpoint reversals.
4. When suggesting new scene beats, use the 'story-studio/create_scene_beat' tool to save them into the writer's studio.`,
    },

    {
      id: "character-psychologist",
      version: "0.0.1",
      publisher: "ibl1nk",
      displayName: "Character Psychologist & Cast Dynamicist",
      description:
        "Deepens character misbeliefs, internal flaws, conflicting desires, and cast relationships.",
      category: "character",
      model: "anthropic/claude-3.5-sonnet",
      reasoningOptions: {
        enabled: true,
        effort: "high",
      },
      mcpServers: {
        "story-studio": {
          url: "http://localhost:3000/api/mcp/sse",
          tools: [
            "list_character_cast",
            "get_character_dossier",
            "add_character_relationship",
          ],
        },
      },
      toolNames: [
        "story-studio/list_character_cast",
        "story-studio/get_character_dossier",
        "story-studio/add_character_relationship",
      ],
      inputSchema: {
        prompt: {
          type: "string",
          description:
            "Specify which character or interpersonal conflict you want to analyze.",
        },
      },
      systemPrompt: `You are the Character Psychologist of ibl1nk Story Studio.
You focus on psychological realism, character motivations (The Lie vs The Truth), internal wounds (the Ghost), and dynamic tension between cast members.`,
      instructionsPrompt: `1. Read character profiles and existing relationships via MCP tools.
2. Contrast characters with opposing worldviews to generate natural dramatic friction.
3. Deepen the 5-stage transformation arc (Starting Flaw -> Inciting Call -> Midpoint Shift -> Climax Choice -> Growth).`,
    },

    {
      id: "scene-pacing-expert",
      version: "0.0.1",
      publisher: "ibl1nk",
      displayName: "Scene Pacing & Beats Specialist",
      description:
        "Breaks chapters into tight scene beats, sensory hooks, dialogue subtext, and cliffhangers.",
      category: "pacing",
      model: "google/gemini-2.5-pro",
      reasoningOptions: {
        enabled: true,
        effort: "medium",
      },
      mcpServers: {
        "story-studio": {
          url: "http://localhost:3000/api/mcp/sse",
          tools: ["get_chapter_scenes", "create_scene_beat"],
        },
      },
      toolNames: [
        "story-studio/get_chapter_scenes",
        "story-studio/create_scene_beat",
      ],
      inputSchema: {
        prompt: {
          type: "string",
          description:
            "Which chapter or scene needs pacing analysis or beat expansion?",
        },
      },
      systemPrompt: `You are the Scene Pacing Specialist in ibl1nk Story Studio.
Every scene must have a Goal, Conflict, and Disaster (or Reaction, Dilemma, and Decision). You eliminate filler scenes and ensure page-turning momentum.`,
      instructionsPrompt: `1. Inspect the target chapter scenes.
2. Identify slow pacing or lack of clear scene objectives.
3. Formulate vivid sensory details, sharp subtext, and strong scene closures.`,
    },

    {
      id: "worldbuilder-lorekeeper",
      version: "0.0.1",
      publisher: "ibl1nk",
      displayName: "Worldbuilder & Lorekeeper",
      description:
        "Constructs immersive world lore, magic/technology rules, factions, and cultural textures.",
      category: "worldbuilding",
      model: "openai/gpt-4o",
      reasoningOptions: {
        enabled: true,
        effort: "medium",
      },
      mcpServers: {
        "story-studio": {
          url: "http://localhost:3000/api/mcp/sse",
          tools: ["get_story_structure", "list_character_cast"],
        },
      },
      toolNames: [
        "story-studio/get_story_structure",
        "story-studio/list_character_cast",
      ],
      inputSchema: {
        prompt: {
          type: "string",
          description:
            "What setting, lore element, magic system, or faction do you want to flesh out?",
        },
      },
      systemPrompt: `You are the Worldbuilder & Lorekeeper in ibl1nk Story Studio.
You help creators invent consistent, lived-in worlds with believable history, socio-political tensions, and hard/soft rule systems that directly serve the plot.`,
    },

    {
      id: "editor-critique",
      version: "0.0.1",
      publisher: "ibl1nk",
      displayName: "Manuscript Editor & Plot-Hole Auditor",
      description:
        "Audits narrative logic, checks for unearned revelations, pacing dips, and plot inconsistencies.",
      category: "editing",
      model: "deepseek/deepseek-r1-0528",
      reasoningOptions: {
        enabled: true,
        effort: "high",
      },
      mcpServers: {
        "story-studio": {
          url: "http://localhost:3000/api/mcp/sse",
          tools: ["list_stories", "get_story_structure", "get_chapter_scenes"],
        },
      },
      toolNames: [
        "story-studio/list_stories",
        "story-studio/get_story_structure",
        "story-studio/get_chapter_scenes",
      ],
      inputSchema: {
        prompt: {
          type: "string",
          description:
            "Submit a chapter, synopsis, or storyline for rigorous developmental critique.",
        },
      },
      systemPrompt: `You are the Lead Developmental Editor for ibl1nk Story Studio.
You provide honest, constructive, and uncompromising analysis on story tension, plot coherence, character consistency, and pacing balance.`,
    },

    {
      id: "session-writing-coach",
      version: "0.0.1",
      publisher: "ibl1nk",
      displayName: "Sprint Writing Coach",
      description:
        "Keeps the human writer motivated, tracks word milestones, and logs daily writing progress.",
      category: "general",
      model: "google/gemini-2.5-flash",
      mcpServers: {
        "story-studio": {
          url: "http://localhost:3000/api/mcp/sse",
          tools: ["log_writing_session", "get_story_structure"],
        },
      },
      toolNames: [
        "story-studio/log_writing_session",
        "story-studio/get_story_structure",
      ],
      inputSchema: {
        prompt: {
          type: "string",
          description:
            "Report words written or ask for a sprint writing boost.",
        },
      },
      systemPrompt: `You are the Sprint Writing Coach in ibl1nk Story Studio.
Your mission is to keep the writer drafting without second-guessing, record their daily progress, and maintain their writing streak.`,
    },
  ];
