# DESIGN.md

Technical design reference for the **AreaSim** prototype — system architecture and the reasoning behind key engineering and design decisions.

> For product context (problem, personas, value pipeline, feature map, user journeys) see [`docs/areasim-product-overview.md`](docs/areasim-product-overview.md). For day-to-day working rules see [`CLAUDE.md`](CLAUDE.md).

---

## Overview

AreaSim is a **frontend-only** Next.js 14 (App Router) prototype written in TypeScript. There is no backend, no API, and no database — every piece of data originates from `src/lib/mockData.ts`, and all mutable state lives in the browser (Zustand + localStorage). The app's job is to demonstrate the full workplace-intelligence journey: onboarding → floor plan editing → room counting → dashboards/surveys → business case.

| Concern | Choice |
|---------|--------|
| Framework | Next.js 14, App Router, all pages `"use client"` |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS custom properties (design tokens) |
| State | Zustand (persisted to localStorage) |
| Canvas | Konva.js via `react-konva` |
| Animation | Framer Motion |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Icons | Lucide React |
| UI primitives | Radix UI (dialog, dropdown, select, toast, progress) |
| Fonts | Manrope (display) + DM Sans (body), via `next/font` |

---

## System Architecture

### Layered view

```
┌─────────────────────────────────────────────────────────────┐
│  Pages (src/app/**)  — App Router routes, all "use client"   │
│  Auth · Onboarding · Canvas · Counting · Dashboard · Surveys │
└───────────────┬─────────────────────────────┬───────────────┘
                │                             │
       ┌────────▼─────────┐         ┌─────────▼──────────┐
       │  Shared layout   │         │   Feature UI       │
       │  AppLayout       │         │  canvas/ onboarding/│
       │  (nav, profile)  │         │  layout/ ...        │
       └────────┬─────────┘         └─────────┬──────────┘
                │                             │
       ┌────────▼─────────────────────────────▼──────────┐
       │  Design-system primitives (src/components/ui/**) │
       │  Button · Input · Card · Modal · Table · Badge ·  │
       │  Chip · Select · Toast · EmptyState · …           │
       └────────┬─────────────────────────────────────────┘
                │
       ┌────────▼──────────┐   ┌──────────────────────────┐
       │  State (Zustand)  │   │  Static data + helpers    │
       │  canvas.ts        │   │  lib/mockData.ts          │
       │  onboarding.ts    │   │  lib/utils.ts (cn, fmt)   │
       │  → localStorage   │   │  lib/postalCodes.ts       │
       └───────────────────┘   └──────────────────────────┘
                │
       ┌────────▼──────────┐
       │  Design tokens    │
       │  styles/globals.css → tailwind.config.ts          │
       └───────────────────┘
```

### Routing layer (`src/app`)

App Router with one route group: `(auth)` shares an auth-only layout. Every other post-auth page is wrapped by `AppLayout`. Dynamic segments drive the project/floor/room hierarchy:

```
/project/[id]/floor/[floorId]            → canvas (Konva editor + guide)
/project/[id]/floor/[floorId]/count      → counting session
/project/[id]/floor/[floorId]/history    → history charts
/project/[id]/room/[roomId]/count        → per-room count screen
```

Cross-screen signalling without prop-drilling uses a **URL hash convention**: navigating to the count page with `#show-instructions` triggers the instructions modal on mount, then the hash is cleared with `window.history.replaceState`.

### Shared layout (`src/components/layout/AppLayout.tsx`)

Wraps all post-auth pages. Renders the sticky top nav (logo, nav tabs, language selector, notifications bell, profile dropdown). Optional `showJourneyBar` prop renders `WorkplaceJourneyBar` beneath the header. This is the single seam where global navigation chrome lives.

### State layer (Zustand, `src/store`)

Two independent persisted stores, each its own localStorage key:

- **`useCanvasStore`** (`areasim-canvas-v2`) — the single source of truth for the floor plan editor: `floors`, `rooms`, `zones`, `activeTool`, `selectedRoomIds`, and modal open/close flags. All room/zone CRUD, count entries, and AI-detected-room verification are actions here. Seeded from `mockProject.floors`.
- **`useOnboardingStore`** (`areasim-onboarding`) — the onboarding wizard: `currentStep` (0–3), `project`, `floors`, `leaseParams`. Includes a `reset()` to restart the wizard.

The stores are deliberately **decoupled** — onboarding and canvas have separate `Floor` shapes (onboarding's floor is an upload record; canvas's floor carries geometry). They are not shared types.

