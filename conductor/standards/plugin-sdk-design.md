# Config Reading SDK Design

## Overview

SDK สำหรับอ่านและ validate plugin configuration จาก `bl1nk.jsonc` พร้อม utilities สำหรับ resolve paths, substitute environment variables, และ error handling มาตรฐาน

**หลักการสำคัญ:**
- ibl1nk เป็น **Host System** อ่าน `plugins/` โดยตรง
- SDK คือ **Standard Format** ที่ระบบใช้ discover และ validate plugins
- CLI tools อื่น (Claude Code, Gemini CLI, etc.) จะสร้าง **adapter** มาเชื่อมกับ standard ของเรา
- **ไม่มีการ install** - plugins มา built-in ใน repo

## SDK API Design

### 1. Core Functions

```typescript
interface PluginConfig {
  name: string;
  version: string;
  description: string;
  contextFile: string;
  components?: {
    agents?: string[];
    commands?: string[];
    skills?: string[];
    tools?: string[];
    hooks?: string[];
    themes?: string[];
  };
  env?: Record<string, string | null>;
  dependencies?: string[];
  metadata?: Record<string, any>;
}

interface AgentFrontmatter {
  name: string;              // kebab-case identifier
  description: string;       // one-line description
  mode: 'all' | 'primary' | 'subagent';
  tools?: ('bash' | 'python' | 'node')[];
}

interface AgentManifest {
  name: string;
  path: string;              // absolute path to agent file
  frontmatter: AgentFrontmatter;
  // เนื้อหาเต็มโหลดเฉพาะเมื่อถูกเรียก
}

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

interface ValidationError {
  path: string;
  message: string;
  code: string;
}

interface ResolvedPaths {
  configPath: string;
  contextFilePath: string;
  components: {
    agents: string[];
    commands: string[];
    skills: string[];
    tools: string[];
    hooks: string[];
    themes: string[];
  };
}
```

### 2. Main Functions

#### `discoverPlugins(pluginsDir: string): Promise<Plugin[]>`
Scan plugins/ directory และ return plugins ทั้งหมดที่ valid

**Input**: 
- `pluginsDir`: Absolute path ถึง plugins/ directory

**Output**: 
- Array ของ Plugin objects

**Logic**:
1. Scan แต่ละ directory ใน plugins/
2. ตรวจสอบว่ามี `bl1nk.jsonc`
3. อ่านและ validate config
4. ถ้า valid → เพิ่มเข้า results
5. Return plugins ทั้งหมด

**Example**:
```typescript
const plugins = await discoverPlugins('/path/to/repo/plugins');
// Returns: [
//   { name: 'agent-browser', path: '/path/...', config: {...} },
//   { name: 'ibl1nk', path: '/path/...', config: {...} },
//   ...
// ]
```

---

#### `parseAgentFrontmatter(agentPath: string): Promise<AgentFrontmatter>`
อ่านเฉพาะ YAML frontmatter จาก agent file (ไม่โหลดเนื้อหาเต็ม)

**Input**: 
- `agentPath`: Absolute path ถึง agent `.md` file

**Output**: 
- `AgentFrontmatter` object

**Errors**:
- `FRONTMATTER_NOT_FOUND`: ไม่มี YAML frontmatter ในไฟล์
- `FRONTMATTER_PARSE_ERROR`: YAML parse ไม่ได้
- `VALIDATION_FAILED`: Frontmatter ไม่ตรง schema

**Logic**:
1. อ่านไฟล์จนถึง `---` แรก (frontmatter block)
2. Parse YAML
3. Validate ต่อ schema
4. Return frontmatter object

**Example**:
```typescript
const fm = await parseAgentFrontmatter('/path/to/agents/lead-writer.md');
// fm = { name: 'lead-writer', description: '...', mode: 'primary', tools: ['bash'] }

// ระบบใช้ frontmatter เพื่อ:
// - Match agents กับ user request โดยไม่ต้องโหลดเนื้อหาเต็ม
// - แสดงรายการ agents ที่มีอยู่
// - Filter by mode/tools
```

---

#### `discoverAgents(pluginDir: string, config: PluginConfig): Promise<AgentManifest[]>`
Scan agents directory และ return manifests ทั้งหมด (เฉพาะ frontmatter)

**Input**:
- `pluginDir`: Absolute path ถึง plugin directory
- `config`: Plugin config ที่ resolve paths แล้ว

**Output**:
- Array ของ `AgentManifest` (frontmatter เท่านั้น, ไม่มีเนื้อหาเต็ม)

**Logic**:
1. ใช้ `config.components.agents` glob patterns
2. หาไฟล์ที่ match
3. สำหรับแต่ละไฟล์ → `parseAgentFrontmatter()`
4. Return manifests ทั้งหมด

**Example**:
```typescript
const agents = await discoverAgents(pluginDir, config);
// agents = [
//   { name: 'lead-writer', path: '/path/...', frontmatter: {...} },
//   { name: 'editor', path: '/path/...', frontmatter: {...} },
// ]

// ระบบใช้: แสดง agents ทั้งหมด, filter/search, match กับ user request
```

---

