/* New campaign: step 3 (Where it runs) and step 4 (Review). */
(function () {
  'use strict';

  var A = window.onblueApp, N = window.onblueNew, U = window.onblueNewUI, S = window.onblueNewSteps, esc = A.esc;
  var T = N.TYPES;

  // ---- 3: where it runs ----
  function where(b, err) {
    var t = T[b.type];
    var html = U.chips({
      v: 'market', attr: 'data-market', label: 'Market', one: true,
      items: N.MARKETS.map(function (m) { return { value: m[0], on: b.market === m[0] }; })
    })
      + '<div class="app-field" data-field="note">'
      + '<div class="label"><label for="f-note">Anything else we should know? <span class="opt">(optional)</span></label>'
      + '<span class="counter" id="nw-count" aria-live="polite">' + b.note.length + '/500</span></div>'
      + '<textarea class="textarea' + (err.note ? ' is-bad' : '') + '" id="f-note" rows="4" maxlength="500" data-k="note"'
      + ' placeholder="Audience, timing, things to avoid." aria-describedby="h-note">' + esc(b.note) + '</textarea>'
      + U.help('note', '', err.note) + '</div>'
      // PM's box, and its title; engagement gets one too (AF 2.8.5)
      + '<div class="note-box nw-next"><div><p class="nw-next-t">What happens after you create this</p><ol>'
      + t.next.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol></div></div>';
    return U.head(S.eyebrow(b), 'Where it <em>runs</em>.') + '<div class="flow-fields">' + html + '</div>';
  }

  // ---- 4: review ----
  var MISSING = '<span class="nw-missing">Missing</span>';
  var NONE = '<span class="nw-none">None</span>';

  function val(v, required, bad) {
    if (bad) { return MISSING; }
    if (!v) { return required ? MISSING : NONE; }
    return esc(v);
  }

  function rows(list) {
    return '<dl class="nw-dl">' + list.map(function (r) { return '<dt>' + r[0] + '</dt><dd>' + r[1] + '</dd>'; }).join('') + '</dl>';
  }

  function card(title, step, list) {
    return '<section class="nw-card" aria-labelledby="rc-' + step + '">'
      + '<div class="nw-card-head"><h2 id="rc-' + step + '">' + title + '</h2>'
      + '<button class="app-btn app-btn--sm" type="button" data-goto="' + step + '" aria-label="Edit ' + title.toLowerCase() + '">Edit</button></div>'
      + rows(list) + '</section>';
  }

  function review(b) {
    var e = N.errors(b), t = T[b.type], growth = b.type === 'growth';
    var bud = N.budgetOf(b), zone = N.zone();
    var what = [
      ['Type', esc(t.name)],
      ['Campaign name', val(b.name.trim(), true, e.name)],
      ['Product', val(b.product.trim(), true, e.product)],
      [b.platforms.length > 1 ? 'Platforms' : 'Platform', e.platforms ? MISSING : '<span class="nw-plats">' + U.plats(b.platforms) + '</span>']
    ];
    if (growth) {
      var files = b.refsFiles ? (b.refs.trim() ? '\n' : '') + b.refsFiles : '';
      what.push(['Reference websites', val(b.site.trim())], ['Reference videos', b.refs.trim() || files ? '<span class="nw-pre">' + esc(b.refs.trim() + files) + '</span>' : NONE]);
    } else {
      what.push(['Video', val(b.postUrl.trim(), true, e.postUrl)], ['Action', e.actions ? MISSING : esc(b.actions.join(', '))]);
    }
    var money = [
      ['Campaign budget', e.budget ? MISSING : N.money(bud)],
      [t.rateLabel, e.bid ? MISSING : N.price(N.num(b.bid))],
      ['Starts', e.start ? MISSING : esc(N.when(b.startDate, b.startTime) + ' (' + zone + ')')],
      ['Ends', e.end ? MISSING : esc(N.when(b.endDate, b.endTime) + ' (' + zone + ')')]
    ];
    var who = [['Market', esc(b.market)], ['Notes', b.note.trim() ? '<span class="nw-pre">' + esc(b.note.trim()) + '</span>' : NONE]];
    // above the fold, before the rows: what locks once approved
    return U.head(S.eyebrow(b), 'Check it <em>over</em>.', 'Edit anything before you submit.')
      + '<div class="nw-review-notes">'
      + '<p class="nw-lock">' + U.I.warn + "Platform and market can't change once the campaign is approved.</p></div>"
      + '<div class="nw-cards">'
      + card('What to promote', 1, what) + card('Budget and schedule', 2, money) + card('Where it runs', 3, who)
      + '</div>';
  }

  window.onblueNewReview = { where: where, review: review };
})();
