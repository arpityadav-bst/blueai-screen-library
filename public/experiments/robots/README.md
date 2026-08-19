# robots — "The AI You Own"

A second BlueAI worker-storyline homepage mock, pulled in as its own separate entry — **not** a
replacement for or a sync of `../intelligence-hero/`, which is a different, already-live rebuild of
a related concept. See that folder's own README for the distinction if the overlap is confusing.

---

## SOURCE — for traceability, since this is a straight pull, not an original build here

- **Repo:** `abhisht-bst/blueai-creator-brand`
- **Branch:** `no-robots` (the PM's own branch name — the repo's README describes this as "the
  pre-robot variant": laptop screen shows the task list, no worker robot, no ghost crew. A robot
  version exists on that repo's `main` branch and was **not** pulled here — only `no-robots` was
  linked, so only `no-robots` is represented)
- **Commit pulled:** `59c44477`
- Untouched from source except for being copied into this repo. No edits, no re-theming, no
  integration with this site's own design system yet — that is deliberately a later phase.

## WHAT'S HERE

- `index.html` — the file the source repo's own README instructs you to open. Single file, no
  build step, no server: every style, script and image is embedded (data URIs), so unlike
  `intelligence-hero` there are no separate asset files and no relative-path URL trap.
- `alt-copy.html` — the source repo's second file (was named `no-robots.html` there). Same page,
  a different copy/interaction pass — "Join the first wave" hero CTA, "You get it hired.", a task
  lifecycle with an explicit approval beat, and a webp couch image. **THIS is the canonical
  variant** (Appy, 2026-08-19 — overriding the source README, which called index.html canonical):
  the `/creators` port is built from this file. `index.html` stays on record, unused.

## SCOPE — deliberately narrow right now

This is Phase 1 of a larger, explicit plan: pull the design, list it, THEN layer the real creator
flow (sign-in, application, dashboard — all of which already exist and are live at
`/creator-brand/creators`) on top of it. **That flow work has not started.** This page right now is
exactly the PM's raw mock — its own CTAs go nowhere yet, same "look-real-does-nothing" convention as
every other design-only stub on this site until it's wired.

**Location:** `blueai/public/experiments/robots/`
**URL:** `/experiments/robots/index.html` — linked directly, not via a rewrite (same reasoning as
`intelligence-hero`'s own README: rewrites don't survive a static export, so index pages link
straight to the file).
