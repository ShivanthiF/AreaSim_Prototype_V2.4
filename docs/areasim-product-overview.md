# AreaSim — Product Overview

> Problem, purpose, big picture, feature map, and user journeys for the AreaSim prototype.

---

## Problem Statement

Organizations struggle to make informed workplace and lease decisions because they lack accurate data about how their workspace is being used and what they will need in the future. These decisions are high-stakes and hard to reverse — multi-year leases and significant capital commitment — yet they are often made on assumptions.

Specific pains:

- Limited visibility into how office spaces are actually used
- Decisions are often based on assumptions rather than evidence
- Difficulty identifying future space requirements
- Challenges building a business case for workplace investments
- Uncertainty during lease negotiations and property selection
- Risk of overestimating or underestimating space needs
- Fragmented data across occupancy studies, surveys, and stakeholder inputs

---

## Project Overview

The purpose of the project is to support the organization through the **early and most critical phase** of the workplace and lease decision process by establishing a robust, evidence-based foundation for future premises.

The project delivers:

- A **unified workplace concept**
- A **detailed room and functional program**
- A **quantified business case**

These can be used for internal decision-making, external tendering, and negotiations with property owners.

---

## User Groups

- **Company employees** (mostly company admins) — the client organisation evaluating their own space
- **AreaSim Consultants / Admins** — experts who often run the studies (including room counting) on behalf of clients

---

## Personas

### Persona 1 — Ingrid Hansen, Workspace Manager *(Company Admin)*

| | |
|---|---|
| **Role** | Workspace / Facilities Manager at the client organisation |
| **User group** | Company employee (admin) |
| **Tech comfort** | Comfortable with business software; not a designer or analyst |

**Context:** Ingrid is responsible for how her company's office actually functions day-to-day. The lease is up for renewal in 18 months and leadership has asked her to recommend whether to renew, downsize, or relocate — with evidence, not gut feel.

**Goals**
- Understand how the current office is really used, room by room
- Produce a business case her CFO and leadership will trust
- Avoid over- or under-committing on the next lease

**Frustrations**
- Occupancy data, surveys, and stakeholder opinions live in scattered spreadsheets and emails
- She's expected to justify big property decisions but has only assumptions to go on
- Past "everyone back to the office" debates went nowhere without data

**How she uses AreaSim**
- Creates the project, sets lease parameters, and uploads floor plans during onboarding
- Reviews the dashboard, counting reports, and survey results
- Invites colleagues and assigns roles for the study
- Uses the resulting **business case** for internal decisions and lease negotiations

---

### Persona 2 — Mikkel Thorsen, AreaSim Consultant *(Consultant / Admin)*

| | |
|---|---|
| **Role** | Workplace consultant engaged by AreaSim to run studies for clients |
| **User group** | AreaSim Consultant / Admin |
| **Tech comfort** | Power user — lives in the tool, knows every screen |

**Context:** Mikkel is hired to run a workspace utilisation study for a client. He spends time on-site walking floors and collecting data, then synthesises it into a room programme and business case the client can act on.

**Goals**
- Capture accurate occupancy data quickly while walking the floor
- Turn raw counts + survey input into a defensible room & functional program
- Deliver a polished, evidence-backed business case to the client

**Frustrations**
- Manual counting on paper or spreadsheets is slow and error-prone
- Reconciling objective counts with subjective survey sentiment is tedious
- Clients push back on recommendations that aren't clearly backed by data

**How he uses AreaSim**
- Sets up rooms, zones, and categories on the canvas (incl. AI-detected room verification)
- Runs **room counting sessions** on-site, room by room, with the counting tool
- Combines counting data with survey responses to build the **room programme**
- Hands the client a quantified business case for tendering and negotiation

---

## The Big Picture (Value Pipeline)

```
Room Counting ─┐
               ├──→  Room Programme  ──→  Business Case
Survey ────────┘
```

Two evidence sources feed the pipeline:

- **Room Counting** — *objective* evidence: how rooms are actually occupied and used
- **Survey** — *subjective* evidence: employee/stakeholder needs, sentiment, and ways of working

These converge into the **Room Programme** — the detailed room & functional program (what spaces the organisation needs and how many), combining hard usage numbers with qualitative input. The Room Programme then produces the **Business Case** — the quantified justification used for internal decisions, tendering, and lease negotiations.

**Why both inputs exist:** counting alone tells you usage; surveys alone tell you sentiment. Neither is enough on its own to defend a workplace investment — the strength of the business case comes from combining them.

This maps directly to the project deliverables: workplace concept → room/functional program → quantified business case.

