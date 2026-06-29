import type { Language } from '@/i18n/translations';

import kimiIcon from '@/assets/icons/sponsors/kimi.svg';
import packycodeIcon from '@/assets/icons/sponsors/packycode.svg';
import aigocodeIcon from '@/assets/icons/sponsors/aigocode.svg';
import shengsuanyunIcon from '@/assets/icons/sponsors/shengsuanyun.svg';
import aicodemirrorIcon from '@/assets/icons/sponsors/aicodemirror.svg';
import patewayIcon from '@/assets/icons/sponsors/pateway.jpg';
import byteplusIcon from '@/assets/icons/sponsors/byteplus.png';
import huoshanIcon from '@/assets/icons/sponsors/huoshan.png';
import siliconflowIcon from '@/assets/icons/sponsors/siliconflow.svg';
import cubenceIcon from '@/assets/icons/sponsors/cubence.svg';
import dmxZhIcon from '@/assets/icons/sponsors/dmx-zh.jpeg';
import dmxEnIcon from '@/assets/icons/sponsors/dmx-en.jpg';
import ucloudIcon from '@/assets/icons/sponsors/ucloud.svg';
import crazyrouterIcon from '@/assets/icons/sponsors/crazyrouter.svg';
import rightcodeIcon from '@/assets/icons/sponsors/rightcode.svg';
import sssaicodeIcon from '@/assets/icons/sponsors/sssaicode.svg';
import micuIcon from '@/assets/icons/sponsors/micu.svg';
import etokIcon from '@/assets/icons/sponsors/etok.png';
import claudeapiIcon from '@/assets/icons/sponsors/claudeapi.png';
import claudecnIcon from '@/assets/icons/sponsors/claudecn.png';
import runapiIcon from '@/assets/icons/sponsors/runapi.jpg';
import apikeyFunIcon from '@/assets/icons/sponsors/apikeyfun.png';
import apinebulaIcon from '@/assets/icons/sponsors/apinebula_icon.png';
import atlascloudIcon from '@/assets/icons/sponsors/atlascloud_icon.png';
import ccsubIcon from '@/assets/icons/sponsors/ccsub.svg';
import unity2Icon from '@/assets/icons/sponsors/unity2.png';
import fennoIcon from '@/assets/icons/sponsors/fenno-icon.webp';

import kimiBannerZh from '@/assets/banners/sponsors/kimi-banner-zh.png';
import kimiBannerEn from '@/assets/banners/sponsors/kimi-banner-en.png';

export type SponsorTier = 'flagship' | 'gold' | 'standard';

export type SponsorCategory =
  | 'relay'
  | 'subscription'
  | 'aggregator'
  | 'account-service'
  | 'native-platform';

export type LocalizedText = Record<Language, string>;

export type LocalizedAsset = Partial<Record<Language, string>> & { default: string };

export interface Sponsor {
  id: string;
  name: string | LocalizedText;
  icon: string | LocalizedAsset;
  url: string;
  tier: SponsorTier;
  category?: SponsorCategory;
  tagline: LocalizedText;
  description: LocalizedText;
  perk?: LocalizedText;
  couponCode?: string;
  banner?: LocalizedAsset;
  iconBg?: 'light' | 'dark' | 'auto';
  since?: string;
  featured?: boolean;
}

