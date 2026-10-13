## 63 Connected apps

**Status:** New.
**Why:** The worker watches, likes and comments as the partner. V2 confirms the YouTube account once in chat (worker_flow.jsx:71) and never shows it again, reads watch history unasked (worker_flow.jsx:80, R18), lets Instagram be set to Automatic before its jobs exist (agent_permissions.jsx:53, R40), and its Telegram card "Unlink"s at once (settings.jsx:44). The partner needs one place that says which accounts are in use, what BlueAI does with each, and how to stop it.

### ConnectedApps (New)
- **Purpose:** List the accounts BlueAI acts on; per account, what it does there and the way to stop it, with the cost said first.
- **Anatomy:** `ScreenHeader` "Connected apps" with Back (pushed over Settings).
  - **List:** `SettingsSection` "Your accounts" / "BlueAI acts on these accounts for you. It never sees or types your passwords." holding `ConnectedAppRows`: one nav `ListRow` per app, `Avatar` app 32, name 14/500, account 13 ink-3, one `Badge`:
    YouTube "@alexwatches · Always ask" + Connected (success) / "Signed out in App Player" + Signed out (attention) / "Not connected" + Not connected (neutral);
    Telegram "Connected to @BlueAIBot" + Connected / "Send commands to BlueAI from any device." + Not connected;
    Instagram "Instagram jobs aren’t available yet." + Coming soon, static (no chevron, no switch). Note 12 ink-3: "A new app starts on Always ask. Instagram turns on here when its jobs go live."
  - **YouTube detail** (titled "YouTube"): section "Account": `Avatar` app 40 + handle + "Signed in to App Player on this PC." + Connected. Signed out: "App Player isn’t signed in to YouTube. Sign in there so today’s run can start." + `Button` secondary sm "Open App Player". Section "What BlueAI does here": "Paid jobs" nav row with the mode as value (pushes Worker settings, 62); "Watch history" + `Switch` ("Used to pick jobs that fit what you watch." / "Off. BlueAI watches general videos instead."). Then the consequence 13 ink-3 "BlueAI stops using @alexwatches and pauses your daily runs until you connect YouTube again." over `Button` danger "Disconnect YouTube". It opens a `Dialog` alert "Disconnect YouTube?" / "BlueAI stops using @alexwatches and pauses your daily runs. Days without a run don’t count toward your 20 days." Cancel / Disconnect (danger). After: "Not connected" row + `Button` primary sm "Connect", toast "YouTube disconnected".
  - **Telegram detail:** linked: "Connected to @BlueAIBot" + Connected; "You won’t be able to send commands to BlueAI from Telegram. Your worker keeps running." over `Button` danger "Disconnect Telegram", no confirm (it costs no day), toast with Undo. Not linked: V2's "Connect your Telegram account and send commands to BlueAI from any device." + `Button` primary "Connect Telegram" (V2's pairing dialog follows).
- **Variants:** List; YouTube detail; Telegram detail. `ConnectedAppRows` is also Settings' Connected apps section (61).
- **Sizes:** The 419 window; rows min 48; account avatar 40 on details, 32 in lists.
- **States:** List (YouTube connected, Telegram not connected, Instagram Coming soon); YouTube connected; YouTube signed out in App Player; disconnect confirm; disconnected; Telegram linked; Telegram not linked.
- **Props:** `ConnectedApps {worker, app (null | 'youtube' | 'telegram'), state ('connected' | 'signed-out' | 'disconnect' | 'disconnected'), telegram ('linked' | 'not-linked'), onBack, onNavigate, frame, compact, landmark, preview}`. `ConnectedAppRows {worker, youtube, telegram, onOpen(app)}`.
- **Motion:** The kit's dialog and toast only.
- **Accessibility:** Rows are buttons with a focus ring; a status is a word in the Badge, never colour alone; the alert dialog starts focus on Cancel and returns it to the Disconnect button. The watch-history switch is named "Use my watch history".
- **Responsive:** One column; handle and descriptions wrap; badges never shrink.
- **Do / Don't:** Do show the handle BlueAI uses. Do say what disconnecting costs above the button and in the confirm. Do confirm a disconnect that costs days and offer Undo for one that costs nothing. Don't say "Unlink". Don't let a partner consent to automation on an app with no jobs. Don't read watch history without a switch to stop it.

**Proposed copy:** everything except "Connected to @BlueAIBot", "Connect your Telegram account and send commands to BlueAI from any device." and "Connect Telegram" (settings.jsx:40-45). "It never sees or types your passwords." adapts the pitch's "I never see or type your password." (worker_flow.jsx:67). **Open:** where Disconnect leaves the program day (runs pause; paused days don't count) is the same rule as pausing (62).
