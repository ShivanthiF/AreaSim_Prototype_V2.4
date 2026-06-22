# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Commands

```bash
npm run dev      # starts on port 3001 (not the default 3000)
npm run build    # production build
npm run lint     # ESLint via next lint
```

There are no tests. TypeScript type-checking: `npx tsc --noEmit`.

If port 3001 is busy, pass a different port explicitly: `next dev -p 3002`.

---

## What This Project Is

**AreaSim** is a Norwegian workspace intelligence SaaS prototype. It is **frontend-only** — there is no backend, no API, no database. All data comes from `src/lib/mockData.ts`. Nothing should be fetched from a network.

**Why it exists:** organizations make high-stakes, hard-to-reverse workplace and lease decisions (multi-year leases, capital commitment) on assumptions rather than evidence. AreaSim supports the **early, critical phase** of that decision by building an evidence base. The core value pipeline is:

```
Room Counting (objective usage) ─┐
                                 ├──→  Room Programme  ──→  Business Case
Survey (subjective sentiment) ───┘
```

Two evidence sources converge into a room/functional program, which becomes a quantified business case used for internal decisions, tendering, and lease negotiations. This is why both **counting** and **surveys** exist as first-class features — neither alone is enough to defend a workplace investment.

**Two user groups:** company employees/admins (the client evaluating their own space) and AreaSim consultants/admins (experts who often run the studies, including counting, on behalf of clients).

The prototype spans three user journeys:
1. **Auth + Onboarding** — sign up → create org → set lease params → upload floor plans → done
2. **Canvas / Floor Plan Editor** — draw rooms (pen tool), assign zones, run AI detection on uploaded plans
3. **Dashboard + Project Management** — view stats, manage projects/floors/rooms, run surveys, manage team

> **Full product context** — problem statement, project purpose, personas, value pipeline, complete feature map, and detailed user journeys live in [`docs/areasim-product-overview.md`](docs/areasim-product-overview.md). Read it for the "why" behind any feature.

---

## Architecture

### Routing (Next.js 14 App Router)

| Route | Purpose |
|-------|---------|
| `/` | Welcome / landing page |
| `/(auth)/signup`, `/signin`, `/verify-email`, `/create-password`, `/organization-details` | Auth flow (grouped layout) |
| `/onboarding` | Multi-step onboarding wizard (single page, step state in Zustand) |
| `/dashboard` | Main dashboard with stats, activity, recent projects |
| `/project` | Projects list |
| `/project/[id]` | Project detail — Overview / Floors / Team tabs |
| `/project/[id]/floor/[floorId]` | Canvas (Konva.js floor plan editor + guide overlay) |
| `/project/[id]/floor/[floorId]/count` | Room counting session |
| `/project/[id]/floor/[floorId]/history` | Counting history charts |
| `/surveys`, `/surveys/[id]` | Survey list + detail |
| `/team` | Members management |
| `/styleguide` | Living design system reference — always check here before building new UI |

### State Management (Zustand, persisted to localStorage)

- **`useCanvasStore`** (`src/store/canvas.ts`) — single source of truth for the floor plan editor: floors, rooms, zones, active tool, selected rooms, modal open/close state. Persisted as `"areasim-canvas-v2"`.
- **`useOnboardingStore`** (`src/store/onboarding.ts`) — onboarding wizard state: current step (0–3), project details, floors, lease parameters. Persisted as `"areasim-onboarding"`.

### Shared Layout

`AppLayout` (`src/components/layout/AppLayout.tsx`) wraps all post-auth pages. It renders the sticky top nav bar (logo, nav tabs, bell, profile dropdown). Pass `showJourneyBar` to optionally show the `WorkplaceJourneyBar` below the header.

### Canvas (Konva.js)

`FloorCanvas` (`src/components/canvas/FloorCanvas.tsx`) is the main Konva stage. Tools:
- **pen** — draw polygon rooms by clicking vertices, double-click to close
- **select** — click/drag rooms; opens `DetailPanel`
- **zone** — assign rooms to color-coded zones via `RoomModal`
- **eraser** — delete rooms

`GuideOverlay` provides the step-by-step canvas tutorial that floats over the canvas.

### Instructions Hash Pattern

Navigating to the count page with `#show-instructions` in the URL triggers the "How to use the counting tool" modal on mount. The hash is immediately cleaned with `window.history.replaceState`. This is how `FloorPage` signals the count page to show instructions without prop-drilling.

---

## Design System

**Always consult `/styleguide`** before creating new UI. The style guide is live in the app at that route and covers all component variants.

### Tokens (defined in `src/styles/globals.css`, mapped in `tailwind.config.ts`)

