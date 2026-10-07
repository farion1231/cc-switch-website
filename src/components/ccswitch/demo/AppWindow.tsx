import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  ChevronsLeft,
  ChevronsRight,
  Database,
  Folder,
  Globe,
  History,
  Info,
  KeyRound,
  LayoutGrid,
  Route,
  Server,
  Settings,
  SlidersHorizontal,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n/useLanguage';
import ccSwitchLogo from '@/assets/cc-switch-logo.png';
import { useGitHubStats } from '@/hooks/useGitHubStars';
import { MacOsWindowBar } from '../MacOsWindowBar';
import { AppGlyph } from './AppGlyph';
import { demoAppById, demoApps, fill, type AppId } from './apps';
import { AppsPage } from './AppsPage';
import { AuthPane } from './AuthPane';
import { HoverTipProvider } from './HoverTip';
import { useHoverTip } from './hoverTipContext';
import { McpPane } from './McpPane';
import { PromptsPane } from './PromptsPane';
import { ProvidersPane } from './ProvidersPane';
import { SessionsPane } from './SessionsPane';
import { SettingsPane } from './SettingsPane';
import { ShellContext, type DemoToast, type GlobalPage } from './shellContext';
import { SkillsIcon, SkillsPane } from './SkillsPane';
import { initialAppState, type AppDemoState } from './state';
import { UsagePane } from './UsagePane';
import { todayCost, usd } from './usageData';

export type DemoScene = 'provider' | 'proxy' | 'stats';

type Page = { kind: 'app'; app: AppId } | { kind: GlobalPage };

const initialStates = () =>
  Object.fromEntries(demoApps.map((app) => [app.id, initialAppState(app)])) as Record<AppId, AppDemoState>;

interface AppWindowProps {
  /** Jump to a scene; a new nonce re-applies the same scene. */
  request?: { scene: DemoScene; nonce: number };
  /** Reports which scene the window currently shows (null on pages no tab covers), for the tabs above it. */
  onSceneChange?: (scene: DemoScene | null) => void;
  className?: string;
}

/** The v4 main window: sidebar on the left, the selected app's providers or a global page on the right. */
export function AppWindow(props: AppWindowProps) {
  return (
    <HoverTipProvider>
      <AppWindowInner {...props} />
    </HoverTipProvider>
  );
}

