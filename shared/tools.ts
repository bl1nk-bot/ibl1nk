/**
 * Union type of all available tool names in ibl1nk Agent System
 */
export type ToolName =
  | "add_message"
  | "apply_patch"
  | "ask_user"
  | "code_search"
  | "end_turn"
  | "find_files"
  | "glob"
  | "gravity_index"
  | "list_directory"
  | "lookup_agent_info"
  | "propose_str_replace"
  | "propose_write_file"
  | "read_docs"
  | "read_files"
  | "read_subtree"
  | "read_url"
  | "render_ui"
  | "run_file_change_hooks"
  | "run_terminal_command"
  | "set_messages"
  | "set_output"
  | "skill"
  | "spawn_agents"
  | "str_replace"
  | "suggest_followups"
  | "task_completed"
  | "think_deeply"
  | "web_search"
  | "write_file"
  | "write_todos"
  | StoryMcpTools;

/**
 * MCP Story Studio Tool Names
 */
export type StoryMcpTools =
  | "story-studio/list_stories"
  | "story-studio/get_story_structure"
  | "story-studio/get_chapter_scenes"
  | "story-studio/create_scene_beat"
  | "story-studio/list_character_cast"
  | "story-studio/get_character_dossier"
  | "story-studio/add_character_relationship"
  | "story-studio/log_writing_session";

/**
 * Map of tool names to their parameter types
 */
export interface ToolParamsMap {
  add_message: AddMessageParams;
  apply_patch: ApplyPatchParams;
  ask_user: AskUserParams;
  code_search: CodeSearchParams;
  end_turn: EndTurnParams;
  find_files: FindFilesParams;
  glob: GlobParams;
  gravity_index: GravityIndexParams;
  list_directory: ListDirectoryParams;
  lookup_agent_info: LookupAgentInfoParams;
  propose_str_replace: ProposeStrReplaceParams;
  propose_write_file: ProposeWriteFileParams;
  read_docs: ReadDocsParams;
  read_files: ReadFilesParams;
  read_subtree: ReadSubtreeParams;
  read_url: ReadUrlParams;
  render_ui: RenderUiParams;
  run_file_change_hooks: RunFileChangeHooksParams;
  run_terminal_command: RunTerminalCommandParams;
  set_messages: SetMessagesParams;
  set_output: SetOutputParams;
  skill: SkillParams;
  spawn_agents: SpawnAgentsParams;
  str_replace: StrReplaceParams;
  suggest_followups: SuggestFollowupsParams;
  task_completed: TaskCompletedParams;
  think_deeply: ThinkDeeplyParams;
  web_search: WebSearchParams;
  write_file: WriteFileParams;
  write_todos: WriteTodosParams;
  "story-studio/list_stories": Record<string, any>;
  "story-studio/get_story_structure": { storyId: number };
  "story-studio/get_chapter_scenes": { chapterId: number };
  "story-studio/create_scene_beat": {
    chapterId: number;
    title: string;
    description: string;
    targetWordCount?: number;
    status?: "planning" | "writing" | "completed";
  };
  "story-studio/list_character_cast": Record<string, any>;
  "story-studio/get_character_dossier": { characterId: number };
  "story-studio/add_character_relationship": {
    character1Id: number;
    character2Id: number;
    relationshipType: string;
    description?: string;
  };
  "story-studio/log_writing_session": {
    wordsWritten: number;
    notes?: string;
    storyId?: number;
  };
}

/**
 * Add a new message to the conversation history. To be used for complex requests that can't be solved in a single step.
 */
export interface AddMessageParams {
  role: "user" | "assistant";
  content: string;
}

/**
 * Apply a file operation (create, update, or delete) using Codex-style apply_patch format.
 */
export interface ApplyPatchParams {
  /** The file operation to perform. */
  operation: {
    /** Operation type: create_file, update_file, or delete_file */
    type: "create_file" | "update_file" | "delete_file";
    /** File path relative to project root */
    path: string;
    /** Diff content. Required for create_file and update_file. Lines prefixed with + for creates, unified diff with @@ hunks for updates. */
    diff?: string;
  };
}

/**
 * Ask the user multiple choice questions and pause execution until they respond.
 */
