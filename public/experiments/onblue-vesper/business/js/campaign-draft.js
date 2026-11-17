/* THE DRAFT CAMPAIGN, as data (Ashish, 2026-11-17): after the free report a
   brand drafts its first campaign. The "about you" questions the run used to
   ask (name, goal, Shorts today) live here now, beside the campaign questions
   the product asks (Volt dev's create flow: type, name, product, references,
   budget, dates, platform, market, note). Everything starts from the brand
   profile, so a brand only adds what the report could not know.
   Status, as in the product: draft -> review (submitted, in review) -> live.
   Stored in localStorage 'onblue-draft'. Exposes OB.draft. */
(function () {
  'use strict';
  var OB = window.OB, KEY = 'onblue-draft';
  var DAY = 864e5;
  function iso(t) { return new Date(t).toISOString().slice(0, 10); }

  function fresh(r) {
    var on = function (x) { return x.on && !x.checking; };
    var month = new Date().toLocaleString('en-US', { month: 'long' });
    var now = Date.now();
    return {
      v: 1, site: r.site || '', status: 'draft', type: 'growth',
      you: { name: r.name || '', goal: '', today: '' },
      name: (r.brand === 'Your brand' ? 'My' : r.brand) + ' Shorts, ' + month,
      product: r.sell || '',
      ideas: (r.angles || []).filter(function (a) { return a.on; }).map(function (a) { return a.who; }),
      refs: (r.rivals || []).filter(on).map(function (x) { return x.site; }).filter(Boolean).slice(0, 5),
      video: '',
      budget: 2000,
      start: iso(now + DAY), end: iso(now + 31 * DAY),
      where: r.where || 'United States',
      note: (r.voice ? 'How we sound: ' + r.voice + '. ' : '') + (r.edge ? 'What sets us apart: ' + r.edge + '.' : ''),
      submitted: 0
    };
  }

  // A DRAFT FROM AN AI (the BlueAI MCP's draft_campaign, src/app/api/mcp):
  // ?draft= carries what the AI chose. It opens on that site's report (a fresh
  // one when this browser has none), starts a new draft from it with the AI's
  // fields on top, and drops the parameter so a reload keeps the brand's edits.
  (function fromLink() {
    var q = new URLSearchParams(window.location.search).get('draft');
    if (!q) { return; }
    var p;
    try { p = JSON.parse(atob(q.replace(/-/g, '+').replace(/_/g, '/'))); } catch (err) { return; }
    var site = String(p.website || '').toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
    if (!site) { return; }
    var r = OB.report.get();
    if (!r || r.site !== site) { r = OB.report.make({ site: site }); r.done = 5; OB.report.save(r); }
    var d = fresh(r);
    ['name', 'product', 'where', 'note', 'start', 'end'].forEach(function (k) { if (p[k]) { d[k] = String(p[k]); } });
    if (+p.budget >= 100) { d.budget = Math.round(+p.budget); }
    if (Array.isArray(p.ideas)) { var keep = (r.angles || []).map(function (a) { return a.who; }); d.ideas = p.ideas.filter(function (w) { return keep.indexOf(w) > -1; }); if (!d.ideas.length) { d.ideas = keep; } }
    d.fromAI = 1;
    OB.store(KEY, d);
    OB.sess('onblue:signedin', '1');
    window.history.replaceState(null, '', window.location.pathname);
  })();

  OB.draft = {
    GOALS: ['More views', 'More sales', 'Launching something', 'Growing a channel'],
    TODAY: ['Not yet', 'Sometimes', 'Every week'],
    WHERE: ['United States', 'UK', 'Canada', 'Worldwide'],
    BUDGETS: [500, 2000, 5000],
    // the draft for this report's site; a new site starts a new draft
    get: function (r) {
      var d = OB.store(KEY);
      return d && d.v === 1 && d.site === (r.site || '') ? d : null;
    },
    make: function (r) { var d = fresh(r); OB.store(KEY, d); return d; },
    save: function (d) { OB.store(KEY, d); },
    status: function (r) { var d = r ? OB.draft.get(r) : OB.store(KEY); return d ? d.status : ''; }
  };
})();
