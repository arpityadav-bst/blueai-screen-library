'use client'
// BlueAI — Product chat screen (faithful DS port of public/blueai-product/blueai/chat_product.jsx).
// Home = IntroCard greeting + 4 category cards (CATS_LIVE) + Chat History link → category drill-down
// → scripted task-progress conversation (User/Status/Thinking/Final bubbles via makeTaskSteps timers)
// → FeedbackThumbs + reason Chips, plus a composer with a functional grey Stop button.
// Self-contained: ChatCatIcon + IntroCard + CATS_LIVE + the bubble/feedback engine are ported inline.
// Tokens via the --bai-* DS utilities; reason chips use the DS <Chip>. Behavior preserved verbatim.
import { useState, useRef, useEffect, ReactNode } from 'react'
import { Chip } from '@/components/product/ui'

/* ───────── Helpers ───────── */
const fmtStamp = () => 'Jun 12, 2026, 11:03 AM'

function richText(text: string) {
  const urlRe = /(https?:\/\/[^\s]+)/g
  return text.split('\n').map((line, li) => (
    <p key={li} className="break-words" style={{ margin: li === 0 ? 0 : '8px 0 0', whiteSpace: 'pre-wrap' }}>
      {line.split(urlRe).map((part, pi) =>
        urlRe.test(part)
          ? <a key={pi} href="#" onClick={(e) => e.preventDefault()} className="break-all underline">{part}</a>
          : <span key={pi}>{part}</span>)}
    </p>
  ))
}

/* ───────── Icons ───────── */
function ThumbIcon({ dir, size = 16, filled = false }: { dir: 'up' | 'down'; size?: number; filled?: boolean }) {
  const up = 'M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3'
  const down = 'M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zM17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3'
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="block">
      <path d={dir === 'up' ? up : down} />
    </svg>
  )
}

