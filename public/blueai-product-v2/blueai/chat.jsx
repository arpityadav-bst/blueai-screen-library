// BlueAI — Chat Screen

const { useState, useRef, useEffect } = React;

// ── Baseline: function-of-task buckets (today) ──────────────────
const CHAT_CATS = {
  'Game Helpers': {
    icon: 'game', color: '#5B6CF6', bg: '#EEF0FE', border: '#D4D9FB',
    desc: 'Collect rewards, grind dailies automatically',
    prompts: [
    'Collect paid games that are free on Google Play Store everyday at 6:05 AM',
    'Complete the initial boring tutorial of Coin Master game for me',
    'Play Whiteout Survival for 10 min',
    'Collect bonus coins in Disney Solitaire game']

  },
  'Social Media': {
    icon: 'social', color: '#E05C8A', bg: '#FCE9F1', border: '#F5C0D5',
    desc: 'Post, campaign & DM on autopilot',
    prompts: [
    'Scan my girlfriend’s Instagram profile and suggest what I can gift her']

  },
  'Productivity': {
    icon: 'productivity', color: '#1BA07A', bg: '#DDF4EE', border: '#A8E4D4',
    desc: 'Schedule tasks and run on autopilot',
    prompts: [
    'Every morning, brief me on the latest news and my schedule for the day']

  },
  'Explore': {
    icon: 'explore', color: '#3B8FD4', bg: '#E4F2FC', border: '#B6D9F4',
    desc: 'Browse the web & search across apps',
    prompts: [
    'Search the web for active redeem codes for my games']

  }
};

// ── Option A: persona buckets (identity-led labels, outcome-led tasks) ──
const PERSONA_CATS = {
  'For gamers': {
    icon: 'game', color: '#5B6CF6', bg: '#EEF0FE', border: '#D4D9FB',
    desc: 'Auto-collect rewards & grind while you’re away',
    prompts: [
    'Collect my daily rewards across all my games every morning',
    'Finish the boring tutorial in Coin Master for me',
    'Auto-farm my dailies in Whiteout Survival for 10 min',
    'Find and redeem active gift codes for my games']

  },
  'For social & creators': {
    icon: 'social', color: '#E05C8A', bg: '#FCE9F1', border: '#F5C0D5',
    desc: 'Post, grow and engage without lifting a finger',
    prompts: [
    'Schedule a week of Instagram posts with captions & hashtags',
    'Scan a profile and suggest a personalised gift',
    'Reply to my DMs with quick, friendly responses']

  },
  'For productivity pros': {
    icon: 'productivity', color: '#1BA07A', bg: '#DDF4EE', border: '#A8E4D4',
    desc: 'Put repetitive chores on a schedule',
    prompts: [
    'Every morning, brief me on the news and my schedule',
    'Set up a task that runs automatically every day at 6 AM',
    'Track prices and alert me when something drops']

  },
  'Just exploring': {
    icon: 'explore', color: '#3B8FD4', bg: '#E4F2FC', border: '#B6D9F4',
    desc: 'Not sure yet? See what BlueAI can do',
    prompts: [
    'Show me what you can do',
    'Search the web for active redeem codes for my games',
    'Help me build my own custom automation']

  }
};

// ── Option C: benefit buckets (the promise leads) ───────────────
const BENEFIT_CATS = {
  'Earn rewards while you sleep': {
    icon: 'rewards', color: '#B45309', bg: '#FEF3C7', border: '#FDE68A',
    desc: 'Daily spins, coins & gift codes, collected for you',
    prompts: [
    'Collect my daily rewards across all my games every morning',
    'Find and redeem active gift codes for my games',
    'Auto-farm my dailies in Whiteout Survival']

  },
  'Grow your audience': {
    icon: 'grow', color: '#E05C8A', bg: '#FCE9F1', border: '#F5C0D5',
    desc: 'Keep posting & engaging on autopilot',
    prompts: [
    'Schedule a week of Instagram posts with captions & hashtags',
    'Scan a profile and suggest a personalised gift']

  },
  'Put chores on autopilot': {
    icon: 'autopilot', color: '#1BA07A', bg: '#DDF4EE', border: '#A8E4D4',
    desc: 'Recurring tasks that just run themselves',
    prompts: [
    'Every morning, brief me on the news and my schedule',
    'Set up a task that runs automatically every day at 6 AM']

  },
  'Discover & search anything': {
    icon: 'discover', color: '#3B8FD4', bg: '#E4F2FC', border: '#B6D9F4',
    desc: 'Browse the web and search across your apps',
    prompts: [
    'Search the web for active redeem codes for my games',
    'Find and download free games on the Play Store']

  }
};

const BUCKET_SETS = { current: CHAT_CATS, personas: PERSONA_CATS, benefits: BENEFIT_CATS };

// ── Option D: 3 ready-to-use actions + "view all" ───────────────
const QUICK_ACTIONS = [
{ text: 'Collect my daily rewards across all my games every morning', sub: 'Spins, coins & bonuses — auto-collected', icon: 'gift', color: '#B45309', bg: '#FEF3C7', border: '#FDE68A' },
{ text: 'Schedule a week of Instagram posts with captions & hashtags', sub: 'Drafts, captions & best times to post', icon: 'calendar', color: '#E05C8A', bg: '#FCE9F1', border: '#F5C0D5' },
{ text: 'Every morning, brief me on the news and my schedule', sub: 'Your daily standup, fully automated', icon: 'news', color: '#1BA07A', bg: '#DDF4EE', border: '#A8E4D4' }];


// ── Option B: value-first — hero tasks visible immediately, persona filter ──
const VF_PERSONAS = [
{ key: 'all', label: 'For you', icon: null },
{ key: 'gaming', label: 'Gaming', icon: 'game' },
{ key: 'social', label: 'Social', icon: 'social' },
{ key: 'work', label: 'Productivity', icon: 'productivity' },
{ key: 'extras', label: 'Extras', icon: 'discover' },
{ key: 'explore', label: 'Explore', icon: 'explore' }];

