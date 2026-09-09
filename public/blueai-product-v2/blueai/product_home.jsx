/* BlueAI — the chat's pre-conversation home: four task categories and their prompt lists.
   Split out of chat_product.jsx (2026-08-10) for the 300-line rule.
   Exposes window.ProductHomeScreen. */
(function () {
  const { useState, useRef, useEffect } = React;

  /* ───────── Live home categories (matched to the live app — newer than the export).
     Counts (7/4/4/3) come from the prompt lists; drill-down prompts are best-effort
     assembled from the export's real category prompts (not 1:1 sourced). ───────── */
  const CATS_LIVE = {
    'Social Media': {
      icon: 'social', color: '#E05C8A', bg: '#FCE9F1', border: '#F5C0D5',
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
      icon: 'game', color: '#5B6CF6', bg: '#EEF0FE', border: '#D4D9FB',
      desc: 'Grabs your rewards and grinds dailies while you sleep.',
      prompts: [
        "Find a guide for the level I'm stuck on",
        'Complete the initial boring tutorial of the Coin Master game for me',
        'Play Whiteout Survival for 10 min',
        'Collect bonus coins in Disney Solitaire game'] },
    'Explore': {
      icon: 'explore', color: '#3B8FD4', bg: '#E4F2FC', border: '#B6D9F4',
      desc: 'Finds free games, fresh fits, and new things to try.',
      prompts: [
        'Search the web for active redeem codes for my games',
        'Collect paid games that are free on Google Play Store every day',
        'Recommend and install a new game for me',
        'Suggest an outfit for me today'] },
    'Productivity': {
      icon: 'productivity', color: '#1BA07A', bg: '#DDF4EE', border: '#A8E4D4',
      desc: 'Chores, reminders, summaries — done before your coffee.',
      prompts: [
        'Every morning, brief me on the latest news and my schedule for the day',
        'Wind down my phone for the night and prep tomorrow',
        'Set up a task that runs automatically every day at 6 AM'] }
  };

  /* Home category list WITH task counts (matches the live layout). */
  function ProductHome({ onRun, onOpenHistory }) {
    const [selectedCat, setSelectedCat] = useState(null);
    const C = window.ChatCompare;
    const cats = CATS_LIVE;

    if (selectedCat) {
      const meta = cats[selectedCat];
      return (
        <div style={{ animation: 'baExpand 0.18s ease' }}>
          {/* Back to all categories */}
          <button onClick={() => setSelectedCat(null)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'white', border: '1px solid #e2e8f0', borderRadius: 999, cursor: 'pointer', color: '#7A8499', fontSize: 12, fontWeight: 600, padding: '5px 12px 5px 9px', fontFamily: 'inherit', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
            All Actions
          </button>
          {/* Category header: icon · title · task-count pill · description (matches live) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '14px 0' }}>
            <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 11, background: meta.bg, border: '1px solid ' + meta.border, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <C.ChatCatIcon type={meta.icon} size={22} color={meta.color} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontSize: 17, fontWeight: 800, color: '#111827', letterSpacing: '-0.3px' }}>{selectedCat}</span>
                <span style={{ flexShrink: 0, background: meta.bg, color: meta.color, fontSize: 11.5, fontWeight: 700, borderRadius: 999, padding: '3px 10px' }}>{meta.prompts.length} {meta.prompts.length === 1 ? 'task' : 'tasks'}</span>
              </div>
              <p style={{ fontSize: 11.5, color: '#6b7280', lineHeight: 1.35, marginTop: 2 }}>{meta.desc}</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {meta.prompts.map((p, i) =>
              // The category travels with the prompt: Game Helpers needs BlueStacks even when the
              // prompt text names no app ("Find a guide for the level I'm stuck on").
              <button key={i} onClick={() => onRun(p, selectedCat)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, border: '1px solid #e2e8f0', borderRadius: 11, background: 'white', padding: '13px 14px', fontSize: 13.5, lineHeight: 1.4, color: '#374151', fontWeight: 500, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'background 0.12s, border-color 0.12s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#c7d2e1'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#e2e8f0'; }}>
                <span style={{ textWrap: 'pretty' }}>{p}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0 }}><polyline points="9 18 15 12 9 6" /></svg>
              </button>)}
          </div>
        </div>);
    }

    return (
      <div>
        <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', color: '#94a3b8', marginBottom: 8, textAlign: 'left' }}>WHAT WOULD YOU LIKE TO DO?</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {Object.entries(cats).map(([name, meta]) =>
            <div key={name} role="button" tabIndex={0} onClick={() => setSelectedCat(name)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedCat(name); } }}
              style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '10px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, transition: 'transform 0.12s, box-shadow 0.12s' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#c7d2e1'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = '#e2e8f0'; }}>
              <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 10, background: meta.bg, border: '1px solid ' + meta.border, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <C.ChatCatIcon type={meta.icon} size={20} color={meta.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13.5, fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>{name}</p>
                <p style={{ fontSize: 11, color: '#6b7280', lineHeight: 1.35, marginTop: 1 }}>{meta.desc}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8' }}>{meta.prompts.length} {meta.prompts.length === 1 ? 'task' : 'tasks'}</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
              </div>
            </div>)}
        </div>
        <button onClick={onOpenHistory}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, margin: '16px auto 4px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', fontFamily: 'inherit', fontSize: 12, fontWeight: 500, color: '#94a3b8', whiteSpace: 'nowrap', transition: 'color 0.12s' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#1990FF'; e.currentTarget.querySelector('span').style.textDecoration = 'underline'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.querySelector('span').style.textDecoration = 'none'; }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v5h5" /><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" /><polyline points="12 7 12 12 15 14" /></svg>
          <span>Chat History</span>
        </button>
      </div>);
  }

  window.ProductHomeScreen = { ProductHome, CATS_LIVE };
})();