type CatIcon = 'game' | 'social' | 'productivity' | 'explore'
function ChatCatIcon({ type, size = 14, color = 'currentColor' }: { type: CatIcon; size?: number; color?: string }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: '2', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  if (type === 'game') return <svg {...p}><rect x="2" y="6" width="20" height="12" rx="5" /><line x1="9" y1="12" x2="13" y2="12" /><line x1="11" y1="10" x2="11" y2="14" /><circle cx="17" cy="11" r="1" fill={color} stroke="none" /><circle cx="17" cy="13.5" r="1" fill={color} stroke="none" /></svg>
  if (type === 'social') return <svg {...p}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
  if (type === 'productivity') return <svg {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
  return <svg {...p}><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={color} opacity="0.6" stroke="none" /></svg>
}

/* ───────── Intro ───────── */
function IntroCard({ sub }: { sub: string }) {
  return (
    <div className="flex w-full flex-col items-start gap-1.5 px-0 pb-4 pt-5 text-left">
      <h2 className="text-xl font-extrabold leading-tight tracking-tight-2 text-ink-heading">👋🏻 Hi, I&apos;m BlueAI</h2>
      <p className="text-h4 leading-normal text-ink-muted [text-wrap:pretty]">{sub}</p>
    </div>
  )
}

/* ───────── Feedback ───────── */
const FB_REASONS = ["Didn't complete the task", 'Wrong result', 'Took too long', "Didn't understand me", 'Other']

function revealInScroller(el: HTMLElement, pad = 12) {
  let p = el.parentElement
  while (p && !(p.scrollHeight > p.clientHeight && /(auto|scroll)/.test(getComputedStyle(p).overflowY))) p = p.parentElement
  if (!p) return
  const delta = el.getBoundingClientRect().bottom - p.getBoundingClientRect().bottom + pad
  if (delta <= 0) return
  const from = p.scrollTop, to = Math.min(from + delta, p.scrollHeight - p.clientHeight), dur = 240, start = performance.now()
  const ease = (x: number) => 1 - Math.pow(1 - x, 3)
  const tick = (now: number) => { const t = Math.min((now - start) / dur, 1); p!.scrollTop = from + (to - from) * ease(t); if (t < 1) requestAnimationFrame(tick) }
  requestAnimationFrame(tick)
  setTimeout(() => { if (Math.abs(p!.scrollTop - to) > 2) p!.scrollTop = to }, dur + 80)
}

function ReasonChips({ reason, onPick, onOtherSubmit }: { reason: string | null; onPick: (r: string | null) => void; onOtherSubmit: (t: string) => void }) {
  const [otherText, setOtherText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const isOther = reason === 'Other'
  const rootRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = rootRef.current; if (!el) return
    const t1 = setTimeout(() => revealInScroller(el), 60)
    const t2 = setTimeout(() => revealInScroller(el), 280)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [isOther])
  const submit = () => { if (submitted) return; setSubmitted(true); onOtherSubmit(otherText.trim()) }
  return (
    <div ref={rootRef} className="ba-chips-in mt-2.5">
      <p className="mb-1.5 text-2xs font-semibold text-ink-muted">What went wrong?</p>
      <div className="flex flex-wrap gap-1.5">
        {FB_REASONS.map((r) => {
          const sel = reason === r
          return (
            <Chip key={r} selected={sel} className="px-3 py-1.5"
              onClick={() => { if (r === 'Other' || !sel) setSubmitted(false); onPick(sel ? null : r) }}>
              {r}
            </Chip>
          )
        })}
      </div>
      {isOther && (
        <div className="ba-chips-in mt-2 flex items-end gap-1.5">
          <textarea value={otherText} autoFocus rows={1} placeholder="Provide additional feedback" disabled={submitted}
            onChange={(e) => {
              setOtherText(e.target.value); setSubmitted(false)
              const el = e.target, maxH = 48
              el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, maxH) + 'px'
              el.style.overflowY = el.scrollHeight > maxH ? 'auto' : 'hidden'
            }}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() } }}
            className="min-w-0 flex-1 resize-none rounded-field border border-divider bg-canvas px-2.5 py-1.5 text-sm leading-snug text-ink-body outline-none disabled:opacity-65"
            style={{ height: 31, scrollbarWidth: 'thin', overflowY: 'hidden' }} />
          <button onClick={submit} disabled={submitted} aria-label="Submit feedback"
            className={`flex size-[30px] shrink-0 items-center justify-center rounded-circle text-white transition-colors duration-fast ${submitted ? 'cursor-default bg-status-success' : 'cursor-pointer bg-ink-heading'}`}>
            {submitted
              ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              : <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z" /></svg>}
          </button>
        </div>
      )}
    </div>
  )
}

function FeedbackThumbs({ vote, onVote, reason, onReason }: {
  vote: 'up' | 'down' | null; onVote: (v: 'up' | 'down' | null) => void; reason: string | null; onReason: (r: string | null) => void
}) {
  const [thanks, setThanks] = useState(false)
  const [chipsHidden, setChipsHidden] = useState(false)
  const tRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cast = (dir: 'up' | 'down') => {
    const next = vote === dir ? null : dir
    onVote(next)
    if (next !== 'down' && reason) onReason(null)
    setChipsHidden(false)
    if (tRef.current) clearTimeout(tRef.current)
    if (next === 'up') { setThanks(true); tRef.current = setTimeout(() => setThanks(false), 2200) } else setThanks(false)
  }
  const pickReason = (r: string | null) => {
    onReason(r)
    if (tRef.current) clearTimeout(tRef.current)
    if (r && r !== 'Other') { setChipsHidden(true); setThanks(true); tRef.current = setTimeout(() => setThanks(false), 2200) } else setThanks(false)
  }
  const otherSubmitted = () => {
    if (tRef.current) clearTimeout(tRef.current)
    setChipsHidden(true); setThanks(true); tRef.current = setTimeout(() => setThanks(false), 2200)
  }
  const showChips = vote === 'down' && !chipsHidden
  useEffect(() => () => { if (tRef.current) clearTimeout(tRef.current) }, [])
  const labelText = thanks ? 'Thanks for the feedback' : ''
  const btn = (dir: 'up' | 'down') => {
    const selected = vote === dir
    return (
      <button key={dir} onClick={() => cast(dir)} aria-label={dir === 'up' ? 'Good result' : 'Bad result'}
        className={`flex size-8 shrink-0 items-center justify-center rounded-circle border shadow-hairline transition-colors duration-fast
          ${selected ? 'border-stroke bg-surface text-ink-heading' : 'border-divider bg-canvas text-ink-muted'} ${vote && !selected ? 'opacity-55' : ''}`}>
        <ThumbIcon dir={dir} size={15} filled={selected} />
      </button>
    )
  }
  return (
    <div className="ml-0.5 mt-2">
      <div className="flex items-center gap-2">
        {btn('up')}{btn('down')}
        <span className={`text-sm font-semibold text-ink-muted ${thanks ? 'ba-thanks-in' : ''}`}>{labelText}</span>
      </div>
      {showChips && <ReasonChips reason={reason} onPick={pickReason} onOtherSubmit={otherSubmitted} />}
    </div>
  )
}

