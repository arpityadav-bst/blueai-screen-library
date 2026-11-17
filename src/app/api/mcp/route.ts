/* THE BlueAI MCP (Appy + Ashish, 2026-11-17: "brands should create campaigns
   from their own Claude or AI agent, like Magnific's MCP"). A remote MCP server
   over Streamable HTTP, stateless, answering JSON (no SDK: three JSON-RPC
   methods are all it needs). Connect any client to <site>/api/mcp.

   Two tools, both real:
     brand_report     the same real report as the website run: the brand read
                      from its site, 5 real competitors, their real YouTube
                      numbers and top Shorts, the formats that win, video ideas.
     draft_campaign   prepares a campaign draft and returns a link that opens it
                      in onBlue, prefilled. THE AI DRAFTS, A PERSON SUBMITS: no
                      tool submits a campaign or spends a budget. Submitting stays
                      a click in onBlue (business/app/campaign.html).
   Data: src/lib/onblue-report.ts. No sign-in yet: both tools work on public
   data and a link, so nothing here reads or changes an account. */
import { NextRequest, NextResponse } from 'next/server';
import { askAshish, hostOf, okSite, youtubeFor } from '@/lib/onblue-report';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

const VERSION = '2025-06-18';
const PAGE = '/experiments/onblue-vesper/business/app/campaign.html';

const TOOLS = [
  {
    name: 'brand_report',
    title: 'Brand report',
    description: 'Builds the free onBlue report for a brand\'s website: what the brand sells and to whom, 5 real competitors with their real YouTube Shorts numbers and most watched Shorts, the short-video formats that win in the category, and 4 video ideas. Takes about a minute.',
    inputSchema: { type: 'object', properties: { website: { type: 'string', description: 'The brand\'s website, like gymshark.com' } }, required: ['website'] },
    annotations: { readOnlyHint: true, openWorldHint: true }
  },
  {
    name: 'draft_campaign',
    title: 'Draft a campaign',
    description: 'Prepares an onBlue campaign draft and returns a link that opens it in onBlue, prefilled. Nothing is submitted or charged: the brand reviews the draft and submits it in onBlue. Run brand_report first to pick the video ideas.',
    inputSchema: {
      type: 'object',
      properties: {
        website: { type: 'string', description: 'The brand\'s website' },
        campaign_name: { type: 'string' },
        product: { type: 'string', description: 'What the videos promote' },
        budget_usd: { type: 'number', description: 'Total budget in US dollars, at least 100' },
        starts: { type: 'string', description: 'Start date, YYYY-MM-DD' },
        ends: { type: 'string', description: 'End date, YYYY-MM-DD' },
        market: { type: 'string', enum: ['United States', 'UK', 'Canada', 'Worldwide'] },
        video_ideas: { type: 'array', items: { type: 'string' }, description: 'The audiences of the video ideas to keep, as brand_report names them' },
        notes: { type: 'string', description: 'Anything the team should know' }
      },
      required: ['website']
    },
    annotations: { readOnlyHint: true, openWorldHint: false }
  }
];

const rpc = (id: unknown, result: unknown) => ({ jsonrpc: '2.0', id, result });
const fail = (id: unknown, code: number, message: string) => ({ jsonrpc: '2.0', id, error: { code, message } });
const text = (t: string, isError = false) => ({ content: [{ type: 'text', text: t }], isError });
const n = (v: number) => Math.round(v).toLocaleString('en-US');

