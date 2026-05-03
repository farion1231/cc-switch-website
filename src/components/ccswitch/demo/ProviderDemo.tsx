import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Brain,
  Cpu,
  FolderOpen,
  History,
  KeyRound,
  LayoutDashboard,
  Plus,
  Server,
  Settings,
  Shield,
  Wifi,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { ProviderList } from '@/components/ccswitch/ProviderCard';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n/useLanguage';
import {
  claudeProviders,
  codexProviders,
  geminiProviders,
  hermesProviders,
  openClawProviders,
  opencodeProviders,
  type Provider,
} from '@/content/providers';

import claudeIcon from '@/assets/icons/claude.svg';
import geminiIcon from '@/assets/icons/gemini.svg';
import hermesIcon from '@/assets/icons/hermes.png';
import openaiIcon from '@/assets/icons/openai.svg';
import openClawIcon from '@/assets/icons/openclaw.svg';
import openCodeIcon from '@/assets/icons/opencode.svg';

type CliTabId = 'claude' | 'codex' | 'gemini' | 'opencode' | 'openclaw' | 'hermes';

const cliTabs = [
  { id: 'claude', label: 'Claude', icon: claudeIcon },
  { id: 'codex', label: 'Codex', icon: openaiIcon },
  { id: 'gemini', label: 'Gemini', icon: geminiIcon },
  { id: 'opencode', label: 'OpenCode', icon: openCodeIcon },
  { id: 'openclaw', label: 'OpenClaw', icon: openClawIcon },
  { id: 'hermes', label: 'Hermes', icon: hermesIcon },
] satisfies Array<{ id: CliTabId; label: string; icon: string }>;

const initialProviderLists: Record<CliTabId, Provider[]> = {
  claude: claudeProviders,
  codex: codexProviders,
  gemini: geminiProviders,
  opencode: opencodeProviders,
  openclaw: openClawProviders,
  hermes: hermesProviders,
};

interface ToolbarAction {
  key: string;
  icon: LucideIcon;
}

const defaultToolbarActions: ToolbarAction[] = [
  { key: 'skills', icon: Wrench },
  { key: 'prompts', icon: BookOpen },
  { key: 'sessions', icon: History },
  { key: 'mcp', icon: Server },
];

const toolbarActionsByApp: Record<CliTabId, ToolbarAction[]> = {
  claude: defaultToolbarActions,
  codex: defaultToolbarActions,
  gemini: defaultToolbarActions,
  opencode: defaultToolbarActions,
  openclaw: [
    { key: 'workspace', icon: FolderOpen },
    { key: 'env', icon: KeyRound },
    { key: 'tools', icon: Shield },
    { key: 'agents', icon: Cpu },
    { key: 'sessions', icon: History },
  ],
  hermes: [
    { key: 'skills', icon: Wrench },
    { key: 'memory', icon: Brain },
    { key: 'dashboard', icon: LayoutDashboard },
    { key: 'mcp', icon: Server },
  ],
};

export function ProviderContent() {
  const { t } = useLanguage();
  const [proxyEnabled, setProxyEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<CliTabId>('claude');
  const [activeProvider, setActiveProvider] = useState(0);
  const [providerLists, setProviderLists] = useState(initialProviderLists);
  const toolbarActions = toolbarActionsByApp[activeTab];

  const handleTabChange = (tabId: CliTabId) => {
    setActiveTab(tabId);
    setActiveProvider(0);
  };

  const setCurrentProviders = (providers: Provider[]) => {
    setProviderLists((currentLists) => ({
      ...currentLists,
      [activeTab]: providers,
    }));
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
        <div className="flex items-center gap-3">
          <span className="text-base font-semibold text-emerald-500">CC Switch</span>
          <Settings className="w-4 h-4 text-muted-foreground" />
          <div className="flex items-center gap-2">
            <Wifi
              className={cn(
                'w-4 h-4 transition-colors',
                proxyEnabled ? 'text-emerald-500 animate-pulse' : 'text-muted-foreground',
              )}
            />
            <span
              className={cn(
                'text-sm transition-colors',
                proxyEnabled ? 'text-emerald-500' : 'text-muted-foreground',
              )}
            >
              {t.demo.localRouting}
            </span>
            <button
              type="button"
              onClick={() => setProxyEnabled((enabled) => !enabled)}
              className={cn(
                'w-10 h-[22px] rounded-full flex items-center px-0.5 transition-colors',
                proxyEnabled ? 'bg-emerald-500' : 'bg-muted-foreground/30',
              )}
              aria-pressed={proxyEnabled}
            >
              <motion.div
                animate={{ x: proxyEnabled ? 18 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="w-[18px] h-[18px] bg-white rounded-full shadow-sm"
              />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">

          <div className="inline-flex items-center bg-muted/80 rounded-xl p-1 gap-1">
            {cliTabs.map((tab) => (
              <motion.button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                title={tab.label}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'relative inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-all duration-200',
                  activeTab === tab.id
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50',
                )}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="demo-tab-bg"
                    className="absolute inset-0 bg-background rounded-md shadow-sm"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <img src={tab.icon} alt={tab.label} className="relative z-10 w-5 h-5" />
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-3 bg-muted/80 rounded-lg px-3.5 py-2">
              {toolbarActions.map(({ key, icon: Icon }) => (
                <motion.div
                  key={`${activeTab}-${key}`}
                  whileHover={{ scale: 1.15, color: 'hsl(var(--primary))' }}
                  className="cursor-pointer"
                  title={t.demo.toolbar[key as keyof typeof t.demo.toolbar]}
                >
                  <Icon className="w-4 h-4 text-muted-foreground transition-colors" />
                </motion.div>
              ))}
            </div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-6 h-6 rounded-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
            </motion.button>
          </div>
        </div>
      </div>

      <ProviderList
        providers={providerLists[activeTab]}
        activeProvider={activeProvider}
        proxyEnabled={proxyEnabled}
        onSelectProvider={setActiveProvider}
        onReorderProviders={setCurrentProviders}
        compact={false}
        animationKey={`demo-${activeTab}`}
      />
    </div>
  );
}
