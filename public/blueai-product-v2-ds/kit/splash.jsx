/* BlueAI Product V2 Design System: splash and cold start (section 33).
   Splash  a short branded launch shown only on a true cold start (the app process starting).
           Reopening the window from the tray or taskbar restores the last screen instantly, with
           no splash, because the Worker record and navigation outlive the window.
           Budget: one message from 0, fade from 900 ms over --v2-dur-4 (read from the token when
           the splash starts), onDone when the fade ends, about 1.2 s. Reduced motion: static dots,
           no fade, onDone at 900 ms. The real app calls onDone when the Worker record has loaded,
           never later than this budget plus the home skeleton. One message, because a second one
           would show for about 300 ms before the fade and its role=status announcement would be cut
           off; the first is said once and stays readable.
           Props: messages (default SPLASH_MESSAGES; a second message, if a caller passes one,
           shows only in the frozen 'message-2' state), onDone, coldStart (default true; false
           skips the splash and calls onDone at once), state ('message-1' | 'message-2' | 'fading':
           a frozen state for guide specimens, no timers), reduced (force the reduced-motion look).
   SPLASH_MESSAGES  ['Starting BlueAI…']: V2's (boot_splash.jsx:24). V2's 'Loading your skills…'
           is dropped, not replaced. */
(function () {
  const { useState, useEffect, useRef } = React;
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }

  const SPLASH_MESSAGES = ['Starting BlueAI…'];
  const T_FADE = 900;

  function Splash({ messages, onDone, coldStart, state, reduced }) {
    const msgs = messages && messages.length ? messages : SPLASH_MESSAGES;
    const frozen = !!state;
    const idx = state === 'message-2' || state === 'fading' ? 1 : 0;
    const [fading, setFading] = useState(state === 'fading');
    const done = useRef(onDone);
    done.current = onDone;
    const skip = coldStart === false;

    useEffect(function () {
      if (frozen) return undefined;
      if (skip) { if (done.current) done.current(); return undefined; }
      const still = reduced || window.V2Kit.reducedMotion();
      const timers = [];
      if (!still) timers.push(setTimeout(function () { setFading(true); }, T_FADE));
      const end = still ? T_FADE : T_FADE + window.V2Kit.tokenMs('--v2-dur-4', 320);
      timers.push(setTimeout(function () { if (done.current) done.current(); }, end));
      return function () { timers.forEach(clearTimeout); };
    }, [frozen, skip]);

    if (skip) return null;
    const Brand = window.V2Kit && window.V2Kit.BrandMark;
    return (
      <div className={cx('v2-splash', fading && 'is-fading', reduced && 'v2-reduced-motion')} aria-busy={fading ? undefined : 'true'}>
        {Brand ? <Brand size={48} /> : null}
        <div className="v2-splash-dots" aria-hidden="true">
          <span className="v2-splash-dot" /><span className="v2-splash-dot" /><span className="v2-splash-dot" />
        </div>
        <p className="v2-splash-status" role="status">{msgs[Math.min(idx, msgs.length - 1)]}</p>
      </div>
    );
  }

  Object.assign(window.V2Kit = window.V2Kit || {}, { Splash, SPLASH_MESSAGES });
})();
