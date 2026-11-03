/* New campaign: the small pieces every step is built from. Each control
   carries data-k (the brief field it writes) and, where it differs, data-v
   (the rule it answers to), so new.js can bind and validate them all with
   one listener. Every field has one help slot: the hint lives there, and an
   error replaces it in the same place, so nothing below it jumps. */
(function () {
  'use strict';

  var A = window.onblueApp, D = window.onblueData, esc = A.esc;

  var I = {
    tick: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    check12: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    lock12: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
    warn12: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M12 6v7.5M12 17.6v.1"/></svg>',
    info: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.1"/></svg>',
    warn: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4 2.8 19.5h18.4L12 4z"/><path d="M12 10v4.5M12 17.2v.1"/></svg>',
    upload: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/></svg>'
  };

  function help(v, hint, err) {
    var text = err || hint || '';
    return '<p class="help' + (err ? ' is-err' : '') + '" id="h-' + v + '" data-hint="' + esc(hint || '') + '"'
      + (text ? '' : ' hidden') + '>' + esc(text) + '</p>';
  }

  function aria(v, err) {
    return ' aria-describedby="h-' + v + '"' + (err ? ' aria-invalid="true"' : '');
  }

  // o: { k, v, label, value, ph, hint, err, type, opt, plain, mode }
  function text(o) {
    var v = o.v || o.k, id = 'f-' + o.k;
    return '<div class="app-field" data-field="' + v + '">'
      + '<label class="label" for="' + id + '"><span>' + esc(o.label) + (o.opt ? ' <span class="opt">(optional)</span>' : '') + '</span></label>'
      + '<input class="input' + (o.err ? ' is-bad' : '') + '" id="' + id + '" type="' + (o.type || 'text') + '" data-k="' + o.k + '" data-v="' + v + '"'
      + ' value="' + esc(o.value || '') + '" placeholder="' + esc(o.ph || '') + '"'
      + (o.plain ? ' autocapitalize="none" autocorrect="off" spellcheck="false"' : '')
      + (o.mode ? ' inputmode="' + o.mode + '"' : '') + aria(v, o.err) + '>'
      + help(v, o.hint, o.err) + '</div>';
  }

  function money(o) {
    var v = o.v || o.k, id = 'f-' + o.k;
    return '<div class="app-field' + (o.cls ? ' ' + o.cls : '') + '" data-field="' + v + '">'
      + (o.label ? '<label class="label" for="' + id + '"><span>' + esc(o.label) + '</span></label>' : '')
      + '<div class="money"><input class="input' + (o.err ? ' is-bad' : '') + '" id="' + id + '" type="text" inputmode="decimal" autocomplete="off"'
      + ' data-k="' + o.k + '" data-v="' + v + '" value="' + esc(o.value || '') + '" placeholder="' + esc(o.ph || '') + '"'
      + (o.aria ? ' aria-label="' + esc(o.aria) + '"' : '') + aria(v, o.err) + '></div>'
      + (o.noHelp ? '' : help(v, o.hint, o.err)) + '</div>';
  }

  /* A row of pressable chips (actions, market). The label is a
     plain span named by aria-labelledby, because a group has no one control
     for a <label> to point at. */
  // o.one: a pick-one group. Only a group that adds up carries ticks; a tick on a
  // pick-one chip promises a second pick that the group will not take
  function chips(o) {
    return '<div class="app-field" data-field="' + o.v + '" role="group" aria-labelledby="l-' + o.v + '"' + aria(o.v, o.err) + '>'
      + '<span class="label" id="l-' + o.v + '"><span>' + esc(o.label) + '</span></span>'
      + '<div class="chips">' + o.items.map(function (it) {
          return '<button class="chip-choice" type="button" ' + o.attr + '="' + esc(it.value) + '" aria-pressed="' + !!it.on + '">'
            + (it.on && !o.one ? '<span class="nw-chip-tick">' + I.tick + '</span>' : '') + (it.html || esc(it.value)) + '</button>';
        }).join('') + '</div>'
      + help(o.v, o.hint, o.err) + '</div>';
  }

  function head(eyebrow, title, lede) {
    return '<p class="eyebrow-app">' + eyebrow + '</p>'
      + '<h1 class="flow-title" tabindex="-1">' + title + '</h1>'
      + (lede ? '<p class="flow-lede">' + esc(lede) + '</p>' : '');
  }

  window.onblueNewUI = { I: I, help: help, text: text, money: money, chips: chips, head: head };
})();
