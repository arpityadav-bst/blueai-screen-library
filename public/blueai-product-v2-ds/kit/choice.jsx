/* BlueAI Product V2 Design System: Switch, Checkbox, RadioCard, Segmented, Chip on window.V2Kit.
   Choice controls with the roles and keys they promise, and one chosen look shared with the site
   (blue 12% fill, blue 50% edge, ink; onblue/apply.html:930). Styles: Switch, Checkbox, RadioCard
   and Segmented in kit/inputs.css; Chip in kit/actions.css. Spec: design-md/14, design-md/15.

   Switch     {checked, onChange(next), label (visible, or the accessible name with hideLabel),
              hideLabel, description, disabled, busy}  role=switch. Applies at once and never
              destroys anything; busy holds it while a consent or check is pending.
   Checkbox   {checked | defaultChecked, onChange(next, event), label, description, disabled,
              disabledReason, indeterminate, required, error, name, value}  a native checkbox
              under a drawn box.
              Group several in <fieldset className="v2-fieldset"> with <legend className="v2-legend">.
   RadioCard  {label (the group's accessible name), name (a prefix for the radios' name; ids and the
              group are always unique per instance), options [{value, title, sub, disabled,
              disabledReason, pending, badge}], value | defaultValue, onChange(value),
              variant 'card'|'list'}  native radios, so arrow keys and focus come free. pending is
              true or a short tag ('Setup needed'): picked, not active yet. A disabled card stays
              reachable (arrows land on it and read its reason) but never takes the selection.
   Segmented  {options [{value, label, icon, disabled, disabledReason}], value, onChange(value),
              ariaLabel, beforeChange(value) returning true or a promise of true (a gate such as
              the Automatic consent), size 'sm'|'md', disabled, disabledReason}  role=radiogroup
              with arrow keys, Home, End; with a gate, arrows only move focus and Space or Enter asks.
   Chip       {selected, onClick, icon, disabled, disabledReason, children}  selected undefined: a
              one-shot reply; true or false: a toggle (reason, filter) carrying aria-pressed.
              Selected draws a check in place of the icon, so selection is never shown by hue alone.
   Disabled is one model across the kit (Button, IconButton, ListRow, Switch and these): the control
   carries aria-disabled, stays in the tab order and ignores the press, and disabledReason is
   printed under it and tied to it with aria-describedby (P3, section 09). Switch has no separate
   reason: its description says why, and it is already tied to the switch. */
