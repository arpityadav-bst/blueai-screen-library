import { useCallback, useEffect, useRef } from 'react'
import { MACHINES } from './machines'

// The mock's page script (alt-copy.html), ported as a hook and then re-homed onto the machine
// stage (2026-08-19): the perpetual task lifecycle, the earnings credit + chip flight, and the
// time-aware dock line.
//
// WHAT MOVED. The mock ran its task rows inside a CSS-drawn laptop screen — a working row plus a
// stack of three completed rows. That scene is gone (MachineStage.tsx), so the lifecycle now plays
// in the task bar under the stage, ONE task at a time, and completing a task advances the machine.
// That is the point rather than a side effect: each machine takes a job, finishes it, hands off to
// the next — the fleet strip's "One worker · Any machine you own" acted out instead of asserted.
// The completed-row stack has no equivalent here and is not faked.
//
// NO RUNNING TOTAL ANY MORE (Appy, 2026-08-19: the Earned pill was removed). Three things went
// with it, because each existed only to serve it: the cumulative counter, the bump animation, and
// flyChip — money chips flew TO the pill, so with no destination there is nothing to fly. Money is
// now told per task: the "+$X" tag on a paid completion, plus the floating badges around each
// machine. Deleted rather than left dangling: a guard that still required #earnings would have
// silently stopped the whole loop from ever starting.
//
// ONLY LIVE MACHINES PAY. MACHINES[].live gates the payout: the PC completes with a "+$X" tag, the
// vision machines just say "Done" and show no tag at all. They used to carry a "Soon" tag; Appy
// removed it 2026-08-20 for simplicity, and it was safe to remove because the fleet strip 200px
// below still marks those machines as not-yet-live — which is what keeps the hero from claiming
// earnings the page contradicts a screen later.
//
// DIRECT DOM BY ID, EXACTLY LIKE THE MOCK — deliberately not React state. A progress bar ticking
// every 120ms as state would re-render the page for nothing, and the markup it mutates is static
// (React never re-renders that subtree), so mutation cannot fight reconciliation.
//
// WHAT THE PORT ADDS that the mock didn't need: cleanup. The mock's page never unmounts; this
// component does (and StrictMode mounts twice in dev). Every timer/interval registers into one set
// and an `alive` flag gates every continuation, so unmount genuinely stops the loop.
const PAYS = [0.4, 0.6, 1, 1.5]
/** How long a beat holds, from the length of the line it is showing (Appy, 2026-08-20: "make the
    longer textual reads stay longer and smaller can be faster, but right now i miss longer text
    for full read").
    The three fixed durations this replaces (1700/1500/1200) were tuned against the shortest line
    in each slot, so the same slot showing a 40-character sentence was gone before it could be
    read — and because each beat REPLACES the last one in a single line rather than stacking, a
    missed line is missed for good. 48ms a character is deliberately slower than actual reading
    speed: this text sits over a moving image and is glanced at, not studied.
    The floor keeps two-word confirmations from flashing past; the ceiling keeps the sequence from
    stalling if a line is ever written long. */
const readMs = (line: string) => Math.min(3600, Math.max(1300, 800 + line.length * 48))
/** How long a finished task holds before the next machine takes over — the payout is the payoff
    of the whole sequence, so it gets the longest single hold. */
const HANDOFF = 2100
/** Progress-bar tick. The INCREMENT is derived per machine from readMs(work) so the bar finishes
    exactly when its line has had its reading time — the work beat is the only one whose duration
    is set by the bar rather than by a timer, and a fixed increment made it the one beat that
    ignored how long its own sentence was. */
const WORK_TICK = 130

/* F27: SVG check instead of the &#10003; font glyph (stroke currentColor picks up the row colour) */
const TICK =
  '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
  'stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M20 6 9 17l-5-5"/></svg>'

