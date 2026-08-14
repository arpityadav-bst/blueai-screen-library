'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

// Subtle 3D tilt toward the cursor — tracks the mouse ANYWHERE on the page (window-level
// listener), not just while hovering the element, so the image always feels alive. The
// tilt angle is computed from the cursor's position relative to the element's center and
// clamped, so far-away cursor positions just hold the max tilt rather than over-rotating.
export default function TiltImage({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 })

  useEffect(() => {
    // NO TILT ON TOUCH. There is no pointer to follow, but a tap still fires a COMPATIBILITY mousemove
    // on both Android and iOS — so the art lurched up to 6 degrees and STAYED there: there is no
    // mouseleave on a touch device and no second move to bring it back. Bailing also avoids building a
    // 3D rendering context around a full-size hero image for a transform that never changes.
    if (window.matchMedia('(hover: none), (pointer: coarse), (prefers-reduced-motion: reduce)').matches) return

    function onMove(e: MouseEvent) {
      const rect = ref.current?.getBoundingClientRect()
      if (!rect) return
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      // normalized offset from the element's center, clamped to [-0.5, 0.5]
      const px = Math.max(-0.5, Math.min(0.5, (e.clientX - cx) / rect.width))
      const py = Math.max(-0.5, Math.min(0.5, (e.clientY - cy) / rect.height))
      setTilt({ rx: py * -6, ry: px * 6 })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div ref={ref} className={`[perspective:1400px] ${className}`}>
      <div
        className="transition-transform duration-200 ease-out-bai [transform-style:preserve-3d]"
        style={{ transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)` }}
      >
        {children}
      </div>
    </div>
  )
}
