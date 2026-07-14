# Standard bl1nk.jsonc Schema

## Overview

นี่คือ schema มาตรฐานสำหรับไฟล์ `bl1nk.jsonc` ที่ทุก plugin ต้องมี

## Schema Definition

```jsonc
{
  // ชื่อ plugin (required, kebab-case)
  "name": "plugin-name",
  
  // เวอร์ชัน (required, semver)
  "version": "0.1.0",
  
  // คำอธิบาย plugin (required, 1-2 ประโยค)
  "description": "คำอธิบายสั้นๆ ว่า plugin นี้ทำอะไร",
  
  // ชื่อไฟล์ context (required)
  "contextFile": "PLUGIN.md",
  
  // Components ที่มีใน plugin (required, อย่างน้อย 1 component)
  "components": {
    // Agent definitions (ถ้ามี)
    "agents": [
      "agents/*.md"
    ],
    
    // Command definitions (ถ้ามี)
    "commands": [
      "commands/*.md",
      "commands/*.toml"
    ],
    
    // Skill definitions (ถ้ามี)
    "skills": [
      "skills/*/SKILL.md"
    ],
    
    // Tool implementations (ถ้ามี)
    "tools": [
      "tools/*"
    ],
    
    // Hook configurations (ถ้ามี)
    "hooks": [
      "hooks/*.json"
    ],
    
    // Theme files (ถ้ามี)
    "themes": [
      "themes/*"
    ]
  },
  
  // Dependencies ระหว่าง plugins (optional)
  "dependencies": {
    // ชื่อ plugin ที่ต้องติดตั้งก่อน
    "plugins": []
  },
  
  // Environment variables ที่ plugin ต้องการ (optional)
  "env": {
    // ชื่อ env var + คำอธิบาย
    "EXAMPLE_API_KEY": "API key สำหรับ example service"
  },
  
  // Config schema สำหรับ plugin-specific settings (optional)
  "configSchema": {
    // JSON schema สำหรับ validate plugin config
  }
}
```

## Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | ชื่อ plugin (kebab-case, unique) |
| `version` | string | เวอร์ชัน (semver: `MAJOR.MINOR.PATCH`) |
| `description` | string | คำอธิบาย (1-2 ประโยค) |
| `contextFile` | string | ชื่อไฟล์ context (เช่น `PLUGIN.md`, `GEMINI.md`) |
| `components` | object | อย่างน้อย 1 component type ต้องมีค่า |

## Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `dependencies` | object | Dependencies ระหว่าง plugins |
| `env` | object | Environment variables ที่ต้องการ |
| `configSchema` | object | JSON schema สำหรับ plugin config |

## Examples

### Example 1: Simple Plugin (agent-browser)

```jsonc
{
  "name": "agent-browser",
  "version": "1.0.0",
  "description": "Browser automation CLI for AI agents",
  "contextFile": "SKILL.md",
  "components": {
    "skills": ["skills/*/SKILL.md"],
    "tools": ["templates/*.sh"],
    "references": ["references/*.md"]
  }
}
```

### Example 2: Complex Plugin (pickle-rick-extension)

```jsonc
{
  "name": "pickle-rick-extension",
  "version": "0.1.0",
  "description": "Iterative development loop with Pickle Rick persona",
  "contextFile": "GEMINI.md",
  "components": {
    "commands": ["commands/*.toml"],
    "skills": ["skills/*/SKILL.md"],
    "hooks": ["hooks/*.json"],
    "tools": ["scripts/*.sh", "scripts/*.ps1"],
    "resources": ["resources/*"],
    "themes": ["themes/*"]
  },
  "env": {
    "MAX_ITERATIONS": "จำนวน iteration สูงสุด (default: 10)",
    "WORKER_TIMEOUT": "Worker timeout เป็นวินาที (default: 300)"
  }
}
```

### Example 3: Plugin with Dependencies

```jsonc
{
  "name": "story-studio",
  "version": "0.2.0",
  "description": "Story creation and management studio",
  "contextFile": "PLUGIN.md",
  "components": {
    "agents": ["agents/*.md"],
    "commands": ["commands/*.md"],
    "hooks": ["hooks/*.json"],
    "scripts": ["scripts/*.sh"],
    "references": ["references/*.md"]
  },
  "dependencies": {
    "plugins": ["ibl1nk"]
  }
}
```

## Validation Rules

1. **name**: ต้องเป็น kebab-case, ไม่ซ้ำกับ plugin อื่น
2. **version**: ต้องเป็น valid semver
3. **description**: ต้องไม่ว่างเปล่า, 1-2 ประโยค
4. **contextFile**: ต้องมีไฟล์นี้อยู่จริงใน plugin directory
5. **components**: ต้องมีอย่างน้อย 1 component type ที่ไม่ empty
6. **dependencies.plugins**: ถ้ามี ต้องเป็น array ของชื่อ plugin ที่ valid
