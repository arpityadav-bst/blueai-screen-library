## 26 Sheet

**Status:** Sheet: Changed from V2.

**Why:** The Program Terms are the partner's first agreement, so they block until accepted; longer panels (Report a problem, a run's detail on a short window) need a place over the current screen that is roomier than a dialog. V2's Terms sheet is its one overlay with a proper entrance, exit and reduced-motion rule (terms_sheet.jsx:103-108), so it becomes the family sheet. Its shell joins the system (radius, title weight, an AA primary, one scrim, one layer instead of a z 120 tie with Logout); its legal wording stays exactly as legal approved it.

### Sheet (Changed from V2)

**Purpose.** `blocking`: an agreement the partner must give to continue. Dismissible (default): a longer panel that belongs to the current screen.

**Anatomy.** Scrim `--v2-scrim`. Panel on the window's bottom edge, full width: `--v2-surface`, 1px top `--v2-line`, radius 16 16 0 0, `--v2-shadow-2`, padding 24. Header: title 20/600 `--v2-ink` taking the row; a 32px Close when dismissible. Body 14/1.5 `--v2-ink-2`, scrolls when tall (the sheet stops 40px short of the window top). Actions 44px: one spans the width, two share it (secondary, primary). Layer `--v2-z-dialog`.

**Variants.** `blocking` (no Close, no Esc, no scrim dismiss: the button is the only way on) and dismissible (Close, Esc, the scrim and Cancel all close it).

**Sizes.** One: the window's width; height to content.

**States.** Blocking; dismissible; entering; leaving; busy (the primary loads while the agreement is recorded); reduced motion (arrives and leaves at once). In V2 today: a bare `index.html` opens on the first-run Terms sheet; the Preview panel row Terms switches First run, Terms update, Off (index.html:1163); `?start=worker` hides it (index.html:670). Since 2026-10-14 V2 has a second, dismissible sheet: the mode sheet ('Apps BlueAI can run on its own', agent_permissions.jsx:124-157), opened by the composer chip (`?start=worker&v=1`) or the ribbon's Change; the scrim, Esc and a close button close it, focus moves to the close button and back, radius 20, a lighter scrim (rgba(15,23,42,0.24)), it slides up 0.36s with no exit, and the app list scrolls inside.

**Props.** `open`, `onClose`, `title`, `description`, `blocking`, `busy`, `actions` (as Dialog), `footer`, `initialFocus`, `className`, `children`; `preview` for guide specimens.

**Motion.** Slide up `--v2-dur-4` (320ms) on `--v2-ease-out`; slide down `--v2-dur-3` (240ms) on `--v2-ease-in`; scrim fades `--v2-dur-3`. V2's 0.45s and 0.32s on the house curve become these. Reduced motion: instant (motion.css).

**Accessibility.** role dialog, `aria-modal`, named by its title; focus moves in, stays in, and returns to the opener. Legal links open in a new tab and keep the partner's place. The primary is the action blue (4.92:1), not V2's #1990FF pill (3.24:1).

**Responsive.** Always the window's full width; on the compact window the body scrolls and the actions stay.

**Do / Don't.** Do keep the Terms copy exactly: "Before you start" / "By continuing, you agree to the Program Terms and acknowledge the Privacy Policy and Cookie Policy." / "Agree and continue" (terms_sheet.jsx:62-71). Do use the dismissible sheet for Report a problem, prefilled from the run (proposed copy, R34). Don't block for anything the partner could decline and come back to. Don't show two sheets at once.
