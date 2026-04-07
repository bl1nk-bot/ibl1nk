# Claude Writer Dashboard - Project TODO

## Architecture Overview

**Plugin Type:** Built-in Plugin (integrated into Manus system)
**Dashboard Generation:** Using visual-explainer skill for beautiful, interactive dashboards
**Data Export:** HTML/PDF export of visual stories and dashboards from user-tracked data
**SQL Naming:** Meaningful names indicating purpose (e.g., `001_create_outlines_chapters_scenes.sql`)

---

## Core Features

### 1. Database Schema & Data Models

- [x] Create Craft Collections schema for Chapters/Scenes (outline tracking)
- [x] Create Craft Collections schema for Characters with relationships
- [x] Create database tables for Obsidian file sync metadata
- [x] Create database tables for writing analysis results
- [x] Create database tables for Slack integration logs
- [ ] Rename SQL migration files with meaningful names (e.g., `001_create_outlines_chapters_scenes.sql`)
- [ ] Implement data versioning/backup system for S3

### 2. Craft API Integration

- [ ] Create Craft OAuth authentication flow
- [ ] Implement Craft API client wrapper for Collections CRUD
- [ ] Implement Craft API client for Documents management
- [ ] Implement Craft API client for Blocks (content) management
- [ ] Create helper functions for outline extraction from Craft Documents
- [ ] Create helper functions for character relationship mapping
- [ ] Add Craft credential encryption and token refresh logic
- [ ] Create Craft settings/configuration page

### 3. Obsidian Integration

- [ ] Implement file system access for Obsidian vault reading
- [ ] Create Markdown parser for heading extraction (H1, H2, H3)
- [ ] Implement file hash comparison for change detection
- [ ] Create bidirectional sync logic (Obsidian → Dashboard → Craft)
- [ ] Add conflict resolution for sync conflicts
- [ ] Implement file watcher for real-time sync

### 4. Content Analysis & AI Integration

- [ ] Implement sentiment analysis using LLM
- [ ] Implement keyword extraction and density analysis
- [ ] Implement spell check and grammar correction
- [ ] Implement hook/impact detection (compelling passages)
- [ ] Implement theme and conflict identification
- [ ] Implement significance scoring for scenes
- [ ] Create rewriting suggestion engine

### 5. Search Functionality

- [ ] Implement full-text search in story content
- [ ] Implement full-text search in Obsidian files
- [ ] Implement character search functionality
- [ ] Create search result ranking and filtering

### 6. Visual Dashboard (HTML-based with visual-explainer)

- [x] Design dashboard layout (editorial, minimalist style)
- [x] Implement writing progress charts (words/day, weekly stats)
- [x] Implement story outline visualization (Mermaid flowchart)
- [x] Implement character relationship map (Mermaid graph)
- [x] Implement content analysis summary cards
- [x] Implement error/correction statistics display
- [ ] Integrate visual-explainer skill for dynamic dashboard generation
- [ ] Add interactive elements (zoom, pan, filters)
- [ ] Implement dashboard export to HTML/PDF using visual-explainer
- [ ] Create visual story export (narrative + visuals)

### 7. Slack Integration

- [ ] Create Slack App configuration
- [ ] Implement Slack Incoming Webhooks for notifications
- [ ] Implement Slack Slash Commands (/claude-writer analyze, /character, /dashboard)
- [ ] Implement Slack Events API for interactive workflows
- [ ] Create Slack Workflow Canvas integration (optional)
- [ ] Add daily writing progress notifications
- [ ] Add character update notifications

### 8. Frontend UI Components (Mobile-First)

- [x] Refactor Dashboard for mobile-first design (DashboardMobile.tsx)
- [ ] Refactor Outlines for mobile-first design with mobile views
- [ ] Refactor Characters for mobile-first design with mobile views
- [x] Create Graph View for character relationships (CharacterGraphView.tsx)
- [x] Create Canvas/Whiteboard component (Canvas.tsx with drag-and-drop)
- [x] Add View toggles: Grid, List, Gallery views (ViewToggle.tsx)
- [x] Implement Grid View for characters/outlines (GridView.tsx)
- [x] Implement List View for characters/outlines (ListView.tsx)
- [x] Implement Gallery View for characters/outlines (GalleryView.tsx)
- [ ] Create writing progress logger
- [x] Create settings/configuration page (Settings.tsx with Craft/Obsidian/Slack)
- [ ] Implement responsive design scaling to tablet/desktop
- [x] Add Undo/Redo functionality to Canvas (useHistory hook)
- [x] Add Save to Craft button (CanvasWithTools.tsx)
- [x] Add Export feature (JSON export in CanvasWithTools)
- [x] Add Import feature (JSON import in CanvasWithTools)

