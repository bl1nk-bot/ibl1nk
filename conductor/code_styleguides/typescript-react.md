# TypeScript/React Style Guide

## Based on: Claude Writer Dashboard Tech Stack
- TypeScript 5.9 (strict mode)
- React 19
- Tailwind CSS 4
- tRPC 11
- Drizzle ORM

## General Principles
- **Strict TypeScript** - เปิด `strict: true` เสมอ
- **Type Safety First** - หลีกเลี่ยง `any`, ใช้ type inference เมื่อชัดเจน
- **Functional Components** - ใช้ functional components with hooks
- **Composition** - prefer composition over inheritance

## Naming Conventions

### Files
```
✅ PascalCase สำหรับ React components:  CharacterGraphView.tsx
✅ camelCase สำหรับ utilities:          parseNoteLinks.ts, formatDate.ts
✅ camelCase สำหรับ hooks:              useCharacterRelationships.ts
✅ UPPER_SNAKE_CASE สำหรับ constants:   MAX_CHAT_EXCHANGES.ts
```

### Variables & Functions
```typescript
✅ camelCase สำหรับ variables และ functions
const wordCount = 0
const parseNoteLinks = (content: string) => { ... }

✅ PascalCase สำหรับ types และ interfaces
interface Character { id: number; name: string }
type OperationMode = 'write' | 'analyze' | 'summarize'

✅ UPPER_SNAKE_CASE สำหรับ constants
const AI_MAX_INPUT_CHARS = 4000
const MAX_CHAT_EXCHANGES = 10
```

### Components
```typescript
✅ PascalCase สำหรับ component names
function CharacterTracker() { ... }
const DashboardLayout = () => { ... }

✅ Props interface แยกต่างหาก
interface CharacterProps {
  character: Character
  onUpdate: (updates: Partial<Character>) => void
}

function CharacterCard({ character, onUpdate }: CharacterProps) {
  // ...
}
```

## TypeScript Best Practices

### Type Inference vs Explicit Types
```typescript
✅ ปล่อยให้ type inference ทำงานเมื่อชัดเจน
const characters = await getCharactersByOutlineId(outlineId) // inferred

✅ ใช้ explicit types สำหรับ function signatures
function calculateWordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length
}

✅ ใช้ explicit types สำหรับ React state
const [isLoading, setIsLoading] = useState<boolean>(false)
const [characters, setCharacters] = useState<Character[]>([])
```

### Avoid `any`
```typescript
❌ หลีกเลี่ยง any
const data: any = await fetchData()

✅ ใช้ unknown หรือ specific types
const data: CharacterData = await fetchData()
const data: unknown = await fetchData()
if (isCharacterData(data)) { ... }

✅ ใช้ type assertions เมื่อแน่ใจ
const element = ref.current as HTMLDivElement
```

### Nullable Handling
```typescript
✅ ใช้ optional chaining
const name = character?.name ?? 'Unknown'

✅ ใช้ nullish coalescing
const count = wordCount ?? 0

✅ ใช้ type guards
function isCharacter(obj: unknown): obj is Character {
  return typeof obj === 'object' && obj !== null && 'id' in obj && 'name' in obj
}
```

## React Patterns

### Component Structure
```typescript
✅ จัดลำดับในไฟล์: imports → types/constants → component → exports
import { useState } from 'react'
import { Character } from '@/shared/types'

interface CharacterCardProps {
  character: Character
  onSelect: (id: number) => void
}

export function CharacterCard({ character, onSelect }: CharacterCardProps) {
  // 1. State hooks
  const [isExpanded, setIsExpanded] = useState(false)
  
  // 2. Custom hooks
  const { relationships } = useCharacterRelationships(character.id)
  
  // 3. Derived state
  const hasRelationships = relationships.length > 0
  
  // 4. Event handlers
  const handleClick = () => onSelect(character.id)
  
  // 5. Render
  return ( ... )
}
```

### Custom Hooks
```typescript
✅ แยก logic ออกจาก UI เป็น custom hooks
function useCharacterRelationships(characterId: number) {
  const [relationships, setRelationships] = useState<CharacterRelationship[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  useEffect(() => {
    setIsLoading(true)
    trpc.characters.relationships.query({ characterId })
      .then(setRelationships)
      .finally(() => setIsLoading(false))
  }, [characterId])
  
  return { relationships, isLoading }
}
```

### Event Handlers
```typescript
✅ ใช้ arrow functions สำหรับ handlers
const handleClick = useCallback(() => {
  // handler logic
}, [dependencies])

✅ ใช้ descriptive names
const handleCharacterSelect = (id: number) => { ... }
const handleNoteDelete = (noteId: number) => { ... }
```

## Tailwind CSS Patterns

### Class Organization
```typescript
✅ จัดกลุ่ม classes ตามวัตถุประสงค์
<div className="
  // Layout
  flex flex-col gap-4
  
  // Sizing
  w-full max-w-md
  
  // Spacing
  p-4 my-2
  
  // Visual
  bg-white dark:bg-gray-800
  rounded-lg shadow-sm
  
  // Interactive
  hover:shadow-md
  transition-shadow duration-200
  
  // Responsive
  md:flex-row
  lg:max-w-lg
">
```

