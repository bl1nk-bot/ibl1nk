# Routes

Router: Wouter, configured in `client/src/App.tsx`.

| URL           | Component                                  | Layout / summary                                                           |
| ------------- | ------------------------------------------ | -------------------------------------------------------------------------- |
| `/`           | `client/src/pages/Home.tsx`                | Minimal example page; no shared shell                                      |
| `/dashboard`  | `client/src/pages/DashboardMobile.tsx`     | Mobile-first writing overview with stats, charts, activity, bottom actions |
| `/outlines`   | `client/src/pages/Outlines.tsx`            | Story outline manager with story/chapter/scene/note tabs                   |
| `/characters` | `client/src/pages/CharactersWithViews.tsx` | Character management with grid/list/gallery modes and dialogs              |
| `/settings`   | `client/src/pages/Settings.tsx`            | Profile and Craft/Obsidian/Slack integration tabs                          |
| `/404`        | `client/src/pages/NotFound.tsx`            | Explicit not-found page                                                    |
| fallback      | `client/src/pages/NotFound.tsx`            | Catch-all                                                                  |
