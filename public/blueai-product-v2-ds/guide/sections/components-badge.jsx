/* Section 16 Badge (display-feedback slice). Kit: window.V2Kit.Badge (kit/display.jsx). */
(function () {
  const G = window.V2Guide;
  const row = { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--v2-space-2)' };

  /* V2 today: the account gate, signed in with the other account (its 'Not enrolled' pill). */
  function V2Gate() {
    const AG = window.AccountGate;
    const SP = window.SignInPage;
    return <AG.GateCard account={SP.ACCOUNTS.other} fromPlayer onSwitch={function () {}} />;
  }

  function BadgeSection() {
    const K = window.V2Kit || {};
    const B = K.Badge;
    return (
      <G.Section id="badge">
        <G.Part name="Badge" status="changed" role="A short state on a row or card: a day, a run, an app, a mode. Tone sits in the fill and the dot; words stay in ink.">
          <G.Stage ground="surface">
            <div style={row}>
              <B tone="neutral" icon="check">Pending verification</B>
              <B tone="success" icon="check-double">Verified</B>
              <B tone="info" busy>Running</B>
            </div>
          </G.Stage>
          <ul className="g-list">
            <li>Pill, 22 tall, padding 0 8 (--v2-space-2), no edge, no shadow.</li>
            <li>Mark: a 6px dot in the tone colour, or one 16px icon in its place, never both. One tick for pending, two for verified, as the program says it.</li>
            <li>Label: 12/500, ink-2, sentence case, three words at most.</li>
            <li>Fill: the tone tint (neutral, info, success, attention, danger).</li>
          </ul>

          <G.StateGrid states={[
            { label: 'Neutral', note: 'one ink-4 tick: pending', node: <B tone="neutral" icon="check">Pending verification</B> },
            { label: 'Success', note: 'two ticks: verified', node: <B tone="success" icon="check-double">Verified</B> },
            { label: 'Info, busy', note: 'dot pulses', node: <B tone="info" busy>Running</B> },
            { label: 'Attention', note: 'the worker needs you', node: <B tone="attention" dot>Waiting for you</B> },
            { label: 'Danger', note: 'the day did not count', node: <B tone="danger" dot>Not counted</B> },
            { label: 'Neutral, no mark', note: 'fill alone', node: <B tone="neutral">Paused</B> },
            { label: 'With dot', node: <B tone="neutral" dot>Paused</B> },
            { label: 'Busy, reduced motion', note: 'dot holds still', node: <B tone="info" busy className="v2-reduced-motion">Running</B> },
          ]} />

          <G.Note>
            Why the label is ink, not the tone colour: a style choice. Every status ink passes on its own tint (success ink
            on the 8% tint is 4.59:1), and one ink keeps a row of badges calm: the tone is in the fill and the mark, the
            words read at 9:1 or better. Pending verification is neutral (section 03).
          </G.Note>

          <G.CompareRow
            v2={<G.Live label="AccountGate.GateCard" get={function () { return window.AccountGate && window.SignInPage ? V2Gate : null; }} />}
            system={
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--v2-space-3)' }}>
                <B tone="neutral">Not in the program</B>
                <div style={row}>
                  <B tone="success" icon="check-double">Verified</B>
                  <B tone="danger" dot>Download failed</B>
                </div>
              </div>
            }
            changed="Five pill systems become one. V2 draws a 12/600 status chip, a 4px-radius job badge with a line, an uppercase 10/700 'Active', an 11.5/700 'Verified' and an uppercase 11/600 'Not enrolled'. The system keeps the status chip's idea (a tone, a dot that pulses while busy) at 22 tall, 12/500, sentence case. 'Not enrolled' becomes 'Not in the program', because the glossary bans enrolled." />

          <G.SpecDrawer rows={[
            { part: 'Shape', token: '--v2-radius-pill', value: 'pill, height 22', ref: ['display-feedback.badge.statuschip', 'display-feedback.badge.job-status'] },
            { part: 'Padding', token: '--v2-space-2', value: '0 8px', ref: 'display-feedback.badge.statuschip' },
            { part: 'Label size', token: '--v2-text-12 / --v2-weight-medium', value: '12px / 500, sentence case', ref: ['display-feedback.badge.active', 'display-feedback.badge.verified', 'display-feedback.badge.not-enrolled'] },
            { part: 'Label colour', token: '--v2-ink-2', value: '#3c4049 on every tone', ref: ['display-feedback.badge.tone-green', 'display-feedback.badge.site-chip'] },
            { part: 'Neutral fill', token: '--v2-surface-sunken', value: '#f6f6f8, mark ink-4 (pending verification, paused, skipped, soon)', ref: 'display-feedback.badge.not-enrolled' },
            { part: 'Info fill', token: '--v2-blue-tint', value: 'blue 8%, mark --v2-blue (running, checking)' },
            { part: 'Success fill', token: '--v2-success-tint', value: 'green 8%, mark --v2-success', ref: ['display-feedback.badge.verified', 'display-feedback.badge.active'] },
            { part: 'Attention fill', token: '--v2-attention-tint', value: '#fdf6cf, mark --v2-attention-ink', ref: 'display-feedback.badge.tone-amber' },
            { part: 'Danger fill', token: '--v2-danger-tint', value: '#fdecec, mark --v2-danger-ink' },
            { part: 'Dot', token: null, value: '6px round, tone mark colour', ref: 'display-feedback.badge.statuschip-dot' },
            { part: 'Busy', token: '--v2-dur-pulse', value: '.v2-anim-pulse, 1200ms; still under reduced motion', ref: 'display-feedback.badge.statuschip-dot' },
            { part: 'Copy', token: null, value: 'Verified', ref: 'display-feedback.badge.verified-copy' },
            { part: 'Copy', token: null, value: 'Pending verification', ref: 'display-feedback.badge.pending-copy' },
            { part: 'Copy', token: null, value: "Not in the program (replaces 'Not enrolled')", ref: 'display-feedback.badge.not-enrolled-copy' },
            { part: 'Copy', token: null, value: 'Download failed', ref: 'display-feedback.progress.failed-copy' },
            { part: 'Copy', token: null, value: 'Paused', ref: 'display-feedback.progress.paused-copy' },
            { part: 'Copy (proposed)', token: null, value: 'Running, Waiting for you, Not counted' },
          ]} />

          <G.DoDont
            do={['One badge per row, at its trailing edge.', 'Say the state in words: Verified, Pending verification, Paused.', 'Use the icon only where it carries meaning (one tick, two ticks).']}
            dont={['Uppercase or letter-spaced labels.', 'A badge that takes a click: it is a label, not a button.', 'Tone-coloured label text, or a second badge to say the same thing louder.']} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('badge', BadgeSection);
})();
