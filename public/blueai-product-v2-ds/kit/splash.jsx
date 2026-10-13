/* BlueAI Product V2 Design System: splash and cold start (section 33).
   Splash  a short branded launch shown only on a true cold start (the app process starting).
           Reopening the window from the tray or taskbar restores the last screen instantly, with
           no splash, because the Worker record and navigation outlive the window.
           Budget: first message at 0, second at 600 ms (only if there is one), fade from 900 ms
           over --v2-dur-4, onDone at about 1.2 s. Reduced motion: static dots, no fade, onDone at
           900 ms. The real app calls onDone when the Worker record has loaded, never later than
           this budget plus the home skeleton.
           Props: messages (default SPLASH_MESSAGES), onDone, coldStart (default true; false skips
           the splash and calls onDone at once), state ('message-1' | 'message-2' | 'fading':
           a frozen state for guide specimens, no timers), reduced (force the reduced-motion look).
   SPLASH_MESSAGES  ['Starting BlueAI…', 'Checking today’s run…']: the first is V2's
           (boot_splash.jsx:24), the second is proposed copy replacing 'Loading your skills…'. */
(function () {
  const { useState, useEffect, useRef } = React;
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }

  const SPLASH_MESSAGES = ['Starting BlueAI…', 'Checking today’s run…'];
  const T_SECOND = 600, T_FADE = 900, T_DONE = 1220;

  function Splash({ messages, onDone, coldStart, state, reduced }) {
    const msgs = messages && messages.length ? messages : SPLASH_MESSAGES;
    const frozen = !!state;
    const [idx, setIdx] = useState(state === 'message-2' || state === 'fading' ? 1 : 0);
    const [fading, setFading] = useState(state === 'fading');
    const done = useRef(onDone);
    done.current = onDone;
    const skip = coldStart === false;

    useEffect(function () {
      if (frozen) return undefined;
      if (skip) { if (done.current) done.current(); return undefined; }
      const still = reduced || window.V2Kit.reducedMotion();
      const timers = [];
      if (msgs.length > 1) timers.push(setTimeout(function () { setIdx(1); }, T_SECOND));
      if (!still) timers.push(setTimeout(function () { setFading(true); }, T_FADE));
      timers.push(setTimeout(function () { if (done.current) done.current(); }, still ? T_FADE : T_DONE));
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
