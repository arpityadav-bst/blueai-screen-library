/* The Campaigns page, rebuilt on PM's list (campaign-report/campaigns.js, his
   "New" version): the list is the product. A big title with one live / in
   review line, then Your campaigns (search, one row of filter pills, the
   table), then Sample reports by his rule. No cards, no tabs. What is ours:
   the sidebar shell, the type tokens, the start
   card on a brand-new account's very first visit. */
(function () {
  'use strict';

  var D = window.onblueData, A = window.onblueApp, T = window.onblueCampaignsTable, esc = A.esc;
  var TODAY = D.TODAY, DAY = 864e5;

  var STATES = {
    done: D.MINE,
    running: D.MINE.filter(function (c) { return c.status !== 'completed'; }),
    // "none yet" means none of PM's demo rows: what the agency filed itself still shows
    empty: D.OWN,
    // the dock's First visit: a brand-new account, so the start card shows even
    // after campaigns have been filed in this browser
    first: []
  };
  var NO_F = { status: 'all', product: 'all', type: 'all', geo: 'all', ends: 'any' };
  var view = { state: 'done', f: Object.assign({}, NO_F), q: '', sort: { key: '', dir: '' } };
  var LIFE = ['live', 'review', 'completed', 'under', 'rejected'];

  function $(s) { return document.querySelector(s); }
  var typeOf = T.typeOf, geo = T.geo, statusKey = T.statusKey;

  // Calendar days are 'YYYY-MM-DD' keys, so a range check is a string compare (PM's custom range).
  function pad(x) { return (x < 10 ? '0' : '') + x; }
  function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function shortDate(k) { var p = k.split('-'); return new Date(+p[0], p[1] - 1, +p[2]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }
  function rangeText(r) { return r.a === r.b ? shortDate(r.a) : shortDate(r.a) + ' to ' + shortDate(r.b); }

  // ---- what is shown ----------------------------------------------------------
  function endsIn(c, when) {
    if (when === 'any') { return true; }
    if (c.status === 'rejected') { return false; } // it never ran, so it has no end
    var d = new Date(c.ends);
    if (when === 'custom') { return !view.range || (iso(d) >= view.range.a && iso(d) <= view.range.b); }
    if (when === 'next7') { return d >= TODAY && d <= new Date(+TODAY + 7 * DAY); }
    var m = when === 'this' ? TODAY.getMonth() : TODAY.getMonth() - 1;
    var ref = new Date(TODAY.getFullYear(), m, 1);
    return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
  }

  /* PM's pills in his order. A pill only shows when the rows differ on it;
     Ends on always shows (filters.js: a `fixed` def). */
  var DEFS = [
    { k: 'status', label: 'Status', plural: 'statuses', of: statusKey,
      name: function (v) { return D.STATUS[v][0]; },
      order: function (a, b) { return LIFE.indexOf(a) - LIFE.indexOf(b); } },
    { k: 'product', label: 'Product', plural: 'products', of: function (c) { return c.product; } },
    { k: 'type', label: 'Type', plural: 'types', of: typeOf },
    { k: 'geo', label: 'Geography', plural: 'geographies', of: function (c) { return geo(c.geo); } },
    { k: 'ends', label: 'Ends on', plural: 'dates', fixed: function (rows) {
      return [['any', 'Any time'], ['next7', 'Next 7 days'], ['this', 'This month'], ['last', 'Last month'], ['custom', 'Custom range']].map(function (o) {
        return [o[0], o[1], o[0] === 'custom' ? '' : rows.filter(function (c) { return endsIn(c, o[0]); }).length];
      });
    },
      range: function () { return view.range; },
      shown: function (v) { return v === 'custom' && view.range ? rangeText(view.range) : null; } }
  ];

  function matches(c) {
    var f = view.f;
    if (f.status !== 'all' && statusKey(c) !== f.status) { return false; }
    if (f.product !== 'all' && c.product !== f.product) { return false; }
    if (f.type !== 'all' && typeOf(c) !== f.type) { return false; }
    if (f.geo !== 'all' && geo(c.geo) !== f.geo) { return false; }
    if (!endsIn(c, f.ends)) { return false; }
    var q = view.q.trim().toLowerCase().replace(/^#/, '');
    return !q || c.title.toLowerCase().indexOf(q) >= 0 || c.id.indexOf(q) >= 0;
  }

  function sorted(rows) {
    var s = view.sort;
    if (!s.key) { return rows; } // newest first, as the API sends them
    var val = {
      name: function (c) { return c.title.toLowerCase(); },
      ends: function (c) { return c.status === 'rejected' ? null : +new Date(c.ends); },
      fill: function (c) { return c.done; }
    }[s.key];
    return rows.slice().sort(function (a, b) {
      var x = val(a), y = val(b);
      if (x === null || y === null) { return x === y ? 0 : x === null ? 1 : -1; } // "Did not run" sinks either way
      var d = x < y ? -1 : x > y ? 1 : 0;
      return s.dir === 'asc' ? d : -d;
    });
  }

  function filtered() {
    return view.q.trim() !== '' || Object.keys(NO_F).some(function (k) { return view.f[k] !== NO_F[k]; });
  }

  // ---- agency status --------------------------------------------------------------
  /* It speaks from the sidebar's agency card now (shell.js, onblueApp.agencyNote):
     "in review" stays there by itself; approval is said once, the moment it happens. */
  function sayApproved(moved) {
    // the title is one short line; whose approval it is, the identity row already says
    A.agencyNote('You&rsquo;re approved', 'Campaigns you submit now go straight to review.'
      + (moved ? ' ' + moved + ' waiting campaign' + (moved > 1 ? 's' : '') + ' moved into review.' : ''));
  }

  // ---- Your campaigns -------------------------------------------------------------
  function renderList() {
    var rows = STATES[view.state];
    $('#search').hidden = !rows.length;
    $('#toolbar').hidden = !rows.length;
    var shown = sorted(rows.filter(matches));
    window.onblueFilters.current = function (k) { return view.f[k]; };
    window.onblueFilters.render($('#pills'), DEFS, rows, view.f, function (k, v, r) { view.f[k] = v; if (r) { view.range = r; } renderList(); });
    if (filtered()) { $('#pills').insertAdjacentHTML('beforeend', '<button class="app-link" type="button" data-clear>Clear filters</button>'); }
    $('#count').textContent = shown.length === rows.length ? rows.length + ' campaigns' : shown.length + ' of ' + rows.length + ' campaigns';
    $('#mine').innerHTML = T.table(shown, '<div class="list-filtered">No campaigns match these filters. <button class="app-link" type="button" data-clear>Clear filters</button></div>', view.sort);
  }

  function render() {
    var rows = STATES[view.state];
    var live = rows.filter(function (c) { return c.status === 'live'; }).length;
    var review = rows.filter(function (c) { return statusKey(c) === 'review'; }).length;
    // an account with no campaigns of its own always gets the start card (Appy, final)
    var start = !rows.length;
    $('#sub').hidden = !rows.length;
    $('#sub').innerHTML = '<b>' + live + '</b> live &middot; <b>' + review + '</b> in review';
    $('#empty').hidden = !start;
    // the start card is itself the way in; the plain empty card keeps the header's
    $('#head-new').hidden = start;
    $('#empty-create-sub').textContent = A.session.status === 'review'
      ? 'Draft it now. It goes into review once ' + A.session.agency + ' is approved.'
      : 'Set a budget and grow on YouTube. You pay only for what your campaign delivers.';
    $('#mine-sect').hidden = start;
    if (!start) { renderList(); }
    // PM's rule: samples are for an agency that has not seen a finished report of its own.
    // Asked for by name (the sidebar's Sample reports, a sample's breadcrumb), they always show.
    var showSamples = location.hash === '#samples' || !rows.some(function (c) { return c.status === 'completed'; });
    $('#samples').hidden = !showSamples;
    $('#sample-list').innerHTML = showSamples ? T.table(D.SAMPLES, '', null) : '';
    A.setCount(live);
    document.querySelectorAll('[data-state]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.state === view.state)); });
    document.querySelectorAll('[data-agency]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.agency === A.session.status)); });
  }

  function open(id) {
    window.location.href = 'campaign.html?id=' + encodeURIComponent(id);
  }

  function resetFilters() { view.f = Object.assign({}, NO_F); view.range = null; view.q = ''; $('#q').value = ''; }

  // prototype: there is no server, so a refresh only says what it would have found.
  // The agency's status has no refresh: it is read on every load.
  function refresh(b) {
    b.classList.add('is-spinning');
    setTimeout(function () { b.classList.remove('is-spinning'); A.flash(b, 'Campaigns are up to date'); }, 700);
  }

  document.addEventListener('click', function (e) {
    var t = e.target;
    var cp = t.closest('[data-copy]');
    if (cp) {
      try { navigator.clipboard.writeText(cp.dataset.copy).catch(function () {}); } catch (err) { /* the toast still names it */ }
      A.toast('Copied ' + cp.dataset.copy);
      return;
    }
    var o = t.closest('[data-open]');
    if (o) { open(o.dataset.open); return; }
    var so = t.closest('[data-sort]');
    if (so) {
      // PM's first click: names A to Z, dates latest first, fill highest first. Then it flips.
      var k = so.dataset.sort, first = k === 'name' ? 'asc' : 'desc';
      view.sort = view.sort.key === k ? { key: k, dir: view.sort.dir === 'asc' ? 'desc' : 'asc' } : { key: k, dir: first };
      renderList();
      return;
    }
    if (t.closest('[data-clear]')) { resetFilters(); renderList(); return; }
    var rf = t.closest('[data-refresh]');
    if (rf) { refresh(rf); return; }
    var st = t.closest('[data-state]');
    if (st) { view.state = st.dataset.state; resetFilters(); view.sort = { key: '', dir: '' }; save(); render(); return; }
    var ag = t.closest('[data-agency]');
    if (ag) {
      var approving = A.session.status === 'review' && ag.dataset.agency === 'approved';
      // promote before setStatus, which promotes too, so the count is the real one
      var moved = ag.dataset.agency === 'approved' ? D.promoteWaiting() : 0;
      A.setStatus(ag.dataset.agency);
      if (approving) { sayApproved(moved); }
      render();
    }
  });

  document.addEventListener('keydown', function (e) {
    var r = e.target.closest && !e.target.closest('[data-copy]') && e.target.closest('.row[data-open]');
    if (r && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); open(r.dataset.open); }
  });

  $('#q').addEventListener('input', function (e) { view.q = e.target.value; renderList(); });

  function save() { try { localStorage.setItem('onblue-app-state', view.state); } catch (e) { /* storage off */ } }
  (function load() {
    // an agency in review has no campaigns of its own yet: it lands on the empty account
    var saved = '';
    try { saved = localStorage.getItem('onblue-app-state') || ''; } catch (e) { /* default */ }
    view.state = A.session.justRegistered ? 'empty' : saved || (A.session.status === 'review' ? 'empty' : view.state);
    if (A.session.justRegistered) { save(); }
    var q = new URLSearchParams(location.search).get('state');
    if (q) { view.state = q; }
    if (!STATES[view.state]) { view.state = 'done'; }
  })();

  function toSamples() { var el = $('#samples'); if (location.hash === '#samples' && el && !el.hidden) { el.scrollIntoView({ block: 'start' }); } }
  window.addEventListener('hashchange', function () { render(); toSamples(); });

  render();
  toSamples();
  // straight from registering: shell.js turns the gate's one-shot flag into justRegistered
  if (A.session.justRegistered) { A.toast('Agency submitted'); }
  // the wizard lands here with ?saved=1 (closed) or ?submitted=1 (filed); one-shot flags
  var flag = new URLSearchParams(location.search);
  if (flag.get('saved') === '1' || flag.get('submitted') === '1') {
    A.toast(flag.get('submitted') === '1' ? 'Campaign submitted' : 'Draft saved');
    history.replaceState(null, '', location.pathname + location.hash);
  }
})();
