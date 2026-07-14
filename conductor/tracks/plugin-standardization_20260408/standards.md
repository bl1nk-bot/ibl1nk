# Standard Plugin Structure

## Overview

เอกสารนี้กำหนดโครงสร้างมาตรฐานสำหรับ plugins ทั้งหมดใน ibl1nk system โดยอ้างอิงจาก majority patterns ที่พบใน plugins ปัจจุบัน 5 ตัว (agent-browser, ibl1nk, pickle-rick-extension, story-studio, command-creator)

## Standard Directory Structure

```
plugins/<plugin-name>/
├── bl1nk.jsonc              # Plugin config (required)
├── <CONTEXT>.md             # Context file - machine readable docs (required)
├── README.md                # Human-readable docs
├── agents/                  # Agent definitions (*.md)
├── commands/                # Command definitions (*.toml or *.md)
├── skills/                  # Skills
│   └── <skill-name>/
│       └── SKILL.md         # Each skill has frontmatter + content
├── tools/                   # Tool implementations (scripts, executables)
├── hooks/                   # Hook configs + scripts
│   └── hooks.json           # Hook event mappings
├── scripts/                 # Shared utility scripts
├── resources/               # Static assets
├── themes/                  # Theme definitions
├── references/              # Reference documentation
├── templates/               # Template files
├── evals/                   # Evaluation datasets
└── tests/                   # Test files (required)
    ├── unit/
    ├── integration/
    ├── component/
    └── e2e/
```

## bl1nk.jsonc Schema

```jsonc
{
  // Required fields
  "name": "plugin-name",           // Unique plugin identifier (kebab-case)
  "version": "0.1.0",              // Semantic version
  "description": "Short description of what this plugin does",
  
  // Required - context file
  "contextFile": "CONTEXT.md",     // Name of machine-readable context file
  
  // Optional - display name
  "displayName": "Plugin Name",    // Human-readable name
  
  // Components - paths are relative to plugin directory
  "components": {
    "agents": ["agents/*.md"],
    "commands": ["commands/*.toml", "commands/*.md"],
    "skills": ["skills/*/SKILL.md"],
    "tools": ["tools/*"],
    "hooks": ["hooks/*.json"],
    "themes": ["themes/*"]
  },
  
  // Optional - dependencies
  "dependencies": [],
  
  // Optional - required environment variables
  "env": {
    "required": [],
    "optional": []
  }
}
```

## Context File Standard

### Naming
- ใช้ `<PLUGIN>.md` หรือ `CONTEXT.md`
- ตัวอย่าง: `AGENT-BROWSER.md`, `PICKLE-RICK.md`, `CONTEXT.md`

### Format
ใช้ Markdown with YAML frontmatter:

```markdown
---
name: plugin-name
version: 0.1.0
description: Short description
---

# Plugin Name

## Overview
Brief description of plugin purpose

## Components
List of available components (agents, commands, skills, tools, hooks)

## Usage
How to use the plugin and its components

## Configuration
Required and optional configuration

## Examples
Usage examples
```

## Component Standards

### Agents (`agents/*.md`)

ไฟล์กำหนดบทบาท/อาชีพของ AI agent

**Required Frontmatter:**
```yaml
---
name: agent-name
description: What this agent does
---
```

**Content:**
- Role definition
- Capabilities
- Workflow instructions
- Example usage

### Commands (`commands/*.toml` or `commands/*.md`)

ไฟล์กำหนดคำสั่งอัตโนมัติ

**TOML Format:**
```toml
description = "What this command does"
prompt = """
Instructions for the AI to execute
"""
```

**Markdown Format:**
```markdown
---
name: command-name
description: What this command does
---

# Command Name

Instructions for execution...
```

### Skills (`skills/<skill-name>/SKILL.md`)

ไฟล์กำหนดความเชี่ยวชาญเฉพาะทาง

**Required Frontmatter:**
```markdown
---
name: skill-name
description: What this skill does
---
```

**Content:**
- Skill description
- When to use (triggers)
- How to use (instructions)
- Examples

### Tools (`tools/`)

ไฟล์ script หรือ executable ที่ใช้ทำงานอัตโนมัติ

**Requirements:**
- ต้อง executable หรือเรียกผ่าน interpreter ได้
- ควรมี usage documentation ใน README.md หรือ tools/README.md
- รองรับ stdin/stdout หรือ JSON-RPC interface

