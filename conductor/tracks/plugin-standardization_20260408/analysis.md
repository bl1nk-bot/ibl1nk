# Plugin Analysis Report

## Survey of All 5 Plugins

### 1. agent-browser

**Location**: `plugins/agent-browser/`

**Directory Structure**:

```
agent-browser/
├── SKILL.md
├── references/
│   ├── commands.md
│   ├── snapshot-refs.md
│   ├── session-management.md
│   ├── authentication.md
│   ├── video-recording.md
│   └── proxy-support.md
└── templates/
    ├── form-automation.sh
    ├── authenticated-session.sh
    └── capture-workflow.sh
```

**Components**:

- **Skill**: 1 (SKILL.md at root)
- **References**: 6 files (detailed documentation)
- **Templates**: 3 shell scripts
- **Agents**: 0
- **Commands**: 0
- **Tools**: 0 (shell scripts ใน templates/)
- **Hooks**: 0
- **Themes**: 0

**Config**: ไม่มี config file (bl1nk.jsonc หรือ similar)
**Context File**: SKILL.md (ทำหน้าที่เป็นทั้ง skill definition และ context)

---

### 2. ibl1nk

**Location**: `plugins/ibl1nk/`

**Directory Structure**:

```
ibl1nk/
├── SKILL.md
├── references/
│   ├── craft-api.md
│   ├── obsidian-sync.md
│   └── slack-integration.md
└── scripts/
    ├── analyze-content.js
    ├── sync-obsidian.js
    └── send-slack-notification.js
```

**Components**:

