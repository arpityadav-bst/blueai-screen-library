import { useEffect, useState } from 'react'

// Types `text` out character-by-character on mount. Used by the agent scenes for the
// search query / prompt / question typing. Resets when the scene remounts (re-activates).
export function useTypewriter(text: string, { startDelay = 250, speed = 42 }: { startDelay?: number; speed?: number } = {}) {
  const [out, setOut] = useState('')
  useEffect(() => {
    let i = 0
    let cancelled = false
    let timer: ReturnType<typeof setTimeout>
    const step = () => {
      if (cancelled) return
      i++
      setOut(text.slice(0, i))
      if (i < text.length) timer = setTimeout(step, speed)
    }
    const start = setTimeout(step, startDelay)
    return () => { cancelled = true; clearTimeout(start); clearTimeout(timer) }
  }, [text, startDelay, speed])
  return out
}
