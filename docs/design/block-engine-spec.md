# Technical Specification: Advanced Block Engine & Mobile Interaction (v1.1.0)
**Owner:** ibl1nk Core Team
**Date:** 2026-04-10
**Status:** DRAFT (Awaiting Review)

## 1. Data Architecture (The Block Model)
เพื่อให้รองรับ Obsidian-style [[WikiLinks]] และการจัดลำดับแบบ Notion โดยไม่สูญเสียความแม่นยำ (Data Integrity)

### 1.1 Block Schema (JSON)
```typescript
/**
 * Standard Block Interface for ibl1nk
 */
interface IBlock {
  id: string;               // ULID (Sortable, Unique)
  projectId: number;        // Workspace Isolation
  type: 'text' | 'h1' | 'h2' | 'h3' | 'todo' | 'quote' | 'callout' | 'image' | 'ai_suggestion';
  content: string;          // HTML-sanitized string with [[WikiLink]] markers
  metadata: {
    indent: number;         // 0 (none) to 4 (deepest)
    isDone?: boolean;       // for todo types
    links: string[];        // Array of entity IDs found in [[WikiLinks]]
    aiStatus?: 'draft' | 'stable' | 'needs_review';
  };
  styles: {
    color?: string;
    bold?: boolean;
    italic?: boolean;
  };
}
```

## 2. Mobile Interaction Patterns (UX Engine)
แก้ปัญหา "Selection Collision" บนจอสัมผัส

### 2.1 The Dual-Zone Surface
- **Content Zone (Center/Right):** พื้นที่สำหรับการพิมพ์ (Text Input)
  - **Single Tap:** วาง Cursor (Focus)
  - **Double/Long Press:** เรียก OS Native Text Selection (Copy/Paste เฉพาะคำ)
- **Control Zone (Left Gutter - 44px):** พื้นที่สำหรับการจัดการโครงสร้าง (Block Action)
  - **Icon Trigger:** แสดง `::` handle หรือ `+` button
  - **Single Tap on Gutter:** เลือกทั้ง Block (Block Selection Mode)
  - **Long Press & Drag on Gutter:** เปิด Multi-block selection (ปัดนิ้วเพื่อเลือกหลายก้อน)
  - **Horizontal Swipe on Gutter:**
    - **Swipe Right:** เพิ่ม Indent (Metadata.indent++)
    - **Swipe Left:** ลด Indent (Metadata.indent--) หรือลบหากอยู่ที่ระดับ 0

### 2.2 Floating Keyboard Accessory (The Toolbar)
แถบเครื่องมือที่จะปรากฏเหนือคีย์บอร์ดมือถือเสมอ
- **Quick Links:** ปุ่ม `[[` สำหรับเรียก Entity Search
- **Transform:** ปุ่ม `/` สำหรับเปลี่ยน Block Type
- **Clear Format:** ปุ่ม "Lather" (ล้าง styles ทั้งหมดเหลือเพียง Plain Text)
- **AI Assist:** ปุ่มวิเคราะห์ Sentiment หรือ Hook จาก Block ที่เลือก

## 3. Clipboard & Sanitization Logic
ป้องกันการปนเปื้อนของข้อมูล (Data Pollution) จากแอปภายนอก

### 3.1 On Paste Handler
1. **Source Detection:** ตรวจสอบว่ามาจาก `ibl1nk` (JSON) หรือแอปอื่น (HTML/RTF)
2. **Sanitization Pipeline:**
   - ถอดรหัส HTML tags ที่ไม่รองรับ (เช่น `<div style="...">`)
   - แปลงเครื่องหมายคำพูด (Smart quotes) เป็นมาตรฐาน
   - ตรวจหาโครงสร้างที่เป็นลิสต์ (bullets) และแปลงเป็น `ul/ol` blocks อัตโนมัติ
3. **Internal Copy:** เมื่อ Copy ในแแอป จะเก็บทั้ง `text/plain` และ `application/ibl1nk-block+json`

## 4. Edge Case Handling & Verification
| Scenario | Behavior |
| :--- | :--- |
| **Selection Overlap** | การเลือกข้อความข้าม 2 Blocks บนมือถือจะถูกบังคับให้กลายเป็น Multi-block selection แทนการคัดลอก Text บางส่วน |
| **Empty Block Deletion** | การกด Backspace ใน Block ว่างที่ระดับ Indent > 0 จะลด Indent ก่อนลบไฟล์ |
| **Network Interruption** | ใช้ Optimistic UI updates และบันทึกลง Local IndexDB ก่อนส่งเข้า API |

---

# Implementation Plan (Strategy)

1. **Phase 1: The Engine (Hook Based)**
   - สร้าง `useBlockEngine.ts`: จัดการ State (Zustand) ของลำดับบล็อก
   - สร้าง `useMobileInteraction.ts`: ตรวจจับ Gestures และแยกแยะ Zones

2. **Phase 2: The View (Component Based)**
   - สร้าง `BlockWrapper.tsx`: ควบคุม Gutter และ Content Zone
   - สร้าง `AccessoryBar.tsx`: แถบเครื่องมือเหนือคีย์บอร์ด

3. **Phase 3: Validation (TDD)**
   - เขียน Unit Test สำหรับ Clipboard Sanitization
   - ทดสอบ Gesture Simulation บน Mobile Viewport
