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
// ONLY LIVE MACHINES PAY. MACHINES[].live gates the payout: the PC completes and credits the pill,
// the vision machines complete and show "Soon". The fleet strip 200px below tags those same
// machines "Soon", and a hero paying out on them would contradict the page a screen later.
//
// DIRECT DOM BY ID, EXACTLY LIKE THE MOCK — deliberately not React state. A progress bar ticking
// every 120ms as state would re-render the page for nothing, and the markup it mutates is static
// (React never re-renders that subtree), so mutation cannot fight reconciliation.
//
// WHAT THE PORT ADDS that the mock didn't need: cleanup. The mock's page never unmounts; this
// component does (and StrictMode mounts twice in dev). Every timer/interval registers into one set
// and an `alive` flag gates every continuation, so unmount genuinely stops the loop.
const PAYS = [0.4, 0.6, 1, 1.5]
const BEATS = { brand: 1000, approvalAsk: 800, approved: 600 }
/** How long a finished task holds on screen before the next machine takes over. */
const HANDOFF = 1500

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
    const setText = (html: string) => { textEl.innerHTML = html }
    const setFill = (pct: number) => { fillEl.style.width = pct + '%' }

    let mi = 0

    // Where the object ACTUALLY renders inside the frame. The images are object-fit: contain and
    // bottom-anchored, so for a given frame the object is letterboxed by whichever axis binds —
    // this reproduces that box so badges can be hung off the object's edges rather than the
    // frame's. Without it, a 2.02-ratio car and a 0.73-ratio robot would take identical badge
    // positions and both would look wrong.
    function objectRect(ratio: number) {
      const fw = frame!.clientWidth
      const fh = frame!.clientHeight
      const objH = Math.min(fh, fw / ratio)
      const objW = objH * ratio
      return { left: (fw - objW) / 2, top: fh - objH, w: objW, h: objH }
    }

    function placeBadges(i: number) {
      const m = MACHINES[i]
      const r = objectRect(m.ratio)
      badges.forEach((b, k) => {
        const spec = m.badges[k]
        if (!spec) return
        b.style.left = r.left + spec.x * r.w + 'px'
        b.style.top = r.top + spec.y * r.h + 'px'
      })
    }

    function showMachine(i: number) {
      imgs.forEach((el, k) => el.classList.toggle('on', k === i))
      machineEl!.textContent = MACHINES[i].name
      // Each machine fills as many badge slots as it defines (two or three, by silhouette) and
      // the rest are emptied — `.crx-badge:empty` hides an unused slot so it cannot render as a
      // stray dot. They fade in a beat after the machine so the object lands first.
      const specs = MACHINES[i].badges
      badges.forEach((b, k) => {
        b.classList.remove('show')
        b.textContent = specs[k]?.v ?? ''
      })
      placeBadges(i)
      relayoutRef.current = () => placeBadges(i)
      later(() => {
        badges.forEach((b, k) => { if (specs[k]) b.classList.add('show') })
      }, 260)
    }

    function runTask() {
      const m = MACHINES[mi]
      showMachine(mi)
      tagEl!.textContent = ''
      tagEl!.className = 'crx-taskbar-tag'
      trackEl!.classList.remove('on')
      setFill(0)

      // Work arrives, YOU approve it, the machine does it, then it pays (or, on a machine that is
      // not live yet, simply finishes). The approval beat is the trust story, so it is named as
      // yours — the mock's own framing, kept. THE WORDS ARE PER MACHINE (MachineStage.beats): a
      // vacuum does not get a task from a brand, and saying so made the whole strip read as
      // filler. Only the shape of the sequence is shared.
      setText(m.beats.intake + '&hellip;')
      later(() => setText(m.beats.approve + '&hellip;'), BEATS.brand)
      later(
        () => setText('<span class="tk">' + TICK + '</span> ' + m.beats.approved),
        BEATS.brand + BEATS.approvalAsk,
      )
      later(work, BEATS.brand + BEATS.approvalAsk + BEATS.approved)

      function work() {
        setText('Working: ' + m.beats.work + '&hellip;')
        trackEl!.classList.add('on')
        let progress = 0
        const tick = setInterval(() => {
          if (!aliveRef.current) { clearInterval(tick); intervalsRef.current.delete(tick); return }
          progress += 4 + Math.random() * 8
          if (progress >= 100) {
            progress = 100
            clearInterval(tick)
            intervalsRef.current.delete(tick)
            trackEl!.classList.remove('on')
            if (m.live) {
              const p = pay()
              setText('<span class="tk">' + TICK + '</span> Paid')
              tagEl!.textContent = '+' + fmt(p)
              tagEl!.className = 'crx-taskbar-tag pay'
            } else {
              setText('<span class="tk">' + TICK + '</span> Done')
              tagEl!.textContent = 'Soon'
              tagEl!.className = 'crx-taskbar-tag soon'
            }
            later(() => { mi = (mi + 1) % MACHINES.length; runTask() }, reduced ? 400 : HANDOFF)
          }
          setFill(progress)
        }, 120)
        intervalsRef.current.add(tick)
      }
    }

    runTask()
  }, [later])

  return startLoop
}
