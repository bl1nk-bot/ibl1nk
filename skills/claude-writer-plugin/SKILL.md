---
name: claude-writer-plugin
description: Comprehensive writing assistant plugin for novelists and creative writers. Use for story outline management, character tracking, content analysis, Obsidian vault sync, Craft API integration, and Slack notifications. Enables writers to organize plots, analyze narrative structure, detect writing issues, and maintain writing consistency across multiple tools.
---

# Claude Writer Plugin

A complete writing management system that integrates Craft, Obsidian, AI analysis, and Slack to help novelists organize stories, track characters, analyze content, and maintain writing productivity.

## Core Capabilities

### 1. Story Outline Management

The plugin provides hierarchical story structure management with automatic synchronization to Craft Collections:

**Create and organize story outlines:**
- Create new outlines with title, description, and metadata
- Organize outlines into chapters (with numbering and status tracking)
- Break chapters into scenes (with scene numbers and word counts)
- Track status at each level: draft → in_progress → completed → archived
- Automatic word count aggregation from scenes to chapters to outlines

**API Usage:**
```
trpc.outlines.create({ title, description, craftDocumentId?, craftCollectionId? })
trpc.outlines.chapters({ outlineId })
trpc.outlines.createChapter({ outlineId, title, description, chapterNumber, status, order })
trpc.outlines.scenes({ chapterId })
trpc.outlines.storyOverview({ outlineId })
```

### 2. Character Management & Relationships

Comprehensive character database with relationship mapping:

**Character tracking features:**
- Store character name, description, traits (as JSON array), and role (protagonist/antagonist/supporting)
- Link characters to specific outlines or keep them global
- Track character relationships with relationship type and description
- Generate character relationship maps (visualized as Mermaid graphs)
- Support for character mentions detection in content

**API Usage:**
```
trpc.characters.create({ outlineId?, name, description, traits, role, craftCollectionItemId? })
trpc.characters.listByOutline({ outlineId })
trpc.characters.relationships({ characterId })
trpc.characters.addRelationship({ character1Id, character2Id, relationshipType, description })
```

### 3. Content Analysis & Writing Improvement

AI-powered analysis of narrative content:

**Analysis types supported:**
- Sentiment analysis (positive/negative/neutral/mixed)
- Keyword extraction and density analysis
- Spell check and grammar correction
- Hook/impact detection (identifies compelling passages)
- Theme and conflict identification
- Significance scoring (which scenes matter most)
- Rewriting suggestions for improvement

**Storage structure:**
- Results stored with analysisType, sentimentScore, keywordDensity, highlights, suggestions
- Can be scoped to outline, chapter, or scene level
- Timestamped for version tracking

### 4. Obsidian Vault Integration

Seamless synchronization with Obsidian vaults:

**Sync workflow:**
1. Configure vault path and file patterns
2. Extract outline from Markdown headings (H1→outline, H2→chapter, H3→scene)
3. Detect file changes via SHA256 hash comparison
4. Sync status tracking: pending → synced → failed → conflict
5. Bidirectional sync support (Obsidian→Craft and Craft→Obsidian)

### 5. Craft API Integration

Direct integration with Craft for document and collection management:

**Supported operations:**
- Create/read/update Craft Collections for story structure
- Manage Craft Documents for chapters and scenes
- Store Craft API credentials securely (encrypted tokens)
- Automatic token refresh handling
- Support for Craft Blocks (content blocks within documents)

### 6. Slack Integration

Real-time notifications and commands for writing workflow:

**Slack features:**
- Daily writing progress notifications
- Slash commands: `/claude-writer analyze`, `/claude-writer character`, `/claude-writer dashboard`
- Incoming webhooks for custom notifications
- Slack Events API for interactive workflows
- Optional Slack Workflow Canvas integration for advanced automation

### 7. Writing Progress Tracking

Granular tracking of writing productivity:

**Daily tracking:**
- Date-based entries (YYYY-MM-DD format)
- Words written per session
- Number of sessions completed
- Optional notes for each day
- 30-day rolling window analysis

### 8. Visual Dashboard

Interactive HTML dashboard with multiple views:

**Dashboard sections:**
- Writing progress charts (Chart.js)
- Story outline visualization (Mermaid flowchart)
- Character relationship maps (Mermaid graph)
- Character cards with traits and tags
- Story timeline with chapter summaries
- Content analysis summary cards
- Responsive design for mobile/tablet

## Workflow Integration

### Typical Writing Session

1. **Plan:** Create outline structure in dashboard
2. **Write:** Sync Obsidian vault to pull latest content
3. **Analyze:** Run content analysis on completed scenes
4. **Track:** Log daily progress and character updates
5. **Review:** Check dashboard for story overview and statistics
6. **Share:** Send dashboard snapshot to Slack for accountability

### Multi-Tool Workflow

```
Obsidian (writing)
    ↓ (sync)
Claude Writer Dashboard (organize)
    ↓ (extract)
Craft Collections (backup)
    ↓ (analyze)
AI Analysis Engine (improve)
    ↓ (notify)
Slack (accountability)
```

