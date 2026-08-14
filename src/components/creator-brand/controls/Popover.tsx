'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

// ONE floating surface, used by BOTH the country/category dropdowns and the date pickers.
//
// That's borrowed reasoning, not a guess: blueai-desktop's stylesheet records the same call — its
// calendar was built to mirror `.bai-menu.rowmenu`, the settings model picker, because "it is the
// same overlay behaviour, so it should be the same geometry — not a second, similar-looking
// answer." Two overlays that open 6px below a field have no business drifting apart in radius,
// shadow, gap or flip logic, and they will the moment they're two implementations.
//
// IT PORTALS TO document.body AND POSITIONS FIXED. This was `position: absolute` inside the
// anchor's own wrapper, which is correct right up until an ancestor clips — and one did: Modal's
// panel carries `overflow-hidden` so the band variant's grid crops to its rounded corners, and
// that cropped the category dropdown off at the dialog's bottom edge.
//
// Widening or removing that clip was the wrong tool, the same way it was wrong for the step-card
// numeral: it moves the boundary instead of removing it, and the next scroll container or clipped
// ancestor brings the bug straight back. blueai-desktop hit this exact wall and its comment says
// so — its picker "PORTALS to .bai-ui … because the calendar is taller than the space on either
// side of its field inside .bai-subpane-body, so it cannot inherit its position from the field
// group the way a normal `top: calc(100% + 6px)` dropdown does."
//
// The cost of portaling is that a fixed element no longer travels with the page, so this
// repositions on scroll and resize rather than closing — the dialog overlay is itself a scroll
// container, and a dropdown that detached from its field on the first scroll would be worse than
// the clip it replaced.

type Align = 'stretch' | 'left' | 'right'

/** Why the popover is closing. Escape should hand focus back to the trigger; an outside click
 *  must NOT — the reader just clicked something else and yanking focus back would fight them. */
export type CloseReason = 'escape' | 'outside'

const GAP = 6

export default function Popover({
  anchor,
  onClose,
  align = 'stretch',
  className = '',
  children,
}: {
  /** The element to position against — the trigger itself, not its wrapper. */
  anchor: React.RefObject<HTMLElement | null>
  onClose: (reason: CloseReason) => void
  /** stretch = match the anchor's width exactly (dropdowns). left/right = pin one edge (calendars). */
  align?: Align
  className?: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  // null until measured. Rendered `visibility: hidden` until then, so the measure-then-place pass
  // never shows a frame at the wrong position.
  const [pos, setPos] = useState<{ top: number; left: number; width?: number; maxHeight?: number } | null>(null)

  const place = useCallback(() => {
    const el = ref.current
    const a = anchor.current
    if (!el || !a) return
    const r = a.getBoundingClientRect()
    // Width is written imperatively BEFORE reading height, because height depends on it — a list
    // measured at its intrinsic width would report the wrong number of wrapped lines.
    if (align === 'stretch') el.style.width = `${r.width}px`
    const h = el.offsetHeight
    const w = el.offsetWidth
    // Only flip up if up actually fits — otherwise a tall calendar near the bottom of a short
    // window flips and gets clipped by the TOP of the viewport instead.
    const above = window.innerHeight - r.bottom - GAP < h && r.top - GAP > h
    // CLAMPED TO THE VIEWPORT, both axes. This element is position:fixed, so anything placed outside
    // the viewport is not merely awkward — it is unreachable, because there is nothing to scroll.
    // Measured before this: at a 320px width the end-date field opens its 340px calendar right-aligned
    // at left = -4px, i.e. starting off the left edge of the screen. The start-date field cleared by
    // 12px, which is one padding change away from the same bug.
    // maxHeight covers the other half: in landscape on a phone neither above nor below fits a ~295px
    // calendar, so it rendered below and ran off the bottom with no way to reach the last week.
    const M = 8
    const raw = align === 'right' ? r.right - w : r.left
    const left = Math.min(Math.max(M, raw), Math.max(M, window.innerWidth - w - M))
    const room = above ? r.top - GAP : window.innerHeight - r.bottom - GAP
    setPos({
      top: above ? r.top - GAP - h : r.bottom + GAP,
      left,
      width: align === 'stretch' ? r.width : undefined,
      maxHeight: Math.max(180, room - M),
    })
  }, [anchor, align])

  // Layout, not effect: this runs before paint, so there's no flash at the pre-measurement spot.
  useLayoutEffect(place, [place])

  // Initial focus belongs HERE, not in the consumer, because of the measure-then-place pass: on the
  // first render this popover is `visibility: hidden`, and .focus() on a hidden subtree is a no-op.
  // A consumer focusing its own selected row on open therefore silently did nothing. Same
  // `data-autofocus` convention Modal.tsx uses, so there's one way to say "start here" rather than
  // two. Keyed on placed-ness (a boolean), never on `pos` itself — pos changes on every scroll
  // reposition, and re-stealing focus mid-scroll would be worse than not focusing at all.
  const placed = pos !== null
  useEffect(() => {
    if (placed) ref.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus()
  }, [placed])

  useEffect(() => {
    const onMove = () => place()
    // capture:true — the scroll that matters is usually an ANCESTOR's (the dialog overlay), and
    // scroll events don't bubble.
    window.addEventListener('scroll', onMove, true)
    window.addEventListener('resize', onMove)
    return () => {
      window.removeEventListener('scroll', onMove, true)
      window.removeEventListener('resize', onMove)
    }
  }, [place])

  useEffect(() => {
    function onDown(e: PointerEvent) {
      const t = e.target as Node
      // The anchor counts as inside, so the trigger's own click toggles instead of
      // closing-then-reopening.
      if (!ref.current?.contains(t) && !anchor.current?.contains(t)) onClose('outside')
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose('escape')
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [anchor, onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    // cb-scope has to be re-established: the portal lands outside the layout's own .cb-scope, and
    // the scoped rules (.cb-field-affix's placeholder weight, the tabular figures) would silently
    // stop applying without it.
    <div className="cb-scope">
      <div
        ref={ref}
        style={{
          position: 'fixed',
          top: pos?.top ?? 0,
          left: pos?.left ?? 0,
          width: pos?.width,
          visibility: pos ? 'visible' : 'hidden',
        }}
        // z-105: above the dialog (100) it may be opened inside, below the design-handoff state
        // toggler (110), which outranks the prototype's own chrome by design.
        // Padding is left to the consumer — a menu wants 6px and a calendar 16px, and putting
        // either here would mean fighting it with a same-property utility whose win depends on
        // source order.
        className={`cb-pop shadow-float z-[105] rounded-field border border-divider bg-white ${className}`}
      >
        {children}
      </div>
    </div>,
    document.body
  )
}