### Canvas subsystem (`src/components/canvas`)

`FloorCanvas` is a Konva `Stage`/`Layer` tree driven entirely by `useCanvasStore`. Tools (`select`, `pen`, `group`/zone, `eraser`) are local UI state; the geometry they produce is committed to the store. Room status (`unvisited` / `counting` / `counted`) maps to fixed fill/stroke colors. A `ResizeObserver` keeps the stage sized to its container. `GuideOverlay` floats a step-by-step tutorial above the stage.

### Data + utilities (`src/lib`)

- `mockData.ts` — all domain data and the canonical TypeScript interfaces (`Project`, `Floor`, `Room`, `Zone`, `SurveyRecord`, `TeamMember`, …). New mock data extends these exports; no fetch functions.
- `utils.ts` — `cn()` (clsx + tailwind-merge) for class composition, plus `formatCurrency` (Norwegian `nb-NO` / NOK locale) and `formatNumber`.

### Styling layer

Design tokens are CSS custom properties in `src/styles/globals.css`, surfaced to Tailwind via `tailwind.config.ts`. Two button treatments (`.btn-primary`, `.btn-secondary`) and the `.bg-brand-gradient` live as `@layer utilities` because their hover/active states can't be expressed in plain Tailwind. The live `/styleguide` route is the visual source of truth.

---

## Design Decisions

Each entry is **decision → rationale → consequence**.

### Architecture

**Frontend-only, mock-data-driven.**
Rationale: it's a prototype to demonstrate the end-to-end journey and win stakeholder buy-in, not a production system. Consequence: never add `fetch`/`axios`/API routes; all data extends `mockData.ts`; all "persistence" is localStorage via Zustand. This keeps the app deployable as a static-ish Next build with zero infra.

**Two separate Zustand stores instead of one global store.**
Rationale: onboarding and the canvas editor have different lifecycles and different `Floor` shapes; coupling them would force awkward shared types. Consequence: each persists under its own key and can be reset independently. Don't try to unify them.

**localStorage persistence (not URL/server state).**
Rationale: no backend, but the demo must survive refreshes mid-journey. Consequence: store-shape changes can collide with previously persisted data — the canvas key is already versioned (`areasim-canvas-v2`); bump the version when the shape changes incompatibly.

**URL-hash signalling (`#show-instructions`).**
Rationale: the canvas page needs to tell the count page to show its instructions modal, but they're separate routes with no shared parent to prop-drill through. Consequence: a lightweight, stateless convention — read the hash on mount, act, then `replaceState` to clean it.

**All pages are client components.**
Rationale: the app is highly interactive (Konva canvas, Framer Motion, Zustand, localStorage) and has no server data to fetch, so server components buy nothing here. Consequence: `"use client"` everywhere; don't reach for RSC/data-fetching patterns.

### UI & Design System

**Token-first theming via CSS variables → Tailwind.**
Rationale: a single source of truth for color/spacing/radius that both raw CSS and Tailwind classes can consume. Consequence: change a token in `globals.css` and it propagates everywhere (e.g. the global hover color `--color-surface-2`). Prefer editing tokens over hardcoding hex values.

**Dark mode is intentionally disabled.**
Rationale: although `tailwind.config.ts` has `darkMode: "class"` and a `ThemeToggle` exists, `ThemeProvider` force-locks the app to light mode (clears the stored theme, no-ops the toggle). The warm Nordic palette is the brand and only light was polished. Consequence: don't wire up dark-mode styling or assume the toggle works — it's a deliberate no-op.

**Two fonts, role-separated.** Manrope (`font-display`) for headings, numbers, and bold labels; DM Sans (`font-body`) for prose, buttons, inputs, and **all tables** (the shared `Table` sets `font-body`). Headings often set the family inline (`style={{ fontFamily: "var(--font-manrope)" }}`). Bold Manrope headings use **ExtraBold (800)** — `font-extrabold` / `fontWeight: 800`, and the global `h1–h6` rule is weight 800 (not 700). Consequence: keep this split; use `font-extrabold` for heading emphasis, not `font-bold`; don't introduce new font families.

**`<Button>` component over raw `<button>`.**
Rationale: hover/active bevel + gradient states (`.btn-primary` / `.btn-secondary`) can't be expressed in plain Tailwind and must stay consistent. Consequence: always use `<Button>` for user-visible actions; the CSS classes back its primary/secondary variants.

