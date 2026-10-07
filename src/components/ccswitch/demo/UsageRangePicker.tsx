import { useMemo, useRef, useState } from 'react';
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n/useLanguage';
import { Btn, Checkbox, Floating } from './parts';
import {
  DEMO_NOW,
  LOCALE,
  RANGE_PRESETS,
  calendarDays,
  isSameDay,
  resolveRange,
  startOfDay,
  useRangeLabel,
  type RangeSelection,
} from './usageRange';

type Field = 'start' | 'end';

const pad = (value: number) => String(value).padStart(2, '0');
const fmtDate = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const fmtTime = (date: Date) => `${pad(date.getHours())}:${pad(date.getMinutes())}`;
const withDay = (time: Date, day: Date) =>
  new Date(day.getFullYear(), day.getMonth(), day.getDate(), time.getHours(), time.getMinutes());

/** Preset shortcuts over a start / end editor and a month calendar (cc-switch UsageDateRangePicker). */
export function UsageRangePicker({ value, onChange }: { value: RangeSelection; onChange: (value: RangeSelection) => void }) {
  const { t, language } = useLanguage();
  const u = t.demo.window.usage;
  const label = useRangeLabel(value);
  const anchor = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [draftStart, setDraftStart] = useState(DEMO_NOW);
  const [draftEnd, setDraftEnd] = useState(DEMO_NOW);
  const [liveEnd, setLiveEnd] = useState(false);
  const [field, setField] = useState<Field>('start');
  const [month, setMonth] = useState(() => new Date(DEMO_NOW.getFullYear(), DEMO_NOW.getMonth(), 1));
  const locale = LOCALE[language];

  const weekdays = useMemo(() => {
    const sunday = new Date(2026, 9, 4);
    return Array.from({ length: 7 }, (_, index) =>
      new Date(sunday.getFullYear(), sunday.getMonth(), sunday.getDate() + index).toLocaleDateString(locale, { weekday: 'narrow' }),
    );
  }, [locale]);

  const toggle = () => {
    if (!open) {
      // Each opening starts the draft from what is applied now.
      const { start, end } = resolveRange(value);
      setDraftStart(start);
      setDraftEnd(end);
      setLiveEnd(value.preset === 'custom' && value.liveEnd);
      setField('start');
      setMonth(new Date(start.getFullYear(), start.getMonth(), 1));
    }
    setOpen(!open);
  };

  const pick = (day: Date) => {
    if (liveEnd || field === 'start') {
      const next = withDay(draftStart, day);
      setDraftStart(next);
      if (!liveEnd) {
        if (next > draftEnd) setDraftEnd(withDay(draftEnd, day));
        setField('end');
      }
    } else {
      const next = withDay(draftEnd, day);
      // An end before the start starts the range over.
      if (next < draftStart) {
        setDraftStart(withDay(draftStart, day));
      } else {
        setDraftEnd(next);
      }
    }
    if (day.getMonth() !== month.getMonth()) setMonth(new Date(day.getFullYear(), day.getMonth(), 1));
  };

  const fieldCard = (which: Field) => {
    const disabled = which === 'end' && liveEnd;
    const date = which === 'start' ? draftStart : liveEnd ? DEMO_NOW : draftEnd;
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={() => setField(which)}
        className={cn(
          'w-full rounded-[10px] border px-3 py-2 text-start transition-colors',
          disabled
            ? 'cursor-not-allowed border-border bg-[var(--app-subtle)] opacity-50'
            : field === which
              ? 'border-[var(--app-action)] bg-[var(--app-surface)] ring-1 ring-[var(--app-action)]'
              : 'border-border',
        )}
      >
        <span className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-[var(--app-fg2)]">
          {which === 'start' ? u.startTime : u.endTime}
        </span>
        <span className="flex items-center gap-3 text-[13px] tabular-nums text-foreground">
          <span className="flex-1">{fmtDate(date)}</span>
          <span>{fmtTime(date)}</span>
        </span>
      </button>
    );
  };

  const rangeStart = startOfDay(draftStart);
  const rangeEnd = startOfDay(liveEnd ? DEMO_NOW : draftEnd);

  return (
    <>
      <button
        ref={anchor}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        title={`${u.timeRange}: ${label}`}
        className={cn(
          'inline-flex h-8 max-w-[220px] shrink-0 items-center gap-1 rounded-md border border-[var(--app-border-strong)] bg-[var(--app-surface)] pe-2 ps-3 text-[13px] font-medium text-foreground transition-colors hover:bg-[var(--app-subtle)]',
          open && 'bg-[var(--app-subtle)]',
        )}
      >
        {value.preset === 'custom' && <CalendarDays className="h-3.5 w-3.5 shrink-0 text-[var(--app-fg2)]" />}
        <span className="min-w-0 truncate">{label}</span>
        <ChevronDown className={cn('h-3.5 w-3.5 shrink-0 text-[var(--app-fg2)] transition-transform', open && 'rotate-180')} />
      </button>

      <Floating anchor={anchor} open={open} onClose={() => setOpen(false)} className="w-[560px] max-w-[calc(100vw-2rem)] p-3">
        <div className="flex flex-wrap gap-1.5 border-b border-border pb-2">
          {RANGE_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              aria-pressed={value.preset === preset}
              onClick={() => {
                onChange({ preset });
                setOpen(false);
              }}
              className={cn(
                'h-7 rounded-md border px-2.5 text-[13px] transition-colors',
                value.preset === preset
                  ? 'border-foreground bg-[var(--app-selected)] font-semibold text-foreground'
                  : 'border-[var(--app-border-strong)] bg-[var(--app-surface)] font-medium text-foreground hover:bg-[var(--app-subtle)]',
              )}
            >
              {u.presets[preset]}
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-col gap-2 sm:w-[220px] sm:shrink-0">
            <p className="text-xs text-[var(--app-fg2)]">{u.customRangeHint}</p>
            {fieldCard('start')}
            {fieldCard('end')}
            <label className="flex cursor-pointer select-none items-center gap-2">
              <Checkbox
                checked={liveEnd}
                label={u.liveEndTime}
                onChange={(checked) => {
                  setLiveEnd(checked);
                  if (checked) setField('start');
                }}
              />
              <span className="text-xs text-[var(--app-fg2)]">{u.liveEndTime}</span>
            </label>
            <div className="flex gap-2 pt-1">
              <Btn variant="quiet" compact className="flex-1" onClick={() => setOpen(false)}>
                {u.cancel}
              </Btn>
              <Btn
                variant="solid"
                compact
                className="flex-1"
                onClick={() => {
                  onChange({ preset: 'custom', start: draftStart, end: liveEnd ? DEMO_NOW : draftEnd, liveEnd });
                  setOpen(false);
                }}
              >
                {u.confirm}
              </Btn>
            </div>
          </div>

          <div className="min-w-0 flex-1 rounded-[10px] border border-border bg-[var(--app-subtle)] p-2.5">
            <div className="mb-1.5 flex items-center justify-between">
              <button
                type="button"
                aria-label={u.prevMonth}
                onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
                className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--app-fg2)] hover:bg-[var(--app-surface)]"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setMonth(new Date(DEMO_NOW.getFullYear(), DEMO_NOW.getMonth(), 1))}
                className="text-[13px] font-medium text-foreground hover:text-[var(--app-fg2)]"
              >
                {month.toLocaleDateString(locale, { year: 'numeric', month: 'long' })}
              </button>
              <button
                type="button"
                aria-label={u.nextMonth}
                onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
                className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--app-fg2)] hover:bg-[var(--app-surface)]"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="mb-0.5 grid grid-cols-7 text-center text-[11px] text-[var(--app-fg2)]">
              {weekdays.map((day, index) => (
                <span key={index} className="py-0.5">
                  {day}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-px">
              {calendarDays(month).map((day) => {
                const inMonth = day.getMonth() === month.getMonth();
                const endpoint = isSameDay(day, rangeStart) || isSameDay(day, rangeEnd);
                const inRange = day >= rangeStart && day <= rangeEnd;
                const today = isSameDay(day, DEMO_NOW);
                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    aria-label={day.toLocaleDateString(locale)}
                    aria-pressed={endpoint}
                    onClick={() => pick(day)}
                    className={cn(
                      'h-7 rounded text-xs tabular-nums transition-colors',
                      !inMonth && 'text-[var(--app-fg3)]',
                      inMonth && !inRange && 'text-foreground hover:bg-[var(--app-surface)]',
                      inRange && !endpoint && 'bg-[var(--app-selected)] text-foreground',
                      endpoint && 'bg-[var(--app-action)] font-medium text-white',
                      today && !endpoint && 'ring-1 ring-[var(--app-border-strong)]',
                    )}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Floating>
    </>
  );
}
