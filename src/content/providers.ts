import anthropicIcon from '@/assets/icons/anthropic.svg';
import anthropicIconSvg from '@/assets/icons/anthropic.svg?raw';
import deepseekIcon from '@/assets/icons/deepseek.svg';
import geminiIcon from '@/assets/icons/gemini-2.svg';
import grokIcon from '@/assets/icons/grok.svg';
import grokIconSvg from '@/assets/icons/grok.svg?raw';
import hermesIcon from '@/assets/icons/hermes.png';
import minimaxIcon from '@/assets/icons/minimax.svg';
import openaiIcon from '@/assets/icons/openai.svg';
import openaiIconSvg from '@/assets/icons/openai.svg?raw';
import openRouterIcon from '@/assets/icons/openrouter.svg';
import openRouterIconSvg from '@/assets/icons/openrouter.svg?raw';
import packyCodeIcon from '@/assets/icons/packycode.svg';
import packyCodeIconSvg from '@/assets/icons/packycode.svg?raw';
import aicodemirrorIcon from '@/assets/icons/sponsors/aicodemirror.svg';
import apinebulaIcon from '@/assets/icons/sponsors/apinebula_icon.png';
import kimiIcon from '@/assets/icons/sponsors/kimi.svg';
import kimiIconSvg from '@/assets/icons/sponsors/kimi.svg?raw';
import patewayIcon from '@/assets/icons/sponsors/pateway.jpg';
import zetaapiIcon from '@/assets/icons/sponsors/zetaapi-icon.png';
import zhipuIcon from '@/assets/icons/zhipu.svg';
import zhipuIconSvg from '@/assets/icons/zhipu.svg?raw';

export interface Provider {
  icon: string;
  iconSvg?: string;
  iconBg: string;
  iconColor?: string;
  name: string;
  subtitle: string;
  time?: string;
  used?: string;
  remaining?: string;
  quota?: {
    updatedMinutes: number;
    tiers: Array<{
      label: string;
      utilization: number;
      resetsIn?: string;
    }>;
  };
  isUrl?: boolean;
  isText?: boolean;
  isSvgUrl?: boolean;
}

// Demo cards mirror the app's preset order: the tool's own official provider,
// then Kimi (prime partner), then the top-ranked sponsors from the README;
// OpenRouter closes every list for overseas visitors.
export const claudeProviders: Provider[] = [
  {
    icon: anthropicIcon,
    iconSvg: anthropicIconSvg,
    iconBg: 'bg-blue-500/20',
    iconColor: '#D4915D',
    name: 'Claude Official',
    subtitle: 'https://www.anthropic.com/claude-code',
    time: '1',
    quota: {
      updatedMinutes: 1,
      tiers: [
        { label: '5h', utilization: 36, resetsIn: '2h10m' },
        { label: '7d', utilization: 64, resetsIn: '3d8h' },
      ],
    },
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: kimiIcon,
    iconSvg: kimiIconSvg,
    iconBg: 'bg-slate-500/20',
    iconColor: 'currentColor',
    name: 'Kimi For Coding',
    subtitle: 'https://www.kimi.com/code',
    time: '3',
    quota: {
      updatedMinutes: 3,
      tiers: [
        { label: '5h', utilization: 42, resetsIn: '3h35m' },
        { label: '7d', utilization: 18, resetsIn: '5d20h' },
      ],
    },
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: packyCodeIcon,
    iconSvg: packyCodeIconSvg,
    iconBg: 'bg-emerald-500/20',
    iconColor: 'currentColor',
    name: 'PackyCode',
    subtitle: 'https://www.packyapi.ai',
    time: '10',
    used: '672',
    remaining: '66',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: zetaapiIcon,
    iconBg: 'bg-sky-500/15',
    name: 'ZetaAPI',
    subtitle: 'https://zetaapi.ai',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: openRouterIcon,
    iconSvg: openRouterIconSvg,
    iconBg: 'bg-orange-500/20',
    iconColor: '#6566F1',
    name: 'OpenRouter',
    subtitle: 'https://openrouter.ai',
    isUrl: true,
    isSvgUrl: true,
  },
];

