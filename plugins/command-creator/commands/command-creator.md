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

# Command Creator

This skill helps you create, manage, and optimize custom Qwen Code commands.

## Quick Start: Command Basics

Commands are stored as markdown files and use three injection mechanisms:

| Syntax | Purpose | Example |
|--------|---------|---------|
| `@{path}` | Inject file/directory content | `@{src/main.py}` |
| `!{command}` | Execute shell command | `!{git diff --staged}` |
| `{{args}}` | Accept user parameters | `Review {{args}}` |

## Creating a New Command

### Step 1: Determine Scope

Choose where to store the command:

- **Global** (all projects): `~/.qwen/commands/`
- **Project-specific**: `<project>/.qwen/commands/`

Project commands override global commands with the same name.

### Step 2: Design the Command Structure

1. **Choose a namespace**: Organize commands using directories
   - `git/commit.md` → `/git:commit`
   - `test/unit.md` → `/test:unit`
   - `review/pr.md` → `/review:pr`

2. **Define the purpose**: What should this command accomplish?

3. **Identify inputs**:
   - Does it need file context? → Use `@{}`
   - Does it need shell output? → Use `!{}`
   - Does it need user parameters? → Use `{{args}}`

### Step 3: Create the Command File

Create the markdown file with this structure:

```markdown
---
description: Brief description shown in /help
---

# Clear instructions for the AI

Context:
@{relevant-file.md}

Task: {{args}}

Additional data:
!{shell-command}
```

## Command Templates

### Template 1: Code Generator

```markdown
---
description: Generate code based on specifications
---
Generate code based on the following requirements:

{{args}}

Reference the coding standards:
@{docs/standards.md}

Current project structure:
!{ls -la}

Requirements:
1. Follow best practices
2. Include error handling
3. Add type hints
4. Write docstrings
```

### Template 2: Code Reviewer

```markdown
---
description: Review code for quality and best practices
---
Review the following code:

@{{file_path}}

Standards to check against:
@{docs/review-checklist.md}

Provide:
- Security issues found
- Performance improvements
- Code quality suggestions
- Specific line recommendations
```

### Template 3: Git Workflow

```markdown
---
description: Create git commit from staged changes
---
Create a commit message based on these changes:

```diff
!{git diff --staged}
```

Follow conventional commits format.
```

## Best Practices

1. **Always include `description`** in YAML frontmatter for `/help` visibility
2. **Use namespaces** to organize commands logically
3. **Keep commands focused** - one command, one purpose
4. **Test commands** before sharing or deploying
5. **Document dependencies** - if a command needs specific files or tools

## Security Guidelines

- `!{}` commands require user confirmation before execution
- Parameters are auto-escaped to prevent injection
- Sensitive operations should include explicit warnings
- Never include hardcoded secrets or credentials

## Common Patterns

### Pattern: Multi-file Context

```markdown
---
description: Analyze code with full context
---
Analyze this code with full project context:

Main file:
@{src/main.py}

Related module:
@{src/utils.py}

Project structure:
!{tree -L 2}

Task: {{args}}
```

### Pattern: Conditional Parameters

If `{{args}}` is omitted, user input appends after two line breaks. If no input provided, command runs as-is.

### Pattern: Namespace Organization

```
commands/
├── test/
│   ├── unit.md      → /test:unit
│   └── integration.md → /test:integration
├── refactor/
│   ├── pure.md      → /refactor:pure
│   └── optimize.md  → /refactor:optimize
└── docs/
    └── api.md       → /docs:api
```

## Workflow Steps

When creating a command, follow this sequence:

1. **Clarify the use case** - What problem does this solve?
2. **Design the template** - What inputs and outputs are needed?
3. **Create the file** - Set up proper path and structure
4. **Test the command** - Verify it works as expected
5. **Refine** - Adjust based on test results

## Troubleshooting

- **Command not appearing in `/help`**: Check `description` in frontmatter
- **File content not injecting**: Verify file path is correct and accessible
- **Shell command failing**: Check command syntax and permissions
- **Parameters not working**: Ensure `{{args}}` syntax is correct (double braces)

## Next Steps

When working with this skill:
1. Define what command you want to create
2. I'll help design the structure and template
3. Create the file in the correct location
4. Test and refine until it works perfectly
