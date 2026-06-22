# AreaSim — Phase 2: Canvas Guide & Interactive Floor Plan Editor

## Overview
This phase builds the **heart of AreaSim** — the interactive canvas where users annotate floor plans, mark rooms, identify zones, and count room occupants. It also includes the canvas onboarding guide and the room counting dedicated page.

> ⚠️ **Prerequisite**: Phase 1 must be complete. This phase assumes the design system, theme, layout shell, and Zustand store are already in place.

---

## Tech Stack Additions (on top of Phase 1)
- **Canvas**: `Konva.js` + `react-konva` — for drawing tools on floor plan images
- **Drag & Drop**: `@dnd-kit/core` — for grouping zones
- **Tooltip**: Radix UI Tooltip
- **Confetti**: `canvas-confetti` — for gamification moments

---

## Pages to Build

### 1. Canvas Guide (`/project/[id]/canvas/guide`)

An interactive, step-by-step tutorial that walks the user through the canvas features — **similar to Gather.town's first-time guide** but adapted for floor plan annotation.

#### Guide Structure
Show a dimmed overlay with a spotlight effect on the relevant tool/area. Each step has:
- A floating tooltip/card explaining the feature
- A "Next" button to advance
- A skip option
- Step counter (e.g., "3 of 7")

**Guide Steps**:
1. **Welcome** — "Welcome to your floor plan canvas! Let's take a quick tour." (full center modal)
2. **Mark Rooms** — Spotlight on the pen tool. "Use the drawing tool to outline a room on the floor plan."
3. **Room Modal** — Spotlight on where the modal appears. "Once you draw a room, name it and start counting."
4. **Grouping Tool** — Spotlight on grouping tool icon. "Select multiple rooms and group them into a zone."
5. **Mark Zones** — Spotlight on zone tool. "Single rooms can also be their own zone."
6. **Detailed View** — Spotlight on the detail panel button. "See all your floors, zones, and rooms at a glance."
7. **Score Panel** — Spotlight on score widget top-right. "Track your progress here."
8. **You're ready!** — Full center modal with CTA: "Start Annotating"

**Visual Details**:
- Spotlight = dark overlay with a circular/rectangular cutout using CSS clip-path
- Tooltip cards: glass surface style, animated slide-in
- Smooth transitions between steps
- Background floor plan is visible but non-interactive during guide

---

### 2. Canvas Page (`/project/[id]/floor/[floorId]`)

The main interactive floor plan editor. This is the most complex screen in the app.

#### Layout
```
┌─────────────────────────────────────────────────────┐
│  Top Bar: Logo | Floor Nav | Score Widget | Actions  │
├──────────┬──────────────────────────────────────────┤
│ Left     │                                          │
│ Toolbar  │         Canvas (Floor Plan Image)        │
│          │                                          │
│ • Select │    [Drawn room polygons overlay here]    │
│ • Pen    │    [Zone highlight overlays here]        │
│ • Zone   │                                          │
│ • Group  │                                          │
│ • Eraser │                                          │
├──────────┴──────────────────────────────────────────┤
│  Bottom: Zoom controls | Undo/Redo | Help           │
└─────────────────────────────────────────────────────┘
```

#### Top Bar Components

**Logo** — Click to navigate to `/dashboard` (all projects)

**Floor Navigation** — Dropdown/tabs to switch between floors of the current building. Shows floor name + completion status (e.g., a small green checkmark if all rooms counted).

**Score Widget** (top-right, always visible):
```
┌─────────────────────────────┐
│  🏠 Rooms    0 / 10         │
│  📦 Zones    0              │
│  📋 Survey   0 responses    │
└─────────────────────────────┘
```
- Animated number increment when counts change
- Gamification: when a milestone is hit (e.g., all rooms identified), show a brief confetti burst + toast message

**Action Buttons**:
- "Detailed View" — opens the right-side detail panel
- "Conduct Survey" — opens survey modal

