'use client'

// BlueAI — Skills screen, ported onto the product DS kit + --bai-* utilities.
// Faithful re-skin of public/blueai-product/blueai/skills.jsx. Behavior preserved:
// grid of category tiles (+ My Skills), category drill-down, search, SkillCard with
// Toggle/Try/Details, SkillDetailsModal, CreateSkillModal (3 tabs: Write instructions /
// Upload a ZIP file / Create with BlueAI), expanded all-categories layout, loading shimmer.
//
// Tier-3 / decorative (kept as-is, flagged in notes): the per-category brand palette
// (color/bg/border data), the "My Skills" purple, the "Create with BlueAI" iris→cyan
// gradient, and the bottom CTA gradient. These are data-driven decorative brand colors
// with no DS token equivalent — same exception class as the chat user-bubble gradient.

import { useState, useRef, useEffect, useCallback, type CSSProperties, type ReactNode } from 'react'
import { Card, Toggle, Button, Field, TextField, TextAreaField, Modal } from '@/components/product/ui'

/* ── DATA ──────────────────────────────────────────────────────── */
type Skill = { id: string; name: string; desc: string }
type CatName = 'Game Helpers' | 'Social Media' | 'Productivity' | 'Explore' | 'Other'

const SKILLS_CATS: CatName[] = ['Game Helpers', 'Social Media', 'Productivity', 'Explore', 'Other']

const SKILLS_INITIAL: Record<CatName, Skill[]> = {
  'Game Helpers': [
    { id: 'gh1', name: 'quest-guide', desc: 'Helps the user find the best guides and strategies for any game challenge. Opens Chrome to search for a web guide.' },
    { id: 'gh2', name: 'daily-rewards-collector', desc: 'Automatically opens specified games one by one in BlueStacks and collects daily login rewards, bonus chests, free items, and more.' },
    { id: 'gh3', name: 'auto-gameplay', desc: 'Autonomously plays specific mobile games via the ILAgent engine — farming, grinding, dailies, completing levels, and more.' },
  ],
  'Social Media': [
    { id: 'sm1', name: 'Social Media Marketing Helper', desc: 'Creates and schedules posts, captions, and campaigns across platforms.' },
    { id: 'sm2', name: 'Instagram Gift Advisor', desc: 'Suggests personalised gift ideas and sends them via Instagram DMs.' },
  ],
  'Productivity': [
    { id: 'pr1', name: 'Life Autopilot', desc: 'Manages your daily tasks, reminders, and routines hands-free.' },
    { id: 'pr2', name: 'Task Scheduler', desc: 'Plans and schedules recurring tasks based on your preferences.' },
    { id: 'pr3', name: 'Agent Memory', desc: 'Remembers context across sessions so BlueAI always knows your preferences.' },
  ],
  'Explore': [],
  'Other': [
    { id: 'ot1', name: 'Foobar', desc: 'A placeholder skill that does not fit any of the standard categories — used to demonstrate the Other bucket.' },
  ],
}
const SKILLS_ENABLED: Record<string, boolean> = { gh1: true, gh2: true, gh3: true, sm1: true, sm2: false, pr1: true, pr2: true, pr3: true }
const SKILLS_PROMPTS: Record<string, string> = {
  gh1: 'Find the best guide for the game level I am stuck on.',
  gh2: 'Collect my daily login rewards across my games.',
  gh3: 'Auto-play and grind my dailies in my games.',
  sm1: 'Create and schedule my social media posts for this week.',
  sm2: 'Suggest personalised gift ideas to send via Instagram DMs.',
  pr1: 'Set up my daily routine and manage my tasks hands-free.',
  pr2: 'Schedule my recurring tasks and set up reminders for me.',
  pr3: 'Remember my preferences and context across all sessions.',
}

// Decorative per-category brand palette (Tier-3, see file header). Drives icon tint +
// soft pill/icon-chip backgrounds. No DS token equivalent — kept as raw values on purpose.
type CatMeta = { color: string; bg: string; border: string; desc: string }
const SKILLS_CAT_META: Record<CatName, CatMeta> = {
  'Game Helpers': { color: '#5B6CF6', bg: '#EEF0FE', border: '#D4D9FB', desc: 'Auto-rewards, grinding, gameplay assists' },
  'Social Media': { color: '#E05C8A', bg: '#FCE9F1', border: '#F5C0D5', desc: 'Insta, gifts, profile analysis' },
  'Productivity': { color: '#1BA07A', bg: '#DDF4EE', border: '#A8E4D4', desc: 'Schedules, memory, workflows' },
  'Explore': { color: '#3B8FD4', bg: '#E4F2FC', border: '#B6D9F4', desc: 'Browse the web & search across apps' },
  'Other': { color: '#7A8499', bg: '#F3F5F8', border: '#DDE2EA', desc: 'A mix of useful helpers' },
}
const MINE_META = { color: '#7C3AED', bg: '#EDE9FE', border: '#DDD6FE' } // My Skills purple (Tier-3 decorative)

