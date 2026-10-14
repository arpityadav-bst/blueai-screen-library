## 16 Badge

**Status:** Changed from V2.

**Why:** The money depends on a day's state (pending verification, verified, not counted), so that state needs one unmistakable label on every row and card. V2 has four pill systems for it: the AI Mode status chip (12/600, ai_mode.jsx:38), the Jobs badge (radius 4 with a line, jobs.jsx:31), "Active" (10/700 uppercase, index.html:483) and "Verified" (11.5/700, profile.jsx:50); the gate's "Not enrolled" pill left on 2026-10-13. One Badge replaces all four.

**V3 restyle (2026-10-14).** The status pill has five tones: neutral, busy, ok (success), danger, attention. Busy (a neutral or info badge with `busy`) is work in progress, so it is blue: `--v2-select` fill, `--v2-blue-ink` label, a pulsing `--v2-blue` dot.

### Badge (Changed from V2)

**Purpose.** A short state on a row or card: a day (Pending verification, Verified, Not counted), a run (Running, Waiting for you), an app (Connected, Signed out), a mode or a download (Paused, Download failed). It labels; it never takes a click.

**Anatomy.**
1. Pill, 22 tall, padding 0 8 (`--v2-space-2`), radius `--v2-radius-pill`, no edge, no shadow.
2. Mark (optional): a 6px round dot in the tone colour, or one 16px icon in its place, never both. Days use the program's ticks: `check` for pending, `check-double` for verified.
3. Label: 12/500 (`--v2-text-12`, `--v2-weight-medium`) in `--v2-ink-2`, sentence case, three words at most, ellipsis if it must cut.

Tone lives in the fill and the mark; the words stay in ink-2. This is a style choice, not a contrast fix: every status ink passes 4.5:1 on its own tint (section 03; success ink on the 8% success tint is 4.59:1). One ink for every label keeps a row of badges calm and lets the mark carry the tone; ink-2 on every tint reads at 9:1 or better.

**Variants.** Five tones, each a fill plus a mark colour:
- neutral: `--v2-surface-sunken`, mark `--v2-ink-4` (pending verification, paused, soon). Pending is neutral by the one rule in section 03.
- info: `--v2-blue-tint`, mark `--v2-blue` (running, checking).
- success: `--v2-success-tint`, mark `--v2-success` (verified, connected, on).
- attention: `--v2-attention-tint`, mark `--v2-attention-ink` (the worker needs the partner; signed out; out of credits on a run).
- danger: `--v2-danger-tint`, mark `--v2-danger-ink` (not counted, failed: something went wrong or a day is lost). Signed out is attention: nothing failed and the partner can fix it (section 03's rule).
Plus: no mark, dot, icon, busy dot.

**Sizes.** One: 22 tall. Width hugs the label.

**States.**
- Static: every tone. In V2: Profile (Kebab > Profile, "Verified"), Settings > AI Mode > Hybrid > Auto (status chip), Preview "Own key: On" then the credits pill ("Active").
- Busy: the dot pulses (`.v2-anim-pulse`, `--v2-dur-pulse`) while the thing is working. In V2: the status chip while downloading (ai_mode.jsx:39).
- Reduced motion: the dot holds still (global rule in kit/motion.css).

**Props.** `Badge { tone = 'neutral' | 'info' | 'success' | 'attention' | 'danger', dot, busy, icon, className, children }`. `busy` implies the dot. `icon` replaces the dot. Other props pass to the span.

**Motion.** Only the busy dot: `.v2-anim-pulse`, loops while busy, stops under reduced motion.

**Accessibility.** The label is the state in words; colour and the mark only repeat it. Icons and dots are `aria-hidden`. A badge is never focusable and never the only place a consequence is said.

**Responsive.** Never wraps; long labels truncate with an ellipsis inside the row's trailing slot. Keep labels short enough not to need it.

**Do / Don't.** Do put one badge at a row's trailing edge. Do say the state in words. Do use the ticks for days. Don't uppercase or letter-space. Don't colour the label. Don't use a badge as a button or a filter (that is Chip, section 15). Don't write "Not enrolled": the glossary says "Not in the program".
