/* BlueAI Product V2 Design System: TextField, TextArea, Select on window.V2Kit.
   One question shape, the site's (onblue/onblue.css 1319-1334, 3622-3709): a label above, one box,
   and a message line that exists only when it may hold something. Styles in kit/inputs.css.
   Spec: design-md/12-text-field.md, design-md/13-select.md.

   Shared props  label (always give one; hideLabel keeps it for screen readers only), hideLabel,
                 value / defaultValue, onChange(value, event), placeholder (an example of the
                 answer, never the label), helper, error (a string shows the invalid state; pass
                 error={null} to reserve the message line on a field that validates later),
                 required, optional, disabled, readOnly, size 'sm'|'md' (32/40), width, id,
                 className. Other props reach the native control.
   TextField     + leading / trailing (an icon name or a node), mono, secret (password type with a
                 reveal button; implies mono; defaultRevealed starts it shown), maxLength (a soft
                 limit: never cuts text; the counter appears within 10% of it and the field turns
                 invalid past it) + showCount (show the counter from the first character),
                 status 'validating'|'validated' (say what is happening in helper).
   TextArea      + autoGrow (true), maxRows (6: grows to it, then scrolls), rows (3), maxLength,
                 showCount.
   Select        + options [{value, label, disabled}], placeholder (an instruction, shown as a
                 disabled first option). Native select: the operating system draws the open list.
   disabled is aria-disabled, never the native attribute, so the field keeps its tab stop and the
   helper that says why is read with it (P3, section 12): TextField and TextArea also go read-only,
   and Select ignores every way of changing it (press, keys, a change that gets through). */
