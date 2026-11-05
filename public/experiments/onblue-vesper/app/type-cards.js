/* The two campaign type cards (css/type-cards.css), as HTML for the type
   picker. Copy comes from the wizard's own model (new-model.js), so the
   cards and the form can never describe a type differently. */
(function () {
  'use strict';

  var CHECK = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  var SVG = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
  var ACTS = [
    ['Watched', '<path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.6"/>'],
    ['Liked', '<path d="M12 19.5s-7.5-4.4-7.5-10A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.5c0 5.6-7.5 10-7.5 10z"/>'],
    ['Commented', '<path d="M4.5 6.5h15v10h-8l-4 3.5v-3.5h-3z"/>']
  ];
  var ARROW = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  function poster(name) { return '<img src="../samples/' + name + '.jpg" alt="">'; }
  // growth is many films made by creators; engagement is your one film, acted on
  var ART = {
    growth: '<span class="nw-art nw-art--growth" aria-hidden="true">'
      + poster('sandbar-the-menu') + poster('hunter-raid-first-hour') + poster('airtap-weekend-trip') + '</span>',
    engagement: '<span class="nw-art nw-art--engagement" aria-hidden="true">' + poster('airtap-pasta')
      + '<span class="nw-acts">' + ACTS.map(function (a) { return '<span>' + SVG + a[1] + '</svg>' + a[0] + '</span>'; }).join('') + '</span></span>'
  };

  window.onblueTypeCards = function (selected) {
    var N = window.onblueNew, esc = window.onblueApp.esc;
    return '<div class="nw-types" role="group" aria-label="Campaign type">'
      + N.ORDER.map(function (id) {
          var t = N.TYPES[id];
          return '<button class="app-pick nw-type" type="button" data-type="' + id + '" aria-pressed="' + (selected === id) + '">'
            + '<span class="nw-tick" aria-hidden="true">' + CHECK + '</span>'
            + ART[id]
            + '<span class="nw-type-name">' + esc(t.name) + '</span>'
            + '<span class="nw-type-body">' + esc(t.body) + '</span>'
            + '<span class="nw-type-facts"><span class="nw-type-spec"><i>You bring</i><b>' + esc(t.bring) + '</b></span>'
            + '<span class="nw-type-spec"><i>You pay</i><b>' + esc(t.pay) + '</b></span></span>'
            // the card's own button, so it reads as something to press, not a page to read
            + '<span class="nw-type-go">' + (selected === id ? 'Current type' : 'Choose ' + esc(t.name) + ARROW) + '</span>'
            + '</button>';
        }).join('')
      + '</div>';
  };
})();
