## 45 Job preview

**Status:** New (a proposal, R07; the PM's job-ask copy stays in V2's AskCard, section 37, until he decides).

**Why:** the riskiest moment in the product is agreeing to public activity under the partner's name. V2's ask shows only 'Watch the video and provide feedback.' (`worker_flow.jsx:51, 119`); the comment it posts is never shown (`:136`); the first chip, 'Yes, switch to Automatic', bundles yes with a standing consent (`:121`); and the cost of 'Not now' (the day) is told only afterwards (`:149`).

### JobPreviewCard

- **Purpose:** before a paid job runs on the partner's account, show which video, which channel, what will be done (with the exact comment) and what skipping costs; after an Automatic job, show the same facts as a receipt.
- **Anatomy:** card radius 16, max 300, 1px line (attention line while it waits). Head 13/500 with the app mark: 'Paid job available' (V2) and when ('Just now' or 'Since 11:04 am'), on `--v2-attention-tint` in attention ink while waiting, panel grey otherwise. Thumbnail 16:9, radius 10, duration 11/500 on ink. Video title 14/600 ink; 'TechLine on YouTube' 13 ink-3. A plain list with 16 icons (facts, not chips): 'Watch the whole video', 'Like it', 'Post this comment'. The exact comment in a quote block 13/1.5 ink on sunken with a 2px line-strong edge. Deadline line 13 ink-2 with an attention clock: 'Answer by 9 pm or today won’t count.' Actions, full width, 36: primary 'Take this job'; secondary 'Skip today (today won’t count)'; quiet 'Stop asking for YouTube jobs' (opens the consent for Automatic).
- **Variants:** ask (Always ask); receipt (Automatic): head 'Paid job done' 'At 11:12 am', past-tense list, foot with one tick 'Pending verification' and quiet 'Ask me first next time'.
- **Sizes:** max 300 in the thread; full width in Run detail.
- **States:** ask (partner present); waiting (since 11:04 am, expires 9 pm: the Windows notification brings the partner here, R08); taking (primary loading, others disabled); expired ('No answer by 9 pm, so today didn’t count. I’ll ask again on the next job.' with a not-counted tick, no actions); receipt. V2 reaches only its plain ask: `?day=next&end=job` on Always ask.
- **Props:** `job` {app, label, video {title, channel, duration, thumb}, actions [watch | like | comment | subscribe], comment}, `mode` (ask | receipt), `waitingSince`, `expiresAt`, `expired`, `doneAt`, `taking`, `onTake`, `onSkip`, `onStopAsking`, `onChangeMode`. Fixture: `V2Kit.WORKER_JOB`.
- **Motion:** none beyond the Button's loading spinner.
- **Accessibility:** an article labelled by its head; the list is named 'What I’ll do' / 'What I did'; the thumbnail is decorative; every action 36 tall; consequences are words on the controls, never colour alone.
- **Responsive:** single column; buttons stay full width.
- **Do / Don't:** Do show the exact comment before agreement; put the cost on the skip button; keep Automatic a separate, quieter action through the consent. Don't bundle yes with Automatic; don't tell the cost after the tap; don't draw facts as chips.
