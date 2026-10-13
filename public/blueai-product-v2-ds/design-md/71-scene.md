## 71 Scene (not product)

**Status:** Desktop scene: In V2. Taskbar attention and OS toast: In V2. BlueStacks install dialog: In V2.

**Why:** The fake Windows desktop makes V2 read as installed software, which is right for review. Its colours, sizes and fonts are OS or BlueStacks chrome, so they are fenced out of the product tokens (product-scene.css is never a source). What the product carries from it is behaviour and words: when the taskbar asks for attention, what a notification says, and what clicking it opens.

### Desktop scene (In V2)

**Purpose.** A Windows desktop that fits the visible windows into the browser at true proportions.

**Anatomy.** Wallpaper with a painted taskbar; a row of windows, left to right: browser, BlueStacks App Player, BlueAI; the BlueAI taskbar button outside the scaled row.

**Variants.** BlueAI alone (bare URL); BlueStacks + BlueAI (`?bs=1`); browser beside BlueAI (`?signin=browser`).

**Sizes.** BlueAI 421 x 866 (desktop_scene.jsx:18), BlueStacks 1000 x 573 (:17), browser 820 x 700 (:19); gap 16, padding 48, scale between 0.3 and 1 (:20).

**States.** Windows mount and unmount as the URL or Preview panel changes; the surviving window does not jump.

**Props.** `window.DesktopScene` (V2). Not a kit part.

**Motion.** Scene only (window-in, row slide). Not product motion.

**Accessibility.** Not product UI.

**Responsive.** The scale fits any browser size; it hides that 866 does not fit a 1366 x 768 laptop. The product answer is the compact frame (section 29).

**Do / Don't.** Do use it as the stage for review. Don't take a value from it into a token.

### Taskbar attention and OS toast (In V2)

**Purpose.** The two channels that reach a partner who is not looking at BlueAI.

**Anatomy.** Taskbar button: BlueAI logo with an indicator under it. Toast: Windows 11 notification (logo, "BlueAI", "now", dismiss), a bold title and a body.

**Variants.** Taskbar: running (short grey dash), open (longer pill), attention (7 amber flashes, then held; product-scene.css:141) while a job ask waits (index.html:1054). Toast copy, PM-owned and quoted exactly (worker_day_done.jsx:196-203):
- Run done: "Today’s run is done." / "Day {n} of {target}. Pending verification."
- Day 20: "All 20 days done, pending verification."
- Didn't finish: "Today’s job didn’t finish." / "Open BlueAI to retry and count the day."

**Sizes.** Toast 364 wide, bottom right above the taskbar, Segoe UI (product-scene.css:188-192); auto-dismiss 8 s (desktop_toast.jsx:12).

**States.** Toast: enter, shown, leaving, clicked (opens BlueAI), dismissed. V2: `?end=job | nojob | day20 | failed` plays the next day's run and raises the toast.

**Props.** `window.DesktopToast { title, body, onOpen, onClose, ms }` (V2). Not a kit part.

**Motion.** Scene only.

**Accessibility.** The real notification is Windows'; its text must stand alone without the app.

**Responsive.** Not applicable.

**Do / Don't.** Do open the persistent Today record from the toast, where Try again and its deadline live (R15); V2 opens a cold start with no Retry (index.html:1065). Do raise a notification with the deadline when a job waits on Always ask (R08, section 54); V2 has only the taskbar flash. Don't rely on either channel while the window is gone: the tray keeps the app alive (section 29).

### BlueStacks install dialog (In V2)

**Purpose.** BlueStacks' own prompt to install BlueAI (Flow A), in BlueStacks' visual voice by designer rule.

**Anatomy.** Dark BlueStacks card: icon, title, subtitle, body, meta, close, primary; then downloading and done steps.

**Variants.** One skin.

**Sizes.** Card 420 wide, square corners, dark BlueStacks surface, Poppins (install_dialog.jsx:46, 168). Downloading 2.8 s, done 0.9 s (index.html:603-604).

**States.** Idle, downloading, done. V2: `?bs=1&bai=0&dlg=blueai`.

**Props.** `InstallDialog` (V2). Not a kit part.

**Motion.** Scene only.

**Accessibility.** BlueStacks' dialog; not product UI.

**Responsive.** Not applicable.

**Do / Don't.** Do keep the skin. Don't keep the pitch: "finds deals, claims rewards, creates content, and more." (index.html:598) sells a general assistant, not the paid worker the partner was accepted for (R43; or drop Flow A, decision D9).
