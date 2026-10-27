import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { CircleHelp, Layers, MoreHorizontal, Plug, Plus, Route } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n/useLanguage';
import type { Provider } from '@/content/providers';
import { AppGlyph } from './AppGlyph';
import { blockedFromRouting, fill, needsRouting, type AppMode, type DemoApp } from './apps';
import type { AppDemoState } from './state';
import { DemoProviderCard, type DemoCardProps } from './DemoProviderCard';
import { useHoverTip } from './hoverTipContext';

const MODE_ICON = { direct: Plug, route: Route, stack: Layers } as const;

const MODE_TEXT: Record<AppMode, string> = {
  direct: 'text-[var(--app-direct-text)]',
  route: 'text-[var(--app-route-text)]',
  stack: 'text-[var(--app-stack-text)]',
};

const MODE_DOT: Record<AppMode, string> = {
  direct: 'bg-[var(--app-direct)]',
  route: 'bg-[var(--app-route)]',
  stack: 'bg-[var(--app-stack)]',
};

const MODE_BUTTON: Record<AppMode, string> = {
  direct: 'bg-[var(--app-direct)]',
  route: 'bg-[var(--app-route)]',
  stack: 'bg-[var(--app-stack)]',
};

interface ProvidersPaneProps {
  app: DemoApp;
  state: AppDemoState;
  onChange: (state: AppDemoState) => void;
}

export function ProvidersPane({ app, state, onChange }: ProvidersPaneProps) {
  const { t } = useLanguage();
  const { tip } = useHoverTip();
  const w = t.demo.window;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4 sm:px-6">
        <AppGlyph app={app} size={22} badgeClassName="border-background bg-background" />
        <h3 className="shrink-0 truncate text-lg font-semibold text-foreground">{app.label}</h3>
        {app.kind === 'switch' && <ModeBadge app={app} state={state} />}
        <span className="flex-1" />
        <button
          type="button"
          {...tip(w.addProvider)}
          className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-[var(--app-action)] px-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--app-action-hover)] sm:px-3"
        >
          <Plus className="h-4 w-4" strokeWidth={2.25} />
          <span className="hidden sm:inline">{w.addProvider}</span>
        </button>
        <button
          type="button"
          {...tip(w.more)}
          aria-label={w.more}
          className="hidden h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-[var(--app-subtle)] hover:text-foreground sm:flex"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </header>

      {app.kind === 'switch' ? (
        <SwitchModeBody app={app} state={state} onChange={onChange} />
      ) : app.kind === 'launch' ? (
        <LaunchBody app={app} />
      ) : (
        <AdditiveBody app={app} state={state} onChange={onChange} />
      )}
    </div>
  );
}

