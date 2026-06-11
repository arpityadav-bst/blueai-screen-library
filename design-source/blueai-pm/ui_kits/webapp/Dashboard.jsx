// BlueAI PM — Dashboard Component
// Matches frontend/src/components/Dashboard.tsx

const { useState } = React;

const SKILLS = [
  { id: '1', name: 'coin-collector', description: 'Automatically collects in-game coins in Whiteout Survival every cycle.', active: true },
  { id: '2', name: 'whiteout-daily', description: 'Completes daily login rewards and alliance tasks automatically.', active: true },
  { id: '3', name: 'resource-farmer', description: 'Farms resources from the world map on a set schedule.', active: false },
  { id: '4', name: 'arena-battler', description: 'Participates in arena battles using optimal strategy.', active: true },
];

const JOBS = [
  { id: '1', title: 'Like Instagram Post', description: 'Open Instagram and like the specified post within the session.', amount: 150, state: 'assigned' },
  { id: '2', title: 'Whiteout Daily Login', description: 'Complete daily login rewards in Whiteout Survival.', amount: 80, state: 'accepted' },
  { id: '3', title: 'Coin Collection Run', description: 'Collect coins across 3 game sessions.', amount: 200, state: 'assigned' },
];

function StatusBadge({ state }) {
  const map = {
    assigned:   { bg: '#FEF9C3', color: '#92400E' },
    accepted:   { bg: '#DCFCE7', color: '#166534' },
    'in-progress': { bg: '#DBEAFE', color: '#1E40AF' },
    completed:  { bg: '#BBF7D0', color: '#14532D' },
    failed:     { bg: '#FECACA', color: '#7F1D1D' },
  };
  const s = map[state] || { bg: '#F3F4F6', color: '#374151' };
  return <span style={{ borderRadius: 2, padding: '1px 7px', fontSize: 11, fontWeight: 500, background: s.bg, color: s.color, textTransform: 'capitalize' }}>{state}</span>;
}

function OverviewCard({ title, value, iconBg, icon }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: '#fff', border: `1px solid ${hov ? '#A5B4FC' : '#E2E8F0'}`, borderRadius: 12, padding: 14, boxShadow: hov ? '0 4px 6px -1px rgba(0,0,0,0.1)' : '0 1px 2px rgba(0,0,0,0.05)', transition: 'all 200ms', cursor: 'pointer', background: hov ? 'rgba(238,242,255,0.3)' : '#fff' }}>
      <div style={{ width: 36, height: 36, borderRadius: 8, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>{icon}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 2 }}>{value}</div>
      <div style={{ fontSize: 11, color: '#4B5563', fontWeight: 500 }}>{title}</div>
    </div>
  );
}

function Dashboard({ onNavigate, onNewChat }) {
  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ marginBottom: 12 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>Overview</h1>
      </div>

      {/* Overview cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 16 }}>
        <OverviewCard title="Skills Active" value="5/8" iconBg="#4F46E5" icon={<svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>} />
        <OverviewCard title="Tasks Done" value="142" iconBg="#22C55E" icon={<svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>} />
        <OverviewCard title="Jobs Available" value="3" iconBg="#F97316" icon={<svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>} />
        <OverviewCard title="Tasks Scheduled" value="2" iconBg="#A855F7" icon={<svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>} />
      </div>

      {/* CTA Band */}
      <div style={{ background: 'linear-gradient(to bottom right,#4F46E5,#9333EA)', borderRadius: 12, padding: 20, color: '#fff', marginBottom: 16, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="22" height="22" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Execute Android Tasks Through <span style={{ color: '#67E8F9' }}>Natural Language</span> Commands</h2>
        </div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 16, lineHeight: 1.5 }}>Control your BlueStacks App Player with the power of AI. Just describe what you want to do, and watch your tasks execute automatically.</p>
        <button onClick={onNewChat} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff', border: 'none', borderRadius: 8, padding: '9px 20px', fontSize: 14, fontWeight: 600, color: '#4F46E5', cursor: 'pointer', fontFamily: 'inherit' }}>
          Submit Task
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>

      {/* Skills grid */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ marginBottom: 14 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>Skills Management</h2>
          <p style={{ fontSize: 14, color: '#4B5563', marginTop: 2 }}>Enable, disable, or create custom skills to extend your automation capabilities</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
          {SKILLS.map(skill => (
            <div key={skill.id} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 20, boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'all 200ms', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor = '#CBD5E1'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor = '#E2E8F0'; }}>
              <div>
                <div style={{ marginBottom: 10 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, background: skill.active ? '#E0E7FF' : '#F1F5F9', color: skill.active ? '#4F46E5' : '#374151', borderRadius: 999, padding: '2px 9px', fontSize: 11, fontWeight: 500 }}>
                    <svg width="10" height="10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                    {skill.active ? 'Active' : 'Disabled'}
                  </span>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 6 }}>{skill.name}</h3>
                <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.4, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{skill.description}</p>
              </div>
              <button onClick={() => onNavigate('skills')} style={{ width: '100%', background: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: 8, padding: '8px', fontSize: 13, fontWeight: 600, color: '#4F46E5', cursor: 'pointer', fontFamily: 'inherit' }}>View Details</button>
            </div>
          ))}
        </div>
      </div>

      {/* Jobs grid */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ marginBottom: 14 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>Jobs</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          {JOBS.map(job => (
            <div key={job.id} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 20, boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'all 200ms', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'; }}>
              <div>
                <div style={{ marginBottom: 8 }}><StatusBadge state={job.state} /></div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#111827', marginBottom: 6 }}>{job.title}</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 8 }}>
                  <span style={{ fontSize: 22, fontWeight: 700, color: '#4F46E5' }}>{job.amount}</span>
                  <span style={{ fontSize: 12, color: '#6B7280' }}>BCX</span>
                </div>
                <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.4, marginBottom: 14 }}>{job.description}</p>
              </div>
              <button onClick={() => onNavigate('jobs')} style={{ width: '100%', background: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: 8, padding: '8px', fontSize: 13, fontWeight: 600, color: '#4F46E5', cursor: 'pointer', fontFamily: 'inherit' }}>{job.state === 'assigned' ? 'More Info' : 'Start'}</button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick access */}
      <div>
        <h3 style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>Quick Access</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
          {[
            { label: 'Wallet', desc: 'Manage Payments', iconBg: '#F0FDF4', iconColor: '#22C55E', route: 'wallet' },
            { label: 'Profile', desc: 'View and Edit Your Profile', iconBg: '#EFF6FF', iconColor: '#3B82F6', route: 'profile' },
          ].map(item => (
            <div key={item.label} onClick={() => onNavigate(item.route)} style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, padding: 14, cursor: 'pointer', transition: 'all 200ms' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor = '#CBD5E1'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#E2E8F0'; }}>
              <div style={{ width: 44, height: 44, borderRadius: 8, background: item.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="20" height="20" fill="none" stroke={item.iconColor} strokeWidth="2" viewBox="0 0 24 24">
                  {item.label === 'Wallet' ? <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/> : <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>}
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{item.label}</div>
                <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{item.desc}</div>
              </div>
              <svg width="16" height="16" fill="none" stroke="#9CA3AF" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Dashboard, StatusBadge });