---

## Feature Map

### Auth & Setup

#### Auth Flow
| Feature | Description |
|---------|-------------|
| Sign Up | Email + password registration |
| Sign In | Returning user login |
| Verify Email | OTP / email confirmation |
| Create Password | Secure password setup |
| Org Details | Organisation name, number, address |

#### Onboarding (4-step wizard)
| Feature | Description |
|---------|-------------|
| Step 1 — Project | Project name, office location, category, industry |
| Step 2 — Lease Params | Total area, annual rent, common area cost, headcount, lease expiry |
| Step 3 — Floor Plans | Upload PDF/PNG floor plans or skip |
| Step 4 — Done | Potential score reveal + completion confirmation |
| Efficiency Charts | Live space efficiency & cost-per-employee preview in Step 2 |
| Journey Bar | 7-step monopoly-themed progress tracker visible across all pages |

---

### Canvas & Counting

#### Floor Plan Canvas
| Feature | Description |
|---------|-------------|
| Pen Tool | Draw polygon rooms by clicking vertices, double-click to close |
| Select Tool | Click/drag to move rooms, opens Detail Panel |
| Zone Tool | Assign rooms to colour-coded zones via RoomModal |
| Eraser Tool | Delete drawn rooms |
| AI Detection | Sidebar list of AI-detected rooms from uploaded floor plan |
| Verify Room | Draw-to-verify modal for confirming AI-detected rooms |
| Detail Panel | Room info, name, zone, sqm, category editor |
| Canvas Guide | Step-by-step floating tutorial overlay |
| Floor Selector | Dropdown to switch active floor |
| Survey Modal | Launch a survey directly from the canvas |

#### Room Counting
| Feature | Description |
|---------|-------------|
| Session Details | Set session name, start/end date, select floor |
| Instructions Modal | "How to use" guide — shown only on `#show-instructions` hash entry |
| Room List | Rooms listed with status: unvisited / counting / counted |
| Multi-select Rooms | Checkboxes to bulk-assign category to multiple rooms |
| Count Entry | Enter people count + optional comment per room |
| Count History | Per-room log of every count (who, when, how many) |
| Save & Continue | Save current floor and navigate to next floor |
| Stop Session | Confirm modal to end and exit counting session |
| History Charts | Area utilisation trend + room usage split over time |

---

### Dashboard & Management

#### Dashboard
| Feature | Description |
|---------|-------------|
| Stat Cards | Total projects, rooms mapped, avg utilisation %, survey responses |
| Welcome Banner | Brand gradient banner with "View all projects" CTA |
| Recent Projects | Project cards with completion progress bars and status badges |
| Activity Feed | Chronological list of team actions (counted, invited, added floor, etc.) |
| Invite Modal | Invite team member by email or bulk CSV upload |
| Notifications | Bell icon dropdown with unread count |
| Profile Dropdown | Settings, Subscription, Help, Sign out |

#### Projects
| Feature | Description |
|---------|-------------|
| Projects List | Grid of project cards with status, floors, rooms, completion % |
| Project Detail | Tabbed detail page — Overview / Floors / Team |
| Overview Tab | Horizontal stat cards + building summary + lease parameters |
| Lease Parameters | Displays lease start/end, rent, area, cost/sqm, lease type |
| Floors Tab | Per-floor cards with progress bar and "Open canvas" button |
| Team Tab | Member list with pastel avatars, roles, and join date |

#### Surveys
| Feature | Description |
|---------|-------------|
| Surveys List | Filterable table by status (All / Sent / Draft / Archived) and project |
| Survey Detail | Full question breakdown with response data |
| Response Charts | Rating bars, yes/no split, multiple choice breakdown |
| Completion Bar | Sent-to vs responded progress indicator |

#### Members
| Feature | Description |
|---------|-------------|
| Members Table | Searchable, filterable by status (All / Active / Pending) |
| Roles | Admin / Analyst / Observer with colour-coded badges |
| Invite by Email | Single email + role invite form |
| Invite by CSV | Bulk import via `email, role` CSV paste |
| Remove Member | Contextual three-dot menu with remove action |

---

### System & UI

| Feature | Description |
|---------|-------------|
| Design System | Live styleguide at `/styleguide` — all components, variants, tokens |
| Language Selector | EN / NO toggle in top nav |
| Dark Mode | ThemeProvider + Tailwind `class` toggle |
| Settings Page | User profile preferences |
| Subscription Page | Plan overview and billing |
| 404 / Error Pages | Custom `not-found.tsx` and `error.tsx` |
| Zustand Persistence | Canvas state (`areasim-canvas-v2`) and onboarding state (`areasim-onboarding`) persisted to localStorage |

