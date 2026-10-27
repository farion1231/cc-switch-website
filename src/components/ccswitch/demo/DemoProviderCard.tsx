import { motion } from 'framer-motion';
import { Minus, MoreHorizontal, Pencil, Play, Plug, Plus, Power, Route, SquareTerminal, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n/useLanguage';
import type { Provider } from '@/content/providers';
import { resolveSponsorUrl } from '@/content/sponsors';
import { InlineSvgIcon } from '@/components/ccswitch/InlineSvgIcon';
import { fill, type AppMode } from './apps';
import { useHoverTip } from './hoverTipContext';
import { QUOTA_TONE_TEXT, quotaTone, type QuotaTone } from './quotaTone';

export type CardButtonKey = 'switch' | 'exitAndUse' | 'routeHere' | 'add' | 'remove' | 'enable' | 'openTerminal';

const BUTTON_ICON: Record<CardButtonKey, LucideIcon> = {
  switch: Play,
  exitAndUse: Plug,
  routeHere: Route,
  add: Plus,
  remove: Minus,
  enable: Power,
  openTerminal: SquareTerminal,
};

/** Mode colors only mark the current card, as in the app. */
const TONE: Record<AppMode, { card: string; dot: string; chip: string }> = {
  direct: {
    card: 'border-[var(--app-direct)] bg-[var(--app-direct-soft)]',
    dot: 'bg-[var(--app-direct)]',
    chip: 'border-[var(--app-direct)] text-[var(--app-direct-text)]',
  },
  route: {
    card: 'border-[var(--app-route)] bg-[var(--app-route-soft)]',
    dot: 'bg-[var(--app-route)]',
    chip: 'border-[var(--app-route)] text-[var(--app-route-text)]',
  },
  stack: {
    card: 'border-[var(--app-stack)] bg-[var(--app-stack-soft)]',
    dot: 'bg-[var(--app-stack)]',
    chip: 'border-[var(--app-stack)] text-[var(--app-stack-text)]',
  },
};

export interface DemoCardProps {
  provider: Provider;
  current?: AppMode;
  chips?: Array<{ label: string; tone?: AppMode }>;
  status?: { label: string; tone: AppMode | 'muted' };
  button?: { key: CardButtonKey; label: string; onClick: () => void; disabledReason?: string };
}

export function DemoProviderCard({ provider, current, chips = [], status, button }: DemoCardProps) {
  const { t, language } = useLanguage();
  const { tip } = useHoverTip();
  const w = t.demo.window;
  const linkHref = provider.href ? resolveSponsorUrl(provider.href, language) : provider.subtitle;
  const ButtonIcon = button ? BUTTON_ICON[button.key] : null;

  return (
    <motion.div
      layout="position"
      transition={{ duration: 0.22 }}
      className={cn(
        'group flex min-h-[64px] items-center gap-3 rounded-xl border bg-card px-3 py-2.5 transition-colors sm:px-4',
        current ? TONE[current].card : 'border-border hover:border-foreground/20',
      )}
    >
      <div
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border',
          provider.logoOnWhite ? 'bg-white' : 'bg-background',
        )}
      >
        <ProviderLogo provider={provider} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="truncate text-[15px] font-medium leading-tight text-foreground">{provider.name}</span>
          {chips.map((chip) => (
            <span
              key={chip.label}
              className={cn(
                'hidden shrink-0 whitespace-nowrap rounded-full border px-1.5 text-[11px] leading-[18px] sm:inline-block',
                chip.tone ? TONE[chip.tone].chip : 'border-border text-muted-foreground',
              )}
            >
              {chip.label}
            </span>
          ))}
        </div>
        <a
          href={linkHref}
          target="_blank"
          rel={provider.href ? 'sponsored noopener noreferrer' : 'noopener noreferrer'}
          className="mt-1 block truncate text-[13px] text-muted-foreground transition-colors hover:text-foreground hover:underline"
        >
          {provider.subtitle}
        </a>
      </div>

      <QuotaSummary provider={provider} />

      <div className="flex shrink-0 items-center gap-1">
        <div className="flex min-w-[32px] justify-end">
          {status ? (
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap px-1 text-[13px] font-medium text-foreground">
              <span
                aria-hidden="true"
                className={cn('h-1.5 w-1.5 rounded-full', status.tone === 'muted' ? 'bg-muted-foreground' : TONE[status.tone].dot)}
              />
              <span className="hidden sm:inline">{status.label}</span>
            </span>
          ) : button && ButtonIcon ? (
            <button
              type="button"
              {...tip(button.disabledReason ? `${button.label}\n${button.disabledReason}` : button.label)}
              aria-label={button.label}
              aria-disabled={Boolean(button.disabledReason)}
              onClick={() => {
                if (!button.disabledReason) button.onClick();
              }}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-md transition-colors',
                button.disabledReason
                  ? 'cursor-not-allowed text-muted-foreground/40'
                  : 'text-muted-foreground hover:bg-[var(--app-subtle)] hover:text-foreground active:scale-95',
              )}
            >
              <ButtonIcon className="h-4 w-4" strokeWidth={1.75} />
            </button>
          ) : null}
        </div>
        {[
          { Icon: Pencil, label: w.edit },
          { Icon: MoreHorizontal, label: w.more },
        ].map(({ Icon, label }) => (
          <button
            key={label}
            type="button"
            {...tip(label)}
            aria-label={label}
            className="hidden h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-[var(--app-subtle)] hover:text-foreground sm:flex"
          >
            <Icon className="h-4 w-4" strokeWidth={1.75} />
          </button>
        ))}
      </div>
    </motion.div>
  );
}

