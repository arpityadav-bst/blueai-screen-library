// BlueAI — Schedule Screen

const { useState } = React;

const SCHED_TASKS_INIT = [
  { id: 'st1', name: 'Daily Coin Master Rewards', schedule: { type: 'daily' }, next_run: new Date(Date.now() + 86400000).toISOString() },
  { id: 'st2', name: 'Weekly Social Media Posts', schedule: { type: 'weekly', weekdays: ['Mon', 'Wed', 'Fri'] }, next_run: new Date(Date.now() + 86400000 * 3).toISOString() },
];

function repeatLabel(sch) {
  if (!sch?.type) return 'One time';
  if (sch.type === 'daily')   return 'Daily';
  if (sch.type === 'weekly')  return `Weekly (${Array.isArray(sch.weekdays) ? sch.weekdays.join(', ') : ''})`;
  if (sch.type === 'monthly') return `Monthly (day ${sch.day_of_month})`;
  if (sch.type === 'minutes') return `Every ${sch.interval_minutes} min`;
  return sch.type;
}

function ScheduleCard({ task, onEdit, onDelete }) {
  return (
    <li style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16, marginBottom: 12, listStyle: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 12 }}>{task.name}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6b7280' }}>
          <svg width="14" height="14" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span><strong style={{ color: '#374151' }}>Schedule:</strong> {repeatLabel(task.schedule)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6b7280' }}>
          <svg width="14" height="14" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span>
            <strong style={{ color: '#374151' }}>Next run:</strong>{' '}
            <span style={{ color: '#4f46e5', fontWeight: 500 }}>
              {task.next_run ? new Date(task.next_run).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
            </span>
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onEdit} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, border: '1px solid #e2e8f0', borderRadius: 8, background: 'white', padding: '9px 12px', fontSize: 13, fontWeight: 500, color: '#374151', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.12s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
          onMouseLeave={e => e.currentTarget.style.background = 'white'}>
          <IcoPencilEdit size={13} /> Edit
        </button>
        <button onClick={onDelete} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, border: '1px solid #e2e8f0', borderRadius: 8, background: 'white', padding: '9px 12px', fontSize: 13, fontWeight: 500, color: '#374151', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.12s, color 0.12s, border-color 0.12s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.borderColor = '#fecaca'; e.currentTarget.style.color = '#dc2626'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#374151'; }}>
          <IcoTrashBin size={13} /> Delete
        </button>
      </div>
    </li>
  );
}

function CreateScheduleModal({ isOpen, onClose, onSave }) {
  const [name, setName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [repeat, setRepeat] = useState('daily');
  const canSave = name.trim() && prompt.trim();
  const submit = e => { e.preventDefault(); if (!canSave) return; onSave({ id: 'st' + Date.now(), name: name.trim(), schedule: { type: repeat }, next_run: new Date(Date.now() + 86400000).toISOString() }); setName(''); setPrompt(''); setRepeat('daily'); onClose(); };
  const fieldStyle = { width: '100%', border: '1px solid #d1d5db', borderRadius: 8, padding: '9px 12px', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' };
  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose} title="Schedule task">
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Task name <span style={{ color: '#ef4444' }}>*</span></label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Daily rewards collection" style={fieldStyle} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Task prompt <span style={{ color: '#ef4444' }}>*</span></label>
          <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe what BlueAI should do…" rows={3} style={{ ...fieldStyle, resize: 'vertical' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Repeat</label>
          <select value={repeat} onChange={e => setRepeat(e.target.value)} style={{ ...fieldStyle, background: 'white', cursor: 'pointer' }}>
            <option value="once">One time</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="button" onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: 8, background: 'white', border: '1px solid #e2e8f0', fontSize: 14, fontWeight: 500, color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
          <button type="submit" disabled={!canSave} style={{ flex: 1, padding: '10px', borderRadius: 8, background: canSave ? '#4f46e5' : '#e0e7ff', border: 'none', fontSize: 14, fontWeight: 600, color: canSave ? 'white' : '#a5b4fc', cursor: canSave ? 'pointer' : 'default', fontFamily: 'inherit' }}>Create</button>
        </div>
      </form>
    </ModalOverlay>
  );
}

function ScheduleScreen({ isLoading }) {
  const [tasks, setTasks] = useState(SCHED_TASKS_INIT);
  const [showCreate, setShowCreate] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  if (isLoading) return (
    <div style={{ paddingTop: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <Shimmer h={24} w={150} r={7} />
        <Shimmer h={32} w={64} r={8} />
      </div>
      {[1, 2].map(i => (
        <div key={i} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16, marginBottom: 12 }}>
          <Shimmer h={17} w="65%" r={6} extra={{ marginBottom: 14 }} />
          <Shimmer h={12} w="80%" r={5} extra={{ marginBottom: 8 }} />
          <Shimmer h={12} w="60%" r={5} extra={{ marginBottom: 16 }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <Shimmer h={36} r={8} extra={{ flex: 1 }} />
            <Shimmer h={36} r={8} extra={{ flex: 1 }} />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ paddingTop: 14, paddingBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>Scheduled tasks</h1>
        <button onClick={() => setShowCreate(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#1990FF', color: 'white', border: 'none', borderRadius: 20, padding: '6px 13px 6px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          <IcoPlusSmall size={11} /> New
        </button>
      </div>

      {tasks.length === 0 ? (
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '48px 20px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
            <svg width="24" height="24" fill="none" stroke="#9333ea" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#374151', marginBottom: 6 }}>No scheduled tasks</p>
          <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 16, lineHeight: 1.5 }}>Schedule jobs to run automatically at specific times.</p>
          <button onClick={() => setShowCreate(true)} style={{ background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: 8, padding: '9px 20px', fontSize: 14, fontWeight: 600, color: '#4f46e5', cursor: 'pointer', fontFamily: 'inherit' }}>Create schedule</button>
        </div>
      ) : (
        <ul style={{ padding: 0, margin: 0 }}>
          {tasks.map(t => (
            <ScheduleCard key={t.id} task={t} onEdit={() => {}} onDelete={() => setConfirmId(t.id)} />
          ))}
        </ul>
      )}

      <CreateScheduleModal isOpen={showCreate} onClose={() => setShowCreate(false)} onSave={t => setTasks(prev => [...prev, t])} />

      <ModalOverlay isOpen={!!confirmId} onClose={() => setConfirmId(null)} title="Confirm delete">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>Are you sure you want to delete this scheduled task? This action cannot be undone.</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setConfirmId(null)} style={{ flex: 1, padding: '10px', borderRadius: 8, background: 'white', border: '1px solid #e2e8f0', fontSize: 14, fontWeight: 500, color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
            <button onClick={() => { setTasks(p => p.filter(t => t.id !== confirmId)); setConfirmId(null); }} style={{ flex: 1, padding: '10px', borderRadius: 8, background: '#ef4444', border: 'none', fontSize: 14, fontWeight: 600, color: 'white', cursor: 'pointer', fontFamily: 'inherit' }}>Delete</button>
          </div>
        </div>
      </ModalOverlay>
    </div>
  );
}
