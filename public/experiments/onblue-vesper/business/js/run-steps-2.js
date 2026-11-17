/* Steps 4 and 5 of the agent run (video ideas, the report going out),
   appended to OB.STEPS from run-steps.js.
   WHAT THE RUN NO LONGER PROMISES (Ashish, 2026-11-17): it used to make "your
   first Shorts" on the spot (with a "New take" button) and set a budget. Neither
   happens like that: our team makes the videos once a campaign starts, and the
   budget is set in the draft campaign. So the ideas are what we WOULD make, and
   the run ends with the report on its way and one next step, a draft campaign. */
(function () {
  'use strict';
  var OB = window.OB, e = OB.esc, K = OB.runKit;

  function onAngles(r) { return r.angles.filter(function (a) { return a.on; }); }
  // a title never breaks inside "10-second" (a non-breaking hyphen, as the app does)
  function nb(s) { return e(s).replace(/(\w)-(\w)/g, '$1‑$2'); }
  function list(names) { return names.length < 2 ? names.join('') : names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1]; }

  OB.STEPS.push(
    {
      key: 'angles', label: 'Video ideas',
      next: function (r) { return onAngles(r).length ? 'Finish my report' : 'Keep at least one idea'; },
      say: function (r) { return ['Finding video ideas for ' + K.nm(r), 'Matching your buyers to the formats that win.']; },
      work: ['Splitting your buyers into groups', 'Writing a message for each', 'Pairing each with a winning format'],
      // the wait names the audiences it is writing for
      asks: function (r) { var w = list(r.angles.map(function (a) { return a.who.toLowerCase(); })); return [K.proof(r.angles.length + ' ideas', w.charAt(0).toUpperCase() + w.slice(1) + '. One message each.')]; },
      done: function () { return ['Video ideas we\'d make for you', 'Each pairs an audience with a format that wins. Keep the ones that fit: once you start a campaign, our team makes them into Shorts.', 'ideas']; },
      result: function (r) {
        return '<div class="ob-cards2">' + r.angles.map(function (a, i) {
          // why this format, in words: its rank among what wins (the share itself is step 3's)
          var rank = r.formats.map(function (f) { return f.name; }).indexOf(a.format) + 1;
          var why = rank > 0 ? '#' + rank + ' in your category' : '';
          // an example Short of the idea's format, so the format reads as a picture, not a word
          var ex = OB.film(OB.filmFor(a.format, OB.hash(a.say)));
          return '<div class="ob-angle ob-angle--ex' + (a.on ? '' : ' is-off') + '" data-i="' + i + '" role="checkbox" tabindex="0" aria-checked="' + a.on + '">' +
            (ex && ex.poster ? '<span class="ob-angle-ex" aria-hidden="true"><img src="' + e(ex.poster) + '" alt="" loading="lazy"><em>Example</em></span>' : '') +
            '<span class="ob-angle-t"><small>For ' + e(a.who.charAt(0).toLowerCase() + a.who.slice(1)) + '</small><b>' + nb(a.say) +
            '</b><span class="ob-angle-fmt"><span class="ob-chip">' + e(a.format) + '</span>' + (why ? '<small>' + why + '</small>' : '') + '</span></span><em class="ob-angle-off">Off, tap to keep</em>' + K.tick() + '</div>';
        }).join('') + '</div>';
      },
      bind: function (out, r, api) {
        var label = function () { var b = K.nextLabel(out, OB.STEPS[3].next(r)); if (b) { b.disabled = !onAngles(r).length; } };
        var flip = function (c) {
          var a = r.angles[+c.getAttribute('data-i')]; a.on = !a.on;
          c.classList.toggle('is-off', !a.on); c.setAttribute('aria-checked', String(a.on)); api.save(); api.facts(); label();
        };
        label();
        out.addEventListener('click', function (ev) { var c = ev.target.closest('.ob-angle'); if (c) { flip(c); } });
        out.addEventListener('keydown', function (ev) { var c = ev.target.closest('.ob-angle'); if (c && (ev.key === ' ' || ev.key === 'Enter')) { ev.preventDefault(); flip(c); } });
      },
      facts: function (r) { return [['Video ideas', onAngles(r).map(function (a) { return a.who; }).join(', ') || 'None picked']]; }
    },
    {
      key: 'send', label: 'Your report', next: '',
      say: function () { return ['Putting your report together', 'Saving your brand profile to your account.']; },
      work: ['Writing up your report', 'Saving your brand profile', 'Sending it to your inbox'],
      asks: [],
      done: function (r) { return ['Your report is on its way', 'Sent to ' + (r.email || 'your inbox') + '. Your brand profile is saved to your account.', 'on its way']; },
      // what really happens next, in order: nothing here is made on the spot
      result: function (r) {
        var n = onAngles(r).length;
        var steps = [
          ['Draft your first campaign', 'It starts from your brand profile, so you only add the campaign details.'],
          ['We make the Shorts', 'Our team makes ' + (n === 1 ? 'your video idea' : 'the ' + n + ' video ideas you kept') + ' into Shorts and reviews every one.'],
          ['Creators post them', 'Each one goes out through a creator\'s BlueAI agent. You pay only for the views they get.']
        ];
        // the run's close, in the homepage's dark section: what the report holds
        var on = K.onRivals(r), real = on.some(function (x) { return x.yt; });
        var recap = '<div class="ob-recap ob-dark"><span class="ob-chip ob-chip--volt">Your report</span><div class="ob-recap-figs">' +
          '<div><b>' + e(r.formats[0].name) + '</b><span>wins, ' + r.formats[0].share + '% of views</span></div>' +
          '<div><b>' + on.length + '</b><span>competitor' + (on.length === 1 ? '' : 's') + (real ? ', real YouTube numbers' : '') + '</span></div>' +
          '<div><b>' + n + '</b><span>video idea' + (n === 1 ? '' : 's') + ' to make</span></div></div>' +
          '<p class="ob-recap-to">' + OB.icon('mail', 15) + 'Sent to <b>' + e(r.email || 'your inbox') + '</b></p></div>';
        return recap + '<div class="ob-card ob-nextup"><h3>What happens next</h3><ol>' + steps.map(function (s, i) {
          return '<li><i>' + (i + 1) + '</i><span><b>' + e(s[0]) + '</b>' + e(s[1]) + '</span></li>';
        }).join('') + '</ol></div>' +
          '<div class="ob-next"><button class="ob-btn ob-btn--ink" type="button" data-start>Start a draft campaign ' + OB.icon('arrow', 16) + '</button>' +
          '<a class="ob-link ob-later-link" href="index.html">Done for now</a></div>';
      },
      bind: function (out, r, api) {
        out.querySelector('[data-start]').addEventListener('click', function () { api.start(); });
      },
      facts: function () { return []; }
    }
  );
})();
