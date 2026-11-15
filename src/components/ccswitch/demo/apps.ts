import { Monitor, Terminal, type LucideIcon } from 'lucide-react';
import {
  agyProviders,
  claudeDesktopProviders,
  claudeProviders,
  codexProviders,
  COPILOT_OFFICIAL,
  copilotProviders,
  DSH_ACCOUNT,
  dshProviders,
  geminiProviders,
  grokBuildProviders,
  hermesProviders,
  kimiCodeProviders,
  mcodeProviders,
  ompProviders,
  openClawProviders,
  opencodeProviders,
  piProviders,
  WORKBUDDY_OFFICIAL,
  workbuddyProviders,
  type Provider,
} from '@/content/providers';

import antigravityIcon from '@/assets/icons/antigravity.svg';
import claudeIcon from '@/assets/icons/claude.svg';
import copilotIconSvg from '@/assets/icons/githubcopilot.svg?raw';
import deepseekIcon from '@/assets/icons/deepseek.svg';
import geminiIcon from '@/assets/icons/gemini.svg';
import grokIconSvg from '@/assets/icons/grok.svg?raw';
import hermesIcon from '@/assets/icons/hermes.png';
import kimiCodeIconSvg from '@/assets/icons/kimi-code.svg?raw';
import minimaxIcon from '@/assets/icons/minimax.svg';
import ompIcon from '@/assets/icons/omp.svg';
import openaiIconSvg from '@/assets/icons/openai.svg?raw';
import openClawIcon from '@/assets/icons/openclaw.svg';
import openCodeIcon from '@/assets/icons/opencode.svg';
import piIconSvg from '@/assets/icons/pi.svg?raw';
import workbuddyIcon from '@/assets/icons/workbuddy.svg';

export type AppId =
  | 'claude'
  | 'claude-desktop'
  | 'codex'
  | 'gemini'
  | 'grokbuild'
  | 'opencode'
  | 'openclaw'
  | 'hermes'
  | 'pi'
  | 'mcode'
  | 'kimi'
  | 'dsh'
  | 'agy'
  | 'omp'
  | 'copilot'
  | 'workbuddy';

export type AppMode = 'direct' | 'route' | 'stack';

/**
 * How the app's page works, as in the real app:
 * - switch: one provider at a time, with the Direct / Routing (/ Aggregation) tabs
 * - additive: several providers written at once, Add / Remove
 * - launch: Antigravity, no provider in use; every card opens a terminal with it
 */
export type AppKind = 'switch' | 'additive' | 'launch';

export interface DemoApp {
  id: AppId;
  label: string;
  icon: string;
  iconSvg?: string;
  badge?: LucideIcon;
  kind: AppKind;
  modes?: AppMode[];
  providers: Provider[];
  /** The mode the app is in when the demo opens. */
  initialMode?: AppMode;
  /** Aggregation: default provider and the other members with their model counts. */
  stack?: { default: string; members: Record<string, number> };
  /** Additive apps: providers already written to the live config. */
  added?: string[];
  /** Pi says Enable instead of Add. */
  enableLabel?: boolean;
  /**
   * Additive cards that always sit first in Added and can't be removed: DeepSeek Harness's
   * signed-in account (no button), Copilot CLI's own login (Open Terminal).
   */
  pinned?: Record<string, 'none' | 'openTerminal'>;
  /** WorkBuddy's official cards: only the signed-in account is in Added; adding another swaps it in. */
  exclusive?: string[];
  /** DeepSeek Harness writes one list into both its Web and Desktop configs. */
  sharedList?: boolean;
  /** Providers that can't be used directly (format conversion, Desktop model mapping). */
  needsRoute?: string[];
}

