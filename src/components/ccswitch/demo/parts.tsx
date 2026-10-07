import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Check, CircleHelp, MoreHorizontal, Search, X, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHoverTip } from './hoverTipContext';

/* Small copies of the app's UI primitives (src/components/ui in cc-switch), sized like v4. */

export function PaneHeader({
  icon,
  title,
  extra,
  actions,
  leading,
  small,
}: {
  icon: ReactNode;
  title: string;
  extra?: ReactNode;
  actions?: ReactNode;
  leading?: ReactNode;
  /** The session reader uses the 16px "app" title. */
  small?: boolean;
}) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4 sm:ps-6 sm:pe-4">
      <div className="flex min-w-0 items-center gap-2.5">
        {leading}
        <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center text-foreground">{icon}</span>
        <h3 className={cn('truncate font-semibold text-foreground', small ? 'text-base' : 'text-lg')}>{title}</h3>
        {extra && <div className="flex shrink-0 items-center gap-1">{extra}</div>}
      </div>
      <span className="flex-1" />
      {actions && <div className="flex shrink-0 items-center justify-end gap-2">{actions}</div>}
    </header>
  );
}

export function HelpTip({ title, body }: { title: string; body: string }) {
  const { tip } = useHoverTip();
  return (
    <button
      type="button"
      {...tip(body, title)}
      aria-label={title}
      className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[var(--app-fg3)] hover:bg-[var(--app-subtle)] hover:text-foreground"
    >
      <CircleHelp className="h-3.5 w-3.5" strokeWidth={1.5} />
    </button>
  );
}

type BtnVariant = 'solid' | 'neutral' | 'quiet';

const BTN_VARIANT: Record<BtnVariant, string> = {
  solid: 'border border-transparent bg-[var(--app-action)] font-semibold text-white hover:bg-[var(--app-action-hover)]',
  neutral: 'border border-[var(--app-border-strong)] bg-[var(--app-surface)] text-foreground hover:bg-[var(--app-subtle)]',
  quiet: 'border border-transparent text-foreground hover:bg-[var(--app-subtle)]',
};

export function Btn({
  variant = 'neutral',
  compact,
  icon: Icon,
  trailingIcon: Trailing,
  children,
  onClick,
  className,
  hideLabelOnMobile,
  disabled,
}: {
  variant?: BtnVariant;
  compact?: boolean;
  icon?: LucideIcon;
  trailingIcon?: LucideIcon;
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
  hideLabelOnMobile?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-[13px] font-medium transition-[background-color,transform] active:scale-[0.96] disabled:pointer-events-none disabled:opacity-50',
        compact ? 'h-7 px-3' : 'h-8 px-3.5',
        BTN_VARIANT[variant],
        className,
      )}
    >
      {Icon && <Icon className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} strokeWidth={2} />}
      {children && <span className={cn(hideLabelOnMobile && 'hidden sm:inline')}>{children}</span>}
      {Trailing && <Trailing className="h-3.5 w-3.5" strokeWidth={2} />}
    </button>
  );
}

export function IconBtn({
  icon: Icon,
  label,
  onClick,
  large,
  active,
  className,
  disabled,
}: {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  large?: boolean;
  active?: boolean;
  className?: string;
  disabled?: boolean;
}) {
  const { tip } = useHoverTip();
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      {...tip(label)}
      aria-label={label}
      aria-disabled={disabled}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-md text-[var(--app-fg2)] transition-colors hover:bg-[var(--app-subtle)] hover:text-foreground',
        large ? 'h-8 w-8' : 'h-7 w-7',
        active && 'bg-[var(--app-selected)] text-foreground',
        disabled && 'opacity-40 hover:bg-transparent',
        className,
      )}
    >
      <Icon className={large ? 'h-4 w-4' : 'h-[15px] w-[15px]'} strokeWidth={1.6} />
    </button>
  );
}

type PillTone = 'neutral' | 'warning' | 'success' | 'danger';

const PILL_TONE: Record<PillTone, string> = {
  neutral: 'border border-[var(--app-border-strong)] text-[var(--app-fg2)]',
  warning: 'bg-[var(--app-warning-soft)] text-[var(--app-warning-text)]',
  success: 'bg-[var(--app-success-soft)] text-[var(--app-success-text)]',
  danger: 'bg-[var(--app-danger-soft)] text-[var(--app-danger-text)]',
};

export function Pill({ children, tone = 'neutral', mono }: { children: ReactNode; tone?: PillTone; mono?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex h-[18px] shrink-0 items-center whitespace-nowrap rounded-full px-1.5 text-[11px] font-medium leading-4',
        PILL_TONE[tone],
        mono && 'font-mono',
      )}
    >
      {children}
    </span>
  );
}

