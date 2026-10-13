## 05 Space and layout

**Status:** Space scale, Window budget: both Changed from V2.

**Why:** A small window that the partner opens every day has no room for near-misses. 59% of V2's 927 spacing values sit off a 4px grid, card padding alone has eight recipes, the chat column is 420px inside a 419px box (index.html:966), modals size in vh against the browser instead of the window (shared.jsx:73), and the 866px window does not fit a 1366 x 768 laptop. One scale, one gutter and a compact rule keep every screen aligned and on screen.

### Space scale (Changed from V2)

**Purpose.** A 4px scale with one 2px step, one gutter, one card padding.

**Anatomy.** `--v2-space-0` 0, `-05` 2, `-1` 4, `-15` 6, `-2` 8, `-3` 12, `-4` 16, `-5` 20, `-6` 24, `-8` 32, `-10` 40. `--v2-gutter` is `--v2-space-4`. Layout utilities in kit/base.css: `.v2-stack` (column, gap 12), `.v2-hstack` (row, centred, gap 8; modifiers `--top`, `--baseline`, `--between`, `--end`; `.v2-wrap`), `.v2-gap-0` to `.v2-gap-6`, `.v2-grow`, `.v2-screen` and `.v2-screen-body`, `.v2-divider`, `.v2-sr-only`, `.v2-root`. (The horizontal stack is `.v2-hstack` because `.v2-row` is ListRow's class, section 18.)

**Variants.** Uses: 2 day-bar segment gaps; 4 icon to text in chips; 8 row gaps and button icon gap; 12 card stack gap and bubble vertical padding; 16 card padding, bubble horizontal padding and screen gutter; 20 dialog padding; 24 section gap and sheet padding; 32 and 40 empty states.

**Sizes.** As above.

**States.** Not applicable. V2 today: the user bubble pads '11px 14px 8px' (chat_bubbles.jsx:30), the progress strip '12px 15px 11px' (worker_day_done.jsx:176), two settings cards 16 and 18 (settings.jsx:10, 97); reach with `?day=returning`.

**Props.** Tokens and utilities only.

**Motion.** None.

**Accessibility.** Spacing never replaces a divider or a label when the grouping carries meaning.

**Responsive.** Spacing does not shrink on the compact window; content scrolls instead.

**Do / Don't.** Do put the same token on both sides of what it separates. Do pad every card 16. Don't use 5, 7, 9, 11 or 13. Don't nest padding to fake alignment: align to the gutter.

### Window budget (Changed from V2)

**Purpose.** The fixed geometry every screen is designed against, and what happens on a short screen.

**Anatomy.** Content box `--v2-shell-w` 419 x `--v2-shell-h` 830 in three bands: top bar `--v2-topbar-h` 52 (pinned), content band 722 (the only scroller, `.v2-screen-body`), bottom nav `--v2-nav-h` 56 (pinned). An overlay plane covers the whole box. The Windows caption above, `--v2-titlebar-h` 34, belongs to the desktop scene.

**Variants.** Full 830; compact `--v2-shell-min-h` 640 (content band 532, scrolls).

**Sizes.** Bubble and thread cards max `--v2-bubble-max` 300; dialogs `--v2-dialog-sm` 320 and `--v2-dialog-md` 382; controls 28 / 36 / 44; fields 40.

**States.** Full: V2 `?start=worker` (421 x 866 window, product-scene.css:76). Compact: new (resize the window to 640).

**Props.** AppFrame `compact` (section 29). Two screen recipes, one spacing: the first block always sits 16 under the ScreenHeader, the column keeps the 16 gutter, blocks sit 12 apart and the bottom pad is 24.
- `.v2-screen` + `.v2-screen-body` (`kit/base.css:185-193`, padding 16 16 24): the header stays pinned and the body is the only scroller. For screens the partner reads in place: Home, Activity, Run detail, Notifications, Chat.
- `.v2-acct` + `.v2-acct-body` (`screens/account.css:7-11`): no scroller of its own, so the content band itself scrolls (the ScreenHeader is sticky in the band, so it still stays). For the settings group, whose columns are long lists of sections: Settings, Worker settings, Connected apps, Account, AI credits. The band being the scroller is the reason: ScreenFrame's `scrollTo` moves the band to a `[data-section]` (Settings' `highlight`).
A new screen picks the first unless it is a settings-style list of sections that a door opens at one of its sections. The two differ only in which box scrolls, never in spacing.

**Motion.** None.

**Accessibility.** On the compact window the composer and nav stay reachable; the content band scrolls by keyboard.

**Responsive.** Two heights, one width. Overlays size in % of the window or by the dialog tokens, never in vh.

**Do / Don't.** Do design every screen at 640 as well as 830. Don't give a band its own width. Don't use vh inside the window.
