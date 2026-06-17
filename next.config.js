/** @type {import('next').NextConfig} */
const nextConfig = {
  // Per-session build dir so two concurrent dev servers (e.g. port 3000 + 3001) don't fight over
  // the same .next/cache (which corrupts route resolution). Defaults to .next — only the launch
  // config that sets BLUEAI_DIST_DIR (blueai-3001) gets an isolated dir; the default server is untouched.
  distDir: process.env.BLUEAI_DIST_DIR || '.next',
  images: {
    // Design-only handoff: local export assets, served unoptimized (no remote CDN).
    unoptimized: true,
  },
  // Serve the static BlueAI Product clone (public/blueai-product/index.html) at a clean URL.
  async rewrites() {
    return [
      { source: '/blueai-product', destination: '/blueai-product/index.html' },
    ]
  },
}

module.exports = nextConfig
