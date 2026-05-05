import { useState, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
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
  const [activeAction, setActiveAction] = useState<{
    name: string;
    x: number;
    y: number;
    xDirection: 'left' | 'right';
    yDirection: 'up' | 'down';
  } | null>(null);
  const toolbarActions = toolbarActionsByApp[activeTab];

  const handleTabChange = (tabId: CliTabId) => {
    setActiveTab(tabId);
    setActiveProvider(0);
    setActiveAction(null);
  };

  const showActionName = (name: string, event: MouseEvent<HTMLElement>) => {
    setActiveAction({
      name,
      x: event.clientX,
      y: event.clientY,
      xDirection: event.clientX > window.innerWidth - 220 ? 'left' : 'right',
      yDirection: event.clientY > window.innerHeight - 80 ? 'up' : 'down',
    });
  };

  const hideActionName = () => {
    setActiveAction(null);
  };

  const getActionHoverProps = (name: string) => ({
    onMouseEnter: (event: MouseEvent<HTMLElement>) => showActionName(name, event),
    onMouseLeave: hideActionName,
  });

  const setCurrentProviders = (providers: Provider[]) => {
    setProviderLists((currentLists) => ({
      ...currentLists,
      [activeTab]: providers,
    }));
  };

  return (
    <>
      {activeAction &&
        createPortal(
          <motion.div
            key={activeAction.name}
            aria-live="polite"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.16 }}
            className="pointer-events-none fixed z-[9999] max-w-[min(14rem,calc(100vw_-_2rem))] rounded-lg border border-primary/20 bg-background/95 px-3 py-2 text-xs font-medium text-foreground shadow-lg shadow-black/10 backdrop-blur"
            style={{
              left: activeAction.x,
              top: activeAction.y,
              transform: `translate(${activeAction.xDirection === 'left' ? 'calc(-100% - 12px)' : '12px'}, ${
                activeAction.yDirection === 'up' ? 'calc(-100% - 12px)' : '12px'
              })`,
            }}
          >
            {activeAction.name}
          </motion.div>,
          document.body,
        )}

      <div className="p-3 sm:p-4 md:p-6">
        <div className="mb-4 flex flex-col gap-3 border-b border-border pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-base font-semibold text-emerald-500">CC Switch</span>
            <button
              type="button"
              {...getActionHoverProps(t.demo.actionNames.settings)}
              aria-label={t.demo.actionNames.settings}
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Settings className="h-4 w-4" />
            </button>
            <div className="flex min-w-0 items-center gap-2">
              <Wifi
                className={cn(
                  'h-4 w-4 shrink-0 transition-colors',
                  proxyEnabled ? 'text-emerald-500 animate-pulse' : 'text-muted-foreground',
                )}
              />
              <span
                className={cn(
                  'truncate text-sm transition-colors',
                  proxyEnabled ? 'text-emerald-500' : 'text-muted-foreground',
                )}
              >
                {t.demo.localRouting}
              </span>
              <button
                type="button"
                onClick={() => setProxyEnabled((enabled) => !enabled)}
                {...getActionHoverProps(t.demo.actionNames.localRouting)}
                className={cn(
                  'flex h-[22px] w-10 shrink-0 items-center rounded-full px-0.5 transition-colors',
                  proxyEnabled ? 'bg-emerald-500' : 'bg-muted-foreground/30',
                )}
                aria-pressed={proxyEnabled}
                aria-label={t.demo.actionNames.localRouting}
              >
                <motion.div
                  animate={{ x: proxyEnabled ? 18 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="h-[18px] w-[18px] rounded-full bg-white shadow-sm"
                />
              </button>
            </div>
          </div>
          <div className="flex w-full min-w-0 items-center gap-2 sm:w-auto sm:gap-3">

            <div className="inline-flex min-w-0 flex-1 items-center gap-1 overflow-x-auto rounded-xl bg-muted/80 p-1 sm:flex-none">
              {cliTabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  {...getActionHoverProps(tab.label)}
                  aria-label={tab.label}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-sm font-medium transition-all duration-200',
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

            <div className="flex shrink-0 items-center gap-2">
              <div className="hidden items-center gap-3 rounded-lg bg-muted/80 px-3.5 py-2 sm:flex">
                {toolbarActions.map(({ key, icon: Icon }) => (
                  <motion.button
                    key={`${activeTab}-${key}`}
                    type="button"
                    {...getActionHoverProps(t.demo.actionNames[key as keyof typeof t.demo.actionNames])}
                    whileHover={{ scale: 1.15, color: 'hsl(var(--primary))' }}
                    className="cursor-pointer rounded-md"
                    aria-label={t.demo.actionNames[key as keyof typeof t.demo.actionNames]}
                  >
                    <Icon className="w-4 h-4 text-muted-foreground transition-colors" />
                  </motion.button>
                ))}
              </div>
              <motion.button
                type="button"
                {...getActionHoverProps(t.demo.actionNames.addProvider)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 transition-colors hover:bg-orange-600 sm:h-6 sm:w-6"
                aria-label={t.demo.actionNames.addProvider}
              >
                <Plus className="h-4 w-4 text-white sm:h-3.5 sm:w-3.5" />
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
          onAction={showActionName}
          onActionEnd={hideActionName}
          compact={false}
          animationKey={`demo-${activeTab}`}
        />
      </div>
    </>
  );
}
