import { useRef, useState } from 'react';
import { Check, ChevronDown, Copy, Folder, History, LayoutGrid, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n/useLanguage';
import { AppGlyph } from './AppGlyph';
import { demoAppById, fill, type AppId } from './apps';
import { Btn, Floating, HelpTip, IconBtn, MoreMenu, PaneHeader, SearchField, Segmented } from './parts';
import { SESSION_APPS, SESSIONS, type Bucket, type SampleSession } from './samples';
import { SessionReader } from './SessionReader';
import { useShell } from './shellContext';

type Filter = 'all' | AppId;
type GroupBy = 'time' | 'project';

const BUCKETS: Bucket[] = ['today', 'yesterday', 'thisWeek', 'earlier'];
const UNKNOWN = '__unknown__';

export function SessionsPane() {
  const { t, language } = useLanguage();
  const { visibleApps, toast } = useShell();
  const p = t.demo.window.pages;
  const s = p.sessions;
  const [filter, setFilter] = useState<Filter>('claude');
  const [groupBy, setGroupBy] = useState<GroupBy>('project');
  // The app opens with groups collapsed; the demo opens the first one so the list isn't empty.
  const [expanded, setExpanded] = useState<string[]>(['~/Code/cc-switch']);
  const [query, setQuery] = useState('');
  const [deleted, setDeleted] = useState<string[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const picker = useRef<HTMLSpanElement>(null);

  const apps = SESSION_APPS.filter((app) => visibleApps.includes(app) || (app === 'claude' && visibleApps.includes('claude-desktop')));
  const sessions = SESSIONS.filter((session) => !deleted.includes(session.id) && apps.includes(session.app));
  const countOf = (app: AppId) => sessions.filter((session) => session.app === app).length;
  const sortedApps = [...apps].sort((a, b) => countOf(b) - countOf(a));
  const q = query.trim().toLowerCase();
  const rows = sessions.filter((session) => {
    if (filter !== 'all' && session.app !== filter) return false;
    if (!q) return true;
    return `${session.title[language]} ${session.last[language]} ${session.project ?? ''} ${session.id}`.toLowerCase().includes(q);
  });

  const ago = (session: SampleSession) =>
    session.ago.unit === 'minutes'
      ? fill(p.common.minutesAgo, { count: session.ago.count })
      : session.ago.unit === 'hours'
        ? fill(p.common.hoursAgo, { count: session.ago.count })
        : fill(p.common.daysAgo, { count: session.ago.count });

  const openIndex = openId ? rows.findIndex((session) => session.id === openId) : -1;
  if (openIndex >= 0) {
    return (
      <SessionReader
        key={openId}
        session={rows[openIndex]}
        onBack={() => setOpenId(null)}
        onPrev={openIndex > 0 ? () => setOpenId(rows[openIndex - 1].id) : undefined}
        onNext={openIndex < rows.length - 1 ? () => setOpenId(rows[openIndex + 1].id) : undefined}
      />
    );
  }

  const projects = Array.from(new Set(rows.map((session) => session.project ?? UNKNOWN))).sort((a, b) =>
    a === UNKNOWN ? 1 : b === UNKNOWN ? -1 : 0,
  );

  const renderRow = (session: SampleSession, index: number, showFolder: boolean) => {
    const app = demoAppById[session.app];
    const canResume = session.app !== 'hermes' && session.app !== 'openclaw';
    return (
      <div
        key={session.id}
        className={cn(
          'group relative flex h-14 items-center gap-2.5 bg-[var(--app-surface)] pe-3 ps-4 hover:bg-[var(--app-subtle)]',
          index > 0 && 'border-t border-border',
        )}
      >
        <button type="button" onClick={() => setOpenId(session.id)} aria-label={session.title[language]} className="absolute inset-0" />
        <div className="pointer-events-none flex min-w-0 flex-1 flex-col">
          <div className="flex min-w-0 items-center gap-2">
            {filter === 'all' && <AppGlyph app={app} size={16} badgeClassName="border-[var(--app-surface)] bg-[var(--app-surface)]" />}
            <span className="truncate text-[13px] font-medium text-foreground">{session.title[language]}</span>
          </div>
          <div className={cn('flex min-h-[18px] min-w-0 items-center gap-1.5 whitespace-nowrap text-xs text-[var(--app-fg2)]', filter === 'all' && 'ps-6')}>
            {showFolder && (
              <>
                <Folder className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                <span className="shrink-0">{session.project ? session.project.split('/').pop() : s.unknownDirectory}</span>
                <span>·</span>
              </>
            )}
            <span className="truncate">{fill(s.lastPrefix, { text: session.last[language] })}</span>
            {session.archived && (
              <span className="inline-flex h-[18px] shrink-0 items-center rounded-full border border-[var(--app-border-strong)] px-1.5 text-[11px]">
                {s.archived}
              </span>
            )}
          </div>
        </div>
        <div className="relative w-[92px] shrink-0 self-stretch">
          <span className="absolute end-0 top-[9px] text-xs tabular-nums text-[var(--app-fg2)] group-hover:invisible">{ago(session)}</span>
          <div className="invisible absolute -end-0.5 top-3.5 flex gap-0.5 group-hover:visible">
            {canResume && (
              <IconBtn
                icon={Play}
                label={fill(s.resumeIn, { terminal: 'Terminal' })}
                onClick={() => toast({ text: fill(s.launchedIn, { terminal: 'Terminal' }) })}
              />
            )}
            {canResume && <IconBtn icon={Copy} label={s.copyResumeCommand} onClick={() => toast({ text: s.resumeCommandCopied })} />}
            <MoreMenu
              label={t.demo.window.more}
              width="w-[210px]"
              items={[
                { label: s.copySessionId, onSelect: () => toast({ text: s.sessionIdCopied }) },
                { label: s.copySourcePath, onSelect: () => toast({ text: s.sourcePathCopied }) },
                {
                  label: p.common.delete,
                  danger: true,
                  separatorBefore: true,
                  onSelect: () => setDeleted((current) => [...current, session.id]),
                },
              ]}
            />
          </div>
        </div>
      </div>
    );
  };

  const groupMeta = (list: SampleSession[]) => {
    if (filter !== 'all') return fill(s.groupMeta, { count: list.length, time: ago(list[0]) });
    const counts = new Map<AppId, number>();
    list.forEach((session) => counts.set(session.app, (counts.get(session.app) ?? 0) + 1));
    return Array.from(counts, ([app, count]) => `${demoAppById[app].label} ${count}`).join(' · ');
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PaneHeader
        icon={<History className="h-5 w-5" strokeWidth={1.5} />}
        title={t.demo.window.nav.sessions}
        extra={<HelpTip title={s.helpTitle} body={s.help} />}
        actions={
          <MoreMenu
            large
            label={s.moreActions}
            width="w-[196px]"
            items={[
              { label: s.refreshList, onSelect: () => toast({ text: s.listRefreshed }) },
              { label: s.selectMany },
              { label: s.preferredTerminal },
              { label: s.whereMenu, separatorBefore: true },
            ]}
          />
        }
      />

      <div className="flex shrink-0 items-center gap-2 px-4 pt-3.5 sm:px-6">
        <span ref={picker} className="inline-flex">
          <Btn className="gap-2 pe-2 ps-2.5" onClick={() => setPickerOpen((open) => !open)}>
            <span className="inline-flex items-center gap-2">
              {filter === 'all' ? (
                <LayoutGrid className="h-4 w-4 text-[var(--app-fg2)]" />
              ) : (
                <AppGlyph app={demoAppById[filter]} size={16} badgeClassName="border-[var(--app-surface)] bg-[var(--app-surface)]" />
              )}
              <span className="hidden sm:inline">{filter === 'all' ? s.allApps : demoAppById[filter].label}</span>
              <span className="text-xs font-normal tabular-nums text-[var(--app-fg2)]">
                {filter === 'all' ? sessions.length : countOf(filter) || s.noSessions}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-[var(--app-fg2)]" />
            </span>
          </Btn>
        </span>
        <Floating anchor={picker} open={pickerOpen} onClose={() => setPickerOpen(false)} align="start" className="w-[240px]">
          <div className="flex flex-col">
            {(['all', ...sortedApps] as Filter[]).map((id, index) => {
              const count = id === 'all' ? sessions.length : countOf(id);
              return (
                <div key={id}>
                  {index === 1 && <div className="mx-1.5 my-1 h-px bg-border" />}
                  <button
                    type="button"
                    onClick={() => {
                      setFilter(id);
                      setPickerOpen(false);
                    }}
                    className={cn('flex h-8 w-full items-center gap-2 rounded-md px-2.5 text-[13px] hover:bg-[var(--app-subtle)]', id === filter && 'font-medium')}
                  >
                    {id === 'all' ? (
                      <LayoutGrid className="h-4 w-4 text-[var(--app-fg2)]" />
                    ) : (
                      <span className={cn(count === 0 && 'opacity-60')}>
                        <AppGlyph app={demoAppById[id]} size={16} badgeClassName="border-[var(--app-surface)] bg-[var(--app-surface)]" />
                      </span>
                    )}
                    <span className="flex-1 text-start">{id === 'all' ? s.allApps : demoAppById[id].label}</span>
                    <span className={cn('text-xs tabular-nums', count === 0 ? 'text-[var(--app-fg3)]' : 'text-[var(--app-fg2)]')}>
                      {count === 0 ? s.noSessions : count}
                    </span>
                    <Check className={cn('h-3.5 w-3.5', id !== filter && 'invisible')} />
                  </button>
                </div>
              );
            })}
          </div>
        </Floating>
        <SearchField value={query} onChange={setQuery} placeholder={s.searchPlaceholder} className="min-w-0 flex-1" />
        <Segmented
          layoutId="demo-sessions-group"
          className="hidden sm:inline-flex"
          value={groupBy}
          onChange={setGroupBy}
          items={[
            { id: 'time', label: s.groupByTime },
            { id: 'project', label: s.groupByProject },
          ]}
        />
      </div>

      <div className="mx-4 mb-4 mt-3 min-h-0 overflow-y-auto rounded-[10px] border border-border bg-[var(--app-surface)] sm:mx-6">
        {rows.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
            <p className="text-[13px] text-[var(--app-fg2)]">{fill(s.emptySearch, { query })}</p>
            <Btn compact onClick={() => setQuery('')}>
              {s.clearSearch}
            </Btn>
          </div>
        ) : groupBy === 'project' ? (
          projects.map((project, groupIndex) => {
            const list = rows.filter((session) => (session.project ?? UNKNOWN) === project);
            const open = Boolean(q) || expanded.includes(project);
            const name = project === UNKNOWN ? s.unknownDirectory : project.split('/').pop();
            const parent = project === UNKNOWN ? '' : project.slice(0, project.lastIndexOf('/') + 1);
            return (
              <div key={project}>
                <div className={cn('sticky top-0 z-[1] flex h-9 items-center gap-3 bg-[var(--app-subtle)] pe-3 ps-2.5', groupIndex > 0 && 'border-t border-border')}>
                  <button
                    type="button"
                    onClick={() =>
                      setExpanded((current) => (current.includes(project) ? current.filter((item) => item !== project) : [...current, project]))
                    }
                    className="flex h-7 min-w-0 flex-1 items-center gap-2.5 rounded-md pe-2 ps-1.5 text-[13px] font-semibold text-foreground hover:bg-[var(--app-selected)]"
                  >
                    <ChevronDown className={cn('h-4 w-4 shrink-0 text-[var(--app-fg2)] transition-transform duration-150', !open && '-rotate-90')} />
                    <span className="shrink-0">{name}</span>
                    {parent && (
                      <span className="hidden truncate text-xs font-normal text-[var(--app-fg3)] sm:inline">
                        {parent}
                        {name}
                      </span>
                    )}
                  </button>
                  <span className="max-w-[55%] truncate text-xs tabular-nums text-[var(--app-fg2)]">{groupMeta(list)}</span>
                </div>
                {open && list.map((session) => renderRow(session, 1, false))}
              </div>
            );
          })
        ) : (
          BUCKETS.map((bucket, bucketIndex) => {
            const list = rows.filter((session) => session.bucket === bucket);
            if (list.length === 0) return null;
            return (
              <div key={bucket}>
                <h4
                  className={cn(
                    'flex h-7 items-end px-4 pb-0.5 text-xs font-semibold text-[var(--app-fg2)]',
                    bucketIndex > 0 && 'border-t border-border',
                  )}
                >
                  {s[bucket]}
                </h4>
                {list.map((session, index) => renderRow(session, index, true))}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
