# AreaSim — Phase 1: Foundation, Onboarding & Project Setup

## Overview
Build the complete frontend foundation for **AreaSim** — a Norwegian SaaS workspace intelligence platform. This phase covers the design system, landing/auth screens, onboarding flow, and project setup wizard.

---

## Tech Stack
- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + CSS variables for theming
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **State**: Zustand
- **UI Primitives**: Radix UI

---

## Brand & Design System

### Identity
- **Company**: AreaSim
- **Country**: Norway
- **Tagline**: "Workspace Intelligence, Reimagined"

### Color Palette
Inspired by Norwegian landscapes — fjords, northern lights, and Nordic minimalism:

```css
/* Light Mode */
--color-primary: #0A4F6E;        /* Deep fjord blue */
--color-primary-light: #1A7FA8;  /* Arctic water */
--color-accent: #00C9A7;         /* Aurora teal */
--color-accent-warm: #FF6B6B;    /* Midnight sun coral */
--color-bg: #F7F9FC;             /* Snow white */
--color-surface: #FFFFFF;
--color-surface-2: #EEF3F8;
--color-text: #0D1B2A;
--color-text-muted: #5C7A8A;
--color-border: #D0DDE6;

/* Dark Mode */
--color-primary: #1A7FA8;
--color-accent: #00C9A7;
--color-bg: #080F17;             /* Deep arctic night */
--color-surface: #0D1B2A;
--color-surface-2: #13263A;
--color-text: #E8F4F8;
--color-text-muted: #6A8FA3;
--color-border: #1E3448;
```

### Typography
- **Display font**: `Syne` (bold, geometric — modern Nordic feel)
- **Body font**: `DM Sans` (clean, readable)
- **Mono**: `JetBrains Mono` (for data/metrics)

