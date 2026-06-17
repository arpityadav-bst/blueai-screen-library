'use client'

// BlueAI — Chat History (in-app screen; accordion of past sessions).
// Faithful port of public/blueai-product/blueai/history.jsx onto the product DS kit.
// Matches the live product: the app header + bottom nav stay, there is NO overlay,
// NO close "X", and NO composer — the screen replaces the whole chat area.
// Each row is an accordion: tap to expand the FULL past conversation inline. The
// expanded transcript matches the row's message count and scrolls when long.
import { useState } from 'react'
import { Card } from '@/components/product/ui'

// ── Data + helpers (ported in so the screen is self-contained) ──────────────

// Generic agent step lines used to pad a transcript up to its message count.
const GENERIC_POOL = [
  'Analyzing your request…', 'Opening the required app…', 'Navigating to the right screen…',
  'Reading the on-screen content…', 'Performing the next action…', 'Waiting for the page to respond…',
  'Verifying the result so far…', 'Continuing to the next step…',
]
const GENSHIN_POOL = [
  'Checking HoYoLAB for the latest codes…', 'Reading the redeem-code list…',
  'Cross-checking which codes are still active…', 'Filtering out expired codes…',
  'Copying the active codes…', 'Verifying each code on the redemption page…',
  'Noting the rewards for each code…',
]

type BaseTime = { date: string; h: number; m: number; ap: 'AM' | 'PM' }
type HistoryItem = {
  id: string
  title: string
  n: number
  when: string
  base: BaseTime
  steps?: string[]
  result?: string
  pool?: string[]
}

// Past sessions (newest first). `base` = first message time; `when` = header time.
const HISTORY_ITEMS: HistoryItem[] = [
  { id: 'ig', title: "Scan my girlfriend's Instagram profile and suggest what I can gift her",
    n: 1, when: 'Jun 13, 05:24 PM', base: { date: 'Jun 13', h: 5, m: 24, ap: 'PM' }, steps: [] },
  { id: 'hi1', title: 'hi', n: 3, when: 'Jun 13, 02:47 PM', base: { date: 'Jun 13', h: 2, m: 47, ap: 'PM' },
    steps: ["Hey! I'm BlueAI — your AI worker for BlueStacks."], result: "Tell me a task and I'll handle it for you." },
  { id: 'hi2', title: 'hi', n: 3, when: 'Jun 11, 11:02 AM', base: { date: 'Jun 11', h: 11, m: 2, ap: 'AM' },
    steps: ['Hi there! What can I help you automate today?'], result: "Just type a task and I'll take it from here." },
  { id: 'gen', title: 'find all active redeem codes for genshin impact', n: 17, when: 'May 27, 02:16 AM',
    base: { date: 'May 27', h: 2, m: 13, ap: 'AM' }, pool: GENSHIN_POOL,
    steps: ['Agent started…', 'Opening Chrome to search for codes…', 'Scrolling to find active codes…'],
    result: 'Done — I found 3 active codes and listed them for you. Want me to redeem them?' },
  { id: 'fake', title: 'redeem this code: FAKE123NOTAREAL', n: 62, when: 'May 27, 02:12 AM',
    base: { date: 'May 27', h: 2, m: 12, ap: 'AM' },
    steps: ['Agent started…', 'Opening the redemption page to enter the code…'],
    result: "That code wasn't valid — it looks like a placeholder. Double-check the source and I'll try again." },
  { id: 'build', title: 'show me the recommended build for Anemo characters', n: 28, when: 'May 26, 11:55 PM',
    base: { date: 'May 26', h: 11, m: 55, ap: 'PM' },
    steps: ['Agent started…', 'Searching for the recommended Anemo build…'],
    result: 'Here are the recommended weapons, artifacts, and main stats for your Anemo characters.' },
  { id: 'gallery', title: "what's in my gallery?", n: 33, when: 'May 26, 11:47 PM',
    base: { date: 'May 26', h: 11, m: 47, ap: 'PM' },
    steps: ['Agent started…', 'Opening your gallery…', 'Scanning recent media…'],
    result: 'You have 248 photos and 32 videos. Want me to organize or share any?' },
]

