## 49 Settings blocks

**Status:** Changed from V2 (SettingsSection, AdvancedDisclosure, ByokPanel, AiModePanel).
**Why:** Settings is where a partner looks for the controls the worker's promises point to (P4). V2 copies one card shell five times with two paddings and two title weights (settings.jsx:25, 112; byok_settings.jsx:61), and leads with developer knobs (Max Output Tokens, Max Steps, Timeout, two AI Model pickers: settings.jsx:120-134, byok_settings.jsx:78). Its own-key switch deletes the key (byok_settings.jsx:64) and AI mode's failure states are unreachable. The system has one section block, one Advanced disclosure, and panels whose every state exists.

**V3 restyle (2026-10-14).** Highlight on arrival is the passing selection ring (`--v2-select-line` edge plus `--v2-ring-select`), not the focus ring and never a glow. Every settings line is a ListRow (section 18).

### SettingsSection (Changed from V2)
- **Purpose:** One card per topic the partner thinks about (Worker, Connected apps, Notifications, BlueStacks, Account and privacy, Help, then Advanced: section 55).
- **Anatomy:** Card: `--v2-surface`, 1px `--v2-line`, no shadow, radius 16, padding 16, gap 12. Header: title 16/600 ink (h2), optional description 13 ink-3, optional control at the right. Body: ListRows run full-bleed (their 16px padding aligns with the title) with their own inset hairlines; any other block gets one `--v2-line-hair` above it with 12 on each side.
- **Variants:** Plain; with description; with a header control.
- **Sizes:** Full width of the settings column (387 in the window).
- **States:** Rest; highlighted (routed here: `--v2-select-line` edge + `--v2-ring-select` for 1900ms, then fades over 240ms). V2: Settings tab at `index.html?start=worker`; the own-key route from AI credits highlights and also turns the key on (index.html:740).
- **Props:** `id`, `title`, `description`, `action`, `highlight` (truthy change = scroll into view + highlight), `className` (`is-highlighted` forces the look), `children`.
- **Motion:** Scroll smooth, instant under reduced motion; edge and ring 240ms.
- **Accessibility:** `<section aria-labelledby>` on its h2, so each block is a landmark-like group; highlight is visual only and never moves focus or changes a value.
- **Responsive:** Stacks with 12 between sections; text wraps, controls stay right.
- **Do / Don't:** Do group by what the partner thinks about and apply on change with a quiet toast; a Save button only for a multi-field form. Don't add a shadow or a second padding. Don't change a setting by routing to it.

### AdvancedDisclosure (Changed from V2: V2 has no grouping)
- **Purpose:** The one place developer controls live: AI mode, your own key, the chat model (one picker).
- **Anatomy:** Full-width button row: surface, 1px line, radius 16, min 44, padding 12 16; "Advanced" 14/500 ink + "AI mode, your own key and the chat model. Most partners never need these." 12 ink-3; chevron-down 16 ink-3 that turns 180° open. Body: the panels, 12 apart.
- **Variants:** One.
- **Sizes:** Full width.
- **States:** Closed; hover (edge firms + wash); focus-visible; active; open. Forced with `.is-hover`, `.is-focus`, `.is-active`.
- **Props:** `open` + `onToggle(next)` (controlled) or `defaultOpen`; `label`, `description`, `className`, `children`.
- **Motion:** Chevron 180ms; the body appears without animation.
- **Accessibility:** Real button, aria-expanded, aria-controls on a body that stays in the DOM with `hidden`.
- **Responsive:** Text wraps; chevron stays right.
- **Do / Don't:** Do keep it closed by default. Don't put anything a partner needs for the worker inside it.

