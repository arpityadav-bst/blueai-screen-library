/* The six steps of the agent run, as data: what BlueAI says, what it ticks
   off while it works, what it asks or shows in the wait, the result, and the
   facts it adds to the left column. run.js plays them. Steps 1 to 3 live here,
   4 to 6 in run-steps-2.js. Exposes OB.STEPS and the shared kit OB.runKit.
   done() returns [heading, line, word]: the word gets the homepage halftone. */
(function () {
  'use strict';
  var OB = window.OB, e = OB.esc;

  // shown is what the row prints, n its size (they differ for a percent or "~30")
  function hbar(label, shown, max, cls, n) {
    if (n === undefined) { n = shown; }
    return '<div class="ob-hbar' + (cls ? ' ' + cls : '') + '"><span>' + e(label) + '</span><div class="ob-hbar-t"><span style="width:' +
      Math.max(2, Math.round(n / max * 100)) + '%"></span></div><b>' + e(shown) + '</b></div>';
  }
  function proof(big, say) { return { kind: 'proof', big: big, say: say }; }
  // the brand as BlueAI names it in a sentence: "your brand" when there is no name
  function nm(r) { return r.brand === 'Your brand' ? 'your brand' : r.brand; }
  function poss(r) { return r.brand === 'Your brand' ? 'your brand\'s' : r.brand + '\'s'; }
  function head(title, note) { return '<div class="ob-panel-h"><h3>' + e(title) + '</h3>' + (note ? '<span>' + e(note) + '</span>' : '') + '</div>'; }
  function tick() { return '<span class="ob-tick" aria-hidden="true">' + OB.icon('check', 14) + '</span>'; }
  function onRivals(r) { return r.rivals.filter(function (x) { return x.on && !x.checking; }); }
  function checking(r) { return r.rivals.filter(function (x) { return x.checking; })[0]; }
  // keep every number that depends on the rival list true to what is ticked
  function syncRivals(r) {
    var on = onRivals(r);
    r.rivalsTotal = on.reduce(function (s, x) { return s + x.videos; }, 0);
    r.perMonth = Math.round(r.rivalsTotal / 6);
    if (on.length && !on.some(function (x) { return x.name === r.longest.rival; })) { r.longest.rival = on[0].name; }
  }
  function estimated(r) { return onRivals(r).some(function (x) { return x.est; }); }
  function nextLabel(out, text) {
    var nb = out.querySelector('[data-next]');
    if (nb && !nb.hasAttribute('data-back')) { nb.innerHTML = e(text) + ' ' + OB.icon('arrow', 16); }
    return nb;
  }
  // a film whose label is this format, or -1 (only real matches get shown)
  function filmOf(name) {
    var hit = -1;
    OB.FILMS.forEach(function (f, i) { if (hit < 0 && f[1].toLowerCase() === String(name).toLowerCase()) { hit = i; } });
    return hit;
  }
  function share(r, name) { var f = r.formats.filter(function (x) { return x.name === name; })[0]; return f ? f.share : 0; }
  // the market: a website never says where buyers are, so on that path it is a
  // guess until you set it; facts carry the flag ('guess') and the column marks it
  function marketGuess(r) { return !!r.site && !r.whereSet; }
  function rank(list) { return list.slice().sort(function (a, b) { return b.videos - a.videos; }); }
  function phone() { return window.matchMedia('(max-width: 700px)').matches; }
  OB.runKit = { hbar: hbar, proof: proof, nm: nm, poss: poss, head: head, tick: tick, onRivals: onRivals, syncRivals: syncRivals, nextLabel: nextLabel, share: share, marketGuess: marketGuess };

  var GOALS = ['More views', 'More sales', 'Launching something', 'Growing a channel'];
  var WHERE = ['United States', 'UK', 'Canada', 'Worldwide'];
  // what a winning format is, in a line, so the result says what to make
  var DEF = {
    'Talking product': 'Your product talks to camera and solves one problem in about 10 seconds.',
    'Then vs now': 'The old, slow way next to your way, cut side by side.',
    'Deal reveal': 'An offer held back, then revealed in the last few seconds.',
    'Photoreal story': 'A short, real-looking scene where your product saves the moment.',
    'Animated story': 'A small animated story with your product at the turn.'
  };
  function grow(t) { t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; }
  function answers(r) {
    var f = [];
    if (r.name) { f.push(['Your name', r.name]); }
    if (r.goal) { f.push(['Goal', r.goal]); }
    return f;
  }
  // one set of labels for the cards and the column; on the step's own result
  // the column dims the four rows the cards already show (cur)
  function brandFacts(r, cur) {
    var d = cur ? 'dim' : '', g = r.site ? '' : 'guess';
    return { sell: ['What you sell', r.sell, d], buyers: ['Who buys', r.buyers, d], market: ['Market', r.where, marketGuess(r) ? 'guess' : ''],
      voice: ['How you sound', r.voice, d + ' ' + g], edge: ['Your edge', r.edge, d + ' ' + g], cat: ['Category', r.category] };
  }
  function marketLine(r) {
    // the place, the tag and Change wrap as one group on a phone (run-2.css)
    return (phone() ? 'Buyers in' : 'Selling to buyers in') + ' <span class="ob-market-v"><b>' + e(r.where) + '</b>' + (marketGuess(r) ? ' <em class="ob-guess">my guess</em>' : '') + '<button class="ob-link" type="button" data-market>Change</button></span>';
  }

  OB.STEPS = [
    {
      key: 'brand', label: 'Your brand', next: 'Looks right',
      say: function (r) { return r.site ? ['Reading ' + r.site, 'This takes about a minute. A couple of quick questions while I work.'] : ['Getting to know ' + nm(r), 'A couple of quick questions while I work.']; },
      // no website: BlueAI works from the answers you gave, so it says so
      work: function (r) {
        return r.site ? ['Opening your homepage', 'Finding what you sell', 'Working out who buys', 'Reading how you sound', 'Writing your brand profile']
          : ['Reading what you told me', 'Placing you in a category', 'Sharpening who buys', 'Choosing how you should sound', 'Writing your brand profile'];
      },
      asks: function (r) {
        var first = r.site ? { kind: 'text', key: 'name', q: 'What should I call you?', ph: 'Your first name' }
          : { kind: 'text', key: 'brand', q: 'What\'s your brand called?', ph: 'Your brand name' };
        var thanks = r.name ? 'Thanks, ' + r.name + '. ' : r.brand !== 'Your brand' && !r.site ? 'Thanks. ' : '';
        return [first, { kind: 'pick', key: 'goal', q: thanks + 'What matters most right now?', picks: GOALS }];
      },
      // what the column learns as each checklist line ticks (n lines done)
      live: function (r, n) {
        var f = [], b = brandFacts(r);
        if (r.site) {
          if (n >= 2) { f.push(b.cat, b.sell); }
          if (n >= 3) { f.push(b.buyers, b.market); }
          if (n >= 4) { f.push(b.voice); }
        } else {
          if (n >= 1) { f.push(b.sell, b.buyers, b.market); }
          if (n >= 2) { f.push(b.cat); }
          if (n >= 4) { f.push(b.voice); }
        }
        return f.concat(answers(r));
      },
      done: function (r) {
        var sub = 'Fix anything that\'s off' + (r.name ? ', ' + r.name : '') + '. Every video I make will use this' + (r.goal ? ' and aim at ' + r.goal.toLowerCase() : '') + '.';
        var word = r.brand === 'Your brand' ? 'gaps filled in' : r.brand;
        return [r.site ? 'Here\'s ' + nm(r) + ', as I read it' : 'Here\'s ' + nm(r) + ', with the gaps filled in', sub, word];
      },
      result: function (r) {
        var b = brandFacts(r);
        return '<div class="ob-cards2">' + ['sell', 'buyers', 'edge', 'voice'].map(function (k) {
          var x = b[k], guess = / guess/.test(x[2]);
          return '<div class="ob-edit"><label for="ob-e-' + k + '">' + x[0] + (guess ? ' <em class="ob-guess">my guess</em>' : '') + '</label><textarea id="ob-e-' + k + '" rows="1" data-k="' + k + '">' + e(r[k]) + '</textarea></div>';
        }).join('') + '</div><p class="ob-market" data-market-row>' + marketLine(r) + '</p>' +
          '<p class="ob-upnext">Still to come: ' + OB.STEPS.slice(1).map(function (s) { return '<b>' + e(s.label) + '</b>'; }).join(', ') + '</p>';
      },
      bind: function (out, r, api) {
        // the market is the likeliest wrong fact, so it can be fixed right here
        var mrow = out.querySelector('[data-market-row]');
        mrow.addEventListener('click', function (ev) {
          if (ev.target.closest('[data-market]')) {
            mrow.innerHTML = 'Where are your buyers? <span class="ob-picks">' + WHERE.map(function (w) { return '<button class="ob-pick" type="button" aria-pressed="' + (w === r.where) + '">' + e(w) + '</button>'; }).join('') + '</span>';
            return;
          }
          var p = ev.target.closest('.ob-pick'); if (!p) { return; }
          r.where = p.textContent; r.whereSet = true; api.save(); api.facts(); mrow.innerHTML = marketLine(r);
        });
        out.querySelectorAll('textarea').forEach(function (t) {
          var card = t.closest('.ob-edit'), timer;
          grow(t);
          t.addEventListener('input', function () { grow(t); r[t.getAttribute('data-k')] = t.value; api.save(); api.facts(); });
          t.addEventListener('change', function () {
            t.value = t.value.replace(/\s+/g, ' ').trim(); r[t.getAttribute('data-k')] = t.value; api.save(); api.facts();
            card.classList.add('is-saved'); window.clearTimeout(timer); timer = window.setTimeout(function () { card.classList.remove('is-saved'); }, 1800);
          });
          // the label or the card's padding opens the text with the caret at the end
          card.addEventListener('mousedown', function (ev) {
            if (ev.target === t) { return; }
            ev.preventDefault(); t.focus(); t.setSelectionRange(t.value.length, t.value.length);
          });
        });
      },
      facts: function (r, cur) {
        var b = brandFacts(r, cur);
        return [b.cat, b.sell, b.buyers, b.market, b.voice, b.edge].concat(answers(r));
      }
    },
    {
      key: 'rivals', label: 'Competitors',
      next: function (r) {
        var c = checking(r), n = onRivals(r).length;
        if (c) { return 'Checking ' + c.site + '…'; }
        return n ? 'Use these ' + n + ' competitor' + (n === 1 ? '' : 's') : 'Keep at least one';
      },
      say: function (r) { return ['Finding who ' + nm(r) + ' competes with', 'Looking for brands that sell to the same people.']; },
      work: ['Searching your category', 'Matching who they sell to', 'Checking their YouTube Shorts', 'Ranking them by how much they post'],
      asks: function (r) {
        var n = r.rivals.filter(function (x) { return !x.added; }).length;
        return [{ kind: 'pick', key: 'today', q: 'Do you make short videos today?', picks: ['Not yet', 'Sometimes', 'Every week'] },
          proof(String(n), 'brands found so far that sell to the same buyers as ' + nm(r))];
      },
      live: function (r) { return r.today ? [['Your Shorts today', r.today]] : []; },
      done: function () { return ['Are these your competitors?', 'Drop any that don\'t fit. Add any I missed.', 'competitors']; },
      result: function (r) {
        // ranked by how much they post, the way the checklist said; one you added
        // waits at the foot while it is checked, then takes its place in the rank
        r.rivals.sort(function (a, b) { return (a.checking ? 1 : 0) - (b.checking ? 1 : 0) || b.videos - a.videos; });
        // a phone says "in 6 months" once, above the list, not in every row
        return '<p class="ob-rows-cap">Shorts posted in the last 6 months</p><div class="ob-rows" data-rows>' + r.rivals.map(function (x, i) {
          var sub = x.checking ? '<span class="ob-checking"></span>checking their Shorts&hellip;'
            : x.est ? (phone() ? '~' + x.videos + ' Shorts <em class="ob-guess">my guess</em>' : 'about ' + x.videos + ' Shorts<span class="ob-6m"> in 6 months</span>, my estimate') : x.videos + ' Shorts<span class="ob-6m"> in 6 months</span>';
          return '<div class="ob-row' + (x.on ? '' : ' is-off') + (x.checking ? ' is-checking' : '') + (x.est ? ' is-est' : '') + '" data-i="' + i + '" role="checkbox" tabindex="0" aria-checked="' + x.on + '">' +
            '<span class="ob-row-av" style="--h:' + (OB.hash(x.name) % 360) + '" aria-hidden="true">' + e(x.name.charAt(0).toUpperCase()) + '</span>' +
            '<span class="ob-row-main"><b>' + e(x.name) + '</b><small>' + e(x.site) + ' &middot; ' + sub + '</small></span><em class="ob-row-drop">Dropped</em>' + tick() + '</div>';
        }).join('') + '</div><form class="ob-add" data-add><input class="ob-input" placeholder="' + (window.matchMedia('(max-width: 700px)').matches ? 'Add one, like rival.com' : 'Add a competitor, like rival.com') + '" aria-label="Add a competitor"><button class="ob-btn" type="submit">' + OB.icon('plus', 16) + 'Add</button></form>';
      },
      bind: function (out, r, api) {
        // while a site is checked the button stays ink with a spinner, so it reads busy, not broken
        var label = function () {
          var nb = nextLabel(out, OB.STEPS[1].next(r)); if (!nb) { return; }
          nb.disabled = !onRivals(r).length || !!checking(r);
          nb.classList.toggle('is-busy', !!checking(r));
          if (checking(r) && !nb.hasAttribute('data-back')) { nb.innerHTML = '<span class="ob-checking"></span>' + e(OB.STEPS[1].next(r)); }
        };
        var flip = function (row) {
          var x = r.rivals[+row.getAttribute('data-i')]; x.on = !x.on;
          row.classList.toggle('is-off', !x.on); row.setAttribute('aria-checked', String(x.on));
          syncRivals(r); api.save(); api.facts(); label();
        };
        label();
        out.addEventListener('click', function (ev) { var row = ev.target.closest('.ob-row'); if (row) { flip(row); } });
        out.addEventListener('keydown', function (ev) { var row = ev.target.closest('.ob-row'); if (row && (ev.key === ' ' || ev.key === 'Enter')) { ev.preventDefault(); flip(row); } });
        out.querySelector('[data-add]').addEventListener('submit', function (ev) {
          ev.preventDefault();
          var inp = ev.target.querySelector('input'), v = inp.value.trim();
          if (!v) { return; }
          var b = OB.report.brand(v), site = b.host || v;
          if (r.rivals.some(function (x) { return x.site === site; })) { api.toast(site + ' is already on the list'); return; }
          // a site you add has no count yet: BlueAI checks it, then gives an estimate;
          // the button and the column wait for it, so nothing counts it half-way
          var x = { name: b.name, site: site, videos: 0, views: 0, on: true, added: true, checking: true };
          r.rivals.push(x); api.save(); api.redo();
          window.setTimeout(function () {
            var n = 12 + (OB.hash(v) % 25);
            x.checking = false; x.est = true; x.videos = n; x.views = n * 30000;
            syncRivals(r); api.save();
            if (api.is('rivals')) { api.redo(); }
            api.facts();
          }, 1400);
        });
      },
      facts: function (r) {
        return (r.today ? [['Your Shorts today', r.today]] : []).concat([['Competitors', rank(onRivals(r)).map(function (x) { return x.name; }).join(', ') || 'None yet']]);
      }
    },
    {
      key: 'wins', label: 'What wins', next: 'Show my video ideas',
      say: function (r) { return ['Studying what wins in ' + r.category.toLowerCase(), 'Going through every Short your competitors posted.']; },
      work: ['Collecting their Shorts', 'Sorting them by format', window.matchMedia('(max-width: 700px)').matches ? 'Finding the ones that kept going' : 'Finding the ones that kept getting views', 'Measuring which formats get the views'],
      // the wait shows what this step works through, not a claim about results
      asks: function (r) { syncRivals(r); return [proof((estimated(r) ? '~' : '') + r.rivalsTotal, 'Shorts from your competitors, sorted by format and ranked on views, not likes.')]; },
      done: function (r) {
        syncRivals(r);
        // the share is said once, as the lit card's figure; the line says what it is ranked on
        var top = r.formats[0];
        var next = r.today === 'Not yet' ? 'You haven\'t started yet, so this is where to start.' : 'Next, I\'ll turn it into video ideas for you.';
        return [top.name + ' wins in ' + r.category.toLowerCase(), 'Ranked on views across ' + (estimated(r) ? 'about ' : 'all ') + r.rivalsTotal + ' Shorts your competitors posted in 6 months. ' + next, 'wins'];
      },
      result: function (r) {
        var on = rank(onRivals(r));
        var max = Math.max.apply(null, on.map(function (x) { return x.videos; }).concat([1]));
        var top = r.formats[0], fi = filmOf(top.name);
        // what you said about your own Shorts: a weekly habit over 6 months is about 26
        var you = r.brand === 'Your brand' ? 'You' : r.brand + ' (you)';
        var mine = r.today === 'Every week' ? hbar(you, '~26', Math.max(max, 26), 'is-you', 26) : r.today === 'Sometimes' ? hbar(you, 'a few', max, 'is-you', Math.min(6, max))
          : r.today === 'Not yet' ? hbar(you, '0', max, 'is-you', 0) : '';
        // a phone labels your own row "You", so it never wraps (run-2.css)
        mine = mine.replace('<span>' + e(you) + '</span>', '<span><span class="ob-you-l">' + e(you) + '</span><span class="ob-you-s">You</span></span>');
        var est = estimated(r) ? 'about ' : '';
        // a phone binds the line's last three words, so no word sits alone under the thumb
        var def = e(DEF[top.name] || 'The format that pulled the most views for your competitors.'); if (phone()) { def = def.replace(/ (\S+) (\S+)$/, '\u00a0$1\u00a0$2'); }
        return '<div class="ob-card ob-card--lit ob-win">' + (fi >= 0 ? '<span class="ob-win-media">' + OB.videoTag(OB.film(fi)) + '</span>' : '') +
          '<div><span class="ob-chip ob-chip--volt">Winning format</span><b class="ob-win-fig">' + top.share + '%<small>of views</small></b><p><b>' + e(top.name) + '.</b> ' +
          def + '</p></div></div>' +
          '<div class="ob-panel">' + (phone() ? head('Share of views by format', est + r.rivalsTotal + ' Shorts') : head('What wins in ' + r.category.toLowerCase(), 'Share of views, ' + est + r.rivalsTotal + ' Shorts')) + '<div class="ob-hbars ob-hbars--rank">' +
          r.formats.map(function (f, i) { return hbar(f.name, f.share + '%', top.share, i ? '' : 'is-top', f.share); }).join('') + '</div></div>' +
          '<div class="ob-tiles3 ob-tiles2"><div class="ob-stat"><b>' + (est ? 'About ' : '') + r.perMonth + '</b><span>Shorts a month from your ' + on.length + ' competitor' + (on.length === 1 ? '' : 's') + '</span></div>' +
          '<div class="ob-stat"><b>' + r.longest.days + ' days</b><span>How long ' + e(r.longest.rival) + '\'s best ' + e(top.name) + ' Short kept pulling new views</span></div></div>' +
          '<div class="ob-panel">' + head('Shorts posted', 'Last 6 months' + (est ? ', ~ is my estimate' : '')) + '<div class="ob-hbars ob-hbars--posted">' +
          on.map(function (x) { return hbar(x.name, (x.est ? '~' : '') + x.videos, max, x.est ? 'is-est' : '', x.videos); }).join('') + mine + '</div></div>';
      },
      bind: function (out) { OB.watchFilms(out); },
      facts: function (r) { return [['Top format', r.formats[0].name], ['Runner-up', r.formats[1].name]]; }
    }
  ];
})();