- **Skill**: 1 (SKILL.md at root)
- **References**: 3 files (API documentation)
- **Scripts**: 3 JavaScript files
- **Agents**: 0
- **Commands**: 0
- **Tools**: 3 (scripts/*.js)
- **Hooks**: 0
- **Themes**: 0

**Config**: ไม่มี config file
**Context File**: SKILL.md

---

### 3. pickle-rick-extension

**Location**: `plugins/pickle-rick-extension/`

**Directory Structure**:

```
pickle-rick-extension/
├── gemini-extension.json
├── GEMINI.md
├── README.md
├── commands/
│   ├── pickle.toml
│   ├── pickle-prd.toml
│   ├── eat-pickle.toml
│   ├── help-pickle.toml
│   ├── add-to-pickle-jar.toml
│   ├── pickle-jar-open.toml
│   └── send-to-morty.toml
├── hooks/
│   ├── hooks.json
│   ├── increment-iteration.sh/.ps1
│   ├── reinforce-persona.sh/.ps1
│   ├── check-limit.sh/.ps1
│   └── stop-hook.sh/.ps1
├── skills/
│   ├── prd-drafter/
│   ├── ticket-manager/
│   ├── code-researcher/
│   ├── research-reviewer/
│   ├── implementation-planner/
│   ├── plan-reviewer/
│   ├── code-implementer/
│   ├── ruthless-refactorer/
│   └── load-pickle-persona/
├── scripts/
│   ├── setup.sh/.ps1
│   ├── cancel.sh/.ps1
│   └── (อื่นๆ)
├── resources/
│   └── (assets)
├── themes/
│   └── (theme files)
├── cli/
│   └── (CLI tools)
└── .github/
    └── (CI/CD)
```

**Components**:

- **Skills**: 9 skills (แต่ละตัวมี SKILL.md หรือ similar)
- **Commands**: 7 commands (.toml files)
- **Hooks**: 5 hooks (hooks.json + shell/ps1 scripts)
- **Scripts**: Multiple (setup, cancel, etc.)
- **Resources**: Yes
- **Themes**: Yes
- **Agents**: 0
- **Tools**: 0 (scripts ทำหน้าที่ tools)

**Config**: `gemini-extension.json` (manifest)
**Context File**: `GEMINI.md`

---

### 4. story-studio

**Location**: `plugins/story-studio/`

**Directory Structure**:

```
story-studio/
├── agents/
│   ├── lead-writer.md
│   ├── editor.md
│   ├── context-manager.md
│   └── marketing-specialist.md
├── commands/
│   ├── create-board.md
│   ├── edit-content.md
│   ├── marketing-assets.md
│   ├── start-project.md
│   ├── sync-notion.md
│   ├── update-context.md
│   └── write-episodes.md
├── hooks/
│   └── hooks.json
├── references/
│   └── (documentation)
├── scripts/
│   └── (helper scripts)
└── .claude-plugin/
    └── (claude plugin config)
```

**Components**:

- **Agents**: 4 agents (lead-writer, editor, context-manager, marketing-specialist)
- **Commands**: 7 commands (.md files)
- **Hooks**: 1 (hooks.json)
- **References**: Yes
- **Scripts**: Yes
- **Skills**: 0
- **Tools**: 0
- **Themes**: 0

**Config**: `.claude-plugin/` directory
**Context File**: ไม่มี explicit context file (แต่มี agents/*.md ที่ทำหน้าที่ similar)

---

### 5. command-creator

**Location**: `plugins/command-creator/`

**Directory Structure**:

```
command-creator/
├── commands/
│   └── command-creator.md
├── skills/
│   └── command-creator/
│       └── SKILL.md
└── evals/
    └── (evaluation tests)
```

**Components**:

- **Commands**: 1 command (command-creator.md)
- **Skills**: 1 skill (command-creator/SKILL.md)
- **Evals**: Yes (evaluation tests)
- **Agents**: 0
- **Tools**: 0
- **Hooks**: 0
- **Themes**: 0

**Config**: ไม่มี config file
**Context File**: ไม่มี explicit context file

---

## Common Components Patterns

### Majority Patterns Identified:

1. **Context Files**:
   - 3/5 plugins มี context file (SKILL.md หรือ GEMINI.md)
   - Pattern: ไฟล์ markdown ที่ root อธิบาย plugin โดยรวม
   - **Majority**: SKILL.md (2/5) หรือ GEMINI.md (1/5)

2. **Commands**:
   - 3/5 plugins มี commands/ directory
   - Format: `.toml` (pickle-rick) หรือ `.md` (story-studio, command-creator)
   - **Majority**: `.md` files (2/3)

3. **Skills**:
   - 3/5 plugins มี skills/ directory
   - Pattern: `skills/<skill-name>/SKILL.md`
   - **Majority**: skills/*/SKILL.md (3/3)

4. **Hooks**:
   - 2/5 plugins มี hooks/ directory
   - Pattern: `hooks.json` + scripts (.sh/.ps1)
   - **Majority**: hooks.json + shell scripts

5. **Scripts**:
   - 3/5 plugins มี scripts/ directory
   - Pattern: Shell scripts (.sh) หรือ JavaScript (.js)
   - **Majority**: Mixed (.sh, .js, .ps1)

6. **References**:
   - 3/5 plugins มี references/ directory
   - Pattern: Markdown documentation
   - **Majority**: references/*.md

7. **Agents**:
   - 1/5 plugins มี agents/ directory (story-studio)
   - Pattern: `agents/<agent-name>.md`

8. **Themes**:
   - 1/5 plugins มี themes/ directory (pickle-rick)

9. **Resources**:
   - 1/5 plugins มี resources/ directory (pickle-rick)

---

## Common Config Patterns

### Config Files Found:

1. **gemini-extension.json** (pickle-rick)

   ```json
   {
     "name": "pickle-rick",
     "version": "0.1.0",
     "contextFileName": "GEMINI.md"
   }
   ```

2. **.claude-plugin/** (story-studio)
   - Directory แทนไฟล์

3. **No config** (agent-browser, ibl1nk, command-creator)
   - 3/5 plugins ไม่มี config file เลย

### Majority Pattern: **ไม่มี config file มาตรฐาน** (3/5)

---

## Majority Directory Structures

### Most Common Directories (by frequency):

1. **skills/** - 3/5 plugins
2. **commands/** - 3/5 plugins
3. **references/** - 3/5 plugins
4. **scripts/** - 3/5 plugins
5. **hooks/** - 2/5 plugins
6. **agents/** - 1/5 plugins
7. **themes/** - 1/5 plugins
8. **resources/** - 1/5 plugins
9. **templates/** - 1/5 plugins
10. **evals/** - 1/5 plugins

### Majority Structure (出現在 3+ plugins):

```
plugins/<plugin-name>/
├── <CONTEXT>.md           # SKILL.md หรือ GEMINI.md (3/5)
├── commands/              # 3/5
├── skills/                # 3/5
│   └── */SKILL.md
├── scripts/               # 3/5
├── references/            # 3/5
└── hooks/                 # 2/5 (เกือบ 3/5)
```

---

## Majority File Naming Conventions

### Commands:

- **Format**: `.md` (2/3) หรือ `.toml` (1/3)
- **Naming**: kebab-case (e.g., `create-board.md`, `pickle-prd.toml`)

### Skills:

- **Format**: `skills/<skill-name>/SKILL.md`
- **Naming**: kebab-case สำหรับ directory name

### Hooks:

- **Config**: `hooks.json`
- **Scripts**: kebab-case.sh หรือ kebab-case.ps1

### Scripts:

- **Shell**: kebab-case.sh
- **JavaScript**: kebab-case.js
- **PowerShell**: kebab-case.ps1

### Agents:

- **Format**: `agents/<agent-name>.md`
- **Naming**: kebab-case

### References:

- **Format**: `references/<topic>.md`
- **Naming**: kebab-case

---

## Summary

### What Exists (Majority):

- **Context File**: SKILL.md หรือ similar (3/5)
- **Commands**: commands/*.md (3/5)
- **Skills**: skills/*/SKILL.md (3/5)
- **Scripts**: scripts/*.sh หรือ *.js (3/5)
- **References**: references/*.md (3/5)
- **Hooks**: hooks/*.json + scripts (2/5)

### What's Missing (Minority):

- **Config File**: 3/5 plugins ไม่มี config file
- **Agents**: 4/5 plugins ไม่มี agents/
- **Themes**: 4/5 plugins ไม่มี themes/
- **Tests**: 5/5 plugins ไม่มี tests/ directory!

### Standard Should Be:

Based on majority patterns + requirements:

```
plugins/<plugin-name>/
├── bl1nk.jsonc              # NEW: Config standard
├── <CONTEXT>.md             # EXISTING: Context file (SKILL.md style)
├── README.md                # EXISTING: Human docs
├── agents/                  # EXISTING (if any)
├── commands/                # EXISTING: commands/*.md
├── skills/                  # EXISTING: skills/*/SKILL.md
├── tools/                   # NEW: For tools/scripts
├── hooks/                   # EXISTING: hooks/*.json + scripts
├── scripts/                 # EXISTING: Shared scripts
├── resources/               # EXISTING (if any)
├── themes/                  # EXISTING (if any)
├── references/              # EXISTING: Reference docs
└── tests/                   # NEW: Tests (required)
```
