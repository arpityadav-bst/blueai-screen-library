import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BlueAI by now.gg — design handoff',
  description:
    'Design-only handoff replica of the BlueAI marketing site (hero directions + homepage), built on the blueai-modern design system.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* blueai-modern fonts: Inter (SF Pro substitute) · Bricolage Grotesque (wordmark)
            · Space Grotesk (marketing display). Loaded via <link> so builds don't need
            network at build time; the Tailwind font stacks fall back to the literal names. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Bricolage+Grotesque:wght@700&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-canvas font-sans text-ink-body antialiased">{children}</body>
    </html>
  )
}
