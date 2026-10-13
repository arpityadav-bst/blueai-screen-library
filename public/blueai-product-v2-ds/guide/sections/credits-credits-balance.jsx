/* Section 47: Credits balance and allowance (credits-settings slice). Kit: kit/credits.jsx.
   Grant and run cost are read from the Worker record fixture (section 41), so the guide shows one
   number for each. Every countdown is frozen 6h 42m before the 00:00 UTC refill. */
(function () {
  const G = window.V2Guide;
  const REFILL = Date.UTC(2026, 9, 14);
  const NOW = REFILL - (6 * 60 + 42) * 60000;
  const noop = function () {};
  const fill = { width: '100%' };
  const row = { display: 'flex', gap: 'var(--v2-space-3)', alignItems: 'center', flexWrap: 'wrap' };

  function allowance() {
    const K = window.V2Kit || {};
    const f = K.workerFixtures && K.workerFixtures.setUp;
    return (f && f.credits) || { grant: 2000, runCost: 360 };
  }

  function CreditsBalanceSection() {
    const K = window.V2Kit || {};
    const Chip = K.CreditsChip, Meter = K.CreditsMeter, T = K.creditsTime;
    if (!Chip || !Meter) return <G.Section id="credits-balance"><G.Warn>kit/credits.jsx is not loaded.</G.Warn></G.Section>;
    const c = allowance();
    const chip = function (p) { return <Chip balance={c.grant} runCost={c.runCost} onClick={noop} {...(p || {})} />; };
    const meter = function (p) {
      return <div style={fill}><Meter grant={c.grant} runCost={c.runCost} refillAt={REFILL} now={NOW} balance={c.grant} {...(p || {})} /></div>;
    };
    const fmt = function (n) { return n.toLocaleString('en-US'); };
    return (
      <G.Section id="credits-balance">
        <G.Part name="CreditsChip" status="changed"
          role="The top bar's quiet allowance status. Number in ink; a dot only when today's run is short. Opens AI credits.">
          <G.StateGrid states={[
            { label: 'Full', node: chip() },
            { label: 'Low', note: 'less than one run (' + c.runCost + ')', node: chip({ balance: 120 }) },
            { label: 'Empty', note: '0 plus a neutral dot (out of AI credits says until when: neutral, section 03)', node: chip({ balance: 0 }) },
            { label: 'Paused', note: 'running on your own key', node: chip({ state: 'paused' }) },
            { label: 'Hover', node: chip({ className: 'is-hover' }) },
            { label: 'Focus-visible', node: chip({ className: 'is-focus' }) },
            { label: 'Active', node: chip({ className: 'is-active' }) },
          ]} />
          <G.CompareRow
            v2={<G.FrameState url="index.html?start=worker&credits=0" height={420}
              label="V2 top bar at 0 credits (?start=worker shows 2,000)" />}
            system={<G.Stage ground="surface"><div style={row}>{chip()}{chip({ balance: 0 })}{chip({ state: 'paused' })}</div></G.Stage>}
            changed={'V2 wraps a white capsule in a 1.5px brand-gradient ring and paints the 13/700 number in the same gradient, '
              + 'three gradients in one 419px bar. It is a div acting as a button with no hover or focus. Its red dot fires under '
              + '1,000 against a balance that is only ever 0 or 2,000, so it can only mean empty, and on your own key it still '
              + 'shows 2,000 with nothing saying credits are paused. The system keeps the gradient on the glyph only, sets the '
              + 'number in ink 13/500 tabular on a 1px line, makes low mean "less than one run", says "Own key" when paused, '
              + 'and is a real button with a 32px hit area and the focus ring.'} />
          <G.DoDont
            do={['Show the number in ink and let the dot carry low and empty.', 'Derive low from the Worker record: less than one run (credits.runCost).', 'Open AI credits (section 66) on click, Enter or Space.']}
            dont={['Paint the number, ring or fill with the brand gradient.', 'Use a raw threshold such as 1,000.', 'Keep showing a balance while your own key is in use.']} />
          <G.SpecDrawer rows={[
            { part: 'Pill height', token: '--v2-control-sm', value: '28px', ref: 'credits-settings.pill.inner' },
            { part: 'Hit area', token: '--v2-hit-min', value: '32px, a real <button>', ref: 'credits-settings.pill.label' },
            { part: 'Edge', token: '--v2-line', value: '1px rgba(0,0,0,0.10)', ref: 'credits-settings.pill.ring' },
            { part: 'Fill', token: '--v2-surface', value: '#ffffff', ref: 'credits-settings.pill.inner' },
            { part: 'Radius', token: '--v2-radius-pill', value: '999px', ref: 'credits-settings.pill.ring' },
            { part: 'Glyph', token: '--v2-gradient-brand', value: 'credits icon 16px (mask)', ref: 'credits-settings.pill.glyph' },
            { part: 'Number', token: '--v2-text-13, --v2-weight-medium, --v2-ink', value: '13/500 #0b0b0d, tabular', ref: 'credits-settings.pill.number' },
            { part: 'Low rule', token: null, value: 'balance < runCost (' + c.runCost + ', Worker record)', ref: 'credits-settings.grant.low-dot' },
            { part: 'Low dot', token: '--v2-attention-ink', value: '8px #8a6116, 2px surface ring' },
            { part: 'Empty dot', token: '--v2-ink-3', value: '8px #5f636b, 2px surface ring (V2: red)', ref: 'credits-settings.pill.dot' },
            { part: 'Hover', token: '--v2-line-hover, --v2-wash-hover', value: 'edge 20%, wash 4.5%' },
            { part: 'Focus', token: '--v2-focus-outline', value: '2px #156efe, offset 2' },
            { part: 'V2 states', token: null, value: '?start=worker (2,000), ?start=worker&credits=0 (0 + dot)', ref: ['credits-settings.url.start-worker', 'credits-settings.url.credits-zero'] },
          ]} />
        </G.Part>

        <G.Part name="CreditsMeter" status="new"
          role="Answers 'will today's run fit': how much of today's grant is left, when it refreshes, and whether the run is covered.">
          <G.Note>
            Why the product needs it: credits are the worker's fuel, and the only question a partner has about them is whether
            today's run will happen. V2 shows a bare number that is either 2,000 or 0 and never states the grant or the reset
            until it is already zero. The meter is the unshipped comparison idea (credits_page_options.jsx:147-170) with V2's own
            countdown and one grant from the Worker record.
          </G.Note>
          <G.StateGrid wide states={[
            { label: 'Full', node: meter() },
            { label: 'Partial', node: meter({ balance: 1250 }) },
            { label: 'Low', note: 'less than one run', node: meter({ balance: 120 }) },
            { label: 'Empty', note: 'until credits refresh: neutral, clock', node: meter({ balance: 0 }) },
            { label: 'Empty, refill before 9 pm', note: 'today can still count: neutral, clock', node: meter({ balance: 0, dayStatus: 'waiting' }) },
            { label: 'Empty, today lost', note: 'today won’t count: danger, x-circle', node: meter({ balance: 0, dayStatus: 'stopped' }) },
            { label: 'Empty, run already done', node: meter({ balance: 0, runDone: true }) },
            { label: 'Refreshed', note: 'after 00:00 UTC', node: meter({ balance: 0, refreshed: true }) },
          ]} />
          <G.Note>
            Countdown (useCountdown): V2's formatLeft, unchanged, reads {T ? [T.formatLeft(24120000), T.formatLeft(2520000), T.formatLeft(8000), T.formatLeft(21600000)].join(', ') : '6h 42m, 42m, 8s, 6h'}.
            Clock times are local and in the house format, for example {T ? T.formatClock(REFILL, NOW) : '5:30 am tomorrow'} for this
            viewer. Pass a Date or ms; a display string such as '5:30 am' is ignored and the next 00:00 UTC is used.
          </G.Note>
          <G.Warn>
            One grant. V2 states {fmt(2000)} in the app (index.html:730) and {fmt(2500)} in the shared popup parts
            (credits_popup_parts.jsx:14). The system reads credits.grant and credits.runCost from the Worker record and never
            holds its own constant.
          </G.Warn>
          <G.SpecDrawer rows={[
            { part: 'Rail', token: '--v2-surface-sunken, --v2-radius-pill', value: '6px, role=meter', ref: 'credits-settings.meter.idea-rail' },
            { part: 'Fill', token: '--v2-blue', value: '#156efe (the idea used the brand gradient)', ref: 'credits-settings.meter.idea-fill' },
            { part: 'Left today', token: '--v2-text-12, --v2-ink-4', value: fmt(1250) + ' of ' + fmt(c.grant) + ' left today', ref: 'credits-settings.meter.idea-left' },
            { part: 'Refresh', token: '--v2-text-12, --v2-ink-4', value: "'Refreshes in 6h 42m' / 'Refreshed'", ref: ['credits-settings.meter.idea-refresh', 'credits-settings.countdown.format'] },
            { part: 'Covered line', token: '--v2-text-13, --v2-weight-medium, --v2-ink-2', value: "'Enough for today’s run' and three siblings" },
            { part: 'Covered icon', token: '--v2-success / --v2-attention-ink / --v2-ink-3 / --v2-danger-ink', value: 'check (enough) / alert (low) / clock in ink-3 (empty, today can still count) / x-circle in danger (empty, today won’t count: dayStatus stopped) / check in ink-3 (run done), 16px; section 03’s out-of-credits rule' },
            { part: 'Grant', token: null, value: fmt(c.grant) + ' (Worker record credits.grant)', ref: ['credits-settings.grant.daily', 'credits-settings.grant.popup-daily'] },
            { part: 'Balance in V2', token: null, value: '0 or 2,000 only', ref: 'credits-settings.grant.zero-or-full' },
            { part: 'Refill', token: null, value: '00:00 UTC, shown in local time', ref: ['credits-settings.countdown.utc', 'credits-settings.countdown.next'] },
            { part: 'Tick', token: null, value: '1000ms, stops at zero', ref: 'credits-settings.countdown.tick' },
            { part: 'Fill motion', token: '--v2-dur-3, --v2-ease-out', value: '240ms width' },
          ]} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('credits-balance', CreditsBalanceSection);
})();