/* ───────── Bubbles ───────── */
function UserBubble({ content }: { content: string }) {
  return (
    <div className="ba-msg-in mb-3 flex justify-end">
      {/* Tier-3 brand element: the user-bubble purple gradient + glow stay literal (flagged in notes). */}
      <div className="rounded-chat px-3.5 pb-2 pt-3" style={{ maxWidth: 290, background: 'linear-gradient(135deg,#5158ee,#7b4cff)', boxShadow: '0 4px 14px rgba(99,102,241,0.30)' }}>
        <p className="break-words text-h5 leading-snug text-white" style={{ whiteSpace: 'pre-wrap' }}>{content}</p>
        <p className="mt-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.75)' }}>{fmtStamp()}</p>
      </div>
    </div>
  )
}

function StatusBubble({ content }: { content: string }) {
  return (
    <div className="ba-msg-in mb-2.5 flex justify-start">
      <div className="rounded-chat border border-divider bg-surface px-3 py-2.5 shadow-hairline" style={{ maxWidth: 290 }}>
        <p className="text-sm leading-snug text-ink-body-2">{content}</p>
      </div>
    </div>
  )
}

function ThinkingBubble() {
  return (
    <div className="ba-msg-in mb-2.5 flex justify-start">
      <div className="rounded-chat border border-divider bg-surface px-4 pb-2 pt-3 shadow-hairline">
        <div className="mb-1.5 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            // periwinkle thinking dots → on-token brand iris (flagged in notes)
            <span key={i} className="inline-block size-[7px] rounded-circle bg-iris" style={{ animation: 'ba-pulse 1.2s ease-in-out infinite', animationDelay: i * 0.18 + 's' }} />
          ))}
        </div>
        <p className="text-sm text-ink-muted">Working on it…</p>
      </div>
    </div>
  )
}

type Step = { role: 'user' | 'status' | 'thinking' | 'final'; content?: string; tone?: 'success'; d: number }

function FinalBubble({ msg, feedback }: { msg: Step; feedback: ReturnType<typeof makeFeedback> | null }) {
  return (
    <div className="ba-msg-in mb-3 flex flex-col items-start">
      <div className="rounded-chat border border-status-success-soft bg-status-success-soft px-3.5 pb-2.5 pt-3 shadow-hairline" style={{ maxWidth: 310 }}>
        <div className="text-h5 leading-relaxed text-ink-body">{richText(msg.content || '')}</div>
      </div>
      {feedback && <FeedbackThumbs {...feedback} />}
    </div>
  )
}

/* Generic task script played for any prompt the user picks or types. */
function makeTaskSteps(text: string): Step[] {
  return [
    { role: 'user', content: text, d: 250 },
    { role: 'status', content: 'Got it — starting on your task…', d: 900 },
    { role: 'thinking', d: 1200 },
    { role: 'status', content: 'Opening the required app and navigating to the right screen…', d: 1100 },
    { role: 'status', content: 'Performing the actions step by step…', d: 1100 },
    { role: 'status', content: 'Verifying the result…', d: 1000 },
    { role: 'final', tone: 'success', content: 'Done — I completed your task: “' + text + '”. Let me know if you’d like me to do anything else.', d: 900 },
  ]
}

