// BlueAI PM — Jobs Component
// Matches frontend/src/components/jobs/Jobs.tsx + Job.tsx

const { useState } = React;

const SAMPLE_JOBS = [
  { id: '1', title: 'Like Instagram Post', description: 'Open Instagram and like the specified post within the session.', amount: 150, currency: 'BCX', state: 'assigned', expiresAt: new Date(Date.now() + 86400000).toISOString(), updatedAt: new Date() },
  { id: '2', title: 'Whiteout Survival Daily Login', description: 'Complete daily login rewards and collect all available bonuses in Whiteout Survival.', amount: 80, currency: 'BCX', state: 'accepted', expiresAt: new Date(Date.now() + 86400000).toISOString(), updatedAt: new Date() },
  { id: '3', title: 'Coin Collection Run', description: 'Collect coins across 3 consecutive game sessions using the coin-collector skill.', amount: 200, currency: 'BCX', state: 'assigned', expiresAt: new Date(Date.now() + 3600000).toISOString(), updatedAt: new Date() },
  { id: '4', title: 'Farm Resources — World Map', description: 'Use the resource-farmer skill to gather resources from the world map.', amount: 120, currency: 'BCX', state: 'failed', expiresAt: new Date(Date.now() + 86400000).toISOString(), updatedAt: new Date(Date.now() - 3600000) },
];

const HISTORY_JOBS = [
  { id: '5', title: 'Arena Battle Round', description: 'Participate in 10 arena battles using optimal attack strategy.', amount: 300, currency: 'BCX', state: 'completed', expiresAt: new Date(Date.now() - 1000).toISOString(), updatedAt: new Date(Date.now() - 7200000) },
  { id: '6', title: 'Alliance Task Set', description: 'Complete a full set of daily alliance tasks.', amount: 90, currency: 'BCX', state: 'completed', expiresAt: new Date(Date.now() - 1000).toISOString(), updatedAt: new Date(Date.now() - 14400000) },
];

const STATUS_MAP = {
  assigned:    { bg: '#FEF9C3', color: '#92400E' },
  accepted:    { bg: '#DCFCE7', color: '#166534' },
  'in-progress': { bg: '#DBEAFE', color: '#1E40AF' },
  completed:   { bg: '#BBF7D0', color: '#14532D' },
  failed:      { bg: '#FECACA', color: '#7F1D1D' },
  declined:    { bg: '#FEE2E2', color: '#991B1B' },
  expired:     { bg: '#CBD5E1', color: '#374151' },
};

function JobItem({ job, onSelect }) {
  const [hov, setHov] = useState(false);
  const isExpired = new Date() > new Date(job.expiresAt);
  const status = isExpired && job.state !== 'completed' ? 'expired' : job.state;
  const { bg, color } = STATUS_MAP[status] || { bg: '#F3F4F6', color: '#374151' };

  return (
    <li onClick={() => onSelect(job)} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, padding: '12px 14px', cursor: 'pointer', boxShadow: hov ? '0 4px 6px -1px rgba(0,0,0,0.10)' : '0 1px 2px rgba(0,0,0,0.05)', transition: 'all 200ms', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#111827', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.title}</h2>
          {job.description && <p style={{ fontSize: 13, color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.description}</p>}
        </div>
        {job.amount > 0 && (
          <div style={{ background: job.state === 'completed' ? '#DCFCE7' : '#EEF2FF', border: `1px solid ${job.state === 'completed' ? '#BBF7D0' : '#C7D2FE'}`, borderRadius: 999, padding: '3px 10px', flexShrink: 0 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: job.state === 'completed' ? '#15803D' : '#4F46E5' }}>{job.amount} {job.currency}</span>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ borderRadius: 2, padding: '1px 7px', fontSize: 11, fontWeight: 500, background: bg, color, display: 'inline-block', textTransform: 'capitalize' }}>{status}</span>
        {job.state === 'completed' && job.updatedAt && (
          <span style={{ fontSize: 11, color: '#9CA3AF' }}>{new Date(job.updatedAt).toLocaleDateString()}</span>
        )}
      </div>
      {!isExpired && (
        <div style={{ display: 'flex', gap: 8 }} onClick={e => e.stopPropagation()}>
          {job.state === 'assigned' && <button style={{ flex: 1, border: '1px solid #D1D5DB', background: '#fff', borderRadius: 8, padding: '7px', fontSize: 13, fontWeight: 500, color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}>More Info</button>}
          {job.state === 'accepted' && <button style={{ flex: 1, background: '#1990FF', border: 'none', borderRadius: 8, padding: '8px', fontSize: 13, fontWeight: 500, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>Start</button>}
          {job.state === 'failed' && <button style={{ flex: 1, background: '#1990FF', border: 'none', borderRadius: 8, padding: '8px', fontSize: 13, fontWeight: 500, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>Retry</button>}
        </div>
      )}
    </li>
  );
}

function JobDetailModal({ job, onClose }) {
  const [checked, setChecked] = useState(false);
  if (!job) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 560, maxHeight: '85vh', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.10)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid #E5E7EB', flexShrink: 0 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#111827' }}>{job.title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 4, borderRadius: 6 }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div style={{ overflowY: 'auto', padding: '16px 20px' }}>
          <p style={{ fontSize: 14, color: '#4B5563', marginBottom: 16, lineHeight: 1.6 }}>{job.description}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ background: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: 999, padding: '4px 14px' }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#4F46E5' }}>{job.amount} {job.currency}</span>
            </div>
            <span style={{ fontSize: 13, color: '#6B7280' }}>Reward on completion</span>
          </div>
          <div style={{ background: '#F9FAFB', borderRadius: 8, padding: 14, marginBottom: 16 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Pre-Requisites</h3>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} style={{ marginTop: 2, accentColor: '#4F46E5' }} />
              <span style={{ fontSize: 13, color: '#374151' }}>I confirm all prerequisites are met and the BlueStacks App Player is running.</span>
            </label>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={onClose} style={{ border: '1px solid #D1D5DB', background: '#fff', borderRadius: 8, padding: '8px 18px', fontSize: 14, fontWeight: 500, color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}>Decline Job</button>
            <button disabled={!checked} style={{ background: checked ? '#1990FF' : '#1990FF', opacity: checked ? 1 : 0.4, border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 14, fontWeight: 500, color: '#fff', cursor: checked ? 'pointer' : 'not-allowed', fontFamily: 'inherit', transition: 'opacity 200ms' }}>Accept Job</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Jobs() {
  const [selectedJob, setSelectedJob] = useState(null);
  return (
    <div style={{ paddingBottom: 60 }}>
      {selectedJob && <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />}

      {/* Active jobs */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>Active Jobs</h2>
        </div>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SAMPLE_JOBS.map(job => <JobItem key={job.id} job={job} onSelect={setSelectedJob} />)}
        </ul>
      </div>

      {/* History */}
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 14 }}>Job History</h2>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {HISTORY_JOBS.map(job => <JobItem key={job.id} job={job} onSelect={setSelectedJob} />)}
        </ul>
      </div>
    </div>
  );
}

Object.assign(window, { Jobs });
