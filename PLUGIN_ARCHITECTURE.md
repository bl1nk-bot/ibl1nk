# Claude Writer Dashboard - Built-in Plugin Architecture

## Overview

Claude Writer Dashboard is a **Built-in Plugin** integrated into the Manus system that provides comprehensive writing management for novelists and creative writers. It combines story outline management, character tracking, content analysis, and multi-tool integration (Craft, Obsidian, Slack) into a unified platform.

## Plugin Type & Integration

**Plugin Classification:** Built-in Plugin (integrated into Manus core)
**Integration Level:** System-level with access to:
- Manus OAuth and user authentication
- Database (MySQL/TiDB)
- Built-in LLM services
- S3 file storage
- Built-in skills (visual-explainer)

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer (React)                    │
│  Dashboard | Outline Manager | Character Tracker | Settings  │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    API Layer (tRPC)                          │
│  Outlines | Characters | Analysis | Sync | Slack | Progress │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                  Business Logic Layer                        │
│  Craft API | Obsidian Sync | Content Analysis | Search      │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                  Data Access Layer                           │
│  Database Queries | S3 Storage | Cache Management           │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│              External Services Integration                   │
│  Craft API | Obsidian FS | Slack API | OpenAI LLM          │
└─────────────────────────────────────────────────────────────┘
```

## Database Schema

### Core Tables (10 tables)

| Table | Purpose | Key Relationships |
|-------|---------|------------------|
| `users` | User authentication | Primary key for all user-scoped data |
| `outlines` | Story structure root | Parent of chapters, characters, analysis |
| `chapters` | Story chapters | Child of outlines, parent of scenes |
| `scenes` | Story scenes | Child of chapters, subject of analysis |
| `characters` | Character database | Linked to outlines, has relationships |
| `characterRelationships` | Character connections | Links characters to each other |
| `contentAnalysis` | AI analysis results | Scoped to outline/chapter/scene |
| `writingProgress` | Daily tracking | User + outline scoped |
| `obsidianSync` | Vault sync metadata | User + file path scoped |
| `craftCredentials` | API credentials | User scoped, encrypted |
| `slackIntegration` | Slack OAuth tokens | User scoped, encrypted |

### SQL Migration Files

Migrations follow meaningful naming convention:
- `0000_create_users_table.sql` - User authentication (from template)
- `0001_create_writer_core_schema.sql` - All writer-specific tables (outlines, chapters, scenes, characters, analysis, sync, progress)

Future migrations should follow pattern:
- `002_create_craft_integration_tables.sql`
- `003_add_slack_webhook_storage.sql`
- `004_create_search_indexes.sql`

## API Routes (tRPC)

### Router Structure

```typescript
appRouter
├── auth (from template)
│   ├── me
│   └── logout
├── outlines (writer-specific)
│   ├── list
│   ├── get
│   ├── create
│   ├── update
│   ├── chapters
│   ├── createChapter
│   ├── updateChapter
│   ├── scenes
│   ├── createScene
│   ├── updateScene
│   └── storyOverview
├── characters (writer-specific)
│   ├── listByOutline
│   ├── listByUser
│   ├── create
│   ├── update
│   ├── relationships
│   └── addRelationship
├── analysis (to implement)
│   ├── analyze
│   ├── getResults
│   └── getSuggestions
├── obsidian (to implement)
│   ├── sync
│   ├── extractOutline
│   └── getSyncStatus
├── slack (to implement)
│   ├── authorize
│   ├── sendNotification
│   └── handleCommand
└── progress (to implement)
    ├── logSession
    ├── getStats
    └── getStreak