(function () {
  const { useId, useRef, useState, useEffect } = React;

  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }
  function kit() { return window.V2Kit || {}; }
  function Ico({ name, size }) {
    const Icon = kit().Icon;
    return Icon && name ? <Icon name={name} size={size || 16} /> : null;
  }
  function uid(auto, pre) { return pre + auto.replace(/[^a-zA-Z0-9]/g, ''); }
  /* Rest props without object-rest syntax: Babel hoists a rest's key list to one program-level
     _excluded that the next kit file overwrites, so the wrong props reach the DOM. */
  function omit(o, keys) { const r = {}; for (const k in o) if (keys.indexOf(k) < 0) r[k] = o[k]; return r; }
  const SWITCH_OWN = ['checked', 'onChange', 'label', 'hideLabel', 'description', 'disabled', 'busy', 'id', 'className'];
  const CHECK_OWN = ['checked', 'defaultChecked', 'onChange', 'label', 'description', 'disabled', 'disabledReason',
    'indeterminate', 'required', 'error', 'id', 'className'];
  const CHIP_OWN = ['selected', 'onClick', 'icon', 'disabled', 'disabledReason', 'className', 'children'];
  // The reason line under a disabled control (the Button's, kit/actions.css).
  function Reason({ id, children }) { return <span id={id} className="v2-reason v2-text-caption">{children}</span>; }

  function Switch(props) {
    const { checked, onChange, label, hideLabel, description, disabled, busy, id, className } = props;
    const rest = omit(props, SWITCH_OWN);
    const auto = useId();
    const sid = id || uid(auto, 'v2s');
    const blocked = !!(disabled || busy);
    const bare = hideLabel || !label;
    const Spinner = kit().Spinner;
    const control = (
      <button {...rest} id={sid} type="button" role="switch" aria-checked={!!checked}
        aria-label={bare ? label : undefined} aria-describedby={description ? sid + '-d' : undefined}
        aria-busy={busy ? 'true' : undefined} aria-disabled={blocked ? 'true' : undefined}
        className={cx('v2-switch', checked && 'is-on', busy && 'is-busy', bare && className)}
        onClick={function () { if (!blocked && onChange) onChange(!checked); }}>
        <span className="v2-switch-thumb">{busy && Spinner ? <Spinner size={12} delay={0} /> : null}</span>
      </button>
    );
    if (bare) return control;
    return (
      <div className={cx('v2-switch-row', blocked && 'is-disabled', className)}>
        <div className="v2-switch-text">
          <label className="v2-switch-label" htmlFor={sid}>{label}</label>
          {description ? <p id={sid + '-d'} className="v2-switch-desc v2-text-body-sm">{description}</p> : null}
        </div>
        {control}
      </div>
    );
  }

  function Checkbox(props) {
    const { checked, defaultChecked, onChange, label, description, disabled, disabledReason, indeterminate, required,
      error, id, className } = props;
    const rest = omit(props, CHECK_OWN);
    const auto = useId();
    const cid = id || uid(auto, 'v2c');
    const ref = useRef(null);
    useEffect(function () { if (ref.current) ref.current.indeterminate = !!indeterminate; }, [indeterminate]);
    const why = disabled && disabledReason;
    const describedBy = [description ? cid + '-d' : null, why ? cid + '-w' : null, error ? cid + '-e' : null].filter(Boolean).join(' ') || undefined;
    return (
      <div className={cx('v2-check', error && 'is-invalid', disabled && 'is-disabled', className)}>
        <label className="v2-check-row" htmlFor={cid}>
          <input {...rest} ref={ref} id={cid} type="checkbox" className="v2-check-input"
            checked={checked} defaultChecked={defaultChecked} required={required}
            aria-disabled={disabled ? 'true' : undefined} aria-invalid={error ? true : undefined} aria-describedby={describedBy}
            onClick={function (e) { if (disabled) e.preventDefault(); }}
            onChange={function (e) { if (!disabled && onChange) onChange(e.target.checked, e); }} />
          <span className="v2-check-box" aria-hidden="true" />
          <span className="v2-check-text">
            <span className="v2-check-label">{label}</span>
            {description ? <span id={cid + '-d'} className="v2-check-desc v2-text-body-sm">{description}</span> : null}
          </span>
        </label>
        {why ? <p id={cid + '-w'} className="v2-check-msg v2-check-msg--why v2-text-caption"><Ico name="lock" /><span>{disabledReason}</span></p> : null}
        {error ? <p id={cid + '-e'} className="v2-check-msg v2-text-caption"><Ico name="alert" /><span>{error}</span></p> : null}
      </div>
    );
  }

  function RadioCard(props) {
    const { label, name, options, value, defaultValue, onChange, variant = 'card', className } = props;
    const auto = useId();
    const rid = uid(auto, 'v2r'); // element ids come from useId, never from name
    const group = name ? name + '-' + rid : rid; // so two panels never share one radio group
    const [own, setOwn] = useState(defaultValue);
    const current = value !== undefined ? value : own;
    const Badge = kit().Badge;
    // The pending tag and the badge are words on the card, so the radio is described by them.
    function tag(text, tone, id) {
      if (!text || text === true) return null;
      return Badge ? <Badge tone={tone} id={id}>{text}</Badge> : <span id={id} className="v2-text-caption">{text}</span>;
    }
    function said(o) { return typeof o.pending === 'string' ? o.pending : (!o.pending && o.badge && o.badge !== true ? o.badge : null); }
    return (
      <div role="radiogroup" aria-label={label} className={cx('v2-radio-cards', 'v2-radio-cards--' + variant, className)}>
        {(options || []).map(function (o) {
          const on = o.value === current;
          const key = rid + '-' + String(o.value).replace(/[^a-zA-Z0-9]/g, '');
          return (
            <label key={o.value} className={cx('v2-radio-card', on && 'is-selected', o.pending && 'is-pending',
              o.disabled && 'is-disabled', o.className)}>
              <input type="radio" className="v2-radio-input" name={group} value={o.value} checked={on}
                aria-disabled={o.disabled ? 'true' : undefined} aria-labelledby={key + '-t'}
                aria-describedby={[said(o) ? key + '-p' : null, o.sub ? key + '-s' : null, o.disabled && o.disabledReason ? key + '-w' : null].filter(Boolean).join(' ') || undefined}
                onChange={function () { if (o.disabled) return; if (value === undefined) setOwn(o.value); if (onChange) onChange(o.value); }} />
              <span className="v2-radio-card-body">
                <span className="v2-radio-card-head">
                  <span id={key + '-t'} className="v2-radio-card-title v2-text-title-sm">{o.title}</span>
                  {tag(o.pending, 'attention', key + '-p')}
                  {o.pending ? null : tag(o.badge, 'neutral', key + '-p')}
                  <span className="v2-radio-card-check" aria-hidden="true"><Ico name="check" /></span>
                </span>
                {o.sub ? <span id={key + '-s'} className="v2-radio-card-sub">{o.sub}</span> : null}
                {o.disabled && o.disabledReason ? (
                  <span id={key + '-w'} className="v2-radio-card-why v2-text-caption"><Ico name="lock" /><span>{o.disabledReason}</span></span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
    );
  }

  const STEP = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1, Home: 1, End: -1 };
  function Segmented(props) {
    const { options, value, onChange, ariaLabel, beforeChange, size = 'md', disabled, disabledReason, className } = props;
    const list = options || [];
    const refs = useRef([]);
    const gid = uid(useId(), 'v2g');
    const [pending, setPending] = useState(null);
    const sel = list.findIndex(function (o) { return o.value === value; });
    const tabStop = sel >= 0 ? sel : 0;
    function off(o) { return !!(disabled || (o && o.disabled)); }
    // Each disabled option's reason (the group's when the whole control is off), said once below it.
    function whyOf(o, i) { return disabled ? (disabledReason ? gid : null) : (o.disabled && o.disabledReason ? gid + '-' + i : null); }
    const reasons = disabled ? (disabledReason ? [[gid, disabledReason]] : [])
      : list.map(function (o, i) { return o.disabled && o.disabledReason ? [gid + '-' + i, o.disabledReason] : null; }).filter(Boolean);
    function commit(v) {
      if (v === value || off(list.find(function (o) { return o.value === v; })) || pending !== null) return;
      if (!beforeChange) { if (onChange) onChange(v); return; }
      setPending(v);
      Promise.resolve(beforeChange(v)).then(function (ok) {
        setPending(null);
        if (ok === true && onChange) onChange(v);
      }, function () { setPending(null); });
    }
    function onKey(e, i) {
      if (!(e.key in STEP)) return;
      e.preventDefault();
      const n = list.length;
      const dir = STEP[e.key];
      let j = e.key === 'Home' ? 0 : (e.key === 'End' ? n - 1 : (i + dir + n) % n);
      for (let k = 0; k < n && list[j].disabled; k++) j = (j + dir + n) % n;
      if (refs.current[j]) refs.current[j].focus();
      if (!beforeChange) commit(list[j].value);
    }
    const group = (
      <div role="radiogroup" aria-label={ariaLabel} aria-busy={pending !== null ? 'true' : undefined}
        aria-disabled={disabled ? 'true' : undefined}
        className={cx('v2-segmented', 'v2-segmented--' + (size === 'sm' ? 'sm' : 'md'), disabled && 'is-disabled', className)}>
        {list.map(function (o, i) {
          const on = o.value === value;
          return (
            <button key={o.value} ref={function (el) { refs.current[i] = el; }} type="button" role="radio"
              aria-checked={on} tabIndex={i === tabStop ? 0 : -1} aria-disabled={off(o) ? 'true' : undefined}
              aria-describedby={whyOf(o, i) || undefined}
              className={cx('v2-segment', on && 'is-selected', pending === o.value && 'is-pending', o.className)}
              onClick={function () { commit(o.value); }} onKeyDown={function (e) { onKey(e, i); }}>
              <Ico name={o.icon} />
              <span>{o.label}</span>
            </button>
          );
        })}
      </div>
    );
    if (!reasons.length) return group;
    return (
      <div className="v2-segmented-group">
        {group}
        {reasons.map(function (r) { return <Reason key={r[0]} id={r[0]}>{r[1]}</Reason>; })}
      </div>
    );
  }

  function Chip(props) {
    const { selected, onClick, icon, disabled, disabledReason, className, children } = props;
    const rest = omit(props, CHIP_OWN);
    const rid = uid(useId(), 'v2w');
    const toggle = selected !== undefined && selected !== null;
    const on = toggle && !!selected;
    const why = !!(disabled && disabledReason);
    const chip = (
      <button {...rest} type="button" aria-disabled={disabled ? 'true' : undefined} aria-pressed={toggle ? on : undefined}
        aria-describedby={why ? rid : rest['aria-describedby']}
        className={cx('v2-chip', on && 'is-selected', className)}
        onClick={function (e) { if (disabled) { e.preventDefault(); return; } if (onClick) onClick(e); }}>
        <Ico name={on ? 'check' : icon} />
        <span>{children}</span>
      </button>
    );
    if (!why) return chip;
    return <span className="v2-button-group">{chip}<Reason id={rid}>{disabledReason}</Reason></span>;
  }

  Object.assign(window.V2Kit = window.V2Kit || {}, { Switch, Checkbox, RadioCard, Segmented, Chip });
})();
