import { blockedFromRouting, type AppMode, type DemoApp } from './apps';

export interface AppDemoState {
  /** The mode in effect. */
  active: AppMode;
  /** The tab being looked at; tabs only view, the notice button changes the mode. */
  view: AppMode;
  direct: string;
  route: string;
  stackDefault: string;
  /** Other aggregation members (not the default) and their model counts. */
  stack: Record<string, number>;
  added: string[];
}

export function initialAppState(app: DemoApp): AppDemoState {
  const first = app.providers[0]?.name ?? '';
  const routable = app.providers.find((provider) => !blockedFromRouting(app.id, provider))?.name ?? first;
  const stackDefault = app.stack?.default ?? routable;
  const stack = { ...(app.stack?.members ?? {}) };
  delete stack[stackDefault];
  const active = app.initialMode ?? 'direct';

  return {
    active,
    view: active,
    direct: first,
    route: active === 'stack' ? stackDefault : routable,
    stackDefault,
    stack,
    added: app.added ?? [],
  };
}
