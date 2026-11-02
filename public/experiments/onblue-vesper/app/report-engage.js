/* Campaign report, part 7: the engagement report. Same frame as growth, in
   completions instead of views: Fill leads, Completions, Spend and Time left
   beside it. Then PM's three sections that answer "did this actually happen",
   which is the whole question when the work is a private action on somebody
   else's video: Completion checks, the board, and Proof of work with its
   privacy note (PLAN-pm-feedback 2026-09-18: an engagement report keeps all three). */
(function () {
  'use strict';

  var R = window.onblueRep, U = R.ui, D = window.onblueData, esc = U.esc;
  var ST = { ok: ['live', 'Completed'], wait: ['review', 'Under review'], bad: ['rejected', 'Rejected'] };
  var proof = { f: 'all', page: 1 };
  R.proofState = proof;

  function tile(cls, inner) { return '<section class="rp-tile ' + cls + '">' + inner + '</section>'; }
  function label(t) { return '<h2 class="rp-label">' + t + '</h2>'; }

  function money(M, X) {
    var spent = X.spend, left = M.budget - spent;
    return tile('rp-money', label('Spend')
      + '<p class="rp-big"><b>' + U.money(spent) + '</b><span>of ' + U.money(M.budget) + '</span></p>'
      + '<span class="app-bar rp-moneybar"><i style="width:' + Math.min(100, spent / Math.max(0.01, M.budget) * 100).toFixed(1) + '%"></i></span>'
      + '<dl class="rp-dl">' + (left < -0.004
        ? '<div class="rp-dl-row is-warn"><dt>Over budget<span>spent past the ' + U.money(M.budget) + ' budget</span></dt><dd>' + U.money(-left) + '</dd></div>'
        : '<div class="rp-dl-row"><dt>Remaining<span>budget left to spend</span></dt><dd>' + U.money(left) + '</dd></div>')
      + '<div class="rp-dl-row"><dt>Under review<span>not billed until resolved</span></dt><dd>' + U.num(M.eng.wait) + '</dd></div>'
      + '<div class="rp-dl-row"><dt>Bid per completion<span>your rate</span></dt><dd>' + U.money(M.rate) + '</dd></div>'
      + (X.full ? '' : '<div class="rp-dl-row"><dt>Spent ' + R.span(X, M) + '</dt><dd>' + U.money(X.inRange * M.rate) + '</dd></div>')
      + '</dl>');
  }

  function checks(M) {
    var e = M.eng;
    return tile('rp-checks', label('Completion checks')
      + '<div class="rp-figs"><span class="rp-fig is-ok"><b>' + U.num(e.verified) + '</b>Completed</span>'
      + '<span class="rp-fig"><b>' + U.num(e.wait) + '</b>Under review</span>'
      + '<span class="rp-fig is-bad"><b>' + U.num(e.bad) + '</b>Rejected</span></div>'
      + '<p class="rp-foot">Every completion is checked before it bills. You are never charged for one that is rejected.</p>');
  }

  function board(M) {
    var e = M.eng;
    return tile('rp-board', label('Right now')
      + '<div class="rp-figs"><span class="rp-fig"><b>' + U.num(e.open) + '</b>Open on the board</span>'
      + '<span class="rp-fig"><b>' + U.num(e.claimed) + '</b>Claimed, in progress</span>'
      + '<span class="rp-fig"><b>' + U.num(e.today) + '</b>Completed today</span></div>');
  }

  function video(M) {
    var p = M.eng.post, pl = U.PL[p.plat];
    return tile('rp-video', U.thumb(p, 'strip', { mark: true })
      + '<div class="rp-video-txt">' + label('Your video') + '<p class="rp-video-t">' + esc(p.title) + '</p>'
      + '<p class="rp-sub">Actions: Watch, Like and Comment</p>'
      + '<a class="app-link rp-xlink" href="' + p.url + '" target="_blank" rel="noopener">' + pl.open + U.IC.ext + '</a></div>');
  }

  R.engageBento = function (M, X) {
    return '<div class="rp-bento rp-bento--eng">' + R.fillTile(M, X, M.done, 'completions')
      + R.statTile('rp-done', 'Completions', U.num(M.done), 'completions so far') + money(M, X) + R.timeTile(M)
      + checks(M) + video(M) + (M.live ? board(M) : '') + '</div>';
  };

  /* ---- proof of work ------------------------------------------------------ */
  function rowHtml(r) {
    var st = ST[r.st], ev = ['Screenshot', 'Comment permalink'].slice(0, r.ev);
    return '<div class="rp-prow" role="row">'
      + '<span class="rp-prow-n">#' + r.n + '</span>'
      + '<span>' + U.dayF(r.at) + ', ' + U.timeF(r.at) + '</span>'
      + '<span class="rp-acts">' + r.acts.map(function (a) { return '<span class="rp-act">' + a + '</span>'; }).join('') + '</span>'
      + '<span class="rp-quote">' + (r.quote ? esc(r.quote) : 'None') + '</span>'
      + '<span class="rp-evd">' + ev.map(function (x) { return '<a class="app-link" href="#" data-stub>' + x + '</a>'; }).join('') + '</span>'
      + '<span><span class="app-status app-status--' + st[0] + '">' + st[1] + '</span></span></div>';
  }

  R.proofCard = function (M, X) {
    var e = M.eng, all = e.verified + e.wait + e.bad;
    var chips = [['all', 'All', all], ['ok', 'Completed', e.verified], ['wait', 'Under review', e.wait], ['bad', 'Rejected', e.bad]];
    var rows = X.rows.filter(function (r) { return proof.f === 'all' || r.st === proof.f; });
    var pages = Math.max(1, Math.ceil(rows.length / 20));
    proof.page = Math.min(proof.page, pages);
    var slice = rows.slice((proof.page - 1) * 20, proof.page * 20);
    var pager = rows.length > 20 ? '<div class="rp-pager"><span>Showing ' + ((proof.page - 1) * 20 + 1) + ' to ' + ((proof.page - 1) * 20 + slice.length) + ' of ' + rows.length + '</span>'
      + '<button class="app-btn app-btn--sm" type="button" data-ppage="' + (proof.page - 1) + '"' + (proof.page === 1 ? ' disabled' : '') + '>Previous</button>'
      + '<button class="app-btn app-btn--sm" type="button" data-ppage="' + (proof.page + 1) + '"' + (proof.page === pages ? ' disabled' : '') + '>Next</button></div>' : '';
    return '<section class="rp-card" id="proof"><div class="rp-card-head"><div><h2 class="app-sect-title">Proof of work</h2>'
      + '<p class="rp-hint">Every completion carries evidence. Completions are numbered; the community members who complete them stay anonymous.</p></div></div>'
      + '<div class="rp-chips" role="group" aria-label="Status">' + chips.map(function (c) {
        return '<button class="pill' + (proof.f === c[0] ? ' is-set' : '') + '" type="button" data-pf="' + c[0] + '" aria-pressed="' + (proof.f === c[0]) + '">' + c[1] + ' <span class="rp-n">' + U.num(c[2]) + '</span></button>';
      }).join('') + (X.rows.length < all ? '<span class="rp-hint rp-chips-note">The latest ' + X.rows.length + ' are listed here.</span>' : '') + '</div>'
      + '<div class="rp-ptable" role="table"><div class="rp-prow rp-prow--head" role="row"><span>#</span><span>Completed</span><span>Actions</span><span>Comment</span><span>Evidence</span><span>Status</span></div>'
      + (slice.map(rowHtml).join('') || '<p class="rp-none">No completions match.</p>') + '</div>' + pager + '</section>'
      + '<p class="rp-privacy">Work on this campaign is completed by community members on their own devices and accounts, paced like normal use. Their identities are never shared; completions are numbered. Evidence is retained for the period stated in your agreement.</p>';
  };
})();
