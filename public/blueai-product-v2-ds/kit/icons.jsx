/* BlueAI Product V2 Design System: the icon module (window.V2Kit.Icon).
   One registry for every glyph the product draws. V2 draws the same clock, chat, help and sign-out
   glyphs two or three times per file at 16 different stroke widths with hard-coded hexes
   (blueai/shared.jsx:7-40, index.html:294-319, blueai/agent_permissions.jsx:38-43); here each
   meaning has one name and one drawing.

   <Icon name="check" />                      16px, decorative (aria-hidden)
   <Icon name="help" size={20} label="Help" /> 20px, announced as an image named "Help"
   Props: name (see ICON_NAMES), size 16 | 20 | 24 (default 16), label (accessible name; omit when
   the icon sits next to text that already says it), inline (sits on the text baseline),
   className. Colour is always currentColor: set `color` on the parent, never on the icon.
   Geometry: 24-unit grid, round caps and joins, stroke renders 1.75px at every size (kit/base.css
   .v2-icon). spark is the one filled glyph (onBlue's mark, onblue/index.html:327-329); credits is
   the one painted glyph (the brand gradient through V2's own star, assets/Credits.svg).
   youtube and instagram keep V2's own stroke drawings (agent_permissions.jsx:41-42), and
   shield-check / zap keep V2's mode glyphs (agent_permissions.jsx:39-40) so Always ask and
   Automatic look the same as in V2. An unknown name renders an empty box and warns once. */
