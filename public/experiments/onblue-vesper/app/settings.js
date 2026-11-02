/* Agency settings (G1): the agency's name and website, editable; the work email,
   read only. Save rests until something actually changed, so the button can
   never claim there is something to save when there is not. REVAMP-PLAN.md 3.9. */
(function () {
  'use strict';

  var app = window.onblueApp;
  var A = window.onblueAgency;
  var S = app.session;

  var form = document.getElementById('set');
  var name = document.getElementById('set-name');
  var site = document.getElementById('set-site');
  var mail = document.getElementById('set-mail');
  var av = document.getElementById('set-av');
  var save = document.getElementById('set-save');
  var note = document.getElementById('set-note');
  var NOTE = note.textContent;
  var busy = false;

  // what is on record; Save compares against this, not against the last keystroke
  var saved = { name: S.agency, site: A.get('onblue:site') };
  name.value = saved.name;
  site.value = saved.site;
  mail.value = S.email;

  // read only: where the agency stands with us, said the way the sidebar says it
  var pill = document.getElementById('set-status'), review = S.status === 'review';
  pill.className = 'app-status app-status--' + (review ? 'review' : 'live');
  pill.textContent = review ? 'In review' : 'Approved';
  document.getElementById('set-status-help').hidden = !review;

  function paint() { A.paintAvatar(av, name.value, site.value); }
  function dirty() { return name.value.trim() !== saved.name || site.value.trim() !== saved.site; }
  function sync() {
    // the name is required: an emptied field is not something to save
    save.setAttribute('aria-disabled', String(!dirty() || !name.value.trim()));
    // a failed save stops being news the moment the agency edits again
    note.textContent = NOTE;
    note.classList.remove('is-err');
  }
  paint();

  name.addEventListener('input', function () { A.fieldError(name, ''); paint(); sync(); });
  // said when the agency leaves the field empty, not only after a Save that never fires
  name.addEventListener('blur', function () { A.fieldError(name, name.value.trim() ? '' : A.ERR.name); });
  site.addEventListener('input', sync);
  site.addEventListener('change', paint);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (busy || save.getAttribute('aria-disabled') === 'true') { return; }
    if (A.fieldError(name, name.value.trim() ? '' : A.ERR.name)) { name.focus(); return; }
    busy = true;
    save.style.minWidth = save.offsetWidth + 'px';
    save.setAttribute('aria-busy', 'true');
    save.innerHTML = '<span class="app-spin" aria-hidden="true"></span>Saving…';
    // stands in for the request, so the busy state is seen rather than flashed
    window.setTimeout(commit, 600);
  });

  function commit() {
    var next = { name: name.value.trim(), site: site.value.trim() };
    var ok = A.set('onblue:agency', next.name) && A.set('onblue:site', next.site);
    busy = false;
    save.removeAttribute('aria-busy');
    save.style.minWidth = '';
    save.textContent = 'Save';
    if (!ok) {
      note.textContent = 'We couldn’t save. Try again.';
      note.classList.add('is-err');
      return;
    }
    saved = next;
    name.value = next.name;
    site.value = next.site;
    save.setAttribute('aria-disabled', 'true');
    // the sidebar names the agency, so it is redrawn with the new name in place
    S.agency = next.name;
    app.setStatus(S.status);
    app.toast('Settings saved');
  }
})();