const TIER_KEY = { '5h': 'fiveHour', '7d': 'weekly', fable: 'fable' } as const;

/**
 * The card's quota column (cc-switch QuotaLines / cardRows): two lines at most. With more tiers the
 * shortest window keeps its own line and the rest share the second one by short name
 * ("Weekly 36% · Fable 52%").
 */
function QuotaSummary({ provider }: { provider: Provider }) {
  const { t } = useLanguage();
  const quota = t.demo.window.quota;

  type Line = { key: string; label: string; shortLabel: string; value: number; tone: QuotaTone };
  const tiers: Line[] = (provider.quota?.tiers ?? []).map((tier) => {
    const left = Math.max(0, Math.round(100 - tier.utilization));
    const key = TIER_KEY[tier.label as keyof typeof TIER_KEY];
    return {
      key: tier.label,
      label: key ? quota.tiers[key] : tier.label,
      shortLabel: key ? quota.shortTiers[key] : tier.label,
      value: left,
      tone: quotaTone(left),
    };
  });
  const rows: Line[][] = tiers.length > 2 ? [[tiers[0]], tiers.slice(1)] : tiers.map((line) => [line]);

  if (rows.length === 0) {
    if (!provider.remaining) return null;
    return (
      <div className="hidden shrink-0 text-right text-[13px] tabular-nums text-muted-foreground md:block">
        <span className="whitespace-nowrap">{fill(quota.balance, { value: `${provider.remaining} USD` })}</span>
      </div>
    );
  }

  // The tier name stays gray; only the percentage takes the quota color.
  const render = (template: string, line: Line, label: string) => {
    // cc-switch labelSp: a tier name ending in a letter or digit gets a space before CJK text ("Pro 剩余").
    const spaced = /[A-Za-z0-9]$/.test(label) ? template.replace(/\{label\}(?=[^\s{])/, '{label} ') : template;
    const [before, rest = ''] = fill(spaced, { label }).split('{value}');
    const percent = rest.startsWith('%');
    return (
      <>
        {before}
        <span className={QUOTA_TONE_TEXT[line.tone]}>
          {line.value}
          {percent && '%'}
        </span>
        {percent ? rest.slice(1) : rest}
      </>
    );
  };

  return (
    <div className="hidden shrink-0 flex-col items-end gap-0.5 text-right text-[13px] tabular-nums text-muted-foreground md:flex">
      {rows.map((row) =>
        row.length === 1 ? (
          <span key={row[0].key} className="whitespace-nowrap">
            {render(quota.tierLeft, row[0], row[0].label)}
          </span>
        ) : (
          <span key={row.map((line) => line.key).join('+')} className="whitespace-nowrap">
            {row.map((line, index) => (
              <span key={line.key}>
                {index > 0 && ' · '}
                {render(quota.tierShort, line, line.shortLabel)}
              </span>
            ))}
          </span>
        ),
      )}
    </div>
  );
}

function ProviderLogo({ provider }: { provider: Provider }) {
  if (provider.iconSvg) {
    return <InlineSvgIcon svg={provider.iconSvg} label={provider.name} color={provider.iconColor} className="h-5 w-5" />;
  }

  if (provider.isSvgUrl && provider.iconColor) {
    return (
      <span
        className="inline-block h-5 w-5 shrink-0 bg-current"
        style={{
          color: provider.iconColor === 'currentColor' ? undefined : provider.iconColor,
          WebkitMask: `url(${provider.icon}) center / contain no-repeat`,
          mask: `url(${provider.icon}) center / contain no-repeat`,
        }}
        aria-label={provider.name}
        role="img"
      />
    );
  }

  if (provider.isSvgUrl) {
    return <img src={provider.icon} alt={provider.name} className="h-5 w-5 rounded-[3px] object-contain" />;
  }

  return <span className="text-lg">{provider.icon}</span>;
}
