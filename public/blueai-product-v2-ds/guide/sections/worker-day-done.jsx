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
            badge in blue tint with one tick (pending, never green). Title 20/600, the PM's DRAFT string. One sub line
            only on Day 20. DayBar with one count line: '7 of 20 days' and one tick 'Pending verification'. The
            verification note 13 ink-3. One full-width primary 'Got it' (44). Confetti on Day 20 only, once.</p>
          <G.StateGrid wide states={[
            { label: 'Job', note: '?day=next&end=job', node: spec('job') },
            { label: 'No job (the run counts)', note: '?day=next&end=nojob', node: spec('nojob') },
            { label: 'Day 20', note: '?day=next&end=day20; confetti once, none under reduced motion', node: spec('day20') },
            { label: 'Dismissed', note: 'Got it, Esc or the scrim; focus returns; the run card keeps the day line', node: <span className="g-muted">Nothing renders.</span> },
          ]} />
          <G.CompareRow
            v2={<Win height={560}><G.Live get={function () { return window.WorkerDayDone && window.WorkerDayDone.DayDoneOverlay; }} props={{ step: { end: 'job' }, onClose: noop }} label="WorkerDayDone.DayDoneOverlay" /></Win>}
            system={spec('job')}
            changed="V2 says the same fact five times (DAY 7 OF 20, the title, 7 of 20 days, Pending verification, the legend) and celebrates a pending day in verified green with confetti and a ring that pulses forever. Now: one count and one status line, pending in blue with one tick until verified, confetti only on Day 20, money nowhere (the days style ships). The panel is the one Dialog, so it gains aria-modal, focus in and out, and Esc. The PM's titles are quoted, not rewritten." />
          <G.FrameState url="index.html?day=next&end=job" label="V2: the next day's run, ending on a job" height={830} />
          <p><strong>Try it.</strong> The real dialog in a product-sized window:</p>
          <LiveDemo />
          <G.SpecDrawer rows={[
            { part: 'Dialog', token: '--v2-dialog-sm, --v2-radius-lg, --v2-shadow-2', value: '320, radius 16, celebration variant', ref: ['worker.daydone.panel', 'worker.daydone.role'] },
            { part: 'Scrim', token: '--v2-scrim', value: 'rgba(11,18,32,0.48), dialog layer', ref: 'worker.daydone.scrim' },
            { part: 'Badge', token: '--v2-blue-tint, --v2-blue-ink', value: '56 round, one tick 28, no ring', ref: 'worker.daydone.ring' },
            { part: 'Title', token: '--v2-text-20, --v2-weight-semibold', value: 'Today’s run is done.', ref: 'worker.copy.job' },
            { part: 'Title, no job', token: 'same', value: 'No paid job today, but your run counts.', ref: 'worker.copy.nojob' },
            { part: 'Title, Day 20', token: 'same + sub 13 ink-3', value: 'Day 20 done. / That’s every day for this month.', ref: ['worker.copy.day20', 'worker.copy.day20-sub'] },
            { part: 'Count', token: '--v2-text-13, figure --v2-ink 600', value: "'7 of 20 days' replaces the eyebrow and the green hero", ref: ['worker.daydone.eyebrow', 'worker.daydone.hero'] },
            { part: 'Status', token: 'StatusTick pending', value: 'Pending verification', ref: ['worker.daydone.pending-line', 'worker.copy.pending'] },
            { part: 'Note', token: '--v2-text-13, --v2-ink-3', value: 'We check every run within a day. The tick doubles once it’s verified.', ref: ['worker.copy.verify-note', 'worker.daydone.note-colour'] },
            { part: 'Got it', token: '--v2-action, --v2-control-lg', value: 'primary, full width, 44', ref: ['worker.daydone.got-it', 'worker.daydone.got-it-label'] },
            { part: 'Arrival', token: '--v2-dur-celebrate, --v2-ease-out', value: 'badge pops 450ms once', ref: 'worker.daydone.pop' },
            { part: 'Confetti', token: '--v2-blue, --v2-success, --v2-action, --v2-attention-line', value: '12 fixed bits, Day 20 only, hidden under reduced motion', ref: 'worker.daydone.confetti' },
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
