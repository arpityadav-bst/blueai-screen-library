/* Campaigns page: unfinished drafts (plan CL-2), as a notice in the floating
   stack at the bottom right (css/start.css). They stay in reach on every
   visit but no longer sit on top of the page: the Create a campaign card does.
   The notice folds to its one line and stays folded for the visit. */
(function () {
  'use strict';

  var D = window.onblueData, A = window.onblueApp, esc = A.esc;
  var MAX = 3;
  var all = false;
  function folded() { try { return sessionStorage.getItem('onblue-notice-drafts') === 'folded'; } catch (e) { return false; } }
  var PEN = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/></svg>';
  var CHEV = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';

  var MORE = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5.5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18.5" cy="12" r="1.6"/></svg>';
  var BIN = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 12.5h9l1-12.5"/></svg>';

  var TYPE = { growth: 'Video growth', engagement: 'Video engagement' };
  function nameOf(d) { return ((d.brief || {}).name || '').trim() || 'Untitled campaign'; }
  // "edited 2 min ago": what tells two drafts, or two untitled ones, apart
  function ago(iso) {
    var m = Math.max(0, Math.round((Date.now() - Date.parse(iso)) / 60000));
    if (isNaN(m)) { return ''; }
    if (m < 1) { return 'edited just now'; }
    if (m < 60) { return 'edited ' + m + ' min ago'; }
    if (m < 1440) { return 'edited ' + Math.round(m / 60) + ' h ago'; }
    var days = Math.round(m / 1440);
    return 'edited ' + days + (days === 1 ? ' day ago' : ' days ago');
  }

  function row(d) {
    var b = d.brief || {}, name = nameOf(d), when = ago(d.updatedAt);
    // the type chooser is not a counted step, so a draft never reads "step 0"
    var n = Math.min(4, Math.max(1, d.step || 0));
    return '<li class="needs-row">'
      + '<span class="needs-main"><span class="needs-name" title="' + esc(name) + '">' + esc(name) + '</span>'
      + '<span class="needs-sub">' + (TYPE[b.type] ? TYPE[b.type] + ' &middot; ' : '') + 'Draft &middot; step ' + n + ' of 4' + (when ? ' &middot; ' + when : '') + '</span></span>'
      + '<a class="app-btn app-btn--sm" href="new.html?draft=' + encodeURIComponent(d.id) + '">Continue</a>'
      + '<span class="needs-more">'
      + '<button class="app-btn app-btn--sm app-btn--quiet app-btn--icon needs-more-btn" type="button" data-draft-more="' + esc(d.id) + '"'
      + ' aria-haspopup="menu" aria-expanded="false" aria-label="More for ' + esc(name) + '">' + MORE + '</button>'
      + '<span class="needs-menu" role="menu" hidden>'
      + '<button class="app-menu-item" type="button" role="menuitem" data-draft-delete="' + esc(d.id) + '">' + BIN + 'Delete draft</button>'
      + '</span></span></li>';
  }

  function render() {
    var el = document.getElementById('needs');
    if (!el) { return; }
    // in review the form is closed, so drafts wait out of sight until approval
    var list = A.session.status === 'review' ? [] : D.drafts();
    el.hidden = !list.length;
    if (!list.length) { el.innerHTML = ''; return; }
    var shown = all ? list : list.slice(0, MAX);
    el.classList.toggle('is-folded', folded());
    el.innerHTML = '<div class="notice-head">' + PEN
      + '<span class="notice-text"><b>' + list.length + (list.length === 1 ? ' draft' : ' drafts') + ' to finish</b>'
      + 'Drafts go into review once you submit them.</span>'
      + '<button class="app-btn app-btn--sm app-btn--icon app-btn--quiet notice-fold" type="button" data-draft-fold aria-expanded="' + !folded() + '" aria-label="Show or hide drafts">' + CHEV + '</button></div>'
      + '<ul class="needs-list">' + shown.map(row).join('') + '</ul>'
      + (list.length > MAX && !all ? '<button class="app-link needs-all" type="button" data-draft-all>Show all ' + list.length + '</button>' : '');
  }

  function closeMenus(except) {
    document.querySelectorAll('[data-draft-more]').forEach(function (b) {
      if (b === except) { return; }
      b.setAttribute('aria-expanded', 'false');
      b.nextElementSibling.hidden = true;
    });
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target : null;
    if (!t) { return; }
    var more = t.closest('[data-draft-more]');
    if (more) {
      var open = more.getAttribute('aria-expanded') !== 'true';
      closeMenus(more);
      more.setAttribute('aria-expanded', String(open));
      more.nextElementSibling.hidden = !open;
      if (open) { more.nextElementSibling.querySelector('button').focus(); }
      return;
    }
    closeMenus();
    var del = t.closest('[data-draft-delete]');
    if (del) {
      var id = del.getAttribute('data-draft-delete');
      var d = D.drafts().filter(function (x) { return x.id === id; })[0], nm = d ? nameOf(d) : 'this draft';
      if (nm.length > 40) { nm = nm.slice(0, 39).trim() + '…'; }
      window.onblueConfirm({
        // named, because the dialog covers the row it came from
        title: 'Delete “' + nm + '”?', body: "This draft and everything in it will be removed. This can't be undone.",
        keep: 'Keep draft', go: 'Delete', danger: true,
        onGo: function () { D.deleteDraft(id); render(); A.toast('Draft deleted'); }
      });
      return;
    }
    if (t.closest('[data-draft-all]')) { all = true; render(); return; }
    if (t.closest('[data-draft-fold]')) {
      try { sessionStorage.setItem('onblue-notice-drafts', folded() ? 'open' : 'folded'); } catch (err) {}
      render();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') { return; }
    var open = document.querySelector('[data-draft-more][aria-expanded="true"]');
    if (open) { closeMenus(); open.focus(); }
  });

  render();
  document.addEventListener('onblue:status', render);
})();
