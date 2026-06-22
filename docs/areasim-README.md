# AreaSim — Frontend Build Guide
### Master Document for Claude Code

---

## Project Summary
**AreaSim** is a Norwegian SaaS workspace intelligence platform that helps organizations optimize their physical office spaces. This is a **frontend-only build** — all data is mocked, no backend integration required.

---

## Phase Breakdown

| Phase | Focus | Complexity | Estimated Sessions |
|-------|-------|------------|-------------------|
| **Phase 1** | Design system, landing page, auth, onboarding wizard | Medium | 2–3 |
| **Phase 2** | Canvas guide, interactive floor plan editor, room counting | High | 3–4 |
| **Phase 3** | Dashboard, project views, surveys, subscription, polish | Medium | 2–3 |

---

## How to Use With Claude Code

### ✅ Recommended Approach

**Give each phase prompt separately.** Do not combine all three phases into one prompt — Claude Code works best when given focused, scoped tasks.

#### Starting Phase 1:
```
Open areasim-phase-1.md and implement everything described in it.
Start with the Next.js project setup, design system, and globals.css.
Then build the landing page, auth pages, and onboarding wizard in order.
Use mock data throughout. No backend needed.
```

#### Starting Phase 2 (after Phase 1 is done):
```
Phase 1 is complete. Now open areasim-phase-2.md and implement everything in it.
The design system and layout shell from Phase 1 are already in place.
Focus on the canvas guide, Konva.js floor plan editor, and room counting page.
```

#### Starting Phase 3 (after Phase 2 is done):
```
Phases 1 and 2 are complete. Now open areasim-phase-3.md and implement everything in it.
Focus on the dashboard, project detail, surveys, subscription page, and final polish.
Do a consistency audit at the end.
```

---

## Can You Give These Prompts Directly to Claude Code?

**Yes — and here's how:**

Claude Code works best when you:

1. **Place the `.md` files in your project root** (or a `/docs` folder)
2. **Reference them directly** in your Claude Code prompt
3. **Work phase by phase** — complete and review one phase before starting the next

### Example Claude Code Session

```bash
# In your terminal with Claude Code active:

> Read docs/areasim-phase-1.md and implement the full Phase 1 as described.
  Start with project setup (Next.js 14, TypeScript, Tailwind, Framer Motion).
  Then implement each section in the order listed.
  Ask me before making any assumptions about design choices not covered in the doc.
```

### Tips for Best Results with Claude Code

- **Be specific about what to build first**: "Start with globals.css and the design tokens"
- **Review after each major section**: Don't let Claude Code build 10 files before you check
- **Commit after each phase**: This gives you a safe rollback point
- **If Claude Code gets stuck on canvas**: Ask it to use `react-konva` specifically and provide the Konva.js docs URL
- **For the floor plan mock image**: Ask Claude Code to generate a simple SVG floor plan as a placeholder

---

## Tech Stack Summary

```json
{
  "framework": "Next.js 14 (App Router)",
  "language": "TypeScript",
  "styling": "Tailwind CSS",
  "animation": "Framer Motion",
  "canvas": "Konva.js + react-konva",
  "state": "Zustand",
  "forms": "React Hook Form + Zod",
  "icons": "Lucide React",
  "ui_primitives": "Radix UI",
  "fonts": "Syne (display) + DM Sans (body)",
  "package_manager": "pnpm (preferred) or npm"
}
```

---

## Design Principles (Remind Claude Code of these)

1. **Never boring** — This is enterprise software that should feel exciting
2. **Norwegian soul** — Fjord blues, aurora accents, Nordic minimalism
3. **Both modes polished** — Light and dark mode must both look great
4. **Motion is intentional** — Animations add meaning, not noise
5. **Inspired by**: [neowit.io](https://neowit.io) + [empireai.co](https://empireai.co)

---

## File Reference

| File | Contents |
|------|----------|
| `areasim-phase-1.md` | Design system + landing + auth + onboarding wizard |
| `areasim-phase-2.md` | Canvas guide + floor plan editor + room counting |
| `areasim-phase-3.md` | Dashboard + project views + surveys + subscription + polish |
| `areasim-README.md` | This file — master guide |