export interface AskUserParams {
  /** List of multiple choice questions to ask the user */
  questions: {
    /** The question to ask the user */
    question: string;
    /** Short label (max 12 chars) displayed as a chip/tag */
    header?: string;
    /** Array of answer options with label and optional description (minimum 2) */
    options: {
      /** The display text for this option */
      label: string;
      /** Explanation shown when option is focused */
      description?: string;
    }[];
    /** If true, allows selecting multiple options (checkbox). If false, single selection only (radio). */
    multiSelect?: boolean;
    /** Validation rules for "Other" text input */
    validation?: {
      /** Maximum length for "Other" text input */
      maxLength?: number;
      /** Minimum length for "Other" text input */
      minLength?: number;
      /** Regex pattern for "Other" text input */
      pattern?: string;
      /** Custom error message when pattern fails */
      patternError?: string;
    };
  }[];
}

/**
 * Search for string patterns in the project's files using ripgrep (rg).
 */
export interface CodeSearchParams {
  /** The pattern to search for. */
  pattern: string;
  /** Optional ripgrep flags to customize the search. */
  flags?: string;
  /** Optional working directory to search within, relative to the project root. */
  cwd?: string;
  /** Maximum number of results to return per file. */
  maxResults?: number;
}

/**
 * End your turn, regardless of any new tool results that might be coming.
 */
export interface EndTurnParams {}

/**
 * Find several files related to a brief natural language description of the files or the name of a function or class.
 */
export interface FindFilesParams {
  /** Natural language description of the files or symbols to find. */
  prompt: string;
}

/**
 * Search for files matching a glob pattern sorted by modification time.
 */
export interface GlobParams {
  /** Glob pattern to match files against. */
  pattern: string;
  /** Optional working directory to search within, relative to project root. */
  cwd?: string;
}

/**
 * Use the Gravity Index tool discovery and install API.
 */
export interface GravityIndexParams {
  /** Which Gravity Index operation to perform. */
  action:
    | "search"
    | "browse"
    | "list_categories"
    | "get_service"
    | "report_integration";
  /** For action "search": query description. */
  query?: string;
  /** For action "search": search session ID. */
  search_id?: string;
  /** Structured JSON context. */
  context?: Record<string, any>;
  /** Category filter. */
  category?: string;
  /** Keyword filter. */
  q?: string;
  /** Service slug. */
  slug?: string;
  /** Integrated service slug. */
  integrated_slug?: string;
}

/**
 * List files and directories in the specified path.
 */
export interface ListDirectoryParams {
  /** Directory path to list, relative to the project root. */
  path: string;
}

/**
 * Retrieve information about an agent by ID.
 */
export interface LookupAgentInfoParams {
  /** Agent ID (short local or full published format) */
  agentId: string;
}

/**
 * Propose string replacements in a file without actually applying them.
 */
export interface ProposeStrReplaceParams {
  /** The path to the file to edit. */
  path: string;
  /** Array of replacements to make. */
  replacements: {
    /** The string to replace (exact match). */
    oldString: string;
    /** The string to replace the corresponding oldString with. */
    newString: string;
    /** Whether to allow multiple replacements of oldString. */
    allowMultiple?: boolean;
  }[];
}

/**
 * Propose creating or editing a file without actually applying the changes.
 */
export interface ProposeWriteFileParams {
  /** Path to the file relative to the project root */
  path: string;
  /** What the change is intended to do in only one sentence. */
  instructions: string;
  /** Edit snippet to apply to the file. */
  content: string;
}

/**
 * Fetch up-to-date documentation for libraries and frameworks using Context7 API.
 */
export interface ReadDocsParams {
  /** The library or framework name (e.g., "Next.js", "React"). */
  libraryTitle: string;
  /** Specific topic to focus on (e.g., "routing", "hooks"). */
  topic: string;
  /** Optional maximum number of tokens to return. Defaults to 10000. */
  max_tokens?: number;
}

/**
 * Read multiple files from disk.
 */
export interface ReadFilesParams {
  /** List of file paths to read. */
  paths: string[];
}

/**
 * Read one or more directory subtrees as a structural blob.
 */
