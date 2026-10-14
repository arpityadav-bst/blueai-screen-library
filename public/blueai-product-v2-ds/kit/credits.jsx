/* BlueAI Product V2 Design System: AI credits as the worker's daily allowance (section 47).

   CreditsChip    {balance, state?, runCost?, onClick, className}
                  The top bar's credits, first on the left, opening AI credits. state is 'full' |
                  'low' | 'empty' | 'paused' (running on the partner's own key); when absent it is
                  derived from balance and runCost (low = less than one run needs). Plain text
                  (2026-10-14): the neutral spark, the number in ink 500, a dot only when today's run
                  is short; no outline, a 28px wash on hover inside a 32px hit area.
   CreditsMeter   {balance, grant, runCost, refillAt?, now?, runDone?, refreshed?, dayStatus?, figure?,
                  className}
                  role=meter rail, '1,250 of 2,000 left today', 'Refreshes in 6h 42m', and one line
                  that answers "is today's run covered". At zero that line says what zero means for
                  today, in the words every zero surface uses: dayStatus is V2Kit.creditsDay(worker)
                  ('covered' | 'waiting' | 'stopped', section 41) and the line is
                  V2Kit.OOC_COPY.day[dayStatus] (section 48). figure false (under a StatCard that
                  already shows the balance) drops the balance from the caption: 'of 2,000 today';
                  the meter's aria-valuetext keeps the full words.
   useCountdown(target?, opts?)  -> {ms, at, left, clock, done, underMinute}
                  Time to the next refill. target (a Date or ms) defaults to the next 00:00 UTC
                  (V2's refill, credits_popup_parts.jsx:22-25); a string is ignored, the clock
                  text is formatted here. opts.now freezes the clock for specimens and tests.
                  Ticks once a second while counting, stops at zero.
   creditsTime    {nextRefill(now), formatLeft(ms), formatClock(at, now)}: V2's countdown maths
                  (formatLeft is V2's, unchanged) plus a local clock in the house format '5:30 am'.

   Grant and run cost are props. They come from the Worker record (section 41); this file never
   holds a second grant constant. */
