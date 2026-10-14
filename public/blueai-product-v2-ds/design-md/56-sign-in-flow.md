## 56 Sign-in flow

**Status:** Changed from V2.

**Why:** The handoff logic is the PM's (ROB-21388, `signin_page.jsx:5-17`, `index.html:210-218`) and it is sound: the download link only reaches accepted partners, so the only failure is the app running on another account. Two stops cost a click and say nothing new: the success step asks for Continue and greets a first sign-in with "Welcome back!" (`login.jsx:270-275`), and the browser step offers two controls with one job (`login.jsx:242-247`). Two site lines need the PM and legal (below).

### Sign-in cases (Changed from V2)

- **Purpose:** sign the partner in with the account they applied with, stopping them only when the account is wrong.
- **Anatomy (one case since 2026-10-13, the PM's):** BlueAI checks enrolment after every sign-in and stops only on an account that isn't enrolled.
  - From App Player: silent sign-in, then the in-app gate "Let’s switch accounts". The browser opens only from Switch account.
  - From the browser: the site shows the account it holds first ("Continue as" / "Not you? Continue with a different ID") and checks nothing; continuing with a wrong account lands on the same gate.
  - Signed out everywhere: the site's sign-in with Google's chooser, then in the app Signing in, You're signed in (900 ms, no click), Home or the gate.
  Whatever account BlueAI ends up with, App Player ends up on it too.
- **Variants (decision D5, settled):** the PM picked option A on 2026-10-13: interrupt only when the account is wrong. Option B (Continue as) and the five-case split are gone from V2; the kit's confirm step is no longer applicable.
- **Sizes:** the in-app steps are section 68 (Dialog md on the frost gate).
- **States:** Welcome, browser, signing, success, gate, Home (confirm, option B, no longer applicable).
- **Props:** `V2Screens.SignIn {step, from, account, onOpenBrowser, onCancel, onSwitch, onContinue, onDone}`.
- **Motion:** success moves on after 900 ms (a timer, kept under reduced motion); every step change is in place, no slide.
- **Accessibility:** each step is announced (a polite live region inside the dialog); the gate and confirm steps block (no close, no Esc) and have one way out.
- **Responsive:** the gate dialog centres in the window, compact 640 included.
- **Family:** the frost veil is the site's sign-in gate veil (`onblue/onblue.css:411-412`), the only frosted surface in the product; Sign in and Sign out on both sides.
- **For the PM and legal (site copy):** the site's gate tells accepted partners "Sign in to start your application." (`site_signin.jsx:27`); the app variant should read "Sign in to continue to BlueAI." Its legal line agrees to the Privacy Policy (`site_signin.jsx:42`), wording legal rejected for the app's terms sheet; align it with "agree to the Program Terms and acknowledge the Privacy Policy and Cookie Policy".
- **Do / Don't:** Do stop the partner only when the account is wrong; say that App Player follows the account before Switch account; use Sign in and Sign out on both sides. Don't confirm a sign-in the browser already confirmed; don't offer Apply or other exits on the gate; don't use a different veil for signing in on the site and in the app.
