## 41 The Worker record

**Status:** New.

**Why:** BlueAI is a worker that runs once a day on the partner's own accounts, so its state has to outlive every screen. V2 keeps it in a component's local state, module globals and constants: the day count is a constant (`worker_day_done.jsx:39`), so tonight's overlay says DAY 7 OF 20 and tomorrow's strip says Day 6 of 20 (`:173`); the next run is hard-coded to 11 am (`chat_product.jsx:213`); the mode per app resets on reload (`agent_permissions.jsx:60`); opening another tab unmounts the run (R01, R02).

### Worker record and fixtures

- **Purpose:** the one state every worker surface reads (WorkerCard, ProgramStrip, DayBar, DayDone, JobPreviewCard, ModeRows, RunCard, Home, Activity, the top-bar status chip). Counts are derived, never stored.
- **Anatomy:** plain data, `kit/worker-data.jsx`:
  - `account` {name, first, email}: one neutral identity (Alex Morgan, @alexwatches), never staff data (R39).
  - `setUp`, `coachSeen`, `online`, `paused` (null or {until}).
  - `apps.youtube` / `apps.instagram`: {status connected | not-connected | coming-soon, handle, mode always | auto, history allowed | notnow | revoked}.
  - `runWindow` {kind time | window | any, label}.
  - `credits` {left, grant 2000, refillAt, runCost}.
  - `today` {status scheduled | running | waiting | done | failed | none, nextRunAt, startedAt, step, stepsDone, ask {job, since, expires}, end job | nojob | day20 | failed | declined, error}.
  - `ledger`: one row per day {date, status verified | pending | late | rejected | skipped | missed, reason}.
  - `program` {target 20, endsOn 'Nov 1', daysLeft}.
  - Helpers on `window.V2Kit`: `numbers(record)`, `workerState(record)`, `modeSummary(record)`, `nextRunText(record)`; constants `WORKER_RULE` (V2's RULE, `worker_day_done.jsx:38`), `WORKER_APPS`, `WORKER_JOB`, `EARNINGS_URL` (one URL; V2 has two).
- **Variants:** 17 fixtures in `FIXTURE_ORDER`: new, setUp, running, waiting, donePending, verified, failed, paused, offline, complete, noCredits, rejected, automatic, nojob, declined, day20, behind.
- **Sizes:** n/a (data).
- **States:** `numbers()` returns done (verified + pending: the count every surface prints), verified, pending, rejected, notCounted, toGo, daysLeft, reachable, outOfReach, complete, latestRejected, last and the 20 `segments` (verified | pending | rejected | missed | future). `workerState()` returns the card state in priority order: setup, complete, offline, paused, running, waiting, failed, done, noCredits, scheduled. In V2 these come from `?start=worker`, `?day=returning`, `?day=next&end=job|nojob|day20|failed`, `?mode=auto`.
- **Props:** n/a. Surfaces take `worker` (the record) and read through the helpers.
- **Motion:** none.
- **Accessibility:** the record feeds the spoken values (DayBar's aria-valuetext, StatusTick names), so they always match the visible count.
- **Responsive:** n/a.
- **Do / Don't:** Do change a count by adding a ledger row; read times from `runWindow`; keep the record above every screen. Don't store a count, a time or a mode in a component; don't hard-code Day 6 or 11 am; don't invent a second identity.
