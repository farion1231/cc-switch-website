import { useEffect, useRef, useState } from 'react';
import { Copy, ExternalLink, KeyRound, Loader2, Plus, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n/useLanguage';
import copilotIconSvg from '@/assets/icons/githubcopilot.svg?raw';
import openaiIconSvg from '@/assets/icons/openai.svg?raw';
import grokIconSvg from '@/assets/icons/grok.svg?raw';
import { InlineSvgIcon } from '@/components/ccswitch/InlineSvgIcon';
import { fill } from './apps';
import { Btn, HelpTip, IconBtn, MoreMenu, PaneHeader, Pill, Segmented } from './parts';
import { ACCOUNTS, type AuthService, type SampleAccount } from './samples';
import { useShell } from './shellContext';

const SERVICES: Array<{ id: AuthService; name: string; icon: string }> = [
  { id: 'copilot', name: 'GitHub Copilot', icon: copilotIconSvg },
  { id: 'chatgpt', name: 'ChatGPT', icon: openaiIconSvg },
  { id: 'xai', name: 'xAI', icon: grokIconSvg },
];

/** What the card is waiting for: a device-code sign-in, or the Copilot deployment chooser. */
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

function ServiceCard({ service }: { service: (typeof SERVICES)[number] }) {
  const { t } = useLanguage();
  const { toast } = useShell();
  const p = t.demo.window.pages;
  const a = p.auth;
  const [accounts, setAccounts] = useState<SampleAccount[]>(ACCOUNTS[service.id]);
  const [pending, setPending] = useState<Pending>(null);
  const help = { copilot: a.copilotHelp, chatgpt: a.chatgptHelp, xai: a.xaiHelp }[service.id];

  // The demo "authorizes" a few seconds after the code shows up.
  useEffect(() => {
    if (!pending || pending.kind === 'choose') return;
    const timer = window.setTimeout(() => {
      if (pending.kind === 'reauth') {
        setAccounts((current) =>
          current.map((account) => (account.login === pending.login ? { ...account, needsReauth: false, checkedMinutesAgo: 0 } : account)),
        );
        toast({ text: fill(a.toastReauthed, { login: pending.login ?? '' }) });
      } else {
        const login = service.id === 'copilot' ? 'mona' : service.id === 'chatgpt' ? 'me@example.com' : 'grok-dev';
        setAccounts((current) => [
          ...current,
          {
            login,
            host: service.id === 'copilot' ? 'github.com' : undefined,
            signedIn: { zh: '今天', en: 'today', ja: '今日' },
            usedBy: 0,
            isDefault: current.length === 0,
            quota: service.id === 'chatgpt' ? [{ tier: 'fiveHour', left: 100 }, { tier: 'weekly', left: 100 }] : service.id === 'copilot' ? [{ tier: 'premium', left: 100 }] : [{ tier: 'weekly', left: 100 }],
            checkedMinutesAgo: 0,
          },
        ]);
        toast({ text: fill(a.toastAdded, { service: service.name }) });
      }
      setPending(null);
    }, 3500);
    return () => window.clearTimeout(timer);
  }, [pending, service, a, toast]);

  const startAdd = () => setPending(service.id === 'copilot' ? { kind: 'choose' } : { kind: 'add' });

  return (
    <section className="rounded-[10px] border border-border bg-[var(--app-surface)]">
      <div className="flex h-[52px] items-center gap-3 pe-2.5 ps-4">
        <span className="flex h-7 w-7 items-center justify-center">
          <InlineSvgIcon svg={service.icon} label={service.name} color="currentColor" className="h-5 w-5" />
        </span>
        <div className="flex min-w-0 items-center gap-0.5">
          <h4 className="truncate text-sm font-semibold text-foreground">{service.name}</h4>
          <HelpTip title={fill(a.groupHelpTitle, { service: service.name })} body={help} />
        </div>
        <span className="flex-1" />
        {accounts.length > 0 && (
          <Btn compact icon={Plus} className="pe-3 ps-2.5" onClick={startAdd} hideLabelOnMobile>
            {a.addAccount}
          </Btn>
        )}
        {accounts.length > 1 && (
          <MoreMenu label={t.demo.window.more} width="w-[168px]" items={[{ label: a.removeAll, danger: true, onSelect: () => setAccounts([]) }]} />
        )}
      </div>

      {accounts.map((account) => (
        <AccountRow
          key={account.login}
          service={service.id}
          account={account}
          onSetDefault={() => setAccounts((current) => current.map((other) => ({ ...other, isDefault: other.login === account.login })))}
          onReauth={() => setPending({ kind: 'reauth', login: account.login })}
          onRemove={() => setAccounts((current) => current.filter((other) => other.login !== account.login))}
        />
      ))}

      {accounts.length === 0 && !pending && (
        <div className="flex items-center gap-4 border-t border-border py-3.5 pe-3 ps-4">
          <span className="flex-1 text-xs text-[var(--app-fg2)]">{fill(a.empty, { service: service.name })}</span>
          <Btn compact onClick={startAdd}>
            {{ copilot: a.loginWithGitHub, chatgpt: a.loginWithChatGPT, xai: a.loginWithXai }[service.id]}
          </Btn>
        </div>
      )}

      {pending?.kind === 'choose' && <CopilotChooser onCancel={() => setPending(null)} onLogin={() => setPending({ kind: 'add' })} />}

      {pending && pending.kind !== 'choose' && (
        <div className="mx-3 mb-3 flex flex-col gap-2 rounded-lg bg-[var(--app-subtle)] px-3.5 py-3">
          <div className="flex items-center gap-2">
            <Loader2 className="h-[15px] w-[15px] animate-spin text-[var(--app-fg2)]" />
            <span className="min-w-0 flex-1 truncate text-[13px] font-medium">
              {pending.kind === 'reauth'
                ? fill(a.pendingReauth, { login: pending.login ?? '' })
                : accounts.length === 0
                  ? fill(a.pendingLogin, { service: service.name })
                  : fill(a.pendingAdd, { service: service.name })}
            </span>
            <Btn compact onClick={() => setPending(null)}>
              {p.common.cancel}
            </Btn>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[13px]">
            <span className="text-[var(--app-fg2)]">{a.enterCode}</span>
            <span className="inline-flex h-7 items-center rounded-md border border-[var(--app-border-strong)] bg-[var(--app-surface)] px-2.5 font-mono text-[15px] tracking-[1px]">
              8F2K-4QXM
            </span>
            <IconBtn icon={Copy} label={a.copyCode} onClick={() => toast({ text: a.codeCopied })} />
            <IconBtn icon={ExternalLink} label={a.openPage} />
          </div>
          <p className="text-xs text-[var(--app-fg2)]">{fill(a.pendingNote, { service: service.name })}</p>
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

  const meta = [account.host, fill(a.signedInOn, { date: account.signedIn[language] }), fill(a.usedBy, { count: account.usedBy })]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="flex min-h-[56px] items-center gap-3 border-t border-border py-2 pe-2.5 ps-4">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-[var(--app-subtle)] text-xs font-semibold uppercase text-[var(--app-fg2)]">
        {account.login[0]}
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="truncate text-[13px] font-medium text-foreground">{account.login}</span>
          {account.isDefault && <Pill>{a.default}</Pill>}
          {account.needsReauth && <Pill tone="danger">{a.needsReauth}</Pill>}
        </div>
        <span className="truncate text-xs text-[var(--app-fg2)]">{account.needsReauth ? a.xaiReauthNote : meta}</span>
      </div>

      {account.needsReauth ? (
        <Btn compact onClick={onReauth} className="hidden sm:inline-flex">
          {a.reauth}
        </Btn>
      ) : (
        <>
          <div className="hidden w-[212px] shrink-0 flex-col gap-0.5 md:flex">
            {account.quota.map((quota) => {
              const label = quota.tier === 'premium' ? a.premium : quota.tier === 'fiveHour' ? a.fiveHour : a.weekly;
              return (
                <div key={quota.tier} className="flex h-[18px] items-center gap-2 text-xs">
                  <span className="min-w-[52px] text-[var(--app-fg2)]">{label}</span>
                  <span className="relative h-1 flex-1 rounded-full bg-[var(--app-chart-grid)]">
                    <span
                      className={cn(
                        'absolute inset-y-0 start-0 rounded-full',
                        quota.left === 0 ? 'bg-[var(--app-danger)]' : quota.left < 10 ? 'bg-[var(--app-warning)]' : 'bg-[var(--app-chart)]',
                      )}
                      style={{ width: `${quota.left}%` }}
                    />
                  </span>
                  <span className="w-14 text-end tabular-nums text-foreground">
                    {quota.left === 0 ? a.usedUp : fill(a.quotaLeft, { value: quota.left })}
                  </span>
                </div>
              );
            })}
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
        width="w-[160px]"
        items={[
          ...(!account.isDefault && !account.needsReauth ? [{ label: a.setDefault, onSelect: onSetDefault }] : []),
          ...(service !== 'copilot' ? [{ label: a.reauth, onSelect: onReauth }] : []),
          { label: a.removeAccount, danger: true, onSelect: onRemove },
        ]}
      />
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
