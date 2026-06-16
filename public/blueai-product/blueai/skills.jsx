// BlueAI — Skills Screen (adapted from Try3/Skills Tab.html)

const { useState, useRef, useEffect, useCallback } = React;

/* ── DATA ──────────────────────────────────────────────────────── */
const SKILLS_CATS = ['Game Helpers', 'Social Media', 'Productivity', 'Explore', 'Other'];
const SKILLS_INITIAL = {
  'Game Helpers': [
    { id: 'gh1', name: 'quest-guide',             desc: 'Helps the user find the best guides and strategies for any game challenge. Opens Chrome to search for a web guide.' },
    { id: 'gh2', name: 'daily-rewards-collector', desc: 'Automatically opens specified games one by one in BlueStacks and collects daily login rewards, bonus chests, free items, and more.' },
    { id: 'gh3', name: 'auto-gameplay',           desc: 'Autonomously plays specific mobile games via the ILAgent engine — farming, grinding, dailies, completing levels, and more.' },
  ],
  'Social Media': [
    { id: 'sm1', name: 'Social Media Marketing Helper', desc: 'Creates and schedules posts, captions, and campaigns across platforms.' },
    { id: 'sm2', name: 'Instagram Gift Advisor',        desc: 'Suggests personalised gift ideas and sends them via Instagram DMs.' },
  ],
  'Productivity': [
    { id: 'pr1', name: 'Life Autopilot',  desc: 'Manages your daily tasks, reminders, and routines hands-free.' },
    { id: 'pr2', name: 'Task Scheduler',  desc: 'Plans and schedules recurring tasks based on your preferences.' },
    { id: 'pr3', name: 'Agent Memory',    desc: 'Remembers context across sessions so BlueAI always knows your preferences.' },
  ],
  'Explore': [],
  'Other': [
    { id: 'ot1', name: 'Foobar', desc: 'A placeholder skill that does not fit any of the standard categories \u2014 used to demonstrate the Other bucket.' },
  ],
};
const SKILLS_ENABLED = { gh1:true, gh2:true, gh3:true, sm1:true, sm2:false, pr1:true, pr2:true, pr3:true };
const SKILLS_PROMPTS = {
  gh1: 'Find the best guide for the game level I am stuck on.',
  gh2: 'Collect my daily login rewards across my games.',
  gh3: 'Auto-play and grind my dailies in my games.',
  sm1: 'Create and schedule my social media posts for this week.',
  sm2: 'Suggest personalised gift ideas to send via Instagram DMs.',
  pr1: 'Set up my daily routine and manage my tasks hands-free.',
  pr2: 'Schedule my recurring tasks and set up reminders for me.',
  pr3: 'Remember my preferences and context across all sessions.',
};
const SKILLS_CAT_META = {
  'Game Helpers': { color: '#5B6CF6', bg: '#EEF0FE', border: '#D4D9FB', desc: 'Auto-rewards, grinding, gameplay assists' },
  'Social Media': { color: '#E05C8A', bg: '#FCE9F1', border: '#F5C0D5', desc: 'Insta, gifts, profile analysis' },
  'Productivity': { color: '#1BA07A', bg: '#DDF4EE', border: '#A8E4D4', desc: 'Schedules, memory, workflows' },
  'Explore':      { color: '#3B8FD4', bg: '#E4F2FC', border: '#B6D9F4', desc: 'Browse the web & search across apps' },
  'Other':        { color: '#7A8499', bg: '#F3F5F8', border: '#DDE2EA', desc: "A mix of useful helpers" },
};

