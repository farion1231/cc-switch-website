import type { Language } from '@/i18n/translations';

export type LocalizedText = Record<Language, string>;

export type TutorialCategory =
  | 'getting-started'
  | 'practice'
  | 'integration'
  | 'troubleshooting'
  | 'video';

export type TutorialSource = 'official' | 'community';

export interface TutorialAuthor {
  name: string;
  avatar?: string;
  url?: string;
}

export interface Tutorial {
  /** URL slug. Also the markdown filename for in-site articles. */
  slug: string;
  title: LocalizedText;
  summary: LocalizedText;
  author: TutorialAuthor;
  /** Publish date in YYYY-MM-DD. */
  date: string;
  category: TutorialCategory;
  source: TutorialSource;
  /** Estimated reading time in minutes. */
  readMinutes: number;
  /**
   * If set, the card links out and there's no in-site detail page.
   * Otherwise the article is hosted at public/docs/tutorials/<lang>/<slug>.md.
   */
  externalUrl?: string;
  /** Languages this article is available in (when hosted in-site). */
  languages?: Language[];
  /** Optional accent color token for the card cover. */
  accent?: 'blue' | 'purple' | 'amber' | 'emerald' | 'rose';
  /** Optional emoji shown on the card cover when no image is provided. */
  emoji?: string;
  featured?: boolean;
}