| Token | Value |
|-------|-------|
| `primary` | `#139485` (teal) |
| `accent` | `#C47A2C` (amber) |
| `bg` | `#F9F6EF` (warm off-white page background) |
| `surface` | `#FFFFFF` (card/panel backgrounds) |
| `surface-2` | `#FFFCF7` (hover state background) |
| `text` | `#1F2A24` |
| `text-muted` | `#6B7C73` |
| `border` | `#ececec` |

### Fonts

- **Manrope** (`font-display`, `var(--font-manrope)`) — headings, bold labels, numbers in stat cards. **Bold headings use ExtraBold (800)** — use `font-extrabold` (or `fontWeight: 800`), not `font-bold`; the global `h1–h6` rule is weight 800.
- **DM Sans** (`font-body`, `var(--font-dm-sans)`) — body text, buttons, labels, all prose. **All tables render in DM Sans** (the shared `Table` sets `font-body` on the `<table>`).
- Apply heading font inline: `style={{ fontFamily: "var(--font-manrope)" }}` (Tailwind `font-display` works too)

### Text casing

**Sentence case everywhere** — only the first letter of a label/heading is capitalised (e.g. "Square meters", "Selected room", "Counting history"). Do **not** use the Tailwind `uppercase` class anywhere. The single exception is the **onboarding Step-2 lease-parameter charts** (the `BarChart` axis label in `src/app/onboarding/page.tsx`), which keep `uppercase` intentionally.

### CSS Classes

Two button styles live in `globals.css` as `@layer utilities` because their hover/active states can't be expressed in plain Tailwind:
- `.btn-primary` — gradient teal, subtle lift on hover
- `.btn-secondary` — bevel white, amber tint on hover/active
- `.bg-brand-gradient` — canonical aurora gradient used for banners and modal headers

### Component Conventions

**Button** (`src/components/ui/Button.tsx`): variants `primary | secondary | tertiary | ghost | text | link | destructive | success | icon | fab`; sizes `sm | md | lg`. Always use `<Button>` rather than raw `<button>` for interactive actions visible to the user.

**Chip** (`src/components/ui/Chip.tsx`): one pill for table categories, statuses, and small labels — tones `neutral | success | warning | info | accent`, optional `icon`. Use it instead of hand-rolling status/category pills.

**Pastel icon backgrounds**: Use `bg-[#7A6BAF]/10 text-[#7A6BAF]`, `bg-[#4A7AAE]/10 text-[#4A7AAE]`, `bg-[#139485]/10 text-[#139485]`, `bg-[#C47A2C]/10 text-[#C47A2C]` — cycle through these four for stat card icons, avatars, and section icons.

**Progress bars**: Always use `bg-[#bfa483]` (warm sand). No gradients.

**Lease parameter cards**: Background `bg-[#F2E7DB]`.

**Link buttons**: Underline only, no arrow icon: `className="text-xs text-primary font-semibold font-body underline"`.

**Tables**: One unified standard across the whole app — see [`DESIGN.md` → Table Design Standard](DESIGN.md#table-design-standard). Wrapper `rounded-2xl border border-border bg-surface`; header `bg-surface-2` + `text-[13px] font-bold text-text tracking-wider font-body` (bold near-black, sentence case — no `uppercase`); body cells `text-sm text-text-muted font-body` — **never bold**, all columns one font size (name cell may use `text-text` for color, but not bold); `divide-y divide-border` horizontal dividers only — **never** vertical column borders; hover `hover:bg-[#FFFDFA]`; no icon boxes in name cells. Prefer the shared `Table` component (`src/components/ui/Table.tsx`), which encodes these defaults.

**Avatars (user initials)**: Cycle through the four pastel color pairs using the member's index: `PASTEL_COLORS[i % 4]`. Never use the primary→accent gradient for avatars.

---

## Mock Data

All data is in `src/lib/mockData.ts`. Key exports:

- `mockProject` — single `Project` with 3 floors, rooms, zones, AI-detected rooms
- `mockProjects` — array of `ProjectSummary` for the projects list
- `mockUser`, `mockTeamMembers` — current user and team
- `mockActivity`, `mockDashboardStats` — dashboard data
- `mockSurveyRecords` — surveys with embedded question/response data

To add new mock data, extend these exports. Do not create separate fetch functions or API calls.

---

## Key Constraints

- **No backend**: never add `fetch`, `axios`, or API routes. All state is mock or Zustand.
- **No test files**: the project has no test infrastructure; don't add test imports.
- **ESLint must stay clean**: Vercel deploys fail on ESLint errors. Run `npm run lint` before pushing. Prefix genuinely unused variables with `_` rather than removing them if they're needed for type reasons.
- **Port 3001**: the dev server always runs on 3001 (hardcoded in `package.json`).
