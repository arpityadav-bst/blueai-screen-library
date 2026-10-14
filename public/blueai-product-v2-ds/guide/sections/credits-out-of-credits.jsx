/* Section 48: Out of credits (credits-settings slice). Kit: kit/out-of-credits.jsx.
   V2's zero-balance popup retires: the composer locks at zero and says so before anyone types, so
   the moment the popup answered (a Send at zero) never happens. Clocks are frozen relative to the
   00:00 UTC refill so every specimen reads the same. */
(function () {
  const G = window.V2Guide;
  const REFILL = Date.UTC(2026, 9, 14);
  const NOW = REFILL - (6 * 60 + 42) * 60000;
  const noop = function () {};
  const fill = { width: '100%' };
  const card = { width: '100%', maxWidth: 'var(--v2-dialog-sm)', padding: 'var(--v2-space-4)', background: 'var(--v2-surface)', border: 'var(--v2-stroke) solid var(--v2-line)', borderRadius: 'var(--v2-radius-md)' };

  // The system at the same moment: the field locked before anyone types, the notice saying until when.
  function Locked() {
    const K = window.V2Kit || {};
    if (!K.Composer || !K.OutOfCreditsNotice) return <G.Note>The locked composer needs V2Kit.Composer (section 38).</G.Note>;
    return (
      <div style={fill}>
        <K.Composer disabledReason="You can’t send messages right now"
          notice={<K.OutOfCreditsNotice variant="composer" refillAt={REFILL} now={NOW} dayStatus="covered" />} />
      </div>
    );
  }

  function OutOfCreditsSection() {
    const K = window.V2Kit || {};
    const N = K.OutOfCreditsNotice;
    if (!N || !K.OOC_COPY) return <G.Section id="out-of-credits"><G.Warn>kit/out-of-credits.jsx is not loaded.</G.Warn></G.Section>;
    const note = function (p) { return <div style={fill}><N refillAt={REFILL} now={NOW} {...p} /></div>; };
    const C = K.OOC_COPY;
    return (
      <G.Section id="out-of-credits">
        <G.Note>V3 restyle (2026-10-14): zero balance is a wait, not an error: a neutral panel note with the credits chip's danger dot, no tone of its own and no red banner.</G.Note>
        <G.Part name="Out-of-credits popup (retired)" status="changed"
          role="Retired. V2 stops a send at zero with a popup; the system never lets the partner reach that moment.">
          <G.Note>
            Why it goes: V2 reveals zero only after Send, then opens a popup to say what the composer could have said
            first. The system locks the composer at zero, says why and until when in its notice slot before anyone types
            (section 38), and says once, at the end of a run that stopped, what zero means for today. With nothing left to
            stop, the popup has no moment. Its explainer, “What are AI credits?”, moves to the AI credits screen
            (<a className="g-link" href={G.hashHref('credits-screen')}>section 66</a>), V2’s explainer, kept word for word (index.html:534-546).
          </G.Note>
          <G.CompareRow
            v2={<div style={card}><G.Live get={function () { return window.Byok && window.Byok.OutOfCreditsCard; }} props={{ onDismiss: noop }} label="window.Byok.OutOfCreditsCard" /></div>}
            system={<Locked />}
            changed={'V2 lets the partner type at zero, then stops the send with a popup on its own scrim (rgba(15,23,42,0.5) at z 130, '
              + 'backdrop click only, no role, focus never moves in), a gradient 38/800 zero and a bare 22px (i). The system '
              + 'locks the field before anyone types, with a neutral placeholder, and puts the one wording (“Out of AI credits '
              + 'until 5:30 am tomorrow.” plus what it means for today) in the composer’s notice slot. Nothing to dismiss, '
              + 'nothing to buy.'} />
          <G.SpecDrawer title="V2 today" rows={[
            { part: 'V2 state', token: null, value: '?start=worker&credits=0, then Send in the composer', ref: ['credits-settings.url.credits-zero', 'credits-settings.ooc.trigger'] },
            { part: 'V2 popup', token: null, value: 'width 300, radius 12, scrim rgba(15,23,42,0.5), z 130', ref: ['credits-settings.ooc.card', 'credits-settings.ooc.scrim'] },
            { part: 'V2 keyboard', token: null, value: 'backdrop click only; no Esc, no role, focus never moves in', ref: 'credits-settings.ooc.backdrop' },
            { part: 'V2 lines', token: null, value: 'You’ve used all of today’s AI credits. / Credits will be refreshed in 6h 42m.', ref: ['credits-settings.ooc.line-used', 'credits-settings.ooc.line-refresh'] },
            { part: 'V2 numeral', token: null, value: "'0' 38/800 in gradient text", ref: 'credits-settings.ooc.numeral' },
            { part: 'V2 info', token: null, value: "unlabelled 22px (i), 'What are credits?'", ref: ['credits-settings.ooc.infotip', 'credits-settings.ooc.why-label'] },
            { part: 'The system', token: 'Composer disabledReason + OutOfCreditsNotice', value: 'locked before typing; the notice says until when; no dialog' },
          ]} />
        </G.Part>

        <G.Part name="Zero-credits notice and run end" status="new"
          role="The same refresh time, in local time, before anyone types and at the end of a run that stopped, with what today means.">
          <G.Note>
            Why the product needs it: in V2 the chat says "refreshed tomorrow" twice while the popup counts down, the main chat
            only reveals zero after Send, and no zero message says whether today's day still counts. The notice sits in the
            composer's notice slot (<a className="g-link" href={G.hashHref('composer')}>section 38</a>); the run line is
            RunCard's out-of-credits end (<a className="g-link" href={G.hashHref('run-card')}>section 36</a>). In Chat each
            fact is said once: the run's end carries the day line only, the notice says until when, and the locked field's
            placeholder stays neutral.
          </G.Note>
          <G.StateGrid wide states={[
            { label: 'Composer notice, run covered', note: 'before typing', node: note({ dayStatus: 'covered' }) },
            { label: 'Composer notice, run still to come', node: note({ dayStatus: 'waiting' }) },
            { label: 'Run ended: no credits', note: 'today won’t count: danger', node: note({ variant: 'run', dayStatus: 'stopped' }) },
            { label: 'Run ended: refill before 9 pm', note: 'today can still count: neutral, clock', node: note({ variant: 'run', dayStatus: 'waiting' }) },
          ]} />
          <G.Warn>
            Proposed copy, pending decision D6 (reserve the run's credits or warn before chat dips into them):
            "{C.day.covered}" / "{C.day.waiting}" / "{C.day.stopped}". Whether a run stopped for credits loses the day is
            a program rule the PM confirms.
          </G.Warn>
          <G.SpecDrawer title="V2 today, and the system" rows={[
            { part: 'V2 warning bubble', token: null, value: "'Credits will be refreshed tomorrow.'", ref: 'credits-settings.ooc.warning' },
            { part: 'V2 run end', token: null, value: "'Not enough credits for this job. Credits will be refreshed tomorrow.'", ref: 'credits-settings.ooc.fail' },
            { part: 'V2 composer', token: null, value: "placeholder 'BlueAI is out of credits until tomorrow...', field disabled", ref: ['credits-settings.ooc.placeholder', 'credits-settings.ooc.composer-disabled'] },
            { part: 'V2 main chat', token: null, value: 'zero shown only after Send', ref: 'credits-settings.ooc.trigger' },
            { part: 'Notice', token: 'ComposerNotice tone neutral (--v2-surface-sunken, --v2-line, clock in --v2-ink-3)', value: "'Out of AI credits until 5:30 am tomorrow.' + day line; the one wording section 38 and the chat screen use" },
            { part: 'Run line', token: '--v2-danger-ink (x-circle) when today won’t count, --v2-ink-3 (clock) while it still can; --v2-ink, --v2-ink-4', value: 'day line 13/500, refresh 12 meta; the same tone as the RunCard’s nocredits end' },
            { part: 'Tone', token: null, value: 'section 03’s one rule: neutral with a clock wherever it says until when (nothing failed, nothing is asked); danger with x-circle only on the line that says today won’t count; never attention' },
            { part: 'Time', token: null, value: 'local clock from creditsTime.formatClock; a fixed time, never a ticking countdown', ref: 'credits-settings.countdown.utc' },
          ]} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('out-of-credits', OutOfCreditsSection);
})();
