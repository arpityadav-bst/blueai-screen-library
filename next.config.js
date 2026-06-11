/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Design-only handoff: local export assets, served unoptimized (no remote CDN).
    unoptimized: true,
  },
}

module.exports = nextConfig
