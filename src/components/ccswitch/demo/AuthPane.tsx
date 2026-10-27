import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Copy, ExternalLink, KeyRound, Loader2, Plus, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n/useLanguage';
import antigravityIcon from '@/assets/icons/antigravity.svg';
import claudeIcon from '@/assets/icons/claude.svg';
import copilotIconSvg from '@/assets/icons/githubcopilot.svg?raw';
import kimiCodeIconSvg from '@/assets/icons/kimi-code.svg?raw';
import openaiIconSvg from '@/assets/icons/openai.svg?raw';
import grokIconSvg from '@/assets/icons/grok.svg?raw';
import { InlineSvgIcon } from '@/components/ccswitch/InlineSvgIcon';
import { fill } from './apps';
import { QUOTA_TONE_FILL, QUOTA_TONE_TEXT, quotaTone } from './quotaTone';
import { Btn, Floating, HelpTip, IconBtn, MoreMenu, PaneHeader, Pill, Segmented } from './parts';
import { ACCOUNTS, type AuthService, type SampleAccount } from './samples';
import { useShell } from './shellContext';

interface ServiceDef {
  id: AuthService;
  name: string;
  icon: { svg: string } | { src: string };
  /** Device code shown in the card (Copilot / ChatGPT / xAI / Kimi) or a browser sign-in page (Claude / Antigravity). */
  login: 'device' | 'browser';
  /** Picked before signing in: Copilot's deployment, Kimi's region. */
  chooser?: 'copilot' | 'kimi';
}

/** AuthCenterPanel order; Antigravity only exists on macOS in the app. */
const SERVICES: ServiceDef[] = [
  { id: 'claude', name: 'Claude', icon: { src: claudeIcon }, login: 'browser' },
  { id: 'copilot', name: 'GitHub Copilot', icon: { svg: copilotIconSvg }, login: 'device', chooser: 'copilot' },
  { id: 'chatgpt', name: 'ChatGPT', icon: { svg: openaiIconSvg }, login: 'device' },
  { id: 'xai', name: 'xAI', icon: { svg: grokIconSvg }, login: 'device' },
  { id: 'kimi', name: 'Kimi Code', icon: { svg: kimiCodeIconSvg }, login: 'device', chooser: 'kimi' },
  { id: 'agy', name: 'Antigravity', icon: { src: antigravityIcon }, login: 'browser' },
];

/** The account a finished demo sign-in adds to each group. */
const NEW_ACCOUNT: Record<AuthService, Omit<SampleAccount, 'signedIn' | 'checkedMinutesAgo'>> = {
  claude: { login: 'me@example.com', plan: 'Pro', quota: [{ tier: 'fiveHour', left: 100 }, { tier: 'weekly', left: 100 }] },
  copilot: { login: 'mona', host: 'github.com', usedBy: 0, quota: [{ tier: 'premium', left: 100 }] },
  chatgpt: { login: 'me@example.com', usedBy: 0, quota: [{ tier: 'fiveHour', left: 100 }, { tier: 'weekly', left: 100 }] },
  xai: { login: 'grok-dev', usedBy: 0, quota: [{ tier: 'weekly', left: 100 }] },
  kimi: { login: 'kimi-new', region: 'mainland-cn', quota: [{ tier: 'fiveHour', left: 100 }, { tier: 'weekly', left: 100 }] },
  agy: {
    login: 'me@gmail.com',
    quota: [
      { tier: 'geminiFiveHour', left: 100 },
      { tier: 'claudeGptWeekly', left: 100 },
    ],
  },
};

/** What the card is waiting for: a sign-in, or the chooser that comes before it. */
type Pending = { kind: 'add' | 'reauth'; login?: string } | { kind: 'choose' } | null;