export const claudeDesktopProviders: Provider[] = [
  {
    icon: anthropicIcon,
    iconSvg: anthropicIconSvg,
    iconBg: 'bg-amber-500/20',
    iconColor: '#D4915D',
    name: 'Claude Desktop Official',
    subtitle: 'https://claude.ai/download',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: kimiIcon,
    iconSvg: kimiIconSvg,
    iconBg: 'bg-slate-500/20',
    iconColor: 'currentColor',
    name: 'Kimi For Coding',
    subtitle: 'https://www.kimi.com/code',
    time: '4',
    quota: {
      updatedMinutes: 4,
      tiers: [
        { label: '5h', utilization: 25, resetsIn: '4h10m' },
        { label: '7d', utilization: 33, resetsIn: '4d2h' },
      ],
    },
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: apinebulaIcon,
    iconBg: 'bg-indigo-500/15',
    name: 'APINebula',
    subtitle: 'https://apinebula.ai',
    time: '6',
    used: '238',
    remaining: '262',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: patewayIcon,
    iconBg: 'bg-sky-500/15',
    name: 'PatewayAI',
    subtitle: 'https://pateway.ai',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: openRouterIcon,
    iconSvg: openRouterIconSvg,
    iconBg: 'bg-orange-500/20',
    iconColor: '#6566F1',
    name: 'OpenRouter',
    subtitle: 'https://openrouter.ai',
    isUrl: true,
    isSvgUrl: true,
  },
];

export const codexProviders: Provider[] = [
  {
    icon: openaiIcon,
    iconSvg: openaiIconSvg,
    iconBg: 'bg-slate-500/20',
    iconColor: 'currentColor',
    name: 'OpenAI Official',
    subtitle: 'https://chatgpt.com/codex',
    time: '2',
    quota: {
      updatedMinutes: 2,
      tiers: [
        { label: '5h', utilization: 51, resetsIn: '1h50m' },
        { label: '7d', utilization: 23, resetsIn: '5d12h' },
      ],
    },
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: kimiIcon,
    iconSvg: kimiIconSvg,
    iconBg: 'bg-slate-500/20',
    iconColor: 'currentColor',
    name: 'Kimi For Coding',
    subtitle: 'https://www.kimi.com/code',
    time: '5',
    quota: {
      updatedMinutes: 5,
      tiers: [
        { label: '5h', utilization: 19, resetsIn: '4h25m' },
        { label: '7d', utilization: 46, resetsIn: '2d9h' },
      ],
    },
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: packyCodeIcon,
    iconSvg: packyCodeIconSvg,
    iconBg: 'bg-emerald-500/20',
    iconColor: 'currentColor',
    name: 'PackyCode',
    subtitle: 'https://www.packyapi.ai',
    time: '5',
    used: '128',
    remaining: '372',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: aicodemirrorIcon,
    iconBg: 'bg-cyan-500/15',
    name: 'AICodeMirror',
    subtitle: 'https://www.aicodemirror.ai',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: openRouterIcon,
    iconSvg: openRouterIconSvg,
    iconBg: 'bg-orange-500/20',
    iconColor: '#6566F1',
    name: 'OpenRouter',
    subtitle: 'https://openrouter.ai',
    isUrl: true,
    isSvgUrl: true,
  },
];

export const geminiProviders: Provider[] = [
  {
    icon: geminiIcon,
    iconBg: 'bg-blue-500/20',
    name: 'Google Official',
    subtitle: 'https://ai.google.dev/',
    time: '4',
    quota: {
      updatedMinutes: 4,
      tiers: [
        { label: 'Pro', utilization: 22, resetsIn: '14h' },
        { label: 'Flash', utilization: 8, resetsIn: '14h' },
      ],
    },
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: packyCodeIcon,
    iconSvg: packyCodeIconSvg,
    iconBg: 'bg-emerald-500/20',
    iconColor: 'currentColor',
    name: 'PackyCode',
    subtitle: 'https://www.packyapi.ai',
    time: '2',
    used: '256',
    remaining: '744',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: apinebulaIcon,
    iconBg: 'bg-indigo-500/15',
    name: 'APINebula',
    subtitle: 'https://apinebula.ai',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: aicodemirrorIcon,
    iconBg: 'bg-cyan-500/15',
    name: 'AICodeMirror',
    subtitle: 'https://www.aicodemirror.ai',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: openRouterIcon,
    iconSvg: openRouterIconSvg,
    iconBg: 'bg-orange-500/20',
    iconColor: '#6566F1',
    name: 'OpenRouter',
    subtitle: 'https://openrouter.ai',
    isUrl: true,
    isSvgUrl: true,
  },
];