(function () {
  const p = (d, extra) => <path d={d} {...(extra || {})} />;
  const dot = (cx, cy) => <circle cx={cx} cy={cy} r="1.6" fill="currentColor" stroke="none" />;

  const GLYPHS = {
    home: <>{p('M3.5 10.5 12 3.5l8.5 7')}{p('M5.5 9v10.5a1 1 0 0 0 1 1H10v-6h4v6h3.5a1 1 0 0 0 1-1V9')}</>,
    activity: <>{p('m3.5 6.5 1.75 1.75L8.5 5')}{p('m3.5 12.5 1.75 1.75L8.5 11')}{p('m3.5 18.5 1.75 1.75L8.5 17')}{p('M12 7h8.5')}{p('M12 13h8.5')}{p('M12 19h8.5')}</>,
    settings: <><circle cx="12" cy="12" r="3" />{p('M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z')}</>,
    chat: <>{p('M7.9 19.6A8.5 8.5 0 1 0 4.4 16l-1.4 4.9z')}</>,
    help: <><circle cx="12" cy="12" r="9" />{p('M9.5 9.3a2.5 2.5 0 0 1 4.86.8c0 1.7-2.36 2.2-2.36 3.4')}{p('M12 17h.01')}</>,
    more: <>{dot(5.5, 12)}{dot(12, 12)}{dot(18.5, 12)}</>,
    close: <>{p('M18 6 6 18')}{p('m6 6 12 12')}</>,
    back: <>{p('M19 12H5')}{p('m11 18-6-6 6-6')}</>,
    'chevron-right': <>{p('m9 18 6-6-6-6')}</>,
    'chevron-down': <>{p('m6 9 6 6 6-6')}</>,
    external: <>{p('M14 4h6v6')}{p('M10 14 20 4')}{p('M18 13.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5.5')}</>,
    check: <>{p('M20 6.5 9 17.5l-5-5')}</>,
    'check-double': <>{p('M17 6.5 7 16.5l-4.5-4.5')}{p('m21.5 9.5-7 7-1.25-1.25')}</>,
    'x-circle': <><circle cx="12" cy="12" r="9" />{p('m15 9-6 6')}{p('m9 9 6 6')}</>,
    alert: <>{p('M10.3 4.1 2.4 17.6A2 2 0 0 0 4.1 20.6h15.8a2 2 0 0 0 1.7-3L13.7 4.1a2 2 0 0 0-3.4 0z')}{p('M12 9.5v4')}{p('M12 17.2h.01')}</>,
    info: <><circle cx="12" cy="12" r="9" />{p('M12 16.5v-5')}{p('M12 8h.01')}</>,
    clock: <><circle cx="12" cy="12" r="9" />{p('M12 7v5l3 2')}</>,
    calendar: <><rect x="3.5" y="5" width="17" height="15.5" rx="2" />{p('M16 3v4')}{p('M8 3v4')}{p('M3.5 10h17')}</>,
    play: <>{p('M7 5.2v13.6a1 1 0 0 0 1.5.86l11.2-6.8a1 1 0 0 0 0-1.72L8.5 4.34A1 1 0 0 0 7 5.2z')}</>,
    pause: <><rect x="6.5" y="5" width="3.5" height="14" rx="1" /><rect x="14" y="5" width="3.5" height="14" rx="1" /></>,
    stop: <><rect x="6" y="6" width="12" height="12" rx="2" /></>,
    send: <>{p('M21 3 10.5 13.5')}{p('M21 3 14.5 21l-4-7.5L3 9.5z')}</>,
    refresh: <>{p('M20.5 12a8.5 8.5 0 1 1-2.5-6l2.5 2.5')}{p('M20.5 3.5v5h-5')}</>,
    spark: <>{p('M12 2.6C12.55 2.6 12.88 3.15 13.08 4.7c.62 4.7 1.52 5.6 6.22 6.22 1.55.2 2.1.53 2.1 1.08s-.55.88-2.1 1.08c-4.7.62-5.6 1.52-6.22 6.22-.2 1.55-.53 2.1-1.08 2.1s-.88-.55-1.08-2.1c-.62-4.7-1.52-5.6-6.22-6.22C3.15 12.88 2.6 12.55 2.6 12s.55-.88 2.1-1.08c4.7-.62 5.6-1.52 6.22-6.22C11.12 3.15 11.45 2.6 12 2.6Z')}</>,
    youtube: <><rect x="2.5" y="5" width="19" height="14" rx="4" />{p('m10 9 5 3-5 3z', { fill: 'currentColor', stroke: 'none' })}</>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="3.8" /><circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" /></>,
    'shield-check': <>{p('M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z')}{p('m9 12 2 2 4-4')}</>,
    zap: <>{p('M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z')}</>,
    user: <><circle cx="12" cy="8" r="4" />{p('M4.5 20.5a7.5 7.5 0 0 1 15 0')}</>,
    'sign-out': <>{p('M9.5 20.5H5.5a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1h4')}{p('m16 16.5 4.5-4.5L16 7.5')}{p('M20.5 12H9.5')}</>,
    bell: <>{p('M6 8.5a6 6 0 0 1 12 0c0 6.5 2.5 8.5 2.5 8.5h-17S6 15 6 8.5')}{p('M10.3 20.5a1.94 1.94 0 0 0 3.4 0')}</>,
    link: <>{p('M10 13.5a4.5 4.5 0 0 0 6.8.5l2.7-2.7a4.5 4.5 0 0 0-6.4-6.4L11.6 6.4')}{p('M14 10.5a4.5 4.5 0 0 0-6.8-.5l-2.7 2.7a4.5 4.5 0 0 0 6.4 6.4l1.5-1.5')}</>,
    trash: <>{p('M3.5 6.5h17')}{p('M18.5 6.5 17.6 19a1.5 1.5 0 0 1-1.5 1.5H7.9A1.5 1.5 0 0 1 6.4 19L5.5 6.5')}{p('M9 6.5V4.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2')}</>,
    copy: <><rect x="8.5" y="8.5" width="12" height="12" rx="2" />{p('M15.5 8.5V5a1.5 1.5 0 0 0-1.5-1.5H5A1.5 1.5 0 0 0 3.5 5v9A1.5 1.5 0 0 0 5 15.5h3.5')}</>,
    lock: <><rect x="4.5" y="10.5" width="15" height="10" rx="2" />{p('M8 10.5V7.5a4 4 0 0 1 8 0v3')}</>,
    'wifi-off': <>{p('m3 3 18 18')}{p('M8.6 16.4a4.8 4.8 0 0 1 6.8 0')}{p('M5.2 12.9a9.6 9.6 0 0 1 4.3-2.3')}{p('M18.8 12.9a9.7 9.7 0 0 0-1.8-1.4')}{p('M2 9.2a14.4 14.4 0 0 1 3.7-2.5')}{p('M10.5 5.6A14.4 14.4 0 0 1 22 9.2')}{p('M12 20h.01')}</>,
    download: <>{p('M12 3.5v12')}{p('m7 11 5 5 5-5')}{p('M4.5 20.5h15')}</>,
    'thumb-up': <>{p('M7 10.5v10')}{p('M15 5.9 14 10h5.8a2 2 0 0 1 1.9 2.6l-2.3 7a2 2 0 0 1-1.9 1.4H4a1 1 0 0 1-1-1v-8.5a1 1 0 0 1 1-1h2.8a2 2 0 0 0 1.8-1.1L12 2.5a3.1 3.1 0 0 1 3 3.4z')}</>,
    'thumb-down': <>{p('M17 13.5v-10')}{p('M9 18.1 10 14H4.2a2 2 0 0 1-1.9-2.6l2.3-7A2 2 0 0 1 6.5 3H20a1 1 0 0 1 1 1v8.5a1 1 0 0 1-1 1h-2.8a2 2 0 0 0-1.8 1.1L12 21.5a3.1 3.1 0 0 1-3-3.4z')}</>,
    eye: <>{p('M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12z')}<circle cx="12" cy="12" r="3" /></>,
    // Beyond the planned set: the parts other sections need to stay on the registry.
    'check-circle': <><circle cx="12" cy="12" r="9" />{p('m8.5 12.2 2.4 2.4 4.6-4.9')}</>,
    'chevron-left': <>{p('m15 18-6-6 6-6')}</>,
    'chevron-up': <>{p('m18 15-6-6-6 6')}</>,
    'arrow-up': <>{p('M12 19.5v-15')}{p('m5.5 11 6.5-6.5 6.5 6.5')}</>,
    'arrow-right': <>{p('M4.5 12h15')}{p('m13 5.5 6.5 6.5-6.5 6.5')}</>,
    plus: <>{p('M12 5v14')}{p('M5 12h14')}</>,
    minus: <>{p('M5 12h14')}</>,
    search: <><circle cx="11" cy="11" r="6.5" />{p('m20 20-4.4-4.4')}</>,
    edit: <>{p('M12 20.5h8.5')}{p('M16.4 3.6a2.1 2.1 0 0 1 3 3L7.5 18.5l-4 1 1-4z')}</>,
    key: <><circle cx="7.5" cy="15.5" r="4" />{p('m10.4 12.6 9.6-9.6')}{p('m16.5 6.5 3 3')}{p('m14 9 2 2')}</>,
    earnings: <><circle cx="12" cy="12" r="9" />{p('M15 9h-4.25a1.75 1.75 0 0 0 0 3.5h2.5a1.75 1.75 0 0 1 0 3.5H9')}{p('M12 7v10')}</>,
    monitor: <><rect x="2.5" y="4" width="19" height="13" rx="2" />{p('M8.5 20.5h7')}{p('M12 17v3.5')}</>,
    telegram: <>{p('M21 4.2 17.9 19.3a1 1 0 0 1-1.5.6L11 16l-2.7 2.6a.5.5 0 0 1-.85-.3L7 14 2.8 12.5a.8.8 0 0 1 0-1.5L19.9 3.3a.85.85 0 0 1 1.1.9z')}{p('m7 14 9.5-6.5')}</>,
  };
  const FILLED = { spark: true };
  const PLANNED = ['home', 'activity', 'settings', 'chat', 'help', 'more', 'close', 'back', 'chevron-right', 'chevron-down',
    'external', 'check', 'check-double', 'x-circle', 'alert', 'info', 'clock', 'calendar', 'play', 'pause', 'stop', 'send',
    'refresh', 'spark', 'credits', 'youtube', 'instagram', 'shield-check', 'zap', 'user', 'sign-out', 'bell', 'link', 'trash',
    'copy', 'lock', 'wifi-off', 'download', 'thumb-up', 'thumb-down', 'eye'];
  const NAMES = PLANNED.concat(Object.keys(GLYPHS).filter((n) => PLANNED.indexOf(n) < 0));
  // Other spellings people reach for, so a reasonable guess still draws the right glyph.
  const ALIASES = {
    x: 'close', 'arrow-left': 'back', warning: 'alert', error: 'x-circle', verified: 'check-double',
    'always-ask': 'shield-check', automatic: 'zap', logout: 'sign-out', 'external-link': 'external',
    notifications: 'bell', profile: 'user', delete: 'trash', 'more-horizontal': 'more', dollar: 'earnings',
    bluestacks: 'monitor', 'app-player': 'monitor', offline: 'wifi-off',
  };

  // V2's credits star (assets/Credits.svg), drawn as a mask so the brand gradient shows through it.
  const CREDITS_PATH = 'M7.516 14.824C7.396 14.044 7.048 13.204 6.472 12.304C5.908 11.404 5.104 10.558 4.06 9.766C3.004 8.962 1.984 8.464 1 8.272V7.516C1.996 7.288 2.962 6.844 3.898 6.184C4.834 5.524 5.626 4.738 6.274 3.826C6.922 2.902 7.336 1.96 7.516 1H8.272C8.38 1.612 8.596 2.23 8.92 2.854C9.256 3.478 9.682 4.078 10.198 4.654C10.714 5.218 11.284 5.728 11.908 6.184C12.856 6.856 13.828 7.3 14.824 7.516V8.272C14.152 8.404 13.462 8.674 12.754 9.082C12.058 9.49 11.41 9.97 10.81 10.522C10.21 11.074 9.718 11.656 9.334 12.268C8.746 13.204 8.392 14.056 8.272 14.824H7.516ZM7.768 14.392H8.02C8.08 13.768 8.176 13.144 8.308 12.52C8.452 11.884 8.614 11.296 8.794 10.756C8.986 10.216 9.184 9.772 9.388 9.424C9.796 9.196 10.282 8.986 10.846 8.794C11.422 8.602 12.016 8.44 12.628 8.308C13.252 8.176 13.828 8.092 14.356 8.056V7.804C13.828 7.756 13.246 7.666 12.61 7.534C11.986 7.39 11.386 7.222 10.81 7.03C10.234 6.826 9.76 6.616 9.388 6.4C9.184 6.04 8.986 5.596 8.794 5.068C8.614 4.528 8.452 3.952 8.308 3.34C8.176 2.716 8.08 2.092 8.02 1.468H7.768C7.72 2.032 7.63 2.62 7.498 3.232C7.378 3.832 7.222 4.408 7.03 4.96C6.838 5.512 6.628 5.992 6.4 6.4C6.016 6.616 5.542 6.826 4.978 7.03C4.414 7.222 3.82 7.39 3.196 7.534C2.572 7.666 1.984 7.756 1.432 7.804V8.056C1.984 8.092 2.566 8.176 3.178 8.308C3.79 8.44 4.378 8.602 4.942 8.794C5.506 8.986 5.992 9.196 6.4 9.424C6.628 9.808 6.832 10.282 7.012 10.846C7.204 11.398 7.366 11.986 7.498 12.61C7.63 13.222 7.72 13.816 7.768 14.392Z';
  const CREDITS_MASK = 'url("data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="' + CREDITS_PATH + '"/></svg>') + '")';

  const SIZES = [16, 20, 24];
  const warned = {};
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }

  function Icon({ name, size, label, inline, className }) {
    const s = SIZES.indexOf(Number(size)) >= 0 ? Number(size) : 16;
    const key = ALIASES[name] || name;
    const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true };
    const cls = cx('v2-icon', s !== 16 && 'v2-icon--' + s, inline && 'v2-icon--inline', className);
    if (key === 'credits') {
      return <span className={cx(cls, 'v2-icon--credits')} style={{ WebkitMaskImage: CREDITS_MASK, maskImage: CREDITS_MASK }} {...a11y} />;
    }
    const glyph = GLYPHS[key];
    if (!glyph) {
      if (!warned[name] && window.console) { warned[name] = true; console.warn('[V2Kit.Icon] unknown icon name: ' + name); }
      return <span className={cx(cls, 'v2-icon--missing')} {...a11y} />;
    }
    const filled = !!FILLED[key];
    return (
      <svg className={cls} viewBox="0 0 24 24" width={s} height={s} focusable="false"
        fill={filled ? 'currentColor' : 'none'} stroke={filled ? 'none' : 'currentColor'}
        strokeLinecap="round" strokeLinejoin="round" {...a11y}>
        {glyph}
      </svg>
    );
  }
  Icon.names = NAMES;
  Icon.planned = PLANNED;
  Icon.aliases = ALIASES;
  Icon.sizes = SIZES;

  Object.assign(window.V2Kit = window.V2Kit || {}, { Icon, ICON_NAMES: NAMES });
})();
