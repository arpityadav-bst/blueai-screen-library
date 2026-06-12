// Shared data for the bluestacks.ai inner pages (nav configs, the real download URL).
export const DOWNLOAD_URL =
  'https://cloud.bluestacks.com/api/getdownloadnow?platform=win&utm_source=blueai-webpage&utm_medium=home-download-button&utm_campaign=blueai-webpage-home-en&bluestacks_version=bs5'

// THE shared marketing header links — identical on every page. The four content links
// resolve to the SEO homepage's sections (so they work from any page); Social Rewards and
// Developer are their own pages, opened in a new tab (↗) per the designer.
export const HEADER_LINKS: { label: string; href: string; external?: boolean }[] = [
  { label: 'What is BlueAI', href: '/seo#what-is' },
  { label: 'Tasks', href: '/seo#tasks' },
  { label: 'How it works', href: '/seo#how-it-works' },
  { label: 'FAQ', href: '/seo#faq' },
  { label: 'Social Rewards', href: '/social-rewards', external: true },
  { label: 'Developer', href: '/developer', external: true },
]

// Social links in BRAND colors (Discord blurple · X black · Reddit orange). Shared by the
// header + footer so there's one source.
export const SOCIAL = [
  { label: 'Discord', href: 'https://discord.com/invite/bluestacks', cls: 'is-discord', d: 'M20.3 4.5A19.8 19.8 0 0 0 15.4 3l-.2.5a14 14 0 0 1 4.3 2.2 17.7 17.7 0 0 0-15 0A14 14 0 0 1 8.8 3.5L8.6 3a19.8 19.8 0 0 0-4.9 1.5C.6 9.1-.2 13.6.2 18a20 20 0 0 0 6 3l.8-1.6a13 13 0 0 1-2-1l.5-.4a14.2 14.2 0 0 0 12.2 0l.5.4c-.6.4-1.3.7-2 1L17 21a20 20 0 0 0 6-3c.5-5.2-.8-9.6-2.7-13.5ZM8 15.3c-1.2 0-2.1-1.1-2.1-2.4 0-1.3.9-2.4 2.1-2.4s2.2 1.1 2.1 2.4c0 1.3-.9 2.4-2.1 2.4Zm8 0c-1.2 0-2.1-1.1-2.1-2.4 0-1.3.9-2.4 2.1-2.4s2.2 1.1 2.1 2.4c0 1.3-.9 2.4-2.1 2.4Z' },
  { label: 'X', href: 'https://x.com/BlueClaw_AI', cls: 'is-x', d: 'M18.2 2h3.3l-7.2 8.3L23 22h-6.7l-5.2-6.8L5.1 22H1.8l7.7-8.8L1 2h6.8l4.7 6.2L18.2 2Zm-1.2 18h1.8L7.1 3.9H5.2L17 20Z' },
  { label: 'Reddit', href: 'https://www.reddit.com/r/BlueStacks/', cls: 'is-reddit', d: 'M22 12.1a2.1 2.1 0 0 0-3.6-1.4 10.3 10.3 0 0 0-5.4-1.7l.9-4.2 2.9.6a1.5 1.5 0 1 0 .2-1l-3.3-.7a.5.5 0 0 0-.6.4l-1 4.6a10.4 10.4 0 0 0-5.5 1.7 2.1 2.1 0 1 0-2.3 3.4 4 4 0 0 0 0 .6c0 3.1 3.6 5.6 8 5.6s8-2.5 8-5.6a4 4 0 0 0 0-.6 2.1 2.1 0 0 0 1.2-1.9ZM7 13.6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm8.4 4c-1 1-3.1 1.1-3.7 1.1-.6 0-2.7 0-3.7-1.1a.4.4 0 0 1 .6-.6c.7.7 2.1.9 3.1.9 1 0 2.5-.2 3.1-.9a.4.4 0 1 1 .6.6Zm-.3-2.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z' },
]

// Shared footer — same on every page. Agent links + a Product column (Social Rewards · Developer)
// + Learn + Company. Real internal routes where they exist.
export const FOOTER = {
  tagline: 'An AI worker by now.gg, Inc.',
  cols: [
    { head: 'Live agents', links: [
      { label: 'Apply to jobs', href: '/apply-to-jobs' },
      { label: 'AI video creator', href: '/ai-video-creator' },
      { label: 'AI trading agent', href: '/ai-trading-agent' },
      { label: 'Prediction market agent', href: '/prediction-market-agent' },
    ] },
    { head: 'Product', links: [
      { label: 'Social Rewards', href: '/social-rewards' },
      { label: 'Developer', href: '/developer' },
    ] },
    { head: 'Learn', links: [
      { label: 'What is BlueAI', href: '/seo#what-is' },
      { label: 'How it works', href: '/seo#how-it-works' },
      { label: 'FAQ', href: '/seo#faq' },
    ] },
    { head: 'Company', links: [
      { label: 'BlueStacks', href: 'https://www.bluestacks.com', external: true },
      { label: 'now.gg', href: 'https://now.gg', external: true },
    ] },
  ] as { head: string; links: { label: string; href: string; external?: boolean }[] }[],
}
