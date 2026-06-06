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

export interface TutorialCoverIcon {
  src: string;
  alt: string;
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
  /** Optional icon pair/group shown on the card cover. */
  coverIcons?: TutorialCoverIcon[];
  /** Optional emoji shown on the card cover when no image is provided. */
  emoji?: string;
  featured?: boolean;
}

const tutorialIcons = {
  ccSwitch: { src: '/docs/assets/tutorial-icons/cc-switch.png', alt: 'CC Switch' },
  claude: { src: '/docs/assets/tutorial-icons/claude.svg', alt: 'Claude' },
  codex: { src: '/docs/assets/tutorial-icons/codex.svg', alt: 'Codex' },
  deepseek: { src: '/docs/assets/tutorial-icons/deepseek.svg', alt: 'DeepSeek' },
  kimi: { src: '/docs/assets/tutorial-icons/kimi.svg', alt: 'Kimi' },
  minimax: { src: '/docs/assets/tutorial-icons/minimax.svg', alt: 'MiniMax' },
  siliconflow: { src: '/docs/assets/tutorial-icons/siliconflow.svg', alt: 'SiliconFlow' },
  zhipu: { src: '/docs/assets/tutorial-icons/zhipu.svg', alt: 'Zhipu GLM' },
} satisfies Record<string, TutorialCoverIcon>;