### 9. Backend API Routes (tRPC)

- [x] Create procedures for outline CRUD
- [x] Create procedures for character CRUD
- [ ] Create procedures for canvas entry CRUD (save/load entries)
- [ ] Create procedures for export (JSON, PDF, EPUB)
- [ ] Create procedures for import (Craft, Obsidian, JSON)
- [ ] Create procedures for Craft sync (push to Collections) - UI ready, backend pending
- [ ] Create procedures for content analysis
- [ ] Create procedures for search
- [ ] Create procedures for Obsidian sync
- [ ] Create procedures for Slack integration
- [ ] Create procedures for dashboard data generation
- [ ] Create procedures for visual-explainer dashboard generation

### 10. File Storage (S3)

- [ ] Implement S3 upload for backups
- [ ] Implement S3 versioning system
- [ ] Create backup scheduling (optional)
- [ ] Implement S3 retrieval for recovery
- [ ] Add export functionality for dashboards/stories to S3

### 11. Built-in Plugin Development

- [ ] Create plugin manifest (plugin.json)
- [ ] Define plugin hooks and integration points
- [ ] Create plugin initialization logic
- [ ] Implement plugin configuration system
- [ ] Create plugin CLI commands (optional)
- [ ] Integrate with Manus system hooks
- [ ] Add plugin settings UI
- [ ] Test plugin with Manus environment

### 12. Visual-Explainer Integration

- [ ] Create visual-explainer templates for dashboard generation
- [ ] Create visual-explainer templates for story visualization
- [ ] Implement dynamic data binding for visual-explainer
- [ ] Create export pipelines (HTML → PDF)
- [ ] Add custom styling for writer-specific visuals
- [ ] Implement real-time dashboard updates

### 13. Testing & Quality Assurance

- [ ] Write unit tests for Craft API integration
- [ ] Write unit tests for content analysis functions
- [ ] Write unit tests for Obsidian sync logic
- [ ] Write integration tests for full workflows
- [ ] Test dashboard rendering with various data sizes
- [ ] Test visual-explainer export functionality
- [ ] Test Slack integration workflows
- [ ] Performance testing for large outlines

### 14. Documentation & Deployment

- [ ] Write API documentation
- [ ] Create user guide for dashboard
- [ ] Create admin guide for plugin configuration
- [ ] Document Craft/Obsidian/Slack setup instructions
- [ ] Create troubleshooting guide
- [ ] Prepare deployment checklist
- [ ] Create plugin release notes

---

## SQL Migration Files (Meaningful Naming Convention)

When creating SQL migrations, use this naming pattern:
- `001_create_outlines_chapters_scenes.sql` - Initial schema for story structure
- `002_create_characters_relationships.sql` - Character database and relationships
- `003_create_analysis_results.sql` - Content analysis storage
- `004_create_obsidian_sync_metadata.sql` - Obsidian vault sync tracking
- `005_create_craft_slack_credentials.sql` - API credential storage
- `006_create_writing_progress_tracking.sql` - Daily writing statistics

Each migration file should:
1. Have a sequential number (001, 002, etc.)
2. Clearly describe what tables/columns it creates or modifies
3. Include comments explaining the purpose of each table
4. Be idempotent (safe to run multiple times)

---

## Plugin Integration Points

### Manus System Hooks
- [ ] Register plugin with Manus plugin manager
- [ ] Implement lifecycle hooks (init, activate, deactivate)
- [ ] Add plugin to sidebar/menu
- [ ] Create plugin settings panel

### Built-in Skills Integration
- [ ] Integrate visual-explainer for dashboard generation
- [ ] Use claude-writer-plugin skill for content analysis
- [ ] Leverage built-in LLM for AI features

### External Service Integrations
- [ ] Craft API OAuth setup
- [ ] Obsidian vault configuration
- [ ] Slack App OAuth setup
- [ ] S3 bucket configuration

---

## Priority Roadmap

**Phase 1 (Current):** ✅ Database + Backend API + Dashboard Design
**Phase 2:** Frontend UI Components + Dashboard Integration
**Phase 3:** Craft API + Obsidian Sync Implementation
**Phase 4:** Content Analysis + Search Features
**Phase 5:** Slack Integration + Notifications
**Phase 6:** Built-in Plugin Integration + visual-explainer
**Phase 7:** Testing + Documentation + Deployment