async function brandReport(site: string, ip: string) {
  const [brand, market] = await Promise.all([askAshish('brand', site, ip), askAshish('market', site, ip)]);
  if (brand.status === 429 || market.status === 429) { return text('The free report limit for today is reached. Try again tomorrow.', true); }
  const b = brand.body?.data, m = market.body?.data;
  if (!b && !m) { return text('Could not build a report for ' + site + ' right now.', true); }
  const rivals = (m?.rivals || []).slice(0, 5);
  const yt = rivals.length ? await youtubeFor({ name: b?.brand || site, site }, rivals).catch(() => ({ off: true } as const)) : ({ off: true } as const);
  const real = 'rivals' in yt ? yt : null;
  const lines: string[] = [];
  if (b) {
    lines.push('# ' + (b.brand || site), b.category + '. Sells: ' + b.sell + '. Buyers: ' + b.buyers + ', ' + b.where + '.', 'Edge: ' + b.edge + '. Voice: ' + b.voice + '.');
    if (real && real.own.found) { lines.push('Own YouTube: ' + real.own.title + ', ' + n(real.own.subs) + ' subscribers, ' + real.own.shorts6 + ' Shorts in the last 6 months.'); }
  }
  if (rivals.length) {
    lines.push('', '## Competitors' + (real ? ' (YouTube numbers are real, last 6 months)' : ' (Shorts counts are estimates)'));
    rivals.forEach((x: any) => {
      const c: any = real?.rivals.find(y => y.site === hostOf(x.site));
      lines.push('- ' + x.name + ' (' + hostOf(x.site) + '): ' + (c ? c.found ? c.shorts6 + ' Shorts, ' + n(c.subs) + ' subscribers, ' + n(c.avgViews) + ' average views' : 'no YouTube channel found' : 'about ' + x.shorts_6mo + ' Shorts'));
    });
    const top = (real?.rivals || []).flatMap((c: any) => c.found ? c.top.map((t: any) => ({ ...t, by: c.title })) : []).sort((a: any, z: any) => z.views - a.views).slice(0, 3);
    if (top.length) { lines.push('', '## Their most watched Shorts'); top.forEach((t: any) => lines.push('- ' + t.by + ': "' + t.title + '", ' + n(t.views) + ' views, ' + t.url)); }
  }
  if (m?.formats?.length) { lines.push('', '## Formats that win', m.formats.map((f: any) => f.name + ' ' + f.share + '%').join(', ')); }
  if (m?.angles?.length) { lines.push('', '## Video ideas'); m.angles.forEach((a: any) => lines.push('- ' + a.who + ': "' + a.say + '" (' + a.format + ')')); }
  lines.push('', 'Next: draft_campaign with this website prepares a campaign to review and submit in onBlue.');
  return text(lines.join('\n'));
}

function draftCampaign(args: any, origin: string, site: string) {
  const d: Record<string, unknown> = { website: site };
  const pick = (k: string, v: unknown) => { if (v !== undefined && v !== null && v !== '') { d[k] = v; } };
  pick('name', args.campaign_name); pick('product', args.product); pick('where', args.market); pick('note', args.notes);
  if (+args.budget_usd >= 100) { d.budget = Math.round(+args.budget_usd); }
  if (/^\d{4}-\d{2}-\d{2}$/.test(args.starts || '')) { d.start = args.starts; }
  if (/^\d{4}-\d{2}-\d{2}$/.test(args.ends || '')) { d.end = args.ends; }
  if (Array.isArray(args.video_ideas) && args.video_ideas.length) { d.ideas = args.video_ideas.map(String).slice(0, 8); }
  const link = origin + PAGE + '?draft=' + Buffer.from(JSON.stringify(d)).toString('base64url');
  return text('Draft ready for ' + site + '. Open it to review and submit:\n' + link + '\n\nNothing is submitted or charged until the brand submits it in onBlue. We review every campaign, usually within a working day.');
}

async function handle(msg: any, req: NextRequest) {
  const { id, method, params } = msg || {};
  if (method === 'initialize') {
    return rpc(id, {
      protocolVersion: params?.protocolVersion || VERSION,
      capabilities: { tools: {} },
      serverInfo: { name: 'blueai', title: 'BlueAI by onBlue', version: '0.1.0' },
      instructions: 'BlueAI builds a real short-video report for any brand website and drafts onBlue campaigns. Drafts open in onBlue for the brand to review and submit; nothing is submitted or charged from here.'
    });
  }
  if (method === 'ping') { return rpc(id, {}); }
  if (method === 'tools/list') { return rpc(id, { tools: TOOLS }); }
  if (method === 'tools/call') {
    const args = params?.arguments || {}, site = hostOf(args.website);
    if (!okSite(site)) { return rpc(id, text('Give a website, like gymshark.com.', true)); }
    if (params?.name === 'brand_report') { return rpc(id, await brandReport(site, req.headers.get('x-forwarded-for') || req.ip || '')); }
    if (params?.name === 'draft_campaign') { return rpc(id, draftCampaign(args, req.nextUrl.origin, site)); }
    return fail(id, -32602, 'Unknown tool');
  }
  return fail(id, -32601, 'Method not found');
}

export async function POST(req: NextRequest) {
  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json(fail(null, -32700, 'Parse error'), { status: 400 }); }
  const list = Array.isArray(body) ? body : [body];
  // notifications (no id) get no answer
  const out = (await Promise.all(list.map(m => (m && m.id !== undefined ? handle(m, req) : null)))).filter(Boolean);
  if (!out.length) { return new NextResponse(null, { status: 202 }); }
  return NextResponse.json(Array.isArray(body) ? out : out[0]);
}

// no server-sent stream: this server only answers requests
export async function GET() { return new NextResponse('BlueAI MCP: POST JSON-RPC here', { status: 405, headers: { Allow: 'POST' } }); }
