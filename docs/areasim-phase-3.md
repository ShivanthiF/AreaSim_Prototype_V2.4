# AreaSim — Phase 3: Dashboard, Project Overview & Subscription

## Overview
This final phase builds the **main dashboard**, **project management views**, **subscription/paywall UI**, and any remaining polish — notifications, empty states, responsive refinements, and the complete navigation experience. This brings AreaSim to a fully shippable frontend state.

> ⚠️ **Prerequisite**: Phases 1 and 2 must be complete. This phase assumes the design system, canvas, and onboarding flows are already in place.

---

## Pages to Build

### 1. Main Dashboard (`/dashboard`)

The home screen after login. Users see all their projects/buildings.

#### Layout
```
┌─────────────────────────────────────────────────────────┐
│  Sidebar  │  Top Bar: Search | Notifications | Profile  │
│           ├─────────────────────────────────────────────┤
│  Nav:     │  Dashboard                                  │
│  • Home   │  ┌────────────────────────────────────────┐ │
│  • Proj.  │  │ Welcome back, Erik 👋                  │ │
│  • Anal.  │  │ You have 2 active projects             │ │
│  • Survey │  └────────────────────────────────────────┘ │
│  • Subs.  │                                             │
│  • Help   │  Quick Stats Row                            │
│           │  [Projects] [Floors] [Rooms] [Surveys sent] │
│           │                                             │
│           │  Your Projects                              │
│           │  [Card] [Card] [+ New Project]              │
│           │                                             │
│           │  Recent Activity Feed                       │
└─────────────────────────────────────────────────────────┘
```

#### Sidebar Navigation
Fixed left sidebar (collapsible on mobile):
- AreaSim logo at top (click → dashboard)
- Navigation items with icons:
  - **Dashboard** (home icon)
  - **Projects** (buildings icon)
  - **Analytics** (chart icon) — Phase 3 stub
  - **Surveys** (clipboard icon)
  - **Subscription** (crown/star icon)
  - **Help** (question mark icon)
- User profile + avatar at bottom
- Collapse toggle button

#### Welcome Banner
- Personalized greeting with user's first name
- Summary: "You have X active projects"
- If no projects yet → onboarding CTA

#### Quick Stats Row (4 metric cards)
Animated count-up on page load:
| Metric | Icon | Value |
|---|---|---|
| Active Projects | 🏢 | 2 |
| Total Floors | 📐 | 6 |
| Rooms Identified | 🚪 | 34 |
| Survey Responses | 📋 | 128 |

Each card: glass surface, hover lift, icon with gradient background

#### Projects Grid
Cards for each project/building:
```
┌──────────────────────────┐
│  [Building thumbnail]    │
│                          │
│  Oslo HQ                 │
│  Aker Brygge, Oslo       │
│                          │
│  3 floors  •  22 rooms   │
│                          │
│  Progress ████████░░ 80% │
│                          │
│  [Open Canvas]  [···]    │
└──────────────────────────┘
```
- Building thumbnail = a color-coded placeholder with floor plan silhouette
- Progress bar = percentage of rooms counted + zones identified
- "···" menu: Edit, Duplicate, Archive
- "+ New Project" card with dashed border and plus icon

#### Recent Activity Feed
Timeline-style list:
- "Sarah marked 3 rooms on Floor 2 — 2h ago"
- "John completed room counting for Meeting Room A — 5h ago"
- "Survey sent to 45 employees — Yesterday"
- Each item has icon, description, timestamp, avatar

---

### 2. Project Detail Page (`/project/[id]`)

Overview of a single project/building.

#### Sections

**Project Header**:
- Building name, location, category badge
- Edit button
- Status badge (Active / Archived)

**Building Summary Cards**:
- Total area (SqFt)
- Annual rent cost (NOK)
- Cost per sqft
- Target headcount
- Current occupancy estimate

