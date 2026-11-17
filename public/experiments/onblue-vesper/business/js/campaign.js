/* The Campaign page: the draft first, then where it stands (Ashish,
   2026-11-17). Four cards, each one question group, all prefilled from the
   brand profile and the report (a "From your report" tag says which); one
   sticky bar with Save draft and the one primary, Submit for review. After
   submitting, the page becomes the tracker the product uses: Submitted, In
   review, Live, Report. Data: js/campaign-draft.js. */
(function () {
  'use strict';
  var OB = window.OB, A = OB.app, r = A.r, e = OB.esc, D = OB.draft;
  var main = document.querySelector('[data-main]');
  var d = D.get(r) || D.make(r);
  var from = '<span class="ob-cp-from">' + OB.icon('check', 11) + 'From your report</span>';

  function picks(key, list, val) {
    return '<div class="ob-picks" data-pick="' + key + '">' + list.map(function (p) {
      return '<button class="ob-pick" type="button" aria-pressed="' + (String(p) === String(val)) + '" data-v="' + e(p) + '">' + e(typeof p === 'number' ? '$' + OB.fmt(p) : p) + (p === 2000 ? '<small>Suggested</small>' : '') + '</button>';
    }).join('') + '</div>';
  }
  function field(label, body, opts) {
    opts = opts || {};
    return '<div class="ob-cp-f"><div class="ob-cp-l"><label' + (opts.id ? ' for="' + opts.id + '"' : '') + '>' + e(label) + '</label>' + (opts.from ? from : '') + (opts.opt ? '<span class="ob-cp-opt">Optional</span>' : '') + '</div>' +
      (opts.hint ? '<p class="ob-cp-hint">' + e(opts.hint) + '</p>' : '') + body + '</div>';
  }
  function card(n, title, sub, body) {
    // the first card leads, lit like each page's lead card (Brand, Plan)
    return '<section class="ob-card' + (n === 1 ? ' ob-card--lit' : '') + ' ob-cp-card"><header><span class="ob-cp-n">' + n + '</span><div><h2 class="ob-pg-h3">' + e(title) + '</h2><p class="ob-pg-p">' + e(sub) + '</p></div></header>' + body + '</section>';
  }
  function views(b) { return OB.fmt(b / OB.RATE * 1000); }
  function day(iso) { var t = new Date(iso + 'T12:00:00'); return isNaN(t) ? e(iso) : t.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }

  function form() {
    var growth = d.type === 'growth';
    var ideas = (r.angles || []).map(function (a) {
      var on = d.ideas.indexOf(a.who) > -1;
      return '<button class="ob-cp-idea" type="button" role="checkbox" aria-checked="' + on + '" data-idea="' + e(a.who) + '"><small>' + e(a.who) + '</small><b>' + e(a.say) + '</b><span class="ob-chip">' + e(a.format) + '</span><i>' + OB.icon('check', 12) + '</i></button>';
    }).join('');
    var refs = d.refs.map(function (s) { return '<span class="ob-chip ob-cp-ref">' + e(s) + '<button type="button" aria-label="Remove ' + e(s) + '" data-unref="' + e(s) + '">' + OB.icon('close', 12) + '</button></span>'; }).join('');
    var custom = D.BUDGETS.indexOf(d.budget) < 0;
    return '<header class="ob-p-head ob-pg-head"><div><h1 class="ob-p-title">Your first campaign</h1><p class="ob-p-lede">' + (d.fromAI ? 'Drafted by your AI assistant with the BlueAI MCP. Check it, change anything, then send it to us for review.' : 'Started from your brand profile and report. Change anything, then send it to us for review.') + '</p></div></header>' +
      '<form class="ob-cp" data-form novalidate>' +
      card(1, 'About you', 'So we know who we are working with.',
        field('Your name', '<input class="ob-input" id="cp-name" data-k="you.name" value="' + e(d.you.name) + '" placeholder="Your first name" autocomplete="given-name">', { id: 'cp-name' }) +
        field('What matters most right now?', picks('you.goal', D.GOALS, d.you.goal)) +
        field('Do you make short videos today?', picks('you.today', D.TODAY, d.you.today))) +
      card(2, 'What to promote', 'What the videos are about.',
        field('Campaign type', '<div class="ob-cp-types" data-pick="type">' +
          '<button type="button" class="ob-cp-type" aria-pressed="' + growth + '" data-v="growth"><b>Video growth</b><span>We make the Shorts from your video ideas, and creators post them.</span></button>' +
          '<button type="button" class="ob-cp-type" aria-pressed="' + !growth + '" data-v="engagement"><b>Video engagement</b><span>You already posted a video. Creators bring it views, likes and comments.</span></button></div>') +
        field('Campaign name', '<input class="ob-input" id="cp-cname" data-k="name" value="' + e(d.name) + '">', { id: 'cp-cname' }) +
        field('Product or service', '<input class="ob-input" id="cp-prod" data-k="product" value="' + e(d.product) + '">', { id: 'cp-prod', from: true }) +
        (growth
          ? field('Video ideas to make', '<div class="ob-cp-ideas" data-ideas>' + ideas + '</div>', { from: true, hint: 'Our team makes a Short for each idea you keep, and you approve each one before it posts.' }) +
            field('Brands whose look and tone to learn from', '<div class="ob-cp-refs">' + refs + '</div><div class="ob-add ob-cp-add"><input class="ob-input" data-addref placeholder="Add a site, like rival.com" aria-label="Add a reference site"><button class="ob-btn" type="button" data-ref>' + OB.icon('plus', 16) + 'Add</button></div>', { from: true, opt: true })
          : field('Your YouTube video', '<input class="ob-input" id="cp-video" data-k="video" value="' + e(d.video) + '" placeholder="https://youtube.com/shorts/...">', { id: 'cp-video' }))) +
      card(3, 'Budget and dates', 'You pay only for the views your videos get.',
        field('Budget for this campaign', picks('budget', D.BUDGETS.concat(['Other']), custom ? 'Other' : d.budget) +
          (custom ? '<input class="ob-input ob-cp-amt" type="number" min="100" step="50" data-k="budget" value="' + d.budget + '" aria-label="Budget in dollars">' : '') +
          '<p class="ob-cp-say" data-say>Pays for up to <b>' + views(d.budget) + '</b> views at $' + OB.RATE + ' per 1,000. Whatever isn\'t used is never charged.</p>') +
        '<div class="ob-cp-two">' + field('Starts', '<input class="ob-input" type="date" id="cp-start" data-k="start" value="' + d.start + '">', { id: 'cp-start' }) +
        field('Ends', '<input class="ob-input" type="date" id="cp-end" data-k="end" value="' + d.end + '">', { id: 'cp-end' }) + '</div>') +
      card(4, 'Where it runs', 'Where your buyers are, and anything we should know.',
        field('Posts on', '<div class="ob-plats"><span class="ob-chip ob-chip--on">' + OB.icon('youtube', 14) + 'YouTube Shorts</span><span class="ob-chip ob-chip--soon">TikTok, coming</span><span class="ob-chip ob-chip--soon">Instagram, coming</span></div>') +
        field('Your buyers are in', picks('where', D.WHERE, d.where), { from: true }) +
        field('Anything else we should know?', '<textarea class="ob-input ob-cp-note" id="cp-note" data-k="note" rows="3" maxlength="500" placeholder="Audience, timing, things to avoid.">' + e(d.note) + '</textarea>', { id: 'cp-note', from: true, opt: true })) +
      '<p class="ob-cp-err" data-err role="alert" hidden></p>' +
      '<div class="ob-cp-bar"><span class="ob-cp-saved" data-saved>Draft saved</span><button class="ob-btn" type="button" data-savedraft>Save draft</button>' +
      '<button class="ob-btn ob-btn--ink" type="submit">Submit for review, $' + OB.fmt(d.budget) + OB.icon('arrow', 16) + '</button></div></form>';
  }

  var STAGES = [['Submitted', 'We have your campaign.'], ['In review', 'We check every campaign, usually within a working day.'],
    ['Live', 'Our team makes your Shorts, you approve each one, and creators post them.'], ['Report', 'Views, spend and what worked, as it happens.']];
  function tracker() {
    var at = d.status === 'live' ? 2 : 1, when = new Date(d.submitted).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    var steps = STAGES.map(function (s, i) {
      var st = i < at ? 'is-done' : i === at ? 'is-now' : '';
      return '<li class="' + st + '"><i>' + (i < at ? OB.icon('check', 12) : i + 1) + '</i><div><b>' + e(s[0]) + (i === 0 ? ' <small>' + when + '</small>' : '') + '</b><span>' + e(s[1]) + '</span></div></li>';
    }).join('');
    var mail = OB.sess('onblue:email') || r.email || '';
    return '<header class="ob-p-head ob-pg-head"><div><h1 class="ob-p-title">' + e(d.name) + '</h1><p class="ob-p-lede">' +
      (d.status === 'live' ? 'Live. Your first Shorts are being made; they wait in Studio for your yes.' : 'In review. We will email ' + (mail ? e(mail) : 'you') + ' when it is approved.') + '</p></div>' +
      '<div class="ob-pg-act">' + (d.status === 'live' ? '<a class="ob-btn ob-btn--ink" href="studio.html">Open Studio' + OB.icon('arrow', 16) + '</a>' : '<button class="ob-btn" type="button" data-withdraw>Withdraw and edit</button>') + '</div></header>' +
      '<section class="ob-card ob-card--lit ob-cp-track"><ol>' + steps + '</ol></section>' +
      '<section class="ob-card ob-cp-sum"><dl>' +
      '<div><dt>Type</dt><dd>' + (d.type === 'growth' ? 'Video growth' : 'Video engagement') + '</dd></div>' +
      '<div><dt>Product</dt><dd>' + e(d.product) + '</dd></div>' +
      (d.type === 'growth' ? '<div><dt>Video ideas</dt><dd>' + e(d.ideas.join(', ')) + '</dd></div>' : '<div><dt>Video</dt><dd>' + e(d.video) + '</dd></div>') +
      '<div><dt>Budget</dt><dd>$' + OB.fmt(d.budget) + ', up to ' + views(d.budget) + ' views</dd></div>' +
      '<div><dt>Dates</dt><dd>' + day(d.start) + ' to ' + day(d.end) + '</dd></div>' +
      '<div><dt>Buyers in</dt><dd>' + e(d.where) + '</dd></div></dl></section>' +
      // the one nudge toward the MCP: right after a first campaign, when "what next?" comes up
      '<section class="ob-card ob-cp-ai"><span class="ob-cp-ai-mark">' + OB.icon('spark', 16) + '</span><div><b>Draft the next one from your AI</b><span>Ask Claude, ChatGPT or Cursor for a brand report or a campaign draft, with the BlueAI MCP.</span></div><a class="ob-btn ob-btn--sm" href="ai.html">Set it up</a></section>' +
      (d.status === 'review' ? '<p class="ob-cp-demo">Prototype: <button class="ob-link" type="button" data-approve>mark it approved</button></p>' : '');
  }

  function render() { main.innerHTML = d.status === 'draft' ? form() : tracker(); }

  var savedT;
  function save(quiet) {
    D.save(d);
    if (d.you.name) { r.name = d.you.name; }
    A.saveReport();
    var s = main.querySelector('[data-saved]');
    if (s && !quiet) { s.classList.add('is-on'); window.clearTimeout(savedT); savedT = window.setTimeout(function () { s.classList.remove('is-on'); }, 1600); }
  }
  function set(k, v) { if (k.indexOf('you.') === 0) { d.you[k.slice(4)] = v; } else { d[k] = k === 'budget' ? Math.max(100, +v || 100) : v; } }
  function err(msg) { var b = main.querySelector('[data-err]'); b.textContent = msg; b.hidden = !msg; if (msg) { b.scrollIntoView({ behavior: 'smooth', block: 'center' }); } }
  function check() {
    if (!d.name.trim()) { return 'Give the campaign a name.'; }
    if (!d.product.trim()) { return 'Say what the videos should promote.'; }
    if (d.type === 'growth' && !d.ideas.length) { return 'Keep at least one video idea.'; }
    if (d.type === 'engagement' && !/youtu\.?be/.test(d.video)) { return 'Paste the link to your YouTube video.'; }
    if (!d.start || !d.end || d.end <= d.start) { return 'The end date has to come after the start date.'; }
    return '';
  }

  main.addEventListener('input', function (ev) {
    var k = ev.target.getAttribute('data-k'); if (!k) { return; }
    set(k, ev.target.value); save(true);
    if (k === 'budget') { var s = main.querySelector('[data-say] b'); if (s) { s.textContent = views(d.budget); } main.querySelector('[type="submit"]').firstChild.textContent = 'Submit for review, $' + OB.fmt(d.budget); }
  });
  main.addEventListener('click', function (ev) {
    var t = ev.target, p = t.closest('[data-pick] [data-v]');
    if (p) {
      var key = p.parentNode.getAttribute('data-pick'), v = p.getAttribute('data-v');
      if (key === 'budget') { d.budget = v === 'Other' ? (D.BUDGETS.indexOf(d.budget) < 0 ? d.budget : 1000) : +v; }
      else { set(key, v); }
      save(); render(); return;
    }
    var idea = t.closest('[data-idea]');
    if (idea) {
      var w = idea.getAttribute('data-idea'), i = d.ideas.indexOf(w);
      if (i > -1) { d.ideas.splice(i, 1); } else { d.ideas.push(w); }
      idea.setAttribute('aria-checked', String(i < 0)); save(); return;
    }
    var un = t.closest('[data-unref]');
    if (un) { d.refs = d.refs.filter(function (s) { return s !== un.getAttribute('data-unref'); }); save(); render(); return; }
    if (t.closest('[data-ref]')) { addRef(); return; }
    if (t.closest('[data-savedraft]')) { save(); OB.toast('Draft saved. Pick it up here any time.'); return; }
    if (t.closest('[data-withdraw]')) { d.status = 'draft'; d.submitted = 0; save(true); A.st.budgetSet = false; A.save(); render(); OB.ui.side(); OB.toast('Back to a draft'); return; }
    if (t.closest('[data-approve]')) { d.status = 'live'; save(true); A.st.budget = d.budget; A.st.budgetSet = true; A.save(); render(); OB.ui.side(); OB.toast('Approved. Your campaign is live.'); }
  });
  function addRef() {
    var inp = main.querySelector('[data-addref]'), v = OB.report.brand(inp.value.trim()).host || inp.value.trim().toLowerCase();
    if (!v) { return; }
    if (d.refs.indexOf(v) < 0) { d.refs.push(v); save(); }
    render();
    var again = main.querySelector('[data-addref]'); if (again) { again.focus(); }
  }
  main.addEventListener('keydown', function (ev) { if (ev.target.matches && ev.target.matches('[data-addref]') && ev.key === 'Enter') { ev.preventDefault(); addRef(); } });
  main.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var m = check(); err(m); if (m) { return; }
    d.status = 'review'; d.submitted = Date.now(); r.budget = d.budget; save(true);
    A.st.budget = d.budget; A.st.budgetSet = true; A.save();
    render(); OB.ui.side(); window.scrollTo({ top: 0, behavior: 'smooth' });
    OB.toast('Campaign submitted');
  });

  render();
})();
