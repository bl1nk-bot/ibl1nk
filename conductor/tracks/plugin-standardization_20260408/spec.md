# Plugin Standardization Specification

## Overview

**Track ID**: `plugin-standardization_20260408`  
**Type**: Refactor  
**Description**: ตรวจสอบและ normalize plugins ทั้งหมดใน `plugins/*` ให้มีโครงสร้างมาตรฐานเดียวกัน ครบทุก components (agent, command, skill, tool, hook, context, theme) พร้อม config reading จาก `bl1nk.jsonc` และ tests ครบถ้วน

## Current State

**Plugins ปัจจุบัน (5 ตัว)**:
1. **agent-browser** - SKILL.md, references/, templates/
2. **ibl1nk** - SKILL.md, references/, scripts/
3. **pickle-rick-extension** - gemini-extension.json, GEMINI.md, commands/, hooks/, skills/, scripts/
4. **story-studio** - agents/, commands/, hooks/, references/, scripts/, .claude-plugin/
5. **command-creator** - commands/, skills/, evals/

## Plugin Components (ต้องครบถ้วนในแต่ละ plugin)

| Component | Description | Required Fields | Location |
|-----------|-------------|-----------------|----------|
| **Agent** | บทบาท/อาชีพ | `name`, `description` | `agents/*.md` |
| **Command** | คำสั่งอัตโนมัติ | `description` | `commands/*.toml` หรือ `*.md` |
| **Skill** | ความเชี่ยวชาญ | `name`, `description` (1-5 triggers) | `skills/*/SKILL.md` |
| **Tool** | Shell/script/MCP | JSON-RPC หรือ stdio interface | `tools/` หรือ `scripts/` |
| **Hook** | Event-driven scripts | Event trigger config | `hooks/` |
| **Context** | Machine-readable docs | เหมือน GEMINI.md | `<PLUGIN>.md` |
| **Theme** | UI customization | Theme config | `themes/` |

## Standardization Requirements

### 1. bl1nk.jsonc Standard

```jsonc
{
  "name": "plugin-name",
  "version": "0.1.0",
  "description": "Plugin description",
  "contextFile": "CONTEXT.md",  // Context file name
  "components": {
    "agents": ["agents/*.md"],
    "commands": ["commands/*.toml"],
    "skills": ["skills/*/SKILL.md"],
    "tools": ["tools/*"],
    "hooks": ["hooks/*.json"],
    "themes": ["themes/*"]
  }
}
```

### 2. Context File Standard

- ชื่อ: `<PLUGIN>.md` หรือ `CONTEXT.md`
- รูปแบบเหมือน `GEMINI.md`
- เนื้อหา: Overview, Components, Usage, Configuration, Examples

### 3. Directory Structure Standard

```
plugins/<plugin-name>/
├── bl1nk.jsonc              # Config (required)
├── <CONTEXT>.md             # Context file (required)
├── README.md                # Human docs
├── agents/                  # Agent definitions
├── commands/                # Command definitions
├── skills/                  # Skills (each with SKILL.md)
│   └── <skill-name>/
│       └── SKILL.md
├── tools/                   # Tool implementations
├── hooks/                   # Hook configs + scripts
├── scripts/                 # Shared scripts
├── resources/               # Assets
├── themes/                  # Theme files
├── references/              # Reference docs
└── tests/                   # Tests (required)
    ├── unit/
    ├── integration/
    ├── component/
    └── e2e/
```

### 4. Config Reading SDK

- อ่านจาก `bl1nk.jsonc`
- Validate schema
- Resolve paths (relative to plugin dir)
- Handle environment variable substitution
- Error handling มาตรฐานเดียวกัน

### 5. Testing Requirements

- **Unit**: ทดสอบ functions/classes แยก
- **Integration**: ทดสอบทำงานร่วมกับระบบ
- **Component**: ทดสอบ components (agents, skills, tools)
- **E2E**: ทดสอบ user flows ทั้งหมด
- Coverage ≥ 80%

## Migration Plan

1. Analyze existing plugins และระบุ majority patterns
2. Define standard structure จาก patterns
3. Create config reading SDK
4. Normalize plugins ทีละตัว:
   - สร้าง bl1nk.jsonc
   - สร้าง/ปรับ context file
   - ย้าย files ให้ตรง structure
   - สร้าง tests
5. Verify ฟีเจอร์เดิมทำงานได้ทั้งหมด

## Acceptance Criteria

- [ ] ทุก plugin (5 ตัว) มี `bl1nk.jsonc` ตามมาตรฐาน
- [ ] ทุก plugin มี context file (เหมือน GEMINI.md)
- [ ] ทุก plugin มี directory structure ตรงตามมาตรฐาน
- [ ] ทุก plugin มี components ครบ (ตามที่มีอยู่)
- [ ] Config reading SDK ทำงานได้กับทุก plugin
- [ ] ทุก plugin มี tests ครบ 4 ชั้น
- [ ] Test coverage ≥ 80%
- [ ] ฟีเจอร์เดิมทั้งหมดทำงานได้หลัง normalize
- [ ] Documentation ครบถ้วน

## Out of Scope

- ไม่เพิ่ม components ใหม่
- ไม่เปลี่ยน business logic
- ไม่สร้าง plugin architecture ใหม่
- ไม่ลบฟีเจอร์ที่มีอยู่