/* ───────── Live home categories (matched to the live app — newer than the export). ───────── */
type Cat = { icon: CatIcon; color: string; bg: string; border: string; desc: string; prompts: string[] }
const CATS_LIVE: Record<string, Cat> = {
  'Social Media': { icon: 'social', color: '#E05C8A', bg: '#FCE9F1', border: '#F5C0D5', desc: "Posts, replies, and swipes while you're off living.", prompts: ["Scan my girlfriend's Instagram profile and suggest what I can gift her", 'Swipe profiles on my dating apps based on my preferences', 'Find 3 Reddit threads worth replying to and draft my replies', 'Draft sponsorship pitches to 5 brands for me', 'Draft replies to my unanswered Discord threads', 'Re-train my Reels feed toward dog videos', 'Show me what the people I follow posted this week'] },
  'Game Helpers': { icon: 'game', color: '#5B6CF6', bg: '#EEF0FE', border: '#D4D9FB', desc: 'Grabs your rewards and grinds dailies while you sleep.', prompts: ["Find a guide for the level I'm stuck on", 'Complete the initial boring tutorial of the Coin Master game for me', 'Play Whiteout Survival for 10 min', 'Collect bonus coins in Disney Solitaire game'] },
  Explore: { icon: 'explore', color: '#3B8FD4', bg: '#E4F2FC', border: '#B6D9F4', desc: 'Finds free games, fresh fits, and new things to try.', prompts: ['Search the web for active redeem codes for my games', 'Collect paid games that are free on Google Play Store every day', 'Recommend and install a new game for me', 'Suggest an outfit for me today'] },
  Productivity: { icon: 'productivity', color: '#1BA07A', bg: '#DDF4EE', border: '#A8E4D4', desc: 'Chores, reminders, summaries — done before your coffee.', prompts: ['Every morning, brief me on the latest news and my schedule for the day', 'Wind down my phone for the night and prep tomorrow', 'Set up a task that runs automatically every day at 6 AM'] },
}

