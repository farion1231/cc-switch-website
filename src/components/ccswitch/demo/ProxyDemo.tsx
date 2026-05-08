import { useState, type ReactNode } from 'react';
import { Activity, ChevronUp, Clock, ListOrdered, Server, TrendingUp } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { claudeProviders, codexProviders, geminiProviders } from '@/content/providers';
import { useLanguage } from '@/i18n/useLanguage';
import { InlineSvgIcon } from '@/components/ccswitch/InlineSvgIcon';

import claudeIcon from '@/assets/icons/claude.svg';
import geminiIcon from '@/assets/icons/gemini.svg';
import openaiIconSvg from '@/assets/icons/openai.svg?raw';

interface ProxyToggle {
  name: string;
  icon: ReactNode;
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

export function ProxyContent() {
  const { t } = useLanguage();
  const [proxyRunning, setProxyRunning] = useState(true);
  const [claudeEnabled, setClaudeEnabled] = useState(true);
  const [codexEnabled, setCodexEnabled] = useState(true);
  const [geminiEnabled, setGeminiEnabled] = useState(false);
  const [logEnabled, setLogEnabled] = useState(true);

  const failoverQueues = {
    Claude: [
      { rank: 1, name: claudeProviders[0].name, subtitle: claudeProviders[0].subtitle, status: t.demo.proxy.normal },
      { rank: 2, name: claudeProviders[1].name, subtitle: claudeProviders[1].subtitle, status: t.demo.proxy.normal },
    ],
    Codex: [
      { rank: 1, name: codexProviders[0].name, subtitle: codexProviders[0].subtitle, status: t.demo.proxy.normal },
      { rank: 2, name: codexProviders[2].name, subtitle: codexProviders[2].subtitle, status: t.demo.proxy.normal },
    ],
    Gemini: [
      { rank: 1, name: geminiProviders[0].name, subtitle: geminiProviders[0].subtitle, status: t.demo.proxy.normal },
      { rank: 2, name: geminiProviders[1].name, subtitle: geminiProviders[1].subtitle, status: t.demo.proxy.normal },
    ],
  };

  const proxyToggles: ProxyToggle[] = [
    {
      name: 'Claude',
      icon: <img src={claudeIcon} alt="Claude" className="w-5 h-5" />,
      enabled: claudeEnabled,
      setEnabled: setClaudeEnabled,
    },
    {
      name: 'Codex',
      icon: <InlineSvgIcon svg={openaiIconSvg} label="Codex" className="h-5 w-5" />,
      enabled: codexEnabled,
      setEnabled: setCodexEnabled,
    },
    {
      name: 'Gemini',
      icon: <img src={geminiIcon} alt="Gemini" className="w-5 h-5" />,
      enabled: geminiEnabled,
      setEnabled: setGeminiEnabled,
    },
  ];

  const stats = [
    { icon: Activity, label: t.demo.proxy.activeConnections, value: '12' },
    { icon: TrendingUp, label: t.demo.proxy.totalRequests, value: '1,847' },
    { icon: Clock, label: t.demo.proxy.successRate, value: '99.6%', highlight: true },
    { icon: Clock, label: t.demo.proxy.uptime, value: '2h 37m' },
  ];

  return (
    <div className="p-3 sm:p-4 md:p-6">
      <div className="mb-5 flex flex-col gap-4 sm:mb-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Server className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground">{t.demo.proxy.localProxy}</h3>
            <p className="text-sm text-muted-foreground">{t.demo.proxy.proxyDescription}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
          <span
            className={cn(
              'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium',
              proxyRunning ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground',
            )}
          >
            <Activity className="h-3 w-3" /> {proxyRunning ? t.demo.proxy.running : t.demo.proxy.stopped}
          </span>
          <Switch checked={proxyRunning} onCheckedChange={setProxyRunning} className="data-[state=checked]:bg-primary" />
        </div>
      </div>

      <div className="mb-5 rounded-xl border border-border bg-card p-4 sm:mb-6 sm:p-5">
        <div className="text-sm text-muted-foreground mb-2">{t.demo.proxy.serviceAddress}</div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <code className="break-all font-mono text-sm text-foreground sm:text-lg">http://127.0.0.1:15721</code>
          <button type="button" className="shrink-0 rounded-lg border border-border px-4 py-2 text-sm transition-colors hover:bg-muted">
            {t.demo.proxy.copy}
          </button>
        </div>
        <p className="text-sm text-muted-foreground mt-2">{t.demo.proxy.addressNote}</p>
      </div>

      <div className="mb-5 border-b border-border pb-4 sm:mb-6">
        <div className="text-sm text-muted-foreground mb-1">{t.provider.inUse}</div>
        <p className={cn('break-words text-sm sm:text-base', proxyRunning ? 'text-emerald-500' : 'text-amber-500')}>
          {proxyRunning
            ? `${t.demo.proxy.currentProvider}：PackyCode (Claude Opus 4.7)`
            : `${t.demo.proxy.currentProvider}：${t.demo.proxy.waitingRequest}`}
        </p>
      </div>

      <div className="mb-5 sm:mb-6">
        <div className="text-sm text-muted-foreground mb-3">{t.demo.proxy.proxyEnable}</div>
        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          {proxyToggles.map((item) => (
            <div key={item.name} className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
              <span className="flex items-center gap-2 font-medium text-foreground">
                {item.icon}
                {item.name}
              </span>
              <Switch checked={item.enabled} onCheckedChange={item.setEnabled} className="data-[state=checked]:bg-primary" />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800/30 dark:bg-amber-900/10 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="font-medium text-foreground">{t.demo.proxy.enableLogging}</div>
          <div className="text-sm text-muted-foreground">{t.demo.proxy.loggingNote}</div>
        </div>
        <Switch checked={logEnabled} onCheckedChange={setLogEnabled} className="data-[state=checked]:bg-primary" />
      </div>

      <div className="mb-5 sm:mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <ListOrdered className="h-4 w-4" />
          {t.demo.proxy.failoverQueue}
        </div>

        {Object.entries(failoverQueues).map(([category, items]) => (
          <div key={category} className="mb-4">
            <div className="text-sm text-muted-foreground mb-2 pl-2 border-l-2 border-border">{category}</div>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.name} className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
                    {item.rank}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-foreground">{item.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{item.subtitle}</span>
                  </div>
                  <span className="flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={cn(
              'rounded-xl border p-3 sm:p-4',
              stat.highlight ? 'border-primary/30 bg-primary/5' : 'border-border bg-card',
            )}
          >
            <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
              <stat.icon className="h-4 w-4 shrink-0" />
              {stat.label}
            </div>
            <div className="text-xl font-bold text-foreground sm:text-2xl">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