### Hooks (`hooks/`)

Event-driven scripts ที่ทำงานตามเหตุการณ์

**hooks.json Structure:**
```json
{
  "hooks": {
    "BeforeAgent": [
      {
        "matcher": "*",
        "hooks": [
          {
            "name": "hook-name",
            "type": "command",
            "command": "bash ${pluginPath}/scripts/hook.sh",
            "description": "What this hook does"
          }
        ]
      }
    ],
    "BeforeModel": [],
    "AfterAgent": []
  }
}
```

**Supported Events:**
- `BeforeAgent` - ก่อน agent เริ่มทำงาน
- `BeforeModel` - ก่อน model inference
- `AfterAgent` - หลัง agent เสร็จงาน

### Themes (`themes/`)

UI theme definitions

**Format:** JSON หรือ CSS ที่กำหนดสี, typography, spacing

## Path Resolution

ทุก path ใน `bl1nk.jsonc` เป็น **relative to plugin directory**

**Example:**
```
plugins/my-plugin/
├── bl1nk.jsonc          # name: "my-plugin"
├── CONTEXT.md
├── skills/
│   └── my-skill/
│       └── SKILL.md     # resolved as: ${pluginDir}/skills/my-skill/SKILL.md
└── commands/
    └── my-cmd.toml      # resolved as: ${pluginDir}/commands/my-cmd.toml
```

## Environment Variable Substitution

ใน command strings รองรับ `${VAR_NAME}` หรือ `$VAR_NAME`:

```toml
command = "python ${pluginPath}/scripts/hook.py"
```

**Supported Variables:**
- `${pluginPath}` - Absolute path to plugin directory
- `${pluginName}` - Plugin name from bl1nk.jsonc
- Environment variables จาก system (e.g., `$HOME`, `$PATH`)

## Validation Rules

### Required
1. `bl1nk.jsonc` ต้องมี
2. Context file ต้องมี
3. `name` ใน bl1nk.jsonc ต้องตรงกับ directory name (kebab-case)
4. `version` ต้องเป็น semver

### Optional
1. Components directories มีเฉพาะที่มี components จริง
2. README.md มีสำหรับ human docs
3. Tests มีสำหรับ quality assurance

### Forbidden
1. ห้ามใช้ absolute paths ใน bl1nk.jsonc
2. ห้ามใช้ `..` เพื่อ escape plugin directory
3. ห้าม reference files นอก plugin directory

## Migration Notes

### From gemini-extension.json
- ย้าย `name`, `version` ไป bl1nk.jsonc
- ย้าย `contextFileName` ไป `contextFile` ใน bl1nk.jsonc
- เก็บ gemini-extension.json ไว้ชั่วคราวถ้ายังต้องการ backward compatibility

### From SKILL.md (root-level)
- SKILL.md ที่ root เป็น skill เดียวของ plugin
- ย้ายไป `skills/<plugin-name>/SKILL.md` ถ้ามี components อื่นด้วย
- หรือเก็บไว้ที่ root ถ้าเป็น single-skill plugin

### From .claude-plugin/
- ย้าย config ไป bl1nk.jsonc
- ลบ .claude-plugin/ directory

## Testing Requirements

ทุก plugin ควรมี tests 4 ระดับ:

1. **Unit Tests** - ทดสอบ functions/classes แยก
2. **Integration Tests** - ทดสอบการทำงานร่วมกัน
3. **Component Tests** - ทดสอบ agents, skills, commands
4. **E2E Tests** - ทดสอบ user flows ทั้งหมด

**Coverage Target:** ≥ 80%

## Examples

### Minimal Plugin
```
plugins/minimal/
├── bl1nk.jsonc
└── CONTEXT.md
```

**bl1nk.jsonc:**
```jsonc
{
  "name": "minimal",
  "version": "1.0.0",
  "description": "A minimal plugin",
  "contextFile": "CONTEXT.md"
}
```

### Full Plugin
```
plugins/full-plugin/
├── bl1nk.jsonc
├── FULL-PLUGIN.md
├── README.md
├── agents/
│   └── writer.md
├── commands/
│   └── start.toml
├── skills/
│   └── analyzer/
│       └── SKILL.md
├── hooks/
│   ├── hooks.json
│   └── scripts/
│       └── before-agent.sh
├── scripts/
│   └── utils.sh
└── tests/
    ├── unit/
    └── integration/
```
