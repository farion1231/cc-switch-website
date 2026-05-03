import type { Language } from '@/i18n/translations';

export const SITE_NAME = 'CC Switch';
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://ccswitch.ai').replace(/\/+$/, '');
export const GITHUB_REPO_URL = 'https://github.com/farion1231/cc-switch';
export const RELEASES_URL = 'https://github.com/farion1231/cc-switch/releases';
export const OG_IMAGE_PATH = '/og-image.png';

export const htmlLang: Record<Language, string> = {
  zh: 'zh-CN',
  en: 'en',
  ja: 'ja',
};

export const hreflang: Record<Language, string> = {
  zh: 'zh-CN',
  en: 'en',
  ja: 'ja',
};

export const ogLocale: Record<Language, string> = {
  zh: 'zh_CN',
  en: 'en_US',
  ja: 'ja_JP',
};

type SeoCopy = {
  title: string;
  description: string;
  keywords?: string;
};

export const seoCopy: Record<Language, Record<'home' | 'docs' | 'changelog' | 'notFound', SeoCopy>> = {
  zh: {
    home: {
      title: 'CC Switch 官方网站 - AI 编程 CLI 统一管理工具',
      description: 'CC Switch 官方网站。统一管理 Claude Code、Codex、Gemini CLI、OpenCode、OpenClaw 和 Hermes Agent 的供应商配置、本地路由、MCP、Skills、会话与用量统计。',
      keywords: 'CC Switch 官方网站,AI CLI,Claude Code,Codex,Gemini CLI,OpenCode,OpenClaw,Hermes Agent,MCP,Skills,本地路由,供应商切换',
    },
    docs: {
      title: 'CC Switch 文档 - 安装、配置与使用指南',
      description: '阅读 CC Switch 官方文档，了解安装指南、供应商管理、本地路由、故障转移、MCP、Skills、Prompts、会话管理与常见问题。',
      keywords: 'CC Switch 文档,CC Switch 教程,Claude Code 配置,Codex 配置,Gemini CLI 配置,MCP 管理,Skills 管理',
    },
    changelog: {
      title: 'CC Switch 更新日志 - 官方版本记录',
      description: '查看 CC Switch 官方更新日志，跟踪最新功能、改进、修复、安装方式和版本发布说明。',
      keywords: 'CC Switch 更新日志,CC Switch release notes,CC Switch 版本,AI CLI 工具更新',
    },
    notFound: {
      title: '页面未找到 - CC Switch',
      description: '这个 CC Switch 页面不存在。请返回官方网站首页或查看官方文档。',
    },
  },
  en: {
    home: {
      title: 'CC Switch Official Website - AI Coding CLI Control Surface',
      description: 'The official CC Switch website. Manage providers, local routing, MCP, Skills, sessions, and usage for Claude Code, Codex, Gemini CLI, OpenCode, OpenClaw, and Hermes Agent.',
      keywords: 'CC Switch official website,AI CLI,Claude Code,Codex,Gemini CLI,OpenCode,OpenClaw,Hermes Agent,MCP,Skills,local routing,provider switcher',
    },
    docs: {
      title: 'CC Switch Docs - Installation, Configuration, and User Guide',
      description: 'Read the official CC Switch docs for installation, provider management, local routing, failover, MCP, Skills, Prompts, sessions, and troubleshooting.',
      keywords: 'CC Switch docs,CC Switch tutorial,Claude Code configuration,Codex configuration,Gemini CLI configuration,MCP management,Skills management',
    },
    changelog: {
      title: 'CC Switch Changelog - Official Release Notes',
      description: 'Track official CC Switch release notes, new features, improvements, fixes, installation changes, and version history.',
      keywords: 'CC Switch changelog,CC Switch release notes,CC Switch versions,AI CLI tool updates',
    },
    notFound: {
      title: 'Page Not Found - CC Switch',
      description: 'This CC Switch page does not exist. Return to the official website or open the official documentation.',
    },
  },
  ja: {
    home: {
      title: 'CC Switch 公式サイト - AI コーディング CLI 統合管理ツール',
      description: 'CC Switch 公式サイト。Claude Code、Codex、Gemini CLI、OpenCode、OpenClaw、Hermes Agent のプロバイダー、Local Routing、MCP、Skills、セッション、使用量を統合管理します。',
      keywords: 'CC Switch 公式サイト,AI CLI,Claude Code,Codex,Gemini CLI,OpenCode,OpenClaw,Hermes Agent,MCP,Skills,Local Routing,プロバイダー切替',
    },
    docs: {
      title: 'CC Switch ドキュメント - インストール、設定、使い方',
      description: 'CC Switch 公式ドキュメント。インストール、プロバイダー管理、Local Routing、フェイルオーバー、MCP、Skills、Prompts、セッション管理を確認できます。',
      keywords: 'CC Switch ドキュメント,CC Switch 使い方,Claude Code 設定,Codex 設定,Gemini CLI 設定,MCP 管理,Skills 管理',
    },
    changelog: {
      title: 'CC Switch 更新履歴 - 公式リリースノート',
      description: 'CC Switch の公式更新履歴。最新機能、改善、修正、インストール変更、バージョン情報を確認できます。',
      keywords: 'CC Switch 更新履歴,CC Switch release notes,CC Switch バージョン,AI CLI ツール更新',
    },
    notFound: {
      title: 'ページが見つかりません - CC Switch',
      description: 'この CC Switch ページは存在しません。公式サイトのホームまたは公式ドキュメントをご確認ください。',
    },
  },
};

export function absoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`}`;
}
