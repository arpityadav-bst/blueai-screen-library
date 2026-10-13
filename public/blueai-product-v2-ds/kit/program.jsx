/* BlueAI Product V2 Design System: program progress (section 43).
   StatusTick {status, size, label, reason}
     status pending | verified | notcounted | rejected | late. One tick while pending, two once
     verified (V2's messaging-app model, worker_day_done.jsx:10-14), plus the three failure states
     V2 lacked (R19). label true prints the word, a string replaces it.
   DayBar {days, worker, target, legend, bonusLabel, label}
     days: segment states (verified | pending | rejected | missed | future), or pass worker and
     numbers() derives them. role=progressbar with a spoken summary; the legend says it in words.
   ProgramStrip {worker, onOpenActivity}  the home's progress card: count, Ends Nov 1, DayBar, one
     receipt line, Earnings (one URL). The site's progress tile with the pending state it lacks.
   ProgramSummary {rule, compact, title, triggerClassName, open}  the four program rules, in full or
     behind an info tip (32px trigger; open forces the tip, for review).
   EarningsLink {className}  the one Earnings link (EARNINGS_URL), used by the strip and the card. */
(function () {
  const K = () => window.V2Kit || {};
  const cx = function () { return Array.prototype.filter.call(arguments, Boolean).join(' '); };

  const TICK_WORDS = { pending: 'Pending verification', verified: 'Verified', notcounted: 'Not counted', rejected: 'Not counted', late: 'Still checking' };
  function TickGlyph({ status, size }) {
    const s = size || 14;
    const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
    if (status === 'verified') {
      return <svg width={Math.round(s * 1.4)} height={s} viewBox="0 0 34 24" {...common}><polyline points="18 6 7 17 2 12" /><polyline points="30 6 19 17 15.5 13.5" /></svg>;
    }
    if (status === 'notcounted') return <svg width={s} height={s} viewBox="0 0 24 24" {...common}><line x1="6" y1="12" x2="18" y2="12" /></svg>;
    if (status === 'rejected') return <svg width={s} height={s} viewBox="0 0 24 24" {...common}><line x1="7" y1="7" x2="17" y2="17" /><line x1="17" y1="7" x2="7" y2="17" /></svg>;
    if (status === 'late') return <svg width={s} height={s} viewBox="0 0 24 24" {...common} strokeWidth={2}><circle cx="12" cy="12" r="8.5" /><polyline points="12 7.5 12 12 15 14" /></svg>;
    return <svg width={s} height={s} viewBox="0 0 24 24" {...common}><polyline points="20 6 9 17 4 12" /></svg>;
  }
  function StatusTick({ status, size, label, reason, className }) {
    const st = TICK_WORDS[status] ? status : 'pending';
    const word = typeof label === 'string' ? label : TICK_WORDS[st];
    return (
      <span className={cx('v2-tick', 'v2-tick--' + st, className)}>
        <span className="v2-tick-glyph" role={label ? undefined : 'img'} aria-label={label ? undefined : word} aria-hidden={label ? true : undefined}><TickGlyph status={st} size={size} /></span>
        {label ? <span className="v2-tick-label">{word}</span> : null}
        {reason ? <span className="v2-tick-reason">{reason}</span> : null}
      </span>
    );
  }

  function DayBar({ days, worker, target, legend, bonusLabel, label }) {
    const n = worker ? K().numbers(worker) : null;
    const segs = days || (n ? n.segments : []);
    const total = target || segs.length || 20;
    const c = { verified: 0, pending: 0, rejected: 0, missed: 0 };
    segs.forEach(function (s) { if (c[s] !== undefined) c[s] += 1; });
    const done = c.verified + c.pending;
    const spoken = done + ' of ' + total + ' days' + (c.pending ? ', ' + c.pending + ' pending verification' : '') + (c.rejected ? ', ' + c.rejected + ' not counted' : '');
    return (
      <div className="v2-daybar">
        <div className="v2-daybar-track" role="progressbar" aria-label={label || 'Your 20 days'} aria-valuemin={0} aria-valuemax={total} aria-valuenow={done} aria-valuetext={spoken}>
          {segs.map(function (s, i) { return <span key={i} className={'v2-daybar-seg v2-daybar-seg--' + s} />; })}
        </div>
        {legend === false ? null : (
          <div className="v2-daybar-legend">
            {c.verified ? <StatusTick status="verified" size={12} label={c.verified + ' verified'} /> : null}
            {c.pending ? <StatusTick status="pending" size={12} label={c.pending + ' pending'} /> : null}
            {c.rejected ? <StatusTick status="rejected" size={12} label={c.rejected + ' not counted'} /> : null}
            {c.missed ? <span>{c.missed} {c.missed === 1 ? 'day' : 'days'} out of reach</span> : null}
            {!done && !c.rejected && !c.missed ? <span>No days yet</span> : null}
            {bonusLabel ? <span className="v2-daybar-bonus">{bonusLabel}</span> : null}
          </div>
        )}
      </div>
    );
  }

  // The receipt line under the bar: the one fact that changed since the partner last looked.
  function receipt(w, n) {
    const last = n.last;
    if (n.complete) return { status: 'verified', text: 'All 20 days verified. Cash out on Earnings after ' + n.endsOn + '.' };
    if (!last) return { status: 'notcounted', text: 'No days counted yet.' };
    if (last.status === 'rejected') return { status: 'rejected', text: 'Yesterday’s run wasn’t counted.', danger: true };
    if (last.status === 'pending' || last.status === 'late') return { status: last.status, text: 'Today’s run is pending verification.' };
    if (last.status === 'skipped') return { status: 'notcounted', text: 'Today doesn’t count toward your 20 days.' };
    if (last.status === 'missed') return { status: 'notcounted', text: 'Yesterday had no run.' };
    return { status: 'verified', text: 'Yesterday’s run verified.' };
  }

  // The one Earnings link: underlined ink, blue on hover (the family link), opens the site.
  function EarningsLink({ className }) {
    const I = K().Icon;
    return (
      <a className={cx('v2-w-earnings', className)} href={K().EARNINGS_URL} target="_blank" rel="noopener">
        Earnings{I ? <I name="external" size={16} label="opens in a new tab" /> : null}
      </a>
    );
  }

  function ProgramStrip({ worker, onOpenActivity }) {
    const w = worker || (K().workerFixtures || {}).verified;
    const n = K().numbers(w);
    const r = receipt(w, n);
    const Tip = K().Tooltip;
    return (
      <section className="v2-pstrip" aria-label="Your 20 days">
        <div className="v2-pstrip-head">
          <p className="v2-pstrip-count"><span className="v2-w-figure">{n.done}</span> of {n.target} days</p>
          <span className="v2-pstrip-side">
            <span className="v2-w-meta">Ends {n.endsOn}</span>
            {Tip ? <ProgramSummary compact /> : null}
          </span>
        </div>
        <DayBar days={n.segments} target={n.target} />
        <div className="v2-pstrip-foot">
          <span className={cx('v2-pstrip-receipt', r.danger && 'v2-pstrip-receipt--danger')}>
            <StatusTick status={r.status} size={12} />
            <span>{r.text}</span>
            {r.danger && onOpenActivity ? <button type="button" className="v2-w-btn" onClick={onOpenActivity}>See why</button> : null}
          </span>
          <EarningsLink />
        </div>
      </section>
    );
  }

  // Wording waits on decision D3 (the money model), so no amount appears here.
  function rules(rule) {
    const r = Object.assign({}, K().WORKER_RULE, rule || {});
    return [
      { icon: 'calendar', text: 'Run on ' + r.target + ' days before ' + r.programEnd + '.' },
      { icon: 'check', text: 'A day counts when a job is verified, or when there was no job to take.' },
      { icon: 'check-double', text: 'We check every run within a day. One tick while pending, two once verified.' },
      { icon: 'earnings', text: 'Cash out on Earnings after the period ends.' },
    ];
  }
  function ProgramSummary({ rule, compact, title, triggerClassName, open }) {
    const I = K().Icon;
    const list = (
      <ul className="v2-psummary-list">
        {rules(rule).map(function (x) {
          return <li key={x.icon}>{I ? <I name={x.icon} size={16} /> : null}<span>{x.text}</span></li>;
        })}
      </ul>
    );
    if (compact) {
      const Tip = K().Tooltip;
      const content = <div className="v2-psummary v2-psummary--tip"><p className="v2-psummary-title">{title || 'How your 20 days work'}</p>{list}</div>;
      const trigger = <button type="button" className={cx('v2-w-btn v2-w-btn--icon', triggerClassName)} aria-label={title || 'How your 20 days work'}>{I ? <I name="info" size={16} /> : 'i'}</button>;
      return Tip ? <Tip kind="info" placement="down" open={open} content={content}>{trigger}</Tip> : trigger;
    }
    return (
      <div className="v2-psummary">
        <p className="v2-psummary-title">{title || 'How your 20 days work'}</p>
        {list}
      </div>
    );
  }

  Object.assign(window.V2Kit = window.V2Kit || {}, { StatusTick, DayBar, ProgramStrip, ProgramSummary, EarningsLink, programRules: rules });
})();
