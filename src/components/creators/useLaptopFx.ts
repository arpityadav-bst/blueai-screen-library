import { useCallback, useEffect, useRef } from 'react'

// The HERO's task loop, running inside the CSS desk-and-laptop scene (HomeMain's .scene) — the
// mock's own script (alt-copy.html), ported as a hook.
//
// RESTORED 2026-08-20. This scene was replaced on 2026-08-19 by the rotating photoreal machines,
// and Appy has now moved those down to the "It earns while you sleep" section and asked for the
// CSS laptop back in the hero. Recovered from fef5388 rather than rewritten, so the mock's own
// pacing and copy come back exactly as they were, including the earnings pill, credit() and
// flyChip() — those were briefly left out of the restore (the pill had been removed on
// 2026-08-19) and Appy asked for them back the same day: "bring back that white rectangle...
// which was getting the money added to it". Money is now told twice, and deliberately so: each
// completed row carries its own "+$X", and the chip that flies out of it makes the running total
// visibly the sum of those rows rather than a number that just goes up.
//
// THE LOOP IS THE PM BRANCH'S, not a blend of it and this file's earlier version: whole-dollar
// pays from a base of 118, its faster beats, and its generic "Working on it" work line. Two
// behaviours are deliberately NOT theirs, and both are Appy's own later instructions rather than
// my preference — the scene enters first in the staged entry (the intro's agent docks into
// #lap-screen and cannot land in something that has not arrived), and a completed task goes
// straight to the stack instead of pausing on an interim "Done" row, which he cut for speed.
//
// DIRECT DOM BY ID, EXACTLY LIKE THE MOCK — deliberately not React state. A progress bar ticking
// every 120ms as state would re-render the page for nothing, and the markup it mutates is static
// (React never re-renders that subtree), so mutation cannot fight reconciliation.
//
// WHAT THE PORT ADDS that the mock didn't need: cleanup. The mock's page never unmounts; this
// component does (and StrictMode mounts twice in dev). Every timer/interval registers into one set
// and an `alive` flag gates every continuation, so unmount genuinely stops the loop.
/* WHOLE DOLLARS, BASE 118 — the mock's own demo figures, and the PM branch's, which is where the
   scene markup now comes from: it ships `$118` as the pill's static value, so a loop paying in
   cents would tick 118 -> 118.60 on the first payout and read as a bug. The two have to agree,
   and the markup is the half that was taken verbatim. */
const PAYS = [2, 3, 5, 8, 12, 20, 30]
/* the PM branch's pacing too — a third quicker than this file's, and the hero is the one place
   on the page where the loop is competing with a headline for attention */
const BEATS = { brand: 1000, approvalAsk: 800, approved: 600 }

/* F27: SVG check instead of the &#10003; font glyph (stroke currentColor -> .tick's mint) */
const TICK =
  '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
  'stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M20 6 9 17l-5-5"/></svg>'

