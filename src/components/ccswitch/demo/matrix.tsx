import { useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n/useLanguage';
import { AppGlyph } from './AppGlyph';
import { fill, type DemoApp } from './apps';
import { useHoverTip } from './hoverTipContext';
import { Btn, Floating } from './parts';

/* The app-column matrix shared by MCP and Skills (cc-switch src/components/mcp/AppMatrix.tsx). */

export function MatrixCell({
  on,
  label,
  onToggle,
  onHover,
}: {
  on: boolean;
  label: string;
  onToggle: () => void;
  onHover: (hovering: boolean) => void;
}) {
  const { tip } = useHoverTip();
  const tipProps = tip(label);
  return (
    <div className="flex w-9 shrink-0 justify-center">
      <button
        type="button"
        role="checkbox"
        aria-checked={on}
        aria-label={label}
        onClick={(event) => {
          event.stopPropagation();
          onToggle();
        }}
        onMouseEnter={(event) => {
          onHover(true);
          tipProps.onMouseEnter(event);
        }}
        onMouseLeave={() => {
          onHover(false);
          tipProps.onMouseLeave();
        }}
        className="group/cell flex h-7 w-7 items-center justify-center rounded-md"
      >
        <span
          className={cn(
            'flex h-4 w-4 items-center justify-center rounded-[4px] border-[1.5px] transition-colors duration-150',
            on
              ? 'border-[var(--app-action)] bg-[var(--app-action)] text-white group-hover/cell:border-[var(--app-action-hover)] group-hover/cell:bg-[var(--app-action-hover)]'
              : 'border-[var(--app-border-strong)] bg-[var(--app-surface)] group-hover/cell:border-[var(--app-fg3)]',
          )}
        >
          <Check
            className={cn('h-3 w-3 transition-transform duration-100 ease-out', on ? 'scale-100' : 'scale-0')}
            strokeWidth={3}
          />
        </span>
      </button>
    </div>
  );
}

export function MatrixColumnHeader({
  app,
  on,
  total,
  noun,
  highlighted,
  onHover,
  onSetAll,
  scope,
  extraLink,
}: {
  app: DemoApp;
  on: number;
  total: number;
  noun: string;
  highlighted: boolean;
  onHover: (hovering: boolean) => void;
  onSetAll: (enabled: boolean) => void;
  /** Footer caption: which rows the bulk action touches. */
  scope: string;
  extraLink?: { label: string; onClick: () => void };
}) {
  const { t } = useLanguage();
  const m = t.demo.window.pages.matrix;
  const [open, setOpen] = useState(false);
  const [hovering, setHovering] = useState(false);
  const anchor = useRef<HTMLButtonElement>(null);
  const allOn = total > 0 && on === total;
  const active = highlighted || open;

  return (
    <div className="relative flex w-9 shrink-0 justify-center">
      <button
        ref={anchor}
        type="button"
        onClick={() => setOpen((value) => !value)}
        onMouseEnter={() => {
          setHovering(true);
          onHover(true);
        }}
        onMouseLeave={() => {
          setHovering(false);
          onHover(false);
        }}
        aria-label={`${app.label} · ${fill(m.popCount, { on, total, noun })}`}
        className={cn(
          'flex h-10 w-[34px] flex-col items-center justify-center gap-0.5 rounded-md text-[var(--app-fg2)] transition-colors',
          active && 'bg-[var(--app-selected)] text-foreground',
        )}
      >
        <AppGlyph app={app} size={16} badgeClassName={active ? 'border-[var(--app-selected)] bg-[var(--app-selected)]' : 'border-[var(--app-subtle)] bg-[var(--app-subtle)]'} />
        <span className={cn('text-[11px] tabular-nums leading-4', active ? 'font-semibold' : 'font-medium')}>{on}</span>
      </button>
      {hovering && !open && (
        <span className="pointer-events-none absolute top-full z-20 mt-0.5 whitespace-nowrap rounded-md bg-[var(--app-inverse)] px-2 py-0.5 text-xs font-medium text-[var(--app-inverse-fg)] shadow-sm">
          {app.label}
        </span>
      )}
      <Floating anchor={anchor} open={open} onClose={() => setOpen(false)} className="w-[260px] px-3.5 pb-3.5 pt-3">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <AppGlyph app={app} size={16} badgeClassName="border-[var(--app-surface)] bg-[var(--app-surface)]" />
            <span className="text-[13px] font-semibold">{app.label}</span>
          </div>
          <p className="text-xs text-[var(--app-fg2)]">{fill(m.popCount, { on, total, noun })}</p>
          <div className="flex gap-2">
            <Btn
              compact
              className={cn('flex-1', allOn && 'pointer-events-none opacity-45')}
              onClick={() => {
                onSetAll(true);
                setOpen(false);
              }}
            >
              {allOn ? m.enableAll : fill(m.enableRest, { count: total - on })}
            </Btn>
            <Btn
              compact
              className={cn('flex-1', on === 0 && 'pointer-events-none opacity-45')}
              onClick={() => {
                onSetAll(false);
                setOpen(false);
              }}
            >
              {m.disableAll}
            </Btn>
          </div>
          {extraLink && (
            <button
              type="button"
              onClick={() => {
                extraLink.onClick();
                setOpen(false);
              }}
              className="self-start text-xs text-foreground underline decoration-[var(--app-border-strong)] underline-offset-[3px]"
            >
              {extraLink.label}
            </button>
          )}
          <p className="text-xs text-[var(--app-fg3)]">{scope}</p>
        </div>
      </Floating>
    </div>
  );
}
