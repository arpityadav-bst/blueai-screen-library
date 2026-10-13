/* BlueAI Product V2 Design System: notice parts on window.V2Kit.
   Banner (a condition that holds until it ends, above what it is about) and EmptyState (what a
   view shows with nothing in it). Styles live in kit/feedback.css. Buttons come from
   window.V2Kit.Button at render. Spec: design-md/21-banner.md, 22-empty-state.md. */
(function () {
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }
  function Ico({ name, size }) {
    const Icon = window.V2Kit && window.V2Kit.Icon;
    return Icon ? <Icon name={name} size={size || 16} /> : null;
  }

  /* Banner: tone in the fill, the edge and the icon; the words stay in ink, so every tone clears
     4.5:1. One action at most: V2Kit.Link standalone (the family link). Only one-time news (a verified day)
     is dismissible; a condition ends when the condition ends. Danger is role=alert, the rest
     role=status. A ticking value inside goes in <strong aria-live="off"> so it is read once. */
  const BANNER_ICON = { info: 'info', success: 'check', attention: 'alert', danger: 'x-circle', offline: 'wifi-off' };
  function Banner({ tone, icon, title, children, action, onDismiss, dismissLabel, className }) {
    const t = BANNER_ICON[tone] ? tone : 'info';
    const ic = icon === null ? null : (icon || BANNER_ICON[t]);
    const L = window.V2Kit && window.V2Kit.Link;
    let act = action || null;
    if (action && action.label) {
      act = L ? (
        <L standalone href={action.href} external={action.external} onClick={action.onClick}
          className="v2-banner-action">{action.label}</L>
      ) : null;
    }
    return (
      <div className={cx('v2-banner', 'v2-banner--' + t, className)} role={t === 'danger' ? 'alert' : 'status'}>
        {ic ? <span className="v2-banner-icon" aria-hidden="true"><Ico name={ic} size={16} /></span> : null}
        <div className="v2-banner-text">
          {title ? <strong className="v2-banner-title">{title}</strong> : null}
          {children ? <div className="v2-banner-body">{children}</div> : null}
        </div>
        {act || onDismiss ? (
          <div className="v2-banner-actions">
            {act}
            {onDismiss ? <window.V2Kit.IconButton icon="close" label={dismissLabel || 'Dismiss'} size={32} onClick={onDismiss} /> : null}
          </div>
        ) : null}
      </div>
    );
  }

  /* EmptyState: the site's dashed ghost ("a thing will be here"). A neutral icon, a title that
     names what will appear, one line of why, and at most one way forward as a medium button.
     Variants change the words and the default icon, never the colours. */
  const EMPTY_ICON = { first: 'activity', noresults: 'info', error: 'alert', offline: 'wifi-off', locked: 'lock' };
  function EmptyState(props) {
    const { variant, icon, title, body, primaryAction, secondaryAction, headingLevel, className } = props;
    const v = EMPTY_ICON[variant] ? variant : 'first';
    const ic = icon === null ? null : (icon || EMPTY_ICON[v]);
    const H = 'h' + (headingLevel || 2);
    function button(a, kind) {
      if (!a) return null;
      if (React.isValidElement(a)) return a;
      const B = window.V2Kit.Button;
      return <B variant={kind} size="md" onClick={a.onClick} href={a.href} external={a.external} loading={a.loading} icon={a.icon}>{a.label}</B>;
    }
    return (
      <div className={cx('v2-empty', 'v2-empty--' + v, 'v2-anim-fade-up', className)} role={v === 'error' ? 'alert' : undefined}>
        {ic ? <span className="v2-empty-icon" aria-hidden="true"><Ico name={ic} size={24} /></span> : null}
        {title ? <H className="v2-empty-title v2-text-title">{title}</H> : null}
        {body ? <p className="v2-empty-body v2-text-body-sm">{body}</p> : null}
        {primaryAction || secondaryAction ? (
          <div className="v2-empty-actions">
            {button(primaryAction, 'primary')}
            {button(secondaryAction, primaryAction ? 'quiet' : 'secondary')}
          </div>
        ) : null}
      </div>
    );
  }

  Object.assign(window.V2Kit = window.V2Kit || {}, { Banner, EmptyState });
})();
