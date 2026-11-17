/* The five steps of the agent run, as data: what BlueAI says, what it ticks
   off while it works, the proof card it shows in the wait, the result, and the
   facts it adds to the brand profile on the left. run.js plays them. Steps 1
   to 3 live here, 4 and 5 in run-steps-2.js. Exposes OB.STEPS and OB.runKit.
   done() returns [heading, line, word]: the word gets the homepage halftone.
   THE RUN ASKS NOTHING (Ashish, 2026-11-17): one focus per step. The "about
   you" questions (name, goal, your Shorts today) moved to the draft campaign,
   and the profile itself is edited in the left column, not in the steps. */
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
  function share(r, name) { var f = r.formats.filter(function (x) { return x.name === name; })[0]; return f ? f.share : 0; }
  // the market: a website never says where buyers are, so on that path it is a
  // guess until you set it; facts carry the flag ('guess') and the column marks it
  function marketGuess(r) { return !!r.site && !r.whereSet; }
  function rank(list) { return list.slice().sort(function (a, b) { return b.videos - a.videos; }); }
  function phone() { return window.matchMedia('(max-width: 700px)').matches; }
  // 21100000 -> 21.1M, 48200 -> 48.2K: a channel's numbers at a glance
  // (under 1,000 it rounds too: an average once printed as 409.7674418604651)
  function compact(n) { n = +n || 0; return n >= 1e6 ? +(n / 1e6).toFixed(1) + 'M' : n >= 1e3 ? +(n / 1e3).toFixed(1) + 'K' : String(Math.round(n)); }
  // where the profile sits: beside the steps, or folded above them (860 and below)
  function side() { return window.matchMedia('(max-width: 860px)').matches ? 'above' : 'on the left'; }
  OB.runKit = { hbar: hbar, proof: proof, nm: nm, poss: poss, head: head, tick: tick, onRivals: onRivals, syncRivals: syncRivals, nextLabel: nextLabel, share: share, marketGuess: marketGuess };

  var WHERE = ['United States', 'UK', 'Canada', 'Worldwide'];
  // what a winning format is, in a line, so the result says what to make
  var DEF = {
    'Talking product': 'Your product talks to camera and solves one problem in about 10 seconds.',
    'Then vs now': 'The old, slow way next to your way, cut side by side.',
    'Deal reveal': 'An offer held back, then revealed in the last few seconds.',
    'Photoreal story': 'A short, real-looking scene where your product saves the moment.',
    'Animated story': 'A small animated story with your product at the turn.'
  };
  // the profile's rows: [label, value, flags, the report key an edit writes]
  function brandFacts(r) {
    var g = r.site ? '' : 'guess';
    return { sell: ['What you sell', r.sell, '', 'sell'], buyers: ['Who buys', r.buyers, '', 'buyers'], market: ['Market', r.where, marketGuess(r) ? 'guess' : '', 'where'],
      voice: ['How you sound', r.voice, g, 'voice'], edge: ['Your edge', r.edge, g, 'edge'], cat: ['Category', r.category] };
  }
  // a fact read back in a sentence: first letter lower case, unless it opens an acronym
  function lc(t) { t = String(t || ''); return /^[A-Z][A-Z]/.test(t) ? t : t.charAt(0).toLowerCase() + t.slice(1); }
  OB.runKit.WHERE = WHERE;

  OB.STEPS = [
    {
      key: 'brand', label: 'Your brand', next: 'Looks right',
      say: function (r) { var w = side() === 'above' ? 'Your brand profile fills in as I read.' : 'Watch your brand profile fill in on the left.'; return r.site ? ['Reading ' + r.site, 'This takes about a minute. ' + w] : ['Getting to know ' + nm(r), w]; },
      // no website: BlueAI works from the answers you gave, so it says so
      work: function (r) {
        return r.site ? ['Opening your homepage', 'Finding what you sell', 'Working out who buys', 'Reading how you sound', 'Writing your brand profile']
          : ['Reading what you told me', 'Placing you in a category', 'Sharpening who buys', 'Choosing how you should sound', 'Writing your brand profile'];
      },
      asks: [],
      // what the profile learns as each checklist line ticks (n lines done)
      live: function (r, n) {
        // the real profile is on its way (report-live.js): no sample facts meanwhile
        if (OB.live && OB.live.pending('brand')) { return []; }
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
        return f;
      },
      done: function (r) {
        var word = r.brand === 'Your brand' ? 'gaps filled in' : r.brand;
        return [r.site ? 'Here\'s ' + nm(r) + ', as I read it' : 'Here\'s ' + nm(r) + ', with the gaps filled in', 'Anything off? Fix it in your brand profile ' + side() + '. Every campaign we draft for you starts from it.', word];
      },
      // the profile read back in two lines, so the step confirms it without a
      // second copy of the fields (those live in the profile, editable there)
      result: function (r) {
        return '<div class="ob-card ob-card--lit ob-pitch"><span class="ob-chip ob-chip--volt">' + e(r.brand === 'Your brand' ? 'Your brand' : r.brand) + ', in short</span>' +
          '<p><b>' + e(r.sell) + '.</b> For ' + e(lc(r.buyers)) + (r.where === 'Worldwide' ? ', anywhere' : ' in ' + e(r.where === 'United States' ? 'the US' : r.where === 'UK' ? 'the UK' : r.where)) + '.</p>' +
          '<button class="ob-btn ob-btn--sm ob-pitch-fix" type="button" data-fix>' + OB.icon('edit', 15) + 'Fix something in your profile</button></div>' +
          '<p class="ob-upnext">Still to come: ' + OB.STEPS.slice(1).map(function (s) { return '<b>' + e(s.label) + '</b>'; }).join(', ') + '</p>';
      },
      bind: function (out, r, api) {
        out.querySelector('[data-fix]').addEventListener('click', function () { api.editProfile(); });
      },
      facts: function (r) {
        var b = brandFacts(r);
        return [b.cat, b.sell, b.buyers, b.market, b.voice, b.edge];
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
        return [proof(String(n), 'brands found so far that sell to the same buyers as ' + nm(r))];
      },
      done: function () { return ['Are these your competitors?', 'Drop any that don\'t fit. Add any I missed.', 'competitors']; },
      result: function (r) {
        // ranked by how much they post, the way the checklist said; one you added
        // waits at the foot while it is checked, then takes its place in the rank
        r.rivals.sort(function (a, b) { return (a.checking ? 1 : 0) - (b.checking ? 1 : 0) || b.videos - a.videos; });
        // a phone says "in 6 months" once, above the list, not in every row
        return '<p class="ob-rows-cap">Sorted by Shorts posted in the last 6 months</p><div class="ob-rows" data-rows>' + r.rivals.map(function (x, i) {
          // a real channel (report-live.js) gives its count and its subscribers; none found says so
        var sub = x.checking ? '<span class="ob-checking"></span>checking their Shorts&hellip;'
            : x.noYT ? 'no YouTube channel found'
            : x.yt ? (x.capped ? '50+' : x.videos) + ' Shorts<span class="ob-6m"> in 6 months</span><span class="ob-6m"> &middot; ' + compact(x.yt.subs) + ' subscribers</span>' + (x.yt.likely ? ' &middot; likely <em class="ob-guess">' + e(x.yt.title) + '</em>' : '')
            : x.est ? (phone() ? '~' + x.videos + ' Shorts <em class="ob-guess">my guess</em>' : 'about ' + x.videos + ' Shorts<span class="ob-6m"> in 6 months</span>, my estimate') : x.videos + ' Shorts<span class="ob-6m"> in 6 months</span>';
          return '<div class="ob-row' + (x.on ? '' : ' is-off') + (x.checking ? ' is-checking' : '') + (x.est ? ' is-est' : '') + '" data-i="' + i + '" role="checkbox" tabindex="0" aria-checked="' + x.on + '">' +
            // the rival's own logo over its initial (the initial shows when there is none)
            '<span class="ob-row-av" style="--h:' + (OB.hash(x.name) % 360) + '" aria-hidden="true">' + e(x.name.charAt(0).toUpperCase()) +
            (x.site ? '<img alt="" src="https://www.google.com/s2/favicons?domain=' + encodeURIComponent(x.site) + '&sz=64" onload="if(this.naturalWidth<32)this.remove()" onerror="this.remove()">' : '') + '</span>' +
            '<span class="ob-row-main"><b>' + e(x.name) + '</b><small>' + e(x.site) + (x.yt ? '' : ' &middot; ' + sub) + '</small></span>' +
            (x.yt ? '<span class="ob-row-fig"><b>' + (x.capped ? '50+' : x.videos) + '</b><small>Shorts &middot; ' + compact(x.yt.subs) + ' subs</small></span>' : '') +
            '<em class="ob-row-drop">Dropped</em>' + tick() + '</div>';
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
          // a site you add has no count yet: BlueAI looks up its real channel
          // (report-live.js), or gives an estimate when it can't; the button and
          // the column wait for it, so nothing counts it half-way
          var x = { name: b.name, site: site, videos: 0, views: 0, on: true, added: true, checking: true };
          r.rivals.push(x); api.save(); api.redo();
          var live = OB.live && OB.live.check ? OB.live.check(r, x) : Promise.resolve(false);
          Promise.all([live, new Promise(function (res) { window.setTimeout(res, 1200); })]).then(function (got) {
            if (!got[0]) { var n = 12 + (OB.hash(v) % 25); x.est = true; x.videos = n; x.views = n * 30000; }
            x.checking = false;
            syncRivals(r); api.save();
            if (api.is('rivals')) { api.redo(); }
            api.facts();
          });
        });
      },
      facts: function (r) {
        return [['Competitors', rank(onRivals(r)).map(function (x) { return x.name; }).join(', ') || 'None yet']];
      }
    },
    {
      key: 'wins', label: 'What wins', next: 'See what we\'d make',
      say: function (r) { return ['Studying what wins in ' + r.category.toLowerCase(), 'Going through every Short your competitors posted.']; },
      work: ['Collecting their Shorts', 'Sorting them by format', window.matchMedia('(max-width: 700px)').matches ? 'Finding the ones that kept going' : 'Finding the ones that kept getting views', 'Measuring which formats get the views'],
      // the wait shows what this step works through, not a claim about results
      asks: function (r) { syncRivals(r); return [proof((estimated(r) ? '~' : '') + r.rivalsTotal, 'Shorts your competitors posted in the last 6 months.')]; },
      done: function (r) {
        syncRivals(r);
        // the share is said once, as the lit card's figure; the line says what it is ranked on
        var top = r.formats[0];
        var next = 'Next, the video ideas we\'d make from it.';
        return [top.name + ' wins in ' + r.category.toLowerCase(), 'BlueAI\'s estimate, from what it found about ' + r.category.toLowerCase() + ' on the web. ' + next, 'wins'];
      },
      result: function (r) {
        var on = rank(onRivals(r));
        var max = Math.max.apply(null, on.map(function (x) { return x.videos; }).concat([1]));
        var top = r.formats[0];
        var est = estimated(r) ? 'about ' : '';
        // your own channel, when BlueAI found it, on the same scale as theirs
        var you = r.brand === 'Your brand' ? 'You' : r.brand + ' (you)', mine = '';
        if (r.own) {
          max = Math.max(max, r.own.shorts6);
          mine = hbar(you, String(r.own.shorts6), max, 'is-you', r.own.shorts6).replace('<span>' + e(you) + '</span>', '<span><span class="ob-you-l">' + e(you) + '</span><span class="ob-you-s">You</span></span>');
        }
        // their most watched Shorts (report-live.js): any format, said so; the proof a brand can click
        var best = r.topShorts && r.topShorts.length ? '<div class="ob-panel ob-halftone">' + head('Their most watched Shorts', 'Any format, last 6 months') + '<div class="ob-yts">' + r.topShorts.map(function (t) {
          return '<a class="ob-yt" href="' + e(t.url) + '" target="_blank" rel="noopener"><span class="ob-yt-thumb"><img src="' + e(t.thumb) + '" alt="" loading="lazy"><span class="ob-yt-play">' + OB.icon('play', 12) + '</span></span>' +
            '<span class="ob-yt-txt"><b>' + e(t.title) + '</b><small>' + e(t.rival) + ' &middot; ' + compact(t.views) + ' views</small></span></a>';
        }).join('') + '</div></div>' : '';
        // real channels give a real average; without them, the estimate says so
        var real = on.filter(function (x) { return x.yt && x.videos; }), shorts = real.reduce(function (t, x) { return t + x.videos; }, 0);
        var avg = shorts ? real.reduce(function (t, x) { return t + x.views; }, 0) / shorts : 0;
        // a phone binds the line's last three words, so no word sits alone under the thumb
        var def = e(DEF[top.name] || 'The format that pulled the most views for your competitors.'); if (phone()) { def = def.replace(/ (\S+) (\S+)$/, ' $1 $2'); }
        // THE ONE DARK MOMENT of the run: the winning format, in the homepage's own dark section
        return '<div class="ob-win ob-dark"><span class="ob-chip ob-chip--volt">Winning format</span><b class="ob-win-fig">' + top.share + '%<small>estimated share of views in ' + e(r.category.toLowerCase()) + '</small></b><p><b>' + e(top.name) + '.</b> ' + def + '</p></div>' +
          '<div class="ob-panel ob-halftone">' + (phone() ? head('Share of views by format', 'Estimated') : head('What wins in ' + r.category.toLowerCase(), 'Estimated share of views')) + '<div class="ob-hbars ob-hbars--rank">' +
          r.formats.map(function (f, i) { return hbar(f.name, f.share + '%', top.share, i ? '' : 'is-top', f.share); }).join('') + '</div></div>' +
          '<div class="ob-tiles3 ob-tiles2"><div class="ob-stat"><b>' + (est ? 'About ' : '') + r.perMonth + '</b><span>Shorts a month from your ' + on.length + ' competitor' + (on.length === 1 ? '' : 's') + '</span></div>' +
          (avg ? '<div class="ob-stat"><b>' + compact(avg) + '</b><span>Average views per Short, across your competitors</span></div></div>'
            : '<div class="ob-stat"><b>About ' + r.longest.days + ' days</b><span>How long ' + e(r.longest.rival) + '\'s best ' + e(top.name) + ' Short kept pulling new views, my estimate</span></div></div>') +
          '<div class="ob-panel ob-halftone">' + head('Shorts posted', 'Last 6 months' + (est ? ', ~ is my estimate' : ', counted on YouTube')) + '<div class="ob-hbars ob-hbars--posted">' +
          on.map(function (x) { return hbar(x.name, (x.est ? '~' : '') + (x.capped ? '50+' : x.videos), max, x.est ? 'is-est' : '', x.videos); }).join('') + mine + '</div></div>' + best;
      },
      bind: function (out) { OB.watchFilms(out); },
      facts: function (r) { return [['Top format', r.formats[0].name], ['Runner-up', r.formats[1].name]]; }
    }
  ];
})();
