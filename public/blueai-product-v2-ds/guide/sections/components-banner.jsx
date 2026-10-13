/* Section 21 Banner (display-feedback slice). Kit: window.V2Kit.Banner (kit/notice.jsx). */
(function () {
  const G = window.V2Guide;
  const { useState, useEffect } = React;
  const noop = function () {};
  const full = { width: '100%' };

  /* A ticking value, read once: it sits in aria-live="off" inside the banner's live region. */
  function Countdown() {
    const [end] = useState(function () { return Date.now() + (6 * 60 + 42) * 60000 + 30000; });
    const [now, setNow] = useState(Date.now());
    useEffect(function () {
      const t = setInterval(function () { setNow(Date.now()); }, 1000);
      return function () { clearInterval(t); };
    }, []);
    const left = Math.max(0, end - now);
    const h = Math.floor(left / 3600000);
    const m = Math.floor((left % 3600000) / 60000);
    return <strong aria-live="off">{h}h {m}m</strong>;
  }

  /* V2 today, rendered live: AI Mode with Hybrid unsupported (amber), BYOK on with no key (a
     second amber). The red out-of-credits banner lives in index.html, so it is a URL state. */
  function V2AiNoHw() {
    const A = window.AiMode;
    const m = A.useAiMode({ hwSupported: false });
    return <A.AIModeCard {...m} />;
  }
  function V2ByokNoKey() {
    const B = window.Byok;
    return <B.ByokSettings on keyAdded={false} setOn={noop} onSave={noop} onRemove={noop} />;
  }

  function BannerSection() {
    const K = window.V2Kit || {};
    const Ban = K.Banner;
    /* The dismiss Banner renders for onDismiss (V2Kit.IconButton close, 32), passed as the action node so a
       state can be forced on the real part. */
    function dismiss(force) {
      return K.IconButton ? <K.IconButton icon="close" label="Dismiss" size={32} onClick={noop} className={force} /> : null;
    }
    const ooc = <>You’ve used all of today’s AI credits. Credits will be refreshed in <Countdown />.</>;
    return (
      <G.Section id="banner">
        <G.Part name="Banner" status="changed" role="A condition that holds until it ends, placed above what it is about. Five tones; the words stay in ink.">
          <G.Stage ground="surface" width="shell">
            <Ban tone="offline" icon="clock" title="Out of credits">{ooc}</Ban>
          </G.Stage>
          <ul className="g-list">
            <li>Radius 10, 1px tone line, tone tint, padding 12, gap 8.</li>
            <li>Icon 16 in the tone ink: info, check, alert, x-circle, wifi-off by default.</li>
            <li>Title 13/600 ink (optional), body 13 ink-2; figures in the body are bold, tabular ink.</li>
            <li>One action at most, an underlined link at the trailing edge, 32px target. A dismiss (32px, labelled) only for one-time news.</li>
            <li>Tones: info, success, attention, danger and offline. Offline is Banner’s neutral tone (sunken, line, ink-3 icon): a neutral condition uses tone="offline" with its own icon (the AI mode conflict uses alert, section 49). An unknown tone renders as info.</li>
          </ul>

          <G.StateGrid wide states={[
            { label: 'Info', node: <div style={full}><Ban tone="info">Use the account you applied with</Ban></div> },
            { label: 'Success', note: 'news, dismissible', node: <div style={full}><Ban tone="success" onDismiss={noop}>Yesterday’s run verified.</Ban></div> },
            { label: 'Attention, with action', node: <div style={full}><Ban tone="attention" action={{ label: 'Add a key', onClick: noop }}>No API key configured. Add one to get started.</Ban></div> },
            { label: 'Neutral, live value', note: 'out of AI credits: tone offline with a clock; countdown read once', node: <div style={full}><Ban tone="offline" icon="clock" title="Out of credits">{ooc}</Ban></div> },
            { label: 'Danger, with action', note: 'today is blocked', node: <div style={full}><Ban tone="danger" title="Didn’t finish" action={{ label: 'Try again', onClick: noop }}>Today doesn’t count yet. Try again before 9 pm.</Ban></div> },
            { label: 'Offline (neutral)', node: <div style={full}><Ban tone="offline" title="You’re offline" action={{ label: 'Try again', onClick: noop }}>Today’s run starts when BlueAI is back online.</Ban></div> },
            { label: 'Info, condition with action', note: 'not dismissible', node: <div style={full}><Ban tone="info" icon="zap" action={{ label: 'Change', onClick: noop }}>Automatic is on for YouTube. BlueAI takes paid YouTube jobs without asking.</Ban></div> },
            { label: 'Action: hover', node: <div style={full}><Ban tone="attention" action={K.Link ? <K.Link standalone className="v2-banner-action is-hover">Add a key</K.Link> : null}>No API key configured. Add one to get started.</Ban></div> },
            { label: 'Action: focus-visible', node: <div style={full}><Ban tone="attention" action={K.Link ? <K.Link standalone className="v2-banner-action is-focus">Add a key</K.Link> : null}>No API key configured. Add one to get started.</Ban></div> },
            { label: 'Dismiss: hover', node: <div style={full}><Ban tone="success" action={dismiss('is-hover')}>Yesterday’s run verified.</Ban></div> },
            { label: 'Dismiss: focus-visible', node: <div style={full}><Ban tone="success" action={dismiss('is-focus')}>Yesterday’s run verified.</Ban></div> },
          ]} />

          <G.CompareRow
            v2={<div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--v2-space-3)' }}>
              <G.Live label="AiMode.AIModeCard (Hybrid unsupported)" get={function () { return window.AiMode ? V2AiNoHw : null; }} />
              <G.Live label="Byok.ByokSettings (no key)" get={function () { return window.Byok && window.Byok.ByokSettings ? V2ByokNoKey : null; }} />
              <G.FrameState url="index.html?start=worker&credits=0" label="Out of credits: open the credits pill in the top bar" height={830} />
            </div>}
            system={<div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--v2-space-3)', width: '100%' }}>
              <Ban tone="info">This PC doesn't meet the requirements for Hybrid. Cloud mode will be used.</Ban>
              <Ban tone="attention" action={{ label: 'Add a key', onClick: noop }}>No API key configured. Add one to get started.</Ban>
              <Ban tone="offline" icon="clock" title="Out of credits">{ooc}</Ban>
            </div>}
            changed="Five banners in two blues, two ambers and two reds (edgeless at radius 10, centred at radius 14, a ribbon at radius 10, a sign-in notice at radius 12) become one Banner in five tones, left-aligned, radius 10, with a tone line. The words move to ink so every tone passes 4.5:1. An offline tone is added, and a heads-up that needs nothing from the partner (Hybrid unsupported) is info, not amber. The red out-of-credits banner becomes neutral (the offline tone with a clock): nothing failed and nothing is asked of the partner, and it ends at a known time; attention is kept for an answer the worker needs, danger for a day that is blocked (a run that didn't finish)." />

          <G.SpecDrawer rows={[
            { part: 'Shape', token: '--v2-radius-md', value: '10px, 1px line', ref: ['display-feedback.banner.info-banner', 'display-feedback.banner.ooc', 'display-feedback.banner.login'] },
            { part: 'Padding', token: '--v2-space-3', value: '12px, gap 8', ref: ['display-feedback.banner.info-banner', 'display-feedback.banner.byok'] },
            { part: 'Type', token: '--v2-text-13 / --v2-leading-body', value: 'title 600 ink, body 400 ink-2', ref: ['display-feedback.banner.ooc-title', 'display-feedback.banner.info-banner'] },
            { part: 'Info', token: '--v2-blue-tint / --v2-blue-tint-line / --v2-blue-ink', value: 'blue 8%, blue 24% line, icon #0d5ad6', ref: ['display-feedback.banner.login', 'display-feedback.banner.ribbon'] },
            { part: 'Success', token: '--v2-success-tint / --v2-success-line / --v2-success-ink', value: 'green 8%, green 32% line', ref: 'display-feedback.banner.site-payout' },
            { part: 'Attention', token: '--v2-attention-tint / --v2-attention-line / --v2-attention-ink', value: '#fdf6cf, #f3e8a8, icon #8a6116', ref: ['display-feedback.banner.byok', 'display-feedback.badge.tone-amber'] },
            { part: 'Danger', token: '--v2-danger-tint / --v2-danger-line / --v2-danger-ink', value: '#fdecec, #d0454a, icon #c03a40 (V2 drew out of credits in it; that is neutral now)', ref: 'display-feedback.banner.ooc' },
            { part: 'Offline', token: '--v2-surface-sunken / --v2-line / --v2-ink-3', value: 'neutral, wifi-off icon; out of AI credits uses it with a clock' },
            { part: 'Action', token: '--v2-ink / --v2-link-underline', value: 'V2Kit.Link standalone: 13/500 underlined ink link (32% underline), 32px target' },
            { part: 'Dismiss', token: '--v2-hit-min', value: 'V2Kit.IconButton close, 32px, aria-label Dismiss' },
            { part: 'Copy', token: null, value: 'Use the account you applied with', ref: 'display-feedback.banner.login-copy' },
            { part: 'Copy', token: null, value: 'No API key configured. Add one to get started.', ref: 'display-feedback.banner.byok-copy' },
            { part: 'Copy', token: null, value: 'Out of credits', ref: 'display-feedback.banner.ooc-title' },
            { part: 'Copy', token: null, value: 'You’ve used all of today’s AI credits. Credits will be refreshed in 6h 42m.', ref: ['display-feedback.banner.ooc-copy', 'display-feedback.banner.ooc-refill'] },
            { part: 'Copy', token: null, value: "This PC doesn't meet the requirements for Hybrid. Cloud mode will be used.", ref: 'display-feedback.banner.hw-copy' },
            { part: 'Copy', token: null, value: 'Automatic is on for YouTube. BlueAI takes paid YouTube jobs without asking.', ref: 'display-feedback.banner.ribbon-copy' },
            { part: 'Copy', token: null, value: 'Yesterday’s run verified.', ref: 'display-feedback.stat.verified-line' },
            { part: 'Copy (proposed)', token: null, value: 'Add a key, You’re offline, Today’s run starts when BlueAI is back online., Try again, Didn’t finish, Today doesn’t count yet. Try again before 9 pm.' },
          ]} />

          <G.DoDont
            do={['Place it above what it is about, and remove it when the condition ends.', 'Say what it means for today and the one next step.', 'Keep a ticking value in aria-live="off" so it is read once.']}
            dont={['A dismiss on a condition: it would hide something still true.', 'Centred text or a second tone of the same colour.', 'Two banners stacked: show the one that blocks today.']} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('banner', BannerSection);
})();