export function AuthPane() {
  const { t } = useLanguage();
  const a = t.demo.window.pages.auth;
  return (
    <div className="flex h-full min-h-0 flex-col">
      <PaneHeader
        icon={<KeyRound className="h-5 w-5" strokeWidth={1.5} />}
        title={t.demo.window.nav.auth}
        extra={
          <>
            <HelpTip title={a.helpTitle} body={a.help} />
            <span className="ms-1 inline-flex h-5 items-center rounded-full border border-border px-1.5 text-[11px] font-medium text-[var(--app-fg2)]">
              {a.beta}
            </span>
          </>
        }
      />
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-10 pt-4 sm:px-6">
        <div className="flex flex-col gap-3">
          {SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ServiceIcon({ service }: { service: ServiceDef }) {
  if ('svg' in service.icon) {
    return <InlineSvgIcon svg={service.icon.svg} label={service.name} color="currentColor" className="h-5 w-5" />;
  }
  return <img src={service.icon.src} alt={service.name} className="h-5 w-5 object-contain" />;
}

function ServiceCard({ service }: { service: ServiceDef }) {
  const { t } = useLanguage();
  const { toast } = useShell();
  const p = t.demo.window.pages;
  const a = p.auth;
  const [accounts, setAccounts] = useState<SampleAccount[]>(ACCOUNTS[service.id]);
  const [pending, setPending] = useState<Pending>(null);
  const help = {
    claude: a.claudeHelp,
    copilot: a.copilotHelp,
    chatgpt: a.chatgptHelp,
    xai: a.xaiHelp,
    kimi: a.kimiHelp,
    agy: a.agyHelp,
  }[service.id];
  const emptyText = {
    claude: a.claudeEmpty,
    kimi: a.kimiEmpty,
    agy: a.agyEmpty,
  }[service.id as 'claude' | 'kimi' | 'agy'] ?? fill(a.empty, { service: service.name });

  // The demo "authorizes" a few seconds after the sign-in starts.
  useEffect(() => {
    if (!pending || pending.kind === 'choose') return;
    const timer = window.setTimeout(() => {
      if (pending.kind === 'reauth') {
        setAccounts((current) =>
          current.map((account) => (account.login === pending.login ? { ...account, needsReauth: false, checkedMinutesAgo: 0 } : account)),
        );
        toast({ text: fill(a.toastReauthed, { login: pending.login ?? '' }) });
      } else {
        setAccounts((current) => [
          ...current.filter((account) => account.login !== NEW_ACCOUNT[service.id].login),
          {
            ...NEW_ACCOUNT[service.id],
            signedIn: { zh: '今天', en: 'today', ja: '今日' },
            // Claude has no default account; the other groups' first account becomes it.
            isDefault: service.id !== 'claude' && current.length === 0,
            checkedMinutesAgo: 0,
          },
        ]);
        toast({ text: fill(a.toastAdded, { service: service.name }) });
      }
      setPending(null);
    }, 3500);
    return () => window.clearTimeout(timer);
  }, [pending, service, a, toast]);

  const startAdd = () => setPending(service.chooser ? { kind: 'choose' } : { kind: 'add' });

  const setDefault = (login: string) => {
    setAccounts((current) => current.map((other) => ({ ...other, isDefault: other.login === login })));
    if (service.id === 'agy') toast({ text: a.agySwitched });
  };

  return (
    <section className="rounded-[10px] border border-border bg-[var(--app-surface)]">
      <div className="flex h-[52px] items-center gap-3 pe-2.5 ps-4">
        <span className="flex h-7 w-7 items-center justify-center">
          <ServiceIcon service={service} />
        </span>
        <div className="flex min-w-0 flex-1 items-center gap-0.5">
          <h4 className="truncate text-sm font-semibold text-foreground">{service.name}</h4>
          <HelpTip title={fill(a.groupHelpTitle, { service: service.name })} body={help} />
        </div>
        <Btn compact icon={Plus} className="pe-3 ps-2.5" onClick={() => !pending && startAdd()} hideLabelOnMobile>
          {a.addAccount}
        </Btn>
      </div>

      {accounts.map((account) => (
        <AccountRow
          key={account.login}
          service={service.id}
          account={account}
          onSetDefault={() => setDefault(account.login)}
          onReauth={() => setPending({ kind: 'reauth', login: account.login })}
          onRemove={() => setAccounts((current) => current.filter((other) => other.login !== account.login))}
        />
      ))}

      {accounts.length === 0 && (
        <div className="border-t border-border py-3.5 pe-3 ps-4 text-xs text-[var(--app-fg2)]">{emptyText}</div>
      )}

      {pending?.kind === 'choose' &&
        (service.chooser === 'kimi' ? (
          <KimiChooser onCancel={() => setPending(null)} onLogin={() => setPending({ kind: 'add' })} />
        ) : (
          <CopilotChooser onCancel={() => setPending(null)} onLogin={() => setPending({ kind: 'add' })} />
        ))}

      {pending && pending.kind !== 'choose' && (
        <div className="mx-3 mb-3 flex flex-col gap-2 rounded-lg bg-[var(--app-subtle)] px-3.5 py-3">
          <div className="flex items-center gap-2">
            <Loader2 className="h-[15px] w-[15px] animate-spin text-[var(--app-fg2)]" />
            <span className="min-w-0 flex-1 truncate text-[13px] font-medium">
              {pending.kind === 'reauth'
                ? fill(a.pendingReauth, { login: pending.login ?? '' })
                : fill(a.pendingAdd, { service: service.name })}
            </span>
            <Btn compact onClick={() => setPending(null)}>
              {p.common.cancel}
            </Btn>
          </div>
          {service.login === 'browser' ? (
            <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--app-fg2)]">
              <span className="min-w-0 flex-1">{fill(a.browserNote, { service: service.name })}</span>
              <Btn compact variant="quiet" icon={ExternalLink}>
                {a.reopenPage}
              </Btn>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2 text-[13px]">
                <span className="text-[var(--app-fg2)]">{a.enterCode}</span>
                <span className="inline-flex h-7 items-center rounded-md border border-[var(--app-border-strong)] bg-[var(--app-surface)] px-2.5 font-mono text-[15px] tracking-[1px]">
                  8F2K-4QXM
                </span>
                <IconBtn icon={Copy} label={a.copyCode} onClick={() => toast({ text: a.codeCopied })} />
                <IconBtn icon={ExternalLink} label={a.openPage} />
              </div>
              <p className="text-xs text-[var(--app-fg2)]">{fill(a.pendingNote, { service: service.name })}</p>
            </>
          )}
        </div>
      )}
    </section>
  );
}

function AccountRow({
  service,
  account,
  onSetDefault,
  onReauth,
  onRemove,
}: {
  service: AuthService;
  account: SampleAccount;
  onSetDefault: () => void;
  onReauth: () => void;
  onRemove: () => void;
}) {
  const { t, language } = useLanguage();
  const p = t.demo.window.pages;
  const a = p.auth;
  const [checked, setChecked] = useState(account.checkedMinutesAgo);
  const [refreshing, setRefreshing] = useState(false);
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const refresh = () => {
    setRefreshing(true);
    timer.current = window.setTimeout(() => {
      setRefreshing(false);
      setChecked(0);
    }, 900);
  };

  // Each group words its row the way its section in the app does.
  const signedIn = account.signedIn[language];
  const details =
    service === 'claude'
      ? [account.plan, fill(a.addedOn, { date: signedIn })]
      : service === 'kimi'
        ? [account.region === 'global' ? a.kimiGlobal : a.kimiMainland, account.primary ? a.kimiPrimary : undefined]
        : service === 'agy'
          ? [fill(a.addedOn, { date: signedIn })]
          : [account.host, fill(a.signedInOn, { date: signedIn }), fill(a.usedBy, { count: account.usedBy ?? 0 })];
  const meta = details.filter(Boolean).join(' · ');
  const defaultLabel = service === 'kimi' ? a.kimiCurrent : service === 'agy' ? a.agyCurrent : a.default;
  const setDefaultLabel = service === 'kimi' ? a.kimiUseAccount : service === 'agy' ? a.agySwitchTo : a.setDefault;
  // Claude has no default account; Copilot can't sign in again; Claude only offers it once expired.
  const canSetDefault = service !== 'claude' && !account.isDefault && !account.needsReauth;
  const canReauth = service !== 'copilot' && (service !== 'claude' || account.needsReauth);
  const removeLabel = service === 'kimi' && account.primary ? a.kimiDismiss : a.removeAccount;

  return (
    <div className="flex min-h-[56px] items-center gap-3 border-t border-border py-2 pe-2.5 ps-4">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-[var(--app-subtle)] text-xs font-semibold uppercase text-[var(--app-fg2)]">
        {account.login[0]}
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="truncate text-[13px] font-medium text-foreground">{account.login}</span>
          {account.isDefault && <Pill>{defaultLabel}</Pill>}
          {account.needsReauth && <Pill tone="danger">{a.needsReauth}</Pill>}
        </div>
        <span className="truncate text-xs text-[var(--app-fg2)]">{account.needsReauth ? a.xaiReauthNote : meta}</span>
      </div>

      {account.needsReauth ? (
        canReauth && (
          <Btn compact onClick={onReauth} className="hidden sm:inline-flex">
            {a.reauth}
          </Btn>
        )
      ) : (
        <>
          <div className="hidden w-[212px] shrink-0 flex-col gap-0.5 md:flex">
            {account.noSubscription && <span className="text-end text-xs text-[var(--app-fg2)]">{a.kimiNoSubscription}</span>}
            {account.quota.map((quota) => (
              <div key={quota.tier} className="flex h-[18px] items-center gap-2 text-xs">
                <span className="min-w-[52px] shrink-0 whitespace-nowrap text-[var(--app-fg2)]">{a[quota.tier]}</span>
                <span className="relative h-1 min-w-[24px] flex-1 rounded-full bg-[var(--app-chart-grid)]">
                  <span
                    className={cn('absolute inset-y-0 start-0 rounded-full', QUOTA_TONE_FILL[quotaTone(quota.left)])}
                    style={{ width: `${quota.left}%` }}
                  />
                </span>
                <span className={cn('min-w-14 shrink-0 whitespace-nowrap text-end tabular-nums', QUOTA_TONE_TEXT[quotaTone(quota.left)])}>
                  {quota.left === 0 ? a.usedUp : fill(a.quotaLeft, { value: quota.left })}
                </span>
              </div>
            ))}
            {account.resetCredits && <ResetCreditsRow groups={account.resetCredits} />}
            {account.credits && <CreditsRow balance={account.credits} />}
          </div>
          <div className="hidden w-[84px] shrink-0 items-center justify-end gap-0.5 text-xs text-[var(--app-fg3)] sm:flex">
            <span className="truncate">
              {refreshing ? a.updating : checked === 0 ? p.common.justNow : fill(p.common.minutesAgo, { count: checked })}
            </span>
            <button
              type="button"
              onClick={refresh}
              aria-label={a.refresh}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[var(--app-fg2)] hover:bg-[var(--app-subtle)]"
            >
              <RefreshCw className={cn('h-[13px] w-[13px]', refreshing && 'animate-spin')} strokeWidth={1.5} />
            </button>
          </div>
        </>
      )}

      <MoreMenu
        label={t.demo.window.more}
        width="w-[176px]"
        items={[
          ...(canSetDefault ? [{ label: setDefaultLabel, onSelect: onSetDefault }] : []),
          ...(canReauth ? [{ label: a.reauth, onSelect: onReauth }] : []),
          { label: removeLabel, danger: true, onSelect: onRemove },
        ]}
      />
    </div>
  );
}

/** Kimi asks for the sign-in region first (KimiAccountLogin). */
function KimiChooser({ onCancel, onLogin }: { onCancel: () => void; onLogin: () => void }) {
  const { t } = useLanguage();
  const p = t.demo.window.pages;
  const a = p.auth;
  const [region, setRegion] = useState<'mainland-cn' | 'global'>('mainland-cn');
  return (
    <div className="mx-3 mb-3 flex flex-col gap-2.5 rounded-lg border border-border px-3.5 py-3">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-[13px] text-[var(--app-fg2)]">{a.kimiRegion}</span>
        <Segmented
          small
          layoutId="demo-kimi-region"
          value={region}
          onChange={setRegion}
          items={[
            { id: 'mainland-cn', label: a.kimiMainland },
            { id: 'global', label: a.kimiGlobal },
          ]}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Btn compact onClick={onCancel}>
          {p.common.cancel}
        </Btn>
        <Btn compact variant="solid" onClick={onLogin}>
          {a.kimiSignIn}
        </Btn>
      </div>
    </div>
  );
}

function CopilotChooser({ onCancel, onLogin }: { onCancel: () => void; onLogin: () => void }) {
  const { t } = useLanguage();
  const p = t.demo.window.pages;
  const a = p.auth;
  const [deployment, setDeployment] = useState<'com' | 'enterprise'>('com');
  return (
    <div className="mx-3 mb-3 flex flex-col gap-3 rounded-lg border border-border px-3.5 py-3">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-[13px] text-[var(--app-fg2)]">{a.deploymentType}</span>
        <Segmented
          small
          layoutId="demo-copilot-deployment"
          value={deployment}
          onChange={setDeployment}
          items={[
            { id: 'com', label: 'GitHub.com' },
            { id: 'enterprise', label: 'GitHub Enterprise Server' },
          ]}
        />
      </div>
      {deployment === 'enterprise' && (
        <label className="flex flex-wrap items-center gap-3 text-[13px] text-[var(--app-fg2)]">
          {a.enterpriseDomain}
          <input
            placeholder={a.enterprisePlaceholder}
            className="h-8 w-[260px] max-w-full rounded-md border border-[var(--app-border-strong)] bg-[var(--app-surface)] px-2.5 text-[13px] text-foreground outline-none placeholder:text-[var(--app-fg3)] focus:border-[var(--app-action)]"
          />
        </label>
      )}
      <div className="flex justify-end gap-2">
        <Btn compact onClick={onCancel}>
          {p.common.cancel}
        </Btn>
        <Btn compact variant="solid" onClick={onLogin}>
          {a.loginWithGitHub}
        </Btn>
      </div>
    </div>
  );
}

/** 1 Credit = $0.04 at API prices (cc-switch quotaRules.ts CODEX_USD_PER_CREDIT). */
const USD_PER_CREDIT = 0.04;
const QUOTA_ROW = 'flex h-[18px] items-center gap-2 text-xs';

/**
 * ChatGPT's saved limit resets (cc-switch AccountQuota + QuotaBreakdown): the row shows the
 * earliest expiry; with more than one reset the whole row opens the per-day list.
 */
function ResetCreditsRow({ groups }: { groups: NonNullable<SampleAccount['resetCredits']> }) {
  const { t, language } = useLanguage();
  const a = t.demo.window.pages.auth;
  const [open, setOpen] = useState(false);
  const anchor = useRef<HTMLButtonElement>(null);
  const count = groups.reduce((sum, group) => sum + group.count, 0);
  const soon = groups[0].expiringSoon;
  const value = fill(a.resetValue, { count });
  const cells = (
    <>
      <span className="min-w-[52px] shrink-0 whitespace-nowrap text-[var(--app-fg2)]">{a.resetLabel}</span>
      <span className="flex min-w-0 flex-1 items-center gap-0.5 text-[var(--app-fg3)]">
        <span className="truncate">{fill(a.resetExpiresOn, { date: groups[0].date[language] })}</span>
        {count > 1 && <ChevronDown className={cn('h-3 w-3 shrink-0 transition-transform', open && 'rotate-180')} strokeWidth={1.5} />}
      </span>
      <span className={cn('w-14 shrink-0 whitespace-nowrap text-end tabular-nums', soon ? 'text-[var(--app-warning-text)]' : 'text-foreground')}>
        {value}
      </span>
    </>
  );

  // A single reset is already spelled out in the row; nothing to open.
  if (count === 1) return <div className={QUOTA_ROW}>{cells}</div>;

  return (
    <>
      <button
        ref={anchor}
        type="button"
        aria-label={fill(a.resetShowAll, { count })}
        onClick={() => setOpen((current) => !current)}
        className={cn(QUOTA_ROW, '-mx-1 rounded-md px-1 text-start transition-colors hover:bg-[var(--app-subtle)]', open && 'bg-[var(--app-subtle)]')}
      >
        {cells}
      </button>
      <Floating anchor={anchor} open={open} onClose={() => setOpen(false)} align="start" className="w-[236px] p-3">
        <div className="mb-2 flex items-baseline justify-between gap-3 text-xs">
          <span className="font-medium text-foreground">{a.resetTitle}</span>
          <span className="whitespace-nowrap tabular-nums text-[var(--app-fg2)]">{value}</span>
        </div>
        <ul className="flex flex-col gap-1 text-xs">
          {groups.map((group) => (
            <li key={group.date.en} className="flex items-center gap-2">
              <span className={cn('whitespace-nowrap', group.expiringSoon ? 'text-[var(--app-warning-text)]' : 'text-foreground')}>
                {group.date[language]}
              </span>
              <span className="min-w-0 flex-1 truncate text-[var(--app-fg3)]">{fill(a.resetInTime, { time: group.inTime })}</span>
              <span className="whitespace-nowrap text-end tabular-nums text-[var(--app-fg2)]">{fill(a.resetTimes, { count: group.count })}</span>
            </li>
          ))}
        </ul>
      </Floating>
    </>
  );
}

/** Codex Credits balance: the count where the bar would be, then the dollar figure last. */
function CreditsRow({ balance }: { balance: number }) {
  const { t, language } = useLanguage();
  const a = t.demo.window.pages.auth;
  const usd = Math.round(balance * USD_PER_CREDIT);
  return (
    <div className={QUOTA_ROW}>
      <span className="min-w-[52px] shrink-0 whitespace-nowrap text-[var(--app-fg2)]">{a.creditsLabel}</span>
      <span className="min-w-0 flex-1 truncate text-[var(--app-fg3)]">{new Intl.NumberFormat(language).format(balance)}</span>
      <span className="w-14 shrink-0 whitespace-nowrap text-end tabular-nums text-foreground">{fill(a.creditsUsd, { usd: `$${usd}` })}</span>
    </div>
  );
}
