/* BlueAI Product V2 Design System: Switch, Checkbox, RadioCard, Segmented, Chip on window.V2Kit.
   Choice controls with the roles and keys they promise, and one chosen look shared with the site
   (blue 12% fill, blue 50% edge, ink; onblue/apply.html:930). Styles: Switch, Checkbox, RadioCard
   and Segmented in kit/inputs.css; Chip in kit/actions.css. Spec: design-md/14, design-md/15.

   Switch     {checked, onChange(next), label (visible, or the accessible name with hideLabel),
              hideLabel, description, disabled, busy}  role=switch. Applies at once and never
              destroys anything; busy holds it while a consent or check is pending.
   Checkbox   {checked | defaultChecked, onChange(next, event), label, description, disabled,
              indeterminate, required, error, name, value}  a native checkbox under a drawn box.
              Group several in <fieldset className="v2-fieldset"> with <legend className="v2-legend">.
   RadioCard  {label (the group's accessible name), name, options [{value, title, sub, disabled,
              disabledReason, pending, badge}], value | defaultValue, onChange(value),
              variant 'card'|'list'}  native radios, so arrow keys and focus come free. pending is
              true or a short tag ('Setup needed'): picked, not active yet.
   Segmented  {options [{value, label, icon, disabled}], value, onChange(value), ariaLabel,
              beforeChange(value) returning true or a promise of true (a gate such as the
              Automatic consent), size 'sm'|'md', disabled}  role=radiogroup with arrow keys,
              Home, End; with a gate, arrows only move focus and Space or Enter asks.
   Chip       {selected, onClick, icon, disabled, children}  selected undefined: a one-shot reply;
              true or false: a toggle (reason, filter) carrying aria-pressed. */
