/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Design-only handoff: local export assets, served unoptimized (no remote CDN).
    unoptimized: true,
  },
  async redirects() {
    return [
      // PM's live-demo homepage (public/live-demo/ — byte-identical static clone of
      // ashish-pathak-bst/blue-ai-demo). A REDIRECT (not rewrite) so the browser lands on
      // the full /index.html path and the page's relative iframe src (app.html) resolves.
      { source: '/live-demo', destination: '/live-demo/index.html', permanent: false },
    ]
  },
}

module.exports = nextConfig
