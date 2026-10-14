// BlueAI: "this task needs BlueStacks" chat state + the rule that decides when it fires.
// Exports: window.NeedsBluestacks = { Bubble, ProgressBubble, needsApp, BS_BOOT, PLAY_FRAME }
//
// Lives in its own file rather than in chat_product.jsx, which is already 600 lines.

(function () {
  const { useState, useEffect } = React;

  /* ── Which tasks need BlueStacks ────────────────────────────────────────────────────────
     Designer's call: only app-named tasks, not every task. Two rules, in order:

       1. A named app or game in the text wins. Specific names are listed BEFORE the generic
          "app"/"game" fallbacks, because the loop stops at its first hit and we want the real
          name for the copy ("Opening YouTube…" beats "Opening the app…").

       2. Game Helpers is gated by CATEGORY, because a game always runs in BlueStacks and the
          category's own prompts don't always say so, "Find a guide for the level I'm stuck on"
          names no app at all.

     Social Media is deliberately NOT category-gated, which is a change from the first draft of
     the plan (it said category-gate Social Media, and then listed two Social Media prompts as
     ungated: the two statements contradicted each other, so one had to go). Token-matching it
     leaves two of its seven prompts ungated: "Draft sponsorship pitches to 5 brands" and "Show
     me what the people I follow posted this week". That is the better trade. Over-gating is the
     more visible error: blocking a pure drafting task on an Android emulator looks broken, while
     a feed-read task quietly succeeding does not. */
  const APPS = [
    ['youtube', 'YouTube'], ['tiktok', 'TikTok'], ['instagram', 'Instagram'], ['reels', 'Instagram'],
    ['reddit', 'Reddit'], ['discord', 'Discord'], ['whatsapp', 'WhatsApp'], ['snapchat', 'Snapchat'],
    ['telegram', 'Telegram'], ['twitter', 'X'], ['facebook', 'Facebook'], ['spotify', 'Spotify'],
    ['netflix', 'Netflix'],
    ['google play', 'Google Play'], ['play store', 'the Play Store'],
    ['coin master', 'Coin Master'], ['whiteout survival', 'Whiteout Survival'],
    ['disney solitaire', 'Disney Solitaire'], ['royal match', 'Royal Match'],
    ['subway surf', 'Subway Surfers'], ['free fire', 'Free Fire MAX'], ['clash', 'Clash of Critters'],
    ['epic seven', 'Epic Seven'], ['maplestory', 'MapleStory'], ['dragon raja', 'Dragon Raja'],
    // Generic fallbacks: last on purpose.
    ['apps', 'the app'], ['app', 'the app'], ['games', 'the game'], ['game', 'the game']
  ];
  const CATEGORY_ALWAYS = { 'Game Helpers': 'the game' };

  // Returns the app's display name when the task needs BlueStacks, or null when it doesn't.
  function needsApp(text, category) {
    const t = ' ' + String(text || '').toLowerCase() + ' ';
    for (let i = 0; i < APPS.length; i++) {
      const token = APPS[i][0].replace(/ /g, '\\s+');
      if (new RegExp('[^a-z]' + token + '[^a-z]').test(t)) return APPS[i][1];
    }
    return CATEGORY_ALWAYS[category] || null;
  }

  /* BlueStacks' cold start, in ms per frame. ONE source of truth: the scene uses these to swap
     the window's screenshot and the chat uses them to time its narration, so the two can't drift
     apart. Change them here and both move together. */
  const BS_BOOT = { loading: 2400, home: 1400 };

  /* Which apps we actually hold a Play-Store screenshot for. Only YouTube, today, so only a
     YouTube task may end on the third frame. Ask for TikTok and the sequence stops on the
     BlueStacks home screen instead, because showing a YouTube listing while the chat says
     "Found TikTok" is a straightforward lie about what the product did. Drop another listing
     into assets/bluestacks/ and add it here. */
  const PLAY_FRAME = { YouTube: 'play-youtube' };

  /* The chat bubble. Info-blue, a sibling of WarningBubble, not a copy of it: nothing has gone
     wrong and nothing failed, the task simply can't start until a dependency exists. Orange would
     read as a problem with the request.

     The button hides itself after one click (local `clicked` state) rather than disabling in
     place: once clicked, a ProgressBubble appears right below carrying the same information
     (what's installing), so a lingering disabled "Get BlueStacks" button would just be a second,
     redundant thing saying the same thing. This also blocks a second click from queuing a
     duplicate install: there's no debounce anywhere upstream of this component.

     V3 (phase 4): the chat's one bubble language (chat.css). Info-blue becomes a plain bubble with
     a quiet info mark in the muted ink (blue is not a surface, and nothing here needs a tone), and
     Get BlueStacks is the view's one committing action, the solid ink button. */
  function Bubble({ app, onGet }) {
    const [clicked, setClicked] = useState(false);
    return (
      <div className="ba-msg-in v3-msg">
        <div className="v3-bubble">
          <div className="v3-toned">
            <svg className="v3-toned-icon v3-ico v3-tone-quiet" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" /><line x1="12" y1="16" x2="12" y2="11.5" /><line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <p className="v3-toned-body">
              This one runs inside BlueStacks App Player. I drive {app} there, and BlueStacks isn’t installed on this PC yet.
            </p>
          </div>
          {!clicked &&
            <button type="button" onClick={() => { setClicked(true); onGet(); }} className="v3-btn-solid v3-btn-sm v3-btn-full v3-bs-get">
              <img src="assets/BlueStacks.png" alt="" className="v3-bs-logo" onError={(e) => { e.target.style.display = 'none'; }} />
              Get BlueStacks
            </button>}
        </div>
      </div>);
  }

  /* The install-in-progress card. Replaces what used to be a separate modal (InstallDialog,
     "bluestacks" config) entirely: designer's call (2026-08-10), matched to a live-production
     screenshot of an in-chat skill-progress card (PLAN → a progress card with a live percentage
     → a bar filling). No modal, no scrim, nothing blocking: the rest of the app stays fully
     usable while this ticks up, which is the actual point of putting it in the conversation
     instead of a popup. Kept in the app's own blue (matching the Bubble above it), not the
     screenshot's purple: that purple is the live app's AUTO-GAMEPLAY skill's own branding, a
     different feature; reusing it here would borrow a color identity that means something else.
     V3 (phase 4): a plain bubble; the blue is held to what it means, progress (the spinner and the
     bar), and the done state turns to the green tick because the install has been reached. */
  function ProgressBubble({ app, onDone }) {
    const [pct, setPct] = useState(0);
    const DURATION = 3000;   // matches the old InstallDialog's downloadMs for BlueStacks

    useEffect(() => {
      let raf;
      const startedAt = Date.now();
      const tick = () => {
        const p = Math.min(100, Math.round(((Date.now() - startedAt) / DURATION) * 100));
        setPct(p);
        if (p >= 100) { onDone && onDone(); return; }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, []);

    // This card is never removed once pushed, push() only appends, so it stays in the
    // conversation permanently as a record of what happened, frozen at whatever it last
    // rendered. A spinning ring frozen next to "100%" reads as stuck/broken, not finished, so
    // the done state swaps to a static checkmark rather than just leaving the spin running.
    const done = pct >= 100;
    return (
      <div className="ba-msg-in v3-msg">
        <div className="v3-bubble v3-bs-progress">
          <p className="v3-eyebrow">Installing</p>
          <div className="v3-bs-row">
            {done
              ? <svg className="v3-ico v3-tone-success" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12" /></svg>
              : <span className="v3-spin" aria-hidden="true" />}
            <span className="v3-bs-pct">Getting ready {pct}%</span>
          </div>
          <div className="v3-bs-track">
            <div className="v3-bs-fill" style={{ width: pct + '%' }} />
          </div>
        </div>
      </div>);
  }

  window.NeedsBluestacks = { Bubble, ProgressBubble, needsApp, BS_BOOT, PLAY_FRAME };
})();