/* ── CATEGORY ICONS ────────────────────────────────────────────── */
type IcoProps = { size?: number; color?: string }
function SkIcoGamepad({ size = 14, color = 'currentColor' }: IcoProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="5" /><line x1="9" y1="12" x2="13" y2="12" /><line x1="11" y1="10" x2="11" y2="14" /><circle cx="17" cy="11" r="1" fill={color} stroke="none" /><circle cx="17" cy="13.5" r="1" fill={color} stroke="none" /></svg>
}
function SkIcoShare({ size = 14, color = 'currentColor' }: IcoProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
}
function SkIcoBolt({ size = 14, color = 'currentColor' }: IcoProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
}
function SkIcoCompass({ size = 14, color = 'currentColor' }: IcoProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={color} opacity="0.6" stroke="none" /></svg>
}
function SkIcoOther({ size = 14, color = 'currentColor' }: IcoProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="5" cy="12" r="1.6" fill={color} stroke="none" /><circle cx="12" cy="12" r="1.6" fill={color} stroke="none" /><circle cx="19" cy="12" r="1.6" fill={color} stroke="none" /></svg>
}
function SkIcoMine({ size = 14, color = 'currentColor' }: IcoProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>
}
const SKILLS_CAT_ICON: Record<CatName, (p: IcoProps) => ReactNode> = {
  'Game Helpers': SkIcoGamepad, 'Social Media': SkIcoShare, 'Productivity': SkIcoBolt, 'Explore': SkIcoCompass, 'Other': SkIcoOther,
}

/* ── small inline glyphs ───────────────────────────────────────── */
const ChevR = ({ size = 11, color = 'currentColor', sw = '2.5' }: { size?: number; color?: string; sw?: string }) =>
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
const ArrowLeft = ({ size = 15 }: { size?: number }) =>
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
const PlusSmall = ({ size = 9, color = 'currentColor' }: { size?: number; color?: string }) =>
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>

/* ── SHIMMER ───────────────────────────────────────────────────── */
function Shimmer({ h, w, r = 6, extra }: { h: number; w?: number | string; r?: number; extra?: CSSProperties }) {
  return <div className="animate-pulse bg-surface" style={{ height: h, width: w ?? '100%', borderRadius: r, ...extra }} />
}

/* ── SKILL CARD ────────────────────────────────────────────────── */
function SkillCard({ skill, category, enabled, onToggle, onTry, onView, isUserOwned, onEdit, onDelete }: {
  skill: Skill; category: CatName | null; enabled: boolean; onToggle: (id: string) => void;
  onTry: (s: Skill, c: CatName | null) => void; onView?: (s: Skill, c: CatName | null) => void;
  isUserOwned?: boolean; onEdit?: () => void; onDelete?: () => void
}) {
  return (
    <Card
      onClick={() => onView?.(skill, category)}
      className="cursor-pointer px-4 pb-3 pt-3.5 transition-[border-color,box-shadow] duration-fast hover:border-stroke hover:shadow-float"
      style={{ animation: 'skFadeUp 0.18s ease both' }}
    >
      {/* Name + Toggle */}
      <div className="flex items-start justify-between gap-3">
        <p className="flex-1 text-md font-bold leading-tight text-ink-heading">{skill.name}</p>
        <Toggle checked={enabled} onChange={() => onToggle(skill.id)} label={`Toggle ${skill.name}`} />
      </div>

      {/* Description */}
      <p className="mt-1 line-clamp-2 pr-1 text-h5 leading-normal text-ink-muted">{skill.desc}</p>

      {/* Actions row */}
      <div className="mt-3 flex items-center gap-1.5">
        <Button
          size="sm" variant="primary"
          onClick={(e) => { e.stopPropagation(); onTry(skill, category) }}
          leftIcon={<svg width="9" height="9" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3" fill="currentColor" /></svg>}
        >
          Try
        </Button>
        <div className="flex-1" />
        {isUserOwned ? (
          <>
            <Button size="sm" variant="secondary" pill={false} className="rounded-card !text-h5" onClick={(e) => { e.stopPropagation(); onEdit?.() }}
              leftIcon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>}>
              Edit
            </Button>
            <Button size="sm" variant="secondary" pill={false} className="rounded-card !text-h5 hover:!border-status-danger hover:!bg-status-danger hover:!text-white" onClick={(e) => { e.stopPropagation(); onDelete?.() }}
              leftIcon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>}>
              Delete
            </Button>
          </>
        ) : (
          <Button size="sm" variant="secondary" pill={false} className="rounded-card !text-h5 !text-ink-muted" onClick={(e) => { e.stopPropagation(); onView?.(skill, category) }}>
            Details
            <ChevR size={11} />
          </Button>
        )}
      </div>
    </Card>
  )
}

