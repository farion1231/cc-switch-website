import { useState } from 'react';
import { Download, Pencil, Plus, Server } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n/useLanguage';
import { demoAppById, fill, type AppId } from './apps';
import { MatrixCell, MatrixColumnHeader } from './matrix';
import { Btn, HelpTip, IconBtn, MoreMenu, PaneHeader, Pill, SearchField } from './parts';
import { MATRIX_APPS, MCP_SERVERS } from './samples';
import { useShell } from './shellContext';

type Enabled = Record<string, AppId[]>;

export function McpPane() {
  const { t } = useLanguage();
  const { visibleApps, toast } = useShell();
  const p = t.demo.window.pages;
  const mcp = p.mcp;
  const [enabled, setEnabled] = useState<Enabled>(() => Object.fromEntries(MCP_SERVERS.map((s) => [s.id, s.apps])));
  const [deleted, setDeleted] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [hoverCol, setHoverCol] = useState<AppId | null>(null);

  const columns = MATRIX_APPS.filter((app) => visibleApps.includes(app));
  const servers = MCP_SERVERS.filter((server) => !deleted.includes(server.id));
  const q = query.trim().toLowerCase();
  const rows = q ? servers.filter((s) => `${s.id} ${s.transport} ${s.summary}`.toLowerCase().includes(q)) : servers;
  const appName = (app: AppId) => demoAppById[app].label;

  const withUndo = (before: Enabled) => () => {
    setEnabled(before);
    toast({ text: p.common.undone });
  };

  const setCell = (id: string, app: AppId, on: boolean) => {
    setEnabled((current) => ({
      ...current,
      [id]: on ? [...current[id], app] : current[id].filter((a) => a !== app),
    }));
  };

  const setColumn = (app: AppId, on: boolean) => {
    const before = enabled;
    const targets = rows.filter((row) => enabled[row.id].includes(app) !== on);
    setEnabled((current) => {
      const next = { ...current };
      for (const row of targets) next[row.id] = on ? [...next[row.id], app] : next[row.id].filter((a) => a !== app);
      return next;
    });
    toast({
      text: fill(on ? p.matrix.toastEnabled : p.matrix.toastDisabled, { app: appName(app), count: targets.length, noun: mcp.noun }),
      undo: withUndo(before),
    });
  };

  const setRow = (id: string, on: boolean) => {
    const before = enabled;
    setEnabled((current) => ({ ...current, [id]: on ? [...MATRIX_APPS] : [] }));
    toast({
      text: on ? fill(mcp.toastRowAllOn, { id, count: MATRIX_APPS.length }) : fill(mcp.toastRowAllOff, { id }),
      undo: withUndo(before),
    });
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PaneHeader
        icon={<Server className="h-5 w-5" strokeWidth={1.5} />}
        title="MCP"
        extra={<HelpTip title={mcp.helpTitle} body={mcp.help} />}
        actions={
          <>
            <Btn variant="quiet" icon={Download} hideLabelOnMobile className="hidden md:inline-flex">
              {mcp.importFromApps}
            </Btn>
            <Btn variant="solid" icon={Plus} hideLabelOnMobile>
              {mcp.add}
            </Btn>
            <MoreMenu
              large
              label={mcp.moreActions}
              width="w-[260px]"
              items={[
                {
                  label: mcp.resync,
                  onSelect: () => toast({ text: fill(mcp.toastResynced, { count: columns.length }) }),
                },
                { label: mcp.copyAll },
              ]}
            />
          </>
        }
      />

      <div className="flex h-14 shrink-0 items-center gap-3 px-4 sm:px-6">
        <SearchField value={query} onChange={setQuery} placeholder={mcp.searchPlaceholder} className="w-[320px] min-w-[150px] shrink" />
        <span className="shrink-0 whitespace-nowrap text-xs tabular-nums text-[var(--app-fg2)]">
          {q ? fill(mcp.countFiltered, { shown: rows.length, count: servers.length }) : fill(mcp.count, { count: servers.length })}
        </span>
        <span className="ms-auto hidden truncate text-xs text-[var(--app-fg2)] lg:block">{mcp.overwriteNote}</span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-4 pb-5 sm:px-6">
        <div className="min-h-0 overflow-auto rounded-[10px] border border-border bg-[var(--app-surface)]">
          <div className="min-w-[560px]">
            <div className="sticky top-0 z-10 flex h-11 items-center border-b border-border bg-[var(--app-subtle)] pe-2 ps-4">
              <span className="flex-1 text-xs font-semibold text-[var(--app-fg2)]">{mcp.columnName}</span>
              {columns.map((app) => (
                <MatrixColumnHeader
                  key={app}
                  app={demoAppById[app]}
                  on={rows.filter((row) => enabled[row.id].includes(app)).length}
                  total={rows.length}
                  noun={mcp.noun}
                  highlighted={hoverCol === app}
                  onHover={(hovering) => setHoverCol(hovering ? app : null)}
                  onSetAll={(on) => setColumn(app, on)}
                  scope={fill(q ? p.matrix.scopeSearch : p.matrix.scopeAll, { count: rows.length })}
                />
              ))}
              <span className="w-16 shrink-0" />
            </div>

            {rows.length === 0 ? (
              <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
                <p className="text-[13px] text-[var(--app-fg2)]">{fill(mcp.noMatch, { query })}</p>
                <Btn compact onClick={() => setQuery('')}>
                  {mcp.clearSearch}
                </Btn>
              </div>
            ) : (
              <ul>
                {rows.map((server, index) => {
                  const apps = enabled[server.id];
                  return (
                    <li
                      key={server.id}
                      className={cn('flex h-14 items-center pe-2 ps-4 transition-colors hover:bg-[var(--app-subtle)]', index > 0 && 'border-t border-border')}
                    >
                      <div className="flex min-w-0 flex-1 flex-col pe-3">
                        <div className="flex min-w-0 items-center gap-1.5">
                          <span className="truncate text-[13px] font-medium text-foreground">{server.id}</span>
                          <Pill mono>{server.transport}</Pill>
                          {apps.length === 0 && <Pill>{mcp.notEnabled}</Pill>}
                        </div>
                        <span className="truncate font-mono text-xs text-[var(--app-fg2)]">{server.summary}</span>
                      </div>
                      {columns.map((app) => {
                        const on = apps.includes(app);
                        return (
                          <MatrixCell
                            key={app}
                            on={on}
                            label={fill(on ? p.matrix.cellOn : p.matrix.cellOff, { name: server.id, app: appName(app) })}
                            onToggle={() => {
                              setCell(server.id, app, !on);
                              toast({ text: fill(mcp.toastWritten, { app: appName(app) }) });
                            }}
                            onHover={(hovering) => setHoverCol(hovering ? app : null)}
                          />
                        );
                      })}
                      <div className="flex w-16 shrink-0 justify-end gap-1">
                        <IconBtn icon={Pencil} label={p.common.edit} />
                        <MoreMenu
                          label={t.demo.window.more}
                          width="w-[200px]"
                          items={[
                            { label: mcp.copyJson, onSelect: () => toast({ text: fill(mcp.toastCopiedOne, { id: server.id }) }) },
                            { label: mcp.enableEverywhere, onSelect: () => setRow(server.id, true) },
                            { label: mcp.disableEverywhere, onSelect: () => setRow(server.id, false) },
                            {
                              label: p.common.delete,
                              danger: true,
                              separatorBefore: true,
                              onSelect: () => {
                                setDeleted((current) => [...current, server.id]);
                                toast({
                                  text: fill(mcp.toastDeleted, { id: server.id }),
                                  undo: () => setDeleted((current) => current.filter((id) => id !== server.id)),
                                });
                              },
                            },
                          ]}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
