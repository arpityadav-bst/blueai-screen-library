// Out-of-credits on the AI Credits page (2026-10-06): the same two changes as the popup,
// a refresh time and an explanation of credits, applied to the page the header pill opens.
//
// Layout values are the live AICredits.tsx zero state: red banner above a near-empty white
// card holding only the balance. When the timer runs out the banner goes and the healthy state
// returns: the balance plus the page's existing "BlueAI runs on credits" explainer.
//
// Exposes window.CreditsPageOptions = [{ id, label, note, render }].
(function () {
  const P = window.CreditsPopupParts;
  const { Header, BottomNav, Window } = window.CreditsPopupFrame;
  const { InfoTip, DAILY } = P;
  const USED = 'You’ve used all of today’s AI credits.';
  // The approved explainer, minus its first sentence: on this page that sentence is already the
  // heading above the body ("BlueAI runs on credits"), so it is not said twice.
  const EXPLAIN_BODY = P.EXPLAIN_CREDITS.replace(/^BlueAI runs on credits\. /, '');
  const Learn = () => <P.LearnLink style={{ marginTop: 10, fontSize: 13 }} />;

  const RefreshIcon = () => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12a8 8 0 1 1-2.5-5.8" /><path d="M20 4v5h-5" /></svg>
  );
  const Red = ({ children }) => <strong style={{ color: '#991b1b', fontWeight: 700, whiteSpace: 'nowrap' }}>{children}</strong>;

  // The live banner: rounded 14, #f8d7d7 border on #fdecec, centred, title 14.5 extrabold.
  function Banner({ title, lines }) {
    return (
      <div style={{ flexShrink: 0, borderRadius: 14, border: '1px solid #f8d7d7', background: '#fdecec', padding: '14px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: 14.5, fontWeight: 800, color: '#991b1b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>{title}</div>
        <p style={{ marginTop: 3, fontSize: 12.5, lineHeight: 1.55, color: '#b04a4a' }}>
          {lines.map((l, i) => <span key={i} style={{ display: 'block' }}>{l}</span>)}
        </p>
      </div>
    );
  }

  // The balance card. Zero state: 30px icon, 38px number. Healthy: 44 and 54, plus the explainer.
  // `large` keeps the healthy size at 0, for the layout that puts the message under the number.
  function BalanceCard({ balance, large, children }) {
    const zero = balance === 0 && !large;
    return (
      <div style={{ flex: 1, minHeight: 200, display: 'flex', flexDirection: 'column', borderRadius: 16, border: '1px solid #e8edf3', background: 'white', padding: 22, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: zero ? 9 : 12 }}>
            <span className="v3-cr-ink" aria-hidden="true"><window.V2Kit.Icon name="credits" size={zero ? 30 : 44} /></span>
            <span style={{ ...P.gradText, fontSize: zero ? 38 : 54, fontWeight: 700, lineHeight: 1, letterSpacing: zero ? '-0.7px' : '-1px' }}>{balance.toLocaleString()}</span>
          </div>
          {children}
        </div>
      </div>
    );
  }

  // The page's existing healthy-state copy (credits.runs_on_credits / _msg), unchanged.
  const HealthyExplainer = () => (
    <div style={{ marginTop: 20 }}>
      <p style={{ fontSize: 16, fontWeight: 800, color: '#111827' }}>BlueAI runs on credits</p>
      <p style={{ marginTop: 6, fontSize: 13, lineHeight: 1.6, color: '#6b7280' }}>
        <span style={{ display: 'block' }}>Every task and job BlueAI does uses credits.</span>
        <span style={{ display: 'block' }}>You get limited credits for your daily tasks.</span>
      </p>
    </div>
  );

  function Page({ balance, banner, large, children }) {
    return (
      <Window>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
          <Header balance={balance} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px 4px' }}>
            <h1 style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-0.3px', color: '#111827' }}>AI Credits</h1>
            <RefreshIcon />
          </div>
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 12, padding: '18px 18px 22px' }}>
            {banner}
            <BalanceCard balance={balance} large={large}>{children}</BalanceCard>
          </div>
          <BottomNav active={null} />
        </div>
      </Window>
    );
  }

  const Healthy = () => <Page balance={DAILY}><HealthyExplainer /></Page>;

  // Now: the live page.
  const PageNow = () => (
    <Page balance={0} banner={<Banner title="Out of credits" lines={[USED, 'Credits will be refreshed tomorrow.']} />} />
  );

  // 1: the popup's option B, carried over. Timer in the banner, (i) by its title, tooltip opens
  // downward over the card, which only holds the 0.
  function Page1({ t }) {
    if (t.refreshed) return <Healthy />;
    return (
      <Page balance={0} banner={<Banner title={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>Out of credits <InfoTip dir="down" palette="red" /></span>} lines={[USED, <span>Credits will be refreshed in <Red>{t.leftText}</Red>.</span>]} />} />
    );
  }

  // 2: no (i). The page has room, so the explanation sits in the card under the 0, where the
  // healthy state already puts it. The live zero state hides it to avoid repeating the banner;
  // here it says something the banner does not (how many, and for what).
  function Page2({ t }) {
    if (t.refreshed) return <Healthy />;
    return (
      <Page balance={0} banner={<Banner title="Out of credits" lines={[USED, <span>Credits will be refreshed in <Red>{t.leftText}</Red>.</span>]} />}>
        <div style={{ marginTop: 20 }}>
          <p style={{ fontSize: 16, fontWeight: 800, color: '#111827' }}>BlueAI runs on credits</p>
          <p style={{ marginTop: 6, fontSize: 13, lineHeight: 1.6, color: '#6b7280' }}>
            {EXPLAIN_BODY}
          </p>
          <Learn />
        </div>
      </Page>
    );
  }

  // ---- With credits: the header pill opened while the balance is healthy.
  // Live, the page says only "BlueAI runs on credits / Every task and job BlueAI does uses credits.
  // / You get limited credits for your daily tasks." No amount, no time. These two options give it
  // the same numbers the out-of-credits screens now carry, so people learn the rule BEFORE they
  // hit 0. Sample balance 1,250: half of the day's grant gone, above the pill's 1,000 red-dot line.
  const SAMPLE = 1250;
  const Muted = ({ children }) => <p style={{ marginTop: 10, fontSize: 12.5, color: '#94a3b8' }}>{children}</p>;

  const HealthyNow = () => <Page balance={SAMPLE}><HealthyExplainer /></Page>;

  // 1: the explainer gets the real numbers, and one muted line says when the refill is.
  function Healthy1({ t }) {
    const balance = t.refreshed ? DAILY : SAMPLE;
    return (
      <Page balance={balance}>
        <div style={{ marginTop: 20 }}>
          <p style={{ fontSize: 16, fontWeight: 800, color: '#111827' }}>BlueAI runs on credits</p>
          <p style={{ marginTop: 6, fontSize: 13, lineHeight: 1.6, color: '#6b7280' }}>
            {EXPLAIN_BODY}
          </p>
          <Muted>{t.refreshed ? 'Refreshed for today.' : <span>Credits will be refreshed in <strong style={{ color: '#6b7280', fontWeight: 600, whiteSpace: 'nowrap' }}>{t.leftText}</strong>.</span>}</Muted>
          <Learn />
        </div>
      </Page>
    );
  }

  // 2: a "today" meter under the balance: how much of the day's grant is left and when it refills.
  // Not the v2-removed spend-cap meter (that measured a user-set limit that no longer exists);
  // this measures the grant itself, which is real.
  function Healthy2({ t }) {
    const balance = t.refreshed ? DAILY : SAMPLE;
    const pct = Math.min(100, Math.round((balance / DAILY) * 100));
    return (
      <Page balance={balance}>
        <div style={{ width: '100%', maxWidth: 260, marginTop: 18 }}>
          <div style={{ height: 6, borderRadius: 999, background: '#e8edf3', overflow: 'hidden' }}>
            <div style={{ width: pct + '%', height: '100%', borderRadius: 999, background: 'linear-gradient(90deg,#0EA4C5,#7B4CFF)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 7, fontSize: 12, color: '#6b7280' }}>
            <span>{balance.toLocaleString()} of {DAILY.toLocaleString()} left today</span>
            <span style={{ whiteSpace: 'nowrap' }}>{t.refreshed ? 'Refreshed' : 'Refreshes in ' + t.leftText}</span>
          </div>
        </div>
        <div style={{ marginTop: 22 }}>
          <p style={{ fontSize: 16, fontWeight: 800, color: '#111827' }}>BlueAI runs on credits</p>
          <p style={{ marginTop: 6, fontSize: 13, lineHeight: 1.6, color: '#6b7280' }}>
            {EXPLAIN_BODY}
          </p>
          <Learn />
        </div>
      </Page>
    );
  }

  // 3: the live copy, untouched, plus the Learn more link.
  function Healthy3({ t }) {
    return (
      <Page balance={t.refreshed ? DAILY : SAMPLE}>
        <HealthyExplainer />
        <Learn />
      </Page>
    );
  }

  window.CreditsHealthyOptions = [
    { id: 'hnow', label: 'Now', note: 'Live today. Says credits are limited, not how many or until when.', render: (t) => <HealthyNow t={t} /> },
    { id: 'h1', label: 'Option 1', note: 'The explainer gets the real numbers, plus one line with the refresh time.', render: (t) => <Healthy1 t={t} /> },
    { id: 'h2', label: 'Option 2', note: 'A "today" meter under the balance: how much of the 2,500 is left and when it refills.', render: (t) => <Healthy2 t={t} /> },
    { id: 'h3', label: 'Option 3', note: 'The live copy as is, plus Learn more.', render: (t) => <Healthy3 t={t} /> },
  ];

  // Out of credits, 3: no banner. The message sits in the card under the 0, in the same place
  // the healthy state puts its explainer, so the page keeps one shape in both states. The 0
  // stays at the healthy size for the same reason. Red is kept for the title only.
  function Page3({ t }) {
    if (t.refreshed) return <Healthy />;
    return (
      <Page balance={0} large>
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#991b1b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>Out of credits <InfoTip dir="up" palette="red" /></div>
          <p style={{ marginTop: 6, fontSize: 13, lineHeight: 1.6, color: '#6b7280' }}>
            <span style={{ display: 'block' }}>{USED}</span>
            <span style={{ display: 'block' }}>Credits will be refreshed in <strong style={{ color: '#111827', fontWeight: 700, whiteSpace: 'nowrap' }}>{t.leftText}</strong>.</span>
          </p>
          <Learn />
        </div>
      </Page>
    );
  }

  window.CreditsPageOptions = [
    { id: 'pnow', label: 'Now', note: 'Live today.', render: (t) => <PageNow t={t} /> },
    { id: 'p1', label: 'Option 1', note: 'Same as popup B: timer in the banner, (i) by the title, tooltip opens over the card.', render: (t) => <Page1 t={t} /> },
    { id: 'p2', label: 'Option 2', note: 'Timer in the banner. The explanation sits in the card under the 0, no (i) needed.', render: (t) => <Page2 t={t} /> },
    { id: 'p3', label: 'Option 3', note: 'No banner. The message sits under the 0, where the healthy page puts its explainer.', render: (t) => <Page3 t={t} /> },
  ];
})();