```

## Frontend Components

### Page Structure

```
/
├── /dashboard
│   ├── Writing Progress Chart
│   ├── Story Overview Stats
│   ├── Recent Activity
│   └── Quick Actions
├── /outlines
│   ├── Outline List
│   ├── Outline Editor
│   │   ├── Chapter Manager
│   │   └── Scene Manager
│   └── Story Visualization (Mermaid)
├── /characters
│   ├── Character List
│   ├── Character Editor
│   ├── Relationship Map (Mermaid)
│   └── Character Traits Editor
├── /analysis
│   ├── Analysis Results
│   ├── Sentiment Analysis
│   ├── Keyword Analysis
│   └── Suggestions
├── /search
│   ├── Full-text Search
│   ├── Character Search
│   └── Scene Search
└── /settings
    ├── Profile
    ├── Integrations (Craft, Obsidian, Slack)
    ├── Preferences
    └── Export/Backup
```

### Component Hierarchy

```
App
├── DashboardLayout
│   ├── Sidebar Navigation
│   ├── Header (with user profile)
│   └── Main Content Area
│       ├── Dashboard Page
│       ├── Outline Manager
│       ├── Character Tracker
│       ├── Analysis Viewer
│       ├── Search Interface
│       └── Settings Panel
└── Theme Provider (Cream/Editorial style)
```

## Integration Points

### Craft API Integration

**Purpose:** Backup and sync story structure to Craft Collections

**Flow:**
1. User creates outline in dashboard
2. System creates Craft Collection for outline
3. Each chapter creates Craft Document
4. Each scene creates Craft Block
5. Bidirectional sync keeps both systems in sync

**Endpoints Used:**
- Collections API (create, read, update)
- Documents API (create, read, update)
- Blocks API (create, read, update)

### Obsidian Vault Integration

**Purpose:** Sync Markdown files from Obsidian vault

**Flow:**
1. User configures vault path in settings
2. System reads Markdown files
3. Extracts outline from headings (H1→outline, H2→chapter, H3→scene)
4. Compares file hash to detect changes
5. Syncs new/updated content to dashboard
6. Optional: pushes updates back to Obsidian

**File Structure Expected:**
```
vault/
├── Story Name/
│   ├── 01_Chapter_Title.md (H1: Chapter 1, H2: Scene titles)
│   ├── 02_Chapter_Title.md
│   └── characters.md (H1: Characters, H2: Character names)
```

### Slack Integration

**Purpose:** Notifications and commands for accountability

**Features:**
- Daily writing progress notifications
- Slash commands: `/claude-writer dashboard`, `/claude-writer analyze`
- Incoming webhooks for custom notifications
- Slack Events API for interactive workflows

**Slack App Scopes Required:**
- `chat:write` - Send messages
- `commands` - Register slash commands
- `incoming-webhook` - Receive webhooks
- `users:read` - Get user info

### Content Analysis Integration

**Purpose:** AI-powered analysis of narrative content

**Analysis Types:**
1. **Sentiment Analysis** - Emotional tone of scenes
2. **Keyword Extraction** - Important concepts and themes
3. **Grammar & Spell Check** - Writing quality
4. **Hook Detection** - Compelling passages
5. **Theme Identification** - Story themes
6. **Significance Scoring** - Which scenes matter most

**LLM Integration:**
- Uses Manus built-in LLM (via `invokeLLM` helper)
- Structured output via JSON schema
- Caching for repeated analyses

## Visual Dashboard Generation

### Using visual-explainer Skill

**Purpose:** Generate beautiful, interactive dashboards from user data

**Dashboard Types:**
1. **Writing Progress Dashboard**
   - Weekly word count chart
   - Writing streak tracking
   - Goal progress visualization

2. **Story Structure Dashboard**
   - Outline flowchart (Mermaid)
   - Chapter breakdown
   - Scene timeline

3. **Character Dashboard**
   - Character cards with traits
   - Relationship map (Mermaid graph)
   - Character arc visualization

4. **Analysis Dashboard**
   - Sentiment trends
   - Keyword frequency
   - Writing quality metrics

**Export Options:**
- HTML (interactive, browser-viewable)
- PDF (printable, shareable)
- PNG (social media, quick share)

### Data Binding

Dashboard components receive data from tRPC procedures:
```typescript
// Frontend
const dashboardData = await trpc.outlines.storyOverview.query({ outlineId });
// Pass to visual-explainer for rendering
generateVisualDashboard(dashboardData, templateType);
```

## File Storage (S3)

### Storage Structure

```
s3://bucket/
├── users/{userId}/
│   ├── backups/
│   │   ├── outline_{outlineId}_{timestamp}.json
│   │   └── characters_{outlineId}_{timestamp}.json
│   ├── exports/
│   │   ├── dashboard_{timestamp}.html
│   │   ├── dashboard_{timestamp}.pdf
│   │   └── story_export_{timestamp}.epub
│   └── obsidian_sync/
│       ├── vault_snapshot_{timestamp}.zip
│       └── sync_log_{timestamp}.json
```

### Backup Strategy

- Automatic daily backups of outlines and characters
- Manual export of dashboards and stories
- Version control with timestamp
- 30-day retention policy (configurable)

## Security Considerations

### Authentication & Authorization

- Uses Manus OAuth for authentication
- Role-based access control (user/admin)
- User-scoped data isolation
- Protected procedures for sensitive operations

### Credential Management

- Craft API tokens encrypted at rest
- Slack OAuth tokens encrypted at rest
- Obsidian vault path stored securely
- Token refresh logic for expired credentials

### Data Privacy

- All user data stored in encrypted database
- S3 backups encrypted
- No personal data exposed in logs
- GDPR-compliant data deletion

## Performance Optimization

### Database Optimization

- Indexes on frequently queried columns (userId, outlineId, characterId)
- Pagination for large result sets
- Aggregation queries for statistics

### Caching Strategy

- Cache character relationships (5-minute TTL)
- Cache analysis results (1-hour TTL)
- Cache dashboard data (30-minute TTL)
- Invalidate on mutations

### Frontend Optimization

- Code splitting by route
- Lazy loading of heavy components
- Memoization of expensive computations
- Optimistic updates for instant feedback

## Testing Strategy

### Unit Tests

- Database query helpers
- Business logic functions
- Content analysis functions
- Search algorithms

### Integration Tests

- Full workflow: create outline → add chapters → sync to Craft
- Obsidian sync workflow
- Slack notification workflow
- Content analysis pipeline

### E2E Tests

- User creates story and tracks progress
- User syncs Obsidian vault
- User receives Slack notifications
- User exports dashboard

## Deployment

### Environment Configuration

**Required Environment Variables:**
```env
# Database
DATABASE_URL=mysql://...