(function () {
  const { useId, useRef, useState, useEffect } = React;

  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }
  function kit() { return window.V2Kit || {}; }
  function Ico({ name, size }) {
    const Icon = kit().Icon;
    return Icon && name ? <Icon name={name} size={size || 16} /> : null;
  }
  function uid(auto, pre) { return pre + auto.replace(/[^a-zA-Z0-9]/g, ''); }

  function Switch(props) {
    const { checked, onChange, label, hideLabel, description, disabled, busy, id, className, ...rest } = props;
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
          {description ? <p id={sid + '-d'} className="v2-switch-desc">{description}</p> : null}
        </div>
        {control}
      </div>
    );
  }

  function Checkbox(props) {
    const { checked, defaultChecked, onChange, label, description, disabled, indeterminate, required, error,
      id, className, ...rest } = props;
    const auto = useId();
    const cid = id || uid(auto, 'v2c');
    const ref = useRef(null);
    useEffect(function () { if (ref.current) ref.current.indeterminate = !!indeterminate; }, [indeterminate]);
    const describedBy = [description ? cid + '-d' : null, error ? cid + '-e' : null].filter(Boolean).join(' ') || undefined;
    return (
      <div className={cx('v2-check', error && 'is-invalid', disabled && 'is-disabled', className)}>
        <label className="v2-check-row" htmlFor={cid}>
          <input {...rest} ref={ref} id={cid} type="checkbox" className="v2-check-input"
            checked={checked} defaultChecked={defaultChecked} disabled={disabled} required={required}
            aria-invalid={error ? true : undefined} aria-describedby={describedBy}
            onChange={function (e) { if (onChange) onChange(e.target.checked, e); }} />
          <span className="v2-check-box" aria-hidden="true" />
          <span className="v2-check-text">
            <span className="v2-check-label">{label}</span>
            {description ? <span id={cid + '-d'} className="v2-check-desc">{description}</span> : null}
          </span>
        </label>
        {error ? <p id={cid + '-e'} className="v2-check-msg"><Ico name="alert" /><span>{error}</span></p> : null}
      </div>
    );
  }

  function RadioCard(props) {
    const { label, name, options, value, defaultValue, onChange, variant = 'card', className } = props;
    const auto = useId();
    const group = name || uid(auto, 'v2r');
    const [own, setOwn] = useState(defaultValue);
    const current = value !== undefined ? value : own;
    const Badge = kit().Badge;
    function tag(text, tone) {
      if (!text || text === true) return null;
      return Badge ? <Badge tone={tone}>{text}</Badge> : <span className="v2-radio-card-tag">{text}</span>;
    }
    return (
      <div role="radiogroup" aria-label={label} className={cx('v2-radio-cards', 'v2-radio-cards--' + variant, className)}>
        {(options || []).map(function (o) {
          const on = o.value === current;
          const key = group + '-' + String(o.value).replace(/[^a-zA-Z0-9]/g, '');
          return (
            <label key={o.value} className={cx('v2-radio-card', on && 'is-selected', o.pending && 'is-pending',
              o.disabled && 'is-disabled', o.className)}>
              <input type="radio" className="v2-radio-input" name={group} value={o.value} checked={on}
                disabled={o.disabled} aria-labelledby={key + '-t'}
                aria-describedby={[o.sub ? key + '-s' : null, o.disabled && o.disabledReason ? key + '-w' : null].filter(Boolean).join(' ') || undefined}
                onChange={function () { if (value === undefined) setOwn(o.value); if (onChange) onChange(o.value); }} />
              <span className="v2-radio-card-body">
                <span className="v2-radio-card-head">
                  <span id={key + '-t'} className="v2-radio-card-title">{o.title}</span>
                  {tag(o.pending, 'attention')}
                  {o.pending ? null : tag(o.badge, 'neutral')}
                  <span className="v2-radio-card-check" aria-hidden="true"><Ico name="check" /></span>
                </span>
                {o.sub ? <span id={key + '-s'} className="v2-radio-card-sub">{o.sub}</span> : null}
                {o.disabled && o.disabledReason ? (
                  <span id={key + '-w'} className="v2-radio-card-why"><Ico name="lock" /><span>{o.disabledReason}</span></span>
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
    const { options, value, onChange, ariaLabel, beforeChange, size = 'md', disabled, className } = props;
    const list = options || [];
    const refs = useRef([]);
    const [pending, setPending] = useState(null);
    const sel = list.findIndex(function (o) { return o.value === value; });
    const tabStop = sel >= 0 ? sel : 0;
    function commit(v) {
      if (v === value || disabled || pending !== null) return;
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
    return (
      <div role="radiogroup" aria-label={ariaLabel} aria-busy={pending !== null ? 'true' : undefined}
        className={cx('v2-segmented', 'v2-segmented--' + (size === 'sm' ? 'sm' : 'md'), disabled && 'is-disabled', className)}>
        {list.map(function (o, i) {
          const on = o.value === value;
          return (
            <button key={o.value} ref={function (el) { refs.current[i] = el; }} type="button" role="radio"
              aria-checked={on} tabIndex={i === tabStop ? 0 : -1} disabled={disabled || o.disabled}
              className={cx('v2-segment', on && 'is-selected', pending === o.value && 'is-pending', o.className)}
              onClick={function () { commit(o.value); }} onKeyDown={function (e) { onKey(e, i); }}>
              <Ico name={o.icon} />
              <span>{o.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  function Chip(props) {
    const { selected, onClick, icon, disabled, className, children, ...rest } = props;
    const toggle = selected !== undefined && selected !== null;
    return (
      <button {...rest} type="button" disabled={disabled} aria-pressed={toggle ? !!selected : undefined}
        className={cx('v2-chip', toggle && selected && 'is-selected', className)} onClick={onClick}>
        <Ico name={icon} />
        <span>{children}</span>
      </button>
    );
  }

  Object.assign(window.V2Kit = window.V2Kit || {}, { Switch, Checkbox, RadioCard, Segmented, Chip });
})();