export default function useLaptopFx() {
  const aliveRef = useRef(true)
  const timersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set())
  const intervalsRef = useRef<Set<ReturnType<typeof setInterval>>>(new Set())
  /** The running total behind the pill. A ref, not state: the pill is mutated by id like the rest
      of the scene, so re-rendering the page on every payout would buy nothing. */
  const earnedRef = useRef(118)

  const later = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      timersRef.current.delete(id)
      if (aliveRef.current) fn()
    }, ms)
    timersRef.current.add(id)
  }, [])

  // Time-aware line — the mock ran this at parse time; here it runs on mount. Idempotent, so
  // StrictMode's double-run is harmless. It lives with this hook rather than the machine one
  // because this is the hook the homepage always mounts.
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

    return () => {
      aliveRef.current = false
      timers.forEach(clearTimeout)
      timers.clear()
      intervals.forEach(clearInterval)
      intervals.clear()
    }
  }, [])

  // Returned as a stable callback so useBootIntro can start it when the intro finishes — the same
  // handoff the mock made (finish() -> setTimeout(runTask)).
  const startLoop = useCallback(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const workingEl = document.getElementById('working')
    const stackEl = document.getElementById('stack')
    const amountEl = document.getElementById('amount')
    const earningsEl = document.getElementById('earnings')
    const scene = document.getElementById('scene')
    // Every one of these is required, and that is deliberate rather than defensive: a missing
    // #earnings means the pill was taken out again, and a loop that quietly kept paying into
    // nothing would hide that instead of surfacing it.
    if (!workingEl || !stackEl || !amountEl || !earningsEl || !scene) return

    const fmt = (n: number) => '$' + n
    const pay = () => PAYS[Math.floor(Math.random() * PAYS.length)]

    function doneRow(p: number) {
      const el = document.createElement('div')
      el.className = 'task enter'
      el.innerHTML =
        '<span class="lbl"><span class="tick">' + TICK + '</span> Paid</span>' +
        '<span class="pay">+' + fmt(p) + '</span>'
      return el
    }

    // The chip that flies from the completed row into the pill. Skipped entirely under reduced
    // motion — it is pure travel, and the credit still lands without it.
    function flyChip(fromEl: HTMLElement, p: number) {
      if (reduced) return
      const chip = document.createElement('span')
      chip.className = 'chip'
      chip.textContent = '+' + fmt(p)
      const sceneBox = scene!.getBoundingClientRect()
      /* F6: measured rects are post-transform, but left/top/translate apply PRE-transform inside
         the scaled scene — divide by the scene's own scale or the chips land at 0.62x their
         offsets on mobile, where .scene carries transform: scale(0.62). */
      const scale = sceneBox.width / scene!.offsetWidth
      const from = fromEl.getBoundingClientRect()
      const to = earningsEl!.getBoundingClientRect()
      chip.style.left = (from.right - sceneBox.left - 70) / scale + 'px'
      chip.style.top = (from.top - sceneBox.top) / scale + 'px'
      scene!.appendChild(chip)
      requestAnimationFrame(() => {
        const dx = ((to.left - sceneBox.left + 40) - (from.right - sceneBox.left - 70)) / scale
        const dy = ((to.top - sceneBox.top + 10) - (from.top - sceneBox.top)) / scale
        chip.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(0.7)'
        chip.style.opacity = '0'
      })
      later(() => chip.remove(), 800)
    }

    // Remove -> force reflow -> add, so the bump fires again on a node that already ran it.
    const credit = (p: number) => {
      earnedRef.current += p
      amountEl!.textContent = fmt(earnedRef.current)
      earningsEl!.classList.remove('bump')
      void (earningsEl as HTMLElement).offsetWidth
      earningsEl!.classList.add('bump')
    }

    function runTask() {
      const row = document.createElement('div')
      row.className = 'task working'
      workingEl!.innerHTML = ''
      workingEl!.appendChild(row)

      const label = (html: string) => { row.innerHTML = '<span class="lbl">' + html + '</span>' }

      label('Getting a task from a brand&hellip;')
      later(() => label('Sent for your approval&hellip;'), BEATS.brand)
      later(() => label('<span class="tick">' + TICK + '</span> You approved it'), BEATS.brand + BEATS.approvalAsk)
      later(work, BEATS.brand + BEATS.approvalAsk + BEATS.approved)

      function work() {
        // "Working on it", not a named task — the PM branch's line, and this file's whole hero
        // now comes from there. Four rotating task names were my substitution and they were the
        // wrong call twice over: the strip already says which machine and what it earned, so the
        // name was the one part carrying no information, and a generic line lets the progress bar
        // be the thing you read.
        row.innerHTML =
          '<span class="lbl">Working on it&hellip;</span>' +
          '<span class="bar"><i></i></span>'
        const bar = row.querySelector('.bar > i') as HTMLElement
        let progress = 0
        const tick = setInterval(() => {
          if (!aliveRef.current) { clearInterval(tick); intervalsRef.current.delete(tick); return }
          progress += 4 + Math.random() * 8
          if (progress >= 100) {
            progress = 100
            clearInterval(tick)
            intervalsRef.current.delete(tick)
            const p = pay()
            // STRAIGHT TO THE STACK. The working row used to become "Done +$X" and sit there for
            // half a second before the identical "Paid +$X" row slid into the stack beneath it —
            // the same fact, stated twice, half a second apart (Appy, 2026-08-20: remove the Done
            // step "so the rotation becomes a bit faster").
            row.remove()
            later(() => {
              workingEl!.innerHTML = ''
              const done = doneRow(p)
              stackEl!.prepend(done)
              while (stackEl!.children.length > 3) stackEl!.removeChild(stackEl!.lastChild!)
              // The chip leaves the row first and the total ticks up as it arrives — crediting on
              // the same frame would move the pill before anything visibly reached it.
              flyChip(done, p)
              later(() => credit(p), reduced ? 0 : 550)
              later(runTask, 300)
            }, reduced ? 0 : 120)
          }
          bar.style.width = progress + '%'
        }, 120)
        intervalsRef.current.add(tick)
      }
    }

    runTask()
  }, [later])

  return startLoop
}
