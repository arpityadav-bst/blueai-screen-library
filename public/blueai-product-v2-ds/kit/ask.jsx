/* BlueAI Product V2 Design System: the worker's questions and replies in the thread
   (sections 37, 39, 40).

   AskCard        {step: {title, lead, bullets, question, options: [{id, label, consent,
                  consequence}], hint, expiresAt}, answer, onAnswer(id, option), state, tone}
                  One shape for every question (V2's idea, V2's copy). Yellow only while it waits
                  for you; answered, stopped and expired settle to the neutral surface. What an
                  answer costs sits above the chips and is that chip's description, so it is
                  heard before the tap, not after. tone
                  'neutral' is decision D13's option B (onboarding asks while the partner watches).
                  An option with consent: true turns Automatic on: the caller opens ConsentDialog
                  (section 46) first and answers only after "I agree, turn on". Answering removes
                  the chips, so focus moves to the settled card (an in-place swap, section 09); a
                  dialog opened from a chip returns there too.
   FeedbackThumbs {vote, onVote, reason, onReason, onSubmitOther, thanks}  below placement only.
                  Picking a reason or sending Other hides the reasons; focus goes back to the
                  pressed thumb.
   DependencyCard {app, phase: 'needs'|'installing'|'failed'|'done'|'signedOut', progress, onGet,
                  onCancel, onRetry, onOpen}  the reply in the thread when a run needs BlueStacks
                  or App Player; also the worker's preflight (R13). Installing is the over-10s wait
                  (section 50): it never blocks the window and offers Cancel; failed says so and
                  offers Try again. */