(function () {
  const { useState, useEffect } = React;
  const cx = function () { return Array.prototype.filter.call(arguments, Boolean).join(' '); };
  const fmt = function (n) { return Math.max(0, Math.round(n || 0)).toLocaleString('en-US'); };

  function Ic({ name, size }) {
    const K = window.V2Kit || {};
    return K.Icon ? <K.Icon name={name} size={size || 16} /> : null;
  }

  // ---- time (same day key as V2: the grant is replaced at 00:00 UTC)
  function nextRefill(now) {
    const d = new Date(now == null ? Date.now() : now);
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1));
  }
  // V2's formatLeft, unchanged: '6h 42m', '42m', '6h', and seconds only in the last minute ('8s').
  function formatLeft(ms) {
    const s = Math.max(0, Math.ceil(ms / 1000));
    if (s < 60) return s + 's';
    const m = Math.floor(s / 60), h = Math.floor(m / 60), mm = m % 60;
    if (h === 0) return m + 'm';
    return mm === 0 ? h + 'h' : h + 'h ' + mm + 'm';
  }
  // '5:30 am tomorrow', '11 am today', '9 pm Friday', in the partner's own time zone.
  function formatClock(at, now) {
    const a = new Date(at), n = new Date(now == null ? Date.now() : now);
    const h = a.getHours(), m = a.getMinutes();
    const time = (h % 12 || 12) + (m ? ':' + String(m).padStart(2, '0') : '') + (h < 12 ? ' am' : ' pm');
    const tmr = new Date(n); tmr.setDate(n.getDate() + 1);
    if (a.toDateString() === n.toDateString()) return time + ' today';
    if (a.toDateString() === tmr.toDateString()) return time + ' tomorrow';
    return time + ' ' + a.toLocaleDateString('en-US', { weekday: 'long' });
  }

  function useCountdown(target, opts) {
    const fixed = opts && opts.now != null ? +new Date(opts.now) : null;
    const [tick, setTick] = useState(function () { return Date.now(); });
    const now = fixed != null ? fixed : tick;
    // A display string ('5:30 am') or a bad value is not a time: fall back to the next refill.
    const given = target != null && typeof target !== 'string' ? +new Date(target) : NaN;
    const at = isFinite(given) ? given : +nextRefill(now);
    const ms = Math.max(0, at - now);
    const live = fixed == null && ms > 0;
    useEffect(function () {
      if (!live) return undefined;
      const id = setInterval(function () { setTick(Date.now()); }, 1000);
      return function () { clearInterval(id); };
    }, [live]);
    return {
      ms: ms, at: new Date(at), left: formatLeft(ms), clock: formatClock(at, now),
      done: ms <= 0, underMinute: ms > 0 && ms < 60000,
    };
  }

  function chipState(balance, runCost) {
    if (!(balance > 0)) return 'empty';
    if (runCost && balance < runCost) return 'low';
    return 'full';
  }

  function CreditsChip({ balance, state, runCost, onClick, className }) {
    const s = state || chipState(balance, runCost);
    const n = fmt(balance);
    const label = {
      full: 'AI credits: ' + n + ' left today',
      low: 'AI credits: ' + n + ' left today, not enough for today’s run',
      empty: 'AI credits: none left today',
      paused: 'AI credits paused: using your own key',
    }[s] || 'AI credits';
    return (
      <button type="button" className={cx('v2-credits-chip', 'v2-credits-chip--' + s, className)}
        onClick={onClick} aria-label={label}>
        <span className="v2-credits-chip-pill">
          <Ic name="credits" size={16} />
          <span className="v2-credits-chip-value">{s === 'paused' ? 'Own key' : n}</span>
          {s === 'low' || s === 'empty' ? <span className="v2-credits-chip-dot" aria-hidden="true" /> : null}
        </span>
      </button>
    );
  }

  /* The covered line: one sentence that answers "will today's run fit". runDone wins, because a
     finished run is not affected by what is left. Short or at zero, with the day's status, it says whether
     today still counts (OOC_COPY.day), so a refill after the 9 pm deadline never reads as if
     today's run will still happen. */
  const DAY_TONE = { covered: ['ok', 'check'], waiting: ['attention', 'clock'], stopped: ['danger', 'x-circle'] };
  function coverLine(state, runDone, dayStatus) {
    if (runDone) return { tone: 'done', icon: 'check', text: 'Today’s run is done' };
    const day = (window.V2Kit && window.V2Kit.OOC_COPY || {}).day || {};
    if ((state === 'empty' || state === 'low') && DAY_TONE[dayStatus] && day[dayStatus]) {
      return { tone: DAY_TONE[dayStatus][0], icon: DAY_TONE[dayStatus][1], text: day[dayStatus] };
    }
    if (state === 'empty') return { tone: 'danger', icon: 'x-circle', text: 'Today’s run can’t start until credits refresh' };
    if (state === 'low') return { tone: 'attention', icon: 'alert', text: 'Not enough for today’s run' };
    return { tone: 'ok', icon: 'check', text: 'Enough for today’s run' };
  }

  function CreditsMeter({ balance, grant, runCost, refillAt, now, runDone, refreshed, dayStatus, figure, className }) {
    const g = grant > 0 ? grant : 1;
    const b = refreshed ? g : Math.max(0, Math.min(balance || 0, g));
    const t = useCountdown(refillAt, { now: now });
    const state = refreshed ? 'refreshed' : b <= 0 ? 'empty' : (runCost && b < runCost) ? 'low' : b >= g ? 'full' : 'partial';
    const left = fmt(b) + ' of ' + fmt(g) + ' left today';
    const cover = coverLine(state, runDone, dayStatus);
    return (
      <div className={cx('v2-credits-meter', 'v2-credits-meter--' + state, className)}>
        <div className="v2-credits-meter-rail" role="meter" aria-label="AI credits left today"
          aria-valuemin={0} aria-valuemax={g} aria-valuenow={b} aria-valuetext={left}>
          <span className="v2-credits-meter-fill" style={{ width: Math.round((b / g) * 100) + '%' }} />
        </div>
        <div className="v2-credits-meter-caption v2-text-meta">
          <span className="v2-tabular">{figure === false ? 'of ' + fmt(g) + ' today' : left}</span>
          <span className="v2-tabular">{refreshed ? 'Refreshed' : 'Refreshes in ' + t.left}</span>
        </div>
        <p className={'v2-credits-meter-cover v2-credits-meter-cover--' + cover.tone}>
          <Ic name={cover.icon} size={16} />
          <span>{cover.text}</span>
        </p>
      </div>
    );
  }

  Object.assign(window.V2Kit = window.V2Kit || {}, {
    CreditsChip, CreditsMeter, useCountdown,
    creditsTime: { nextRefill: nextRefill, formatLeft: formatLeft, formatClock: formatClock },
  });
})();