### ByokPanel (Changed from V2)
- **Purpose:** Run BlueAI on your own provider key so AI credits are not used.
- **Anatomy:** SettingsSection "Bring your own key" + V2's description (with "no AI credits used"); `V2Kit.Switch` row "Use my own key" / "Turning this off keeps your saved key."; then one block: no key (note "No API key configured. Add one to get started." + Select "Provider", placeholder "Add a provider"); entry (Select, TextField "API key" secret mono with the provider hint as helper, "Your key is stored encrypted on this device only." with lock 16, Cancel + Check and save); saved (provider 14/500, "•••• qAAA" mono 13 ink-3, Remove secondary sm, Select "Model", note "No AI credits are used while this is on.").
- **Variants:** Off; off with a key kept; on.
- **Sizes:** Full width.
- **States:** Off; off, key kept; on, no key; provider picked; validating (the button keeps "Check and save" with its loading spinner, field read-only, helper "Checking your key with Anthropic…"); invalid key (field error "That key didn’t work. Check it and paste it again."); provider unreachable (danger Banner "Couldn’t reach Anthropic" + "Your key wasn’t saved.", action Try again); saved; remove confirm ("Remove your Anthropic key? BlueAI goes back to using your AI credits." Keep key / Remove key danger); removed (no-key state + Toast "Anthropic key removed" with Undo). V2: Settings tab, Preview row "Own key: On"; V2 has no validating, invalid, unreachable or confirm states, and its Validate & Save makes up a key when empty (byok_settings.jsx:54).
- **Props:** `on`, `keyInfo` {provider, model, last4 | key}, `providers` (default V2's five), `status` ('idle' | 'validating' | 'invalid' | 'unreachable' | 'confirm-remove'), `draft` {provider, key}, `highlight`, `onToggle(next)`, `onSave({provider, key, model})`, `onCancel`, `onRemove(keyInfo)`, `onModel(model)`.
- **Motion:** Switch 180ms; nothing else.
- **Accessibility:** role=switch with a visible label; the key is a password field with a reveal button; Check and save stays focusable when disabled and says why ("Paste your key first"); Remove asks before it acts.
- **Responsive:** Actions wrap right-aligned.
- **Do / Don't:** Do let the switch only enable. Do confirm Remove and offer Undo. Don't show the key in clear text. Don't report success without a check.

**Proposed copy:** "Use my own key", "Turning this off keeps your saved key.", "Check and save", "Checking your key with {provider}…", "That key didn’t work. Check it and paste it again.", "Couldn’t reach {provider}", "Your key wasn’t saved.", "Paste your key first", "Remove your {provider} key? BlueAI goes back to using your AI credits.", "Keep key", "Remove key", "{provider} key removed", "No AI credits are used while this is on." (adapted from index.html:485), "Your key is saved but not in use, so AI credits are used.". Kept from V2: the description (with "no AI credits used" for "no BlueAI credits consumed"), "No API key configured. Add one to get started.", "Add a provider", the five providers and hints, "Your key is stored encrypted on this device only.".

### AiModePanel (Changed from V2)
- **Purpose:** Choose where AI runs: Cloud (default) or Hybrid on the partner's PC, so tasks use fewer AI credits.
- **Anatomy:** SettingsSection "AI mode" / "Choose where AI processing happens."; `V2Kit.RadioCard` Cloud ("Default. Uses cloud AI.") and Hybrid ("Runs on your PC and uses fewer AI credits."), Hybrid pending while picked but not active; body by status: pending text + "Additional files of 3 to 4 GB are required to enable Hybrid mode." 13/500 ink + Download and turn on (primary sm, download icon); ProgressBar size 6 ("Downloading Hybrid AI…" 42%, "Installing Hybrid AI…" sliding) + "Cloud mode is still available." + Cancel download (quiet); "Hybrid status" row + Badge; Banner for conflict (`offline` tone, the Banner's neutral one, with the `alert` icon) or failure (danger) with Try again as its action; a link "Use my own local model instead" (endpoint + model name TextFields, Apply).
- **Variants:** method auto (BlueAI's own model, default) or custom (your local model endpoint).
- **Sizes:** Full width.
- **States:** Cloud; Hybrid pending; downloading; installing; on; on with another local model running; download failed; couldn't start; paused; hardware not supported (Hybrid disabled with its reason "This PC doesn’t meet the requirements for Hybrid. Cloud mode will be used."); own local model. V2: Settings tab, Hybrid then Auto (modal) for the happy path; Preview rows "Hardware: No" and "AI conflict: Detected"; nothing in V2 sets download failed, couldn't start or paused (ai_mode.jsx:300).
- **Props:** `mode`, `method`, `status` (V2's lifecycle keys), `hwSupported`, `conflict`, `pct`, `endpoint`, `model`, `onPick(mode)`, `onMethod(method)`, `onDownload`, `onCancel`, `onRetry`, `onEndpoint`, `onModel`, `onApply`.
- **Motion:** ProgressBar's own (fill 240ms, sliding segment; still under reduced motion).
- **Accessibility:** Native radios (arrow keys); the disabled card states its reason in text; progress is role=progressbar with value text; failure banners are role=alert.
- **Responsive:** Radio cards sit side by side; the body stacks below.
- **Do / Don't:** Do default to BlueAI's model and state the download size before the button. Do say "AI credits", never "tokens". Don't open a second dialog to set up Hybrid. Don't say Retry: say Try again.

**Proposed copy:** "Runs on your PC and uses fewer AI credits.", "You’re still on Cloud until Hybrid is set up.", "Download and turn on", "Hybrid mode uses your PC (your local model) for supported tasks, so they use fewer AI credits.", "Use my own local model instead", "Use BlueAI’s model instead", "Model endpoint", "Model name", "Enter the endpoint and model name first". Kept from V2: "Choose where AI processing happens.", "Default. Uses cloud AI.", "Setup needed", the 3 to 4 GB line, "Downloading Hybrid AI…", "Installing Hybrid AI…", "Cloud mode is still available.", "Cancel download", the conflict, failure and hardware lines, the status labels On, Download failed, Couldn't start, Paused.