#### `loadAgent(agentPath: string): Promise<{ frontmatter: AgentFrontmatter, content: string }>`
โหลดเนื้อหาเต็มของ agent (ใช้เมื่อ agent ถูกเลือกแล้วเท่านั้น)

**Input**:
- `agentPath`: Absolute path ถึง agent file

**Output**:
- Frontmatter + เนื้อหาเต็มของ agent

**สำคัญ:** ฟังก์ชันนี้ควรเรียกเฉพาะเมื่อผู้ใช้เลือก agent แล้วเท่านั้น
**ไม่ควร** โหลดทั้งหมดตอน startup

**Example**:
```typescript
// 1. discoverAgents() เพื่อหา agents ทั้งหมด (เฉพาะ frontmatter)
const agents = await discoverAgents(pluginDir, config);

// 2. Match กับ user request
const matchedAgent = agents.find(a => 
  a.frontmatter.description.includes('เขียนนิยาย')
);

// 3. โหลดเฉพาะ agent ที่ match เท่านั้น
const agent = await loadAgent(matchedAgent.path);
// agent.content = เนื้อหาเต็ม ใช้เป็น context
```

---

#### `readConfig(pluginDir: string): Promise<PluginConfig>`
อ่าน config file จาก `bl1nk.jsonc` ใน plugin directory

**Input**: 
- `pluginDir`: Absolute path ถึง plugin directory

**Output**: 
- Parsed config object

**Errors**:
- `CONFIG_NOT_FOUND`: bl1nk.jsonc ไม่มีใน directory
- `CONFIG_PARSE_ERROR`: JSONC parse ไม่ได้
- `CONFIG_READ_ERROR`: FileSystem error

**Example**:
```typescript
const config = await readConfig('/path/to/plugins/my-plugin');
// Returns: { name: 'my-plugin', version: '1.0.0', ... }
```

---

#### `validateConfig(config: PluginConfig, schema?: object): Promise<ValidationResult>`
Validate config ต่อ schema

**Input**:
- `config`: Config object ที่อ่านจาก `readConfig()`
- `schema`: (Optional) Custom JSON schema ถ้าต้องการ override default

**Output**:
- `ValidationResult` { valid: boolean, errors: ValidationError[] }

**Errors**:
- `SCHEMA_LOAD_ERROR`: Default schema load ไม่ได้

**Example**:
```typescript
const result = await validateConfig(config);
if (!result.valid) {
  console.error(result.errors);
}
```

---

#### `resolvePaths(pluginDir: string, config: PluginConfig): Promise<ResolvedPaths>`
Convert relative paths ใน config ให้เป็น absolute paths

**Input**:
- `pluginDir`: Absolute path ถึง plugin directory
- `config`: Config object ที่ validate แล้ว

**Output**:
- `ResolvedPaths` พร้อม absolute paths ทั้งหมด

**Errors**:
- `PATH_RESOLUTION_ERROR`: Path resolve ไม่ได้ (เช่น file ไม่มีจริง)

**Logic**:
1. เริ่มจาก `pluginDir` เป็น base
2. Resolve `contextFile` path
3. Resolve แต่ละ component glob pattern
4. ใช้ `glob` เพื่อ expand patterns
5. Return absolute paths ทั้งหมด

**Example**:
```typescript
const paths = await resolvePaths('/path/to/plugins/my-plugin', config);
// paths.contextFile = '/path/to/plugins/my-plugin/AGENTS.md'
// paths.components.agents = ['/path/to/plugins/my-plugin/agents/writer.md']
```

---

#### `substituteEnv(config: PluginConfig, env?: NodeJS.ProcessEnv): PluginConfig`
แทนที่ `${VAR_NAME}` ใน config values ด้วย environment variable values

**Input**:
- `config`: Config object
- `env`: (Optional) Custom env object (default: `process.env`)

**Output**:
- Config ใหม่ที่แทนที่ env vars แล้ว

**Pattern**:
- `${VAR_NAME}` - แทนที่ด้วย value หรือ empty string ถ้าไม่มี
- `${VAR_NAME:-default}` - ใช้ default ถ้า VAR_NAME ไม่มี

**Example**:
```typescript
process.env.API_KEY = 'secret123';
const config = {
  name: 'my-plugin',
  description: 'Uses ${API_KEY} for auth'
};
const substituted = substituteEnv(config);
// substituted.description = 'Uses secret123 for auth'
```

---

#### `loadPlugin(pluginDir: string): Promise<{ config: PluginConfig, paths: ResolvedPaths }>`
High-level function ที่ทำ read → validate → resolve → return

**Input**:
- `pluginDir`: Absolute path ถึง plugin directory

**Output**:
- Config และ resolved paths ที่ validate แล้ว

**Errors**:
- โยน error จากขั้นตอนใดขั้นตอนหนึ่ง

**Example**:
```typescript
const plugin = await loadPlugin('/path/to/plugins/my-plugin');
// plugin.config = { ... }
// plugin.paths = { ... }
```

---

### 3. Error Handling

