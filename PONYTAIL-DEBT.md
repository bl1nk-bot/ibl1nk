# Ponytail debt — รอพิจารณา

ไฟล์นี้เป็นดัชนีประกอบ ส่วน marker ต้นทางอยู่ใน source แต่ละไฟล์เพื่อให้ `grep -rnE '(#|//) ?ponytail:' .` พบตำแหน่งจริงได้ทันที ควรสแกนใหม่เมื่อโค้ดเปลี่ยนภายหลัง

## 1. Showcase, AI demo และ UI primitives ที่ไม่มีทางเข้าถึง — 3,456 บรรทัด

<!-- # ponytail: โค้ดหน้าเดโมและ UI ที่ runtime เข้าไม่ถึงยังคงเพิ่มภาระดูแล; upgrade: ทบทวนเมื่อมี route/import หรือข้อกำหนดผลิตภัณฑ์ที่ใช้งานจริง มิฉะนั้นลบทั้งกลุ่ม -->

เหตุผล: ไม่พบ route หรือ inbound import จากกราฟ client ที่ใช้งานจริง จึงเป็นหน้าเดโมและชิ้นส่วน UI ที่ยังไม่ส่งมอบให้ผู้ใช้

- [ ] `client/src/pages/ComponentShowcase.tsx` — 1,440 บรรทัด
- [ ] `client/src/components/AIChatBox.tsx` — 336 บรรทัด
- [ ] `client/src/components/ui/alert-dialog.tsx` — 155 บรรทัด
- [ ] `client/src/components/ui/button-group.tsx` — 83 บรรทัด
- [ ] `client/src/components/ui/chart.tsx` — 355 บรรทัด
- [ ] `client/src/components/ui/empty.tsx` — 104 บรรทัด
- [ ] `client/src/components/ui/field.tsx` — 242 บรรทัด
- [ ] `client/src/components/ui/form.tsx` — 168 บรรทัด
- [ ] `client/src/components/ui/input-group.tsx` — 168 บรรทัด
- [ ] `client/src/components/ui/item.tsx` — 193 บรรทัด
- [ ] `client/src/components/ui/kbd.tsx` — 28 บรรทัด
- [ ] `client/src/components/ui/navigation-menu.tsx` — 168 บรรทัด
- [ ] `client/src/components/ui/spinner.tsx` — 16 บรรทัด

ทางเลือก: [ ] เก็บ [ ] ลบ [ ] กลับมาพิจารณา

## 2. Server template adapters ที่ไม่มีผู้เรียก — 1,739 บรรทัด

<!-- # ponytail: adapter เชิงคาดการณ์ที่ไม่มี runtime caller อาจล้าสมัยและเพิ่มพื้นที่บำรุงรักษา; upgrade: เก็บเฉพาะ adapter ที่ endpoint หรือฟีเจอร์จริงเริ่มเรียกใช้ มิฉะนั้นลบทั้งกลุ่ม -->

เหตุผล: ไม่พบการเรียกหรือ import จาก runtime routes เป็น integration จาก template ที่ยังไม่มีกรณีใช้งานจริง

- [ ] `server/_core/dataApi.ts` — 69 บรรทัด
- [ ] `server/_core/imageGeneration.ts` — 92 บรรทัด
- [ ] `server/_core/llm.ts` — 335 บรรทัด
- [ ] `server/_core/map.ts` — 315 บรรทัด
- [ ] `server/_core/modal.ts` — 234 บรรทัด
- [ ] `server/_core/voiceTranscription.ts` — 326 บรรทัด
- [ ] `server/lib/craft-api.ts` — 264 บรรทัด
- [ ] `server/storage.ts` — 104 บรรทัด

ทางเลือก: [ ] เก็บ [ ] ลบ [ ] กลับมาพิจารณา

## 3. Client prototypes ที่ไม่มี inbound import — 626 บรรทัด

