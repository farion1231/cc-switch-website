import type { Language } from '@/i18n/translations';

import minimaxIcon from '@/assets/icons/sponsors/minimax.svg';
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
import aicodingIcon from '@/assets/icons/sponsors/aicoding.svg';
import crazyrouterIcon from '@/assets/icons/sponsors/crazyrouter.svg';
import rightcodeIcon from '@/assets/icons/sponsors/rightcode.svg';
import sssaicodeIcon from '@/assets/icons/sponsors/sssaicode.svg';
import micuIcon from '@/assets/icons/sponsors/micu.svg';
import lemondataIcon from '@/assets/icons/sponsors/lemondata-app.png';
import ctokIcon from '@/assets/icons/sponsors/ctok.svg';
import lionccIcon from '@/assets/icons/sponsors/lioncc.svg';
import claudeapiIcon from '@/assets/icons/sponsors/claudeapi.png';
import ddsIcon from '@/assets/icons/sponsors/dds.svg';

import minimaxBannerZh from '@/assets/banners/sponsors/minimax-zh.jpeg';
import minimaxBannerEn from '@/assets/banners/sponsors/minimax-en.jpeg';

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
    id: 'minimax',
    name: 'MiniMax',
    icon: minimaxIcon,
    url: 'https://platform.minimaxi.com/subscribe/coding-plan?code=7kYF2VoaCn&source=link',
    tier: 'flagship',
    category: 'subscription',
    featured: true,
    since: '2025-03',
    banner: { zh: minimaxBannerZh, en: minimaxBannerEn, default: minimaxBannerEn },
    tagline: {
      zh: '深度自我迭代的下一代编程模型',
      en: 'Next-gen self-iterating coding model',
      ja: '自己反復で進化する次世代コーディングモデル',
    },
    description: {
      zh: 'MiniMax M2.7 是 MiniMax 首个深度参与自我迭代的模型，可自主构建复杂 Agent Harness，并基于 Agent Teams、复杂 Skills、Tool Search Tool 等能力完成高复杂度生产力任务。在软件工程、端到端项目交付及办公场景中表现优异，多项评测接近行业领先水平。',
      en: 'MiniMax M2.7 is the first MiniMax model that participates deeply in its own self-iteration. It autonomously builds complex Agent Harnesses and completes highly demanding productivity tasks via Agent Teams, advanced Skills, and Tool Search. It excels at software engineering, end-to-end project delivery, and office workflows.',
      ja: 'MiniMax M2.7 は自己反復に深く関与する初のモデル。Agent Harness を自律構築し、Agent Teams・高度な Skills・Tool Search Tool を駆使して高難度なタスクをこなします。ソフトウェアエンジニアリングやプロジェクト納品、オフィス業務で業界トップ水準の評価を獲得しています。',
    },
    perk: {
      zh: 'MiniMax Token Plan 专属 88 折优惠',
      en: '12% off the MiniMax Token Plan',
      ja: 'MiniMax Token Plan 12% オフ',
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
    url: 'https://www.volcengine.com/activity/agentplan?utm_campaign=hw&utm_content=ccswitch&utm_medium=devrel_tool_web&utm_source=OWO&utm_term=ccswitch',
    tier: 'standard',
    category: 'native-platform',
    since: '2025-10',
    tagline: {
      zh: '字节自研全模态大模型平台',
      en: 'ByteDance full-modal LLM platform',
      ja: 'ByteDance のフルモーダル LLM プラットフォーム',
    },
    description: {
      zh: '方舟 Agent Plan 模型订阅套餐集成了 Doubao-Seed、Doubao-Seedance、Doubao-Seedream 等字节跳动自研 SOTA 级模型，覆盖文本、代码、图像、视频等多模态任务。同时支持一站式接入 DeepSeek V4、GLM 5.1 等主流大模型，深度支持 Agent 框架与 AI 编程工具。',
      en: 'Dola Seed 2.0 is a full-modal general large model by ByteDance. Built on a unified multimodal architecture, it supports text, images, audio, and video. It natively enables agent collaboration with strong reasoning, long-task execution, tool integration, and coding capabilities. Accessible via the ModelArk platform.',
      ja: 'Dola Seed 2.0 は ByteDance がグローバル市場向けに独自開発したフルモーダル汎用大規模モデルです。統一マルチモーダルアーキテクチャを基盤に、テキスト・画像・音声・動画の統合的な理解と生成をサポート。エージェント連携をネイティブに実現し、強力な推論・コーディング能力を備えています。ModelArk プラットフォームから利用可能。',
    },
    perk: {
      zh: '新客户首月 40 元起',
      en: '500K free tokens per model on signup',
      ja: '登録でモデルごとに 50 万トークン無料',
    },
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
    id: 'aicoding',
    name: 'AICoding.sh',
    icon: aicodingIcon,
    url: 'https://aicoding.sh/i/CCSWITCH',
    tier: 'standard',
    category: 'aggregator',
    since: '2025-07',
    tagline: {
      zh: '全球大模型 API 超值中转',
      en: 'Value-priced global LLM relay',
      ja: 'コスパに優れた LLM 中継',
    },
    description: {
      zh: '全球大模型 API 超值中转服务，已为数百家企业提供高性价比 AI 服务。Claude Code 1.9 折，GPT 0.1 折，支持企业级高并发与极速开票。',
      en: 'Value-priced global LLM API relay used by hundreds of companies. Claude Code from 81% off, GPT from 99% off, with enterprise concurrency and instant invoices.',
      ja: '世界中の LLM API をお得に中継するサービス。数百社の法人実績、Claude Code は 81% オフ、GPT は 99% オフ、法人向け並列処理と即時インボイスに対応。',
    },
    perk: {
      zh: '首充 9 折优惠',
      en: '10% off first recharge',
      ja: '初回 10% オフ',
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
    id: 'lemondata',
    name: 'LemonData',
    icon: lemondataIcon,
    url: 'https://lemondata.cc/r/FFX1ZDUP',
    tier: 'standard',
    category: 'aggregator',
    since: '2025-09',
    tagline: {
      zh: '300+ 模型一键调用',
      en: '300+ models, one API',
      ja: '300+ モデルを単一 API で',
    },
    description: {
      zh: '高性能 AI API 聚合平台，一个 API Key 即可访问 GPT、Claude、Gemini、DeepSeek 等 300+ 模型。所有模型定价为官方价格的 30%-70%，支持自动故障转移、智能路由和无限并发。',
      en: 'High-performance API aggregator. One key for GPT, Claude, Gemini, DeepSeek, and 300+ more — priced at 30-70% of official rates with auto failover, smart routing, and unlimited concurrency.',
      ja: '高性能 API アグリゲーター。1 つの Key で GPT、Claude、Gemini、DeepSeek など 300 以上のモデルを利用可能。公式価格の 30〜70% で、自動フェイルオーバー・スマートルーティング・無制限並列に対応。',
    },
    perk: {
      zh: '注册即送 $1 免费额度',
      en: 'Free $1 credit on signup',
      ja: '登録で $1 のクレジット',
    },
  },
  {
    id: 'ctok',
    name: 'CTok.ai',
    icon: ctokIcon,
    url: 'https://ctok.ai',
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
    id: 'lioncc',
    name: { zh: 'LionCC 狮子 API', en: 'LionCC', ja: 'LionCC' },
    icon: lionccIcon,
    url: 'https://vibecodingapi.ai',
    tier: 'standard',
    category: 'relay',
    since: '2025-10',
    tagline: {
      zh: '为 Vibe Coders 而生的 API',
      en: 'API for Vibe Coders',
      ja: 'Vibe Coders のための API',
    },
    description: {
      zh: '专为追求极致开发体验的 Vibe Coders 而生，提供稳定、低延迟、优惠价格的 Claude Code、Codex 及 OpenClaw 算力服务，可节约 50% 成本。',
      en: 'Made for Vibe Coders — stable, low-latency, discounted Claude Code, Codex, and OpenClaw compute saving up to 50%.',
      ja: '最高の開発体験を求める Vibe Coders 向け。Claude Code、Codex、OpenClaw を低遅延・低価格で提供し、最大 50% のコスト削減を実現。',
    },
    perk: {
      zh: '注册联系客服送 $10 额度',
      en: 'Free $10 credit (contact support)',
      ja: 'カスタマー窓口連絡で $10 クレジット',
    },
    couponCode: 'cc-switch',
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
    id: 'dds',
    name: { zh: 'DDS 呆呆兽', en: 'DDS', ja: 'DDS' },
    icon: ddsIcon,
    url: 'https://ddshub.short.gy/ccswitch',
    tier: 'standard',
    category: 'relay',
    since: '2025-10',
    tagline: {
      zh: '专注 Claude 的国内直连',
      en: 'Claude-focused domestic relay',
      ja: 'Claude 特化の国内直結中継',
    },
    description: {
      zh: '专注 Claude 的可靠高效 API 中转站，提供国内 Claude 直连加速服务。支持 Claude Haiku / Opus / Sonnet 满血模型，充值满 1000 元可开发票，企业可享定制化分组。',
      en: 'Claude-focused, reliable, and fast API relay with mainland China direct connections. Full Claude Haiku / Opus / Sonnet support, invoices for ¥1000+ recharges, custom enterprise grouping.',
      ja: 'Claude に特化した安定・高速 API 中継。中国本土からの直結アクセスを提供し、Claude Haiku / Opus / Sonnet をフル機能でサポート。¥1000 以上でインボイス発行、法人向けカスタムグループ化に対応。',
    },
    perk: {
      zh: '首单充值额外 +10% 额度',
      en: '+10% bonus on first recharge',
      ja: '初回チャージ +10% ボーナス',
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
