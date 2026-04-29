# UI Specification: Project Dashboard (v1.0.0)
**View:** Mobile-first (390px - 430px width)
**Style:** Minimalist, Editorial, Soft Shadows

## 1. Top Navigation Bar
- **Left:** Avatar with dropdown (User Settings, Account)
- **Center:** Project Name (e.g., "Shadow of the Moon") with a caret icon for quick Project Switcher.
- **Right:** Notification bell (Slack updates) and a search icon (`[[WikiLinks]]` search).

## 2. Workspace Overview (Dashboard)
- **Quick Stats Card:** 
  - Word count today (e.g., "1,240 words today")
  - Active Streak (e.g., "🔥 7 days")
  - Pomodoro status
- **Recent Blocks / Notes:** 
  - Horizontal scroll or List of last 5 items accessed.
  - Preview of content (2 lines) and Last Modified time.

## 3. Project Navigation (Bottom Bar - Fixed)
- **Tabs:** 
  - `Outline` (Block Explorer)
  - `Characters` (Gallery/Graph)
  - `Lore` (Wiki View)
  - `Tasks` (To-do List)
  - `AI Chat` (Floating Action Button - FAB)

## 4. Project Switcher (Modal/Drawer)
- Bottom-sheet drawer showing all projects.
- Search bar inside drawer to filter projects.
- "Create New Project" button at the top.

---

# Design Tokens (Reference)
- **Background:** Soft Gray (`#F9FAFB`)
- **Primary:** Deep Teal (`#115E59`) or Custom per project.
- **Font:** Sarabun (TH) / Inter (EN)
- **Roundness:** 8px - 12px (Smooth corners)
