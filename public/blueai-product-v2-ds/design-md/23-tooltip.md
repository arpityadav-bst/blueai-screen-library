## 23 Tooltip and info tip

**Status:** Tooltip: Changed from V2.

**Why:** The partner meets two words the product cannot leave unexplained (AI credits, your 20 days) and a top bar of icon-only buttons with no visible names. V2 already built the right disclosure for the first job, the credits (i): hover, focus, click to pin, Esc, a 200ms close delay (credits_popup_parts.jsx:135-146). It only works for one centred title (left -189, line 148), and nothing covers the second job. The system keeps the behaviour, fits it to any window, and adds a label kind (P7: every control has a visible name; P5: one float look).

### Tooltip (Changed from V2)

**Purpose.** `kind="info"` explains a concept right after its name, in two short sentences and at most one link. `kind="label"` shows an icon-only button's name.

**Anatomy.** Info: a 24px round mark (icon `info` 16, `--v2-ink-3`) inside a 32px target, then a float 8px away: `--v2-surface`, 1px `--v2-line`, radius 10 (`--v2-radius-md`), `--v2-shadow-1`, padding 12, text 13/1.5 `--v2-ink-2`, max 260 wide, an 8px arrow pointing at the mark. Label: the same float without the arrow, padding 4 8, radius 6, 12/500, one line. Layer `--v2-z-popover` (30).

**Variants.** `info` (opens on hover, keyboard focus and click; may hold one link) and `label` (hover after 400ms, keyboard focus at once; text only, equal to the button's `aria-label`).

**Sizes.** One. Info max 260px wide; label hugs its word.

**States.** Hidden; hover; keyboard focus; pinned by click (the mark turns `--v2-blue-ink` on `--v2-select`, an outside click unpins); Esc (shut until the pointer leaves or focus moves); flipped (no room on the asked side: it opens on the other and slides to stay 8px inside the window). In V2 today: `?credits=0`, open the credits pill: the red (i) in the AI Credits banner (index.html:504); or `?credits=0` and send a message: the (i) on the out-of-credits card (byok.jsx:59).

**Props.** `kind` ('label' | 'info'), `content` (node), `placement` ('up' | 'down', default up), `label` (names the default info mark; proposed "What are AI credits?"), `open` (force open), `className`, `children` (the trigger; info adds `aria-expanded`, `aria-describedby` and click-to-pin to it).

**Motion.** Fade-up over `--v2-dur-3` on `--v2-ease-out`; out over `--v2-dur-1` after a 200ms grace, with a bridge over the gap so the pointer can reach the link. Open and close are CSS states (`:hover`, `:focus-within`, `.is-open`); JS only pins, dismisses and measures.

**Accessibility.** The info trigger is a real button with a name, `aria-expanded` for the pinned state and `aria-describedby` to the text; Tab reaches the link next. A label tip is `aria-hidden`: the button's own `aria-label` carries the name, the tip shows it. Mark 6.0:1 at rest (V2 #94a3b8 was 2.56:1). Target 32px.

**Responsive.** Fits the window it is in: the nearest `[data-v2-bounds]` or AppFrame. Works the same on the compact 640px window.

**Do / Don't.** Do give every icon-only button a label tip (IconButton does this by default, kit/button.jsx). Do put an info tip right after the term it explains. Do keep V2's approved explainer copy word for word. Don't put the only statement of a consequence in a tip; say it on the control. Don't put a second control in a tip; that is a Popover. Don't hard-code an offset.