(function () {
  const { useState, useRef, useEffect, useId } = React;
  const K = () => window.V2Kit || {};
  const cx = function () { return Array.prototype.filter.call(arguments, Boolean).join(' '); };

  /* ---------- AskCard ---------- */
  function settledLine(state, step) {
    const D = K().DAY_COPY;
    if (state === 'stopped') return 'The run stopped before you answered.';
    if (state === 'expired' && D) return D.expired(step.expiresAt) + ' ' + D.notCounted;
    return null;
  }

  function AskCard({ step, answer, onAnswer, state, tone, className }) {
    const s = step || {};
    const opts = s.options || [];
    const st = state || (answer === 'stopped' ? 'stopped' : (answer === 'expired' ? 'expired' : (answer ? 'answered' : 'pending')));
    const pending = st === 'pending';
    const quiet = tone === 'neutral';
    const qid = useId();
    const card = useRef(null);
    const P = K();
    const line = settledLine(st, s);
    if (P.useSwapFocus) P.useSwapFocus(card, st);
    return (
      <div className={cx('v2-msg', 'v2-msg--worker', 'v2-ask', 'is-' + st, quiet && 'v2-ask--neutral', className)}>
        <div ref={card} className="v2-ask-card v2-text-body" tabIndex={pending ? undefined : -1} data-v2-anchor={pending ? undefined : ''}>
          {pending ? <span className="v2-sr-only">BlueAI needs your answer. </span> : null}
          {s.title ? <p className="v2-ask-title">{s.title}</p> : null}
          {s.lead ? <p className="v2-ask-text">{s.lead}</p> : null}
          {s.bullets ? <ul className="v2-ask-bullets">{s.bullets.map(function (b) { return <li key={b}>{b}</li>; })}</ul> : null}
          {s.question ? <p className="v2-ask-text" id={qid}>{s.question}</p> : null}
        </div>
        {pending ? opts.map(function (o, i) {
          return o.consequence ? <p key={o.id} id={qid + '-c' + i} className="v2-ask-consequence"><strong>{o.label}:</strong> {o.consequence}</p> : null;
        }) : null}
        {pending && opts.length ? (
          <div className="v2-ask-chips" role="group" aria-labelledby={s.question ? qid : undefined} aria-label={s.question ? undefined : (s.title || 'Answers')}>
            {opts.map(function (o, i) {
              return P.Chip
                ? <P.Chip key={o.id} icon={o.consent ? 'zap' : undefined} aria-describedby={o.consequence ? qid + '-c' + i : undefined}
                    onClick={function () { if (onAnswer) onAnswer(o.id, o); }}>{o.label}</P.Chip>
                : null;
            })}
          </div>
        ) : null}
        {pending && s.hint ? <p className="v2-ask-hint">{s.hint}</p> : null}
        {line ? <p className="v2-ask-hint">{line}</p> : null}
      </div>
    );
  }

  /* ---------- FeedbackThumbs ---------- */
  // V2's reasons (chat_feedback.jsx), curly apostrophes. 'task' is V2's word; the glossary keeps it
  // for paid work, so section 39 flags it for the PM (proposed: 'Didn’t finish the job').
  const REASONS = ['Didn’t complete the task', 'Wrong result', 'Took too long', 'Didn’t understand me', 'Other'];

  function FeedbackThumbs({ vote, onVote, reason, onReason, onSubmitOther, thanks, className }) {
    const [flash, setFlash] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [text, setText] = useState('');
    const [sent, setSent] = useState(false);
    const timer = useRef(null);
    const row = useRef(null);
    const pid = useId();
    const P = K();
    useEffect(function () { return function () { clearTimeout(timer.current); }; }, []);

    function sayThanks() {
      clearTimeout(timer.current);
      setFlash(true);
      timer.current = setTimeout(function () { setFlash(false); }, 2200);
    }
    function cast(dir) {
      const next = vote === dir ? null : dir;
      if (onVote) onVote(next);
      if (next !== 'down' && reason && onReason) onReason(null);
      setHidden(false); setSent(false);
      if (next === 'up') sayThanks(); else { clearTimeout(timer.current); setFlash(false); }
    }
    function pick(r) {
      const next = reason === r ? null : r;
      if (onReason) onReason(next);
      if (next && next !== 'Other') { setHidden(true); sayThanks(); }
    }
    function submit() {
      if (sent) return;
      setSent(true); setHidden(true);
      if (onSubmitOther) onSubmitOther(text.trim());
      sayThanks();
    }
    const showThanks = thanks != null ? thanks : flash;
    const showReasons = vote === 'down' && !hidden;
    const IB = P.IconButton;
    // The reasons left with the chip just pressed: back to the pressed thumb.
    if (P.useSwapFocus) P.useSwapFocus(function () { return row.current && row.current.querySelector('[aria-pressed="true"]'); }, showReasons);

    return (
      <div className={cx('v2-fb', className)}>
        <div className="v2-fb-row" ref={row}>
          {IB ? <IB icon="thumb-up" label="Good result" variant="outlined" aria-pressed={vote === 'up'} onClick={function () { cast('up'); }} /> : null}
          {IB ? <IB icon="thumb-down" label="Bad result" variant="outlined" aria-pressed={vote === 'down'} onClick={function () { cast('down'); }} /> : null}
          <span className="v2-fb-thanks v2-text-caption" role="status">{showThanks ? 'Thanks for the feedback' : ''}</span>
        </div>
        {showReasons ? (
          <div className="v2-fb-reasons">
            <p className="v2-fb-prompt v2-text-caption" id={pid}>What went wrong?</p>
            <div className="v2-fb-chips" role="group" aria-labelledby={pid}>
              {REASONS.map(function (r) {
                return P.Chip ? <P.Chip key={r} selected={reason === r} onClick={function () { pick(r); }}>{r}</P.Chip> : null;
              })}
            </div>
            {reason === 'Other' ? (
              <div className="v2-fb-other">
                {P.TextArea ? (
                  <P.TextArea label="Tell us more" hideLabel size="sm" rows={1} autoGrow maxRows={3}
                    value={text} disabled={sent} placeholder="Provide additional feedback"
                    onChange={function (e) { setText(e && e.target ? e.target.value : e); }} />
                ) : null}
                {IB ? <IB icon="send" label="Submit feedback" size={32} onClick={submit} disabled={sent} /> : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }

  /* ---------- DependencyCard ---------- */
  function DependencyCard({ app, phase, progress, onGet, onCancel, onRetry, onOpen, className }) {
    const P = K();
    const name = app || 'YouTube';
    const NB = P.NoticeBubble;
    if (!NB) return null;
    const cls = cx('v2-dep', className);
    if (phase === 'installing') {
      const pct = Math.max(0, Math.min(100, Math.round(progress || 0)));
      return (
        <NB kind="info" title="Installing BlueStacks" className={cls}
          lines={['You can keep using BlueAI while it installs.']}
          action={(
            <React.Fragment>
              {P.ProgressBar ? <P.ProgressBar value={pct} max={100} size={6} label="Getting ready" valueText={pct + '%'} /> : null}
              {onCancel && P.Button ? <P.Button variant="quiet" size="sm" onClick={onCancel}>Cancel install</P.Button> : null}
            </React.Fragment>
          )} />
      );
    }
    if (phase === 'failed') {
      return (
        <NB kind="fail" className={cls}
          lines={['BlueStacks didn’t finish installing, so today’s run is waiting. Check your connection, then try again.']}
          action={P.Button ? <P.Button variant="primary" size="md" full onClick={onRetry || onGet}>Try again</P.Button> : null} />
      );
    }
    if (phase === 'done') return <NB kind="success" className={cls} lines={['BlueStacks is ready.']} />;
    if (phase === 'signedOut') {
      return (
        <NB kind="info" className={cls}
          lines={['App Player isn’t signed in to ' + name + '. Sign in there, then I’ll pick today’s run back up.']}
          action={P.Button ? <P.Button variant="secondary" size="md" full onClick={onOpen}>Open App Player</P.Button> : null} />
      );
    }
    return (
      <NB kind="info" className={cls}
        lines={['This one runs inside BlueStacks App Player. I drive ' + name + ' there, and BlueStacks isn’t installed on this PC yet.']}
        action={P.Button ? <P.Button variant="primary" size="md" full onClick={onGet}>Get BlueStacks</P.Button> : null} />
    );
  }

  Object.assign(window.V2Kit = window.V2Kit || {}, { AskCard, FeedbackThumbs, DependencyCard, FEEDBACK_REASONS: REASONS });
})();
