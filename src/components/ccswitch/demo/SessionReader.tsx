import { useRef, useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronLeft, ChevronRight, Copy, FileText, Folder, PanelRight, Play, SquareTerminal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n/useLanguage';
import { AppGlyph } from './AppGlyph';
import { demoAppById, fill } from './apps';
import { Btn, IconBtn, MenuTrigger, MoreMenu, PaneHeader, Segmented } from './parts';
import { AGENT_MODEL, type SampleSession, type SampleStep, type SampleTurn } from './samples';
import { useShell } from './shellContext';

type Filter = 'all' | 'chat' | 'changes';

const TERMINAL = 'Terminal';

const accentOf = (app: string) =>
  ['claude', 'codex', 'gemini', 'opencode', 'pi'].includes(app) ? `var(--app-agent-${app})` : 'var(--app-fg2)';

export function SessionReader({
  session,
  onBack,
  onPrev,
  onNext,
}: {
  session: SampleSession;
  onBack: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  const { t, language } = useLanguage();
  const { toast } = useShell();
  const p = t.demo.window.pages;
  const r = p.reader;
  const s = p.sessions;
  const app = demoAppById[session.app];
  const [filter, setFilter] = useState<Filter>('all');
  const [outline, setOutline] = useState(true);
  const [active, setActive] = useState(0);
  const turnRefs = useRef<Array<HTMLDivElement | null>>([]);
  const canResume = session.app !== 'hermes' && session.app !== 'openclaw';
  const steps = session.turns.flatMap((turn) => turn.steps);
  const first = session.turns[0];
  const last = session.turns[session.turns.length - 1];

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PaneHeader
        small
        leading={<IconBtn icon={ArrowLeft} label={r.back} onClick={onBack} className="-ms-2" />}
        icon={<AppGlyph app={app} size={16} badgeClassName="border-background bg-background" />}
        title={session.title[language]}
        actions={
          <>
            <div className="hidden items-center sm:flex">
              <IconBtn icon={ChevronLeft} label={r.prev} large onClick={onPrev} disabled={!onPrev} />
              <IconBtn icon={ChevronRight} label={r.next} large onClick={onNext} disabled={!onNext} />
            </div>
            {canResume ? (
              <div className="flex">
                <Btn
                  variant="solid"
                  icon={Play}
                  hideLabelOnMobile
                  className="rounded-e-none pe-3.5 ps-3"
                  onClick={() => toast({ text: fill(s.launchedIn, { terminal: TERMINAL }) })}
                >
                  {fill(s.resumeIn, { terminal: TERMINAL })}
                </Btn>
                <MenuTrigger
                  align="end"
                  width="w-[300px]"
                  items={[
                    {
                      label: fill(s.resumeIn, { terminal: TERMINAL }),
                      icon: <Play className="h-3.5 w-3.5" />,
                      onSelect: () => toast({ text: fill(s.launchedIn, { terminal: TERMINAL }) }),
                    },
                    {
                      label: s.copyResumeCommand,
                      icon: <Copy className="h-3.5 w-3.5" />,
                      onSelect: () => toast({ text: s.resumeCommandCopied }),
                    },
                    { label: r.copyCdResume, icon: <Folder className="h-3.5 w-3.5" />, onSelect: () => toast({ text: s.resumeCommandCopied }) },
                    {
                      label: r.changeTerminal,
                      icon: <SquareTerminal className="h-3.5 w-3.5" />,
                      separatorBefore: true,
                      hint: session.app === 'codex' ? r.codexResumeNote : undefined,
                    },
                  ]}
                  trigger={(_, toggle) => (
                    <button
                      type="button"
                      onClick={toggle}
                      aria-label={r.moreResume}
                      className="flex h-8 w-8 items-center justify-center rounded-e-md border-s border-white/20 bg-[var(--app-action)] text-white hover:bg-[var(--app-action-hover)]"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  )}
                />
              </div>
            ) : (
              <Btn variant="solid" icon={Copy} disabled hideLabelOnMobile>
                {s.copyResumeCommand}
              </Btn>
            )}
            <MoreMenu
              large
              label={t.demo.window.more}
              width="w-[230px]"
              items={[
                { label: r.copyAsMarkdown },
                { label: r.exportMarkdown },
                { label: s.copySessionId, onSelect: () => toast({ text: s.sessionIdCopied }) },
                { label: s.copySourcePath, onSelect: () => toast({ text: s.sourcePathCopied }) },
                { label: r.reload },
              ]}
            />
          </>
        }
      />

      <div className="flex shrink-0 flex-col border-b border-border py-1.5 pe-4 ps-4 sm:ps-6">
        <div className="flex min-h-8 flex-wrap items-center gap-x-2 gap-y-1">
          <div className="flex min-w-0 flex-1 items-center gap-2 text-xs tabular-nums text-[var(--app-fg2)]">
            <span className="hidden min-w-0 items-center gap-1 rounded-md border border-border bg-[var(--app-subtle)] px-1.5 py-0.5 text-foreground md:inline-flex">
              <FileText className="h-3 w-3 shrink-0 text-[var(--app-fg3)]" />
              <span className="truncate font-mono">{session.project ?? '~'}</span>
            </span>
            <span className="whitespace-nowrap">
              {first.time} → {last.time}
            </span>
            <span className="hidden text-[var(--app-fg3)] sm:inline">·</span>
            <span className="hidden whitespace-nowrap sm:inline">
              {fill(r.questionsCount, { count: session.turns.length })} · {fill(r.toolsCount, { count: steps.length })}
            </span>
            <span className="hidden truncate font-mono text-[var(--app-fg3)] lg:inline">{AGENT_MODEL[session.app]}</span>
          </div>
          <div className="flex items-center gap-0.5">
            <IconBtn icon={PanelRight} label={r.outlineTitle} large active={outline} onClick={() => setOutline((value) => !value)} className="hidden lg:inline-flex" />
            <Segmented
              small
              layoutId="demo-reader-filter"
              className="mx-1"
              value={filter}
              onChange={setFilter}
              items={[
                { id: 'all', label: r.filterAll },
                { id: 'chat', label: r.filterChat },
                { id: 'changes', label: r.filterChanges },
              ]}
            />
          </div>
        </div>
        {!canResume && <p className="pb-0.5 text-xs text-[var(--app-fg2)]">{r.noResumeHermes}</p>}
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="min-w-0 flex-1 overflow-y-auto px-4 pb-6 pt-4 sm:px-6">
          {filter === 'changes' && !steps.some((step) => step.kind === 'edit') ? (
            <p className="py-10 text-center text-[13px] text-[var(--app-fg2)]">{r.noChanges}</p>
          ) : (
            session.turns.map((turn, index) => (
              <div
                key={turn.time}
                ref={(node) => {
                  turnRefs.current[index] = node;
                }}
                className="mx-auto w-full max-w-[820px]"
              >
                {index > 0 && <div className="py-4"><div className="h-px bg-border" /></div>}
                <Turn turn={turn} session={session} filter={filter} />
              </div>
            ))
          )}
        </div>

        {outline && (
          <aside className="hidden w-[240px] shrink-0 flex-col border-s border-border lg:flex">
            <div className="flex h-9 shrink-0 items-center gap-1.5 px-4 text-xs font-semibold text-[var(--app-fg2)]">
              {r.outlineTitle}
              <span className="font-normal text-[var(--app-fg3)]">{session.turns.length}</span>
            </div>
            <ol className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
              {session.turns.map((turn, index) => (
                <li key={turn.time}>
                  <button
                    type="button"
                    onClick={() => {
                      setActive(index);
                      turnRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className={cn('relative w-full rounded-[10px] px-1.5 py-1.5 text-start', active === index && 'bg-[var(--app-subtle)]')}
                  >
                    {active === index && (
                      <span className="absolute inset-y-2 start-0 w-0.5 rounded-full" style={{ background: accentOf(session.app) }} />
                    )}
                    <span className="block text-end text-[11px] text-[var(--app-fg3)]">
                      {r.you} · {turn.time}
                    </span>
                    <span
                      className="ms-auto mt-0.5 line-clamp-2 block max-w-[200px] rounded-[10px] rounded-se-[3px] px-2 py-1 text-xs text-foreground"
                      style={{ background: `color-mix(in srgb, ${accentOf(session.app)} 14%, var(--app-subtle))` }}
                    >
                      {turn.question[language]}
                    </span>
                    <span className="mt-1.5 flex items-start gap-1.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border bg-[var(--app-surface)]">
                        <AppGlyph app={app} size={11} badgeClassName="hidden" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[11px] text-[var(--app-fg3)]">
                          {fill(r.outlineSteps, { count: turn.steps.length })}
                          {turn.steps.some((step) => step.failed) && (
                            <span className="ms-1 inline-block h-1.5 w-1.5 rounded-full bg-[var(--app-danger)] align-middle" />
                          )}
                        </span>
                        <span className="line-clamp-2 text-xs text-[var(--app-fg2)]">{turn.reply[language]}</span>
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </aside>
        )}
      </div>
    </div>
  );
}

function Turn({ turn, session, filter }: { turn: SampleTurn; session: SampleSession; filter: Filter }) {
  const { t, language } = useLanguage();
  const r = t.demo.window.pages.reader;
  const app = demoAppById[session.app];
  const accent = accentOf(session.app);
  const [expanded, setExpanded] = useState(false);
  const commands = turn.steps.filter((step) => step.kind === 'run').length;
  const files = new Set(turn.steps.filter((step) => step.kind === 'edit').map((step) => step.target)).size;
  const failed = turn.steps.filter((step) => step.failed).length;
  const visibleSteps = filter === 'changes' ? turn.steps.filter((step) => step.kind === 'edit') : turn.steps;
  const showSteps = filter === 'changes' || expanded;

  if (filter === 'changes' && visibleSteps.length === 0) return null;

  return (
    <div>
      {filter !== 'changes' && (
        <div className="flex justify-end pb-3 ps-10 sm:ps-16">
          <div className="flex max-w-[72%] flex-col items-end">
            <span className="h-5 text-xs text-[var(--app-fg3)]">{turn.time}</span>
            <div
              className="rounded-[16px] rounded-se-[4px] px-3.5 py-2 text-[13px] leading-5 text-foreground"
              style={{ background: `color-mix(in srgb, ${accent} 14%, var(--app-subtle))` }}
            >
              {turn.question[language]}
            </div>
          </div>
        </div>
      )}

      <div className="relative pe-2 ps-10 sm:pe-10">
        <span className="absolute start-0 top-0 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-[var(--app-surface)]">
          <AppGlyph app={app} size={16} badgeClassName="hidden" />
        </span>
        <div className="flex h-7 items-center gap-1.5 px-1.5 text-xs">
          <span className="font-semibold text-foreground">{app.label}</span>
          <span className="text-[var(--app-fg3)]">{turn.time}</span>
          <span className="hidden truncate font-mono text-[var(--app-fg3)] sm:inline">· {AGENT_MODEL[session.app]}</span>
        </div>

        {filter !== 'chat' && turn.steps.length > 0 && (
          <>
            {filter === 'all' && (
              <button
                type="button"
                onClick={() => setExpanded((value) => !value)}
                aria-label={r.expandTimeline}
                className="flex h-8 max-w-full items-center gap-1 rounded-md px-1.5 text-xs text-[var(--app-fg2)] hover:bg-[var(--app-subtle)]"
              >
                <ChevronRight className={cn('h-3.5 w-3.5 shrink-0 transition-transform', expanded && 'rotate-90')} />
                <span className="truncate">
                  <span className="font-medium text-foreground">{fill(r.timelineSummary, { steps: turn.steps.length })}</span>
                  {commands > 0 && ` · ${fill(r.summaryCommands, { count: commands })}`}
                  {files > 0 && ` · ${fill(r.summaryFiles, { count: files })}`}
                  {failed > 0 && <span className="text-[var(--app-danger-text)]"> · {fill(r.summaryErrors, { count: failed })}</span>}
                  {` · ⏱ ${turn.duration}`}
                </span>
              </button>
            )}
            {showSteps && (
              <ul className="ms-[13px] border-s border-border ps-2">
                {visibleSteps.map((step, index) => (
                  <StepRow key={`${step.kind}-${step.target}-${index}`} step={step} claudeStyle={session.app === 'claude'} />
                ))}
              </ul>
            )}
          </>
        )}

        {filter !== 'changes' && (
          <p className="px-1.5 pb-1 pt-2 text-[13px] leading-6 text-foreground">{turn.reply[language]}</p>
        )}
      </div>
    </div>
  );
}

function StepRow({ step, claudeStyle }: { step: SampleStep; claudeStyle: boolean }) {
  const title = claudeStyle
    ? { read: 'Read', run: 'Bash', edit: 'Update' }[step.kind]
    : { read: 'Read', run: 'Ran', edit: 'Edited' }[step.kind];
  return (
    <li className="flex h-8 items-center gap-2 rounded-md px-1.5 text-xs hover:bg-[var(--app-subtle)]">
      <span
        className={cn(
          'w-4 shrink-0 text-center',
          step.failed ? 'text-[var(--app-danger)]' : claudeStyle ? 'text-[var(--app-success-text)]' : 'text-[var(--app-fg3)]',
        )}
      >
        {claudeStyle ? '⏺' : '•'}
      </span>
      <span className={cn('min-w-0 flex-1 truncate text-foreground', claudeStyle && 'font-mono')}>
        {claudeStyle ? (
          <>
            <span className="font-semibold">{title}</span>({step.target})
          </>
        ) : (
          <>
            <span className="font-medium">{title}</span> {step.target}
          </>
        )}
      </span>
      {step.kind === 'edit' && (
        <span className="shrink-0 tabular-nums">
          <span className="text-[var(--app-success-text)]">+{step.added}</span>{' '}
          <span className="text-[var(--app-danger-text)]">−{step.removed}</span>
        </span>
      )}
      {step.failed && <span className="shrink-0 tabular-nums text-[var(--app-danger-text)]">exit 1</span>}
    </li>
  );
}
