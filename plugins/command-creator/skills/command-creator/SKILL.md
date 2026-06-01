---
name: command-creator
description: >
  Helps create, edit, and manage custom Qwen Code commands (slash commands). Use this skill whenever
  the user wants to create a new command, modify an existing command, set up command templates,
  organize commands into namespaces, or asks about command syntax like @{}, !{}, or {{args}}.
  Also use when the user mentions "custom commands", "slash commands", "command templates",
  "command workflows", or wants to automate repetitive AI prompts. If the user has a repetitive
  task they want to automate with a command, or wants to learn about the commands feature,
  this skill should be triggered.
---

# Command Creator Skill

This skill guides the creation and management of custom Qwen Code commands.

## Core Concepts

Commands are markdown files that define reusable AI behaviors. They live in:
- **Global**: `~/.qwen/commands/` (all projects)
- **Project**: `<project>/.qwen/commands/` (current project only, takes priority)

File paths map to command names: `git/commit.md` → `/git:commit`

## Three Injection Types

| Syntax | Purpose | When to Use |
|--------|---------|-------------|
| `@{path}` | Inject file/directory content | When you need code, docs, or config as context |
| `!{command}` | Execute shell command & inject output | When you need dynamic data (git status, file listings, etc.) |
| `{{args}}` | Accept user parameters | When the command needs custom input per use |

## Command Creation Workflow

### 1. Define the Purpose

Ask:
- What problem does this command solve?
- What information does it need? (files, shell output, user input)
- What should the output look like?

### 2. Design the Structure

```markdown
---
description: Short description for /help
---

# Instructions for the AI

## Context
@{relevant-files.md}

## Dynamic Data
!{shell-command}

## User Input
Task: {{args}}

## Requirements
1. Specific requirement 1
2. Specific requirement 2
```

### 3. Create the File

```bash
mkdir -p ~/.qwen/commands/<namespace>
# or for project-specific:
mkdir -p .qwen/commands/<namespace>

# Create the command file
```

### 4. Test and Refine

Test the command with various inputs and adjust the template based on results.

## Common Command Patterns

### Code Review Command

```markdown
---
description: Review code against standards
---
Review the following code for:
- Security vulnerabilities
- Performance issues
- Best practices violations
- Style guide compliance

Code to review:
@{{file_path}}

Standards reference:
@{docs/standards.md}

Provide specific line recommendations.
```

### Git Commit Generator

```markdown
---
description: Generate commit message from staged changes
---
Generate a conventional commit message based on these staged changes:

```diff
!{git diff --staged}
```

Follow conventional commits format (feat:, fix:, docs:, etc.)
Keep subject line under 72 characters.
```

### Test Generator

```markdown
---
description: Generate unit tests for code
---
Generate comprehensive unit tests for:

{{args}}

Source file:
@{source-file}

Existing tests (if any):
@{tests/test_file.py}

Requirements:
- Test happy path, edge cases, and error conditions
- Use the project's test framework
- Follow existing test patterns and style
```

## Best Practices

1. **Include `description`** — Required for `/help` visibility
2. **Use namespaces** — Organize by purpose (git/, test/, review/, etc.)
3. **Keep it focused** — One command per specific task
4. **Explain the why** — Tell the model why requirements matter, don't just list rules
5. **Test thoroughly** — Try with different inputs before considering it done

## Security Notes

- `!{}` commands require user confirmation before execution
- Parameters are auto-escaped against injection
- Never include secrets or credentials in commands
- Sensitive operations should include warnings

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Command not in `/help` | Add `description` to frontmatter |
| File not injecting | Check path is absolute or relative to command file |
| Shell errors | Verify command syntax and working directory |
| Args not working | Use double braces `{{args}}` not single `{args}` |

## When to Use This Skill

Use this skill when:
- Creating new custom commands
- Editing existing commands
- Organizing command structure
- Learning command syntax
- Troubleshooting command issues
- Setting up project-specific command libraries
