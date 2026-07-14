# Config Reading SDK Design

## Overview

SDK สำหรับอ่านและ validate `bl1nk.jsonc` configs จาก plugins ทั้งหมด

## API Design

### 1. Core Functions

```typescript
// Main SDK class
class PluginConfigSDK {
  /**
   * อ่าน config จาก bl1nk.jsonc ของ plugin
   * @param pluginPath - Path ไปยัง plugin directory
   * @returns Plugin config object
   */
  async readConfig(pluginPath: string): Promise<PluginConfig>

  /**
   * Validate config ตรงกับ schema
   * @param config - Config object ที่จะ validate
   * @returns Validation result (pass/fail + errors)
   */
  validateConfig(config: PluginConfig): ValidationResult

  /**
   * Resolve paths ที่ relative ไปยัง plugin directory
   * @param pluginPath - Plugin directory path
   * @param relativePath - Path ที่ relative ไปยัง plugin
   * @returns Absolute path
   */
  resolvePath(pluginPath: string, relativePath: string): string

  /**
   * แทนที่ environment variables ใน string
   * @param template - String ที่มี ${ENV_VAR} placeholders
   * @returns String ที่แทนที่ env vars แล้ว
   */
  substituteEnvVars(template: string): string

  /**
   * อ่าน configs จากทุก plugins ใน directory
   * @param pluginsDir - Path ไปยัง plugins directory
   * @returns Array ของ plugin configs
   */
  async readAllConfigs(pluginsDir: string): Promise<PluginConfig[]>

  /**
   * หา plugin โดยชื่อ
   * @param pluginsDir - Path ไปยัง plugins directory
   * @param name - ชื่อ plugin ที่ต้องการหา
   * @returns Plugin config หรือ null ถ้าไม่พบ
   */
  async findPlugin(pluginsDir: string, name: string): Promise<PluginConfig | null>

  /**
   * ตรวจสอบ dependencies ระหว่าง plugins
   * @param configs - Array ของ plugin configs
   * @returns Dependency graph + validation errors
   */
  validateDependencies(configs: PluginConfig[]): DependencyValidationResult
}
```

### 2. Type Definitions

```typescript
// Plugin config structure (ตรงกับ bl1nk.jsonc schema)
interface PluginConfig {
  name: string                    // kebab-case, unique
  version: string                 // semver
  description: string             // 1-2 sentences
  contextFile: string             // filename (เช่น "PLUGIN.md")
  components: {
    agents?: string[]            // glob patterns
    commands?: string[]
    skills?: string[]
    tools?: string[]
    hooks?: string[]
    themes?: string[]
    scripts?: string[]
    resources?: string[]
    references?: string[]
  }
  dependencies?: {
    plugins?: string[]           // plugin names ที่ต้องมี
  }
  env?: Record<string, string>   // env var descriptions
  configSchema?: object          // JSON schema สำหรับ plugin config
}

// Validation result
interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

interface ValidationError {
  field: string                  // เช่น "name", "components.skills"
  message: string
  severity: 'error' | 'warning'
}

interface ValidationWarning {
  field: string
  message: string
  suggestion?: string
}

// Dependency validation result
interface DependencyValidationResult {
  valid: boolean
  graph: DependencyGraph
  errors: string[]
  circularDependencies: string[][]
}

type DependencyGraph = Record<string, string[]>  // plugin -> dependencies
```

### 3. Error Handling

