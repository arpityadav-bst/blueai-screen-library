// Canonical BlueAI wordmark — the SINGLE source of truth. "BlueAI" (one word) in the full
// primary gradient (iris→cyan, left to right), Bricolage 700. Use this EVERYWHERE the wordmark
// appears (navs, footers, style guide). Styles are global (.bai-wordmark in globals.css) so it
// renders identically in every scoped context. Pass `size` (px) to scale it per placement.
export function Wordmark({ size, className = '' }: { size?: number; className?: string }) {
  return (
    <span className={`bai-wordmark ${className}`.trim()} style={size ? { fontSize: `${size}px` } : undefined}>BlueAI</span>
  )
}
