## 21 Banner

**Status:** Changed from V2.

**Why:** Some conditions decide whether today counts: out of AI credits, offline, App Player signed out, Automatic on. The partner has to see them above what they affect, said the same way every time. V2 has five banners in two blues, two ambers and two reds: an edgeless InfoBanner (ai_mode.jsx:71-78), a centred out-of-credits block at radius 14 (index.html:499-510), a second amber for BYOK (byok_settings.jsx:109), a sign-in notice at radius 12 (login.jsx:235), and the Automatic ribbon (agent_permissions.jsx:195). None can be dismissed, none has an offline tone.

### Banner (Changed from V2)

**Purpose.** A condition that holds until it ends, placed directly above what it is about. One-time news (a verified day) may use it too, and only then can it be dismissed.

**Anatomy.**
1. Box: radius 10 (`--v2-radius-md`), 1px tone line, tone tint, padding 12, gap 8, left-aligned.
2. Icon: 16, in the tone ink.
3. Text: title 13/600 `--v2-ink` (optional), body 13 `--v2-ink-2`, `--v2-leading-body`. Figures in the body are bold ink, tabular.
4. Actions (trailing, optional): one action as `V2Kit.Link` standalone (an underlined 13/500 ink link with a 32px target, `kit/notice.jsx`), and/or a 32px dismiss (`close`, labelled "Dismiss").

The words stay in ink so every tone passes 4.5:1; the tone lives in the tint, the line and the icon.

**Variants.** Five tones:
- info: `--v2-blue-tint`, `--v2-blue-tint-line`, icon `--v2-blue-ink` (`info`). A fact, nothing to do.
- success: `--v2-success-tint`, `--v2-success-line`, icon `--v2-success-ink` (`check`). News.
- attention: `--v2-attention-tint`, `--v2-attention-line`, icon `--v2-attention-ink` (`alert`). The partner has to do something.
- danger: `--v2-danger-tint` #fdecec, `--v2-danger-line` rgba(208,69,74,0.32) (the pale edge; the solid `--v2-danger-edge` is for invalid fields only), icon `--v2-danger-ink` (`x-circle`). Today is blocked.
- offline: `--v2-surface-sunken`, `--v2-line`, icon `--v2-ink-3` (`wifi-off`). New. This is the Banner's neutral tone (section 03): a neutral condition that is not about the connection uses it with its own icon (the AI-mode conflict: `tone="offline" icon="alert"`, section 49). There is no `neutral` value; an unknown tone renders as info.
Any icon can replace the default (Automatic uses `zap`).

**Sizes.** One. Full width of its container.

**States.**
- Static. V2: Settings > AI Mode with Preview "Hardware: No" (Hybrid unsupported); Settings > BYOK on with no key; `?signin=browser` (the in-app "Check your browser" step: Use the account you applied with).
- With action. V2: `?start=worker&mode=auto`, then Run (the ribbon's "Change").
- Dismissible: news only. New.
- Live value: the out-of-credits countdown (`?start=worker&credits=0`, then the credits pill). The ticking value sits in `<strong aria-live="off">` so it is read once.
- Action hover (blue ink, underline firms), focus-visible (2px blue outline): the Link's own states. New.

**Props.** `Banner { tone = 'info' | 'success' | 'attention' | 'danger' | 'offline', icon (name, or null for none), title, children, action ({ label, onClick } or { label, href, external } or a node), onDismiss, dismissLabel = 'Dismiss', className }`.

**Motion.** None of its own. A screen may bring it in with `.v2-anim-fade-up`.

**Accessibility.** Danger is `role="alert"`; the others `role="status"`, so a banner that appears is announced once. The action and the dismiss are real buttons or links with visible focus and 32px targets. Never colour alone: the title or body says the condition.

**Responsive.** Text wraps; the action stays at the trailing edge, top-aligned with the first line through its negative margin.

**Do / Don't.** Do place it above what it is about and remove it when the condition ends. Do say what it means for today and the one next step ("Today’s run starts when BlueAI is back online."). Don't dismiss a condition: it would hide something still true. Don't centre the text or invent a sixth tone. Don't stack two: show the one that blocks today.
