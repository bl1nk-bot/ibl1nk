# Plugin Architecture & Discovery Standards

## Overview

เอกสารนี้กำหนดสถาปัตยกรรมและตำแหน่งของ plugins สำหรับระบบ ibl1nk

**หลักการสำคัญ:**
- ibl1nk เป็น **Host System** ที่อ่าน plugins โดยตรง
- plugins/ ใน repo นี้คือ **Built-in plugins** (ไม่ใช่ third-party)
- SDK คือ **Standard Format** ที่กำหนดวิธีที่ระบบอ่านและเข้าใจ plugins
- CLI tools อื่น (Claude Code, Gemini CLI, etc.) จะสร้าง adapter มาเชื่อมกับ standard ของเรา

## Architecture Model

```
┌─────────────────────────────────────────────────┐
│              ibl1nk Host System                  │
│                                                   │
│  ┌─────────────────────────────────────┐        │
│  │         Plugin Discovery             │        │
│  │  (อ่าน plugins/ โดยตรง)              │        │
│  └──────────┬──────────────────────────┘        │
│             │                                     │
│  ┌──────────▼──────────────────────────┐        │
│  │         Plugin SDK                   │        │
│  │  (Standard Format & Validation)      │        │
│  └──────────┬──────────────────────────┘        │
│             │                                     │
│  ┌──────────▼──────────────────────────┐        │
│  │         Plugin Runtime               │        │
│  │  (Register components)               │        │
│  └─────────────────────────────────────┘        │
└─────────────────────────────────────────────────┘
              ↕ Adapter Interface
┌─────────────────────────────────────────────────┐
│    External CLIs (Claude Code, Gemini, etc.)    │
│    - สร้าง adapter มาเชื่อมกับ standard ของเรา   │
└─────────────────────────────────────────────────┘
```

## Directory Layout

### Built-in Plugins (Source & Runtime)

```
<repo-root>/plugins/
├── agent-browser/              # Built-in plugin
│   ├── bl1nk.jsonc             # Config (required)
│   ├── AGENTS.md               # Context file (required)
│   ├── agents/                 # Agent definitions
│   ├── commands/               # Command definitions
│   ├── skills/                 # Skills
│   └── ...
├── ibl1nk/                     # Built-in plugin (core)
├── pickle-rick-extension/      # Built-in plugin
├── story-studio/               # Built-in plugin
└── command-creator/            # Built-in plugin
```

**ตำแหน่ง:** `<repo-root>/plugins/` เท่านั้น  
**การค้นพบ:** ระบบอ่านโดยตรง ไม่มี install step  
**วัตถุประสงค์:** Built-in features ที่มาพร้อมกับระบบ

### Standards & Templates

```
<repo-root>/conductor/
├── standards/
│   ├── plugin-architecture-and-locations.md   # เอกสารนี้
│   ├── plugin-config-schema.json              # JSON Schema
│   └── plugin-sdk-design.md                   # SDK API design
└── templates/
    ├── plugin-config.jsonc                     # Config template
    ├── plugin-context.md                       # Context file template
    └── plugin-components/
        ├── agent.md
        ├── command.md
        └── skill.md
```

## Plugin Discovery Process

### How System Discovers Plugins

```typescript
// Pseudo-code: Discovery algorithm
async function discoverPlugins(): Promise<Plugin[]> {
  const pluginsDir = path.join(repoRoot, 'plugins');
  const plugins: Plugin[] = [];
  
  // Scan each directory in plugins/
  for (const entry of await fs.readdir(pluginsDir)) {
    const pluginPath = path.join(pluginsDir, entry);
    const configPath = path.join(pluginPath, 'bl1nk.jsonc');
    
    // Check if it's a valid plugin (has bl1nk.jsonc)
    if (await fs.exists(configPath)) {
      const config = await readConfig(configPath);
      const validated = await validateConfig(config);
      
      if (validated.valid) {
        plugins.push({
          name: config.name,
          path: pluginPath,
          config: config,
        });
      }
    }
  }
  
  return plugins;
}
```

### Discovery Rules

1. **Scan:** `<repo-root>/plugins/` เท่านั้น
2. **Identify:** Directory ที่มี `bl1nk.jsonc`
3. **Validate:** Config ผ่าน schema validation
4. **Load:** Register all components (agents, commands, skills, etc.)
5. **Priority:** Built-in plugins โหลดทั้งหมด (ไม่มี priority conflicts)

### Plugin Loading Flow

