// BlueAI — Chat home: Current vs New variant (for side-by-side comparison)
const { useState, useRef, useEffect } = React;

/* ───────── Category data ───────── */
// CURRENT — faithful to the live ChatView (task counts, old subtexts, build-a-skill card, recent activity)
const CATS_CURRENT = {
  'Game Helpers': {
    icon: 'game', color: '#5B6CF6', bg: '#EEF0FE', border: '#D4D9FB',
    desc: 'Collect rewards, grind dailies automatically',
    prompts: [
      'Collect paid games that are free on Google Play Store everyday at 6:05 AM',
      'Complete the initial boring tutorial of Coin Master game for me',
      'Play Whiteout Survival for 10 min',
      'Collect bonus coins in Disney Solitaire game'] },
  'Social Media': {
    icon: 'social', color: '#E05C8A', bg: '#FCE9F1', border: '#F5C0D5',
    desc: 'Post, campaign & DM on autopilot',
    prompts: ['Scan my girlfriend’s Instagram profile and suggest what I can gift her'] },
  'Productivity': {
    icon: 'productivity', color: '#1BA07A', bg: '#DDF4EE', border: '#A8E4D4',
    desc: 'Schedule tasks and run on autopilot',
    prompts: ['Every morning, brief me on the latest news and my schedule for the day'] },
  'Explore': {
    icon: 'explore', color: '#3B8FD4', bg: '#E4F2FC', border: '#B6D9F4',
    desc: 'Browse the web & search across apps',
    prompts: ['Search the web for active redeem codes for my games'] }
};

// NEW VARIANT — action-led subtexts, no task counts, concrete example prompts, "See all in Skills" link
const CATS_NEW = {
  'Game Helpers': {
    icon: 'game', color: '#5B6CF6', bg: '#EEF0FE', border: '#D4D9FB',
    desc: 'Grabs rewards and grinds dailies for you',
    prompts: [
      "Find a guide for the level I'm stuck on",
      'Complete the initial boring tutorial of the Coin Master game for me',
      'Play Whiteout Survival for 10 min',
      'Collect bonus coins in Disney Solitaire game'] },
  'Social Media': {
    icon: 'social', color: '#E05C8A', bg: '#FCE9F1', border: '#F5C0D5',
    desc: 'Posts, replies, and tracks your profile',
    prompts: [
      "Scan my girlfriend's Instagram profile and suggest what I can gift her",
      'Swipe profiles on my dating apps based on my preferences',
      'Find 3 Reddit threads worth replying to and draft my replies',
      'Draft sponsorship pitches to 5 brands for me'] },
  'Productivity': {
    icon: 'productivity', color: '#1BA07A', bg: '#DDF4EE', border: '#A8E4D4',
    desc: 'Handles chores, reminders, and summaries',
    prompts: [
      'Every morning, brief me on the latest news and my schedule for the day',
      'Wind down my phone for the night and prep tomorrow'] },
  'Explore': {
    icon: 'explore', color: '#3B8FD4', bg: '#E4F2FC', border: '#B6D9F4',
    desc: 'Browses the web and finds what’s trending',
    prompts: [
      'Search the web for active redeem codes for my games',
      'Collect paid games that are free on Google Play Store every day',
      'Recommend and install a new game for me',
      'Suggest an outfit for me today'] }
};

const MOCK_HISTORY = [
  { id: 'h1', prompt: 'Collect my daily rewards across all my games every morning', ts: Date.now() - 3600000 },
  { id: 'h2', prompt: 'Schedule a week of Instagram posts with captions & hashtags', ts: Date.now() - 86400000 },
  { id: 'h3', prompt: 'Search the web for active redeem codes for my games', ts: Date.now() - 86400000 * 3 }];

/* ───────── Icons ───────── */
function ChatCatIcon({ type, size = 14, color = 'currentColor' }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (type === 'game') return <svg {...p}><rect x="2" y="6" width="20" height="12" rx="5" /><line x1="9" y1="12" x2="13" y2="12" /><line x1="11" y1="10" x2="11" y2="14" /><circle cx="17" cy="11" r="1" fill={color} stroke="none" /><circle cx="17" cy="13.5" r="1" fill={color} stroke="none" /></svg>;
  if (type === 'social') return <svg {...p}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>;
  if (type === 'productivity') return <svg {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>;
  if (type === 'explore') return <svg {...p}><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={color} opacity="0.6" stroke="none" /></svg>;
  return null;
}

function fmtTs(ts) {
  const d = new Date(ts);
  const h = d.getHours(), m = d.getMinutes();
  const hh = String(h % 12 || 12).padStart(2, '0');
  const mm = String(m).padStart(2, '0');
  const ampm = h < 12 ? 'AM' : 'PM';
  return `${hh}:${mm}${ampm}`;
}

function aiReply(prompt) {
  return "Got it! I'll take care of that for you. Setting things up now…";
}

/* ───────── Intro ───────── */
function IntroCard({ sub }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', width: '100%', gap: 6, padding: '20px 0px 16px' }}>
      <h2 style={{ fontWeight: 800, color: '#111827', letterSpacing: '-0.4px', lineHeight: 1.2, fontSize: '24px' }}>👋🏻 Hi, I'm BlueAI</h2>
      <p style={{ color: '#6b7280', lineHeight: 1.5, fontSize: '18px' }}>{sub}</p>
    </div>);
}