export const tutorials: Tutorial[] = [
  {
    slug: 'codex-oauth-claude-code-local-routing',
    title: {
      zh: '用本地路由把 Codex 模型接到 Claude Code',
      en: 'Use Local Routing to Run Codex Models in Claude Code',
      ja: 'Local Routing で Codex モデルを Claude Code から使う',
    },
    summary: {
      zh: '基于 GitHub issue #1997 的社区讨论，梳理 Codex OAuth 反向代理、本地路由、Claude 路由接管、全局终端启动和常见报错排查。',
      en: 'A practical guide based on GitHub issue #1997 covering Codex OAuth reverse proxy, Local Routing, Claude routing takeover, launching from a normal terminal, and common pitfalls.',
      ja: 'GitHub issue #1997 の議論をもとに、Codex OAuth リバースプロキシ、Local Routing、Claude ルーティング、通常のターミナル起動、よくある落とし穴を整理します。',
    },
    author: { name: 'CC Switch Team', url: 'https://github.com/farion1231/cc-switch/issues/1997' },
    date: '2026-05-06',
    category: 'practice',
    source: 'official',
    readMinutes: 11,
    languages: ['zh'],
    accent: 'amber',
    emoji: '🔀',
    featured: true,
  },
  {
    slug: 'khazix-agent-model-switching',
    title: {
      zh: '这个 51K 星标的开源神器，让任何 Agent 都能一键切换所有模型',
      en: 'A 51K-star Open Source Tool for Switching Models Across Any Agent',
      ja: '51K スターの OSS ツールで、あらゆる Agent のモデルをワンクリック切り替え',
    },
    summary: {
      zh: '数字生命卡兹克的社区长文，系统介绍 CC Switch 的安装、供应商配置、热切换、用量追踪和本地路由故障转移。',
      en: 'A community long-form guide by Khazix covering CC Switch installation, provider setup, hot switching, usage tracking, and local routing failover.',
      ja: 'Khazix によるコミュニティ記事。CC Switch のインストール、Provider 設定、ホットスイッチ、使用量追跡、Local Routing のフェイルオーバーを紹介。',
    },
    author: { name: '数字生命卡兹克', url: 'https://x.com/Khazix0918' },
    date: '2026-04-28',
    category: 'getting-started',
    source: 'community',
    readMinutes: 15,
    externalUrl: 'https://x.com/Khazix0918/article/2048983462942789978',
    accent: 'emerald',
    emoji: '🧭',
    featured: true,
  },
  {
    slug: 'siliconflow-cc-switch-guide',
    title: {
      zh: 'CC Switch - SiliconFlow',
      en: 'CC Switch - SiliconFlow',
      ja: 'CC Switch - SiliconFlow',
    },
    summary: {
      zh: 'SiliconFlow 官方文档，介绍如何下载安装 CC Switch、获取 SiliconFlow API Key、为 Claude Code / OpenClaw 添加 SiliconFlow 供应商，并使用托盘切换、MCP、用量统计等进阶功能。',
      en: 'SiliconFlow official documentation covering CC Switch installation, SiliconFlow API key setup, Claude Code / OpenClaw provider configuration, tray switching, MCP, usage tracking, and advanced workflows.',
      ja: 'SiliconFlow 公式ドキュメント。CC Switch のインストール、SiliconFlow API Key、Claude Code / OpenClaw の Provider 設定、トレイ切替、MCP、使用量統計などを紹介します。',
    },
    author: { name: 'SiliconFlow', url: 'https://www.siliconflow.cn/' },
    date: '2026-04-15',
    category: 'integration',
    source: 'community',
    readMinutes: 8,
    externalUrl: 'https://docs.siliconflow.cn/cn/usercases/use-siliconcloud-in-ccswitch',
    accent: 'purple',
    emoji: '☁️',
    featured: true,
  },
  {
    slug: 'minimax-ai-coding-tools',
    title: {
      zh: '通过 CC Switch 将 MiniMax 接入 Claude Code',
      en: 'Use MiniMax with AI Coding Tools',
      ja: 'AI コーディングツールで MiniMax を使う',
    },
    summary: {
      zh: 'MiniMax 开放平台文档，介绍 MiniMax-M2.7 与 MiniMax-M2.7-highspeed 如何通过 OpenAI / Anthropic 兼容接口接入 Claude Code、Codex、Cursor、OpenCode、OpenClaw、Zed 等 AI 编程工具。',
      en: 'MiniMax official documentation for connecting MiniMax-M2.7 and MiniMax-M2.7-highspeed to AI coding tools such as Claude Code, Codex, Cursor, OpenCode, OpenClaw, and Zed through OpenAI / Anthropic compatible APIs.',
      ja: 'MiniMax 公式ドキュメント。MiniMax-M2.7 / MiniMax-M2.7-highspeed を OpenAI / Anthropic 互換 API 経由で Claude Code、Codex、Cursor、OpenCode、OpenClaw、Zed などに接続する方法を紹介します。',
    },
    author: { name: 'MiniMax', url: 'https://platform.minimaxi.com/' },
    date: '2026-05-06',
    category: 'integration',
    source: 'community',
    readMinutes: 14,
    externalUrl: 'https://platform.minimaxi.com/docs/guides/text-ai-coding-tools',
    accent: 'rose',
    emoji: '⚡',
    featured: true,
  },
  {
    slug: 'yinmin-cc-switch-claude-code-getting-started',
    title: {
      zh: '使用 CC-Switch，一键配置你的 Claude Code',
      en: 'Use CC Switch to Configure Claude Code in One Click',
      ja: 'CC Switch で Claude Code をワンクリック設定',
    },
    summary: {
      zh: '尹珉的 CC Switch 入门教程，介绍如何统一管理 Claude Code、Codex、Gemini CLI、OpenCode、OpenClaw 的 Provider 配置，并接入 Kimi、GLM 等模型。',
      en: 'A getting-started guide by Yin Min covering provider management for Claude Code, Codex, Gemini CLI, OpenCode, and OpenClaw, including Kimi and GLM setup.',
      ja: '尹珉による入門ガイド。Claude Code、Codex、Gemini CLI、OpenCode、OpenClaw の Provider 設定を統一管理し、Kimi や GLM を接続する方法を紹介します。',
    },
    author: { name: '尹珉', url: 'https://x.com/yinmin1987' },
    date: '2026-03-10',
    category: 'getting-started',
    source: 'community',
    readMinutes: 8,
    externalUrl: 'https://x.com/yinmin1987/article/2031182350433059032',
    accent: 'purple',
    emoji: '🧩',
    featured: true,
  },
  {
    slug: 'isolated-claude-terminal-providers',
    title: {
      zh: '如何在不同的 Claude Code 终端使用不同的供应商',
      en: 'Use Different Providers in Different Claude Code Terminals',
      ja: 'Claude Code の複数ターミナルで別々の Provider を使う',
    },
    summary: {
      zh: 'Jason Young 的实操帖：CC Switch v3.10 新增带配置环境隔离的“打开终端”功能，让每个 Claude Code 终端只使用对应供应商配置，不受全局热切换影响。',
      en: 'A hands-on post by Jason Young: CC Switch v3.10 added isolated “Open Terminal” sessions so each Claude Code terminal can use its own provider configuration without being affected by global hot switching.',
      ja: 'Jason Young による実践メモ。CC Switch v3.10 の隔離された「ターミナルを開く」により、各 Claude Code ターミナルで個別の Provider 設定を使い、グローバルなホットスイッチの影響を避けられます。',
    },
    author: { name: 'Jason Young', url: 'https://x.com/Jason_Young1231' },
    date: '2026-01-24',
    category: 'practice',
    source: 'official',
    readMinutes: 2,
    externalUrl: 'https://x.com/Jason_Young1231/status/2015038067149799924',
    accent: 'blue',
    emoji: '🖥️',
    featured: true,
  },
  {
    slug: 'codex-two-official-subscriptions',
    title: {
      zh: '用 CC Switch 在多个官方 Codex 订阅之间快速切换',
      en: 'Switch Between Multiple Official Codex Subscriptions with CC Switch',
      ja: 'CC Switch で複数の公式 Codex サブスクリプションを素早く切り替える',
    },
    summary: {
      zh: 'Jason Young 的实操帖：添加多个 OpenAI 官方供应商，配合 Codex /logout 获取不同账号的 access token，在多个 Plus 订阅之间快速切换。',
      en: 'A hands-on post by Jason Young: add multiple official OpenAI providers, use Codex /logout to capture access tokens for different accounts, and switch between multiple Plus subscriptions.',
      ja: 'Jason Young による実践メモ。複数の OpenAI 公式 Provider を追加し、Codex /logout で別アカウントの access token を取得して、複数の Plus サブスクリプションを切り替えます。',
    },
    author: { name: 'Jason Young', url: 'https://x.com/Jason_Young1231' },
    date: '2025-11-06',
    category: 'practice',
    source: 'official',
    readMinutes: 3,
    externalUrl: 'https://x.com/Jason_Young1231/status/1986363241791205435',
    accent: 'blue',
    emoji: '🔁',
    featured: true,
  },
];

export function getTutorialBySlug(slug: string): Tutorial | undefined {
  return tutorials.find((tutorial) => tutorial.slug === slug);
}

export function isInSiteTutorial(tutorial: Tutorial): boolean {
  return !tutorial.externalUrl;
}

export function tutorialAvailableInLanguage(tutorial: Tutorial, language: Language): boolean {
  if (tutorial.externalUrl) return true;
  return tutorial.languages?.includes(language) ?? true;
}
