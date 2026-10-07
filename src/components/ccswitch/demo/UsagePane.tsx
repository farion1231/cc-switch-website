import { useMemo, useState } from 'react';
import { BarChart3, ChevronDown, CircleHelp, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n/useLanguage';
import { AppGlyph } from './AppGlyph';
import { demoAppById, demoApps, fill, type AppId } from './apps';
import { useHoverTip } from './hoverTipContext';
import { UsageRangePicker } from './UsageRangePicker';
import { APP_TOTALS, SERIES_APPS, bucketUsage, compact, niceMax, seeded, sumTotals, usd } from './usageData';
import { LOCALE, rangeBuckets, useRangeLabel, type Bucket, type RangeSelection } from './usageRange';

type Metric = 'tokens' | 'requests' | 'cost';
type Filter = 'all' | AppId;

const WEEKS = 53;
const HEAT = ['bg-[var(--app-subtle)]', 'bg-sky-200', 'bg-sky-400', 'bg-sky-600', 'bg-sky-800'];
const HEAT_DARK = ['', 'dark:bg-sky-950', 'dark:bg-sky-800', 'dark:bg-sky-600', 'dark:bg-sky-400'];

interface LogRow {
  time: string;
  app: AppId;
  provider: string;
  model: string;
  input: number;
  output: number;
  cacheRead: string;
  cost: string;
  speed: string;
}

const LOGS: LogRow[] = [
  { time: '14:58:06', app: 'claude', provider: 'Kimi For Coding', model: 'kimi-k3', input: 54, output: 424, cacheRead: '143K', cost: '$0.0240', speed: '≈49' },
  { time: '14:57:54', app: 'codex', provider: 'OpenAI Official', model: 'gpt-5.6-sol', input: 812, output: 1184, cacheRead: '86K', cost: '$0.0950', speed: '87' },
  { time: '14:57:40', app: 'claude', provider: 'Claude Official', model: 'claude-opus-5-5', input: 55, output: 101, cacheRead: '342K', cost: '$0.0707', speed: '—' },
  { time: '14:54:11', app: 'codex', provider: 'PackyCode', model: 'deepseek-v4-pro', input: 268, output: 605, cacheRead: '64K', cost: '$0.0054', speed: '53' },
  { time: '14:53:31', app: 'grokbuild', provider: 'Grok Official', model: 'grok-4.5', input: 92, output: 323, cacheRead: '51K', cost: '$0.0107', speed: '48' },
  { time: '14:53:14', app: 'gemini', provider: 'Google Official', model: 'gemini-3.6-flash', input: 1460, output: 904, cacheRead: '38K', cost: '$0.0312', speed: '80' },
  { time: '14:52:47', app: 'claude', provider: 'Claude Official', model: 'claude-sonnet-5-5', input: 61, output: 2210, cacheRead: '201K', cost: '$0.0566', speed: '≈92' },
  { time: '14:51:09', app: 'opencode', provider: 'Kimi For Coding', model: 'kimi-k3', input: 340, output: 512, cacheRead: '72K', cost: '$0.0081', speed: '61' },
];

export function UsagePane() {
  const { t, language } = useLanguage();
  const { tip } = useHoverTip();
  const u = t.demo.window.usage;
  const locale = LOCALE[language];
  const [metric, setMetric] = useState<Metric>('tokens');
  const [filter, setFilter] = useState<Filter>('all');
  // Opens on "All" (the app opens on today): the year-long heatmap shows off the page best.
  const [range, setRange] = useState<RangeSelection>({ preset: 'all' });
  const rangeLabel = useRangeLabel(range);
  const [tab, setTab] = useState<keyof typeof u.tabs>('logs');
  const filterApps = demoApps.filter((app) => app.id !== 'claude-desktop' && app.id !== 'openclaw');

  const levels = useMemo(() => {
    const seedBase = metric === 'tokens' ? 1 : metric === 'requests' ? 2 : 3;
    const appBase = filter === 'all' ? 0 : demoApps.findIndex((app) => app.id === filter) + 1;
    return Array.from({ length: WEEKS * 7 }, (_, index) => {
      const week = Math.floor(index / 7);
      // Usage ramps up over the year, with quieter weekends.
      const trend = 0.25 + (week / WEEKS) * 0.75;
      const weekend = index % 7 >= 5 ? 0.6 : 1;
      const noise = seeded(index + seedBase * 1000 + appBase * 77);
      const value = trend * weekend * (0.35 + noise * 0.9);
      return value < 0.18 ? 0 : value < 0.38 ? 1 : value < 0.58 ? 2 : value < 0.8 ? 3 : 4;
    });
  }, [metric, filter]);

  const monthLabels = useMemo(() => {
    // The demo's year ends in October; one label every 4–5 weeks.
    const labels: Array<{ week: number; text: string }> = [];
    for (let month = 0; month < 12; month++) {
      const week = Math.round((month * WEEKS) / 12) + 2;
      if (week < WEEKS - 1) labels.push({ week, text: u.months[(month + 9) % 12] });
    }
    return labels;
  }, [u.months]);

  const apps = useMemo(() => (filter === 'all' ? SERIES_APPS : SERIES_APPS.filter((app) => app === filter)), [filter]);
  const buckets = useMemo(() => (range.preset === 'all' ? [] : rangeBuckets(range, language)), [range, language]);
  // Per-bar usage summed over the filtered apps; "all" reads the all-time figures directly.
  const series = useMemo(
    () => buckets.map((bucket) => sumTotals(apps.map((app) => bucketUsage(app, bucket)), true)),
    [buckets, apps],
  );
  const totals =
    range.preset === 'all'
      ? sumTotals(apps.map((app) => APP_TOTALS[app]!), true)
      : sumTotals(series, true);
  const rows = filter === 'all' ? LOGS : LOGS.filter((row) => row.app === filter);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4 sm:px-6">
        <BarChart3 className="h-5 w-5 text-foreground" strokeWidth={1.75} />
        <h3 className="truncate text-lg font-semibold text-foreground">{u.title}</h3>
        <span className="flex-1" />
        <span className="hidden text-[13px] text-muted-foreground lg:inline">{u.synced}</span>
        <button
          type="button"
          className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 text-sm font-medium text-foreground hover:bg-[var(--app-subtle)]"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{u.syncNow}</span>
        </button>
      </header>

      <div className="flex min-h-12 shrink-0 flex-wrap items-center gap-1.5 px-4 py-2 sm:px-6">
        <div className="inline-flex min-w-0 max-w-full items-center gap-0.5 overflow-x-auto rounded-[10px] bg-[var(--app-subtle)] p-[3px]">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={cn(
              'h-[30px] shrink-0 rounded-[7px] px-3 text-sm font-medium',
              filter === 'all' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {u.all}
          </button>
          {filterApps.map((app) => (
            <button
              key={app.id}
              type="button"
              onClick={() => setFilter(app.id)}
              {...tip(app.label)}
              aria-label={app.label}
              className={cn(
                'flex h-[30px] w-9 shrink-0 items-center justify-center rounded-[7px]',
                filter === app.id ? 'bg-background shadow-sm' : 'opacity-70 hover:opacity-100',
              )}
            >
              <AppGlyph
                app={demoAppById[app.id]}
                size={16}
                badgeClassName={filter === app.id ? 'border-background bg-background' : 'border-[var(--app-subtle)] bg-[var(--app-subtle)]'}
              />
            </button>
          ))}
        </div>

        <span className="min-w-2 flex-1" />
        <UsageRangePicker value={range} onChange={setRange} />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 pt-1 sm:px-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: u.totalCost, value: usd(totals.cost) },
            { label: u.totalRequests, value: new Intl.NumberFormat(locale).format(Math.round(totals.requests)) },
            { label: u.realTokens, value: compact(totals.tokens, locale) },
            { label: u.cacheHitRate, value: totals.tokens > 0 ? `${totals.hit.toFixed(1)}%` : '—' },
          ].map((card) => (
            <div key={card.label} className="rounded-xl border border-border bg-card px-4 py-3">
              <div className="truncate text-[13px] text-muted-foreground">{card.label}</div>
              <div className="mt-1 text-xl font-bold tabular-nums text-foreground sm:text-2xl">{card.value}</div>
            </div>
          ))}
        </div>

        {/* "All" shows the long-run heatmap; shorter ranges get the bar chart, as in the app. */}
        {range.preset !== 'all' ? (
          <TrendChart
            title={fill(u.trendTitle, { range: rangeLabel })}
            buckets={buckets}
            values={series.map((item) => item[metric])}
            metric={metric}
            onMetric={setMetric}
          />
        ) : (
          <div className="mt-4 rounded-xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-foreground">{u.heatmapTitle}</div>
                <div className="text-xs text-muted-foreground">{u.heatmapSubtitle}</div>
              </div>
              <MetricToggle value={metric} onChange={setMetric} />
            </div>

            <div className="mt-3 overflow-x-auto">
              <div className="min-w-[620px]">
                <div className="relative ml-7 h-4 text-[10px] text-muted-foreground">
                  {monthLabels.map((label) => (
                    <span key={label.week} className="absolute" style={{ left: `${(label.week / WEEKS) * 100}%` }}>
                      {label.text}
                    </span>
                  ))}
                </div>
                <div className="flex gap-1">
                  <div className="grid w-6 shrink-0 grid-rows-7 gap-[3px] text-[10px] leading-[9px] text-muted-foreground">
                    {u.weekdays.map((day, index) => (
                      <span key={index}>{day}</span>
                    ))}
                  </div>
                  <div className="grid flex-1 grid-flow-col grid-rows-7 gap-[3px]">
                    {levels.map((level, index) => (
                      <span key={index} className={cn('aspect-square rounded-[2px]', HEAT[level], HEAT_DARK[level])} />
                    ))}
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
                  {u.less}
                  {HEAT.map((cls, index) => (
                    <span key={cls} className={cn('h-2.5 w-2.5 rounded-[2px]', cls, HEAT_DARK[index])} />
                  ))}
                  {u.more}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-5 flex gap-5 border-b border-border text-sm">
          {(Object.keys(u.tabs) as Array<keyof typeof u.tabs>).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={cn(
                '-mb-px border-b-2 pb-2 font-medium transition-colors',
                tab === key ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              {u.tabs[key]}
            </button>
          ))}
          <span className="flex-1" />
          <ChevronDown className="mb-2 h-4 w-4 self-end text-muted-foreground" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[13px]">
            <thead className="text-muted-foreground">
              <tr className="border-b border-border">
                <th className="py-2 pr-3 font-normal">{u.columns.time}</th>
                <th className="py-2 pr-3 font-normal">{u.columns.app}</th>
                <th className="py-2 pr-3 font-normal">{u.columns.provider}</th>
                <th className="py-2 pr-3 font-normal">{u.columns.model}</th>
                <th className="py-2 pr-3 text-right font-normal">{u.columns.input}</th>
                <th className="py-2 pr-3 text-right font-normal">{u.columns.output}</th>
                <th className="py-2 pr-3 text-right font-normal">{u.columns.cacheRead}</th>
                <th className="py-2 pr-3 text-right font-normal">{u.columns.cost}</th>
                <th className="py-2 text-right font-normal">
                  <span className="inline-flex items-center gap-1">
                    {u.columns.speed}
                    <CircleHelp className="h-3 w-3" />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="tabular-nums text-foreground">
              {rows.map((row) => (
                <tr key={row.time} className="border-b border-border/70">
                  <td className="py-2 pr-3">{row.time}</td>
                  <td className="py-2 pr-3">
                    <span className="inline-flex items-center gap-1.5">
                      <AppGlyph app={demoAppById[row.app]} size={14} badgeClassName="border-background bg-background" />
                      <span className="whitespace-nowrap">{demoAppById[row.app].label}</span>
                    </span>
                  </td>
                  <td className="whitespace-nowrap py-2 pr-3">{row.provider}</td>
                  <td className="whitespace-nowrap py-2 pr-3 font-mono text-xs">{row.model}</td>
                  <td className="py-2 pr-3 text-right">{row.input.toLocaleString('en-US')}</td>
                  <td className="py-2 pr-3 text-right">{row.output.toLocaleString('en-US')}</td>
                  <td className="py-2 pr-3 text-right">{row.cacheRead}</td>
                  <td className="py-2 pr-3 text-right">{row.cost}</td>
                  <td className="whitespace-nowrap py-2 text-right">
                    {row.speed === '—' ? '—' : (
                      <>
                        {row.speed}
                        <span className="ml-0.5 text-[11px] text-muted-foreground">tok/s</span>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricToggle({ value, onChange }: { value: Metric; onChange: (metric: Metric) => void }) {
  const { t } = useLanguage();
  const u = t.demo.window.usage;
  return (
    <div className="inline-flex shrink-0 rounded-lg bg-[var(--app-subtle)] p-[3px]">
      {(['tokens', 'requests', 'cost'] as Metric[]).map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={cn(
            'h-7 rounded-md px-2.5 text-xs font-medium',
            value === key ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {u.metrics[key]}
        </button>
      ))}
    </div>
  );
}

/** cc-switch UsageTrendChart: one bar per hour (up to a day) or per day, three gridlines. */
function TrendChart({
  title,
  buckets,
  values,
  metric,
  onMetric,
}: {
  title: string;
  buckets: Bucket[];
  values: number[];
  metric: Metric;
  onMetric: (metric: Metric) => void;
}) {
  const { t, language } = useLanguage();
  const { tip } = useHoverTip();
  const u = t.demo.window.usage;
  const locale = LOCALE[language];
  const top = niceMax(Math.max(0, ...values));
  const legend = metric === 'requests' ? u.requestsLegend : u.metrics[metric];
  const format = (value: number) =>
    metric === 'cost' ? usd(value, 4) : new Intl.NumberFormat(locale).format(Math.round(value));
  const tick = (value: number) => (metric === 'cost' ? `$${compact(value, 'en-US')}` : compact(value, locale));
  // Thin the axis to about eight labels.
  const every = Math.max(1, Math.ceil(buckets.length / 8));

  return (
    <div className="mt-4 rounded-xl border border-border bg-card px-4 py-2.5">
      <div className="flex min-h-7 flex-wrap items-center gap-x-3.5 gap-y-1">
        <span className="whitespace-nowrap text-xs font-semibold text-[var(--app-fg2)]">{title}</span>
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs text-[var(--app-fg2)]">
          <span className="h-2.5 w-2.5 rounded-[2px] bg-[var(--app-chart)]" />
          {legend}
        </span>
        <span className="flex-1" />
        <MetricToggle value={metric} onChange={onMetric} />
      </div>

      <div className="mt-1 flex h-[132px] gap-1.5 pt-1.5">
        <div className="relative w-10 shrink-0 text-end text-[10px] tabular-nums text-[var(--app-fg3)]">
          {[1, 0.5, 0].map((ratio) => (
            <span key={ratio} className="absolute end-0 -translate-y-1/2" style={{ top: `${(1 - ratio) * 100}%` }}>
              {tick(top * ratio)}
            </span>
          ))}
        </div>
        <div className="relative min-w-0 flex-1">
          {[0, 50, 100].map((top) => (
            <span key={top} className="absolute inset-x-0 h-px bg-[var(--app-chart-grid)]" style={{ top: `${top}%` }} />
          ))}
          <div className="absolute inset-0 flex items-end gap-[3px]">
            {buckets.map((bucket, index) => (
              <div
                key={bucket.key}
                {...tip(`${legend}  ${format(values[index])}`, bucket.heading)}
                className="flex h-full min-w-0 flex-1 items-end justify-center rounded-t-[3px] hover:bg-[var(--app-subtle)]"
              >
                <span
                  className="w-full max-w-[36px] rounded-t-[3px] bg-[var(--app-chart)] transition-[height] duration-300"
                  style={{ height: `${(values[index] / top) * 100}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="ms-[46px] mt-1.5 flex gap-[3px] text-[10px] tabular-nums text-[var(--app-fg3)]">
        {buckets.map((bucket, index) => (
          <span key={bucket.key} className="min-w-0 flex-1 overflow-visible whitespace-nowrap text-center">
            {index % every === 0 ? bucket.label : ''}
          </span>
        ))}
      </div>
    </div>
  );
}