```
Startup
  ↓
1. Scan plugins/ directory
  ↓
2. For each directory with bl1nk.jsonc:
   a. Read config
   b. Validate against schema
   c. Resolve component paths (relative to plugin dir)
   d. Load context file (AGENTS.md or equivalent)
  ↓
3. Register all components to system
  ↓
4. Ready for use
```

## Component Types

### 1. Agents (`agents/*.md`)
- **Purpose:** กำหนด roles/personas
- **Format:** Markdown
- **Discovery:** Glob pattern จาก `bl1nk.jsonc`

### 2. Commands (`commands/*.toml` or `commands/*.md`)
- **Purpose:** Slash commands หรือ automated actions
- **Format:** TOML หรือ Markdown
- **Discovery:** Glob pattern จาก `bl1nk.jsonc`

### 3. Skills (`skills/*/SKILL.md`)
- **Purpose:** Domain-specific expertise
- **Format:** Markdown (แต่ละ skill มี directory ตัวเอง)
- **Discovery:** Glob pattern จาก `bl1nk.jsonc`

### 4. Tools (`tools/*` or `scripts/*`)
- **Purpose:** Executable scripts หรือ MCP servers
- **Format:** Shell, JavaScript, Python, etc.
- **Discovery:** Glob pattern จาก `bl1nk.jsonc`

### 5. Hooks (`hooks/*.json`)
- **Purpose:** Event-driven scripts
- **Format:** JSON config + script files
- **Discovery:** Glob pattern จาก `bl1nk.jsonc`

## External Adapter Interface

### How Other CLIs Connect

```
Claude Code / Gemini CLI / Qwen Code / etc.
         ↓
    [Adapter Layer]
         ↓
    bl1nk SDK Standard
         ↓
    <repo>/plugins/
```

### Adapter Requirements

External CLI ที่ต้องการเชื่อมต่อกับ ibl1nk plugins ต้อง:

1. **Implement Adapter** ที่แปลง format ของเราเป็น format ของ CLI นั้น
2. **Read plugins/** จาก repo ของเรา
3. **Validate** ใช้ schema ของเรา (`plugin-config-schema.json`)
4. **Discover** ใช้ discovery algorithm เดียวกัน
5. **Register** components เข้าระบบของ CLI นั้น

### Example: Claude Code Adapter

```typescript
// Pseudo-code: Claude Code adapter for ibl1nk plugins
class ClaudeCodeAdapter {
  async loadIbl1nkPlugins(repoRoot: string) {
    const plugins = await discoverPlugins(repoRoot);
    
    for (const plugin of plugins) {
      // Convert ibl1nk skills to Claude Code skills
      for (const skillPath of plugin.config.components.skills) {
        const skill = await loadSkill(skillPath);
        await claudeCode.registerSkill({
          name: skill.name,
          description: skill.description,
          triggers: skill.triggers,
        });
      }
      
      // Convert ibl1nk commands to Claude Code commands
      for (const cmdPath of plugin.config.components.commands) {
        const cmd = await loadCommand(cmdPath);
        await claudeCode.registerCommand({
          name: cmd.name,
          handler: cmd.handler,
        });
      }
    }
  }
}
```

## SDK Responsibilities

### bl1nk SDK ต้องทำ:

1. **Read Config** - อ่าน `bl1nk.jsonc` จาก plugin directory
2. **Validate** - ตรวจสอบAgainst JSON Schema
3. **Resolve Paths** - Convert relative paths → absolute paths
4. **Substitute Env** - แทนที่ environment variables
5. **Discover** - Scan `plugins/` directory
6. **Load** - โหลด components ทั้งหมด
7. **Register** - ลงทะเบียนกับระบบ

### bl1nk SDK ไม่ทำ:

1. ❌ ไม่ install plugins (plugins มา built-in)
2. ❌ ไม่ download จาก network
3. ❌ ไม่ manage user preferences
4. ❌ ไม่ handle version updates
5. ❌ ไม่ create uninstall mechanisms

## Testing Strategy

### Unit Tests
- Config reading & parsing
- Schema validation
- Path resolution
- Env variable substitution
- Error handling

### Integration Tests
- Full discovery flow (scan → read → validate → load)
- Plugin loading with real plugins
- Component registration

### E2E Tests
- System startup with all plugins
- All features work correctly
- No conflicts between plugins

---

**Version**: 1.0.0  
**Last Updated**: 2026-04-09  
**Status**: Approved