---

## User Journeys

### Journey 1 — New User Onboarding

**Goal:** Get from sign-up to a project ready for floor plan editing.

```
Sign Up
  → Verify Email
  → Create Password
  → Organisation Details (name, org number, address)
  → Onboarding Step 1: Create Project (name, address, category, industry)
  → Onboarding Step 2: Lease Parameters (area, rent, headcount, expiry date)
       └─ Efficiency charts update live as values are entered
  → Onboarding Step 3: Upload Floor Plans (PDF/PNG per floor, or skip)
  → Onboarding Step 4: Done — potential score revealed
  → Navigates to /project/[id]/floor/[floorId]
  → Canvas Guide overlay walks through 4 steps:
       1. Select the pen tool
       2. Click to draw room polygon (double-click to close)
       3. Name the room in the Detail Panel
       4. Assign a zone via the Zone tool
```

**Key state:** `useOnboardingStore` (Zustand, persisted) tracks current step, project data, floors, and lease params throughout.

---

### Journey 2 — Floor Plan Setup (Canvas)

**Goal:** Draw rooms, assign zones, and verify AI-detected rooms on a floor.

```
Dashboard / Projects
  → Project Detail → Floors Tab
  → "Open canvas" (navigates to /project/[id]/floor/[floorId])
  → AI Detection sidebar: verify detected rooms with draw-to-verify modal
  → Mark zones complete → Completion modal appears
  → "Start room counting" → navigates to count page with #show-instructions hash
```

**Key state:** `useCanvasStore` (Zustand, persisted) holds all floors, rooms, zones, selected room IDs, and active tool.

---

### Journey 3 — Room Counting Session

**Goal:** Walk the floor and record occupancy counts for every room.

```
Canvas page → "Start room counting"
  → Count page loads with "How to use the counting tool" modal (instructions)
  → Set room category and capacity page → For each room set room category and capacity, then "verify and continue" button
  → Optional: select multiple rooms → bulk-assign category
  → Click start session
  → Start session modal opens: Auto generated (editable) session name, floor, start date, time, round, instruction to click "Start counting button" related to each room
  → Room list displayed with status indicators
  → For each room:
       a. Click "Start counting" button → status changes to "counting"
       b. Navigate to a new screen
       c. Set count (use plus minus buttons)
       d. Add optional comment
       e. "Save count" → status changes to "counted"
  → "Save count and continue" → moves to next room
  → Last room: "Complete this floor" → "continue to next floor" modal
  → Optional: Add comments related to rooms
  → View History → /history charts page (area trend + usage split)
  → Got questions → Q and A modal
  → Edit room settings → goes back to edit room settings page
```

**Entry signal:** `#show-instructions` hash in the URL triggers the instructions modal on first entry; cleaned with `window.history.replaceState` immediately after.

---

### Journey 4 — Survey Management

**Goal:** Send a workspace satisfaction survey and review responses.

```
Surveys tab (top nav)
  → Surveys list with status filter (All / Sent / Draft / Archived)
  → Filter by project via dropdown
  → "Create new survey" → (future: survey builder)
  → Click a survey row → Survey Detail page
       └─ Per-question breakdown: rating bars, yes/no split, multiple choice
       └─ Completion %: responses / sent
  → Canvas → Survey modal → launch survey linked to a specific floor
```

---

### Journey 5 — Team Management

**Goal:** Invite colleagues and assign roles for a workspace project.

```
Members tab (top nav)  OR  Project Detail → Team tab
  → Members table: search by name/email, filter Active / Pending
  → "Invite member" → modal opens:
       a. Email tab: enter email + select role (Admin / Analyst / Observer) → send
       b. CSV tab: paste `email, role` rows → bulk import
  → Invited member appears with "Pending" status
  → Three-dot menu on any member row: Edit role / Remove
  → Project Detail → Team tab: view members scoped to that project
```

---

### Journey 6 — Returning User (Daily Use)

**Goal:** Check in, review activity, and pick up where the team left off.

```
Sign In
  → Dashboard
       └─ Stat cards: projects, rooms, utilisation, survey responses
       └─ Activity feed: see what the team did recently
       └─ Recent projects: check completion % at a glance
  → Click a project card → Project Detail
       └─ Overview: lease params + building summary
       └─ Floors: check per-floor progress
       └─ Team: see who's active
  → Continue counting on any floor in progress
       OR review survey responses
       OR open canvas to add/edit rooms
```