/* ── CATEGORY CARD (grid tile) ─────────────────────────────────── */
function TileShell({ onSelect, children }: { onSelect: () => void; children: ReactNode }) {
  return (
    <div
      onClick={onSelect} role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect() } }}
      className="flex min-h-[118px] cursor-pointer flex-col gap-1.5 rounded-chat border border-divider bg-canvas px-3 pb-3 pt-3.5 transition-[transform,box-shadow,border-color] duration-base hover:-translate-y-0.5 hover:border-stroke hover:shadow-float focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {children}
    </div>
  )
}
function CategoryCard({ category, skills, onSelect }: { category: CatName; skills: Skill[]; onSelect: (c: CatName) => void }) {
  const meta = SKILLS_CAT_META[category]
  const Icon = SKILLS_CAT_ICON[category]
  return (
    <TileShell onSelect={() => onSelect(category)}>
      <div className="mb-0.5"><Icon size={32} color={meta.color} /></div>
      <p className="text-base font-extrabold leading-tight" style={{ color: meta.color }}>{category}</p>
      <p className="flex-1 text-2xs leading-normal text-ink-muted">{meta.desc}</p>
      <div className="flex items-center justify-between">
        <span className="text-2xs font-bold" style={{ color: meta.color }}>{skills.length} {skills.length === 1 ? 'skill' : 'skills'}</span>
        <ChevR size={12} color={meta.color} />
      </div>
    </TileShell>
  )
}

/* ── MY SKILLS CATEGORY CARD ───────────────────────────────────── */
function MySkillsCategoryCard({ count, onSelect }: { count: number; onSelect: () => void }) {
  return (
    <TileShell onSelect={onSelect}>
      <div className="mb-0.5"><SkIcoMine size={32} color={MINE_META.color} /></div>
      <p className="text-base font-extrabold leading-tight" style={{ color: MINE_META.color }}>My Skills</p>
      <p className="flex-1 text-2xs leading-normal text-ink-muted">Skills you&apos;ve built and customised</p>
      <div className="flex items-center justify-between">
        <span className="text-2xs font-bold" style={{ color: MINE_META.color }}>{count} {count === 1 ? 'skill' : 'skills'}</span>
        <ChevR size={12} color={MINE_META.color} />
      </div>
    </TileShell>
  )
}

/* ── shared drill-down header ──────────────────────────────────── */
function DetailHeader({ sticky, iconBg, iconBorder, icon, title, right, onBack }: {
  sticky?: boolean; iconBg: string; iconBorder: string; icon: ReactNode; title: string; right?: ReactNode; onBack: () => void
}) {
  return (
    <div className={`mb-3 flex items-center gap-2.5 border-b border-divider ${sticky ? 'sticky top-0 z-10 -mx-4 bg-surface px-4 pb-3 pt-2.5' : 'pb-3'}`}>
      <button onClick={onBack} className="flex items-center gap-1.5 py-1 text-h5 font-medium text-ink-muted transition-colors duration-fast hover:text-accent">
        <ArrowLeft size={15} />Back
      </button>
      <div className="h-[18px] w-px bg-divider" />
      <div className="flex size-8 shrink-0 items-center justify-center rounded-circle" style={{ background: iconBg, border: `1.5px solid ${iconBorder}` }}>{icon}</div>
      <span className="flex-1 text-h3 font-extrabold text-ink-heading">{title}</span>
      {right}
    </div>
  )
}

