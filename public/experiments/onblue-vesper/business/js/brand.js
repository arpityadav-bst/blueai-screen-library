/* Brand: what BlueAI knows about you, from the report. Edit it once and every
   video uses it. A header card leads (the logo, the name, the site, the
   report's category, where the buyers are and the goal); the four facts
   (what you sell, who buys, your edge, how you sound) sit in one 2x2 grid.
   Always / never rules (the face-off's yes dot for always, a struck ring for
   never), and brand files you can remove. */
(function () {
  'use strict';
  var OB = window.OB, A = OB.app, r = A.r, e = OB.esc;
  var main = document.querySelector('[data-main]');
  r.always = r.always || ['Show the product in the first 2 seconds'];
  r.never = r.never || ['Promise results we can\'t show'];
  r.files = r.files || [];
  r.fileSizes = r.fileSizes || {};
  function size(n) { var b = r.fileSizes[n]; return b === undefined ? '' : b < 1024 * 1024 ? Math.max(1, Math.round(b / 1024)) + ' KB' : (b / 1048576).toFixed(1) + ' MB'; }
  var EX = { always: ['End on the product', 'Say the brand name out loud', 'Use real customers when we can'], never: ['No prices on screen', 'No stock footage', 'No jokes about competitors'] };
  var thumbs = {};   // previews of images added this visit
  var WHERE = ['United States', 'UK', 'Canada', 'Worldwide'], GOALS = ['More views', 'More sales', 'Launching something', 'Growing a channel'];
  var PEN = '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M4 20h4L19 9l-4-4L4 16Z"/></svg>';

  function hint(key) {
    var have = r[key].map(function (x) { return x.toLowerCase(); });
    var left = EX[key].filter(function (x) { return have.indexOf(x.toLowerCase()) < 0; });
    if (left.length && phone()) { return 'e.g. ' + (SHORT[left[0]] || left[0].toLowerCase()); }   // phones: 24 characters or fewer, never cut mid-word
    return left.length ? 'Like: ' + left[0].charAt(0).toLowerCase() + left[0].slice(1) : 'Add a rule';
  }
  var SHORT = { 'Say the brand name out loud': 'say the brand name', 'Use real customers when we can': 'use real customers', 'No jokes about competitors': 'no jabs at rivals' };
  function phone() { return window.matchMedia('(max-width: 700px)').matches; }
  function rules(key, title) {
    var mark = key === 'always' ? '<span class="ob-yes ob-yes--sm">' + OB.icon('check') + '</span>' : '<span class="ob-br-not" aria-hidden="true"></span>';
    return '<div class="ob-card ob-br-rules"><h3 class="ob-pg-h3">' + title + '</h3><ul>' + (r[key].length ? r[key].map(function (x, i) {
      return '<li>' + mark + '<span>' + e(x) + '</span><button class="ob-x" type="button" aria-label="Remove" data-del="' + key + ':' + i + '">' + OB.icon('close', 14) + '</button></li>';
    }).join('') : '<li class="ob-br-none">No rules yet</li>') + '</ul><form class="ob-add" data-rule="' + key + '"><input class="ob-input" placeholder="' + e(hint(key)) + '" aria-label="' + title + '"><button class="ob-btn" type="submit" aria-label="Add ' + (key === 'always' ? 'an Always' : 'a Never') + ' rule">' + OB.icon('plus', 15) + 'Add</button></form></div>';
  }
  function split(n) { var m = /^(.*)\.([a-z0-9]{1,4})$/i.exec(n); return m ? [m[1], m[2].toUpperCase()] : [n, 'FILE']; }
  function files() {
    if (!r.files.length) { return ''; }
    return '<ul class="ob-br-files" data-filelist>' + r.files.map(function (n, i) {
      var p = split(n), pic = thumbs[n] ? '<img class="ob-br-thumb" alt="" src="' + thumbs[n] + '" data-ext="' + e(p[1]) + '">' : '<span class="ob-br-ext">' + e(p[1]) + '</span>';
      return '<li>' + pic + '<span>' + e(p[0]) + (size(n) ? '<small>' + p[1] + ', ' + size(n) + '</small>' : '') + '</span><button class="ob-x" type="button" aria-label="Remove ' + e(n) + '" data-delfile="' + i + '">' + OB.icon('close', 14) + '</button></li>';
    }).join('') + '</ul>';
  }
  function select(key, list, none) {
    var opts = (r[key] && list.indexOf(r[key]) < 0 ? [r[key]].concat(list) : list).map(function (o) { return '<option' + (o === r[key] ? ' selected' : '') + '>' + e(o) + '</option>'; });
    return '<select class="ob-br-sel" data-f="' + key + '">' + (none && !r[key] ? '<option value="" selected>' + none + '</option>' : '') + opts.join('') + '</select>';
  }
  function edit(x, cls) {
    return '<div class="ob-edit' + (cls || '') + '"><label for="ob-b-' + x[0] + '">' + x[1] + '<span class="ob-br-pen">' + PEN + 'Edit</span><span class="ob-br-saves">' + (window.matchMedia('(hover: none), (pointer: coarse), (max-width: 700px)').matches ? 'Saves on its own' : 'Saves when you click away') + '</span></label>' +
      '<textarea id="ob-b-' + x[0] + '" rows="1" data-k="' + x[0] + '">' + e(r[x[0]]) + '</textarea></div>';
  }
  function header() {
    var logo = r.site ? '<img alt="" src="https://www.google.com/s2/favicons?domain=' + encodeURIComponent(r.site) + '&sz=128" data-logo>' : e(r.initial || r.brand.charAt(0));
    return '<section class="ob-card ob-card--lit ob-br-head"><div class="ob-br-id"><span class="ob-br-logo">' + logo + '</span><div><b>' + e(r.brand) + '</b>' +
      (r.site ? '<a href="https://' + e(r.site) + '" target="_blank" rel="noopener">' + e(r.site) + '<span class="ob-br-out">' + OB.icon('arrow', 13) + '</span></a>' : '<small>No website, from your answers</small>') + '</div></div>' +
      '<dl class="ob-br-strip"><div><dt>Category</dt><dd>' + e(r.category) + '<small class="ob-br-from">' + (r.site ? 'From your site' : 'From your answers') + '</small></dd></div><div><dt>Buyers in</dt><dd>' + select('where', WHERE) + '</dd></div><div><dt>Goal</dt><dd>' + select('goal', GOALS, 'Not set yet') + '</dd></div></dl>' +
      '</section>';
  }
  function fit(t) { t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; }

  function render(scrollFiles) {
    var f = [['sell', 'What you sell'], ['buyers', 'Who buys'], ['edge', 'Your edge'], ['voice', 'How you sound']];
    main.innerHTML = '<header class="ob-p-head ob-pg-head"><div><h1 class="ob-p-title">Brand</h1><p class="ob-p-lede">What BlueAI knows about ' + e(r.brand) + '. Change it once and every video uses it.</p></div></header>' +
      header() + '<div class="ob-br-facts">' + f.map(function (x) { return edit(x); }).join('') + '</div>' +
      '<section><div class="ob-p-sect"><h2 class="ob-p-h2">Rules for every video</h2></div><div class="ob-pg-grid2">' +
      rules('always', 'Always') + rules('never', 'Never') + '</div></section>' +
      '<section><div class="ob-p-sect"><h2 class="ob-p-h2">Brand files</h2><span class="ob-p-note">Logos, fonts, product shots, past videos</span></div>' + files() +
      '<label class="ob-card ob-br-drop' + (r.files.length ? ' is-compact' : '') + '" tabindex="0"><input type="file" multiple hidden data-files><span class="ob-br-plus">' + OB.icon('plus', 18) + '</span><span><b>' + (r.files.length ? 'Add more' : 'Add files') + '</b><small>BlueAI uses them in every video</small></span></label></section>';
    main.querySelectorAll('textarea').forEach(function (t) {
      fit(t);
      t.addEventListener('input', function () { fit(t); });
      t.addEventListener('change', function () {
        var v = t.value.replace(/\s+/g, ' ').trim(), k = t.getAttribute('data-k');
        if (!v) { t.value = r[k]; fit(t); return; }   // an empty fact is never saved
        r[k] = v; t.value = v; A.saveReport(); OB.toast('Saved. New videos will use it.');
      });
    });
    // an image the browser cannot draw (HEIC, a broken file) shows its type badge, never the broken-image glyph
    main.querySelectorAll('.ob-br-thumb').forEach(function (img) {
      var bad = function () { var b = document.createElement('span'); b.className = 'ob-br-ext'; b.textContent = img.getAttribute('data-ext'); img.replaceWith(b); };
      if (img.complete && !img.naturalWidth) { bad(); } else { img.addEventListener('error', bad); }
    });
    var lg = main.querySelector('[data-logo]'); if (lg) { var ini = function () { if (lg.parentNode) { lg.parentNode.textContent = r.initial || r.brand.charAt(0); } }; lg.addEventListener('error', ini); lg.addEventListener('load', function () { if (lg.naturalWidth < 32) { ini(); } }); if (lg.complete && lg.naturalWidth && lg.naturalWidth < 32) { ini(); } }   // a tiny icon (Google's default globe) would blur: the initial instead
    main.querySelectorAll('[data-f]').forEach(function (sel) {
      sel.addEventListener('change', function () { r[sel.getAttribute('data-f')] = sel.value; A.saveReport(); OB.toast('Saved. New videos will use it.'); });
    });
    main.querySelector('[data-files]').addEventListener('change', function (ev) {
      var list = Array.prototype.slice.call(ev.target.files), names = list.map(function (x) { return x.name; });
      list.forEach(function (x) { r.fileSizes[x.name] = x.size; if (/^image\//.test(x.type) && window.URL) { thumbs[x.name] = URL.createObjectURL(x); } });
      r.files = r.files.concat(names); A.saveReport(); render(true);
      if (!phone()) { OB.toast('Added ' + names.length + ' file' + (names.length === 1 ? '' : 's')); }   // phones: the new rows are the confirmation, no toast over them
    });
    // phones scroll at once, so the toast measures the settled page and never lands on Add more
    if (scrollFiles) { var fl = main.querySelector('[data-filelist]'); if (fl) { fl.scrollIntoView({ block: 'center', behavior: window.matchMedia('(max-width: 820px)').matches ? 'auto' : 'smooth' }); } }
  }

  main.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var key = ev.target.getAttribute('data-rule'), v = ev.target.querySelector('input').value.trim();
    if (!key || !v) { return; }
    r[key].push(v); A.saveReport(); render();
  });
  main.addEventListener('click', function (ev) {
    // a click on a fact card (not on its text) puts the caret at the end, never mid-word
    var card = ev.target.closest('.ob-edit');
    if (card && ev.target.tagName !== 'TEXTAREA') {
      ev.preventDefault(); var t = card.querySelector('textarea'); t.focus(); t.setSelectionRange(t.value.length, t.value.length); return;
    }
    var df = ev.target.closest('[data-delfile]');
    if (df) { r.files.splice(+df.getAttribute('data-delfile'), 1); A.saveReport(); render(); return; }
    var d = ev.target.closest('[data-del]'); if (!d) { return; }
    var p = d.getAttribute('data-del').split(':'); r[p[0]].splice(+p[1], 1); A.saveReport(); render();
  });
  // touch: the first tap into a fact puts the caret at its end, never mid-word (a second tap places it)
  main.addEventListener('focusin', function (ev) {
    var t = ev.target;
    if (t.tagName === 'TEXTAREA' && t.closest('.ob-edit') && window.matchMedia('(hover: none) and (pointer: coarse)').matches) { window.setTimeout(function () { t.setSelectionRange(t.value.length, t.value.length); }, 0); }
  });
  main.addEventListener('keydown', function (ev) {
    if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.classList && ev.target.classList.contains('ob-br-drop')) { ev.preventDefault(); ev.target.querySelector('input').click(); }
  });

  render();
})();
