import { useState, type ReactNode } from 'react';
import { Activity, ChevronUp, Clock, ListOrdered, Server, TrendingUp } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { claudeProviders, codexProviders, geminiProviders } from '@/content/providers';
import { useLanguage } from '@/i18n/useLanguage';

import claudeIcon from '@/assets/icons/claude.svg';
import geminiIcon from '@/assets/icons/gemini.svg';
import openaiIcon from '@/assets/icons/openai.svg';

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
      icon: <img src={openaiIcon} alt="Codex" className="w-5 h-5" />,
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
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Server className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{t.demo.proxy.localProxy}</h3>
            <p className="text-sm text-muted-foreground">{t.demo.proxy.proxyDescription}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
          <span
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5',
              proxyRunning ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground',
            )}
          >
            <Activity className="w-3 h-3" /> {proxyRunning ? t.demo.proxy.running : t.demo.proxy.stopped}
          </span>
          <Switch checked={proxyRunning} onCheckedChange={setProxyRunning} className="data-[state=checked]:bg-primary" />
        </div>
      </div>

      <div className="p-5 rounded-xl border border-border bg-card mb-6">
        <div className="text-sm text-muted-foreground mb-2">{t.demo.proxy.serviceAddress}</div>
        <div className="flex items-center justify-between">
          <code className="text-lg font-mono text-foreground">http://127.0.0.1:15721</code>
          <button type="button" className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors">
            {t.demo.proxy.copy}
          </button>
        </div>
        <p className="text-sm text-muted-foreground mt-2">{t.demo.proxy.addressNote}</p>
      </div>

      <div className="mb-6 pb-4 border-b border-border">
        <div className="text-sm text-muted-foreground mb-1">{t.provider.inUse}</div>
        <p className={proxyRunning ? 'text-emerald-500' : 'text-amber-500'}>
          {proxyRunning
            ? `${t.demo.proxy.currentProvider}：PackyCode (Claude Opus 4.7)`
            : `${t.demo.proxy.currentProvider}：${t.demo.proxy.waitingRequest}`}
        </p>
      </div>

      <div className="mb-6">
        <div className="text-sm text-muted-foreground mb-3">{t.demo.proxy.proxyEnable}</div>
        <div className="flex gap-4">
          {proxyToggles.map((item) => (
            <div key={item.name} className="flex-1 flex items-center justify-between p-3 rounded-xl border border-border bg-card">
              <span className="flex items-center gap-2 font-medium text-foreground">
                {item.icon}
                {item.name}
              </span>
              <Switch checked={item.enabled} onCheckedChange={item.setEnabled} className="data-[state=checked]:bg-primary" />
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 mb-6 flex items-center justify-between">
        <div>
          <div className="font-medium text-foreground">{t.demo.proxy.enableLogging}</div>
          <div className="text-sm text-muted-foreground">{t.demo.proxy.loggingNote}</div>
        </div>
        <Switch checked={logEnabled} onCheckedChange={setLogEnabled} className="data-[state=checked]:bg-primary" />
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <ListOrdered className="w-4 h-4" />
          {t.demo.proxy.failoverQueue}
        </div>

        {Object.entries(failoverQueues).map(([category, items]) => (
          <div key={category} className="mb-4">
            <div className="text-sm text-muted-foreground mb-2 pl-2 border-l-2 border-border">{category}</div>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.name} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card">
                  <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
                    {item.rank}
                  </span>
                  <div className="flex-1">
                    <span className="font-medium text-foreground">{item.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">{item.subtitle}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={cn(
              'p-4 rounded-xl border',
              stat.highlight ? 'border-primary/30 bg-primary/5' : 'border-border bg-card',
            )}
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <stat.icon className="w-4 h-4" />
              {stat.label}
            </div>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