const VF_TASKS = [
{ text: 'Collect my daily rewards across all my games every morning', sub: 'Spins, coins & bonuses — auto-collected', icon: 'gift', tags: ['gaming'], hero: true, credits: 15 },
{ text: 'Schedule a week of Instagram posts with captions & hashtags', sub: 'Drafts, captions & best times to post', icon: 'calendar', tags: ['social'], hero: true, credits: 40 },
{ text: 'Every morning, brief me on the news and my schedule', sub: 'Your daily standup, fully automated', icon: 'news', tags: ['work'], hero: true, credits: 10 },
{ text: 'Find and redeem active gift codes for my games', icon: 'ticket', tags: ['gaming'], credits: 8 },
{ text: 'Finish the boring tutorial in Coin Master for me', icon: 'tutorial', tags: ['gaming'], credits: 25 },
{ text: 'Scan a profile and suggest a personalised gift', icon: 'gift', tags: ['social'], credits: 12 },
{ text: 'Reply to my DMs with quick, friendly responses', icon: 'message', tags: ['social'], credits: 18 },
{ text: 'Set up a task that runs automatically every day at 6 AM', icon: 'clock', tags: ['work'], credits: 5 },
{ text: 'Search the web for active redeem codes for my games', icon: 'discover', tags: ['gaming', 'work'], credits: 8 },
{ text: 'Find trending topics in my niche and summarise them', icon: 'discover', tags: ['extras'], hero: true, credits: 12 },
{ text: 'Monitor a product price and alert me when it drops', icon: 'news', tags: ['extras'], credits: 10 },
{ text: 'Browse the web and summarise the top 5 results for any topic', icon: 'explore', tags: ['explore'], hero: true, credits: 8 },
{ text: 'Open any app and extract key info into a report', icon: 'tutorial', tags: ['explore'], credits: 20 }];


function ChatCatIcon({ type, size = 14, color = 'currentColor' }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (type === 'game') return <svg {...p}><rect x="2" y="6" width="20" height="12" rx="5" /><line x1="9" y1="12" x2="13" y2="12" /><line x1="11" y1="10" x2="11" y2="14" /><circle cx="17" cy="11" r="1" fill={color} stroke="none" /><circle cx="17" cy="13.5" r="1" fill={color} stroke="none" /></svg>;
  if (type === 'social') return <svg {...p}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>;
  if (type === 'productivity') return <svg {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>;
  if (type === 'explore') return <svg {...p}><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={color} opacity="0.6" stroke="none" /></svg>;
  if (type === 'rewards') return <svg {...p}><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></svg>;
  if (type === 'grow') return <svg {...p}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>;
  if (type === 'autopilot') return <svg {...p}><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>;
  if (type === 'discover') return <svg {...p}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
  if (type === 'calendar') return <svg {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
  if (type === 'news') return <svg {...p}><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9h4" /><line x1="10" y1="7" x2="18" y2="7" /><line x1="10" y1="11" x2="14" y2="11" /></svg>;
  if (type === 'gift') return <svg {...p}><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></svg>;
  if (type === 'message') return <svg {...p}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>;
  if (type === 'clock') return <svg {...p}><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" /></svg>;
  if (type === 'ticket') return <svg {...p}><path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1a2 2 0 0 0 0 4v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1a2 2 0 0 0 0-4z" /><line x1="13" y1="7" x2="13" y2="17" strokeDasharray="2 2" /></svg>;
  if (type === 'tutorial') return <svg {...p}><path d="M22 10L12 5 2 10l10 5 10-5z" /><path d="M6 12v5c0 1 2.5 2.5 6 2.5s6-1.5 6-2.5v-5" /></svg>;
  return null;
}

const INTRO_MSG = {
  id: 'intro', role: 'ai',
  content: '',
  ts: Date.now() - 300000
};

// Recent activity shown in the empty-state HistoryCard
const MOCK_HISTORY = [
{ id: 'h1', prompt: 'Collect my daily rewards across all my games every morning', ts: Date.now() - 3600000 },
{ id: 'h2', prompt: 'Schedule a week of Instagram posts with captions & hashtags', ts: Date.now() - 86400000 },
{ id: 'h3', prompt: 'Search the web for active redeem codes for my games', ts: Date.now() - 86400000 * 3 }];


function IntroCard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', width: '100%', gap: 6, padding: "20px 0px 16px" }}>
      <h2 style={{ fontWeight: 800, color: '#111827', letterSpacing: '-0.4px', lineHeight: 1.2, fontSize: "24px" }}>{window.__introHeadline || "👋🏻 I work so you don't have to."}</h2>
      <p style={{ color: '#6b7280', lineHeight: 1.5, fontSize: "18px" }}>
        {window.__introSub || "Click a task or just describe it — I'll figure it out."}
      </p>
    </div>);

}

function aiReply(prompt) {
  const lower = prompt.toLowerCase();
  if (lower.includes('custom skill') || lower.includes('build') || lower.includes('create skill'))
  return "Let's build your custom skill! Tell me:\n\n1. What app should it control?\n2. What actions should it perform?\n3. How often should it run?\n\nI'll generate the skill instructions and add it to your library.";
  return "Got it! I'll take care of that for you. Setting things up now…";
}

