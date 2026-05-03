import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Database, DollarSign, Layers } from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  type TooltipProps,
} from 'recharts';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n/useLanguage';

type StatsPeriod = 'hours24' | 'days1' | 'days7' | 'days14' | 'days30';
type ChartDataSetKey = 'hours24' | 'days7' | 'days30';
type MetricKey = 'requests' | 'cost' | 'inputToken' | 'outputToken' | 'writeCache' | 'hitCache';
type NormalizedMetricKey = `${MetricKey}Normalized`;

interface ChartDataPoint {
  date: string;
  requests: number;
  cost: number;
  inputToken: number;
  outputToken: number;
  writeCache: number;
  hitCache: number;
}

type NormalizedChartDataPoint = ChartDataPoint & Record<NormalizedMetricKey, number>;

interface MetricLine {
  key: MetricKey;
  normalizedKey: NormalizedMetricKey;
  label: string;
  color: string;
  dashArray?: string;
}

const normalizedMetricKeys: Record<MetricKey, NormalizedMetricKey> = {
  requests: 'requestsNormalized',
  cost: 'costNormalized',
  inputToken: 'inputTokenNormalized',
  outputToken: 'outputTokenNormalized',
  writeCache: 'writeCacheNormalized',
  hitCache: 'hitCacheNormalized',
};

