// BlueAI PM — Skills Component
// Matches frontend/src/components/skills/Skills.tsx + Skill.tsx

const { useState, useRef } = React;

const SAMPLE_SKILLS = [
  { skillId: '1', name: 'coin-collector', description: 'Automatically collects in-game coins in Whiteout Survival every cycle. Runs every 30 minutes.', userDisabled: false, owner: 'user', updatedAt: new Date(Date.now() - 3600000).toISOString() },
  { skillId: '2', name: 'whiteout-daily', description: 'Completes daily login rewards and alliance tasks automatically at the start of each day.', userDisabled: false, owner: 'user', updatedAt: new Date(Date.now() - 86400000).toISOString() },
  { skillId: '3', name: 'resource-farmer', description: 'Farms resources from the world map on a configurable schedule. Supports multiple resource types.', userDisabled: true, owner: 'user', updatedAt: new Date(Date.now() - 172800000).toISOString() },
  { skillId: '4', name: 'arena-battler', description: 'Participates in arena battles using optimal strategy. Wins or retreats based on opponent power level.', userDisabled: false, owner: 'nowgg', updatedAt: new Date(Date.now() - 259200000).toISOString() },
  { skillId: '5', name: 'guild-helper', description: 'Assists with guild tasks including donations, construction acceleration, and research tasks.', userDisabled: false, owner: 'nowgg', updatedAt: new Date(Date.now() - 345600000).toISOString() },
  { skillId: '6', name: 'quest-runner', description: 'Automatically completes daily and weekly quests when skill conditions are met.', userDisabled: true, owner: 'nowgg', updatedAt: new Date(Date.now() - 432000000).toISOString() },
];

