/* Campaign report, part 10: the header's tools. PM's range menu (Campaign to
   date, Today, Yesterday, Last 7 days, Last 14 days, Custom range), his share
   popover (private by default, ROB-21554), Download CSV and refresh. */
(function () {
  'use strict';

  var R = window.onblueRep, U = R.ui, A = window.onblueApp, esc = U.esc;
  function $(id) { return document.getElementById(id); }

  /* ---- range ---- */
  function presets(M) {
    var L = M.DAYS - 1;
    var list = [['all', 'Campaign to date', 0, L]];
    // today and yesterday only mean something while the campaign runs
    if (M.live) { list.push(['today', 'Today', L, L], ['yesterday', 'Yesterday', Math.max(0, L - 1), Math.max(0, L - 1)]); }
    list.push(['7d', 'Last 7 days', Math.max(0, L - 6), L], ['14d', 'Last 14 days', Math.max(0, L - 13), L]);
    return list;
  }
  R.rangeLabel = function () {
    var v = R.view, M = R.cur.M, p = presets(M).filter(function (x) { return x[0] === v.key; })[0];
    return p ? p[1] : R.span({ from: v.from, to: v.to }, M);
  };
  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function paintRange(custom) {
    var M = R.cur.M, v = R.view, pop = $('range-pop');
    if (custom) {
      pop.innerHTML = '<p class="rp-pop-title">Custom range</p><div class="rp-range-fields">'
        + '<label><span>From</span><input class="rp-input" type="date" id="rg-from" min="' + iso(M.dayDate(0)) + '" max="' + iso(M.dayDate(M.DAYS - 1)) + '" value="' + iso(M.dayDate(v.from)) + '"></label>'
        + '<label><span>To</span><input class="rp-input" type="date" id="rg-to" min="' + iso(M.dayDate(0)) + '" max="' + iso(M.dayDate(M.DAYS - 1)) + '" value="' + iso(M.dayDate(v.to)) + '"></label></div>'
        + '<p class="rp-hint" id="rg-err" hidden>Pick an end on or after the start.</p>'
        + '<div class="rp-pop-foot"><button class="app-btn app-btn--sm" type="button" data-rg-cancel>Cancel</button><button class="app-btn app-btn--sm app-btn--solid" type="button" data-rg-apply>Apply</button></div>';
      return;
    }
    pop.innerHTML = presets(M).map(function (p) {
      var hint = p[2] === p[3] ? U.dayF(M.dayDate(p[2])) : U.dayF(M.dayDate(p[2])) + ' to ' + U.dayF(M.dayDate(p[3]));
      return '<button class="rp-rng" type="button" data-range="' + p[0] + '" aria-pressed="' + (v.key === p[0]) + '">' + p[1] + '<span>' + hint + '</span></button>';
    }).join('') + '<button class="rp-rng" type="button" data-range="custom" aria-pressed="' + (v.key === 'custom') + '">Custom range<span>' + (v.key === 'custom' ? R.span(v, M) : '') + '</span></button>';
  }
  function place(pop, btn, alignRight) {
    var r = btn.getBoundingClientRect();
    pop.style.top = (r.bottom + 8) + 'px';
    pop.style.left = Math.max(16, Math.min(window.innerWidth - pop.offsetWidth - 16, alignRight ? r.right - pop.offsetWidth : r.left)) + 'px';
  }
  function toggleRange(force) {
    var pop = $('range-pop'), b = $('btn-range'), open = force !== undefined ? force : pop.hidden;
    if (!b) { return; }
    if (open) { paintRange(false); pop.hidden = false; place(pop, b, true); } else { pop.hidden = true; }
    b.setAttribute('aria-expanded', String(open));
  }
  function setRange(key, from, to) {
    R.view.key = key; R.view.from = from; R.view.to = to;
    toggleRange(false);
    R.refresh();
  }

  /* ---- share: one switch per report, off by default; on again brings back the SAME link ---- */
  function shareKey() { return 'campaign-report:shared:' + R.cur.M.id; }
  R.isShared = function () { try { return localStorage.getItem(shareKey()) === 'on'; } catch (e) { return false; } };
  R.shareUrl = function () { return location.origin + location.pathname + '?id=' + encodeURIComponent(R.cur.M.id) + '&view=link'; };
  R.shareBtn = function () {
    var on = R.isShared();
    return (on ? U.IC.globe : U.IC.lock) + 'Share';
  };
  function paintShare() {
    var on = R.isShared(), url = R.shareUrl();
    $('share-pop').innerHTML = '<p class="rp-pop-title">Share this report</p>'
      + '<button class="rp-switch-row" type="button" role="switch" aria-checked="' + on + '" data-share-toggle>'
      + '<span class="rp-switch-txt"><b>Anyone with the link can view</b><span>' + (on ? 'The numbers stay up to date.' : 'Only you can see this report.') + '</span></span>'
      + '<span class="rp-switch" aria-hidden="true"><i></i></span></button>'
      + (on ? '<div class="rp-linkrow"><input class="rp-input" readonly value="' + esc(url) + '" aria-label="Report link"><button class="app-btn" type="button" data-copy="' + esc(url) + '">Copy</button></div>' : '');
    var b = $('btn-share');
    b.innerHTML = R.shareBtn();
    b.title = on ? 'Shared: anyone with the link can view' : 'Private: only you can see this report';
    linkEnd();
  }
  // the end of the link is what names the report, so the field shows its end
  function linkEnd() { var i = document.querySelector('#share-pop .rp-input'); if (i) { i.scrollLeft = i.scrollWidth; } }
  function toggleShare(force) {
    var pop = $('share-pop'), b = $('btn-share'), open = force !== undefined ? force : pop.hidden;
    if (!b) { return; }
    // on a phone Share lives in the More menu, so the popover hangs from that button
    var anchor = b.offsetParent ? b : $('btn-more') || b;
    if (open) { paintShare(); pop.hidden = false; place(pop, anchor, true); linkEnd(); } else { pop.hidden = true; }
    b.setAttribute('aria-expanded', String(open));
  }

  /* ---- phone: Share and Download CSV behind one More button ---- */
  function toggleMore(force) {
    var m = $('more-menu'), b = $('btn-more'), open = force !== undefined ? force : m.hidden;
    if (!b) { return; }
    if (open) {
      m.innerHTML = '<button class="app-menu-item" type="button" role="menuitem" data-more="share">' + (R.isShared() ? U.IC.globe : U.IC.lock) + 'Share</button>'
        + '<button class="app-menu-item" type="button" role="menuitem" data-more="csv"' + ($('btn-csv').getAttribute('aria-disabled') === 'true' ? ' disabled' : '') + '>' + U.IC.down + 'Download CSV</button>';
      m.hidden = false;
      place(m, b, true);
      m.querySelector('button').focus({ preventScroll: true });
    } else { m.hidden = true; }
    b.setAttribute('aria-expanded', String(open));
  }

  /* ---- csv: what the table shows, in the selected range ---- */
  function cell(v) { var s = String(v); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }
  function csv() {
    var M = R.cur.M, X = R.cur.X, period = X.full ? 'Campaign to date' : R.span(X, M), rows;
    if (M.growth) {
      rows = [['Period', 'Platform', 'Format', 'Posted at', 'Channel', 'Audience', 'Title', 'Post URL', 'Status', 'Views', 'Likes', 'Comments', 'Saves'].concat(R.geoCols())];
      R.postsInView().forEach(function (p) {
        rows.push([period, U.PL[p.plat].name, U.formatOf(p), new Date(p.at).toISOString(), p.creator.name, p.creator.subs, p.title, p.url,
          p.status === 'removed' ? 'Removed' : 'Live', p.pv, p.pl, p.pc, p.plat === 'instagram' ? p.ps : ''].concat(R.geoCells(p)));
      });
    } else {
      rows = [['Period', 'Completion', 'Completed at', 'Actions', 'Comment', 'Status']];
      X.rows.forEach(function (r) {
        rows.push([period, '#' + r.n, new Date(r.at).toISOString(), r.acts.join(' + '), r.quote, { ok: 'Completed', wait: 'Under review', bad: 'Rejected' }[r.st]]);
      });
    }
    var blob = new Blob([rows.map(function (r) { return r.map(cell).join(','); }).join('\n')], { type: 'text/csv' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = M.c.title + (M.growth ? '_posts' : '_completions') + (X.full ? '' : '_' + iso(M.dayDate(X.from)) + '_' + iso(M.dayDate(X.to))) + '.csv';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 0);
    A.toast('CSV with ' + U.plural(rows.length - 1, M.growth ? 'post' : 'completion'));
  }

  /* ---- updated ---- */
  var updatedAt = Date.now() - 3 * 60000;
  function ago() {
    var m = Math.round((Date.now() - updatedAt) / 60000);
    return m < 1 ? 'Updated just now' : m < 60 ? 'Updated ' + m + ' min ago' : 'Updated ' + Math.round(m / 60) + ' h ago';
  }
  R.ago = ago;
  setInterval(function () { var u = $('updated'); if (u) { u.textContent = ago(); } }, 30000);

  document.addEventListener('click', function (e) {
    var t = e.target.closest('button, a'), a;
    var rp = $('range-pop'), sp = $('share-pop'), mm = $('more-menu');
    if (rp && !rp.hidden && !e.target.closest('#range-pop') && !(t && t.id === 'btn-range')) { toggleRange(false); }
    if (sp && !sp.hidden && !e.target.closest('#share-pop') && !(t && (t.id === 'btn-share' || t.getAttribute('data-more') === 'share'))) { toggleShare(false); }
    if (mm && !mm.hidden && !(t && t.id === 'btn-more')) { toggleMore(false); }
    if (!t) { return; }
    if (t.id === 'btn-more') { toggleMore(); return; }
    if ((a = t.getAttribute('data-more'))) { if (a === 'share') { toggleShare(true); } else { csv(); } return; }
    if (t.id === 'btn-range') { toggleRange(); return; }
    if (t.id === 'btn-share') { toggleShare(); return; }
    if (t.id === 'btn-csv') { if (t.getAttribute('aria-disabled') !== 'true') { csv(); } return; }
    if ((a = t.getAttribute('data-range'))) {
      if (a === 'custom') { paintRange(true); return; }
      var p = presets(R.cur.M).filter(function (x) { return x[0] === a; })[0];
      setRange(a, p[2], p[3]);
      return;
    }
    if (t.hasAttribute('data-rg-cancel')) { toggleRange(false); return; }
    if (t.hasAttribute('data-rg-apply')) {
      var M = R.cur.M, f = M.dayIndex(Date.parse($('rg-from').value + 'T12:00')), to = M.dayIndex(Date.parse($('rg-to').value + 'T12:00'));
      if (isNaN(f) || isNaN(to) || to < f) { $('rg-err').hidden = false; return; }
      setRange('custom', f, to);
      return;
    }
    if (t.hasAttribute('data-share-toggle')) {
      try { localStorage.setItem(shareKey(), R.isShared() ? 'off' : 'on'); } catch (err) { /* storage off: stays private */ }
      paintShare();
      if (e.detail === 0) { $('share-pop').querySelector('[data-share-toggle]').focus(); }
      return;
    }
    if (t.id === 'btn-refresh') {
      t.classList.add('is-spinning');
      setTimeout(function () {
        t.classList.remove('is-spinning');
        updatedAt = Date.now();
        // the "Updated" label beside the button already says it: no toast as well
        $('updated').textContent = ago();
      }, 700);
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') { return; }
    if ($('range-pop') && !$('range-pop').hidden) { toggleRange(false); $('btn-range').focus(); }
    if ($('share-pop') && !$('share-pop').hidden) { toggleShare(false); ($('btn-share').offsetParent ? $('btn-share') : $('btn-more')).focus(); }
    if ($('more-menu') && !$('more-menu').hidden) { toggleMore(false); $('btn-more').focus(); }
  });
  window.addEventListener('resize', function () { if ($('range-pop')) { toggleRange(false); toggleShare(false); toggleMore(false); } });
})();
