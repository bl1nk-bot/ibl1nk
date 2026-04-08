# Standard Component Templates

## Overview

นี่คือ templates มาตรฐานสำหรับแต่ละ component type ใน plugins

---

## 1. Agent Template

**Location**: `agents/<agent-name>.md`

**Purpose**: กำหนดบทบาท/อาชีพของ agent

**Template**:

```markdown
# <Agent Name>

## Role

<Brief description of the agent's role and responsibilities>

## Personality

<Tone, voice, and behavioral traits>

## Capabilities

- <Capability 1>
- <Capability 2>
- <Capability 3>

## Workflow

### When to Activate

<Conditions or triggers that should activate this agent>

### Step-by-Step Process

1. **Step 1**: <Description>
2. **Step 2**: <Description>
3. **Step 3**: <Description>

## Examples

### Example 1: <Use Case>

<Input>
<Expected output>

### Example 2: <Use Case>

<Input>
<Expected output>

## Constraints

- <Limitation or rule 1>
- <Limitation or rule 2>
```

**Example** (จาก story-studio/agents/lead-writer.md):

```markdown
# Lead Writer

## Role

Primary content creator responsible for writing and developing story episodes.

## Personality

- Creative and imaginative
- Detail-oriented
- Collaborative (works with editor and context-manager)

## Capabilities

- Write episode content based on outlines
- Develop character dialogue
- Create scene descriptions
- Maintain story consistency

## Workflow

### When to Activate

- When starting a new episode
- When editor requests revisions
- When additional content is needed

### Step-by-Step Process

1. Read episode outline and context
2. Draft episode content
3. Review for consistency
4. Submit to editor for review

## Examples

### Example: Write Episode Opening

Input: "Episode 1: The Awakening - Opening scene"
Output: <Generated episode content>

## Constraints

- Must follow established story outline
- Must maintain character voices
- Must respect content guidelines
```

---

## 2. Command Template (Markdown)

**Location**: `commands/<command-name>.md`

**Purpose**: กำหนดคำสั่งอัตโนมัติ

**Template**:

```markdown
# <Command Name>

## Description

<One sentence describing what this command does>

## Usage

```
<command-syntax>
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `<param1>` | string | Yes | <Description> |
| `<param2>` | number | No | <Description, default: X> |

## Examples

### Basic Usage

```
<example command>
```

### Advanced Usage

```
<example with parameters>
```

## Implementation Notes

<Any technical details for implementers>
```

**Example**:

```markdown
# Create Board

## Description

Create a new story board with initial structure and contexts.

## Usage

```
/create-board <project-name> [--template <template-name>]
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project-name` | string | Yes | Name of the new project |
| `--template` | string | No | Template to use (default: "default") |

## Examples

### Basic Usage

```
/create-board "My Novel"
```

### Advanced Usage

```
/create-board "Fantasy Epic" --template "fantasy-world"
```

## Implementation Notes

- Creates initial board structure
- Sets up default agents and commands
- Initializes context files
```

---

## 3. Command Template (TOML)

**Location**: `commands/<command-name>.toml`

**Purpose**: กำหนดคำสั่งในรูปแบบ TOML (สำหรับระบบที่ต้องการ structured config)

**Template**:

```toml
# <Command Name>

description = "<One sentence describing what this command does>"

# Command prompt/instructions
prompt = """
<Full command instructions and behavior>
"""

# Optional: Command arguments
[arguments]
# Define arguments if needed
```

**Example** (จาก pickle-rick):

```toml
description = "Start the Pickle Rick iterative development loop (Manager Mode)"

