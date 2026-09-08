'use client'

import { useCallback, useEffect, useRef } from 'react'

// THE PRODUCT WINDOW'S LOOP (2026-09-08) — the same story useLaptopFx tells, played on a timeline
// instead of a task strip. ProductWindow.tsx holds the markup; this holds every behaviour.
//
// NOTHING HERE WRITES COPY any more (2026-09-08). It used to rewrite a status line per beat, which
// restated the timeline row directly beneath it; that line is now the campaign's own description and
// is static. The loop only moves states, which is also what makes the window's height constant.
//
// IT IS THE OLD BEATS, RE-STAGED, not a new script. The desk scene already narrates work found ->
// sent for approval -> approved -> working -> paid, and that sequence is the page's argument; what
// was wrong with it was the venue, a three-line strip inside a drawn laptop. Each beat is now a row
// on an activity timeline that fills in as it happens, which is how the real dashboard shows the
// same thing.
//
// ONE THING GENUINELY CHANGES, and it is the reason for the whole exercise: the payout lands INSIDE
// the product. The desk scene flies its chip to a pill floating beside the laptop; here it flies to
// the Earned figure in the window's own header.
//
// DIRECT DOM BY ID, exactly as useLaptopFx does, and for the same reason: the progress bar ticks
// every 120ms and React never re-renders this subtree, so mutation cannot fight reconciliation.
//
// CLEANUP IS THE PART A PORT ADDS. Every timer and interval registers into one set and an `alive`
// flag gates every continuation, so unmount really stops the loop — StrictMode mounts twice in dev,
// and signing in unmounts the whole homepage.

/** Whole dollars, the desk scene's own demo pays (PAYS in useLaptopFx) so both stages agree. */
const PAYS = [2, 3, 5, 8, 12, 20, 30]

/** Cumulative offsets from the top of a cycle. The gaps are useLaptopFx's, slowed a touch: a
 *  timeline row is read, where a strip line was glanced at. */
const AT = { found: 0, approved: 950, running: 1800, paid: 4600, reset: 6100 }
const FILL_MS = 2500        // how long `running` takes to fill, inside its own 2800ms slot
const FILL_TICK = 120

export default function useProductFx() {
  const aliveRef = useRef(true)
  const timersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set())
  const intervalsRef = useRef<Set<ReturnType<typeof setInterval>>>(new Set())
  /** Base-118, the figure the desk scene starts from — the two stages must not disagree. */
  const earnedRef = useRef(118)

  const later = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      timersRef.current.delete(id)
      if (aliveRef.current) fn()
    }, ms)
    timersRef.current.add(id)
    return id
  }, [])

  useEffect(() => {
    const timers = timersRef.current
    const intervals = intervalsRef.current
    aliveRef.current = true
    return () => {
      aliveRef.current = false
      timers.forEach(clearTimeout)
      timers.clear()
      intervals.forEach(clearInterval)
      intervals.clear()
    }
  }, [])

  // Returned as a stable callback so useBootIntro can start it when the intro finishes — the same
  // handoff useLaptopFx makes, so the two stages are interchangeable to their caller.
  const startLoop = useCallback(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const scene = document.getElementById('scene')
    const stepsEl = document.getElementById('pw-steps')
    const amountEl = document.getElementById('pw-amount')
    const earnedEl = document.getElementById('pw-earned')
    // Required rather than optional, deliberately: a missing #pw-earned means the figure was taken
    // out again, and a loop that quietly kept paying into nothing would hide that instead of
    // surfacing it. It is also what makes this hook a no-op when the DESK stage is the one mounted,
    // since HomepageView calls both hooks and only hands one of them to the intro.
    if (!scene || !stepsEl || !amountEl || !earnedEl) return

    const steps = Array.from(stepsEl.querySelectorAll<HTMLElement>('.pw-step'))
    const fill = stepsEl.querySelector<HTMLElement>('.pw-prog > i')
    if (steps.length !== 4 || !fill) return

    const fmt = (n: number) => '$' + n
    const mark = (i: number, state: '' | 'live' | 'done') => {
      steps[i].classList.remove('live', 'done')
      if (state) steps[i].classList.add(state)
    }

    /** The chip that flies from the paid row into the Earned figure. Pure travel, so reduced motion
     *  skips it outright — the credit still lands, which is the part that carries information. */
    function flyChip(p: number) {
      if (reduced) return
      const chip = document.createElement('span')
      chip.className = 'pw-chip'
      chip.textContent = '+' + fmt(p)
      const box = scene!.getBoundingClientRect()
      // Measured rects are POST-transform, but left/top and translate apply PRE-transform inside a
      // scaled scene — divide by the scene's own scale or the chip lands short wherever .pw-scene
      // carries a transform (it does, below 1000px). The desk scene's F6 fix, same trap.
      const scale = box.width / scene!.offsetWidth
      const from = steps[3].getBoundingClientRect()
      const to = earnedEl!.getBoundingClientRect()
      chip.style.left = (from.left - box.left + 26) / scale + 'px'
      chip.style.top = (from.top - box.top) / scale + 'px'
      scene!.appendChild(chip)
      requestAnimationFrame(() => {
        chip.style.transform =
          'translate(' + ((to.left - from.left - 26) / scale) + 'px,' +
          ((to.top - from.top) / scale) + 'px) scale(0.7)'
        chip.style.opacity = '0'
      })
      later(() => chip.remove(), 800)
    }

    // Remove -> force reflow -> add, so the bump fires again on a node that already ran it.
    const credit = (p: number) => {
      earnedRef.current += p
      amountEl!.textContent = fmt(earnedRef.current)
      earnedEl!.classList.remove('bump')
      void earnedEl!.offsetWidth
      earnedEl!.classList.add('bump')
    }

    function runProgress() {
      fill!.style.transition = 'none'
      fill!.style.width = '0%'
      if (reduced) {
        // No animation, but the bar must not sit empty through the beat that is about progress —
        // it arrives full, which states the same fact without moving.
        later(() => { fill!.style.width = '100%' }, 60)
        return
      }
      void fill!.offsetWidth
      fill!.style.transition = 'width ' + FILL_TICK + 'ms linear'
      let pct = 0
      const id = setInterval(() => {
        if (!aliveRef.current) return
        pct = Math.min(100, pct + (100 * FILL_TICK) / FILL_MS)
        fill!.style.width = pct + '%'
        if (pct >= 100) {
          clearInterval(id)
          intervalsRef.current.delete(id)
        }
      }, FILL_TICK)
      intervalsRef.current.add(id)
    }

    function cycle() {
      steps.forEach((_, i) => mark(i, ''))
      mark(0, 'live')

      later(() => { mark(0, 'done'); mark(1, 'live') }, AT.approved)
      later(() => { mark(1, 'done'); mark(2, 'live'); runProgress() }, AT.running)
      later(() => {
        const p = PAYS[Math.floor(Math.random() * PAYS.length)]
        mark(2, 'done')
        mark(3, 'done')
        flyChip(p)
        // The credit lands as the chip arrives, not when it leaves — the number going up before
        // the money gets there reads as two separate events.
        later(() => credit(p), reduced ? 0 : 620)
      }, AT.paid)
      later(cycle, AT.reset)
    }

    cycle()
  }, [later])

  return startLoop
}