# Craft API
CRAFT_API_URL=https://api.craft.io
CRAFT_OAUTH_CLIENT_ID=...
CRAFT_OAUTH_CLIENT_SECRET=...

# Obsidian (optional)
OBSIDIAN_VAULT_PATH=/path/to/vault

# Slack (optional)
SLACK_BOT_TOKEN=xoxb-...
SLACK_SIGNING_SECRET=...

# AI Analysis
OPENAI_API_KEY=sk-...

# S3 Storage
AWS_S3_BUCKET=...
AWS_REGION=...
```

### Deployment Checklist

- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] S3 bucket created and configured
- [ ] Craft OAuth app registered
- [ ] Slack app created and installed
- [ ] SSL certificates configured
- [ ] Monitoring and logging setup
- [ ] Backup strategy implemented
- [ ] Documentation updated

## Future Enhancements

1. **Real-time Collaboration** - Multiple writers working on same story
2. **Advanced AI** - Plot generation, character development suggestions
3. **Mobile App** - iOS/Android native apps
4. **Export Formats** - PDF, EPUB, DOCX export
5. **Community Features** - Writing groups, feedback system
6. **Subscription Model** - Premium features, analytics
7. **Integration Expansion** - Google Docs, Notion, Scrivener
8. **Offline Support** - Progressive Web App capabilities

## Support & Maintenance

- Regular security updates
- Performance monitoring
- User feedback collection
- Bug fixes and patches
- Documentation updates
- Community support forum

---

**Last Updated:** April 2026
**Plugin Version:** 1.0.0
**Manus Integration:** Built-in Plugin
