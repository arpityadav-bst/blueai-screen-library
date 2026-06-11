# blueAI — design handoff replica

A design-only, developer-handoff build of the **blueAI** marketing/product site. BlueAI is
the AI assistant built into BlueStacks App Player ("BlueAI by now.gg"); this is the site
that sells it. Built from a Claude-design (claude.ai/design) HTML/CSS export, recreated in
Next.js + Tailwind on the **blueai-modern** design system. Sibling to `wsup/` + `nowgg/`.

## Run
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (all routes static)
```

## Routes
| Route | What |
|---|---|
| `/` | **★ Recommended** hero ("Stage") + homepage — 2-col: message left, live agent stage right |
| `/hero/stage-original` | Hero direction #2 — centered headline; big stage + side rail |
| `/hero/3-cards` | Hero direction #1 — centered headline; 3 agent cards side by side |
| `/hero-options` | Design-review chooser — the 3 directions with schematic previews + UX pros/cons |
| `/style-guide` | The blueai-modern design system reference |

## Design system (blueai-modern)
- **Brand:** Iris `#7B4CFF` → Cyan `#0EA4C5` gradient — only ever used together. 10% wash
  for ✦ suggested-action pills. Everything else is a cool near-black neutral ramp on white.
- **Type:** Inter (UI/body, SF Pro substitute) · Space Grotesk (marketing display) ·
  Bricolage Grotesque (wordmark). Tight scale. **Light theme only.**
- **Geometry:** 8/12/128px radii + circle; hairline borders (0.5/1px); minimal shadows.
- Tokens: `src/app/globals.css` (`--bai-*` source of truth) + `src/tailwind.config.ts`
  (utilities). Live reference: `/style-guide`.

## Heroes — two animation paths
- **Stage** (Recommended) uses RICH multi-scene agent demos (`hero/scenes/*Scene.tsx`).
- **Stage Original + 3 Cards** share the LEGACY single-scene demos (`hero/scenes/*Legacy.tsx`).
- Motion is **framer-motion, phase-driven** (rebuilt from the export's GSAP timelines for a
  lighter handoff codebase). Agents: Career, Creator, Finance.

## Structure
```
src/
  app/            routes (/, hero/*, hero-options, style-guide) + layout + globals.css
  components/
    home/         BaiHome, FeatureRows, AllSkills, DownloadCta
    hero/         HeroStage · HeroCards · HeroStageOriginal · HeroNav · scenes/ · hooks
    style-guide/  ComponentsSection
  lib/            home-data, cn
  styles/         homepage.css · hero-stage.css · hero-cards.css · hero-stage-original.css · hero-options.css
design-source/    the original Claude-design export + FIX-LATER.md
visual-designer/  the VDA notebook (taste, decisions, …)
```
See `HANDOFF.md` for the screen-by-screen + integration notes.
