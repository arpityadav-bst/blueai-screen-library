// BlueAI: Schedule Screen
/* V3 (phase 4; kit parts since review round 1): kit cards with a 1px line and no cast; the next run
   is a muted line with one ink figure (blue is not for data); Edit is secondary and Delete the
   danger trigger (red on hover only), its confirm the destructive commit; the one committing action
   per view is the primary (Create, and Create schedule on the empty state), so the header's New is
   secondary. Kit fields: label above, 1px line, blue edge and soft ring on focus. The title sits in
   the one screen header, 24px (the kit's ScreenHeader since review round 2). Review round 1 (U16):
   Edit opens the same form filled in with the task, saved in place; the form's first field takes
   focus. Every glyph is the kit's Icon; the empty state sits on the ground (no card), and both
   dialogs end on the dialogs' one button row (review round 2). */

const { useState, useEffect } = React;

const SCHED_TASKS_INIT = [
  { id: 'st1', name: 'Daily Coin Master Rewards', prompt: 'Open Coin Master and collect the daily rewards.', schedule: { type: 'daily' }, next_run: new Date(Date.now() + 86400000).toISOString() },
  { id: 'st2', name: 'Weekly Social Media Posts', prompt: 'Post this week’s updates to my social media accounts.', schedule: { type: 'weekly', weekdays: ['Mon', 'Wed', 'Fri'] }, next_run: new Date(Date.now() + 86400000 * 3).toISOString() },
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
    <li className="v2-card v3-sched">
      <h3 className="v2-text-title v3-sched-title">{task.name}</h3>
      <div className="v3-sched-meta">
        <div className="v3-sched-line">
          <IcoCalendar size={16} />
          <span><strong>Schedule:</strong> {repeatLabel(task.schedule)}</span>
        </div>
        <div className="v3-sched-line">
          <window.V2Kit.Icon name="clock" />
          <span>
            <strong>Next run:</strong>{' '}
            <span className="v3-figure">
              {task.next_run ? new Date(task.next_run).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
            </span>
          </span>
        </div>
      </div>
      <div className="v3-btn-row">
        <button type="button" onClick={onEdit} className="v2-button v2-button--secondary">
          <IcoPencilEdit /> Edit
        </button>
        <button type="button" onClick={onDelete} className="v2-button v2-button--danger">
          <IcoTrashBin /> Delete
        </button>
      </div>
    </li>
  );
}

/* One form for a new task and an edited one: `task` fills it in, and saving keeps its id, so the
   list replaces it in place. */
function ScheduleTaskModal({ isOpen, task, onClose, onSave }) {
  const [name, setName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [repeat, setRepeat] = useState('daily');
  useEffect(() => {
    if (!isOpen) return;
    setName(task ? task.name : ''); setPrompt(task ? task.prompt || '' : '');
    setRepeat(task && task.schedule && ['once', 'daily', 'weekly', 'monthly'].includes(task.schedule.type) ? task.schedule.type : 'daily');
  }, [isOpen, task]);
  const canSave = name.trim() && prompt.trim();
  const submit = e => {
    e.preventDefault(); if (!canSave) return;
    onSave({ ...(task || { id: 'st' + Date.now(), next_run: new Date(Date.now() + 86400000).toISOString() }), name: name.trim(), prompt: prompt.trim(), schedule: { ...(task && task.schedule), type: repeat } });
    onClose();
  };
  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose} title={task ? 'Edit task' : 'Schedule task'} initialFocus="#sched-name">
      <form onSubmit={submit} className="v3-form">
        <Field id="sched-name" label="Task name">
          <input id="sched-name" className="v2-field-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Daily rewards collection" />
        </Field>
        <Field id="sched-prompt" label="Task prompt" className="v2-field--area">
          <textarea id="sched-prompt" className="v2-field-input v2-field-input--area" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe what BlueAI should do…" rows={3} />
        </Field>
        <SelectField id="sched-repeat" label="Repeat" value={repeat} onChange={e => setRepeat(e.target.value)}>
          <option value="once">One time</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </SelectField>
        <div className="v3-btn-row v3-dlg-actions">
          <button type="button" onClick={onClose} className="v2-button v2-button--secondary v2-button--lg">Cancel</button>
          <button type="submit" disabled={!canSave} aria-disabled={!canSave} className="v2-button v2-button--primary v2-button--lg">{task ? 'Save' : 'Create'}</button>
        </div>
      </form>
    </ModalOverlay>
  );
}

function ScheduleScreen({ isLoading }) {
  const [tasks, setTasks] = useState(SCHED_TASKS_INIT);
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState(null);   // the task the form is editing, null for a new one
  const [confirmId, setConfirmId] = useState(null);
  const openForm = (t) => { setEditing(t || null); setShowCreate(true); };

  if (isLoading) return (
    <div>
      <div className="v2-screen-header">
        <Shimmer h={24} w={150} r={6} extra={{ marginRight: 'auto' }} />
        <Shimmer h={36} w={72} r={6} />
      </div>
      <div className="v3-screen-body v3-list">
        {[1, 2].map(i => (
          <div key={i} className="v2-card">
            <Shimmer h={17} w="65%" r={6} extra={{ marginBottom: 14 }} />
            <Shimmer h={12} w="80%" r={5} extra={{ marginBottom: 8 }} />
            <Shimmer h={12} w="60%" r={5} extra={{ marginBottom: 16 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <Shimmer h={36} r={6} extra={{ flex: 1 }} />
              <Shimmer h={36} r={6} extra={{ flex: 1 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="v3-tabpage">
      <ScreenHead title="Scheduled tasks">
        <button type="button" onClick={() => openForm()} className="v2-button v2-button--secondary">
          <IcoPlusSmall /> New
        </button>
      </ScreenHead>

      <div className="v3-screen-body">
      {tasks.length === 0 ? (
        <div className="v2-empty v3-fill">
          <div className="v2-empty-icon"><IcoCalendar size={24} /></div>
          <p className="v2-text-title-lg v2-empty-title">No scheduled tasks</p>
          <p className="v2-text-body v2-empty-body">Schedule jobs to run automatically at specific times.</p>
          <div className="v2-empty-actions"><button type="button" onClick={() => openForm()} className="v2-button v2-button--primary">Create schedule</button></div>
        </div>
      ) : (
        <ul className="v3-list">
          {tasks.map(t => (
            <ScheduleCard key={t.id} task={t} onEdit={() => openForm(t)} onDelete={() => setConfirmId(t.id)} />
          ))}
        </ul>
      )}
      </div>

      <ScheduleTaskModal isOpen={showCreate} task={editing} onClose={() => setShowCreate(false)}
        onSave={t => setTasks(prev => (prev.some(p => p.id === t.id) ? prev.map(p => (p.id === t.id ? t : p)) : [...prev, t]))} />

      <ModalOverlay isOpen={!!confirmId} onClose={() => setConfirmId(null)} title="Confirm delete">
        <div className="v3-form">
          <p className="v2-text-body">Are you sure you want to delete this scheduled task? This action cannot be undone.</p>
          <div className="v3-btn-row v3-dlg-actions">
            <button type="button" onClick={() => setConfirmId(null)} className="v2-button v2-button--secondary v2-button--lg">Cancel</button>
            <button type="button" onClick={() => { setTasks(p => p.filter(t => t.id !== confirmId)); setConfirmId(null); }} className="v2-button v2-button--destructive v2-button--lg">Delete</button>
          </div>
        </div>
      </ModalOverlay>
    </div>
  );
}
