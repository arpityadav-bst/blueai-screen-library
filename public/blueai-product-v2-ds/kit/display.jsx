/* BlueAI Product V2 Design System: display parts on window.V2Kit.
   Badge, Avatar, ListRow, Card, StatCard. Styles live in kit/display.css; every interactive state
   is CSS (the guide forces them with .is-hover / .is-focus / .is-active). Icons are read from
   window.V2Kit.Icon at render, so file order does not matter. Spec: design-md/16 to 19. */
(function () {
  const { useState, useId } = React;

  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }
  /* Rest props without object-rest syntax: Babel hoists a rest's key list to one program-level
     _excluded, and this file loads last of the kit files that use one, so its lists would decide
     which props every Button, field and Chip forwards to the DOM. */
  function omit(o, keys) { const r = {}; for (const k in o) if (keys.indexOf(k) < 0) r[k] = o[k]; return r; }
  function Ico({ name, size }) {
    const Icon = window.V2Kit && window.V2Kit.Icon;
    return Icon ? <Icon name={name} size={size || 16} /> : null;
  }

  /* Badge: one short state on a row or card. Tone lives in the fill and the dot; the label stays
     in ink-2, a style choice: one ink keeps a row of badges calm and the mark carries the tone
     (every status ink passes on its own tint; success ink on the 8% tint is 4.59:1, section 16). */
  const TONES = ['neutral', 'info', 'success', 'attention', 'danger'];
  const BADGE_OWN = ['tone', 'dot', 'busy', 'icon', 'className', 'children'];
  function Badge(props) {
    const { tone, dot, busy, icon, className, children } = props;
    const rest = omit(props, BADGE_OWN);
    const t = TONES.indexOf(tone) >= 0 ? tone : 'neutral';
    const showDot = !icon && (dot || busy);
    return (
      <span className={cx('v2-badge', 'v2-badge--' + t, busy && 'is-busy', className)} {...rest}>
        {icon ? <span className="v2-badge-icon" aria-hidden="true"><Ico name={icon} size={16} /></span> : null}
        {showDot ? <span className={cx('v2-badge-dot', busy && 'v2-anim-pulse')} aria-hidden="true" /> : null}
        <span className="v2-badge-label">{children}</span>
      </span>
    );
  }

  /* Avatar: the signed-in account, or which app a row is about. Initials sit on one of two hues
     picked from the id (action blue or ink, the two V2's sign-in accounts already use); an image
     covers them and falls back to them if it fails. App marks are a glyph on a sunken disc. It
     carries no status: a row says its status in words, with a Badge (Connected apps). */
  const SIZES = [24, 32, 40, 56];
  const APP_ICON = { youtube: 'youtube', instagram: 'instagram', telegram: 'telegram' };
  const APP_NAME = { youtube: 'YouTube', instagram: 'Instagram', telegram: 'Telegram' };
  function hueOf(key) {
    let h = 0;
    const s = String(key || '');
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h % 2;
  }
  function initialsOf(name, size) {
    const words = String(name || '').trim().split(/\s+/).filter(Boolean);
    if (!words.length) return '?';
    const first = words[0][0];
    const last = words.length > 1 ? words[words.length - 1][0] : '';
    return (size >= 40 && last ? first + last : first).toUpperCase();
  }
  function Avatar({ name, id, src, size, app, loading, decorative, className }) {
    const [failed, setFailed] = useState(false);
    const s = SIZES.indexOf(size) >= 0 ? size : 32;
    if (loading) return <span className={cx('v2-skel', 'v2-skel--circle', 'v2-anim-shimmer', className)} style={{ width: s, height: s }} aria-hidden="true" />;
    const who = app ? (APP_NAME[app] || app) : name;
    const a11y = decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': who };
    const glyph = s >= 56 ? 24 : (s >= 40 ? 20 : 16);
    return (
      <span className={cx('v2-avatar', 'v2-avatar--' + s, app ? 'v2-avatar--app' : 'v2-avatar--hue-' + hueOf(id || name), className)} {...a11y}>
        {app
          ? <Ico name={APP_ICON[app] || 'link'} size={glyph} />
          : <span className="v2-avatar-initials" aria-hidden="true">{initialsOf(name, s)}</span>}
        {src && !app && !failed ? <img className="v2-avatar-img" src={src} alt="" onError={function () { setFailed(true); }} /> : null}
      </span>
    );
  }

  /* ListRow: the line every list is made of. Static (value or control), nav (button or link, the
     only kind that answers hover), expandable (aria-expanded) and destructive. A control row is a
     div: never put a control inside a nav row. Disabled rows keep their reason legible and stay
     focusable: a disabled link drops its href (so it goes nowhere) but keeps role=link and a tab
     stop, so the reason inside it is still reached (section 18). Leading is an icon or Avatar, or
     mark {icon, tone 'neutral' | 'attention' | 'success' | 'danger', dot}: a 32 sunken disc with
     a 16 glyph in its tone and an optional unread dot, for a row about a thing or an event. */
  function ListRow(props) {
    const { leading, mark, label, description, value, trailing, badge, onClick, href, external, danger,
      expandable, expanded, onToggle, divider, disabled, disabledReason, children, className } = props;
    const [openSelf, setOpenSelf] = useState(false);
    const panelId = useId();
    const open = expanded !== undefined ? !!expanded : openSelf;
    const nav = !!(onClick || href || expandable);
    const desc = disabled && disabledReason ? disabledReason : description;
    const lines = divider !== false;
    const chevron = expandable ? 'chevron-down' : (external ? 'external' : 'chevron-right');
    const lead = mark ? (<span className={cx('v2-row-mark', mark.tone && mark.tone !== 'neutral' && 'v2-row-mark--' + mark.tone)}><Ico name={mark.icon} size={16} />{mark.dot ? <span className="v2-row-mark-dot" /> : null}</span>) : leading;
    const inner = (
      <>
        {lead ? <span className="v2-row-lead" aria-hidden="true">{lead}</span> : null}
        <span className="v2-row-text">
          <span className="v2-row-label">{label}</span>
          {desc ? <span className="v2-row-desc v2-text-body-sm">{desc}</span> : null}
        </span>
        {value != null ? <span className="v2-row-value">{value}</span> : null}
        {badge ? <span className="v2-row-badge">{badge}</span> : null}
        {trailing ? <span className="v2-row-trail">{trailing}</span> : null}
        {nav ? <span className="v2-row-chevron" aria-hidden="true"><Ico name={chevron} size={16} /></span> : null}
        {external ? <span className="v2-sr-only"> (opens in your browser)</span> : null}
      </>
    );
    const cls = cx('v2-row', nav && 'v2-row--nav', danger && 'v2-row--danger', disabled && 'is-disabled',
      lines && !expandable && 'v2-row--divider', !expandable && className);
    if (expandable) {
      const toggle = function () {
        if (disabled) return;
        if (expanded === undefined) setOpenSelf(!open);
        if (onToggle) onToggle(!open);
      };
      return (
        <div className={cx('v2-row-group', lines && 'v2-row--divider', className)}>
          <button type="button" className={cls} aria-expanded={open} aria-controls={panelId}
            aria-disabled={disabled ? 'true' : undefined} onClick={toggle}>{inner}</button>
          <div className="v2-row-panel" id={panelId} hidden={!open}>{open ? children : null}</div>
        </div>
      );
    }
    if (href) {
      return (
        <a className={cls} href={disabled ? undefined : href} aria-disabled={disabled ? 'true' : undefined}
          role={disabled ? 'link' : undefined} tabIndex={disabled ? 0 : undefined}
          target={external ? '_blank' : undefined} rel={external ? 'noopener' : undefined}>{inner}</a>
      );
    }
    if (onClick) {
      return (
        <button type="button" className={cls} aria-disabled={disabled ? 'true' : undefined}
          onClick={disabled ? undefined : onClick}>{inner}</button>
      );
    }
    return <div className={cls}>{inner}</div>;
  }

  /* Card: the one surface. Static cards never answer hover; a pressable card is a real button or
     link whose line firms up on hover. Only href, onClick or pressable make it pressable: `as`
     sets the semantic tag alone (a static section stays static). Inset is the panel step inside a
     card. The ref reaches the element (a swap-focus anchor, such as the BYOK Remove confirm). */
  const CARD_OWN = ['as', 'pressable', 'inset', 'padding', 'href', 'external', 'onClick', 'className', 'children'];
  const Card = React.forwardRef(function Card(props, ref) {
    const { as, pressable, inset, padding, href, external, onClick, className, children } = props;
    const rest = omit(props, CARD_OWN);
    const press = !!(href || onClick || pressable);
    const Tag = as || (href ? 'a' : (press ? 'button' : 'div'));
    const extra = Tag === 'button' ? { type: 'button' }
      : (Tag === 'a' ? { href: href, target: external ? '_blank' : undefined, rel: external ? 'noopener' : undefined } : {});
    const pad = padding && padding !== 'md' ? 'v2-card--pad-' + padding : null;
    return (
      <Tag ref={ref} className={cx('v2-card', inset && 'v2-card--inset', press && 'v2-card--pressable', pad, className)}
        onClick={onClick} {...extra} {...rest}>{children}</Tag>
    );
  });

  /* StatCard: one figure that matters. A mini-title label (the site's .mini-title, sentence case),
     the figure in ink (money and credits are figures, not states), one context line, one optional
     action. Display (40) or compact (20). Text comes from the type ladder (kit/base.css). */
  function fmt(v) { return typeof v === 'number' ? v.toLocaleString('en-US') : v; }
  const STAT_OWN = ['label', 'value', 'unit', 'context', 'action', 'icon', 'loading', 'size', 'className'];
  function StatCard(props) {
    const { label, value, unit, context, action, icon, loading, size, className } = props;
    const rest = omit(props, STAT_OWN);
    const compact = size === 'compact';
    const Sk = window.V2Kit && window.V2Kit.Skeleton;
    return (
      <Card className={cx('v2-stat', compact && 'v2-stat--compact', className)} aria-busy={loading ? 'true' : undefined} {...rest}>
        {label ? <span className="v2-stat-label v2-text-mini-title">{label}</span> : null}
        {loading ? (
          <span className="v2-stat-loading">
            {Sk ? <Sk shape="rect" width={compact ? 96 : 148} height={compact ? 20 : 40} /> : null}
            {Sk ? <Sk shape="line" width="72%" /> : null}
          </span>
        ) : (
          <>
            <span className="v2-stat-figure">
              {icon ? <span className="v2-stat-icon" aria-hidden="true">{icon}</span> : null}
              <span className={cx('v2-stat-value', compact ? 'v2-text-numeral-sm' : 'v2-text-display')}>{fmt(value)}</span>
              {unit ? <span className="v2-stat-unit">{unit}</span> : null}
            </span>
            {context ? <span className="v2-stat-context v2-text-body-sm">{context}</span> : null}
          </>
        )}
        {action && !loading ? <span className="v2-stat-action">{action}</span> : null}
      </Card>
    );
  }

  Object.assign(window.V2Kit = window.V2Kit || {}, { Badge, Avatar, ListRow, Card, StatCard });
})();
