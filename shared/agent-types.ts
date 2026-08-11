// ============================================================================
// ibl1nk Agent System Specification & Schema Definitions
// ============================================================================

import type {
  Message,
  ToolResultOutput,
  JsonObjectSchema,
  MCPConfig,
  Logger,
  JSONValue,
  JSONObject,
  JSONArray,
  JsonSchema,
  DataContent,
  ProviderMetadata,
  TextPart,
  ImagePart,
  FilePart,
  ReasoningPart,
  ToolCallPart,
  AuxiliaryMessageData,
  SystemMessage,
  UserMessage,
  AssistantMessage,
  ToolMessage,
} from "./util-types";

export type {
  Message,
  ToolResultOutput,
  JsonObjectSchema,
  MCPConfig,
  Logger,
  JSONValue,
  JSONObject,
  JSONArray,
  JsonSchema,
  DataContent,
  ProviderMetadata,
  TextPart,
  ImagePart,
  FilePart,
  ReasoningPart,
  ToolCallPart,
  AuxiliaryMessageData,
  SystemMessage,
  UserMessage,
  AssistantMessage,
  ToolMessage,
};
export * from "./util-types";

export interface AgentDefinition {
  /** Unique identifier for this agent. Must contain only lowercase letters, numbers, and hyphens, e.g. 'story-architect' */
  id: string;

  /** Version string (if not provided, will default to '0.0.1' and be bumped on each publish) */
  version?: string;

  /** Publisher ID for the agent (defaults to 'ibl1nk') */
  publisher?: string;

  /** Human-readable name for the agent */
  displayName: string;

  /** Description of what this agent excels at */
  description?: string;

  /** Category tag (e.g. 'plotting', 'character', 'pacing', 'worldbuilding', 'editing') */
  category?:
    | "plotting"
    | "character"
    | "pacing"
    | "worldbuilding"
    | "editing"
    | "general";

  /** AI model to use for this agent. Can be any model in OpenRouter: https://openrouter.ai/models */
  model: ModelName;

  /**
   * https://openrouter.ai/docs/use-cases/reasoning-tokens
   * One of `max_tokens` or `effort` is required.
   * If `exclude` is true, reasoning will be removed from the response. Default is false.
   */
  reasoningOptions?: {
    enabled?: boolean;
    exclude?: boolean;
  } & (
    | {
        max_tokens: number;
      }
    | {
        effort: "high" | "medium" | "low" | "minimal" | "none";
      }
  );

  /**
   * Provider routing options for OpenRouter.
   * Controls which providers to use and fallback behavior.
   * See https://openrouter.ai/docs/features/provider-routing
   */
  providerOptions?: {
    /** List of provider slugs to try in order (e.g. ["anthropic", "openai"]) */
    order?: string[];
    /** Whether to allow backup providers when primary is unavailable (default: true) */
    allow_fallbacks?: boolean;
    /** Only use providers that support all parameters in your request (default: false) */
    require_parameters?: boolean;
    /** Control whether to use providers that may store data */
    data_collection?: "allow" | "deny";
    /** List of provider slugs to allow for this request */
    only?: string[];
    /** List of provider slugs to skip for this request */
    ignore?: string[];
    /** List of quantization levels to filter by (e.g. ["int4", "int8"]) */
    quantizations?: Array<
      | "int4"
      | "int8"
      | "fp4"
      | "fp6"
      | "fp8"
      | "fp16"
      | "bf16"
      | "fp32"
      | "unknown"
    >;
    /** Sort providers by price, throughput, or latency */
    sort?: "price" | "throughput" | "latency";
    /** Maximum pricing you want to pay for this request */
    max_price?: {
      prompt?: number | string;
      completion?: number | string;
      image?: number | string;
      audio?: number | string;
      request?: number | string;
    };
  };

  // ============================================================================
  // Tools and Subagents
  // ============================================================================

  /** MCP servers by name. Names cannot contain `/`. */
  mcpServers?: Record<string, MCPConfig>;

  /**
   * Tools this agent can use.
   *
   * By default, all tools are available from any specified MCP server. In
   * order to limit the tools from a specific MCP server, add the tool name(s)
   * in the format `'mcpServerName/toolName1'`, `'mcpServerName/toolName2'`,
   * etc.
   */
  toolNames?: (AllToolNames | (string & {}))[];

  /** Other agents this agent can spawn, like 'ibl1nk/character-psychologist@0.0.1'.
   *
   * Use the fully qualified agent id from the agent store, including publisher and version: 'ibl1nk/character-psychologist@0.0.1'
   * (publisher and version are required!)
   *
   * Or, use the agent id from a local agent file in your .agents directory: 'character-psychologist'.
   */
  spawnableAgents?: string[];

