/* The campaign type picker: a dialog over the page the agency is on, like
   How pricing works (css/type-picker.css). Every New campaign opens it;
   picking a card goes to the form's first step for that type
   (new.html?type=...). Inside the form, Change opens it too and hands the
   pick back to the form instead. Loads its own model, cards and styles on
   first use, so no page has to carry them. */
(function () {
  'use strict';

  var X = window.onblueApp.icons.close; // the app's one close glyph (shell.js)
  var d = null, onPick = null;

  function css(href) {
    if (document.querySelector('link[href="' + href + '"]')) { return; }
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = href;
    document.head.appendChild(l);
  }
  // the model and the cards, in order, unless the page already has them
  function scripts(done) {
    var need = [['onblueNew', 'new-model.js'], ['onblueTypeCards', 'type-cards.js']].filter(function (s) { return !window[s[0]]; });
    (function next() {
      if (!need.length) { done(); return; }
      var s = document.createElement('script');
      s.src = need.shift()[1];
      s.onload = next;
      document.head.appendChild(s);
    })();
  }

  function build() {
    d = document.createElement('dialog');
    d.className = 'tp';
    d.setAttribute('aria-labelledby', 'tp-title');
    // padding sits on .tp-in, so a click whose target is the dialog itself is the backdrop
    d.innerHTML = '<div class="tp-in"><div class="tp-head">'
      + '<h2 class="tp-title" id="tp-title">Choose a campaign <em>type</em>.</h2>'
      + '<button class="app-btn app-btn--icon app-btn--quiet" type="button" data-tp-close aria-label="Close">' + X + '</button></div>'
      + '<div class="tp-cards"></div></div>';
    d.addEventListener('click', function (e) {
      if (e.target === d || e.target.closest('[data-tp-close]')) { d.close(); return; }
      var c = e.target.closest('[data-type]');
      if (!c) { return; }
      // the pick is the picker's: the form's own click handler never sees it
      e.stopPropagation();
      d.querySelectorAll('[data-type]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === c)); });
      onPick(c.getAttribute('data-type'));
    });
    document.body.appendChild(d);
  }

  // opts.selected: the current type, ticked; opts.onPick: what a pick does here
  window.onblueTypePicker = function (opts) {
    opts = opts || {};
    css('css/type-cards.css');
    css('css/type-picker.css');
    scripts(function () {
      if (!d) { build(); }
      onPick = opts.onPick || function (t) { window.location.href = 'new.html?type=' + t; };
      if (opts.onPick) {
        var given = onPick;
        onPick = function (t) { d.close(); given(t); };
      }
      d.querySelector('.tp-cards').innerHTML = window.onblueTypeCards(opts.selected);
      if (!d.open) { d.showModal(); }
    });
  };
})();