function AppWindowInner({ request, onSceneChange, className }: AppWindowProps) {
  const { t } = useLanguage();
  const [page, setPage] = useState<Page>({ kind: 'app', app: 'claude' });
  const [states, setStates] = useState(initialStates);
  const [collapsed, setCollapsed] = useState(false);
  const [visibleApps, setVisibleApps] = useState<AppId[]>(() => demoApps.map((app) => app.id));
  const [toast, setToast] = useState<(DemoToast & { id: number }) | null>(null);
  const toastId = useRef(0);
  const { hide } = useHoverTip();

  useEffect(() => {
    if (!request) return;
    hide();
    if (request.scene === 'stats') {
      setPage({ kind: 'usage' });
      return;
    }
    const app: AppId = request.scene === 'proxy' ? 'codex' : 'claude';
    setVisibleApps((current) => (current.includes(app) ? current : [...current, app]));
    setPage({ kind: 'app', app });
    setStates((current) => ({ ...current, [app]: { ...current[app], view: current[app].active } }));
  }, [request, hide]);

  const appState = page.kind === 'app' ? states[page.app] : null;
  const scene: DemoScene | null =
    page.kind === 'usage'
      ? 'stats'
      : appState
        ? appState.view !== 'direct' || appState.active !== 'direct'
          ? 'proxy'
          : 'provider'
        : null;

  useEffect(() => {
    onSceneChange?.(scene);
  }, [scene, onSceneChange]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), toast.undo ? 6000 : 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = useCallback((next: DemoToast) => {
    toastId.current += 1;
    setToast({ ...next, id: toastId.current });
  }, []);

  const openPage = useCallback(
    (next: GlobalPage) => {
      hide();
      setPage({ kind: next });
    },
    [hide],
  );

  const selectApp = (app: AppId) => {
    hide();
    setPage({ kind: 'app', app });
    // Coming back to an app lands on the mode in effect, as in the app.
    setStates((current) => ({ ...current, [app]: { ...current[app], view: current[app].active } }));
  };

  const shell = useMemo(
    () => ({
      visibleApps,
      setAppVisible: (app: AppId, visible: boolean) =>
        setVisibleApps((current) =>
          visible ? demoApps.map((a) => a.id).filter((id) => id === app || current.includes(id)) : current.filter((id) => id !== app),
        ),
      toast: showToast,
      openPage,
    }),
    [visibleApps, showToast, openPage],
  );

  const pageKey = page.kind === 'app' ? page.app : page.kind;

  return (
    <ShellContext.Provider value={shell}>
      <div className={cn('ccswitch-app-demo flex overflow-hidden bg-background text-foreground', className)}>
        {page.kind === 'settings' ? (
          <SettingsSidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} onBack={() => selectApp('claude')} />
        ) : (
          <Sidebar
            page={page}
            states={states}
            visibleApps={visibleApps}
            collapsed={collapsed}
            onToggle={() => setCollapsed((value) => !value)}
            onSelectApp={selectApp}
            onOpenPage={openPage}
          />
        )}
        <main className="relative min-w-0 flex-1">
          {/* Fade the new page in; no exit phase, which could hold the old page on screen. */}
          <motion.div
            key={pageKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0"
          >
            {page.kind === 'app' ? (
              <ProvidersPane
                app={demoAppById[page.app]}
                state={states[page.app]}
                onChange={(next) => setStates((current) => ({ ...current, [page.app]: next }))}
              />
            ) : page.kind === 'usage' ? (
              <UsagePane />
            ) : page.kind === 'mcp' ? (
              <McpPane />
            ) : page.kind === 'skills' ? (
              <SkillsPane />
            ) : page.kind === 'prompts' ? (
              <PromptsPane />
            ) : page.kind === 'sessions' ? (
              <SessionsPane />
            ) : page.kind === 'auth' ? (
              <AuthPane />
            ) : page.kind === 'apps' ? (
              <AppsPage />
            ) : (
              <SettingsPane />
            )}
          </motion.div>

          <AnimatePresence>
            {toast && (
              <motion.div
                key={toast.id}
                role="status"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.18 }}
                className="absolute bottom-4 end-4 z-30 flex max-w-[calc(100%-2rem)] items-center gap-3 rounded-[10px] border border-border bg-[var(--app-surface)] py-2.5 pe-2.5 ps-3.5 text-[13px] shadow-[0_4px_12px_rgba(16,24,40,.12),0_1px_3px_rgba(16,24,40,.08)] sm:max-w-[420px]"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-foreground">{toast.text}</p>
                  {toast.detail && <p className="text-xs text-[var(--app-fg2)]">{toast.detail}</p>}
                </div>
                {toast.undo && (
                  <button
                    type="button"
                    onClick={() => {
                      toast.undo?.();
                      if (toastId.current === toast.id) setToast(null);
                    }}
                    className="h-7 shrink-0 rounded-md border border-[var(--app-border-strong)] px-2.5 text-xs font-medium hover:bg-[var(--app-subtle)]"
                  >
                    {t.demo.window.pages.common.undo}
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </ShellContext.Provider>
  );
}

function SidebarTop({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const { t } = useLanguage();
  const { tip } = useHoverTip();
  const w = t.demo.window;
  const ToggleIcon = collapsed ? ChevronsRight : ChevronsLeft;
  return (
    <>
      <MacOsWindowBar size="sm" className={cn('h-8 shrink-0 px-3', collapsed ? 'justify-center' : 'justify-center md:justify-start')} />
      <div className={cn('flex h-9 shrink-0 items-center gap-2 px-3', collapsed ? 'justify-center' : 'justify-center md:justify-start')}>
        <img src={ccSwitchLogo} alt="" className={cn('h-5 w-5 shrink-0', collapsed && 'hidden')} />
        <span className={cn('me-auto truncate text-[15px] font-semibold text-foreground', collapsed ? 'hidden' : 'hidden md:inline')}>
          CC Switch
        </span>
        <button
          type="button"
          onClick={onToggle}
          {...tip(w.collapseSidebar)}
          aria-label={w.collapseSidebar}
          className={cn(
            'h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-[var(--app-subtle)] hover:text-foreground',
            collapsed ? 'flex' : 'hidden md:flex',
          )}
        >
          <ToggleIcon className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </div>
    </>
  );
}

const asideClass = (collapsed: boolean) =>
  cn(
    'flex shrink-0 flex-col border-r border-border bg-[var(--app-sidebar)] text-[13px] transition-[width] duration-200',
    collapsed ? 'w-14' : 'w-14 md:w-[200px]',
  );

interface SidebarProps {
  page: Page;
  states: Record<AppId, AppDemoState>;
  visibleApps: AppId[];
  collapsed: boolean;
  onToggle: () => void;
  onSelectApp: (app: AppId) => void;
  onOpenPage: (page: GlobalPage) => void;
}

function Sidebar({ page, states, visibleApps, collapsed, onToggle, onSelectApp, onOpenPage }: SidebarProps) {
  const { t } = useLanguage();
  const { tip } = useHoverTip();
  const w = t.demo.window;
  // Below md the sidebar is always icon-only, like the app's collapsed sidebar.
  const label = collapsed ? 'hidden' : 'hidden md:inline';

  const globalItems: Array<{ key: GlobalPage; label: string; icon: LucideIcon | typeof SkillsIcon }> = [
    { key: 'mcp', label: w.nav.mcp, icon: Server },
    { key: 'skills', label: w.nav.skills, icon: SkillsIcon },
    { key: 'prompts', label: w.nav.prompts, icon: BookOpen },
    { key: 'sessions', label: w.nav.sessions, icon: History },
    { key: 'auth', label: w.nav.auth, icon: KeyRound },
  ];

  const navButton = (key: GlobalPage, text: string, Icon: LucideIcon | typeof SkillsIcon, trailing?: ReactNode) => {
    const selected = page.kind === key;
    return (
      <button
        key={key}
        type="button"
        onClick={() => onOpenPage(key)}
        {...(collapsed ? tip(text) : {})}
        aria-label={text}
        aria-current={selected ? 'page' : undefined}
        className={cn(
          'flex h-7 shrink-0 items-center gap-2 rounded-md px-2 text-foreground transition-colors hover:bg-[var(--app-subtle)]',
          collapsed ? 'justify-center' : 'justify-center md:justify-start',
          selected && 'bg-[var(--app-selected)] font-medium hover:bg-[var(--app-selected)]',
        )}
      >
        <Icon className="h-4 w-4 shrink-0" strokeWidth={1.6} />
        <span className={cn('min-w-0 flex-1 truncate text-start', label)}>{text}</span>
        {trailing}
      </button>
    );
  };

  return (
    <aside className={asideClass(collapsed)}>
      <SidebarTop collapsed={collapsed} onToggle={onToggle} />

      <nav className="mt-2 flex min-h-0 flex-1 flex-col gap-px overflow-y-auto px-2">
        {demoApps
          .filter((app) => visibleApps.includes(app.id))
          .map((app) => {
            const selected = page.kind === 'app' && page.app === app.id;
            const active = states[app.id].active;
            const tag = active === 'route' ? w.modes.route : active === 'stack' ? w.modes.stack : null;
            return (
              <button
                key={app.id}
                type="button"
                onClick={() => onSelectApp(app.id)}
                {...(collapsed ? tip(tag ? `${app.label} · ${tag}` : app.label) : {})}
                aria-current={selected ? 'page' : undefined}
                aria-label={app.label}
                className={cn(
                  'relative flex h-7 shrink-0 items-center gap-2 rounded-md px-2 text-start transition-colors hover:bg-[var(--app-subtle)]',
                  collapsed ? 'justify-center' : 'justify-center md:justify-start',
                  selected && 'bg-[var(--app-selected)] font-medium hover:bg-[var(--app-selected)]',
                )}
              >
                <AppGlyph
                  app={app}
                  size={16}
                  badgeClassName={
                    selected ? 'border-[var(--app-selected)] bg-[var(--app-selected)]' : 'border-[var(--app-sidebar)] bg-[var(--app-sidebar)]'
                  }
                />
                <span className={cn('min-w-0 flex-1 truncate', label)}>{app.label}</span>
                {tag && !selected && (
                  <span
                    className={cn(
                      'h-[18px] whitespace-nowrap rounded-full px-1.5 text-[11px] leading-[18px]',
                      collapsed ? 'hidden' : 'hidden md:inline-block',
                      active === 'stack'
                        ? 'bg-[var(--app-stack-soft)] text-[var(--app-stack-text)]'
                        : 'bg-[var(--app-route-soft)] text-[var(--app-route-text)]',
                    )}
                  >
                    {tag}
                  </span>
                )}
              </button>
            );
          })}
      </nav>

      <div className="mx-3 mt-2 border-t border-border" />
      <div className="flex shrink-0 flex-col gap-px px-2 py-2">
        {globalItems.map((item) => navButton(item.key, item.label, item.icon))}
        {navButton(
          'usage',
          w.nav.usage,
          BarChart3,
          <span className={cn('shrink-0 text-[11px] font-normal tabular-nums text-muted-foreground', collapsed ? 'hidden' : 'hidden lg:inline')}>
            {fill(w.nav.todayCost, { cost: usd(todayCost()) })}
          </span>,
        )}
      </div>

      <div
        className={cn(
          'flex shrink-0 gap-1 border-t border-border px-2 py-2',
          collapsed ? 'flex-col items-center' : 'flex-col items-center md:flex-row',
        )}
      >
        {[
          { key: 'apps' as const, label: w.nav.apps, icon: LayoutGrid },
          { key: 'settings' as const, label: w.nav.settings, icon: Settings },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onOpenPage(item.key)}
            {...tip(item.label)}
            aria-label={item.label}
            aria-current={page.kind === item.key ? 'page' : undefined}
            className={cn(
              'flex h-7 flex-1 items-center justify-center gap-2 rounded-md px-2 text-foreground transition-colors hover:bg-[var(--app-subtle)] md:justify-start',
              page.kind === item.key && 'bg-[var(--app-selected)] font-medium hover:bg-[var(--app-selected)]',
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" strokeWidth={1.6} />
            <span className={cn('truncate', label)}>{item.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}

/** In Settings the sidebar becomes the settings directory, as in the app. */
function SettingsSidebar({ collapsed, onToggle, onBack }: { collapsed: boolean; onToggle: () => void; onBack: () => void }) {
  const { t } = useLanguage();
  const { tip } = useHoverTip();
  const { version } = useGitHubStats();
  const st = t.demo.window.pages.settings;
  const label = collapsed ? 'hidden' : 'hidden md:inline';
  const sections: Array<{ key: keyof typeof st.sections; icon: LucideIcon }> = [
    { key: 'general', icon: SlidersHorizontal },
    { key: 'appConfig', icon: Folder },
    { key: 'routing', icon: Route },
    { key: 'network', icon: Globe },
    { key: 'data', icon: Database },
    { key: 'about', icon: Info },
  ];
  const itemClass = cn(
    'flex h-7 shrink-0 items-center gap-2 rounded-md px-2 text-foreground transition-colors hover:bg-[var(--app-subtle)]',
    collapsed ? 'justify-center' : 'justify-center md:justify-start',
  );

  return (
    <aside className={asideClass(collapsed)}>
      <SidebarTop collapsed={collapsed} onToggle={onToggle} />
      <div className="mt-2 flex min-h-0 flex-1 flex-col gap-px px-2">
        <button type="button" onClick={onBack} {...tip(st.back)} aria-label={st.back} className={cn(itemClass, 'text-[var(--app-fg2)] hover:text-foreground')}>
          <ArrowLeft className="h-4 w-4 shrink-0" strokeWidth={1.5} />
          <span className={label}>{st.back}</span>
        </button>
        <p className={cn('mt-3 px-2 pb-1 text-[11px] text-[var(--app-fg3)]', label)}>{st.title}</p>
        {sections.map(({ key, icon: Icon }) => (
          <button
            key={key}
            type="button"
            {...tip(key === 'general' ? st.sections[key] : `${st.sections[key]}\n${st.onlyGeneral}`)}
            aria-label={st.sections[key]}
            aria-current={key === 'general' ? 'page' : undefined}
            className={cn(itemClass, key === 'general' && 'bg-[var(--app-selected)] font-medium hover:bg-[var(--app-selected)]')}
          >
            <Icon className="h-4 w-4 shrink-0 text-[var(--app-fg2)]" strokeWidth={1.6} />
            <span className={cn('truncate', label)}>{st.sections[key]}</span>
          </button>
        ))}
      </div>
      <p className={cn('px-4 pb-4 text-xs text-[var(--app-fg3)]', label)}>CC Switch{version ? ` v${version}` : ''}</p>
    </aside>
  );
}