#### Left Toolbar
Vertical icon toolbar, similar to Figma:
- **Select** (arrow icon) — select/move drawn shapes
- **Pen / Draw** (pen icon) — draw room polygon (Figma-style: click to add points, double-click or close to finish)
- **Zone Draw** (zone icon) — draw a zone directly (for single-room zones)
- **Group** (group icon) — select multiple rooms to group as a zone
- **Eraser** (eraser icon) — delete a drawn room or zone
- Tool is highlighted when active

#### Canvas Area (Konva.js)
- The uploaded floor plan image is the base layer
- Users draw **polygon shapes** on top using the pen tool
- Each polygon = one room annotation
- Polygons have:
  - Semi-transparent fill (color-coded: unvisited = blue-tinted, counted = green-tinted, zones = amber-tinted)
  - Stroke border
  - Label (room name) displayed inside

**Drawing Interaction (Pen Tool)**:
- Click on canvas to place polygon points
- Points connected by lines as user clicks
- Double-click or click the first point to close and finish the shape
- On completion → **Room Modal** appears anchored near the shape

#### Room Modal (appears after drawing a room)
Floating card that appears adjacent to the newly drawn polygon:
```
┌──────────────────────────────┐
│ 🏷️  Room Name               │
│    [____________________]   │
│                             │
│ 📝 Description              │
│    You can now count the    │
│    room capacity            │
│                             │
│ [Start Room Counting]       │
│ [View Details]              │
└──────────────────────────────┘
```
- Animated slide-in from the side
- Room name is editable inline
- "Start Room Counting" navigates to `/project/[id]/room/[roomId]/count`
- "View Details" opens the detail panel filtered to this room
- Modal can be dismissed and re-opened by clicking the room shape

#### Zone Grouping
- User holds Shift + clicks multiple room polygons to select them
- A "Group as Zone" button appears in a floating action bar
- User gives the zone a name in a small inline input
- Grouped rooms get an outer zone boundary drawn around them (dashed line, amber color)
- Zone label appears at the center

#### Detailed View Panel (right-side drawer)
Slides in from the right when "Detailed View" is clicked:
```
┌─────────────────────┐
│ Floor 1 Details     │
│                     │
│ Zones (3)           │
│  ├ Zone A           │
│  │   Room 1 ✅      │
│  │   Room 2 🔄      │
│  └ Zone B           │
│      Room 3 ⬜      │
│                     │
│ + Add Zone          │
│                     │
│ Unzoned Rooms (2)   │
│  Room 4, Room 5     │
└─────────────────────┘
```
- Tree structure showing zones and their rooms
- Status icons: ✅ = counted, 🔄 = counting in progress, ⬜ = not started
- Click a room to highlight it on canvas
- "Add Zone" button inline

#### Conduct Survey Modal
Opens when "Conduct Survey" is clicked:
- Shows 2–3 pre-built survey template cards (e.g., "Space Satisfaction Survey", "Ergonomics Survey", "Collaboration Survey")
- Each card shows: title, description, number of questions, estimated time
- "Preview" and "Send to Floor" / "Send to Building" buttons
- Send action shows a confirmation with recipient count

#### Bottom Controls
- Zoom in / Zoom out / Reset zoom
- Undo / Redo (Ctrl+Z / Ctrl+Shift+Z)
- "?" help button that re-triggers the guide

---

### 3. Room Counting Page (`/project/[id]/room/[roomId]/count`)

