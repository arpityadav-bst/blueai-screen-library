/* BlueAI Product V2 Design System: program progress (section 43).
   StatusTick {status, size, label, reason}
     status pending | verified | notcounted | rejected | late. One tick while pending, two once
     verified (V2's messaging-app model, worker_day_done.jsx:10-14), plus the three failure states
     V2 lacked (R19). label true prints the word, a string replaces it.
   DayBar {days, worker, target, legend, bonusLabel, label}
     days: segment states (verified | pending | rejected | missed | future), or pass worker and
     numbers() derives them. role=progressbar with a spoken summary; the legend says it in words.
   ProgramStrip {worker, onOpenActivity, receipt}  the home's progress card: count, Ends Nov 1, DayBar,
     one receipt line, Earnings (one URL). The site's progress tile with the pending state it lacks.
     receipt false (default true) drops the receipt line and keeps Earnings alone in the foot, for a
     screen where the WorkerCard already says today's status (Home).
     The receipt names the real day of the last ledger row against today.date ('Yesterday’s run
     verified.', 'The Oct 10 run is still being checked.'), never a day picked from its status.
   ProgramSummary {rule, compact, title, triggerClassName, open}  the five program rules, in full or
     behind the Tooltip's own (i) trigger (32px; triggerClassName forces its state and open forces
     the tip, for review).
   programRules(rule)  [{id days | counts | ticks | cashout | minimum, icon, text}]: the one place a
     rule is written. Run detail, Activity and DayDone read the tick rule from it (id 'ticks').
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
  // Proposed copy except 'Yesterday’s run verified.' and the skipped line (V2).
  function receipt(w, n) {
    const last = n.last;
    if (n.complete) return { status: 'verified', text: 'All ' + n.target + ' days verified. Cash out on Earnings after ' + n.endsOn + '.' };
    if (!last) return { status: 'notcounted', text: 'No days counted yet.' };
    if (K().workerState(w) === 'ended') return { status: 'notcounted', text: 'Your ' + n.target + ' days ended on ' + n.endsOn + '.' };
    const gap = K().dayGap(last.date, (w.today || {}).date);
    const run = gap === 0 ? 'Today’s run' : gap === 1 ? 'Yesterday’s run' : 'The ' + last.date + ' run';
    if (last.status === 'rejected') return { status: 'rejected', text: run + ' wasn’t counted.', danger: true };
    if (last.status === 'late') return { status: 'late', text: run + ' is still being checked.' };
    if (last.status === 'pending') return { status: 'pending', text: run + ' is pending verification.' };
    if (last.status === 'notcounted') {
      if (last.outcome === 'norun') return { status: 'notcounted', text: (gap === 1 ? 'Yesterday' : gap === 0 ? 'Today' : last.date) + ' had no run.' };
      if (gap === 0) return { status: 'notcounted', text: 'Today doesn’t count toward your 20 days.' };
      return { status: 'notcounted', text: run + ' didn’t count.' };
    }
    return { status: 'verified', text: run + ' verified.' };
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

  function ProgramStrip({ worker, onOpenActivity, receipt: showReceipt }) {
    const P = K();
    const w = worker || P.workerFixtures.verified;
    const n = P.numbers(w);
    const r = showReceipt === false ? null : receipt(w, n);
    return (
      <section className="v2-pstrip" aria-label="Your 20 days">
        <div className="v2-pstrip-head">
          <p className="v2-pstrip-count"><span className="v2-w-figure">{n.done}</span> of {n.target} days</p>
          <span className="v2-pstrip-side">
            <span className="v2-w-meta">Ends {n.endsOn}</span>
            <ProgramSummary compact />
          </span>
        </div>
        <DayBar days={n.segments} target={n.target} />
        <div className="v2-pstrip-foot">
          {r ? (
            <span className={cx('v2-pstrip-receipt', r.danger && 'v2-pstrip-receipt--danger')}>
              <StatusTick status={r.status} size={12} />
              <span>{r.text}</span>
              {r.danger && onOpenActivity ? <P.Button variant="quiet" size="sm" onClick={onOpenActivity}>See why</P.Button> : null}
            </span>
          ) : null}
          <EarningsLink />
        </div>
      </section>
    );
  }

  // Proposed copy built from V2's rule note (worker_day_done.jsx:5-7).
  // No rate or bonus until D3; the $10 cash-out minimum is in both options (section 43).
  function rules(rule) {
    const r = Object.assign({}, K().WORKER_RULE, rule || {});
    return [
      { id: 'days', icon: 'calendar', text: 'Run on ' + r.target + ' days before ' + r.programEnd + '.' },
      { id: 'counts', icon: 'check', text: 'A day counts when a job is verified, or when there was no job to take.' },
      { id: 'ticks', icon: 'check-double', text: 'We check every run within a day. One tick while pending, two once verified.' },
      { id: 'cashout', icon: 'earnings', text: 'Cash out on Earnings after the period ends.' },
      { id: 'minimum', icon: 'lock', text: 'You need $' + r.cashOutMin + ' to cash out; a smaller balance carries over to the next period.' },
    ];
  }
  function ProgramSummary({ rule, compact, title, triggerClassName, open }) {
    const P = K();
    const name = title || 'How your 20 days work';
    const list = (
      <ul className="v2-psummary-list">
        {rules(rule).map(function (x) { return <li key={x.id}><P.Icon name={x.icon} size={16} /><span>{x.text}</span></li>; })}
      </ul>
    );
    if (compact) {
      const content = <div className="v2-psummary v2-psummary--tip"><p className="v2-psummary-title">{name}</p>{list}</div>;
      return <P.Tooltip kind="info" placement="down" open={open} label={name} className={triggerClassName} content={content} />;
    }
    return (
      <div className="v2-psummary">
        <p className="v2-psummary-title">{name}</p>
        {list}
      </div>
    );
  }

  Object.assign(window.V2Kit = window.V2Kit || {}, { StatusTick, DayBar, ProgramStrip, ProgramSummary, EarningsLink, programRules: rules });
})();
