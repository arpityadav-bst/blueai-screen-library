## 46 Always ask and Automatic

**Status:** Changed from V2 (ModeRows, ConsentDialog, AutoRibbon); New (PermissionRequest).

**Why:** the PM's model is right and stays: one setting per app, every app starts on Always ask, turning Automatic on is consent, asked every time (`agent_permissions.jsx:1-33`). What changes is where it lives and how it is built: since 2026-10-14 V2 runs one app, YouTube, and changes the mode only from the composer's mode chip, which opens a popover (one row per mode, a check, number shortcuts 1 and 2); Settings' Worker card and the Automatic ribbon are gone (R05, D4). The dialog never takes focus, its agree button is 3.24:1, and watch history is read without asking (R18). Since 2026-10-15 V2 labels the mode “Auto” (the PM’s call); this system’s parts and pages still say Automatic until they are renamed.

### ModeRows

- **Purpose:** the per-app mode, with one home in Settings > Worker (section 62). The ribbon's Change opens that screen (Chat's `onChangeMode`), so the consent dialog never stacks over a float.
- **Anatomy:** one kit ListRow per app: mark 20 ink-3, name 14/500, account as the description, kit Segmented md (32) 'Always ask' (shield-check) / 'Automatic' (zap), the icons the consent table and the worker card use (`kit/permissions.jsx` OPTIONS). Note under the rows 12 ink-3: 'Automatic starts and finishes that app’s jobs without asking. Each app has its own setting, and a new app starts on Always ask.' (V2's former menu footnote; V2's popover has no footnote, only its header 'Mode for YouTube jobs'). 'Mode, per app' is not carried (Mode is not a partner word).
- **Variants:** connected (switch); coming soon ('Instagram jobs aren’t available yet.' + Badge 'Coming soon', no switch); not connected ('Not connected' + Connect). Control: `segmented` (default) or `switch`, the one-switch-per-app shape V2 tried on 2026-10-14 and dropped. A switch alone does not say which mode off is, so in the switch shape the row's description is the mode in words, 'Always ask' or 'Automatic' (then the account), a muted state line the switch is described by (`aria-describedby`; V3 review round 1, 2026-10-14).
- **Sizes:** full width.
- **States:** Always ask (default); Automatic (only after the consent: `beforeChange` opens it and commits on agree); coming soon; not connected. In V2: `?start=worker`, the composer's mode chip opens the popover (agent_permissions.jsx:93-188); `?mode=auto` starts on Automatic.
- **Props:** `worker` or `apps` + `modes`, `onChange(appId, mode)`, `beforeChange(appId, mode)` (return a promise of true to commit), `onConnect(appId)`, `note` (false hides), `control` ('segmented' | 'switch').
- **Motion:** the Segmented's own (180ms).
- **Accessibility:** each Segmented is a radiogroup named 'YouTube paid jobs' with arrow keys; segments 32 tall; aria-busy while the consent is open.
- **Responsive:** the description truncates before the switch shrinks.
- **Do / Don't:** Do send every turn-on through the consent; apply Always ask at once. Don't show a switch for an app with no jobs or no account.

### ConsentDialog