/* ── CATEGORY ICONS ────────────────────────────────────────────── */
function SkIcoGamepad({ size = 14, color = 'currentColor' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="5"/><line x1="9" y1="12" x2="13" y2="12"/><line x1="11" y1="10" x2="11" y2="14"/><circle cx="17" cy="11" r="1" fill={color} stroke="none"/><circle cx="17" cy="13.5" r="1" fill={color} stroke="none"/></svg>;
}
function SkIcoShare({ size = 14, color = 'currentColor' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>;
}
function SkIcoBolt({ size = 14, color = 'currentColor' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
}
function SkIcoCompass({ size = 14, color = 'currentColor' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={color} opacity="0.6" stroke="none"/></svg>;
}
function SkIcoOther({ size = 14, color = 'currentColor' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="5" cy="12" r="1.6" fill={color} stroke="none"/><circle cx="12" cy="12" r="1.6" fill={color} stroke="none"/><circle cx="19" cy="12" r="1.6" fill={color} stroke="none"/></svg>;
}

const SKILLS_CAT_ICON = { 'Game Helpers': SkIcoGamepad, 'Social Media': SkIcoShare, 'Productivity': SkIcoBolt, 'Explore': SkIcoCompass, 'Other': SkIcoOther };

/* ── SKILL CARD ────────────────────────────────────────────────── */
function SkillCard({ skill, category, enabled, onToggle, onTry, onView, isUserOwned, onEdit, onDelete }) {
  const meta = category ? SKILLS_CAT_META[category] : null;
  const Icon = category ? SKILLS_CAT_ICON[category] : null;
  return (
    <div onClick={() => onView?.(skill, category)}
      style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 16px 12px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', cursor: 'pointer', transition: 'border-color 0.15s, box-shadow 0.15s', animation: 'skFadeUp 0.18s ease both' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#c7d2e1'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.08)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; }}>

      {/* Name + Toggle */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <p style={{ fontSize: 17.5, fontWeight: 700, color: '#111827', lineHeight: 1.3, flex: 1 }}>{skill.name}</p>
        <Toggle enabled={enabled} onToggle={() => onToggle(skill.id)} />
      </div>

      {/* Description */}
      <p style={{ fontSize: 13.5, color: '#6b7280', marginTop: 5, lineHeight: 1.5, paddingRight: 4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{skill.desc}</p>

      {/* Actions row — Try left, Edit + Delete right (user-owned) or Details right (official) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 13 }}>
        <button onClick={e => { e.stopPropagation(); onTry(skill, category); }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: 28, padding: '0 13px 0 10px', border: 'none', borderRadius: 20, background: '#1990FF', color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer', flexShrink: 0, fontFamily: 'inherit', transition: 'opacity 0.13s' }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
          <svg width="9" height="9" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3" fill="white"/></svg>Try
        </button>
        <div style={{ flex: 1 }} />
        {isUserOwned ? (
          <>
            <button onClick={e => { e.stopPropagation(); onEdit?.(); }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: 28, padding: '0 10px', border: '1px solid #e2e8f0', borderRadius: 7, background: 'white', color: '#374151', fontSize: 12.5, fontWeight: 500, cursor: 'pointer', flexShrink: 0, fontFamily: 'inherit', transition: 'background 0.13s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1e293b'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = '#1e293b'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#374151'; e.currentTarget.style.borderColor = '#e2e8f0'; }}>
              <IcoPencilEdit size={12} />Edit
            </button>
            <button onClick={e => { e.stopPropagation(); onDelete?.(); }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: 28, padding: '0 10px', border: '1px solid #e2e8f0', borderRadius: 7, background: 'white', color: '#374151', fontSize: 12.5, fontWeight: 500, cursor: 'pointer', flexShrink: 0, fontFamily: 'inherit', transition: 'background 0.13s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#dc2626'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = '#dc2626'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#374151'; e.currentTarget.style.borderColor = '#e2e8f0'; }}>
              <IcoTrashBin size={12} />Delete
            </button>
          </>
        ) : (
          <button onClick={e => { e.stopPropagation(); onView?.(skill, category); }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 3, height: 28, padding: '0 10px', border: '1px solid #e2e8f0', borderRadius: 7, background: 'white', color: '#64748b', fontSize: 12.5, fontWeight: 500, cursor: 'pointer', flexShrink: 0, fontFamily: 'inherit', transition: 'background 0.13s, border-color 0.13s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#c7d2e1'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#e2e8f0'; }}>
            Details
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        )}
      </div>
    </div>
  );
}

/* ── CATEGORY CARD (grid tile) ─────────────────────────────────── */
function CategoryCard({ category, skills, onSelect }) {
  const meta = SKILLS_CAT_META[category];
  const Icon = SKILLS_CAT_ICON[category];
  return (
    <div onClick={() => onSelect(category)}
      style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: '14px 12px 12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 5, minHeight: 118, transition: 'transform 0.14s, box-shadow 0.14s, border-color 0.14s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.10)'; e.currentTarget.style.borderColor = '#c7d2e1'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = '#e2e8f0'; }}>
      <div style={{ marginBottom: 2 }}><Icon size={32} color={meta.color} /></div>
      <p style={{ fontSize: 14, fontWeight: 800, color: meta.color, lineHeight: 1.2 }}>{category}</p>
      <p style={{ fontSize: 11, color: '#6b7280', lineHeight: 1.4, flex: 1 }}>{meta.desc}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11.5, fontWeight: 700, color: meta.color }}>{skills.length} {skills.length === 1 ? 'skill' : 'skills'}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={meta.color} strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
    </div>
  );
}

/* ── CATEGORY DETAIL VIEW ──────────────────────────────────────── */
function CategoryDetailView({ category, skills, enabledMap, onToggle, onTry, onView, onBack }) {
  const meta = SKILLS_CAT_META[category];
  const Icon = SKILLS_CAT_ICON[category];
  return (
    <div style={{ animation: 'skSlideIn 0.2s ease' }}>
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: '#f8fafc',
        display: 'flex', alignItems: 'center', gap: 10,
        marginBottom: 12,
        padding: '10px 0 12px',
        borderBottom: '1px solid #eef2f6',
        marginLeft: -16, marginRight: -16, paddingLeft: 16, paddingRight: 16,
      }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b', fontSize: 13.5, fontWeight: 500, padding: '4px 0', fontFamily: 'inherit' }}
          onMouseEnter={e => e.currentTarget.style.color = '#1990FF'}
          onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>
          <IcoArrowLeft size={15} />Back
        </button>
        <div style={{ width: 1, height: 18, background: '#e2e8f0' }} />
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: meta.bg, border: `1.5px solid ${meta.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={16} color={meta.color} />
        </div>
        <span style={{ fontSize: 17, fontWeight: 800, color: '#111827', flex: 1 }}>{category}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: meta.color, background: meta.bg, padding: '3px 9px', borderRadius: 999, border: `1px solid ${meta.border}` }}>
          {skills.length} {skills.length === 1 ? 'skill' : 'skills'}
        </span>
      </div>
      {skills.length === 0
        ? <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', gap: 10, textAlign: 'center' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: meta.bg, border: `1.5px solid ${meta.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}><Icon size={24} color={meta.color} /></div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#374151' }}>No skills yet</p>
            <p style={{ fontSize: 13, color: '#9ca3af', maxWidth: 220 }}>Skills in <strong>{category}</strong> will appear here.</p>
          </div>
        : <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {skills.map(s => <SkillCard key={s.id} skill={s} category={category} enabled={enabledMap[s.id] ?? false} onToggle={onToggle} onTry={onTry} onView={onView} />)}
          </div>
      }
    </div>
  );
}

/* ── SKILL DETAILS MODAL ───────────────────────────────────────── */
function SkillDetailsModal({ skill, category, enabled, isOpen, onClose }) {
  if (!skill) return null;
  const meta = SKILLS_CAT_META[category] || {};
  const Icon = SKILLS_CAT_ICON[category];
  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose} title="Skill details">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#111827', marginBottom: 6 }}>{skill.name}</h2>
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6, marginBottom: 16 }}>{skill.desc}</p>
        </div>
        <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '14px 16px', marginBottom: 8 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.06em', marginBottom: 12, textTransform: 'uppercase' }}>Details</p>
          {[['Owner', 'now.gg'], ['Status', enabled ? 'Enabled' : 'Disabled'], ['Last updated', '19/05/2026']].map(([l, v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f3f4f6' }}>
              <span style={{ fontSize: 13, color: '#6b7280' }}>{l}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: l === 'Status' ? (enabled ? '#16a34a' : '#9ca3af') : '#111827' }}>{v}</span>
            </div>
          ))}
        </div>
        {category && Icon && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 999, fontSize: 11.5, fontWeight: 600, background: meta.bg, border: `1px solid ${meta.border}`, color: meta.color, alignSelf: 'flex-start' }}>
            <Icon size={12} color={meta.color} />{category}
          </span>
        )}
      </div>
    </ModalOverlay>
  );
}

