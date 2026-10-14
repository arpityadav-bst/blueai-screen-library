/* Section 43: program progress (StatusTick, DayBar, ProgramStrip Changed; ProgramSummary New). */
(function () {
  const G = window.V2Guide;
  const DASH = '../experiments/onblue-vesper/apply.html?creator=in&account=one';
  const bar = function (v, p, r, m, total) {
    const out = [];
    for (let i = 0; i < (total || 20); i++) out.push(i < v ? 'verified' : i < v + p ? 'pending' : i < v + p + r ? 'rejected' : i >= (total || 20) - m ? 'missed' : 'future');
    return out;
  };
  const shell = function (node) { return <div style={{ width: '100%', maxWidth: 'var(--v2-shell-w)' }}>{node}</div>; };

  function ProgramSection() {
    const K = window.V2Kit || {};
    if (!K.StatusTick || !K.workerFixtures) return <G.Section id="program-progress"><div className="g-missing">kit/program.jsx is not loaded.</div></G.Section>;
    const F = K.workerFixtures;
    return (
      <G.Section id="program-progress">
        <G.Part name="StatusTick" status="changed" role="Where one day stands, in the messaging-app language V2 chose: one tick pending, two verified, plus the failures V2 could not show.">
          <p><strong>Anatomy.</strong> A polyline glyph, stroke 2.5, at 12, 14 or 16 (the double tick is 1.4 times as wide).
            Colour sits on the glyph only; the optional label is 12 ink-3. Rejected adds its reason in danger ink.
            The glyph alone is announced (role img); with a label, the label is.</p>
          <G.StateGrid states={[
            { label: 'Pending', note: 'one tick, ink-4 (the neutral pending tone)', node: <K.StatusTick status="pending" label /> },
            { label: 'Verified', note: 'two ticks, success', node: <K.StatusTick status="verified" label /> },
            { label: 'Not counted', note: 'dash: skipped or no run', node: <K.StatusTick status="notcounted" label /> },
            { label: 'Rejected', note: 'cross, with the reason', node: <K.StatusTick status="rejected" label reason="The comment was removed before we checked it." /> },
            { label: 'Late', note: 'clock: past the one-day promise', node: <K.StatusTick status="late" label /> },
            { label: 'Sizes 12 / 14 / 16', node: <span style={{ display: 'inline-flex', gap: 'var(--v2-space-3)', alignItems: 'center' }}><K.StatusTick status="verified" size={12} /><K.StatusTick status="verified" size={14} /><K.StatusTick status="verified" size={16} /></span> },
          ]} />
          <G.CompareRow
            v2={<G.FrameState url="index.html?day=next&end=job" label="V2: the run-complete popup's one tick" height={830} />}
            system={<span style={{ display: 'flex', flexDirection: 'column', gap: 'var(--v2-space-2)' }}><K.StatusTick status="verified" size={12} label="Yesterday’s run verified." /><K.StatusTick status="pending" size={12} label="Pending verification" /><K.StatusTick status="rejected" size={12} label="Not counted" /></span>}
            changed="Same tick model and geometry. Since 2026-10-14 V2 draws both ticks in the token green (#16a34a, the PM's call: the number of ticks carries the state); the system keeps pending in ink-4, so green means reached (P2). V2 had no way to say a day failed verification, so a rejected day would read as pending forever (R19): not counted, rejected and late are added." />
          <G.SpecDrawer rows={[
            { part: 'Glyph', token: 'none', value: 'polyline, stroke 2.5 (same in V2), round caps', ref: ['worker.tick.single', 'worker.tick.stroke'] },
            { part: 'Pending', token: '--v2-ink-4', value: '#6e737c (4.77:1); V2: success green, like verified', ref: 'worker.rule.green' },
            { part: 'Verified', token: '--v2-success', value: '#16a34a, the site green (V2 the same)', ref: 'worker.rule.green' },
            { part: 'Rejected', token: '--v2-danger-ink', value: '#c03a40 + reason 12' },
            { part: 'Label', token: '--v2-text-12, --v2-ink-3', value: 'Pending verification', ref: 'worker.copy.pending' },
          ]} />
        </G.Part>

        <G.Part name="DayBar" status="changed" role="The 20 days at a glance, the same bar as the site's dashboard plus the pending state the site lacks.">
          <p><strong>Anatomy.</strong> 20 segments, height 6, radius 4, gap 2, role progressbar with a spoken summary.
            Verified solid green; pending outlined in blue (in progress, not reached); rejected red, in the slot it would
            have filled until the next run takes it; out of reach hatched (slots that can no longer be reached before the
            end); future on the line colour. Legend 12 ink-3 with ticks. A day-20 label only if decision D3 keeps a bonus.</p>
          <G.StateGrid wide states={[
            { label: 'Verified', node: shell(<K.DayBar days={bar(7, 0, 0, 0)} />) },
            { label: 'Pending (outlined)', note: 'tonight, after the run', node: shell(<K.DayBar days={bar(6, 1, 0, 0)} />) },
            { label: 'Rejected', note: 'the day dropped, with its slot shown', node: shell(<K.DayBar days={bar(6, 0, 1, 0)} />) },
            { label: 'Out of reach', note: 'fewer days left than days needed', node: shell(<K.DayBar worker={F.behind} />) },
            { label: 'Future only', note: 'day 0', node: shell(<K.DayBar days={bar(0, 0, 0, 0)} />) },
            { label: 'Day-20 bonus by label', note: 'only if D3 keeps it', node: shell(<K.DayBar days={bar(12, 1, 0, 0)} bonusLabel="Day 20 bonus" />) },
          ]} />
          <G.CompareRow
            v2={<G.FrameState url={DASH} label="V2: the partner dashboard's Days run pills" height={830} />}
            system={shell(<K.DayBar days={bar(6, 1, 0, 0)} />)}
            changed="Since 2026-10-14 the BlueAI app has no day bar: day-by-day progress lives on the partner dashboard as 20 pills under 'Days run', verified filled, pending outlined, both green, with a legend 'Verified' / 'Pending verification'. A rejected or missed day still cannot show. The system keeps one segment per day too, and pending is a blue outline, not a green one: green means reached (P2). A day-20 bonus, if D3 keeps one, is a label, not a colour. The bar gains rejected and out-of-reach states, a role and a spoken value; the same component should draw the site's tile." />
          <G.SpecDrawer rows={[
            { part: 'Segment', token: '--v2-rail, --v2-radius-xs, --v2-space-05', value: 'height 6, radius 4, gap 2 (V2 dashboard: 20 pills, height 7, fully round, gap 3)', ref: ['worker.bar.track', 'display-feedback.progress.site-label'] },
            { part: 'Verified', token: '--v2-success-ink', value: 'solid (the site goal-bar green; the tick keeps --v2-success)', ref: 'worker.rule.green' },
            { part: 'Pending', token: '--v2-blue, --v2-stroke-selected', value: '1.5 inset outline on surface' },
            { part: 'Rejected', token: '--v2-danger-tint, --v2-danger-line', value: 'tint + 1px line' },
            { part: 'Out of reach', token: '--v2-line-strong', value: 'hatched' },
            { part: 'Future', token: '--v2-line', value: 'alpha-black 10%' },
            { part: 'Day 20', token: 'bonusLabel', value: 'a label, not a colour (V2 has no day-20 segment)' },
            { part: 'Legend', token: '--v2-text-12, --v2-ink-3', value: '6 verified, 1 pending (V2 dashboard: Verified / Pending verification)', ref: 'worker.bar.legend' },
          ]} />
        </G.Part>

        <G.Part name="ProgramStrip" status="changed" role="The home's answer to 'how many of my 20 days count': one figure, the bar, one receipt line, Earnings.">
          <p><strong>Anatomy.</strong> Card radius 16, 1px line, padding 16. Head: '6 of 20 days' 14 with the figure 600 ink
            (the site's 'muted note, one bold figure'), 'Ends Nov 1' 12 meta and a 32px info tip with the program rules.
            DayBar. Foot over a hairline: one receipt line with its tick, and Earnings (the one URL, opens the site).</p>
          <G.StateGrid wide states={[
            { label: 'Day 0 (new)', note: 'shown from the first day, not only to returning partners', node: shell(<K.ProgramStrip worker={F.setUp} />) },
            { label: 'Returning, today pending', node: shell(<K.ProgramStrip worker={F.donePending} />) },
            { label: 'Yesterday verified', node: shell(<K.ProgramStrip worker={F.verified} />) },
            { label: 'Yesterday rejected', note: 'See why opens Activity', node: shell(<K.ProgramStrip worker={F.rejected} onOpenActivity={function () {}} />) },
            { label: 'Today failed, with onRetry', note: 'a screen with no WorkerCard to say it (V3’s Jobs tab)', node: shell(<K.ProgramStrip worker={F.failed} onRetry={function () {}} />) },
            { label: 'Program complete', node: shell(<K.ProgramStrip worker={F.complete} />) },
            { label: 'Receipt off', note: 'receipt={false}: Home, where the WorkerCard says today’s status', node: shell(<K.ProgramStrip worker={F.verified} receipt={false} />) },
            { label: 'Earnings link: hover / focus-visible', node: <span style={{ display: 'inline-flex', gap: 'var(--v2-space-4)' }}>{K.Link ? <K.Link href={K.EARNINGS_URL} external standalone className="is-hover">Earnings</K.Link> : null}{K.Link ? <K.Link href={K.EARNINGS_URL} external standalone className="is-focus">Earnings</K.Link> : null}</span> },
          ]} />
          <G.CompareRow
            v2={<span className="g-muted">Not in V2: the home strip was removed on 2026-10-14; progress lives on the partner dashboard (Earnings in the kebab).</span>}
            system={shell(<K.ProgramStrip worker={F.verified} />)}
            changed="V2 removed its home strip on 2026-10-14 and sends partners to the partner dashboard for progress. The system keeps a strip on Home: one count from the ledger, worded like the site ('12 of 20 days'), the end date, one receipt line, and Earnings with one URL and one external icon, shown from day 0." />
          <G.SpecDrawer rows={[
            { part: 'Card', token: '--v2-radius-lg, --v2-line, --v2-space-4', value: '16, 1px line, padding 16, no shadow' },
            { part: 'Count', token: '--v2-text-14, --v2-ink-3 + figure --v2-ink 600', value: '6 of 20 days', ref: 'worker.site.count' },
            { part: 'Remaining', token: 'none', value: 'dropped: the bar shows it' },
            { part: 'Ends', token: '--v2-text-12, --v2-ink-4', value: 'Ends Nov 1', ref: ['worker.rule.const', 'worker.site.ends'] },
            { part: 'Receipt', token: '--v2-text-12, --v2-ink-3', value: 'Yesterday’s run verified.' },
            { part: 'Earnings', token: 'V2Kit.Link standalone (--v2-ink, underline --v2-link-underline, hover --v2-blue-ink)', value: 'one EARNINGS_URL + external icon', ref: 'worker.earnings.menu-url' },
          ]} />
        </G.Part>

        <G.Part name="ProgramSummary" status="new" role="The program's rules in five lines, said before the first day ends and one tap away afterwards.">
          <G.Note>
            Why the product needs it: the rules live in a code comment ({G.refText('worker.rule.successful-day')}) and in a
            constant nobody shows ({G.refText('worker.rule.const')}); the onboarding close says nothing about them
            ({G.refText('worker.flow.close')}), so partners meet the rules first inside a celebration (R12). Wording waits
            on decision D3: no amount appears until the money model is chosen.
          </G.Note>
          <p><strong>Anatomy.</strong> Title 13/600 ink, then five lines 13 ink-2 each with a 16 icon: run on 20 days before
            Nov 1; what makes a day count; checked within a day, one tick then two; cash out on Earnings after the end;
            You need $10 to cash out; a smaller balance carries over to the next period. No longer matches the product:
            since 2026-10-14 the site has no period lock, only the $10 minimum (the cash-out lines need a rewrite).
            Full in the onboarding close and Help; compact as the strip's info tip (32px trigger).</p>
          <G.StateGrid wide states={[
            { label: 'Full', node: shell(<K.ProgramSummary />) },
            { label: 'Compact (trigger rest / hover / focus)', node: <span style={{ display: 'inline-flex', gap: 'var(--v2-space-3)' }}><K.ProgramSummary compact /><K.ProgramSummary compact triggerClassName="is-hover" /><K.ProgramSummary compact triggerClassName="is-focus" /></span> },
            { label: 'Compact, open', note: 'click pins it; Esc closes', node: <div style={{ minHeight: 220 }}><K.ProgramSummary compact open /></div> },
          ]} />
          <G.SpecDrawer rows={[
            { part: 'Target and end', token: 'WORKER_RULE', value: 'Run on 20 days before Nov 1.', ref: ['worker.rule.const', 'worker.site.what-counts'] },
            { part: 'What counts', token: 'none', value: 'A day counts when a job is verified, or when there was no job to take.', ref: 'worker.rule.successful-day' },
            { part: 'Verification', token: 'none', value: 'We check every run within a day. One tick while pending, two once verified.' },
            { part: 'Cash out', token: 'none', value: 'Cash out on Earnings after the period ends. (V2 since 2026-10-14: no period lock, only the $10 minimum.)', ref: 'worker.rule.cash-out' },
            { part: 'Minimum', token: 'WORKER_RULE.cashOutMin', value: 'You need $10 to cash out; a smaller balance carries over to the next period.', ref: ['worker.rule.cash-out', 'display-feedback.stat.site-note'] },
          ]} />
          <G.DoDont
            do={['Show the rules in the onboarding close, before the first day ends.', 'Put Ends Nov 1 beside the count on the ProgramStrip; the day-done moment shows the count only.']}
            dont={['Promise a rate or a bonus before D3 is decided.', 'Paint pending days or dollar figures green.']} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('program-progress', ProgramSection);
})();
