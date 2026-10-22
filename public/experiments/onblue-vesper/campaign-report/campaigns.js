/* Campaigns list prototype: the brand's first page, before a report.
   Rows are the real ones from onblue.ai on 2026-10-22; samples are the live
   page's six. "Current" copies the live page, "New" is the proposal:
   - tiles: Live, In review, Verified completions (no spend)
   - table: name, geography and time left, verified count, status
   - sample reports hide once any campaign of the brand is completed */
(function () {
  'use strict';

  var MINE = [
    // Real row, first in the list on Abhisht's ask (the live page lists it second).
    { id: 'a667ef59', title: 'BlueAIGoLive_promo_Oct1', product: 'BlueAI', geo: 'WORLDWIDE', done: 96954, target: 83333, spent: '$1.93', budget: '$100', status: 'live', left: '10 days left', report: true, ends: 'Nov 1, 2026' },
    // Demo rows, NOT real: seven foobar products and two video engagement
    // campaigns, so the Product and Type filters have something to filter.
    { id: 'f0a1b2c3', title: 'Foobar1_launch_reel', product: 'foobar1', kind: 'engagement', geo: 'US', done: 640, target: 1000, spent: '$640', budget: '$1,000', status: 'live', left: '6 days left', ends: 'Oct 28, 2026' },
    { id: '9d4e7a10', title: 'Foobar2_creator_wave', product: 'foobar2', geo: 'WORLDWIDE', done: 18450, target: 41666, spent: '$22.14', budget: '$50', status: 'live', left: '24 days left', ends: 'Nov 15, 2026' },
    { id: '5b2c8e47', title: 'Foobar3_holiday_teaser', product: 'foobar3', kind: 'engagement', geo: 'IN', done: 0, target: 500, spent: '$0', budget: '$500', status: 'review', ends: 'Nov 30, 2026' },
    { id: 'e83f4c15', title: 'Foobar6_summer_push', product: 'foobar6', geo: 'WORLDWIDE', done: 152300, target: 250000, spent: '$182.76', budget: '$300', status: 'live', left: '17 days left', ends: 'Nov 8, 2026' },
    { id: 'c7e19f02', title: 'Foobar4_how_it_works', product: 'foobar4', geo: 'US', done: 1240000, target: 1000000, spent: '$1,200', budget: '$1,200', status: 'completed', ends: 'Oct 12, 2026' },
    { id: '7f0d2b68', title: 'Foobar7_brand_story', product: 'foobar7', geo: 'US', done: 9870, target: 20833, spent: '$11.84', budget: '$25', status: 'completed', ends: 'Oct 5, 2026' },
    { id: '2a6d0b9e', title: 'Foobar5_short_series', product: 'foobar5', geo: 'IN', done: 4310, target: 16666, spent: '$5.17', budget: '$20', status: 'completed', ends: 'Sep 18, 2026' },
    // The real rows, as onblue.ai listed them on 2026-10-22.
    { id: '3e74345b', title: 'India_test_16Oct', product: 'BlueAI', geo: 'IN', done: 25, target: 41666, spent: '$0.01', budget: '$50', status: 'live', left: '10 days left', ends: 'Nov 1, 2026' },
    { id: '160442a8', title: 'testBlueAIPost2', product: 'BlueAI', geo: 'IN', done: 14, target: 16666, spent: '$0.00', budget: '$20', status: 'completed', ends: 'Oct 3, 2026' },
    { id: 'b35577de', title: 'testBlueAIpost', product: 'BlueAI', geo: 'IN', done: 0, target: 16666, spent: '$0', budget: '$20', status: 'completed', ends: 'Oct 2, 2026' },
    { id: '74584e4f', title: 'IndiaBlueAI_Promo_30Sep2026', product: 'BlueAI', geo: 'IN', done: 59, target: 16666, spent: '$0.01', budget: '$20', status: 'completed', ends: 'Oct 1, 2026' },
    { id: 'eee2ed33', title: 'IndiaBlueAI_Promo_30Sep2026', product: 'BlueAI', geo: 'IN', done: 0, target: 16666, spent: '$0', budget: '$20', status: 'rejected', reason: 'incorrect timing', ends: 'Oct 1, 2026' },
    { id: '6284790f', title: 'postVideo_BlueStacks_23Sep', product: 'BlueStacks', geo: 'WORLDWIDE', done: 0, target: 20833, spent: '$0', budget: '$25', status: 'completed', ends: 'Sep 30, 2026' }
  ];

  var SAMPLES = [
    { id: '7c2d91e4', title: 'Spring Launch: Product Reveal Short', product: 'Airtap', kind: 'engagement', geo: 'US', done: 212, target: 500, spent: '$212', budget: '$500', status: 'live', note: '7 days left', left: '7 days left', ends: 'Oct 29, 2026' },
    { id: '4b0a63f7', title: 'Creator Collab Teaser', product: 'Airtap', kind: 'engagement', geo: 'US', done: 118, target: 150, spent: '$118', budget: '$150', status: 'live', note: '3 days left', left: '3 days left', ends: 'Oct 25, 2026' },
    { id: 'd21e88ac', title: 'July Brand Anthem', product: 'Fernweh Coffee', kind: 'engagement', geo: 'US', done: 300, target: 300, spent: '$300', budget: '$300', status: 'completed', note: 'target met', ends: 'Aug 31, 2026' },
    { id: '09c4b3d5', title: 'Summer Drop Part 1', product: 'Fernweh Coffee', kind: 'engagement', geo: 'US', done: 96, target: 200, spent: '$96', budget: '$200', status: 'under', note: 'make-good applied', ends: 'Sep 6, 2026' },
    { id: 'a15d7f22', title: 'Airtap: format tests', product: 'Airtap', kind: 'growth', geo: 'US', done: 102000, target: 300000, spent: '$510', budget: '$1,500', status: 'live', note: '6 videos live', left: '8 days left', ends: 'Oct 30, 2026' },
    { id: '3e81b0c5', title: 'Fernweh Coffee: category films', product: 'Fernweh Coffee', kind: 'growth', geo: 'Worldwide', done: 0, target: 400000, spent: '$0', budget: '$2,000', status: 'review', note: 'brief with our team', ends: 'Nov 21, 2026' }
  ];

  // Tile figures per review state. The real account: 1,647 verified, $1.93 this month.
  var STATES = {
    done: { rows: MINE, verified: 1647, spend: '$1.93' },
    running: { rows: MINE.filter(function (c) { return c.status === 'live'; }), verified: 1647, spend: '$1.93' },
    empty: { rows: [], verified: 0, spend: '$0' }
  };

  var CHIPS = {
    live: ['Live', 'chip chip--live'],
    review: ['In review', 'chip chip--review'],
    completed: ['Completed', 'chip chip--done'],
    under: ['Under target', 'chip chip--under'],
    rejected: ['Rejected', 'chip chip--rejected']
  };

  var CHEV = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5.5l6.5 6.5L9 18.5"/></svg>';

  var INFO = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.1"/></svg>';

  // The day the real rows were read; the date filters count from here.
  var TODAY = new Date(2026, 9, 22);
  var DAY = 864e5;

  var NO_FILTERS = { status: 'all', product: 'all', type: 'all', geo: 'all', ends: 'any' };
  var view = { version: 'new', state: 'done', hide: {}, f: Object.assign({}, NO_FILTERS), q: '', sort: { key: '', dir: '' }, range: null };

  function $(s) { return document.querySelector(s); }
  function n(v) { return Number(v).toLocaleString('en-US'); }
  // 25 -> 25, 1,647 -> 1.6K, 96,954 -> 97K, 100,000 -> 100K, 1,000,000 -> 1M
  function compact(v) {
    var one = function (x) { return String(Math.round(x * 10) / 10); };
    if (v < 1000) return String(v);
    if (v < 10000) return one(v / 1000) + 'K';
    if (Math.round(v / 1000) < 1000) return Math.round(v / 1000) + 'K';
    return one(v / 1e6) + 'M';
  }
  function geo(g) { return /^worldwide$/i.test(g) ? 'WW' : g; }
  function typeOf(c) { return c.kind === 'engagement' ? 'Video engagement' : 'Video growth'; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]; }); }

  // ---- tiles ----------------------------------------------------------------
  function tile(label, value, sub) {
    return '<div class="tile"><span class="tile-l">' + label + '</span><span class="tile-v">' + value + '</span><span class="tile-s">' + sub + '</span></div>';
  }

  function renderTiles(st) {
    var live = st.rows.filter(function (c) { return c.status === 'live'; }).length;
    var review = st.rows.filter(function (c) { return c.status === 'review'; }).length;
    var verified = tile('Verified completions, all time', n(st.verified), 'they appear as campaigns go live');
    var inReview = tile('In review', review, 'campaigns awaiting approval');
    // New: no cards. Live and In review are one line under the title (Abhisht's
    // pick); verified completions and spend are gone.
    var isNew = view.version === 'new';
    var sub = $('#list-sub');
    sub.hidden = !(isNew && st.rows.length);
    sub.innerHTML = '<b>' + live + '</b> live &middot; <b>' + review + '</b> in review';
    $('#tiles').hidden = isNew;
    $('#tiles').innerHTML = isNew ? '' : inReview + verified + tile('Spend this month', st.spend, 'only verified completions bill');
  }

  // ---- rows -----------------------------------------------------------------
  function curNote(c, sample) {
    if (sample) return c.note;
    return { live: c.left, review: 'starts after review', completed: 'ended', rejected: 'did not run' }[c.status] || '';
  }

  function rowCurrent(c, sample) {
    var pct = c.target > 0 ? Math.min(100, Math.round(c.done / c.target * 1000) / 10) : 0;
    var growth = c.kind !== 'engagement';
    var type = growth ? 'Video growth' : 'YouTube Short';
    var meta = sample ? 'Sample &middot; ' + type + ' &middot; ' + esc(c.geo) : esc(c.product) + ' &middot; ' + type + ' &middot; ' + esc(c.geo);
    var chip = CHIPS[c.status];
    var rejected = c.status === 'rejected';
    return '<div class="crow' + (rejected ? '' : ' is-link') + '"' + (rejected ? '' : ' role="button" tabindex="0" data-open="' + c.id + '"') + '>'
      + '<span class="c-id"><span class="c-name">' + esc(c.title) + '<i>#' + c.id + '</i></span><span class="c-meta">' + meta + '</span></span>'
      + '<span class="c-fill"><span><b>' + n(c.done) + '</b> of ' + n(c.target) + (growth ? ' verified views' : '') + ' &middot; ' + curNote(c, sample) + '</span>'
      + '<span class="c-bar"><i style="width:' + pct + '%"></i></span></span>'
      + '<span class="c-spend"><b>' + c.spent + '</b><span>of ' + c.budget + '</span></span>'
      + '<span><span class="' + chip[1] + '">' + chip[0] + '</span></span>'
      + (rejected ? '<span class="c-why">' + esc(c.reason) + '</span>' : '<span class="c-go">View report' + CHEV + '</span>')
      + '</div>';
  }

  // One line per cell: no meta line under the name, no reason under the chip.
  // Ended campaigns' dates are placeholders until we read the real endAt.
  function endsOn(c) {
    return c.status === 'rejected' ? 'Did not run' : c.ends;
  }

  function rowNew(c, sample) {
    var growth = c.kind !== 'engagement';
    var chip = CHIPS[c.status];
    var rejected = c.status === 'rejected';
    var info = rejected
      ? '<span class="c-info" tabindex="0" role="img" aria-label="Reason: ' + esc(c.reason) + '" data-tip="Reason: ' + esc(c.reason) + '">' + INFO + '</span>'
      : '';
    return '<div class="crow' + (rejected ? '' : ' is-link') + '"' + (rejected ? '' : ' role="button" tabindex="0" data-open="' + c.id + '"') + '>'
      + '<span class="c-name"><span class="c-title" title="' + esc(c.title) + '">' + esc(c.title) + '</span>'
      + '<button class="c-hash" type="button" data-copy="#' + c.id + '" title="Copy campaign ID">#' + c.id + '</button></span>'
      + '<span class="c-cell">' + esc(c.product) + '</span>'
      + '<span class="c-cell">' + (growth ? 'Video growth' : 'Video engagement') + '</span>'
      + '<span class="c-geo">' + esc(geo(c.geo)) + '</span>'
      + '<span class="c-time">' + endsOn(c) + '</span>'
      + '<span class="c-num"><b>' + compact(c.done) + '</b> <span>' + (growth ? 'views' : 'completions') + '</span></span>'
      + '<span class="c-state"><span class="' + chip[1] + '">' + chip[0] + '</span>' + info + '</span>'
      + '<span class="c-chev">' + (rejected ? '' : CHEV) + '</span>'
      + '</div>';
  }

  // A sortable heading: the arrow shows only on the column the list is sorted by.
  function th(key, label, sortable) {
    if (!sortable) return '<span>' + label + '</span>';
    var on = view.sort.key === key;
    var arrow = !on ? '' : view.sort.dir === 'asc' ? ' &uarr;' : ' &darr;';
    return '<span><button class="th' + (on ? ' is-on' : '') + '" type="button" data-sort="' + key + '">' + label + arrow + '</button></span>';
  }

  function table(rows, sample, emptyHtml, sortable) {
    var isNew = view.version === 'new';
    var head = isNew
      ? '<div class="crow crow--head">' + th('name', 'Campaign', sortable) + '<span>Product</span><span>Type</span><span>Geography</span>'
        + th('ends', 'Ends on', sortable) + th('fill', 'Fill', sortable) + '<span>Status</span><span></span></div>'
      : '<div class="crow crow--head"><span>Campaign</span><span>Fill</span><span>Spend</span><span>Status</span><span></span></div>';
    var body = rows.map(function (c) { return isNew ? rowNew(c, sample) : rowCurrent(c, sample); }).join('');
    return '<div class="clist' + (isNew ? ' clist--new' : '') + '">' + head + (body || emptyHtml) + '</div>';
  }

  // ---- filters (new version) -------------------------------------------------
  // A pill only appears when the brand's campaigns differ on it: a brand with one
  // product never sees a Product filter. "Ends on" always shows.
  var PILLS = [
    { k: 'status', label: 'Status', plural: 'statuses', of: function (c) { return c.status; }, name: function (v) { return CHIPS[v][0]; } },
    { k: 'product', label: 'Product', plural: 'products', of: function (c) { return c.product; } },
    { k: 'type', label: 'Type', plural: 'types', of: typeOf },
    { k: 'geo', label: 'Geography', plural: 'geographies', of: function (c) { return geo(c.geo); } }
  ];
  // A list longer than this gets a search field at the top of its menu.
  var SEARCH_OVER = 7;
  var ENDS = [['any', 'Any time'], ['next7', 'Next 7 days'], ['this', 'This month'], ['last', 'Last month'], ['custom', 'Custom range']];

  // Calendar days are 'YYYY-MM-DD' keys, so a range check is a string compare.
  function pad(x) { return (x < 10 ? '0' : '') + x; }
  function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function fromIso(k) { var p = k.split('-'); return new Date(+p[0], p[1] - 1, +p[2]); }
  function shortDate(k, year) {
    return fromIso(k).toLocaleDateString('en-US', year ? { month: 'short', day: 'numeric', year: 'numeric' } : { month: 'short', day: 'numeric' });
  }
  function rangeText(r) { return r.a === r.b ? shortDate(r.a) : shortDate(r.a) + ' to ' + shortDate(r.b); }

  function endsIn(c, when, range) {
    if (when === 'any') return true;
    if (c.status === 'rejected') return false; // it never ran, so it has no end
    if (when === 'custom') {
      range = range || view.range;
      var k = iso(new Date(c.ends));
      return !range || (k >= range.a && k <= range.b);
    }
    var d = new Date(c.ends);
    if (when === 'next7') return d >= TODAY && d <= new Date(+TODAY + 7 * DAY);
    var m = when === 'this' ? TODAY.getMonth() : TODAY.getMonth() - 1;
    var ref = new Date(TODAY.getFullYear(), m, 1);
    return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
  }

  function matches(c) {
    var f = view.f;
    if (PILLS.some(function (p) { return f[p.k] !== 'all' && p.of(c) !== f[p.k]; })) return false;
    if (!endsIn(c, f.ends)) return false;
    var q = view.q.trim().toLowerCase().replace(/^#/, '');
    return !q || c.title.toLowerCase().indexOf(q) >= 0 || c.id.indexOf(q) >= 0;
  }

  function sorted(rows) {
    var s = view.sort;
    if (!s.key) return rows; // newest first, as the API sends them
    var val = {
      name: function (c) { return c.title.toLowerCase(); },
      ends: function (c) { return c.status === 'rejected' ? null : +new Date(c.ends); },
      fill: function (c) { return c.done; }
    }[s.key];
    return rows.slice().sort(function (a, b) {
      var x = val(a), y = val(b);
      if (x === null || y === null) return x === y ? 0 : x === null ? 1 : -1; // "Did not run" sinks either way
      var d = x < y ? -1 : x > y ? 1 : 0;
      return s.dir === 'asc' ? d : -d;
    });
  }

  function isFiltered() {
    return view.q.trim() !== '' || Object.keys(NO_FILTERS).some(function (k) { return view.f[k] !== NO_FILTERS[k]; });
  }

  // Each pill opens its own menu (not the native list) so a long one can be
  // searched. menus[k] holds what the open menu needs: label, plural, options.
  var menus = {};

  function pill(k, label, plural, opts, value, shown) {
    menus[k] = { label: label, plural: plural, opts: opts };
    var cur = opts.filter(function (o) { return o[0] === value; })[0] || opts[0];
    return '<span class="pill-wrap"><button class="sel' + (value !== opts[0][0] ? ' is-set' : '') + '" type="button" data-pill="' + k + '" aria-haspopup="listbox" aria-expanded="false">'
      + '<span class="sel-k">' + label + '</span><span class="sel-v">' + esc(shown || cur[1]) + '</span></button></span>';
  }

  function renderFilters(rows, shown) {
    var on = view.version === 'new' && rows.length > 0;
    openK = null; // the bar is rebuilt below, open menu included
    $('#mine-filters').hidden = !on;
    $('#mine-search').hidden = !on;
    if (!on) return;
    var html = PILLS.map(function (p) {
      var vals = [];
      rows.forEach(function (c) { var v = p.of(c); if (vals.indexOf(v) < 0) vals.push(v); });
      if (vals.length < 2) return '';
      // Statuses in their lifecycle order, everything else A to Z (foobar2 before foobar10).
      var order = Object.keys(CHIPS);
      vals.sort(p.k === 'status'
        ? function (a, b) { return order.indexOf(a) - order.indexOf(b); }
        : function (a, b) { return a.localeCompare(b, 'en', { numeric: true, sensitivity: 'base' }); });
      var count = function (v) { return rows.filter(function (c) { return p.of(c) === v; }).length; };
      var opts = [['all', 'All', rows.length]].concat(vals.map(function (v) { return [v, p.name ? p.name(v) : v, count(v)]; }));
      return pill(p.k, p.label, p.plural, opts, view.f[p.k]);
    }).join('') + pill('ends', 'Ends on', 'dates', ENDS.map(function (o) {
      return [o[0], o[1], o[0] === 'custom' ? '' : rows.filter(function (c) { return endsIn(c, o[0]); }).length];
    }), view.f.ends, view.f.ends === 'custom' && view.range ? rangeText(view.range) : null);
    html += isFiltered() ? '<button class="link-btn" type="button" data-clear>Clear filters</button>' : '';
    html += '<span class="count">' + (shown === rows.length ? rows.length + ' campaigns' : shown + ' of ' + rows.length + ' campaigns') + '</span>';
    $('#mine-filters').innerHTML = html;
  }

  // ---- the pill menu -----------------------------------------------------------
  var openK = null;

  function closeMenu(refocus) {
    var m = $('#pmenu');
    if (m) m.remove();
    var b = openK && document.querySelector('[data-pill="' + openK + '"]');
    if (b) { b.setAttribute('aria-expanded', 'false'); if (refocus) b.focus({ preventScroll: true }); }
    openK = null;
  }

  function openMenu(k) {
    closeMenu(false);
    var b = document.querySelector('[data-pill="' + k + '"]');
    var m = menus[k];
    var long = m.opts.length > SEARCH_OVER;
    var el = document.createElement('div');
    el.className = 'pmenu';
    el.id = 'pmenu';
    el.innerHTML = (long
      ? '<label class="pmenu-search"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>'
        + '<input type="text" placeholder="Search ' + m.plural + '" autocomplete="off" aria-label="Search ' + m.plural + '"></label>'
      : '')
      + '<ul class="pmenu-list" role="listbox" tabindex="-1" aria-label="' + m.label + '">'
      + m.opts.map(function (o) {
        var sel = o[0] === view.f[k];
        return '<li role="option" data-v="' + esc(o[0]) + '" aria-selected="' + sel + '">'
          + '<span class="pmenu-ck" aria-hidden="true">' + (sel ? '&#10003;' : '') + '</span>'
          + '<span class="pmenu-t">' + esc(o[1]) + '</span><span class="pmenu-n">' + (o[0] === 'custom' ? '&rsaquo;' : o[2]) + '</span></li>';
      }).join('')
      + '</ul><p class="pmenu-none" hidden>No ' + m.plural + ' match.</p>';
    b.parentNode.appendChild(el);
    b.setAttribute('aria-expanded', 'true');
    openK = k;
    place(el);
    setActive(el.querySelector('[aria-selected="true"]') || el.querySelector('li'));
    var q = el.querySelector('input');
    if (q) q.focus({ preventScroll: true }); else el.querySelector('.pmenu-list').focus({ preventScroll: true });
  }

  // Keep the menu on screen: open leftwards if it would run off the right edge,
  // then nudge it in if that pushes it off the left (a narrow phone).
  function place(el) {
    el.classList.remove('is-right');
    el.style.transform = '';
    if (el.getBoundingClientRect().right > window.innerWidth - 12) el.classList.add('is-right');
    var left = el.getBoundingClientRect().left;
    if (left < 12) el.style.transform = 'translateX(' + Math.round(12 - left) + 'px)';
  }

  function visibleItems() {
    return Array.prototype.filter.call(document.querySelectorAll('#pmenu li'), function (li) { return !li.hidden; });
  }

  // Scroll only the menu's own list, never the page (scrollIntoView moves both).
  function scrollWithin(box, el, center) {
    var b = box.getBoundingClientRect(), r = el.getBoundingClientRect();
    if (center) box.scrollTop += (r.top - b.top) - (b.height - r.height) / 2;
    else if (r.top < b.top) box.scrollTop -= b.top - r.top;
    else if (r.bottom > b.bottom) box.scrollTop += r.bottom - b.bottom;
  }

  // The highlighted option: moved by the arrow keys and by the mouse alike.
  function setActive(li, noScroll) {
    document.querySelectorAll('#pmenu li.is-active').forEach(function (x) { x.classList.remove('is-active'); });
    if (!li) return;
    li.classList.add('is-active');
    if (!noScroll) scrollWithin(li.parentNode, li, false);
  }

  function filterMenu(q) {
    q = q.trim().toLowerCase();
    var first = null;
    document.querySelectorAll('#pmenu li').forEach(function (li) {
      var hit = !q || li.querySelector('.pmenu-t').textContent.toLowerCase().indexOf(q) >= 0;
      li.hidden = !hit;
      if (hit && !first) first = li;
    });
    $('#pmenu .pmenu-none').hidden = !!first;
    setActive(first);
  }

  // ---- custom range: the Ends on menu turns into the report's calendar ---------
  // First click picks the start, second the end (earlier than the start swaps them).
  var cal = null;

  function showCal() {
    var el = $('#pmenu');
    var rows = STATES[view.state].rows.filter(function (c) { return c.status !== 'rejected'; });
    var keys = rows.map(function (c) { return iso(new Date(c.ends)); }).concat(iso(TODAY)).sort();
    var m = fromIso(keys[0]), last = fromIso(keys[keys.length - 1]), months = '';
    m = new Date(m.getFullYear(), m.getMonth(), 1);
    while (m <= last) {
      var y = m.getFullYear(), mo = m.getMonth(), cells = '', d;
      for (d = 0; d < new Date(y, mo, 1).getDay(); d++) cells += '<span></span>';
      for (d = 1; d <= new Date(y, mo + 1, 0).getDate(); d++) {
        var k = iso(new Date(y, mo, d));
        cells += '<button type="button" class="cal-day' + (k === iso(TODAY) ? ' is-today' : '') + '" data-day="' + k + '">' + d + '</button>';
      }
      months += '<div class="cal-month"><div class="cal-mlabel">' + m.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase() + '</div>'
        + '<div class="cal-grid">' + cells + '</div></div>';
      m = new Date(y, mo + 1, 1);
    }
    cal = { a: view.range ? view.range.a : null, b: view.range ? view.range.b : null, pickEnd: false, rows: rows };
    el.classList.add('is-cal');
    el.innerHTML = '<div class="cal-fields"><span class="cal-field" data-cf="a"></span><span class="cal-to">to</span><span class="cal-field" data-cf="b"></span></div>'
      + '<p class="cal-count" data-cf="n"></p>'
      + '<div class="cal-dow">' + ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(function (x) { return '<span>' + x + '</span>'; }).join('') + '</div>'
      + '<div class="cal-months">' + months + '</div>'
      + '<div class="cal-acts"><button class="btn" type="button" data-cal-cancel>Cancel</button>'
      + '<button class="btn btn-solid" type="button" data-cal-apply>Apply</button></div>';
    place(el);
    markCal();
    var start = el.querySelector('[data-day="' + (cal.a || iso(TODAY)) + '"]');
    if (start) { scrollWithin(el.querySelector('.cal-months'), start, true); start.focus({ preventScroll: true }); }
  }

  function markCal() {
    var el = $('#pmenu');
    el.querySelectorAll('[data-day]').forEach(function (b) {
      var k = b.dataset.day, lo = cal.a, hi = cal.b || cal.a;
      b.classList.toggle('in-range', !!lo && k >= lo && k <= hi);
      b.classList.toggle('is-start', k === lo);
      b.classList.toggle('is-end', k === hi);
    });
    var fa = el.querySelector('[data-cf="a"]'), fb = el.querySelector('[data-cf="b"]');
    fa.textContent = cal.a ? shortDate(cal.a, true) : 'Start date';
    fb.textContent = cal.b ? shortDate(cal.b, true) : 'End date';
    fa.classList.toggle('is-empty', !cal.a);
    fb.classList.toggle('is-empty', !cal.b);
    fa.classList.toggle('is-on', !cal.pickEnd);
    fb.classList.toggle('is-on', cal.pickEnd);
    var n = cal.a && cal.b ? cal.rows.filter(function (c) { return endsIn(c, 'custom', cal); }).length : 0;
    el.querySelector('[data-cf="n"]').textContent = !cal.a ? 'Pick the first day'
      : !cal.b ? 'Now pick the last day'
      : n === 1 ? '1 campaign ends in this range' : n + ' campaigns end in this range';
    el.querySelector('[data-cal-apply]').disabled = !(cal.a && cal.b);
  }

  function pickDay(k) {
    if (!cal.pickEnd) { cal.a = k; cal.b = null; cal.pickEnd = true; }
    else { if (k < cal.a) { cal.b = cal.a; cal.a = k; } else { cal.b = k; } cal.pickEnd = false; }
    markCal();
  }

  function applyCal() {
    view.f.ends = 'custom';
    view.range = { a: cal.a, b: cal.b };
    closeMenu(false);
    renderMine();
    var b = document.querySelector('[data-pill="ends"]');
    if (b) b.focus({ preventScroll: true });
  }

  function choose(li) {
    var k = openK;
    if (k === 'ends' && li.dataset.v === 'custom') { showCal(); return; }
    view.f[k] = li.dataset.v;
    closeMenu(false);
    renderMine();
    var b = document.querySelector('[data-pill="' + k + '"]');
    if (b) b.focus({ preventScroll: true });
  }

  function renderMine() {
    var st = STATES[view.state];
    if (!st.rows.length) {
      renderFilters(st.rows, 0);
      $('#mine').innerHTML = '<div class="list-empty"><p>No campaigns yet. Create your first campaign and it appears here, in review first, then live.</p>'
        + '<button class="btn btn--solid" type="button" data-new>Create a campaign</button></div>';
      return;
    }
    if (view.version === 'current') {
      var kept = st.rows.filter(function (c) { return !view.hide[c.status]; });
      renderFilters(st.rows, kept.length);
      $('#mine').innerHTML = table(kept, false, '<div class="list-filtered">No campaigns match this filter.</div>');
      return;
    }
    var shown = sorted(st.rows.filter(matches));
    renderFilters(st.rows, shown.length);
    $('#mine').innerHTML = table(shown, false,
      '<div class="list-filtered">No campaigns match these filters. <button class="link-btn" type="button" data-clear>Clear filters</button></div>', true);
  }

  // ---- filter (current version: the live page's funnel menu) ----------------
  function renderFilter(rows) {
    var present = [];
    rows.forEach(function (c) { if (present.indexOf(c.status) < 0) present.push(c.status); });
    $('#filter-wrap').hidden = rows.length === 0 || view.version === 'new';
    $('#fmenu').innerHTML = '<b>Status</b>' + present.map(function (s) {
      return '<label><input type="checkbox" data-hide="' + s + '"' + (view.hide[s] ? '' : ' checked') + '> ' + CHIPS[s][0] + '</label>';
    }).join('');
    var anyHidden = present.some(function (s) { return view.hide[s]; });
    $('#btn-filter').classList.toggle('is-set', anyHidden);
  }

  // ---- page -----------------------------------------------------------------
  function render() {
    var st = STATES[view.state];
    renderTiles(st);
    renderFilter(st.rows);
    renderMine();

    // The new rule: samples are for a brand that has not seen a finished report of its own.
    var hasCompleted = st.rows.some(function (c) { return c.status === 'completed'; });
    var showSamples = view.version === 'current' || !hasCompleted;
    $('#samples-band').hidden = !showSamples;
    $('#samples').innerHTML = showSamples ? table(SAMPLES, true, '') : '';

    document.querySelectorAll('[data-version]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.version === view.version)); });
    document.querySelectorAll('[data-state]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.state === view.state)); });
  }

  var toastT;
  function toast(msg) {
    var t = $('#toast');
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastT);
    toastT = setTimeout(function () { t.hidden = true; }, 1800);
  }

  function open(id) {
    var c = MINE.filter(function (r) { return r.id === id; })[0];
    if (c && c.report) { location.href = 'index.html'; return; }
    toast('Only BlueAIGoLive_promo_Oct1 opens a report in this prototype.');
  }

  function save() {
    try {
      localStorage.setItem('campaigns-proto-version', view.version);
      localStorage.setItem('campaigns-proto-state', view.state);
    } catch (e) { /* storage off: the page still works */ }
  }

  // ?version=current|new&state=done|running|empty wins over the remembered choice,
  // so a link can open one exact look.
  (function load() {
    var q = new URLSearchParams(location.search);
    try {
      view.version = localStorage.getItem('campaigns-proto-version') || view.version;
      view.state = localStorage.getItem('campaigns-proto-state') || view.state;
    } catch (e) { /* defaults */ }
    if (q.get('version')) view.version = q.get('version');
    if (q.get('state')) view.state = q.get('state');
    if (view.version !== 'current') view.version = 'new';
    if (!STATES[view.state]) view.state = 'done';
  })();

  document.addEventListener('click', function (e) {
    var t = e.target;
    var pb = t.closest('[data-pill]');
    if (pb) { if (openK === pb.dataset.pill) closeMenu(false); else openMenu(pb.dataset.pill); return; }
    var opt = t.closest('#pmenu li');
    if (opt) { choose(opt); return; }
    var day = t.closest('#pmenu [data-day]');
    if (day) { pickDay(day.dataset.day); return; }
    if (t.closest('#pmenu [data-cal-apply]')) { applyCal(); return; }
    if (t.closest('#pmenu [data-cal-cancel]')) { closeMenu(true); return; }
    if (openK && !t.closest('#pmenu')) closeMenu(false);
    var v = t.closest('[data-version]');
    if (v) { view.version = v.dataset.version; save(); render(); return; }
    var s = t.closest('[data-state]');
    if (s) { view.state = s.dataset.state; resetFilters(); view.sort = { key: '', dir: '' }; save(); render(); return; }
    var so = t.closest('[data-sort]');
    if (so) {
      var k = so.dataset.sort;
      // First click: names A to Z, dates latest first, fill highest first. Then it flips.
      var first = k === 'name' ? 'asc' : 'desc';
      view.sort = view.sort.key === k
        ? { key: k, dir: view.sort.dir === 'asc' ? 'desc' : 'asc' }
        : { key: k, dir: first };
      renderMine();
      return;
    }
    if (t.closest('[data-clear]')) { resetFilters(); renderMine(); return; }
    if (t.closest('#btn-filter')) {
      var m = $('#fmenu');
      m.hidden = !m.hidden;
      $('#btn-filter').setAttribute('aria-expanded', String(!m.hidden));
      return;
    }
    if (!t.closest('#fmenu')) { $('#fmenu').hidden = true; $('#btn-filter').setAttribute('aria-expanded', 'false'); }
    // The ID is for support: a click copies it and does not open the report.
    var cp = t.closest('[data-copy]');
    if (cp) {
      // No clipboard (or no focus): the toast still names the ID.
      try { navigator.clipboard.writeText(cp.dataset.copy).catch(function () {}); } catch (err) { /* same */ }
      toast('Copied ' + cp.dataset.copy);
      return;
    }
    var row = t.closest('[data-open]');
    if (row) { open(row.dataset.open); return; }
    if (t.closest('#btn-new') || t.closest('[data-new]')) { toast('Creating a campaign is not part of this prototype.'); return; }
    if (t.closest('#btn-refresh')) {
      var b = $('#btn-refresh');
      b.classList.add('is-spinning');
      setTimeout(function () { b.classList.remove('is-spinning'); }, 800);
    }
  });

  function resetFilters() {
    view.hide = {};
    view.f = Object.assign({}, NO_FILTERS);
    view.range = null;
    view.q = '';
    $('#f-q').value = '';
  }

  document.addEventListener('change', function (e) {
    var sel = e.target.closest('[data-f]');
    if (sel) { view.f[sel.dataset.f] = sel.value; renderMine(); return; }
    var h = e.target.closest('[data-hide]');
    if (!h) return;
    view.hide[h.dataset.hide] = !h.checked;
    renderMine();
    $('#btn-filter').classList.toggle('is-set', Object.keys(view.hide).some(function (k) { return view.hide[k]; }));
  });

  $('#f-q').addEventListener('input', function (e) { view.q = e.target.value; renderMine(); });

  document.addEventListener('input', function (e) {
    if (e.target.closest('#pmenu')) filterMenu(e.target.value);
  });

  // Hover moves the highlight, so the mouse and the arrow keys share one marker.
  document.addEventListener('mouseover', function (e) {
    var li = e.target.closest && e.target.closest('#pmenu li');
    if (li && !li.classList.contains('is-active')) setActive(li, true);
  });

  // Menu keys: arrows move, Enter picks, Escape closes back to the pill. Down on a closed pill opens it.
  document.addEventListener('keydown', function (e) {
    if (openK && e.target.closest && e.target.closest('#pmenu.is-cal')) {
      if (e.key === 'Escape') { e.preventDefault(); closeMenu(true); }
      return; // the calendar's own buttons take Enter and Space
    }
    if (openK && e.target.closest && e.target.closest('#pmenu')) {
      var items = visibleItems();
      var i = items.indexOf(document.querySelector('#pmenu li.is-active'));
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(items[Math.min(i + 1, items.length - 1)]); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(items[Math.max(i - 1, 0)]); }
      else if (e.key === 'Enter') { e.preventDefault(); if (items[i]) choose(items[i]); }
      else if (e.key === 'Escape') { e.preventDefault(); closeMenu(true); }
      else if (e.key === 'Tab') { closeMenu(false); }
      return;
    }
    var pk = e.target.closest && e.target.closest('[data-pill]');
    if (pk && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) { e.preventDefault(); openMenu(pk.dataset.pill); return; }
  });

  document.addEventListener('keydown', function (e) {
    var row = e.target.closest && !e.target.closest('[data-copy]') && e.target.closest('[data-open]');
    if (row && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); open(row.dataset.open); }
    if (e.key === 'Escape') { $('#fmenu').hidden = true; }
  });

  render();
})();