export function SearchField({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}) {
  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute start-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--app-fg3)]" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') onChange('');
        }}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-8 w-full rounded-md border border-[var(--app-border-strong)] bg-[var(--app-surface)] pe-8 ps-8 text-[13px] text-foreground outline-none placeholder:text-[var(--app-fg3)] focus:border-[var(--app-action)] focus:ring-[3px] focus:ring-[rgba(249,115,22,0.2)]"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear"
          className="absolute end-1 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-[var(--app-fg3)] hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

export function Segmented<T extends string>({
  items,
  value,
  onChange,
  layoutId,
  small,
  className,
}: {
  items: Array<{ id: T; label: ReactNode; icon?: LucideIcon }>;
  value: T;
  onChange: (value: T) => void;
  /** Unique per instance, for the sliding thumb. */
  layoutId: string;
  small?: boolean;
  className?: string;
}) {
  return (
    <div
      role="radiogroup"
      className={cn('relative inline-flex shrink-0 rounded-lg bg-[var(--app-subtle)] p-[3px]', small ? 'h-7' : 'h-8', className)}
    >
      {items.map((item) => {
        const selected = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(item.id)}
            className={cn(
              'relative flex items-center gap-1.5 whitespace-nowrap rounded-[5px] px-2.5 font-medium transition-colors',
              small ? 'text-xs' : 'px-3 text-[13px]',
              selected ? 'text-foreground' : 'text-[var(--app-fg2)] hover:text-foreground',
            )}
          >
            {selected && (
              <motion.span
                layoutId={layoutId}
                transition={{ type: 'spring', stiffness: 520, damping: 40 }}
                className="absolute inset-0 rounded-[5px] bg-[var(--app-surface)] shadow-sm"
              />
            )}
            {item.icon && <item.icon className="relative h-3.5 w-3.5" strokeWidth={1.75} />}
            <span className="relative">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function DemoSwitch({
  checked,
  onChange,
  small,
  neutral,
  disabled,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  small?: boolean;
  /** Apps page uses the grey switch; Settings uses the orange one. */
  neutral?: boolean;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      aria-disabled={disabled}
      onClick={() => {
        if (!disabled) onChange(!checked);
      }}
      className={cn(
        'relative inline-flex shrink-0 items-center rounded-full transition-colors duration-150',
        small ? 'h-4 w-[26px]' : 'h-[18px] w-[30px]',
        checked ? (neutral ? 'bg-[var(--app-fg2)]' : 'bg-[var(--app-action)]') : 'bg-[#888890] dark:bg-[#6f6f77]',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      <span
        className={cn(
          'absolute rounded-full shadow-sm transition-transform duration-150',
          small ? 'left-0.5 h-3 w-3' : 'left-0.5 h-3.5 w-3.5',
          checked && neutral ? 'bg-[var(--app-surface)]' : 'bg-white',
          checked ? (small ? 'translate-x-2.5' : 'translate-x-3') : 'translate-x-0',
        )}
      />
    </button>
  );
}

export function Checkbox({
  checked,
  indeterminate,
  onChange,
  label,
  className,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  className?: string;
}) {
  const on = checked || indeterminate;
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : checked}
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation();
        onChange(!checked);
      }}
      className={cn(
        'flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border-[1.5px] transition-colors',
        on
          ? 'border-[var(--app-action)] bg-[var(--app-action)] text-white'
          : 'border-[var(--app-border-strong)] bg-[var(--app-surface)] hover:border-[var(--app-fg3)]',
        className,
      )}
    >
      {indeterminate ? (
        <span className="h-[1.5px] w-2 rounded bg-white" />
      ) : (
        checked && <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
      )}
    </button>
  );
}

/**
 * A popover panel portalled to <body> and placed under its anchor, so it is not clipped by the
 * scrolling lists inside the window. It takes the demo's color tokens with it.
 */
export function Floating({
  anchor,
  open,
  onClose,
  align = 'end',
  className,
  children,
}: {
  anchor: RefObject<HTMLElement>;
  open: boolean;
  onClose: () => void;
  align?: 'start' | 'end';
  className?: string;
  children: ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number; up: boolean } | null>(null);

  useLayoutEffect(() => {
    if (!open || !anchor.current) return;
    const rect = anchor.current.getBoundingClientRect();
    const up = rect.bottom + 320 > window.innerHeight && rect.top > 320;
    setPos({ x: align === 'end' ? rect.right : rect.left, y: up ? rect.top - 4 : rect.bottom + 4, up });
  }, [open, anchor, align]);

  // A wide panel on a narrow screen: once it has a size, nudge it back inside an 8px margin.
  useLayoutEffect(() => {
    if (!pos || !panel.current) return;
    const rect = panel.current.getBoundingClientRect();
    const shift = rect.left < 8 ? 8 - rect.left : rect.right > window.innerWidth - 8 ? window.innerWidth - 8 - rect.right : 0;
    if (Math.round(shift) !== 0) setPos({ ...pos, x: pos.x + shift });
  }, [pos]);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (panel.current?.contains(target) || anchor.current?.contains(target)) return;
      onClose();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const onScroll = (event: Event) => {
      if (panel.current?.contains(event.target as Node)) return;
      onClose();
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onClose);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onClose);
    };
  }, [open, onClose, anchor]);

  if (!open || !pos) return null;

  return createPortal(
    // The outer div places the panel; framer-motion owns the inner one's transform for the scale-in.
    <div
      ref={panel}
      style={{
        left: pos.x,
        top: pos.y,
        transform: `translate(${align === 'end' ? '-100%' : '0'}, ${pos.up ? '-100%' : '0'})`,
      }}
      className="ccswitch-app-demo fixed z-[9998] text-foreground"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.12 }}
        style={{ transformOrigin: `${pos.up ? 'bottom' : 'top'} ${align === 'end' ? 'right' : 'left'}` }}
        className={cn(
          'rounded-[10px] border border-border bg-[var(--app-surface)] p-1 shadow-[0_4px_12px_rgba(16,24,40,.12),0_1px_3px_rgba(16,24,40,.08)]',
          className,
        )}
      >
        {children}
      </motion.div>
    </div>,
    document.body,
  );
}

