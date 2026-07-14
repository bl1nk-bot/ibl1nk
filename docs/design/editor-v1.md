# UI Specification: Block-based Editor (v1.0.0)
**View:** Mobile Editor (Full Screen)
**Style:** Paper-like, Minimal distraction

## 1. Top Bar (Editor Controls)
- **Left:** `Back` (Back to Dashboard)
- **Center:** Title (e.g., "Chapter 1: The Call")
- **Right:** `Share/Sync` (Craft/Obsidian) and `Options` (Theme, Font size)

## 2. Editor Surface (Scrollable)
- **Block Canvas:** 
  - Dynamic list of JSON blocks.
  - Long-press to drag and reorder blocks.
  - Hover/Focus displays a `+` and `::` (drag handle) on the left (if screen width allows).
- **Special Blocks:** 
  - `Note/Lore Link`: Displays with a unique icon and a tooltip (if clicked).
  - `WikiLink`: Highlighted text (Blue/Teal) for `[[CharacterName]]`.
  - `AI Suggestion Block`: Ghost text or inline highlight for AI rewriting suggestions.

## 3. Keyboard Toolbar (Fixed above Mobile Keyboard)
- **Icons:** `Bold`, `Italic`, `Heading`, `Checklist`, `Quote`.
- **Special Tools:** 
  - `[[` (WikiLink shortkey)
  - `/` (Block menu)
  - `AI` (Magic wand icon for AI Rewrite/Analyze)

## 4. WikiLink Auto-complete (Overlay)
- Pops up when `[[` is typed.
- Lists: Characters, Lore entries, and Other Notes within the SAME Project.
- Icon to create a NEW entry if not found.

---

# Data Structure (Block Base JSON)
```json
{
  "id": "blk_9921",
  "type": "paragraph",
  "content": "The dragon slept in the [[Forbidden Mountain]].",
  "metadata": {
    "wordCount": 10,
    "hasWikiLink": true,
    "sentiment": "neutral"
  }
}
```
