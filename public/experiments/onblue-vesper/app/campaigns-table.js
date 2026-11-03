/* Campaigns page, the table: PM's "New" list (campaign-report/campaigns.js
   rowNew), one line per row, his columns in his order. Pure renderers over a row (data.js shape); campaigns.js
   owns the view state and passes the sort in. */
(function () {
  'use strict';

  var D = window.onblueData, A = window.onblueApp, esc = A.esc;
  var CHEV = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5.5l6.5 6.5L9 18.5"/></svg>';
  var INFO = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.1"/></svg>';

  function compact(v) {
    var one = function (x) { return String(Math.round(x * 10) / 10); };
    if (v < 1000) { return String(v); }
    if (v < 10000) { return one(v / 1000) + 'K'; }
    if (Math.round(v / 1000) < 1000) { return Math.round(v / 1000) + 'K'; }
    return one(v / 1e6) + 'M';
  }
  function growth(c) { return c.kind !== 'engagement'; }
  function unit(c) { return growth(c) ? 'views' : 'completions'; }
  function typeOf(c) { return growth(c) ? 'Video growth' : 'Video engagement'; }
  function geo(g) { return /^worldwide$/i.test(g) ? 'WW' : g; }
  // 'waiting' counts as In review: it is filed, and goes into review once the agency is approved
  function statusKey(c) { return c.status === 'waiting' ? 'review' : c.status; }
  function endsOn(c) { return c.status === 'rejected' ? 'Did not run' : c.ends; }

  function status(c) {
    var s = D.STATUS[c.status];
    var tip = c.status === 'waiting' ? ' tabindex="0" title="Goes into review once ' + esc(A.session.agency) + ' is approved."' : '';
    return '<span class="app-status app-status--' + s[1] + '"' + tip + '>' + s[0] + '</span>';
  }

  // A sortable heading: the arrow shows only on the column the list is sorted by.
  function th(sort, key, label, cls) {
    var c = cls ? ' class="' + cls + '"' : '';
    if (!sort) { return '<span' + c + '>' + label + '</span>'; }
    var on = sort.key === key;
    var arrow = !on ? '' : sort.dir === 'asc' ? ' &uarr;' : ' &darr;';
    return '<span' + c + '><button class="th' + (on ? ' is-on' : '') + '" type="button" data-sort="' + key + '">' + label + arrow + '</button></span>';
  }

  function row(c) {
    var rejected = c.status === 'rejected';
    var info = rejected ? '<span class="c-info" tabindex="0" role="img" aria-label="Reason: ' + esc(c.reason) + '" data-tip="Reason: ' + esc(c.reason) + '">' + INFO + '</span>' : '';
    return '<div class="row' + (rejected ? '' : ' is-link') + '"' + (rejected ? '' : ' role="link" tabindex="0" data-open="' + c.id + '"') + '>'
      // the ID rides on the name's line, never under it; the name gives way first
      + '<span class="c-name"><span class="c-title" title="' + esc(c.title) + '">' + esc(c.title) + '</span>'
      + '<button class="c-hash" type="button" data-copy="#' + c.id + '" title="Copy campaign ID">#' + c.id + '</button></span>'
      // phones only: the columns that do not fit come back as one line of words
      + '<span class="c-ph">' + esc(c.product) + ' &middot; ' + typeOf(c) + ' &middot; ' + esc(geo(c.geo)) + ' &middot; ' + endsOn(c) + '</span>'
      + '<span class="c-prod">' + esc(c.product) + '</span>'
      + '<span class="c-type"><span>' + typeOf(c) + '</span></span>'
      + '<span class="c-geo">' + esc(geo(c.geo)) + '</span>'
      + '<span class="c-ends' + (rejected ? ' is-none' : '') + '">' + endsOn(c) + '</span>'
      + '<span class="c-num"><b>' + compact(c.done) + '</b> <span>' + unit(c) + '</span></span>'
      + '<span class="c-state">' + status(c) + info + '</span>'
      + '<span class="c-chev">' + (rejected ? '' : CHEV) + '</span>'
      + '</div>';
  }

  // sort: { key, dir } for the agency's own list; null for the samples, which do not sort
  function table(rows, emptyHtml, sort) {
    var head = '<div class="row row--head">'
      + th(sort, 'name', 'Campaign') + '<span class="c-prod">Product</span><span class="c-type">Type</span><span class="c-geo">Geography</span>'
      + th(sort, 'ends', 'Ends on', 'c-ends') + th(sort, 'fill', 'Fill', 'c-num')
      + '<span>Status</span><span class="c-chev"></span></div>';
    return '<div class="tbl" role="table">' + head + '<div class="tbl-body">' + (rows.map(row).join('') || emptyHtml) + '</div></div>';
  }

  window.onblueCampaignsTable = { typeOf: typeOf, geo: geo, statusKey: statusKey, table: table };
})();
