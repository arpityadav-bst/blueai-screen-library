/* New campaign: what the wizard knows, with no DOM in it. The brief, the two
   campaign types, the rules a brief must pass, and the row a finished brief
   becomes. Fields, hints and floors are PM's create flow (campaign.html:
   BRIEFS, PLATFORMS, validate, fileCampaign); the 7.1 proposals are applied
   on top (P1 presets, P2 labels, P4 floor up front, P5 dates, P7 Market,
   P9 creators, P17 completion). */
(function () {
  'use strict';

  var DAY = 864e5;

  // GROWTH FIRST (P15), so the chooser reads in the homepage hero's order.
  var TYPES = {
    growth: {
      name: 'Video growth',
      body: 'You have no video yet. Our agent studies your category, makes the videos, and creators post them from their own accounts.',
      bring: 'A few reference sites and videos', pay: 'Per 1,000 views',
      unit: 'views', per: 1000, min: 1.2, review: 'Review everything',
      minNote: 'Higher rates can get your videos seen more.',
      rateLabel: 'Rate per 1,000 views', ratePh: '1.20',
      next: ['Our team reads the brief and either takes it or comes back to you.',
        'Our agent studies your category and makes the videos.',
        'We review every video ourselves, and you see the approved ones here.',
        'Creators post them from their own accounts.',
        'You pay only for the views those posts gather.']
    },
    engagement: {
      name: 'Video engagement',
      body: 'You already posted a video. People watch it, like it and comment on it from their own accounts.',
      bring: 'The video', pay: 'Per completion',
      unit: 'completions', per: 1, min: 0, review: 'Auto-approve',
      rateLabel: 'Bid per completion', ratePh: '1.00',
      next: ['We review your campaign.', 'Members watch, like and comment.', "Every completion is checked before you're charged."]
    }
  };
  var ORDER = ['growth', 'engagement'];

  var PLATS = {
    youtube: { an: 'a YouTube', hosts: ['youtube.com', 'youtu.be'], urlLabel: 'YouTube video URL',
      urlPh: 'https://youtube.com/watch?v=...', urlHint: 'A public YouTube video or Short.', paste: 'Paste a public YouTube video or Short.' },
    instagram: { an: 'an Instagram', hosts: ['instagram.com', 'instagr.am'], urlLabel: 'Instagram Reel URL',
      urlPh: 'https://instagram.com/reel/...', urlHint: 'A public Instagram Reel.', paste: 'Paste a public Instagram Reel.' }
  };
  var ACTIONS = ['Watch', 'Like', 'Comment'];
  // label, then the code the Campaigns list already uses for it
  var MARKETS = [['United States', 'US'], ['India', 'IN'], ['Worldwide', 'WORLDWIDE']];
  var PRESETS = ['500', '2000', '5000'];
  var STEPS = ['What to promote', 'Budget and schedule', 'Where it runs', 'Review'];

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }

  // P5: tomorrow at 09:00 for 14 days, so the window is already a sensible one
  function blank() {
    var now = new Date();
    var start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    return {
      type: '', platforms: ['youtube'], name: '', product: '',
      postUrl: '', actions: ACTIONS.slice(), site: '', refs: '', refsFiles: '',
      budgetPick: '', budgetCustom: '', bid: '',
      startDate: iso(start), startTime: '09:00', endDate: iso(new Date(+start + 14 * DAY)), endTime: '09:00',
      market: 'Worldwide', note: '', review: ''
    };
  }

  /* Picking a type clears the other type's own answers, and only those
     (CC-3): the platforms, name, product, budget, window and market are
     the same question for both. Growth's rate opens on its floor (PM). */
  function setType(b, t) {
    if (b.type === t) { return; }
    b.type = t;
    b.review = TYPES[t].review;
    b.postUrl = ''; b.actions = ACTIONS.slice();
    b.site = ''; b.refs = ''; b.refsFiles = '';
    b.bid = t === 'growth' ? TYPES.growth.ratePh : '';
    if (t === 'engagement' && b.platforms.length !== 1) { b.platforms = [b.platforms[0] || 'youtube']; }
  }

  // would switching type throw away something the agency typed?
  function typeOwned(b) {
    if (b.type === 'engagement') { return !!(b.postUrl.trim() || b.bid.trim() || b.actions.length !== ACTIONS.length); }
    if (b.type === 'growth') { return !!(b.site.trim() || b.refs.trim() || b.refsFiles || b.bid.trim() !== TYPES.growth.ratePh); }
    return false;
  }

  function num(v) { return String(v || '').replace(/[$,\s]/g, ''); }
  function isMoney(v) { var s = num(v); return /^\d+(\.\d{1,2})?$/.test(s) && Number(s) > 0; }
  function budgetOf(b) { return b.budgetPick === 'custom' ? num(b.budgetCustom) : b.budgetPick; }
  function money(n) {
    n = Number(n);
    return '$' + (n % 1 ? n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : n.toLocaleString('en-US'));
  }
  // a unit price (a bid, a rate) always shows its cents: $1.00, not $1
  function price(n) { return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function at(date, time) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) { return null; }
    var p = date.split('-'), t = (time || '00:00').split(':');
    return new Date(+p[0], +p[1] - 1, +p[2], +t[0], +t[1]);
  }
  // the browser's own offset, written the way the plan writes it: GMT+5:30
  function zone() {
    var m = -new Date().getTimezoneOffset(), a = Math.abs(m);
    return 'GMT' + (m < 0 ? '-' : '+') + Math.floor(a / 60) + (a % 60 ? ':' + pad(a % 60) : '');
  }
  function days(b) {
    var s = at(b.startDate, b.startTime), e = at(b.endDate, b.endTime);
    return s && e && e > s ? Math.max(1, Math.round((e - s) / DAY)) : 0;
  }
  /* PM's spelled-out dates (the old create flow): "Tue, 3 Nov 2026" reads one
     way on both sides of the Atlantic, where 03/11 does not. Times are stored
     24-hour and shown 12-hour: "14:30" is what is kept, "2:30 PM" what is read. */
  var WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var MO = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function fmtDay(d) { return WD[d.getDay()] + ', ' + d.getDate() + ' ' + MO[d.getMonth()] + ' ' + d.getFullYear(); }
  function fmtTime(t) {
    var p = String(t || '').split(':'), h = +p[0];
    return p.length < 2 ? '' : ((h % 12) || 12) + ':' + p[1] + ' ' + (h < 12 ? 'AM' : 'PM');
  }
  function when(date, time) {
    var d = at(date, time);
    return d ? fmtDay(d) + ', ' + fmtTime(time) : '';
  }

  // PM's floor math: what the budget covers if every result passes
  function estimate(b) {
    var t = TYPES[b.type], bud = budgetOf(b);
    if (!t || !isMoney(bud) || !isMoney(b.bid) || Number(bud) < Number(b.bid)) { return null; }
    return { n: Math.floor(Number(bud) / Number(num(b.bid))) * t.per, unit: t.unit };
  }

  /* Every rule, keyed by field, in the order the fields appear. The messages
     are PM's where PM wrote one; the rest follow plan CC-4 to CC-10. */
  function errors(b) {
    var e = {}, t = TYPES[b.type];
    if (!t) { e.type = 'Pick a campaign type.'; return e; }
    if (!b.platforms.length) { e.platforms = 'Pick at least one platform.'; }
    if (!b.name.trim()) { e.name = 'Give the campaign a name.'; }
    if (!b.product.trim()) { e.product = "Name the product you're promoting."; }
    if (b.type === 'engagement') {
      var pl = PLATS[b.platforms[0]] || PLATS.youtube, other = b.platforms[0] === 'instagram' ? 'youtube' : 'instagram';
      var url = b.postUrl.trim().toLowerCase();
      var hit = function (p) { return PLATS[p].hosts.some(function (h) { return url.indexOf(h) >= 0; }); };
      if (url && hit(other)) { e.postUrl = "That's " + PLATS[other].an + ' link. ' + pl.paste; }
      else if (!url || !hit(b.platforms[0] || 'youtube')) { e.postUrl = pl.paste; }
      if (!b.actions.length) { e.actions = 'Pick at least one action.'; }
    }
    var bud = budgetOf(b);
    if (!b.budgetPick) { e.budget = 'Pick a budget.'; }
    else if (!isMoney(bud)) { e.budget = 'Set a budget above $0.'; }
    if (t.min) {
      if (!isMoney(b.bid) || Number(num(b.bid)) < t.min) { e.bid = 'The minimum rate is ' + money(t.min) + '. ' + t.minNote; }
    } else if (!isMoney(b.bid)) { e.bid = 'Set a bid above $0.'; }
    if (!e.budget && !e.bid && Number(bud) < Number(num(b.bid))) { e.budget = 'The budget has to cover at least one bid.'; }
    var s = at(b.startDate, b.startTime), en = at(b.endDate, b.endTime);
    if (!s) { e.start = 'Pick a start date.'; }
    else if (s <= new Date()) { e.start = 'Pick a start time in the future.'; }
    if (!en) { e.end = 'Pick an end date.'; }
    else if (s && en <= s) { e.end = 'The end has to be after the start.'; }
    if (b.note.length > 500) { e.note = 'Keep it under 500 characters.'; }
    return e;
  }

  var STEP_OF = { type: 0, platforms: 1, name: 1, product: 1, postUrl: 1, actions: 1, site: 1, refs: 1,
    budget: 2, bid: 2, start: 2, end: 2, market: 3, note: 3 };
  // how the Review step names a field it is waiting on
  var NAMES = { type: 'campaign type', platforms: 'platform', name: 'campaign name', product: 'product name',
    postUrl: 'video URL', actions: 'action', budget: 'budget', bid: 'bid', start: 'start', end: 'end', note: 'notes' };

  function stepErrors(b, i) {
    var e = errors(b), out = {};
    Object.keys(e).forEach(function (k) { if (STEP_OF[k] === i) { out[k] = e[k]; } });
    return out;
  }
  function stepValid(b, i) { return !Object.keys(stepErrors(b, i)).length; }
  function and(a) { return a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]; }
  // names every field still missing, by step: "Missing: product name and video URL (step 1)."
  function firstMissing(b) {
    var e = errors(b), keys = Object.keys(e), by = {};
    if (!keys.length) { return null; }
    keys.forEach(function (k) {
      var st = Math.max(1, STEP_OF[k]);
      (by[st] = by[st] || []).push(k === 'bid' && b.type === 'growth' ? 'rate' : NAMES[k]);
    });
    var steps = Object.keys(by);
    var text = keys.length > 3
      ? 'Missing ' + keys.length + ' fields (step' + (steps.length > 1 ? 's ' : ' ') + and(steps) + ').'
      : 'Missing: ' + steps.map(function (st) { return and(by[st]) + ' (step ' + st + ')'; }).join(', ') + '.';
    return { key: keys[0], step: STEP_OF[keys[0]], text: text };
  }

  // a draft only exists once the agency has typed or picked something of its own
  function hasInput(b) {
    var def = b.type === 'growth' ? TYPES.growth.ratePh : '';
    return !!(b.name.trim() || b.product.trim() || b.postUrl.trim() || b.site.trim() || b.refs.trim() || b.refsFiles
      || b.budgetPick || b.note.trim() || b.bid.trim() !== def);
  }

  /* The row the Campaigns list and the report read, in data.js's shape.
     It waits while the agency itself is in review (plan D2, CL-5). */
  function toRow(b, id, agencyStatus) {
    var t = TYPES[b.type], bud = Number(budgetOf(b)), bid = Number(num(b.bid));
    var market = MARKETS.filter(function (m) { return m[0] === b.market; })[0] || MARKETS[2];
    var end = at(b.endDate, b.endTime);
    var brief = JSON.parse(JSON.stringify(b));
    brief.budget = bud; brief.bid = bid; brief.zone = zone();
    return {
      id: id, title: b.name.trim(), product: b.product.trim(), kind: b.type,
      platforms: b.platforms.slice(), geo: market[1],
      done: 0, target: bid > 0 ? Math.floor(bud / bid) * t.per : 0,
      spent: '$0', budget: money(bud),
      status: agencyStatus === 'review' ? 'waiting' : 'review',
      ends: end ? end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
      brief: brief, createdAt: new Date().toISOString()
    };
  }

  /* "Create a copy" (a rejected campaign's banner): a new draft from an old
     campaign. Its brief when the wizard filed it, else its row; the name says
     it is a copy and the window starts over on blank()'s defaults. */
  function fromCampaign(c) {
    var b = blank(), src = c.brief || {}, t = src.type || (c.kind === 'engagement' ? 'engagement' : 'growth');
    setType(b, t);
    if (c.brief) {
      Object.keys(b).forEach(function (k) { if (!/^(start|end)(Date|Time)$/.test(k) && src[k] !== undefined) { b[k] = src[k]; } });
      b.bid = String(src.bid || b.bid);
    } else {
      var code = String(c.geo || '').toUpperCase(), m = MARKETS.filter(function (x) { return x[1] === code; })[0];
      b.product = c.product || '';
      if (m) { b.market = m[0]; }
    }
    b.name = (src.name || c.title || '').trim() + ' (copy)';
    b.platforms = (c.platforms || b.platforms).slice(0, t === 'engagement' ? 1 : 2);
    var bud = String(Number(num(src.budget || c.budget)) || '');
    b.budgetPick = !bud ? '' : PRESETS.indexOf(bud) >= 0 ? bud : 'custom';
    b.budgetCustom = b.budgetPick === 'custom' ? bud : '';
    return b;
  }

  window.onblueNew = {
    TYPES: TYPES, ORDER: ORDER, PLATS: PLATS, ACTIONS: ACTIONS, MARKETS: MARKETS, PRESETS: PRESETS, STEPS: STEPS,
    blank: blank, setType: setType, typeOwned: typeOwned, budgetOf: budgetOf, money: money, price: price, num: num,
    zone: zone, days: days, when: when, at: at, fmtDay: fmtDay, fmtTime: fmtTime, estimate: estimate, errors: errors, stepErrors: stepErrors,
    stepValid: stepValid, firstMissing: firstMissing, hasInput: hasInput, toRow: toRow, fromCampaign: fromCampaign, STEP_OF: STEP_OF
  };
})();