/* ───────── Conversation bits ───────── */
function ThinkingIndicator() {
  const PHRASES = ['Thinking…', 'Reading the screen…', 'Planning the steps…', 'Working on it…'];
  const [i, setI] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setI((p) => (p + 1) % PHRASES.length), 1100);
    return () => clearInterval(iv);
  }, []);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
      <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg,#0EA4C5,#7B4CFF)', flexShrink: 0, animation: 'ba-pulse 1.4s ease-in-out infinite' }} />
      <span style={{ fontSize: 12, fontWeight: 500, color: '#7B4CFF' }}>{PHRASES[i]}</span>
    </div>);
}

function UserBubble({ msg }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
        <div style={{ padding: '9px 12px', fontSize: 13, lineHeight: 1.45, maxWidth: 240, borderRadius: '14px 14px 0px 14px', border: '1px solid rgba(25,144,255,0.4)', background: 'rgba(25,144,255,0.035)', boxShadow: '0 2px 10px rgba(25,144,255,0.15)' }}>
          <p style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#333' }}>{msg.content}</p>
        </div>
        <span style={{ fontSize: 10, color: '#b0b8c8' }}>{fmtTs(msg.ts)}</span>
      </div>
    </div>);
}

function AiBubble({ msg }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 10 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 3 }}>
        <div style={{ background: 'white', color: '#1f2937', padding: '9px 12px', borderRadius: '14px 14px 14px 0px', fontSize: 13, lineHeight: 1.45, maxWidth: 240, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <p style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{msg.content}</p>
        </div>
        <span style={{ fontSize: 10, color: '#b0b8c8' }}>{fmtTs(msg.ts)}</span>
      </div>
    </div>);
}

/* ───────── Recent Activity (CURRENT only) ───────── */
function HistoryCard({ history, onSelect }) {
  const last = history[0];
  if (!last) return null;
  return (
    <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', marginTop: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px 7px', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em' }}>RECENT ACTIVITY</span>
        </div>
        <button onClick={() => onSelect(last.prompt)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: '#1990FF', fontWeight: 600, fontFamily: 'inherit', padding: 0 }}>See all</button>
      </div>
      <button onClick={() => onSelect(last.prompt)}
        style={{ display: 'flex', alignItems: 'flex-start', width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'background 0.12s', padding: '9px 12px 9px 16px', gap: 16 }}
        onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#f0f4ff', border: '1px solid #e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 12.5, fontWeight: 600, color: '#1e293b', lineHeight: 1.3 }}>{last.prompt}</p>
        </div>
      </button>
    </div>);
}

