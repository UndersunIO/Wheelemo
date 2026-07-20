import React, {useEffect, useRef, useState} from 'react';
import './components.css';

export function Button({
  as: Component = 'button',
  variant = 'secondary',
  size = 'md',
  mobileFull = false,
  className = '',
  children,
  ...props
}) {
  const classes = [
    'sl-button',
    `sl-button--${variant}`,
    size !== 'md' ? `sl-button--${size}` : '',
    mobileFull ? 'sl-button--mobile-full' : '',
    className,
  ].filter(Boolean).join(' ');

  return <Component type={Component === 'button' ? 'button' : undefined} className={classes} {...props}>{children}</Component>;
}

export function Card({as: Component = 'div', interactive = false, className = '', children, ...props}) {
  const classes = ['sl-card', interactive ? 'sl-card--interactive' : '', className].filter(Boolean).join(' ');
  return <Component className={classes} {...props}>{children}</Component>;
}

export function Input({label, hint, error, className = '', ...props}) {
  const describedBy = [hint ? `${props.id || props.name}-hint` : '', error ? `${props.id || props.name}-error` : '']
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <label className="sl-field">
      {label && <span className="sl-field__label">{label}</span>}
      <input
        className={['sl-input', className].filter(Boolean).join(' ')}
        aria-describedby={describedBy}
        aria-invalid={error ? 'true' : undefined}
        {...props}
      />
      {hint && <span className="sl-field__hint" id={`${props.id || props.name}-hint`}>{hint}</span>}
      {error && <span className="sl-field__error" id={`${props.id || props.name}-error`}>{error}</span>}
    </label>
  );
}

export function Modal({open, onClose, title, children, actions, closeLabel = 'Fermer'}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const previousFocus = document.activeElement;
    const dialog = dialogRef.current;
    const focusable = dialog?.querySelectorAll('a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])');
    (focusable?.[0] || dialog)?.focus();

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose?.();
      if (event.key !== 'Tab' || !focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="sl-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose?.()}>
      <section className="sl-modal" role="dialog" aria-modal="true" aria-labelledby="sl-modal-title" ref={dialogRef} tabIndex={-1}>
        <header className="sl-modal__header">
          <h2 className="sl-modal__title" id="sl-modal-title">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label={closeLabel}>×</Button>
        </header>
        <div className="sl-modal__body">{children}</div>
        {actions && <footer className="sl-modal__actions">{actions}</footer>}
      </section>
    </div>
  );
}

export function Tooltip({content, children}) {
  return (
    <span className="sl-tooltip">
      {children}
      <span className="sl-tooltip__content" role="tooltip">{content}</span>
    </span>
  );
}

export function Badge({children, tone = 'accent', className = '', ...props}) {
  return <span className={['sl-badge', `sl-badge--${tone}`, className].filter(Boolean).join(' ')} {...props}>{children}</span>;
}

export function ProgressBar({label, value, max = 100}) {
  const safeValue = Math.min(Math.max(value, 0), max);
  const percent = max > 0 ? Math.round((safeValue / max) * 100) : 0;
  return (
    <div className="sl-progress">
      <div className="sl-progress__label">
        <span>{label}</span>
        <span className="sl-progress__value">{percent}%</span>
      </div>
      <div className="sl-progress__track" role="progressbar" aria-label={label} aria-valuemin="0" aria-valuemax={max} aria-valuenow={safeValue}>
        <div className="sl-progress__bar" style={{width: `${percent}%`}} />
      </div>
    </div>
  );
}

export function Navbar({as: Component = 'nav', className = '', children, ...props}) {
  return <Component className={['sl-navbar', className].filter(Boolean).join(' ')} {...props}>{children}</Component>;
}

export function Sidebar({as: Component = 'aside', className = '', children, ...props}) {
  return <Component className={['sl-sidebar', className].filter(Boolean).join(' ')} {...props}>{children}</Component>;
}

export function Tabs({items, defaultId}) {
  const [activeId, setActiveId] = useState(defaultId || items[0]?.id);

  if (!items.length) return null;

  function handleKeyDown(event, index) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? items.length - 1
        : (index + (event.key === 'ArrowRight' ? 1 : -1) + items.length) % items.length;
    setActiveId(items[nextIndex].id);
    event.currentTarget.parentElement.children[nextIndex].focus();
  }

  const activeItem = items.find((item) => item.id === activeId) || items[0];
  return (
    <div className="sl-tabs">
      <div className="sl-tabs__list" role="tablist" aria-label="Sections">
        {items.map((item, index) => (
          <button
            className="sl-tabs__tab"
            id={`tab-${item.id}`}
            key={item.id}
            role="tab"
            aria-selected={item.id === activeItem.id}
            aria-controls={`panel-${item.id}`}
            tabIndex={item.id === activeItem.id ? 0 : -1}
            onClick={() => setActiveId(item.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="sl-tabs__panel" id={`panel-${activeItem.id}`} role="tabpanel" aria-labelledby={`tab-${activeItem.id}`}>
        {activeItem.content}
      </div>
    </div>
  );
}

export function Accordion({items}) {
  return (
    <div className="sl-accordion">
      {items.map((item) => (
        <details className="sl-accordion__item" key={item.id || item.title}>
          <summary className="sl-accordion__summary">{item.title}</summary>
          <div className="sl-accordion__content">{item.content}</div>
        </details>
      ))}
    </div>
  );
}

export function Callout({title, tone = 'accent', children}) {
  return (
    <aside className={`sl-callout sl-callout--${tone}`}>
      {title && <p className="sl-callout__title">{title}</p>}
      {children}
    </aside>
  );
}

export function Alert({title, tone = 'info', children}) {
  return (
    <div className={`sl-alert sl-alert--${tone}`} role={tone === 'danger' ? 'alert' : 'status'}>
      {title && <p className="sl-alert__title">{title}</p>}
      {children}
    </div>
  );
}

export function Toast({title, tone = 'info', children}) {
  return (
    <div className={`sl-toast sl-toast--${tone}`} role={tone === 'danger' ? 'alert' : 'status'} aria-live={tone === 'danger' ? 'assertive' : 'polite'}>
      {title && <p className="sl-toast__title">{title}</p>}
      {children}
    </div>
  );
}
