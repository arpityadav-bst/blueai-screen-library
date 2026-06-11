# blueAI — Parked fixes / polish (revisit later)

Items the designer flagged to fix in a later pass — not blocking the build.

## Recommended (Stage) hero — polish items
_Designer enumerated 2026-06-10; all FIXED same session:_
- [x] Agent transitions — the directional slide overlapped + came from inconsistent sides → made **instant** (keyed pane swap, removed AnimatePresence/slide).
- [x] Thumbnail selection — was click → now on **hover** (`onMouseEnter`).
- [x] Scene animations too fast → slowed the rich scenes' STEPS pacing + typewriter speed + bumped per-agent dwell.
- [ ] (further items — drop here as they come; also: legacy variants (3-Cards / Stage Original) can get the same pacing slowdown when reviewed)

## Known by me / to verify
- Hero variant animations DIFFER by layout (confirmed with designer):
  - **Stage** + **Stage Original** → RICH multi-scene agent animations (built).
  - **3 Cards** → LEGACY single-scene animations (job-card→fill→submit · trend→storyboard→views · ticker→chart→marker→portfolio value). Build as SEPARATE scene components — do NOT reuse the rich ones.
- Read each variant's HTML before building; confirm Stage Original reuses the rich scenes vs needs its own markup.
- Recommended-hero motion timing/sequencing is a first-pass approximation of the GSAP timelines — open to retuning once the designer reviews live motion.
