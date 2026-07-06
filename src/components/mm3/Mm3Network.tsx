'use client'
import { useEffect, useRef } from 'react'

// The agent economy, visualized as a network — many worker nodes, each connected back
// to a small set of "owner" hubs (you + others like you), pulsing as capital moves.
// One component, two modes: 'ambient' (sparse hero backdrop) and 'dense' (the dedicated
// scale section). Procedural canvas only — no stock/scraped imagery. Reduced-motion static.

type Node = { x: number; y: number; ox: number; oy: number; ph: number; hub: boolean }

export default function Mm3Network({ mode = 'ambient' }: { mode?: 'ambient' | 'dense' }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    let W = 0, H = 0, nodes: Node[] = []
    const dense = mode === 'dense'

    const seed = () => {
      const hubCount = dense ? 5 : 3
      const workerCount = dense ? 70 : 26
      nodes = []
      for (let i = 0; i < hubCount; i++) {
        const x = (0.15 + 0.7 * ((i + 0.5) / hubCount)) * W, y = H * (dense ? 0.5 : 0.42)
        nodes.push({ x, y, ox: x, oy: y, ph: Math.random() * Math.PI * 2, hub: true })
      }
      for (let i = 0; i < workerCount; i++) {
        const x = Math.random() * W, y = Math.random() * H
        nodes.push({ x, y, ox: x, oy: y, ph: Math.random() * Math.PI * 2, hub: false })
      }
    }
    const resize = () => {
      const host = canvas.parentElement
      W = Math.max(1, host?.clientWidth || 800); H = Math.max(1, host?.clientHeight || 500)
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr)
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }
    const ro = new ResizeObserver(resize)
    if (canvas.parentElement) ro.observe(canvas.parentElement)
    resize()

    const LINK = dense ? 120 : 150
    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H)
      for (const n of nodes) {
        if (!reduced) { n.x = n.ox + Math.sin(t * 0.0005 + n.ph) * (n.hub ? 6 : 12); n.y = n.oy + Math.cos(t * 0.0006 + n.ph) * (n.hub ? 6 : 12) }
      }
      // links: workers to their nearest hub only (a network, not a mesh)
      const hubs = nodes.filter((n) => n.hub)
      for (const n of nodes) {
        if (n.hub) continue
        let best = hubs[0], bd = Infinity
        for (const h of hubs) { const d = Math.hypot(n.x - h.x, n.y - h.y); if (d < bd) { bd = d; best = h } }
        if (bd < W * 0.42) {
          ctx.globalAlpha = Math.max(0, (1 - bd / (W * 0.42))) * 0.22
          ctx.strokeStyle = '#ff6fb0'
          ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(best.x, best.y); ctx.stroke()
        }
      }
      // hub-to-hub faint mesh
      for (let i = 0; i < hubs.length; i++) for (let j = i + 1; j < hubs.length; j++) {
        ctx.globalAlpha = 0.14; ctx.strokeStyle = '#a78bfa'
        ctx.beginPath(); ctx.moveTo(hubs[i].x, hubs[i].y); ctx.lineTo(hubs[j].x, hubs[j].y); ctx.stroke()
      }
      for (const n of nodes) {
        const pulse = reduced ? 1 : 0.6 + 0.4 * Math.sin(t * 0.0018 + n.ph)
        ctx.globalAlpha = (n.hub ? 0.95 : 0.6) * pulse
        ctx.fillStyle = n.hub ? '#c9b8ff' : '#ff9fc9'
        ctx.beginPath(); ctx.arc(n.x, n.y, n.hub ? 3.4 : 1.7, 0, 6.283); ctx.fill()
      }
      ctx.globalAlpha = 1
    }
    let raf = 0
    if (reduced) { draw(0) } else {
      const loop = (t: number) => { draw(t); raf = requestAnimationFrame(loop) }
      raf = requestAnimationFrame(loop)
    }
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [mode])
  return <canvas ref={ref} className="mm3-net-canvas" aria-hidden="true" />
}
