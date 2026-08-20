import { useEffect, useRef } from 'react'
import { MACHINES } from './machines'

// The MACHINE STAGE's loop — the rotating cutouts and the task strip under them.
//
// MOVED OUT OF THE HERO 2026-08-20 (Appy), into the "It earns while you sleep" section, and it
// lost its floating money/action badges on the way — and, later the same day, its step-number
// badge and its closing "Done" beat, both for the same reason: each restated something the strip
// was already showing, and the beat cost the rotation two seconds a machine.
// The BADGES' machinery went with them rather than being left as scaffolding — the generation
// counter that stopped a previous machine's staggered reveal firing onto the next one, the
// per-machine contain-rect maths, and the resize listener that kept those px positions honest.
// All three existed only to place a badge.
//
// IT STARTS WHEN THE SECTION IS SEEN, not when the page loads — the difference between arriving to
// a machine taking its first job and arriving mid-payout on whichever machine the clock happened
// to land on. In the hero it could start at reveal because the hero IS the first thing you see;
// two screens down that is no longer true.
//
// DIRECT DOM BY ID, deliberately not React state: a progress bar ticking every 130ms as state
// would re-render the page for nothing, and the markup it mutates is static (React never
// re-renders that subtree), so mutation cannot fight reconciliation.
const PAYS = [0.4, 0.6, 1, 1.5]
/** How long a beat holds, from the length of the line it is showing. 48ms a character is
    deliberately slower than reading speed: this text sits over a moving image and is glanced at,
    not studied. The floor keeps two-word confirmations from flashing past; the ceiling keeps the
    sequence from stalling if a line is ever written long. */
const readMs = (line: string) => Math.min(3600, Math.max(1300, 800 + line.length * 48))
/** How long a finished task holds before the next machine takes over. 1200, was 2100: the "Done"
    beat that used to follow the work line is gone (Appy, 2026-08-20: "so the rotation becomes a
    bit faster"), so this hold is now the whole ending rather than a pause after one. */
const HANDOFF = 1200
/** Progress-bar tick. The INCREMENT is derived per machine from readMs(work) so the bar finishes
    exactly when its line has had its reading time. */
const WORK_TICK = 130

const TICK =
  '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
  'stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M20 6 9 17l-5-5"/></svg>'

