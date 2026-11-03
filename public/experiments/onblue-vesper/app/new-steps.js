/* New campaign: steps 1 and 2 (the type is chosen first, in type-picker.js).
   Each renderer takes the brief and the errors that are showing, and returns
   the step's HTML. */
(function () {
  'use strict';

  var A = window.onblueApp, N = window.onblueNew, U = window.onblueNewUI, esc = A.esc;
  var T = N.TYPES;

  // the eyebrow on every counted step: the type, and a way back to change it
  function eyebrow(b) {
    return esc(T[b.type].name) + '<button class="app-link nw-change" type="button" data-act="change-type">Change</button>';
  }

  // ---- 1: what to promote (PM's field order: name, product, then the type's own;
  // no platform question while the app is YouTube only) ----
  function promote(b, err) {
    var growth = b.type === 'growth', pl = N.PLATS.youtube;
    var html = U.text({ k: 'name', label: 'Campaign name', value: b.name, ph: 'Fernweh Coffee: spring launch', err: err.name })
      + U.text({ k: 'product', label: 'Product name', value: b.product, ph: 'Fernweh Coffee', err: err.product });
    if (growth) {
      html += U.text({ k: 'site', label: 'Reference websites', value: b.site, ph: 'fernwehcoffee.com, another-brand.com', plain: true,
        hint: 'Sites whose look and tone we should take cues from.' })
        + refs(b);
    } else {
      // the link field speaks YouTube: label, example and hint
      html += U.text({ k: 'postUrl', label: pl.urlLabel, value: b.postUrl, ph: pl.urlPh, hint: pl.urlHint, type: 'url', plain: true, err: err.postUrl })
        + U.chips({
          v: 'actions', attr: 'data-action', label: 'Action', err: err.actions, hint: 'What each member does.',
          items: N.ACTIONS.map(function (a) { return { value: a, on: b.actions.indexOf(a) >= 0 }; })
        });
    }
    return U.head(eyebrow(b), 'What to <em>promote</em>.') + '<div class="flow-fields">' + html + '</div>';
  }

  /* PM's reference control: links pasted in the box, or files picked under it.
     Two controls, so two labels; the file names are said back. Nothing is
     uploaded, as with every other control in this prototype. */
  function refs(b) {
    return '<div class="app-field" data-field="refs">'
      + '<label class="label" for="f-refs"><span>Reference videos <span class="opt">(optional)</span></span></label>'
      + '<textarea class="textarea nw-refs" id="f-refs" rows="3" data-k="refs" placeholder="Paste links, one per line" autocapitalize="none" spellcheck="false">'
      + esc(b.refs) + '</textarea>'
      + '<label class="nw-drop">' + U.I.upload
      + '<span class="nw-drop-t"><b>' + (b.refsFiles ? esc(b.refsFiles) : 'Upload instead') + '</b>Two or three videos is plenty.</span>'
      + '<input type="file" accept="video/*,image/*" multiple data-upload="refs"></label>'
      + '</div>';
  }

  // ---- 2: budget and schedule ----
  function estimate(b) {
    var e = N.estimate(b), growth = b.type === 'growth';
    if (e) { return 'That buys about <b>' + e.n.toLocaleString('en-US') + '</b> ' + esc(e.unit) + ', if every one of them passes.'; }
    if (!N.budgetOf(b)) { return growth ? 'Pick a budget to see how many views it covers.' : 'Pick a budget to see how many completions it covers.'; }
    return growth ? 'Enter a rate to see how many views your budget covers.' : 'Enter a bid to see how many completions your budget covers.';
  }

  function runs(b) {
    var n = N.days(b);
    return 'Times are in your time zone (' + N.zone() + ').' + (n ? ' Runs ' + n + (n === 1 ? ' day.' : ' days.') : '');
  }

  // Starts and Ends: PM's spelled-out date and half-hour time controls (new-cal.js)
  var when = window.onblueNewCal.field;

  function budget(b, err) {
    var t = T[b.type], growth = b.type === 'growth';
    var cards = N.PRESETS.map(function (p) {
      return '<button class="app-choice nw-budget" type="button" data-budget="' + p + '" aria-pressed="' + (b.budgetPick === p) + '">'
        + '<span class="nw-budget-v">' + N.money(p) + '</span>'
        + (p === '2000' ? '<span class="app-tag">Recommended</span>' : '') + '</button>';
    }).join('')
      + '<button class="app-choice nw-budget" type="button" data-budget="custom" aria-pressed="' + (b.budgetPick === 'custom') + '">'
      + '<span class="nw-budget-v">Custom</span></button>';
    var custom = b.budgetPick === 'custom';
    var html = '<div class="app-field" data-field="budget" role="group" aria-labelledby="l-budget">'
      + '<span class="label" id="l-budget"><span>Campaign budget</span></span>'
      + '<div class="nw-budgets' + (err.budget && !b.budgetPick ? ' is-bad' : '') + '">' + cards + '</div>'
      + (custom ? U.money({ k: 'budgetCustom', v: 'budget', value: b.budgetCustom, ph: '500', aria: 'Custom budget', err: err.budget, noHelp: true, cls: 'nw-half' }) : '')
      + U.help('budget', '', err.budget) + '</div>'
      + U.money({ k: 'bid', label: t.rateLabel, value: b.bid, ph: t.ratePh, err: err.bid, cls: 'nw-half',
        // one line in the one help slot, so an error replaces all of it
        // no "never pay more than your budget" promise: the report bills past it (Over budget),
        // and cap vs overrun is an open PM question (REVAMP-PLAN.md top section)
        hint: growth ? 'Minimum ' + N.price(t.min) + '. You pay this for every 1,000 views the campaign earns.' : 'The bid is what you pay for each completion.' })
      + '<div class="note-box" aria-live="polite">' + U.I.info + '<p id="nw-est">' + estimate(b) + '</p></div>'
      + '<div class="field-row">' + when('start', 'Starts', b, err) + when('end', 'Ends', b, err) + '</div>'
      + '<p class="nw-line nw-runs" id="nw-runs">' + esc(runs(b)) + '</p>';
    return U.head(eyebrow(b), 'Budget and <em>schedule</em>.') + '<div class="flow-fields">' + html + '</div>';
  }

  window.onblueNewSteps = { eyebrow: eyebrow, promote: promote, budget: budget, estimate: estimate, runs: runs };
})();
