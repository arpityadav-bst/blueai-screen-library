/* BlueAI: the chat's pre-conversation home: the greeting, four task categories and their prompt
   lists. Split out of chat_product.jsx (2026-08-10) for the 300-line rule.

   V3 (phase 3): the greeting (IntroCard) and the category glyph (ChatCatIcon) moved here from
   chat_compare.jsx, which held nothing else still rendered and was deleted in the V3 cleanup. Categories lost their per-category colour: on the onBlue family colour is a
   signal, never decoration, so the marks are neutral. Since review round 2 (2026-10-14) the lists
   are the kit's ListRow (.v2-row, nav, in one pad-none card: a sunken mark, the label and its
   description, the count as a caption, the chevron), the category head's mark the kit's app
   avatar, and every glyph but the category marks is the kit's Icon. The eyebrow, count badge,
   quiet back button and link are the kit's too; chat.css keeps the home layout.
   Exposes window.ProductHomeScreen. */
(function () {
  const { useState } = React;

  /* Category glyph (game / social / productivity / explore / discover), also used by onboarding.jsx. */
  function ChatCatIcon({ type, size = 16, color = 'currentColor' }) {
    const p = { className: window.icoCls(size), viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' };
    if (type === 'game') return <svg {...p}><rect x="2" y="6" width="20" height="12" rx="5" /><line x1="9" y1="12" x2="13" y2="12" /><line x1="11" y1="10" x2="11" y2="14" /><circle cx="17" cy="11" r="1" fill={color} stroke="none" /><circle cx="17" cy="13.5" r="1" fill={color} stroke="none" /></svg>;
    if (type === 'social') return <svg {...p}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>;
    if (type === 'productivity') return <svg {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>;
    if (type === 'explore') return <svg {...p}><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></svg>;
    if (type === 'discover') return <svg {...p}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
    return null;
  }

  /* ───────── Greeting ───────── */
  // Onboarding chat pushes the greeting down and uses a 16px sub (relax_flow OnboardingChat).
  // title is optional: MoneyMaker's post-login home is the one caller that overrides it.
  function IntroCard({ sub, onboarding, title }) {
    return (
      <div className={'v3-intro' + (onboarding ? ' v3-intro--onboarding' : '')}>
        <h2 className="v2-text-greeting v3-intro-title">{title || "👋🏻 Hi, I'm BlueAI"}</h2>
        <p className="v3-intro-sub">{sub}</p>
      </div>);
  }

  /* ───────── Live home categories (matched to the live app, newer than the export).
     Counts (7/4/4/3) come from the prompt lists; drill-down prompts are best-effort
     assembled from the export's real category prompts (not 1:1 sourced). ───────── */
  const CATS_LIVE = {
    'Social Media': {
      icon: 'social',
      desc: "Posts, replies, and swipes while you're off living.",
      prompts: [
        "Scan my girlfriend's Instagram profile and suggest what I can gift her",
        'Swipe profiles on my dating apps based on my preferences',
        'Find 3 Reddit threads worth replying to and draft my replies',
        'Draft sponsorship pitches to 5 brands for me',
        'Draft replies to my unanswered Discord threads',
        'Re-train my Reels feed toward dog videos',
        'Show me what the people I follow posted this week'] },
    'Game Helpers': {
      icon: 'game',
      desc: 'Grabs your rewards and grinds dailies while you sleep.',
      prompts: [
        "Find a guide for the level I'm stuck on",
        'Complete the initial boring tutorial of the Coin Master game for me',
        'Play Whiteout Survival for 10 min',
        'Collect bonus coins in Disney Solitaire game'] },
    'Explore': {
      icon: 'explore',
      desc: 'Finds free games, fresh fits, and new things to try.',
      prompts: [
        'Search the web for active redeem codes for my games',
        'Collect paid games that are free on Google Play Store every day',
        'Recommend and install a new game for me',
        'Suggest an outfit for me today'] },
    'Productivity': {
      icon: 'productivity',
      desc: 'Chores, reminders, summaries, done before your coffee.',
      prompts: [
        'Every morning, brief me on the latest news and my schedule for the day',
        'Wind down my phone for the night and prep tomorrow',
        'Set up a task that runs automatically every day at 6 AM'] }
  };

  const Icon = (p) => React.createElement(window.V2Kit.Icon, p);
  const Chevron = () => <span className="v2-row-chevron" aria-hidden="true"><Icon name="chevron-right" /></span>;
  const taskCount = (n) => n + ' ' + (n === 1 ? 'task' : 'tasks');

  /* Home category list WITH task counts (matches the live layout). */
  function ProductHome({ onRun, onOpenHistory }) {
    const [selectedCat, setSelectedCat] = useState(null);
    const cats = CATS_LIVE;

    if (selectedCat) {
      const meta = cats[selectedCat];
      return (
        <div style={{ animation: 'baExpand var(--v2-dur-2) var(--v2-ease-out)' }}>
          {/* Back to all categories */}
          <button type="button" className="v2-button v2-button--quiet v2-button--sm v3-back" onClick={() => setSelectedCat(null)}>
            <Icon name="back" />
            All actions
          </button>
          {/* Category header: mark · title · task-count pill · description (matches live) */}
          <div className="v3-cat-head">
            <span className="v2-avatar v2-avatar--40 v2-avatar--app" aria-hidden="true">
              <ChatCatIcon type={meta.icon} size={20} />
            </span>
            <div className="v3-cat-main">
              <div className="v3-cat-line">
                <h3 className="v2-text-title-lg v3-cat-title">{selectedCat}</h3>
                <span className="v2-badge"><span className="v2-badge-label">{taskCount(meta.prompts.length)}</span></span>
              </div>
              <p className="v2-text-body-sm v3-cat-desc">{meta.desc}</p>
            </div>
          </div>
          <div className="v2-card v2-card--pad-none">
            {meta.prompts.map((p, i) =>
              // The category travels with the prompt: Game Helpers needs BlueStacks even when the
              // prompt text names no app ("Find a guide for the level I'm stuck on").
              <button key={i} type="button" className="v2-row v2-row--nav v2-row--divider" onClick={() => onRun(p, selectedCat)}>
                <span className="v2-row-text"><span className="v2-row-label v3-prompt">{p}</span></span>
                <Chevron />
              </button>)}
          </div>
        </div>);
    }

    return (
      <div>
        <p className="v2-text-eyebrow v3-home-eyebrow">What would you like to do?</p>
        <div className="v2-card v2-card--pad-none">
          {Object.entries(cats).map(([name, meta]) =>
            <button key={name} type="button" className="v2-row v2-row--nav v2-row--divider" onClick={() => setSelectedCat(name)}>
              <span className="v2-row-lead" aria-hidden="true"><span className="v2-row-mark"><ChatCatIcon type={meta.icon} size={16} /></span></span>
              <span className="v2-row-text">
                <span className="v2-row-label">{name}</span>
                <span className="v2-row-desc v2-text-body-sm">{meta.desc}</span>
              </span>
              <span className="v2-row-trail v2-text-caption">{taskCount(meta.prompts.length)}</span>
              <Chevron />
            </button>)}
        </div>
        <button type="button" className="v2-link v2-link--standalone v3-home-link" onClick={onOpenHistory}>
          <Icon name="clock" />
          <span className="v2-link-text">Chat history</span>
        </button>
      </div>);
  }

  window.ProductHomeScreen = { ProductHome, IntroCard, CATS_LIVE, ChatCatIcon };
})();