const chartDataSets: Record<ChartDataSetKey, ChartDataPoint[]> = {
  hours24: [
    { date: '00:00', requests: 28, cost: 0.82, inputToken: 980, outputToken: 28, writeCache: 620, hitCache: 2850 },
    { date: '01:00', requests: 22, cost: 0.65, inputToken: 780, outputToken: 22, writeCache: 580, hitCache: 2680 },
    { date: '02:00', requests: 15, cost: 0.42, inputToken: 520, outputToken: 15, writeCache: 520, hitCache: 2450 },
    { date: '03:00', requests: 12, cost: 0.35, inputToken: 420, outputToken: 12, writeCache: 480, hitCache: 2280 },
    { date: '04:00', requests: 8, cost: 0.22, inputToken: 280, outputToken: 8, writeCache: 450, hitCache: 2150 },
    { date: '05:00', requests: 15, cost: 0.38, inputToken: 480, outputToken: 12, writeCache: 520, hitCache: 2380 },
    { date: '06:00', requests: 35, cost: 0.92, inputToken: 1250, outputToken: 32, writeCache: 680, hitCache: 2850 },
    { date: '07:00', requests: 68, cost: 1.85, inputToken: 2580, outputToken: 68, writeCache: 850, hitCache: 3520 },
    { date: '08:00', requests: 125, cost: 3.42, inputToken: 4850, outputToken: 128, writeCache: 1080, hitCache: 4580 },
    { date: '09:00', requests: 185, cost: 5.12, inputToken: 7250, outputToken: 195, writeCache: 1250, hitCache: 5680 },
    { date: '10:00', requests: 228, cost: 6.35, inputToken: 8920, outputToken: 242, writeCache: 1120, hitCache: 6250 },
    { date: '11:00', requests: 265, cost: 7.28, inputToken: 10350, outputToken: 285, writeCache: 980, hitCache: 6850 },
    { date: '12:00', requests: 248, cost: 6.85, inputToken: 9680, outputToken: 268, writeCache: 850, hitCache: 7120 },
    { date: '13:00', requests: 225, cost: 6.18, inputToken: 8780, outputToken: 245, writeCache: 780, hitCache: 7380 },
    { date: '14:00', requests: 198, cost: 5.45, inputToken: 7720, outputToken: 215, writeCache: 720, hitCache: 7580 },
    { date: '15:00', requests: 218, cost: 5.98, inputToken: 8520, outputToken: 238, writeCache: 850, hitCache: 7250 },
    { date: '16:00', requests: 245, cost: 6.72, inputToken: 9580, outputToken: 268, writeCache: 980, hitCache: 6850 },
    { date: '17:00', requests: 232, cost: 6.38, inputToken: 9080, outputToken: 255, writeCache: 1120, hitCache: 6380 },
    { date: '18:00', requests: 198, cost: 5.45, inputToken: 7750, outputToken: 218, writeCache: 1250, hitCache: 5850 },
    { date: '19:00', requests: 165, cost: 4.52, inputToken: 6450, outputToken: 182, writeCache: 1380, hitCache: 5280 },
    { date: '20:00', requests: 135, cost: 3.68, inputToken: 5280, outputToken: 148, writeCache: 1180, hitCache: 4650 },
    { date: '21:00', requests: 98, cost: 2.68, inputToken: 3820, outputToken: 108, writeCache: 950, hitCache: 3980 },
    { date: '22:00', requests: 65, cost: 1.78, inputToken: 2520, outputToken: 72, writeCache: 780, hitCache: 3350 },
    { date: '23:00', requests: 42, cost: 1.15, inputToken: 1650, outputToken: 46, writeCache: 650, hitCache: 2920 },
  ],
  days7: [
    { date: '12/20 00', requests: 285, cost: 7.85, inputToken: 1120000, outputToken: 32500, writeCache: 720000, hitCache: 3250000 },
    { date: '12/20 06', requests: 385, cost: 10.52, inputToken: 1520000, outputToken: 38200, writeCache: 850000, hitCache: 3580000 },
    { date: '12/20 12', requests: 520, cost: 14.25, inputToken: 2050000, outputToken: 48500, writeCache: 680000, hitCache: 4120000 },
    { date: '12/20 18', requests: 465, cost: 12.75, inputToken: 1850000, outputToken: 52800, writeCache: 580000, hitCache: 4580000 },
    { date: '12/21 00', requests: 395, cost: 10.85, inputToken: 1580000, outputToken: 45200, writeCache: 520000, hitCache: 4850000 },
    { date: '12/21 06', requests: 445, cost: 12.18, inputToken: 1780000, outputToken: 48800, writeCache: 620000, hitCache: 5120000 },
    { date: '12/21 12', requests: 585, cost: 16.02, inputToken: 2350000, outputToken: 58200, writeCache: 750000, hitCache: 5450000 },
    { date: '12/21 18', requests: 545, cost: 14.92, inputToken: 2180000, outputToken: 55500, writeCache: 880000, hitCache: 5180000 },
    { date: '12/22 00', requests: 425, cost: 11.65, inputToken: 1720000, outputToken: 48200, writeCache: 980000, hitCache: 4650000 },
    { date: '12/22 06', requests: 365, cost: 10.02, inputToken: 1480000, outputToken: 42500, writeCache: 1120000, hitCache: 4150000 },
    { date: '12/22 12', requests: 445, cost: 12.18, inputToken: 1780000, outputToken: 45800, writeCache: 1250000, hitCache: 3850000 },
    { date: '12/22 18', requests: 485, cost: 13.28, inputToken: 1950000, outputToken: 48500, writeCache: 1380000, hitCache: 3520000 },
    { date: '12/23 00', requests: 395, cost: 10.82, inputToken: 1580000, outputToken: 42200, writeCache: 1180000, hitCache: 3180000 },
    { date: '12/23 06', requests: 335, cost: 9.18, inputToken: 1350000, outputToken: 38500, writeCache: 980000, hitCache: 2950000 },
    { date: '12/23 12', requests: 425, cost: 11.65, inputToken: 1720000, outputToken: 45200, writeCache: 850000, hitCache: 3280000 },
    { date: '12/23 18', requests: 478, cost: 13.08, inputToken: 1920000, outputToken: 50500, writeCache: 720000, hitCache: 3650000 },
    { date: '12/24 00', requests: 385, cost: 10.55, inputToken: 1550000, outputToken: 42800, writeCache: 650000, hitCache: 3950000 },
    { date: '12/24 06', requests: 312, cost: 8.55, inputToken: 1280000, outputToken: 36500, writeCache: 580000, hitCache: 4180000 },
    { date: '12/24 12', requests: 365, cost: 10.02, inputToken: 1480000, outputToken: 42200, writeCache: 680000, hitCache: 4380000 },
    { date: '12/24 18', requests: 285, cost: 7.82, inputToken: 1150000, outputToken: 35800, writeCache: 780000, hitCache: 4120000 },
    { date: '12/25 00', requests: 218, cost: 5.98, inputToken: 880000, outputToken: 28500, writeCache: 920000, hitCache: 3650000 },
    { date: '12/25 06', requests: 165, cost: 4.52, inputToken: 680000, outputToken: 22800, writeCache: 1050000, hitCache: 3120000 },
    { date: '12/25 12', requests: 142, cost: 3.88, inputToken: 580000, outputToken: 18500, writeCache: 1180000, hitCache: 2680000 },
    { date: '12/25 18', requests: 115, cost: 3.15, inputToken: 475000, outputToken: 15200, writeCache: 1020000, hitCache: 2280000 },
    { date: '12/26 00', requests: 95, cost: 2.62, inputToken: 395000, outputToken: 12800, writeCache: 850000, hitCache: 1920000 },
    { date: '12/26 06', requests: 78, cost: 2.15, inputToken: 325000, outputToken: 10500, writeCache: 720000, hitCache: 1580000 },
    { date: '12/26 12', requests: 98, cost: 2.68, inputToken: 405000, outputToken: 12200, writeCache: 620000, hitCache: 1350000 },
    { date: '12/26 18', requests: 68, cost: 1.85, inputToken: 280000, outputToken: 9200, writeCache: 520000, hitCache: 1120000 },
  ],
  days30: [
    { date: '11/27', requests: 2850, cost: 62.5, inputToken: 8850000, outputToken: 185000, writeCache: 5250000, hitCache: 22500000 },
    { date: '11/28', requests: 3120, cost: 68.2, inputToken: 9680000, outputToken: 205000, writeCache: 5850000, hitCache: 24800000 },
    { date: '11/29', requests: 3450, cost: 75.5, inputToken: 10720000, outputToken: 228000, writeCache: 5120000, hitCache: 27500000 },
    { date: '11/30', requests: 3280, cost: 71.8, inputToken: 10180000, outputToken: 245000, writeCache: 4580000, hitCache: 29800000 },
    { date: '12/01', requests: 3680, cost: 80.5, inputToken: 11420000, outputToken: 268000, writeCache: 4120000, hitCache: 32500000 },
    { date: '12/02', requests: 3920, cost: 85.8, inputToken: 12180000, outputToken: 285000, writeCache: 3750000, hitCache: 35200000 },
    { date: '12/03', requests: 4150, cost: 90.8, inputToken: 12880000, outputToken: 298000, writeCache: 3450000, hitCache: 37800000 },
    { date: '12/04', requests: 3850, cost: 84.2, inputToken: 11950000, outputToken: 312000, writeCache: 3850000, hitCache: 36500000 },
    { date: '12/05', requests: 3980, cost: 87.1, inputToken: 12350000, outputToken: 328000, writeCache: 4250000, hitCache: 34200000 },
    { date: '12/06', requests: 3620, cost: 79.2, inputToken: 11250000, outputToken: 345000, writeCache: 4680000, hitCache: 31800000 },
    { date: '12/07', requests: 3450, cost: 75.5, inputToken: 10720000, outputToken: 358000, writeCache: 5120000, hitCache: 29500000 },
    { date: '12/08', requests: 3280, cost: 71.8, inputToken: 10180000, outputToken: 342000, writeCache: 5580000, hitCache: 27200000 },
    { date: '12/09', requests: 3580, cost: 78.3, inputToken: 11120000, outputToken: 325000, writeCache: 6050000, hitCache: 29800000 },
    { date: '12/10', requests: 3850, cost: 84.2, inputToken: 11950000, outputToken: 308000, writeCache: 6520000, hitCache: 32500000 },
    { date: '12/11', requests: 4080, cost: 89.3, inputToken: 12680000, outputToken: 292000, writeCache: 6950000, hitCache: 35200000 },
    { date: '12/12', requests: 4320, cost: 94.5, inputToken: 13420000, outputToken: 275000, writeCache: 6580000, hitCache: 37800000 },
    { date: '12/13', requests: 4520, cost: 98.9, inputToken: 14050000, outputToken: 258000, writeCache: 6120000, hitCache: 40500000 },
    { date: '12/14', requests: 4680, cost: 102.4, inputToken: 14550000, outputToken: 242000, writeCache: 5650000, hitCache: 42800000 },
    { date: '12/15', requests: 4750, cost: 103.9, inputToken: 14780000, outputToken: 228000, writeCache: 5180000, hitCache: 41500000 },
    { date: '12/16', requests: 4520, cost: 98.9, inputToken: 14050000, outputToken: 215000, writeCache: 4750000, hitCache: 38200000 },
    { date: '12/17', requests: 4280, cost: 93.6, inputToken: 13280000, outputToken: 205000, writeCache: 4380000, hitCache: 34800000 },
    { date: '12/18', requests: 3980, cost: 87.1, inputToken: 12350000, outputToken: 195000, writeCache: 4050000, hitCache: 31500000 },
    { date: '12/19', requests: 3680, cost: 80.5, inputToken: 11420000, outputToken: 182000, writeCache: 3720000, hitCache: 28500000 },
    { date: '12/20', requests: 3380, cost: 73.9, inputToken: 10480000, outputToken: 172000, writeCache: 3450000, hitCache: 25800000 },
    { date: '12/21', requests: 3120, cost: 68.2, inputToken: 9680000, outputToken: 165000, writeCache: 3180000, hitCache: 23200000 },
    { date: '12/22', requests: 2850, cost: 62.3, inputToken: 8850000, outputToken: 158000, writeCache: 2920000, hitCache: 20800000 },
    { date: '12/23', requests: 2580, cost: 56.4, inputToken: 8020000, outputToken: 148000, writeCache: 2680000, hitCache: 18500000 },
    { date: '12/24', requests: 2320, cost: 50.8, inputToken: 7220000, outputToken: 138000, writeCache: 2450000, hitCache: 16200000 },
    { date: '12/25', requests: 2050, cost: 44.8, inputToken: 6380000, outputToken: 128000, writeCache: 2220000, hitCache: 14200000 },
    { date: '12/26', requests: 1780, cost: 38.9, inputToken: 5520000, outputToken: 118000, writeCache: 1980000, hitCache: 12500000 },
  ],
};

