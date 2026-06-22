---
name: AreaSim Project Overview
description: Full project context — what AreaSim is, all three phases implemented, tech stack, and current state
type: project
---

AreaSim is a Norwegian SaaS workspace intelligence platform for optimizing physical office spaces. This is a frontend-only prototype — all data is mocked, no backend.

**Why:** Prototype to demonstrate the product concept phase-by-phase.

**How to apply:** Use this as the primary reference for all work in this repo.

---

## Tech Stack
- Next.js 14 (App Router), TypeScript, Tailwind CSS
- Framer Motion (animations), Konva.js + react-konva (floor plan canvas)
- Zustand (state), React Hook Form + Zod (forms)
- Radix UI (primitives), Lucide React (icons)
- Recharts (charts), DnD Kit (drag-and-drop)
- Fonts: Syne (display) + DM Sans (body)

## Design System
- Norwegian aesthetic: fjord blues, aurora accents, Nordic minimalism
- Full light + dark mode support via CSS variables in `src/styles/globals.css`
- Glass utilities, skeleton loaders, custom animations

## Route Structure
- `/` — Landing page
- `/(auth)/signup|signin|verify-email|create-password|organization-details` — Auth flow
- `/onboarding` — 6-step onboarding wizard
- `/welcome` — Post-onboarding welcome
- `/dashboard` — Main dashboard with analytics
- `/project` — Project list
- `/project/[id]` — Project detail (floors list)
- `/project/[id]/floor/[floorId]` — Floor plan canvas (Konva.js)
- `/project/[id]/floor/[floorId]/count` — Room counting setup page
- `/project/[id]/floor/[floorId]/history` — Count history
- `/project/[id]/room/[roomId]/count` — Individual room counting
- `/surveys` + `/surveys/[id]` — Survey list + detail
- `/team` — Team management
- `/settings` — Settings
- `/subscription` — Subscription plans

## Key Components
- `src/components/canvas/FloorCanvas.tsx` — Konva.js interactive floor plan editor
- `src/components/canvas/GuideOverlay.tsx` — 7-step interactive guide
- `src/components/canvas/ScoreWidget.tsx` — Live completeness score
- `src/components/canvas/RoomModal.tsx` / `SurveyModal.tsx` / `CompletionModal.tsx` — Canvas modals
- `src/components/canvas/DetailPanel.tsx` — Side panel for room/zone details
- `src/components/layout/AppLayout.tsx` — Sidebar + topbar shell
- `src/components/onboarding/` — Step1Project, Step3FloorPlans, Step3Lease, Step6Done
- `src/components/ui/` — Full design system primitives
- `src/lib/mockData.ts` — All mock data (Projects, Floors, Rooms, Zones, CountHistory)
- `src/store/canvas.ts` — Zustand canvas state
- `src/store/onboarding.ts` — Zustand onboarding state

## All Three Phases Complete
- Phase 1: Design system, landing, auth, onboarding wizard
- Phase 2: Canvas guide, Konva floor plan editor, room counting
- Phase 3: Dashboard, project views, surveys, subscription, polish

## Git Status
- Detached from GitHub remote (was: shivanthi-fernando/AreaSim_Prototype_V2.2.git)
- Treated as a standalone local project from this point forward