### Mobile-First Responsive
```typescript
✅ เริ่มจาก mobile แล้วขยายขึ้น
<div className="
  flex flex-col        // mobile: column
  md:flex-row          // tablet+: row
  gap-2                // mobile: tight gap
  lg:gap-4             // desktop: wider gap
">
```

### Dark Mode
```typescript
✅ ใช้ dark: modifier สม่ำเสมอ
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
```

## tRPC Patterns

### Router Structure
```typescript
✅ แยก routers ตาม domain
export const charactersRouter = router({
  listByOutline: protectedProcedure
    .input(z.object({ outlineId: z.number() }))
    .query(async ({ input }) => {
      return getCharactersByOutlineId(input.outlineId)
    }),
  
  create: protectedProcedure
    .input(characterCreateSchema)
    .mutation(async ({ ctx, input }) => {
      return createCharacter({
        userId: ctx.user.id,
        ...input,
      })
    }),
})
```

### Input Validation
```typescript
✅ ใช้ Zod schema สำหรับทุก input
const characterCreateSchema = z.object({
  outlineId: z.number().optional(),
  name: z.string().min(1, 'ชื่อตัวละครต้องมีอย่างน้อย 1 ตัวอักษร'),
  description: z.string().optional(),
  traits: z.string().optional(),
  role: z.string().optional(),
})

type CharacterCreateInput = z.infer<typeof characterCreateSchema>
```

### Error Handling
```typescript
✅ ใช้ user-friendly error messages
if (!outline) {
  throw new TRPCError({
    code: 'NOT_FOUND',
    message: 'ไม่พบโครงเรื่องนี้ (20001)',
  })
}

✅ Handle errors gracefully
try {
  const result = await createCharacter(input)
  return result
} catch (error) {
  console.error('Failed to create character:', error)
  throw new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'ไม่สามารถสร้างตัวละครได้ กรุณาลองใหม่อีกครั้ง (20002)',
  })
}
```

## Database (Drizzle) Patterns

### Schema Definition
```typescript
✅ ใช้ camelCase สำหรับ columns
export const characters = mysqlTable("characters", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
})

✅ Export types จาก schema
export type Character = typeof characters.$inferSelect
export type InsertCharacter = typeof characters.$inferInsert
```

### Queries
```typescript
✅ ใช้ parameterized queries ผ่าน Drizzle
export async function getCharactersByOutlineId(outlineId: number) {
  return db.select().from(characters).where(eq(characters.outlineId, outlineId))
}

✅ ใช้ transactions สำหรับ multiple operations
export async function createCharacterWithRelationships(data: InsertCharacter) {
  return db.transaction(async (tx) => {
    const character = await tx.insert(characters).values(data).$returningId()
    // additional operations
    return character
  })
}
```

## Testing Patterns

### Unit Tests
```typescript
✅ อธิบาย what และ why
describe('parseNoteLinks', () => {
  it('should extract wiki-style links from content', () => {
    const content = 'See [[Character A]] and [[Location B]]'
    const links = parseNoteLinks(content)
    
    expect(links).toEqual([
      { targetTitle: 'Character A' },
      { targetTitle: 'Location B' },
    ])
  })
})
```

### React Component Tests
```typescript
✅ ทดสอบ behavior ไม่ใช่ implementation
it('displays character name and role', () => {
  render(<CharacterCard character={mockCharacter} onSelect={mockOnSelect} />)
  
  expect(screen.getByText('Aria')).toBeInTheDocument()
  expect(screen.getByText('Protagonist')).toBeInTheDocument()
})

✅ ทดสอบ user interactions
it('calls onSelect when clicked', async () => {
  render(<CharacterCard character={mockCharacter} onSelect={mockOnSelect} />)
  
  await userEvent.click(screen.getByRole('button'))
  expect(mockOnSelect).toHaveBeenCalledWith(mockCharacter.id)
})
```

## Code Organization

### Import Order
```typescript
// 1. External libraries
import { useState, useEffect } from 'react'
import { z } from 'zod'

// 2. Internal modules (absolute paths)
import { trpc } from '@/lib/trpc'
import { Character } from '@shared/types'

// 3. Relative imports (same directory)
import { CharacterCard } from './CharacterCard'
import { useCharacterData } from './useCharacterData'

// 4. Type-only imports (when needed)
import type { CharacterRelationship } from '@shared/types'
```

### Export Patterns
```typescript
✅ Named exports เป็นหลัก
export function CharacterCard() { ... }
export function CharacterList() { ... }

✅ Default exports สำหรับ pages/routes
export default function CharactersPage() { ... }

✅ Re-export จาก index files
// components/index.ts
export * from './CharacterCard'
export * from './CharacterList'
export * from './CharacterGraphView'
```
