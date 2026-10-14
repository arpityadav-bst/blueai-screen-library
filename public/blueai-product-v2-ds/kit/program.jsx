/* BlueAI Product V2 Design System: program progress (section 43).
   StatusTick {status, size, label, reason}
     status pending | verified | notcounted | rejected | late. One tick while pending, two once
     verified (V2's messaging-app model, worker_day_done.jsx:10-14), plus the three failure states
     V2 lacked (R19). label true prints the word, a string replaces it. size is one of TICK_SIZES
     (12, 14, 16, 28; any other renders at 14); the stroke renders --v2-icon-stroke px at every size,
     compensated per size in kit/worker.css as Icon is in kit/base.css.
   tickWord(status)  the word StatusTick says ('Pending verification', 'Verified', 'Not counted').
   DayBar {days, worker, target, legend, bonusLabel, label}
     days: segment states (verified | pending | rejected | missed | future), or pass worker and
     numbers() derives them. role=progressbar with a spoken summary; the legend says it in words.
   ProgramStrip {worker, onOpenActivity, onRetry, receipt}  the home's progress card: count, Ends Nov 1, DayBar,
     one receipt line, Earnings (one URL). The site's progress tile with the pending state it lacks.
     receipt false (default true) drops the receipt line and keeps Earnings alone in the foot, for a
     screen where the WorkerCard already says today's status (Home). A complete program has no
     receipt: the WorkerCard says it once ('All 20 days verified.', cash out on Earnings).
     The receipt names the real day of the last ledger row against today.date ('Yesterday’s run
     verified.', 'The Oct 10 run is still being checked.'), never a day picked from its status.
   ProgramSummary {rule, compact, title, triggerClassName, open}  the five program rules, in full or
     behind the Tooltip's own (i) trigger (32px; triggerClassName forces its state and open forces
     the tip, for review).
   programRules(rule)  [{id days | counts | ticks | cashout | minimum, icon, text}]: the one place a
     rule is written. programRule(id) is one rule's text: DayDone, Run detail and Chat read the tick
     rule as programRule('ticks'), the PM's DRAFT line kept word for word (worker_day_done.jsx:98).
   The program's words, from numbers() (proposed copy unless marked):
     RUN_COPY         keepOpen (while a run is on the PC), over (after the program), checking(n)
                      (all 20 done, n still being checked)
     minimumCopy(min) the site's cash-out minimum sentence ('You need $10 to cash out.')
     endedCopy(n)     {title, body}: the program-ended words (sections 42 and 69)
   The strip's Earnings link is V2Kit.Link {href: EARNINGS_URL, external, standalone}. */