/* ── CATEGORY DETAIL VIEW ──────────────────────────────────────── */
function CategoryDetailView({ category, skills, enabledMap, onToggle, onTry, onView, onBack }: {
  category: CatName; skills: Skill[]; enabledMap: Record<string, boolean>;
  onToggle: (id: string) => void; onTry: (s: Skill, c: CatName | null) => void; onView: (s: Skill, c: CatName | null) => void; onBack: () => void
}) {
  const meta = SKILLS_CAT_META[category]
  const Icon = SKILLS_CAT_ICON[category]
  return (
    <div style={{ animation: 'skSlideIn 0.2s ease' }}>
      <DetailHeader
        sticky iconBg={meta.bg} iconBorder={meta.border}
        icon={<Icon size={16} color={meta.color} />}
        title={category}
        right={<span className="rounded-pill px-2.5 py-1 text-sm font-bold" style={{ color: meta.color, background: meta.bg, border: `1px solid ${meta.border}` }}>{skills.length} {skills.length === 1 ? 'skill' : 'skills'}</span>}
        onBack={onBack}
      />
      {skills.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2.5 px-5 py-[60px] text-center">
          <div className="mb-1 flex size-[52px] items-center justify-center rounded-circle" style={{ background: meta.bg, border: `1.5px solid ${meta.border}` }}><Icon size={24} color={meta.color} /></div>
          <p className="text-h4 font-bold text-ink-body-2">No skills yet</p>
          <p className="max-w-[220px] text-h5 text-ink-muted">Skills in <strong>{category}</strong> will appear here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {skills.map((s) => <SkillCard key={s.id} skill={s} category={category} enabled={enabledMap[s.id] ?? false} onToggle={onToggle} onTry={onTry} onView={onView} />)}
        </div>
      )}
    </div>
  )
}

/* ── MY SKILLS DETAIL VIEW ─────────────────────────────────────── */
function MySkillsDetailView({ userSkills, enabledMap, onToggle, onTry, onView, onNew, onDeleteUserSkill, onBack }: {
  userSkills: Skill[]; enabledMap: Record<string, boolean>; onToggle: (id: string) => void;
  onTry: (s: Skill, c: CatName | null) => void; onView: (s: Skill, c: CatName | null) => void;
  onNew: (mode: string) => void; onDeleteUserSkill?: (id: string) => void; onBack: () => void
}) {
  return (
    <div style={{ animation: 'skSlideIn 0.2s ease' }}>
      <DetailHeader
        iconBg={MINE_META.bg} iconBorder={MINE_META.border}
        icon={<SkIcoMine size={16} color={MINE_META.color} />}
        title="My Skills"
        right={<Button size="sm" variant="primary" onClick={() => onNew('instruction')} leftIcon={<PlusSmall size={9} color="white" />}>New</Button>}
        onBack={onBack}
      />
      {userSkills.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2.5 px-5 py-[60px] text-center">
          <div className="mb-1 flex size-[52px] items-center justify-center rounded-circle" style={{ background: MINE_META.bg, border: `1.5px solid ${MINE_META.border}` }}><SkIcoMine size={24} color={MINE_META.color} /></div>
          <p className="text-h4 font-bold text-ink-body-2">No custom skills yet</p>
          <p className="max-w-[220px] text-h5 text-ink-muted">Tap <strong>New</strong> above to build your first skill.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {userSkills.map((s) => (
            <SkillCard key={s.id} skill={s} category={null} enabled={enabledMap[s.id] ?? true} onToggle={onToggle} onTry={onTry} onView={onView} isUserOwned onDelete={() => onDeleteUserSkill?.(s.id)} />
          ))}
        </div>
      )}
    </div>
  )
}

