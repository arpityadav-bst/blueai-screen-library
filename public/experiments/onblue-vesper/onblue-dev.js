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
    '.devbar{position:fixed;left:14px;bottom:14px;z-index:60;display:flex;gap:4px;',
    'padding:5px;border:1px solid var(--border);border-radius:10px;',
    'background:var(--card-bg);box-shadow:0 6px 20px -12px rgba(18,32,64,.25);',
    'opacity:.32;transition:opacity .22s ease}',
    '.devbar:hover,.devbar:focus-within{opacity:1}',
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
    var on = spec.states[0].id;
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

  if (gate) {
    var steps = build({
      label: 'Steps', store: 'onblue:dev-steps',
      states: [{ id: 'full', name: 'Full' }, { id: 'min', name: 'Minimal' }],
      apply: function (on) { gate.classList.toggle('is-min', on === 'min'); }
    });
    /* only while the dialog is open, which is the only time its steps exist */
    var place = function () {
      if (gate.open) { gate.appendChild(steps); } else { steps.remove(); }
    };
    place();
    new MutationObserver(place).observe(gate, { attributes: true, attributeFilter: ['open'] });
  }

  if (dash) {
    /* THE PAGE OWNS THE SWITCH, NOT THIS FILE. Flipping the class here would
       leave the application's own script believing it was still the thing on
       screen; window.onblueApproved is the page's one door into that state, and
       going through it is what keeps the two in agreement. */
    document.body.appendChild(build({
      label: 'Account', store: 'onblue:dev-account',
      states: [{ id: 'apply', name: 'Application' }, { id: 'dash', name: 'Approved' }],
      apply: function (on) {
        if (window.onblueApproved) { window.onblueApproved(on === 'dash'); }
      }
    }));
  }
})();