(function () {
  const K = () => window.V2Kit || {};
  const cx = function () { return Array.prototype.filter.call(arguments, Boolean).join(' '); };

  const TICK_WORDS = { pending: 'Pending verification', verified: 'Verified', notcounted: 'Not counted', rejected: 'Not counted', late: 'Still checking' };
  const TICK_SIZES = [12, 14, 16, 28];
  function TickGlyph({ status, size }) {
    const s = size;
    const common = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
    if (status === 'verified') {
      return <svg width={Math.round(s * 1.4)} height={s} viewBox="0 0 34 24" {...common}><polyline points="18 6 7 17 2 12" /><polyline points="30 6 19 17 15.5 13.5" /></svg>;
    }
    if (status === 'notcounted') return <svg width={s} height={s} viewBox="0 0 24 24" {...common}><line x1="6" y1="12" x2="18" y2="12" /></svg>;
    if (status === 'rejected') return <svg width={s} height={s} viewBox="0 0 24 24" {...common}><line x1="7" y1="7" x2="17" y2="17" /><line x1="17" y1="7" x2="7" y2="17" /></svg>;
    if (status === 'late') return <svg width={s} height={s} viewBox="0 0 24 24" {...common}><circle cx="12" cy="12" r="8.5" /><polyline points="12 7.5 12 12 15 14" /></svg>;
    return <svg width={s} height={s} viewBox="0 0 24 24" {...common}><polyline points="20 6 9 17 4 12" /></svg>;
  }
  function StatusTick({ status, size, label, reason, className }) {
    const st = TICK_WORDS[status] ? status : 'pending';
    const s = TICK_SIZES.indexOf(size) >= 0 ? size : 14;
    const word = typeof label === 'string' ? label : TICK_WORDS[st];
    return (
      <span className={cx('v2-tick', 'v2-tick--' + st, className)}>
        <span className={'v2-tick-glyph v2-tick-glyph--' + s} role={label ? undefined : 'img'} aria-label={label ? undefined : word} aria-hidden={label ? true : undefined}><TickGlyph status={st} size={s} /></span>
        {label ? <span className="v2-tick-label">{word}</span> : null}
        {reason ? <span className="v2-tick-reason">{reason}</span> : null}
      </span>
    );
  }
  function tickWord(status) { return TICK_WORDS[status] || TICK_WORDS.pending; }

  function DayBar({ days, worker, target, legend, bonusLabel, label }) {
    const n = worker ? K().numbers(worker) : null;
    const segs = days || (n ? n.segments : []);
    const total = target || segs.length || 20;
    const c = { verified: 0, pending: 0, rejected: 0, missed: 0 };
    segs.forEach(function (s) { if (c[s] !== undefined) c[s] += 1; });
    const done = c.verified + c.pending;
    const spoken = done + ' of ' + total + ' days' + (c.pending ? ', ' + c.pending + ' pending verification' : '') + (c.rejected ? ', ' + c.rejected + ' not counted' : '')
      + (c.missed ? ', ' + c.missed + ' out of reach' : '');
    return (
      <div className="v2-daybar">
        <div className="v2-daybar-track" role="progressbar" aria-label={label || 'Your 20 days'} aria-valuemin={0} aria-valuemax={total} aria-valuenow={done} aria-valuetext={spoken}>
          {segs.map(function (s, i) { return <span key={i} className={'v2-daybar-seg v2-daybar-seg--' + s} />; })}
        </div>
        {legend === false ? null : (
          <div className="v2-daybar-legend v2-text-caption">
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
  // Proposed copy except 'Yesterday’s run verified.' and the skipped line (V2, DAY_COPY.notCounted).
  // retry (ProgramStrip's onRetry): a failed today, on a screen with no WorkerCard to say it (V3's
  // Jobs tab and home), is the receipt in the danger ink with a quiet Retry (V3 review round 2, R4).
  function receipt(w, n, retry) {
    const last = n.last;
    if (n.complete) return null;
    if (retry && K().workerState(w) === 'failed') return { status: 'notcounted', text: 'Today’s job didn’t finish.', danger: true, retry: true };
    if (!last) return { status: 'notcounted', text: 'No days counted yet.' };
    if (K().workerState(w) === 'ended') return { status: 'notcounted', text: endedCopy(n).title + '.' + (n.cashOutOpen === false ? ' ' + minimumCopy(n.cashOutMin) : ' Cash out on Earnings.') };
    const gap = K().dayGap(last.date, (w.today || {}).date);
    const run = gap === 0 ? 'Today’s run' : gap === 1 ? 'Yesterday’s run' : 'The ' + last.date + ' run';
    if (last.status === 'rejected') return { status: 'rejected', text: run + ' wasn’t counted.', danger: true };
    if (last.status === 'late') return { status: 'late', text: run + ' is still being checked.' };
    if (last.status === 'pending') return { status: 'pending', text: run + ' is pending verification.' };
    if (last.status === 'notcounted') {
      if (last.outcome === 'norun') return { status: 'notcounted', text: (gap === 1 ? 'Yesterday' : gap === 0 ? 'Today' : last.date) + ' had no run.' };
      if (gap === 0) return { status: 'notcounted', text: K().DAY_COPY.notCounted };
      return { status: 'notcounted', text: run + ' didn’t count.' };
    }
    return { status: 'verified', text: run + ' verified.' };
  }

  function ProgramStrip({ worker, onOpenActivity, onRetry, receipt: showReceipt }) {
    const P = K();
    const w = worker || P.workerFixtures.verified;
    const n = P.numbers(w);
    const r = showReceipt === false ? null : receipt(w, n, !!onRetry);
    return (
      <section className="v2-pstrip" aria-label="Your 20 days">
        <div className="v2-pstrip-head">
          <p className="v2-pstrip-count v2-text-body-sm"><strong className="v2-tabular">{n.done}</strong> of {n.target} days</p>
          <span className="v2-pstrip-side">
            <span className="v2-text-meta">Ends {n.endsOn}</span>
            <ProgramSummary compact />
          </span>
        </div>
        <DayBar days={n.segments} target={n.target} />
        <div className="v2-pstrip-foot v2-text-caption">
          {r ? (
            <span className={cx('v2-pstrip-receipt', r.danger && 'v2-pstrip-receipt--danger')}>
              <StatusTick status={r.status} size={12} />
              <span>{r.text}</span>
              {r.retry ? <P.Button variant="quiet" size="sm" onClick={onRetry}>Retry</P.Button>
                : r.danger && onOpenActivity ? <P.Button variant="quiet" size="sm" onClick={onOpenActivity}>See why</P.Button> : null}
            </span>
          ) : null}
          {P.Link ? <P.Link href={P.EARNINGS_URL} external standalone>Earnings</P.Link> : null}
        </div>
      </section>
    );
  }

  // Proposed copy built from V2's rule note (worker_day_done.jsx:5-7), except 'ticks' (the PM's). No rate or bonus until D3; the $10 cash-out minimum is in both options
  // (section 43). The PC and the comment lines say before a day is lost what the missed card and a
  // rejected day say after.
  function rules(rule) {
    const r = Object.assign({}, K().WORKER_RULE, rule || {});
    return [
      { id: 'days', icon: 'calendar', text: 'Run on ' + r.target + ' days before ' + r.programEnd + '. Keep your PC on and awake at run time, and App Player open while a job runs.' },
      { id: 'counts', icon: 'check', text: 'A day counts when a job is verified, or when there was no job to take. Keep the comment up until it’s verified.' },
      { id: 'ticks', icon: 'check-double', text: 'We check every run within a day. The tick doubles once it’s verified.' },
      { id: 'cashout', icon: 'earnings', text: 'Cash out on Earnings from $' + r.cashOutMin + '.' },
    ];
  }
  function programRule(id, rule) {
    const x = rules(rule).find(function (r) { return r.id === id; });
    return x ? x.text : '';
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

  // What the worker does while a run is on the partner's PC, and once the program's days are done.
  // One string each, so WorkerCard, RunCard, the tray and the system states agree (sections 42, 54, 69).
  const RUN_COPY = {
    keepOpen: 'Leave App Player open until it’s done.',
    over: 'Your worker won’t run again until the next program.',
    checking: function (pending) {
      return pending === 1 ? 'One day is still being checked. I’ll run again only if it doesn’t count.'
        : (pending || 0) + ' days are still being checked. I’ll run again only if one doesn’t count.';
    },
  };
  function minimumCopy(min) {
    return 'You need $' + (min || K().WORKER_RULE.cashOutMin) + ' to cash out.';
  }
  /* The program-ended words, one set (section 69; Home shows them once the program is over).
     n: numbers(record). The verified count, that the worker has stopped, then one cash-out sentence
     from the site's $10 answer: open, under the minimum in the site's words, and while cashOutOpen
     is null (every fixture today) only where to look, so the app never tells a partner cash out is
     open, or that it is not, from its own count. Cash out is not tied to the program's end. */
  function endedCopy(n) {
    const checking = !n.pending ? '' : n.pending === 1 ? ' One more day is still being checked and counts once it’s verified.'
      : ' ' + n.pending + ' more days are still being checked and count once they’re verified.';
    const cash = n.cashOutOpen === true ? 'Cash out is open on Earnings.'
      : n.cashOutOpen === false ? minimumCopy(n.cashOutMin)
      : 'See your balance and cash out on Earnings.';
    return { title: 'This program ended on ' + n.endsOn, body: 'You finished ' + n.verified + ' of ' + n.target + ' days.' + checking + ' ' + RUN_COPY.over + ' ' + cash };
  }

  Object.assign(window.V2Kit = window.V2Kit || {}, {
    StatusTick, tickWord, TICK_SIZES, DayBar, ProgramStrip, ProgramSummary, programRules: rules, programRule,
    RUN_COPY, minimumCopy, endedCopy,
  });
})();
