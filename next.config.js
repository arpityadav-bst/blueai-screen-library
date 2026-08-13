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
  // STATIC_EXPORT builds a fully static copy for hosts that only serve physical files (the
  // bluestacks.ai dev/prod S3 bucket): output: 'export' + trailingSlash so every route is a
  // real <route>/index.html, under an optional base path. Rewrites are not supported in export
  // mode, so the clean-URL rewrites for the static prototypes exist only in the normal build.
  ...(process.env.STATIC_EXPORT
    ? {
        output: 'export',
        basePath: process.env.STATIC_EXPORT_BASE || '',
        trailingSlash: true,
      }
    : {
        // Serve the static prototypes (public/**/index.html) at clean URLs.
        async rewrites() {
          return [
            { source: '/blueai-product', destination: '/blueai-product/index.html' },
            { source: '/blueai-desktop', destination: '/blueai-desktop/index.html' },
          ]
        },
      }),
}

module.exports = nextConfig
