## 53 Consent

**Status:** Changed from V2.

**Why:** V2's consent moments are right: the agreement is the button (`agent_permissions.jsx:152`), Automatic is asked every time it is turned on (`agent_permissions.jsx:25`), contracts are agreed and notices acknowledged (`terms_sheet.jsx:49-53`), and every agreement is meant to be recorded server-side with the exact copy shown (`terms_sheet.jsx:23-27`). What V2 lacks is a place to see and withdraw them: the Settings card for the mode was dropped (`agent_permissions.jsx:16`), watch history is read without asking (`worker_flow.jsx:80`), and the consent buttons have no loading state although each one is a server write.

### Consent rules (Changed from V2)

- **Purpose:** every agreement is asked at the moment it matters, recorded with what was shown, and can be seen and withdrawn later.
- **Anatomy (moment: how agreed; recorded; seen and withdrawn):**
  1. Program Terms: blocking Sheet on first run (`V2Screens.TermsSheet`); the button is the agreement ("Agree and continue"); re-asked in full on every terms change. Records account ID, time, terms version, IP and the exact copy, server-side. Seen under Account and privacy > Agreements; withdrawing means leaving the program, from the same place.
  2. Automatic, per app: the kit ConsentDialog ("Run YouTube jobs automatically?" / "I agree, turn on"), asked every time it is turned on. Records app, time and copy version, server-side (V2 keeps only a time in localStorage, `agent_permissions.jsx:76`). Changed back in Settings > Worker or Connected apps, at once and without a question.
  3. Access to watch history: the kit PermissionRequest in setup, Allow or Not now (the worker still runs on Not now). Turned off in Connected apps > YouTube > Watch history.
  4. Windows notifications: Windows asks the first time; per event in Settings > Notifications.
- **Wording rules:** agree to contracts, acknowledge notices (the Privacy Policy and Cookie Policy are never agreed to); no checkbox before the button; say what changes before the button and where to turn it off; cookie consent is the site banner's job, never part of the terms.
- **The terms sheet:** kit Sheet `blocking`, the dim veil `--v2-scrim`, radius 16 top, title 20/600 ink, the consent line 14 ink-2 with underlined ink links (new tab, announced), one primary lg full button "Agree and continue". Copy is legal's and the PM's, verbatim (`terms_sheet.jsx:61-84`).
- **Variants:** firstrun ("Before you start"); update ("Updates to our Terms of Use"; the document names are data, not fixed copy).
- **Sizes:** Sheet full window width; ConsentDialog md (382).
- **States:** not asked; agreeing (the button loads while the record is written); not saved (Banner danger "Your agreement wasn’t saved." / "Check your connection, then press Agree and continue again.", proposed copy); agreed (a row under Agreements, for example "Program Terms, agreed Oct 6, version Sep 14"); declined; withdrawn; re-asked after a terms change.
- **Props:** `TermsSheet {mode, open, busy, error, onAgree, preview}`; `ConsentDialog {app, open, busy, onAgree, onCancel}`; `PermissionRequest {app, state, decidedOn, onAllow, onNotNow}`.
- **Motion:** the sheet rises in 320 ms (V2 450 ms) and leaves in 240 ms ease-in; nothing moves under reduced motion.
- **Accessibility:** sheet and dialogs are modal and keep focus inside; the terms sheet has no close, no Esc and no scrim dismiss, by design; each link is announced "(opens in a new tab)"; the button is 44 tall with a 4.92:1 label (V2 3.24:1).
- **Responsive:** on a compact window the sheet body scrolls and the button stays visible.
- **Do / Don't:** Do keep consent copy word for word; record what was shown at the click; give every agreement a place to be seen and turned off. Don't add a checkbox before the button; don't ask once per lifetime for Automatic; don't bundle cookie consent into the terms.
