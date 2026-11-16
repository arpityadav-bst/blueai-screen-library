/* THE THREE AUDIENCE WIDGETS, each in the form its data asks for (Appy,
   2026-11-16: three cards of the same bars was not the brief). report.js
   computes the shares and calls these for the "Three cards" layout; the "One
   card" layout keeps his bars.
   - Geography: the leading country as the headline, every country as one
     strip that adds up to 100%, the list under it.
   - Age: an ordered range, so columns in YouTube's order, the largest group
     marked and named in the headline.
   - Gender: two parts of one whole, so one split bar under the two numbers.
   Every widget is a lead (the one thing to take away) over a viz block
   (.aw-viz), so a look can treat the visual on its own. Markup only; the
   looks style it (app/css/report-looks*.css). */
(function () {
  'use strict';

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }
  function pct(x) {
    if (!isFinite(x) || x <= 0) { return '0%'; }
    return (x * 100).toFixed(x < 0.1 ? 1 : 0) + '%';
  }
  function lead(big, say) {
    return '<div class="aw-lead"><span class="aw-big">' + big + '</span><span class="aw-say">' + say + '</span></div>';
  }

  /* g: { rows: [{ cc, name, v }] sorted high to low, cv: views covered }.
     all: the whole list under the strip instead of the top five */
  function geo(g, all) {
    var top = g.rows.slice(0, 5), rest = g.rows.slice(5);
    var parts = top.map(function (r, k) { return { cc: r.cc, name: r.name, v: r.v, k: k }; });
    if (rest.length) {
      parts.push({ cc: '+' + rest.length, name: 'Other', v: rest.reduce(function (s, r) { return s + r.v; }, 0), k: 'o' });
    }
    var share = function (v) { return g.cv ? v / g.cv : 0; };
    var first = top[0];
    var strip = '<div class="aw-strip" role="img" aria-label="'
      + esc(parts.map(function (p) { return p.name + ' ' + pct(share(p.v)); }).join(', ')) + '">'
      + parts.map(function (p) {
        return '<i class="aw-s' + p.k + '" style="width:' + (share(p.v) * 100).toFixed(2) + '%"></i>';
      }).join('') + '</div>';
    var listed = all ? g.rows.map(function (r, k) { return { cc: r.cc, name: r.name, v: r.v, k: k < 5 ? k : 'x' }; }) : parts;
    var list = '<ol class="aw-legend">' + listed.map(function (p) {
      // the name alone, no two-letter code beside it (blind review, 2026-11-16)
      return '<li><span class="aw-key aw-s' + p.k + '"></span>'
        + '<span class="aw-name">' + esc(p.name) + '</span><b>' + pct(share(p.v)) + '</b></li>';
    }).join('') + '</ol>';
    return lead(pct(share(first.v)), 'of viewers are in <b>' + esc(first.name) + '</b>')
      + '<div class="aw-viz">' + strip + list + '</div>';
  }

  /* labels and shares in YouTube's own order, never re-sorted */
  function age(labels, shares) {
    var max = Math.max.apply(null, shares), at = shares.indexOf(max);
    var cols = labels.map(function (l, k) {
      var s = shares[k], h = max ? s / max * 100 : 0;
      return '<div class="aw-col' + (k === at ? ' is-top' : '') + '">'
        + '<span class="aw-col-v">' + pct(s) + '</span>'
        + '<span class="aw-col-bar"><i style="height:' + Math.max(2, h).toFixed(1) + '%"></i></span>'
        + '<span class="aw-col-l">' + esc(l) + '</span></div>';
    }).join('');
    return lead(esc(labels[at]), 'is the largest group, <b>' + pct(max) + '</b> of viewers')
      + '<div class="aw-viz"><div class="aw-cols" role="img" aria-label="'
      + esc(labels.map(function (l, k) { return l + ' ' + pct(shares[k]); }).join(', ')) + '">' + cols + '</div></div>';
  }

  /* the first two labels are the two sides; anything after is a small third */
  function gender(labels, shares) {
    var nums = '<div class="aw-pair">' + [0, 1].map(function (k) {
      return '<div class="aw-side aw-side' + k + '"><span class="aw-big">' + pct(shares[k]) + '</span>'
        + '<span class="aw-say"><span class="aw-key aw-g' + k + '"></span>' + esc(labels[k]) + '</span></div>';
    }).join('') + '</div>';
    var bar = '<div class="aw-split" role="img" aria-label="'
      + esc(labels.map(function (l, k) { return l + ' ' + pct(shares[k]); }).join(', ')) + '">'
      + labels.map(function (l, k) {
        return '<i class="aw-g' + k + '" style="width:' + (shares[k] * 100).toFixed(2) + '%"></i>';
      }).join('') + '</div>';
    var more = labels.slice(2).map(function (l, k) { return esc(l) + ' ' + pct(shares[k + 2]); }).join(' · ');
    return nums + '<div class="aw-viz">' + bar + (more ? '<p class="aw-more">' + more + '</p>' : '') + '</div>';
  }

  window.reportAudience = { geo: geo, age: age, gender: gender };
})();
