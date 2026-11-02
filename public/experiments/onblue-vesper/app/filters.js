/* Filter pills with their own menus (PM's pattern from campaign-report/campaigns.js):
   a pill only appears when the rows differ on it, a long menu gets a search box,
   arrows move, Enter picks, Escape closes back to the pill.
   onblueFilters.render(host, defs, rows, values, onPick)
     defs: [{ k, label, plural, of(row) -> value, name(value) -> html, order? }]
     optional: fixed(rows) -> options, a pill that always shows (Ends on);
     shown(value) -> the set pill's text; range() -> {a, b}, which turns a
     'custom' option into two date fields, the report's Custom range.
   Status is a pill like the rest (PM's row), so there are no status tabs. */
(function () {
  'use strict';

  var esc = window.onblueApp.esc;
  var SEARCH_OVER = 7;
  var CHEV = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
  var menus = {}, openK = null, pick = null;

  function options(def, rows) {
    var vals = [];
    rows.forEach(function (r) {
      [].concat(def.of(r)).forEach(function (v) { if (vals.indexOf(v) < 0) { vals.push(v); } });
    });
    vals.sort(def.order || function (a, b) { return String(a).localeCompare(String(b), 'en', { numeric: true, sensitivity: 'base' }); });
    var count = function (v) { return rows.filter(function (r) { return [].concat(def.of(r)).indexOf(v) >= 0; }).length; };
    return [['all', 'All', rows.length]].concat(vals.map(function (v) { return [v, def.name ? def.name(v) : esc(v), count(v)]; }));
  }

  function render(host, defs, rows, values, onPick) {
    pick = onPick;
    openK = null;
    host.innerHTML = defs.map(function (def) {
      var opts = def.fixed ? def.fixed(rows) : options(def, rows);
      if (!def.fixed && opts.length < 3) { return ''; } // "All" plus one value: nothing to filter
      menus[def.k] = { label: def.label, plural: def.plural, opts: opts, range: def.range };
      var cur = opts.filter(function (o) { return o[0] === values[def.k]; })[0] || opts[0];
      var set = cur[0] !== opts[0][0], text = (def.shown && def.shown(cur[0])) || cur[1];
      return '<span class="pill-wrap"><button class="pill' + (set ? ' is-set' : '') + '" type="button" data-pill="' + def.k + '" aria-haspopup="listbox" aria-expanded="false">'
        + '<span>' + def.label + (set ? ':' : '') + '</span>' + (set ? '<span class="v">' + text + '</span>' : '') + CHEV + '</button></span>';
    }).join('');
  }

  function close(refocus) {
    var m = document.getElementById('pmenu');
    if (m) { m.remove(); }
    var b = openK && document.querySelector('[data-pill="' + openK + '"]');
    if (b) { b.setAttribute('aria-expanded', 'false'); if (refocus) { b.focus({ preventScroll: true }); } }
    openK = null;
  }

  function open(k, current) {
    close(false);
    var b = document.querySelector('[data-pill="' + k + '"]');
    var m = menus[k];
    var el = document.createElement('div');
    el.className = 'pmenu';
    el.id = 'pmenu';
    el.innerHTML = (m.opts.length > SEARCH_OVER
      ? '<label class="pmenu-search"><input type="text" placeholder="Search ' + m.plural + '" autocomplete="off" aria-label="Search ' + m.plural + '"></label>' : '')
      + '<ul class="pmenu-list" role="listbox" tabindex="-1" aria-label="' + m.label + '">'
      + m.opts.map(function (o) {
        var sel = o[0] === current;
        return '<li role="option" data-v="' + esc(o[0]) + '" aria-selected="' + sel + '"><span class="pmenu-ck" aria-hidden="true">' + (sel ? '&#10003;' : '') + '</span>'
          + '<span class="pmenu-t">' + o[1] + '</span><span class="pmenu-n">' + o[2] + '</span></li>';
      }).join('') + '</ul><p class="pmenu-none" hidden>No ' + m.plural + ' match.</p>';
    b.parentNode.appendChild(el);
    b.setAttribute('aria-expanded', 'true');
    openK = k;
    if (el.getBoundingClientRect().right > window.innerWidth - 12) { el.classList.add('is-right'); }
    active(el.querySelector('[aria-selected="true"]') || el.querySelector('li'));
    var q = el.querySelector('input');
    (q || el.querySelector('.pmenu-list')).focus({ preventScroll: true });
  }

  function active(li) {
    document.querySelectorAll('#pmenu li.is-active').forEach(function (x) { x.classList.remove('is-active'); });
    if (!li) { return; }
    li.classList.add('is-active');
    var box = li.parentNode, b = box.getBoundingClientRect(), r = li.getBoundingClientRect();
    if (r.top < b.top) { box.scrollTop -= b.top - r.top; } else if (r.bottom > b.bottom) { box.scrollTop += r.bottom - b.bottom; }
  }

  function visible() {
    return Array.prototype.filter.call(document.querySelectorAll('#pmenu li'), function (li) { return !li.hidden; });
  }

  // the 'custom' option: the same menu becomes a From / To pair, applied together
  function showRange(k) {
    var el = document.getElementById('pmenu'), r = menus[k].range() || {};
    el.classList.add('is-range');
    el.innerHTML = '<p class="pmenu-title">Custom range</p><div class="pmenu-range">'
      + '<label><span>From</span><input class="pmenu-date" type="date" id="pr-a" value="' + esc(r.a || '') + '"></label>'
      + '<label><span>To</span><input class="pmenu-date" type="date" id="pr-b" value="' + esc(r.b || '') + '"></label></div>'
      + '<p class="pmenu-err" id="pr-err" hidden>Pick an end on or after the start.</p>'
      + '<div class="pmenu-acts"><button class="app-btn app-btn--sm" type="button" data-pr-cancel>Cancel</button>'
      + '<button class="app-btn app-btn--sm app-btn--solid" type="button" data-pr-apply>Apply</button></div>';
    el.querySelector('input').focus({ preventScroll: true });
  }
  function applyRange() {
    var a = document.getElementById('pr-a').value, b = document.getElementById('pr-b').value, k = openK;
    if (!a || !b || b < a) { document.getElementById('pr-err').hidden = false; return; }
    close(false);
    pick(k, 'custom', { a: a, b: b });
    var btn = document.querySelector('[data-pill="' + k + '"]');
    if (btn) { btn.focus({ preventScroll: true }); }
  }

  function choose(li) {
    var k = openK;
    if (li.getAttribute('data-v') === 'custom' && menus[k].range) { showRange(k); return; }
    close(false);
    pick(k, li.getAttribute('data-v'));
    var b = document.querySelector('[data-pill="' + k + '"]');
    if (b) { b.focus({ preventScroll: true }); }
  }

  document.addEventListener('click', function (e) {
    var pb = e.target.closest('[data-pill]');
    if (pb) {
      if (openK === pb.dataset.pill) { close(false); } else { open(pb.dataset.pill, window.onblueFilters.current(pb.dataset.pill)); }
      return;
    }
    var li = e.target.closest('#pmenu li');
    if (li) { choose(li); return; }
    if (e.target.closest('#pmenu [data-pr-apply]')) { applyRange(); return; }
    if (e.target.closest('#pmenu [data-pr-cancel]')) { close(true); return; }
    if (openK && !e.target.closest('#pmenu')) { close(false); }
  });

  document.addEventListener('input', function (e) {
    if (!e.target.closest('#pmenu') || e.target.closest('.pmenu-range')) { return; }
    var q = e.target.value.trim().toLowerCase(), first = null;
    document.querySelectorAll('#pmenu li').forEach(function (li) {
      var hit = !q || li.querySelector('.pmenu-t').textContent.toLowerCase().indexOf(q) >= 0;
      li.hidden = !hit;
      if (hit && !first) { first = li; }
    });
    document.querySelector('#pmenu .pmenu-none').hidden = !!first;
    active(first);
  });

  document.addEventListener('mouseover', function (e) {
    var li = e.target.closest && e.target.closest('#pmenu li');
    if (li && !li.classList.contains('is-active')) { active(li); }
  });

  document.addEventListener('keydown', function (e) {
    if (openK && e.target.closest && e.target.closest('#pmenu.is-range')) {
      if (e.key === 'Escape') { e.preventDefault(); close(true); }
      else if (e.key === 'Enter' && e.target.tagName === 'INPUT') { e.preventDefault(); applyRange(); }
      return;
    }
    if (openK && e.target.closest && e.target.closest('#pmenu')) {
      var items = visible(), i = items.indexOf(document.querySelector('#pmenu li.is-active'));
      if (e.key === 'ArrowDown') { e.preventDefault(); active(items[Math.min(i + 1, items.length - 1)]); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); active(items[Math.max(i - 1, 0)]); }
      else if (e.key === 'Enter') { e.preventDefault(); if (items[i]) { choose(items[i]); } }
      else if (e.key === 'Escape') { e.preventDefault(); close(true); }
      else if (e.key === 'Tab') { close(false); }
      return;
    }
    var pk = e.target.closest && e.target.closest('[data-pill]');
    if (pk && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) { e.preventDefault(); open(pk.dataset.pill, window.onblueFilters.current(pk.dataset.pill)); }
  });

  window.onblueFilters = { render: render, close: close, current: function () { return 'all'; } };
})();
