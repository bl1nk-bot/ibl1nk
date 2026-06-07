# Config Reading SDK Design

## Overview

SDK สำหรับอ่านและ validate plugin configuration จาก `bl1nk.jsonc` พร้อม resolve paths และ substitute environment variables

## API Design

### TypeScript Types

```typescript
// bl1nk.jsonc schema
interface Bl1nkConfig {
  name: string;              // kebab-case plugin name
  version: string;           // semver
  description: string;       // short description
  contextFile: string;       // context file name
  displayName?: string;      // human-readable name
  components?: {
    agents?: string[];       // glob patterns
    commands?: string[];
    skills?: string[];
    tools?: string[];
    hooks?: string[];
    themes?: string[];
  };
  dependencies?: string[];   // plugin dependencies
  env?: {
    required?: string[];     // required env vars
    optional?: string[];     // optional env vars
  };
}

// Resolved config with absolute paths
interface ResolvedConfig {
  pluginDir: string;         // absolute path to plugin dir
  config: Bl1nkConfig;
  contextFilePath: string;   // absolute path to context file
  components: {
    agents: string[];        // absolute paths
    commands: string[];
    skills: string[];
    tools: string[];
    hooks: string[];
    themes: string[];
  };
}

// Validation result
interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

interface ValidationError {
  field: string;
  message: string;
}

interface ValidationWarning {
  field: string;
  message: string;
}

// Error types
class PluginConfigError extends Error {
  constructor(message: string, public pluginName: string);
}

class PathResolutionError extends PluginConfigError {
  constructor(message: string, pluginName: string, public path: string);
}

class ValidationError extends PluginConfigError {
  constructor(message: string, pluginName: string, public errors: ValidationError[]);
}
```

### SDK Functions

```typescript
// Main entry point
import { loadPlugin, validateConfig, resolvePaths, substituteEnv } from '@ibl1nk/plugin-sdk';

// Load and validate plugin config
async function loadPlugin(pluginDir: string): Promise<ResolvedConfig>;

// Validate config against schema
function validateConfig(config: Bl1nkConfig): ValidationResult;

// Resolve relative paths to absolute
function resolvePaths(config: Bl1nkConfig, pluginDir: string): ResolvedConfig['components'];

// Substitute environment variables in strings
function substituteEnv(str: string, extraVars?: Record<string, string>): string;

// Check if required env vars are set
function checkEnv(config: Bl1nkConfig): { missing: string[]; present: string[] };

// List all plugins in plugins directory
async function listPlugins(pluginsDir: string): Promise<string[]>;

// Load all plugins
async function loadAllPlugins(pluginsDir: string): Promise<ResolvedConfig[]>;
```

## Usage Examples

### Basic Usage

```typescript
import { loadPlugin } from '@ibl1nk/plugin-sdk';

const plugin = await loadPlugin('./plugins/agent-browser');
console.log(plugin.config.name);           // "agent-browser"
console.log(plugin.contextFilePath);       // "/abs/path/to/CONTEXT.md"
console.log(plugin.components.skills);     // ["/abs/path/to/skills/*/SKILL.md"]
```

### Validation Only

```typescript
import { validateConfig } from '@ibl1nk/plugin-sdk';

const result = validateConfig({ name: 'test', version: '1.0.0' });
if (!result.valid) {
  console.error(result.errors);
}
```

### Path Resolution

```typescript
import { resolvePaths } from '@ibl1nk/plugin-sdk';

const components = resolvePaths(config, '/plugins/my-plugin');
// Returns absolute paths for all component patterns
```

### Environment Variable Substitution

```typescript
import { substituteEnv } from '@ibl1nk/plugin-sdk';

const cmd = substituteEnv('python ${pluginPath}/scripts/hook.py', {
  pluginPath: '/plugins/my-plugin'
});
// Returns: "python /plugins/my-plugin/scripts/hook.py"
```

### Environment Variable Check

```typescript
import { checkEnv } from '@ibl1nk/plugin-sdk';

const { missing, present } = checkEnv(config);
if (missing.length > 0) {
  throw new Error(`Missing env vars: ${missing.join(', ')}`);
}
```

## Error Handling

### Config Not Found
```typescript
// Throws PluginConfigError
await loadPlugin('./plugins/nonexistent');
// Error: "bl1nk.jsonc not found in ./plugins/nonexistent"
```

### Invalid Schema
```typescript
// Throws ValidationError
validateConfig({ name: 'test' }); // missing version, description, contextFile
// Error: "Invalid config: missing fields: version, description, contextFile"
```

### Path Resolution Failure
```typescript
// Throws PathResolutionError
resolvePaths({ components: { skills: ['nonexistent/*'] } }, '/plugins/test');
// Error: "Path not found: /plugins/test/nonexistent/*"
```

### Missing Environment Variables
```typescript
// Returns { missing: ['API_KEY'], present: [] }
checkEnv({ env: { required: ['API_KEY'] } });
```

## Implementation Structure

```
packages/plugin-sdk/
├── src/
│   ├── index.ts              # Main exports
│   ├── config.ts             # Config loading
│   ├── validate.ts           # Schema validation
│   ├── paths.ts              # Path resolution
│   ├── env.ts                # Env var substitution
│   ├── errors.ts             # Error types
│   └── types.ts              # TypeScript types
├── tests/
│   ├── config.test.ts
│   ├── validate.test.ts
│   ├── paths.test.ts
│   ├── env.test.ts
│   └── integration.test.ts
├── package.json
└── tsconfig.json
```

## JSON Schema for Validation

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["name", "version", "description", "contextFile"],
  "properties": {
    "name": {
      "type": "string",
      "pattern": "^[a-z][a-z0-9-]*$"
    },
    "version": {
      "type": "string",
      "pattern": "^\\d+\\.\\d+\\.\\d+$"
    },
    "description": {
      "type": "string",
      "minLength": 1
    },
    "contextFile": {
      "type": "string",
      "pattern": "^[a-zA-Z0-9._-]+$"
    },
    "displayName": {
      "type": "string"
    },
    "components": {
      "type": "object",
      "properties": {
        "agents": { "type": "array", "items": { "type": "string" } },
        "commands": { "type": "array", "items": { "type": "string" } },
        "skills": { "type": "array", "items": { "type": "string" } },
        "tools": { "type": "array", "items": { "type": "string" } },
        "hooks": { "type": "array", "items": { "type": "string" } },
        "themes": { "type": "array", "items": { "type": "string" } }
      }
    },
    "dependencies": {
      "type": "array",
      "items": { "type": "string" }
    },
    "env": {
      "type": "object",
      "properties": {
        "required": { "type": "array", "items": { "type": "string" } },
        "optional": { "type": "array", "items": { "type": "string" } }
      }
    }
  }
}
```

## Dependencies

- `jsonc-parser` - Parse JSONC files (with comments)
- `glob` or `fast-glob` - Resolve glob patterns
- `ajv` - JSON Schema validation
- Node.js `path` and `fs` modules

## Package.json

```json
{
  "name": "@ibl1nk/plugin-sdk",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsc",
    "test": "vitest",
    "lint": "prettier --write .",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "jsonc-parser": "^3.2.0",
    "fast-glob": "^3.3.0",
    "ajv": "^8.12.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "vitest": "^1.0.0"
  }
}
```