  // ============================================================================
  // Input and Output
  // ============================================================================

  /** The input schema required to spawn the agent. Provide a prompt string and/or a params object or none. */
  inputSchema?: {
    prompt?: { type: "string"; description?: string };
    params?: JsonObjectSchema;
  };

  /** How the agent should output a response to its parent (defaults to 'last_message') */
  outputMode?: "last_message" | "all_messages" | "structured_output";

  /** JSON schema for structured output (when outputMode is 'structured_output') */
  outputSchema?: JsonObjectSchema;

  // ============================================================================
  // Prompts
  // ============================================================================

  /** Prompt for when and why to spawn this agent. Include the main purpose and use cases. */
  spawnerPrompt?: string;

  /** Whether to include conversation history from the parent agent in context. (Defaults to false). */
  includeMessageHistory?: boolean;

  /** Whether to inherit the parent agent's system prompt instead of using this agent's own systemPrompt. */
  inheritParentSystemPrompt?: boolean;

  /** Opt in to windowed file reads. */
  windowedFileReads?: boolean;

  /** Opt in to mechanical context compaction. */
  compactContext?:
    | boolean
    | {
        cacheExpiryMs?: number | null;
        cacheExpiryMinTokens?: number | null;
      };

  /** Background information for the agent. Fairly optional. Prefer using instructionsPrompt for agent instructions. */
  systemPrompt?: string;

  /** Instructions for the agent.
   *
   * IMPORTANT: Updating this prompt is the best way to shape the agent's behavior.
   * This prompt is inserted after each user input. */
  instructionsPrompt?: string;

  /** Prompt inserted at each agent step. */
  stepPrompt?: string;

  // ============================================================================
  // Handle Steps
  // ============================================================================

  /** Programmatically step the agent forward and run tools. */
  handleSteps?: (context: AgentStepContext) => Generator<
    ToolCall | "STEP" | "STEP_ALL" | StepText | GenerateN,
    void,
    {
      agentState: AgentState;
      toolResult: ToolResultOutput[] | undefined;
      stepsComplete: boolean;
      nResponses?: string[];
    }
  >;
}

// ============================================================================
// Secret Agent & Meta Tools Definition
// ============================================================================

export type ComposioMetaToolName =
  "composio_search" | "composio_execute" | "composio_auth" | (string & {});

export type AllToolNames =
  | ToolName
  | "add_subgoal"
  | "browser_logs"
  | "create_plan"
  | "spawn_agent_inline"
  | "update_subgoal"
  | ComposioMetaToolName;

export interface SecretAgentDefinition extends Omit<
  AgentDefinition,
  "toolNames"
> {
  /** Tools this agent can use. */
  toolNames?: AllToolNames[];
}

// ============================================================================
// Placeholders (ibl1nk prompt template substitution)
// ============================================================================

const placeholderNames = [
  "AGENT_NAME",
  "AGENTS_PROMPT",
  "CURRENT_DATE",
  "FILE_TREE_PROMPT_SMALL",
  "FILE_TREE_PROMPT",
  "FILE_TREE_PROMPT_LARGE",
  "GIT_CHANGES_PROMPT",
  "INITIAL_AGENT_PROMPT",
  "KNOWLEDGE_FILES_CONTENTS",
  "PROJECT_ROOT",
  "REMAINING_STEPS",
  "SYSTEM_INFO_PROMPT",
  "TOOLS_PROMPT",
  "USER_CWD",
  "USER_INPUT_PROMPT",
] as const;

type PlaceholderType<T extends readonly string[]> = {
  [K in T[number]]: `{IBL1NK_${K}}`;
};

export const PLACEHOLDER = Object.fromEntries(
  placeholderNames.map(name => [name, `{IBL1NK_${name}}` as const])
) as PlaceholderType<typeof placeholderNames>;

export type PlaceholderValue = (typeof PLACEHOLDER)[keyof typeof PLACEHOLDER];
export const placeholderValues = Object.values(PLACEHOLDER);

// ============================================================================
// Agent Template Types
// ============================================================================

export const AgentTemplateTypeList = [
  // Base agents
  "base",
  "base_lite",
  "base_max",
  "base_experimental",
  "claude4_gemini_thinking",
  "superagent",
  "base_agent_builder",

  // Ask mode
  "ask",

  // Planning / Thinking
  "dry_run",
  "thinker",

  // Story & Writing Agents
  "story_architect",
  "character_psychologist",
  "scene_pacing_expert",
  "worldbuilder",
  "editor_critique",

  // Other agents
  "file_picker",
  "file_explorer",
  "researcher",
  "reviewer",
  "agent_builder",
  "example_programmatic",
] as const;