export const opencodeProviders: Provider[] = [
  {
    icon: kimiIcon,
    iconSvg: kimiIconSvg,
    iconBg: 'bg-slate-500/20',
    iconColor: 'currentColor',
    name: 'Kimi For Coding',
    subtitle: 'https://www.kimi.com/code',
    time: '2',
    quota: {
      updatedMinutes: 2,
      tiers: [
        { label: '5h', utilization: 33, resetsIn: '2h45m' },
        { label: '7d', utilization: 21, resetsIn: '5d6h' },
      ],
    },
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: packyCodeIcon,
    iconSvg: packyCodeIconSvg,
    iconBg: 'bg-emerald-500/20',
    iconColor: 'currentColor',
    name: 'PackyCode',
    subtitle: 'https://www.packyapi.ai',
    time: '4',
    used: '214',
    remaining: '786',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: zetaapiIcon,
    iconBg: 'bg-sky-500/15',
    name: 'ZetaAPI',
    subtitle: 'https://zetaapi.ai',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: apinebulaIcon,
    iconBg: 'bg-indigo-500/15',
    name: 'APINebula',
    subtitle: 'https://apinebula.ai',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: openRouterIcon,
    iconSvg: openRouterIconSvg,
    iconBg: 'bg-orange-500/20',
    iconColor: '#6566F1',
    name: 'OpenRouter',
    subtitle: 'https://openrouter.ai',
    isUrl: true,
    isSvgUrl: true,
  },
];

export const openClawProviders: Provider[] = [
  {
    icon: kimiIcon,
    iconSvg: kimiIconSvg,
    iconBg: 'bg-slate-500/20',
    iconColor: 'currentColor',
    name: 'Kimi For Coding',
    subtitle: 'https://www.kimi.com/code',
    time: '8',
    quota: {
      updatedMinutes: 8,
      tiers: [
        { label: '5h', utilization: 72, resetsIn: '45m' },
        { label: '7d', utilization: 27, resetsIn: '4d6h' },
      ],
    },
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: packyCodeIcon,
    iconSvg: packyCodeIconSvg,
    iconBg: 'bg-emerald-500/20',
    iconColor: 'currentColor',
    name: 'PackyCode',
    subtitle: 'https://www.packyapi.ai',
    time: '7',
    used: '93',
    remaining: '407',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: zetaapiIcon,
    iconBg: 'bg-sky-500/15',
    name: 'ZetaAPI',
    subtitle: 'https://zetaapi.ai',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: aicodemirrorIcon,
    iconBg: 'bg-cyan-500/15',
    name: 'AICodeMirror',
    subtitle: 'https://www.aicodemirror.ai',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: openRouterIcon,
    iconSvg: openRouterIconSvg,
    iconBg: 'bg-orange-500/20',
    iconColor: '#6566F1',
    name: 'OpenRouter',
    subtitle: 'https://openrouter.ai',
    isUrl: true,
    isSvgUrl: true,
  },
];

export const hermesProviders: Provider[] = [
  {
    icon: hermesIcon,
    iconBg: 'bg-violet-500/20',
    name: 'Nous Research',
    subtitle: 'https://nousresearch.com',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: kimiIcon,
    iconSvg: kimiIconSvg,
    iconBg: 'bg-slate-500/20',
    iconColor: 'currentColor',
    name: 'Kimi For Coding',
    subtitle: 'https://www.kimi.com/code',
    time: '3',
    quota: {
      updatedMinutes: 3,
      tiers: [
        { label: '5h', utilization: 14, resetsIn: '4h40m' },
        { label: '7d', utilization: 37, resetsIn: '3d15h' },
      ],
    },
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: packyCodeIcon,
    iconSvg: packyCodeIconSvg,
    iconBg: 'bg-emerald-500/20',
    iconColor: 'currentColor',
    name: 'PackyCode',
    subtitle: 'https://www.packyapi.ai',
    time: '3',
    used: '318',
    remaining: '682',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: zetaapiIcon,
    iconBg: 'bg-sky-500/15',
    name: 'ZetaAPI',
    subtitle: 'https://zetaapi.ai',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: openRouterIcon,
    iconSvg: openRouterIconSvg,
    iconBg: 'bg-orange-500/20',
    iconColor: '#6566F1',
    name: 'OpenRouter',
    subtitle: 'https://openrouter.ai',
    isUrl: true,
    isSvgUrl: true,
  },
];

