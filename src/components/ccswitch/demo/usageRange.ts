import type { Language } from '@/i18n/translations';
import { useLanguage } from '@/i18n/useLanguage';

/* Time ranges of the usage page (cc-switch src/lib/usageRange.ts + UsageDateRangePicker). */

export const RANGE_PRESETS = ['today', '1d', '7d', '14d', '30d', 'all'] as const;
export type RangePreset = (typeof RANGE_PRESETS)[number];

export type RangeSelection =
  | { preset: RangePreset }
  | { preset: 'custom'; start: Date; end: Date; liveEnd: boolean };

/** The demo's clock: the request log ends at 14:58 on this day. */
export const DEMO_NOW = new Date(2026, 9, 7, 14, 58);

const DAY_MS = 24 * 60 * 60 * 1000;

export const LOCALE: Record<Language, string> = { zh: 'zh-CN', en: 'en-US', ja: 'ja-JP' };

export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/** Start and end of a selection. "All" opens the calendar on the last 30 days, not 1970. */
export function resolveRange(selection: RangeSelection): { start: Date; end: Date } {
  if (selection.preset === 'custom') return { start: selection.start, end: selection.liveEnd ? DEMO_NOW : selection.end };
  const end = DEMO_NOW;
  switch (selection.preset) {
    case 'today':
      return { start: startOfDay(end), end };
    case '1d':
      return { start: new Date(end.getTime() - DAY_MS), end };
    case '7d':
    case '14d':
    case '30d':
      return { start: new Date(end.getTime() - parseInt(selection.preset, 10) * DAY_MS), end };
    case 'all':
      return { start: new Date(end.getTime() - 30 * DAY_MS), end };
  }
}

export interface Bucket {
  key: string;
  /** Axis label. */
  label: string;
  /** Tooltip heading. */
  heading: string;
  hourly: boolean;
  date: Date;
}

const pad = (value: number) => String(value).padStart(2, '0');

/** Hourly bars up to 24 hours, daily bars beyond (the app's trend chart does the same). */
export function rangeBuckets(selection: RangeSelection, language: Language): Bucket[] {
  const { start, end } = resolveRange(selection);
  const locale = LOCALE[language];
  const buckets: Bucket[] = [];
  if (end.getTime() - start.getTime() <= DAY_MS) {
    const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate(), start.getHours());
    while (cursor <= end) {
      const date = new Date(cursor);
      buckets.push({
        key: date.toISOString(),
        label: `${pad(date.getHours())}:00`,
        heading: date.toLocaleString(locale, { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        hourly: true,
        date,
      });
      cursor.setHours(cursor.getHours() + 1);
    }
    return buckets;
  }
  const cursor = startOfDay(start);
  // Cap a long custom range at about two months of bars.
  while (cursor <= end && buckets.length < 62) {
    const date = new Date(cursor);
    buckets.push({
      key: date.toISOString(),
      label: `${pad(date.getMonth() + 1)}/${pad(date.getDate())}`,
      heading: date.toLocaleDateString(locale, { year: 'numeric', month: '2-digit', day: '2-digit' }),
      hourly: false,
      date,
    });
    cursor.setDate(cursor.getDate() + 1);
  }
  return buckets;
}

/** 42 days of a month grid, starting on Sunday. */
export function calendarDays(month: Date): Date[] {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - first.getDay());
  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + index);
    return day;
  });
}

/** The trigger text: a preset's name, or the custom range spelled out. */
export function useRangeLabel(selection: RangeSelection) {
  const { t, language } = useLanguage();
  const u = t.demo.window.usage;
  if (selection.preset !== 'custom') return u.presets[selection.preset];
  const fmt = (date: Date) =>
    date.toLocaleString(LOCALE[language], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  return selection.liveEnd ? `${fmt(selection.start)} → ${u.liveEndNow}` : `${fmt(selection.start)} - ${fmt(selection.end)}`;
}