- **Purpose:** the consent for Automatic, per app, every time.
- **Anatomy:** kit Dialog, consent variant, md (382): title 20/600 'Run YouTube jobs automatically?', close 32, no scrim dismiss. Body 14 ink-2, the Dialog's description (aria-describedby, so it is read with the dialog), proposed, PM and legal (R51): 'BlueAI will take YouTube jobs and do them on your account without asking first: watching, liking, posting comments and subscribing to channels in your name.' The line is built from every action a job on that app can include (`WORKER_APPS[].actions`, section 41; `kit/permissions.jsx:75-79`), never a fixed list. V2's dialog since 2026-10-14 is the shared ModalOverlay with header and X: the title, one sentence, Cancel / I agree, turn on. Its sentence, 'BlueAI will take YouTube jobs and finish them on your account without asking first, including posting videos. You can turn this off anytime.' (`agent_permissions.jsx:203`), names posting videos, which the worker never does, and leaves out the actions it does take; on Automatic the job preview never appears, so this line is the partner's only notice of what will be done in their name. The system keeps what V2 dropped: a per-app table radius 10 (the app being changed tinted blue, Automatic in blue ink with zap, Always ask with shield-check, coming soon in words), a note 12 ink-3 'Each app has its own setting. The others stay on Always ask until you switch them.' and the agreement line 14 'By turning this on, you agree to let BlueAI do this for you on YouTube. You can turn it off anytime.' (V2's words until 2026-10-14). Added, proposed, 12 ink-3: 'Turn it off in Settings > Worker, or with Change above the chat.' Footer 44: 'Cancel' (secondary) then 'I agree, turn on' (primary). The title and buttons are V2 verbatim (`agent_permissions.jsx:201-208`); the body, table, note, agreement line and turn-off line are not.
- **Variants:** one per app.
- **Sizes:** Dialog md.
- **States:** open; agree busy (primary loading, Esc, scrim and close held), then done (closes, the ribbon appears, the agreement time is recorded per account on the server); cancel (nothing changes, the job question keeps waiting); not saved (`error`: Banner danger 'Not saved, nothing changed. Try again.' in the body, and 'I agree, turn on' is the retry; proposed copy). V2: pick Automatic in the composer's mode popover (no worker question offers it since 2026-10-14).
- **Props:** `app`, `open`, `busy`, `error`, `onAgree`, `onCancel`, `worker`, `preview` (guide only).
- **Motion:** the Dialog's (320ms in, 240ms out, none under reduced motion).
- **Accessibility:** aria-modal, labelled by the title and described by the consent line, focus in, trapped, returned; the agreement is the button (no checkbox), 44 tall at 4.92:1.
- **Responsive:** scrolls inside the window at compact height.
- **Do / Don't:** Do keep V2's title and button verbatim, send the proposed body to the PM and legal (section 70's register) and record the version shown; say where to turn it off. Don't remember consent forever; don't let a busy agree fire twice.

### AutoRibbon

- **Purpose:** while any app is Automatic, say so above the composer, with a way to change it.
- **Anatomy:** the chat kit's ComposerNotice, info tone: zap 16, 13 blue ink 'Automatic is on for YouTube. BlueAI takes paid YouTube jobs without asking.' (V2's words until 2026-10-14; V2 archived its ribbon the same day), trailing 'Change' (32) opening Settings > Worker, the mode's one home (Chat's `onChangeMode`).
- **Variants:** one.
- **Sizes:** composer width.
- **States:** visible while some app is Automatic; hidden otherwise (`autoNotice()` returns null). V2: none, the ribbon is archived (code kept, not rendered).
- **Props:** `autoNotice(worker, onChange)` returns `{tone, icon, text, action}` for `ComposerNotice` or the Composer's `notice`.
- **Motion:** none.
- **Accessibility:** Change is a real button, 32px.
- **Responsive:** text wraps; Change stays on the right.
- **Do / Don't:** Do keep it as the in-chat shortcut. Don't make it the only place to change the mode (D4).

### PermissionRequest

- **Purpose:** ask before the worker reads viewing data, say what Not now costs, and say where to take it back.
- **Anatomy:** card radius 16, max 300, padding 16. The worker speaks as 'I' throughout, as in the thread. Head 14/600: app mark on a 32 disc + 'I’d like to see'. Three lines 13 ink-2 with 16 icons: 'Your watch history', 'Your subscriptions', 'Your channel’s joined date and stats'. Why and cost 13 ink-3: 'So I can watch what you’re into and pick jobs that fit. If you choose Not now, I’ll still run, with general videos.' 'Not now' (secondary) then 'Allow' (primary), 36. Revoke note 12 ink-3: 'You can turn this off anytime in Connected apps.' All proposed copy (PM decision).
- **Variants:** full (asked); compact one-line result: allowed 'I can see your YouTube watch history. Turn it off anytime in Connected apps.'; not now 'Not allowed. I’ll watch general videos instead of what you’re into.' + Allow; revoked 'You turned off watch history on Oct 14. I’ll watch general videos until you allow it again.' + Allow.
- **Sizes:** max 300.
- **States:** asked; allowing (Allow busy); allowed; not now (with Allow); revoked in Connected apps (with Allow, which opens the full request in place, section 63). V2 has none: it reads history during setup (`worker_flow.jsx:80, 161`).
- **Props:** `app`, `state` (asked | allowed | notnow | revoked), `lines`, `busy`, `onAllow`, `onNotNow`, `decidedOn`.
- **Motion:** none.
- **Accessibility:** a named section; results are role=status; buttons 36.
- **Responsive:** single column.
- **Do / Don't:** Do give every permission a Revoke row in Connected apps. Don't ask for data access and Automatic in one tap.
