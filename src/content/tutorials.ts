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
