/* Section 48: Out of credits (credits-settings slice). Kit: kit/out-of-credits.jsx.
   Clocks are frozen relative to the 00:00 UTC refill so every specimen reads the same. */
(function () {
  const G = window.V2Guide;
  const { useState } = React;
  const REFILL = Date.UTC(2026, 9, 14);
  const NOW = REFILL - (6 * 60 + 42) * 60000;
  const noop = function () {};
  const fill = { width: '100%' };
  const card = { width: '100%', maxWidth: 'var(--v2-dialog-sm)', padding: 'var(--v2-space-4)', background: 'var(--v2-surface)', border: 'var(--v2-stroke) solid var(--v2-line)', borderRadius: 'var(--v2-radius-md)' };
  // Dialogs are absolute inside the product window; this box stands in for it (a window-wide strip).
  const win = { position: 'relative', width: '100%', height: 420, overflow: 'hidden', borderRadius: 'var(--v2-radius-md)', background: 'var(--v2-canvas)' };

  function grant() {
    const K = window.V2Kit || {};
    const f = K.workerFixtures && K.workerFixtures.setUp;
    return (f && f.credits && f.credits.grant) || 2000;
  }

  function TryIt() {
    const K = window.V2Kit || {};
    const [open, setOpen] = useState(false);
    if (!K.Dialog) return <G.Note>The live dialog needs V2Kit.Dialog (section 25).</G.Note>;
    return (
      <div data-v2-bounds="" style={Object.assign({}, win, { maxWidth: 'var(--v2-shell-w)', padding: 'var(--v2-space-4)' })}>
        <button type="button" className="g-btn" onClick={function () { setOpen(true); }}>Open the real dialog (Esc, scrim, Got it close it)</button>
        <K.OutOfCreditsDialog open={open} onClose={function () { setOpen(false); }} dayStatus="covered" grant={grant()} />
      </div>
    );
  }

  function OutOfCreditsSection() {
    const K = window.V2Kit || {};
    const D = K.OutOfCreditsDialog, N = K.OutOfCreditsNotice;
    if (!D || !N) return <G.Section id="out-of-credits"><G.Warn>kit/out-of-credits.jsx is not loaded.</G.Warn></G.Section>;
    const dlg = function (p) {
      return <div data-v2-bounds="" style={win}><D preview refillAt={REFILL} now={NOW} grant={grant()} onClose={noop} {...p} /></div>;
    };
    const note = function (p) { return <div style={fill}><N refillAt={REFILL} now={NOW} {...p} /></div>; };
    return (
      <G.Section id="out-of-credits">
        <G.Part name="OutOfCreditsDialog" status="changed"
          role="The zero-balance stop on the one Dialog: V2's words, when credits return, what today means, then one way out.">
          <G.StateGrid wide states={[
            { label: 'Open', note: "today's run covered", node: dlg({ dayStatus: 'covered' }) },
            { label: 'Open, run still to come', node: dlg({ dayStatus: 'waiting' }) },
            { label: 'Countdown under a minute', note: 'seconds appear', node: dlg({ dayStatus: 'covered', now: REFILL - 42000 }) },
            { label: 'Refreshed', note: 'the countdown reached zero while open', node: dlg({ now: REFILL + 1000 }) },
          ]} />
          <TryIt />
          <G.CompareRow
            v2={<div style={card}><G.Live get={function () { return window.Byok && window.Byok.OutOfCreditsCard; }} props={{ onDismiss: noop }} label="window.Byok.OutOfCreditsCard" /></div>}
            system={dlg({ dayStatus: 'covered' })}
            changed={'Copy kept word for word (the picked Option B: countdown plus what credits are). The chrome becomes the one '
              + 'Dialog sm: role=dialog, Esc closes, focus moves to Got it and returns to what opened it, one scrim and the named '
              + 'z-scale instead of its own rgba(15,23,42,0.5) at z 130 with backdrop-click only. The 38/800 gradient 0 becomes '
              + 'ink 40/600; the bare 22px (i) becomes a labelled "What are AI credits?" trigger with a 32px target; Got it is the '
              + 'family button (radius 6, 13/500) instead of a 15/700 pill. Added: one line on what zero means for today, and the '
              + 'refreshed state the countdown promises (from the unshipped comparison page).'} />
          <G.Warn>
            "Enough for 4 to 5 jobs" was written beside a 2,500 grant (credits_popup_parts.jsx:14, 105). At 2,000 it holds only
            while a job costs 400 or less; the Worker record says 360. The PM confirms the line or the number (R14).
          </G.Warn>
          <G.SpecDrawer rows={[
            { part: 'Surface', token: '--v2-dialog-sm, --v2-radius-lg, --v2-shadow-2', value: '320px, radius 16', ref: 'credits-settings.ooc.card' },
            { part: 'Scrim and layer', token: '--v2-scrim, --v2-z-dialog', value: 'rgba(11,18,32,0.48), z 100', ref: 'credits-settings.ooc.scrim' },
            { part: 'Keyboard', token: null, value: 'role=dialog, Esc, focus in and back', ref: 'credits-settings.ooc.backdrop' },
            { part: 'V2 state', token: null, value: '?start=worker&credits=0, then Send in the composer', ref: ['credits-settings.url.credits-zero', 'credits-settings.ooc.trigger'] },
            { part: 'Title', token: '--v2-text-20, --v2-weight-semibold, --v2-ink', value: "'Out of credits' 20/600", ref: 'credits-settings.ooc.title' },
            { part: 'Glyph', token: '--v2-icon-lg, --v2-gradient-brand', value: 'credits icon 24px', ref: 'credits-settings.ooc.glyph' },
            { part: 'Numeral', token: '--v2-text-40, --v2-weight-semibold, --v2-tracking-display', value: "'0' 40/600 #0b0b0d", ref: 'credits-settings.ooc.numeral' },
            { part: 'Lines', token: '--v2-text-13, --v2-ink-2, --v2-leading-body', value: 'V2 copy, two blocks', ref: ['credits-settings.ooc.body', 'credits-settings.ooc.line-used', 'credits-settings.ooc.line-refresh'] },
            { part: 'Countdown', token: '--v2-ink, --v2-weight-semibold', value: '6h 42m, 42m, 42s; nowrap', ref: 'credits-settings.countdown.format' },
            { part: 'Day line', token: '--v2-text-13, --v2-weight-medium, --v2-ink', value: 'Proposed copy, from dayStatus' },
            { part: 'Info trigger', token: '--v2-text-13, --v2-ink-3, --v2-hit-min', value: "'What are AI credits?' + info 16", ref: ['credits-settings.ooc.infotip', 'credits-settings.ooc.why-label'] },
            { part: 'Info tip', token: null, value: 'V2Kit.Tooltip kind info, placement up, collision-aware', ref: ['credits-settings.grant.explainer', 'credits-settings.ooc.tip-offset', 'credits-settings.ooc.faq'] },
            { part: 'Got it', token: '--v2-action, --v2-control-lg', value: 'Button primary, full width', ref: ['credits-settings.ooc.got-it', 'credits-settings.ooc.button'] },
            { part: 'Refreshed', token: null, value: "'New credits are here', 'You have 2,000 AI credits for today.'", ref: ['credits-settings.ooc.refreshed-title', 'credits-settings.ooc.refreshed-line'] },
          ]} />
        </G.Part>

        <G.Part name="Zero-credits notice and run end" status="new"
          role="The same refresh time, in local time, before anyone types and at the end of a run that stopped, with what today means.">
          <G.Note>
            Why the product needs it: in V2 the chat says "refreshed tomorrow" twice while the popup counts down, the main chat
            only reveals zero after Send, and no zero message says whether today's day still counts. The notice sits in the
            composer's notice slot (<a className="g-link" href={G.hashHref('composer')}>section 38</a>); the run line is
            RunCard's out-of-credits end (<a className="g-link" href={G.hashHref('run-card')}>section 36</a>).
          </G.Note>
          <G.StateGrid wide states={[
            { label: 'Composer notice, run covered', note: 'before typing', node: note({ dayStatus: 'covered' }) },
            { label: 'Composer notice, run still to come', node: note({ dayStatus: 'waiting' }) },
            { label: 'Run ended: no credits', note: 'day status stated', node: note({ variant: 'run', dayStatus: 'stopped' }) },
          ]} />
          <G.Warn>
            Proposed copy, pending decision D6 (reserve the run's credits or warn before chat dips into them):
            "{K.OOC_COPY.day.covered}" / "{K.OOC_COPY.day.waiting}" / "{K.OOC_COPY.day.stopped}". Whether a run stopped for
            credits loses the day is a program rule the PM confirms.
          </G.Warn>
          <G.SpecDrawer title="V2 today, and the system" rows={[
            { part: 'V2 warning bubble', token: null, value: "'Credits will be refreshed tomorrow.'", ref: 'credits-settings.ooc.warning' },
            { part: 'V2 run end', token: null, value: "'Not enough credits for this job. Credits will be refreshed tomorrow.'", ref: 'credits-settings.ooc.fail' },
            { part: 'V2 composer', token: null, value: "placeholder 'BlueAI is out of credits until tomorrow...', field disabled", ref: ['credits-settings.ooc.placeholder', 'credits-settings.ooc.composer-disabled'] },
            { part: 'V2 main chat', token: null, value: 'zero shown only after Send', ref: 'credits-settings.ooc.trigger' },
            { part: 'Notice', token: 'ComposerNotice tone neutral', value: "'Out of AI credits until 5:30 am tomorrow.' + day line" },
            { part: 'Run line', token: '--v2-danger-ink (icon), --v2-ink, --v2-ink-4', value: 'day line 13/500, refresh 12 meta' },
            { part: 'Time', token: null, value: 'local clock and countdown from useCountdown', ref: 'credits-settings.countdown.utc' },
          ]} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('out-of-credits', OutOfCreditsSection);
})();
