import { useEffect, useState } from 'react'

// Counts from `start` to `end` once `run` flips true (eased). Used by the legacy
// Creator (views 0→12.4K) and Finance (portfolio 9,850→12,480) scenes.
export function useCountUp(end: number, run: boolean, { duration = 900, start = 0, instant = false }: { duration?: number; start?: number; instant?: boolean } = {}) {
  const [v, setV] = useState(start)
  useEffect(() => {
    if (!run) { setV(start); return }
    if (instant) { setV(end); return } // resting/completed card: jump straight to the final value, don't animate
    let raf = 0
    const t0 = performance.now()
    const ease = (p: number) => 1 - Math.pow(1 - p, 3)
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration)
      setV(Math.round(start + (end - start) * ease(p)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, end, start, duration, instant])
  return v
}
