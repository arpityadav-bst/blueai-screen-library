/* BlueAI — chat message bubbles + the scripted task timelines.
   Split out of chat_product.jsx (2026-08-10) for the 300-line rule. One bubble per message
   state (user · status · warning · needs-BlueStacks lives in needs_bluestacks.jsx · final
   success/fail/needs-input · thinking), plus the two step scripts ChatScreen plays.
   Exposes window.ChatBubbles. */
(function () {
  const { useState, useRef, useEffect } = React;

  /* FinalBubble renders the feedback control, which now lives in chat_feedback.jsx. Forwarded
     lazily so the JSX below is untouched and the reference resolves at RENDER time — this file
     does not care whether it or chat_feedback.jsx was parsed first. */
  const FeedbackThumbs = (props) => React.createElement(window.ChatFeedback.FeedbackThumbs, props);

  /* ───────── Helpers ───────── */
  function fmtStamp() { return 'Jun 12, 2026, 11:03 AM'; }

  function richText(text, linkColor) {
    const urlRe = /(https?:\/\/[^\s]+)/g;
    return text.split('\n').map((line, li) =>
      <p key={li} style={{ margin: li === 0 ? 0 : '8px 0 0', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {line.split(urlRe).map((part, pi) => urlRe.test(part)
          ? <a key={pi} href="#" onClick={(e) => e.preventDefault()} style={{ color: linkColor, textDecoration: 'underline', wordBreak: 'break-all' }}>{part}</a>
          : <span key={pi}>{part}</span>)}
      </p>);
  }
  /* ───────── Bubbles (from ChatView Feedback) ───────── */
  function UserBubble({ content }) {
    return (
      <div className="ba-msg-in" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <div style={{ maxWidth: 290, background: 'linear-gradient(135deg,#5158ee,#7b4cff)', borderRadius: 16, padding: '11px 14px 8px', boxShadow: '0 4px 14px rgba(99,102,241,0.30)' }}>
          <p style={{ fontSize: 13.5, lineHeight: 1.45, color: 'white', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{content}</p>
          <p style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.75)', marginTop: 6 }}>{fmtStamp()}</p>
        </div>
      </div>);
  }

  function StatusBubble({ content }) {
    return (
      <div className="ba-msg-in" style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 10 }}>
        <div style={{ maxWidth: 290, background: '#f1f5f9', border: '1px solid #e8edf3', borderRadius: 16, padding: '10px 13px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <p style={{ fontSize: 13, lineHeight: 1.45, color: '#475569' }}>{content}</p>
        </div>
      </div>);
  }

  /* Warning = a heads-up shown mid-task that does NOT block progress (distinct from the
     amber "human input required" final state, which halts until the user answers). Styled
     like a status bubble (task keeps going) but orange-tinted with a caution icon. */
  function WarningIcon({ size = 14, color = 'currentColor' }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>);
  }

  function WarningBubble({ content }) {
    return (
      <div className="ba-msg-in" style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 10 }}>
        <div style={{ maxWidth: 290, display: 'flex', alignItems: 'flex-start', gap: 8, background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 16, padding: '10px 13px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <WarningIcon size={15} color="#c2410c" />
          <p style={{ fontSize: 13, lineHeight: 1.45, color: '#9a3412' }}>{content}</p>
        </div>
      </div>);
  }

  /* NOTE: this is the LIVE product's "human input required" state (PM-confirmed name/colour —
     do not change), not a generic warning. See WarningBubble below for the actual Warning tone. */
  const FINAL_STYLES = {
    success:    { bg: '#d9fbe4', border: '#d9fbe4', text: '#1f2937', stamp: '#4ade80', link: '#1f2937' },
    fail:       { bg: '#fdecec', border: '#f8d7d7', text: '#991b1b', stamp: '#e8a0a0', link: '#991b1b' },
    needsInput: { bg: '#fdf6cf', border: '#f3e8a8', text: '#8a6116', stamp: '#c09a3e', link: '#8a6116' }
  };

  function FinalBubble({ msg, feedback }) {
    const S = FINAL_STYLES[msg.tone];
    const fbPlacement = feedback && feedback.placement;
    const toneKey = msg.tone === 'fail' ? 'fail' : 'success';
    return (
      <div className="ba-msg-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ maxWidth: 310, background: S.bg, border: '1px solid ' + S.border, borderRadius: 16, padding: '12px 14px 10px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 13.5, lineHeight: 1.5, color: S.text }}>{richText(msg.content, S.link)}</div>
          {fbPlacement === 'stamp' &&
            <FeedbackThumbs tone={toneKey} placement="stamp"
              withLabel={feedback.withLabel} vote={feedback.vote} onVote={feedback.onVote}
              reason={feedback.reason} onReason={feedback.onReason} />}
          {fbPlacement === 'inside' &&
            <FeedbackThumbs tone={toneKey} placement="inside"
              withLabel={feedback.withLabel} vote={feedback.vote} onVote={feedback.onVote}
              reason={feedback.reason} onReason={feedback.onReason} />}
        </div>
        {fbPlacement === 'below' &&
          <FeedbackThumbs tone={toneKey} placement="below"
            withLabel={feedback.withLabel} vote={feedback.vote} onVote={feedback.onVote}
            reason={feedback.reason} onReason={feedback.onReason} />}
      </div>);
  }

  function ThinkingBubble() {
    return (
      <div className="ba-msg-in" style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 10 }}>
        <div style={{ background: '#f1f5f9', border: '1px solid #e8edf3', borderRadius: 16, padding: '12px 16px 9px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', gap: 5, marginBottom: 7 }}>
            {[0, 1, 2].map((i) =>
              <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#818cf8', display: 'inline-block', animation: 'ba-pulse 1.2s ease-in-out infinite', animationDelay: (i * 0.18) + 's' }}></span>)}
          </div>
          <p style={{ fontSize: 12, color: '#94a3b8' }}>Working on it…</p>
        </div>
      </div>);
  }

  /* Generic task script played for any prompt the user picks or types — always ends in success.
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

  /* Picked up where the task left off, once BlueStacks has just been installed. No user bubble —
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

  /* Dev-preview only: one example bubble per chat message state, rendered instantly (no
     scripted delay) so success / warning / human-input-required / error are all visible side
     by side without having to type + send a message per state. */
  function ChatStatesPreview() {
    const [votes, setVotes] = useState({});
    const [reasons, setReasons] = useState({});
    const examples = [
      { key: 'success', user: 'Play Whiteout Survival for 10 min', kind: 'final', tone: 'success', content: 'Done. I completed your task: “Play Whiteout Survival for 10 min”. Let me know if you’d like me to do anything else.', hasFeedback: true },
      { key: 'warning', user: 'Farm resources on the world map', kind: 'warning', content: 'Heads up — this may use more AI credits than usual since it involves repeated actions.' },
      { key: 'needsInput', user: 'Set up a task that runs automatically every day at 6 AM', kind: 'final', tone: 'needsInput', content: 'I need a bit more information to continue with “Set up a task that runs automatically every day at 6 AM”. Could you tell me which app or game instance to use?' },
      { key: 'fail', user: 'Collect bonus coins in Disney Solitaire game', kind: 'final', tone: 'fail', content: 'I wasn’t able to complete “Collect bonus coins in Disney Solitaire game” — the app closed unexpectedly partway through. You can try again or rephrase the request.' }
    ];
    return (
      <div style={{ marginTop: 4 }}>
        <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', color: '#94a3b8', marginBottom: 10 }}>CHAT STATES PREVIEW</p>
        {examples.map((ex) => (
          <div key={ex.key} style={{ marginBottom: 16 }}>
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
    UserBubble, StatusBubble, WarningBubble, FinalBubble, ThinkingBubble,
    ChatStatesPreview, makeTaskSteps, makeResumeSteps
  };
})();