function formatNumber(num: number) {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toLocaleString();
}

function getMetricTotals(data: ChartDataPoint[]) {
  return data.reduce(
    (totals, point) => ({
      requests: totals.requests + point.requests,
      cost: totals.cost + point.cost,
      inputToken: totals.inputToken + point.inputToken,
      outputToken: totals.outputToken + point.outputToken,
      writeCache: totals.writeCache + point.writeCache,
      hitCache: totals.hitCache + point.hitCache,
    }),
    { requests: 0, cost: 0, inputToken: 0, outputToken: 0, writeCache: 0, hitCache: 0 },
  );
}

function getMaxValues(data: ChartDataPoint[]) {
  return {
    requests: Math.max(...data.map((point) => point.requests)),
    cost: Math.max(...data.map((point) => point.cost)),
    inputToken: Math.max(...data.map((point) => point.inputToken)),
    outputToken: Math.max(...data.map((point) => point.outputToken)),
    writeCache: Math.max(...data.map((point) => point.writeCache)),
    hitCache: Math.max(...data.map((point) => point.hitCache)),
  };
}

function normalizeChartData(data: ChartDataPoint[], maxValues: Record<MetricKey, number>): NormalizedChartDataPoint[] {
  return data.map((point) => ({
    ...point,
    requestsNormalized: (point.requests / maxValues.requests) * 100,
    costNormalized: (point.cost / maxValues.cost) * 100,
    inputTokenNormalized: (point.inputToken / maxValues.inputToken) * 100,
    outputTokenNormalized: (point.outputToken / maxValues.outputToken) * 100,
    writeCacheNormalized: (point.writeCache / maxValues.writeCache) * 100,
    hitCacheNormalized: (point.hitCache / maxValues.hitCache) * 100,
  }));
}

