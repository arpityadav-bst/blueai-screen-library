## 62 Worker settings

**Status:** New.
**Why:** BlueAI acts on the partner's account every day, so every promise made in setup needs a control the partner can find later (P4, R05). V2's pitch says "You can pause, stop, or disconnect anytime." (worker_flow.jsx:67) and its consent says "You can turn it off anytime." (agent_permissions.jsx:176), yet the mode changes only inside an open chat (a Settings card was dropped, agent_permissions.jsx:16), modes reset on reload (:18), and the run time is asked once in chat (worker_flow.jsx:73-74) and never shown again.

### WorkerSettings (New)
- **Purpose:** Settings > Worker. Turn daily runs off for a while (and know what it costs), choose Always ask or Automatic per app, set when the run happens, and see the interest profile jobs are picked from.
- **Anatomy:** `ScreenHeader` "Worker" with Back (Settings stays lit; the consent dialog's own note says "Settings > Worker"). Four `SettingsSection` cards:
  1. **Runs**: `ListRow` "Daily runs" + `Switch`. On: `nextRunText` ("Next run today at 11 am."). Off: "Paused until Oct 16. Paused days don’t count toward your 20 days." Turning it off opens the pause `Dialog` (task, md) "Pause daily runs?": the cost from `numbers()` ("Days you pause don’t count toward your 20 days. You need 13 more, and 18 days are left."), then `Select` "Pause until" (Tomorrow, Oct 14 / Oct 16 / Oct 20 / Until I turn them back on); actions Keep running / Pause (primary). Turning it on resumes at once.
  2. **Paid jobs**, description "Choose for each app whether BlueAI asks before every paid job.": `ModeRows` (section 46), full-bleed. Picking Automatic opens `ConsentDialog` first and applies only on "I agree, turn on"; Always ask applies at once. Instagram: "Coming soon", no control.
  3. **Daily run**, description "Changes start tomorrow if today’s run has already begun.": `RadioCard` list "A set time" ("BlueAI starts within that hour.") / "A window" ("BlueAI picks a different moment in it each day.") / "Any time" ("BlueAI picks the moment each day."); then one `Select` "Start at" (6 am to 10 pm, hourly) or two side by side, "From" and "To" (gap 8).
  4. **Interest profile**, description "Built from your watch history. BlueAI picks jobs that fit these topics.": `Chip` toggles with V2's four topics (worker_flow.jsx:85, names only): Tech & Smartphones, Automotive, Motivation & Finance, Entertainment; note 12 ink-3 "Turn a topic off and BlueAI stops picking jobs about it."
  Every change confirms in a `Toast` ("Daily run set at 11 am.", "Automatic is on for YouTube.", "Daily runs paused.", "Daily runs are back on.").
- **Variants:** One screen.
- **Sizes:** The 419 window; content 387; selects full width or two equal columns.
- **States:** Always ask everywhere (default); Automatic on YouTube; consent open; pause dialog open; paused until a date; editing the run window (A window, From 9 am, To 9 pm).
- **Props:** `worker`, `state` ('ask' | 'auto' | 'consent' | 'pause' | 'paused' | 'window'), `onBack`, `frame`, `compact`, `landmark`, `preview`. Reads and writes the Worker record: `apps[app].mode`, `paused.until`, `runWindow {kind, label}`.
- **Motion:** The kit's: dialog scale-in, toast rise, switch thumb; nothing under reduced motion.
- **Accessibility:** The switch is role=switch named "Daily runs" and is busy while the pause dialog decides; Segmented and RadioCard are radio groups with arrow keys; chips carry aria-pressed. Dialog focus moves in and returns to the switch. The cost sentence is in the dialog body, read before the buttons.
- **Responsive:** One column; the From and To selects stay side by side at 387.
- **Do / Don't:** Do say the cost of pausing before it happens. Do apply at once and confirm in a toast. Do send Automatic through consent every time. Don't keep the mode only in chat. Don't let a pause have no end and no cost. Don't change today's run silently once it has begun.

**Proposed copy:** every string on this screen except "Always ask", "Automatic", "I agree, turn on", the consent body (section 46) and the four topic names. The run window lines are V2's chat lines (worker_flow.jsx:73) moved from the worker's "I" to "BlueAI"; "Leave it to me" becomes "Any time" because on a settings screen "me" reads as the partner. **Decisions:** D4 (this screen is the permanent home of the mode either way); whether a partner may turn a topic off is a product call.
