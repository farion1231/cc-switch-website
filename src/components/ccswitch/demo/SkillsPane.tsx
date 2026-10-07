import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight, Download, Info, Loader2, Plus, RefreshCw, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n/useLanguage';
import { demoAppById, fill, type AppId } from './apps';
import { useHoverTip } from './hoverTipContext';
import { MatrixCell, MatrixColumnHeader } from './matrix';
import { Btn, Checkbox, HelpTip, IconBtn, MenuTrigger, MoreMenu, Notice, PaneHeader, Pill, SearchField, Segmented } from './parts';
import { DISCOVER_SKILLS, INSTALLED_SKILLS, MATRIX_APPS, type SampleSkill } from './samples';
import { useShell } from './shellContext';

type View = 'installed' | 'discover';
type Status = 'all' | 'updates' | 'none';

const INSTALL_TARGETS: AppId[] = ['claude', 'codex'];
const UNMANAGED = 3;

/** The app's own Skills icon (a scroll), not a lucide one. */
export function SkillsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 3h14a2 2 0 0 1 2 2v12" />
      <path d="M2 7V5a2 2 0 0 1 4 0v14a2 2 0 0 0 4 0v-2h12v2a2 2 0 0 1-2 2H8" />
      <path d="m9 10.5 1.5-2-.5 2 2-1.5-.5 1.5 2-1.5-.5 1.5 2-2" />
    </svg>
  );
}