prompt = """
Please announce what you are doing.
You are initiating Pickle Rick - the ultimate coding agent.

**Step 0: Persona Injection**
First, you **MUST** activate your persona.
Call `activate_skill("load-pickle-persona")` **IMMEDIATELY**.

**Step 1: Initialization**
Run the setup script to initialize the loop state:
\`\`\`bash
bash "\${extensionPath}/scripts/setup.sh" \$ARGUMENTS
\`\`\`

**Step 2: Execution (Management)**
After setup, read the output to find the path to `state.json`.
Read that state file.
You are now in the **Pickle Rick Manager Lifecycle**.
"""
```

---

## 4. Skill Template

**Location**: `skills/<skill-name>/SKILL.md`

**Purpose:** กำหนดความเชี่ยวชาญพิเศษที่มี triggers

**Template**:

```markdown
---
name: <skill-name>
description: <Short description (1-2 sentences)>
---

# <Skill Name>

## Overview

<Detailed description of what this skill does and when to use it>

## Triggers

<1-5 triggers ตามลำดับความเชี่ยวชาญ>

1. <Primary trigger - most common>
2. <Secondary trigger>
3. <Tertiary trigger>
4. <Advanced trigger>
5. <Expert trigger>

## Capabilities

- <Capability 1>
- <Capability 2>
- <Capability 3>

## Usage

### Basic Usage

```
<How to activate and use this skill>
```

### Examples

#### Example 1: <Common Use Case>

<Input/Context>
<Expected behavior/output>

#### Example 2: <Advanced Use Case>

<Input/Context>
<Expected behavior/output>

## Implementation Details

<Any technical notes for developers>

### Dependencies

- <Dependency 1>
- <Dependency 2>

### Configuration

<If skill requires configuration>

## References

