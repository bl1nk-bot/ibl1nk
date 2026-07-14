# <Plugin Name> Context

> Brief one-line description of what this plugin does.

## Overview

**Plugin ID**: `<plugin-name>`  
**Version**: `0.1.0`  
**Type**: [Built-in | Extension | Agent | Tool]  
**Description**: Detailed description of the plugin's purpose and functionality.

## Components

This plugin provides the following components:

### Agents
- **[Agent Name]** (`agents/<name>.md`) - Role/persona description
  - **Purpose**: What this agent does
  - **Triggers**: When it activates
  - **Capabilities**: What it can do

### Commands
- **[Command Name]** (`commands/<name>.toml`) - Command description
  - **Usage**: How to invoke
  - **Parameters**: Expected inputs
  - **Examples**: Usage examples

### Skills
- **[Skill Name]** (`skills/<name>/SKILL.md`) - Skill description
  - **Expertise**: What domain this skill covers
  - **Triggers**: When to use this skill (1-5 triggers)
  - **Guidelines**: How to perform the skill

### Tools
- **[Tool Name]** (`tools/<name>` or `scripts/<name>`) - Tool description
  - **Interface**: How it's invoked (CLI, MCP, etc.)
  - **Inputs/Outputs**: Expected data format
  - **Dependencies**: External requirements

### Hooks
- **[Hook Name]** (`hooks/<name>.json`) - Event-driven script
  - **Event**: When it triggers (BeforeAgent, AfterModel, etc.)
  - **Action**: What it does
  - **Context**: What data it receives

## Usage

### Getting Started
1. Step one
2. Step two
3. Step three

### Configuration
```jsonc
{
  // Example configuration
  "setting": "value"
}
```

### Examples

#### Example 1: Basic Usage
```
# Show how to use the plugin in a simple scenario
```

#### Example 2: Advanced Usage
```
# Show more complex usage patterns
```

## Integration Points

### External Services
- **Service Name**: How this plugin integrates
- **API Endpoints**: What APIs it calls
- **Authentication**: How it authenticates

### Internal Systems
- **Database**: What tables/collections it uses
- **tRPC Routers**: What API endpoints it exposes
- **Frontend**: What UI components it provides

## Testing

### Test Structure
```
tests/
├── unit/          # Unit tests for isolated functions
├── integration/   # Integration tests with other systems
├── component/     # Component tests for agents/skills/tools
└── e2e/          # End-to-end tests for user flows
```

### Running Tests
```bash
# Command to run tests
npm test

# Command to run specific test type
npm run test:unit
npm run test:integration
npm run test:component
npm run test:e2e
```

### Coverage
- **Required Coverage**: ≥80%
- **Current Coverage**: XX%

## Troubleshooting

### Common Issues
1. **Issue**: Description
   - **Cause**: What causes it
   - **Solution**: How to fix it

### Debug Mode
```bash
# How to enable debug logging
```

## Changelog

### Version 0.1.0 (YYYY-MM-DD)
- Initial release
- Feature A
- Feature B

## References

- [Link to full documentation](...)
- [Link to related plugins](...)
- [Link to API reference](...)

---

**Last Updated**: YYYY-MM-DD  
**Maintainer**: @username
