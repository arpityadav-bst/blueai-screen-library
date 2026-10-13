/* BlueAI Product V2 Design System: AI credits (section 66).
   The allowance screen: what is left today, whether today's run is covered, when credits refresh,
   and the own-key state. Pushed from the top bar's credits chip with Back; the tab you came from
   stays lit. V2's screen has no way back (index.html:982), a Refresh button that does nothing
   (index.html:440), a 54/800 gradient numeral (index.html:518) and never states the grant or the
   reset until the balance is zero. The explainer copy is V2's, kept word for word.

   Credits {worker, state, refillAt, now, keyInfo, tab, onBack, onManageKey, frame, compact, landmark, preview}
     state     'healthy' (default) | 'low' (less than one run) | 'empty' | 'refreshed' | 'own-key'.
     refillAt  the next refill (a Date or ms); default the next 00:00 UTC, V2's day key.
     now       freezes the countdown (guide specimens).  keyInfo {provider, model} for own-key.
     onManageKey()  Settings with Advanced open and own key highlighted (section 61). */
(function () {
  const kit = function () { return window.V2Kit || {}; };
  const noop = function () {};
  // The article V2's Learn more opens (credits_popup_parts.jsx:13).
  const ARTICLE = 'https://bluestacks.ai/getting-started#ai-credits';

  function fixture(state) {
    const f = kit().workerFixtures || {};
    return (state === 'low' || state === 'empty' ? f.noCredits : f.verified) || f.verified || {};
  }
  function balanceFor(state, c) {
    if (state === 'empty') return 0;
    if (state === 'refreshed') return c.grant;
    return c.left;
  }

  function OwnKey({ keyInfo, onManage }) {
    const K = kit();
    const k = keyInfo || { provider: 'Anthropic', model: 'claude-haiku-4-5' };
    return (
      <K.SettingsSection id="own-key" title="Running on your own key" description="No AI credits are used while this is on."
        action={K.Badge ? <K.Badge tone="success">On</K.Badge> : null}>
        <K.ListRow label="Provider" value={k.provider} />
        <K.ListRow label="Model" value={k.model} />
        <K.ListRow label="Manage in Settings" onClick={onManage} />
      </K.SettingsSection>
    );
  }

  function Credits(props) {
    const K = kit();
    const p = props;
    const state = p.state || 'healthy';
    const w = p.worker || fixture(state);
    const c = Object.assign({ left: 1640, grant: 2000, runCost: 360 }, w.credits);
    const t = K.useCountdown ? K.useCountdown(p.refillAt, { now: p.now }) : { left: '', clock: '' };
    const Frame = (window.V2Screens || {}).AccountFrame;
    if (!Frame || !K.StatCard || !K.CreditsMeter || !K.SettingsSection) return <div className="v2-acct-note">The kit is not loaded.</div>;

    const own = state === 'own-key';
    const balance = balanceFor(state, c);
    const runDone = !!(w.today && w.today.status === 'done');
    const glyph = K.Icon ? <K.Icon name="credits" size={24} /> : null;
    const fmt = function (n) { return Number(n || 0).toLocaleString('en-US'); };

    // V2's banner lines, kept word for word. What zero means for today is the meter's covered line,
    // so it is said once.
    const banner = state === 'empty' && K.Banner ? (
      <K.Banner tone="danger" title="Out of credits">
        You’ve used all of today’s AI credits. Credits will be refreshed in <strong aria-live="off">{t.left}</strong>.
      </K.Banner>
    ) : state === 'refreshed' && K.Banner ? (
      <K.Banner tone="success" title="New credits are here" onDismiss={noop}>
        {'You have ' + fmt(c.grant) + ' AI credits for today.'}
      </K.Banner>
    ) : null;

    const meter = (
      <K.CreditsMeter balance={balance} grant={c.grant} runCost={c.runCost} refillAt={p.refillAt} now={p.now}
        runDone={runDone} refreshed={state === 'refreshed'} />
    );

    return (
      <Frame worker={w} tab={p.tab || 'home'} frame={p.frame} compact={p.compact} landmark={p.landmark}
        credits={own ? { balance: c.left, state: 'paused' } : { balance: balance }}>
        {K.ScreenHeader ? <K.ScreenHeader title="AI credits" onBack={p.onBack || noop} /> : null}
        <div className="v2-acct-body">
          {banner}
          {own
            ? <OwnKey keyInfo={p.keyInfo} onManage={p.onManageKey || noop} />
            : <K.StatCard className="v2-acct-credits" label="Left today" icon={glyph} value={balance} action={meter} />}
          <div className="v2-acct-explain">
            <h2>BlueAI runs on credits</h2>
            <p>Every task and job BlueAI does uses credits.</p>
            <p>You get limited credits for your daily tasks.</p>
            {K.Link ? <K.Link href={ARTICLE} external>Learn more</K.Link> : null}
          </div>
        </div>
      </Frame>
    );
  }

  window.V2Screens = window.V2Screens || {};
  Object.assign(window.V2Screens, { Credits });
})();
