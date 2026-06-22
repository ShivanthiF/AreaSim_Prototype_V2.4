---
name: Phase 1 Setup
description: AreaSim Phase 1 frontend implementation — stack, structure, and what was built
type: project
---

Phase 1 fully implemented and building without errors as of 2026-04-18.

**Why:** Foundation phase for AreaSim, a Norwegian workspace intelligence SaaS.

**Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Lucide React, React Hook Form + Zod, Zustand, Radix UI.

**Key files:**
- `src/app/page.tsx` — Landing page (Navbar, Hero, ProblemSection, SolutionSection, HowItWorks, CTABanner, Footer)
- `src/app/(auth)/signup/page.tsx` — Signup with email/company/name + Google button
- `src/app/(auth)/verify-email/page.tsx` — 6-digit OTP with auto-advance + countdown resend
- `src/app/(auth)/create-password/page.tsx` — Password with live strength bar + requirements checklist
- `src/app/(auth)/layout.tsx` — Split-panel auth layout (brand panel + form panel)
- `src/app/onboarding/page.tsx` — 6-step wizard shell with AnimatePresence slide transitions
- `src/components/onboarding/` — Step1–6 components
- `src/store/onboarding.ts` — Zustand store with persist middleware
- `src/styles/globals.css` — Full CSS variable system (light + dark tokens, glass utilities, skeleton)
- `src/components/ui/` — Button, Input, Select, Card, Badge, StepIndicator, FileUpload, Modal, Toast, ThemeToggle, Logo

**How to apply:** Next phase (Phase 2) should build on this — add sidebar nav, dashboard, and project detail views.
