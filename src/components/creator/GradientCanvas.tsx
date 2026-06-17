'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Living iris→cyan→blue mesh-gradient hero backdrop — the blueAI brand gradient, animated.
// A fullscreen three.js fragment shader: soft brand blooms drift over a near-white base, with a
// gentle cursor bloom. Honors prefers-reduced-motion (renders one static frame). Disposes on unmount.
const VERT = 'void main(){ gl_Position = vec4(position, 1.0); }'
const FRAG = `
precision highp float;
uniform float u_time; uniform vec2 u_res; uniform vec2 u_mouse;
const vec3 IRIS  = vec3(0.482, 0.298, 1.000);  // #7B4CFF
const vec3 CYAN  = vec3(0.055, 0.643, 0.773);  // #0EA4C5
const vec3 BLUE  = vec3(0.184, 0.427, 1.000);  // #2F6DFF
const vec3 LIGHT = vec3(0.969, 0.980, 1.000);  // near-white canvas
void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  float asp = u_res.x / max(u_res.y, 1.0);
  vec2 p = uv; p.x *= asp;
  float t = u_time * 0.06;
  float f1 = sin(p.x*2.2 + t*1.3) + sin(p.y*2.6 - t*1.1) + sin((p.x+p.y)*1.7 + t*0.9);
  float f2 = sin(p.x*1.3 - t*0.8) + cos(p.y*1.9 + t*0.7) + sin((p.x-p.y)*2.1 - t);
  vec3 col = LIGHT;
  col = mix(col, IRIS, smoothstep(-0.6, 2.4, f1) * 0.42);
  col = mix(col, CYAN, smoothstep(-0.4, 2.6, f2) * 0.34);
  col = mix(col, BLUE, smoothstep( 0.2, 2.8, f1 + f2*0.5) * 0.22);
  vec2 m = u_mouse; m.x *= asp;
  col = mix(col, IRIS, (1.0 - smoothstep(0.0, 0.55, distance(p, m))) * 0.10);
  gl_FragColor = vec4(col, 1.0);
}`

export function GradientCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
    } catch {
      return // no WebGL — the CSS fallback background shows
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6))
    const scene = new THREE.Scene()
    const cam = new THREE.Camera()
    const uniforms = {
      u_time: { value: 0 },
      u_res: { value: new THREE.Vector2(1, 1) },
      u_mouse: { value: new THREE.Vector2(0.5, 0.62) },
    }
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms }))
    scene.add(mesh)
    const resize = () => {
      const w = canvas.clientWidth || 1, h = canvas.clientHeight || 1
      renderer.setSize(w, h, false)
      uniforms.u_res.value.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio())
    }
    resize()
    // ResizeObserver tracks the canvas element directly — catches layout settling after mount and
    // any later resize, even when no window 'resize' event fires.
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      uniforms.u_mouse.value.set((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    let raf = 0
    const start = performance.now()
    const loop = () => {
      uniforms.u_time.value = (performance.now() - start) / 1000
      renderer.render(scene, cam)
      raf = requestAnimationFrame(loop)
    }
    if (reduce) { uniforms.u_time.value = 9; renderer.render(scene, cam) } else loop()
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      mesh.geometry.dispose()
      ;(mesh.material as THREE.Material).dispose()
      renderer.dispose()
    }
  }, [])
  return <canvas ref={ref} className="cr-canvas" aria-hidden="true" />
}
