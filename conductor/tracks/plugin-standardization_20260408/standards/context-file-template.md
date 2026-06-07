# Standard Context File Template

## Overview

Context file คือไฟล์ markdown ที่ทำให้ AI agents/machines เข้าใจ plugin ของเรา นี่คือมาตรฐานที่กำหนด format และเนื้อหา

## File Naming

- ใช้ชื่อ: `<PLUGIN>.md` หรือ `PLUGIN.md` หรือ `CONTEXT.md`
- ตัวอย่าง: `AGENT-BROWSER.md`, `PICKLE-RICK.md`, `CONTEXT.md`
- **ห้าม**: ใช้ชื่อที่กำกวม เช่น `INFO.md`, `README.md` (README เป็น human docs)

## Required Sections

### 1. Header (Required)

```markdown
# <Plugin Name>

<Brief description: 1-2 sentences about what this plugin does>
```

### 2. Project Overview (Required)

```markdown
## Project Overview

<Paragraph explaining:
- What problem this plugin solves
- Main use cases
- Target users/agents
>
```

### 3. Key Components (Required)

```markdown
## Key Components

### 1. <Component Name>
- **Location**: `<path/to/component>`
- **Purpose**: <What it does>
- **Usage**: <How to use it>

### 2. <Component Name>
...
```

### 4. Usage (Required)

```markdown
## Usage

### Basic Usage

<Example of most common use case>

```bash
<command or example>
```

### Advanced Usage

<Example of advanced features>

```bash
<advanced command or workflow>
```
```

### 5. Configuration (If Applicable)

```markdown
## Configuration

<If plugin requires configuration, document:
- Environment variables
- Config files
- Required vs optional settings
- Default values
>

### Required Environment Variables

```env
API_KEY=your-api-key-here
ENDPOINT_URL=https://api.example.com
```

### Optional Settings

```jsonc
{
  "timeout": 30000,  // default: 30s
  "retries": 3       // default: 3
}
```
```

### 6. Examples (Required)

```markdown
## Examples

### Example 1: <Common Use Case>

<Step-by-step example with expected output>

### Example 2: <Another Use Case>

<Another example>
```

## Optional Sections

### API Reference

```markdown
## API Reference

<If plugin exposes APIs, document them here>

### API Name

- **Endpoint**: `<endpoint>`
- **Method**: `GET/POST/etc`
- **Parameters**: `<params>`
- **Response**: `<response format>`
```

### Troubleshooting

```markdown
## Troubleshooting

### Common Issues

**Issue**: <Description>
**Solution**: <How to fix>
```

### Dependencies

```markdown
## Dependencies

- **Plugin Dependencies**: <Other plugins required>
- **System Dependencies**: <System requirements>
- **Package Dependencies**: <npm packages, etc>
```

## Complete Template

```markdown
# <Plugin Name>

<Brief description>

## Project Overview

<Detailed overview>

## Key Components

### 1. <Component Name>
- **Location**: `<path>`
- **Purpose**: <What it does>
- **Usage**: <How to use>

## Usage

### Basic Usage

```bash
<example>
```

### Advanced Usage

```bash
<advanced example>
```

## Configuration

<If applicable>

## Examples

### Example 1: <Use Case>

<Example with output>

### Example 2: <Use Case>

<Another example>
```

## Examples from Existing Plugins

### Good Example: GEMINI.md (pickle-rick-extension)

✅ มี:
- Project Overview
- Key Components (Commands, Scripts, Skills)
- Usage examples
- Configuration info

### Good Example: SKILL.md (agent-browser)

✅ มี:
- Core workflow
- Essential commands
- Common patterns
- Examples
- References to deep-dive docs

## Validation Checklist

ก่อนใช้ context file เป็นมาตรฐาน, ตรวจสอบ:

- [ ] มี Header (ชื่อ + description)
- [ ] มี Project Overview
- [ ] มี Key Components section
- [ ] มี Usage section พร้อม examples
- [ ] มี Configuration section (ถ้าต้องการ config)
- [ ] มี Examples section (อย่างน้อย 2 examples)
- [ ] ไฟล์ชื่อถูกต้องและอยู่ใน root ของ plugin directory
- [ ] เนื้อหาอ่านแล้วเข้าใจ plugin ได้โดยไม่ต้องดูไฟล์อื่น