- [Related skill 1](../related-skill-1/SKILL.md)
- [External documentation](https://...)
```

**Example** (adapted from agent-browser/SKILL.md):

```markdown
---
name: browser-automation
description: Browser automation CLI for AI agents to interact with websites
---

# Browser Automation

## Overview

This skill enables automated browser interaction including navigation, form filling, clicking, data extraction, and screenshot capture.

## Triggers

1. User asks to open a website or navigate to a URL
2. User needs to fill out a form or submit data online
3. User wants to scrape data from a webpage
4. User needs to test a web application
5. User wants to automate browser tasks or workflows

## Capabilities

- Navigate to URLs and wait for page load
- Snapshot interactive elements with refs
- Click buttons, links, and interactive elements
- Fill form fields and submit forms
- Extract text and data from pages
- Capture screenshots and PDFs
- Manage multiple browser sessions

## Usage

### Basic Usage

\`\`\`
activate_skill("browser-automation")

agent-browser open https://example.com
agent-browser snapshot -i
agent-browser click @e1
\`\`\`

### Examples

#### Example 1: Form Automation

Input: "Fill out the signup form at example.com"
Behavior:
1. Navigate to example.com
2. Snapshot to get form refs
3. Fill each field
4. Submit form
5. Verify success

#### Example 2: Data Extraction

Input: "Get all product names from example.com/products"
Behavior:
1. Navigate to products page
2. Extract text content
3. Return structured data

## Implementation Details

### Dependencies

- agent-browser CLI must be installed
- Browser (Chrome/Chromium) available

### Configuration

\`\`\`env
BROWSER_PATH=/path/to/browser  # optional
BROWSER_ARGS=--no-sandbox      # optional
\`\`\`

## References

- [Snapshot refs lifecycle](references/snapshot-refs.md)
- [Session management](references/session-management.md)
- [Authentication patterns](references/authentication.md)
```

---

## 5. Tool Template

**Location**: `tools/<tool-name>.<ext>`

**Purpose**: Scripts/tools ที่ส่ง output ผ่าน JSON-RPC หรือ stdio

**Template** (Shell Script):

```bash
#!/usr/bin/env bash
# <Tool Name>
#
# Description: <One sentence describing what this tool does>
#
# Usage: <tool-name> [options] <args>
#
# Input: <Expected input format>
# Output: JSON-RPC or stdio format

set -euo pipefail

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --option1)
      OPTION1="$2"
      shift 2
      ;;
    --help)
      echo "Usage: <tool-name> [options] <args>"
      echo ""
      echo "Options:"
      echo "  --option1 <value>  Description"
      echo "  --help             Show this help"
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      exit 1
      ;;
  esac
done

# Main logic
main() {
  # Tool implementation
  local result="{\"status\": \"success\", \"data\": {}}"
  echo "$result"
}

main "$@"
```

**Template** (JSON-RPC Tool):

```bash
#!/usr/bin/env bash
# JSON-RPC Tool Template
#
# Input: JSON-RPC 2.0 request via stdin
# Output: JSON-RPC 2.0 response via stdout

set -euo pipefail

# Read JSON-RPC request
read -r request

# Parse request (requires jq)
method=$(echo "$request" | jq -r '.method')
params=$(echo "$request" | jq -r '.params')
id=$(echo "$request" | jq -r '.id')

# Route to handler
case "$method" in
  "method1")
    result=$(handle_method1 "$params")
    ;;
  "method2")
    result=$(handle_method2 "$params")
    ;;
  *)
    result=$(echo "{\"jsonrpc\":\"2.0\",\"error\":{\"code\":-32601,\"message\":\"Method not found\"},\"id\":$id}")
    ;;
esac

# Send response
echo "$result"

# Handlers
handle_method1() {
  local params="$1"
  # Implementation
  echo "{\"jsonrpc\":\"2.0\",\"result\":{},\"id\":$id}"
}

handle_method2() {
  local params="$1"
  # Implementation
  echo "{\"jsonrpc\":\"2.0\",\"result\":{},\"id\":$id}"
}
```

---

## 6. Hook Template

**Location**: `hooks/<hook-name>.sh` + `hooks/hooks.json`

**Purpose**: Scripts ที่ทำงานตาม events

**hooks.json Template**:

```json
{
  "hooks": {
    "<EventName>": [
      {
        "matcher": "<pattern to match when hook should run>",
        "hooks": [
          {
            "name": "<hook-name>",
            "type": "command",
            "command": "bash ${extensionPath}/hooks/<hook-name>.sh",
            "description": "<What this hook does>"
          }
        ]
      }
    ]
  }
}
```

**Hook Script Template**:

```bash
#!/usr/bin/env bash
# <Hook Name>
#
# Event: <EventName>
# Description: <What this hook does>

set -euo pipefail

# Hook logic
main() {
  # Read context from environment or stdin
  local context="${CONTEXT_VAR:-}"
  
  # Do something
  echo "Hook executed successfully"
  
  # Exit with appropriate code
  exit 0
}

main "$@"
```

**Example** (จาก pickle-rick):

```json
{
  "hooks": {
    "BeforeAgent": [
      {
        "matcher": "*",
        "hooks": [
          {
            "name": "increment-iteration",
            "type": "command",
            "command": "bash ${extensionPath}/hooks/increment-iteration.sh",
            "description": "Increments the iteration counter"
          }
        ]
      }
    ]
  }
}
```

---

## Validation Checklist

สำหรับแต่ละ component ที่สร้าง:

### Agent
- [ ] มี Header (ชื่อ + role)
- [ ] มี Personality section
- [ ] มี Capabilities list
- [ ] มี Workflow section
- [ ] มี Examples (อย่างน้อย 1)
- [ ] มี Constraints

### Command
- [ ] มี Description
- [ ] มี Usage syntax
- [ ] มี Parameters table (ถ้ามี params)
- [ ] มี Examples (อย่างน้อย 1)

### Skill
- [ ] มี frontmatter (name, description)
- [ ] มี Triggers (1-5 triggers)
- [ ] มี Capabilities list
- [ ] มี Usage section
- [ ] มี Examples (อย่างน้อย 1)
- [ ] ชื่อไฟล์ต้องเป็น `SKILL.md`

### Tool
- [ ] มี shebang line
- [ ] มี description comment
- [ ] มี usage instructions
- [ ] มี error handling
- [ ] Output เป็น JSON-RPC หรือ stdio

### Hook
- [ ] มี hooks.json config
- [ ] มี event name
- [ ] มี script ที่ทำงานได้
- [ ] มี error handling