```typescript
// Custom error types
class PluginConfigError extends Error {
  constructor(
    message: string,
    public code: PluginErrorCode,
    public pluginName?: string
  ) {
    super(message)
    this.name = 'PluginConfigError'
  }
}

enum PluginErrorCode {
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',           // bl1nk.jsonc ไม่มี
  INVALID_JSON = 'INVALID_JSON',               // JSON syntax error
  VALIDATION_FAILED = 'VALIDATION_FAILED',     // Schema validation ไม่ผ่าน
  MISSING_CONTEXT = 'MISSING_CONTEXT',         // Context file ไม่มี
  MISSING_COMPONENTS = 'MISSING_COMPONENTS',   // Components patterns ไม่ match
  DEPENDENCY_MISSING = 'DEPENDENCY_MISSING',   // Dependency plugin ไม่มี
  CIRCULAR_DEPENDENCY = 'CIRCULAR_DEPENDENCY', // Circular dependencies
  PATH_RESOLUTION = 'PATH_RESOLUTION',         // Path resolve ไม่สำเร็จ
  ENV_SUBSTITUTION = 'ENV_SUBSTITUTION',       // Env var substitution ไม่สำเร็จ
}

// Error handling utilities
function handleConfigError(error: unknown): PluginConfigError {
  if (error instanceof PluginConfigError) {
    return error
  }
  
  if (error instanceof SyntaxError) {
    return new PluginConfigError(
      `Invalid JSON syntax: ${error.message}`,
      PluginErrorCode.INVALID_JSON
    )
  }
  
  if (error instanceof Error) {
    return new PluginConfigError(
      error.message,
      PluginErrorCode.VALIDATION_FAILED
    )
  }
  
  return new PluginConfigError(
    'Unknown error occurred',
    PluginErrorCode.VALIDATION_FAILED
  )
}
```

### 4. Implementation Examples

```typescript
// Example 1: Read single plugin config
const sdk = new PluginConfigSDK()
const config = await sdk.readConfig('/path/to/plugins/agent-browser')
console.log(config.name)  // "agent-browser"
console.log(config.components.skills)  // ["skills/*/SKILL.md"]

// Example 2: Validate config
const result = sdk.validateConfig(config)
if (!result.valid) {
  console.error('Validation errors:', result.errors)
}

// Example 3: Resolve paths
const absolutePath = sdk.resolvePath(
  '/path/to/plugins/agent-browser',
  'skills/browser-automation/SKILL.md'
)
// Returns: "/path/to/plugins/agent-browser/skills/browser-automation/SKILL.md"

// Example 4: Substitute env vars
const template = 'API key: ${API_KEY}, Endpoint: ${ENDPOINT_URL}'
const result = sdk.substituteEnvVars(template)
// Returns: "API key: sk-123..., Endpoint: https://api.example.com"

// Example 5: Read all plugins
const configs = await sdk.readAllConfigs('/path/to/plugins')
console.log(`Found ${configs.length} plugins`)

// Example 6: Find specific plugin
const browser = await sdk.findPlugin('/path/to/plugins', 'agent-browser')
if (browser) {
  console.log('Found browser plugin:', browser.version)
}

// Example 7: Validate dependencies
const depResult = sdk.validateDependencies(configs)
if (!depResult.valid) {
  console.error('Dependency errors:', depResult.errors)
}
```

### 5. Environment Variable Handling

```typescript
// Env var substitution patterns
interface EnvVarOptions {
  required?: boolean           // ถ้า true, error ถ้า env var ไม่มี
  defaultValue?: string        // default value ถ้า env var ไม่มี
  validate?: (value: string) => boolean  // custom validation
}

class EnvVarResolver {
  /**
   * แทนที่ ${ENV_VAR} ใน string
   */
  substitute(template: string): string

  /**
   * แทนที่พร้อม validation
   */
  substituteWithValidation(
    template: string,
    options: Record<string, EnvVarOptions>
  ): { result: string; errors: string[] }

  /**
   * อ่าน env var จาก config's env section
   */
  resolveFromConfig(
    config: PluginConfig,
    varName: string
  ): string | undefined
}
```

### 6. Path Resolution

```typescript
class PathResolver {
  private pluginRoot: string

  constructor(pluginRoot: string) {
    this.pluginRoot = pluginRoot
  }

  /**
   * Resolve relative path ไปยัง plugin root
   */
  resolve(relativePath: string): string {
    return path.resolve(this.pluginRoot, relativePath)
  }

  /**
   * Resolve glob pattern ไปยังไฟล์หลายๆตัว
   */
  async resolveGlob(pattern: string): Promise<string[]> {
    const absolutePattern = path.resolve(this.pluginRoot, pattern)
    return glob(absolutePattern)
  }

  /**
   * ตรวจสอบว่าไฟล์มีอยู่จริง
   */
  async exists(relativePath: string): Promise<boolean> {
    const absolutePath = this.resolve(relativePath)
    return fs.existsSync(absolutePath)
  }

  /**
   * อ่านไฟล์
   */
  async readFile(relativePath: string): Promise<string> {
    const absolutePath = this.resolve(relativePath)
    return fs.readFileSync(absolutePath, 'utf-8')
  }
}
```