export interface MenuItem {
  label: string;
  onSelect?: () => void;
  danger?: boolean;
  disabled?: boolean;
  /** A caption under the item (why it is disabled, a hint). */
  hint?: string;
  checked?: boolean;
  icon?: ReactNode;
  right?: ReactNode;
  separatorBefore?: boolean;
}

export function MenuList({ items, onDone }: { items: MenuItem[]; onDone: () => void }) {
  return (
    <div role="menu" className="flex flex-col">
      {items.map((item) => (
        <div key={item.label}>
          {item.separatorBefore && <div className="mx-1.5 my-1 h-px bg-border" />}
          <button
            type="button"
            role="menuitem"
            disabled={item.disabled}
            onClick={() => {
              item.onSelect?.();
              onDone();
            }}
            className={cn(
              'flex min-h-8 w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-start text-[13px]',
              item.disabled ? 'cursor-default text-[var(--app-fg3)]' : 'hover:bg-[var(--app-subtle)]',
              item.danger && !item.disabled && 'text-[var(--app-danger-text)]',
            )}
          >
            {item.icon}
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate">{item.label}</span>
              {item.hint && <span className="text-xs text-[var(--app-fg2)]">{item.hint}</span>}
            </span>
            {item.right}
            {item.checked !== undefined && (
              <Check className={cn('h-3.5 w-3.5 shrink-0', !item.checked && 'invisible')} strokeWidth={2} />
            )}
          </button>
        </div>
      ))}
    </div>
  );
}

/** The ⋯ button with its menu. */
export function MoreMenu({ label, items, large, width = 'w-[220px]' }: { label: string; items: MenuItem[]; large?: boolean; width?: string }) {
  const [open, setOpen] = useState(false);
  const anchor = useRef<HTMLSpanElement>(null);
  const { hide } = useHoverTip();
  return (
    <>
      <span ref={anchor} className="inline-flex" onClick={(event) => event.stopPropagation()}>
        <IconBtn
          icon={MoreHorizontal}
          label={label}
          large={large}
          active={open}
          onClick={() => {
            hide();
            setOpen((value) => !value);
          }}
        />
      </span>
      <Floating anchor={anchor} open={open} onClose={() => setOpen(false)} className={width}>
        <MenuList items={items} onDone={() => setOpen(false)} />
      </Floating>
    </>
  );
}

/** A button that opens a menu below it (the app's DropdownMenu triggers). */
export function MenuTrigger({
  trigger,
  items,
  align = 'start',
  width = 'w-[220px]',
}: {
  trigger: (open: boolean, toggle: () => void) => ReactNode;
  items: MenuItem[];
  align?: 'start' | 'end';
  width?: string;
}) {
  const [open, setOpen] = useState(false);
  const anchor = useRef<HTMLSpanElement>(null);
  return (
    <>
      <span ref={anchor} className="inline-flex">
        {trigger(open, () => setOpen((value) => !value))}
      </span>
      <Floating anchor={anchor} open={open} onClose={() => setOpen(false)} align={align} className={width}>
        <MenuList items={items} onDone={() => setOpen(false)} />
      </Floating>
    </>
  );
}

export function Notice({
  tone = 'neutral',
  icon: Icon,
  title,
  body,
  actions,
}: {
  tone?: 'neutral' | 'warning';
  icon: LucideIcon;
  title: string;
  body?: string;
  actions?: ReactNode;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-[10px] py-2.5 pe-3 ps-4',
        tone === 'warning' ? 'bg-[var(--app-warning-soft)]' : 'bg-[var(--app-subtle)]',
      )}
    >
      <Icon
        className={cn('h-4 w-4 shrink-0', tone === 'warning' ? 'text-[var(--app-warning-text)]' : 'text-[var(--app-fg2)]')}
        strokeWidth={1.75}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] text-foreground">{title}</p>
        {body && <p className="truncate text-xs text-[var(--app-fg2)]">{body}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-1">{actions}</div>}
    </div>
  );
}