export interface ReadSubtreeParams {
  /** List of paths to directories or files. */
  paths?: string[];
  /** Maximum token budget for the subtree blob. */
  maxTokens?: number;
}

/**
 * Fetch a URL and extract readable text from the page.
 */
export interface ReadUrlParams {
  /** The full http:// or https:// URL to fetch. */
  url: string;
  /** Maximum number of extracted text characters to return. Defaults to 20000. */
  max_chars?: number;
}

/**
 * Render a small interactive UI widget in the ibl1nk CLI / Studio. Currently supports a button that opens a link.
 */
export interface RenderUiParams {
  /** The UI widget to render. */
  widget: {
    /** Widget type. */
    type: "button";
    /** Short button label shown to the user. */
    text: string;
    /** The http:// or https:// URL to open when the user clicks the button. */
    link: string;
    /** Theme-aware color treatment. */
    variant?: "primary" | "secondary";
  };
}

/**
 * Parameters for run_file_change_hooks tool.
 */
export interface RunFileChangeHooksParams {
  /** List of file paths that were changed and should trigger file change hooks */
  files: string[];
}

/**
 * Execute a CLI command from the project root.
 */
export interface RunTerminalCommandParams {
  /** CLI command valid for user's OS. */
  command: string;
  /** Either SYNC or BACKGROUND. Default SYNC */
  process_type?: "SYNC" | "BACKGROUND";
  /** The working directory to run the command in. */
  cwd?: string;
  /** Timeout in seconds. Default 30. -1 for no timeout. */
  timeout_seconds?: number;
}

/**
 * Set the conversation history to the provided messages.
 */
export interface SetMessagesParams {
  messages: any;
}

/**
 * JSON object to set as the agent output.
 */
export interface SetOutputParams {
  output?: Record<string, any>;
}

/**
 * Load a skill's full instructions when relevant to the current task.
 */
export interface SkillParams {
  /** The name of the skill to load */
  name: string;
}

/**
 * Spawn multiple agents and send a prompt and/or parameters to each of them.
 */
export interface SpawnAgentsParams {
  agents: {
    /** Agent to spawn */
    agent_type: string;
    /** Prompt to send to the agent */
    prompt?: string;
    /** Parameters object for the agent (if any) */
    params?: Record<string, any>;
  }[];
}

/**
 * Replace strings in a file with new strings.
 */
export interface StrReplaceParams {
  /** The path to the file to edit. */
  path: string;
  /** Array of replacements to make. */
  replacements: {
    /** The string to replace (exact match). */
    oldString: string;
    /** The string to replace the corresponding oldString with. */
    newString: string;
    /** Whether to allow multiple replacements of oldString. */
    allowMultiple?: boolean;
  }[];
}

/**
 * Suggest clickable followup prompts to the user.
 */
export interface SuggestFollowupsParams {
  /** List of suggested followup prompts */
  followups: {
    /** The prompt text to send as a user message when clicked */
    prompt: string;
    /** Short display label for the card */
    label?: string;
  }[];
}

/**
 * Signal that the task is complete.
 */
export interface TaskCompletedParams {}

/**
 * Deeply consider complex tasks by brainstorming approaches and tradeoffs step-by-step.
 */
export interface ThinkDeeplyParams {
  /** Detailed step-by-step analysis. */
  thought: string;
}

/**
 * Search the web for current information using Serper API.
 */
export interface WebSearchParams {
  /** The search query */
  query: string;
  /** Search depth ('standard' or 'deep'). Default is 'standard'. */
  depth?: "standard" | "deep";
}

/**
 * Create or edit a file with the given content.
 */
export interface WriteFileParams {
  /** Path to the file relative to project root */
  path: string;
  /** What the change is intended to do in one sentence. */
  instructions: string;
  /** Edit content to apply to the file. */
  content: string;
}

/**
 * Write a todo list to track tasks for multi-step implementations.
 */
export interface WriteTodosParams {
  /** List of todos with their completion status */
  todos: {
    /** Description of the task */
    task: string;
    /** Whether the task is completed */
    completed: boolean;
  }[];
}

/**
 * Get parameters type for a specific tool
 */
export type GetToolParams<T extends ToolName> = T extends keyof ToolParamsMap
  ? ToolParamsMap[T]
  : Record<string, any>;