export default function useHomeFx() {
  const aliveRef = useRef(true)
  const timersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set())
  /** Set by the loop each time a machine shows; the resize listener below re-runs it. */
  const relayoutRef = useRef<(() => void) | null>(null)
  const intervalsRef = useRef<Set<ReturnType<typeof setInterval>>>(new Set())
  const later = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      timersRef.current.delete(id)
      if (aliveRef.current) fn()
    }, ms)
    timersRef.current.add(id)
  }, [])

  // Time-aware line — the mock ran this at parse time; here it runs on mount. Idempotent, so
  // StrictMode's double-run is harmless.
  useEffect(() => {
    aliveRef.current = true
    const timers = timersRef.current
    const intervals = intervalsRef.current

    /* F8: computed once, the clock was wrong within minutes — now refreshed every 60s */
    const updateTimeLine = () => {
      const d = new Date()
      const h = d.getHours()
      const m = ('0' + d.getMinutes()).slice(-2)
      const t = (((h + 11) % 12) + 1) + ':' + m + ' ' + (h < 12 ? 'am' : 'pm')
      let msg: string
      if (h >= 5 && h < 12) msg = "It's " + t + ". Your worker would've been earning all night."
      else if (h >= 12 && h < 18) msg = "It's " + t + ". Your worker would be earning right now."
      else msg = "It's " + t + ". Your worker would still be on the clock."
      const timeMsg = document.getElementById('time-msg')
      if (timeMsg) timeMsg.textContent = msg
    }
    updateTimeLine()
    intervals.add(setInterval(updateTimeLine, 60000))

    // Badge positions are computed in px from the object's rendered contain-rect, so they are
    // only correct for the width they were computed at — re-run on resize or they drift off the
    // object the moment the window changes.
    const onResize = () => relayoutRef.current?.()
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      aliveRef.current = false
      timers.forEach(clearTimeout)
      timers.clear()
      intervals.forEach(clearInterval)
      intervals.clear()
    }
  }, [])

  // The loop. Returned as a stable callback so useBootIntro can start it when the intro finishes —
  // the same handoff the mock made (finish() -> setTimeout(runTask)).
  const startLoop = useCallback(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const stage = document.getElementById('scene')
    const frame = document.getElementById('stage-frame')
    const taskbar = document.getElementById('taskbar')
    const machineEl = document.getElementById('task-machine')
    const textEl = document.getElementById('task-text')
    const fillEl = document.getElementById('task-fill')
    const trackEl = document.getElementById('task-track')
    const tagEl = document.getElementById('task-tag')
    const imgs = Array.from(document.querySelectorAll<HTMLElement>('.crx-machine'))
    const badges = Array.from(document.querySelectorAll<HTMLElement>('.crx-badge'))
    if (!stage || !frame || !taskbar || !machineEl || !textEl) return
    if (!fillEl || !trackEl || !tagEl || imgs.length === 0) return

    const fmt = (n: number) => '$' + n.toFixed(2) /* F3a */
    const pay = () => PAYS[Math.floor(Math.random() * PAYS.length)]
    // A ROLL, NOT AN OVERWRITE (Appy, 2026-08-19): the outgoing line is pushed up and out while
    // the new one rises from below, so the strip reads as a sequence advancing. Each beat is its
    // own element for the duration of the swap — writing innerHTML instead would destroy the
    // outgoing node before it could animate (and would wipe the wrapper the clipping depends on,
    // which is exactly how this broke the first time).
    //
    // THE STEP BADGE TRAVELS WITH THE SENTENCE (Appy, 2026-08-20: "shift the steps number too
    // along with text upwards", then "I wanted the whole thing along with texts"). Two earlier
    // versions were wrong in the same way, one worse than the other: first the digit was a plain
    // textContent swap, so it blinked while the line beside it rolled; then the badge became its
    // own clipped viewport, so the digit travelled but its circle stayed put. Both split one piece
    // of information into two events. The badge is now part of the line's own markup — there is no
    // second thing to synchronise, because there is no second thing.
    function roller(host: HTMLElement, cls: string) {
      let live: HTMLElement | null = host.querySelector('.' + cls)
      return (html: string) => {
        if (live && live.innerHTML === html) return
        if (reduced) {
          if (live) live.innerHTML = html
          return
        }
        const next = document.createElement('span')
        next.className = cls + ' in'
        next.innerHTML = html
        const prev = live
        host.appendChild(next)
        live = next
        if (prev) {
          prev.classList.remove('in')
          prev.classList.add('out')
          // outlives the 0.44s animation; `later` is alive-gated so unmount drops it
          later(() => prev.remove(), 600)
        }
      }
    }
    const rollLine = roller(textEl, 'crx-line')
    /** One beat: its step (1, 2, 3 through the lifecycle — intake, approval, work) and its line,
        as a single rolling row. */
    const setLine = (step: number, html: string) =>
      rollLine('<span class="crx-taskbar-step">' + step + '</span>' + html)
    const setFill = (pct: number) => { fillEl.style.width = pct + '%' }

    let mi = 0
    /** Bumped by every showMachine, so its staggered badge reveals can tell whether they are still
        the current machine's when they fire. */
    let showGen = 0

    // Where the object ACTUALLY renders inside the frame. The images are object-fit: contain and
    // bottom-anchored, so for a given frame the object is letterboxed by whichever axis binds —
    // this reproduces that box so badges can be hung off the object's edges rather than the
    // frame's. Without it, a 2.02-ratio car and a 0.73-ratio robot would take identical badge
    // positions and both would look wrong.
    // Mirrors MachineStage's inline framing exactly (see its comment): the box is fit/crop of the
    // frame tall and starts at (1-fit)/2, so the shown portion measures `fit` and is centred. The
    // rect returned is the FULL object box, including any dissolved tail, because badge y is a
    // fraction of the whole cutout — the badge coords were measured against the whole silhouette.
    function objectRect(ratio: number, fit: number, crop: number) {
      const fw = frame!.clientWidth
      const fh = frame!.clientHeight
      const objH = Math.min((fh * fit) / crop, fw / ratio)
      const objW = objH * ratio
      return { left: (fw - objW) / 2, top: (fh * (1 - fit)) / 2, w: objW, h: objH }
    }

    function placeBadges(i: number) {
      const m = MACHINES[i]
      const r = objectRect(m.ratio, m.fit, m.crop)
      badges.forEach((b, k) => {
        const spec = m.badges[k]
        if (!spec) return
        b.style.left = r.left + spec.x * r.w + 'px'
        b.style.top = r.top + spec.y * r.h + 'px'
      })
    }

    function showMachine(i: number) {
      // THREE STATES, so the swap has a direction (see .crx-machine in creators.css). The machine
      // that was on becomes `.out` and keeps travelling the way the queue moves; every other one
      // sits in the default state, waiting off to the right. `.out` is cleared once the transition
      // is over — leaving it would park the image at the wrong end and the next time it came
      // round it would slide in backwards.
      imgs.forEach((el, k) => {
        if (k === i) {
          el.classList.remove('out')
          el.classList.add('on')
        } else if (el.classList.contains('on')) {
          el.classList.remove('on')
          el.classList.add('out')
          later(() => el.classList.remove('out'), 900)
        }
      })
      machineEl!.textContent = MACHINES[i].name
      // Each machine fills as many badge slots as it defines (two or three, by silhouette) and the
      // rest are emptied — `.crx-badge:empty` hides an unused slot so it cannot render as a stray
      // dot. `pay` / `act` decide which of the two treatments it wears.
      const specs = MACHINES[i].badges
      badges.forEach((b, k) => {
        const spec = specs[k]
        b.classList.remove('show')
        b.textContent = spec?.v ?? ''
        b.classList.toggle('pay', spec?.kind === 'pay')
        b.classList.toggle('act', spec?.kind === 'act')
      })
      placeBadges(i)
      relayoutRef.current = () => placeBadges(i)
      // ONE AT A TIME (Appy, 2026-08-20: "can they also appear one by one during the hero image
      // being shown on the stage"). They used to arrive together at +260ms, which put three labels
      // on the object in the same frame — a caption block, not a machine narrating itself. Array
      // order is the reveal order and `pay` is always first, so the amount lands, then what earned
      // it. The last of three is up by ~1.7s, comfortably inside the ~9s a machine holds.
      const gen = ++showGen
      specs.forEach((_, k) => {
        // A pending reveal from the PREVIOUS machine must not fire onto this one: the slots are
        // reused, so it would show the wrong badge early and out of order. The generation counter
        // is the guard — `later` is alive-gated for unmount, but this is a different race.
        later(() => { if (gen === showGen) badges[k]?.classList.add('show') }, 320 + k * 700)
      })
    }

    function runTask() {
      const m = MACHINES[mi]
      showMachine(mi)
      tagEl!.textContent = ''
      tagEl!.className = 'crx-taskbar-tag'
      trackEl!.classList.remove('on')
      setFill(0)
      // ONE GREEN BLINK ON STEP 1 (Appy, 2026-08-20: "very subtle blink"). The strip changes text
      // continuously, so a new TASK beginning looked the same as the next beat of the old one;
      // this is the only signal that the sequence restarted. Remove -> force reflow -> add is what
      // lets a one-shot animation fire again on a node that already ran it; without the reflow the
      // browser coalesces the two class changes and nothing happens from the second task onward.
      if (!reduced) {
        taskbar!.classList.remove('pulse')
        void taskbar!.offsetWidth
        taskbar!.classList.add('pulse')
      }

      // Work arrives, YOU approve it, the machine does it, then it pays (or, on a machine that is
      // not live yet, simply finishes). The approval beat is the trust story, so it is named as
      // yours — the mock's own framing, kept. THE WORDS ARE PER MACHINE (machines.ts beats): a
      // vacuum does not get a task from a brand, and saying so made the whole strip read as
      // filler. Only the shape of the sequence is shared.
      //
      // EVERY BEAT IS TIMED FROM ITS OWN LINE (readMs), so the long ones hold and the short ones
      // move on. Cumulative offsets rather than chained timeouts, so a slow beat cannot push the
      // ones after it out of step with the machine they belong to.
      const tIntake = readMs(m.beats.intake)
      const tApprove = readMs(m.beats.approve)
      const tApproved = readMs(m.beats.approved)

      setLine(1, m.beats.intake + '&hellip;')
      later(() => setLine(2, m.beats.approve + '&hellip;'), tIntake)
      // THE TICK TRAILS THE WORDS (Appy, 2026-08-20). Leading, it pushed the sentence ~16px to
      // the right on exactly the two beats that have one, so the line's left edge jumped twice a
      // task while the step badge beside it stayed put. Trailing, every beat starts flush and the
      // tick reads as the confirmation it is. Not pinned to the far right either: that column
      // belongs to the payout tag, and a mark that far from its own sentence stops confirming it.
      later(
        () => setLine(2, m.beats.approved + ' <span class="tk">' + TICK + '</span>'),
        tIntake + tApprove,
      )
      later(work, tIntake + tApprove + tApproved)

      function work() {
        // NO "Working:" PREFIX (Appy, 2026-08-20). The step badge already says which beat this is
        // and the line is written in the present participle, so the label was saying a third time
        // what the number and the verb had each said once.
        setLine(3, m.beats.work + '&hellip;')
        trackEl!.classList.add('on')
        // The bar is this beat's clock: size the increment so it reaches 100 in about the reading
        // time its own line asks for. The jitter stays, because a perfectly even fill reads as a
        // loading placeholder rather than as work being done.
        const ticks = Math.max(8, Math.round(readMs(m.beats.work) / WORK_TICK))
        const inc = 100 / ticks
        let progress = 0
        const tick = setInterval(() => {
          if (!aliveRef.current) { clearInterval(tick); intervalsRef.current.delete(tick); return }
          progress += inc * (0.7 + Math.random() * 0.6)
          if (progress >= 100) {
            progress = 100
            clearInterval(tick)
            intervalsRef.current.delete(tick)
            trackEl!.classList.remove('on')
            if (m.live) {
              const p = pay()
              setLine(3, 'Paid <span class="tk">' + TICK + '</span>')
              tagEl!.textContent = '+' + fmt(p)
              tagEl!.className = 'crx-taskbar-tag pay'
            } else {
              // No "Soon" tag any more (Appy, 2026-08-20) — the fleet strip below still marks these
              // machines as not-yet-live, so the strip need not repeat it every rotation.
              setLine(3, 'Done <span class="tk">' + TICK + '</span>')
              tagEl!.textContent = ''
              tagEl!.className = 'crx-taskbar-tag'
            }
            later(() => { mi = (mi + 1) % MACHINES.length; runTask() }, reduced ? 400 : HANDOFF)
          }
          setFill(progress)
        }, WORK_TICK)
        intervalsRef.current.add(tick)
      }
    }

    runTask()
  }, [later])

  return startLoop
}
