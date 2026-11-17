/* THE BRAND PROFILE, the run's left column (Ashish, 2026-11-17: "What BlueAI
   knows" was missed, and it repeated step 1's own edit boxes). It is now the one
   place the facts live and get fixed: grouped, counted against the whole
   profile, and every fact BlueAI read from the site is editable in place (click
   or Enter). Facts the steps work out (competitors, formats, ideas) are edited
   in their own step. run.js hands it the list; this renders and edits it.
   OB.runProfile(el, r, onEdit) returns { render(list), call() }. */
(function () {
  'use strict';
  var OB = window.OB, e = OB.esc;
  var GROUPS = [
    ['Brand', ['Category', 'What you sell', 'Your edge', 'How you sound']],
    ['Audience', ['Who buys', 'Market']],
    ['Competition', ['Competitors', 'Top format', 'Runner-up']],
    ['Ideas', ['Video ideas']]
  ];
  var TOTAL = GROUPS.reduce(function (n, g) { return n + g[1].length; }, 0);

  OB.runProfile = function (knows, r, onEdit) {
    var facts = knows.querySelector('[data-facts]'), count = knows.querySelector('[data-facts-count]');
    var hint = knows.querySelector('[data-knows-hint]');
    var seen = {}, editing = null, pending = null, last = [];

    function row(f, isNew) {
      var fl = f[2] || '', key = f[3];
      return '<li class="ob-fact' + (isNew ? ' is-new' : '') + (key ? ' is-edit' : '') + '"' +
        (key ? ' data-edit="' + key + '" tabindex="0" role="button" aria-label="Edit ' + e(f[0]) + ': ' + e(f[1]) + '"' : '') + '>' +
        '<span>' + e(f[0]) + (/guess/.test(fl) ? ' <em class="ob-guess">my guess</em>' : '') + '</span><b>' + e(f[1]) + '</b>' +
        (key ? '<i class="ob-fact-pen" aria-hidden="true">' + OB.icon('edit', 13) + '</i>' : '') + '</li>';
    }

    function render(list) {
      last = list;
      // an open edit is never wiped by a checklist tick: it catches up on close
      if (editing) { pending = list; return; }
      var by = {}, fresh = 0;
      list.forEach(function (f) { by[f[0]] = f; });
      var html = GROUPS.map(function (g) {
        var rows = g[1].filter(function (l) { return by[l]; });
        if (!rows.length) { return ''; }
        return '<li class="ob-fgroup">' + e(g[0]) + '</li>' + rows.map(function (l) {
          var isNew = !seen[l]; if (isNew) { fresh++; }
          return row(by[l], isNew);
        }).join('');
      }).join('');
      facts.innerHTML = html || '<li class="ob-knows-empty">Your brand profile fills in here as BlueAI reads your site.</li>';
      seen = {}; list.forEach(function (f) { seen[f[0]] = true; });
      if (count) { count.textContent = list.length + ' of ' + TOTAL; count.hidden = !list.length; }
      if (hint) { hint.hidden = !list.some(function (f) { return f[3]; }); }
      // the newest fact scrolls into view, on a desktop only (a phone folds the list)
      var first = facts.querySelector('.is-new');
      if (fresh && first && window.innerWidth > 860 && facts.scrollHeight > facts.clientHeight) {
        var want = Math.min(first.offsetTop - 40, facts.scrollHeight - facts.clientHeight);
        if (want > facts.scrollTop) { facts.scrollTo({ top: want, behavior: 'smooth' }); }
      }
      cue();
    }

    // soft fades inside the card while rows sit above or below its edges
    function cue() {
      facts.classList.toggle('has-more', facts.scrollTop + facts.clientHeight < facts.scrollHeight - 8);
      facts.classList.toggle('has-above', facts.scrollTop > 4);
    }
    facts.addEventListener('scroll', cue, { passive: true });
    window.addEventListener('resize', cue);

    // run.js re-renders the profile from fresh facts (onEdit), so a fixed
    // value shows at once; the row it came from keeps the focus
    function close(li, save, value) {
      var key = editing, changed = !!(save && value && value !== String(r[key]));
      editing = null; pending = null;
      if (changed) { r[key] = value; if (key === 'where') { r.whereSet = true; } }
      onEdit(key, changed);
      var again = facts.querySelector('[data-edit="' + key + '"]');
      if (!again) { return; }
      again.focus({ preventScroll: true });
      if (changed) { again.classList.add('is-saved'); window.setTimeout(function () { again.classList.remove('is-saved'); }, 1600); }
    }

    function open(li) {
      if (editing) { return; }
      knows.classList.remove('is-fixing');
      var key = li.getAttribute('data-edit'), b = li.querySelector('b');
      editing = key;
      li.classList.add('is-editing');
      li.removeAttribute('role');
      if (key === 'where') {
        // the market is a pick, not free text
        b.outerHTML = '<span class="ob-picks ob-fact-picks">' + OB.runKit.WHERE.map(function (w) {
          return '<button class="ob-pick" type="button" aria-pressed="' + (w === r.where) + '">' + e(w) + '</button>';
        }).join('') + '</span>';
        var picks = li.querySelector('.ob-fact-picks');
        picks.addEventListener('click', function (ev) { var p = ev.target.closest('.ob-pick'); if (p) { ev.stopPropagation(); close(li, true, p.textContent); } });
        picks.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') { ev.preventDefault(); close(li, false); } });
        picks.querySelector('[aria-pressed="true"], .ob-pick').focus();
        return;
      }
      b.outerHTML = '<textarea class="ob-fact-input" rows="1" aria-label="' + e(li.querySelector('span').textContent) + '">' + e(r[key]) + '</textarea>';
      var t = li.querySelector('textarea'), done = false;
      var grow = function () { t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; };
      var finish = function (save) { if (done) { return; } done = true; close(li, save, t.value.replace(/\s+/g, ' ').trim()); };
      grow();
      t.addEventListener('input', grow);
      t.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' && !ev.shiftKey) { ev.preventDefault(); finish(true); }
        if (ev.key === 'Escape') { ev.preventDefault(); finish(false); }
      });
      t.addEventListener('blur', function () { finish(true); });
      t.focus(); t.setSelectionRange(t.value.length, t.value.length);
    }

    facts.addEventListener('click', function (ev) {
      var li = ev.target.closest('[data-edit]');
      if (li && !li.classList.contains('is-editing')) { open(li); }
    });
    facts.addEventListener('keydown', function (ev) {
      var li = ev.target.closest('[data-edit]');
      if (li && ev.target === li && (ev.key === 'Enter' || ev.key === ' ')) { ev.preventDefault(); open(li); }
    });

    // "Fix something in your profile": point at it (a phone opens its fold first)
    function call() {
      if (window.innerWidth <= 860) {
        knows.classList.add('is-open');
        var t = knows.querySelector('[data-knows-toggle]'); if (t) { t.setAttribute('aria-expanded', 'true'); }
        knows.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      // a pulse alone went unnoticed (Appy: "nothing happens"): the panel holds a
      // volt ring, every fixable fact shows its pen, the hint says what to do, for
      // a few seconds or until a fact is opened
      knows.classList.remove('is-called'); void knows.offsetWidth; knows.classList.add('is-called', 'is-fixing');
      if (hint) { hint.hidden = false; hint.textContent = 'Click any fact to fix it.'; }
      window.clearTimeout(call.t);
      call.t = window.setTimeout(function () { knows.classList.remove('is-fixing'); if (hint) { hint.textContent = 'Click anything to fix it. Every campaign starts from this.'; } }, 4000);
      var first = facts.querySelector('[data-edit]');
      if (first) { first.focus({ preventScroll: window.innerWidth <= 860 }); }
    }

    return { render: render, call: call };
  };
})();