type UnderscoreToDash<S extends string> = S extends `${infer L}_${infer R}`
  ? `${L}-${UnderscoreToDash<R>}`
  : S;

export const AgentTemplateTypes = Object.fromEntries(
  AgentTemplateTypeList.map(name => [name, name.replaceAll("_", "-")])
) as { [K in (typeof AgentTemplateTypeList)[number]]: UnderscoreToDash<K> };

export type AgentTemplateType =
  (typeof AgentTemplateTypeList)[number] | (string & {});

// ============================================================================
// Supporting Types
// ============================================================================

export interface AgentState {
  agentId: string;
  runId: string;
  parentId: string | undefined;

  /** The agent's conversation history: messages from the user and the assistant. */
  messageHistory: Message[];

  /** The last value set by the set_output tool. This is a plain object or undefined if not set. */
  output: Record<string, any> | undefined;

  /** The system prompt for this agent. */
  systemPrompt: string;

  /** The tool definitions for this agent. */
  toolDefinitions: Record<
    string,
    { description: string | undefined; inputSchema: {} }
  >;

  /** Token count */
  contextTokenCount: number;
}

/** Context provided to handleSteps generator function */
export interface AgentStepContext {
  agentState: AgentState;
  prompt?: string;
  params?: Record<string, any>;
  model?: string;
  logger: Logger;
}

export type StepText = { type: "STEP_TEXT"; text: string };
export type GenerateN = { type: "GENERATE_N"; n: number };

import type {
  ToolName,
  GetToolParams,
  ToolParamsMap,
  StoryMcpTools,
} from "./tools";

export type { ToolName, GetToolParams, ToolParamsMap, StoryMcpTools };
export * from "./tools";

export type ToolCall<T extends ToolName = ToolName> = {
  [K in T]: {
    toolName: K;
    input: GetToolParams<K>;
    includeToolCall?: boolean;
  };
}[T];

// ============================================================================
// Available Models
// ============================================================================

export type ModelName =
  // OpenAI
  | "openai/gpt-5.3"
  | "openai/gpt-5.3-codex"
  | "openai/gpt-5.2"
  | "openai/gpt-5.1"
  | "openai/gpt-5.1-chat"
  | "openai/gpt-5-mini"
  | "openai/gpt-5-nano"
  | "openai/gpt-4o"
  | "openai/gpt-4o-mini"

  // Anthropic
  | "anthropic/claude-fable-5"
  | "anthropic/claude-opus-5"
  | "anthropic/claude-sonnet-4.6"
  | "anthropic/claude-opus-4.8"
  | "anthropic/claude-opus-4.7"
  | "anthropic/claude-opus-4.6"
  | "anthropic/claude-opus-4.5"
  | "anthropic/claude-haiku-4.5"
  | "anthropic/claude-sonnet-4.5"
  | "anthropic/claude-3.5-sonnet"
  | "anthropic/claude-3.5-haiku"

  // Google Gemini
  | "google/gemini-3.1-pro-preview"
  | "google/gemini-3-pro-preview"
  | "google/gemini-3-flash-preview"
  | "google/gemini-3.5-flash-lite"
  | "google/gemini-3.1-flash-lite"
  | "google/gemini-2.5-pro"
  | "google/gemini-2.5-flash"
  | "google/gemini-2.5-flash-lite"
  | "google/gemini-2.0-flash"

  // X-AI
  | "x-ai/grok-4-fast"
  | "x-ai/grok-4.1-fast"
  | "x-ai/grok-code-fast-1"

  // Qwen
  | "qwen/qwen3-max"
  | "qwen/qwen3-coder-plus"
  | "qwen/qwen3-coder"
  | "qwen/qwen3-coder:nitro"
  | "qwen/qwen3-coder-flash"

  // DeepSeek
  | "deepseek/deepseek-v4-pro"
  | "deepseek/deepseek-v4-flash"
  | "deepseek/deepseek-chat-v3-0324"
  | "deepseek/deepseek-r1-0528"

  // Xiaomi MiMo
  | "mimo/mimo-v2.5"
  | "mimo/mimo-v2.5-pro"

  // Other models
  | "moonshotai/kimi-k2.7-code"
  | "z-ai/glm-5.1"
  | "minimax/minimax-m3"
  | (string & {});