**Floors Tab Panel**:
Tabs for each floor. Each floor tab shows:
- Floor name
- Number of rooms identified / total
- Zones count
- Survey responses for this floor
- "Open Canvas" button → navigates to the canvas page
- Completion status indicator

**Lease Parameters Section**:
- Read-only summary of lease parameters set during onboarding
- "Edit" button to modify

**Team Members Section** (UI only):
- Shows avatar list of team members who have accessed this project
- "Invite Team Member" button (opens modal with email input — no real invite)

---

### 3. Surveys Page (`/surveys`)

Manage all surveys across projects.

#### Layout
- **Header**: "Surveys" title + "Create Survey" button
- **Filters**: All / Sent / Draft / Archived + Project filter dropdown
- **Survey list table**:

| Survey Name | Project | Floor | Sent To | Responses | Completion | Status | Actions |
|---|---|---|---|---|---|---|---|
| Space Satisfaction | Oslo HQ | Floor 1 | 45 employees | 38 | 84% | ✅ Active | View / Archive |
| Ergonomics Q1 | Bergen Office | All | 22 employees | 12 | 55% | 🔄 Open | View / Close |

- Row hover highlight
- Response rate progress bar inline
- Click row → Survey Detail view

#### Survey Detail View (`/surveys/[id]`)
- Survey title, description
- Response breakdown with simple bar charts (no chart library needed — CSS bars)
- Question-by-question summary
- Export button (UI only — shows "Coming Soon" toast)

---

### 4. Subscription Page (`/subscription`)

The paywall / upgrade screen.

#### Layout
Clean, elegant pricing page:

**Header**: "Unlock the Full Power of AreaSim"

**Current Plan Banner** (if on free tier):
```
┌────────────────────────────────────────────┐
│  You're on the Free Plan                   │
│  Upgrade to unlock Room Program insights  │
└────────────────────────────────────────────┘
```

**Pricing Cards** (2 tiers):

```
┌──────────────────────┐  ┌──────────────────────┐
│  Starter             │  │  ★ Professional      │
│                      │  │  (Most Popular)      │
│  Free                │  │  NOK 2,499/month     │
│                      │  │                      │
│  ✓ Project setup     │  │  Everything in Free  │
│  ✓ Floor upload      │  │  ✓ Room Program AI   │
│  ✓ Room counting     │  │  ✓ Advanced analytics│
│  ✓ Basic surveys     │  │  ✓ Export reports    │
│  ✗ Room Program      │  │  ✓ Priority support  │
│  ✗ AI insights       │  │  ✓ Team collaboration│
│                      │  │                      │
│  [Current Plan]      │  │  [Upgrade Now]       │
└──────────────────────┘  └──────────────────────┘
```

**Upgrade Flow** (clicking "Upgrade Now"):
- Modal opens with plan summary
- "Proceed to Payment" button (links to a stub `/payment` page)
- The payment page shows a form UI (card number, expiry, CVV) — **no real payment, just UI with a "Coming Soon" message or a mock confirmation state**
- After "mock pay" → show success screen with confetti + redirect to dashboard

**FAQ Section** below pricing:
- 5-6 common questions about pricing, cancellation, data security

---

### 5. Empty States & Error Pages

Build polished empty states for every list/grid:

| Screen | Empty State Message | CTA |
|---|---|---|
| Dashboard (no projects) | "No projects yet. Let's set up your first workspace." | "Create Project" |
| Surveys (none sent) | "No surveys yet. Start by sending one from the canvas." | "Go to Canvas" |
| Floors (no rooms marked) | "No rooms identified yet. Open the canvas to get started." | "Open Canvas" |

Each empty state should have:
- A relevant illustration (SVG, abstract/minimal, consistent with AreaSim aesthetic)
- Short headline + subtext
- CTA button

Also build:
- `404` page — with AreaSim branding and a "Go Home" button
- `500` error page — brief, friendly message

---

### 6. Profile & Settings (`/settings`)

Simple settings page:

**Tabs**:
- **Profile**: Name, email, job title, company, profile photo upload (UI only)
- **Notifications**: Toggle switches for email notification preferences
- **Security**: Change password form
- **Organization**: Company name, logo upload, default currency/unit (NOK/SqFt)

---

## Navigation & Global UX Polish

### Breadcrumbs
Add breadcrumb navigation on deeper pages:
- `Dashboard > Oslo HQ > Floor 1 > Conference Room A`

### Notifications Panel
Bell icon in top bar. Click → slide-down panel:
- List of recent system notifications
- "Mark all read" button
- Badge count on bell icon when unread

### Global Search
Search icon in top bar → expands to a search input:
- Searches projects, floors, rooms
- Shows results in a dropdown as user types (mock data)
- Keyboard navigable

### Responsive Behavior
- **Desktop** (1280px+): Full sidebar expanded
- **Tablet** (768px–1279px): Sidebar collapsed to icons only
- **Mobile** (< 768px): Sidebar hidden, accessible via hamburger menu → drawer overlay
- Canvas page: on mobile, show a "Best experienced on desktop" banner but still render

---

## Final Polish Checklist

### Animations & Micro-interactions
- [ ] Sidebar: smooth collapse/expand animation
- [ ] Dashboard stats: count-up on mount
- [ ] Project cards: staggered entrance animation
- [ ] Activity feed: slide-in from bottom
- [ ] Notification panel: slide down from top-right
- [ ] Search expand: smooth width animation
- [ ] Subscription modal: scale entrance
- [ ] Payment success: confetti + checkmark animation
- [ ] Empty state illustrations: subtle float animation
- [ ] Page transitions: consistent fade or slide throughout app

### Consistency Audit
- [ ] All buttons use the same `<Button>` component
- [ ] All cards use consistent border-radius, shadow, padding
- [ ] Typography scale is consistent (no random font sizes)
- [ ] Colors only from CSS variables (no hardcoded hex except in globals.css)
- [ ] Dark mode looks polished on every screen
- [ ] All interactive elements have focus states (accessibility)
- [ ] Loading skeletons match the layout they replace

---

## Mock Data to Include

```typescript
// Mock projects
const mockProjects = [
  {
    id: 'proj-1',
    name: 'Oslo HQ',
    building: 'Aker Brygge Tower',
    location: 'Oslo, Norway',
    category: 'Office',
    floors: 3,
    rooms: 22,
    progress: 80,
    totalArea: 4500,
    annualRent: 1200000,
    targetHeadcount: 85,
  },
  {
    id: 'proj-2',
    name: 'Bergen Office',
    building: 'Bryggen Business Centre',
    location: 'Bergen, Norway',
    category: 'Co-working',
    floors: 2,
    rooms: 12,
    progress: 45,
    totalArea: 1800,
    annualRent: 480000,
    targetHeadcount: 35,
  },
]

// Mock activity feed
const mockActivity = [
  { id: 1, user: 'Sarah L.', action: 'marked 3 rooms on Floor 2', project: 'Oslo HQ', time: '2h ago' },
  { id: 2, user: 'John K.', action: 'completed room counting for Conference Room A', project: 'Oslo HQ', time: '5h ago' },
  { id: 3, user: 'You', action: 'sent survey to 45 employees', project: 'Bergen Office', time: 'Yesterday' },
]

// Mock user
const mockUser = {
  name: 'Erik Johansen',
  email: 'erik@company.no',
  role: 'Workspace Manager',
  company: 'Norsk Finans AS',
}
```

---

## Notes for Claude Code
- This phase is about **completeness and polish** — every screen should feel finished
- Prioritize consistency over new features
- The subscription/payment page is UI-only — no Stripe or real payment integration
- Make the empty states memorable — they are a core part of the experience
- Add a `CHANGELOG.md` noting what was built in each phase
- Final deliverable should be a runnable Next.js app with `npm run dev`
