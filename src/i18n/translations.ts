import { demoPages } from './demoPages';

export type Language = 'zh' | 'en' | 'ja';

export const translations = {
  zh: {
    // Navbar
    nav: {
      home: '首页',
      features: '功能',
      docs: '文档',
      tutorials: '攻略',
      changelog: '更新日志',
      sponsors: '赞助商',
      download: '免费下载',
    },
    // Common UI strings (loading states, 404 page, etc.)
    common: {
      loading: '加载中...',
      notFound: {
        title: '页面未找到',
        backHome: '返回首页',
      },
    },
    // Hero Section
    hero: {
      versionBadge: '正式发布',
      slogan: '统一管理你的 AI 编程工具工作流',
      downloadBtn: '免费下载',
      docsBtn: '查看文档',
      platforms: '支持 macOS 12+ · Windows 10+ · Linux',
      stars: 'Stars',
      downloads: '下载',
      supportedCli: '支持工具',
      rustBadge: 'Rust #1',
    },
    // Features Section
    features: {
      title: '为什么选择 CC Switch?',
      subtitle: '一个应用管理供应商、路由、用量、会话和技能',
      items: [
        {
          title: '一个应用，十个工具',
          description: '一个界面管理 Claude Code、Claude Desktop、Codex、Gemini CLI、Grok Build、OpenCode、OpenClaw、Hermes Agent、Pi 和 MiniMax Code 的供应商配置。',
        },
        {
          title: '告别手动编辑',
          description: '内置 90+ 供应商预设，包括 AWS Bedrock、NVIDIA NIM 和社区中转服务。选一个预设、填入 Key 就能一键切换，不用再手改 JSON、TOML、YAML 或 .env 文件，原有配置也不会丢失。',
        },
        {
          title: '在 Claude Code 里用 GPT，在 Codex 里用 Claude',
          description: '内置本地路由，自动转换 Anthropic、OpenAI、Gemini 的接口格式；熔断器和故障转移队列会在主供应商异常时自动切到备用供应商。',
        },
        {
          title: 'MCP、Skills 与提示词集中管理',
          description: 'MCP 和 Skills 添加一次，按工具勾选同步；提示词按工具分别维护。还能浏览、搜索各工具的会话历史，并复制恢复命令。',
        },
        {
          title: '用量与额度一目了然',
          description: '不开本地路由也能从会话记录统计 Token、缓存命中和成本，支持日期范围筛选与自定义模型价格；供应商卡片和托盘直接显示订阅额度与余额。',
        },
        {
          title: '跨平台，开源免费',
          description: '基于 Tauri 2 构建的原生桌面应用，支持 Windows、macOS 和 Linux；MIT 协议开源，完全免费，欢迎贡献代码和反馈。',
        },
      ],
    },
    // Tech Section
    tech: {
      badge: '开发者友好',
      title: '零配置，开箱即用',
      description: '无需修改代码，开启本地路由即可获得格式转换、热切换、故障转移和请求日志。',
      features: [
        {
          title: '本地优先，可选云同步',
          description: '配置和 API Key 默认保存在本地 SQLite 数据库，支持完整的 Schema 迁移；开启 WebDAV / S3 云同步后可在多台设备间同步，数据只上传到你自己配置的存储。',
        },
        {
          title: 'Rust 后端 + React 前端',
          description: '基于 Tauri 2.x 构建，结合 Rust 的性能和 React 的灵活性。',
        },
        {
          title: '智能用量追踪',
          description: '实时监控 Token、缓存、订阅额度和费用，按应用与 Provider 分类统计分析。',
        },
      ],
    },
    // Demo Section (app strings mirror cc-switch src/i18n/locales/zh.json)
    demo: {
      title: '直观的操作界面',
      subtitle: '侧栏切换应用，直连、路由、聚合三种模式随时切换',
      tabs: {
        provider: '供应商切换',
        proxy: '路由与聚合',
        stats: '用量统计',
      },
      window: {
        providers: '供应商',
        addProvider: '添加供应商',
        more: '更多',
        edit: '编辑',
        collapseSidebar: '收起侧栏',
        pages: demoPages.zh,
        nav: {
          mcp: 'MCP',
          skills: 'Skills',
          prompts: '提示词',
          sessions: '会话',
          auth: '授权中心',
          usage: '用量统计',
          apps: '应用',
          settings: '设置',
          todayCost: '今日 {cost}',
        },
        modes: {
          direct: '直连',
          route: '路由',
          stack: '聚合',
          mapping: '模型映射',
        },
        modeHelp: {
          title: '连接模式的区别',
          direct: '直连：客户端直接连所选那家，切换即改写配置。',
          route: '路由：请求先过本机的 CC Switch，可开故障转移。',
          stack: '聚合：多家模型同列在 /model，不做故障转移。',
        },
        activate: {
          viewing: '你在查看「{view}」，{app} 目前是{active}。',
          route: '开始路由',
          stack: '切换到聚合模式',
          direct: '回到直连',
        },
        status: {
          directLead: '直连生效中 · 直接连接',
          routeLead: '路由生效中',
          stackLead: '聚合生效中 · 默认',
          stackValue: '{name} · 另有 {count} 家共 {models} 个模型',
          desktopCurrent: '当前：{name} · {mode}',
        },
        chip: {
          official: '官方',
          default: '默认',
          models: '{count} 个模型',
          direct: '直连',
          mapping: '模型映射',
        },
        cardStatus: {
          inUse: '使用中',
          routing: '路由中',
          currentDefault: '当前默认',
        },
        action: {
          switch: '切换',
          routeHere: '路由到此',
          setDefault: '设为默认',
          add: '添加',
          remove: '移除',
          enable: '启用',
          exitAndUse: '回到直连并使用',
        },
        section: {
          stackDefault: '默认供应商',
          added: '已添加 · {count}',
          available: '可添加 · {count}',
        },
        reason: {
          noRoute: '官方订阅不经过路由，回到直连后可用。',
          officialStack: '官方账号只能做默认，不能加入聚合。',
        },
        quota: {
          tierLeft: '{label}剩余 {value}%',
          balance: '余额 {value}',
          tiers: {
            fiveHour: '5 小时',
            weekly: '每周',
          },
        },
        usage: {
          title: '用量统计',
          all: '全部',
          synced: '会话日志 · 刚刚同步',
          syncNow: '立即同步',
          totalCost: '总成本',
          totalRequests: '总请求数',
          realTokens: '真实消耗 Tokens',
          cacheHitRate: '缓存命中率',
          heatmapTitle: '用量热力图',
          heatmapSubtitle: '最近 53 周的每日用量',
          less: '少',
          more: '多',
          metrics: {
            tokens: 'Tokens',
            requests: '请求',
            cost: '成本',
          },
          tabs: {
            logs: '请求日志',
            providers: '供应商',
            models: '模型',
            pricing: '定价',
          },
          columns: {
            time: '时间',
            app: '应用',
            provider: '供应商',
            model: '模型',
            input: '新增输入',
            output: '输出',
            cacheRead: '缓存命中',
            cost: '成本',
            speed: '速度',
          },
          weekdays: ['周一', '', '周三', '', '周五', '', '周日'],
          months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        },
      },
    },
    // FAQ Section
    faq: {
      title: '常见问题',
      subtitle: '有疑问？我们来解答',
      items: [
        {
          question: 'CC Switch 是免费的吗？',
          answer: '是的，CC Switch 完全免费且开源。基于 MIT 协议发布，您可以自由使用、修改和分发。',
        },
        {
          question: '支持哪些 AI 编程工具？',
          answer: '目前支持 10 个工具：Claude Code、Claude Desktop、Codex、Gemini CLI、Grok Build 为切换式，同一时间只启用一个供应商；OpenCode、OpenClaw、Hermes Agent、Pi、MiniMax Code 为共存式，可以同时添加多个供应商。各工具支持的功能（MCP、Skills、提示词、本地路由等）不完全相同，详见 GitHub README 的「各工具支持的功能」一节。',
        },
        {
          question: '我的 API Key 安全吗？',
          answer: 'API Key 和供应商配置默认保存在您本机的 SQLite 数据库和对应工具自己的配置文件中。只有您主动开启 WebDAV / S3 云同步时，才会上传到您自己配置的存储。',
        },
        {
          question: '本地路由服务会影响请求速度吗？',
          answer: '影响微乎其微。本地路由服务基于 Rust 构建，性能很高，并额外提供格式转换、请求日志、健康监控和故障转移。',
        },
        {
          question: '如何参与贡献？',
          answer: '欢迎通过 GitHub 提交 Issue 和 Pull Request。我们有详细的贡献指南，帮助您快速上手。',
        },
        {
          question: '遇到问题如何获取帮助？',
          answer: '您可以通过 GitHub Issues 反馈问题，或者在 GitHub Discussions 与其他用户交流。',
        },
      ],
    },
    // Testimonials Section
    testimonials: {
      title: '用户怎么说',
      subtitle: '来自开发者社区的反馈',
      items: [
        {
          content: '配置切换神器！UI颜值超高，界面清爽无冗余，一键切换配置特别方便，是我用过最顺手的工具，强烈推荐！',
          author: '蛮吉',
          role: 'Vibe Coding 爱好者',
        },
        {
          content: 'CC Switch 彻底改变了我的 AI 开发工作流。多 Provider 故障转移功能让我再也不用担心 API 限流问题，成本追踪功能帮我节省了 30% 的开支。',
          author: '愚者',
          role: '前字节跳动开发工程师',
        },
        {
          content: '作为一个重度使用 Claude Code 的开发者，CC Switch 的 MCP 配置管理功能太好用了。可视化界面让复杂的配置变得简单直观。',
          author: '军师',
          role: '独立开发者',
        },
        {
          content: '开源免费还这么强大，感谢作者的无私奉献！本地路由功能稳定可靠，团队里每个人都在用。',
          author: '荀彧',
          role: 'AI 产品经理',
        },
        {
          content: '多 Provider 自动切换功能非常实用，API 出问题时完全无感知，保证了开发流程的连续性。',
          author: '苟或',
          role: '技术负责人',
        },
        {
          content: '终于不用手动编辑 JSON 配置文件了！Skills 和 Prompts 的可视化管理让效率提升了好几倍，强烈推荐给所有 AI 开发者。',
          author: '菌丝',
          role: '后端开发工程师',
        },
        {
          content: '成本追踪功能太赞了，能清晰看到每个 Provider 的使用情况和费用，帮助我们合理分配预算。',
          author: '白夜',
          role: '运维工程师',
        },
        {
          content: '统一管理这些 AI 编程工具真的太方便了，一个界面搞定所有配置。省去了在不同配置文件之间来回切换的麻烦。',
          author: '念佝',
          role: '前端开发工程师',
        },
        {
          content: '界面设计简洁优雅，交互体验流畅。作为前端架构师，我对 UI/UX 要求很高，CC Switch 完全满足了我的期望。',
          author: 'Mashiro',
          role: '小农科技有限公司 前端架构师',
        },
        {
          content: '平时做实验要在不同 Provider 间反复切换做对比，CC Switch 让这件事变得无比顺滑，配置预设还能在课题组内共享，效率直接拉满。',
          author: '兰大首席格调',
          role: '兰州大学 博士生',
        },
        {
          content: '试过不少 Claude Code 周边工具，CC Switch 是少数能长期留在 Dock 里的。Provider 一键切换、配置可视化、成本追踪做得都很扎实，连团队里的非技术同事都能上手。',
          author: 'saladday',
          role: '知名开发者',
        },
        {
          content: '录 AI 编程教程要演示不同 Provider，CC Switch 一键切换太省事，粉丝照着抄也不会出错。',
          author: '左岚',
          role: '哔哩哔哩 UP 主',
        },
      ],
    },
    // CTA Section
    cta: {
      title: '准备好体验更高效的',
      titleLine2: 'AI 工作流了吗?',
      subtitle: '下载 CC Switch，开启统一管理 AI 编程工具工作流的新方式',
      downloadBtn: '立即下载',
      githubBtn: '查看 GitHub',
      platforms: '支持 macOS · Windows · Linux',
    },
    // Download page
    downloadPage: {
      title: '下载 CC Switch',
      subtitle: '免费开源，统一管理你的 AI 编程工具工作流',
      latestVersion: '最新版本',
      publishedOn: '发布于',
      downloadFor: '下载 {platform} 版',
      universalNote: 'Apple Silicon 与 Intel 通用',
      macNotarized: 'macOS 安装包已通过 Apple 代码签名与公证',
      brewNote: '也可以通过 Homebrew 安装：',
      otherPlatformsHint: '不是你的设备？在下方选择其他平台。',
      allPlatforms: '全部平台',
      recommended: '推荐',
      kinds: {
        dmg: '安装镜像 (.dmg)',
        zip: '压缩包 (.zip)',
        msi: '安装版 (.msi)',
        portable: '便携版 (.zip)',
        appimage: 'AppImage',
        deb: 'deb 软件包',
        rpm: 'rpm 软件包',
      },
      kindNotes: {
        dmg: '双击安装即可使用',
        zip: '免安装，解压即用',
        msi: '标准安装程序',
        portable: '免安装，解压即用',
        appimage: '免安装，满足系统要求的发行版都能用',
        deb: '适用于 Ubuntu 22.04+ / Debian 12+',
        rpm: '适用于 Fedora 等提供 WebKitGTK 4.1 的发行版',
      },
      windowsArchHint: '不确定选哪个？大多数电脑选 x64。',
      linuxRequirement: '需要 glibc 2.35+ 和 WebKitGTK 4.1，例如 Ubuntu 22.04+、Debian 12+ 及较新的 Fedora；RHEL / Rocky / Alma 8–9 暂不支持。',
      verifyIntro: '校验完整性：下载后在终端执行',
      verifyOutro: '，输出应与此处及 GitHub Releases 页面显示的 SHA-256 一致。',
      copyHash: '复制完整 SHA-256',
      hashCopied: '已复制',
      history: {
        title: '历史版本',
        note: '需要旧版本？所有历史版本均可在 GitHub Releases 获取。',
        link: '前往 GitHub Releases',
      },
      fallback: {
        title: '下载服务暂时不可用',
        note: '你可以直接从 GitHub Releases 获取全部安装包。',
        button: '前往 GitHub 下载',
      },
      loading: '正在获取最新版本…',
    },
    // Footer
    footer: {
      tagline: '统一管理你的 AI 编程工具工作流',
      product: {
        title: '产品',
        features: '功能',
        download: '下载',
      },
      resources: {
        title: '资源',
        docs: '文档',
        tutorials: '攻略',
        changelog: '更新日志',
      },
      community: {
        title: '社区',
        github: 'GitHub',
        contributing: '贡献指南',
        issues: '问题反馈',
        sponsors: '赞助商',
      },
      copyright: '© 2025–{year} CC Switch. 基于 MIT 协议开源。',
      madeWith: 'Made with ❤️ by CC Switch Team',
    },
    // Sponsors Page
    sponsorsPage: {
      section: {
        title: '感谢赞助商的支持',
        subtitle: '如果您需要稳定、高性价比的 API 中转服务，欢迎了解一下 CC Switch 的赞助商。',
        viewAll: '查看全部赞助商',
      },
      hero: {
        badge: '开源 · 社区驱动',
        title: '感谢每一位支持者',
        subtitle: 'CC Switch 是一个面向开发者的开源项目，由社区与赞助商共同支撑。我们将每一份支持都视作让项目走得更远的力量。',
      },
      tiers: {
        flagship: {
          title: '旗舰赞助商',
          subtitle: '深度合作伙伴，长期为项目提供关键支持',
        },
        gold: {
          title: '黄金赞助商',
          subtitle: '感谢长期支持 CC Switch 持续发展的伙伴',
        },
        standard: {
          title: '更多赞助商',
          subtitle: '感谢这些持续支持 CC Switch、并为用户提供专属优惠的赞助商',
        },
      },
      card: {
        visit: '访问网站',
        perk: '专属福利',
        coupon: '优惠码',
        copyCoupon: '复制优惠码',
        copied: '已复制到剪贴板',
        visitWithCoupon: '使用专属优惠访问',
      },
      perksTable: {
        badge: '一目了然',
        title: '专属福利汇总',
        subtitle: '使用 CC Switch 专属链接 / 优惠码即可享受下列福利。点击优惠码可一键复制。',
        headers: {
          sponsor: '赞助商',
          perk: '专属福利',
          coupon: '优惠码',
          link: '前往',
        },
      },
      faq: {
        title: '常见问题',
        items: [
          {
            q: '如何成为 CC Switch 的赞助商？',
            a: '通过 support@ccswitch.io 邮件联系我们，告知您希望的合作方案与展示需求。确认细节后即可安排展示位置与上线时间。',
          },
          {
            q: '有哪些合作方案？',
            a: '目前提供两种合作方案。两种方案都包含官网赞助商页展示、应用内预设接入与高亮推荐，以及优先技术支持。完整方案在此基础上额外提供 GitHub README 广告位，支持中/英/日/德四语展示。具体合作细节欢迎邮件沟通。',
          },
          {
            q: '完成洽谈后多久可以上线？',
            a: '在确认合作细节并收到素材后，通常 1–3 个工作日内即可完成上线。具体时间会根据展示位置和素材准备情况略有不同。',
          },
          {
            q: '需要准备哪些素材？',
            a: '通常包括 Logo、一段产品简介（中/英/日可选）、专属优惠链接，以及可选的 GitHub README 横幅图。合作确认后我们会同步详细的尺寸与格式要求，并协助审核素材。',
          },
        ],
      },
      benefits: {
        badge: '与 CC Switch 一起成长',
        title: '成为赞助商可以获得什么？',
        subtitle: '深度合作展示位 + 应用内推荐 + 优先技术支持，让您的服务高效触达全球开发者。',
        perks: [
          {
            title: 'GitHub README 广告位',
            description: '中、英、日、德四语展示，覆盖 GitHub 上的中外开发者。',
          },
          {
            title: '应用内预设接入',
            description: '获得高亮推荐，用户从您站点复制 Key 即可一键导入，显著降低配置门槛。',
          },
          {
            title: '官网赞助商页展示',
            description: '在 ccswitch.io 赞助商页面获得长期独立展示，带去精准开发者流量。',
          },
          {
            title: '优先技术支持',
            description: '专属对接通道，第一时间协助数据调整、参数适配等技术需求。',
          },
        ],
        cta: '成为赞助商',
      },
    },
    // Docs Page
    docs: {
      title: '文档',
      aria: {
        openNav: '打开导航',
        closeNav: '关闭导航',
      },
      search: {
        trigger: '搜索文档...',
        placeholder: '搜索文档...',
        noResults: '未找到与 "{query}" 相关的结果',
        navigate: '用于导航',
        select: '用于选择',
      },
      toc: {
        title: '本页内容',
      },
      footer: {
        edit: '编辑此页面',
        lastUpdated: '最后更新：{date}',
      },
      pagination: {
        previous: '上一页',
        next: '下一页',
      },
      nav: {
        sections: {
          'getting-started': '快速入门',
          providers: '供应商管理',
          extensions: '扩展功能',
          proxy: '本地路由与高可用',
          faq: '常见问题',
        },
        items: {
          introduction: '软件介绍',
          installation: '安装指南',
          interface: '界面概览',
          quickstart: '快速上手',
          settings: '个性化配置',
          add: '添加供应商',
          switch: '切换供应商',
          edit: '编辑供应商',
          'sort-duplicate': '排序与复制',
          'usage-query': '用量查询',
          'claude-desktop': 'Claude Desktop',
          mcp: 'MCP 服务器',
          prompts: 'Prompts 提示词',
          skills: 'Skills 技能',
          sessions: '会话管理器',
          workspace: '工作区与记忆',
          service: '本地路由服务',
          routing: '应用路由',
          takeover: '应用路由',
          failover: '故障转移',
          usage: '用量统计',
          'model-test': '连通检测',
          aggregation: '聚合模式',
          'config-files': '配置文件说明',
          questions: 'FAQ',
          deeplink: '深度链接协议',
          'env-conflict': '环境变量冲突',
        },
      },
    },
    // Changelog Page
    changelog: {
      title: '更新日志',
      description: 'CC Switch 的所有重要更新都将记录在这里。了解最新的功能、改进和错误修复。',
      loading: '正在加载更新日志...',
      error: '加载失败',
      versions: '版本列表',
      inVersion: '在 v{version} 中',
      betaRelease: 'Beta 版本',
      openVersions: '打开版本列表',
      closeVersions: '关闭版本列表',
    },
    // Tutorials Page
    tutorials: {
      hero: {
        badge: '官方 + 社区',
        title: '玩转 CC Switch',
        subtitle: '装好软件之后还能怎么玩？这里收集了官方和社区写的攻略文章，从 5 分钟入门到生产部署一网打尽。',
        contribute: '投稿你的攻略',
      },
      filters: {
        category: '分类',
        source: '来源',
        all: '全部',
        clear: '重置筛选',
      },
      categories: {
        'getting-started': '入门',
        practice: '实战',
        integration: '集成',
        troubleshooting: '排错',
        video: '视频',
      },
      sources: {
        official: '官方',
        community: '社区',
      },
      card: {
        readMin: '{n} 分钟阅读',
        external: '外站',
        unavailable: '当前语言暂未翻译',
      },
      empty: {
        title: '没有匹配的攻略',
        subtitle: '试试清空筛选条件，或者切换到其他分类。',
      },
      detail: {
        back: '返回攻略列表',
        readMin: '{n} 分钟阅读',
        published: '发布于 {date}',
        updated: '更新于 {date}',
        bySource: '由 {source} 提供',
        notAvailable: {
          title: '这篇攻略暂时没有当前语言的版本',
          subtitle: '你可以切换到其他语言查看，或返回攻略列表浏览其他文章。',
        },
        prev: '上一篇',
        next: '下一篇',
        edit: '在 GitHub 编辑此页',
      },
      cta: {
        title: '想分享你的 CC Switch 攻略？',
        subtitle: '欢迎把你的实战经验整理成文章发给我们。被收录的作者会在文章上署名，并获得独立的展示位。',
        action: '通过邮件投稿',
      },
    },
  },
  en: {
    // Navbar
    nav: {
      home: 'Home',
      features: 'Features',
      docs: 'Docs',
      tutorials: 'Tutorials',
      changelog: 'Changelog',
      sponsors: 'Sponsors',
      download: 'Download Free',
    },
    // Common UI strings (loading states, 404 page, etc.)
    common: {
      loading: 'Loading...',
      notFound: {
        title: 'Page Not Found',
        backHome: 'Back to home',
      },
    },
    // Hero Section
    hero: {
      versionBadge: 'Released',
      slogan: 'Unified Management for Your AI Coding Tool Workflow',
      downloadBtn: 'Download Free',
      docsBtn: 'View Docs',
      platforms: 'macOS 12+ · Windows 10+ · Linux',
      stars: 'Stars',
      downloads: 'Downloads',
      supportedCli: 'Tools Supported',
      rustBadge: 'Rust #1',
    },
    // Features Section
    features: {
      title: 'Why Choose CC Switch?',
      subtitle: 'One app for providers, routing, usage, sessions, and skills',
      items: [
        {
          title: 'One App, Ten Tools',
          description: 'Manage providers for Claude Code, Claude Desktop, Codex, Gemini CLI, Grok Build, OpenCode, OpenClaw, Hermes Agent, Pi, and MiniMax Code from one interface.',
        },
        {
          title: 'No More Manual Editing',
          description: '90+ built-in provider presets, including AWS Bedrock, NVIDIA NIM, and community relays. Pick a preset, enter your key, and switch in one click — no more hand-editing JSON, TOML, YAML, or .env files, and your existing configuration stays intact.',
        },
        {
          title: 'Use GPT in Claude Code, Claude in Codex',
          description: 'Built-in Local Routing converts between Anthropic, OpenAI, and Gemini API formats automatically, while circuit breakers and failover queues move requests to a backup provider when the primary one fails.',
        },
        {
          title: 'Centralized MCP, Skills & Prompts',
          description: 'Add MCP servers and Skills once, then choose which tools to sync them to; prompts are maintained per tool. You can also browse and search each tool\'s session history and copy resume commands.',
        },
        {
          title: 'Usage & Quotas at a Glance',
          description: 'Track tokens, cache hits, and costs from session logs even without Local Routing, with date ranges and custom model pricing; provider cards and the tray show subscription quota and balance.',
        },
        {
          title: 'Cross-Platform, Open Source & Free',
          description: 'A native desktop app for Windows, macOS, and Linux, built with Tauri 2. Open source under the MIT license, completely free, and open to contributions and feedback.',
        },
      ],
    },
    // Tech Section
    tech: {
      badge: 'Developer Friendly',
      title: 'Zero Configuration, Ready to Use',
      description: 'No code changes required. Enable Local Routing to get format conversion, hot switching, failover, and request logs.',
      features: [
        {
          title: 'Local-First, Optional Cloud Sync',
          description: 'Configurations and API keys stay in a local SQLite database by default, with full schema migration support. Turn on WebDAV / S3 cloud sync to share them across devices — uploaded only to storage you configure.',
        },
        {
          title: 'Rust Backend + React Frontend',
          description: 'Built on Tauri 2.x, combining Rust performance with React flexibility.',
        },
        {
          title: 'Smart Usage Tracking',
          description: 'Real-time monitoring for tokens, cache, subscription quota, and costs across apps and providers.',
        },
      ],
    },
    // Demo Section (app strings mirror cc-switch src/i18n/locales/en.json)
    demo: {
      title: 'Intuitive Interface',
      subtitle: 'Pick an app in the sidebar and move between Direct, Routing, and Aggregation at any time',
      tabs: {
        provider: 'Switch providers',
        proxy: 'Routing & Aggregation',
        stats: 'Usage',
      },
      window: {
        providers: 'Providers',
        addProvider: 'Add Provider',
        more: 'More',
        edit: 'Edit',
        collapseSidebar: 'Collapse sidebar',
        pages: demoPages.en,
        nav: {
          mcp: 'MCP',
          skills: 'Skills',
          prompts: 'Prompts',
          sessions: 'Sessions',
          auth: 'Accounts',
          usage: 'Usage',
          apps: 'Apps',
          settings: 'Settings',
          todayCost: 'Today {cost}',
        },
        modes: {
          direct: 'Direct',
          route: 'Routing',
          stack: 'Aggregation',
          mapping: 'Model mapping',
        },
        modeHelp: {
          title: 'How the connection modes differ',
          direct: 'Direct: the client connects straight to the chosen provider; switching rewrites its config.',
          route: 'Routing: requests go through CC Switch on this machine first; failover is available.',
          stack: 'Aggregation: models from several providers are listed together in /model; no failover.',
        },
        activate: {
          viewing: "You're viewing “{view}”. {app} is currently on {active}.",
          route: 'Start routing',
          stack: 'Switch to Aggregation',
          direct: 'Back to direct',
        },
        status: {
          directLead: 'Direct is active · connected to',
          routeLead: 'Routing is active',
          stackLead: 'Aggregation is active · default',
          stackValue: '{name} · {count} more with {models} models',
          desktopCurrent: 'Current: {name} · {mode}',
        },
        chip: {
          official: 'Official',
          default: 'Default',
          models: '{count} models',
          direct: 'Direct',
          mapping: 'Model mapping',
        },
        cardStatus: {
          inUse: 'In use',
          routing: 'Routing',
          currentDefault: 'Current default',
        },
        action: {
          switch: 'Switch',
          routeHere: 'Route here',
          setDefault: 'Set as default',
          add: 'Add',
          remove: 'Remove',
          enable: 'Enable',
          exitAndUse: 'Back to direct and use',
        },
        section: {
          stackDefault: 'Default provider',
          added: 'Added · {count}',
          available: 'Available · {count}',
        },
        reason: {
          noRoute: "Official subscriptions don't go through routing; available again in direct mode.",
          officialStack: "Official accounts can only be the default; they can't join the aggregation.",
        },
        quota: {
          tierLeft: '{label} {value}% left',
          balance: 'Balance {value}',
          tiers: {
            fiveHour: '5-hour',
            weekly: 'Weekly',
          },
        },
        usage: {
          title: 'Usage',
          all: 'All',
          synced: 'Session logs · synced just now',
          syncNow: 'Sync Now',
          totalCost: 'Total Cost',
          totalRequests: 'Total Requests',
          realTokens: 'Tokens Processed',
          cacheHitRate: 'Cache Hit Rate',
          heatmapTitle: 'Usage heatmap',
          heatmapSubtitle: 'Daily usage over the last 53 weeks',
          less: 'Less',
          more: 'More',
          metrics: {
            tokens: 'Tokens',
            requests: 'Requests',
            cost: 'Cost',
          },
          tabs: {
            logs: 'Request Logs',
            providers: 'Providers',
            models: 'Models',
            pricing: 'Pricing',
          },
          columns: {
            time: 'Time',
            app: 'App',
            provider: 'Provider',
            model: 'Model',
            input: 'Fresh Input',
            output: 'Output',
            cacheRead: 'Cache Hit',
            cost: 'Cost',
            speed: 'Speed',
          },
          weekdays: ['Mon', '', 'Wed', '', 'Fri', '', 'Sun'],
          months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        },
      },
    },
    // FAQ Section
    faq: {
      title: 'Frequently Asked Questions',
      subtitle: "Got questions? We've got answers",
      items: [
        {
          question: 'Is CC Switch free?',
          answer: 'Yes, CC Switch is completely free and open source. Released under MIT license, you can freely use, modify, and distribute it.',
        },
        {
          question: 'Which AI coding tools are supported?',
          answer: 'CC Switch supports 10 tools. Claude Code, Claude Desktop, Codex, Gemini CLI, and Grok Build are switch-mode tools with one active provider at a time; OpenCode, OpenClaw, Hermes Agent, Pi, and MiniMax Code are coexist-mode tools that can hold several providers at once. Supported features (MCP, Skills, Prompts, Local Routing, and more) vary by tool — see “Supported Features by Tool” in the GitHub README.',
        },
        {
          question: 'Is my API Key secure?',
          answer: 'By default, API keys and provider settings stay on your machine, in the local SQLite database and in each tool\'s own config files. They are uploaded only to your own storage when you turn on WebDAV / S3 cloud sync.',
        },
        {
          question: 'Does Local Routing affect request speed?',
          answer: 'Only negligibly. Local Routing is built with Rust for high performance, while adding format conversion, request logs, health checks, and failover.',
        },
        {
          question: 'How can I contribute?',
          answer: 'We welcome Issues and Pull Requests on GitHub. We have detailed contribution guidelines to help you get started.',
        },
        {
          question: 'How do I get help?',
          answer: 'You can report issues via GitHub Issues or connect with other users in GitHub Discussions.',
        },
      ],
    },
    // Testimonials Section
    testimonials: {
      title: 'What Users Say',
      subtitle: 'Feedback from the developer community',
      items: [
        {
          content: "A must-have config switching tool! The UI looks fantastic, the interface is clean with no clutter, and one-click configuration switching is incredibly convenient. It's the smoothest tool I've used - highly recommended!",
          author: '蛮吉',
          role: 'Vibe Coding Enthusiast',
        },
        {
          content: "CC Switch completely transformed my AI development workflow. The multi-provider failover means I never worry about API rate limits, and cost tracking saved me 30% on expenses.",
          author: '愚者',
          role: 'Ex-ByteDance Engineer',
        },
        {
          content: "As a heavy Claude Code user, CC Switch's MCP configuration management is amazing. The visual interface makes complex configs simple and intuitive.",
          author: '军师',
          role: 'Independent Developer',
        },
        {
          content: "Open source, free, and this powerful - thanks to the author's generous contribution! Local Routing is stable and reliable, everyone on our team uses it.",
          author: '荀彧',
          role: 'AI Product Manager',
        },
        {
          content: "The multi-provider auto-switching feature is incredibly useful. When an API has issues, the transition is seamless, ensuring continuous development workflow.",
          author: '苟或',
          role: 'Tech Lead',
        },
        {
          content: "Finally no more manual JSON config editing! The visual management for Skills and Prompts has multiplied my efficiency. Highly recommend to all AI developers.",
          author: '菌丝',
          role: 'Backend Engineer',
        },
        {
          content: "The cost tracking feature is amazing. Clear visibility into each provider's usage and expenses helps us allocate budget wisely.",
          author: '白夜',
          role: 'DevOps Engineer',
        },
        {
          content: "Managing these AI coding tools in one place is so convenient. One interface for all configurations. No more switching between different config files.",
          author: '念佝',
          role: 'Frontend Engineer',
        },
        {
          content: "Clean and elegant interface design with smooth interactions. As a frontend architect with high UI/UX standards, CC Switch completely met my expectations.",
          author: 'Mashiro',
          role: 'Frontend Architect at Xiaonong Tech',
        },
        {
          content: "I constantly switch between providers to run comparison experiments, and CC Switch makes it incredibly smooth. Sharing config presets across our research group has been a huge productivity boost.",
          author: '兰大首席格调',
          role: 'PhD Student at Lanzhou University',
        },
        {
          content: "I've tried plenty of Claude Code companion tools, and CC Switch is one of the few I keep pinned to my Dock. One-click provider switching, visual config management, and cost tracking are all rock-solid - even the non-technical folks on my team picked it up instantly.",
          author: 'saladday',
          role: 'Renowned Developer',
        },
        {
          content: "Recording AI coding tutorials means demoing different providers all the time. CC Switch's one-click switching keeps my screencasts smooth and viewers can follow along easily.",
          author: '左岚',
          role: 'Bilibili Content Creator',
        },
      ],
    },
    // CTA Section
    cta: {
      title: 'Ready to Experience',
      titleLine2: 'a More Efficient AI Workflow?',
      subtitle: 'Download CC Switch and start managing your AI coding tool workflow the unified way',
      downloadBtn: 'Download Now',
      githubBtn: 'View GitHub',
      platforms: 'macOS · Windows · Linux',
    },
    // Download page
    downloadPage: {
      title: 'Download CC Switch',
      subtitle: 'Free and open source. One app to manage your AI coding tool workflow.',
      latestVersion: 'Latest version',
      publishedOn: 'Released',
      downloadFor: 'Download for {platform}',
      universalNote: 'Universal build for Apple Silicon and Intel',
      macNotarized: 'macOS builds are code-signed and notarized by Apple',
      brewNote: 'Or install with Homebrew:',
      otherPlatformsHint: 'Not your device? Pick another platform below.',
      allPlatforms: 'All platforms',
      recommended: 'Recommended',
      kinds: {
        dmg: 'Disk image (.dmg)',
        zip: 'Archive (.zip)',
        msi: 'Installer (.msi)',
        portable: 'Portable (.zip)',
        appimage: 'AppImage',
        deb: 'deb package',
        rpm: 'rpm package',
      },
      kindNotes: {
        dmg: 'Double-click to install',
        zip: 'No installer, unzip and run',
        msi: 'Standard installer',
        portable: 'No installer, unzip and run',
        appimage: 'No install needed; runs on any distro that meets the requirements',
        deb: 'For Ubuntu 22.04+ / Debian 12+',
        rpm: 'For Fedora and other RPM distros that ship WebKitGTK 4.1',
      },
      windowsArchHint: 'Not sure which one? Most PCs need x64.',
      linuxRequirement: 'Requires glibc 2.35+ and WebKitGTK 4.1 — e.g. Ubuntu 22.04+, Debian 12+, and recent Fedora releases. RHEL / Rocky / Alma 8–9 are not supported yet.',
      verifyIntro: 'Verify integrity: after downloading, run',
      verifyOutro: ' — the output should match the SHA-256 shown here and on the GitHub Releases page.',
      copyHash: 'Copy full SHA-256',
      hashCopied: 'Copied',
      history: {
        title: 'Previous versions',
        note: 'Looking for an older release? Every version is available on GitHub Releases.',
        link: 'Open GitHub Releases',
      },
      fallback: {
        title: 'Download service temporarily unavailable',
        note: 'You can grab every installer directly from GitHub Releases.',
        button: 'Download from GitHub',
      },
      loading: 'Fetching the latest version…',
    },
    // Footer
    footer: {
      tagline: 'Unified management for your AI coding tool workflow',
      product: {
        title: 'Product',
        features: 'Features',
        download: 'Download',
      },
      resources: {
        title: 'Resources',
        docs: 'Documentation',
        tutorials: 'Tutorials',
        changelog: 'Changelog',
      },
      community: {
        title: 'Community',
        github: 'GitHub',
        contributing: 'Contributing',
        issues: 'Issue Tracker',
        sponsors: 'Sponsors',
      },
      copyright: '© 2025–{year} CC Switch. Open source under MIT license.',
      madeWith: 'Made with ❤️ by CC Switch Team',
    },
    // Sponsors Page
    sponsorsPage: {
      section: {
        title: 'Supported by the best',
        subtitle: 'Looking for a stable, value-priced API relay? Take a look at the sponsors who back CC Switch.',
        viewAll: 'View all sponsors',
      },
      hero: {
        badge: 'Open source · Community driven',
        title: 'Powered by amazing supporters',
        subtitle: 'CC Switch is an open source project for developers, kept alive by our community and sponsors. Every contribution helps the project go further.',
      },
      tiers: {
        flagship: {
          title: 'Flagship sponsors',
          subtitle: 'Deep partners providing long-term, mission-critical support',
        },
        gold: {
          title: 'Gold sponsors',
          subtitle: 'Thank you for continuously supporting CC Switch',
        },
        standard: {
          title: 'More sponsors',
          subtitle: 'Sponsors who keep CC Switch going and bring exclusive perks to our users',
        },
      },
      card: {
        visit: 'Visit website',
        perk: 'Exclusive perk',
        coupon: 'Coupon code',
        copyCoupon: 'Copy coupon',
        copied: 'Copied to clipboard',
        visitWithCoupon: 'Claim exclusive offer',
      },
      perksTable: {
        badge: 'At a glance',
        title: 'Exclusive perks at a glance',
        subtitle: 'Use the CC Switch referral link or coupon code to unlock these perks. Click any code to copy.',
        headers: {
          sponsor: 'Sponsor',
          perk: 'Exclusive perk',
          coupon: 'Coupon',
          link: 'Visit',
        },
      },
      faq: {
        title: 'Frequently asked questions',
        items: [
          {
            q: 'How do I become a CC Switch sponsor?',
            a: 'Email us at support@ccswitch.io with the tier you are interested in and any placement preferences. Once the details are confirmed, we will arrange the placement and go-live timing.',
          },
          {
            q: 'What sponsorship tiers are available?',
            a: 'We offer two sponsorship tiers. Both tiers include placement on this sponsors page, in-app preset provider integration with a highlighted recommendation, and priority technical support. The full tier additionally features a GitHub README banner with English, Chinese, Japanese, and German variants. Reach out by email for partnership details.',
          },
          {
            q: 'How long does it take to go live?',
            a: 'Typically 1–3 business days after we confirm the partnership details and receive your assets. The exact timing depends on the placement type and how soon the assets are ready.',
          },
          {
            q: 'What materials do you need from us?',
            a: 'Usually a logo, a short product description (English / Chinese / Japanese versions optional), an exclusive referral link, and an optional GitHub README banner image. Once the partnership is confirmed we will share the exact dimensions and format requirements, and help review the assets.',
          },
        ],
      },
      benefits: {
        badge: 'Grow with CC Switch',
        title: 'What sponsors get',
        subtitle: 'Featured placements, in-app recommendations, and priority technical support — reach developers around the world efficiently.',
        perks: [
          {
            title: 'GitHub README banner',
            description: 'Featured banner with English, Chinese, Japanese, and German variants — reaches global developers on GitHub.',
          },
          {
            title: 'In-app preset integration',
            description: 'Highlighted recommendation. Users copy a key on your site and import it in one click, slashing onboarding cost.',
          },
          {
            title: 'Sponsor page placement',
            description: 'A dedicated long-term spot on ccswitch.io that drives targeted developer traffic to your service.',
          },
          {
            title: 'Priority technical support',
            description: 'A direct channel for fast data updates, parameter tuning, and any integration needs.',
          },
        ],
        cta: 'Become a sponsor',
      },
    },
    // Docs Page
    docs: {
      title: 'Documentation',
      aria: {
        openNav: 'Open navigation',
        closeNav: 'Close navigation',
      },
      search: {
        trigger: 'Search docs...',
        placeholder: 'Search documentation...',
        noResults: 'No results found for "{query}"',
        navigate: 'to navigate',
        select: 'to select',
      },
      toc: {
        title: 'On this page',
      },
      footer: {
        edit: 'Edit this page',
        lastUpdated: 'Last updated: {date}',
      },
      pagination: {
        previous: 'Previous',
        next: 'Next',
      },
      nav: {
        sections: {
          'getting-started': 'Getting Started',
          providers: 'Provider Management',
          extensions: 'Extensions',
          proxy: 'Local Routing & HA',
          faq: 'FAQ',
        },
        items: {
          introduction: 'Introduction',
          installation: 'Installation',
          interface: 'Interface Overview',
          quickstart: 'Quick Start',
          settings: 'Settings',
          add: 'Add Provider',
          switch: 'Switch Provider',
          edit: 'Edit Provider',
          'sort-duplicate': 'Sort & Duplicate',
          'usage-query': 'Usage Query',
          'claude-desktop': 'Claude Desktop',
          mcp: 'MCP Server',
          prompts: 'Prompts',
          skills: 'Skills',
          sessions: 'Session Manager',
          workspace: 'Workspace & Memory',
          service: 'Local Routing Service',
          routing: 'App Routing',
          takeover: 'App Routing',
          failover: 'Failover',
          usage: 'Usage Statistics',
          'model-test': 'Connectivity Check',
          aggregation: 'Aggregation Mode',
          'config-files': 'Config Files',
          questions: 'FAQ',
          deeplink: 'Deep Link Protocol',
          'env-conflict': 'Env Conflict',
        },
      },
    },
    // Changelog Page
    changelog: {
      title: 'Changelog',
      description: 'All notable changes to CC Switch will be documented here. Stay up to date with the latest features, improvements, and bug fixes.',
      loading: 'Loading changelog...',
      error: 'Failed to load',
      versions: 'Versions',
      inVersion: 'In v{version}',
      betaRelease: 'Beta Release',
      openVersions: 'Open version list',
      closeVersions: 'Close version list',
    },
    // Tutorials Page
    tutorials: {
      hero: {
        badge: 'Official + Community',
        title: 'Get more out of CC Switch',
        subtitle: 'Past the install step? Here\'s a curated set of articles from the team and community — 5-minute starters all the way to production setups.',
        contribute: 'Submit your tutorial',
      },
      filters: {
        category: 'Category',
        source: 'Source',
        all: 'All',
        clear: 'Clear filters',
      },
      categories: {
        'getting-started': 'Getting started',
        practice: 'Practice',
        integration: 'Integration',
        troubleshooting: 'Troubleshooting',
        video: 'Video',
      },
      sources: {
        official: 'Official',
        community: 'Community',
      },
      card: {
        readMin: '{n} min read',
        external: 'External',
        unavailable: 'Not yet translated',
      },
      empty: {
        title: 'No tutorials match',
        subtitle: 'Try clearing filters or switching to another category.',
      },
      detail: {
        back: 'Back to tutorials',
        readMin: '{n} min read',
        published: 'Published {date}',
        updated: 'Updated {date}',
        bySource: 'by {source}',
        notAvailable: {
          title: 'This article isn\'t available in your language yet',
          subtitle: 'Try switching languages, or head back to browse other tutorials.',
        },
        prev: 'Previous',
        next: 'Next',
        edit: 'Edit this page on GitHub',
      },
      cta: {
        title: 'Have a CC Switch tutorial to share?',
        subtitle: 'Send us a write-up of your real-world workflow. Accepted submissions are credited and get their own showcase slot.',
        action: 'Submit by email',
      },
    },
  },
  ja: {
    // Navbar
    nav: {
      home: 'ホーム',
      features: '機能',
      docs: 'ドキュメント',
      tutorials: 'チュートリアル',
      changelog: '更新履歴',
      sponsors: 'スポンサー',
      download: '無料ダウンロード',
    },
    // Common UI strings (loading states, 404 page, etc.)
    common: {
      loading: '読み込み中...',
      notFound: {
        title: 'ページが見つかりません',
        backHome: 'ホームへ戻る',
      },
    },
    // Hero Section
    hero: {
      versionBadge: '正式リリース',
      slogan: 'AI コーディングツールのワークフローを統一管理',
      downloadBtn: '無料ダウンロード',
      docsBtn: 'ドキュメントを見る',
      platforms: 'macOS 12+ · Windows 10+ · Linux 対応',
      stars: 'Stars',
      downloads: 'ダウンロード',
      supportedCli: '対応ツール',
      rustBadge: 'Rust #1',
    },
    // Features Section
    features: {
      title: 'なぜ CC Switch を選ぶのか？',
      subtitle: 'プロバイダー、ルーティング、使用量、セッション、Skills を1つに',
      items: [
        {
          title: '1つのアプリで10のツール',
          description: 'Claude Code、Claude Desktop、Codex、Gemini CLI、Grok Build、OpenCode、OpenClaw、Hermes Agent、Pi、MiniMax Code のプロバイダーを1つの画面で管理できます。',
        },
        {
          title: '手動編集は不要',
          description: 'AWS Bedrock、NVIDIA NIM、コミュニティリレーなど 90 以上のプロバイダープリセットを内蔵。プリセットを選んでキーを入力すればワンクリックで切り替えられ、JSON、TOML、YAML、.env ファイルを手で編集する必要はありません。既存の設定も失われません。',
        },
        {
          title: 'Claude Code で GPT を、Codex で Claude を',
          description: 'ローカルルーティングを内蔵し、Anthropic、OpenAI、Gemini の API 形式を自動で変換。サーキットブレーカーとフェイルオーバーキューにより、メインのプロバイダーに障害が起きると自動でバックアップへ切り替えます。',
        },
        {
          title: 'MCP・Skills・プロンプトを一元管理',
          description: 'MCP と Skills は一度追加すれば、ツールごとにチェックを入れて同期。プロンプトはツールごとに個別に管理できます。各ツールのセッション履歴の閲覧・検索や、再開コマンドのコピーにも対応します。',
        },
        {
          title: '使用量とクォータをひと目で確認',
          description: 'ローカルルーティングをオンにしなくても、セッション記録からトークン、キャッシュヒット、コストを期間別に集計し、モデル価格も調整できます。プロバイダーカードとトレイにはサブスクリプションのクォータと残高を表示します。',
        },
        {
          title: 'クロスプラットフォーム、オープンソースで無料',
          description: 'Tauri 2 で構築されたネイティブデスクトップアプリで、Windows、macOS、Linux に対応。MIT ライセンスのオープンソースで完全無料。コードの貢献やフィードバックも歓迎します。',
        },
      ],
    },
    // Tech Section
    tech: {
      badge: '開発者フレンドリー',
      title: 'ゼロ設定、すぐに使える',
      description: 'コード変更不要。ローカルルーティングをオンにするだけで、形式変換、ホットスイッチ、フェイルオーバー、リクエストログを利用できます。',
      features: [
        {
          title: 'ローカルファースト、クラウド同期は任意',
          description: '設定と API キーはデフォルトでローカル SQLite データベースに保存され、完全なスキーママイグレーションをサポート。WebDAV / S3 クラウド同期をオンにすると複数のデバイス間で同期でき、アップロード先はご自身で設定したストレージだけです。',
        },
        {
          title: 'Rust バックエンド + React フロントエンド',
          description: 'Tauri 2.x をベースに構築され、Rust のパフォーマンスと React の柔軟性を組み合わせ。',
        },
        {
          title: 'スマート使用量追跡',
          description: 'トークン、キャッシュ、サブスクリプション枠、コストをアプリとプロバイダー別にリアルタイム監視します。',
        },
      ],
    },
    // Demo Section (app strings mirror cc-switch src/i18n/locales/ja.json)
    demo: {
      title: '直感的なインターフェース',
      subtitle: 'サイドバーでアプリを選び、直接接続・ルーティング・集約をいつでも切り替え',
      tabs: {
        provider: 'プロバイダー切り替え',
        proxy: 'ルーティングと集約',
        stats: '使用量',
      },
      window: {
        providers: 'プロバイダー',
        addProvider: 'プロバイダーを追加',
        more: 'その他',
        edit: '編集',
        collapseSidebar: 'サイドバーを折りたたむ',
        pages: demoPages.ja,
        nav: {
          mcp: 'MCP',
          skills: 'Skills',
          prompts: 'プロンプト',
          sessions: 'セッション',
          auth: 'アカウント',
          usage: '使用量',
          apps: 'アプリ',
          settings: '設定',
          todayCost: '今日 {cost}',
        },
        modes: {
          direct: '直接接続',
          route: 'ルーティング',
          stack: '集約',
          mapping: 'モデルマッピング',
        },
        modeHelp: {
          title: '接続モードの違い',
          direct: '直接接続：クライアントが選んだプロバイダーに直接つながります。切り替えると設定を書き換えます。',
          route: 'ルーティング：リクエストはまずこのマシンの CC Switch を通ります。フェイルオーバーを使えます。',
          stack: '集約：複数のプロバイダーのモデルを /model に並べます。フェイルオーバーはしません。',
        },
        activate: {
          viewing: '「{view}」を表示中です。{app} は現在{active}です。',
          route: 'ルーティングを開始',
          stack: '集約に切り替え',
          direct: '直接接続に戻す',
        },
        status: {
          directLead: '直接接続が有効 · 接続先',
          routeLead: 'ルーティングが有効',
          stackLead: '集約が有効 · 既定',
          stackValue: '{name} · ほか {count} 社、{models} モデル',
          desktopCurrent: '現在：{name} · {mode}',
        },
        chip: {
          official: '公式',
          default: '既定',
          models: '{count} モデル',
          direct: '直接接続',
          mapping: 'モデルマッピング',
        },
        cardStatus: {
          inUse: '使用中',
          routing: '転送中',
          currentDefault: '現在の既定',
        },
        action: {
          switch: '切り替え',
          routeHere: 'ここへ転送',
          setDefault: '既定にする',
          add: '追加',
          remove: '削除',
          enable: '有効化',
          exitAndUse: '直接接続に戻して使う',
        },
        section: {
          stackDefault: '既定のプロバイダー',
          added: '追加済み · {count}',
          available: '追加できるもの · {count}',
        },
        reason: {
          noRoute: '公式サブスクリプションはルーティングを通りません。直接接続に戻すと使えます。',
          officialStack: '公式アカウントは既定にだけでき、集約には追加できません。',
        },
        quota: {
          tierLeft: '{label} 残り {value}%',
          balance: '残高 {value}',
          tiers: {
            fiveHour: '5時間',
            weekly: '週間',
          },
        },
        usage: {
          title: '使用量',
          all: 'すべて',
          synced: 'セッションログ · たった今同期',
          syncNow: '今すぐ同期',
          totalCost: '総コスト',
          totalRequests: '総リクエスト数',
          realTokens: '実消費トークン',
          cacheHitRate: 'キャッシュヒット率',
          heatmapTitle: '使用量ヒートマップ',
          heatmapSubtitle: '過去 53 週間の日別使用量',
          less: '少',
          more: '多',
          metrics: {
            tokens: 'Tokens',
            requests: 'リクエスト',
            cost: 'コスト',
          },
          tabs: {
            logs: 'リクエストログ',
            providers: 'プロバイダー',
            models: 'モデル',
            pricing: '料金',
          },
          columns: {
            time: '時間',
            app: 'アプリ',
            provider: 'プロバイダー',
            model: 'モデル',
            input: '新規入力',
            output: '出力',
            cacheRead: 'キャッシュヒット',
            cost: 'コスト',
            speed: '速度',
          },
          weekdays: ['月', '', '水', '', '金', '', '日'],
          months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        },
      },
    },
    // FAQ Section
    faq: {
      title: 'よくある質問',
      subtitle: 'ご質問にお答えします',
      items: [
        {
          question: 'CC Switch は無料ですか？',
          answer: 'はい、CC Switch は完全に無料でオープンソースです。MIT ライセンスで公開されており、自由に使用、修正、配布できます。',
        },
        {
          question: 'どの AI コーディングツールに対応していますか？',
          answer: '10 のツールに対応しています。Claude Code、Claude Desktop、Codex、Gemini CLI、Grok Build は切り替え型で、同時に有効にできるプロバイダーは 1 つです。OpenCode、OpenClaw、Hermes Agent、Pi、MiniMax Code は共存型で、複数のプロバイダーを同時に追加できます。対応機能（MCP、Skills、プロンプト、ローカルルーティングなど）はツールごとに異なります。詳しくは GitHub README の「ツール別の対応機能」をご覧ください。',
        },
        {
          question: 'API キーは安全ですか？',
          answer: 'API キーとプロバイダー設定は、デフォルトではお使いのマシンの SQLite データベースと各ツール自身の設定ファイルに保存されます。WebDAV / S3 クラウド同期をオンにした場合のみ、ご自身で設定したストレージにアップロードされます。',
        },
        {
          question: 'ローカルルーティングはリクエスト速度に影響しますか？',
          answer: '影響はごくわずかです。ローカルルーティングは Rust で構築されており、形式変換、リクエストログ、ヘルスチェック、フェイルオーバーも提供します。',
        },
        {
          question: 'どうすれば貢献できますか？',
          answer: 'GitHub での Issue や Pull Request を歓迎します。詳細な貢献ガイドラインがあり、すぐに始められます。',
        },
        {
          question: '問題が発生した場合、どのようにヘルプを得られますか？',
          answer: 'GitHub Issues で問題を報告するか、GitHub Discussions で他のユーザーと交流できます。',
        },
      ],
    },
    // Testimonials Section
    testimonials: {
      title: 'ユーザーの声',
      subtitle: '開発者コミュニティからのフィードバック',
      items: [
        {
          content: '設定切り替えの必携ツールです！UI の完成度が高く、画面はすっきりして無駄がなく、ワンクリックで設定を切り替えられるのがとても便利です。これまで使った中で一番手になじむツールで、強くおすすめします！',
          author: '蛮吉',
          role: 'Vibe Coding 愛好者',
        },
        {
          content: 'CC Switch は私の AI 開発ワークフローを完全に変えました。マルチプロバイダーフェイルオーバーで API レート制限の心配がなくなり、コスト追跡で 30% の経費削減ができました。',
          author: '愚者',
          role: '元バイトダンスエンジニア',
        },
        {
          content: 'Claude Code のヘビーユーザーとして、CC Switch の MCP 設定管理は素晴らしいです。ビジュアルインターフェースで複雑な設定がシンプルで直感的になりました。',
          author: '军师',
          role: '独立開発者',
        },
        {
          content: 'オープンソースで無料なのにこれほど強力 - 作者の寛大な貢献に感謝！Local Routing は安定して信頼性が高く、チーム全員が使っています。',
          author: '荀彧',
          role: 'AI プロダクトマネージャー',
        },
        {
          content: 'マルチプロバイダー自動切り替え機能は非常に便利です。API に問題があってもシームレスに移行でき、開発ワークフローの継続性が保たれます。',
          author: '苟或',
          role: 'テックリード',
        },
        {
          content: 'ついに手動で JSON 設定ファイルを編集する必要がなくなりました！Skills と Prompts のビジュアル管理で効率が何倍にも上がりました。すべての AI 開発者に強くお勧めします。',
          author: '菌丝',
          role: 'バックエンドエンジニア',
        },
        {
          content: 'コスト追跡機能が素晴らしいです。各プロバイダーの使用状況と費用が明確に把握でき、予算の適切な配分に役立っています。',
          author: '白夜',
          role: 'DevOps エンジニア',
        },
        {
          content: 'これらの AI コーディングツールを一箇所で管理できるのは本当に便利です。1つのインターフェースですべての設定ができます。異なる設定ファイル間を行き来する必要がなくなりました。',
          author: '念佝',
          role: 'フロントエンドエンジニア',
        },
        {
          content: 'シンプルでエレガントなインターフェースデザインと滑らかなインタラクション。UI/UX に高い基準を持つフロントエンドアーキテクトとして、CC Switch は私の期待を完全に満たしてくれました。',
          author: 'Mashiro',
          role: '小農科技 フロントエンドアーキテクト',
        },
        {
          content: '研究で複数のプロバイダーを切り替えて比較実験を行いますが、CC Switch の切り替えは非常にスムーズで、設定プリセットを研究室で共有できるおかげで効率が大幅に向上しました。',
          author: '兰大首席格调',
          role: '蘭州大学 博士課程',
        },
        {
          content: 'これまで多くの Claude Code 周辺ツールを試してきましたが、Dock に常駐させたいと思える数少ないツールが CC Switch です。プロバイダーのワンクリック切り替え、設定のビジュアル管理、コスト追跡、どれも完成度が高く、チームの非エンジニアでもすぐ使いこなせました。',
          author: 'saladday',
          role: '著名な開発者',
        },
        {
          content: 'AI コーディングのチュートリアルで毎回いろんなプロバイダーを実演しますが、CC Switch のワンクリック切り替えのおかげで収録がスムーズで、視聴者もそのまま真似できます。',
          author: '左岚',
          role: 'bilibili 動画クリエイター',
        },
      ],
    },
    // CTA Section
    cta: {
      title: 'より効率的な',
      titleLine2: 'AI ワークフローを体験する準備はできましたか？',
      subtitle: 'CC Switch をダウンロードして、AI コーディングツールのワークフロー統一管理を始めましょう',
      downloadBtn: '今すぐダウンロード',
      githubBtn: 'GitHub を見る',
      platforms: 'macOS · Windows · Linux',
    },
    // Download page
    downloadPage: {
      title: 'CC Switch をダウンロード',
      subtitle: '無料・オープンソース。AI コーディングツールのワークフローを 1 つのアプリで管理。',
      latestVersion: '最新バージョン',
      publishedOn: 'リリース日',
      downloadFor: '{platform} 版をダウンロード',
      universalNote: 'Apple Silicon と Intel の両方に対応（Universal）',
      macNotarized: 'macOS 版は Apple のコード署名と公証を取得済みです',
      brewNote: 'Homebrew でもインストールできます：',
      otherPlatformsHint: 'お使いのデバイスではありませんか？下から他のプラットフォームを選べます。',
      allPlatforms: 'すべてのプラットフォーム',
      recommended: 'おすすめ',
      kinds: {
        dmg: 'ディスクイメージ (.dmg)',
        zip: 'アーカイブ (.zip)',
        msi: 'インストーラー (.msi)',
        portable: 'ポータブル版 (.zip)',
        appimage: 'AppImage',
        deb: 'deb パッケージ',
        rpm: 'rpm パッケージ',
      },
      kindNotes: {
        dmg: 'ダブルクリックでインストール',
        zip: 'インストール不要、解凍してすぐ使える',
        msi: '標準インストーラー',
        portable: 'インストール不要、解凍してすぐ使える',
        appimage: 'インストール不要。システム要件を満たすディストリビューションで動作',
        deb: 'Ubuntu 22.04+ / Debian 12+ 向け',
        rpm: 'WebKitGTK 4.1 を提供する Fedora などの RPM 系向け',
      },
      windowsArchHint: 'どれを選べばよいか分からない場合は x64 を選んでください。',
      linuxRequirement: 'glibc 2.35 以上と WebKitGTK 4.1 が必要です（例：Ubuntu 22.04+、Debian 12+、最近の Fedora）。RHEL / Rocky / Alma 8–9 は現在未対応です。',
      verifyIntro: '整合性の確認：ダウンロード後にターミナルで',
      verifyOutro: ' を実行し、出力がこのページと GitHub Releases に表示される SHA-256 と一致することを確認してください。',
      copyHash: '完全な SHA-256 をコピー',
      hashCopied: 'コピーしました',
      history: {
        title: '過去のバージョン',
        note: '古いバージョンはすべて GitHub Releases から入手できます。',
        link: 'GitHub Releases を開く',
      },
      fallback: {
        title: 'ダウンロードサービスは一時的に利用できません',
        note: 'すべてのインストーラーは GitHub Releases から直接入手できます。',
        button: 'GitHub からダウンロード',
      },
      loading: '最新バージョンを取得中…',
    },
    // Footer
    footer: {
      tagline: 'AI コーディングツールのワークフローを統一管理',
      product: {
        title: '製品',
        features: '機能',
        download: 'ダウンロード',
      },
      resources: {
        title: 'リソース',
        docs: 'ドキュメント',
        tutorials: 'チュートリアル',
        changelog: '更新履歴',
      },
      community: {
        title: 'コミュニティ',
        github: 'GitHub',
        contributing: '貢献ガイド',
        issues: '問題報告',
        sponsors: 'スポンサー',
      },
      copyright: '© 2025–{year} CC Switch. MIT ライセンスでオープンソース。',
      madeWith: 'Made with ❤️ by CC Switch Team',
    },
    // Sponsors Page
    sponsorsPage: {
      section: {
        title: 'スポンサーの皆さまに感謝',
        subtitle: '安定でコスパに優れた API 中継サービスをお探しなら、CC Switch のスポンサーもぜひご検討ください。',
        viewAll: 'すべてのスポンサーを見る',
      },
      hero: {
        badge: 'オープンソース · コミュニティ駆動',
        title: 'すべてのサポーターに感謝',
        subtitle: 'CC Switch は開発者向けのオープンソースプロジェクトで、コミュニティとスポンサーの支援によって支えられています。すべてのご支援が、プロジェクトをさらに前へ進める力になります。',
      },
      tiers: {
        flagship: {
          title: 'フラッグシップスポンサー',
          subtitle: 'プロジェクトを長期的に支える中核パートナー',
        },
        gold: {
          title: 'ゴールドスポンサー',
          subtitle: 'CC Switch の継続的な発展を支える皆さま',
        },
        standard: {
          title: 'その他のスポンサー',
          subtitle: 'CC Switch を支え、ユーザーに専用特典を提供してくれるスポンサーの皆さま',
        },
      },
      card: {
        visit: 'サイトを見る',
        perk: '専用特典',
        coupon: 'クーポンコード',
        copyCoupon: 'クーポンをコピー',
        copied: 'クリップボードにコピーしました',
        visitWithCoupon: '専用特典を利用する',
      },
      perksTable: {
        badge: '一覧で確認',
        title: '専用特典まとめ',
        subtitle: 'CC Switch 専用リンクまたはクーポンコードで以下の特典を受けられます。コードをクリックでコピーできます。',
        headers: {
          sponsor: 'スポンサー',
          perk: '専用特典',
          coupon: 'クーポン',
          link: 'サイトへ',
        },
      },
      faq: {
        title: 'よくある質問',
        items: [
          {
            q: 'CC Switch のスポンサーになるには？',
            a: 'support@ccswitch.io までメールでご連絡のうえ、ご希望のプランや掲載に関するご要望をお知らせください。詳細を確認次第、掲載位置と公開時期を調整します。',
          },
          {
            q: 'どのような提携プランがありますか？',
            a: '2 つの提携プランをご用意しています。両プランとも、公式サイトのスポンサーページ掲載、アプリ内プリセットプロバイダー連携とハイライト推薦、優先技術サポートが含まれます。フルプランではこれに加えて、GitHub README バナー掲載（英語・中国語・日本語・ドイツ語の 4 言語対応）が含まれます。提携の詳細についてはメールでお問い合わせください。',
          },
          {
            q: '提携が決まってから掲載までどのくらいかかりますか？',
            a: '詳細の確認と素材のお預かりが完了してから、通常 1〜3 営業日で掲載を開始します。所要時間は掲載位置や素材の準備状況によって多少前後します。',
          },
          {
            q: 'どのような素材を準備すればよいですか？',
            a: '通常、ロゴ、短い製品紹介文（中国語・英語・日本語の各バージョン任意）、専用リファラルリンク、オプションで GitHub README 用バナー画像をご用意いただきます。提携確定後に詳細な寸法・フォーマット要件をお送りし、素材レビューもサポートいたします。',
          },
        ],
      },
      benefits: {
        badge: 'CC Switch とともに成長',
        title: 'スポンサー特典',
        subtitle: '注目度の高い掲載枠、アプリ内レコメンド、優先技術サポートで、世界中の開発者に効率的にリーチします。',
        perks: [
          {
            title: 'GitHub README バナー',
            description: '英語・中国語・日本語・ドイツ語の 4 言語に対応し、GitHub のグローバル開発者にリーチ。',
          },
          {
            title: 'アプリ内プリセット連携',
            description: 'ハイライト推薦付き。ユーザーはサイトでキーをコピーし、ワンクリックでインポートでき導入コストを大幅削減。',
          },
          {
            title: '公式サイトのスポンサー枠',
            description: 'ccswitch.io のスポンサーページに長期掲載され、関心の高い開発者を呼び込みます。',
          },
          {
            title: '優先技術サポート',
            description: 'データ調整やパラメータ最適化など、専用窓口で迅速に対応します。',
          },
        ],
        cta: 'スポンサーになる',
      },
    },
    // Docs Page
    docs: {
      title: 'ドキュメント',
      aria: {
        openNav: 'ナビゲーションを開く',
        closeNav: 'ナビゲーションを閉じる',
      },
      search: {
        trigger: 'ドキュメントを検索...',
        placeholder: 'ドキュメントを検索...',
        noResults: '"{query}" に一致する結果はありません',
        navigate: 'で移動',
        select: 'で選択',
      },
      toc: {
        title: 'このページ内',
      },
      footer: {
        edit: 'このページを編集',
        lastUpdated: '最終更新：{date}',
      },
      pagination: {
        previous: '前へ',
        next: '次へ',
      },
      nav: {
        sections: {
          'getting-started': 'クイックスタート',
          providers: 'プロバイダー管理',
          extensions: '拡張機能',
          proxy: 'ローカルルーティングと高可用性',
          faq: 'よくある質問',
        },
        items: {
          introduction: 'ソフトウェア紹介',
          installation: 'インストールガイド',
          interface: 'インターフェース概要',
          quickstart: 'クイックスタート',
          settings: '設定',
          add: 'プロバイダー追加',
          switch: 'プロバイダー切替',
          edit: 'プロバイダー編集',
          'sort-duplicate': '並べ替え＆複製',
          'usage-query': '使用量クエリ',
          'claude-desktop': 'Claude Desktop',
          mcp: 'MCP サーバー',
          prompts: 'プロンプト',
          skills: 'スキル',
          sessions: 'セッションマネージャー',
          workspace: 'ワークスペースとメモリー',
          service: 'ローカルルーティングサービス',
          routing: 'アプリルーティング',
          takeover: 'アプリルーティング',
          failover: 'フェイルオーバー',
          usage: '使用統計',
          'model-test': '接続チェック',
          aggregation: '集約モード',
          'config-files': '設定ファイル',
          questions: 'FAQ',
          deeplink: 'ディープリンク',
          'env-conflict': '環境変数の競合',
        },
      },
    },
    // Changelog Page
    changelog: {
      title: '更新履歴',
      description: 'CC Switch の全ての重要な変更がここに記録されます。最新の機能、改善、バグ修正をご確認ください。',
      loading: '更新履歴を読み込み中...',
      error: '読み込みに失敗しました',
      versions: 'バージョン一覧',
      inVersion: 'v{version} の内容',
      betaRelease: 'ベータリリース',
      openVersions: 'バージョン一覧を開く',
      closeVersions: 'バージョン一覧を閉じる',
    },
    // Tutorials Page
    tutorials: {
      hero: {
        badge: '公式 + コミュニティ',
        title: 'CC Switch をもっと使いこなす',
        subtitle: 'インストールの先へ。公式とコミュニティが書いた CC Switch 活用記事を集めました。5 分入門から本番運用まで。',
        contribute: 'チュートリアルを投稿',
      },
      filters: {
        category: 'カテゴリ',
        source: '出典',
        all: 'すべて',
        clear: 'フィルタをクリア',
      },
      categories: {
        'getting-started': '入門',
        practice: '実践',
        integration: '連携',
        troubleshooting: 'トラブルシュート',
        video: '動画',
      },
      sources: {
        official: '公式',
        community: 'コミュニティ',
      },
      card: {
        readMin: '読了 {n} 分',
        external: '外部',
        unavailable: 'この言語版は未翻訳',
      },
      empty: {
        title: '該当する記事がありません',
        subtitle: 'フィルタをクリアするか、別のカテゴリに切り替えてみてください。',
      },
      detail: {
        back: 'チュートリアル一覧に戻る',
        readMin: '読了 {n} 分',
        published: '公開日：{date}',
        updated: '更新日：{date}',
        bySource: '{source} 提供',
        notAvailable: {
          title: 'この記事は現在の言語ではまだ提供されていません',
          subtitle: '他の言語に切り替えてご覧ください。または一覧に戻って他の記事を探せます。',
        },
        prev: '前の記事',
        next: '次の記事',
        edit: 'GitHub でこのページを編集',
      },
      cta: {
        title: 'CC Switch のチュートリアルを共有しませんか？',
        subtitle: 'あなたの実運用ノウハウを記事にしてお寄せください。掲載時はクレジット表記と専用枠が付きます。',
        action: 'メールで投稿',
      },
    },
  },
} as const;

export type TranslationKey = typeof translations['zh'];