export const tutorials: Tutorial[] = [
  {
    slug: 'cc-switch-cli-headless-guide',
    title: {
      zh: '在无图形界面的服务器上用好 cc-switch',
      en: 'Using cc-switch on Headless Servers: TUI + CLI Guide',
      ja: 'ヘッドレスサーバーで cc-switch を使いこなす',
    },
    summary: {
      zh: '社区实战攻略：在 SSH / Docker / WSL 等没有桌面环境的地方，用 cc-switch CLI 版的 TUI 全屏界面和 CLI 命令行两种模式管理供应商、同步 WebDAV、检查环境冲突，与桌面 GUI 版无缝配合。',
      en: 'A community guide covering cc-switch CLI on headless servers (SSH / Docker / WSL): TUI interactive mode, CLI subcommands, WebDAV sync, env checks, and how the CLI branch complements the desktop GUI.',
      ja: 'SSH / Docker / WSL などデスクトップ環境がないサーバーで、cc-switch CLI の TUI と CLI の両モードを使い、Provider 管理、WebDAV 同期、環境チェックを行うコミュニティガイドです。',
    },
    author: { name: 'saladday', url: 'https://github.com/SaladDay' },
    date: '2026-06-06',
    category: 'practice',
    source: 'community',
    readMinutes: 12,
    accent: 'emerald',
    emoji: '🖥️',
  },
  {
    slug: 'codex-official-auth-preservation-guide',
    title: {
      zh: '使用第三方 API 时保留 Codex 远程操作和官方插件',
      en: 'Keep Codex Remote Control and Official Plugins with Third-party APIs',
      ja: 'サードパーティ API 利用時に Codex の公式機能を保持する',
    },
    summary: {
      zh: '官方配置攻略：先完成 Codex 官方登录，再开启 Codex 应用增强，让官方登录态留在 auth.json，同时把模型流量切到 DeepSeek、Kimi、GLM、MiniMax 等第三方 API。',
      en: 'Official setup guide for signing in to Codex first, enabling Codex App Enhancements, preserving official auth.json state, and routing model traffic to third-party APIs such as DeepSeek, Kimi, GLM, and MiniMax.',
      ja: 'Codex に公式ログインしたあと Codex アプリ拡張を有効化し、auth.json の公式ログイン状態を保持しながら、モデル通信を DeepSeek / Kimi / GLM / MiniMax などのサードパーティ API に切り替える公式ガイドです。',
    },
    author: { name: 'CC Switch Team', url: 'https://github.com/farion1231/cc-switch/blob/main/docs/guides/codex-official-auth-preservation-guide-zh.md' },
    date: '2026-06-01',
    category: 'practice',
    source: 'official',
    readMinutes: 9,
    accent: 'blue',
    coverIcons: [tutorialIcons.codex, tutorialIcons.ccSwitch],
    featured: true,
  },
  {
    slug: 'codex-deepseek-routing-guide',
    title: {
      zh: '在 Codex 中使用 DeepSeek：本地路由实战攻略',
      en: 'Use DeepSeek in Codex with Local Routing',
      ja: 'Codex で DeepSeek を使う: ローカルルーティング実践ガイド',
    },
    summary: {
      zh: '官方实战攻略：以 DeepSeek 这类 OpenAI Chat Completions 供应商为例，演示添加 Codex 供应商、开启本地路由、接管 Codex 和验证请求转发。',
      en: 'Official hands-on guide using DeepSeek-style OpenAI Chat Completions providers to add a Codex provider, enable Local Routing, take over Codex, and verify request forwarding.',
      ja: 'DeepSeek のような OpenAI Chat Completions 形式のプロバイダーを例に、Codex プロバイダーの追加、ローカルルーティング、Codex ルーティング有効化、転送確認までを説明する公式実践ガイドです。',
    },
    author: { name: 'CC Switch Team', url: 'https://github.com/farion1231/cc-switch/blob/main/docs/guides/codex-deepseek-routing-guide-zh.md' },
    date: '2026-05-29',
    category: 'practice',
    source: 'official',
    readMinutes: 6,
    accent: 'amber',
    coverIcons: [tutorialIcons.deepseek, tutorialIcons.codex],
    featured: true,
  },
  {
    slug: 'claude-desktop-provider-management',
    title: {
      zh: '使用 CC Switch 一键配置、管理和切换 Claude 桌面版供应商',
      en: 'Configure, Manage, and Switch Claude Desktop Providers with CC Switch',
      ja: 'CC Switch で Claude Desktop の Provider を設定・管理・切り替える',
    },
    summary: {
      zh: 'Jason Young 的实操帖，介绍如何用 CC Switch 管理 Claude Desktop 的多个供应商配置，并快速完成配置、切换和日常维护。',
      en: 'A hands-on post by Jason Young showing how to manage multiple Claude Desktop provider configurations with CC Switch, including setup, switching, and day-to-day maintenance.',
      ja: 'Jason Young による実践メモ。CC Switch で Claude Desktop の複数 Provider 設定を管理し、セットアップ、切り替え、日常運用を行う方法を紹介します。',
    },
    author: { name: 'Jason Young', url: 'https://x.com/Jason_Young1231' },
    date: '2026-05-16',
    category: 'practice',
    source: 'official',
    readMinutes: 3,
    externalUrl: 'https://x.com/Jason_Young1231/status/2055610762257949105',
    accent: 'blue',
    coverIcons: [tutorialIcons.claude, tutorialIcons.ccSwitch],
    featured: true,
  },
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
    coverIcons: [tutorialIcons.codex, tutorialIcons.claude],
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
    coverIcons: [tutorialIcons.ccSwitch, tutorialIcons.claude, tutorialIcons.codex],
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
    coverIcons: [tutorialIcons.siliconflow, tutorialIcons.ccSwitch],
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
    coverIcons: [tutorialIcons.minimax, tutorialIcons.claude, tutorialIcons.codex],
    featured: true,
  },
  {
    slug: 'deepseek-v4-pro-claude-code-bilibili',
    title: {
      zh: '使用 CC Switch 将 DeepSeek-V4-pro 接入 Claude Code 教程',
      en: 'Connect DeepSeek V4 Pro to Claude Code',
      ja: 'DeepSeek V4 Pro を Claude Code に接続するチュートリアル',
    },
    summary: {
      zh: '小陈同学c_z 的 B 站视频攻略，演示通过 CC Switch 将 DeepSeek V4 Pro 接入 Claude Code，覆盖安装、API Key 创建、供应商配置、模型切换、1M 上下文、Max 思考等级和真实任务测试。',
      en: 'A Bilibili video guide by 小陈同学c_z showing how to connect DeepSeek V4 Pro to Claude Code with CC Switch, covering installation, API key setup, provider configuration, model switching, 1M context, Max thinking level, and real task testing.',
      ja: '小陈同学c_z による Bilibili 動画ガイド。CC Switch で DeepSeek V4 Pro を Claude Code に接続し、インストール、API Key、Provider 設定、モデル切替、1M コンテキスト、Max 思考レベル、実タスク検証を紹介します。',
    },
    author: { name: '小陈同学c_z', url: 'https://space.bilibili.com/243917657' },
    date: '2026-05-01',
    category: 'video',
    source: 'community',
    readMinutes: 10,
    externalUrl: 'https://www.bilibili.com/video/BV1pQRNBsEGs/',
    accent: 'emerald',
    coverIcons: [tutorialIcons.deepseek, tutorialIcons.claude],
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
    coverIcons: [tutorialIcons.claude, tutorialIcons.kimi, tutorialIcons.zhipu],
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
    coverIcons: [tutorialIcons.claude, tutorialIcons.ccSwitch],
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
    coverIcons: [
      { ...tutorialIcons.codex, alt: 'Codex account 1' },
      { ...tutorialIcons.codex, alt: 'Codex account 2' },
    ],
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