function SkillRow({ skill, onModify, onView, onToggle }) {
  const [hov, setHov] = useState(false);
  const [enabled, setEnabled] = useState(!skill.userDisabled);

  const handleToggle = (e) => {
    e.stopPropagation();
    setEnabled(v => !v);
    onToggle && onToggle(skill.skillId, enabled);
  };

  return (
    <div onClick={() => onView(skill)} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px 16px', cursor: 'pointer', boxShadow: hov ? '0 4px 6px -1px rgba(0,0,0,0.10)' : '0 1px 2px rgba(0,0,0,0.05)', transition: 'all 200ms', display: 'flex', alignItems: 'center', gap: 14 }}>
      {/* Status badge */}
      <div style={{ flexShrink: 0 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, background: enabled ? '#E0E7FF' : '#F1F5F9', color: enabled ? '#4F46E5' : '#374151', borderRadius: 999, padding: '3px 9px', fontSize: 11, fontWeight: 500 }}>
          <svg width="10" height="10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
          {enabled ? 'Active' : 'Disabled'}
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{skill.name}</h3>
          {skill.owner === 'nowgg' && <span style={{ fontSize: 10, color: '#6B7280', background: '#F3F4F6', borderRadius: 4, padding: '1px 6px' }}>now.gg</span>}
        </div>
        <p style={{ fontSize: 13, color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{skill.description}</p>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
        {/* Toggle */}
        <div onClick={handleToggle} style={{ width: 40, height: 22, borderRadius: 999, background: enabled ? '#4F46E5' : '#D1D5DB', position: 'relative', cursor: 'pointer', transition: 'background 200ms', flexShrink: 0 }}>
          <div style={{ position: 'absolute', width: 16, height: 16, background: '#fff', borderRadius: '50%', top: 3, left: enabled ? 21 : 3, transition: 'left 200ms' }} />
        </div>
        {/* Edit */}
        <button onClick={e => { e.stopPropagation(); onModify(skill); }} style={{ width: 32, height: 32, border: '1px solid #E5E7EB', background: '#fff', borderRadius: 7, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
          onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
          <svg width="14" height="14" fill="none" stroke="#374151" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
        </button>
        {/* Delete (user-owned only) */}
        {skill.owner !== 'nowgg' && (
          <button onClick={e => e.stopPropagation()} style={{ width: 32, height: 32, border: '1px solid #E5E7EB', background: '#fff', borderRadius: 7, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#FFF1F2'; e.currentTarget.style.borderColor = '#FECDD3'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#E5E7EB'; }}>
            <svg width="14" height="14" fill="none" stroke="#EF4444" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        )}
      </div>
    </div>
  );
}

function CreateSkillModal({ onClose }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [instruction, setInstruction] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!name) e.name = 'Skill name is required.';
    else if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(name)) e.name = 'Use lowercase letters, numbers, and hyphens only.';
    if (!desc) e.desc = 'Description is required.';
    if (!instruction.trim()) e.instruction = 'Instruction is required.';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onClose();
  };

  const fieldStyle = (err) => ({ width: '100%', border: `1px solid ${err ? '#EF4444' : '#E5E7EB'}`, borderRadius: 8, padding: '8px 12px', fontSize: 14, color: '#374151', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' });

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 600, maxHeight: '90vh', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.10)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid #E5E7EB', flexShrink: 0, position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#111827' }}>Create Skill</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 4, borderRadius: 6 }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div style={{ overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Skill Name <span style={{ color: '#EF4444' }}>*</span></label>
            <input style={fieldStyle(errors.name)} value={name} onChange={e => { setName(e.target.value); setErrors(v => ({ ...v, name: '' })); }} placeholder="e.g. coin-collector" />
            {errors.name && <p style={{ fontSize: 11, color: '#EF4444', marginTop: 3 }}>{errors.name}</p>}
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Description <span style={{ color: '#EF4444' }}>*</span></label>
            <input style={fieldStyle(errors.desc)} value={desc} onChange={e => { setDesc(e.target.value); setErrors(v => ({ ...v, desc: '' })); }} placeholder="What the skill does and when to use it." />
            {errors.desc && <p style={{ fontSize: 11, color: '#EF4444', marginTop: 3 }}>{errors.desc}</p>}
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Instruction <span style={{ color: '#EF4444' }}>*</span></label>
            <textarea style={{ ...fieldStyle(errors.instruction), height: 140, resize: 'vertical' }} value={instruction} onChange={e => { setInstruction(e.target.value); setErrors(v => ({ ...v, instruction: '' })); }} placeholder="Write the instruction/prompt in markdown format..." />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
              {errors.instruction ? <p style={{ fontSize: 11, color: '#EF4444' }}>{errors.instruction}</p> : <span />}
              <span style={{ fontSize: 11, color: '#9CA3AF' }}>{instruction.length} characters</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4 }}>
            <button onClick={onClose} style={{ border: '1px solid #D1D5DB', background: '#fff', borderRadius: 8, padding: '8px 18px', fontSize: 14, fontWeight: 500, color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
            <button onClick={handleSubmit} style={{ background: '#1990FF', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 14, fontWeight: 500, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>Create</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Skills() {
  const [skills, setSkills] = useState(SAMPLE_SKILLS);
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [viewSkill, setViewSkill] = useState(null);
  const searchRef = useRef(null);

  const filtered = search.trim()
    ? skills.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase()))
    : skills;

  return (
    <div style={{ paddingBottom: 60 }}>
      {createOpen && <CreateSkillModal onClose={() => setCreateOpen(false)} />}

      {/* View skill detail sheet */}
      {viewSkill && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setViewSkill(null)}>
          <div style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 500, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.10)', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid #E5E7EB' }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#111827' }}>Skill Details</h2>
              <button onClick={() => setViewSkill(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div style={{ padding: '16px 20px' }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 8 }}>{viewSkill.name}</h3>
              <p style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.6, marginBottom: 14 }}>{viewSkill.description}</p>
              <div style={{ background: '#F9FAFB', borderRadius: 8, padding: 12 }}>
                {[['Owner', viewSkill.owner === 'nowgg' ? 'now.gg' : 'You'], ['Status', !viewSkill.userDisabled ? 'Enabled' : 'Disabled'], ['Last Updated', new Date(viewSkill.updatedAt).toLocaleDateString()]].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: '#6B7280' }}>{k}:</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 16, justifyContent: 'flex-end' }}>
                <button onClick={() => setViewSkill(null)} style={{ border: '1px solid #D1D5DB', background: '#fff', borderRadius: 8, padding: '8px 18px', fontSize: 14, fontWeight: 500, color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>Manage Skills</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 50); }} style={{ width: 40, height: 40, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}>
            <svg width="22" height="22" fill="none" stroke="#1990FF" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path strokeLinecap="round" d="m21.5 21.5-5-5"/></svg>
          </button>
          <button onClick={() => setCreateOpen(true)} style={{ background: '#1990FF', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 14, fontWeight: 500, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>+ New</button>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
            <svg width="18" height="18" fill="none" stroke="#1990FF" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path strokeLinecap="round" d="m21.5 21.5-5-5"/></svg>
          </span>
          <input ref={searchRef} value={search} onChange={e => setSearch(e.target.value)} onBlur={() => { if (!search.trim()) setSearchOpen(false); }} placeholder="Search Skill"
            style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: 999, padding: '10px 40px 10px 40px', fontSize: 14, color: '#374151', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }} />
          {search && (
            <button onMouseDown={e => e.preventDefault()} onClick={() => setSearch('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: '50%' }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          )}
        </div>
      )}

      {/* Skills list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 12, padding: '32px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 4 }}>No skills match your search</p>
          </div>
        ) : filtered.map(skill => (
          <SkillRow key={skill.skillId} skill={skill} onModify={() => {}} onView={setViewSkill} onToggle={() => {}} />
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { Skills });
