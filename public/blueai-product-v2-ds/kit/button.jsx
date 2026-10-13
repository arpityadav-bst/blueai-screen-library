/* BlueAI Product V2 Design System: Button, IconButton, Link on window.V2Kit.
   One action ladder in one shape (radius 6, label 13/500), the site's button logic (onblue/onblue.css
   959-999): primary once per view, secondary for the frequent second action, quiet for the third,
   danger for the one that destroys; an underlined ink link for actions inside a sentence; a bare
   icon button for the header. Every state lives in kit/actions.css. Spec: design-md/11-button.md.

   Button     {variant 'primary'|'secondary'|'quiet'|'danger' (default 'secondary': primary is
              always a choice), size 'sm'|'md'|'lg' (28/36/44), icon, iconRight (icon names),
              loading, disabled, disabledReason, full, type ('button'), onClick, href, external,
              className, children}
              Disabled stays focusable (aria-disabled) so the reason printed beside it can be
              reached; loading keeps the label, swaps the icon for a spinner and ignores clicks.
   IconButton {icon, label (required: the only name a screen reader hears), size 28|32|36 (36),
              variant 'bare'|'outlined', active (its menu is open), tone 'default'|'danger',
              disabled, disabledReason, onClick; aria-expanded / aria-haspopup / aria-pressed
              pass through}  Disabled stays focusable too. A glyph has no room for a printed
              line, so its reason is the label tooltip (V2Kit.Tooltip, on hover and focus) and
              the description a screen reader hears.
   Link       {href, external, tone 'ink'|'muted', standalone, onClick, children}
              Without href it renders a button drawn as a link (an inline action). */
(function () {
  const { useId } = React;

  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }
  /* Rest props without object-rest syntax: Babel hoists a rest's key list to one program-level
     _excluded that the next kit file overwrites, so the wrong props reach the DOM. */
  function omit(o, keys) { const r = {}; for (const k in o) if (keys.indexOf(k) < 0) r[k] = o[k]; return r; }
  const BUTTON_OWN = ['variant', 'size', 'icon', 'iconRight', 'loading', 'disabled', 'disabledReason', 'full',
    'type', 'onClick', 'href', 'external', 'className', 'children'];
  const ICON_BUTTON_OWN = ['icon', 'label', 'size', 'variant', 'active', 'tone', 'disabled', 'disabledReason', 'onClick', 'className'];
  const LINK_OWN = ['href', 'external', 'tone', 'standalone', 'onClick', 'className', 'children'];
  function Ico({ name, size, inline }) {
    const Icon = window.V2Kit && window.V2Kit.Icon;
    return Icon && name ? <Icon name={name} size={size || 16} inline={inline} /> : null;
  }
  function Spin({ onColor }) {
    const Spinner = window.V2Kit && window.V2Kit.Spinner;
    return Spinner ? <Spinner size={16} delay={0} variant={onColor ? 'on-color' : undefined} />
      : <span className="v2-button-spin" aria-hidden="true" />;
  }
  const NEW_TAB = ' (opens in a new tab)';

  function Button(props) {
    const { variant = 'secondary', size = 'md', icon, iconRight, loading, disabled, disabledReason, full,
      type = 'button', onClick, href, external, className, children } = props;
    const rest = omit(props, BUTTON_OWN);
    const reasonId = useId();
    const blocked = !!(disabled || loading);
    const showReason = !!(disabled && disabledReason);
    const cls = cx('v2-button', 'v2-button--' + variant, 'v2-button--' + size, full && 'v2-button--full',
      loading && 'is-loading', className);
    const trailing = iconRight || (external ? 'external' : null);
    function guard(e) {
      if (blocked) { e.preventDefault(); e.stopPropagation(); return; }
      if (onClick) onClick(e);
    }
    const inner = (
      <>
        {loading ? <Spin onColor={variant === 'primary' || variant === 'danger'} /> : <Ico name={icon} />}
        <span className="v2-button-label">{children}</span>
        {loading ? null : <Ico name={trailing} />}
        {external ? <span className="v2-sr-only">{NEW_TAB}</span> : null}
      </>
    );
    const a11y = {
      'aria-disabled': blocked ? 'true' : undefined,
      'aria-busy': loading ? 'true' : undefined,
      'aria-describedby': showReason ? reasonId : rest['aria-describedby'],
    };
    const el = href
      ? <a {...rest} {...a11y} className={cls} href={href} onClick={guard}
          target={external ? '_blank' : rest.target} rel={external ? 'noopener noreferrer' : rest.rel}>{inner}</a>
      : <button {...rest} {...a11y} type={type} className={cls} onClick={guard}>{inner}</button>;
    if (!showReason) return el;
    return (
      <span className={cx('v2-button-group', full && 'v2-button-group--full')}>
        {el}
        <span id={reasonId} className="v2-button-reason v2-text-caption">{disabledReason}</span>
      </span>
    );
  }

  let warned = false;
  function IconButton(props) {
    const { icon, label, size = 36, variant = 'bare', active, tone = 'default', disabled, disabledReason, onClick, className } = props;
    const rest = omit(props, ICON_BUTTON_OWN);
    const reasonId = useId();
    const why = !!(disabled && disabledReason);
    if (!label && !warned && window.console) {
      warned = true;
      console.warn('[V2Kit.IconButton] label is required: it is the only name a screen reader hears.');
    }
    const s = size === 28 || size === 32 ? size : 36;
    const cls = cx('v2-icon-button', 'v2-icon-button--' + s, variant === 'outlined' && 'v2-icon-button--outlined',
      tone === 'danger' && 'v2-icon-button--danger', active && 'is-on', className);
    const el = (
      <button {...rest} type="button" className={cls} aria-label={label}
        aria-disabled={disabled ? 'true' : undefined} aria-describedby={why ? reasonId : rest['aria-describedby']}
        onClick={function (e) { if (disabled) { e.preventDefault(); return; } if (onClick) onClick(e); }}>
        <Ico name={icon} size={s === 28 ? 16 : 20} />
      </button>
    );
    if (!why) return el;
    const Tip = window.V2Kit && window.V2Kit.Tooltip;
    return (
      <>
        {Tip ? <Tip content={disabledReason}>{el}</Tip> : el}
        <span id={reasonId} className="v2-sr-only">{disabledReason}</span>
      </>
    );
  }

  function Link(props) {
    const { href, external, tone = 'ink', standalone, onClick, className, children } = props;
    const rest = omit(props, LINK_OWN);
    const cls = cx('v2-link', tone === 'muted' && 'v2-link--muted', standalone && 'v2-link--standalone', className);
    const body = (
      <>
        <span className="v2-link-text">{children}</span>
        {external ? <Ico name="external" size={16} inline={!standalone} /> : null}
        {external ? <span className="v2-sr-only">{NEW_TAB}</span> : null}
      </>
    );
    if (!href) return <button {...rest} type="button" className={cls} onClick={onClick}>{body}</button>;
    return (
      <a {...rest} className={cls} href={href} onClick={onClick}
        target={external ? '_blank' : rest.target} rel={external ? 'noopener noreferrer' : rest.rel}>{body}</a>
    );
  }

  Object.assign(window.V2Kit = window.V2Kit || {}, { Button, IconButton, Link });
})();
