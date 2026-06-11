# blueAI — Claude Code project instructions

This file auto-loads when Claude Code's working directory is `blueai/`. The canonical
bootstrap rule lives in the parent `N:\Antigravity Main\CLAUDE.md`. This is the in-repo
mirror. **blueAI is a design-only handoff replica** of the BlueAI marketing/product site
(BlueAI = BlueStacks' in-app AI assistant; "BlueAI by now.gg") — same philosophy as
WSUP/now.gg: visual fidelity + handoff clarity, no real backend.

---

## VDA Bootstrap (mandatory on first blueAI touch)

VDA is one junior designer across products. Its CRAFT (gates, forcing functions) lives in
the shared `../agents/vda-core/`; blueAI's TASTE/decisions live here in `visual-designer/`.
**None of the gates fire if the files aren't read at session start.** Non-negotiable. **Do
NOT load WSUP's or now.gg's notebook for blueAI work — that's cross-contamination.**

**Trigger** — fire the FIRST time any of these are true in a session:
- Human message references *blueAI, blueai, "BlueAI by now.gg"*, the hero (Stage /
  Stage Original / 3 Cards), the homepage, or any blueAI component (`HeroStage`,
  `HeroCards`, `HeroStageOriginal`, `HeroNav`, `BaiHome`, `FeatureRows`, `AllSkills`,
  the agent scenes, etc.)
- Human drags/pastes a file path under `blueai/`
- About to read/write a file under `blueai/`
- Human says "build", "design", "fix the layout", "update VDA"

**Mandatory reads on first blueAI touch, in this order** (craft = shared `../agents/vda-core/`; notebook = blueAI's `visual-designer/`):
1. `../agents/vda-core/agent.md` — re-anchor identity (think like a UX designer)
2. `../agents/vda-core/QUALITY-GATES.md` — 8 gates + dual-cadence + Gate 6.5 + routing table
3. `visual-designer/taste.md` — blueAI's aesthetic; Gate 8 reviews against THIS
4. `visual-designer/decisions.md` — recent decisions so new work doesn't contradict them
5. `visual-designer/session-logs.md` — most recent entry only (top)
6. `visual-designer/scratchpad.md` — pending entries (flag if non-empty past the header)

**After reading, announce:** *"VDA bootstrap loaded — blueAI, Phase X, last session
caught_count: N, watching for [recurring category]. Scratchpad: [empty | N pending]."*

**Why:** skipping these is itself a Gate 6 fail — every blueAI edit made without them
operates on stale memory of blueAI's design system. The reading IS the reset.

---

## blueAI specifics
- **Design-only:** no real backend; the agent demos are scripted/animated, not live.
- **Source:** a Claude-design HTML/CSS export in `design-source/homepage-rework/` (ported
  to Next + Tailwind). Full DS extras in "BlueAI Modern.zip" (Downloads) if extending.
- **Routes:** `/` (Screen Library index — links to every page) · `/seo` (SEO homepage) ·
  `/hero/stage` (★ Stage, Recommended) · `/hero/stage-original` · `/hero/3-cards` ·
  `/hero-options` (chooser) · `/style-guide`.
- **Two animation paths:** Stage = RICH multi-scene; Stage Original + 3 Cards = LEGACY
  single-scene (shared scenes). Motion is framer-motion, phase-driven. See
  `visual-designer/project-insights.md`.
- **CSS:** per-variant hero stylesheets are scoped-by-route; cross-route links use
  full-page `<a>`. DS tokens in `globals.css` (`--bai-*`) + `tailwind.config.ts`.
- **Parked fixes:** `design-source/FIX-LATER.md` (designer's Recommended-hero polish items).

## File size rule (inherited)
**Max 300 lines per `.tsx`/`.ts`.** `.md`, `package-lock.json`, `.css` config-style files
(globals.css, the scoped hero/homepage stylesheets) are pragmatic exceptions.
