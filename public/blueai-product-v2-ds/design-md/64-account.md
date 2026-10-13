## 64 Account and privacy

**Status:** Changed from V2.
**Why:** The gate's whole point is "use the account you applied with" (R39), and signing out has to sign out (R03). V2's Profile opens on a 96px gradient banner and a 92px emoji avatar (profile.jsx:31-34), shows a real staff member's identity in a prototype (profile.jsx:7, described, not quoted), lists Handle, Country and Mobile the product never uses, and its "Logout" confirm only closes the dialog and returns to chat (index.html:1000). What BlueAI keeps about the partner (the interest profile, watch-history access, consent records) is shown nowhere.

### Account (Changed from V2)
- **Purpose:** Who is signed in, the program they are in, the account BlueAI acts on, what BlueAI keeps and what was agreed, the legal documents, and a Sign out that signs out.
- **Anatomy:** `ScreenHeader` "Account" with Back (pushed over Settings; also More > Account, which replaces "Profile"). Then:
  - **Identity** (no card): `Avatar` 56 initials, name 16/600 ink, email 13 ink-3. No banner, no emoji.
  - **Program** section: external `ListRow` "Partner Starter Program" (the site's name, apply.html:1403) / "7 of 20 days. Ends Nov 1." from `numbers()`, opening the site dashboard (`EARNINGS_URL`).
  - **Connected account** section: `Avatar` app 32 + "YouTube" + handle; pushes Connected apps (63).
  - **Privacy** section, "What BlueAI keeps about you, and what you agreed to.": "Interest profile" / "4 topics from your watch history" (pushes 62); "Watch history" with value Allowed / Not allowed (pushes 63); expandable "What you agreed to": Program Terms, agreed, Oct 6; Privacy Policy, acknowledged, Oct 6; Watch history, allowed, Oct 6; Automatic, Off on every app (or On for YouTube). Dates tabular, ink-3.
  - **Legal** links (`Link` external, 13): "Program Terms" and "Privacy Policy" on `/onblue/terms#program` and `#privacy` (terms_sheet.jsx:32, 67-68).
  - **Sign out**: `Card` padding none holding one `ListRow` with sign-out 16. Opens `Dialog` alert "Sign out?" / "Your worker pauses while you’re signed out, and days without a run don’t count toward your 20 days. Sign in again with alex@example.com to pick up where you left off." Cancel / Sign out (primary). Confirm signs out, pauses the worker and lands on Welcome (67).
- **Variants:** One screen.
- **Sizes:** The 419 window; avatar 56; rows min 48.
- **States:** View; sign out confirm; signed out (Welcome, worker paused). V2: `index.html?start=worker`, More (kebab) > Profile, then Sign out.
- **Props:** `worker` (account, apps, ledger), `state` ('view' | 'signout' | 'signed-out'), `onBack`, `onNavigate(id, opts)`, `onSignOut`, `frame`, `compact`, `landmark`, `preview`.
- **Motion:** The kit's: the expandable row's chevron turn, the dialog. None under reduced motion.
- **Accessibility:** Identity is plain text (the avatar is decorative next to the name). The expandable row has aria-expanded and aria-controls. The alert dialog starts on Cancel. All rows and links have the focus ring; external links say they open in the browser. Hover is CSS, not a mouse handler (profile.jsx:59).
- **Responsive:** One column; the email wraps anywhere; legal links wrap to two lines if needed.
- **Do / Don't:** Do show the account the partner applied with, as the site does. Do list what BlueAI keeps, each with the way to change it. Do say in the confirm that the worker pauses and days stop counting. Do say "Sign out" everywhere. Don't put real people's details in a prototype. Don't decorate identity. Don't build a confirm that does nothing. Don't show fields the product never uses.

**Proposed copy:** the section titles and descriptions, the record lines and the sign-out dialog. Kept: "Sign out" (profile.jsx:62), "Program Terms", "Privacy Policy". "Logout" (profile.jsx:75, 79; index.html:369) becomes "Sign out" (glossary). **Decision D3:** the program row shows days, never dollars, until the money model is chosen. The agreed dates are fixture values; the real record is the acceptance log legal asked for (terms_sheet.jsx:23).
