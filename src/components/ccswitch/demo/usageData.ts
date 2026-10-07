import type { AppId } from './apps';
import { rangeBuckets, type Bucket } from './usageRange';

/* Sample usage behind the usage page and the sidebar's "today" figure, so the two agree. */

// Fixed pseudo-random numbers so the heatmap looks the same on every render and in SSR.
export function seeded(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export interface Totals {
  cost: number;
  requests: number;
  tokens: number;
  /** Cache hit rate, percent. */
  hit: number;
}

/** All-time figures per app; shorter ranges are drawn from these. */
export const APP_TOTALS: Partial<Record<AppId, Totals>> = {
  claude: { cost: 16821.04, requests: 142060, tokens: 20.1e9, hit: 96.2 },
  codex: { cost: 8023.69, requests: 91140, tokens: 9.7e9, hit: 93.1 },
  gemini: { cost: 962.47, requests: 18400, tokens: 1.1e9, hit: 88.4 },
  grokbuild: { cost: 840.63, requests: 12620, tokens: 0.9e9, hit: 90.7 },
  opencode: { cost: 411.82, requests: 6880, tokens: 0.5e9, hit: 91.5 },
  hermes: { cost: 124.05, requests: 2140, tokens: 0.1e9, hit: 86.0 },
  pi: { cost: 93.14, requests: 1460, tokens: 0.1e9, hit: 84.9 },
  mcode: { cost: 37.69, requests: 680, tokens: 36e6, hit: 82.3 },
};
export const SERIES_APPS = Object.keys(APP_TOTALS) as AppId[];

// Busy working hours, quiet nights.
const HOUR_WEIGHT = [0.1, 0.05, 0.03, 0.02, 0.02, 0.03, 0.1, 0.3, 0.7, 1, 1, 0.95, 0.6, 0.85, 1, 0.95, 0.9, 0.8, 0.55, 0.4, 0.45, 0.5, 0.35, 0.2];
const HOUR_SUM = HOUR_WEIGHT.reduce((sum, value) => sum + value, 0);
const DAY_MS = 24 * 60 * 60 * 1000;
/** Recent days run above the all-time daily average: usage has grown over the year. */
const RECENT_DAILY_SHARE = 1.6 / 365;

export function bucketUsage(app: AppId, bucket: Bucket): Totals {
  const base = APP_TOTALS[app]!;
  const appSeed = SERIES_APPS.indexOf(app) * 101;
  const day = Math.floor(bucket.date.getTime() / DAY_MS);
  const weekend = bucket.date.getDay() === 0 || bucket.date.getDay() === 6 ? 0.55 : 1;
  let share = RECENT_DAILY_SHARE * weekend * (0.55 + seeded(day * 13 + appSeed) * 0.9);
  if (bucket.hourly) {
    const hour = bucket.date.getHours();
    share *= (HOUR_WEIGHT[hour] / HOUR_SUM) * (0.6 + seeded(day * 29 + hour * 7 + appSeed) * 0.8);
  }
  return {
    tokens: base.tokens * share,
    requests: base.requests * share * (0.85 + seeded(day * 31 + appSeed + 5) * 0.3),
    cost: base.cost * share * (0.85 + seeded(day * 37 + appSeed + 9) * 0.3),
    hit: base.hit,
  };
}

export function sumTotals(items: Totals[], weightedHit: boolean): Totals {
  const sum = items.reduce(
    (acc, item) => ({
      cost: acc.cost + item.cost,
      requests: acc.requests + item.requests,
      tokens: acc.tokens + item.tokens,
      hit: acc.hit + (weightedHit ? item.hit * item.tokens : 0),
    }),
    { cost: 0, requests: 0, tokens: 0, hit: 0 },
  );
  return { ...sum, hit: sum.tokens > 0 ? sum.hit / sum.tokens : 0 };
}

/** cc-switch formatTokensCompact: plain digits under 10,000, then K / M / B to three figures. */
export function compact(value: number, locale: string) {
  if (Math.abs(value) < 10_000) return new Intl.NumberFormat(locale).format(Math.round(value));
  for (const [size, suffix] of [
    [1e9, 'B'],
    [1e6, 'M'],
    [1e3, 'K'],
  ] as const) {
    if (Math.abs(value) >= size) return `${Number((value / size).toPrecision(3))}${suffix}`;
  }
  return String(value);
}

export const usd = (value: number, digits = 2) =>
  `$${value.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;

/** A round axis top: 1, 2 or 5 times a power of ten. */
export function niceMax(value: number) {
  if (value <= 0) return 1;
  const power = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 5, 10].find((factor) => factor * power >= value)!;
  return step * power;
}

/** Today's spend across every app, for the sidebar's usage entry. */
export function todayCost() {
  const buckets = rangeBuckets({ preset: 'today' }, 'en');
  return buckets.reduce((sum, bucket) => sum + SERIES_APPS.reduce((acc, app) => acc + bucketUsage(app, bucket).cost, 0), 0);
}
