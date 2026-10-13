## 61 Settings

**Status:** Changed from V2.
**Why:** The partner opens Settings to control the worker that acts on their account. V2's Settings has no title, opens on a BlueStacks card that says "Connected to BlueStacks App Player" even when BlueStacks is not installed (settings.jsx:16, R16), then Telegram, AI mode, own key and a Chat AI Settings card of Max Output Tokens, Max Steps and Timeout with its own Save button and a second AI Model picker (settings.jsx:105-123, R31). Nothing about the worker, its accounts or the partner is there. The system puts partner topics first and developer controls last, closed.

### Settings (Changed from V2)
- **Purpose:** The Settings tab: one place to see and reach every control over the worker, the accounts it uses, what it tells you, the app it drives, your account and help. Developer controls stay out of the way.
- **Anatomy:** `ScreenHeader` "Settings" (20/600, no Back: a tab root). Then `SettingsSection` cards, 12 apart on the 16 gutter, in this order:
  1. **Worker**: one nav `ListRow` "BlueAI worker", leading calendar 16 (pause 16 when paused), description from the Worker record ("Runs daily at 11 am. Paid jobs: Always ask." or "Paused until Oct 16. Paused days don’t count."), `Badge` neutral "Paused" only when paused. Pushes Worker settings (62).
  2. **Connected apps**, description "The accounts BlueAI uses for you.": `V2Screens.ConnectedAppRows` (63): YouTube (handle · mode, Badge Connected / Signed out / Not connected), Telegram, Instagram (static, Badge "Coming soon"). Each live row pushes that app's detail.
  3. **Notifications**: two control rows, `ListRow` + `Switch`: "A paid job needs you" / "A job you don’t answer by 9 pm doesn’t count for today."; "Today’s run ends" / "Done, or stopped with a way to try again." (Proposed copy).
  4. **BlueStacks**: one row "BlueStacks App Player", mark = monitor 16 on a 32 sunken disc. Connected: V2's "To switch, open BlueAI from another instance." + `Badge` success "Connected". Signed out: "App Player isn’t signed in to YouTube. Sign in there so today’s run can start." + `Button` secondary sm "Open App Player". Not installed: "Not installed. BlueAI runs your jobs inside App Player, so today’s run can’t start without it." + `Button` primary sm "Get BlueStacks".
  5. **Account and privacy**: one nav row, `Avatar` 32 + name + email. Pushes Account (64).
  6. **Help**: "FAQ" (external row, opens the site in the browser) and "Report a problem" (opens the sheet, 65).
  7. `AdvancedDisclosure` "Advanced" / "AI mode, your own key and the chat model. Most partners never need these.", closed: `AiModePanel`, `ByokPanel` (section 49), and a "Chat model" section with one `Select` (Auto + V2's six models, settings.jsx:108-114).
- **Variants:** One screen. The BlueStacks row has three variants (connected, signed out, not installed) bound to the worker's preflight (R13), never a fixed claim.
- **Sizes:** The 419 window, content 387 wide; full 830 or compact 640 (the content band scrolls, bars stay pinned).
- **States:** Default; Advanced open; BlueStacks not installed; BlueStacks signed out; a section highlighted after routing (blue edge + ring for 1900ms, value unchanged); worker paused; Report a problem sheet open. V2: `index.html?start=worker`, then Settings in the nav.
- **Props:** `worker`, `state` ('default' | 'advanced' | 'no-bluestacks' | 'report'), `bluestacks` ('connected' | 'not-installed' | 'signed-out'), `telegram` ('linked' | 'not-linked'), `highlight` (section id), `onNavigate(id, opts)`, `frame`, `compact`, `landmark`, `preview` (guide). Shares `V2Screens.AccountFrame` (AppFrame + TopBar + BottomNav, Settings lit) with sections 62 to 66.
- **Motion:** None of its own. Routing scrolls the section into view (instantly under reduced motion); the kit's row and disclosure transitions only.
- **Accessibility:** One h1, one h2 per section. Nav rows are buttons or links with a visible focus ring; the FAQ row says "(opens in your browser)". Switches carry their row's label as their name. Every control is at least 32px tall. Body 14 ink, descriptions 13 ink-3 (6.0:1 on white).
- **Responsive:** One column; long descriptions wrap; badges and buttons never shrink.
- **Do / Don't:** Do keep the order. Do bind BlueStacks to the preflight. Do apply each change at once with a toast. Don't show tokens, steps or timeouts. Don't add a Save button to toggles. Don't open Advanced by default. Don't change a value by routing to it.

**Proposed copy:** the two notification rows, the BlueStacks signed-out and not-installed lines, the worker summary sentence, the Advanced description and "The model your chat replies use. Auto picks one for each message." Kept from V2: "To switch, open BlueAI from another instance.", "Connect Telegram", the model names.
