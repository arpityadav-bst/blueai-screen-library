import { Wordmark } from '@/components/Wordmark'

export default function Footer() {
  return (
    <footer className="border-t border-divider">
      <div className="mx-auto flex max-w-content flex-col items-center gap-4 px-6 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/blueai-icon-RzIisCsb.png" alt="" width={22} height={22} className="rounded-full" />
          <Wordmark size={16} />
        </div>
        <p className="bai-body-sm max-w-md text-ink-muted">
          BlueAI matches creators and brands, verifies the work, and handles the payout — no
          middleman, no back-and-forth.
        </p>
        <p className="bai-caption text-ink-muted">© 2026 BlueAI · An AI worker by now.gg, Inc.</p>
      </div>
    </footer>
  )
}