type ConvoMsg = { r: 'user' | 'agent'; c: string; t: string }

function pad2(x: number) { return (x < 10 ? '0' : '') + x }

// 12-hour clock stepper: returns "MMM D, hh:mm AM/PM" for the base time + `add` minutes.
function stepTime(b: BaseTime, add: number) {
  const h24 = (b.h % 12) + (b.ap === 'PM' ? 12 : 0)
  const total = (((h24 * 60 + b.m + add) % 1440) + 1440) % 1440
  const hh = Math.floor(total / 60), mm = total % 60
  const ap = hh >= 12 ? 'PM' : 'AM'
  let h12 = hh % 12; if (h12 === 0) h12 = 12
  return b.date + ', ' + pad2(h12) + ':' + pad2(mm) + ' ' + ap
}

// Build the full transcript: 1 user message + (n-1) agent messages, ending on the result.
// Timestamps advance ~1 minute every 3 messages (matches the live grouping).
function buildConvo(it: HistoryItem): ConvoMsg[] {
  const agentCount = Math.max(0, it.n - 1)
  const pool = it.pool || GENERIC_POOL
  const seq = [...(it.steps || [])]
  let pi = 0
  while (seq.length < agentCount - 1) seq.push(pool[pi++ % pool.length])
  if (agentCount >= 1) seq.push(it.result || 'Done — task completed.')
  const lines = seq.slice(0, agentCount)
  const msgs: ConvoMsg[] = [{ r: 'user', c: it.title, t: stepTime(it.base, 0) }]
  lines.forEach((c, i) => msgs.push({ r: 'agent', c, t: stepTime(it.base, Math.floor((i + 1) / 3)) }))
  return msgs
}

// ── Bubble ──────────────────────────────────────────────────────────────────
// NOTE: the user-bubble purple gradient is a Tier-3 brand element (chat user bubble),
// kept as a raw inline gradient per the kit's KEEP-AS-IS rule (flagged in self-report).
function HistMsg({ m }: { m: ConvoMsg }) {
  const isUser = m.r === 'user'
  return (
    <div className={`flex mb-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={
          isUser
            ? 'max-w-[280px] rounded-chat px-3.5 pt-2.5 pb-2 text-white'
            : 'max-w-[280px] rounded-chat px-3.5 pt-2.5 pb-2 bg-surface border border-divider'
        }
        style={isUser ? { background: 'linear-gradient(135deg,#5158ee,#7b4cff)' } : undefined}
      >
        <p
          className={`text-h5 leading-snug whitespace-pre-wrap break-words ${isUser ? 'text-white' : 'text-ink-body'}`}
        >
          {m.c}
        </p>
        <p className={`text-2xs mt-1 ${isUser ? 'text-white/75' : 'text-ink-muted'}`}>{m.t}</p>
      </div>
    </div>
  )
}

// ── Screen ────────────────────────────────────────────────────────────────────
export function ChatHistory() {
  const [openId, setOpenId] = useState<string | null>(null)
  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-surface">
      <h1 className="px-4 pt-3.5 pb-2.5 text-xl font-extrabold tracking-tight-2 text-ink-heading">
        Chat History
      </h1>
      <div className="flex flex-col gap-2.5 px-4 pb-4.5">
        {HISTORY_ITEMS.map((it) => {
          const isOpen = openId === it.id
          return (
            <Card key={it.id} className="overflow-hidden rounded-chat">
              <button
                onClick={() => setOpenId(isOpen ? null : it.id)}
                className="flex w-full cursor-pointer items-center gap-2.5 px-3.5 py-3.5 text-left font-[inherit]"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-h4 font-semibold leading-snug text-ink-body">{it.title}</p>
                  <p className="mt-1 text-sm text-ink-muted">
                    {it.n} message{it.n === 1 ? '' : 's'} · {it.when}
                  </p>
                </div>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`flex-shrink-0 text-ink-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {isOpen && (
                <div className="max-h-[360px] overflow-y-auto border-t border-divider px-3.5 pt-3.5 pb-2.5">
                  {buildConvo(it).map((m, i) => (
                    <HistMsg key={i} m={m} />
                  ))}
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default ChatHistory