/* ── CREATE SKILL MODAL ────────────────────────────────────────── */
function CreateSkillModal({ isOpen, onClose, onCreateSkill, onCreateWithAI, initialMode }) {
  const [mode, setMode] = useState(initialMode || 'instruction');
  useEffect(() => { if (isOpen) setMode(initialMode || 'instruction'); }, [isOpen, initialMode]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [instruction, setInstruction] = useState('');
  const handleClose = () => { setName(''); setDesc(''); setInstruction(''); setMode('instruction'); onClose(); };
  const canCreate = name.trim() && desc.trim() && instruction.trim();
  return (
    <ModalOverlay isOpen={isOpen} onClose={handleClose} title="Create skill">
      <div style={{ minHeight: 480 }}>
        <form style={{ display: 'flex', flexDirection: 'column', gap: 14 }} onSubmit={e => { e.preventDefault(); if (!canCreate) return; onCreateSkill({ name, desc }); handleClose(); }}>
          {/* Mode tabs — three underline tabs */}
          <div style={{ display: 'flex', borderBottom: '1.5px solid #e2e8f0', marginBottom: 2 }}>
            {[
              { id: 'instruction', label: 'Write Instructions' },
              { id: 'zip',         label: 'Upload ZIP' },
              { id: 'ai',          label: 'Create with BlueAI' },
            ].map(t => (
              <button key={t.id} type="button" onClick={() => setMode(t.id)}
                style={{ flex: 1, padding: '8px 4px 10px', fontSize: 12, fontWeight: mode === t.id ? 700 : 500, color: mode === t.id ? '#4f46e5' : '#64748b', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', borderBottom: mode === t.id ? '2.5px solid #4f46e5' : '2.5px solid transparent', marginBottom: -1.5, transition: 'color 0.15s', whiteSpace: 'nowrap' }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Instruction mode fields */}
          {mode === 'instruction' && <>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>Skill name <span style={{ color: '#ef4444' }}>*</span></label>
                <span style={{ fontSize: 11, color: name.length > 64 ? '#ef4444' : '#9ca3af' }}>{name.length}/64</span>
              </div>
              <input value={name} onChange={e => setName(e.target.value)} maxLength={64} placeholder="e.g. coin-collector"
                style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 8, padding: '9px 12px', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>Description <span style={{ color: '#ef4444' }}>*</span></label>
                <span style={{ fontSize: 11, color: desc.length > 1024 ? '#ef4444' : '#9ca3af' }}>{desc.length}/1024</span>
              </div>
              <textarea value={desc} onChange={e => setDesc(e.target.value)} maxLength={1024} rows={2} placeholder="What the skill does and when to use it."
                style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 8, padding: '9px 12px', fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Instructions <span style={{ color: '#ef4444' }}>*</span></label>
              <textarea value={instruction} onChange={e => setInstruction(e.target.value)} rows={3} placeholder="Step-by-step instructions for the skill…"
                style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 8, padding: '9px 12px', fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            </div>
          </>}

          {/* ZIP mode */}
          {mode === 'zip' && (
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>ZIP file <span style={{ color: '#ef4444' }}>*</span></label>
              <input type="file" accept=".zip" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-indigo-50 file:px-3 file:py-1 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100" />
              <div style={{ marginTop: 12, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '12px 14px' }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#1e40af', marginBottom: 6 }}>File requirements</p>
                <ul style={{ fontSize: 12, color: '#3b82f6', paddingLeft: 18, lineHeight: 1.6 }}>
                  <li>ZIP file must be less than 20 MB.</li>
                  <li>Must include exactly one SKILL.md file at root level.</li>
                  <li>SKILL.md contains name + description in YAML and instructions in markdown.</li>
                </ul>
              </div>
            </div>
          )}

          {/* AI mode */}
          {mode === 'ai' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '20px 0', textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(14,164,197,0.12),rgba(123,76,255,0.12))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7B4CFF" strokeWidth="2" strokeLinecap="round"><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4"/></svg>
              </div>
              <p style={{ fontSize: 13.5, color: '#6b7280', lineHeight: 1.6, maxWidth: 260, margin: '0 auto' }}>Describe what you want to do in plain language — BlueAI will build the skill for you in chat.</p>
              <button type="button" onClick={() => { handleClose(); onCreateWithAI?.(); }}
                style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#0EA4C5,#7B4CFF)', color: 'white', border: 'none', borderRadius: 12, padding: '12px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 16px rgba(123,76,255,0.3)', fontFamily: 'inherit' }}>
                Start in Chat
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
            </div>
          )}

          {mode !== 'ai' && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 4 }}>
              <button type="button" onClick={handleClose} style={{ borderRadius: 8, border: '1px solid #e5e7eb', padding: '9px 20px', color: '#374151', fontSize: 13.5, cursor: 'pointer', fontFamily: 'inherit', background: 'white' }}>Cancel</button>
              <button type="submit" disabled={mode === 'instruction' && !canCreate}
                style={{ borderRadius: 8, border: 'none', padding: '9px 20px', color: 'white', fontSize: 13.5, fontWeight: 600, cursor: (mode === 'instruction' && !canCreate) ? 'not-allowed' : 'pointer', fontFamily: 'inherit', background: (mode === 'instruction' && !canCreate) ? '#bfdbfe' : '#1990FF' }}>
                Create
              </button>
            </div>
          )}
        </form>
      </div>
    </ModalOverlay>
  );
}

/* ── BUILD SKILL CTA CARD ─────────────────────────────────────── */
function BuildSkillCTA({ onSelectMode }) {
  return (
    <div style={{ position: 'sticky', bottom: 0, marginLeft: -14, marginRight: -14, padding: '10px 14px 10px', background: 'white', borderTop: '1px solid #e2e8f0', boxShadow: '0 -4px 12px rgba(0,0,0,0.06)', animation: 'skFadeUp 0.2s ease' }}>
      <button onClick={() => onSelectMode('instruction')}
        style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '11px 16px', background: 'linear-gradient(135deg,#0EA4C5,#7B4CFF)', border: 'none', borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', transition: 'opacity 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 13.5, fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: 1 }}>Build a custom skill</p>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.78)', lineHeight: 1.3 }}>Automate anything with BlueAI</p>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </div>
  );
}