```typescript
enum PluginErrorCode {
  CONFIG_NOT_FOUND = 'CONFIG_NOT_FOUND',
  CONFIG_PARSE_ERROR = 'CONFIG_PARSE_ERROR',
  CONFIG_READ_ERROR = 'CONFIG_READ_ERROR',
  SCHEMA_LOAD_ERROR = 'SCHEMA_LOAD_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  PATH_RESOLUTION_ERROR = 'PATH_RESOLUTION_ERROR',
  ENV_SUBSTITUTION_ERROR = 'ENV_SUBSTITUTION_ERROR',
}

class PluginConfigError extends Error {
  constructor(
    message: string,
    public code: PluginErrorCode,
    public details?: any
  ) {
    super(message);
    this.name = 'PluginConfigError';
  }
}
```

---

### 4. TypeScript Types

```typescript
export {
  PluginConfig,
  AgentFrontmatter,
  AgentManifest,
  ValidationResult,
  ValidationError,
  ResolvedPaths,
  PluginErrorCode,
  PluginConfigError,
  discoverPlugins,
  parseAgentFrontmatter,
  discoverAgents,
  loadAgent,
  readConfig,
  validateConfig,
  resolvePaths,
  substituteEnv,
  loadPlugin,
};
```

### 5. External Adapter Interface

CLI tools อื่นที่ต้องการเชื่อมต่อกับ ibl1nk plugins ต้องสร้าง adapter ที่:

1. **เรียก `discoverPlugins()`** จาก SDK ของเรา
2. **แปลง components** ของเราเป็น format ของ CLI นั้น
3. **ลงทะเบียน** กับระบบของ CLI นั้น

**Example: Claude Code Adapter**
```typescript
class ClaudeCodeAdapter {
  async loadIbl1nkPlugins(repoRoot: string) {
    const plugins = await discoverPlugins(
      path.join(repoRoot, 'plugins')
    );
    
    for (const plugin of plugins) {
      // Convert our skills → Claude Code skills
      // Convert our commands → Claude Code commands
      // Register with Claude Code system
    }
  }
}
```

---

## File Structure

```
packages/plugin-sdk/
├── src/
│   ├── index.ts              # Main entry point และ exports
│   ├── discover.ts           # discoverPlugins implementation
│   ├── read.ts               # readConfig implementation
│   ├── validate.ts           # validateConfig implementation
│   ├── resolve.ts            # resolvePaths implementation
│   ├── env.ts                # substituteEnv implementation
│   ├── agents.ts             # parseAgentFrontmatter, discoverAgents, loadAgent
│   ├── load.ts               # loadPlugin implementation
│   ├── errors.ts             # Error types และ utilities
│   └── types.ts              # TypeScript type definitions
├── tests/
│   ├── unit/
│   │   ├── discover.test.ts
│   │   ├── read.test.ts
│   │   ├── validate.test.ts
│   │   ├── resolve.test.ts
│   │   ├── env.test.ts
│   │   ├── agents.test.ts    # Agent frontmatter parsing tests
│   │   └── errors.test.ts
│   └── integration/
│       └── discovery.test.ts
├── package.json
└── tsconfig.json
```

---

## Dependencies

```json
{
  "dependencies": {
    "jsonc-parser": "^3.2.0",
    "ajv": "^8.12.0",
    "glob": "^10.3.0"
  },
  "devDependencies": {
    "vitest": "^2.0.0",
    "typescript": "^5.9.0"
  }
}
```

---

## Usage Examples

### Example 1: Discover All Plugins (Primary Use Case)
```typescript
import { discoverPlugins } from '@bl1nk/plugin-sdk';

const repoRoot = '/path/to/ibl1nk/repo';
const plugins = await discoverPlugins(path.join(repoRoot, 'plugins'));

console.log(`Found ${plugins.length} plugins:`);
for (const plugin of plugins) {
  console.log(`  - ${plugin.name} v${plugin.config.version}`);
}
```

### Example 2: Load Specific Plugin
```typescript
import { loadPlugin } from '@bl1nk/plugin-sdk';

const plugin = await loadPlugin('/path/to/repo/plugins/story-studio');
console.log(`Loaded ${plugin.config.name} v${plugin.config.version}`);
console.log(`Context file: ${plugin.paths.contextFilePath}`);
console.log(`Skills: ${plugin.paths.components.skills.length}`);
```

### Example 3: Validate Only
```typescript
import { readConfig, validateConfig } from '@bl1nk/plugin-sdk';

const config = await readConfig('/path/to/repo/plugins/my-plugin');
const result = await validateConfig(config);

if (!result.valid) {
  result.errors.forEach(err => console.error(err.message));
}
```

### Example 4: External Adapter Usage
```typescript
// Claude Code adapter for ibl1nk plugins
import { discoverPlugins } from '@bl1nk/plugin-sdk';

async function integrateWithClaudeCode(repoRoot: string) {
  const plugins = await discoverPlugins(path.join(repoRoot, 'plugins'));
  
  for (const plugin of plugins) {
    // Convert and register with Claude Code
    await claudeCode.registerPlugin(plugin);
  }
}
```

---

**Version**: 1.0.0  
**Created**: 2026-04-09  
**Status**: Design Complete - Ready for Implementation
