import type { Draft } from './spec'

// The one real network call in this otherwise design-only replica (product decision,
// 2026-08-12): campaign submissions land in the Blue AI website's Supabase so dev-link demos
// collect real brand interest. Write-only from the browser: the anon key can insert rows and
// RLS gives it no way to read them back. Fire-and-forget on purpose; the dialog's submitted
// state must never hang on a network round trip in a design prototype.

const SUPABASE_URL = 'https://dfhicvitmvnlixftjtlw.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmaGljdml0bXZubGl4ZnRqdGx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NzIwMDMsImV4cCI6MjA5NjU0ODAwM30.J7aXVJxB5EoWSnyaxcEtorw6nWy1pTIEOTgxdBz6rAY'

// Local date parts, not toISOString(): the brand picked "Aug 20" in their own timezone and a
// UTC conversion can shift it a day.
function isoDate(d: Date | null): string | null {
  if (!d) return null
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

export function submitCampaign(d: Draft, email: string | null) {
  void fetch(`${SUPABASE_URL}/rest/v1/brand_campaign_submissions`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      campaign_name: d.name,
      post_url: d.url,
      actions: d.actions,
      budget_usd: Number(d.budget) || null,
      bid_usd: Number(d.bid) || null,
      start_date: isoDate(d.start),
      end_date: isoDate(d.end),
      target_country: d.country,
      goal: d.goal.trim() || null,
      email,
    }),
  }).catch(() => {
    // Swallowed by design: losing one dev-demo lead beats breaking the submitted state.
  })
}