### Design Language
- Glassmorphism cards with subtle backdrop-blur
- Smooth gradient meshes in backgrounds
- Micro-interactions on every interactive element
- Fluid animations — nothing feels abrupt
- Inspired by: [neowit.io](https://neowit.io) and [empireai.co](https://empireai.co)
- **IMPORTANT**: Enterprise-grade but never boring. Think: spatial intelligence meets Scandinavian design.

---

## Pages & Components to Build

### 1. Global Layout & Design Tokens
- `globals.css` — full CSS variable system for light/dark mode
- `ThemeProvider` — light/dark toggle with localStorage persistence
- `Layout` component — sidebar nav + top bar shell (empty state for now)
- Animated page transitions (Framer Motion `AnimatePresence`)
- Custom scrollbar styling
- Loading skeleton components

### 2. Landing / Marketing Page (`/`)
A stunning hero page that communicates AreaSim's value:

**Sections**:
- **Hero**: Bold headline "Transform How Your Organization Works" with animated background (subtle particle or gradient mesh effect). CTA buttons: "Get Started Free" + "See How It Works"
- **Problem Section**: Visual cards showing the 4 pain points (No efficiency analysis, Suboptimal utilization, Cost gaps, Lack of support) — use risk badges (High/Medium)
- **Solution Section**: 4 feature cards (Current workspace analysis, New space discovery, Ongoing optimization, Implementation support) with icons and hover animations
- **How It Works**: 3-step visual flow with connecting lines/animations
- **CTA Banner**: Full-width gradient section with "Start Your Workspace Journey"
- **Footer**: Simple with logo, links, Norway 🇳🇴

**Visual Details**:
- Animated gradient mesh background on hero
- Floating illustration elements (abstract floor plan shapes)
- Numbers that count up on scroll (e.g., "40% space savings")
- Smooth scroll-triggered reveal animations for each section

### 3. Authentication Pages

#### Sign Up (`/signup`)
- Clean split layout: left = animated brand visual, right = form
- Email input with real-time validation
- "Continue with Email" button
- Progress feels smooth — no jarring transitions
- Link to login

#### Email Verification (`/verify-email`)
- Elegant waiting screen with animated envelope/mail icon
- 6-digit OTP input (auto-advance between inputs)
- Resend code option with countdown timer
- Subtle pulsing animation while waiting

#### Create Password (`/create-password`)
- Password + confirm password fields
- Live password strength indicator (animated progress bar)
- Show/hide toggle
- Requirements checklist that checks off in real-time

### 4. Onboarding Wizard — Project Setup (`/onboarding`)
A multi-step wizard. Show a progress bar/stepper at the top.

#### Step 1: Create Your First Project
Fields:
- Project name (text input)
- Building name (text input)
- Category (dropdown: Office, Co-working, Retail, Healthcare, Education, Other)
- Location (text input with country flag for Norway default)

#### Step 2: Add Floor Names
- Dynamic list — user can add/remove floor names
- "Add Floor" button with smooth list animation
- Drag to reorder floors (optional visual)
- Floor name + floor level (e.g., Ground, 1st, 2nd…)

#### Step 3: Lease Parameters
Fields:
- Total area (SqFt) — number input with formatted display
- Annual rent cost — currency input (NOK default)
- Common area cost — currency input
- Target headcount — number input with +/- stepper

#### Step 4: Upload Floor Layout
- Drag-and-drop upload zone (accept: jpg, png, pdf)
- Animated upload progress
- Preview thumbnail after upload
- Floor name selector (map this file to which floor)
- Upload another floor option

#### Step 5: Verify Uploaded Floor Plan
- Show the uploaded image in a clean viewer
- "This looks correct" / "Re-upload" buttons
- Subtle zoom/pan capability on the image

#### Step 6: What We'll Do Next (Transition Screen)
Celebratory screen:
- Headline: **"Great! You're all set!"**
- Subtext: "In order to give you advice on your space utilization, it's important for us to get specific details about each floor. We just need you to:"
- Animated checklist appearing one by one:
  - ✦ Identify rooms
  - ✦ Identify zones
  - ✦ Get participant count from each room
  - ✦ Conduct survey
- CTA button: **"Continue to Guide"** (primary, large, animated)

**Wizard UX Requirements**:
- Step indicator at top (dots or numbered steps with labels)
- Back/Next navigation
- Form state persists between steps (Zustand)
- Each step slides in from the right, slides out to the left
- Validate before allowing next step

---

## Component Library to Build

| Component | Description |
|-----------|-------------|
| `<Button>` | Primary, secondary, ghost, danger variants + loading state |
| `<Input>` | With label, error state, icon support |
| `<Select>` | Custom styled dropdown |
| `<Card>` | Glass surface card with hover lift |
| `<Badge>` | Risk level badges (High = red, Medium = amber) |
| `<StepIndicator>` | Multi-step wizard progress |
| `<FileUpload>` | Drag-and-drop with preview |
| `<Modal>` | Animated overlay modal |
| `<Toast>` | Notification toasts (top-right) |
| `<ThemeToggle>` | Light/dark switch with animation |
| `<Logo>` | AreaSim SVG logo component |

---

## Animations & Interactions Checklist
- [ ] Page load: staggered fade-in of elements
- [ ] Hero background: animated gradient mesh (CSS keyframes)
- [ ] Scroll-triggered reveals on landing page sections
- [ ] Wizard step transitions: slide left/right
- [ ] Password strength bar: smooth width transition
- [ ] OTP inputs: auto-focus next on input
- [ ] File upload: drag-over highlight + progress bar
- [ ] "What we'll do" checklist: items appear one by one with delay
- [ ] Button hover: subtle scale + shadow
- [ ] Card hover: lift effect with shadow
- [ ] Number counters on landing page: count up on scroll into view
- [ ] Theme toggle: smooth color transition (CSS transition on :root vars)

---

## File Structure
```
src/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── (auth)/
│   │   ├── signup/page.tsx
│   │   ├── verify-email/page.tsx
│   │   └── create-password/page.tsx
│   └── onboarding/
│       └── page.tsx              # Multi-step wizard
├── components/
│   ├── ui/                       # Design system primitives
│   ├── landing/                  # Landing page sections
│   ├── auth/                     # Auth form components
│   └── onboarding/               # Wizard step components
├── store/
│   └── onboarding.ts             # Zustand store for wizard state
├── lib/
│   └── utils.ts
└── styles/
    └── globals.css
```

---

## Notes for Claude Code
- Use **mock data** everywhere — no real backend needed
- All forms should have working validation (React Hook Form + Zod)
- Both light and dark mode must look polished
- Mobile responsive (min breakpoint: 375px)
- Use `next/font` to load Syne + DM Sans from Google Fonts
- Keep components small and composable
- Add JSDoc comments on key components
