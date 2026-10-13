/* BlueAI Product V2 Design System: out of credits (section 48).

   OutOfCreditsDialog  {open, preview?, onClose, refillAt?, now?, dayStatus?, grant, className}
       The zero-balance stop, on the one Dialog (V2Kit.Dialog task, sm: role, Esc, focus in and
       back). V2's copy is kept word for word (picked Option B: the countdown plus "what are
       credits"). When the countdown reaches zero while it is open it turns into the refreshed
       state. preview renders it open in place without taking focus (guide specimens only).
   OutOfCreditsNotice  {variant: 'composer' | 'run', refillAt?, now?, dayStatus?, className}
       composer: the one line above the composer, shown before anyone types.
       run: the closing line of a run that stopped for credits (RunCard's 'nocredits' end).
   dayStatus           'covered' | 'waiting' | 'stopped': what zero means for today's day. It is
       read from the Worker record (section 41); every zero moment states it.
   OOC_COPY            the strings, so screens and RunCard say exactly the same thing. */
(function () {
  const cx = function () { return Array.prototype.filter.call(arguments, Boolean).join(' '); };
  const FAQ_URL = 'https://bluestacks.ai/getting-started#ai-credits';

  const COPY = {
    title: 'Out of credits',
    used: 'You’ve used all of today’s AI credits.',
    refreshIn: 'Credits will be refreshed in',
    gotIt: 'Got it',
    why: 'What are AI credits?',
    explain: 'BlueAI runs on credits. Every job and chat uses some. You get limited credits each day, enough for 4 to 5 jobs.',
    learnMore: 'Learn more',
    refreshedTitle: 'New credits are here',
    refreshedLine: function (g) { return 'You have ' + g + ' AI credits for today.'; },
    // Proposed copy: what zero means for today's day (R14, decision D6).
    day: {
      covered: 'Today’s run isn’t affected.',
      waiting: 'Today’s run can’t start until then.',
      stopped: 'Today’s run stopped, so today won’t count.',
    },
    until: 'Out of AI credits until',
    refreshAt: 'AI credits refresh at',
  };

  function kit() { return window.V2Kit || {}; }
  function Ic({ name, size }) {
    const K = kit();
    if (name === 'credits' && !K.Icon) return <span className="v2-credits-glyph v2-credits-glyph--lg" aria-hidden="true" />;
    return K.Icon ? <K.Icon name={name} size={size || 16} /> : null;
  }
  function countdown(refillAt, now) {
    const K = kit();
    // Read lazily: kit/credits.jsx owns the clock. The fallback only keeps a specimen readable.
    return K.useCountdown ? K.useCountdown(refillAt, { now: now }) : { left: '', clock: '', done: false };
  }

  /* "What are AI credits?": a labelled trigger for the info tip (V2's bare (i) had no visible
     name). Uses V2Kit.Tooltip kind 'info'; without it the trigger still names the concept. */
  function Why() {
    const K = kit();
    const trigger = (
      <button type="button" className="v2-ooc-why">
        <Ic name="info" size={16} /><span>{COPY.why}</span>
      </button>
    );
    if (!K.Tooltip) return trigger;
    const more = K.Link
      ? <K.Link href={FAQ_URL} external>{COPY.learnMore}</K.Link>
      : <a href={FAQ_URL} target="_blank" rel="noopener noreferrer">{COPY.learnMore}</a>;
    return <K.Tooltip kind="info" placement="up" content={<span>{COPY.explain} {more}</span>}>{trigger}</K.Tooltip>;
  }

  function Body({ t, dayStatus, refreshed, grant, withButton, onClose }) {
    const K = kit();
    const g = (grant || 0).toLocaleString('en-US');
    return (
      <div className={cx('v2-ooc', refreshed && 'v2-ooc--refreshed')}>
        <div className="v2-ooc-hero">
          <Ic name="credits" size={24} />
          <span className="v2-ooc-num">{refreshed ? g : '0'}</span>
        </div>
        {refreshed ? (
          <p className="v2-ooc-lines"><span>{COPY.refreshedLine(g)}</span></p>
        ) : (
          <p className="v2-ooc-lines">
            <span>{COPY.used}</span>
            <span>{COPY.refreshIn} <strong className="v2-num">{t.left}</strong>.</span>
          </p>
        )}
        {!refreshed && dayStatus && COPY.day[dayStatus] ? <p className="v2-ooc-day">{COPY.day[dayStatus]}</p> : null}
        {!refreshed ? <Why /> : null}
        {withButton ? (
          <div className="v2-ooc-actions">
            {K.Button ? <K.Button variant="primary" size="lg" full onClick={onClose}>{COPY.gotIt}</K.Button>
              : <button type="button" className="v2-ooc-fallback-btn" onClick={onClose}>{COPY.gotIt}</button>}
          </div>
        ) : null}
      </div>
    );
  }

  /* On V2Kit.Dialog (task variant, sm): title in the header with the close button, Esc and the
     scrim close it, focus goes to Got it and comes back. preview is the Dialog's own in-place mode
     for specimens. Without the Dialog loaded it draws the same surface in place. */
  function OutOfCreditsDialog({ open, preview, onClose, refillAt, now, dayStatus, grant, className }) {
    const K = kit();
    const t = countdown(refillAt, now);
    const refreshed = refillAt != null && t.done;
    const title = refreshed ? COPY.refreshedTitle : COPY.title;
    if (!K.Dialog) {
      if (!open && !preview) return null;
      return (
        <section className={cx('v2-ooc-static', className)} role="group" aria-label={title}>
          <h2 className="v2-ooc-static-title">{title}</h2>
          <Body t={t} dayStatus={dayStatus} refreshed={refreshed} grant={grant} withButton onClose={onClose} />
        </section>
      );
    }
    return (
      <K.Dialog open={!!(open || preview)} preview={preview} onClose={onClose} title={title} variant="task" size="sm"
        initialFocus=".v2-ov-actions button" className={className}
        actions={[{ label: COPY.gotIt, onClick: onClose, variant: 'primary' }]}>
        <Body t={t} dayStatus={dayStatus} refreshed={refreshed} grant={grant} />
      </K.Dialog>
    );
  }

  function OutOfCreditsNotice({ variant, refillAt, now, dayStatus, className }) {
    const t = countdown(refillAt, now);
    if (variant === 'run') {
      return (
        <div className={cx('v2-ooc-note', 'v2-ooc-note--run', className)} role="status">
          <span className="v2-ooc-note-icon v2-ooc-note-icon--danger"><Ic name="x-circle" size={16} /></span>
          <div className="v2-ooc-note-text">
            <p className="v2-ooc-note-title">{COPY.day[dayStatus || 'stopped']}</p>
            <p className="v2-ooc-note-meta">{COPY.refreshAt} {t.clock}, in <span className="v2-num">{t.left}</span>.</p>
          </div>
        </div>
      );
    }
    const K = kit();
    const line = <span>{COPY.until} <strong>{t.clock}</strong>.{dayStatus && COPY.day[dayStatus] ? ' ' + COPY.day[dayStatus] : ''}</span>;
    // The composer's own notice slot (section 38) when it is loaded, so every notice there looks the same.
    if (K.ComposerNotice) return <K.ComposerNotice tone="neutral" icon="clock" className={className}>{line}</K.ComposerNotice>;
    return (
      <div className={cx('v2-ooc-note', className)} role="status">
        <span className="v2-ooc-note-icon"><Ic name="clock" size={16} /></span>
        <p className="v2-ooc-note-text">{line}</p>
      </div>
    );
  }

  Object.assign(window.V2Kit = window.V2Kit || {}, { OutOfCreditsDialog, OutOfCreditsNotice, OOC_COPY: COPY });
})();
