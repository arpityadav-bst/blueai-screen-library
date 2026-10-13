/* BlueAI Product V2 Design System: out of credits (section 48).

   V2 stops a send at zero with a popup (byok.jsx:66, opened from Send). The system cannot reach that
   moment: the composer locks at zero and says so before anyone types (section 38), so there is no
   dialog. Two zero surfaces remain, both reading one set of words:

   OutOfCreditsNotice  {variant: 'composer' | 'run', refillAt?, now?, dayStatus?, className}
       composer: the one line above the composer, shown before anyone types.
       run: the closing line of a run that stopped for credits (RunCard's 'nocredits' end). It sits
       inside the thread's role=log, which announces it once; the time is the fixed clock, never
       a ticking countdown, so nothing is re-read every minute.
   dayStatus           'covered' | 'waiting' | 'stopped': what short credits mean for today's day,
       from the Worker record (V2Kit.creditsDay, section 41). Every zero moment states it.
   OOC_COPY            the strings, so screens, WorkerCard and RunCard say exactly the same thing.
       Proposed copy, built around the daily run, not a count of jobs. */
(function () {
  const cx = function () { return Array.prototype.filter.call(arguments, Boolean).join(' '); };

  const COPY = {
    // Proposed copy: what short credits mean for today's day (R14, decision D6). 'waiting' follows
    // the refill time; 'stopped' holds whether or not the run had started.
    day: {
      covered: 'Today’s run isn’t affected.',
      waiting: 'Today’s run starts once they’re back, so today can still count.',
      stopped: 'Today won’t count toward your 20 days.',
    },
    until: 'Out of AI credits until',
    refreshAt: 'AI credits refresh at',
  };

  function kit() { return window.V2Kit; }
  // kit/credits.jsx owns the clock; refillAt is the Worker record's timestamp (section 41).
  function clock(refillAt, now) {
    const T = kit().creditsTime;
    return T.formatClock(refillAt != null ? refillAt : T.nextRefill(now), now);
  }

  function OutOfCreditsNotice({ variant, refillAt, now, dayStatus, className }) {
    const K = kit();
    const at = clock(refillAt, now);
    if (variant === 'run') {
      return (
        <div className={cx('v2-ooc-note', 'v2-ooc-note--run', className)}>
          <span className="v2-ooc-note-icon v2-ooc-note-icon--danger"><K.Icon name="x-circle" size={16} /></span>
          <div className="v2-ooc-note-text">
            <p className="v2-ooc-note-title">{COPY.day[dayStatus || 'stopped']}</p>
            <p className="v2-ooc-note-meta v2-text-meta">{COPY.refreshAt} {at}.</p>
          </div>
        </div>
      );
    }
    const line = <span>{COPY.until} <strong>{at}</strong>.{dayStatus && COPY.day[dayStatus] ? ' ' + COPY.day[dayStatus] : ''}</span>;
    // The composer's own notice slot (section 38), so every notice there looks the same.
    return <K.ComposerNotice tone="neutral" icon="clock" className={className}>{line}</K.ComposerNotice>;
  }

  Object.assign(window.V2Kit = window.V2Kit || {}, { OutOfCreditsNotice, OOC_COPY: COPY });
})();