(function () {
  const { useId, useRef, useState, useLayoutEffect } = React;

  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }
  function kit() { return window.V2Kit || {}; }
  function Ico({ name, size }) {
    const Icon = kit().Icon;
    return Icon && name ? <Icon name={name} size={size || 16} /> : null;
  }
  function Slot({ children, kind }) {
    if (children == null || children === false) return null;
    const node = typeof children === 'string' ? <Ico name={children} /> : children;
    return <span className={cx('v2-field-slot', kind && 'v2-field-slot--' + kind)}>{node}</span>;
  }
  function str(v) { return v == null ? '' : String(v); }

  /* Ids, message, counter and invalid state shared by all three controls. */
  function useField(p) {
    const auto = useId();
    const id = p.id || 'v2f' + auto.replace(/[^a-zA-Z0-9]/g, '');
    const controlled = p.value !== undefined;
    const [ownLen, setOwnLen] = useState(str(p.defaultValue).length);
    const len = controlled ? str(p.value).length : ownLen;
    const max = p.maxLength;
    const over = !!(max && len > max);
    const near = !!(max && !over && len >= Math.ceil(max * 0.9));
    // Shown when asked, and on any limited field once it nears or passes the limit, so an
    // over-limit field always says why it is invalid.
    const counting = !!(max && (p.showCount || near || over));
    const invalid = !!p.error || over;
    const tone = p.error ? 'error' : (p.status === 'validated' ? 'success' : null);
    const text = p.error || p.helper || null;
    const mayHold = !!(p.helper || p.status || counting || p.error !== undefined);
    const describedBy = [text ? id + '-msg' : null, counting ? id + '-count' : null, p['aria-describedby']]
      .filter(Boolean).join(' ') || undefined;
    function track(v) { if (!controlled) setOwnLen(str(v).length); }
    return { id, len, max, counting, over, near, invalid, tone, text, mayHold, describedBy, track };
  }

  /* Label, the box (children), message line. */
  function Frame({ f, p, kind, children }) {
    const size = p.size === 'sm' ? 'sm' : 'md';
    const width = p.width == null ? undefined : (typeof p.width === 'number' ? p.width + 'px' : p.width);
    return (
      <div className={cx('v2-field', 'v2-field--' + size, 'v2-field--' + kind, f.invalid && 'is-invalid',
        p.disabled && 'is-disabled', p.readOnly && 'is-readonly', p.hideLabel && 'v2-field--bare',
        (p.mono || p.secret) && 'v2-field--mono', p.className)} style={width ? { width: width } : undefined}>
        {p.label ? (
          <label className={p.hideLabel ? 'v2-sr-only' : 'v2-field-label'} htmlFor={f.id}>
            {p.label}
            {p.required && !p.hideLabel ? <span className="v2-field-flag v2-text-meta" aria-hidden="true">Required</span> : null}
            {p.optional && !p.hideLabel ? <span className="v2-field-flag v2-text-meta">Optional</span> : null}
          </label>
        ) : null}
        {children}
        {f.mayHold ? (
          <div className="v2-field-foot">
            <p id={f.id + '-msg'} className={cx('v2-field-msg', 'v2-text-caption', f.tone && 'v2-field-msg--' + f.tone)} aria-live="polite">
              {f.text && f.tone === 'error' ? <Ico name="alert" /> : null}
              {f.text ? <span>{f.text}</span> : null}
            </p>
            {f.counting ? (
              <span id={f.id + '-count'} className={cx('v2-field-count', 'v2-text-meta', f.near && 'is-near', f.over && 'is-over')}>
                {f.len} / {f.max}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }

  function Status({ status }) {
    if (status === 'validating') {
      const Spinner = kit().Spinner;
      return Spinner ? <Slot><Spinner size={16} delay={0} /></Slot> : null;
    }
    if (status === 'validated') return <Slot kind="ok">check</Slot>;
    return null;
  }

  function control(p, f) {
    return {
      id: f.id, required: p.required, 'aria-disabled': p.disabled ? 'true' : undefined,
      'aria-invalid': f.invalid || undefined, 'aria-describedby': f.describedBy,
    };
  }
  /* Frame-only props never reach the native control. No object-rest syntax: Babel hoists a rest's
     key list to one program-level _excluded that the next kit file overwrites (maxLength would then
     reach the input and cut pasted text instead of turning the field invalid). */
  const FRAME_OWN = ['label', 'hideLabel', 'helper', 'error', 'optional', 'leading', 'trailing', 'mono', 'secret',
    'size', 'status', 'width', 'className', 'showCount', 'autoGrow', 'maxRows', 'options', 'onChange', 'maxLength',
    'defaultRevealed', 'disabled'];
  function strip(p) {
    const rest = {};
    for (const k in p) if (FRAME_OWN.indexOf(k) < 0) rest[k] = p[k];
    return rest;
  }

  function TextField(props) {
    const p = props;
    const f = useField(p);
    const [shown, setShown] = useState(!!p.defaultRevealed);
    const IconButton = kit().IconButton;
    const reveal = p.secret && IconButton ? (
      <Slot kind="action">
        <IconButton icon="eye" size={28} label={'Show ' + (p.label || 'value')} aria-pressed={shown}
          disabled={p.disabled} onClick={function () { setShown(!shown); }} />
      </Slot>
    ) : null;
    const type = p.secret ? (shown ? 'text' : 'password') : (p.type || 'text');
    return (
      <Frame f={f} p={p} kind="text">
        <div className="v2-field-box">
          <Slot>{p.leading}</Slot>
          <input {...strip(p)} {...control(p, f)} type={type} className="v2-field-input"
            readOnly={p.readOnly || p.disabled} aria-busy={p.status === 'validating' || undefined}
            spellCheck={p.secret || p.mono ? false : p.spellCheck}
            autoComplete={p.secret ? 'off' : p.autoComplete}
            onChange={function (e) { f.track(e.target.value); if (p.onChange) p.onChange(e.target.value, e); }} />
          <Slot>{p.trailing}</Slot>
          <Status status={p.status} />
          {reveal}
        </div>
      </Frame>
    );
  }

  function TextArea(props) {
    const p = props;
    const f = useField(p);
    const ref = useRef(null);
    const grow = p.autoGrow !== false;
    const maxRows = p.maxRows || 6;
    function fit() {
      const el = ref.current;
      if (!el || !grow) return;
      const cs = getComputedStyle(el);
      const line = parseFloat(cs.lineHeight) || 21;
      const cap = line * maxRows + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
      el.style.height = 'auto';
      const full = el.scrollHeight;
      el.style.height = Math.min(full, cap) + 'px';
      el.style.overflowY = full > cap ? 'auto' : 'hidden';
    }
    useLayoutEffect(fit);
    return (
      <Frame f={f} p={p} kind="area">
        <div className="v2-field-box">
          <textarea {...strip(p)} {...control(p, f)} ref={ref} rows={p.rows || 3}
            className="v2-field-input v2-field-input--area" readOnly={p.readOnly || p.disabled}
            onChange={function (e) { f.track(e.target.value); fit(); if (p.onChange) p.onChange(e.target.value, e); }} />
        </div>
      </Frame>
    );
  }

  function Select(props) {
    const p = props;
    const f = useField(p);
    const controlled = p.value !== undefined;
    const [own, setOwn] = useState(str(p.defaultValue));
    const current = controlled ? str(p.value) : own;
    const rest = strip(p);
    delete rest.placeholder;
    delete rest.value;
    delete rest.defaultValue;
    const valueProps = controlled ? { value: current } : { defaultValue: p.placeholder && p.defaultValue == null ? '' : p.defaultValue };
    // Disabled keeps focus, so it blocks the list opening, the keys that change a closed select
    // (Tab still moves on) and, last, any change that gets through (a touch picker), putting back
    // the value it had when it took focus.
    const held = useRef(null);
    const hold = p.disabled ? {
      onMouseDown: function (e) { e.preventDefault(); },
      onKeyDown: function (e) { if (e.key !== 'Tab') e.preventDefault(); },
      onFocus: function (e) { held.current = e.target.value; },
    } : null;
    return (
      <Frame f={f} p={p} kind="select">
        <div className="v2-field-box">
          <select {...rest} {...control(p, f)} {...valueProps} {...hold}
            className={cx('v2-field-input', 'v2-field-select', current === '' && p.placeholder && 'is-placeholder')}
            onChange={function (e) {
              if (p.disabled) { if (held.current != null) e.target.value = held.current; return; }
              if (!controlled) setOwn(e.target.value); if (p.onChange) p.onChange(e.target.value, e);
            }}>
            {p.placeholder ? <option value="" disabled>{p.placeholder}</option> : null}
            {(p.options || []).map(function (o) {
              return <option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>;
            })}
          </select>
          <span className="v2-field-chevron" aria-hidden="true"><Ico name="chevron-down" /></span>
        </div>
      </Frame>
    );
  }

  Object.assign(window.V2Kit = window.V2Kit || {}, { TextField, TextArea, Select });
})();
