import { useEffect, useMemo, useRef, useState } from 'react';
import { ChartColumn, ChevronDown, Columns3, ListFilter, ListTree, RefreshCw, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n/useLanguage';
import { AppGlyph } from './AppGlyph';
import { demoAppById, demoApps, fill, type AppId } from './apps';
import { useHoverTip } from './hoverTipContext';
import { HelpTip, IconBtn, PaneHeader } from './parts';
import { useShell } from './shellContext';
import { UsageRangePicker } from './UsageRangePicker';
import { APP_TOTALS, SERIES_APPS, bucketUsage, compact, niceMax, seeded, sumTotals, tokenParts, usd, type Totals } from './usageData';
import { LOCALE, rangeBuckets, type Bucket, type RangeSelection } from './usageRange';

/** The metric strip doubles as the chart's metric picker (cc-switch UsageHero). */
type Metric = 'cost' | 'requests' | 'tokens' | 'hitRate';
type Filter = 'all' | AppId;
type Tab = 'logs' | 'providers' | 'models';

const WEEKS = 53;
const HEAT = ['bg-[var(--app-subtle)]', 'bg-sky-200', 'bg-sky-400', 'bg-sky-600', 'bg-sky-800'];
const HEAT_DARK = ['', 'dark:bg-sky-950', 'dark:bg-sky-800', 'dark:bg-sky-600', 'dark:bg-sky-400'];

/** cc-switch usageTable: every column left-aligned, groups set apart by a wider gap instead of lines. */
const TABLE = {
  headRow: 'h-9 bg-[var(--app-subtle)] text-xs text-[var(--app-fg2)] [&>th]:border-b [&>th]:border-border',
  th: 'whitespace-nowrap px-3 text-start font-medium first:ps-4 last:pe-4',
  row: 'h-10 [&:not(:last-child)>td]:border-b [&>td]:border-border',
  td: 'whitespace-nowrap px-3 first:ps-4 last:pe-4',
  groupGap: 'ps-7',
  // The request log has more columns, so it sits one step tighter.
  dense: 'px-2 first:ps-4 last:pe-4',
  denseGroupGap: 'ps-6',
};

interface LogRow {
  time: string;
  app: AppId;
  provider: string;
  model: string;
  cost: string;
  input: number;
  output: number;
  cacheRead: string;
  speed: string;
  firstToken: string;
}

const LOGS: LogRow[] = [
  { time: '14:58:06', app: 'claude', provider: 'Kimi For Coding', model: 'kimi-k3', cost: '$0.0240', input: 54, output: 424, cacheRead: '143K', speed: '≈49', firstToken: '≈2.4s' },
  { time: '14:57:54', app: 'codex', provider: 'OpenAI Official', model: 'gpt-5.6-sol', cost: '$0.0950', input: 812, output: 1184, cacheRead: '86K', speed: '87', firstToken: '1.1s' },
  { time: '14:57:40', app: 'claude', provider: 'Claude Official', model: 'claude-opus-5-5', cost: '$0.0707', input: 55, output: 101, cacheRead: '342K', speed: '—', firstToken: '—' },
  { time: '14:54:11', app: 'codex', provider: 'PackyCode', model: 'deepseek-v4-pro', cost: '$0.0054', input: 268, output: 605, cacheRead: '64K', speed: '53', firstToken: '1.6s' },
  { time: '14:53:31', app: 'grokbuild', provider: 'Grok Official', model: 'grok-4.5', cost: '$0.0107', input: 92, output: 323, cacheRead: '51K', speed: '48', firstToken: '0.9s' },
  { time: '14:53:14', app: 'gemini', provider: 'Google Official', model: 'gemini-3.6-flash', cost: '$0.0312', input: 1460, output: 904, cacheRead: '38K', speed: '80', firstToken: '0.7s' },
  { time: '14:52:47', app: 'claude', provider: 'Claude Official', model: 'claude-sonnet-5-5', cost: '$0.0566', input: 61, output: 2210, cacheRead: '201K', speed: '≈92', firstToken: '≈1.8s' },
  { time: '14:51:09', app: 'opencode', provider: 'Kimi For Coding', model: 'kimi-k3', cost: '$0.0081', input: 340, output: 512, cacheRead: '72K', speed: '61', firstToken: '1.3s' },
  { time: '14:49:30', app: 'kimi', provider: 'Kimi Official', model: 'kimi-k3', cost: '$0.0035', input: 210, output: 388, cacheRead: '40K', speed: '≈58', firstToken: '≈1.5s' },
  { time: '14:47:02', app: 'agy', provider: 'Antigravity', model: 'gemini-3.6-pro', cost: '$0.0412', input: 980, output: 1320, cacheRead: '57K', speed: '≈71', firstToken: '≈2.0s' },
];

/** How each app's usage splits across providers and models, for the two stats tabs. */
const SPLITS: Record<'providers' | 'models', Array<{ name: string; app: AppId; share: number }>> = {
  providers: [
    { name: 'Claude Official', app: 'claude', share: 0.62 },
    { name: 'Kimi For Coding', app: 'claude', share: 0.38 },
    { name: 'OpenAI Official', app: 'codex', share: 0.8 },
    { name: 'PackyCode', app: 'codex', share: 0.2 },
    { name: 'Google Official', app: 'gemini', share: 1 },
    { name: 'Grok Official', app: 'grokbuild', share: 1 },
    { name: 'Kimi For Coding', app: 'opencode', share: 1 },
    { name: 'Kimi For Coding', app: 'pi', share: 1 },
    { name: 'MiniMax', app: 'mcode', share: 1 },
    { name: 'Kimi Official', app: 'kimi', share: 1 },
    { name: 'Antigravity', app: 'agy', share: 1 },
  ],
  models: [
    { name: 'claude-opus-5-5', app: 'claude', share: 0.45 },
    { name: 'claude-sonnet-5-5', app: 'claude', share: 0.17 },
    { name: 'kimi-k3', app: 'claude', share: 0.38 },
    { name: 'gpt-5.6-sol', app: 'codex', share: 0.8 },
    { name: 'deepseek-v4-pro', app: 'codex', share: 0.2 },
    { name: 'gemini-3.6-flash', app: 'gemini', share: 0.6 },
    { name: 'gemini-3.6-pro', app: 'gemini', share: 0.4 },
    { name: 'grok-4.5', app: 'grokbuild', share: 1 },
    { name: 'kimi-k3', app: 'opencode', share: 1 },
    { name: 'kimi-k3', app: 'pi', share: 1 },
    { name: 'MiniMax-M3', app: 'mcode', share: 1 },
    { name: 'kimi-k3', app: 'kimi', share: 1 },
    { name: 'gemini-3.6-pro', app: 'agy', share: 1 },
  ],
};

interface StatRow {
  name: string;
  requests: number;
  cost: number;
  tokens: number;
  success: number;
  speed: number;
  firstToken: number;
}

function statRows(kind: 'providers' | 'models', perApp: Partial<Record<AppId, Totals>>): StatRow[] {
  const rows = new Map<string, StatRow>();
  for (const split of SPLITS[kind]) {
    const totals = perApp[split.app];
    if (!totals) continue;
    const row = rows.get(split.name) ?? { name: split.name, requests: 0, cost: 0, tokens: 0, success: 0, speed: 0, firstToken: 0 };
    row.requests += totals.requests * split.share;
    row.cost += totals.cost * split.share;
    row.tokens += totals.tokens * split.share;
    rows.set(split.name, row);
  }
  return [...rows.values()]
    .map((row, index) => {
      const noise = seeded(row.name.length * 17 + index);
      return { ...row, success: 98.4 + noise * 1.6, speed: 45 + noise * 50, firstToken: 0.7 + noise * 1.6 };
    })
    .sort((a, b) => b.requests - a.requests);
}

export function UsagePane() {
  const { t, language } = useLanguage();
  const { tip } = useHoverTip();
  const { visibleApps } = useShell();
  const u = t.demo.window.usage;
  const locale = LOCALE[language];
  const [metric, setMetric] = useState<Metric>('tokens');
  const [filter, setFilter] = useState<Filter>('all');
  // Opens on "All" (the app opens on today): the year-long heatmap shows off the page best.
  const [range, setRange] = useState<RangeSelection>({ preset: 'all' });
  const [tab, setTab] = useState<Tab>('logs');
  const [syncing, setSyncing] = useState(false);
  const syncTimer = useRef<number>();
  // Only apps the usage page tracks, and of those only the ones shown on the Apps page.
  const filterApps = demoApps.filter((app) => app.id in APP_TOTALS && visibleApps.includes(app.id));

  useEffect(() => () => window.clearTimeout(syncTimer.current), []);

  const levels = useMemo(() => {
    const seedBase = { tokens: 1, requests: 2, cost: 3, hitRate: 4 }[metric];
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
  // Each app's figures over the range; "all" reads the all-time figures directly.
  const perApp = useMemo(
    () =>
      Object.fromEntries(
        apps.map((app) => [app, range.preset === 'all' ? APP_TOTALS[app]! : sumTotals(buckets.map((bucket) => bucketUsage(app, bucket)), true)]),
      ) as Partial<Record<AppId, Totals>>,
    [apps, buckets, range.preset],
  );
  // Per-bar usage summed over the filtered apps.
  const series = useMemo(
    () => buckets.map((bucket) => sumTotals(apps.map((app) => bucketUsage(app, bucket)), true)),
    [buckets, apps],
  );
  const totals = sumTotals(Object.values(perApp), true);
  const logs = filter === 'all' ? LOGS : LOGS.filter((row) => row.app === filter);
  const stats = useMemo(
    () => ({ providers: statRows('providers', perApp), models: statRows('models', perApp) }),
    [perApp],
  );
  const tabCount: Record<Tab, number> = {
    logs: Math.round(totals.requests),
    providers: stats.providers.length,
    models: stats.models.length,
  };

  const sync = () => {
    if (syncing) return;
    setSyncing(true);
    syncTimer.current = window.setTimeout(() => setSyncing(false), 1100);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PaneHeader
        icon={<ChartColumn className="h-5 w-5" strokeWidth={1.5} />}
        title={u.title}
        extra={<HelpTip title={u.title} body={u.help} />}
        actions={
          // One split control: the last sync time (click to sync) and the usage settings.
          <div className="flex h-8 shrink-0 items-stretch overflow-hidden rounded-md border border-[var(--app-border-strong)] bg-[var(--app-surface)]">
            <button
              type="button"
              {...tip(u.syncTip)}
              onClick={sync}
              className="inline-flex items-center gap-1.5 whitespace-nowrap pe-3 ps-2.5 text-[13px] font-medium text-foreground transition-colors hover:bg-[var(--app-subtle)]"
            >
              <RefreshCw className={cn('h-3.5 w-3.5 text-[var(--app-fg2)]', syncing && 'animate-spin')} />
              <span className="hidden sm:inline">{syncing ? u.syncing : u.justSynced}</span>
            </button>
            <button
              type="button"
              {...tip(u.settings)}
              aria-label={u.settings}
              className="inline-flex w-8 items-center justify-center border-s border-border text-[var(--app-fg2)] transition-colors hover:bg-[var(--app-subtle)] hover:text-foreground"
            >
              <Settings2 className="h-3.5 w-3.5" />
            </button>
          </div>
        }
      />

      {/* The four conditions behind everything below, left-aligned: time first, then app, then provider / model. */}
      <div className="flex min-h-12 shrink-0 flex-wrap items-center gap-2 px-4 py-2 sm:px-6">
        <UsageRangePicker value={range} onChange={setRange} />
        <span aria-hidden="true" className="mx-1 h-4 w-px bg-border" />
        <div className="flex h-8 min-w-0 max-w-full shrink-0 items-center gap-0.5 overflow-x-auto rounded-lg border border-[var(--app-border-strong)] bg-[var(--app-surface)] p-[2px]">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={cn(
              'inline-flex h-[26px] shrink-0 items-center rounded-[5px] px-2 text-[13px] transition-colors',
              filter === 'all' ? 'bg-[var(--app-subtle)] font-semibold text-foreground' : 'font-medium text-[var(--app-fg2)] hover:text-foreground',
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
                'flex h-[26px] w-[30px] shrink-0 items-center justify-center rounded-[5px] transition-colors',
                filter === app.id ? 'bg-[var(--app-subtle)]' : 'opacity-75 hover:opacity-100',
              )}
            >
              <AppGlyph
                app={demoAppById[app.id]}
                size={16}
                badgeClassName={filter === app.id ? 'border-[var(--app-subtle)] bg-[var(--app-subtle)]' : 'border-[var(--app-surface)] bg-[var(--app-surface)]'}
              />
            </button>
          ))}
        </div>
        <button
          type="button"
          className="inline-flex h-8 min-w-0 max-w-[260px] shrink items-center gap-1.5 rounded-md border border-[var(--app-border-strong)] bg-[var(--app-surface)] pe-2 ps-2.5 text-[13px] font-medium text-foreground transition-colors hover:bg-[var(--app-subtle)]"
        >
          <ListTree className="h-4 w-4 shrink-0 text-[var(--app-fg3)]" />
          <span className="min-w-0 truncate">{`${u.providerFilter} / ${u.modelFilter}`}</span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[var(--app-fg2)]" />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 pb-6 pt-1 sm:px-6">
        {/* Overview: the metric strip and the chart are one panel; picking a metric redraws the chart. */}
        <section className="shrink-0 rounded-[10px] border border-border bg-[var(--app-surface)]">
          <MetricStrip totals={totals} metric={metric} onMetric={setMetric} />
          {/* "All" shows the long-run heatmap; shorter ranges get the bar chart, as in the app. */}
          {range.preset !== 'all' ? (
            <TrendChart buckets={buckets} values={series.map((item) => (metric === 'hitRate' ? item.hit : item[metric]))} metric={metric} />
          ) : (
            <div className="px-4 pb-3 pt-5">
              <div className="text-[13px] font-semibold text-foreground">{u.heatmapTitle}</div>
              <div className="text-xs text-[var(--app-fg3)]">{u.heatmapSubtitle}</div>
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
        </section>

        {/* Details: three tabs with their counts; the log tab has its status filter and column menu on the right. */}
        <section className="flex shrink-0 flex-col overflow-hidden rounded-[10px] border border-border bg-[var(--app-surface)]">
          <div className="flex h-11 items-stretch gap-5 border-b border-border pe-2 ps-4">
            {(Object.keys(u.tabs) as Tab[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={cn(
                  '-mb-px inline-flex items-center gap-1.5 border-b-2 text-[13px] font-medium transition-colors',
                  tab === key ? 'border-foreground text-foreground' : 'border-transparent text-[var(--app-fg2)] hover:text-foreground',
                )}
              >
                {u.tabs[key]}
                <span className="rounded-[4px] bg-[var(--app-subtle)] px-1.5 text-xs font-medium tabular-nums text-[var(--app-fg3)]">
                  {new Intl.NumberFormat(locale).format(tabCount[key])}
                </span>
              </button>
            ))}
            <span className="flex-1" />
            {tab === 'logs' && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex h-7 items-center gap-1.5 rounded-md pe-1.5 ps-2 text-xs text-[var(--app-fg2)] transition-colors hover:bg-[var(--app-subtle)] hover:text-foreground"
                >
                  <ListFilter className="h-3.5 w-3.5" />
                  {u.statusCode}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                <span aria-hidden="true" className="hidden h-4 w-px bg-border sm:block" />
                <IconBtn icon={Columns3} label={u.logColumns} className="hidden sm:inline-flex" />
              </div>
            )}
          </div>

          <div className="w-full overflow-x-auto">
            {tab === 'logs' ? <LogTable rows={logs} /> : <StatsTable kind={tab} rows={stats[tab]} />}
          </div>
        </section>
      </div>
    </div>
  );
}

/** cc-switch UsageHero: four equal cells; the selected one is underlined, and the Tokens parts fold out below. */
function MetricStrip({ totals, metric, onMetric }: { totals: Totals; metric: Metric; onMetric: (metric: Metric) => void }) {
  const { t, language } = useLanguage();
  const { tip } = useHoverTip();
  const u = t.demo.window.usage;
  const locale = LOCALE[language];
  const [moreOpen, setMoreOpen] = useState(false);
  const parts = tokenParts(totals);
  const cells: Array<{ key: Metric; label: string; value: string; help?: { title: string; body: string } }> = [
    { key: 'cost', label: u.totalCost, value: usd(totals.cost) },
    { key: 'requests', label: u.totalRequests, value: new Intl.NumberFormat(locale).format(Math.round(totals.requests)) },
    { key: 'tokens', label: u.realTokens, value: compact(totals.tokens, locale), help: { title: u.realTokensHelpTitle, body: u.realTokensHelp } },
    {
      key: 'hitRate',
      label: u.cacheHitRate,
      value: totals.tokens > 0 ? `${totals.hit.toFixed(1)}%` : '—',
      help: { title: u.hitRateHelpTitle, body: u.hitRateHelp },
    },
  ];

  return (
    <div className="relative z-10 border-b border-border">
      <div className="grid grid-cols-2 md:grid-cols-4">
        {cells.map((cell) => {
          const selected = metric === cell.key;
          return (
            <div key={cell.key} className="group relative min-w-0 px-4 pb-3.5 pt-2.5">
              <button
                type="button"
                aria-pressed={selected}
                aria-label={`${cell.label} ${cell.value}`}
                onClick={() => onMetric(cell.key)}
                className={cn(
                  'absolute inset-0 transition-[background-color,box-shadow]',
                  // Selected: a 2px foreground line on the bottom edge, half of it over the divider.
                  selected ? 'shadow-[inset_0_-1px_0_hsl(var(--foreground)),0_1px_0_hsl(var(--foreground))]' : 'group-hover:bg-[var(--app-subtle)]',
                )}
              />
              <div className="pointer-events-none relative flex min-w-0 flex-col gap-0.5">
                <div className="flex h-[18px] min-w-0 items-center gap-0.5">
                  <span className={cn('truncate text-xs', selected ? 'text-foreground' : 'text-[var(--app-fg2)]')}>{cell.label}</span>
                  {cell.help && (
                    <span className="pointer-events-auto flex">
                      <HelpTip title={cell.help.title} body={cell.help.body} />
                    </span>
                  )}
                </div>
                <span
                  className={cn(
                    'max-w-full self-start truncate text-[22px] font-semibold leading-7 tabular-nums',
                    selected ? 'text-foreground' : 'text-[var(--app-fg2)]',
                  )}
                >
                  {cell.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className={cn('grid transition-[grid-template-rows] duration-200 ease-out', moreOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
        <div className="min-h-0 overflow-hidden">
          <div className="grid grid-cols-2 border-t border-border md:grid-cols-4">
            {[
              { label: u.freshInput, value: parts.freshInput },
              { label: u.output, value: parts.output },
              { label: u.cacheWrite, value: parts.cacheWrite },
              { label: u.cacheRead, value: parts.cacheRead },
            ].map((part) => (
              <div key={part.label} className="flex min-w-0 flex-col gap-0.5 px-4 py-2.5">
                <span className="whitespace-nowrap text-xs text-[var(--app-fg3)]">{part.label}</span>
                <span className="self-start whitespace-nowrap text-[15px] tabular-nums text-[var(--app-fg2)]">{compact(part.value, locale)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* The fold-out arrow sits on the divider, halfway between the strip and the chart. */}
      <button
        type="button"
        {...tip(u.moreMetrics)}
        aria-label={u.moreMetrics}
        aria-expanded={moreOpen}
        onClick={() => setMoreOpen((open) => !open)}
        className="absolute bottom-0 left-1/2 inline-flex h-6 w-6 -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full border border-border bg-[var(--app-surface)] text-[var(--app-fg2)] transition-colors hover:bg-[var(--app-subtle)] hover:text-foreground"
      >
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-200', moreOpen && 'rotate-180')} />
      </button>
    </div>
  );
}

/** cc-switch UsageTrendChart: "{metric} · daily / hourly", one bar per hour (up to a day) or per day. */
function TrendChart({ buckets, values, metric }: { buckets: Bucket[]; values: number[]; metric: Metric }) {
  const { t, language } = useLanguage();
  const { tip } = useHoverTip();
  const u = t.demo.window.usage;
  const locale = LOCALE[language];
  const label = u.metrics[metric];
  const hourly = buckets[0]?.hourly ?? false;
  const top = metric === 'hitRate' ? 100 : niceMax(Math.max(0, ...values));
  const format = (value: number) =>
    metric === 'cost' ? usd(value, 4) : metric === 'hitRate' ? `${value.toFixed(1)}%` : new Intl.NumberFormat(locale).format(Math.round(value));
  const tick = (value: number) =>
    metric === 'cost' ? `$${compact(value, 'en-US')}` : metric === 'hitRate' ? `${Math.round(value)}%` : compact(value, locale);
  // Thin the axis to about eight labels.
  const every = Math.max(1, Math.ceil(buckets.length / 8));

  return (
    <div className="px-4 pb-2.5 pt-5">
      <div className="min-h-7 whitespace-nowrap text-xs font-semibold leading-7 text-[var(--app-fg2)]">
        {fill(u.trendTitle, { metric: label, granularity: hourly ? u.hourly : u.daily })}
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
          {[0, 50, 100].map((offset) => (
            <span key={offset} className="absolute inset-x-0 h-px bg-[var(--app-chart-grid)]" style={{ top: `${offset}%` }} />
          ))}
          <div className="absolute inset-0 flex items-end gap-[3px]">
            {buckets.map((bucket, index) => (
              <div
                key={bucket.key}
                {...tip(`${label}  ${format(values[index])}`, bucket.heading)}
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

/** Request log columns in cc-switch's order: who (time → model) · cost · tokens · performance. */
function LogTable({ rows }: { rows: LogRow[] }) {
  const { t } = useLanguage();
  const c = t.demo.window.usage.columns;
  const th = cn(TABLE.th, TABLE.dense);
  const td = cn(TABLE.td, TABLE.dense);
  const gap = TABLE.denseGroupGap;
  return (
    <table className="w-full min-w-[760px] border-separate border-spacing-0 text-[13px] tabular-nums">
      <thead>
        <tr className={TABLE.headRow}>
          <th className={th}>{c.time}</th>
          <th className={th}>{c.app}</th>
          <th className={th}>{c.provider}</th>
          <th className={th}>{c.model}</th>
          <th className={cn(th, gap)}>{c.cost}</th>
          <th className={cn(th, gap)}>{c.freshInput}</th>
          <th className={th}>{c.output}</th>
          <th className={th}>{c.cacheRead}</th>
          <th className={cn(th, gap)}>
            <span className="inline-flex items-center gap-0.5">
              {c.speed}
              <HelpTip title={c.speedHelpTitle} body={c.speedHelp} />
            </span>
          </th>
          <th className={th}>{c.firstToken}</th>
        </tr>
      </thead>
      <tbody className="text-foreground">
        {rows.map((row) => (
          <tr key={row.time} className={TABLE.row}>
            <td className={td}>{row.time}</td>
            <td className={td}>
              <span className="inline-flex items-center gap-1.5">
                <AppGlyph app={demoAppById[row.app]} size={14} badgeClassName="border-[var(--app-surface)] bg-[var(--app-surface)]" />
                {demoAppById[row.app].label}
              </span>
            </td>
            <td className={td}>{row.provider}</td>
            <td className={cn(td, 'font-mono text-xs')}>{row.model}</td>
            <td className={cn(td, gap)}>{row.cost}</td>
            <td className={cn(td, gap)}>{row.input.toLocaleString('en-US')}</td>
            <td className={td}>{row.output.toLocaleString('en-US')}</td>
            <td className={td}>{row.cacheRead}</td>
            <td className={cn(td, gap, row.speed === '—' && 'text-[var(--app-fg3)]')}>
              {row.speed === '—' ? (
                '—'
              ) : (
                <>
                  {row.speed}
                  <span className="ms-0.5 text-[11px] text-[var(--app-fg3)]">tok/s</span>
                </>
              )}
            </td>
            <td className={cn(td, row.firstToken === '—' && 'text-[var(--app-fg3)]')}>{row.firstToken}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Provider and model stats (cc-switch ProviderStatsTable / ModelStatsTable). */
function StatsTable({ kind, rows }: { kind: 'providers' | 'models'; rows: StatRow[] }) {
  const { t, language } = useLanguage();
  const c = t.demo.window.usage.columns;
  const locale = LOCALE[language];
  return (
    <table className="w-full min-w-[640px] border-separate border-spacing-0 text-[13px] tabular-nums">
      <thead>
        <tr className={TABLE.headRow}>
          <th className={TABLE.th}>{kind === 'providers' ? c.provider : c.model}</th>
          <th className={TABLE.th}>{c.requests}</th>
          <th className={TABLE.th}>{c.cost}</th>
          <th className={TABLE.th}>{c.tokens}</th>
          <th className={cn(TABLE.th, TABLE.groupGap)}>{c.successRate}</th>
          <th className={TABLE.th}>{c.speed}</th>
          <th className={TABLE.th}>{c.firstToken}</th>
        </tr>
      </thead>
      <tbody className="text-foreground">
        {rows.map((row) => (
          <tr key={row.name} className={TABLE.row}>
            <td className={cn(TABLE.td, kind === 'models' && 'font-mono text-xs')}>{row.name}</td>
            <td className={TABLE.td}>{new Intl.NumberFormat(locale).format(Math.round(row.requests))}</td>
            <td className={TABLE.td}>{usd(row.cost)}</td>
            <td className={TABLE.td}>{compact(row.tokens, locale)}</td>
            <td className={cn(TABLE.td, TABLE.groupGap)}>{row.success.toFixed(row.success >= 99.95 ? 0 : 1)}%</td>
            <td className={TABLE.td}>
              {Math.round(row.speed)}
              <span className="ms-0.5 text-[11px] text-[var(--app-fg3)]">tok/s</span>
            </td>
            <td className={TABLE.td}>{row.firstToken.toFixed(1)}s</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