export const sponsors: Sponsor[] = [
  {
    id: 'kimi-k2-7-code',
    name: 'Kimi K2.7 Code',
    icon: kimiIcon,
    url: 'https://platform.moonshot.cn/console?aff=cc-switch',
    tier: 'flagship',
    category: 'native-platform',
    featured: true,
    since: '2026-06',
    banner: { zh: kimiBannerZh, en: kimiBannerEn, ja: kimiBannerEn, default: kimiBannerEn },
    tagline: {
      zh: '编程专用开源智能体模型',
      en: 'Open-source coding-focused agentic model',
      ja: 'コーディング特化のオープンソース・エージェントモデル',
    },
    description: {
      zh: 'Kimi K2.7 Code 是 Moonshot AI 开发的编程专用开源智能体模型。它在编程与智能体执行能力上全面增强，在真实长程编程任务中实现显著提升，带来复杂软件工程工作流中更高的端到端任务成功率。同时，K2.7 Code 优化了推理效率，相较 K2.6 平均减少约 30% 的推理 token 消耗。',
      en: 'Kimi K2.7 Code is an open-source, coding-focused agentic model developed by Moonshot AI. It delivers stronger coding and agent performance with substantial improvements in real-world long-horizon coding tasks, translating into higher end-to-end task success rates across complex software engineering workflows. It also improves reasoning efficiency, reducing thinking-token usage by about 30% compared with K2.6.',
      ja: 'Kimi K2.7 Code は Moonshot AI が開発した、コーディングに特化したオープンソースのエージェントモデルです。コーディング能力とエージェント性能が全面的に強化され、実世界の長程コーディングタスクで大幅に向上し、複雑なソフトウェアエンジニアリング全体でエンドツーエンドのタスク成功率を高めます。さらに K2.6 と比べて推論トークン消費を約 30% 削減します。',
    },
  },
  {
    id: 'packycode',
    name: 'PackyCode',
    icon: packycodeIcon,
    url: 'https://www.packyapi.com/register?aff=cc-switch',
    tier: 'standard',
    category: 'relay',
    featured: true,
    since: '2025-01',
    iconBg: 'light',
    tagline: {
      zh: '稳定高效的 API 中转服务',
      en: 'Stable, high-performance API relay',
      ja: '安定・高効率の API 中継サービス',
    },
    description: {
      zh: 'PackyCode 是一家稳定、高效的 API 中转服务商，提供 Claude Code、Codex、Gemini 等多种中转服务。注册后填写优惠码可享首充优惠。',
      en: 'PackyCode is a stable, high-performance API relay provider supporting Claude Code, Codex, Gemini, and more. Register and apply the coupon for a first-recharge discount.',
      ja: 'PackyCode は Claude Code、Codex、Gemini などに対応する安定・高効率な API 中継サービスです。登録時にクーポンコードを使うと初回チャージが割引になります。',
    },
    perk: {
      zh: '首次充值 9 折，需在支付时填写优惠码"cc-switch"',
      en: '10% off first recharge — apply coupon "cc-switch" at checkout',
      ja: '初回チャージ 10% オフ（お支払い時にクーポンコード「cc-switch」を入力）',
    },
    couponCode: 'cc-switch',
  },
  {
    id: 'aigocode',
    name: 'AIGoCode',
    icon: aigocodeIcon,
    url: 'https://aigocode.com/invite/CC-SWITCH',
    tier: 'standard',
    category: 'aggregator',
    featured: true,
    since: '2025-04',
    tagline: {
      zh: '一站式 AI 编程平台',
      en: 'All-in-one AI coding platform',
      ja: 'オールインワン AI コーディングプラットフォーム',
    },
    description: {
      zh: 'AIGoCode 集成了 Claude Code、Codex 以及 Gemini 最新模型的一站式平台，提供稳定、高效且高性价比的 AI 编程服务。国内直连无需魔法，零封号风险，极速响应。',
      en: 'AIGoCode is an all-in-one platform integrating the latest Claude Code, Codex, and Gemini models. Stable, fast, and cost-effective access with direct mainland China connections and zero account-suspension risk.',
      ja: 'AIGoCode は Claude Code、Codex、Gemini の最新モデルを統合したオールインワンプラットフォーム。中国本土から直接接続でき、安定・高速・低コストで AI コーディングを利用できます。',
    },
    perk: {
      zh: '首充额外 +10% 奖励额度',
      en: '+10% bonus on first recharge',
      ja: '初回チャージ +10% ボーナス',
    },
  },
  {
    id: 'shengsuanyun',
    name: { zh: '胜算云', en: 'Shengsuanyun', ja: 'Shengsuanyun' },
    icon: shengsuanyunIcon,
    url: 'https://www.shengsuanyun.com/?from=CH_4HHXMRYF',
    tier: 'standard',
    category: 'native-platform',
    featured: true,
    since: '2025-04',
    tagline: {
      zh: '工业级 AI 任务并行执行平台',
      en: 'Industrial-grade parallel AI execution',
      ja: '産業グレードの AI 並列実行プラットフォーム',
    },
    description: {
      zh: '胜算云是专为 AI Native Teams 服务的超级工厂，聚合 Claude、ChatGPT、Gemini 等海内外 LLM 及多媒体模型算力。全站 SLA 高达 99.7%，提供企业级专属网关、智能路由、安全防护与 BYOK 密钥托管。',
      en: 'Shengsuanyun is an industrial-grade super factory for AI Native Teams, aggregating Claude, ChatGPT, Gemini, and multimodal model compute. 99.7% SLA with enterprise gateways, smart routing, security, and BYOK key custody.',
      ja: 'Shengsuanyun は AI Native Teams 向けの産業グレードな統合プラットフォーム。Claude や ChatGPT、Gemini など国内外の LLM・マルチモーダルモデルを集約し、99.7% の SLA、専用ゲートウェイ、スマートルーティング、BYOK 鍵管理を提供します。',
    },
    perk: {
      zh: '新用户 10 元模力 + 首充 10% 赠送',
      en: '¥10 credit + 10% bonus on first recharge',
      ja: '新規 ¥10 クレジット + 初回 10% ボーナス',
    },
  },
  {
    id: 'aicodemirror',
    name: 'AICodeMirror',
    icon: aicodemirrorIcon,
    url: 'https://www.aicodemirror.com/register?invitecode=9915W3',
    tier: 'standard',
    category: 'relay',
    featured: true,
    since: '2025-05',
    tagline: {
      zh: '官方高稳定中转服务',
      en: 'High-stability official relay',
      ja: '安定性重視の公式中継サービス',
    },
    description: {
      zh: 'AICodeMirror 提供 Claude Code / Codex / Gemini CLI 官方高稳定中转服务，支持企业级高并发、极速开票、7×24 专属技术支持。Claude Code 低至 3.8 折，Codex 0.2 折，Gemini 0.9 折。',
      en: 'AICodeMirror delivers high-stability official relays for Claude Code, Codex, and Gemini CLI with enterprise concurrency, fast invoicing, and 24/7 dedicated support. Claude Code from 38% off, Codex from 2%, Gemini from 9%.',
      ja: 'AICodeMirror は Claude Code / Codex / Gemini CLI に対応する公式高安定中継サービス。企業向け高並列処理、即日インボイス、24 時間体制の専属サポートを提供。Claude Code は 62% オフから利用可能。',
    },
    perk: {
      zh: '首充 8 折，企业最高 7.5 折',
      en: '20% off first recharge (up to 25% for enterprise)',
      ja: '初回 20% オフ（法人は最大 25% オフ）',
    },
  },
  {
    id: 'pateway',
    name: 'PatewayAI',
    icon: patewayIcon,
    url: 'https://pateway.ai/?ch=etzpm8&aff=WB6M6F67#/',
    tier: 'standard',
    category: 'relay',
    featured: true,
    since: '2025-06',
    iconBg: 'light',
    tagline: {
      zh: '官方直连高品质 API 中转',
      en: 'Direct-source high-quality relay',
      ja: '公式直結の高品質 API 中継',
    },
    description: {
      zh: '面向重度 AI 开发者，专注官方直连高品质模型 API 中转。Claude 全系列与 Codex 系列 100% 官方源直供，Token 级账单可逐笔核验，企业可签合同开票。',
      en: 'For heavy AI developers — direct-source relay for the full Claude and Codex lineup with token-level auditable bills and enterprise contracts/invoices.',
      ja: 'ヘビーユーザー向けの公式直結中継。Claude 全系列と Codex を 100% 公式ソースで提供し、トークン単位で監査可能な請求と法人契約書・インボイスにも対応。',
    },
    perk: {
      zh: '注册即送 $3，充值低至 6 折',
      en: 'Free $3 on signup, recharge as low as 40% off',
      ja: '登録で $3、最大 60% オフ',
    },
  },
  {
    id: 'byteplus',
    name: { zh: '火山方舟', en: 'Dola Seed', ja: 'Dola Seed' },
    icon: { zh: huoshanIcon, en: byteplusIcon, ja: byteplusIcon, default: byteplusIcon },
    url: 'https://www.volcengine.com/activity/codingplan?ac=MMAP8JTTCAQ2&rc=6J6FV5N2&utm_campaign=hw&utm_content=ccswitch&utm_medium=devrel_tool_web&utm_source=OWO&utm_term=ccswitch',
    tier: 'standard',
    category: 'native-platform',
    since: '2025-10',
    tagline: {
      zh: '字节自研全模态大模型平台',
      en: 'ByteDance full-modal LLM platform',
      ja: 'ByteDance のフルモーダル LLM プラットフォーム',
    },
    description: {
      zh: '方舟 Coding Plan 集成 Doubao-Seed、Doubao-Seedance、Doubao-Seedream 等字节跳动自研模型，覆盖文本、代码、图像、视频等多模态任务。最新支持 MiniMax-M3、DeepSeek-V4 系列、GLM-5.1、Doubao-Seed-2.0 系列、Kimi-K2.6 等模型，工具不限，可为不同任务切换合适的 AI 引擎。',
      en: 'Dola Seed 2.0 is a full-modal general large model by ByteDance. Built on a unified multimodal architecture, it supports text, images, audio, and video. It natively enables agent collaboration with strong reasoning, long-task execution, tool integration, and coding capabilities. Accessible via the ModelArk platform.',
      ja: 'Dola Seed 2.0 は ByteDance がグローバル市場向けに独自開発したフルモーダル汎用大規模モデルです。統一マルチモーダルアーキテクチャを基盤に、テキスト・画像・音声・動画の統合的な理解と生成をサポート。エージェント連携をネイティブに実現し、強力な推論・コーディング能力を備えています。ModelArk プラットフォームから利用可能。',
    },
    perk: {
      zh: '首两个月 2.5 折，叠加邀请码低至 9.4 元/月',
      en: '500K free tokens per model on signup',
      ja: '登録でモデルごとに 50 万トークン無料',
    },
    couponCode: '6J6FV5N2',
  },
  {
    id: 'siliconflow',
    name: { zh: '硅基流动', en: 'SiliconFlow', ja: 'SiliconFlow' },
    icon: siliconflowIcon,
    url: 'https://cloud.siliconflow.cn/i/drGuwc9k',
    tier: 'standard',
    category: 'native-platform',
    since: '2025-05',
    tagline: {
      zh: '高性能多模态 AI 基础设施',
      en: 'High-performance multimodal AI infra',
      ja: '高性能なマルチモーダル AI インフラ',
    },
    description: {
      zh: '高性能 AI 基础设施与模型 API 平台，一站式提供语言、语音、图像、视频等多模态模型。支持按量计费、高速推理与企业级稳定性，已兼容 OpenClaw。',
      en: 'High-performance AI infra and model API platform with multimodal models (language, speech, image, video). Pay-as-you-go, fast inference, enterprise-grade stability. Compatible with OpenClaw.',
      ja: '高性能 AI インフラとモデル API プラットフォーム。言語・音声・画像・映像のマルチモーダルモデルをワンストップで提供し、従量課金・高速推論・企業向け安定性を備えています。OpenClaw 対応。',
    },
    perk: {
      zh: '实名注册即送 ¥16',
      en: '¥16 credit on KYC signup',
      ja: '本人確認登録で ¥16',
    },
  },
  {
    id: 'cubence',
    name: 'Cubence',
    icon: cubenceIcon,
    url: 'https://cubence.com/signup?code=CCSWITCH&source=ccs',
    tier: 'standard',
    category: 'relay',
    since: '2025-06',
    tagline: {
      zh: '可靠高效的 API 中继',
      en: 'Reliable and efficient API relay',
      ja: '信頼性の高い API 中継',
    },
    description: {
      zh: '可靠高效的 API 中继服务提供商，支持 Claude Code、Codex、Gemini 等模型，提供按量、包月等灵活计费方式。',
      en: 'Reliable, efficient API relay supporting Claude Code, Codex, Gemini, with flexible pay-as-you-go and monthly billing.',
      ja: '信頼性が高く効率的な API 中継サービス。Claude Code、Codex、Gemini に対応し、従量課金や月額プランを選べます。',
    },
    perk: {
      zh: '每次充值 9 折优惠',
      en: '10% off every recharge',
      ja: '毎回チャージ 10% オフ',
    },
    couponCode: 'CCSWITCH',
  },
  {
    id: 'dmxapi',
    name: 'DMXAPI',
    icon: { zh: dmxZhIcon, en: dmxEnIcon, ja: dmxEnIcon, default: dmxEnIcon },
    url: 'https://www.dmxapi.cn/register?aff=bUHu',
    tier: 'standard',
    category: 'aggregator',
    since: '2025-04',
    iconBg: 'light',
    tagline: {
      zh: '一个 Key 用全球大模型',
      en: 'One key for global LLMs',
      ja: '1 つの Key で世界中の LLM',
    },
    description: {
      zh: '一个 Key 用全球大模型，已为 200 多家企业用户提供服务。充值即开票、当天开票、并发不限制、1 元起充、7×24 在线技术辅导。',
      en: 'One key, every major LLM. Trusted by 200+ enterprise customers. Instant invoices, unlimited concurrency, ¥1 minimum recharge, 24/7 support.',
      ja: '1 つの Key で世界中の LLM を利用可能。200 社以上の法人実績、即時インボイス、並列数無制限、¥1 から、24 時間サポート。',
    },
    perk: {
      zh: 'GPT/Claude/Gemini 全部 6.8 折，Claude Code 3.4 折',
      en: 'GPT/Claude/Gemini at 32% off, Claude Code at 66% off',
      ja: 'GPT/Claude/Gemini 32% オフ、Claude Code 66% オフ',
    },
  },
  {
    id: 'ucloud',
    name: { zh: '优云智算', en: 'UCloud', ja: 'UCloud' },
    icon: ucloudIcon,
    url: 'https://www.compshare.cn/coding-plan?ytag=GPU_YY_YX_git_cc-switch',
    tier: 'standard',
    category: 'subscription',
    since: '2025-05',
    tagline: {
      zh: 'UCloud 旗下 AI 云平台',
      en: 'AI cloud platform by UCloud',
      ja: 'UCloud 傘下の AI クラウド',
    },
    description: {
      zh: '优云智算是 UCloud 旗下 AI 云平台，提供国内外稳定模型 API。主打高性价比国模 Coding Plan 套餐，支持 Claude Code、Codex 与 API 调用，企业高并发、7×24 技术支持、自助开票。',
      en: 'AI cloud by UCloud offering stable Chinese and global model APIs. Cost-effective Coding Plans for Claude Code, Codex, and API access with enterprise concurrency, 24/7 support, and self-serve invoices.',
      ja: 'UCloud の AI クラウドプラットフォーム。国内外の安定したモデル API を提供し、Coding Plan・Claude Code・Codex に対応。法人向けに高並列処理、24 時間サポート、セルフ請求書発行を備えます。',
    },
    perk: {
      zh: '注册送 ¥5 平台体验金',
      en: '¥5 free credit on signup',
      ja: '登録で ¥5 のクレジット',
    },
  },
  {
    id: 'crazyrouter',
    name: 'Crazyrouter',
    icon: crazyrouterIcon,
    url: 'https://crazyrouter.com/register?aff=OZcm&ref=cc-switch',
    tier: 'standard',
    category: 'aggregator',
    since: '2025-07',
    tagline: {
      zh: '高性能 AI API 聚合平台',
      en: 'High-performance AI API aggregator',
      ja: '高性能 AI API アグリゲーター',
    },
    description: {
      zh: '一个 API Key 即可访问 300+ 模型，包括 Claude Code、Codex、Gemini CLI 等。全部模型低至官方定价的 55%，支持自动故障转移、智能路由和无限并发。',
      en: 'One API key for 300+ models including Claude Code, Codex, Gemini CLI. From 55% of official pricing with automatic failover, smart routing, and unlimited concurrency.',
      ja: '1 つの API Key で Claude Code、Codex、Gemini CLI を含む 300 以上のモデルへアクセス。公式価格の 55% から利用でき、自動フェイルオーバー・スマートルーティング・無制限並列を実現。',
    },
    perk: {
      zh: '免费 $2 + 首充 30% 奖励',
      en: 'Free $2 + 30% first-recharge bonus',
      ja: '$2 無料 + 初回 30% ボーナス',
    },
    couponCode: 'CCSWITCH',
  },
  {
    id: 'rightcode',
    name: 'Right Code',
    icon: rightcodeIcon,
    url: 'https://www.right.codes/register?aff=CCSWITCH',
    tier: 'standard',
    category: 'relay',
    since: '2025-08',
    tagline: {
      zh: '按量 / 包月双模式中转',
      en: 'Pay-as-you-go & monthly relay',
      ja: '従量課金・月額プラン対応の中継',
    },
    description: {
      zh: '稳定提供 Claude Code、Codex、Gemini 等模型的中转服务，可选按量、包月两种计费模式。充值即可开票，企业、团队用户一对一对接。',
      en: 'Reliable relay for Claude Code, Codex, and Gemini with both pay-as-you-go and monthly billing. Invoices on top-up, dedicated 1:1 enterprise and team support.',
      ja: 'Claude Code、Codex、Gemini に対応する安定中継。従量課金と月額プランの 2 つの料金体系から選択可能。チャージ後にインボイス発行、法人・チーム向け専任サポートに対応。',
    },
    perk: {
      zh: '每次充值 5% 按量额度',
      en: '5% bonus pay-as-you-go credit',
      ja: '毎回 5% の従量クレジット',
    },
  },
  {
    id: 'sssaicode',
    name: 'SSSAiCode',
    icon: sssaicodeIcon,
    url: 'https://www.sssaicode.com/register?ref=DCP0SM',
    tier: 'standard',
    category: 'relay',
    since: '2025-08',
    tagline: {
      zh: '稳定平价的 Claude / CodeX 中转',
      en: 'Affordable Claude / CodeX relay',
      ja: '手頃な Claude / CodeX 中継',
    },
    description: {
      zh: '稳定可靠的 API 中转站，致力于提供稳定、可靠、平价的 Claude、CodeX 模型服务，支持当日快速开票。',
      en: 'Reliable API relay focused on stable, affordable Claude and CodeX access with same-day invoicing.',
      ja: '安定・信頼性・低価格にこだわった Claude / CodeX 中継サービス。当日インボイス発行に対応。',
    },
    perk: {
      zh: '每次充值额外 $10 奖励',
      en: 'Extra $10 bonus on every recharge',
      ja: '毎回チャージで $10 ボーナス',
    },
  },
  {
    id: 'micu',
    name: { zh: '米醋 API', en: 'Micu', ja: 'Micu' },
    icon: micuIcon,
    url: 'https://www.micuapi.ai/register?aff=aOYQ',
    tier: 'standard',
    category: 'relay',
    since: '2025-09',
    tagline: {
      zh: '试错零成本的中转服务',
      en: 'Zero-risk LLM relay',
      ja: 'リスクゼロの LLM 中継',
    },
    description: {
      zh: '致力于提供极致性价比与高稳定性的全球大模型中转服务。背后有实体企业做核心保障，支持极速正规开票。1 元起充、0 手续费随时退款。',
      en: 'Cost-effective and stable global LLM relay backed by a registered company with fast official invoices. ¥1 minimum recharge with zero-fee refunds anytime.',
      ja: 'コスパと安定性を追求した LLM 中継。実体企業が運営し、即時インボイスを発行。¥1 から利用でき、手数料無料で随時返金可能。',
    },
    perk: {
      zh: '注册并使用优惠码享 9 折',
      en: '10% off with coupon',
      ja: 'クーポンで 10% オフ',
    },
    couponCode: 'ccswitch',
  },
  {
    id: 'etok',
    name: 'ETok.ai',
    icon: etokIcon,
    url: 'https://etok.ai',
    tier: 'standard',
    category: 'subscription',
    since: '2025-10',
    tagline: {
      zh: '一站式 AI 编程工具服务',
      en: 'All-in-one AI coding service',
      ja: 'AI コーディング向け統合サービス',
    },
    description: {
      zh: '致力于打造一站式 AI 编程工具服务平台，提供 Claude Code 专业套餐及技术社群服务，同时支持 Google Gemini 和 OpenAI Codex，让 AI 辅助编程真正成为开发者的生产力工具。',
      en: 'All-in-one AI coding service offering Claude Code professional plans, a developer community, and Google Gemini & OpenAI Codex support — turning AI coding into real productivity.',
      ja: 'AI コーディング向け統合サービス。Claude Code のプロフェッショナルプランや開発者コミュニティに加え、Google Gemini と OpenAI Codex にも対応し、AI 活用を真の生産性向上につなげます。',
    },
    perk: {
      zh: 'Claude Code 专业套餐 + 技术社群',
      en: 'Pro Claude Code plans + dev community',
      ja: 'Claude Code プロプラン + 開発者コミュニティ',
    },
  },
  {
    id: 'claudeapi',
    name: 'Claude API',
    icon: claudeapiIcon,
    url: 'https://console.claudeapi.com/register?aff=pCLD',
    tier: 'standard',
    category: 'relay',
    since: '2025-10',
    tagline: {
      zh: '官方渠道直供，零降智零逆向',
      en: 'Official-channel relay, zero degradation',
      ja: '公式チャネル直供、劣化・逆向きなし',
    },
    description: {
      zh: 'Claude API 直连，三分钟接入 Claude Code 与 Agent 应用。基于 Anthropic 官方 Key + AWS Bedrock 官方渠道，非逆向、非降智，支持 Opus / Sonnet / Haiku 全系列模型，保留 Tool Use、1M 上下文等官方能力。适合 Claude Code 深度用户、Agent 工程师与企业技术团队，支持开票和团队对接。',
      en: 'Direct Claude API access — connect Claude Code and Agent apps in 3 minutes. Powered by official Anthropic API keys + AWS Bedrock channels. No reverse engineering, no model degradation. Full Opus / Sonnet / Haiku lineup with Tool Use, 1M context, and more. Built for Claude Code power users, Agent engineers, and enterprise teams. Invoicing and team support available.',
      ja: 'Claude API 直結 — わずか 3 分で Claude Code や Agent アプリに接続可能。Anthropic 公式キーおよび AWS Bedrock 公式チャネルに基づき、リバースエンジニアリングや性能劣化なし。Opus / Sonnet / Haiku 全モデルをサポートし、Tool Use や 1M コンテキストなどの公式機能を保持。ヘビーユーザー、Agent エンジニア、企業チームに最適。請求書発行およびチーム対応可能。',
    },
    perk: {
      zh: '新用户可领取免费测试额度',
      en: 'Free trial credit for new users',
      ja: '新規ユーザーに無料テストクレジット',
    },
  },
  {
    id: 'claudecn',
    name: 'ClaudeCN',
    icon: claudecnIcon,
    url: 'https://claudecn.top',
    tier: 'standard',
    category: 'relay',
    since: '2025-10',
    iconBg: 'light',
    tagline: {
      zh: '企业级 AI 中转平台',
      en: 'Enterprise-grade AI gateway',
      ja: 'エンタープライズ向け AI ゲートウェイ',
    },
    description: {
      zh: '实体企业运营的企业级 AI 中转平台，提供 Claude、GPT、DeepSeek 等热门模型的高可用商用 API 服务。支持企业采购流程，可对公打款、签约，服务合规有保障。',
      en: 'Enterprise-grade AI gateway operated by a registered company. High-availability commercial API access to Claude, GPT, and DeepSeek with corporate bank transfers, signed contracts, and full compliance.',
      ja: '実体企業が運営するエンタープライズ向け AI ゲートウェイ。Claude、GPT、DeepSeek など主要モデルへの高可用な商用 API を提供し、法人振込・正式契約・コンプライアンスに対応。',
    },
    perk: {
      zh: '企业采购流程，合规有保障',
      en: 'Enterprise procurement with full compliance',
      ja: '法人調達・コンプライアンス対応',
    },
  },
  {
    id: 'runapi',
    name: 'RunAPI',
    icon: runapiIcon,
    url: 'https://runapi.co',
    tier: 'standard',
    category: 'aggregator',
    since: '2025-10',
    iconBg: 'dark',
    tagline: {
      zh: '150+ 模型低至 1 折',
      en: '150+ models from 10% of official price',
      ja: '150+ モデルを公式価格の 10% から',
    },
    description: {
      zh: '高效稳定的 AI 模型 API 中转平台，一个 API Key 即可访问 OpenAI、Claude、Gemini、DeepSeek、Grok 等 150+ 主流模型，低至 1 折，可无缝兼容 Claude Code、OpenClaw 等工具。',
      en: 'High-performance AI model API gateway — one API key for 150+ models including OpenAI, Claude, Gemini, DeepSeek, and Grok at as low as 10% of official pricing. Seamless with Claude Code and OpenClaw.',
      ja: '高効率で安定した AI モデル API ゲートウェイ。1 つの API Key で OpenAI、Claude、Gemini、DeepSeek、Grok など 150 以上のモデルに公式価格の 10% からアクセス可能。Claude Code や OpenClaw とシームレス連携。',
    },
    perk: {
      zh: '注册联系客服领 ¥14 额度',
      en: 'Free ¥14 credit (contact support)',
      ja: 'カスタマー窓口連絡で ¥14 クレジット',
    },
  },
  {
    id: 'apikey-fun',
    name: 'APIKEY.FUN',
    icon: apikeyFunIcon,
    url: 'https://apikey.fun/register?aff=CCSwitch',
    tier: 'standard',
    category: 'relay',
    iconBg: 'light',
    tagline: {
      zh: '企业级稳定性，低至 0.7 折',
      en: 'Enterprise-grade stability, as low as 7%',
      ja: 'エンタープライズ級の安定性、公式価格の 7% から',
    },
    description: {
      zh: 'APIKEY.FUN 是一家专业的企业级 AI 中转站，为企业和个人开发者提供稳定、高效、低成本的 AI 模型 API 接入服务。平台支持 Claude、OpenAI、Gemini 等主流热门模型，价格低至官方原价的 7%。',
      en: 'APIKEY.FUN is a professional enterprise-grade AI relay platform for stable, efficient, and low-cost model API access. It supports popular models such as Claude, OpenAI, and Gemini, with prices as low as 7% of official rates.',
      ja: 'APIKEY.FUN は、企業および個人開発者向けに安定・高効率・低コストな AI モデル API 接続を提供するエンタープライズ級 AI リレープラットフォームです。Claude、OpenAI、Gemini などの主要モデルに対応し、公式価格の 7% から利用できます。',
    },
    perk: {
      zh: '专属链接注册，充值永久最高 95 折',
      en: 'Exclusive link: up to permanent 5% off top-ups',
      ja: '専用リンク登録でチャージ永久最大 5% オフ',
    },
  },
  {
    id: 'apinebula',
    name: 'APINEBULA',
    icon: apinebulaIcon,
    url: 'https://apinebula.com/02rw5X',
    tier: 'standard',
    category: 'aggregator',
    iconBg: 'light',
    tagline: {
      zh: '银河录像局旗下 AI 聚合平台',
      en: 'AI aggregator by Galaxy Video Bureau',
      ja: '銀河録像局傘下の AI 統合基盤',
    },
    description: {
      zh: 'APINEBULA 是银河录像局旗下的企业级 AI 聚合平台，面向开发者、团队与企业用户提供稳定、高性价比的大模型 API 接入服务。平台聚合 Claude、GPT、Gemini 等主流满血模型，支持企业级高并发、正式合同、对公打款与开票服务。',
      en: 'APINEBULA is an enterprise-grade AI aggregation platform under Galaxy Video Bureau, providing stable, cost-effective LLM API access for developers, teams, and enterprises. It aggregates full-powered Claude, GPT, Gemini, and other leading models, with enterprise concurrency, contracts, corporate payment, and invoicing.',
      ja: 'APINEBULA は銀河録像局傘下のエンタープライズ向け AI 統合プラットフォームです。開発者、チーム、企業ユーザーに安定性とコストパフォーマンスに優れた LLM API 接続を提供し、Claude、GPT、Gemini など主要モデルを集約。高並列処理、正式契約、法人口座振込、請求書発行にも対応します。',
    },
    perk: {
      zh: '充值时填写优惠码享 9 折',
      en: '10% off with promo code',
      ja: 'プロモコード入力で 10% オフ',
    },
    couponCode: 'ccswitch',
  },
  {
    id: 'atlascloud',
    name: 'Atlas Cloud',
    icon: atlascloudIcon,
    url: 'https://www.atlascloud.ai/coding-plan?utm_source=github&utm_campaign=cc-switch',
    tier: 'standard',
    category: 'native-platform',
    iconBg: 'light',
    tagline: {
      zh: '全模态 AI 推理平台',
      en: 'Full-modal AI inference platform',
      ja: 'フルモーダル AI 推論プラットフォーム',
    },
    description: {
      zh: 'Atlas Cloud 是一个全模态 AI 推理平台，通过单一 API 为开发者提供视频生成、图像生成及 LLM 接入。一次连接即可调用 300+ 款全模态精选模型，免去多供应商对接成本。',
      en: 'Atlas Cloud is a full-modal AI inference platform that gives developers one API for video generation, image generation, and LLM access. Connect once to use 300+ curated models across modalities without juggling multiple vendor integrations.',
      ja: 'Atlas Cloud は、1 つの API で動画生成、画像生成、LLM 接続を提供するフルモーダル AI 推論プラットフォームです。一度の接続で 300 以上の厳選マルチモーダルモデルを利用でき、複数ベンダー連携の手間を省けます。',
    },
    perk: {
      zh: '专属开发者编程计划优惠',
      en: 'Exclusive developer coding-plan offer',
      ja: '開発者向け限定 Coding Plan 優待',
    },
  },
  {
    id: 'ccsub',
    name: 'CCSub',
    icon: ccsubIcon,
    url: 'https://www.ccsub.net/register?ref=Y6Z8DXEA',
    tier: 'standard',
    category: 'relay',
    iconBg: 'dark',
    tagline: {
      zh: '稳定实惠的 AI API 中转平台',
      en: 'Stable, affordable AI API relay',
      ja: '安定・低価格の AI API リレー',
    },
    description: {
      zh: 'CCSub 是稳定、实惠的 AI API 中转平台，可作为 Claude Code 官方订阅的替代方案。一个 API Key 覆盖 Claude、GPT-5、Gemini、DeepSeek 等模型，兼容 Claude Code、Codex、Cursor、Cline、Continue、Windsurf 等主流 AI 编程工具。',
      en: 'CCSub is a stable, affordable AI API relay and a drop-in replacement for Claude.ai subscriptions. One API key covers Claude, GPT-5, Gemini, DeepSeek, and more, with support for Claude Code, Codex, Cursor, Cline, Continue, Windsurf, and other major AI coding tools.',
      ja: 'CCSub は安定した低価格の AI API リレーサービスで、Claude Code 公式サブスクリプションの代替として利用できます。1 つの API キーで Claude、GPT-5、Gemini、DeepSeek などを利用でき、Claude Code、Codex、Cursor、Cline、Continue、Windsurf など主要な AI コーディングツールに対応します。',
    },
    perk: {
      zh: '专属链接注册即送 $5 体验额度',
      en: 'Free $5 credit on signup via exclusive link',
      ja: '専用リンク登録で $5 の無料クレジット',
    },
  },
  {
    id: 'unity2',
    name: 'Unity2.ai',
    icon: unity2Icon,
    url: 'https://unity2.ai/register?source=ccs',
    tier: 'standard',
    category: 'relay',
    iconBg: 'light',
    tagline: {
      zh: '高性能 AI 模型 API 中转平台',
      en: 'High-performance AI model relay',
      ja: '高性能 AI モデル API リレー',
    },
    description: {
      zh: 'Unity2.ai 面向个人开发者、团队和企业提供高性能 AI 模型 API 中转服务，长期服务国内头部企业，日均承载超 300 亿 token 调用，支持 5000 RPM 级高并发、余额计费、组合订阅、企业开票和专属对接。',
      en: 'Unity2.ai is a high-performance AI model API relay for individual developers, teams, and enterprises. Trusted by leading companies in China, it serves over 30 billion tokens per day with 5,000 RPM-class concurrency, balance billing, bundle subscriptions, corporate invoicing, and dedicated support.',
      ja: 'Unity2.ai は個人開発者、チーム、企業向けの高性能 AI モデル API リレーです。中国の大手企業に長年利用され、1 日 300 億トークン以上を処理し、5000 RPM クラスの高並列、残高課金、組み合わせサブスクリプション、企業向け請求書、専任サポートに対応します。',
    },
    perk: {
      zh: '注册领 $2，加入官方群再送 $10',
      en: 'Get $2 on signup, plus $10 for joining the official group',
      ja: '登録で $2、公式グループ参加でさらに $10',
    },
  },
  {
    id: 'fenno',
    name: 'Fenno.ai',
    icon: fennoIcon,
    url: 'https://api.fenno.ai/register?redirect=/purchase?tab=subscription%26group=16&aff=P9MR3D3PLCNL',
    tier: 'standard',
    category: 'relay',
    iconBg: 'light',
    tagline: {
      zh: '专注 Codex 的稳定 API 中转',
      en: 'Stable Codex-focused API relay',
      ja: 'Codex に特化した安定 API リレー',
    },
    description: {
      zh: 'Fenno.ai 是一家稳定、高效的 API 中转服务商，目前主要提供 Codex 中转服务，兼容 OpenAI 及 Anthropic 协议，可接入 Codex、Claude Code、OpenCode 等主流编程工具，并支持企业级高并发、对公结算与开票。',
      en: 'Fenno.ai is a stable, efficient API relay currently focused on Codex routing. It supports OpenAI and Anthropic-compatible protocols for Codex, Claude Code, OpenCode, and other coding tools, with enterprise-grade throughput, B2B settlement, and invoicing.',
      ja: 'Fenno.ai は安定・高効率な API リレーで、現在は Codex の中継を中心に提供しています。OpenAI / Anthropic 互換プロトコルに対応し、Codex、Claude Code、OpenCode などから利用でき、法人決済と請求書発行にも対応します。',
    },
    perk: {
      zh: '9.9 元享 $150 Coding Plan，邀请最高 20% 奖励',
      en: '¥9.9 Coding Plan with $150 credit, up to 20% referral rewards',
      ja: '9.9 元で $150 相当の Coding Plan、紹介特典は最大 20%',
    },
  },
];

export const sponsorsByTier = (tier: SponsorTier): Sponsor[] =>
  sponsors.filter((sponsor) => sponsor.tier === tier);

export const featuredSponsors = sponsors.filter((sponsor) => sponsor.featured);

export function resolveLocalizedAsset(
  asset: string | LocalizedAsset,
  language: Language,
): string {
  if (typeof asset === 'string') return asset;
  return asset[language] ?? asset.default;
}

export function resolveSponsorName(
  name: string | LocalizedText,
  language: Language,
): string {
  if (typeof name === 'string') return name;
  return name[language];
}
