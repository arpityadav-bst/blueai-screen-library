/* ==========================================================================
   onBlue: the state toggler. A review control, not part of the product.

   EVERYTHING IT STYLES IS DEFINED IN HERE, and everything it switches is
   defined in onblue.css. That split is the point: delete this file and the
   page loses a shortcut, not a variant. The minimal steps still exist and are
   still reachable by putting .is-min on the dialog by hand.

   TWO PAGES, ONE BAR, AND IT ONLY APPEARS WHERE ITS STATES ARE. On the homepage
   it switches the access dialog's four steps between Full and Minimal, and it
   exists only while that dialog is open. On the application it switches the page
   between the application flow and the approved dashboard.
   The dialog case also solves the top layer: a <dialog> opened with showModal()
   sits above everything, and no z-index outside it can reach, so a bar parked on
   <body> would be buried at exactly the moment it is needed. Inside the dialog
   it is both reachable and nowhere else.
   ========================================================================== */
(function () {
  'use strict';

  var gate = document.getElementById('gate');
  var dash = document.getElementById('dash');
  if (!gate && !dash) { return; }

  var css = document.createElement('style');
  css.textContent = [
    /* THE DOCK IS FIXED, THE BARS ARE NOT. Two bars each positioning itself
       would have landed one on top of the other at the same corner. */
    /* THE DOCK IS FIXED, THE BARS ARE NOT. Two bars each positioning itself
       would have landed one on top of the other at the same corner. Stacked
       rather than in a row, so a bar that only applies in one state sits above
       the switch that reaches that state and reads as belonging to it. */
    '.devdock{position:fixed;left:14px;bottom:14px;z-index:60;display:flex;flex-direction:column;align-items:flex-start;gap:6px}',
    '.devbar{display:flex;gap:4px;',
    'padding:5px;border:1px solid var(--border);border-radius:10px;',
    'background:var(--card-bg);box-shadow:0 6px 20px -12px rgba(18,32,64,.25);',
    'opacity:.32;transition:opacity .22s ease}',
    '.devbar:hover,.devbar:focus-within{opacity:1}',
    /* a class sets display here, so [hidden] has to say it too */
    '.devbar[hidden]{display:none}',
    '.devbar b{align-self:center;padding:0 7px 0 5px;color:var(--dim-ink);',
    'font-size:10px;font-weight:600;letter-spacing:.09em;text-transform:uppercase}',
    '.devbar button{padding:6px 10px;border:1px solid transparent;border-radius:6px;',
    'background:none;color:var(--muted);font:inherit;font-size:12.5px;',
    'letter-spacing:-.01em;cursor:pointer;transition:background .2s ease,color .2s ease}',
    '.devbar button:hover{background:var(--surface-hover);color:var(--ink)}',
    /* the pressed state borrows .step-num's blue pair rather than inventing a
       third: this bar has no business adding tokens to the page it is reviewing */
    '.devbar button[aria-pressed="true"]{border-color:rgba(21,110,254,.45);',
    'background:rgba(21,110,254,.16);color:var(--ink)}'
  ].join('');
  document.head.appendChild(css);

  /* A SWITCH, NOT A CHECKBOX. Neither state is a modification of the other, so
     both are named and one is always lit, rather than one of them being "the
     default" and the other being the state of a control. */
  function build(spec) {
    var bar = document.createElement('div');
    /* the spec names its own default rather than it falling out of button
       order: which state a screen opens in and which order the buttons read in
       are two different decisions */
    var on = spec.initial || spec.states[0].id;
    try { on = window.localStorage.getItem(spec.store) || on; } catch (e) {}
    if (!spec.states.some(function (st) { return st.id === on; })) { on = spec.states[0].id; }

    bar.className = 'devbar';
    bar.innerHTML = '<b>' + spec.label + '</b>' + spec.states.map(function (st) {
      return '<button type="button" data-dev="' + st.id + '">' + st.name + '</button>';
    }).join('');

    function paint() {
      spec.apply(on);
      Array.prototype.forEach.call(bar.querySelectorAll('button'), function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-dev') === on ? 'true' : 'false');
      });
    }
    paint();

    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) { return; }
      on = btn.getAttribute('data-dev');
      try { window.localStorage.setItem(spec.store, on); } catch (e2) {}
      paint();
    });
    return bar;
  }

  /* EVERY BAR GOES IN A DOCK, because the dock is what positions it. The two
     were one element until the application needed a second bar; splitting them
     left the dialog's bar with no position of its own and it laid out inside the
     panel as ordinary content. A helper rather than a rule to remember. */
  function dock(bars) {
    var d = document.createElement('div');
    d.className = 'devdock';
    bars.forEach(function (b) { d.appendChild(b); });
    return d;
  }

  if (gate && gate.querySelector('.gate-steps')) {
    var steps = dock([build({
      label: 'Steps', store: 'onblue:dev-steps', initial: 'min',
      states: [{ id: 'full', name: 'Full' }, { id: 'min', name: 'Minimal' }],
      apply: function (on) { gate.classList.toggle('is-min', on === 'min'); }
    })]);
    /* only while the dialog is open, which is the only time its steps exist */
    var place = function () {
      if (gate.open) { gate.appendChild(steps); } else { steps.remove(); }
    };
    place();
    new MutationObserver(place).observe(gate, { attributes: true, attributeFilter: ['open'] });
  }

  if (dash) {
    /* THE PAGE OWNS BOTH SWITCHES, NOT THIS FILE. Flipping a class here would
       leave the application's own script believing it was still the thing on
       screen, and writing figures here would leave the dashboard's two datasets
       with a third opinion. window.onblueApproved and window.onblueAccount are
       the page's doors into those states, and going through them is what keeps
       the toggler and the page in agreement about what is true. */
    /* BUILT FIRST SO IT EXISTS TO BE HIDDEN. build() paints on construction, and
       the page switch's paint is what decides whether this one is showing, so
       the order here is a dependency rather than a layout choice. Which states
       an account has is a question only the dashboard asks; on the application
       the control would be a switch with nothing on the other end. */
    var account = build({
      label: 'Account', store: 'onblue:dev-account',
      /* the label is the page's, not this file's: the creator dashboard has one
         programme and the brands one has one campaign, and a bar that said the
         same word on both would be describing only one of them */
      states: [{ id: 'empty', name: 'Empty' }, { id: 'one', name: dash.getAttribute('data-one') || 'One program' }],
      apply: function (on) {
        if (window.onblueAccount) { window.onblueAccount(on); }
      }
    });
    document.body.appendChild(dock([account, build({
      /* THREE STAGES, NOT TWO, and they are values of one thing rather than a
         pair of switches: in review, creating a campaign, and managing them.
         window.onblueStage is the page's own door into all three. */
      label: 'Stage', store: 'onblue:dev-stage',
      states: [{ id: 'review', name: 'In review' },
               { id: 'apply', name: 'Create' },
               { id: 'dash', name: 'Campaigns' }],
      apply: function (on) {
        account.hidden = on !== 'dash';
        if (window.onblueStage) { window.onblueStage(on); }
        else if (window.onblueApproved) { window.onblueApproved(on === 'dash'); }
      }
    })]));
  }
})();
