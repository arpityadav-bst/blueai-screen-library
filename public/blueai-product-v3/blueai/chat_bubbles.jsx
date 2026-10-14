/* BlueAI: chat message bubbles + the scripted task timelines.
   Split out of chat_product.jsx (2026-08-10) for the 300-line rule. One bubble per message
   state (user · status · warning · needs-BlueStacks lives in needs_bluestacks.jsx · final
   success/fail/needs-input · thinking), plus the two step scripts ChatScreen plays.

   V3 (phase 3): one bubble language, styled in chat.css (the icon box and links are the kit's). Every message sits on the surface with a
   1px line; the user's own is the quiet sunken surface. Tone rides on one icon in the tone's ink,
   and the edge turns only when the run stopped (failed, or waiting on you). Status and thinking
   are progress notes, not bubbles.
   Exposes window.ChatBubbles. */
(function () {
  const { useState } = React;

  /* FinalBubble renders the feedback control, which now lives in chat_feedback.jsx. Forwarded
     lazily so the reference resolves at RENDER time, this file does not care whether it or
     chat_feedback.jsx was parsed first. */
  const FeedbackThumbs = (props) => React.createElement(window.ChatFeedback.FeedbackThumbs, props);

  /* ───────── Helpers ───────── */
  function fmtStamp() { return 'Jun 12, 2026, 11:03 AM'; }

  function richText(text) {
    const urlRe = /(https?:\/\/[^\s]+)/g;
    return text.split('\n').map((line, li) =>
      <p key={li}>
        {line.split(urlRe).map((part, pi) => urlRe.test(part)
          ? <a key={pi} href="#" onClick={(e) => e.preventDefault()} className="v2-link" style={{ wordBreak: 'break-all' }}><span className="v2-link-text">{part}</span></a>
          : <span key={pi}>{part}</span>)}
      </p>);
  }

  /* One 16px tone mark per toned bubble: done (green tick), heads-up and waiting-on-you (the
     attention ink), failed (the danger ink). 24 viewBox, currentColor, round caps. */
  const TONE_PATHS = {
    success: <><circle cx="12" cy="12" r="9" /><polyline points="8 12.5 11 15.5 16 9.5" /></>,
    warning: <><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>,
    input: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.4" /><line x1="12" y1="17" x2="12.01" y2="17" /></>,
    fail: <><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12.5" /><line x1="12" y1="16" x2="12.01" y2="16" /></>
  };
  const TONE_INK = { success: 'v3-tone-success', warning: 'v3-tone-attention', input: 'v3-tone-attention', fail: 'v3-tone-danger' };
  function ToneIcon({ tone }) {
    return (
      <svg className={'v2-icon v3-toned-icon ' + TONE_INK[tone]} viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{TONE_PATHS[tone]}</svg>);
  }

  /* ───────── Bubbles ───────── */
  function UserBubble({ content }) {
    return (
      <div className="v2-anim-pop-in v3-msg v3-msg--user">
        <div className="v3-bubble v3-bubble--user">
          <p>{content}</p>
          <p className="v3-bubble-stamp">{fmtStamp()}</p>
        </div>
      </div>);
  }

  // A progress line: a note in the run's margin, not a bubble.
  function StatusBubble({ content }) {
    return <p className="v2-anim-pop-in v3-note-line">{content}</p>;
  }

  /* Warning = a heads-up shown mid-task that does NOT block progress (distinct from the
     "human input required" final state, which halts until the user answers). A plain bubble
     with the attention mark: the task keeps going, so the edge stays neutral.

     `title` is optional: the credits warning wants a bold lead ("Out of credits") over its body,
     while the older mid-task warning is one sentence and wants no heading.

     `content` accepts an ARRAY as well as a string. This copy is written as short declaratives,
     and one per line reads as a list rather than a paragraph wrapping wherever the bubble cap
     falls. An array rather than splitting a string on full stops, so the break points are the
     author's decision and stay visible in the source. String callers are unaffected. */
  function WarningBubble({ title, content }) {
    const body = Array.isArray(content) ? content : [content];
    return (
      <div className="v2-anim-pop-in v3-msg">
        <div className="v3-bubble v3-toned">
          <ToneIcon tone="warning" />
          <div className="v3-toned-body">
            {title && <p className="v3-bubble-title">{title}</p>}
            <p className="v3-bubble-lines">{body.map((line, k) => <span key={k}>{line}</span>)}</p>
          </div>
        </div>
      </div>);
  }

  /* The final message of a run. needsInput is the LIVE product's "human input required" state
     (PM-confirmed name); V3 draws it with the Target attention tokens on the one bubble language
     rather than the live yellow fill. */
  const FINAL = {
    success:    { icon: 'success', edge: '' },
    fail:       { icon: 'fail', edge: ' v3-bubble--fail' },
    needsInput: { icon: 'input', edge: ' v3-bubble--input' }
  };

  function FinalBubble({ msg, feedback }) {
    const S = FINAL[msg.tone];
    const fbPlacement = feedback && feedback.placement;
    const fb = (placement) =>
      <FeedbackThumbs placement={placement}
        withLabel={feedback.withLabel} vote={feedback.vote} onVote={feedback.onVote}
        reason={feedback.reason} onReason={feedback.onReason} />;
    return (
      <div className="v2-anim-pop-in v3-msg">
        <div className={'v3-bubble' + S.edge}>
          <div className="v3-toned">
            <ToneIcon tone={S.icon} />
            <div className="v3-toned-body v3-rich">{richText(msg.content)}</div>
          </div>
          {fbPlacement === 'stamp' && fb('stamp')}
          {fbPlacement === 'inside' && fb('inside')}
        </div>
        {fbPlacement === 'below' && fb('below')}
      </div>);
  }

  // Working: three progress dots (the blue is progress) and a muted note.
  function ThinkingBubble() {
    return (
      <div className="v2-anim-pop-in v3-working" role="status">
        <span className="v3-working-dots" aria-hidden="true"><span /><span /><span /></span>
        <span className="v2-text-meta">Working on it…</span>
      </div>);
  }

  /* Generic task script played for any prompt the user picks or types, always ends in success.
     Warning/error bubbles are shown via the "Chat states" dev-preview toggle (ChatStatesPreview
     below), not by scripting a real task to fail. */
  const successContent = (text) =>
    'Done. I completed your task: “' + text + '”. Let me know if you’d like me to do anything else.';

  function makeTaskSteps(text) {
    return [
      { role: 'user', content: text, d: 250 },
      { role: 'status', content: 'Got it. Starting on your task…', d: 900 },
      { role: 'thinking', d: 1200 },
      { role: 'status', content: 'Opening the required app and navigating to the right screen…', d: 1100 },
      { role: 'status', content: 'Performing the actions step by step…', d: 1100 },
      { role: 'status', content: 'Verifying the result…', d: 1000 },
      { role: 'final', tone: 'success', content: successContent(text), d: 900 }];
  }

  /* Picked up where the task left off, once BlueStacks has just been installed. No user bubble,
     the request is already in the conversation, above the "needs BlueStacks" bubble.

     The first three delays are DERIVED from NeedsBluestacks.BS_BOOT, which is the same constant
     the scene uses to swap the BlueStacks window's screenshot. That coupling is the point: each
     line lands just AFTER the frame it describes, so the chat narrates what the window is showing
     rather than announcing it early. Hard-coding these would let the two drift apart silently. */
  function makeResumeSteps(text, app) {
    const B = window.NeedsBluestacks.BS_BOOT;
    // Only claim a Play-Store listing when the scene can actually show that app's listing.
    const hasListing = !!window.NeedsBluestacks.PLAY_FRAME[app];
    return [
      { role: 'status', content: 'BlueStacks is starting…', d: 900 },
      { role: 'status', content: hasListing ? 'BlueStacks is ready. Opening the Play Store…' : 'BlueStacks is ready.', d: B.loading - 900 + 200 },
      { role: 'status', content: hasListing ? 'Found ' + app + '. Opening it…' : 'Opening ' + app + '…', d: B.home + 200 },
      { role: 'thinking', d: 1000 },
      { role: 'status', content: 'Performing the actions step by step…', d: 1100 },
      { role: 'status', content: 'Verifying the result…', d: 1000 },
      { role: 'final', tone: 'success', content: successContent(text), d: 900 }];
  }

  /* Scheduled BlueAI-worker run that dies mid-job because credits ran out (designer, 2026-09-09).
     A scheduled run happens in its OWN chat with no user message, that's why this script opens on
     a status line instead of a 'user' bubble, unlike makeTaskSteps/makeResumeSteps.

     Reuses the EXISTING bubble roles: 'warning' -> WarningBubble, 'final'+tone:'fail' -> the
     failed FinalBubble. The PM's mock showed these two states plus a placeholder change; it was a
     COPY spec, not new UI, so nothing new is drawn here, only the strings are new.

     The warning lands BEFORE the failure on purpose: the run is what noticed the balance hit zero,
     so it announces the condition first and only then reports the job it couldn't finish. Flipped,
     the error would read as the cause rather than the consequence. */
  function makeScheduledOocSteps() {
    return [
      { role: 'status', content: 'Scheduled run started: finding a job that fits you…', d: 900 },
      { role: 'thinking', d: 1200 },
      { role: 'status', content: 'Found one. Opening the app and getting started…', d: 1100 },
      { role: 'status', content: 'Running the job step by step…', d: 1100 },
      /* Designer's final copy (2026-09-09). Both messages now close the same way, and that
         is the point: V2 has no top-up, so "refreshed tomorrow" is the only resolution the
         product can honour. The previous wording offered "top up now", advice V2 cannot
         deliver on. The warning takes the bold title slot WarningBubble just grew. */
      { role: 'warning', title: 'Out of credits', content: ['You’ve used all of today’s AI credits.', 'Credits will be refreshed tomorrow.'], d: 1100 },
      { role: 'final', tone: 'fail', content: 'Not enough credits for this job. Credits will be refreshed tomorrow.', d: 900 }];
  }

  /* Dev-preview only: one example bubble per chat message state, rendered instantly (no
     scripted delay) so success / warning / human-input-required / error are all visible side
     by side without having to type + send a message per state. */
  function ChatStatesPreview() {
    const [votes, setVotes] = useState({});
    const [reasons, setReasons] = useState({});
    const examples = [
      { key: 'success', user: 'Play Whiteout Survival for 10 min', kind: 'final', tone: 'success', content: 'Done. I completed your task: “Play Whiteout Survival for 10 min”. Let me know if you’d like me to do anything else.', hasFeedback: true },
      { key: 'warning', user: 'Farm resources on the world map', kind: 'warning', content: 'Heads up: this may use more AI credits than usual since it involves repeated actions.' },
      { key: 'needsInput', user: 'Set up a task that runs automatically every day at 6 AM', kind: 'final', tone: 'needsInput', content: 'I need a bit more information to continue with “Set up a task that runs automatically every day at 6 AM”. Could you tell me which app or game instance to use?' },
      { key: 'fail', user: 'Collect bonus coins in Disney Solitaire game', kind: 'final', tone: 'fail', content: 'I wasn’t able to complete “Collect bonus coins in Disney Solitaire game”. The app closed unexpectedly partway through. You can try again or rephrase the request.' }
    ];
    return (
      <div style={{ marginTop: 'var(--v2-space-1)' }}>
        <p className="v2-text-eyebrow" style={{ marginBottom: 'var(--v2-space-3)' }}>Chat states preview</p>
        {examples.map((ex) => (
          <div key={ex.key} style={{ marginBottom: 'var(--v2-space-4)' }}>
            <UserBubble content={ex.user} />
            {ex.kind === 'warning'
              ? <WarningBubble content={ex.content} />
              : <FinalBubble msg={{ tone: ex.tone, content: ex.content }} feedback={ex.hasFeedback ? {
                  placement: 'below', withLabel: false,
                  vote: votes[ex.key] || null, onVote: (v) => setVotes((p) => ({ ...p, [ex.key]: v })),
                  reason: reasons[ex.key] || null, onReason: (r) => setReasons((p) => ({ ...p, [ex.key]: r }))
                } : null} />}
          </div>))}
      </div>);
  }

  window.ChatBubbles = {
    UserBubble, StatusBubble, WarningBubble, FinalBubble, ThinkingBubble, ToneIcon,
    ChatStatesPreview, makeTaskSteps, makeResumeSteps, makeScheduledOocSteps
  };
})();
