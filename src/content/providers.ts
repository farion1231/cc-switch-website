import anthropicIcon from '@/assets/icons/anthropic.svg';
import anthropicIconSvg from '@/assets/icons/anthropic.svg?raw';
import geminiIcon from '@/assets/icons/gemini-2.svg';
import hermesIcon from '@/assets/icons/hermes.png';
import minimaxIcon from '@/assets/icons/minimax.svg';
import openaiIcon from '@/assets/icons/openai.svg';
import openaiIconSvg from '@/assets/icons/openai.svg?raw';
import openClawIcon from '@/assets/icons/openclaw.svg';
import openCodeIcon from '@/assets/icons/opencode.svg';
import openRouterIcon from '@/assets/icons/openrouter.svg';
import openRouterIconSvg from '@/assets/icons/openrouter.svg?raw';
import packyCodeIcon from '@/assets/icons/packycode.svg';
import packyCodeIconSvg from '@/assets/icons/packycode.svg?raw';
import stepFunIcon from '@/assets/icons/stepfun.svg';
import stepFunIconSvg from '@/assets/icons/stepfun.svg?raw';
import lionccIcon from '@/assets/icons/sponsors/lioncc.svg';
import shengsuanyunIcon from '@/assets/icons/sponsors/shengsuanyun.svg';
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

export const claudeProviders: Provider[] = [
  {
    icon: packyCodeIcon,
    iconSvg: packyCodeIconSvg,
    iconBg: 'bg-emerald-500/20',
    iconColor: 'currentColor',
    name: 'PackyCode',
    subtitle: 'https://www.packyapi.com',
    time: '10',
    used: '672',
    remaining: '66',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: minimaxIcon,
    iconBg: 'bg-rose-500/20',
    name: 'MiniMax',
    subtitle: 'https://platform.minimaxi.com',
    time: '2',
    quota: {
      updatedMinutes: 2,
      tiers: [
        { label: '5h', utilization: 43, resetsIn: '2h40m' },
        { label: '7d', utilization: 12, resetsIn: '6d' },
      ],
    },
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: anthropicIcon,
    iconSvg: anthropicIconSvg,
    iconBg: 'bg-blue-500/20',
    iconColor: '#D4915D',
    name: 'Anthropic',
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
    icon: packyCodeIcon,
    iconSvg: packyCodeIconSvg,
    iconBg: 'bg-emerald-500/20',
    iconColor: 'currentColor',
    name: 'PackyCode',
    subtitle: 'https://www.packyapi.com',
    time: '5',
    used: '128',
    remaining: '372',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: minimaxIcon,
    iconBg: 'bg-rose-500/20',
    name: 'MiniMax',
    subtitle: 'https://platform.minimaxi.com',
    time: '3',
    quota: {
      updatedMinutes: 3,
      tiers: [
        { label: '5h', utilization: 58, resetsIn: '1h35m' },
        { label: '7d', utilization: 21, resetsIn: '5d18h' },
      ],
    },
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
  {
    icon: openaiIcon,
    iconSvg: openaiIconSvg,
    iconBg: 'bg-slate-500/20',
    iconColor: 'currentColor',
    name: 'OpenAI',
    subtitle: 'https://chatgpt.com/codex',
    isUrl: true,
    isSvgUrl: true,
  },
];

export const geminiProviders: Provider[] = [
  {
    icon: packyCodeIcon,
    iconSvg: packyCodeIconSvg,
    iconBg: 'bg-emerald-500/20',
    iconColor: 'currentColor',
    name: 'PackyCode',
    subtitle: 'https://www.packyapi.com',
    time: '2',
    used: '256',
    remaining: '744',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: minimaxIcon,
    iconBg: 'bg-rose-500/20',
    name: 'MiniMax',
    subtitle: 'https://platform.minimaxi.com',
    time: '6',
    quota: {
      updatedMinutes: 6,
      tiers: [
        { label: '5h', utilization: 49, resetsIn: '3h05m' },
        { label: '7d', utilization: 18, resetsIn: '6d2h' },
      ],
    },
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: geminiIcon,
    iconBg: 'bg-blue-500/20',
    name: 'Google AI',
    subtitle: 'https://ai.google.dev/',
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
    icon: openCodeIcon,
    iconBg: 'bg-indigo-500/20',
    name: 'Oh My OpenCode',
    subtitle: 'https://github.com/code-yeongyu/oh-my-openagent',
    time: '4',
    used: '214',
    remaining: '786',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: openRouterIcon,
    iconSvg: openRouterIconSvg,
    iconBg: 'bg-orange-500/20',
    iconColor: '#6566F1',
    name: 'TheRouter',
    subtitle: 'https://therouter.ai',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: packyCodeIcon,
    iconSvg: packyCodeIconSvg,
    iconBg: 'bg-emerald-500/20',
    iconColor: 'currentColor',
    name: 'PackyCode',
    subtitle: 'https://www.packyapi.com',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: stepFunIcon,
    iconSvg: stepFunIconSvg,
    iconBg: 'bg-cyan-500/15',
    iconColor: '#005AFF',
    name: 'StepFun',
    subtitle: 'https://platform.stepfun.com/step-plan',
    isUrl: true,
    isSvgUrl: true,
  },
];

export const openClawProviders: Provider[] = [
  {
    icon: openClawIcon,
    iconBg: 'bg-rose-500/20',
    name: 'OpenClaw Default',
    subtitle: 'https://github.com/openclaw/openclaw',
    time: '7',
    used: '93',
    remaining: '407',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: lionccIcon,
    iconBg: 'bg-lime-500/15',
    name: 'LionCCAPI',
    subtitle: 'https://vibecodingapi.ai',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: minimaxIcon,
    iconBg: 'bg-rose-500/20',
    name: 'MiniMax',
    subtitle: 'https://platform.minimaxi.com',
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
    icon: shengsuanyunIcon,
    iconBg: 'bg-amber-500/15',
    name: 'Shengsuanyun',
    subtitle: 'https://www.shengsuanyun.com',
    isUrl: true,
    isSvgUrl: true,
  },
];

export const hermesProviders: Provider[] = [
  {
    icon: hermesIcon,
    iconBg: 'bg-violet-500/20',
    name: 'Hermes Agent',
    subtitle: 'https://nousresearch.com/hermes-agent/',
    time: '3',
    used: '318',
    remaining: '682',
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
  {
    icon: hermesIcon,
    iconBg: 'bg-purple-500/15',
    name: 'Nous Research',
    subtitle: 'https://nousresearch.com',
    isUrl: true,
    isSvgUrl: true,
  },
];

export const defaultProviders = claudeProviders;