export function SkillsPane() {
  const { t, language } = useLanguage();
  const { visibleApps, toast } = useShell();
  const p = t.demo.window.pages;
  const sk = p.skills;
  const [view, setView] = useState<View>('installed');
  const [skills, setSkills] = useState<SampleSkill[]>(INSTALLED_SKILLS);
  const [status, setStatus] = useState<Status>('all');
  const [source, setSource] = useState<string>('all');
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [bannerOpen, setBannerOpen] = useState(true);
  const [checking, setChecking] = useState(false);
  const [hoverCol, setHoverCol] = useState<AppId | null>(null);

  useEffect(() => {
    if (!checking) return;
    const timer = window.setTimeout(() => {
      setChecking(false);
      const count = skills.filter((skill) => skill.update).length;
      toast({ text: count > 0 ? fill(sk.updatesFound, { count }) : sk.noUpdates });
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [checking, skills, sk, toast]);

  const columns = MATRIX_APPS.filter((app) => visibleApps.includes(app));
  const appName = (app: AppId) => demoAppById[app].label;
  const updates = skills.filter((skill) => skill.update).length;
  const repos = Array.from(new Set(skills.map((skill) => skill.repo).filter((repo): repo is string => Boolean(repo))));
  const q = query.trim().toLowerCase();

  const rows = skills.filter((skill) => {
    if (status === 'updates' && !skill.update) return false;
    if (status === 'none' && skill.apps.length > 0) return false;
    if (source === 'local' && skill.repo) return false;
    if (source !== 'all' && source !== 'local' && skill.repo !== source) return false;
    if (q && !`${skill.name} ${skill.description[language]} ${skill.repo ?? ''}`.toLowerCase().includes(q)) return false;
    return true;
  });

  const update = (names: string[], change: (skill: SampleSkill) => SampleSkill) =>
    setSkills((current) => current.map((skill) => (names.includes(skill.name) ? change(skill) : skill)));
  const setApp = (names: string[], app: AppId, on: boolean) =>
    update(names, (skill) => ({
      ...skill,
      apps: on ? Array.from(new Set([...skill.apps, app])) : skill.apps.filter((a) => a !== app),
    }));

  const setColumn = (app: AppId, on: boolean) => {
    const before = skills;
    const targets = rows.filter((row) => row.apps.includes(app) !== on).map((row) => row.name);
    setApp(targets, app, on);
    toast({
      text: fill(on ? p.matrix.toastEnabled : p.matrix.toastDisabled, { app: appName(app), count: targets.length, noun: sk.noun }),
      undo: () => {
        setSkills(before);
        toast({ text: p.common.undone });
      },
    });
  };

  const uninstall = (names: string[]) => {
    setSkills((current) => current.filter((skill) => !names.includes(skill.name)));
    setSelected((current) => current.filter((name) => !names.includes(name)));
  };

  const statusLabel = status === 'all' ? sk.filterAll : status === 'updates' ? sk.filterUpdates : sk.filterNone;
  const sourceLabel = source === 'all' ? sk.filterAll : source === 'local' ? sk.sourceLocal : source;
  const allSelected = rows.length > 0 && rows.every((row) => selected.includes(row.name));
  const someSelected = rows.some((row) => selected.includes(row.name));

  const install = (name: string) => {
    const sample = DISCOVER_SKILLS.find((skill) => skill.name === name);
    if (!sample) return;
    setSkills((current) => [...current, { name, description: sample.description, repo: sample.repo, apps: INSTALL_TARGETS }]);
    toast({
      text: fill(sk.toastInstalled, { name, apps: INSTALL_TARGETS.map(appName).join(p.common.listSeparator) }),
    });
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PaneHeader
        icon={<SkillsIcon className="h-5 w-5" />}
        title="Skills"
        extra={
          <>
            <HelpTip title={sk.helpTitle} body={sk.help} />
            {updates > 0 && (
              <UpdatesPill
                label={fill(sk.headerUpdates, { count: updates })}
                tipText={status === 'updates' ? sk.headerUpdatesClear : sk.headerUpdatesShow}
                active={status === 'updates'}
                onClick={() => {
                  setView('installed');
                  setStatus((current) => (current === 'updates' ? 'all' : 'updates'));
                }}
              />
            )}
          </>
        }
        actions={
          <>
            <MenuTrigger
              align="end"
              items={[
                { label: sk.addDiscover, onSelect: () => setView('discover') },
                { label: sk.addZip },
                { label: sk.addImport, right: <Pill>{UNMANAGED}</Pill> },
              ]}
              trigger={(open, toggle) => (
                <Btn variant="solid" icon={Plus} trailingIcon={ChevronDown} hideLabelOnMobile className={cn('pe-2.5', open && 'bg-[var(--app-action-hover)]')} onClick={toggle}>
                  {sk.add}
                </Btn>
              )}
            />
            <MoreMenu
              large
              label={sk.moreActions}
              items={[
                { label: sk.checkUpdates, onSelect: () => setChecking(true) },
                { label: sk.restore },
                { label: sk.repos },
                { label: sk.storage },
              ]}
            />
          </>
        }
      />

      {/* Tabs, with the view's own controls at the right end of the same row. */}
      <div className="shrink-0 px-4 pt-1 sm:px-6">
        <div className="flex h-11 items-stretch gap-4 border-b border-border">
          {(['installed', 'discover'] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setView(id)}
              className={cn(
                'relative -mb-px px-0.5 text-[13px]',
                view === id ? 'font-semibold text-foreground' : 'font-medium text-[var(--app-fg2)] hover:text-foreground',
              )}
            >
              {id === 'installed' ? fill(sk.viewInstalled, { count: skills.length }) : sk.viewDiscover}
              {view === id && (
                <motion.span layoutId="demo-skills-tab" className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-foreground" />
              )}
            </button>
          ))}
          <div className="ms-auto hidden items-center gap-2 sm:flex">
            {view === 'installed' ? (
              <>
                <SearchField value={query} onChange={setQuery} placeholder={sk.searchPlaceholder} className="w-[240px] min-w-[140px] shrink" />
                <Btn variant="quiet" icon={checking ? undefined : RefreshCw} onClick={() => setChecking(true)} className="hidden lg:inline-flex">
                  {checking && <Loader2 className="me-1.5 inline h-4 w-4 animate-spin" />}
                  {checking ? sk.checking : sk.checkUpdates}
                </Btn>
              </>
            ) : (
              <Btn trailingIcon={ChevronDown} className="hidden lg:inline-flex">
                {sk.installTo}
                {INSTALL_TARGETS.map(appName).join(p.common.listSeparator)}
              </Btn>
            )}
          </div>
        </div>
      </div>

      {view === 'installed' ? (
        <>
          {bannerOpen && (
            <div className="shrink-0 px-4 pt-3 sm:px-6">
              <Notice
                icon={Info}
                title={fill(sk.bannerUnmanaged, { count: UNMANAGED })}
                actions={
                  <>
                    <Btn variant="quiet" compact className="hidden sm:inline-flex">
                      {sk.reviewImport}
                    </Btn>
                    <Btn variant="quiet" compact className="text-[var(--app-fg2)]" onClick={() => setBannerOpen(false)}>
                      {sk.ignore}
                    </Btn>
                  </>
                }
              />
            </div>
          )}
          <div className="flex min-h-0 flex-1 flex-col px-4 pb-5 pt-3 sm:px-6">
            <div className="min-h-0 overflow-auto rounded-[10px] border border-border bg-[var(--app-surface)]">
              <div className="min-w-[600px]">
                <div className="sticky top-0 z-10 flex h-11 items-center border-b border-border bg-[var(--app-subtle)] px-2">
                  <div className="flex w-6 justify-center">
                    <Checkbox
                      checked={allSelected}
                      indeterminate={!allSelected && someSelected}
                      label={sk.selectAll}
                      onChange={() => setSelected(allSelected ? [] : rows.map((row) => row.name))}
                    />
                  </div>
                  {selected.length > 0 ? (
                    <div className="ms-2 flex min-w-0 flex-1 items-center gap-0.5">
                      <span className="me-2 whitespace-nowrap text-[13px] font-medium">{fill(sk.selected, { count: selected.length })}</span>
                      <AppMenuButton label={sk.enableTo} apps={columns} onPick={(app) => setApp(selected, app, true)} />
                      <AppMenuButton label={sk.disable} apps={columns} onPick={(app) => setApp(selected, app, false)} />
                      <Btn variant="quiet" compact onClick={() => update(selected, (skill) => ({ ...skill, update: false }))}>
                        {sk.update}
                      </Btn>
                      <Btn variant="quiet" compact className="text-[var(--app-danger-text)]" onClick={() => uninstall(selected)}>
                        {sk.uninstall}
                      </Btn>
                      <span className="flex-1" />
                      <Btn variant="quiet" compact className="text-[var(--app-fg2)]" onClick={() => setSelected([])}>
                        {p.common.cancel}
                      </Btn>
                    </div>
                  ) : (
                    <div className="-ms-0.5 flex min-w-0 flex-1 items-center gap-0.5">
                      <MenuTrigger
                        items={[
                          { label: sk.filterAll, checked: status === 'all', onSelect: () => setStatus('all') },
                          { label: sk.filterUpdates, checked: status === 'updates', onSelect: () => setStatus('updates') },
                          { label: sk.filterNone, checked: status === 'none', onSelect: () => setStatus('none') },
                        ]}
                        trigger={(_, toggle) => (
                          <Btn variant="quiet" compact trailingIcon={ChevronDown} onClick={toggle} className={cn('pe-1.5 ps-2.5', status === 'all' && 'text-[var(--app-fg2)]')}>
                            {statusLabel}
                          </Btn>
                        )}
                      />
                      <MenuTrigger
                        width="w-[240px]"
                        items={[
                          { label: sk.filterAll, checked: source === 'all', onSelect: () => setSource('all') },
                          ...repos.map((repo) => ({
                            label: repo,
                            checked: source === repo,
                            right: <span className="text-xs text-[var(--app-fg3)]">{skills.filter((s) => s.repo === repo).length}</span>,
                            onSelect: () => setSource(repo),
                          })),
                          { label: sk.sourceLocal, checked: source === 'local', onSelect: () => setSource('local') },
                        ]}
                        trigger={(_, toggle) => (
                          <Btn variant="quiet" compact trailingIcon={ChevronDown} onClick={toggle} className={cn('pe-1.5 ps-2.5', source === 'all' && 'text-[var(--app-fg2)]')}>
                            {fill(sk.sourceButton, { source: sourceLabel })}
                          </Btn>
                        )}
                      />
                      {status === 'updates' && updates > 0 && (
                        <Btn compact onClick={() => setSkills((current) => current.map((skill) => ({ ...skill, update: false })))}>
                          {fill(sk.updateAllCount, { count: updates })}
                        </Btn>
                      )}
                    </div>
                  )}
                  {columns.map((app) => (
                    <MatrixColumnHeader
                      key={app}
                      app={demoAppById[app]}
                      on={rows.filter((row) => row.apps.includes(app)).length}
                      total={rows.length}
                      noun={sk.noun}
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
                    <p className="text-[13px] text-[var(--app-fg2)]">{q ? fill(sk.noMatch, { query }) : sk.noFilterMatch}</p>
                    <Btn
                      compact
                      onClick={() => {
                        setQuery('');
                        setStatus('all');
                        setSource('all');
                      }}
                    >
                      {sk.clearFilters}
                    </Btn>
                  </div>
                ) : (
                  <ul>
                    {rows.map((skill, index) => (
                      <li
                        key={skill.name}
                        className={cn('flex h-14 items-center px-2 transition-colors hover:bg-[var(--app-subtle)]', index > 0 && 'border-t border-border')}
                      >
                        <div className="flex w-6 justify-center">
                          <Checkbox
                            checked={selected.includes(skill.name)}
                            label={skill.name}
                            onChange={(on) =>
                              setSelected((current) => (on ? [...current, skill.name] : current.filter((name) => name !== skill.name)))
                            }
                          />
                        </div>
                        <div className="ms-2 flex min-w-0 flex-1 flex-col pe-3">
                          <div className="flex min-w-0 items-center gap-1.5">
                            <span className="truncate text-[13px] font-medium text-foreground">{skill.name}</span>
                            {skill.update && <Pill tone="warning">{sk.updateAvailable}</Pill>}
                            {skill.apps.length === 0 && <Pill>{p.mcp.notEnabled}</Pill>}
                          </div>
                          <span className="truncate whitespace-nowrap text-xs text-[var(--app-fg2)]">
                            {skill.description[language]} ·{' '}
                            {skill.repo ? (
                              <span className="underline decoration-[var(--app-border-strong)] underline-offset-2">{skill.repo}</span>
                            ) : (
                              sk.sourceLocal
                            )}
                          </span>
                        </div>
                        {columns.map((app) => {
                          const on = skill.apps.includes(app);
                          return (
                            <MatrixCell
                              key={app}
                              on={on}
                              label={fill(on ? p.matrix.cellOn : p.matrix.cellOff, { name: skill.name, app: appName(app) })}
                              onToggle={() => setApp([skill.name], app, !on)}
                              onHover={(hovering) => setHoverCol(hovering ? app : null)}
                            />
                          );
                        })}
                        <div className="flex w-16 shrink-0 justify-end">
                          <MoreMenu
                            label={t.demo.window.more}
                            width="w-[180px]"
                            items={[
                              ...(skill.update
                                ? [{ label: sk.update, onSelect: () => update([skill.name], (s) => ({ ...s, update: false })) }]
                                : []),
                              { label: sk.copyDir },
                              { label: sk.uninstall, danger: true, separatorBefore: true, onSelect: () => uninstall([skill.name]) },
                            ]}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <DiscoverView installed={skills} onInstall={install} onOpenInstalled={() => setView('installed')} />
      )}
    </div>
  );
}

function UpdatesPill({ label, tipText, active, onClick }: { label: string; tipText: string; active: boolean; onClick: () => void }) {
  const { tip } = useHoverTip();
  return (
    <button
      type="button"
      onClick={onClick}
      {...tip(tipText)}
      className={cn(
        'ms-1 hidden h-6 items-center rounded-md px-1.5 text-[13px] font-medium sm:inline-flex',
        active
          ? 'bg-[var(--app-selected)] text-foreground'
          : 'text-[var(--app-fg2)] underline decoration-[var(--app-border-strong)] underline-offset-[3px] hover:bg-[var(--app-subtle)]',
      )}
    >
      {label}
    </button>
  );
}

function AppMenuButton({ label, apps, onPick }: { label: string; apps: AppId[]; onPick: (app: AppId) => void }) {
  return (
    <MenuTrigger
      items={apps.map((app) => ({ label: demoAppById[app].label, onSelect: () => onPick(app) }))}
      trigger={(_, toggle) => (
        <Btn variant="quiet" compact trailingIcon={ChevronDown} onClick={toggle} className="pe-1.5 ps-2.5">
          {label}
        </Btn>
      )}
    />
  );
}

function DiscoverView({
  installed,
  onInstall,
  onOpenInstalled,
}: {
  installed: SampleSkill[];
  onInstall: (name: string) => void;
  onOpenInstalled: () => void;
}) {
  const { t, language } = useLanguage();
  const sk = t.demo.window.pages.skills;
  const [mode, setMode] = useState<'repos' | 'skillssh'>('repos');
  const [onlyUninstalled, setOnlyUninstalled] = useState(false);
  const [installing, setInstalling] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const installRef = useRef(onInstall);
  installRef.current = onInstall;

  useEffect(() => {
    if (!installing) return;
    const timer = window.setTimeout(() => {
      installRef.current(installing);
      setInstalling(null);
    }, 1100);
    return () => window.clearTimeout(timer);
  }, [installing]);

  const installedNames = new Map(installed.map((skill) => [skill.name, skill.apps.length]));
  const q = query.trim().toLowerCase();
  const rows = DISCOVER_SKILLS.filter((skill) => {
    if (onlyUninstalled && installedNames.has(skill.name)) return false;
    if (q && !`${skill.name} ${skill.repo} ${skill.description[language]}`.toLowerCase().includes(q)) return false;
    return true;
  });
  const repoCount = new Set(DISCOVER_SKILLS.map((skill) => skill.repo)).size;

  return (
    <>
      <div className="flex h-12 shrink-0 items-center gap-2 px-4 sm:px-6">
        <Segmented
          small
          layoutId="demo-skills-source"
          value={mode}
          onChange={setMode}
          items={[
            { id: 'repos', label: fill(sk.sourceRepos, { count: repoCount }) },
            { id: 'skillssh', label: 'skills.sh' },
          ]}
        />
        {mode === 'repos' && (
          <>
            <Btn variant="quiet" compact trailingIcon={ChevronDown} className="hidden text-[var(--app-fg2)] md:inline-flex">
              {sk.reposAll}
            </Btn>
            <label className="hidden h-7 cursor-pointer items-center gap-2 px-2 text-[13px] text-[var(--app-fg2)] md:flex">
              <Checkbox checked={onlyUninstalled} onChange={setOnlyUninstalled} label={sk.onlyUninstalled} />
              <span onClick={() => setOnlyUninstalled((value) => !value)}>{sk.onlyUninstalled}</span>
            </label>
          </>
        )}
        <span className="flex-1" />
        <SearchField value={query} onChange={setQuery} placeholder={sk.discoverSearch} className="w-[220px] min-w-[120px] shrink" />
        {mode === 'repos' && <IconBtn icon={RefreshCw} label={sk.reload} />}
      </div>
      <div className="flex min-h-0 flex-1 flex-col px-4 pb-5 sm:px-6">
        <ul className="min-h-0 overflow-auto rounded-[10px] border border-border bg-[var(--app-surface)]">
          {rows.map((skill, index) => {
            const apps = installedNames.get(skill.name);
            return (
              <li key={`${skill.repo}/${skill.name}`} className={cn('flex h-14 items-center gap-3 pe-3 ps-4', index > 0 && 'border-t border-border')}>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <span className="truncate text-[13px] font-medium">{skill.name}</span>
                    {mode === 'repos' ? (
                      <Pill mono>{skill.repo}</Pill>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-[var(--app-fg3)]">
                        <Download className="h-3 w-3" />
                        {skill.installs}
                      </span>
                    )}
                  </div>
                  <span className="truncate text-xs text-[var(--app-fg2)]">
                    {mode === 'repos' ? skill.description[language] : `skills.sh · ${skill.repo}`}
                  </span>
                </div>
                <div className="flex w-[180px] shrink-0 justify-end">
                  {apps !== undefined ? (
                    <button
                      type="button"
                      onClick={onOpenInstalled}
                      className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-[13px] text-[var(--app-fg2)] hover:bg-[var(--app-subtle)]"
                    >
                      {fill(sk.installed, { count: apps })}
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  ) : installing === skill.name ? (
                    <span className="inline-flex h-7 items-center gap-1.5 text-[13px] text-[var(--app-fg2)]">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      {sk.installing}
                    </span>
                  ) : (
                    <Btn compact onClick={() => setInstalling(skill.name)} className={cn(installing && 'pointer-events-none opacity-50')}>
                      {sk.install}
                    </Btn>
                  )}
                </div>
              </li>
            );
          })}
          {rows.length === 0 && (
            <li className="flex flex-col items-center gap-3 px-6 py-10 text-center text-[13px] text-[var(--app-fg2)]">
              <X className="h-4 w-4" />
              {fill(sk.noMatch, { query })}
            </li>
          )}
        </ul>
      </div>
    </>
  );
}
