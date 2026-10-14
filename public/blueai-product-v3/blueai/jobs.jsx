// BlueAI: Jobs Screen

const { useState } = React;

const JOB_STATUS = {
  assigned:      { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8',  label: 'Assigned' },
  accepted:      { bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d',  label: 'Accepted' },
  'in-progress': { bg: '#dbeafe', border: '#93c5fd', text: '#1e40af',  label: 'In progress' },
  completed:     { bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d',  label: 'Completed' },
  failed:        { bg: '#fef2f2', border: '#fecaca', text: '#dc2626',  label: 'Failed' },
  declined:      { bg: '#f9fafb', border: '#e5e7eb', text: '#6b7280',  label: 'Declined' },
  expired:       { bg: '#f9fafb', border: '#e5e7eb', text: '#9ca3af',  label: 'Expired' },
};

const D = 86400000;
const N = Date.now();

const JOBS_ACTIVE = [
  { id: 'j1', title: 'Coin Master Daily Rewards', desc: 'Collect all daily spins and bonuses from Coin Master for the next 7 days.', state: 'assigned',  bcx: 15, expires: new Date(N + D*2), updated: new Date(N - 3600000) },
  { id: 'j2', title: 'Whiteout Survival – Alliance Tasks', desc: 'Complete alliance war tasks and collect all daily rewards in Whiteout Survival.', state: 'accepted', bcx: 25, expires: new Date(N + D*3), updated: new Date(N - 7200000) },
  { id: 'j3', title: 'Social Media Post Campaign', desc: 'Create and schedule 5 Instagram posts for a gaming account this week.', state: 'failed', bcx: 40, expires: new Date(N + D), updated: new Date(N - 10800000) },
];

const JOBS_HISTORY = [
  { id: 'h1', title: 'King of Avalon – Daily Grind', desc: 'Complete all daily quests and collect resources.', state: 'completed', bcx: 50, expires: new Date(N - D),  updated: new Date(N - D*2) },
  { id: 'h2', title: 'Free Play Store Games', desc: 'Find and download all free games available on the Play Store.', state: 'expired', bcx: 20, expires: new Date(N - D*3), updated: new Date(N - D*4) },
];

function StatusBadge({ state, isExpired }) {
  const s = JOB_STATUS[isExpired ? 'expired' : (state || 'assigned')] || JOB_STATUS.assigned;
  return <span style={{ display: 'inline-flex', alignItems: 'center', background: s.bg, border: `1px solid ${s.border}`, color: s.text, fontSize: 11.5, fontWeight: 600, padding: '3px 8px', borderRadius: 4 }}>{s.label}</span>;
}

function JobDetailsModal({ job, isOpen, onClose }) {
  if (!job) return null;
  const isExpired = new Date() > job.expires;
  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose} title="Job details">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#111827', lineHeight: 1.3 }}>{job.title}</h3>
            {job.bcx > 0 && <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 20, padding: '3px 10px', flexShrink: 0 }}><span style={{ fontSize: 12.5, fontWeight: 700, color: '#1d4ed8' }}>{job.bcx} BCX</span></div>}
          </div>
          <StatusBadge state={job.state} isExpired={isExpired} />
        </div>
        <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>{job.desc}</p>
        <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '14px 16px' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.06em', marginBottom: 10, textTransform: 'uppercase' }}>Details</p>
          {[['Reward', `${job.bcx} BCX`], ['Expires', job.expires.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })], ['Updated', job.updated.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })]].map(([l, v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid #f3f4f6' }}>
              <span style={{ fontSize: 13, color: '#6b7280' }}>{l}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>{v}</span>
            </div>
          ))}
        </div>
        {!isExpired && (
          <div style={{ display: 'flex', gap: 10 }}>
            {job.state === 'assigned' && <>
              <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: 8, background: '#4f46e5', border: 'none', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Accept job</button>
              <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: 8, background: 'white', border: '1px solid #e5e7eb', color: '#374151', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Decline</button>
            </>}
            {job.state === 'accepted' && <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: 8, background: '#4f46e5', border: 'none', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Start</button>}
            {job.state === 'failed'   && <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: 8, background: '#4f46e5', border: 'none', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Retry</button>}
          </div>
        )}
      </div>
    </ModalOverlay>
  );
}

function JobCard({ job }) {
  const [open, setOpen] = useState(false);
  const isExpired = new Date() > job.expires;
  const isDone    = job.state === 'completed';
  return (
    <li onClick={() => setOpen(true)}
      style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 16px', marginBottom: 12, cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', listStyle: 'none', transition: 'box-shadow 0.15s, border-color 0.15s' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor = '#c7d2fe'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor = '#e2e8f0'; }}>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 6 }}>
        <h3 style={{ fontSize: 15.5, fontWeight: 700, color: '#111827', lineHeight: 1.3, flex: 1 }}>{job.title}</h3>
        {job.bcx > 0 && (
          <div style={{ background: isDone ? '#f0fdf4' : '#eff6ff', border: `1px solid ${isDone ? '#bbf7d0' : '#bfdbfe'}`, borderRadius: 20, padding: '3px 9px', flexShrink: 0 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: isDone ? '#15803d' : '#1d4ed8' }}>{job.bcx} BCX</span>
          </div>
        )}
      </div>
      <p style={{ fontSize: 12.5, color: '#6b7280', marginBottom: 10, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{job.desc}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <StatusBadge state={job.state} isExpired={isExpired} />
        {isDone && <span style={{ fontSize: 11, color: '#9ca3af' }}>{job.updated.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>}
      </div>

      {!isExpired && !isDone && (
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }} onClick={e => e.stopPropagation()}>
          {job.state === 'assigned' && <button onClick={e => { e.stopPropagation(); setOpen(true); }} style={{ flex: 1, padding: '8px', borderRadius: 8, background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>More info</button>}
          {job.state === 'accepted' && <button onClick={e => { e.stopPropagation(); setOpen(true); }} style={{ flex: 1, padding: '8px', borderRadius: 8, background: '#4f46e5', border: 'none', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Start</button>}
          {job.state === 'failed'   && <button onClick={e => { e.stopPropagation(); setOpen(true); }} style={{ flex: 1, padding: '8px', borderRadius: 8, background: '#4f46e5', border: 'none', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Retry</button>}
        </div>
      )}

      <JobDetailsModal job={job} isOpen={open} onClose={() => setOpen(false)} />
    </li>
  );
}

/* V3 (phase 4, worker.css): the tab is an empty state today. It names what will appear, on a
   sunken mark in the muted ink (no coloured circle, no illustration); the skeleton cards take the
   in-flow card (1px line, 16 radius, no cast). */
function JobsScreen({ isLoading }) {
  if (isLoading) return (
    <div className="v3-tab">
      <Shimmer h={26} w={120} r={6} extra={{ marginBottom: 20 }} />
      <div className="v3-list">
        {[1, 2, 3].map(i => (
          <div key={i} className="v3-skel">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <Shimmer h={16} w="62%" r={6} />
              <Shimmer h={22} w={52} r={999} />
            </div>
            <Shimmer h={12} w="90%" r={5} extra={{ marginBottom: 6 }} />
            <Shimmer h={12} w="72%" r={5} extra={{ marginBottom: 14 }} />
            <Shimmer h={22} w={72} r={4} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="v3-empty v3-empty--page">
      <div className="v3-empty-mark"><IcoBriefcase size={24} stroke={1.75} /></div>
      <h2 className="v3-empty-title">Coming Soon</h2>
      <p className="v3-empty-text">
        We are working on this section to bring you new opportunities. Check back soon for updates!
      </p>
    </div>
  );
}
