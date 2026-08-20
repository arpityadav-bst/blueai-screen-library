import { useCallback, useEffect, useRef } from 'react'

// The mock's page script (alt-copy.html — the canonical variant), ported as a hook: the perpetual
// task lifecycle inside the laptop screen, the earnings credit + chip flight, and the time-aware
// dock line. The mock also had a mini ticker that reappeared bottom-right once the hero's earnings
// pill scrolled away — removed (Appy, 2026-08-19), along with the IntersectionObserver and
// mini-amount-element plumbing that drove it; the dock is just the time line now.
//
// DIRECT DOM BY ID, EXACTLY LIKE THE MOCK — deliberately not React state. The task rows are
// transient nodes created/destroyed several times a second in a loop; modelling that as state would
// re-render the whole page per tick for zero benefit, and every port-drift risk lives in the
// rewrite, not the transplant. The markup these ids point at (HomeMain/HomeOverlay) is static —
// React never re-renders it — so mutation cannot fight reconciliation.
//
// WHAT THE PORT ADDS that the mock didn't need: cleanup. The mock's page never unmounts; this
// component does (and React StrictMode mounts twice in dev). Every timer/interval registers into
// one set and an `alive` flag gates every continuation, so unmount genuinely stops the loop.
//
// One full task lifecycle per loop (the mock's own comment): a brand hands the task over, YOU
// approve it, the worker does it, then the pay lands in the stack and flies to the balance. The
// approval beat is the trust story, so it is named as yours.
//
// MONEY MODEL (F3a): cents-level per-task credits on a small base, so the demo sums plausibly
// toward the copy's flat "$30 every month" instead of contradicting it.
const PAYS = [0.4, 0.6, 1, 1.5]
const BEATS = { brand: 1000, approvalAsk: 800, approved: 600 }

/* F15: name the work — the real watch/like/comment job shape, one per cycle */
const TASKS = [
  'Watch — 3-min product demo',
  'Like + comment — launch video',
  'Watch — creator collab teaser',
  'Comment — Q&A livestream clip',
]

/* F27: SVG check instead of the &#10003; font glyph (stroke currentColor → .tick's mint) */
const TICK =
  '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
  'stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M20 6 9 17l-5-5"/></svg>'

export default function useHomeFx() {
  const aliveRef = useRef(true)
  const timersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set())
  const intervalsRef = useRef<Set<ReturnType<typeof setInterval>>>(new Set())
  const earnedRef = useRef(18) /* F3a */

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

    return () => {
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
    const workingEl = document.getElementById('working')
    const stackEl = document.getElementById('stack')
    const amountEl = document.getElementById('amount')
    const earningsEl = document.getElementById('earnings')
    const scene = document.getElementById('scene')
    if (!workingEl || !stackEl || !amountEl || !earningsEl || !scene) return

    const fmt = (n: number) => '$' + n.toFixed(2) /* F3a */
    const pay = () => PAYS[Math.floor(Math.random() * PAYS.length)]

    function doneRow(p: number) {
      const el = document.createElement('div')
      el.className = 'task enter'
      el.innerHTML =
        '<span class="lbl"><span class="tick">' + TICK + '</span> Paid</span>' +
        '<span class="pay">+' + fmt(p) + '</span>'
      return el
    }

    function flyChip(fromEl: HTMLElement, p: number) {
      if (reduced) return
      const chip = document.createElement('span')
      chip.className = 'chip'
      chip.textContent = '+' + fmt(p)
      const sceneBox = scene!.getBoundingClientRect()
      /* F6: measured rects are post-transform but left/top/translate apply pre-transform inside
         the scaled scene — divide by the scene's own scale or chips land at 0.62× their offsets */
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

      const task = TASKS[Math.floor(Math.random() * TASKS.length)] /* F15 */
      const label = (html: string) => { row.innerHTML = '<span class="lbl">' + html + '</span>' }

      label('Getting a task from a brand&hellip;')
      later(() => label('Sent for your approval&hellip;'), BEATS.brand)
      later(() => label('<span class="tick">' + TICK + '</span> You approved'), BEATS.brand + BEATS.approvalAsk)
      later(work, BEATS.brand + BEATS.approvalAsk + BEATS.approved)

      function work() {
        row.innerHTML =
          '<span class="lbl">Working: ' + task + '&hellip;</span>' +
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
            row.className = 'task'
            row.innerHTML =
              '<span class="lbl"><span class="tick">' + TICK + '</span> Done</span>' +
              '<span class="pay">+' + fmt(p) + '</span>'
            later(() => {
              workingEl!.innerHTML = ''
              const done = doneRow(p)
              stackEl!.prepend(done)
              while (stackEl!.children.length > 3) stackEl!.removeChild(stackEl!.lastChild!)
              flyChip(done, p)
              later(() => credit(p), reduced ? 0 : 550)
              later(runTask, 300)
            }, reduced ? 0 : 500)
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
