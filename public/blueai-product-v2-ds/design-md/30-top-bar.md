## 30 Top bar

**Status:** TopBar: Changed from V2. WorkerStatusChip: New. BrandMark: Changed from V2. Help and more menus: Changed from V2.

**Why:** The partner opens BlueAI to check one thing: did today's run happen, and does the day count. V2's header gives its loudest slot, the only filled control in the chrome, to a "New Chat" pill (index.html:342) and shows the run nowhere; it runs the brand gradient three times in 419px (index.html:326, 333, 337); and two of its six menu rows do nothing (index.html:355-356).

### TopBar (Changed from V2)

**Purpose.** Brand, today's run, credits, help and the account doors, on every signed-in screen.

**Anatomy.** Left: BrandMark (logo 24 + wordmark). Right, in reading order: WorkerStatusChip, credits chip (section 47), Help (IconButton 32, `help`), More (IconButton 32, `more`). New chat is not here: it is a trailing IconButton in the chat screen's header (section 32).

**Variants.** Signed out (brand only). Signed in.

**Sizes.** 52 tall (`--v2-topbar-h`). Padding 0 12 0 16: the brand sits on the 16 gutter; the right edge is 12 because the icon buttons carry a 6px inset. Gap 8 between chips, 2 between the two icon buttons. Surface, 1px `--v2-line` bottom, no shadow. Layer `--v2-z-header` (20). Fits 419 with the longest status label ("Next run 11 am").

**States.** Signed out: V2 bare URL then Sign in. Signed in: V2 `?start=worker`. Menu open: click Help or More (V2 has no keyboard path).

**Props.** `TopBar { signedIn, status, statusLabel, credits (number or { balance, state }), onOpenStatus, onOpenCredits, helpItems, moreItems, onAction(id), openMenu }`. Default items come from `topBarMenus(onAction)`; `openMenu` ('help' | 'more') is for guide specimens.

**Motion.** None on the bar; chips and buttons change colour over `--v2-dur-1`.

**Accessibility.** The bar is a `<header>`. Each icon button has a label ("Help", "More"); its button stays lit while its menu is open (`aria-expanded`). Tab order follows reading order.

**Responsive.** One width. If a status label ever overflows, shorten the label, never the bar's parts.

**Do / Don't.** Do keep one status chip and one credits chip. Don't add a filled button to the bar. Don't add a second gradient. Don't show the right cluster when signed out.

### WorkerStatusChip (New)

**Purpose.** Today's run in one glance, on every screen; clicking it opens where the partner can act.

**Anatomy.** Pill button: an 8px dot in the status tone, a 13/500 label, and visually hidden "Today's run: " before the label.

**Variants.** (Labels are proposed copy except "Didn't finish", which echoes the PM's toast, worker_day_done.jsx:203.)

| Status | Label | Worker record | Opens |
|---|---|---|---|
| scheduled | Next run 11 am | today.status scheduled | Home, Today |
| running | Running | today.status running | the run in the chat |
| needs-you | Needs you (yellow tint) | today.status waiting | the job preview |
| done | Day 7 of 20 | today.status done | the run in Activity |
| failed | Didn't finish (red tint) | today.status failed | the run, with Try again and its deadline |
| paused | Paused (ring dot) | paused | Settings > Worker |
| offline | Offline (ring dot) | offline | Home, with the offline banner |
| signed out | not rendered | | |

**Sizes.** 28 visible (`--v2-control-sm`), 32 hit area (`--v2-hit-min`, via `::after`). Padding 0 12 0 8. Pill, 1px `--v2-line`, surface.

**States.** Rest, hover (line firms to `--v2-line-hover`, `--v2-wash-hover` layered on the fill), pressed (`--v2-wash-press`), focus-visible (2px blue outline, offset 2). New: no V2 equivalent; V2 shows run state only in the thread, a taskbar flash and an 8 second toast.

**Props.** `WorkerStatusChip { status, label, onClick, className }`.

**Motion.** Colour over `--v2-dur-1`. The running dot does not pulse: nothing loops unattended.

**Accessibility.** A real `<button>`; accessible name "Today's run: Needs you". Colour is never the only carrier: every status has words. Tinted labels: attention ink on tint and danger ink on tint, both above 4.5:1.

**Responsive.** One line, no wrap.

**Do / Don't.** Do use the same words as the tray and the WorkerCard. Don't make the label a verb: the chip names the state; the run holds the action.

### BrandMark (Changed from V2)

**Purpose.** The BlueAI mark and wordmark: the one place the brand gradient is a fill.

**Anatomy.** Logo image (`assets/Logo.png`) and the "BlueAI" wordmark in `--v2-gradient-brand`.

**Variants.** Mark + wordmark; mark only (alt "BlueAI"); stacked (splash).

**Sizes.** 24 logo + 16/600 wordmark, gap 6 (top bar). 48 logo + 24/600 wordmark, gap 12, stacked (splash). V2: logo 32 + 22/700 (index.html:325-326).

**States.** None.

**Props.** `BrandMark { size: 24 | 48, wordmark = true }`.

**Motion.** None.

**Accessibility.** Logos are exempt from text contrast; in forced-colours mode the wordmark falls back to system text so the name never disappears. With the wordmark shown, the image is decorative (alt "").

**Responsive.** Not applicable.

**Do / Don't.** Do keep the gradient here and on the credits glyph only. Don't use the gradient as a ring, border or text fill elsewhere. Decision D8 may switch the product to the onBlue site's blue spark; only BrandMark changes.

### Help and more menus (Changed from V2)

**Purpose.** Help when something looks wrong; the account and money doors.

**Anatomy.** Two Menus (section 27) off the top bar's icon buttons.

**Variants.**

| Menu | Item | Icon | Does | V2 today |
|---|---|---|---|---|
| Help | FAQ | help | Opens the onBlue site's FAQ (index.html#faqs) in the browser | only closes the menu (index.html:355) |
| Help | Report a problem | alert, ink | Opens the Report a problem sheet, filled in from the last run (section 65) | "Report Issue" only closes the menu; red glyph (index.html:356) |
| More | Notifications | bell | Pushes Notifications (section 60) | not in V2; "Chat History" sat here (index.html:366) |
| More | Account | user | Pushes Account (section 64) | "Profile" (index.html:367) |
| More | Earnings | earnings + external | Opens the Earnings dashboard: the one `EARNINGS_URL` (kit/worker-data.jsx) | same label, one of two URLs (index.html:320) |
| (separator) | | | | |
| More | Sign out | sign-out | Asks, then signs out and pauses the worker | "Logout"; confirm does nothing (index.html:369, 1000) |

Activity is a tab, so the menu does not repeat it; Notifications has no other door.

**Sizes.** Menu spec, section 27.

**States.** Closed, open, item hover, item focus-visible. V2: open only by mouse; close on an outside mousedown (index.html:285).

**Props.** `helpItems`, `moreItems` on TopBar (Menu items: `{ icon, label, onSelect, href, external }` or `{ separator }`).

**Motion.** Menu motion, section 27.

**Accessibility.** `role="menu"`, `aria-haspopup`, `aria-expanded`; Down or Enter opens on the first item, arrows move, Esc closes and returns focus to the button. External items say "opens in a new tab".

**Responsive.** Menus fit themselves inside the window (they flip and slide at its edges).

**Do / Don't.** Do give every row a real destination. Don't paint a help row red. Don't keep a second Earnings URL anywhere.
