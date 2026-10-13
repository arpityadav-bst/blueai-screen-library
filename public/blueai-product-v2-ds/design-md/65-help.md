## 65 Help and Report a problem

**Status:** New.
**Why:** Help is the escape hatch when a day or a payout looks wrong, the moment money is at stake (R34). V2 draws a Help menu with "FAQ" and "Report Issue" whose rows only close the menu (index.html:355-356), with a red warning glyph on a help entry (index.html:306). There is nothing behind them.

### Help (New)
- **Purpose:** Two entries reachable from every screen: FAQ opens the site article in the browser; Report a problem opens one sheet, already attached to the run it started from when it started from one.
- **Anatomy:** Not a screen. Entry points: the top bar's Help `Menu` (section 30: "FAQ" external, "Report a problem"), Settings > Help (61), a failed `RunCard` and a rejected day in Activity (58). `ReportProblemSheet` is the kit `Sheet` (full window width):
  - title "Report a problem", description "We reply by email to alex@example.com." (the signed-in email);
  - when started from a run: a sunken block (radius 10, 13 ink-2) with activity 16, the run in 600 ("Today’s run, Oct 13.") and what happened ("Didn’t finish: App Player closed during the job.");
  - `Select` "What is it about?" (placeholder "Choose one"): A run / A day that wasn’t verified / Earnings or cash out / My account or sign-in / Something else in the app; "A run" when attached to a run;
  - `TextArea` "What happened?", required, 4 rows growing to 6, 1,000 characters, placeholder "Example: The run stopped after the second video and the day shows as not counted.";
  - `Checkbox` "Include diagnostic info", on, "Today’s run log and the app version. Never your passwords or messages.";
  - actions Cancel / Send (primary, disabled until something is written). Failed: `Banner` danger "Couldn’t send your report" / "Check your connection and try again. What you wrote is kept." and Send becomes "Try again". Sent: the sheet closes, `Toast` success "Report sent. We’ll reply by email."
- **Variants:** From a run (attached, topic picked) or blank (from the menu or Settings).
- **Sizes:** Sheet full window width, 419; fields full width.
- **States:** Menu open; draft (blank or from a run); draft with text (Send enabled); sending (sheet held, Send spinner); sent (toast); failed (text kept, Try again).
- **Props:** `Help {worker, state ('menu' | 'draft' | 'sending' | 'sent' | 'failed'), about (true reads today's run, or {label, detail}), frame, compact, landmark, preview}`; `ReportProblemSheet {open, state, about, text, email, preview, onClose, onSent}`.
- **Motion:** The kit's sheet rise and toast; none under reduced motion.
- **Accessibility:** The menu is role=menu with arrows, Esc and focus return (R25). The sheet traps focus, Esc and the scrim close it except while sending. Fields have visible labels; the placeholder is an example, never the label; the failure banner is role=alert; the toast is polite.
- **Responsive:** One column inside the sheet; the textarea grows to 6 rows, then scrolls.
- **Do / Don't:** Do open the FAQ in the browser. Do attach the run and say which. Do keep the text when sending fails. Do say where the reply goes. Don't draw a menu row that does nothing. Don't use red for a help entry. Don't make the partner retype which run went wrong. Don't send diagnostics without saying what they contain.

**Proposed copy:** everything in the sheet. "Report Issue" becomes "Report a problem"; "FAQ" is kept. **Open:** the reply channel and its timing are the support team's to state; the sheet promises email only.
