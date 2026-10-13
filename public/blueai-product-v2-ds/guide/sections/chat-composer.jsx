/* Section 38: Composer (chat slice). Composer, ComposerNotice, Stop (SendStop). */
(function () {
  const G = window.V2Guide;
  const { useState, useEffect } = React;
  const noop = function () {};
  const LONG = 'Please skip any job that asks me to comment on a video about politics.\nAlso keep my runs before noon.\nAnd if a job needs Instagram, ask me first.\nOne more line.\nAnd another.\nSeventh line now scrolls inside the field.\nEighth line.';
  const AUTO_TEXT = 'Automatic is on for YouTube. BlueAI takes paid YouTube jobs without asking.';
  // Zero credits uses section 48's notice, which says until when (OOC_COPY.until), with section 48's
  // frozen clock: refill at 00:00 UTC, 6h 42m away. The locked field's placeholder is neutral, so the
  // time is said once, in the notice (as on the chat screen).
  const REFILL = Date.UTC(2026, 9, 14);
  const NOW = REFILL - (6 * 60 + 42) * 60000;

  function OocNotice() {
    const K = window.V2Kit || {};
    if (!K.OutOfCreditsNotice) return <G.Warn>kit/out-of-credits.jsx is not loaded.</G.Warn>;
    return <K.OutOfCreditsNotice variant="composer" refillAt={REFILL} now={NOW} />;
  }
  function OocComposer() {
    const K = window.V2Kit || {};
    return <K.Composer disabledReason="You can’t send messages right now" notice={<OocNotice />} />;
  }

  /* V2's AutoRibbon renders only while some app is on Automatic. This wrapper turns Automatic on
     for YouTube while it is on screen and puts the previous mode back when it leaves. */
  function V2Ribbon() {
    const AP = window.AgentPermissions;
    useEffect(function () {
      if (!AP) return undefined;
      const before = AP.getMode('youtube');
      AP.setMode('youtube', 'auto');
      return function () { AP.setMode('youtube', before); };
    }, []);
    return <G.Live get={function () { return AP && AP.AutoRibbon; }} label="AgentPermissions.AutoRibbon" />;
  }

  function Playable() {
    const K = window.V2Kit;
    const [running, setRunning] = useState(false);
    const [sent, setSent] = useState(null);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
        <K.Composer running={running} paidJob onSend={function (t) { setSent(t); setRunning(true); }} onStop={function () { setRunning(false); }} />
        <G.Note>{running ? 'Running a paid job: Stop asks first. ' : 'Type and press Enter. '}{sent ? 'Last sent: "' + sent + '"' : ''}</G.Note>
      </div>
    );
  }

  function ComposerSection() {
    const K = window.V2Kit;
    const shell = function (node) { return <div style={{ width: '100%' }}>{node}</div>; };
    return (
      <G.Section id="composer">
        <G.Part name="Composer" status="changed" role="One field with honest placeholders, a notice slot for standing conditions, and Send that becomes Stop.">
          <G.StateGrid wide states={[
            { label: 'Rest', node: shell(<K.Composer onSend={noop} />) },
            { label: 'Hover', node: shell(<K.Composer onSend={noop} className="is-hover" />) },
            { label: 'Focus', node: shell(<K.Composer onSend={noop} className="is-focus" />) },
            { label: 'Typing', node: shell(<K.Composer onSend={noop} defaultValue="Skip jobs about politics" />) },
            { label: 'Running (Stop)', node: shell(<K.Composer running onStop={noop} />) },
            { label: 'Awaiting a choice', node: shell(<K.Composer awaiting onStop={noop} />) },
            { label: 'Disabled: out of AI credits until a time', note: 'The notice says until when; the locked field stays neutral.', node: shell(<OocComposer />) },
            { label: 'Max height, then scroll', note: 'Six lines, then the field scrolls.', node: shell(<K.Composer onSend={noop} defaultValue={LONG} />) },
          ]} />
          <G.Note>Try it: send a message to start a pretend paid job, then press Stop.</G.Note>
          <Playable />
          <G.CompareRow
            v2={<G.FrameState url="index.html?start=worker" label="V2 worker home with its composer" height={830} />}
            system={shell(<K.Composer onSend={noop} />)}
            changed="V2 clips text past 120px (overflow hidden), draws a blue-tinted 1.5px rest border at 1.40:1 that reads as focus, mixes '...' and '…', and reveals zero credits only after Send. The system field grows to six lines and then scrolls, rests on the shared field line with the shared focus ring, says what is happening in its placeholder with the … only for work in progress, and shows standing conditions in the notice slot before the partner types." />
          <G.SpecDrawer rows={[
            { part: 'Block', token: '--v2-space-1, --v2-gutter, --v2-space-3', value: 'padding 4 16 12', ref: 'chat.composer.padding' },
            { part: 'Box', token: '--v2-radius-md, --v2-line-strong, --v2-surface', value: 'radius 10, 1px rgba(0,0,0,0.15), white', ref: ['chat.composer.radius', 'chat.composer.border'] },
            { part: 'Hover', token: '--v2-line-hover', value: 'line firms to 20%' },
            { part: 'Focus', token: '--v2-blue, --v2-stroke-selected, --v2-focus-ring', value: '1.5px #156efe + 3px 16% ring', ref: 'chat.composer.ring' },
            { part: 'Field', token: '--v2-text-14, --v2-leading-body, --v2-ink', value: '14/1.5 ink, placeholder ink-4 (4.77:1)', ref: 'chat.composer.textarea' },
            { part: 'Growth', token: null, value: '1 to 6 lines, then overflow-y auto', ref: ['chat.composer.autosize', 'chat.composer.clip'] },
            { part: 'Keys', token: null, value: 'Enter sends, Shift+Enter new line', ref: 'chat.composer.enter' },
            { part: 'Placeholders', token: null, value: '"Type your message" / "BlueAI is working…" / "Answer with the buttons above" / the disabled reason, neutral ("You can’t send messages right now")', ref: ['chat.composer.placeholder-idle', 'chat.composer.placeholder-busy', 'chat.composer.placeholder-ooc'] },
            { part: 'Read-only', token: '--v2-surface-sunken, --v2-line', value: 'sunken fill, 10% edge (TextField read-only); running or awaiting: read-only (still focusable), Stop shown' },
          ]} />
        </G.Part>

        <G.Part name="ComposerNotice" status="changed" role="A condition that holds before you type, said above the field with its one action.">
          <G.StateGrid wide states={[
            { label: 'Automatic is on (info)', note: 'V2 copy.', node: shell(<K.ComposerNotice tone="info" icon="zap" text={AUTO_TEXT} action={{ label: 'Change', onClick: noop }} />) },
            { label: 'Out of AI credits (neutral)', note: 'V2Kit.OutOfCreditsNotice, section 48: neutral with a clock, as out of AI credits shows while today can still count (section 03). Nothing is asked of the partner; the words say until when.', node: shell(<OocNotice />) },
            { label: 'BlueStacks needed (info)', node: shell(<K.ComposerNotice tone="info" icon="monitor" text="Today’s run needs BlueStacks App Player." action={{ label: 'Get BlueStacks', onClick: noop }} />) },
            { label: 'Paused (neutral)', node: shell(<K.ComposerNotice tone="neutral" text="The BlueAI worker is paused until tomorrow." action={{ label: 'Resume', onClick: noop }} />) },
          ]} />
          <G.StateGrid wide states={[
            { label: 'Action hover', note: 'the notice’s own V2Kit.Link, forced with actionClassName', node: shell(<K.ComposerNotice tone="info" icon="zap" text={AUTO_TEXT} action={{ label: 'Change', onClick: noop }} actionClassName="is-hover" />) },
            { label: 'Action focus', node: shell(<K.ComposerNotice tone="info" icon="zap" text={AUTO_TEXT} action={{ label: 'Change', onClick: noop }} actionClassName="is-focus" />) },
          ]} />
          <G.CompareRow
            v2={<V2Ribbon />}
            system={shell(<K.ComposerNotice tone="info" icon="zap" text={AUTO_TEXT} action={{ label: 'Change', onClick: noop }} />)}
            changed="The Automatic ribbon pattern, generalised so zero credits, a missing BlueStacks and a pause show before the partner types, not after Send. Text goes from 12px #1763c6 to 13px ink-2 with the zap in blue ink, the 21px 'Change' becomes a 32px underlined ink link, and the zap from 13 to 16." />
          <G.SpecDrawer rows={[
            { part: 'Shape', token: '--v2-radius-md', value: 'radius 10, 1px line in tone', ref: 'chat.composer.ribbon-fill' },
            { part: 'Info', token: '--v2-blue-tint, --v2-blue-tint-line, --v2-blue-ink, --v2-ink-2', value: 'tint, tint line, icon #0d5ad6, words ink-2' },
            { part: 'Attention', token: '--v2-attention-tint, --v2-attention-line, --v2-attention-ink', value: '#fdf6cf, #f3e8a8, #8a6116: an answer the run waits on' },
            { part: 'Neutral', token: '--v2-surface-sunken, --v2-line, --v2-ink-2', value: 'sunken, line, ink-2; icon ink-3: paused, and out of AI credits until a time (clock)' },
            { part: 'Icon', token: '--v2-icon-sm', value: '16 (was 13)', ref: 'chat.composer.ribbon-icon' },
            { part: 'Text', token: '--v2-text-13, --v2-leading-snug', value: '13/1.35 (was 12)', ref: 'chat.composer.ribbon-text' },
            { part: 'Action', token: '--v2-hit-min, --v2-ink', value: 'underlined ink link, 32px tall, blue-ink on hover', ref: 'chat.composer.ribbon-change' },
            { part: 'Out of AI credits', token: null, value: 'shown before typing, not after Send; V2Kit.OutOfCreditsNotice (section 48), never a second wording', ref: 'chat.composer.ooc-guard' },
          ]} />
        </G.Part>

        <G.Part name="Stop" status="changed" role="Send and Stop share one 36px round button; stopping a paid job asks first and says what it costs.">
          <G.StateGrid states={[
            { label: 'Send ready', node: <K.SendStop mode="send" onClick={noop} /> },
            { label: 'Send hover', node: <K.SendStop mode="send" onClick={noop} className="is-hover" /> },
            { label: 'Send focus', node: <K.SendStop mode="send" onClick={noop} className="is-focus" /> },
            { label: 'Send disabled (empty)', node: <K.SendStop mode="send" disabled /> },
            { label: 'Stop', node: <K.SendStop mode="stop" onClick={noop} /> },
            { label: 'Stop hover', node: <K.SendStop mode="stop" onClick={noop} className="is-hover" /> },
            { label: 'Stop pressed', node: <K.SendStop mode="stop" onClick={noop} className="is-active" /> },
          ]} />
          <G.StateGrid wide states={[
            { label: 'Stop confirm while a paid job runs', note: 'paidJob. Proposed copy.', node: shell(<K.Composer running paidJob confirming onStop={noop} />) },
            { label: 'Stop confirm before a job is taken', note: 'costsDay: running or waiting, no job yet. Proposed copy.', node: shell(<K.Composer running costsDay confirming onStop={noop} />) },
          ]} />
          <G.CompareRow
            v2={<G.FrameState url="index.html?day=next&end=job" label="V2 daily run: Send turns to Stop while the run plays" height={830} />}
            system={<div className="v2-hstack v2-gap-3"><K.SendStop mode="send" onClick={noop} /><K.SendStop mode="stop" onClick={noop} /></div>}
            changed="V2's one button is 34 round, fills #1990FF for Send (white on it is 3.24:1), shows hover by fading, and stops a paid job on one click with no trace ('Stop task'). The system keeps one button that swaps Send for Stop, at 36 round: Send on action blue (4.92:1), Stop white with a 1px line and a 16 stop glyph, hover as colour and wash, and stopping a paid job asks first and leaves a stopped run card." />
          <G.SpecDrawer rows={[
            { part: 'Size', token: '--v2-control-md, --v2-radius-round', value: '36 round (was 34)', ref: 'chat.composer.send-size' },
            { part: 'Send', token: '--v2-action, --v2-action-hover, --v2-on-color', value: '#1268f0, hover #0f5ad4, white glyph (was #1990FF, 3.24:1)', ref: 'chat.composer.send' },
            { part: 'Send disabled', token: '--v2-surface-sunken, --v2-ink-4', value: 'neutral, not pale blue', ref: 'chat.composer.send' },
            { part: 'Stop', token: '--v2-surface, --v2-line-strong, --v2-ink-2', value: 'white, 1px line, stop glyph 16', ref: ['chat.composer.stop-border', 'chat.composer.stop-glyph'] },
            { part: 'Hover', token: '--v2-wash-hover', value: 'colour and wash in CSS, never opacity', ref: 'chat.composer.hover' },
            { part: 'Press', token: null, value: 'translateY 1px' },
            { part: 'Labels', token: null, value: '"Send message" / "Stop the run" ("task" is banned for paid work)', ref: 'chat.composer.aria' },
            { part: 'Confirm', token: '--v2-attention-tint', value: 'costsDay: "Stop now? Today counts only if you run again by 9 pm."; paidJob (a job under way): "Stop now? The paid job won’t finish. Today counts only if you run again by 9 pm." Keep running / Stop run (36px). role=alertdialog labelled by the question; focus moves to Keep running; while it is open, Stop only returns focus to it, so only Stop run stops', ref: ['chat.composer.stop', 'chat.run.stop-trace'] },
          ]} />
          <G.DoDont
            do={['Ask before stopping a paid job, and say what it costs.', 'Leave a stopped run card with its day status.']}
            dont={['Stop a paid job on one click with no trace.', 'Show hover by fading the button.']} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('composer', ComposerSection);
})();