<!-- # ponytail: prototype ที่ยังไม่เชื่อมกับผลิตภัณฑ์จะคงเป็นโค้ดซ้ำและไม่ได้ใช้งาน; upgrade: เก็บเมื่อมีการตัดสินใจผลิตภัณฑ์และ route/import ใช้งานจริง มิฉะนั้นลบ -->

เหตุผล: ไม่พบ inbound import ในกราฟ client ที่ทำงานอยู่ จึงยังเป็น prototype หรือ UI ทางเลือกที่ไม่ได้ถูกส่งมอบ

- [ ] `client/src/components/CanvasWithTools.tsx` — 256 บรรทัด
- [ ] `client/src/components/CharacterGraphView.tsx` — 126 บรรทัด
- [ ] `client/src/components/Map.tsx` — 155 บรรทัด
- [ ] `client/src/components/ManusDialog.tsx` — 89 บรรทัด

ทางเลือก: [ ] เก็บ [ ] ลบ [ ] กลับมาพิจารณา

## 4. Shared schema/barrel ที่ไม่ได้ใช้ — 482 บรรทัด

<!-- # ponytail: แหล่ง type คู่ขนานที่ไม่มี runtime import อาจ drift จาก type หลัก; upgrade: เก็บเมื่อมี import จริงและกำหนดให้เป็น canonical source มิฉะนั้นลบ -->

เหตุผล: ไม่พบ runtime import และชนิดข้อมูลบางส่วนซ้ำหรือถูก re-export จาก `shared/agent-types.ts` และ `shared/util-types.ts`

- [ ] `shared/tools.ts` — 472 บรรทัด
- [ ] `shared/types.ts` — 10 บรรทัด

ทางเลือก: [ ] เก็บ [ ] ลบ [ ] กลับมาพิจารณา

## 5. Telegram notification wrapper ที่ซ้ำทางเดิน — 56 บรรทัด

<!-- # ponytail: notification สองทางเดินอาจให้พฤติกรรมไม่ตรงกันและเพิ่มภาระดูแล; upgrade: เก็บเมื่อ router/runtime เลือกใช้ Telegram wrapper นี้โดยตรง มิฉะนั้นลบ -->

เหตุผล: เส้นทางแจ้งเตือนที่ใช้งานจริงไปผ่าน `server/_core/notification.ts` ส่วน wrapper ชุดนี้ไม่พบผู้เรียก

- [ ] `server/_core/notifications/index.ts` — 12 บรรทัด
- [ ] `server/_core/notifications/telegram.ts` — 44 บรรทัด

ทางเลือก: [ ] เก็บ [ ] ลบ [ ] กลับมาพิจารณา

## 6. Dependencies ที่ไม่พบการใช้งาน — 7 รายการ

<!-- # ponytail: dependency ที่ไม่มี active import เพิ่มขนาดติดตั้ง lockfile และพื้นที่โจมตี; upgrade: เก็บเมื่อ active code มี import/use จริง มิฉะนั้นถอด package และปรับ lockfile -->

เหตุผล: ไม่พบ active import หลังแยกโค้ดที่ตายแล้วออก หากตัดสินใจเก็บฟีเจอร์ที่เกี่ยวข้องให้ตรวจเฉพาะ dependency ของฟีเจอร์นั้นอีกครั้ง

- [ ] `@aws-sdk/client-s3`
- [ ] `@aws-sdk/s3-request-presigner`
- [ ] `@hookform/resolvers`
- [ ] `react-hook-form`
- [ ] `framer-motion`
- [ ] `streamdown`
- [ ] `tailwindcss-animate`

ทางเลือก: [ ] เก็บ [ ] ลบ [ ] กลับมาพิจารณา

## สรุป

- ลดได้โดยประมาณ: 6,359 บรรทัด และ 7 dependencies
- 35 markers (29 จุดใน source + 6 หัวข้อใน ledger), 0 with no trigger
