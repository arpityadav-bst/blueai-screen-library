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
  //
  // /blueai-creators/site/** is a real multi-file static site (external CSS/JS/fonts/images,
  // all referenced by RELATIVE path). A rewrite alone leaves the address bar at
  // "/blueai-creators/site" (no trailing slash) while serving index.html's contents — every
  // relative asset then resolves one directory too high and 404s silently (no console error,
  // just an unstyled page). A redirect-to-trailing-slash was tried and rejected: Next's own
  // built-in trailing-slash normalization (default trailingSlash:false) immediately redirects
  // it straight back, producing an infinite 307/308 loop. Fixed instead with a <base> tag in
  // every site/**.html <head> (see shared/site.css sibling files) — that makes relative
  // resolution correct no matter what the address bar shows.
  async rewrites() {
    return [
      { source: '/blueai-product', destination: '/blueai-product/index.html' },
      { source: '/blueai-desktop', destination: '/blueai-desktop/index.html' },
      { source: '/blueai-creators', destination: '/blueai-creators/index.html' },
      { source: '/blueai-creators/site', destination: '/blueai-creators/site/index.html' },
    ]
  },
}

module.exports = nextConfig