/* ───────── Build-a-skill CTA (CURRENT only) ───────── */
function BuildSkillCard({ onClick }) {
  return (
    <div style={{ background: 'linear-gradient(135deg,rgba(14,164,197,0.5),rgba(123,76,255,0.5))', borderRadius: 15, padding: 1.5, marginTop: 8 }}>
      <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '11px 14px', background: 'linear-gradient(rgba(255,255,255,0.75),rgba(255,255,255,0.75)),linear-gradient(135deg,#0EA4C5,#7B4CFF)', border: 'none', borderRadius: 13.5, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
        <div style={{ width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'rgb(108,81,185)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 800, lineHeight: 1.2, marginBottom: 2, color: 'rgb(42,16,130)' }}>Talk to BlueAI to build a skill</p>
          <p style={{ fontSize: 11, lineHeight: 1.35, opacity: 0.8, color: 'rgb(100,45,254)' }}>Describe what you need in chat and BlueAI builds it</p>
        </div>
      </button>
    </div>);
}

/* ═════════ CURRENT layout — drill-down, task counts, build-skill, recent activity ═════════ */
function CurrentHome({ onFill, onRunHistory }) {
  const [selectedCat, setSelectedCat] = useState(null);
  const cats = CATS_CURRENT;

  if (selectedCat) {
    const meta = cats[selectedCat];
    return (
      <div>
        <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => setSelectedCat(null)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'white', border: '1px solid #e2e8f0', borderRadius: 999, cursor: 'pointer', color: '#7A8499', fontSize: 12, fontWeight: 600, padding: '5px 12px 5px 9px', fontFamily: 'inherit', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
            Back
          </button>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{selectedCat}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {meta.prompts.map((p, i) =>
            <button key={i} onClick={() => onFill(p)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, border: '1px solid #e2e8f0', borderRadius: 10, background: 'white', padding: '9px 12px', fontSize: 13, color: '#374151', fontWeight: 500, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'background 0.12s, border-color 0.12s' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#c7d2e1'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#e2e8f0'; }}>
              <span>{p}</span>
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
          <div key={name} onClick={() => setSelectedCat(name)}
            style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '10px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, transition: 'transform 0.12s, box-shadow 0.12s' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#c7d2e1'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = '#e2e8f0'; }}>
            <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 10, background: meta.bg, border: '1px solid ' + meta.border, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChatCatIcon type={meta.icon} size={20} color={meta.color} />
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
      <BuildSkillCard onClick={() => onFill("I want to build a custom skill. Here's what I want it to do:\n", true)} />
      <HistoryCard history={MOCK_HISTORY} onSelect={onRunHistory} />
    </div>);
}

/* ═════════ NEW variant — inline accordion, no counts, run-on-tap, "See all in Skills" ═════════ */
function NewHome({ onRun, onFill, onSeeAllInSkills, onOpenHistory }) {
  const [selectedCat, setSelectedCat] = useState(null);
  const cats = CATS_NEW;

  // Drill-down view — same flow as today: tap a category, see its prompts with a back button
  if (selectedCat) {
    const meta = cats[selectedCat];
    return (
      <div style={{ animation: 'baExpand 0.18s ease' }}>
        <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => setSelectedCat(null)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'white', border: '1px solid #e2e8f0', borderRadius: 999, cursor: 'pointer', color: '#7A8499', fontSize: 12, fontWeight: 600, padding: '5px 12px 5px 9px', fontFamily: 'inherit', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
            Back
          </button>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{selectedCat}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {meta.prompts.map((p, i) =>
            <button key={i} onClick={() => onFill(p)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, border: '1px solid #e2e8f0', borderRadius: 10, background: 'white', padding: '9px 12px', fontSize: 13, color: '#374151', fontWeight: 500, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'background 0.12s, border-color 0.12s' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#c7d2e1'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#e2e8f0'; }}>
              <span>{p}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0 }}><polyline points="9 18 15 12 9 6" /></svg>
            </button>)}
        </div>
      </div>);
  }

  // Category list — name + subtext + chevron only (no task counts)
  return (
    <div>
      <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', color: '#94a3b8', marginBottom: 8, textAlign: 'left' }}>WHAT WOULD YOU LIKE TO DO?</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {Object.entries(cats).map(([name, meta]) =>
          <div key={name} onClick={() => setSelectedCat(name)}
            style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '10px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, transition: 'transform 0.12s, box-shadow 0.12s' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#c7d2e1'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = '#e2e8f0'; }}>
            <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 10, background: meta.bg, border: '1px solid ' + meta.border, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChatCatIcon type={meta.icon} size={20} color={meta.color} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13.5, fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>{name}</p>
              <p style={{ fontSize: 11, color: '#6b7280', lineHeight: 1.35, marginTop: 1 }}>{meta.desc}</p>
            </div>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0 }}><polyline points="9 18 15 12 9 6" /></svg>
          </div>)}
      </div>
      {/* Chat history — subtle centered text link, keeps focus on the categories */}
      <button onClick={onOpenHistory}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, margin: '16px auto 4px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', fontFamily: 'inherit', fontSize: 12, fontWeight: 500, color: '#94a3b8', whiteSpace: 'nowrap', transition: 'color 0.12s' }}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#1990FF'; e.currentTarget.querySelector('span').style.textDecoration = 'underline'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.querySelector('span').style.textDecoration = 'none'; }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v5h5" /><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" /><polyline points="12 7 12 12 15 14" /></svg>
        <span>Chat history</span>
      </button>
    </div>);
}

window.ChatCompare = { CATS_CURRENT, CATS_NEW, CurrentHome, NewHome, IntroCard, ThinkingIndicator, UserBubble, AiBubble, ChatCatIcon, aiReply, fmtTs };
