/** @type {import('next').NextConfig} */
const nextConfig = {
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