export const grokBuildProviders: Provider[] = [
  {
    icon: grokIcon,
    iconSvg: grokIconSvg,
    iconBg: 'bg-slate-500/20',
    iconColor: 'currentColor',
    name: 'Grok Official',
    subtitle: 'https://x.ai/grok',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: packyCodeIcon,
    iconSvg: packyCodeIconSvg,
    iconBg: 'bg-emerald-500/20',
    iconColor: 'currentColor',
    name: 'PackyCode',
    subtitle: 'https://www.packyapi.ai',
    time: '6',
    used: '184',
    remaining: '316',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: zetaapiIcon,
    iconBg: 'bg-sky-500/15',
    name: 'ZetaAPI',
    subtitle: 'https://zetaapi.ai',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: apinebulaIcon,
    iconBg: 'bg-indigo-500/15',
    name: 'APINebula',
    subtitle: 'https://apinebula.ai',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: openRouterIcon,
    iconSvg: openRouterIconSvg,
    iconBg: 'bg-orange-500/20',
    iconColor: '#6566F1',
    name: 'OpenRouter',
    subtitle: 'https://openrouter.ai',
    isUrl: true,
    isSvgUrl: true,
  },
];

export const piProviders: Provider[] = [
  {
    icon: kimiIcon,
    iconSvg: kimiIconSvg,
    iconBg: 'bg-slate-500/20',
    iconColor: 'currentColor',
    name: 'Kimi For Coding',
    subtitle: 'https://www.kimi.com/code',
    time: '3',
    quota: {
      updatedMinutes: 3,
      tiers: [
        { label: '5h', utilization: 27, resetsIn: '4h05m' },
        { label: '7d', utilization: 41, resetsIn: '2d18h' },
      ],
    },
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: packyCodeIcon,
    iconSvg: packyCodeIconSvg,
    iconBg: 'bg-emerald-500/20',
    iconColor: 'currentColor',
    name: 'PackyCode',
    subtitle: 'https://www.packyapi.ai',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: zetaapiIcon,
    iconBg: 'bg-sky-500/15',
    name: 'ZetaAPI',
    subtitle: 'https://zetaapi.ai',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: zhipuIcon,
    iconSvg: zhipuIconSvg,
    iconBg: 'bg-blue-500/20',
    iconColor: '#0F62FE',
    name: 'Zhipu GLM',
    subtitle: 'https://open.bigmodel.cn',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: openRouterIcon,
    iconSvg: openRouterIconSvg,
    iconBg: 'bg-orange-500/20',
    iconColor: '#6566F1',
    name: 'OpenRouter',
    subtitle: 'https://openrouter.ai',
    isUrl: true,
    isSvgUrl: true,
  },
];

export const mcodeProviders: Provider[] = [
  {
    icon: minimaxIcon,
    iconBg: 'bg-rose-500/20',
    name: 'MiniMax',
    subtitle: 'https://platform.minimax.cn',
    time: '2',
    quota: {
      updatedMinutes: 2,
      tiers: [
        { label: '5h', utilization: 38, resetsIn: '3h20m' },
        { label: '7d', utilization: 15, resetsIn: '5d9h' },
      ],
    },
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: kimiIcon,
    iconSvg: kimiIconSvg,
    iconBg: 'bg-slate-500/20',
    iconColor: 'currentColor',
    name: 'Kimi For Coding',
    subtitle: 'https://www.kimi.com/code',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: packyCodeIcon,
    iconSvg: packyCodeIconSvg,
    iconBg: 'bg-emerald-500/20',
    iconColor: 'currentColor',
    name: 'PackyCode',
    subtitle: 'https://www.packyapi.ai',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: deepseekIcon,
    iconBg: 'bg-blue-500/15',
    name: 'DeepSeek',
    subtitle: 'https://platform.deepseek.com',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: openRouterIcon,
    iconSvg: openRouterIconSvg,
    iconBg: 'bg-orange-500/20',
    iconColor: '#6566F1',
    name: 'OpenRouter',
    subtitle: 'https://openrouter.ai',
    isUrl: true,
    isSvgUrl: true,
  },
];

export const defaultProviders = claudeProviders;
