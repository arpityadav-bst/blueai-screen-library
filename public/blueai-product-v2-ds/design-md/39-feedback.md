## 39 Feedback

**Status:** Changed from V2.
**Why:** V2 ships three placements and uses one (chat_product.jsx:153); its buttons carry shadows and fade the unvoted thumb to 0.55 (chat_feedback.jsx:171, 176); the label is 2.56:1 (197); selected reasons are a third chip look (#334155, line 77). The system keeps the behaviour and the copy, on shared parts.

### FeedbackThumbs (Changed from V2)
- **Purpose:** Thumbs up or down under a finished outcome; a thumbs down asks what went wrong.
- **Anatomy:** Row: two IconButtons 32 (thumb-up "Good result", thumb-down "Bad result"), gap 8, then "Thanks for the feedback" 12/500 ink-3. On thumbs down: "What went wrong?" 12/500 ink-3, Chip row (gap 6) with the five V2 reasons; "Other" opens a TextArea sm ("Provide additional feedback") and a send IconButton "Submit feedback".
- **Variants:** Below placement only (inside and stamp are dropped).
- **Sizes:** 32 buttons; reasons wrap at 300.
- **States:** Idle; up (Thanks for 2200ms); down (reasons); reason picked (chips close, Thanks); Other with text and submit. V2: Preview panel, Chat states On, first example.
- **Props:** `FeedbackThumbs {vote, onVote, reason, onReason, onSubmitOther(text), thanks, className}`; under an outcome via NoticeBubble `feedback` or RunCard `feedback`.
- **Motion:** None beyond the shared control transitions.
- **Accessibility:** Buttons expose aria-pressed; thanks is a role=status line; reasons are a group labelled by the prompt; nothing fades below 4.5:1.
- **Responsive:** Chips wrap.
- **Copy:** Quoted exactly from chat_feedback.jsx: "Good result", "Bad result", "Thanks for the feedback", "What went wrong?", "Didn't complete the task", "Wrong result", "Took too long", "Didn't understand me", "Other", "Provide additional feedback", "Submit feedback".
- **Decision:** V2 offers it on successful outcomes only (PM config, chat_product.jsx:150). Offering it on failed jobs, where a partner most wants to report a problem, is a PM call (decision D18, section 73).
- **Do / Don't:** Do keep both thumbs readable after a vote. Don't invent a new chip look for reasons.
