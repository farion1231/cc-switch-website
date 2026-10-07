import { Monitor, Terminal, type LucideIcon } from 'lucide-react';
import {
  claudeDesktopProviders,
  claudeProviders,
  codexProviders,
  geminiProviders,
  grokBuildProviders,
  hermesProviders,
  mcodeProviders,
  openClawProviders,
  opencodeProviders,
  piProviders,
  type Provider,
} from '@/content/providers';

import claudeIcon from '@/assets/icons/claude.svg';
import geminiIcon from '@/assets/icons/gemini.svg';
import grokIconSvg from '@/assets/icons/grok.svg?raw';
import hermesIcon from '@/assets/icons/hermes.png';
import minimaxIcon from '@/assets/icons/minimax.svg';
import openaiIconSvg from '@/assets/icons/openai.svg?raw';
import openClawIcon from '@/assets/icons/openclaw.svg';
import openCodeIcon from '@/assets/icons/opencode.svg';
import piIconSvg from '@/assets/icons/pi.svg?raw';

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
  | 'mcode';

export type AppMode = 'direct' | 'route' | 'stack';

/**
 * How the app's page works, as in the real app:
 * - switch: one provider at a time, with the Direct / Routing (/ Aggregation) tabs
 * - desktop: Claude Desktop, one provider at a time, access set per provider
 * - additive: several providers written at once, Add / Remove
 */
export type AppKind = 'switch' | 'desktop' | 'additive';

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
  /** Claude Desktop providers that go through model mapping. */
  mapping?: string[];
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
    stack: { default: 'Kimi For Coding', members: { 'Kimi For Coding': 2, PackyCode: 3, ZetaAPI: 2 } },
  },
  {
    id: 'claude-desktop',
    label: 'Claude Desktop',
    icon: claudeIcon,
    badge: Monitor,
    kind: 'desktop',
    providers: claudeDesktopProviders,
    mapping: ['APINebula', 'PatewayAI', 'OpenRouter'],
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
];

export const demoAppById = Object.fromEntries(demoApps.map((app) => [app.id, app])) as Record<AppId, DemoApp>;

/** Official logins never go through routing; Codex's is the one exception. */
export const blockedFromRouting = (app: AppId, provider: Provider) => Boolean(provider.official) && app !== 'codex';

/** `{name}` placeholders in the demo strings. */
export function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}