function ThinkingIndicator() {
  const PHRASES = ['Thinking…', 'Reading the screen…', 'Planning the steps…', 'Navigating the app…', 'Working on it…'];
  const [i, setI] = React.useState(0);
  const [visible, setVisible] = React.useState(true);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {const t = setTimeout(() => setMounted(true), 10);return () => clearTimeout(t);}, []);
  React.useEffect(() => {
    const iv = setInterval(() => {
      setVisible(false);
      setTimeout(() => {setI((p) => (p + 1) % PHRASES.length);setVisible(true);}, 220);
    }, 1100);
    return () => clearInterval(iv);
  }, []);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, transition: 'opacity 0.3s, transform 0.3s', opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(8px)' }}>
      <div style={{ position: 'relative', width: 24, height: 24, flexShrink: 0, animation: 'ba-logo-spin 2.4s linear infinite' }}>
        <img src="blueai/blueai-logo.png" alt="" style={{ width: 24, height: 24, borderRadius: '50%', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'linear-gradient(105deg, transparent 25%, rgba(255,255,255,0.6) 50%, transparent 75%)', backgroundSize: '80px 100%', animation: 'ba-shimmer-sweep 1.2s linear infinite' }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 500, color: '#7B4CFF', transition: 'opacity 0.22s', opacity: visible ? 1 : 0 }}>
        {PHRASES[i]}
      </span>
    </div>);

}

function StreamingAiBubble({ msg }) {
  const [shown, setShown] = React.useState('');
  React.useEffect(() => {
    const full = msg.content || '';
    let i = 0;setShown('');
    const speed = Math.max(8, Math.min(22, Math.floor(1800 / full.length)));
    const t = setInterval(() => {i++;setShown(full.slice(0, i));if (i >= full.length) clearInterval(t);}, speed);
    return () => clearInterval(t);
  }, [msg.id]);
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 10, animation: 'ba-msg-in 0.22s ease' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 3 }}>
        <div style={{ background: 'white', color: '#1f2937', padding: '9px 12px', borderRadius: '14px 14px 14px 0px', fontSize: 13, lineHeight: 1.45, maxWidth: 240, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <p style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{shown}<span style={{ display: shown.length < (msg.content || '').length ? 'inline-block' : 'none', width: 2, height: '1em', background: '#1990FF', marginLeft: 1, animation: 'ba-pulse 0.7s ease-in-out infinite', verticalAlign: 'text-bottom' }} /></p>
        </div>
        <span style={{ fontSize: 10, color: '#b0b8c8' }}>{fmtTs(msg.ts)}</span>
      </div>
    </div>);

}

function AgentProgress({ prompt }) {
  const steps = React.useMemo(() => {
    const lower = (prompt || '').toLowerCase();
    if (lower.includes('reward') || lower.includes('collect') || lower.includes('farm'))
    return ['Opening game apps', 'Locating daily reward buttons', 'Collecting all rewards', 'Done'];
    if (lower.includes('instagram') || lower.includes('post') || lower.includes('social'))
    return ['Analysing your audience', 'Drafting caption & hashtags', 'Scheduling posts', 'Done'];
    if (lower.includes('news') || lower.includes('brief') || lower.includes('schedule'))
    return ['Fetching today\'s headlines', 'Checking your calendar', 'Writing your brief', 'Done'];
    if (lower.includes('code') || lower.includes('redeem') || lower.includes('gift'))
    return ['Searching active codes', 'Verifying each code', 'Applying to your account', 'Done'];
    if (lower.includes('dm') || lower.includes('message') || lower.includes('reply'))
    return ['Reading incoming messages', 'Drafting replies', 'Sending responses', 'Done'];
    return ['Understanding your request', 'Planning the task', 'Executing steps', 'Done'];
  }, [prompt]);

  const [current, setCurrent] = React.useState(0);
  React.useEffect(() => {
    if (current >= steps.length - 1) return;
    const t = setTimeout(() => setCurrent((c) => c + 1), 650);
    return () => clearTimeout(t);
  }, [current, steps.length]);

  return (
    <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px 16px 16px 0px', padding: '12px 14px', maxWidth: '82%', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {steps.map((step, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, opacity: i > current ? 0.35 : 1, transition: 'opacity 0.3s' }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: done ? '#f0fdf4' : active ? '#eff6ff' : '#f8fafc',
                border: `1px solid ${done ? '#bbf7d0' : active ? '#bfdbfe' : '#e2e8f0'}`,
                transition: 'all 0.3s' }}>
                {done ?
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg> :
                active ?
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#1990FF', animation: 'ba-pulse 1s ease-in-out infinite' }} /> :
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#e2e8f0' }} />
                }
              </div>
              <span style={{ fontSize: 12.5, fontWeight: done ? 600 : active ? 700 : 400, color: done ? '#16a34a' : active ? '#111827' : '#94a3b8', transition: 'all 0.3s' }}>
                {step === 'Done' ?
                <span style={{ fontWeight: 700, color: '#16a34a' }}>All done ✓</span> :
                step}
              </span>
            </div>);

        })}
      </div>
    </div>);

}

function LoadingDots() {
  return (
    <div style={{ display: 'flex', gap: 4, padding: '10px 14px', alignItems: 'center' }}>
      {[0, 1, 2].map((i) =>
      <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#94a3b8', display: 'inline-block', animation: `chatBounce 1.2s ${i * 0.2}s infinite` }} />
      )}
    </div>);

}

function UserBubble({ msg }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10, animation: 'ba-msg-in 0.22s ease' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
        <div style={{ padding: '9px 12px', fontSize: 13, lineHeight: 1.45, maxWidth: 240, borderRadius: '14px 14px 0px 14px', borderWidth: '1px', borderStyle: 'solid', opacity: '1', color: 'rgb(25, 144, 255)', background: "rgba(25, 144, 255, 0.035)", borderColor: "rgba(25, 144, 255, 0.4)", boxShadow: '0 2px 10px rgba(25, 144, 255, 0.15)' }}>
          <p style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: "rgb(51, 51, 51)" }}>{msg.content}</p>
        </div>
        <span style={{ fontSize: 10, color: '#b0b8c8' }}>{fmtTs(msg.ts)}</span>
      </div>
    </div>);

}

