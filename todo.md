# ibl1nk Dashboard - Project TODO

## Architecture Overview

**Plugin Type:** Built-in Plugin (integrated into Manus system)
**Dashboard Generation:** Using visual-explainer skill for beautiful, interactive dashboards
**Data Export:** HTML/PDF export of visual stories and dashboards from user-tracked data
**SQL Naming:** Meaningful names (approx 3 syllables) (e.g., `001_user_base.sql`)

---

## Core Features

### 1. Database Schema & Data Models

- [x] Create Craft Collections schema for Chapters/Scenes (outline tracking)
- [x] Create Craft Collections schema for Characters with relationships
- [x] Create database tables for Obsidian file sync metadata
- [x] Create database tables for writing analysis results
- [x] Create database tables for Slack integration logs
- [x] Add `projects` table (isolated context for notes/tasks/lore)
- [x] Add `notes`, `tasks`, and `loreEntries` tables
- [x] Rename SQL migration files with meaningful names (e.g., `001_user_base.sql`)
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

- [x] Implement AI Chat with Project context
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
- [ ] Implement Slack Slash Commands (/ibl1nk analyze, /character, /dashboard)
- [ ] Implement Slack Events API for interactive workflows
- [ ] Create Slack Workflow Canvas integration (optional)
- [ ] Add daily writing progress notifications
- [ ] Add character update notifications

### 8. Frontend UI Components (Mobile-First)

- [x] Refactor Dashboard for mobile-first design (DashboardMobile.tsx)
- [x] Integrate `NoteTaskApp` logic into `NoteTaskApp.tsx` page
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
- [x] Create procedures for project CRUD (Project API)
- [x] Create procedures for note CRUD (Note API)
- [x] Create procedures for task CRUD (Task API)
- [x] Create procedures for lore CRUD (Lore API)
- [x] Implement secure IDOR protection (userId scoping) for all routers
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

- [x] Review security and best practices (IDOR, Error Handling)
- [ ] Write unit tests for projectsRouter and DB queries
- [ ] Write unit tests for Craft API integration
- [ ] Write unit tests for content analysis functions
- [ ] Write unit tests for Obsidian sync logic
- [ ] Write integration tests for full workflows
- [ ] Test dashboard rendering with various data sizes
- [ ] Test visual-explainer export functionality
- [ ] Test Slack integration workflows
- [ ] Performance testing for large outlines

### 14. Documentation & Deployment

- [x] Write API documentation (v1)
- [ ] Create user guide for dashboard
- [ ] Create admin guide for plugin configuration
- [ ] Document Craft/Obsidian/Slack setup instructions
- [ ] Create troubleshooting guide
- [ ] Prepare deployment checklist
- [ ] Create plugin release notes

---

## SQL Migration Files (Meaningful Naming Convention)

Migration pattern (approx 3 syllables):
- `001_user_base.sql` - Core user table and auth
- `002_writer_core.sql` - Outlines, Chapters, Scenes, and Characters
- `003_analysis_log.sql` - Content analysis and writing stats
- `004_external_sync.sql` - Obsidian and Craft sync metadata
- `005_workspace_mod.sql` - Projects, Notes, Tasks, and Lore (New)

---

## Priority Roadmap

**Phase 1 (Completed):** ✅ Database + Backend API + Dashboard Design + Projects/Notes/Tasks Integration
**Phase 2:** Testing + Bug Fixes (IDOR/Security) + Refining Workspace UI
**Phase 3:** Craft API + Obsidian Sync Implementation
**Phase 4:** Content Analysis + Search Features
**Phase 5:** Slack Integration + Notifications
**Phase 6:** Built-in Plugin Integration + visual-explainer
**Phase 7:** Documentation + Deployment
