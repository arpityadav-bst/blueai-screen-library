'use client'
import { useState } from 'react'
import { Button } from '@/components/product/ui/Button'
import { Card } from '@/components/product/ui/Card'
import { Field, TextField, TextAreaField, SelectField } from '@/components/product/ui/Field'
import { Modal, ConfirmDialog } from '@/components/product/ui/Modal'

// ── Types ──────────────────────────────────────────────────────────────
type ScheduleType = 'once' | 'daily' | 'weekly' | 'monthly' | 'minutes'
interface ScheduleDef {
  type?: ScheduleType
  weekdays?: string[]
  day_of_month?: number
  interval_minutes?: number
}
interface ScheduledTask {
  id: string
  name: string
  schedule: ScheduleDef
  next_run: string | null
}

// ── Seed data (ported from source) ─────────────────────────────────────
const SCHED_TASKS_INIT: ScheduledTask[] = [
  { id: 'st1', name: 'Daily Coin Master Rewards', schedule: { type: 'daily' }, next_run: new Date(Date.now() + 86400000).toISOString() },
  { id: 'st2', name: 'Weekly Social Media Posts', schedule: { type: 'weekly', weekdays: ['Mon', 'Wed', 'Fri'] }, next_run: new Date(Date.now() + 86400000 * 3).toISOString() },
]

// Repeat-label guard — never renders an empty "Weekly ()".
function repeatLabel(sch: ScheduleDef): string {
  if (!sch?.type) return 'One time'
  if (sch.type === 'daily') return 'Daily'
  if (sch.type === 'weekly') return Array.isArray(sch.weekdays) && sch.weekdays.length ? `Weekly (${sch.weekdays.join(', ')})` : 'Weekly'
  if (sch.type === 'monthly') return sch.day_of_month ? `Monthly (day ${sch.day_of_month})` : 'Monthly'
  if (sch.type === 'minutes') return `Every ${sch.interval_minutes} min`
  return sch.type
}

