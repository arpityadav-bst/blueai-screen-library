'use client'
import { useEffect, useRef } from 'react'

// The swarm — a loose formation of worker nodes, gently drifting, connecting to nearby
// neighbors (a network, not a crowd). Visualizes the meeting's scalability point: today
// one unit, tomorrow a formation. Ambient canvas, reduced-motion → static frame.

type Node = { x: number; y: number; ox: number; oy: number; ph: number }

export default function Mm2SwarmCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    let W = 0, H = 0, nodes: Node[] = []

    const seed = () => {
      const cols = 12, rows = 7
      nodes = []
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = (c + 0.5) * (W / cols) + (Math.random() - 0.5) * 14
          const y = (r + 0.5) * (H / rows) + (Math.random() - 0.5) * 14
          nodes.push({ x, y, ox: x, oy: y, ph: Math.random() * Math.PI * 2 })
        }
      }
    }
    const resize = () => {
      const host = canvas.parentElement
      W = Math.max(1, host?.clientWidth || 800); H = Math.max(1, host?.clientHeight || 320)
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr)
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }
    const ro = new ResizeObserver(resize)
    if (canvas.parentElement) ro.observe(canvas.parentElement)
    resize()

    const LINK = Math.min(96, (W || 800) / 9)
    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H)
      for (const n of nodes) {
        if (!reduced) { n.x = n.ox + Math.sin(t * 0.0006 + n.ph) * 9; n.y = n.oy + Math.cos(t * 0.0007 + n.ph) * 9 }
      }
      ctx.lineWidth = 1
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < LINK) {
            ctx.globalAlpha = (1 - d / LINK) * 0.28
            ctx.strokeStyle = '#6fb3ff'
            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke()
          }
        }
      }
      for (const n of nodes) {
        const pulse = reduced ? 1 : 0.6 + 0.4 * Math.sin(t * 0.002 + n.ph)
        ctx.globalAlpha = 0.75 * pulse
        ctx.fillStyle = '#eef2f5'
        ctx.beginPath(); ctx.arc(n.x, n.y, 1.8, 0, 6.283); ctx.fill()
      }
      ctx.globalAlpha = 1
    }
    let raf = 0
    if (reduced) { draw(0) } else {
      const loop = (t: number) => { draw(t); raf = requestAnimationFrame(loop) }
      raf = requestAnimationFrame(loop)
    }
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [])
  return <canvas ref={ref} className="mm2-swarm-canvas" aria-hidden="true" />
}
