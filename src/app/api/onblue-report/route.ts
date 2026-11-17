/* onBlue for business: the REAL free report (Ashish, 2026-11-17: "make the
   website report as real as we can"). The Volt design run (business/run.html,
   via business/js/report-live.js) calls this, same origin, three parts:

     brand    Ashish's `report` function (blue-agent-lab, Supabase): Claude reads
     market   the site and searches the web. Brand profile; 5 real competitors,
              formats, ideas. Called server to server, so his CORS list (his own
              demo and localhost:3000) never blocks our previews, and his code and
              keys stay untouched. His 7-day cache and daily caps apply.
     youtube  ours: the YouTube Data API (YOUTUBE_API_KEY, a key restricted to
              this one API) turns the competitors and the brand into REAL channel
              numbers: Shorts in the last 6 months, average views, their top Shorts.

   Without the key, `youtube` answers { off: true } and the run keeps Claude's
   estimates, flagged as such. The run falls back to its sample report whenever a
   part fails, so a visitor never waits on an error.
   NOTE: a POST route cannot exist in a STATIC_EXPORT build (next.config.js);
   remove this folder for such a build. Vercel's normal build is unaffected. */
import { NextRequest, NextResponse } from 'next/server';
import { askAshish, hostOf, okSite, youtubeFor } from '@/lib/onblue-report';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

const json = (d: unknown, status = 200) => NextResponse.json(d, { status });

export async function POST(req: NextRequest) {
  let body: any;
  try { body = await req.json(); } catch { return json({ error: 'bad json' }, 400); }
  const part = String(body?.part || '');
  if (part === 'youtube') {
    try { const d = await youtubeFor(body?.brand, body?.rivals); return json('off' in d ? d : { data: d }); }
    catch { return json({ error: 'failed' }, 502); }
  }
  if (part !== 'brand' && part !== 'market') { return json({ error: 'unknown part' }, 400); }
  const site = hostOf(body?.site);
  if (!okSite(site)) { return json({ error: 'not a website' }, 400); }
  const r = await askAshish(part, site, req.headers.get('x-forwarded-for') || req.ip || '');
  return json(r.body, r.status);
}