**Pastel palette conventions (the "house rules").**
A fixed four-color pastel set (`#7A6BAF`, `#4A7AAE`, `#139485`, `#C47A2C`) is cycled by index for stat-card icons, section icons, and avatars — never the primary→accent gradient for avatars. Progress bars are always warm sand `#bfa483` (no gradients). Lease-parameter cards use `#F2E7DB`. Link buttons are underline-only, no arrow icon. Rationale: these emerged from repeated design-review feedback and keep screens visually coherent. Consequence: reuse them rather than inventing new accents; the `/styleguide` route documents them.

**Sentence case, no `uppercase`.** All labels/headings use sentence case (capitalise the first letter only); the Tailwind `uppercase` class is not used anywhere. Rationale: ALL-CAPS micro-labels read as shouty and were applied inconsistently. Consequence: don't reach for `uppercase`. The **only** exception is the onboarding Step-2 lease-parameter `BarChart` axis label (`src/app/onboarding/page.tsx`), kept uppercase by request.

**One `Chip` for all pills.** The `ui/Chip` component (tones `neutral/success/warning/info/accent`, optional icon) is the single source for table category/status pills and small labels — don't hand-roll status pills. The `/styleguide` route catalogs every component under Atoms / Molecules / Organisms / Templates / Pages.

**One unified table standard.** See [Table Design Standard](#table-design-standard) below — all tables across the app share the same visual language. Rationale: tables had drifted into 5 different styles (different header backgrounds, divider colors, paddings, and some with vertical column borders). Consequence: match the standard when building any new table; reuse the shared `Table` component where practical.

### Tooling / Process

**ESLint must stay clean (Vercel gate).**
Rationale: Vercel deploys fail on ESLint errors. Consequence: run `npm run lint` before pushing; prefix genuinely-unused-but-required variables with `_` rather than deleting them.

**Dev server pinned to port 3001.**
Rationale: hardcoded in `package.json` to avoid colliding with other local apps on 3000. Consequence: if 3001 is busy, pass an explicit port (`next dev -p 3002`).

**No test infrastructure.**
Rationale: prototype scope; correctness is validated visually via `/styleguide` and the running app. Consequence: don't add test imports/files. Type-check with `npx tsc --noEmit` when needed.

---

## Table Design Standard

**Every table in the app is built from the shared `Table` component** (`src/components/ui/Table.tsx`) and its parts — `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`. There are **no** bespoke `<table>` blocks or grid-based pseudo-tables left; even tables whose cells contain checkboxes, ± steppers, dropdowns, or action buttons (e.g. the "Set room category" setup table) render through these primitives. New tables must do the same — do not hand-roll a `<table>` or a `grid` header/row layout. For row entrance animation, wrap the row with `motion.create(TableRow)`.

The component encodes the standard below as its defaults, so matching is automatic; the rules are documented here for reference and for the rare cell-level override.

### Rules

| Element | Spec |
|---------|------|
| **Wrapper** | `rounded-2xl border border-border bg-surface overflow-hidden` |
| **Header background** | `bg-surface-2` (`#FFFCF7`) |
| **Header text** | `text-[13px] font-bold text-text tracking-wider font-body` — **bold, near-black**, **sentence case** (no `uppercase`) |
| **Header padding** | `px-5 py-3` |
| **Row dividers** | `divide-y divide-border` (or `border-b border-border last:border-0`) — **horizontal only** |
| **Vertical column borders** | **None** — never separate columns with borders |
| **Row hover** | `hover:bg-[#FFFDFA] transition-colors` (a touch lighter than `surface-2`) |
| **Body cell text** | `text-sm text-text-muted font-body` — **never bold**; all columns share one font size |
| **Primary/name cell** | `text-sm text-text font-body` (darker color for hierarchy, but **not bold**) |
| **Body padding** | `px-5 py-4` (comfortable) · `px-4 py-3` (compact — dense side panels only) |
| **Numeric columns** | add `tabular-nums`; right-align trailing numeric/action columns |
| **Name cells** | no icon boxes — plain text only |

### Density

The shared component renders **comfortable** density (`px-5 py-4`) everywhere. In dense, narrow contexts (e.g. the in-session "Room history" side panel) the table is wrapped in `overflow-x-auto` rather than shrinking padding, so the visual language stays identical. Avoid per-cell padding overrides.

### Semantic row states

Row background may be overridden for status (e.g. counted = `bg-emerald-50/30`, locked-by-other = `bg-amber-50/40`). These are the only allowed deviations from the hover default and must still use no vertical borders.

> When in doubt, use the shared `Table` / `TableHeader` / `TableBody` / `TableRow` / `TableHead` / `TableCell` components — they encode this standard as their defaults.