function formatMetricValue(key: MetricKey, value: number) {
  return key === 'cost' ? `$${value.toFixed(2)}` : formatNumber(value);
}

function StatsTooltip({
  active,
  payload,
  lines,
}: TooltipProps<number, string> & { lines: MetricLine[] }) {
  const point = payload?.[0]?.payload as NormalizedChartDataPoint | undefined;
  if (!active || !point) return null;

  return (
    <div className="p-3 rounded-lg bg-popover border border-border shadow-xl text-sm backdrop-blur-sm">
      <div className="font-medium text-foreground mb-2 pb-2 border-b border-border">{point.date}</div>
      <div className="space-y-1.5 min-w-[150px]">
        {lines.map((line) => (
          <div key={line.key} className="flex justify-between gap-4">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: line.color }} />
              {line.label}
            </span>
            <span className="font-medium text-foreground">{formatMetricValue(line.key, point[line.key])}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatsContent() {
  const { t } = useLanguage();
  const [period, setPeriod] = useState<StatsPeriod>('days7');

  const periodLabels: Record<StatsPeriod, string> = {
    hours24: t.demo.stats.periods.hours24,
    days1: t.demo.stats.periods.days1,
    days7: t.demo.stats.periods.days7,
    days14: t.demo.stats.periods.days14,
    days30: t.demo.stats.periods.days30,
  };
  const periodDataSet: Record<StatsPeriod, ChartDataSetKey> = {
    hours24: 'hours24',
    days1: 'hours24',
    days7: 'days7',
    days14: 'days7',
    days30: 'days30',
  };

  const currentData = chartDataSets[periodDataSet[period]];
  const totals = useMemo(() => getMetricTotals(currentData), [currentData]);
  const maxValues = useMemo(() => getMaxValues(currentData), [currentData]);
  const chartData = useMemo(() => normalizeChartData(currentData, maxValues), [currentData, maxValues]);

  const totalTokens = totals.inputToken + totals.outputToken;
  const totalCache = totals.writeCache + totals.hitCache;
  const metricCards = [
    { icon: Activity, label: t.demo.stats.totalRequests, value: totals.requests.toLocaleString(), color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
    { icon: DollarSign, label: t.demo.stats.totalCost, value: `$${totals.cost.toFixed(2)}`, color: 'text-purple-500', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
    { icon: Layers, label: t.demo.stats.totalTokens, value: formatNumber(totalTokens), subStats: [{ label: 'Input', value: formatNumber(totals.inputToken) }, { label: 'Output', value: formatNumber(totals.outputToken) }], color: 'text-emerald-500', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
    { icon: Database, label: t.demo.stats.cacheTokens, value: formatNumber(totalCache), subStats: [{ label: 'Write', value: formatNumber(totals.writeCache) }, { label: 'Read', value: formatNumber(totals.hitCache) }], color: 'text-orange-500', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
  ];

  const lines: MetricLine[] = [
    { key: 'requests', normalizedKey: normalizedMetricKeys.requests, label: t.demo.stats.requests, color: '#3b82f6' },
    { key: 'cost', normalizedKey: normalizedMetricKeys.cost, label: t.demo.stats.cost, color: '#a855f7', dashArray: '6 4' },
    { key: 'inputToken', normalizedKey: normalizedMetricKeys.inputToken, label: t.demo.stats.inputToken, color: '#22c55e' },
    { key: 'outputToken', normalizedKey: normalizedMetricKeys.outputToken, label: t.demo.stats.outputToken, color: '#f97316' },
    { key: 'writeCache', normalizedKey: normalizedMetricKeys.writeCache, label: t.demo.stats.writeCache, color: '#06b6d4', dashArray: '4 2' },
    { key: 'hitCache', normalizedKey: normalizedMetricKeys.hitCache, label: t.demo.stats.hitCache, color: '#ec4899' },
  ];

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-foreground">{t.demo.stats.title}</h3>
          <p className="text-sm text-muted-foreground">{t.demo.stats.subtitle}</p>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg bg-muted">
          {(['hours24', 'days1', 'days7', 'days14', 'days30'] as const).map((nextPeriod) => (
            <motion.button
              key={nextPeriod}
              type="button"
              onClick={() => setPeriod(nextPeriod)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'relative px-4 py-2 rounded-md text-sm font-medium transition-colors',
                period === nextPeriod ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {period === nextPeriod && (
                <motion.div
                  layoutId="stats-period-bg"
                  className="absolute inset-0 bg-card rounded-md shadow-sm"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative z-10">{periodLabels[nextPeriod]}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {metricCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="p-4 rounded-xl border border-border bg-card"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', stat.bgColor)}>
                <stat.icon className={cn('w-4 h-4', stat.color)} />
              </div>
            </div>
            <motion.div
              key={`${stat.label}-${period}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="text-2xl font-bold text-foreground mb-1"
            >
              {stat.value}
            </motion.div>
            {stat.subStats && (
              <div className="flex gap-4 text-sm text-muted-foreground">
                {stat.subStats.map((subStat) => (
                  <span key={subStat.label}>
                    {subStat.label} <span className="text-foreground">{subStat.value}</span>
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="p-6 rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-semibold text-foreground">{t.demo.stats.trend}</h4>
          <motion.span key={period} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted-foreground">
            {periodLabels[period]}
          </motion.span>
        </div>

        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 8, left: 16 }}>
              <CartesianGrid vertical={false} stroke="currentColor" strokeOpacity={0.08} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                interval={periodDataSet[period] === 'days30' ? 2 : 1}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <Tooltip content={(props) => <StatsTooltip {...props} lines={lines} />} cursor={{ strokeDasharray: '4 4', opacity: 0.3 }} />
              {lines.map((line) => (
                <Line
                  key={`${line.key}-${period}`}
                  type="monotone"
                  dataKey={line.normalizedKey}
                  dot={false}
                  stroke={line.color}
                  strokeWidth={2}
                  strokeDasharray={line.dashArray}
                  isAnimationActive
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-sm">
          {lines.map((line) => (
            <span key={line.key} className="flex items-center gap-2">
              <span
                className="w-4 h-0.5 rounded-full"
                style={{
                  backgroundColor: line.color,
                  ...(line.dashArray
                    ? { background: `repeating-linear-gradient(90deg, ${line.color} 0, ${line.color} 4px, transparent 4px, transparent 6px)` }
                    : {}),
                }}
              />
              <span className="text-muted-foreground">{line.label}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
