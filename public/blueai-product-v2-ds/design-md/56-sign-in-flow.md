## 56 Sign-in flow

**Status:** Changed from V2.

**Why:** The handoff logic is the PM's (ROB-21388, `signin_page.jsx:5-17`, `index.html:203-216`) and it is sound: the download link only reaches accepted partners, so the only failure is the app running on another account. Two stops cost a click and say nothing new: the success step asks for Continue and greets a first sign-in with "Welcome back!" (`login.jsx:270-275`), and the browser step offers two controls with one job (`login.jsx:242-247`). Two site lines need the PM and legal (below).

### Sign-in cases (Changed from V2)

- **Purpose:** sign the partner in with the account they applied with, stopping them only when the account is wrong.
- **Anatomy (the five cases):**
  1. App Player signed in with the accepted account: silent sign-in, Home. No screen.
  2. App Player signed in with another account: silent sign-in, then the gate. The browser never opens.
  3a. App Player signed out, the browser holds the accepted account: the site's continue page, then in the app Signing in, You're signed in (900 ms, no click), Home.
  3b. App Player signed out, the browser holds another account: the continue page says "Not in the program" with "Not you? Continue with a different account" (V2 says "ID"); continuing anyway lands on the gate.
  3c. App Player signed out, the browser signed out: the site's sign-in with Google's chooser, then Signing in, then Home or the gate.
  Whatever account BlueAI ends up with, App Player ends up on it too.
- **Variants (decision D5):** option A, Check account (recommended): interrupt only when the account is wrong. Option B, Continue as: whenever an account is already signed in, ask "Continue as Alex" first. Ship one and delete the other path.
- **Sizes:** the in-app steps are section 68 (Dialog md on the frost gate).
- **States:** Welcome, browser, signing, success, gate, confirm (option B), Home.
- **Props:** `V2Screens.SignIn {step, from, account, onOpenBrowser, onCancel, onSwitch, onContinue, onDone}`.
- **Motion:** success moves on after 900 ms (a timer, kept under reduced motion); every step change is in place, no slide.
- **Accessibility:** each step is announced (a polite live region inside the dialog); the gate and confirm steps block (no close, no Esc) and have one way out.
- **Responsive:** the gate dialog centres in the window, compact 640 included.
- **Family:** the frost veil is the site's sign-in gate veil (`onblue/onblue.css:411-412`), the only frosted surface in the product; Sign in and Sign out on both sides.
- **For the PM and legal (site copy):** the site's gate tells accepted partners "Sign in to start your application." (`site_signin.jsx:27`); the app variant should read "Sign in to continue to BlueAI." Its legal line agrees to the Privacy Policy (`site_signin.jsx:42`), wording legal rejected for the app's terms sheet; align it with "agree to the Program Terms and acknowledge the Privacy Policy and Cookie Policy".
- **Do / Don't:** Do stop the partner only when the account is wrong; say that App Player follows the account before Switch account; use Sign in and Sign out on both sides. Don't confirm a sign-in the browser already confirmed; don't offer Apply or other exits on the gate; don't use a different veil for signing in on the site and in the app.