export default function useMachineFx() {
  const aliveRef = useRef(true)

  useEffect(() => {
    aliveRef.current = true
    const timers = new Set<ReturnType<typeof setTimeout>>()
    const intervals = new Set<ReturnType<typeof setInterval>>()
    const later = (fn: () => void, ms: number) => {
      const id = setTimeout(() => {
        timers.delete(id)
        if (aliveRef.current) fn()
      }, ms)
      timers.add(id)
    }

    const stage = document.getElementById('machine-stage')
    if (!stage) return

    let started = false
    function start() {
      if (started) return
      started = true

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const taskbar = document.getElementById('taskbar')
      const machineEl = document.getElementById('task-machine')
      const textEl = document.getElementById('task-text')
      const fillEl = document.getElementById('task-fill')
      const trackEl = document.getElementById('task-track')
      const tagEl = document.getElementById('task-tag')
      const imgs = Array.from(document.querySelectorAll<HTMLElement>('.crx-machine'))
      if (!taskbar || !machineEl || !textEl || !fillEl || !trackEl || !tagEl || !imgs.length) return

      const fmt = (n: number) => '$' + n.toFixed(2)
      const pay = () => PAYS[Math.floor(Math.random() * PAYS.length)]

      // A ROLL, NOT AN OVERWRITE: the outgoing line is pushed up and out while the new one rises
      // from below, so the strip reads as a sequence advancing. Each beat is its own element for
      // the duration of the swap — writing innerHTML instead would destroy the outgoing node
      // before it could animate, and would wipe the wrapper the clipping depends on.
      let live: HTMLElement | null = textEl.querySelector('.crx-line')
      const setLine = (html: string) => {
        if (live && live.innerHTML === html) return
        if (reduced) {
          if (live) live.innerHTML = html
          return
        }
        const next = document.createElement('span')
        next.className = 'crx-line in'
        next.innerHTML = html
        const prev = live
        textEl!.appendChild(next)
        live = next
        if (prev) {
          prev.classList.remove('in')
          prev.classList.add('out')
          later(() => prev.remove(), 600) // outlives the 0.44s animation
        }
      }
      const setFill = (pct: number) => { fillEl!.style.width = pct + '%' }

      let mi = 0

      function showMachine(i: number) {
        // THREE STATES, so the swap has a direction (see .crx-machine in creators.css). The
        // machine that was on becomes `.out` and keeps travelling the way the queue moves; `.out`
        // is cleared once the transition is over, or the image would be parked at the wrong end
        // and slide in backwards next time round.
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
      }

      function runTask() {
        const m = MACHINES[mi]
        showMachine(mi)
        tagEl!.textContent = ''
        tagEl!.className = 'crx-taskbar-tag'
        trackEl!.classList.remove('on')
        setFill(0)
        // ONE GREEN BLINK WHEN A TASK STARTS — the strip changes text continuously, so a new task
        // beginning looked the same as the next beat of the old one. Remove -> force reflow -> add is what
        // lets a one-shot animation fire again on a node that already ran it.
        if (!reduced) {
          taskbar!.classList.remove('pulse')
          void taskbar!.offsetWidth
          taskbar!.classList.add('pulse')
        }

        // Work arrives, YOU approve it, the machine does it, then it pays (or, on a machine that
        // is not live yet, simply finishes). Every beat is timed from its own line, and the
        // offsets are cumulative rather than chained so a slow beat cannot push the ones after it
        // out of step with the machine they belong to.
        const tIntake = readMs(m.beats.intake)
        const tApprove = readMs(m.beats.approve)
        const tApproved = readMs(m.beats.approved)

        setLine(m.beats.intake + '&hellip;')
        later(() => setLine(m.beats.approve + '&hellip;'), tIntake)
        later(
          () => setLine(m.beats.approved + ' <span class="tk">' + TICK + '</span>'),
          tIntake + tApprove,
        )
        later(work, tIntake + tApprove + tApproved)

        function work() {
          setLine(m.beats.work + '&hellip;')
          trackEl!.classList.add('on')
          // The bar is this beat's clock: size the increment so it reaches 100 in about the
          // reading time its own line asks for. The jitter stays, because a perfectly even fill
          // reads as a loading placeholder rather than as work being done.
          const ticks = Math.max(8, Math.round(readMs(m.beats.work) / WORK_TICK))
          const inc = 100 / ticks
          let progress = 0
          const tick = setInterval(() => {
            if (!aliveRef.current) { clearInterval(tick); intervals.delete(tick); return }
            progress += inc * (0.7 + Math.random() * 0.6)
            if (progress >= 100) {
              progress = 100
              clearInterval(tick)
              intervals.delete(tick)
              trackEl!.classList.remove('on')
              // NO CLOSING "Done" / "Paid" LINE (Appy, 2026-08-20). It was a fifth beat that said
              // what the filled bar had just finished saying, and it cost the rotation about two
              // seconds a machine. The work line stays up and the payout simply lands beside it —
              // which is also the more honest picture: the money arrives while the job is being
              // finished, not as a separate ceremony afterwards.
              if (m.live) {
                tagEl!.textContent = '+' + fmt(pay())
                tagEl!.className = 'crx-taskbar-tag pay'
              }
              later(() => { mi = (mi + 1) % MACHINES.length; runTask() }, reduced ? 400 : HANDOFF)
            }
            setFill(progress)
          }, WORK_TICK)
          intervals.add(tick)
        }
      }

      runTask()
    }

    // Fires once, then stops observing. rootMargin pulls the trigger slightly early so the first
    // line has begun by the time the strip is actually readable.
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        start()
      },
      { rootMargin: '0px 0px -15% 0px', threshold: 0.15 },
    )
    io.observe(stage)

    return () => {
      aliveRef.current = false
      io.disconnect()
      timers.forEach(clearTimeout)
      intervals.forEach(clearInterval)
    }
  }, [])
}