/* ── EXPANDED ALL-CATEGORIES VIEW ──────────────────────────────── */
function ExpandedSkillsView({ skills, enabledMap, onToggle, onTry, onView, userSkills, onDeleteUserSkill }: {
  skills: Record<CatName, Skill[]>; enabledMap: Record<string, boolean>; onToggle: (id: string) => void;
  onTry: (s: Skill, c: CatName | null) => void; onView: (s: Skill, c: CatName | null) => void;
  userSkills: Skill[]; onDeleteUserSkill?: (id: string) => void
}) {
  type Section = { key: string; label: string; meta: { color: string; bg: string; border: string }; items: Skill[]; owned: boolean; cat: CatName | null }
  const sections: Section[] = []
  if (userSkills.length > 0) sections.push({ key: 'mine', label: 'My Skills', meta: MINE_META, items: userSkills, owned: true, cat: null })
  SKILLS_CATS.forEach((cat) => {
    const items = skills[cat] || []
    if (items.length === 0) return
    sections.push({ key: cat, label: cat, meta: SKILLS_CAT_META[cat], items, owned: false, cat })
  })

  return (
    <div className="flex flex-col gap-[22px] pb-2" style={{ animation: 'skFadeUp 0.18s ease' }}>
      {sections.map((sec) => {
        const Icon = sec.owned ? SkIcoMine : SKILLS_CAT_ICON[sec.key as CatName]
        return (
          <div key={sec.key}>
            <div className="mb-2.5 flex items-center gap-2.5">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-card" style={{ background: sec.meta.bg, border: `1.5px solid ${sec.meta.border}` }}>
                <Icon size={15} color={sec.meta.color} />
              </div>
              <span className="text-h4 font-extrabold tracking-tight-1 text-ink-heading">{sec.label}</span>
              <span className="rounded-pill px-2 py-0.5 text-2xs font-bold" style={{ color: sec.meta.color, background: sec.meta.bg, border: `1px solid ${sec.meta.border}` }}>{sec.items.length}</span>
              <div className="h-px flex-1 bg-divider" />
            </div>
            <div className="flex flex-col gap-2">
              {sec.items.map((s) => (
                <SkillCard key={s.id} skill={s} category={sec.cat} enabled={enabledMap[s.id] ?? (sec.owned ? true : false)} onToggle={onToggle} onTry={onTry} onView={onView} isUserOwned={sec.owned} onDelete={sec.owned ? () => onDeleteUserSkill?.(s.id) : undefined} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ── SKILL DETAILS MODAL ───────────────────────────────────────── */
function SkillDetailsModal({ skill, category, enabled, isOpen, onClose }: {
  skill: Skill | null; category: CatName | null; enabled: boolean; isOpen: boolean; onClose: () => void
}) {
  if (!skill) return null
  const meta = category ? SKILLS_CAT_META[category] : null
  const Icon = category ? SKILLS_CAT_ICON[category] : null
  return (
    <Modal open={isOpen} onClose={onClose} title="Skill details">
      <div className="flex flex-col gap-3">
        <div>
          <h2 className="mb-1.5 text-h3 font-bold text-ink-heading">{skill.name}</h2>
          <p className="mb-4 text-base leading-relaxed text-ink-muted">{skill.desc}</p>
        </div>
        <div className="mb-2 rounded-field border border-stroke bg-surface px-4 py-3.5">
          <p className="mb-3 text-2xs font-bold uppercase tracking-label text-ink-muted">Details</p>
          {([['Owner', 'now.gg'], ['Status', enabled ? 'Enabled' : 'Disabled'], ['Last updated', '19/05/2026']] as [string, string][]).map(([l, v]) => (
            <div key={l} className="flex justify-between border-b border-divider py-1.5">
              <span className="text-h5 text-ink-muted">{l}</span>
              <span className={`text-h5 font-medium ${l === 'Status' ? (enabled ? 'text-status-success' : 'text-ink-muted') : 'text-ink-heading'}`}>{v}</span>
            </div>
          ))}
        </div>
        {category && Icon && meta && (
          <span className="inline-flex items-center gap-1.5 self-start rounded-pill px-2.5 py-1 text-2xs font-semibold" style={{ background: meta.bg, border: `1px solid ${meta.border}`, color: meta.color }}>
            <Icon size={12} color={meta.color} />{category}
          </span>
        )}
      </div>
    </Modal>
  )
}

/* ── CREATE SKILL MODAL ────────────────────────────────────────── */
function CreateSkillModal({ isOpen, onClose, onCreateSkill, onCreateWithAI, initialMode }: {
  isOpen: boolean; onClose: () => void; onCreateSkill: (s: { name: string; desc: string }) => void;
  onCreateWithAI?: () => void; initialMode?: string
}) {
  const [mode, setMode] = useState(initialMode || 'instruction')
  useEffect(() => { if (isOpen) setMode(initialMode || 'instruction') }, [isOpen, initialMode])
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [instruction, setInstruction] = useState('')
  const [zipFile, setZipFile] = useState<string | null>(null)
  const handleClose = () => { setName(''); setDesc(''); setInstruction(''); setZipFile(null); setMode('instruction'); onClose() }
  const canCreate = name.trim() && desc.trim() && instruction.trim()
  const canSubmit = mode === 'zip' ? !!zipFile : !!canCreate

  return (
    <Modal open={isOpen} onClose={handleClose} title="Create Skill">
      <div className="min-h-[480px]">
        <form
          className="flex flex-col gap-3.5"
          onSubmit={(e) => { e.preventDefault(); if (!canSubmit) return; onCreateSkill(mode === 'zip' ? { name: (zipFile as string).replace(/\.zip$/i, ''), desc: 'Imported from ' + zipFile } : { name, desc }); handleClose() }}
        >
          {/* Mode tabs */}
          <div className="mb-0.5 flex border-b-[1.5px] border-divider">
            {[
              { id: 'instruction', label: 'Write instructions' },
              { id: 'zip', label: 'Upload a ZIP file' },
              { id: 'ai', label: 'Create with BlueAI' },
            ].map((t) => (
              <button
                key={t.id} type="button" onClick={() => setMode(t.id)}
                className={`-mb-px flex-1 whitespace-nowrap px-1 pb-2.5 pt-2 text-sm transition-colors duration-base ${mode === t.id ? 'border-b-[2.5px] border-accent font-bold text-accent' : 'border-b-[2.5px] border-transparent font-medium text-ink-muted'}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Instruction mode */}
          {mode === 'instruction' && (
            <>
              <Field label="Skill Name" required counter={<span className={name.length > 64 ? 'text-status-danger' : undefined}>{name.length}/64</span>}>
                <TextField value={name} onChange={(e) => setName(e.target.value)} maxLength={64} placeholder="e.g. coin-collector" />
              </Field>
              <Field label="Description" required counter={<span className={desc.length > 1024 ? 'text-status-danger' : undefined}>{desc.length}/1024</span>}>
                <TextAreaField value={desc} onChange={(e) => setDesc(e.target.value)} maxLength={1024} rows={2} placeholder="What the skill does and when to use it." />
              </Field>
              <Field label="Instruction" required counter={<>{instruction.length} characters</>}>
                <TextAreaField
                  value={instruction} onChange={(e) => setInstruction(e.target.value)} rows={6}
                  placeholder={'Write the instruction/prompt to run this skill in markdown format.\n\nRecommended sections-\n# Step-by-step instructions\n# Examples\n# Common edge cases'}
                />
              </Field>
            </>
          )}

          {/* ZIP mode */}
          {mode === 'zip' && (
            <div>
              <label className="mb-1.5 block text-h5 font-medium text-ink-body-2">ZIP file <span className="text-status-danger">*</span></label>
              <input
                type="file" accept=".zip"
                onChange={(e) => setZipFile(e.target.files && e.target.files[0] ? e.target.files[0].name : null)}
                className="w-full rounded-card border border-stroke px-3 py-2 text-h5 text-ink-body-2 file:mr-3 file:rounded-card file:border-0 file:bg-indigo-soft file:px-3 file:py-1 file:text-h5 file:font-medium file:text-indigo-ink hover:file:brightness-95"
              />
              <div className="mt-3 rounded-card border border-status-info-soft bg-status-info-soft px-3.5 py-3">
                <p className="mb-1.5 text-sm font-semibold text-status-info-ink">File requirements</p>
                <ul className="list-disc pl-[18px] text-sm leading-relaxed text-status-info-ink">
                  <li>ZIP file must be less than 20 MB.</li>
                  <li>Must include exactly one SKILL.md file at root level.</li>
                  <li>SKILL.md contains name + description in YAML and instructions in markdown.</li>
                </ul>
              </div>
            </div>
          )}

          {/* AI mode */}
          {mode === 'ai' && (
            <div className="flex flex-col items-center gap-4 py-5 text-center">
              {/* Tier-3 decorative iris→cyan brand wash + iris stroke icon */}
              <div className="flex size-14 items-center justify-center rounded-circle bg-bai-wash">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--bai-iris)" strokeWidth="2" strokeLinecap="round"><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" /></svg>
              </div>
              <p className="mx-auto max-w-[260px] text-h5 leading-relaxed text-ink-muted">Describe what you want to do in plain language — BlueAI will build the skill for you in chat.</p>
              {/* Tier-3 decorative iris→cyan brand gradient CTA */}
              <button
                type="button" onClick={() => { handleClose(); onCreateWithAI?.() }}
                className="mt-1 flex items-center gap-2 rounded-field bg-bai-gradient px-7 py-3 text-base font-semibold text-white shadow-brand-sm"
              >
                Start in Chat
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </button>
            </div>
          )}

          {mode !== 'ai' && (
            <div className="flex justify-end gap-2.5 pt-1">
              <Button type="button" variant="secondary" pill={false} onClick={handleClose}>Cancel</Button>
              <Button type="submit" variant="primary" pill={false} disabled={!canSubmit}>Create</Button>
            </div>
          )}
        </form>
      </div>
    </Modal>
  )
}

/* ── BUILD SKILL CTA CARD ─────────────────────────────────────── */
function BuildSkillCTA({ onSelectMode }: { onSelectMode: (mode: string) => void }) {
  return (
    <div className="sticky bottom-0 -mx-3.5 border-t border-divider bg-canvas px-3.5 py-2.5 shadow-float" style={{ animation: 'skFadeUp 0.2s ease' }}>
      {/* Tier-3 decorative iris→cyan brand gradient CTA */}
      <button
        onClick={() => onSelectMode('instruction')}
        className="flex w-full items-center gap-3 rounded-field bg-bai-gradient px-4 py-2.5 text-left transition-opacity duration-base hover:opacity-90"
      >
        <div className="flex size-[34px] shrink-0 items-center justify-center rounded-circle bg-white/20">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-h5 font-extrabold leading-tight text-white">Build a custom skill</p>
          <p className="text-2xs leading-tight text-white/80">Automate anything with BlueAI</p>
        </div>
        <ChevR size={16} color="rgba(255,255,255,0.75)" />
      </button>
    </div>
  )
}

/* ── SKILLS VIEW (main content) ────────────────────────────────── */
function SkillsView({ skills, enabledMap, onToggle, onTry, onView, onNew, userSkills, onDeleteUserSkill, layout = 'grid' }: {
  skills: Record<CatName, Skill[]>; enabledMap: Record<string, boolean>; onToggle: (id: string) => void;
  onTry: (s: Skill, c: CatName | null) => void; onView: (s: Skill, c: CatName | null) => void;
  onNew: (mode: string) => void; userSkills: Skill[]; onDeleteUserSkill?: (id: string) => void; layout?: 'grid' | 'expanded'
}) {
  const [searchQ, setSearchQ] = useState('')
  const [selectedCat, setSelectedCat] = useState<CatName | 'mine' | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Expose drill-down state so parent can hide/show the bottom CTA
  useEffect(() => {
    ;(window as unknown as { __skillsInCategory?: boolean }).__skillsInCategory = !!selectedCat
    window.dispatchEvent(new CustomEvent('skillsCatChange', { detail: !!selectedCat }))
    return () => { (window as unknown as { __skillsInCategory?: boolean }).__skillsInCategory = false }
  }, [selectedCat])

  useEffect(() => {
    let el = scrollRef.current?.closest('[data-skills-scroll]') as HTMLElement | null
    if (!el) el = scrollRef.current?.parentElement as HTMLElement | null
    if (!el) return
    const onScroll = () => setScrolled(el!.scrollTop > 4)
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el!.removeEventListener('scroll', onScroll)
  }, [])

  const searchResults = searchQ.trim()
    ? SKILLS_CATS.flatMap((cat) => (skills[cat] || []).filter((s) => s.name.toLowerCase().includes(searchQ.toLowerCase()) || s.desc.toLowerCase().includes(searchQ.toLowerCase())).map((s) => ({ skill: s, category: cat })))
    : []

  return (
    <div style={{ animation: 'skFadeUp 0.18s ease' }} ref={scrollRef}>
      {/* Sticky header */}
      <div className={`sticky top-0 z-10 -mx-4 bg-surface px-4 pb-3 pt-3.5 transition-shadow duration-base ${scrolled ? 'shadow-float' : ''}`}>
        <div className="mb-3 flex items-center gap-1.5">
          <h1 className="text-xl font-extrabold tracking-tight-2 text-ink-heading">Skills</h1>
          <a
            href="https://docs.google.com/document/d/1TEK2Rkigl03S6I8E9jCs5rHEuV56E0xz4i8rPIlk5UI" target="_blank" rel="noopener noreferrer"
            className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-circle border-[1.5px] border-stroke bg-canvas text-2xs font-bold text-ink-muted no-underline transition-colors duration-fast hover:border-accent hover:text-accent"
          >?</a>
        </div>
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-ink-muted" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          </span>
          <input
            value={searchQ} onChange={(e) => setSearchQ(e.target.value)} placeholder="Search Skill"
            className={`h-[42px] w-full rounded-pill border border-divider bg-canvas pl-10 ${searchQ ? 'pr-9' : 'pr-3'} text-h5 text-ink-body-2 shadow-hairline outline-none transition-colors duration-fast focus:border-accent`}
          />
          {searchQ && (
            <button onClick={() => setSearchQ('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          )}
        </div>
      </div>

      {/* Search results */}
      {searchQ && (
        searchResults.length === 0
          ? <div className="py-[50px] text-center text-base text-ink-muted">No skills match your search.</div>
          : <div className="flex flex-col gap-2 pt-1">
              {searchResults.map(({ skill, category }) => <SkillCard key={skill.id} skill={skill} category={category} enabled={enabledMap[skill.id] ?? false} onToggle={onToggle} onTry={onTry} onView={onView} />)}
            </div>
      )}

      {/* Grid + drill-down */}
      {!searchQ && (
        <div className="pt-3">
          {layout === 'expanded' ? (
            <ExpandedSkillsView skills={skills} enabledMap={enabledMap} onToggle={onToggle} onTry={onTry} onView={onView} userSkills={userSkills} onDeleteUserSkill={onDeleteUserSkill} />
          ) : selectedCat === 'mine' ? (
            <MySkillsDetailView userSkills={userSkills} enabledMap={enabledMap} onToggle={onToggle} onTry={onTry} onView={onView} onNew={onNew} onDeleteUserSkill={onDeleteUserSkill} onBack={() => setSelectedCat(null)} />
          ) : selectedCat ? (
            <CategoryDetailView category={selectedCat} skills={skills[selectedCat] || []} enabledMap={enabledMap} onToggle={onToggle} onTry={onTry} onView={onView} onBack={() => setSelectedCat(null)} />
          ) : (
            <div className="mb-5 grid grid-cols-2 gap-2.5">
              <MySkillsCategoryCard count={userSkills.length} onSelect={() => setSelectedCat('mine')} />
              {SKILLS_CATS
                .filter((cat) => cat !== 'Other' || (skills[cat] || []).length > 0)
                .map((cat) => <CategoryCard key={cat} category={cat} skills={skills[cat] || []} onSelect={setSelectedCat} />)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ── SKILLS SCREEN (root) ──────────────────────────────────────── */
export function Skills({ onTrySkill, isLoading, layout = 'grid' }: {
  onTrySkill?: (p: { id: string; name: string; prompt: string; category: CatName | null }) => void;
  isLoading?: boolean; layout?: 'grid' | 'expanded'
}) {
  const [enabledMap, setEnabledMap] = useState<Record<string, boolean>>(SKILLS_ENABLED)
  const [userSkills, setUserSkills] = useState<Skill[]>([])
  const [viewSkill, setViewSkill] = useState<Skill | null>(null)
  const [viewCat, setViewCat] = useState<CatName | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [createMode, setCreateMode] = useState('instruction')

  const handleToggle = useCallback((id: string) => setEnabledMap((prev) => ({ ...prev, [id]: !prev[id] })), [])
  const handleTry = useCallback((skill: Skill, category: CatName | null) => {
    const prompt = SKILLS_PROMPTS[skill.id] || skill.name
    onTrySkill?.({ id: skill.id, name: skill.name, prompt, category })
  }, [onTrySkill])
  const handleView = useCallback((skill: Skill, cat: CatName | null) => { setViewSkill(skill); setViewCat(cat) }, [])
  const handleCreateSkill = useCallback((s: { name: string; desc: string }) => setUserSkills((prev) => [{ ...s, id: 'usr-' + Date.now() }, ...prev]), [])

  const handleCreateWithAI = useCallback(() => {
    onTrySkill?.({ id: 'create-ai', name: 'Create a custom skill', prompt: "I want to build a custom skill. Here's what I want it to do:\n", category: 'Explore' })
  }, [onTrySkill])

  const handleOpenCreate = useCallback((mode: string) => {
    if (mode === 'ai') { handleCreateWithAI(); return }
    setCreateMode(mode || 'instruction')
    setShowCreate(true)
  }, [handleCreateWithAI])

  // Expose opener so the sticky bottom bar in App can trigger it
  useEffect(() => {
    ;(window as unknown as { __skillsOpenCreate?: ((m: string) => void) | null }).__skillsOpenCreate = handleOpenCreate
    return () => { (window as unknown as { __skillsOpenCreate?: ((m: string) => void) | null }).__skillsOpenCreate = null }
  }, [handleOpenCreate])

  return (
    <>
      <style>{`
        @keyframes skFadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes skSlideIn{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}
      `}</style>
      {isLoading ? (
        <div className="pt-3.5">
          <Shimmer h={28} w={90} r={7} extra={{ marginBottom: 16 }} />
          <Shimmer h={42} r={999} extra={{ marginBottom: 16 }} />
          <div className="grid grid-cols-2 gap-2.5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex min-h-[118px] flex-col gap-2 rounded-chat border border-divider bg-canvas px-3 py-3.5">
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
          <SkillDetailsModal skill={viewSkill} category={viewCat} enabled={viewSkill ? (enabledMap[viewSkill.id] ?? false) : false} isOpen={!!viewSkill} onClose={() => { setViewSkill(null); setViewCat(null) }} />
          <CreateSkillModal isOpen={showCreate} onClose={() => setShowCreate(false)} onCreateSkill={handleCreateSkill} onCreateWithAI={handleCreateWithAI} initialMode={createMode} />
          <SkillsView skills={SKILLS_INITIAL} enabledMap={enabledMap} onToggle={handleToggle} onTry={handleTry} onView={handleView} onNew={handleOpenCreate} userSkills={userSkills} onDeleteUserSkill={(id) => setUserSkills((p) => p.filter((s) => s.id !== id))} layout={layout} />
        </>
      )}
    </>
  )
}

export default Skills
export { BuildSkillCTA }
