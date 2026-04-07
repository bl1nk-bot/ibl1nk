# Technology Stack

## Core Languages
- **TypeScript 5.9** - Primary language (strict mode)
- **JavaScript/ES2024** - Runtime

## Frontend
- **React 19** - UI framework
- **Vite 7** - Build tool + dev server
- **Tailwind CSS 4** - Styling framework
- **shadcn/ui (Radix UI)** - Component library
  - Accordion, Alert Dialog, Avatar, Checkbox, Dialog, Dropdown Menu, Popover, Select, Tabs, Tooltip, และอื่นๆ
- **Framer Motion 12** - Animations
- **Lucide React** - Icon library
- **React Hook Form + Zod** - Form validation
- **Recharts** - Charts และ graphs
- **date-fns** - Date manipulation
- **next-themes** - Dark/Light mode switching
- **wouter** - Lightweight routing

## Backend
- **Express.js 4** - HTTP server
- **tRPC 11** - Type-safe API
- **SuperJSON** - Serialization สำหรับ tRPC
- **Zod 4** - Input/output validation
- **Drizzle ORM 0.44** - Database ORM
- **MySQL2 3** - Database driver
- **Jose 6** - JWT/session management
- **Cookie** - Session cookies
- **Dotenv** - Environment variables

## AI & Content Analysis
- **Vercel AI SDK (ai package)** - AI abstraction layer
- **Vercel AI Gateway** - Multi-provider routing
- **Supported Providers:**
  - OpenAI (GPT-4, GPT-4o)
  - Google (Gemini 1.5/2.0)
  - Anthropic (Claude 3.5/4)
  - และอื่นๆผ่าน AI SDK

## Database
- **MySQL 8** - Primary database
- **Drizzle Kit** - Migration tool
- **TiDB** (optional) - Cloud-native MySQL compatible

## Storage
- **AWS S3** - File storage (backups, exports, assets)
- **@aws-sdk/client-s3** - S3 client
- **@aws-sdk/s3-request-presigner** - Presigned URLs

## Testing
- **Vitest 2** - Test runner
- **React Testing Library** - Component testing

## Code Quality
- **Prettier 3** - Code formatting
- **TypeScript tsc** - Type checking

## Package Manager
- **pnpm 10** - Dependency management

## Deployment
- **Vercel** - Frontend + AI Gateway deployment
- **Node.js** - Backend runtime (production)
- **esbuild** - Backend bundling