function fmtTs(ts) {
  const d = new Date(ts);
  const h = d.getHours(),m = d.getMinutes();
  const hh = String(h % 12 || 12).padStart(2, '0');
  const mm = String(m).padStart(2, '0');
  const ampm = h < 12 ? 'AM' : 'PM';
  const day = d.getDate();
  const ord = day % 10 === 1 && day !== 11 ? 'st' : day % 10 === 2 && day !== 12 ? 'nd' : day % 10 === 3 && day !== 13 ? 'rd' : 'th';
  const mon = d.toLocaleDateString('en-GB', { month: 'short' });
  const yr = String(d.getFullYear()).slice(-2);
  return `${hh}:${mm}${ampm}, ${day}${ord} ${mon} ${yr}`;
}

function AiBubble({ msg }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 10, animation: 'ba-msg-in 0.22s ease' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 3 }}>
        <div style={{ background: 'white', color: '#1f2937', padding: '9px 12px', borderRadius: '14px 14px 14px 0px', fontSize: 13, lineHeight: 1.45, maxWidth: 240, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <p style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{msg.content}</p>
        </div>
        <span style={{ fontSize: 10, color: '#b0b8c8' }}>{fmtTs(msg.ts)}</span>
      </div>
    </div>);

}

function HistoryCard({ history, onSelect }) {
  const last = history[0];
  if (!last) return null;
  const timeLabel = (ts) => {
    const diff = Date.now() - ts;
    const d = Math.floor(diff / 86400000);
    const time = new Date(ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    if (d === 0) return `Today, ${time}`;
    if (d === 1) return `Yesterday, ${time}`;
    return `${d} days ago, ${time}`;
  };
  return (
    <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', marginBottom: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px 7px', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em' }}>RECENT ACTIVITY</span>
        </div>
        <button onClick={() => onSelect(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: '#1990FF', fontWeight: 600, fontFamily: 'inherit', padding: 0 }}>See all</button>
      </div>
      {history.slice(0, 1).map((item, i) =>
      <button key={item.id} onClick={() => onSelect(item.prompt)}
      style={{ display: 'flex', alignItems: 'flex-start', width: '100%', background: 'none', border: 'none', borderBottom: i < Math.min(history.length, 2) - 1 ? '1px solid #f1f5f9' : 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'background 0.12s', padding: "9px 12px 9px 16px", gap: "16px" }}
      onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#f0f4ff', border: '1px solid #e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 12.5, fontWeight: 600, color: '#1e293b', lineHeight: 1.3 }}>{item.prompt}</p>
          </div>
        </button>
      )}
    </div>);

}

function VfPill({ persona, active, onClick }) {
  return (
    <button onClick={onClick}
    style={{ display: 'inline-flex', alignItems: 'center', gap: 5, flexShrink: 0, height: 30, padding: persona.icon ? '0 12px 0 9px' : '0 14px', borderRadius: 999, cursor: 'pointer', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 700, transition: 'all 0.14s',
      border: active ? '1px solid #1990FF' : '1px solid #cbd5e1',
      background: active ? '#eff6ff' : 'white',
      color: active ? '#1990FF' : '#334155' }}>
      {persona.icon && <ChatCatIcon type={persona.icon} size={14} color={active ? '#1990FF' : '#7A8499'} />}
      {persona.label}
    </button>);
}

const _heroTasks = VF_TASKS.filter((t) => t.hero);
const _shuffledHero = [..._heroTasks].sort(() => Math.random() - 0.5).slice(0, 3);

function ValueFirstTasks({ vfPersona, setVfPersona, onPick }) {
  const list = vfPersona === 'all' ? _shuffledHero :
  VF_TASKS.filter((t) => t.tags.includes(vfPersona));
  const heading = vfPersona === 'all' ? 'Suggested for you' : 'Try one of these';
  const palette = { gaming: '#5B6CF6', social: '#E05C8A', work: '#1BA07A', extras: '#7A8499', explore: '#3B8FD4' };
  const tone = (t) => palette[t.tags && t.tags[0] || 'work'] || '#1990FF';
  return (
    <div>
      <style>{`
        .vf-card:hover .vf-try { background: #1990FF !important; color: #fff !important; }
        .vf-card:hover .vf-try svg { stroke: #fff !important; }
        .vf-icon { background: var(--tone-bg); transition: background 0.12s; }
        .vf-icon svg { stroke: var(--tone); transition: stroke 0.12s; }
        .vf-card:hover .vf-icon { filter: brightness(0.92); }
      `}</style>
      {/* Persona filter pills with scroll arrows */}
      {(() => {
        const scrollRef = React.useRef(null);
        const [canLeft, setCanLeft] = React.useState(false);
        const [canRight, setCanRight] = React.useState(false);
        const checkScroll = () => {
          const el = scrollRef.current;
          if (!el) return;
          setCanLeft(el.scrollLeft > 4);
          setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
        };
        React.useEffect(() => {
          checkScroll();
          const el = scrollRef.current;
          el?.addEventListener('scroll', checkScroll, { passive: true });
          return () => el?.removeEventListener('scroll', checkScroll);
        }, []);
        const scroll = (dir) => {
          const el = scrollRef.current;
          if (!el) return;
          el.scrollTo({ left: dir === 1 ? el.scrollWidth : 0, behavior: 'smooth' });
        };
        const ArrowBtn = ({ dir }) =>
        <button onClick={() => scroll(dir)} style={{ position: 'absolute', [dir === -1 ? 'left' : 'right']: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 5, width: 26, height: 26, borderRadius: 999, background: 'white', border: '1px solid #e2e8f0', boxShadow: '0 1px 6px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#374151', padding: 0, flexShrink: 0 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points={dir === -1 ? '15 18 9 12 15 6' : '9 18 15 12 9 6'} /></svg>
          </button>;

        return (
          <div style={{ position: 'relative', marginBottom: 12, display: 'flex', alignItems: 'center' }}>
            {canLeft && <ArrowBtn dir={-1} />}
            <div ref={scrollRef} style={{ display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', paddingLeft: canLeft ? 30 : 0, paddingRight: canRight ? 30 : 0, transition: 'padding 0.15s', flex: 1, padding: "0px 30px 0px 0px" }}>
              {VF_PERSONAS.map((p) => <VfPill key={p.key} persona={p} active={vfPersona === p.key} onClick={() => setVfPersona(p.key)} />)}
            </div>
            {canRight && <ArrowBtn dir={1} />}
          </div>);

      })()}
      <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', color: '#94a3b8', marginBottom: 8, textAlign: 'left' }}>{heading.toUpperCase()}</p>
      {/* Hero task cards — value visible immediately, no drill-down */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {list.map((t, i) => {
          const c = tone(t);
          return (
            <button key={i} onClick={() => onPick(t.text)} className="vf-card"
            style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', background: 'white', border: '1px solid #e2e8f0', borderRadius: 13, padding: '13px 13px', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'transform 0.12s, box-shadow 0.12s, border-color 0.12s', '--tone': c, '--tone-bg': c + '1f' }}
            onMouseEnter={(e) => {e.currentTarget.style.transform = 'translateY(-1px)';e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.08)';e.currentTarget.style.borderColor = '#c7d2e1';}}
            onMouseLeave={(e) => {e.currentTarget.style.transform = '';e.currentTarget.style.boxShadow = '';e.currentTarget.style.borderColor = '#e2e8f0';}}>
              <div className="vf-icon" style={{ flexShrink: 0, width: 38, height: 38, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChatCatIcon type={t.icon} size={20} color={c} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13.5, fontWeight: 400, color: '#111827', lineHeight: 1.3 }}>{t.text}</p>
                {window.__showTaskCredits && t.credits != null &&
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 3, marginTop: 5, background: '#f1f5fb', border: '1px solid #e2e8f0', borderRadius: 999, padding: '2px 8px 2px 6px' }}>
                  <div style={{ width: 12, height: 12, background: 'linear-gradient(135deg,#0EA4C5,#7B4CFF)', WebkitMaskImage: 'url(assets/Credits.svg)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskImage: 'url(assets/Credits.svg)', maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center', flexShrink: 0 }} />
                  <span style={{ fontSize: 10.5, fontWeight: 600, color: '#64748b' }}>~{t.credits} credits</span>
                </div>}
              </div>
              <div className="vf-try" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, fontWeight: 400, color: '#64748b', borderRadius: 999, padding: '4px 10px', transition: 'background 0.12s, color 0.12s' }}>
                Try
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="17" y1="7" x2="7" y2="17" /><polyline points="16 17 7 17 7 8" /></svg>
              </div>
            </button>);
        })}
      </div>
    </div>);
}

function QuickActions({ onPick, onViewAll }) {
  return (
    <div>
      <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', color: '#94a3b8', marginBottom: 8, textAlign: 'left' }}>READY-TO-USE ACTIONS</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {QUICK_ACTIONS.map((t, i) =>
        <button key={i} onClick={() => onPick(t.text)}
        style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', background: 'white', border: '1px solid #e2e8f0', borderRadius: 13, padding: '13px 13px', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'transform 0.12s, box-shadow 0.12s, border-color 0.12s' }}
        onMouseEnter={(e) => {e.currentTarget.style.transform = 'translateY(-1px)';e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.08)';e.currentTarget.style.borderColor = '#c7d2e1';}}
        onMouseLeave={(e) => {e.currentTarget.style.transform = '';e.currentTarget.style.boxShadow = '';e.currentTarget.style.borderColor = '#e2e8f0';}}>
          <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 11, background: t.bg, border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChatCatIcon type={t.icon} size={21} color={t.color} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13.5, fontWeight: 700, color: '#111827', lineHeight: 1.3 }}>{t.text}</p>
            {t.sub && <p style={{ fontSize: 11.5, color: '#6b7280', lineHeight: 1.3, marginTop: 2 }}>{t.sub}</p>}
          </div>
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, fontWeight: 700, color: t.color }}>
            Try
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={t.color} strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
          </div>
        </button>
        )}
      </div>
      <button onClick={onViewAll}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, width: '100%', marginTop: 9, background: 'white', border: '1px solid #e2e8f0', borderRadius: 11, padding: '11px 0', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 700, color: '#7A8499', transition: 'background 0.12s, border-color 0.12s' }}
      onMouseEnter={(e) => {e.currentTarget.style.background = '#f8fafc';e.currentTarget.style.borderColor = '#c7d2e1';}}
      onMouseLeave={(e) => {e.currentTarget.style.background = 'white';e.currentTarget.style.borderColor = '#e2e8f0';}}>
        View all actions
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
      </button>
    </div>);
}