A dedicated full-screen page inspired by [empireai.co](https://empireai.co) — bold, visually striking, purpose-built for counting.

#### Layout Concept
Think: dark background, large central number, clean controls. Energetic but focused.

```
┌────────────────────────────────────────────────────┐
│  ← Back to Canvas       Conference Room A          │
│                                                    │
│           ╔═════════════════════╗                  │
│           ║                     ║                  │
│           ║       COUNT         ║                  │
│           ║                     ║                  │
│           ║    [ − ]  24  [ + ] ║                  │
│           ║                     ║                  │
│           ║  [  Set Count  ]    ║                  │
│           ╚═════════════════════╝                  │
│                                                    │
│  Counting History                                  │
│  ┌──────────────────────────────────────────────┐  │
│  │ Count  │ By         │ Date       │ Time      │  │
│  │ 24     │ John K.    │ Mon Apr 14 │ 09:22 AM  │  │
│  │ 21     │ Sarah L.   │ Mon Apr 14 │ 02:15 PM  │  │
│  └──────────────────────────────────────────────┘  │
│                                                    │
│  This room can be counted 3x/day for 7 days        │
│  Progress: ████████░░  Day 3 of 7                  │
└────────────────────────────────────────────────────┘
```

**Design Direction** (empireai.co inspired):
- Dark mode by default for this screen (even if user is in light mode)
- Large, bold count number with a subtle glow/pulse animation
- [ − ] and [ + ] buttons are oversized and tactile
- Gradient accent colors match AreaSim's aurora palette
- Animated progress bar for "Day X of 7"
- History table with soft row hover effect

**Business Logic (UI only)**:
- Count can be set 3 times per day
- Counting window is 7 consecutive days
- If max counts for the day are reached, show a locked state with "Come back tomorrow"
- Counting history table shows: count value, who counted (mock user), date, time
- "Set Count" saves the current count (show success animation)

**Gamification moment**: When a count is set, show a brief animated checkmark + "+1 room counted" toast that updates the score widget.

---

## Completion Flow — "Move to Room Program" Modal

Once all rooms are counted, all zones are identified, and at least some survey responses are collected, a modal appears automatically:

```
┌──────────────────────────────────────────────┐
│                                              │
│   🎉  Amazing Work!                          │
│                                              │
│   You've completed the workspace analysis    │
│   for Floor 1. You're ready for the next     │
│   step.                                      │
│                                              │
│   ┌──────────────────────────────────────┐   │
│   │  🔒  Room Program                    │   │
│   │  Expert AI-powered advice based on   │   │
│   │  your gathered workspace data.       │   │
│   │                                      │   │
│   │  From NOK 2,499/month                │   │
│   │                                      │   │
│   │  [ Pay Now & Unlock ]                │   │
│   └──────────────────────────────────────┘   │
│                                              │
│   [ Continue Reviewing ]                     │
└──────────────────────────────────────────────┘
```
- Confetti animation behind modal
- "Pay Now & Unlock" button is prominent (no actual payment in this phase — just UI state)
- Clicking it shows a "Payment Coming Soon" placeholder or navigates to a subscription page stub

---

## Animations & Interactions Checklist
- [ ] Canvas: smooth polygon drawing with point-by-point placement
- [ ] Room modal: slide-in adjacent to drawn shape
- [ ] Zone grouping: dashed outline animates into place
- [ ] Score widget: number count-up animation on increment
- [ ] Score milestone: confetti burst
- [ ] Guide: spotlight clip-path transition between steps
- [ ] Detailed panel: slide-in from right
- [ ] Room count: pulse animation on the large count number
- [ ] Count increment/decrement: tactile button press feel (scale down)
- [ ] Day progress bar: fill animation on load
- [ ] Completion modal: entrance with scale + fade + confetti

---

## Mock Data to Include
```typescript
// Mock floor plan
const mockFloor = {
  id: 'floor-1',
  name: 'Ground Floor',
  imageUrl: '/mock/floorplan-ground.png', // placeholder image
  rooms: [],
  zones: [],
}

// Mock room count history
const mockCountHistory = [
  { count: 24, by: 'John K.', date: '2024-04-14', time: '09:22 AM' },
  { count: 21, by: 'Sarah L.', date: '2024-04-14', time: '02:15 PM' },
]

// Mock survey templates
const mockSurveys = [
  { id: 1, title: 'Space Satisfaction Survey', questions: 8, minutes: 3 },
  { id: 2, title: 'Ergonomics Assessment', questions: 12, minutes: 5 },
  { id: 3, title: 'Collaboration Needs', questions: 6, minutes: 2 },
]
```

---

## Notes for Claude Code
- The floor plan image can be a placeholder image for now — use a realistic-looking mock floor plan SVG if no upload is available
- Konva canvas should be responsive and fill available space
- All drawn shapes should be stored in Zustand (no persistence to backend needed)
- The room counting page should feel like a completely different, immersive experience — dark, bold, energetic
- Keep the guide tooltips accessible (keyboard navigable)
