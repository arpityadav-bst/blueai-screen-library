'use client'

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'

// ONE floating surface, used by BOTH the country dropdown and the two date pickers.
//
// That's deliberate and it's borrowed reasoning, not a guess: blueai-desktop's stylesheet records
// the same call — its calendar was built to mirror `.bai-menu.rowmenu`, the settings model picker,
// because "it is the same overlay behaviour, so it should be the same geometry — not a second,
// similar-looking answer." Two overlays that open 6px below a field and float over the content
// have no business drifting apart in radius, shadow, gap or flip logic, and they will drift the
// moment they're two separate implementations.
//
// Behaviour, matching the reference the designer named:
//   · floats OVER the form — never pushes the fields below it down
//   · 6px below its anchor, flipping above only when there genuinely isn't room below
//   · closes on outside pointer-down and on Escape
//
// The parent must be `position: relative` — this positions against it, and the outside-click test
// treats that same parent as "inside" so the trigger's own click can toggle without a fight.
// Mount it conditionally (`{open && <Popover…>}`) rather than passing an `open` prop: it keeps
// anything date-derived out of the server-rendered output entirely.
export default function Popover({
  onClose,
  align = 'stretch',
  className = '',
  children,
}: {
  onClose: () => void
  /** stretch = span the anchor exactly (dropdowns). left/right = pin one edge (wider calendars). */
  align?: 'stretch' | 'left' | 'right'
  className?: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [above, setAbove] = useState(false)

  // useLayoutEffect, not useEffect: the flip decision needs the measured height, and deciding it
  // after paint would show one frame below-the-field before jumping above it.
  useLayoutEffect(() => {
    const el = ref.current
    const anchor = el?.parentElement
    if (!el || !anchor) return
    const r = anchor.getBoundingClientRect()
    const h = el.offsetHeight
    const GAP = 6
    const roomBelow = window.innerHeight - r.bottom - GAP
    // Only flip if above actually fits — otherwise a tall calendar near the bottom of a short
    // window would flip up and get clipped by the top of the viewport instead.
    setAbove(roomBelow < h && r.top - GAP > h)
  }, [])

  useLayoutEffect(() => {
    function onDown(e: PointerEvent) {
      const anchor = ref.current?.parentElement
      if (anchor && !anchor.contains(e.target as Node)) onClose()
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const edge = align === 'stretch' ? 'left-0 right-0' : align === 'right' ? 'right-0' : 'left-0'

  return (
    <div
      ref={ref}
      // cb-pop carries only the entry animation (creator-brand.css). Padding is left to the
      // consumer: a menu wants 6px, a calendar wants 16px, and putting either here would mean
      // fighting it with a same-property utility whose win depends on source order.
      className={`cb-pop shadow-float absolute z-30 rounded-field border border-stroke-warm bg-white ${edge} ${
        above ? 'bottom-[calc(100%+6px)]' : 'top-[calc(100%+6px)]'
      } ${className}`}
    >
      {children}
    </div>
  )
}
