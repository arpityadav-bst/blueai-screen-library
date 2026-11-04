/* The free social report, mocked: what BlueAI "finds" for a website (or for
   the three no-website answers). Deterministic, so the same site always gets
   the same report. A design prototype: every name and number here is
   illustrative. Each category's four angles use its own top four formats, so
   the angles step pairs every audience with a format the What wins step
   showed (and with a clip of that format in the film library). Saved to localStorage 'onblue-report'; the app reads it back.
   Exposes OB.report.make(input) and OB.report.get(). */
(function () {
  'use strict';
  var OB = window.OB;

  var CATS = {
    food: {
      keys: /caf|coffee|food|bake|bread|pizza|eat|kitchen|bar|grill|tea|juice|snack|burger|taco/,
      label: 'Food and drink', sell: 'Fresh food and drinks, made to order', buyers: 'Locals and office crowds, 22 to 40',
      edge: 'Small-batch, made the same day', voice: 'Warm, playful, a little cheeky',
      rivals: ['Crumb & Co', 'Daily Grind', 'Corner Table', 'Brew Theory', 'Salt House'],
      formats: [['Deal reveal', 30], ['Photoreal story', 23], ['Animated story', 18], ['Meme edit', 16], ['Taste test', 13]],
      angles: [['After-work crowd', 'Your 5 pm reward is two streets away', 'Deal reveal'], ['Food lovers', 'Watch it get made, start to plate', 'Photoreal story'], ['New in town', 'The spot locals keep quiet about', 'Animated story'], ['Weekend planners', 'Saturday, sorted', 'Meme edit']]
    },
    beauty: {
      keys: /beaut|skin|glow|cosmet|hair|nail|lash|derm|serum|spa/,
      label: 'Beauty and skincare', sell: 'Skincare and beauty products', buyers: 'Women 18 to 34 who research before they buy',
      edge: 'Clean formulas that show results fast', voice: 'Honest, friendly, no hype',
      rivals: ['Glow Theory', 'Dewdrop', 'Skin Society', 'Bare Lab', 'Velvet Bloom'],
      formats: [['Then vs now', 29], ['Photoreal story', 24], ['Talking product', 18], ['Deal reveal', 16], ['Before and after', 13]],
      angles: [['Busy mornings', 'A 3-step routine that fits before coffee', 'Then vs now'], ['Skeptics', 'We tested it for 30 days', 'Photoreal story'], ['Ingredient nerds', 'What is really in the bottle', 'Talking product'], ['Gift buyers', 'The present that gets used', 'Deal reveal']]
    },
    fitness: {
      keys: /fit|gym|yoga|run|sport|train|muscle|pilates|cycle|health/,
      label: 'Fitness', sell: 'Training plans, gear and classes', buyers: 'Adults 20 to 40 starting or restarting a routine',
      edge: 'Plans that fit a real week', voice: 'Encouraging, direct, real',
      rivals: ['Pulse Club', 'Lift Lab', 'Stride', 'Core Collective', 'Peak Form'],
      formats: [['Photoreal story', 30], ['Then vs now', 23], ['Price counter', 18], ['Animated story', 16], ['Transformation', 13]],
      angles: [['Restarters', 'Day one, again, and that is fine', 'Photoreal story'], ['Busy parents', 'A 20 minute plan that actually fits', 'Then vs now'], ['Gear buyers', 'Cost per workout, counted', 'Price counter'], ['Gym-shy', 'What nobody tells you about week one', 'Animated story']]
    },
    games: {
      keys: /game|play|quest|arcade|studio|guild|pixel|craft|legend/,
      label: 'Games', sell: 'A game players come back to', buyers: 'Players 16 to 34 on PC and mobile',
      edge: 'Deep progression, fair to free players', voice: 'Hype, playful, in on the joke',
      rivals: ['Ironclad Games', 'Nova Arcade', 'Kraken Play', 'Starfall', 'Ember Forge'],
      formats: [['Then vs now', 29], ['Price counter', 21], ['Animated story', 18], ['Micro horror', 17], ['Clutch moment', 15]],
      angles: [['Lapsed players', 'You will not believe what changed', 'Then vs now'], ['Collectors', 'The rarest drop, ranked', 'Price counter'], ['Story fans', 'Every hero has a 3 am', 'Animated story'], ['Competitive', 'The clutch nobody saw coming', 'Micro horror']]
    },
    fashion: {
      keys: /wear|shop|style|apparel|thread|shoe|sneak|cloth|denim|bag|jewel|store|candle|decor|home|gift|craft|handmade/,
      label: 'Retail and fashion', sell: 'Clothing and accessories', buyers: 'Shoppers 18 to 35 who buy on mobile',
      edge: 'Pieces that last longer than a season', voice: 'Confident, clean, a little witty',
      rivals: ['Thread & Tag', 'Northline', 'Mode Supply', 'Linen Lane', 'Kind Cloth'],
      formats: [['Then vs now', 30], ['Price counter', 22], ['Deal reveal', 18], ['Animated story', 16], ['Outfit reveal', 14]],
      angles: [['Capsule wardrobe', 'One jacket, seven outfits', 'Then vs now'], ['Deal hunters', 'Cost per wear, counted', 'Price counter'], ['Gift buyers', 'Wrapped and sorted', 'Deal reveal'], ['Story fans', 'The jacket that went everywhere', 'Animated story']]
    },
    travel: {
      keys: /travel|trip|stay|hotel|tour|fly|voyage|bnb|resort|camp/,
      label: 'Travel', sell: 'Trips and stays', buyers: 'Couples and friends 24 to 45 planning their next break',
      edge: 'Places that feel local, booked in minutes', voice: 'Curious, warm, vivid',
      rivals: ['Wander Co', 'Atlas Stays', 'Roam House', 'Far & Near', 'Coastline'],
      formats: [['Deal reveal', 31], ['Price counter', 21], ['Photoreal story', 18], ['Animated story', 16], ['Place reveal', 14]],
      angles: [['Weekenders', 'Two nights, zero planning', 'Deal reveal'], ['Budget travelers', 'The whole trip, counted', 'Price counter'], ['Dreamers', 'Wake up here', 'Photoreal story'], ['Story fans', 'The trip that changed the plan', 'Animated story']]
    },
    // only reached from the no-website answers (keys null: a site never lands here)
    home: {
      keys: null,
      label: 'Home and gifts', sell: 'Home goods and gifts, made in small batches', buyers: 'Shoppers 25 to 45 buying for their home or for a gift',
      edge: 'Made by hand, in small batches', voice: 'Warm, calm, a little cozy',
      rivals: ['Wick & Wax', 'Hearth Goods', 'Little Ember', 'Stone & Sage', 'Kindred Home'],
      formats: [['Deal reveal', 30], ['Animated story', 22], ['Photoreal story', 18], ['Price counter', 16], ['Behind the scenes', 14]],
      angles: [['Gift buyers', 'The present that actually gets used', 'Deal reveal'], ['Homebodies', 'Your evening, slowed down', 'Animated story'], ['Maker fans', 'Made by hand, start to finish', 'Photoreal story'], ['Deal hunters', 'Cost per use, counted', 'Price counter']]
    },
    apps: {
      keys: /.*/,
      label: 'Apps and software', sell: 'An app that saves people time', buyers: 'Working adults 22 to 45',
      edge: 'Does the job in fewer steps', voice: 'Clear, helpful, lightly funny',
      rivals: ['Taskly', 'Brightside', 'Flowdesk', 'Northstar', 'Loop'],
      formats: [['Talking product', 28], ['Then vs now', 22], ['Screen trick', 18], ['Real-time retro', 17], ['Meme edit', 15]],
      angles: [['Switchers', 'Your computer, finally on your side', 'Talking product'], ['Busy people', '3 am in 2015 vs 3 am now', 'Then vs now'], ['Tinkerers', 'The shortcut nobody shows you', 'Screen trick'], ['Skeptics', 'Disc 1 of 4: the old way, in real time', 'Real-time retro']]
    }
  };

  function brandOf(site) {
    var host = String(site || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split(/[\/?#]/)[0];
    var label = host.split('.')[0] || 'Your brand';
    var name = label.split(/[-_]+/).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(' ');
    return { host: host, name: name };
  }
  function pick(text) {
    var k = Object.keys(CATS);
    for (var i = 0; i < k.length; i++) { if (CATS[k[i]].keys && CATS[k[i]].keys.test(text)) { return k[i]; } }
    return 'apps';
  }
  // no website: whole words from what they sell and who buys, so "soy candles"
  // reads as home and gifts (not fashion) and "handmade crafts" not as games
  var NOSITE = [
    ['food', /\b(cafes?|coffee|food|bak(e|ed|er|ery|ing)|bread|pizza|restaurants?|kitchen|bars?|grill|tea|juices?|snacks?|burgers?|tacos?|cakes?|chocolates?|sauces?|meals?|drinks?|pastrw*|croissants?|cookies?|donuts?|desserts?)\b/],
    ['beauty', /\b(beauty|skin\w*|cosmetics?|makeup|hair|nails?|lashes|serums?|spa|salon)\b/],
    ['fitness', /\b(fitness|gym|yoga|running|sports?|training|pilates|cycling|workouts?|coach\w*)\b/],
    ['games', /\b(games?|gaming|gamers?|players?|arcade|esports)\b/],
    ['travel', /\b(travel\w*|trips?|stays?|hotels?|tours?|flights?|bnb|resorts?|camping)\b/],
    ['home', /\b(candles?|soy|wax|soaps?|decor|homeware|homes?|pottery|ceramics?|mugs?|plants?|furniture|blankets?|gifts?|handmade|crafts?|prints?|stationery)\b/],
    ['fashion', /\b(clothes|clothing|apparel|fashion|shoes|sneakers|jewel\w*|bags?|denim|dresses|shirts?|wear)\b/]
  ];
  function pickNoSite(text) {
    for (var i = 0; i < NOSITE.length; i++) { if (NOSITE[i][1].test(text)) { return NOSITE[i][0]; } }
    return pick(text);
  }

  // input: { site } or { sell, buyers, where }. build() only computes;
  // make() also saves it as this visitor's report.
  function build(input) {
    var hasSite = !!(input && input.site);
    var b = hasSite ? brandOf(input.site) : { host: '', name: (input && input.name) || 'Your brand' };
    var text = hasSite ? b.host : ((input.sell || '') + ' ' + (input.buyers || ''));
    var ck = hasSite ? pick(text.toLowerCase()) : pickNoSite(text.toLowerCase()), c = CATS[ck], h = OB.hash(b.host || text);
    var rivals = c.rivals.map(function (n, i) {
      var v = 18 + ((h >>> (i * 3)) % 30);
      return { name: n, site: n.toLowerCase().replace(/[^a-z]/g, '') + '.com', videos: v, views: (v * (21000 + ((h >>> i) % 9) * 6000)), on: true };
    });
    var total = rivals.reduce(function (s, r) { return s + r.videos; }, 0);
    var films = c.angles.map(function (a, i) { return OB.filmFor(a[2], h + i * 7); });
    var r = {
      v: 1, made: Date.now(), site: b.host, brand: b.name, initial: b.name.charAt(0).toUpperCase(),
      category: c.label, sell: hasSite ? c.sell : (input.sell || c.sell), buyers: hasSite ? c.buyers : (input.buyers || c.buyers),
      where: (input && input.where) || 'United States', edge: c.edge, voice: c.voice,
      rivals: rivals, rivalsTotal: total, perMonth: Math.round(total / 6),
      longest: { rival: rivals[h % 5].name, title: c.angles[0][1], days: 40 + (h % 60) },
      formats: c.formats.map(function (f) { return { name: f[0], share: f[1] }; }),
      angles: c.angles.map(function (a) { return { who: a[0], say: a[1], format: a[2], on: true }; }),
      videos: c.angles.map(function (a, i) { return { title: a[1], format: a[2], film: films[i], who: a[0] }; }),
      budget: 500, name: '', goal: ''
    };
    return r;
  }
  function make(input) { var r = build(input); OB.store('onblue-report', r); return r; }
  function get() { return OB.store('onblue-report'); }
  function save(r) { OB.store('onblue-report', r); return r; }
  function brand(site) { return brandOf(site); }

  OB.report = { make: make, build: build, get: get, save: save, brand: brand };
})();