## Database Schema

### Core Tables

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `outlines` | Story structure | userId, title, status, wordCount, craftDocumentId |
| `chapters` | Chapters within outlines | outlineId, title, status, wordCount, order |
| `scenes` | Scenes within chapters | chapterId, title, status, wordCount, order |
| `characters` | Character database | userId, outlineId, name, traits, role |
| `characterRelationships` | Character connections | character1Id, character2Id, relationshipType |
| `contentAnalysis` | Analysis results | userId, outlineId/chapterId/sceneId, analysisType, sentimentScore |
| `writingProgress` | Daily tracking | userId, outlineId, date, wordsWritten, sessionsCompleted |
| `obsidianSync` | Sync metadata | userId, vaultPath, filePath, lastSyncedAt, fileHash, syncStatus |
| `craftCredentials` | Craft API tokens | userId, accessToken, refreshToken, tokenExpiresAt |
| `slackIntegration` | Slack OAuth tokens | userId, slackUserId, slackTeamId, accessToken |

## Configuration

### Required Environment Variables

```env
# Craft API
CRAFT_API_URL=https://api.craft.io
CRAFT_OAUTH_CLIENT_ID=<your-client-id>
CRAFT_OAUTH_CLIENT_SECRET=<your-client-secret>

# Obsidian (optional)
OBSIDIAN_VAULT_PATH=/path/to/vault

# Slack (optional)
SLACK_BOT_TOKEN=xoxb-...
SLACK_SIGNING_SECRET=<signing-secret>
SLACK_APP_ID=<app-id>

# AI Analysis
OPENAI_API_KEY=sk-...

# Database
DATABASE_URL=mysql://user:pass@host/db
```

## API Endpoints

All endpoints are tRPC procedures accessible via:
- Frontend: `trpc.outlines.*`, `trpc.characters.*`, etc.
- Backend: `appRouter.outlines.*`, `appRouter.characters.*`, etc.

### Outlines Router
- `outlines.list` - Get all outlines for user
- `outlines.get` - Get specific outline
- `outlines.create` - Create new outline
- `outlines.update` - Update outline
- `outlines.chapters` - Get chapters for outline
- `outlines.createChapter` - Add chapter
- `outlines.updateChapter` - Update chapter
- `outlines.scenes` - Get scenes for chapter
- `outlines.createScene` - Add scene
- `outlines.updateScene` - Update scene
- `outlines.storyOverview` - Get complete story overview

### Characters Router
- `characters.listByOutline` - Get characters in outline
- `characters.listByUser` - Get all user characters
- `characters.create` - Create character
- `characters.update` - Update character
- `characters.relationships` - Get character relationships
- `characters.addRelationship` - Create relationship

## Usage Examples

### Creating a Story Structure

```javascript
// Create outline
const outline = await trpc.outlines.create.mutate({
  title: "The Lost Kingdom",
  description: "A fantasy epic about rediscovering a hidden realm"
});

// Add chapters
const chapter1 = await trpc.outlines.createChapter.mutate({
  outlineId: outline.id,
  title: "The Awakening",
  chapterNumber: 1,
  order: 0
});

// Add scenes
const scene1 = await trpc.outlines.createScene.mutate({
  chapterId: chapter1.id,
  title: "The Dream",
  sceneNumber: 1,
  order: 0
});
```

### Managing Characters

```javascript
// Create character
const protagonist = await trpc.characters.create.mutate({
  outlineId: outline.id,
  name: "Aria",
  role: "protagonist",
  traits: JSON.stringify(["brave", "curious", "determined"])
});

// Add relationship
await trpc.characters.addRelationship.mutate({
  character1Id: protagonist.id,
  character2Id: mentor.id,
  relationshipType: "mentor",
  description: "Aria's guide and protector"
});
```

### Getting Story Overview

```javascript
const overview = await trpc.outlines.storyOverview.query({
  outlineId: outline.id
});

// Returns: { outline, chapters, characters, stats }
```

## Best Practices

1. **Regular Syncing:** Sync Obsidian vault daily to keep content up-to-date
2. **Consistent Naming:** Use consistent character and chapter naming across tools
3. **Analysis Frequency:** Run content analysis after completing each chapter
4. **Progress Tracking:** Log daily writing sessions for accurate productivity metrics
5. **Backup Strategy:** Regularly export to Craft Collections for backup
6. **Character Development:** Update character traits as they evolve in the story
7. **Relationship Mapping:** Keep character relationships current for consistency

## Future Enhancements

- Real-time collaboration features
- Advanced AI features (plot generation, character development suggestions)
- Mobile app support
- Export to multiple formats (PDF, EPUB, DOCX)
- Integration with more writing tools (Google Docs, Notion)
- Community features (writing groups, feedback)
- Subscription/premium features

## Support

For issues or feature requests, contact the development team or submit feedback through the dashboard.
