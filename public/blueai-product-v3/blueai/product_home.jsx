/* BlueAI: the chat's pre-conversation home: the greeting, four task categories and their prompt
   lists. Split out of chat_product.jsx (2026-08-10) for the 300-line rule.

   V3 (phase 3): the greeting (IntroCard) moved here from chat_compare.jsx, which was over the
   300-line rule. Categories lost their per-category colour: on the onBlue family colour is a
   signal, never decoration, so the tiles are neutral and the rows are the phase-2 pressable row
   (surface, 1px line, hover to the panel surface). Styles in chat.css.
   Exposes window.ProductHomeScreen. */
(function () {
  const { useState } = React;

  /* ───────── Greeting ───────── */
  // Onboarding chat pushes the greeting down and uses a 16px sub (relax_flow OnboardingChat).
  // title is optional: MoneyMaker's post-login home is the one caller that overrides it.
  function IntroCard({ sub, onboarding, title }) {
    return (
      <div className={'v3-intro' + (onboarding ? ' v3-intro--onboarding' : '')}>
        <h2 className="v3-intro-title">{title || "👋🏻 Hi, I'm BlueAI"}</h2>
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

  const Chevron = () =>
    <svg className="v3-ico" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}><polyline points="9 18 15 12 9 6" /></svg>;
  const taskCount = (n) => n + ' ' + (n === 1 ? 'task' : 'tasks');

  /* Home category list WITH task counts (matches the live layout). */
  function ProductHome({ onRun, onOpenHistory }) {
    const [selectedCat, setSelectedCat] = useState(null);
    const C = window.ChatCompare;
    const cats = CATS_LIVE;

    if (selectedCat) {
      const meta = cats[selectedCat];
      return (
        <div style={{ animation: 'baExpand var(--v2-dur-2) var(--v2-ease-out)' }}>
          {/* Back to all categories */}
          <button className="v3-quiet v3-quiet--back" onClick={() => setSelectedCat(null)}>
            <svg className="v3-ico" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
            All Actions
          </button>
          {/* Category header: icon · title · task-count pill · description (matches live) */}
          <div className="v3-cat-head">
            <div className="v3-row-tile v3-row-tile--lg">
              <C.ChatCatIcon type={meta.icon} size={22} />
            </div>
            <div className="v3-row-main">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--v2-space-2)' }}>
                <h3 className="v3-cat-title">{selectedCat}</h3>
                <span className="v3-count">{taskCount(meta.prompts.length)}</span>
              </div>
              <p className="v3-row-desc">{meta.desc}</p>
            </div>
          </div>
          <div className="v3-rows">
            {meta.prompts.map((p, i) =>
              // The category travels with the prompt: Game Helpers needs BlueStacks even when the
              // prompt text names no app ("Find a guide for the level I'm stuck on").
              <button key={i} className="v3-row v3-row--prompt" onClick={() => onRun(p, selectedCat)}>
                <span>{p}</span>
                <span className="v3-row-end"><Chevron /></span>
              </button>)}
          </div>
        </div>);
    }

    return (
      <div>
        <p className="v3-eyebrow" style={{ marginBottom: 'var(--v2-space-2)' }}>WHAT WOULD YOU LIKE TO DO?</p>
        <div className="v3-rows">
          {Object.entries(cats).map(([name, meta]) =>
            <button key={name} className="v3-row" onClick={() => setSelectedCat(name)}>
              <div className="v3-row-tile">
                <C.ChatCatIcon type={meta.icon} size={20} />
              </div>
              <div className="v3-row-main">
                <span className="v3-row-title">{name}</span>
                <span className="v3-row-desc">{meta.desc}</span>
              </div>
              <span className="v3-row-end">{taskCount(meta.prompts.length)}<Chevron /></span>
            </button>)}
        </div>
        <button className="v3-quiet v3-quiet--link" onClick={onOpenHistory}>
          <svg className="v3-ico" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 3v5h5" /><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" /><polyline points="12 7 12 12 15 14" /></svg>
          <span>Chat History</span>
        </button>
      </div>);
  }

  window.ProductHomeScreen = { ProductHome, IntroCard, CATS_LIVE };
})();
