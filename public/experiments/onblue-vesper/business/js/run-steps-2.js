/* Steps 4 to 6 of the agent run (angles, first Shorts, plan), appended to
   OB.STEPS from run-steps.js. Every screen here follows what you picked
   earlier: one Short per angle you kept, each on a format from step 3, and the
   plan from your goal and where your buyers are. */
(function () {
  'use strict';
  var OB = window.OB, e = OB.esc, K = OB.runKit;

  function onAngles(r) { return r.angles.filter(function (a) { return a.on; }); }
  // a title never breaks inside "10-second" (a non-breaking hyphen, as the app does)
  function nb(s) { return e(s).replace(/(\w)-(\w)/g, '$1\u2011$2'); }
  function shorts(n) { return n + ' Short' + (n === 1 ? '' : 's'); }
  function list(names) { return names.length < 2 ? names.join('') : names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1]; }
  // one Short per angle you kept, and the kept angles move to the front so
  // every later screen pairs them the same way
  function syncVideos(r) {
    var on = onAngles(r);
    r.angles = on.concat(r.angles.filter(function (a) { return on.indexOf(a) < 0; }));
    r.videos = on.map(function (a) {
      var had = r.videos.filter(function (v) { return v.who === a.who; })[0];
      return had || { title: a.say, format: a.format, film: OB.filmFor(a.format, OB.hash(a.say)), who: a.who };
    });
    return r.videos;
  }
  // a phone swipes the Shorts sideways: the dots under the row say which one is
  // in view and jump to any of them (shown at 860 and below, run-2.css)
  function dots(out) {
    var row = out.querySelector('.ob-vids'), box = out.querySelector('[data-dots]'), rest = 0;
    if (!row || !box) { return; }
    var pad = function () { return parseFloat(getComputedStyle(row).scrollPaddingLeft) || 0; };
    var off = function (c) { return c.getBoundingClientRect().left - row.getBoundingClientRect().left - pad(); };
    var mark = function (k) { Array.prototype.forEach.call(box.children, function (d, j) { if (j === k) { d.setAttribute('aria-current', 'true'); } else { d.removeAttribute('aria-current'); } }); };
    box.addEventListener('click', function (ev) {
      var k = Array.prototype.indexOf.call(box.children, ev.target.closest('button')); if (k < 0) { return; }
      row.scrollBy({ left: off(row.children[k]), behavior: 'smooth' }); mark(k);
    });
    // a swipe counts once the row rests
    row.addEventListener('scroll', function () {
      window.clearTimeout(rest);
      rest = window.setTimeout(function () {
        var best = 0;
        Array.prototype.forEach.call(row.children, function (c, j) { if (Math.abs(off(c)) < Math.abs(off(row.children[best]))) { best = j; } });
        mark(best);
      }, 120);
    }, { passive: true });
  }
  // another clip of the same format, when the library has one
  function nextFilm(v) {
    var hits = [];
    OB.FILMS.forEach(function (f, i) { if (f[1].toLowerCase() === String(v.format).toLowerCase()) { hits.push(i); } });
    if (hits.length < 2) { return v.film; }
    return hits[(hits.indexOf(v.film) + 1) % hits.length];
  }
  function where(r) { return r.where === 'UK' ? 'the UK' : r.where === 'Worldwide' ? 'the rest of the world' : r.where; }
  function us(r) { return r.where === 'United States'; }

  OB.STEPS.push(
    {
      key: 'angles', label: 'Your angles',
      next: function (r) { var n = onAngles(r).length; return n ? 'Make my first ' + shorts(n) : 'Keep at least one angle'; },
      say: function (r) { return ['Finding angles for ' + K.nm(r), 'Matching your buyers to the formats that win.']; },
      work: ['Splitting your buyers into groups', 'Writing a message for each', 'Pairing each with a winning format'],
      // the wait names the audiences it is writing for
      asks: function (r) { var w = list(r.angles.map(function (a) { return a.who.toLowerCase(); })); return [K.proof(r.angles.length + ' angles', w.charAt(0).toUpperCase() + w.slice(1) + '. One message each.')]; },
      done: function () { return ['Angles worth going after', 'Each pairs an audience with a format that wins. Turn off any that don\'t fit. I make one Short for each angle you keep.', 'Angles']; },
      result: function (r) {
        return '<div class="ob-cards2">' + r.angles.map(function (a, i) {
          var s = K.share(r, a.format);
          return '<div class="ob-angle' + (a.on ? '' : ' is-off') + '" data-i="' + i + '" role="checkbox" tabindex="0" aria-checked="' + a.on + '"><small>' + e(a.who) + '</small><b>' + nb(a.say) +
            '</b><span class="ob-chip">' + e(a.format) + (s ? ' &middot; ' + s + '%' : '') + '</span><em class="ob-angle-off">Off, tap to keep</em>' + K.tick() + '</div>';
        }).join('') + '</div>';
      },
      bind: function (out, r, api) {
        var label = function () { var nb = K.nextLabel(out, OB.STEPS[3].next(r)); if (nb) { nb.disabled = !onAngles(r).length; } };
        var flip = function (c) {
          var a = r.angles[+c.getAttribute('data-i')]; a.on = !a.on;
          c.classList.toggle('is-off', !a.on); c.setAttribute('aria-checked', String(a.on)); api.save(); api.facts(); label();
        };
        label();
        out.addEventListener('click', function (ev) { var c = ev.target.closest('.ob-angle'); if (c) { flip(c); } });
        out.addEventListener('keydown', function (ev) { var c = ev.target.closest('.ob-angle'); if (c && (ev.key === ' ' || ev.key === 'Enter')) { ev.preventDefault(); flip(c); } });
      },
      facts: function (r) { return [['Angles', onAngles(r).map(function (a) { return a.who; }).join(', ') || 'None picked']]; }
    },
    {
      key: 'videos', label: 'First Shorts', next: 'See my plan',
      say: function (r) { var n = onAngles(r).length; return ['Making the first Shorts for ' + K.nm(r), shorts(n) + ', one for each angle you kept, on the formats that win.']; },
      work: ['Writing the scripts', 'Making the scenes', 'Adding voice and captions', 'Cutting to Shorts length'],
      asks: [K.proof('~30 s', 'each, cut to the length that keeps people watching to the end.')],
      done: function (r) {
        var n = syncVideos(r).length, sub = 'Made for ' + K.nm(r) + ', one per angle you kept. Ask for a new take on any of them.';
        return n === 1 ? ['Your first Short', sub, 'Short'] : ['Your first ' + n + ' Shorts', sub, 'Shorts'];
      },
      result: function (r) {
        var vs = syncVideos(r);
        return '<div class="ob-vids" style="--n:' + Math.max(3, vs.length) + '">' + vs.map(function (v, i) {
          var f = OB.film(v.film);
          // the format sits under the video, never on it (burnt-in captions)
          // a Short's corner badge: play mark and length, clear of the burnt-in captions
          return '<div class="ob-vid"><div class="ob-phone">' + OB.videoTag(f) + '<span class="ob-vid-len">' + OB.icon('play', 11) + '0:' + (24 + OB.hash(v.title) % 9) + '</span><span class="ob-vid-making">Making a new take</span></div><div class="ob-vid-txt"><small>' + e(v.format) + '</small><b>' + nb(v.title) +
            '</b></div><div class="ob-vid-foot"><button class="ob-btn ob-btn--sm" type="button" data-take="' + i + '">' + OB.icon('redo', 15) + 'New take</button></div></div>';
        }).join('') + '</div>' + (vs.length > 1 ? '<div class="ob-dots" data-dots>' + vs.map(function (v, i) {
          return '<button type="button" aria-label="Short ' + (i + 1) + ' of ' + vs.length + '"' + (i ? '' : ' aria-current="true"') + '></button>';
        }).join('') + '</div>' : '');
      },
      bind: function (out, r, api) {
        OB.watchFilms(out);
        api.save();
        dots(out);
        out.addEventListener('click', function (ev) {
          var b = ev.target.closest('[data-take]'); if (!b || b.disabled) { return; }
          var v = r.videos[+b.getAttribute('data-take')], card = b.closest('.ob-vid');
          b.disabled = true; card.classList.add('is-making');
          window.setTimeout(function () {
            v.film = nextFilm(v); api.save();
            var ph = card.querySelector('.ob-phone video'), f = OB.film(v.film);
            ph.poster = f.poster; ph.src = f.src; ph.play().catch(function () {});
            card.classList.remove('is-making'); b.disabled = false;
            if (api.is('videos')) { api.toast('New take of "' + v.title + '" ready'); }
          }, 1100);
        });
      },
      facts: function (r) { return [['First Shorts', shorts(onAngles(r).length) + ', one per angle']]; }
    },
    {
      key: 'plan', label: 'Your plan', next: '',
      say: function () { return ['Putting your plan together', 'Setting a starting budget from everything so far.']; },
      work: ['Lining up your first Shorts', 'Setting a starting budget', 'Writing up your report'],
      asks: function (r) { return [K.proof('$8', 'per 1,000 US views: the rate your budget buys.' + (us(r) ? '' : ' Views are billed in the US for now.'))]; },
      // the line explains the number: what the budget does for the Shorts you kept
      done: function (r) {
        var n = onAngles(r).length, each = n > 1 ? 'each of your ' + n + (window.matchMedia('(max-width: 700px)').matches ? '\u00a0' : ' ') + 'Shorts' : 'your Short';
        var sub = r.budget === 500 ? 'I started you at $500 so ' + each + ' gets a fair test. Move it to suit you.' : '$' + OB.fmt(r.budget) + ' in total' + (n > 1 ? ', shared across your ' + n + ' Shorts' : ', for your Short') + '. Move it any time.';
        return [r.name ? 'Your plan, ' + r.name : 'Your plan', sub, 'plan'];
      },
      result: function (r, api) {
        var vs = onAngles(r);
        // the audience you confirmed in step 1, where they are, and a guessed market says so
        // the last word and the tag wrap together, so the tag is never alone
        var aud = '<span class="ob-planrows-v ob-aud">' + e(r.buyers).replace(/(\d+) to (\d+)/g, '<span class="ob-nwp">$1 to $2</span>') + (us(r) ? ' <span class="ob-nw">in the US' : ', in the US for <span class="ob-nw">now') + (K.marketGuess(r) ? ' <em class="ob-guess">my guess</em>' : '') + '</span></span>' +
          (us(r) ? '' : '<span class="ob-planrows-note">You said your buyers are in ' + e(where(r)) + '. Views are billed in the US only for now, so BlueAI starts with US buyers and adds ' + e(where(r)) + ' when it opens.</span>');
        return '<div class="ob-planbox"><div class="ob-slider-out" data-amount></div>' +
          '<div class="ob-hint" data-say></div><input class="ob-range" type="range" min="100" max="5000" step="50" value="' + r.budget + '" aria-label="Budget in dollars" data-budget>' +
          '<div class="ob-range-x"><span>$100</span><span>$5,000</span></div>' +
          '<dl class="ob-planrows"><div><dt>Shorts</dt><dd><span class="ob-planrows-v">' + shorts(vs.length) + ' made</span><span class="ob-planrows-note">One each for ' + e(list(vs.map(function (a) { return a.who.toLowerCase(); }))) + '.</span></dd></div>' +
          (r.goal ? '<div><dt>Aims at</dt><dd><span class="ob-planrows-v">' + e(r.goal) + '</span></dd></div>' : '') +
          '<div><dt>Posts on</dt><dd><span class="ob-chip ob-chip--on">' + OB.icon('youtube', 16) + 'YouTube Shorts</span><span class="ob-chip ob-chip--soon">TikTok &middot; soon</span><span class="ob-chip ob-chip--soon">Instagram &middot; soon</span><span class="ob-planrows-note ob-soon-line">TikTok and Instagram soon</span></dd></div>' +
          '<div><dt>Audience</dt><dd>' + aud + '</dd></div></dl>' +
          '<div class="ob-promise"><span class="ob-yes ob-yes--sm">' + OB.icon('check', 12) + '</span><span>You pay only for US views that happen. If a video doesn\'t land, it costs you nothing.</span></div></div>' +
          '<div class="ob-next"><button class="ob-btn ob-btn--ink" type="button" data-signup>' + (api && api.saved() ? 'Start with this plan ' : 'Save my report and start ') + OB.icon('arrow', 16) + '</button></div>' +
          '<div class="ob-mailrow" data-mailrow></div>';
      },
      bind: function (out, r, api) {
        var range = out.querySelector('[data-budget]'), row = out.querySelector('[data-mailrow]');
        var show = function () {
          r.budget = +range.value; api.save();
          out.querySelector('[data-amount]').textContent = '$' + OB.fmt(r.budget);
          range.style.setProperty('--p', ((r.budget - 100) / 4900 * 100) + '%');
          var views = r.budget / OB.RATE * 1000, n = onAngles(r).length;
          out.querySelector('[data-say]').textContent = 'Pays for up to ' + OB.fmt(views) + ' US views at $' + OB.RATE + ' per 1,000' + (n > 1 ? ', about ' + OB.fmt(Math.round(views / n / 100) * 100) + ' per Short' : '');
          api.facts();
        };
        range.addEventListener('input', show); show();
        // the email fallback: a compact form, then a lasting "sent" line (no toast on top of it)
        var mail = function () {
          // saved already: a quiet confirmation, no second ask under the CTA
          if (api.saved()) { row.innerHTML = '<p class="ob-sent"><span class="ob-yes ob-yes--sm">' + OB.icon('check', 12) + '</span>Report saved to <b>' + e(r.email) + '</b></p>'; return; }
          // emailed: say where it is and how to come back, and turn the CTA into one
          // row of two choices: start now, or done for now (back to the homepage,
          // whose hero then offers "Continue your report")
          var later = out.querySelector('[data-later]');
          if (later) { later.remove(); }
          if (r.mailed) {
            row.innerHTML = '<p class="ob-sent"><span class="ob-yes ob-yes--sm">' + OB.icon('check', 12) + '</span>Sent to <b>' + e(r.mailed) + '</b><button class="ob-link" type="button" data-change>Change</button></p>' +
              '<p class="ob-sent-say">Your report is in your inbox. Open it any time to pick up right here, at your plan.</p>';
            row.querySelector('[data-change]').addEventListener('click', function () { r.mailed = ''; api.save(); mail(); });
            out.querySelector('.ob-next').insertAdjacentHTML('beforeend', '<a class="ob-btn ob-later" href="./" data-later>Done for now, back to onBlue</a>');
            return;
          }
          row.innerHTML = '<p>Not ready yet? Get the report by email.</p><form class="ob-add" data-mail><input class="ob-input" type="email" placeholder="you@yourbrand.com" aria-label="Email" required value="' + e(r.email || '') + '"><button class="ob-btn ob-btn--sm" type="submit">' + OB.icon('mail', 15) + 'Email it to me</button></form>';
          row.querySelector('[data-mail]').addEventListener('submit', function (ev) {
            ev.preventDefault(); var v = ev.target.querySelector('input').value.trim();
            r.email = v; r.mailed = v; api.save(); mail();
          });
        };
        mail();
        out.querySelector('[data-signup]').addEventListener('click', function () { api.signup('start'); });
      },
      facts: function (r) { return [['Budget', '$' + OB.fmt(r.budget) + ' at $8 per 1,000 US views']]; }
    }
  );
})();
