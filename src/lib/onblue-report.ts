/* onBlue for business: the REAL free report, shared by the website's route
   (app/api/onblue-report) and the BlueAI MCP (app/api/mcp). Two sources:
   Ashish's `report` function (blue-agent-lab, Supabase; Claude reading the site
   and searching the web) for the brand and the market, and the YouTube Data
   API (YOUTUBE_API_KEY, restricted to that one API) for real channel numbers:
   Shorts in the last 6 months, average views, top Shorts. A Short is a vertical
   video of 3 minutes or less. Without the key, youtubeFor answers { off: true }. */

const ASHISH = 'https://dfhicvitmvnlixftjtlw.supabase.co/functions/v1/report';
const YT = 'https://www.googleapis.com/youtube/v3/';
const SIX_MONTHS = 182 * 864e5;
const SHORT_MAX_S = 180; // YouTube Shorts run up to 3 minutes

export const hostOf = (v: unknown) => String(v || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split(/[\/?#]/)[0];
export const okSite = (s: string) => /^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(s) && s.length <= 100;

/* ---- brand / market: Ashish's function --------------------------------------- */
// ip: the visitor's, so his per-visitor cap counts each visitor on their own
export async function askAshish(part: 'brand' | 'market', site: string, ip: string): Promise<{ status: number; body: any }> {
  try {
    const res = await fetch(ASHISH, {
      method: 'POST',
      cache: 'no-store',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
      body: JSON.stringify({ site, part })
    });
    return { status: res.status, body: await res.json().catch(() => ({ error: 'bad upstream' })) };
  } catch {
    return { status: 502, body: { error: 'unreachable' } };
  }
}

/* ---- youtube: real channel numbers ------------------------------------------- */
type Who = { name: string; site: string };
type Short = { id: string; title: string; views: number; thumb: string; url: string; at: string };
export type Channel = { found: true; title: string; url: string; subs: number; shorts6: number; capped: boolean; avgViews: number; top: Short[] } | { found: false };

const memo = new Map<string, { at: number; data: Channel }>();

async function yt(key: string, path: string, params: Record<string, string>) {
  const u = new URL(YT + path);
  Object.keys(params).forEach(k => u.searchParams.set(k, params[k]));
  u.searchParams.set('key', key);
  const r = await fetch(u, { cache: 'no-store' });
  if (!r.ok) { throw new Error('youtube ' + r.status); }
  return r.json();
}

const squash = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
// a channel is theirs when its name or handle carries the brand's name or domain stem
function looksLike(item: any, who: Who) {
  const stem = squash(who.site.split('.')[0]), name = squash(who.name);
  const title = squash(item?.snippet?.title || ''), handle = squash(item?.snippet?.customUrl || '');
  return [stem, name].some(k => k.length > 2 && (title.includes(k) || handle.includes(k) || k.includes(title) && title.length > 3));
}

async function findChannel(key: string, who: Who) {
  const part = 'snippet,statistics,contentDetails';
  const tries = Array.from(new Set([who.site.split('.')[0], squash(who.name)])).filter(Boolean);
  for (const h of tries) {
    const d = await yt(key, 'channels', { part, forHandle: '@' + h });
    if (d.items?.length && looksLike(d.items[0], who)) { return d.items[0]; }
  }
  // no handle matched: one search by name (costs more quota, so it comes last)
  const s = await yt(key, 'search', { part: 'snippet', type: 'channel', q: who.name, maxResults: '3' });
  for (const it of s.items || []) {
    const id = it.id?.channelId || it.snippet?.channelId;
    if (!id || !looksLike(it, who)) { continue; }
    const d = await yt(key, 'channels', { part, id });
    if (d.items?.length) { return d.items[0]; }
  }
  return null;
}

function seconds(iso: string) {
  const m = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso || '') || [];
  return (+(m[1] || 0)) * 3600 + (+(m[2] || 0)) * 60 + (+(m[3] || 0));
}

async function channelOf(key: string, who: Who): Promise<Channel> {
  const hit = memo.get(who.site);
  if (hit && Date.now() - hit.at < 6 * 36e5) { return hit.data; }
  const ch = await findChannel(key, who);
  let data: Channel = { found: false };
  if (ch) {
    const uploads = ch.contentDetails?.relatedPlaylists?.uploads;
    const list = uploads ? await yt(key, 'playlistItems', { part: 'contentDetails', playlistId: uploads, maxResults: '50' }) : { items: [] };
    const ids = (list.items || []).map((i: any) => i.contentDetails?.videoId).filter(Boolean);
    // the player size gives the shape: a Short is vertical AND 3 minutes or less,
    // so a 90-second landscape ad never counts as one
    const vids = ids.length ? (await yt(key, 'videos', { part: 'snippet,statistics,contentDetails,player', maxHeight: '640', id: ids.join(',') })).items || [] : [];
    const vertical = (v: any) => +(v.player?.embedHeight || 0) > +(v.player?.embedWidth || 0);
    const shorts = vids.filter((v: any) => vertical(v) && seconds(v.contentDetails?.duration) <= SHORT_MAX_S);
    const recent = shorts.filter((v: any) => Date.now() - Date.parse(v.snippet?.publishedAt) < SIX_MONTHS);
    const views = (v: any) => +(v.statistics?.viewCount || 0);
    // the report says "last 6 months", so only those count, older hits included never
    const top: Short[] = recent.slice().sort((a: any, b: any) => views(b) - views(a)).slice(0, 3).map((v: any) => ({
      id: v.id, title: v.snippet?.title || '', views: views(v), at: v.snippet?.publishedAt || '',
      thumb: v.snippet?.thumbnails?.high?.url || v.snippet?.thumbnails?.medium?.url || '', url: 'https://www.youtube.com/shorts/' + v.id
    }));
    const handle = ch.snippet?.customUrl || '';
    data = {
      found: true,
      title: ch.snippet?.title || who.name,
      url: handle ? 'https://www.youtube.com/' + handle : 'https://www.youtube.com/channel/' + ch.id,
      subs: +(ch.statistics?.subscriberCount || 0),
      shorts6: recent.length,
      // the last 50 uploads were all Shorts from the last 6 months: there are more
      capped: recent.length === vids.length && vids.length === 50,
      avgViews: recent.length ? Math.round(recent.reduce((t: number, v: any) => t + views(v), 0) / recent.length) : 0,
      top
    };
  }
  memo.set(who.site, { at: Date.now(), data });
  return data;
}

// the brand's own channel and each competitor's; { off: true } with no key
export async function youtubeFor(brandIn: any, rivalsIn: any): Promise<{ off: true } | { own: Channel; rivals: (Channel & { site: string })[] }> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) { return { off: true }; }
  const clean = (w: any): Who | null => { const site = hostOf(w?.site); return okSite(site) ? { name: String(w?.name || site).slice(0, 80), site } : null; };
  const brand = clean(brandIn);
  const rivals = (Array.isArray(rivalsIn) ? rivalsIn : []).slice(0, 8).map(clean).filter(Boolean) as Who[];
  const safe = (w: Who) => channelOf(key, w).catch(() => ({ found: false }) as Channel);
  const [own, ...them] = await Promise.all([brand ? safe(brand) : Promise.resolve({ found: false } as Channel), ...rivals.map(safe)]);
  return { own, rivals: rivals.map((w, i) => ({ site: w.site, ...them[i] })) };
}
