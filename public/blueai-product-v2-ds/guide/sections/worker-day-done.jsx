/* Section 44: the day-done moment (Changed from V2). Owner: worker slice. */
(function () {
  const G = window.V2Guide;
  const { useState } = React;
  const noop = function () {};

  // A product-window-sized box: the kit Dialog and V2's overlay both position against it.
  function Win({ height, children }) {
    return (
      <div style={{ position: 'relative', overflow: 'hidden', width: '100%', maxWidth: 'var(--v2-shell-w)', height: height || 560,
        background: 'var(--v2-canvas)', border: 'var(--v2-stroke) solid var(--v2-line-hair)', borderRadius: 'var(--v2-radius-md)' }}>{children}</div>
    );
  }

  function LiveDemo() {
    const K = window.V2Kit || {};
    const [open, setOpen] = useState(null);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--v2-space-3)' }}>
        <div style={{ display: 'flex', gap: 'var(--v2-space-2)', flexWrap: 'wrap' }}>
          {['job', 'nojob', 'day20'].map(function (e) {
            return <button key={e} type="button" className="g-btn" onClick={function () { setOpen(e); }}>Open {e === 'job' ? 'job' : e === 'nojob' ? 'no job' : 'Day 20'}</button>;
          })}
        </div>
        <Win height={560}>
          <div style={{ padding: 'var(--v2-space-4)' }}>{K.ProgramStrip ? <K.ProgramStrip worker={K.workerFixtures.donePending} /> : null}</div>
          {open && K.DayDone ? <K.DayDone end={open} open onClose={function () { setOpen(null); }} /> : null}
        </Win>
        <p className="g-muted" style={{ margin: 0 }}>Live: focus moves to the dialog, Tab stays inside, Esc, the scrim or Got it close it and focus returns to the button.</p>
      </div>
    );
  }

  function DayDoneSection() {
    const K = window.V2Kit || {};
    const ready = !!(K.DayDone && K.Dialog);
    const spec = (end) => (ready ? <Win height={540}><K.DayDone end={end} preview onClose={noop} /></Win> : <div className="g-missing">DayDone needs kit/day-done.jsx and kit/dialog.jsx.</div>);
    return (
      <G.Section id="day-done">
        <G.Part name="DayDone" status="changed" role="The end-of-run moment: today's run is in, here is where the 20 days stand, and it is pending until checked.">
          <p><strong>Anatomy.</strong> The kit Dialog, celebration variant, size sm (320), dim scrim, no close button. A 56
            badge in blue tint with one tick in --v2-blue-ink, inherited from the badge (pending, never green): one of the
            two blue exceptions to the neutral pending tone (section 03). Title 20/600, the PM's DRAFT string. Two sub
            lines 13 ink-3, only on Day 20: the PM's, then the proposed cash-out step. DayBar with one count line:
            '7 of 20 days' and one tick 'Pending verification'. The verification note 13 ink-3. One full-width primary 'Got it' (44). Confetti on Day 20 only, once.</p>
          <G.StateGrid wide states={[
            { label: 'Job', note: '?day=next&end=job', node: spec('job') },
            { label: 'No job (the run counts)', note: '?day=next&end=nojob', node: spec('nojob') },
            { label: 'Day 20', note: '?day=next&end=day20; confetti once, none under reduced motion', node: spec('day20') },
            { label: 'Dismissed', note: 'Got it, Esc or the scrim; focus returns; the run card keeps the day line', node: <span className="g-muted">Nothing renders.</span> },
          ]} />
          <G.CompareRow
            v2={<Win height={560}><G.Live get={function () { return window.WorkerDayDone && window.WorkerDayDone.DayDoneOverlay; }} props={{ step: { end: 'job' }, onClose: noop }} label="WorkerDayDone.DayDoneOverlay" /></Win>}
            system={spec('job')}
            changed="V2 adopted the minimal popup on 2026-10-14, as this section recommended: a 44 tick badge, the title, one status line ('Day 7 of 20 · Pending verification'; the money option leads with '+$1 · '; Day 20 drops the day part), the note only the first time it shows in a session, and Got it, on a 280 panel. The eyebrow, the big green count, the bar and legend, the confetti and the pulsing ring are gone. Still different: V2's badge is verified green while the day is pending; here it is blue with one tick until verified. The system keeps the DayBar above its one count line, confetti once on Day 20 only, and the note on every showing. The panel is the one Dialog, so it gains aria-modal, focus in and out, and Esc. The PM's titles are quoted, not rewritten." />
          <G.FrameState url="index.html?day=next&end=job" label="V2: the next day's run, ending on a job" height={830} />
          <p><strong>Try it.</strong> The real dialog in a product-sized window:</p>
          <LiveDemo />
          <G.SpecDrawer rows={[
            { part: 'Dialog', token: '--v2-dialog-sm, --v2-radius-lg, --v2-shadow-2', value: '320, radius 16, celebration variant', ref: ['worker.daydone.panel', 'worker.daydone.role'] },
            { part: 'Scrim', token: '--v2-scrim', value: 'rgba(11,18,32,0.48), dialog layer', ref: 'worker.daydone.scrim' },
            { part: 'Badge', token: '--v2-blue-tint, --v2-blue-ink', value: '56 round, one tick 28 in --v2-blue-ink inherited from the badge (a blue exception to the neutral pending tone), no ring', ref: 'worker.daydone.badge' },
            { part: 'Title', token: '--v2-text-20, --v2-weight-semibold', value: 'Today’s run is done.', ref: 'worker.copy.job' },
            { part: 'Title, no job', token: 'same', value: 'No paid job today, but your run counts.', ref: 'worker.copy.nojob' },
            { part: 'Title, Day 20', token: 'same + two subs 13 ink-3', value: 'Day 20 done. / That’s every day for this month. / Cash out on Earnings after Nov 1, once your days are verified ($10 minimum). (the last line proposed)', ref: ['worker.copy.day20', 'worker.copy.day20-sub'] },
            { part: 'Count', token: '--v2-text-13, figure --v2-ink 600', value: "'7 of 20 days', said once, under the DayBar", ref: 'worker.daydone.pending-line' },
            { part: 'Status', token: 'StatusTick pending', value: 'one tick, Pending verification', ref: 'worker.copy.pending' },
            { part: 'Note', token: '--v2-text-13, --v2-ink-3', value: 'We check every run within a day. The tick doubles once it’s verified.', ref: ['worker.copy.verify-note', 'worker.daydone.note-colour', 'worker.daydone.note-once'] },
            { part: 'Got it', token: '--v2-action, --v2-control-lg', value: 'primary, full width, 44', ref: ['worker.daydone.got-it', 'worker.daydone.got-it-label'] },
            { part: 'Arrival', token: '--v2-dur-celebrate, --v2-ease-out', value: 'badge pops 450ms once', ref: 'worker.daydone.pop' },
            { part: 'Confetti', token: '--v2-blue, --v2-action, --v2-ink-4', value: '12 fixed bits, Day 20 only, hidden under reduced motion; never green or yellow while the day is pending (V2 has none since 2026-10-14)' },
          ]} />
          <G.DoDont
            do={['Show pending as pending: blue, one tick, the word.', 'Say the count once, from numbers(), so tomorrow matches tonight.', 'Keep failed and skipped out of the moment: the run card says those with their action.']}
            dont={['Paint a pending day green or put money on it.', 'Loop any animation; celebrate every day with confetti.', 'Rewrite the PM’s titles here: propose changes in the partial instead.']} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('day-done', DayDoneSection);
})();
