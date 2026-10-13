/* BlueAI Product V2 Design System: AI credits (section 66).
   The allowance screen: what is left today, whether today's run is covered, when credits refresh,
   and the own-key state. Pushed from the top bar's credits chip with Back; the tab you came from
   stays lit. V2's screen has no way back (index.html:982), a Refresh button that does nothing
   (index.html:440), a 54/800 gradient numeral (index.html:518) and never states the grant or the
   reset until the balance is zero. Each fact is said once: the figure says the balance, the meter
   says the refresh and what it means for today (dayStatus from V2Kit.creditsDay, the words every
   short-credit surface uses), and the explainer is V2's, kept word for word (index.html:525-537).
   At zero the banner's tone follows today: danger when today won't count, attention while the
   refill still comes before 9 pm, neutral once the run is covered or done (section 03).

   Credits {worker, state, refillAt, now, keyInfo, tab, onBack, onRetry, onManageKey, onNavigate,
            frame, compact, landmark, preview}
     state     'healthy' (default) | 'low' (less than one run) | 'empty' | 'refreshed' | 'own-key' |
               'loading' (the figure's skeleton) | 'error' (couldn't load, Try again).
     refillAt  the next refill (a Date or ms); default the next 00:00 UTC, V2's day key.
     now       freezes the countdown (guide specimens).  keyInfo {provider, model} for own-key.
     onManageKey()  Settings with Advanced open and own key highlighted (section 61). */
(function () {
  const kit = function () { return window.V2Kit || {}; };
  const noop = function () {};
  // The article V2's Learn more opens (credits_popup_parts.jsx:13).
  const ARTICLE = 'https://bluestacks.ai/getting-started#ai-credits';
  // V2's explainer, the PM's lines (index.html:525, 527, 537). 'task' is flagged, not changed (section 66).
  const EXPLAIN = { title: 'BlueAI runs on credits', lines: ['Every task and job BlueAI does uses credits.', 'You get limited credits for your daily tasks.'] };
  const BANNER_TONE = { stopped: ['danger'], waiting: ['attention'], covered: ['offline', 'clock'] };

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
    const S = window.V2Screens || {};
    const Frame = S.ScreenFrame;
    if (!Frame || !K.StatCard || !K.CreditsMeter || !K.SettingsSection) return <div className="v2-acct-note">The kit or screens/home.jsx is not loaded.</div>;

    const own = state === 'own-key';
    const balance = balanceFor(state, c);
    const runDone = !!(w.today && w.today.status === 'done');
    // What the balance shown means for today, from the record at that balance (section 41).
    const day = K.creditsDay ? K.creditsDay(Object.assign({}, w, { credits: Object.assign({}, c, { left: balance }, p.refillAt != null ? { refillAt: p.refillAt } : null) }), p.now) : 'stopped';
    const tone = BANNER_TONE[day] || BANNER_TONE.stopped;
    const glyph = K.Icon ? <K.Icon name="credits" size={24} /> : null;
    const fmt = function (n) { return Number(n || 0).toLocaleString('en-US'); };

    // V2's banner line. When credits refresh, and what zero means for today, is the meter's to say.
    const banner = state === 'empty' && K.Banner ? (
      <K.Banner tone={tone[0]} icon={tone[1]} title="Out of credits">You’ve used all of today’s AI credits.</K.Banner>
    ) : state === 'refreshed' && K.Banner ? (
      <K.Banner tone="success" title="New credits are here" onDismiss={noop}>
        {'You have ' + fmt(c.grant) + ' AI credits for today.'}
      </K.Banner>
    ) : null;

    const meter = (
      <K.CreditsMeter balance={balance} grant={c.grant} runCost={c.runCost} refillAt={p.refillAt} now={p.now}
        runDone={runDone} refreshed={state === 'refreshed'} dayStatus={day} figure={false} />
    );

    const loading = state === 'loading';
    let main;
    if (state === 'error') main = S.LoadError ? <S.LoadError what="your AI credits" onRetry={p.onRetry || noop} /> : null;
    else if (own) main = <OwnKey keyInfo={p.keyInfo} onManage={p.onManageKey || noop} />;
    else main = <K.StatCard className="v2-acct-credits" label="Left today" icon={glyph} value={balance} loading={loading} action={loading ? null : meter} />;

    return (
      <Frame worker={w} tab={p.tab || 'home'} frame={p.frame} compact={p.compact} landmark={p.landmark} onNavigate={p.onNavigate}
        loading={loading} credits={loading || state === 'error' ? undefined : (own ? { balance: c.left, state: 'paused' } : { balance: balance })}>
        <div className="v2-acct">
          {K.ScreenHeader ? <K.ScreenHeader title="AI credits" onBack={p.onBack || noop} /> : null}
          <div className="v2-acct-body">
            {banner}
            {main}
            <div className="v2-acct-explain">
              <h2>{EXPLAIN.title}</h2>
              <p>{EXPLAIN.lines.map(function (l) { return <span key={l} className="v2-acct-explain-line">{l}</span>; })}</p>
              {K.Link ? <K.Link href={ARTICLE} external>Learn more</K.Link> : null}
            </div>
          </div>
        </div>
      </Frame>
    );
  }

  window.V2Screens = window.V2Screens || {};
  Object.assign(window.V2Screens, { Credits });
})();