### 7. Config Validation Schema

```typescript
// JSON Schema สำหรับ validate bl1nk.jsonc
const PLUGIN_CONFIG_SCHEMA = {
  type: 'object',
  required: ['name', 'version', 'description', 'contextFile', 'components'],
  properties: {
    name: {
      type: 'string',
      pattern: '^[a-z0-9]+(-[a-z0-9]+)*$',  // kebab-case
      description: 'Plugin name (kebab-case)'
    },
    version: {
      type: 'string',
      pattern: '^\\d+\\.\\d+\\.\\d+$',  // semver
      description: 'Plugin version (semver)'
    },
    description: {
      type: 'string',
      minLength: 1,
      maxLength: 500,
      description: 'Plugin description (1-2 sentences)'
    },
    contextFile: {
      type: 'string',
      pattern: '^.+\\.md$',
      description: 'Context file name (must be .md file)'
    },
    components: {
      type: 'object',
      anyOf: [
        { required: ['agents'] },
        { required: ['commands'] },
        { required: ['skills'] },
        { required: ['tools'] },
        { required: ['hooks'] },
        { required: ['themes'] }
      ],
      properties: {
        agents: { type: 'array', items: { type: 'string' } },
        commands: { type: 'array', items: { type: 'string' } },
        skills: { type: 'array', items: { type: 'string' } },
        tools: { type: 'array', items: { type: 'string' } },
        hooks: { type: 'array', items: { type: 'string' } },
        themes: { type: 'array', items: { type: 'string' } },
        scripts: { type: 'array', items: { type: 'string' } },
        resources: { type: 'array', items: { type: 'string' } },
        references: { type: 'array', items: { type: 'string' } }
      }
    },
    dependencies: {
      type: 'object',
      properties: {
        plugins: {
          type: 'array',
          items: { type: 'string' }
        }
      }
    },
    env: {
      type: 'object',
      additionalProperties: { type: 'string' }
    },
    configSchema: { type: 'object' }
  }
}
```

---

## SDK Location

**Path**: `shared/lib/plugin-config-sdk/`

**Structure**:
```
shared/lib/plugin-config-sdk/
├── src/
│   ├── index.ts              # Main exports
│   ├── sdk.ts                # PluginConfigSDK class
│   ├── types.ts              # Type definitions
│   ├── validator.ts          # Validation logic
│   ├── path-resolver.ts      # Path resolution
│   ├── env-resolver.ts       # Environment variable handling
│   └── errors.ts             # Error types and utilities
├── tests/
│   ├── unit/
│   │   ├── sdk.test.ts
│   │   ├── validator.test.ts
│   │   ├── path-resolver.test.ts
│   │   └── env-resolver.test.ts
│   └── integration/
│       └── read-config.test.ts
└── package.json              # SDK package config
```

---

## Usage in Plugins

```typescript
// In any plugin code:
import { PluginConfigSDK } from '@/shared/lib/plugin-config-sdk'

const sdk = new PluginConfigSDK()

// Read this plugin's config
const config = await sdk.readConfig(__dirname)

// Validate before use
const validation = sdk.validateConfig(config)
if (!validation.valid) {
  throw new Error(`Invalid plugin config: ${validation.errors.join(', ')}`)
}

// Resolve paths
const skillPath = sdk.resolvePath(__dirname, config.components.skills[0])

// Use env vars
const apiKey = sdk.substituteEnvVars(process.env.API_KEY || '')
```

---

## Implementation Notes

### Dependencies
- **fast-glob** - สำหรับ glob pattern matching
- **ajv** - สำหรับ JSON schema validation
- **dotenv** - สำหรับ env var handling
- **path** - Node.js path module

### Performance
- Cache configs หลังอ่านครั้งแรก
- Lazy load เฉพาะเมื่อต้องการ
- Parallel reading สำหรับ multiple plugins

### Testing Strategy
- Unit tests: แต่ละ function แยกกัน
- Integration tests: อ่าน configs จาก plugins จริง
- E2E tests: SDK workflow ทั้งหมด
- Edge cases: Invalid configs, missing files, circular deps

### Error Handling
- ใช้ custom error types
- Bilingual messages (Thai/English)
- Numeric error codes สำหรับ programmatic handling
- Stack traces ใน development mode
