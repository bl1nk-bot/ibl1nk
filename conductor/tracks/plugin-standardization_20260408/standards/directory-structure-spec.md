# Standard Directory Structure Specification

## Overview

นี่คือข้อกำหนดโครงสร้าง directory มาตรฐานสำหรับ plugins ทั้งหมดในโปรเจค

## Standard Structure

```
plugins/<plugin-name>/
│
├── bl1nk.jsonc                    # ⭐ REQUIRED: Plugin configuration
├── <CONTEXT>.md                   # ⭐ REQUIRED: Context file for AI agents
├── README.md                      # ⭐ REQUIRED: Human-readable documentation
│
├── agents/                        # Optional: Agent definitions
│   ├── <agent-name>.md            #   - Agent role/personality definitions
│   └── ...
│
├── commands/                      # Optional: Command definitions
│   ├── <command-name>.md          #   - Command in markdown format
│   ├── <command-name>.toml        #   - Command in TOML format
│   └── ...
│
├── skills/                        # Optional: Skill definitions
│   └── <skill-name>/              #   - Each skill has its own directory
│       ├── SKILL.md               #   - Skill definition (required)
│       ├── references/            #   - Skill-specific references (optional)
│       └── ...
│
├── tools/                         # Optional: Tool implementations
│   ├── <tool-name>.sh             #   - Shell scripts
│   ├── <tool-name>.js             #   - JavaScript tools
│   ├── <tool-name>.py             #   - Python tools
│   └── ...
│
├── hooks/                         # Optional: Event-driven scripts
│   ├── hooks.json                 #   - Hook configuration (required if hooks/ exists)
│   ├── <hook-name>.sh             #   - Shell hook scripts
│   ├── <hook-name>.ps1            #   - PowerShell hook scripts
│   └── ...
│
├── scripts/                       # Optional: Shared scripts
│   ├── <script-name>.sh           #   - Shell scripts
│   ├── <script-name>.js           #   - JavaScript scripts
│   ├── <script-name>.ps1          #   - PowerShell scripts
│   └── ...
│
├── resources/                     # Optional: Assets and resources
│   ├── images/                    #   - Image assets
│   ├── data/                      #   - Data files
│   └── ...
│
├── themes/                        # Optional: Theme files
│   ├── <theme-name>.json          #   - Theme definitions
│   └── ...
│
├── references/                    # Optional: Reference documentation
│   ├── <topic>.md                 #   - Reference documentation
│   └── ...
│
└── tests/                         # ⭐ REQUIRED: Test files
    ├── unit/                      #   - Unit tests
    │   └── <test-name>.test.ts
    ├── integration/               #   - Integration tests
    │   └── <test-name>.test.ts
    ├── component/                 #   - Component tests
    │   └── <test-name>.test.ts
    └── e2e/                       #   - End-to-end tests
        └── <test-name>.test.ts
```

## Required Files/Directories

| Path | Type | Description |
|------|------|-------------|
| `bl1nk.jsonc` | File | ⭐ Plugin configuration (required) |
| `<CONTEXT>.md` | File | ⭐ Context file for AI agents (required) |
| `README.md` | File | ⭐ Human-readable documentation (required) |
| `tests/` | Directory | ⭐ Test files (required) |

## Optional Directories

| Directory | Description | When to Use |
|-----------|-------------|-------------|
| `agents/` | Agent definitions | Plugin มี agent roles/personalities |
| `commands/` | Command definitions | Plugin มี commands ที่เรียกได้ |
| `skills/` | Skill definitions | Plugin มี skills ที่ activate ได้ |
| `tools/` | Tool implementations | Plugin มี tools (scripts, binaries) |
| `hooks/` | Event-driven scripts | Plugin มี event hooks |
| `scripts/` | Shared scripts | Plugin มี shared scripts |
| `resources/` | Assets | Plugin มี images, data, etc. |
| `themes/` | Theme files | Plugin มี custom themes |
| `references/` | Reference docs | Plugin มี reference documentation |

## Naming Conventions

### Files
- **kebab-case** สำหรับทุกไฟล์
- ตัวอย่าง: `my-command.md`, `skill-name/`, `agent-role.md`

### Directories
- **kebab-case** สำหรับทุก directory
- ตัวอย่าง: `skills/my-skill/`, `commands/sub-command/`

### Tests
- **test suffix**: `<name>.test.ts` หรือ `<name>.spec.ts`
- **Structure**: Mirror source structure in tests/

## Migration Guidelines

### จากโครงสร้างเดิม -> มาตรฐานใหม่

#### Case 1: Plugin มี SKILL.md ที่ root
```
Before:
plugin/
├── SKILL.md
├── references/
└── templates/

After:
plugin/
├── bl1nk.jsonc          # NEW
├── SKILL.md             # KEEP (เป็น context file)
├── README.md            # NEW (หรือ rename จาก existing docs)
├── skills/
│   └── <skill-name>/
│       └── SKILL.md     # MOVE (ถ้ามี multiple skills)
├── tools/
│   └── templates/*.sh   # MOVE templates ที่นี่
├── references/          # KEEP
└── tests/               # NEW
    └── ...
```

#### Case 2: Plugin มี commands/ และ skills/ อยู่แล้ว
```
Before:
plugin/
├── commands/
│   └── *.toml
├── skills/
│   └── */
├── hooks/
│   └── hooks.json
└── GEMINI.md

After:
plugin/
├── bl1nk.jsonc          # NEW
├── GEMINI.md            # KEEP (เป็น context file)
├── README.md            # NEW
├── commands/            # KEEP
├── skills/              # KEEP (แต่ละ skill ต้องมี SKILL.md)
├── hooks/               # KEEP
├── tools/               # NEW (ย้าย scripts来这里)
├── scripts/             # KEEP (shared scripts)
├── references/          # NEW (ถ้ามี docs เพิ่มเติม)
└── tests/               # NEW
    └── ...
```

#### Case 3: Plugin มี agents/ อยู่แล้ว
```
Before:
plugin/
├── agents/
│   └── *.md
├── commands/
│   └── *.md
└── .claude-plugin/

After:
plugin/
├── bl1nk.jsonc          # NEW
├── PLUGIN.md            # NEW (context file)
├── README.md            # NEW
├── agents/              # KEEP
├── commands/            # KEEP
├── hooks/               # NEW (ถ้ามี hooks)
├── scripts/             # NEW (ถ้ามี scripts)
├── references/          # NEW
└── tests/               # NEW
    └── ...
```

## Validation Checklist

ตรวจสอบ plugin ใหม่หรือ plugin ที่ normalize แล้ว:

- [ ] มี `bl1nk.jsonc` ที่ root
- [ ] มี context file (เช่น `PLUGIN.md`, `SKILL.md`, `GEMINI.md`)
- [ ] มี `README.md` ที่ root
- [ ] มี `tests/` directory
- [ ] ทุก directory ใช้ kebab-case
- [ ] Components อยู่ใน directories ที่ถูกต้อง
- [ ] ไม่มีไฟล์ซ้ำซ้อนหรือวางผิดที่
- [ ] Structure ตรงกับที่ระบุใน `bl1nk.jsonc`
