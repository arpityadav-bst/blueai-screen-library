# blueAI — Scratchpad
Inline correction-resolution log. One line per correction the moment it's
resolved. Promoted to decisions.md / taste.md at audit passes, then wiped.

Format: `YYYY-MM-DD HH:mm — <file> — <what changed> — Why: <one phrase>`

--- Pending audit entries ---
2026-06-13 — SCRAPPED the /live-demo byte-exact clone (designer: redundant now that the DS redesign exists). Removed: the index PAGES entry, the `/live-demo` redirect in next.config, `public/live-demo/` (served files); updated the v2 page comment + renamed the index entry "Live Demo Homepage · DS" → "Live Demo Homepage" (no non-DS twin left to disambiguate). Verified: /live-demo → 404, /live-demo-v2 → 200, no dangling `/live-demo` refs. **KEPT (flagged):** `design-source/blue-ai-demo/` — the pristine PM source the v2 widget was derived from (reference material in the source folder, not shipped); offered removal. **Route still /live-demo-v2** (the "v2" is now naming debt with no v1) — offered to rename to /live-demo for a clean URL, but held (touches the route folder + public/ + the widget src ref; not asked). — Why: the clone was a side-by-side comparison aid; once the DS version is the keeper, the comparison artifact is dead weight (no dead code / redundant pages).
(empty — last promoted 2026-06-13, S6 audit: 13 entries → taste 30–33, 6 decisions, KB S6 section, evolution S6, session-log S6, project-insights routes, shared reasonings ×4)
