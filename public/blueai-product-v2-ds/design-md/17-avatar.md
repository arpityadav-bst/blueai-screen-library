## 17 Avatar

**Status:** Changed from V2.

**Why:** The partner signs in with the account they applied with, and BlueAI acts on their own YouTube account. Who is signed in, and which account a connected app is, must be plain at a glance. V2's Profile puts a 92px bat emoji on a green disc over a gradient banner where that identity goes (profile.jsx:31-34); the sign-in gate already does it right with an initial on the account's hue (account_gate.jsx:20, 51). The system keeps the gate's idea.

### Avatar (Changed from V2)

**Purpose.** Who is signed in (Account, the sign-in gate, menus) and which app an account row is about (Connected apps).

**Anatomy.**
1. Round disc (`--v2-radius-round`).
2. Content, one of: initials, a photo over the initials, or an app glyph.
3. Initials: white (`--v2-on-color`), 600. One letter up to 32, first and last initial from 40.
4. Fill for initials: one of two hues picked from the account id (stable for that account): `--v2-action` or `--v2-ink`. Both clear 4.5:1 with white; V2's sign-in hue `#156efe` (signin_page.jsx:26) gives 4.47:1, so hue 0 is the action blue.
5. App mark: the app's glyph from the icon registry in `--v2-ink-2` on `--v2-surface-sunken` with a 1px `--v2-line` inset. No brand colours.
6. Status dot (optional): 28% of the size (8 minimum), bottom right, 2px `--v2-surface` ring; success, attention, danger or neutral.

**Variants.** Initials (hue 0, hue 1). Photo. App mark: YouTube, Instagram, Telegram.

**Sizes.** 24 (menus, initials 11px), 32 (rows, 13px), 40 (account rows, 14px), 56 (sign-in and Account, 20px). App glyph 16 / 16 / 20 / 24.

**States.**
- Photo: covers the initials once loaded. New (V2 has no photo).
- Photo failed: falls back to the initials, no broken image. New.
- Loading: a skeleton circle the same size. New.
- Status: connected, needs you, signed out. New (Connected apps, section 63).
- In V2 today: Kebab > Profile (emoji avatar); `?cases=signin&case=2` (56px initial on the gate).

**Props.** `Avatar { name, id, src, size = 24 | 32 | 40 | 56 (default 32), app = 'youtube' | 'instagram' | 'telegram', status = 'success' | 'attention' | 'danger' | 'neutral', statusLabel, loading, decorative, className }`. `id` picks the hue (falls back to `name`). With `app`, `name` is ignored.

**Motion.** None. Loading uses the shared shimmer.

**Accessibility.** Announced as an image named after the person or app plus the status ("YouTube, Connected"). When the name is printed beside it (rows, the gate), pass `decorative`. The status dot always repeats a status said in words nearby (badge or description).

**Responsive.** Fixed sizes; never stretches. In rows it sits in the leading slot.

**Do / Don't.** Do show the name and email beside it. Do use the account photo when there is one. Don't use emoji, mascots or illustrations for a person. Don't add brand colours to app marks. Don't add more hues: two tell two accounts apart, and the email says which. Don't bring back the gradient banner.