function SwitchModeBody({ app, state, onChange }: ProvidersPaneProps) {
  const { t } = useLanguage();
  const { tip } = useHoverTip();
  const w = t.demo.window;
  const modes = app.modes ?? ['direct'];
  const { active, view } = state;
  const modeName = (mode: AppMode) => w.modes[mode];
  const set = (patch: Partial<AppDemoState>) => onChange({ ...state, ...patch });

  const stackNames = Object.keys(state.stack);
  const routeReason = (provider: Provider) =>
    needsRouting(app, provider)
      ? fill(w.reason.needsRoute, { reason: app.id === 'claude-desktop' ? w.reason.desktopMapping : w.reason.openaiChat })
      : undefined;

  const activate = () => {
    if (view === 'direct') set({ active: 'direct' });
    else if (view === 'route') set({ active: 'route', route: state.route });
    else set({ active: 'stack', route: state.stackDefault });
  };

  const byName = (name: string) => app.providers.find((provider) => provider.name === name);
  let body: ReactNode;

  if (view === 'direct') {
    body = (
      <CardList>
        {app.providers.map((provider) => {
          const isPointer = provider.name === state.direct;
          const reason = routeReason(provider);
          const props: DemoCardProps = {
            provider,
            chips: [...officialChip(provider, w.chip.official), ...(reason ? [{ label: w.chip.needsRoute }] : [])],
          };
          if (active === 'direct') {
            if (isPointer) {
              props.current = 'direct';
              props.status = { label: w.cardStatus.inUse, tone: 'direct' };
            } else {
              props.button = {
                key: 'switch',
                label: w.action.switch,
                onClick: () => set({ direct: provider.name }),
                disabledReason: reason,
              };
            }
          } else {
            if (isPointer) props.chips = [...(props.chips ?? []), { label: w.chip.directWhenDirect }];
            props.button = {
              key: 'exitAndUse',
              label: w.action.exitAndUse,
              onClick: () => set({ active: 'direct', view: 'direct', direct: provider.name }),
              disabledReason: reason,
            };
          }
          return <DemoProviderCard key={provider.name} {...props} />;
        })}
      </CardList>
    );
  } else if (view === 'route') {
    body = (
      <CardList>
        {app.providers.map((provider) => {
          const props: DemoCardProps = { provider, chips: officialChip(provider, w.chip.official) };
          const blocked = blockedFromRouting(app.id, provider);
          if (active === 'route' && provider.name === state.route) {
            props.current = 'route';
            props.status = { label: w.cardStatus.routing, tone: 'route' };
          } else if (active === 'route') {
            props.button = {
              key: 'routeHere',
              label: w.action.routeHere,
              onClick: () => set({ route: provider.name }),
              disabledReason: blocked ? w.reason.noRoute : undefined,
            };
          }
          return <DemoProviderCard key={provider.name} {...props} />;
        })}
      </CardList>
    );
  } else {
    const defaultProvider = byName(state.stackDefault);
    const members = stackNames.map(byName).filter((provider): provider is Provider => Boolean(provider));
    const available = app.providers.filter(
      (provider) => provider.name !== state.stackDefault && !(provider.name in state.stack),
    );
    const live = active === 'stack';
    const removeMember = (name: string) => {
      const next = { ...state.stack };
      delete next[name];
      set({ stack: next });
    };

    body = (
      <>
        <SectionTitle title={live ? w.section.stackDefault : w.section.stackDefaultAfterSwitch} help={w.modeHelp.stack} />
        <CardList>
          {defaultProvider && (
            <DemoProviderCard
              provider={defaultProvider}
              current={live ? 'stack' : undefined}
              chips={[{ label: w.chip.default, tone: 'stack' }, ...officialChip(defaultProvider, w.chip.official)]}
              status={
                live
                  ? { label: w.cardStatus.currentDefault, tone: 'stack' }
                  : { label: w.cardStatus.defaultAfterSwitch, tone: 'muted' }
              }
            />
          )}
        </CardList>
        <SectionTitle title={fill(w.section.added, { count: members.length })} />
        <CardList>
          {members.map((provider) => (
            <DemoProviderCard
              key={provider.name}
              provider={provider}
              chips={[{ label: fill(w.chip.models, { count: state.stack[provider.name] }) }]}
              button={{ key: 'remove', label: w.action.remove, onClick: () => removeMember(provider.name) }}
            />
          ))}
        </CardList>
        {available.length > 0 && (
          <>
            <SectionTitle title={fill(w.section.available, { count: available.length })} />
            <CardList>
              {available.map((provider) => (
                <DemoProviderCard
                  key={provider.name}
                  provider={provider}
                  chips={officialChip(provider, w.chip.official)}
                  button={{
                    key: 'add',
                    label: w.action.add,
                    onClick: () => set({ stack: { ...state.stack, [provider.name]: 2 } }),
                    // Claude's subscriptions can't be in Aggregation at all; Codex's can only be the default.
                    disabledReason: blockedFromRouting(app.id, provider)
                      ? w.reason.noStack
                      : provider.official
                        ? w.reason.officialStack
                        : undefined,
                  }}
                />
              ))}
            </CardList>
          </>
        )}
      </>
    );
  }

  return (
    <>
      <div className="flex min-h-12 shrink-0 items-center gap-3 px-4 pt-3 sm:px-6">
        <div className="relative inline-flex h-9 shrink-0 items-center gap-0.5 rounded-[10px] bg-[var(--app-subtle)] p-[3px]">
          {modes.map((mode) => {
            const Icon = MODE_ICON[mode];
            const selected = mode === view;
            const isActive = mode === active;
            return (
              <button
                key={mode}
                type="button"
                aria-pressed={selected}
                onClick={() => set({ view: mode })}
                className={cn(
                  'relative inline-flex h-[30px] items-center justify-center gap-1.5 rounded-[7px] px-3 text-sm transition-colors sm:min-w-[88px]',
                  isActive ? MODE_TEXT[mode] : selected ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                  selected || isActive ? 'font-semibold' : 'font-medium',
                )}
              >
                {selected && (
                  <motion.span
                    layoutId={`mode-thumb-${app.id}`}
                    transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                    className="absolute inset-0 rounded-[7px] bg-background shadow-sm"
                  />
                )}
                <Icon className="relative h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                <span className="relative">{modeName(mode)}</span>
                {isActive && <span className={cn('relative h-1.5 w-1.5 rounded-full', MODE_DOT[mode])} />}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          {...tip([w.modeHelp.title, ...modes.map((mode) => w.modeHelp[mode])].join('\n'))}
          aria-label={w.modeHelp.title}
          className="-ml-1 hidden text-muted-foreground hover:text-foreground sm:block"
        >
          <CircleHelp className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 pt-3 sm:px-6">
        {view !== active && (
          <div className="mb-3 flex flex-col gap-3 rounded-xl border border-border bg-[var(--app-subtle)] px-4 py-3 sm:flex-row sm:items-center">
            <p className="min-w-0 flex-1 text-sm text-foreground">
              {fill(w.activate.viewing, { view: modeName(view), app: app.label, active: modeName(active) })}
            </p>
            <button
              type="button"
              onClick={activate}
              className={cn(
                'h-8 shrink-0 self-start rounded-lg px-3.5 text-sm font-medium text-white transition-opacity hover:opacity-90 sm:self-auto',
                MODE_BUTTON[view],
              )}
            >
              {w.activate[view]}
            </button>
          </div>
        )}
        {body}
      </div>
    </>
  );
}

/** The mode in effect, next to the title; the full sentence is in the hover tip (cc-switch SwitchModePanel). */
function ModeBadge({ app, state }: { app: DemoApp; state: AppDemoState }) {
  const { t } = useLanguage();
  const { tip } = useHoverTip();
  const w = t.demo.window;
  const { active } = state;
  const others = Object.keys(state.stack);
  const models = Object.values(state.stack).reduce((sum, count) => sum + count, 0);
  const sentence =
    active === 'direct'
      ? `${w.status.directLead} ${state.direct}`
      : active === 'route'
        ? `${w.status.routeLead} → ${state.route}`
        : `${w.status.stackLead} ${fill(w.status.stackValue, { name: state.stackDefault, count: others.length, models })}`;
  const name = active === 'direct' ? state.direct : active === 'route' ? state.route : state.stackDefault;

  return (
    <span
      key={app.id}
      tabIndex={0}
      {...tip(sentence)}
      aria-label={sentence}
      className="hidden min-w-0 items-center gap-1 rounded-full border border-border bg-[var(--app-surface)] px-2.5 py-1 text-[13px] sm:inline-flex"
    >
      <span aria-hidden="true" className={cn('me-1 h-1.5 w-1.5 shrink-0 rounded-full', MODE_DOT[active])} />
      <span className="shrink-0 text-[var(--app-fg2)]">{w.modes[active]}</span>
      <span aria-hidden="true" className="text-[var(--app-fg3)]">
        ·
      </span>
      <span className="min-w-0 truncate font-medium text-foreground">{name}</span>
    </span>
  );
}

/** Antigravity: a key only reaches the agy that CC Switch starts, so every card just opens a terminal. */
function LaunchBody({ app }: { app: DemoApp }) {
  const { t } = useLanguage();
  const w = t.demo.window;

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 pt-4 sm:px-6">
      <CardList>
        {app.providers.map((provider) => (
          <DemoProviderCard
            key={provider.name}
            provider={provider}
            chips={officialChip(provider, w.chip.official)}
            button={{ key: 'openTerminal', label: w.action.openTerminal, onClick: () => undefined }}
          />
        ))}
      </CardList>
    </div>
  );
}

function AdditiveBody({ app, state, onChange }: ProvidersPaneProps) {
  const { t } = useLanguage();
  const w = t.demo.window;
  const added = state.added
    .map((name) => app.providers.find((provider) => provider.name === name))
    .filter((provider): provider is Provider => Boolean(provider));
  const available = app.providers.filter((provider) => !state.added.includes(provider.name));
  const addLabel = app.enableLabel ? w.action.enable : w.action.add;

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 pt-1 sm:px-6">
      <SectionTitle title={fill(w.section.added, { count: added.length })} />
      <CardList>
        {added.map((provider) => (
          <DemoProviderCard
            key={provider.name}
            provider={provider}
            chips={officialChip(provider, w.chip.official)}
            button={{
              key: 'remove',
              label: w.action.remove,
              onClick: () => onChange({ ...state, added: state.added.filter((name) => name !== provider.name) }),
            }}
          />
        ))}
      </CardList>
      {available.length > 0 && (
        <>
          <SectionTitle title={fill(w.section.available, { count: available.length })} />
          <CardList>
            {available.map((provider) => (
              <DemoProviderCard
                key={provider.name}
                provider={provider}
                button={{
                  key: app.enableLabel ? 'enable' : 'add',
                  label: addLabel,
                  onClick: () => onChange({ ...state, added: [...state.added, provider.name] }),
                }}
              />
            ))}
          </CardList>
        </>
      )}
    </div>
  );
}

function officialChip(provider: Provider, label: string) {
  return provider.official ? [{ label }] : [];
}

function CardList({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-2.5">{children}</div>;
}

function SectionTitle({ title, help }: { title: string; help?: string }) {
  const { tip } = useHoverTip();
  return (
    <div className="mb-2 mt-4 flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground first:mt-1">
      {title}
      {help && (
        <span {...tip(help)} className="inline-flex">
          <CircleHelp className="h-3.5 w-3.5" strokeWidth={1.75} />
        </span>
      )}
    </div>
  );
}