// ── Inline icons (ported from shared.jsx; SVG path geometry kept as-is) ─
function IcoCalendar({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}
function IcoClock({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
function IcoPencilEdit({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}
function IcoTrashBin({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}
function IcoPlusSmall({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

// ── Schedule card ───────────────────────────────────────────────────────
function ScheduleCard({ task, onEdit, onDelete }: { task: ScheduledTask; onEdit: () => void; onDelete: () => void }) {
  return (
    <li className="mb-3 list-none">
      <Card className="p-4">
      <h3 className="mb-3 text-md font-bold text-ink-heading">{task.name}</h3>
      <div className="mb-3.5 flex flex-col gap-[7px]">
        <div className="flex items-center gap-2 text-h5 text-ink-muted">
          <span className="text-ink-muted"><IcoCalendar size={14} /></span>
          <span><strong className="text-ink-body-2">Schedule:</strong> {repeatLabel(task.schedule)}</span>
        </div>
        <div className="flex items-center gap-2 text-h5 text-ink-muted">
          <span className="text-ink-muted"><IcoClock size={14} /></span>
          <span>
            <strong className="text-ink-body-2">Next run:</strong>{' '}
            <span className="font-medium text-accent">
              {task.next_run
                ? new Date(task.next_run).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                : 'N/A'}
            </span>
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-card border border-divider bg-canvas px-3 py-2.5 text-h5 font-medium text-ink-body-2 transition-colors duration-fast hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <IcoPencilEdit size={13} /> Edit
        </button>
        <button
          onClick={onDelete}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-card border border-divider bg-canvas px-3 py-2.5 text-h5 font-medium text-ink-body-2 transition-colors duration-fast hover:border-status-danger hover:bg-status-danger-soft hover:text-status-danger focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-danger"
        >
          <IcoTrashBin size={13} /> Delete
        </button>
      </div>
      </Card>
    </li>
  )
}

// ── Create-schedule modal ────────────────────────────────────────────────
function CreateScheduleModal({ isOpen, onClose, onSave }: { isOpen: boolean; onClose: () => void; onSave: (t: ScheduledTask) => void }) {
  const [name, setName] = useState('')
  const [prompt, setPrompt] = useState('')
  const [repeat, setRepeat] = useState<ScheduleType>('daily')
  const canSave = !!name.trim() && !!prompt.trim()

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSave) return
    onSave({
      id: 'st' + Date.now(),
      name: name.trim(),
      schedule: { type: repeat },
      next_run: new Date(Date.now() + 86400000).toISOString(),
    })
    setName('')
    setPrompt('')
    setRepeat('daily')
    onClose()
  }

  return (
    <Modal open={isOpen} onClose={onClose} title="Schedule task">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Field label="Task name" required>
          <TextField value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Daily rewards collection" />
        </Field>
        <Field label="Task prompt" required>
          <TextAreaField value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe what BlueAI should do…" rows={3} />
        </Field>
        <Field label="Repeat">
          <SelectField value={repeat} onChange={(e) => setRepeat(e.target.value as ScheduleType)}>
            <option value="once">One time</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </SelectField>
        </Field>
        <div className="flex gap-2.5">
          <Button type="button" variant="secondary" pill={false} onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" variant="primary" pill={false} disabled={!canSave} className="flex-1">Create</Button>
        </div>
      </form>
    </Modal>
  )
}

// ── Screen ────────────────────────────────────────────────────────────────
export function Schedule({ isLoading }: { isLoading?: boolean }) {
  const [tasks, setTasks] = useState<ScheduledTask[]>(SCHED_TASKS_INIT)
  const [showCreate, setShowCreate] = useState(false)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  if (isLoading) {
    const bar = 'animate-pulse rounded-card bg-surface'
    return (
      <div className="pt-3.5">
        <div className="mb-4 flex items-center justify-between">
          <div className={`${bar} h-6 w-[150px]`} />
          <div className={`${bar} h-8 w-16`} />
        </div>
        {[1, 2].map((i) => (
          <Card key={i} className="mb-3 p-4">
            <div className={`${bar} mb-3.5 h-[17px] w-[65%]`} />
            <div className={`${bar} mb-2 h-3 w-[80%]`} />
            <div className={`${bar} mb-4 h-3 w-[60%]`} />
            <div className="flex gap-2">
              <div className={`${bar} h-9 flex-1`} />
              <div className={`${bar} h-9 flex-1`} />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="pb-5 pt-3.5">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-ink-heading">Scheduled tasks</h1>
        <Button variant="primary" size="sm" pill leftIcon={<IcoPlusSmall size={11} />} onClick={() => setShowCreate(true)}>
          New
        </Button>
      </div>

      {tasks.length === 0 ? (
        <Card className="px-5 py-12 text-center">
          {/* Empty-state glyph wash — DS indigo (closest token to source #f3e8ff/#9333ea purple). */}
          <div className="mx-auto mb-3.5 flex size-14 items-center justify-center rounded-circle bg-indigo-soft text-indigo">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <p className="mb-1.5 text-h4 font-semibold text-ink-body-2">No scheduled tasks</p>
          <p className="mb-4 text-h5 leading-normal text-ink-muted">Schedule jobs to run automatically at specific times.</p>
          <button
            onClick={() => setShowCreate(true)}
            className="rounded-card border border-accent/30 bg-accent/10 px-5 py-2.5 text-base font-semibold text-accent transition-colors duration-fast hover:bg-accent/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Create schedule
          </button>
        </Card>
      ) : (
        <ul className="m-0 p-0">
          {tasks.map((t) => (
            <ScheduleCard key={t.id} task={t} onEdit={() => {}} onDelete={() => setConfirmId(t.id)} />
          ))}
        </ul>
      )}

      <CreateScheduleModal isOpen={showCreate} onClose={() => setShowCreate(false)} onSave={(t) => setTasks((prev) => [...prev, t])} />

      <ConfirmDialog
        open={!!confirmId}
        title="Confirm delete"
        body="Are you sure you want to delete this scheduled task? This action cannot be undone."
        confirmLabel="Delete"
        danger
        onCancel={() => setConfirmId(null)}
        onConfirm={() => {
          setTasks((p) => p.filter((t) => t.id !== confirmId))
          setConfirmId(null)
        }}
      />
    </div>
  )
}