/* ── MY SKILLS CATEGORY CARD ───────────────────────────────────── */
function MySkillsCategoryCard({ count, onSelect }) {
  return (
    <div onClick={onSelect}
      style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: '14px 12px 12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 5, minHeight: 118, transition: 'transform 0.14s, box-shadow 0.14s, border-color 0.14s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.10)'; e.currentTarget.style.borderColor = '#c7d2e1'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = '#e2e8f0'; }}>
      <div style={{ marginBottom: 2 }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
        </svg>
      </div>
      <p style={{ fontSize: 14, fontWeight: 800, color: '#7C3AED', lineHeight: 1.2 }}>My Skills</p>
      <p style={{ fontSize: 11, color: '#6b7280', lineHeight: 1.4, flex: 1 }}>Skills you've built and customised</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11.5, fontWeight: 700, color: '#7C3AED' }}>{count} {count === 1 ? 'skill' : 'skills'}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
    </div>
  );
}

/* ── MY SKILLS DETAIL VIEW ─────────────────────────────────────── */
function MySkillsDetailView({ userSkills, enabledMap, onToggle, onTry, onView, onNew, onDeleteUserSkill, onBack }) {
  return (
    <div style={{ animation: 'skSlideIn 0.2s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #eef2f6' }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b', fontSize: 13.5, fontWeight: 500, padding: '4px 0', fontFamily: 'inherit' }}
          onMouseEnter={e => e.currentTarget.style.color = '#1990FF'}
          onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>
          <IcoArrowLeft size={15} />Back
        </button>
        <div style={{ width: 1, height: 18, background: '#e2e8f0' }} />
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#EDE9FE', border: '1.5px solid #DDD6FE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
        </div>
        <span style={{ fontSize: 17, fontWeight: 800, color: '#111827', flex: 1 }}>My Skills</span>
        <button onClick={() => onNew('instruction')}
          style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#1990FF', border: 'none', borderRadius: 20, cursor: 'pointer', color: 'white', fontSize: 12, fontWeight: 600, padding: '5px 11px', fontFamily: 'inherit', transition: 'opacity 0.13s' }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
          <IcoPlusSmall size={9} color="white" /> New
        </button>
      </div>
      {userSkills.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', gap: 10, textAlign: 'center' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#EDE9FE', border: '1.5px solid #DDD6FE', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          </div>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#374151' }}>No custom skills yet</p>
          <p style={{ fontSize: 13, color: '#9ca3af', maxWidth: 220 }}>Tap <strong>New</strong> above to build your first skill.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {userSkills.map(s => (
            <SkillCard key={s.id} skill={s} category={null} enabled={enabledMap[s.id] ?? true}
              onToggle={onToggle} onTry={onTry} onView={onView} isUserOwned={true}
              onDelete={() => onDeleteUserSkill?.(s.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── EXPANDED ALL-CATEGORIES VIEW ──────────────────────────────── */
/* Every category shown as a section header with its skills listed inline —
   no drill-down required. Category1 → task1, task2, then Category2 → … */
function ExpandedSkillsView({ skills, enabledMap, onToggle, onTry, onView, userSkills, onDeleteUserSkill, onNew }) {
  // Build ordered list of sections: My Skills (if any), then categories with ≥1 skill
  const sections = [];
  if (userSkills.length > 0) {
    sections.push({ key: 'mine', label: 'My Skills', meta: { color: '#7C3AED', bg: '#EDE9FE', border: '#DDD6FE' }, items: userSkills, owned: true });
  }
  SKILLS_CATS.forEach(cat => {
    const items = skills[cat] || [];
    if (items.length === 0) return; // skip empty categories in the expanded view
    sections.push({ key: cat, label: cat, meta: SKILLS_CAT_META[cat], items, owned: false });
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, paddingBottom: 8, animation: 'skFadeUp 0.18s ease' }}>
      {sections.map(sec => {
        const Icon = sec.key === 'mine'
          ? (props) => <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke={props.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          : SKILLS_CAT_ICON[sec.key];
        return (
          <div key={sec.key}>
            {/* Section header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: sec.meta.bg, border: `1.5px solid ${sec.meta.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={15} color={sec.meta.color} />
              </div>
              <span style={{ fontSize: 15.5, fontWeight: 800, color: '#111827', letterSpacing: '-0.2px' }}>{sec.label}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: sec.meta.color, background: sec.meta.bg, padding: '2px 8px', borderRadius: 999, border: `1px solid ${sec.meta.border}` }}>
                {sec.items.length}
              </span>
              <div style={{ flex: 1, height: 1, background: '#eef2f6' }} />
            </div>
            {/* Skills */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {sec.items.map(s => (
                <SkillCard key={s.id} skill={s} category={sec.owned ? null : sec.key}
                  enabled={enabledMap[s.id] ?? (sec.owned ? true : false)}
                  onToggle={onToggle} onTry={onTry} onView={onView}
                  isUserOwned={sec.owned}
                  onDelete={sec.owned ? () => onDeleteUserSkill?.(s.id) : undefined} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── SKILLS VIEW (main content) ────────────────────────────────── */
function SkillsView({ skills, enabledMap, onToggle, onTry, onView, onNew, userSkills, onDeleteUserSkill, layout = 'grid' }) {
  const [searchQ, setSearchQ] = useState('');
  const [selectedCat, setSelectedCat] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const scrollRef = useRef(null);

  // Expose drill-down state so parent can hide/show the bottom CTA
  useEffect(() => {
    window.__skillsInCategory = !!selectedCat;
    window.dispatchEvent(new CustomEvent('skillsCatChange', { detail: !!selectedCat }));
    return () => { window.__skillsInCategory = false; };
  }, [selectedCat]);

  useEffect(() => {
    let el = scrollRef.current?.closest('[data-skills-scroll]');
    if (!el) el = scrollRef.current?.parentElement;
    if (!el) return;
    const onScroll = () => setScrolled(el.scrollTop > 4);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const searchResults = searchQ.trim()
    ? SKILLS_CATS.flatMap(cat => (skills[cat] || []).filter(s => s.name.toLowerCase().includes(searchQ.toLowerCase()) || s.desc.toLowerCase().includes(searchQ.toLowerCase())).map(s => ({ skill: s, category: cat })))
    : [];

  return (
    <div style={{ animation: 'skFadeUp 0.18s ease' }} ref={scrollRef}>
      {/* Sticky header — hidden inside category drill-down */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: '#f8fafc', paddingTop: 14, paddingBottom: 12, marginLeft: -16, marginRight: -16, paddingLeft: 16, paddingRight: 16, transition: 'box-shadow 0.2s', boxShadow: scrolled ? '0 4px 16px rgba(0,0,0,0.10)' : 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', letterSpacing: '-0.4px' }}>Skills</h1>
          <a href="https://docs.google.com/document/d/1TEK2Rkigl03S6I8E9jCs5rHEuV56E0xz4i8rPIlk5UI" target="_blank" rel="noopener noreferrer"
            style={{ width: 20, height: 20, borderRadius: '50%', border: '1.5px solid #cbd5e1', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#94a3b8', textDecoration: 'none', flexShrink: 0, marginTop: 2 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#1990FF'; e.currentTarget.style.color = '#1990FF'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#94a3b8'; }}>?</a>
          <div style={{ flex: 1 }} />
          {!selectedCat &&
          <button onClick={() => onNew('instruction')}
            style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#1990FF', border: 'none', borderRadius: 20, cursor: 'pointer', color: 'white', fontSize: 12, fontWeight: 600, padding: '6px 13px 6px 10px', fontFamily: 'inherit', transition: 'opacity 0.13s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New skill
          </button>}
        </div>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </span>
          <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search Skill"
            style={{ width: '100%', height: 42, borderRadius: 999, border: '1px solid #e2e8f0', background: 'white', paddingLeft: 40, paddingRight: searchQ ? 36 : 12, fontSize: 13.5, color: '#374151', outline: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', transition: 'border-color 0.15s', boxSizing: 'border-box', fontFamily: 'inherit' }}
            onFocus={e => e.target.style.borderColor = '#93c5fd'}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
          {searchQ && <button onClick={() => setSearchQ('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0 }}><IcoXClose size={13} /></button>}
        </div>
      </div>

      {/* Search results */}
      {searchQ && (
        searchResults.length === 0
          ? <div style={{ textAlign: 'center', padding: '50px 0', color: '#9ca3af', fontSize: 14 }}>No skills match your search.</div>
          : <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4 }}>
              {searchResults.map(({ skill, category }) => <SkillCard key={skill.id} skill={skill} category={category} enabled={enabledMap[skill.id] ?? false} onToggle={onToggle} onTry={onTry} onView={onView} />)}
            </div>
      )}

      {/* Grid + drill-down */}
      {!searchQ && (
        <div style={{ paddingTop: 12 }}>
          {layout === 'expanded' ? (
            <ExpandedSkillsView
              skills={skills}
              enabledMap={enabledMap}
              onToggle={onToggle}
              onTry={onTry}
              onView={onView}
              userSkills={userSkills}
              onDeleteUserSkill={onDeleteUserSkill}
              onNew={onNew}
            />
          ) : selectedCat === 'mine' ? (
            <MySkillsDetailView
              userSkills={userSkills}
              enabledMap={enabledMap}
              onToggle={onToggle}
              onTry={onTry}
              onView={onView}
              onNew={onNew}
              onDeleteUserSkill={onDeleteUserSkill}
              onBack={() => setSelectedCat(null)}
            />
          ) : selectedCat ? (
            <CategoryDetailView
              category={selectedCat}
              skills={skills[selectedCat] || []}
              enabledMap={enabledMap}
              onToggle={onToggle}
              onTry={onTry}
              onView={onView}
              onBack={() => setSelectedCat(null)}
            />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
              <MySkillsCategoryCard count={userSkills.length} onSelect={() => setSelectedCat('mine')} />
              {SKILLS_CATS
                .filter(cat => cat !== 'Other' || (skills[cat] || []).length > 0)
                .map(cat => <CategoryCard key={cat} category={cat} skills={skills[cat] || []} onSelect={setSelectedCat} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── SKILLS SCREEN (root) ──────────────────────────────────────── */
function SkillsScreen({ onTrySkill, isLoading, layout = 'grid' }) {
  const [enabledMap, setEnabledMap] = useState(SKILLS_ENABLED);
  const [userSkills, setUserSkills] = useState([]);
  const [viewSkill, setViewSkill] = useState(null);
  const [viewCat, setViewCat] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const handleToggle = useCallback(id => setEnabledMap(prev => ({ ...prev, [id]: !prev[id] })), []);
  const handleTry = useCallback((skill, category) => {
    const prompt = SKILLS_PROMPTS[skill.id] || skill.name;
    onTrySkill?.({ id: skill.id, name: skill.name, prompt, category });
  }, [onTrySkill]);
  const handleView = useCallback((skill, cat) => { setViewSkill(skill); setViewCat(cat); }, []);
  const handleCreateSkill = useCallback(s => setUserSkills(prev => [{ ...s, id: 'usr-' + Date.now() }, ...prev]), []);
  const [createMode, setCreateMode] = useState('instruction');

  const handleCreateWithAI = useCallback(() => {
    onTrySkill?.({ id: 'create-ai', name: 'Create a custom skill', prompt: "I want to build a custom skill. Here's what I want it to do:\n", category: 'Explore' });
  }, [onTrySkill]);

  const handleOpenCreate = useCallback((mode) => {
    if (mode === 'ai') { handleCreateWithAI(); return; }
    setCreateMode(mode || 'instruction');
    setShowCreate(true);
  }, [handleCreateWithAI]);

  // Expose opener so the sticky bottom bar in App can trigger it
  useEffect(() => {
    window.__skillsOpenCreate = handleOpenCreate;
    return () => { window.__skillsOpenCreate = null; };
  }, [handleOpenCreate]);

  return (
    <>
      <style>{`
        @keyframes skFadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes skSlideIn{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}
      `}</style>
      {isLoading ? (
        <div style={{ paddingTop: 14 }}>
          <Shimmer h={28} w={90} r={7} extra={{ marginBottom: 16 }} />
          <Shimmer h={42} r={999} extra={{ marginBottom: 16 }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: '14px 12px', minHeight: 118, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Shimmer h={28} w={28} r={6} />
                <Shimmer h={14} w="70%" r={5} />
                <Shimmer h={11} w="90%" r={4} />
                <Shimmer h={11} w="65%" r={4} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <SkillDetailsModal skill={viewSkill} category={viewCat} enabled={viewSkill ? (enabledMap[viewSkill.id] ?? false) : false} isOpen={!!viewSkill} onClose={() => { setViewSkill(null); setViewCat(null); }} />
          <CreateSkillModal isOpen={showCreate} onClose={() => setShowCreate(false)} onCreateSkill={handleCreateSkill} onCreateWithAI={handleCreateWithAI} initialMode={createMode} />
          <SkillsView skills={SKILLS_INITIAL} enabledMap={enabledMap} onToggle={handleToggle} onTry={handleTry} onView={handleView} onNew={handleOpenCreate} userSkills={userSkills} onDeleteUserSkill={id => setUserSkills(p => p.filter(s => s.id !== id))} layout={layout} />
        </>
      )}
    </>
  );
}