// ── Option E: all categories + tasks expanded on one screen ──────
// Optional one-line subtitles for the baseline prompts (keeps cards two-line like the mock)
const EXPANDED_SUBS = {
  'Collect paid games that are free on Google Play Store everyday at 6:05 AM': 'Auto-claims every free game daily',
  'Complete the initial boring tutorial of Coin Master game for me': 'Skips the grind, keeps the rewards',
  'Play Whiteout Survival for 10 min': 'Dailies, quests & alliance gifts',
  'Collect bonus coins in Disney Solitaire game': 'Daily bonus coins, auto-collected',
  'Scan my girlfriend’s Instagram profile and suggest what I can gift her': 'Personalised gift ideas from her posts',
  'Every morning, brief me on the latest news and my schedule for the day': 'Your daily standup, fully automated',
  'Search the web for active redeem codes for my games': 'Finds & applies working codes'
};

function ExpandedCategoriesTasks({ cats, onPick, showLabel, showDesc }) {
  const entries = Object.entries(cats).filter(([, m]) => m.prompts.length > 0);
  return (
    <div>
      {showLabel && <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', color: '#94a3b8', marginBottom: 10, textAlign: 'left' }}>WHAT WOULD YOU LIKE TO DO?</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {entries.map(([name, meta]) =>
        <div key={name}>
            {/* Gradient category banner */}
            <div style={{ background: `linear-gradient(90deg, ${meta.color}, ${meta.color}00)`, borderRadius: 9, padding: '7px 14px', marginBottom: 9, display: 'flex', alignItems: 'center', gap: 8 }}>
              <ChatCatIcon type={meta.icon} size={15} color="white" />
              <span style={{ fontSize: 13.5, fontWeight: 800, color: 'white', letterSpacing: '-0.2px', textShadow: '0 1px 2px rgba(0,0,0,0.12)' }}>{name}</span>
            </div>
            {/* Tasks in this category */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {meta.prompts.map((p, i) => {
              const sub = EXPANDED_SUBS[p];
              return (
                <button key={i} onClick={() => onPick(p)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', background: 'white', border: '1px solid #e2e8f0', borderRadius: 13, padding: '12px 13px', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'transform 0.12s, box-shadow 0.12s, border-color 0.12s' }}
                onMouseEnter={(e) => {e.currentTarget.style.transform = 'translateY(-1px)';e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.08)';e.currentTarget.style.borderColor = '#c7d2e1';}}
                onMouseLeave={(e) => {e.currentTarget.style.transform = '';e.currentTarget.style.boxShadow = '';e.currentTarget.style.borderColor = '#e2e8f0';}}>
                    <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 11, background: meta.bg, border: `1px solid ${meta.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ChatCatIcon type={meta.icon} size={21} color={meta.color} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13.5, fontWeight: 700, color: '#111827', lineHeight: 1.3 }}>{p}</p>
                      {showDesc && sub && <p style={{ fontSize: 11.5, color: '#6b7280', lineHeight: 1.3, marginTop: 2 }}>{sub}</p>}
                    </div>
                    <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, fontWeight: 700, color: meta.color }}>
                      Try
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={meta.color} strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
                    </div>
                  </button>);
            })}
            </div>
          </div>
        )}
      </div>
    </div>);
}

function ChatResumeCard({ card }) {
  const [done, setDone] = React.useState(false);
  const [closing, setClosing] = React.useState(false);
  React.useEffect(() => {const t = setTimeout(() => setDone(true), 6000);return () => clearTimeout(t);}, []);
  const bg = done ? '#dcfce7' : '#dbeafe';
  const bdr = done ? '#86efac' : '#93c5fd';
  return (
    <div onClick={card.onResume} style={{ margin: '0 0 6px', background: bg, border: '1px solid ' + bdr, borderRadius: 12, padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', boxShadow: done ? '0 2px 10px rgba(22,163,74,0.18)' : '0 2px 10px rgba(25,144,255,0.15)', transition: 'background 0.4s, border-color 0.4s, opacity 0.35s, transform 0.35s', opacity: closing ? 0 : 1, transform: closing ? 'translateX(110%)' : 'translateX(0)' }}>
      <div style={{ width: 32, height: 32, borderRadius: 9, background: done ? '#dcfce7' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.4s' }}>
        {done ?
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> :
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1990FF" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'ba-spin 1s linear infinite' }}><style>{'@keyframes ba-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}'}</style><path d="M12 2a10 10 0 0 1 10 10" opacity="0.3" /><path d="M12 2a10 10 0 0 1 10 10" /></svg>
        }
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{card.name}</p>
        <p style={{ fontSize: 11.5, color: done ? '#16a34a' : '#94a3b8', margin: '2px 0 0', transition: 'color 0.4s' }}>{done ? 'Completed ✓' : 'click to see progress.'}</p>
      </div>
      {done ?
      <button onClick={(e) => {e.stopPropagation();setClosing(true);setTimeout(() => card.onClose?.(), 350);}} style={{ width: 22, height: 22, borderRadius: '50%', background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button> :
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#bfdbfe" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
      }
    </div>);

}



function ChatScreen({ triedSkill, onBackFromSkill, onChatReset, isLoggedIn, onLoginRequired, isLoading, onAiReply, onNoCredits, credits, onboarding = 'current', density = 'full', onFirstMessage, resumeCard, externalMsgs, setExternalMsgs, forceGrid = false, autoSend }) {
  const [internalMsgs, setInternalMsgs] = useState([INTRO_MSG]);
  const msgs = externalMsgs || internalMsgs;
  const setMsgs = setExternalMsgs || setInternalMsgs;
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);
  const [lastPrompt, setLastPrompt] = useState('');
  const [streamingId, setStreamingId] = useState(null);
  const [vfPersona, setVfPersona] = useState('all');
  const [inputFilled, setInputFilled] = useState(false);
  const fillInput = (p) => {setInput(p);textareaRef.current?.focus();setInputFilled(true);setTimeout(() => setInputFilled(false), 700);};
  const [viewAll, setViewAll] = useState(false);
  const showHistory = density === 'full';
  const endRef = useRef(null);
  const textareaRef = useRef(null);
  const prevSkillIdRef = useRef(null);

  const buckets = BUCKET_SETS[onboarding] || CHAT_CATS;
  const isValueFirst = onboarding === 'valuefirst';
  const isQuickActions = onboarding === 'quickactions';
  const isExpanded = !isValueFirst && !isQuickActions;
  const cats = buckets;
  const density_full = density === 'full';
  const density_min = density === 'minimal';
  const showLabel = !density_min;
  const showDesc = density_full;
  const showCount = density_full;
  const showSkillCta = false;
  const heading = vfPersona === 'all' ? 'Suggested for you' : 'Try one of these';
  const showGrid = msgs.length === 1 && !loading || forceGrid;

  useEffect(() => {
    if (endRef.current) {const el = endRef.current.parentElement;if (el) el.scrollTop = el.scrollHeight;}
  }, [msgs, loading]);

  useEffect(() => {
    const ta = textareaRef.current;if (!ta) return;
    ta.style.height = '';ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
    ta.style.overflowY = ta.scrollHeight > 120 ? 'auto' : 'hidden';
  }, [input]);

  useEffect(() => {setSelectedCat(null);setVfPersona('all');setViewAll(false);}, [onboarding]);

  useEffect(() => {
    if (!triedSkill) {prevSkillIdRef.current = null;return;}
    if (triedSkill.id === prevSkillIdRef.current) return;
    prevSkillIdRef.current = triedSkill.id;
    setInput(triedSkill.name ? 'Use the "' + triedSkill.name + '" skill' : 'Use this skill');
    textareaRef.current?.focus();
  }, [triedSkill]);

  // Auto-respond if last message is from user (e.g. after switching from home view)
  useEffect(() => {
    const lastMsg = msgs[msgs.length - 1];
    if (!lastMsg || lastMsg.role !== 'user' || loading) return;
    if (msgs.length < 2) return; // only intro msg, skip
    const content = lastMsg.content;
    const t = setTimeout(() => {
      setLoading(true);
      new Promise((r) => setTimeout(r, 1400 + Math.random() * 700)).then(() => {
        const aiId = Date.now() + 'a';
        setMsgs((prev) => {
          // Don't add if AI already replied (race guard)
          const last = prev[prev.length - 1];
          if (last && last.role === 'ai') return prev;
          return [...prev, { id: aiId, role: 'ai', content: aiReply(content), ts: Date.now() }];
        });
        setStreamingId(aiId);setTimeout(() => setStreamingId(null), 3500);
        setLoading(false);onAiReply?.();
      });
    }, 200);
    return () => clearTimeout(t);
  }, []); // only on mount

  const sendMsg = async () => {
    if (!input.trim() || loading) return;
    if (!isLoggedIn) {onLoginRequired?.();return;}
    if (credits !== undefined && credits <= 0) {onNoCredits?.();return;}
    const content = input.trim();setInput('');setSelectedCat(null);
    const isFirstMsg = msgs.filter((m) => m.role === 'user').length === 0;
    setMsgs((prev) => [...prev, { id: Date.now() + 'u', role: 'user', content, ts: Date.now() }]);
    setLastPrompt(content);
    if (isFirstMsg && onFirstMessage) onFirstMessage(content);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400 + Math.random() * 700));
    const aiId = Date.now() + 'a';
    setMsgs((prev) => [...prev, { id: aiId, role: 'ai', content: aiReply(content), ts: Date.now() }]);
    setStreamingId(aiId);setTimeout(() => setStreamingId(null), 3500);
    setLoading(false);onAiReply?.();
  };

  const handleKey = (e) => {if (e.key === 'Enter' && !e.shiftKey) {e.preventDefault();sendMsg();}};

  if (isLoading) return (
    <>
      <div style={{ flex: 1, padding: '24px 16px 16px', display: 'flex', flexDirection: 'column', gap: 14, overflow: 'hidden' }}>
        <Shimmer h={36} w={36} r={999} extra={{ marginBottom: 14 }} />
        <Shimmer h={26} w={160} r={8} extra={{ marginBottom: 10 }} />
        <Shimmer h={13} w="88%" r={6} extra={{ marginBottom: 6 }} />
        <Shimmer h={13} w="66%" r={6} />
        {[1, 2, 3].map((i) => <div key={i} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '13px 14px' }}><Shimmer h={13} w={i === 1 ? '82%' : i === 2 ? '70%' : '76%'} r={5} extra={{ marginBottom: 8 }} /><Shimmer h={11} w={i === 1 ? '52%' : i === 2 ? '60%' : '48%'} r={4} /></div>)}
      </div>
      <div style={{ padding: '10px 16px 12px', flexShrink: 0 }}><Shimmer h={50} r={18} /></div>
    </>);


  return (
    <>
      <style>{'@keyframes chatBounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}'}</style>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,0,0,0.15) transparent', padding: '16px' }}>
          {showGrid &&
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', minHeight: '100%' }}>
              {msgs.map((m) => {if (m.id === 'intro') return <IntroCard key={m.id} />;return null;})}
              <div style={{ marginTop: 4, margin: '4px 0px 0px' }}>
                {selectedCat ?
              <div>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button onClick={() => setSelectedCat(null)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'white', border: '1px solid #e2e8f0', borderRadius: 999, cursor: 'pointer', color: '#7A8499', fontSize: 12, fontWeight: 600, padding: '5px 12px 5px 9px', fontFamily: 'inherit', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                        Back
                      </button>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{selectedCat}</span>
                    </div>
                  </div>
                  {cats[selectedCat] && (cats[selectedCat].prompts.length === 0 ?
                <div style={{ textAlign: 'center', padding: '30px 0' }}><p style={{ fontSize: 14, fontWeight: 700, color: '#374151' }}>More tasks coming soon</p><p style={{ fontSize: 12.5, color: '#9ca3af', lineHeight: 1.5, maxWidth: 200 }}>We are adding new automations every week.</p></div> :
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                      {cats[selectedCat].prompts.map((p, i) =>
                  <button key={i} onClick={() => {setInput(p);setSelectedCat(null);textareaRef.current?.focus();}}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, border: '1px solid #e2e8f0', borderRadius: 10, background: 'white', padding: '9px 12px', fontSize: 13, color: '#374151', fontWeight: 500, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'background 0.12s, border-color 0.12s' }}
                  onMouseEnter={(e) => {e.currentTarget.style.background = '#f8fafc';e.currentTarget.style.borderColor = '#c7d2e1';}}
                  onMouseLeave={(e) => {e.currentTarget.style.background = 'white';e.currentTarget.style.borderColor = '#e2e8f0';}}>
                        <span>{p}</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0 }}><polyline points="9 18 15 12 9 6" /></svg>
                      </button>)}
                    </div>)
                }
                </div> :
              <>
                  {isValueFirst ?
                <ValueFirstTasks vfPersona={vfPersona} setVfPersona={setVfPersona} onPick={fillInput} /> :
                isExpanded ?
                <ExpandedCategoriesTasks cats={cats} showLabel={showLabel} showDesc={showDesc} onPick={fillInput} /> :
                isQuickActions && !viewAll ?
                <QuickActions onPick={fillInput} onViewAll={() => setViewAll(true)} /> :
                <>
                  {isQuickActions && <button onClick={() => setViewAll(false)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'white', border: '1px solid #e2e8f0', borderRadius: 999, cursor: 'pointer', color: '#7A8499', fontSize: 12, fontWeight: 600, padding: '5px 12px 5px 9px', fontFamily: 'inherit', marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>Quick actions</button>}
                  {showLabel && <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', color: '#94a3b8', marginBottom: 8, textAlign: 'left' }}>WHAT WOULD YOU LIKE TO DO?</p>}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {Object.entries(cats).map(([name, meta]) =>
                    <div key={name} onClick={() => setSelectedCat(name)}
                    style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '10px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, transition: 'transform 0.12s, box-shadow 0.12s' }}
                    onMouseEnter={(e) => {e.currentTarget.style.transform = 'translateY(-1px)';e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';e.currentTarget.style.borderColor = '#c7d2e1';}}
                    onMouseLeave={(e) => {e.currentTarget.style.transform = '';e.currentTarget.style.boxShadow = '';e.currentTarget.style.borderColor = '#e2e8f0';}}>
                        <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 10, background: meta.bg, border: '1px solid ' + meta.border, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ChatCatIcon type={meta.icon} size={20} color={meta.color} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13.5, fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>{name}</p>
                          {showDesc && <p style={{ fontSize: 11, color: '#6b7280', lineHeight: 1.35, marginTop: 1 }}>{meta.desc}</p>}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                          {showCount && <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8' }}>{meta.prompts.length > 0 ? meta.prompts.length + ' ' + (meta.prompts.length === 1 ? 'task' : 'tasks') : 'Soon'}</span>}
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
                        </div>
                      </div>)}
                  </div>
                  </>}
                  {showSkillCta && <div style={{ background: 'linear-gradient(135deg,rgba(14,164,197,0.5),rgba(123,76,255,0.5))', borderRadius: 15, padding: 1.5, marginTop: 8 }}><button onClick={() => {setInput("I want to build a custom skill. Here's what I want it to do:\n");textareaRef.current?.focus();}} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '11px 14px', background: 'linear-gradient(rgba(255,255,255,0.75),rgba(255,255,255,0.75)),linear-gradient(135deg,#0EA4C5,#7B4CFF)', border: 'none', borderRadius: 13.5, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}><div style={{ width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'rgb(108,81,185)' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg></div><div><p style={{ fontSize: 13, fontWeight: 800, lineHeight: 1.2, marginBottom: 2, color: 'rgb(42,16,130)' }}>Talk to BlueAI to build a skill</p><p style={{ fontSize: 11, lineHeight: 1.35, opacity: 0.8, color: 'rgb(100,45,254)' }}>Describe what you need in chat and BlueAI builds it</p></div></button></div>}
                </>}
              </div>
            </div>
          }
        {!showGrid && msgs.slice(1).map((m) => m.role === 'user' ? <UserBubble key={m.id} msg={m} /> : m.id === streamingId ? <StreamingAiBubble key={m.id} msg={m} /> : <AiBubble key={m.id} msg={m} />)}
          {loading && <ThinkingIndicator />}
          <div ref={endRef} />
        </div>
      </div>
      <div style={{ paddingTop: 10, flexShrink: 0, position: 'relative', padding: '4px 16px 8px' }}>
        <style>{'@keyframes ba-input-glow{0%{box-shadow:0 0 0 0 rgba(25,144,255,0.8),0 0 0 0 rgba(25,144,255,0.4)}40%{box-shadow:0 0 0 8px rgba(25,144,255,0.3),0 0 20px 6px rgba(25,144,255,0.2)}70%{box-shadow:0 0 0 14px rgba(25,144,255,0.08),0 0 32px 10px rgba(25,144,255,0.1)}100%{box-shadow:0 0 0 0 rgba(25,144,255,0),0 0 0 0 rgba(25,144,255,0)}}'}</style>
        {resumeCard && <ChatResumeCard card={resumeCard} />}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #93c5fd', borderRadius: 13, background: 'white', padding: '8px 10px', animation: inputFilled ? 'ba-input-glow 0.9s cubic-bezier(0.2,0,0,1)' : 'none', transition: 'border-color 0.2s', boxShadow: '0 0 0 3px rgba(25,144,255,0.10), 0 2px 10px rgba(25,144,255,0.12)' }}>
          {/* Branded placeholder overlay */}
          <textarea ref={textareaRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey}
          placeholder={loading ? 'BlueAI is working…' : 'Type your message...'} disabled={loading} rows={1}
          className="ba-input-ph"
          style={{ flex: 1, resize: 'none', background: 'transparent', border: 'none', outline: 'none', fontSize: 13.5, color: '#1f2937', padding: '4px 6px', lineHeight: 1.5, fontFamily: 'inherit', maxHeight: 120, overflowY: 'hidden' }} />
          <button onClick={loading ? () => setLoading(false) : sendMsg} disabled={!loading && !input.trim()}
          style={{ width: 34, height: 34, borderRadius: '50%', background: loading ? '#ef4444' : '#1990FF', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: !loading && !input.trim() ? 0.4 : 1, transition: 'background 0.15s' }}>
            {loading ? <svg width="14" height="14" viewBox="0 0 16 16"><rect x="5" y="5" width="6" height="6" rx="1.5" fill="white" /></svg> : <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polygon points="22 2 15 22 11 13 2 9 22 2" fill="white" /></svg>}
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 5, paddingBottom: 2 }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
          <span style={{ fontSize: 10.5, color: '#94a3b8', fontFamily: 'inherit' }}>
            Claude Haiku 3.5 ·{' '}
            <button onClick={() => {if (window.__onNavToSettings) window.__onNavToSettings();}}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 10.5, fontFamily: 'inherit', textDecoration: 'underline', padding: 0 }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#1990FF'} onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}>Change</button>
          </span>
        </div>
      </div>
    </>);

}