'use client'

// BlueAI — Boot Splash + Home Skeleton (ported from public/blueai-product/blueai/boot_splash.jsx)
// Re-skinned onto the product DS. Behavior preserved exactly:
//  • BootSplash: logo + gradient "BlueAI" wordmark + 3 bouncing dots + cycling status
//    message ("Starting BlueAI…" → "Loading your skills…"), fades out, calls onDone().
//  • HomeSkeleton: shimmer placeholder rows mirroring ProductHome's category card list.
// Keyframes ba-bounce / ba-shimmer are assumed global (defined alongside the app).
import { useState, useEffect, CSSProperties } from 'react'
import { Card } from '@/components/product/ui'

/* ── Shimmer block ─────────────────────────────────────────────
   Placeholder primitive. The sweep gradient + ba-shimmer keyframe are an animation
   texture (kept as-is, like keyframe geometry). w/h/r are caller-driven placeholder
   geometry, not surface tokens. */
function Shimmer({
  w = '100%',
  h,
  r = 8,
  extra = {},
}: {
  w?: number | string
  h?: number | string
  r?: number | string
  extra?: CSSProperties
}) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: r,
        flexShrink: 0,
        // Shimmer texture gradient (slate placeholder shades) — animation texture, kept as-is.
        background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
        backgroundSize: '800px 100%',
        animation: 'ba-shimmer 1.4s ease-in-out infinite',
        ...extra,
      }}
    />
  )
}

/* ── Boot Splash ───────────────────────────────────────────── */
export function BootSplash({ onDone }: { onDone?: () => void }) {
  // Live app shows two messages on cold start: "Starting BlueAI…" → "Loading your skills…".
  const MSGS = ['Starting BlueAI…', 'Loading your skills…']
  const [idx, setIdx] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const msgT = setTimeout(() => setIdx(1), 1050)
    const fadeT = setTimeout(() => setFading(true), 2150)
    const doneT = setTimeout(() => onDone?.(), 2650)
    return () => [msgT, fadeT, doneT].forEach(clearTimeout)
  }, [onDone])

  return (
    <div
      className="absolute inset-0 z-[200] flex flex-col items-center justify-center bg-canvas select-none transition-opacity duration-500"
      style={{
        opacity: fading ? 0 : 1,
        pointerEvents: fading ? 'none' : 'auto',
      }}
    >
      {/* Logo (brand asset — kept as-is) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/blueai-product/assets/Logo.png"
        alt=""
        className="mb-4"
        style={{ width: 64, height: 64 }}
        onError={(e) => {
          ;(e.target as HTMLImageElement).style.display = 'none'
        }}
      />

      {/* Brand wordmark — iris→cyan gradient text (Tier-3 brand, kept as-is) */}
      <span
        className="mb-12 font-extrabold leading-none"
        style={{
          background: 'linear-gradient(90deg,#0EA4C5,#7B4CFF)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: 34,
          letterSpacing: '-0.5px',
        }}
      >
        BlueAI
      </span>

      {/* Bouncing dots — alternating brand cyan / iris (Tier-3 brand colors, kept as-is) */}
      <div className="mb-[22px] flex" style={{ gap: 9 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-circle"
            style={{
              width: 8,
              height: 8,
              background: i === 1 ? '#7B4CFF' : '#0EA4C5',
              animation: `ba-bounce 1.1s ease-in-out ${i * 0.18}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Status message */}
      <p className="text-ink-muted font-medium transition-opacity" style={{ fontSize: 13.5 }}>
        {MSGS[idx]}
      </p>
    </div>
  )
}

/* ── Home skeleton (chat cold-start; mirrors ProductHome's card list) ── */
export function HomeSkeleton() {
  return (
    <div>
      {/* "WHAT WOULD YOU LIKE TO DO?" label placeholder */}
      <Shimmer w={150} h={9} r={4} extra={{ marginBottom: 12 }} />
      <div className="flex flex-col" style={{ gap: 7 }}>
        {[0, 1, 2, 3].map((i) => (
          <Card key={i} className="flex items-center gap-3 px-3 shadow-none" style={{ paddingTop: 11, paddingBottom: 11 }}>
            <Shimmer w={36} h={36} r={10} />
            <div className="flex min-w-0 flex-1 flex-col" style={{ gap: 7 }}>
              <Shimmer w="46%" h={10} r={5} />
              <Shimmer w="82%" h={9} r={5} />
            </div>
            <div className="flex flex-shrink-0 items-center" style={{ gap: 6 }}>
              <Shimmer w={34} h={9} r={5} />
              <Shimmer w={10} h={10} r={3} />
            </div>
          </Card>
        ))}
        {/* last card lands focused, as in the live cold-start — soft brand-blue focus tint */}
        <Card
          className="flex items-center gap-3 px-3 shadow-none"
          style={{ paddingTop: 11, paddingBottom: 11, borderColor: '#bcd6f5' }}
        >
          <Shimmer w={32} h={32} r="50%" />
          <Shimmer w="58%" h={10} r={5} />
        </Card>
      </div>
    </div>
  )
}
