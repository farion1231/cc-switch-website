import { useEffect, useState } from 'react';
import { ArrowUpCircle, ChevronDown, Download, LayoutGrid, Loader2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n/useLanguage';
import { AppGlyph } from './AppGlyph';
import { demoAppById, fill, type AppId } from './apps';
import { Btn, DemoSwitch, HelpTip, MoreMenu, PaneHeader, Pill } from './parts';
import { TOOLS, type SampleTool } from './samples';
import { useShell } from './shellContext';

export function AppsPage() {
  const { t } = useLanguage();
  const { visibleApps, setAppVisible } = useShell();
  const ap = t.demo.window.pages.apps;
  const [tools, setTools] = useState<SampleTool[]>(TOOLS);
  const [busy, setBusy] = useState<AppId[]>([]);
  const [checking, setChecking] = useState(false);
  const [checkedAt, setCheckedAt] = useState('14:32');
  const [openConflict, setOpenConflict] = useState<AppId | null>(null);
  const outdated = tools.filter((tool) => tool.latest).map((tool) => tool.app);

  useEffect(() => {
    if (!checking) return;
    const timer = window.setTimeout(() => {
      setChecking(false);
      const now = new Date();
      setCheckedAt(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [checking]);

  useEffect(() => {
    if (busy.length === 0) return;
    const timer = window.setTimeout(() => {
      setTools((current) =>
        current.map((tool) => {
          if (!busy.includes(tool.app)) return tool;
          if (tool.latest) return { ...tool, version: tool.latest, latest: undefined };
          // Fresh install of an app that wasn't there.
          return { ...tool, version: tool.app === 'openclaw' ? '2026.9.30' : '0.6.2', source: 'npm', path: `~/.npm-global/bin/${tool.app}`, installHint: undefined };
        }),
      );
      setBusy([]);
    }, 1400);
    return () => window.clearTimeout(timer);
  }, [busy]);

  const visibleCount = visibleApps.length;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PaneHeader
        icon={<LayoutGrid className="h-5 w-5" strokeWidth={1.5} />}
        title={t.demo.window.nav.apps}
        extra={<HelpTip title={ap.helpTitle} body={ap.help} />}
        actions={
          <>
            <span className="hidden whitespace-nowrap text-xs text-[var(--app-fg3)] lg:inline">{fill(ap.lastChecked, { time: checkedAt })}</span>
            {outdated.length > 0 && (
              <Btn icon={ArrowUpCircle} hideLabelOnMobile onClick={() => setBusy(outdated)} className="hidden md:inline-flex">
                {fill(ap.updateAll, { count: outdated.length })}
              </Btn>
            )}
            <Btn icon={checking ? undefined : RefreshCw} onClick={() => setChecking(true)}>
              {checking && <Loader2 className="me-1.5 inline h-3.5 w-3.5 animate-spin" />}
              <span className="hidden sm:inline">{checking ? ap.checking : ap.checkUpdates}</span>
            </Btn>
            <MoreMenu large label={ap.moreActions} items={[{ label: ap.diagnose }, { label: ap.manualCommands }]} />
          </>
        }
      />

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-10 pt-4 sm:px-6">
        <div className="flex h-8 items-center gap-4 px-4 text-xs font-medium text-[var(--app-fg2)]">
          <span className="flex-1">{ap.columnApp}</span>
          <span className="hidden w-[150px] text-end sm:block">{ap.columnVersion}</span>
          <span className="w-[88px]" />
          <span className="flex w-[56px] items-center justify-end gap-0.5">
            {ap.columnVisible}
            <HelpTip title={ap.columnVisible} body={ap.visibleHelp} />
          </span>
        </div>
        <div className="divide-y divide-border overflow-hidden rounded-[10px] border border-border bg-[var(--app-surface)]">
          {tools.map((tool) => {
            const app = demoAppById[tool.app];
            const visible = visibleApps.includes(tool.app);
            const isBusy = busy.includes(tool.app);
            const desktop = tool.app === 'claude-desktop';
            return (
              <div key={tool.app} className="px-4 py-3">
                <div className="flex items-center gap-4">
                  <AppGlyph app={app} size={20} badgeClassName="border-[var(--app-surface)] bg-[var(--app-surface)]" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-foreground">
                      <span className="truncate">{app.label}</span>
                      {tool.source && <Pill>{tool.source}</Pill>}
                      {desktop && <HelpTip title={app.label} body={ap.desktopHelp} />}
                    </div>
                    {!desktop && (
                      <div className="mt-0.5 flex min-w-0 items-center gap-2 text-xs text-[var(--app-fg2)]">
                        {tool.path ? (
                          <span className="truncate font-mono">{tool.path}</span>
                        ) : (
                          <span className="truncate">{tool.installHint === 'script' ? ap.installHintScript : ap.installHintNpm}</span>
                        )}
                        {tool.conflict && (
                          <button
                            type="button"
                            onClick={() => setOpenConflict((current) => (current === tool.app ? null : tool.app))}
                            className="inline-flex shrink-0 items-center gap-0.5 font-medium text-[var(--app-warning-text)]"
                          >
                            {fill(ap.otherInstalls, { count: 1 })}
                            <ChevronDown className={cn('h-3 w-3 transition-transform', openConflict === tool.app && 'rotate-180')} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="hidden w-[150px] shrink-0 flex-col items-end sm:flex">
                    {desktop ? (
                      <span className="text-xs text-[var(--app-fg2)]">{ap.desktopConnected}</span>
                    ) : isBusy ? (
                      <Loader2 className="h-4 w-4 animate-spin text-[var(--app-fg3)]" />
                    ) : tool.version ? (
                      <>
                        <span className="font-mono text-[13px] font-medium tabular-nums text-foreground">{tool.version}</span>
                        {tool.latest && <span className="text-xs text-[var(--app-fg2)]">{fill(ap.newVersion, { version: tool.latest })}</span>}
                      </>
                    ) : (
                      <span className="text-xs text-[var(--app-fg2)]">{ap.notInstalled}</span>
                    )}
                  </div>
                  <div className="flex w-[88px] shrink-0 justify-end">
                    {!desktop && !isBusy && !tool.version && (
                      <Btn compact icon={Download} onClick={() => setBusy((current) => [...current, tool.app])}>
                        {ap.install}
                      </Btn>
                    )}
                    {!desktop && !isBusy && tool.latest && (
                      <Btn compact icon={ArrowUpCircle} onClick={() => setBusy((current) => [...current, tool.app])}>
                        {ap.update}
                      </Btn>
                    )}
                  </div>
                  <div className="flex w-[56px] shrink-0 justify-end">
                    <DemoSwitch
                      small
                      neutral
                      checked={visible}
                      disabled={visible && visibleCount === 1}
                      label={fill(ap.showInSidebar, { name: app.label })}
                      onChange={(on) => setAppVisible(tool.app, on)}
                    />
                  </div>
                </div>
                {tool.conflict && openConflict === tool.app && (
                  <div className="ms-9 mt-2 rounded-md bg-[var(--app-warning-soft)] p-2.5 text-xs">
                    <p className="mb-1 font-medium text-[var(--app-warning-text)]">{fill(ap.installsFound, { count: 2 })}</p>
                    <p className="flex gap-2 font-mono text-foreground">
                      <span className="truncate">{tool.path}</span>
                      <span className="text-[var(--app-fg2)]">{tool.version}</span>
                    </p>
                    <p className="flex gap-2 font-mono text-foreground">
                      <span className="truncate">{tool.conflict.path}</span>
                      <span className="text-[var(--app-fg2)]">{tool.conflict.version}</span>
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