export const demoApps: DemoApp[] = [
  {
    id: 'claude',
    label: 'Claude Code',
    icon: claudeIcon,
    badge: Terminal,
    kind: 'switch',
    modes: ['direct', 'route', 'stack'],
    providers: claudeProviders,
    stack: { default: 'Kimi For Coding', members: { 'Kimi For Coding': 2, PackyCode: 3, APINebula: 2 } },
  },
  {
    id: 'claude-desktop',
    label: 'Claude Desktop',
    icon: claudeIcon,
    badge: Monitor,
    kind: 'switch',
    modes: ['direct', 'route', 'stack'],
    providers: claudeDesktopProviders,
    // Opens in Routing, so the sidebar shows the tag and model-mapping providers are usable.
    initialMode: 'route',
    stack: { default: 'Kimi For Coding', members: { 'Kimi For Coding': 2, APINebula: 2, OpenRouter: 3 } },
    needsRoute: ['APINebula', 'PatewayAI', 'OpenRouter'],
  },
  {
    id: 'codex',
    label: 'Codex',
    icon: '',
    iconSvg: openaiIconSvg,
    kind: 'switch',
    modes: ['direct', 'route', 'stack'],
    providers: codexProviders,
    initialMode: 'stack',
    stack: { default: 'OpenAI Official', members: { 'OpenAI Official': 6, 'Kimi For Coding': 2, PackyCode: 3, AICodeMirror: 2 } },
    // The OpenRouter preset speaks OpenAI Chat, which Codex can only reach through routing.
    needsRoute: ['OpenRouter'],
  },
  { id: 'gemini', label: 'Gemini CLI', icon: geminiIcon, kind: 'switch', modes: ['direct', 'route'], providers: geminiProviders },
  {
    id: 'grokbuild',
    label: 'Grok Build',
    icon: '',
    iconSvg: grokIconSvg,
    kind: 'switch',
    modes: ['direct', 'route'],
    providers: grokBuildProviders,
  },
  {
    id: 'opencode',
    label: 'OpenCode',
    icon: openCodeIcon,
    kind: 'additive',
    providers: opencodeProviders,
    added: ['Kimi For Coding', 'PackyCode'],
  },
  {
    id: 'openclaw',
    label: 'OpenClaw',
    icon: openClawIcon,
    kind: 'additive',
    providers: openClawProviders,
    added: ['Kimi For Coding', 'PackyCode'],
  },
  {
    id: 'hermes',
    label: 'Hermes',
    icon: hermesIcon,
    kind: 'additive',
    providers: hermesProviders,
    added: ['Nous Research', 'Kimi For Coding'],
  },
  {
    id: 'pi',
    label: 'Pi',
    icon: '',
    iconSvg: piIconSvg,
    kind: 'additive',
    providers: piProviders,
    added: ['Kimi For Coding', 'Zhipu GLM'],
    enableLabel: true,
  },
  {
    id: 'mcode',
    label: 'MiniMax Code',
    icon: minimaxIcon,
    kind: 'additive',
    providers: mcodeProviders,
    added: ['MiniMax', 'Kimi For Coding'],
  },
  {
    id: 'kimi',
    label: 'Kimi Code',
    icon: '',
    iconSvg: kimiCodeIconSvg,
    kind: 'additive',
    providers: kimiCodeProviders,
    added: ['Kimi Official', 'Zhipu GLM'],
  },
  {
    id: 'dsh',
    label: 'DeepSeek Harness',
    icon: deepseekIcon,
    kind: 'additive',
    providers: dshProviders,
    added: [DSH_ACCOUNT, 'Kimi For Coding', 'PackyCode'],
    pinned: { [DSH_ACCOUNT]: 'none' },
    sharedList: true,
  },
  {
    id: 'agy',
    label: 'Antigravity',
    icon: antigravityIcon,
    kind: 'launch',
    providers: agyProviders,
  },
  {
    id: 'omp',
    label: 'Oh My Pi',
    icon: ompIcon,
    kind: 'additive',
    providers: ompProviders,
    added: ['Kimi For Coding', 'PackyCode'],
    enableLabel: true,
  },
  {
    id: 'copilot',
    label: 'Copilot CLI',
    icon: '',
    iconSvg: copilotIconSvg,
    kind: 'additive',
    providers: copilotProviders,
    added: [COPILOT_OFFICIAL, 'Kimi For Coding'],
    pinned: { [COPILOT_OFFICIAL]: 'openTerminal' },
  },
  {
    id: 'workbuddy',
    label: 'WorkBuddy',
    icon: workbuddyIcon,
    kind: 'additive',
    providers: workbuddyProviders,
    added: [WORKBUDDY_OFFICIAL[0], 'Kimi For Coding'],
    exclusive: WORKBUDDY_OFFICIAL,
  },
];

export const demoAppById = Object.fromEntries(demoApps.map((app) => [app.id, app])) as Record<AppId, DemoApp>;

/** Official logins never go through routing; Codex's is the one exception. */
export const blockedFromRouting = (app: AppId, provider: Provider) => Boolean(provider.official) && app !== 'codex';

export const needsRouting = (app: DemoApp, provider: Provider) => app.needsRoute?.includes(provider.name) ?? false;

/** `{name}` placeholders in the demo strings. */
export function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}
