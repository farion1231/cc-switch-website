import type { Language } from '@/i18n/translations';

import packyCodeIcon from '@/assets/icons/packycode.svg';
import minimaxIcon from '@/assets/icons/minimax.svg';

export type SponsorTier = 'flagship' | 'gold' | 'supporter';
export type LocalizedText = Record<Language, string>;

export interface Sponsor {
  id: string;
  name: string;
  icon: string;
  url: string;
  tier: SponsorTier;
  tagline: LocalizedText;
  description: LocalizedText;
  /** YYYY-MM, optional. Rendered through `t.sponsorsPage.card.since`. */
  since?: string;
  featured?: boolean;
}

export const sponsors: Sponsor[] = [
  {
    id: 'packyapi',
    name: 'PackyAPI',
    icon: packyCodeIcon,
    url: 'https://www.packyapi.com',
    tier: 'flagship',
    featured: true,
    since: '2025-01',
    tagline: {
      zh: 'AI API 聚合服务',
      en: 'AI API Aggregation Service',
      ja: 'AI API アグリゲーションサービス',
    },
    description: {
      zh: '一站式聚合主流 AI 模型 API，提供稳定的高可用接入与统一计费，帮助开发者快速接入 Claude、GPT 等模型并降低集成成本。',
      en: 'One-stop aggregation of mainstream AI model APIs with stable high-availability access and unified billing, helping developers integrate Claude, GPT, and more with lower friction.',
      ja: '主要 AI モデル API をワンストップで集約し、安定した高可用アクセスと統一課金を提供。Claude や GPT などへの統合を低コストで素早く実現します。',
    },
  },
  {
    id: 'minimax',
    name: 'MiniMax',
    icon: minimaxIcon,
    url: 'https://platform.minimaxi.com',
    tier: 'flagship',
    featured: true,
    since: '2025-03',
    tagline: {
      zh: 'AI 编程套餐平台',
      en: 'AI Coding Plan Platform',
      ja: 'AI コーディングプランプラットフォーム',
    },
    description: {
      zh: '面向开发者的一站式 AI 编程套餐平台，提供高性价比的模型订阅方案，让团队与个人都能稳定使用大模型驱动的编程工作流。',
      en: 'A one-stop AI coding plan platform for developers, offering cost-effective model subscriptions so individuals and teams can adopt LLM-powered coding workflows reliably.',
      ja: '開発者向けの AI コーディングプランプラットフォーム。コストパフォーマンスに優れたモデル契約を提供し、個人やチームが LLM 駆動のコーディングを安定して利用できます。',
    },
  },
];

export const sponsorsByTier = (tier: SponsorTier): Sponsor[] =>
  sponsors.filter((sponsor) => sponsor.tier === tier);

export const featuredSponsors = sponsors.filter((sponsor) => sponsor.featured);