/* Home category list WITH task counts (matches the live layout). */
function ProductHome({ onRun, onOpenHistory }: { onRun: (p: string) => void; onOpenHistory: () => void }) {
  const [selectedCat, setSelectedCat] = useState<string | null>(null)

  if (selectedCat) {
    const meta = CATS_LIVE[selectedCat]
    return (
      <div style={{ animation: 'baExpand 0.18s ease' }}>
        <button onClick={() => setSelectedCat(null)}
          className="inline-flex items-center gap-1.5 rounded-pill border border-divider bg-canvas py-1.5 pl-2.5 pr-3 text-sm font-semibold text-ink-muted shadow-hairline transition-colors hover:bg-surface">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
          All Actions
        </button>
        {/* Category header: icon · title · category-colored task-count pill · description */}
        <div className="my-3.5 flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-field border" style={{ background: meta.bg, borderColor: meta.border }}>
            <ChatCatIcon type={meta.icon} size={22} color={meta.color} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-h3 font-extrabold tracking-tight-1 text-ink-heading">{selectedCat}</span>
              {/* Tier-3: category-branded count pill keeps its data-driven color (like the icon tile). */}
              <span className="shrink-0 rounded-pill px-2.5 py-0.5 text-2xs font-bold" style={{ background: meta.bg, color: meta.color }}>{meta.prompts.length} {meta.prompts.length === 1 ? 'task' : 'tasks'}</span>
            </div>
            <p className="mt-0.5 text-2xs leading-snug text-ink-muted">{meta.desc}</p>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          {meta.prompts.map((p, i) => (
            <button key={i} onClick={() => onRun(p)}
              className="flex items-center justify-between gap-2.5 rounded-field border border-divider bg-canvas px-3.5 py-3 text-left text-h5 font-medium leading-snug text-ink-body-2 transition-colors hover:border-stroke hover:bg-surface">
              <span className="[text-wrap:pretty]">{p}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="shrink-0 text-ink-muted"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <p className="mb-2 text-left text-xs font-bold tracking-eyebrow text-ink-muted">WHAT WOULD YOU LIKE TO DO?</p>
      <div className="flex flex-col gap-1.5">
        {Object.entries(CATS_LIVE).map(([name, meta]) => (
          <div key={name} role="button" tabIndex={0} onClick={() => setSelectedCat(name)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedCat(name) } }}
            className="flex cursor-pointer items-center gap-3 rounded-field border border-divider bg-canvas px-3 py-2.5 transition-all duration-fast hover:-translate-y-px hover:border-stroke hover:shadow-float">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-field border" style={{ background: meta.bg, borderColor: meta.border }}>
              <ChatCatIcon type={meta.icon} size={20} color={meta.color} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-h5 font-bold leading-tight text-ink-heading">{name}</p>
              <p className="mt-px text-2xs leading-snug text-ink-muted">{meta.desc}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <span className="text-2xs font-semibold text-ink-muted">{meta.prompts.length} {meta.prompts.length === 1 ? 'task' : 'tasks'}</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-ink-muted"><polyline points="9 18 15 12 9 6" /></svg>
            </div>
          </div>
        ))}
      </div>
      <button onClick={onOpenHistory}
        className="group mx-auto mb-1 mt-4 flex items-center justify-center gap-1.5 whitespace-nowrap px-1.5 py-1 text-sm font-medium text-ink-muted transition-colors hover:text-accent">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v5h5" /><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" /><polyline points="12 7 12 12 15 14" /></svg>
        <span className="group-hover:underline">Chat History</span>
      </button>
    </div>
  )
}

/* ───────── Merged chat screen: ProductHome (empty) → task-progress + feedback (active) ───────── */
function makeFeedback(key: string, votes: Record<string, 'up' | 'down' | null>, setVotes: (f: (p: Record<string, 'up' | 'down' | null>) => Record<string, 'up' | 'down' | null>) => void, reasons: Record<string, string | null>, setReasons: (f: (p: Record<string, string | null>) => Record<string, string | null>) => void) {
  return {
    vote: votes[key] || null,
    onVote: (v: 'up' | 'down' | null) => setVotes((p) => ({ ...p, [key]: v })),
    reason: reasons[key] || null,
    onReason: (r: string | null) => setReasons((p) => ({ ...p, [key]: r })),
  }
}

export function ProductChat({ sessionKey, seed, loading, onOpenHistory, loadingFallback }: {
  sessionKey?: string | number; seed?: { text?: string }; loading?: boolean; onOpenHistory?: () => void; loadingFallback?: ReactNode
}) {
  const [convo, setConvo] = useState<Step[]>([])
  const [visible, setVisible] = useState(0)
  const [draft, setDraft] = useState('')
  const [votes, setVotes] = useState<Record<string, 'up' | 'down' | null>>({})
  const [reasons, setReasons] = useState<Record<string, string | null>>({})
  const [composerFocused, setComposerFocused] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const taRef = useRef<HTMLTextAreaElement>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => { timers.current.forEach(clearTimeout); timers.current = []; setConvo([]); setVisible(0); setDraft(''); setVotes({}); setReasons({}) }, [sessionKey])
  useEffect(() => { if (seed && seed.text) { setDraft(seed.text); taRef.current && taRef.current.focus() } }, [seed])
  useEffect(() => { const el = scrollRef.current; if (el) el.scrollTop = el.scrollHeight }, [visible, convo])
  useEffect(() => { const ta = taRef.current; if (!ta) return; ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 120) + 'px' }, [draft])
  useEffect(() => () => { timers.current.forEach(clearTimeout) }, [])

  const started = convo.length > 0
  const running = visible < convo.length

  const run = (text?: string) => {
    const t = (text != null ? text : draft).trim()
    if (!t || running) return
    setDraft('')
    const steps = makeTaskSteps(t)
    setConvo((prev) => {
      const base = prev.length
      let cum = 0
      steps.forEach((step, i) => { cum += step.d; timers.current.push(setTimeout(() => setVisible(base + i + 1), cum)) })
      return [...prev, ...steps]
    })
  }
  // Stop a running task: cancel pending steps, drop a trailing "working" indicator, keep partial output.
  const stop = () => {
    timers.current.forEach(clearTimeout); timers.current = []
    let end = visible
    while (end > 0 && convo[end - 1] && convo[end - 1].role === 'thinking') end--
    setConvo(convo.slice(0, end)); setVisible(end)
  }
  const feedbackFor = (idx: number, step: Step) =>
    step.tone !== 'success' ? null : makeFeedback('k' + idx, votes, setVotes, reasons, setReasons)

  const renderStep = (step: Step, i: number) => {
    if (step.role === 'user') return <UserBubble key={i} content={step.content || ''} />
    if (step.role === 'status') return <StatusBubble key={i} content={step.content || ''} />
    if (step.role === 'thinking') return i === visible - 1 ? <ThinkingBubble key={i} /> : null
    return <FinalBubble key={i} msg={step} feedback={feedbackFor(i, step)} />
  }

  return (
    <>
      <style>{`
        @keyframes ba-pulse { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.5); opacity: .5; } }
        @keyframes baMsgIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes baThanksIn { from { opacity: 0; transform: translateX(-3px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes baExpand { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        .ba-msg-in, .ba-chips-in { animation: baMsgIn .22s ease; }
        .ba-thanks-in { animation: baThanksIn .2s ease; }
      `}</style>
      <div className="flex-1 overflow-hidden">
        <div ref={scrollRef} className="h-full overflow-y-auto p-4" style={{ scrollbarWidth: 'thin' }}>
          <IntroCard sub="Your AI worker for BlueStacks — pick a task below or just type what you need." />
          {!started
            ? <div className="mt-1">{loading ? loadingFallback : <ProductHome onRun={(p) => run(p)} onOpenHistory={() => onOpenHistory && onOpenHistory()} />}</div>
            : <div className="mt-1">{convo.slice(0, visible).map(renderStep)}</div>}
        </div>
      </div>

      {/* Composer — focus ring + grey, spinner-free Stop button preserved */}
      <div className="shrink-0 px-4 pb-2.5 pt-1">
        <div className={`flex items-center gap-2 rounded-chat border bg-canvas px-2.5 py-2 transition-shadow duration-fast
          ${composerFocused ? 'border-accent shadow-[0_0_0_3px_rgba(var(--bai-accent-rgb),0.14)]' : 'border-stroke shadow-hairline'}`}>
          <textarea ref={taRef} value={draft} disabled={running} rows={1}
            onChange={(e) => setDraft(e.target.value)}
            onFocus={() => setComposerFocused(true)}
            onBlur={() => setComposerFocused(false)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); run() } }}
            placeholder={running ? 'BlueAI is working…' : 'Type your message...'}
            className="flex-1 resize-none border-none bg-transparent px-1.5 py-1 text-h5 leading-normal text-ink-body outline-none"
            style={{ maxHeight: 120, overflowY: 'hidden' }} />
          <button onClick={() => (running ? stop() : run())} disabled={!running && !draft.trim()}
            aria-label={running ? 'Stop task' : 'Send message'} title={running ? 'Stop' : 'Send'}
            className={`flex size-[34px] shrink-0 items-center justify-center rounded-circle transition-all duration-fast hover:opacity-85 disabled:cursor-default
              ${running ? 'border border-divider bg-surface text-ink-muted' : draft.trim() ? 'bg-accent text-white' : 'bg-accent text-white opacity-50'}`}>
            {running
              ? <svg width="13" height="13" viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="14" rx="3" fill="currentColor" /></svg>
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z" /></svg>}
          </button>
        </div>
      </div>
    </>
  )
}

export default ProductChat
