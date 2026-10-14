## 68 Sign-in steps

**Status:** Changed from V2.

**Why:** The steps work, but each carries a defect that costs trust at the first contact: an indigo spinner (`login.jsx:256`) that is a second accent; "Not seeing the browser tab?" in amber at 2.15:1 next to "Try again", two controls with one handler (`login.jsx:242-247`); "Logged in" / "Welcome back!" plus a Continue click on a first sign-in (`login.jsx:270-275`); a gate that, since 2026-10-13, says "Let’s switch accounts" and "We couldn’t find your application on this account. Sign in with the account you applied with." with the account as a row and Switch account, but no longer says that App Player follows the account (`account_gate.jsx:24-52`); a 34px close with no name (`login.jsx:81`); and a white 55% veil (`login.jsx:74`) that is not the site's gate.

### SignIn (Changed from V2)

- **Purpose:** the app's side of the sign-in handoff: one step at a time, one way forward each, on the same frosted gate the site uses.
- **Anatomy:** AppFrame chrome-free, the Welcome content underneath (inert), and the kit Dialog md (382, radius 16, `--v2-shadow-2`) with `scrim="frost"` (`--v2-scrim-frost` 88% + `--v2-scrim-blur` 14px, layer `--v2-z-gate`). Inside, a centred column, gap 12: a 48 mark (icon 24 in `--v2-blue-tint` / `--v2-blue-ink`; success uses `--v2-success-tint`), title 20/600 ink, body 13 ink-3, then the step's parts. Actions are lg full-width buttons.
- **Variants (the steps; V2 copy quoted, the rest proposed):**
  1. browser: mark `external`; "Check your browser"; "Finish signing in from your web browser." (V2 said "logging in"); Banner info "Use the account you applied with" (V2); one secondary action "Open the browser again". Close cancels.
  2. signing: Spinner 32 blue; "Signing in…" (V2); "Checking that this account is in the program." (replaces "Please wait while we complete your sign-in"). Close cancels.
  3. error (after signing, when the check fails or times out): danger alert mark; "Couldn’t finish signing in"; "Check your connection and try again."; actions "Open the browser again" (secondary) and "Try again" (primary). Close cancels (`screens/sign-in.jsx:59-70`).
  4. success: check mark on success tint; "You’re signed in"; the email. No button: Home after 900 ms by itself.
  5. gate (blocking): Avatar 56; "Signed in as", the email 16/600; Badge neutral "Not in the program"; "BlueAI works with the account you applied with."; the consequence "App Player will be signed out too." (V2's former line, dropped 2026-10-13) at 13 ink-3, right above the one primary "Switch account" (V2); under it, in the dialog footer, a muted external Link "Get help" (`SITE_FAQ_URL`, the site's FAQ) for a partner sure this is the account they applied with.
  6. confirm (option B only, no longer applicable: the PM dropped it on 2026-10-13): "Continue to BlueAI" and "Signed in on App Player on this PC" (V2); the account as one pressable Card (Avatar 32, "Continue as Alex" 14/600, email 13 ink-3, chevron); "Not you? Switch account" with an underlined ink Link.
- **Sizes:** Dialog md; the gate's avatar 56, confirm's 32; marks 48.
- **States:** the six steps; plus hover, focus and active on the account card and buttons (kit CSS); busy on Switch account while the session signs out. In V2: `?signin=browser` (handoff), `?signin=browser&player=other` (gate), `?cases=signin` (all cases).
- **Props:** `SignIn {step: 'browser' | 'signing' | 'error' | 'success' | 'gate' | 'confirm', from: 'browser' | 'player', account, onOpenBrowser, onRetry, onCancel, onSwitch, onContinue, onDone, doneAfter = 900, compact, reduced, preview, landmark, under}`.
- **Motion:** the dialog scales in once (320 ms); steps change in place; success's 900 ms is a timer, kept under reduced motion; the spinner turns at half speed under reduced motion.
- **Accessibility:** modal, focus kept inside, focus to the panel on open; the dialog is named by the step title (the gate by "Signed in as" and the email); step changes are announced through a polite live region; Close is a labelled 32 IconButton (browser, signing and error only); body and consequence text 6.0:1.
- **Responsive:** centred in the window, compact 640 included; long emails wrap.
- **Do / Don't:** Do keep one action per step; say the side effect before the button; move on by itself once the account checks out. Don't give two controls the same job; don't greet a first sign-in with "Welcome back!"; don't use warm colours for links or a second accent for spinners.
