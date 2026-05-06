export type Language = 'zh' | 'en' | 'ja';

export const translations = {
  zh: {
    // Navbar
    nav: {
      home: '首页',
      features: '功能',
      pricing: '定价',
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
      slogan: '统一管理你的 AI 编程 CLI 工作流',
      downloadBtn: '免费下载',
      docsBtn: '查看文档',
      platforms: '支持 macOS 12+ · Windows 10+ · Linux',
      stars: 'Stars',
      downloads: '下载',
      supportedCli: '支持 CLI',
      rustBadge: 'Rust #1',
    },
    // Features Section
    features: {
      title: '为什么选择 CC Switch?',
      subtitle: '一个应用管理供应商、路由、用量、会话和技能',
      items: [
        {
          title: '统一管理六大 CLI',
          description: '一个界面管理 Claude Code、Codex、Gemini CLI、OpenCode、OpenClaw 和 Hermes Agent 的供应商配置。',
        },
        {
          title: '自动故障转移',
          description: '本地路由内置熔断器、健康监控和故障转移队列，主 Provider 异常时自动切换到备用 Provider。',
        },
        {
          title: '用量与额度可见',
          description: '实时追踪请求、Token、缓存命中、成本和订阅额度，支持日期范围筛选与自定义模型价格。',
        },
        {
          title: '安全本地存储',
          description: '所有配置和 API Key 安全存储在本地 SQLite 数据库，支持完整的 Schema 迁移。',
        },
        {
          title: 'MCP / Skills / 会话',
          description: '统一管理 MCP、Skills、Prompts、Hermes Memory 和跨应用会话恢复，无需手动编辑配置文件。',
        },
        {
          title: '开源免费',
          description: '基于 MIT 协议开源，完全免费使用。社区驱动开发，欢迎贡献代码和反馈。',
        },
      ],
    },
    // Tech Section
    tech: {
      badge: '开发者友好',
      title: '零配置，开箱即用',
      description: '无需修改代码，开启本地路由即可获得格式转换、热切换、故障转移、请求日志和用量统计。',
      features: [
        {
          title: 'SQLite 数据持久化',
          description: '所有配置存储在本地 SQLite 数据库，安全可靠，支持完整的 Schema 迁移。',
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
    // Provider Card
    provider: {
      inUse: '使用中',
      enable: '启用',
      used: '已使用',
      remaining: '剩余',
      minutesAgo: '分钟前',
    },
    // Demo Section
    demo: {
      title: '直观的操作界面',
      subtitle: '主界面、工具栏和本地路由状态一眼可见',
      localRouting: '路由',
      toolbar: {
        skills: 'Skills',
        prompts: 'Prompts',
        sessions: 'Sessions',
        mcp: 'MCP',
        workspace: 'Workspace',
        env: 'Env',
        tools: 'Tools',
        agents: 'Agents',
        memory: 'Memory',
        dashboard: 'Dashboard',
      },
      actionNames: {
        settings: '设置',
        localRouting: '本地路由开关',
        addProvider: '添加供应商',
        activateProvider: '启用供应商',
        editProvider: '编辑供应商',
        duplicateProvider: '复制供应商',
        testProvider: '模型测试',
        configureUsage: '配置用量查询',
        deleteProvider: '删除供应商',
        skills: 'Skills 管理',
        prompts: '提示词管理',
        sessions: '会话管理',
        mcp: 'MCP 管理',
        workspace: 'Workspace 文件管理',
        env: '环境变量',
        tools: '工具权限',
        agents: 'Agents 配置',
        memory: '记忆管理',
        dashboard: '打开 Hermes Web UI',
      },
      tabs: {
        provider: 'Provider 管理',
        proxy: '本地路由',
        stats: '使用统计',
      },
      proxy: {
        localProxy: '本地路由',
        proxyDescription: '控制路由服务开关、查看状态与端口信息',
        running: '运行中',
        stopped: '已停止',
        serviceAddress: '服务地址',
        copy: '复制',
        addressNote: '修改监听地址/端口需要先停止路由服务',
        currentProvider: '当前 Provider',
        waitingRequest: '等待首次请求...',
        proxyEnable: '应用路由',
        enableLogging: '启用日志记录',
        loggingNote: '记录所有路由请求，便于排查问题',
        failoverQueue: '故障转移队列',
        normal: '正常',
        activeConnections: '活跃连接',
        totalRequests: '总请求数',
        successRate: '成功率',
        uptime: '运行时间',
      },
      stats: {
        title: '使用统计',
        subtitle: '按日期范围查看请求、Token、缓存和成本',
        periods: {
          hours24: '今天',
          days1: '1天',
          days7: '7天',
          days14: '14天',
          days30: '30天',
        },
        totalRequests: '总请求数',
        totalCost: '总成本',
        totalTokens: '总 Token 数',
        cacheTokens: '缓存 Token',
        trend: '使用趋势',
        past: '过去',
        requests: '请求数',
        cost: '成本',
        inputToken: '输入Token',
        outputToken: '输出Token',
        writeCache: '写缓存',
        hitCache: '命中缓存',
      },
    },
    // Pricing Section
    pricing: {
      title: '简单透明的定价',
      subtitle: '开源免费，永久无限制使用',
      recommended: '推荐',
      planName: '开源免费',
      price: '$0',
      priceNote: '永久免费，无隐藏费用',
      downloadBtn: '立即下载',
      enterprise: '需要企业级支持？',
      contactUs: '联系我们',
      features: [
        '无限 Provider 配置',
        '本地路由与热切换',
        '自动故障转移',
        '用量、额度与成本追踪',
        'MCP/Skills/Prompts/会话管理',
        'Hermes Memory 与 OpenClaw 工作区',
        '跨平台支持 (macOS/Win/Linux)',
        '社区支持',
        '开源代码访问',
      ],
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
          question: '支持哪些 AI CLI 工具？',
          answer: '目前支持 Claude Code、Codex、Gemini CLI、OpenCode、OpenClaw 和 Hermes Agent，并为不同应用提供对应的供应商预设、配置写入和会话管理能力。',
        },
        {
          question: '我的 API Key 安全吗？',
          answer: '绝对安全。所有 API Key 和配置信息都存储在您本地的 SQLite 数据库中，不会上传到任何服务器。',
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
          answer: '您可以通过 GitHub Issues 反馈问题，或者加入我们的 Discord 社区与其他用户交流。',
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
          content: '统一管理六个 CLI 工具真的太方便了，一个界面搞定所有配置。省去了在不同配置文件之间来回切换的麻烦。',
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
      subtitle: '下载 CC Switch，开启统一管理 AI 编程 CLI 工作流的新方式',
      downloadBtn: '立即下载',
      githubBtn: '查看 GitHub',
      platforms: '支持 macOS · Windows · Linux',
    },
    // Footer
    footer: {
      tagline: '统一管理你的 AI 编程 CLI 工作流',
      product: {
        title: '产品',
        features: '功能',
        download: '下载',
        changelog: '更新日志',
        roadmap: '路线图',
      },
      resources: {
        title: '资源',
        docs: '文档',
        tutorials: '攻略',
        changelog: '更新日志',
        api: 'API 参考',
        examples: '示例',
      },
      community: {
        title: '社区',
        github: 'GitHub',
        discord: 'Discord',
        contributing: '贡献指南',
        issues: '问题反馈',
        sponsors: '赞助商',
      },
      legal: {
        title: '法律',
        privacy: '隐私政策',
        terms: '服务条款',
        license: 'MIT 许可证',
      },
      copyright: '© 2025 CC Switch. 基于 MIT 协议开源。',
      madeWith: 'Made with ❤️ by CC Switch Team',
    },
    // Sponsors Page
    sponsorsPage: {
      section: {
        title: '感谢赞助商的支持',
        subtitle: '如果您需要稳定、高性价比的 API 中转服务，欢迎了解一下 CC Switch 的赞助商。',
        viewAll: '查看全部赞助商',
        becomeSponsor: '成为赞助商',
      },
      hero: {
        badge: '开源 · 社区驱动',
        title: '感谢每一位支持者',
        subtitle: 'CC Switch 是一个面向开发者的开源项目，由社区与赞助商共同支撑。我们将每一份支持都视作让项目走得更远的力量。',
        becomeSponsor: '成为赞助商',
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
        since: '赞助自 {date}',
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
            a: '目前提供两种合作方案。两种方案都包含官网赞助商页展示、应用内预设接入与高亮推荐，以及优先技术支持。完整方案在此基础上额外提供 GitHub README 广告位，支持中/日/英三语展示。具体合作细节欢迎邮件沟通。',
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
            description: '中、日、英三语展示，覆盖 GitHub 上的中外开发者。',
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
          mcp: 'MCP 服务器',
          prompts: 'Prompts 提示词',
          skills: 'Skills 技能',
          sessions: '会话管理器',
          workspace: '工作区与记忆',
          service: '路由服务',
          routing: '应用路由',
          takeover: '应用路由',
          failover: '故障转移',
          usage: '用量统计',
          'model-test': '模型检查',
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
      pricing: 'Pricing',
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
      slogan: 'Unified Management for Your AI Coding CLI Workflow',
      downloadBtn: 'Download Free',
      docsBtn: 'View Docs',
      platforms: 'macOS 12+ · Windows 10+ · Linux',
      stars: 'Stars',
      downloads: 'Downloads',
      supportedCli: 'CLI Supported',
      rustBadge: 'Rust #1',
    },
    // Features Section
    features: {
      title: 'Why Choose CC Switch?',
      subtitle: 'One app for providers, routing, usage, sessions, and skills',
      items: [
        {
          title: 'Six CLI Tools, One App',
          description: 'Manage providers for Claude Code, Codex, Gemini CLI, OpenCode, OpenClaw, and Hermes Agent from one interface.',
        },
        {
          title: 'Automatic Failover',
          description: 'Local Routing combines circuit breakers, health checks, and failover queues so requests can move to a backup provider automatically.',
        },
        {
          title: 'Usage & Quota Visibility',
          description: 'Track requests, tokens, cache activity, costs, and subscription quota with date ranges and custom model pricing.',
        },
        {
          title: 'Secure Local Storage',
          description: 'All configurations and API keys are securely stored in a local SQLite database with full schema migration support.',
        },
        {
          title: 'MCP, Skills & Sessions',
          description: 'Manage MCP, Skills, Prompts, Hermes Memory, and cross-app session restore without editing config files by hand.',
        },
        {
          title: 'Open Source & Free',
          description: 'Open source under MIT license, completely free. Community-driven development, contributions welcome.',
        },
      ],
    },
    // Tech Section
    tech: {
      badge: 'Developer Friendly',
      title: 'Zero Configuration, Ready to Use',
      description: 'No code changes required. Enable Local Routing to get format conversion, hot switching, failover, request logs, and usage analytics.',
      features: [
        {
          title: 'SQLite Data Persistence',
          description: 'All configurations stored in local SQLite database, secure and reliable with full schema migration support.',
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
    // Provider Card
    provider: {
      inUse: 'In Use',
      enable: 'Enable',
      used: 'Used',
      remaining: 'Remaining',
      minutesAgo: 'min ago',
    },
    // Demo Section
    demo: {
      title: 'Intuitive Interface',
      subtitle: 'Main UI, toolbar actions, and Local Routing status at a glance',
      localRouting: 'Routing',
      toolbar: {
        skills: 'Skills',
        prompts: 'Prompts',
        sessions: 'Sessions',
        mcp: 'MCP',
        workspace: 'Workspace',
        env: 'Env',
        tools: 'Tools',
        agents: 'Agents',
        memory: 'Memory',
        dashboard: 'Dashboard',
      },
      actionNames: {
        settings: 'Settings',
        localRouting: 'Local Routing toggle',
        addProvider: 'Add provider',
        activateProvider: 'Enable provider',
        editProvider: 'Edit provider',
        duplicateProvider: 'Duplicate provider',
        testProvider: 'Model test',
        configureUsage: 'Configure usage query',
        deleteProvider: 'Delete provider',
        skills: 'Skills management',
        prompts: 'Prompts management',
        sessions: 'Session management',
        mcp: 'MCP management',
        workspace: 'Workspace file management',
        env: 'Environment variables',
        tools: 'Tool permissions',
        agents: 'Agents configuration',
        memory: 'Memory management',
        dashboard: 'Open Hermes Web UI',
      },
      tabs: {
        provider: 'Provider Management',
        proxy: 'Local Routing',
        stats: 'Usage Stats',
      },
      proxy: {
        localProxy: 'Local Routing',
        proxyDescription: 'Control routing service toggle, view status and port info',
        running: 'Running',
        stopped: 'Stopped',
        serviceAddress: 'Service Address',
        copy: 'Copy',
        addressNote: 'Stop routing service before modifying address/port',
        currentProvider: 'Current Provider',
        waitingRequest: 'Waiting for first request...',
        proxyEnable: 'App Routing',
        enableLogging: 'Enable Logging',
        loggingNote: 'Log all routed requests for troubleshooting',
        failoverQueue: 'Failover Queue',
        normal: 'Normal',
        activeConnections: 'Active Connections',
        totalRequests: 'Total Requests',
        successRate: 'Success Rate',
        uptime: 'Uptime',
      },
      stats: {
        title: 'Usage Statistics',
        subtitle: 'View requests, tokens, cache, and costs by date range',
        periods: {
          hours24: 'Today',
          days1: '1 Day',
          days7: '7 Days',
          days14: '14 Days',
          days30: '30 Days',
        },
        totalRequests: 'Total Requests',
        totalCost: 'Total Cost',
        totalTokens: 'Total Tokens',
        cacheTokens: 'Cache Tokens',
        trend: 'Usage Trend',
        past: 'Last',
        requests: 'Requests',
        cost: 'Cost',
        inputToken: 'Input Token',
        outputToken: 'Output Token',
        writeCache: 'Write Cache',
        hitCache: 'Hit Cache',
      },
    },
    // Pricing Section
    pricing: {
      title: 'Simple, Transparent Pricing',
      subtitle: 'Open source and free, unlimited usage forever',
      recommended: 'Recommended',
      planName: 'Open Source Free',
      price: '$0',
      priceNote: 'Free forever, no hidden fees',
      downloadBtn: 'Download Now',
      enterprise: 'Need enterprise support?',
      contactUs: 'Contact Us',
      features: [
        'Unlimited Provider Configurations',
        'Local Routing & Hot Switching',
        'Automatic Failover',
        'Usage, Quota & Cost Tracking',
        'MCP/Skills/Prompts/Session Management',
        'Hermes Memory & OpenClaw Workspace',
        'Cross-platform (macOS/Win/Linux)',
        'Community Support',
        'Open Source Access',
      ],
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
          question: 'Which AI CLI tools are supported?',
          answer: 'CC Switch supports Claude Code, Codex, Gemini CLI, OpenCode, OpenClaw, and Hermes Agent, with app-specific provider presets, config writing, and session workflows.',
        },
        {
          question: 'Is my API Key secure?',
          answer: 'Absolutely. All API keys and configurations are stored in your local SQLite database and are never uploaded to any server.',
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
          answer: 'You can report issues via GitHub Issues or join our Discord community to connect with other users.',
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
          content: "Managing six CLI tools in one place is so convenient. One interface for all configurations. No more switching between different config files.",
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
      subtitle: 'Download CC Switch and start managing your AI coding CLI workflow the unified way',
      downloadBtn: 'Download Now',
      githubBtn: 'View GitHub',
      platforms: 'macOS · Windows · Linux',
    },
    // Footer
    footer: {
      tagline: 'Unified management for your AI coding CLI workflow',
      product: {
        title: 'Product',
        features: 'Features',
        download: 'Download',
        changelog: 'Changelog',
        roadmap: 'Roadmap',
      },
      resources: {
        title: 'Resources',
        docs: 'Documentation',
        tutorials: 'Tutorials',
        changelog: 'Changelog',
        api: 'API Reference',
        examples: 'Examples',
      },
      community: {
        title: 'Community',
        github: 'GitHub',
        discord: 'Discord',
        contributing: 'Contributing',
        issues: 'Issue Tracker',
        sponsors: 'Sponsors',
      },
      legal: {
        title: 'Legal',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        license: 'MIT License',
      },
      copyright: '© 2025 CC Switch. Open source under MIT license.',
      madeWith: 'Made with ❤️ by CC Switch Team',
    },
    // Sponsors Page
    sponsorsPage: {
      section: {
        title: 'Supported by the best',
        subtitle: 'Looking for a stable, value-priced API relay? Take a look at the sponsors who back CC Switch.',
        viewAll: 'View all sponsors',
        becomeSponsor: 'Become a sponsor',
      },
      hero: {
        badge: 'Open source · Community driven',
        title: 'Powered by amazing supporters',
        subtitle: 'CC Switch is an open source project for developers, kept alive by our community and sponsors. Every contribution helps the project go further.',
        becomeSponsor: 'Become a sponsor',
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
        since: 'Sponsoring since {date}',
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
            a: 'We offer two sponsorship tiers. Both tiers include placement on this sponsors page, in-app preset provider integration with a highlighted recommendation, and priority technical support. The full tier additionally features a GitHub README banner with English, Chinese, and Japanese variants. Reach out by email for partnership details.',
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
            description: 'Featured banner with English, Chinese, and Japanese variants — reaches global developers on GitHub.',
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
          mcp: 'MCP Server',
          prompts: 'Prompts',
          skills: 'Skills',
          sessions: 'Session Manager',
          workspace: 'Workspace & Memory',
          service: 'Routing Service',
          routing: 'App Routing',
          takeover: 'App Routing',
          failover: 'Failover',
          usage: 'Usage Statistics',
          'model-test': 'Model Test',
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
      pricing: '価格',
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
      slogan: 'AI コーディング CLI ワークフローを統一管理',
      downloadBtn: '無料ダウンロード',
      docsBtn: 'ドキュメントを見る',
      platforms: 'macOS 12+ · Windows 10+ · Linux 対応',
      stars: 'Stars',
      downloads: 'ダウンロード',
      supportedCli: '対応 CLI',
      rustBadge: 'Rust #1',
    },
    // Features Section
    features: {
      title: 'なぜ CC Switch を選ぶのか？',
      subtitle: 'プロバイダー、ルーティング、使用量、セッション、Skills を1つに',
      items: [
        {
          title: '6つの CLI を統一管理',
          description: 'Claude Code、Codex、Gemini CLI、OpenCode、OpenClaw、Hermes Agent のプロバイダーを1つの画面で管理できます。',
        },
        {
          title: '自動フェイルオーバー',
          description: 'Local Routing はサーキットブレーカー、ヘルスチェック、フェイルオーバーキューを備え、障害時にバックアップへ自動切替できます。',
        },
        {
          title: '使用量とクォータを可視化',
          description: 'リクエスト、トークン、キャッシュ、コスト、サブスクリプション枠を期間別に追跡し、モデル価格も調整できます。',
        },
        {
          title: 'セキュアなローカルストレージ',
          description: '全ての設定と API キーはローカル SQLite データベースに安全に保存。完全なスキーママイグレーションをサポート。',
        },
        {
          title: 'MCP / Skills / セッション',
          description: 'MCP、Skills、Prompts、Hermes Memory、アプリ横断のセッション復元を手動編集なしで管理できます。',
        },
        {
          title: 'オープンソース＆無料',
          description: 'MIT ライセンスでオープンソース、完全無料。コミュニティ主導の開発、貢献歓迎。',
        },
      ],
    },
    // Tech Section
    tech: {
      badge: '開発者フレンドリー',
      title: 'ゼロ設定、すぐに使える',
      description: 'コード変更不要。Local Routing をオンにするだけで、形式変換、ホットスイッチ、フェイルオーバー、リクエストログ、使用量分析を利用できます。',
      features: [
        {
          title: 'SQLite データ永続化',
          description: 'すべての設定はローカル SQLite データベースに保存され、安全で信頼性が高く、完全なスキーママイグレーションをサポート。',
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
    // Provider Card
    provider: {
      inUse: '使用中',
      enable: '有効化',
      used: '使用済み',
      remaining: '残り',
      minutesAgo: '分前',
    },
    // Demo Section
    demo: {
      title: '直感的なインターフェース',
      subtitle: 'メイン画面、ツールバー操作、Local Routing 状態をひと目で確認',
      localRouting: 'Routing',
      toolbar: {
        skills: 'Skills',
        prompts: 'Prompts',
        sessions: 'Sessions',
        mcp: 'MCP',
        workspace: 'Workspace',
        env: 'Env',
        tools: 'Tools',
        agents: 'Agents',
        memory: 'Memory',
        dashboard: 'Dashboard',
      },
      actionNames: {
        settings: '設定',
        localRouting: 'Local Routing 切り替え',
        addProvider: 'プロバイダーを追加',
        activateProvider: 'プロバイダーを有効化',
        editProvider: 'プロバイダーを編集',
        duplicateProvider: 'プロバイダーを複製',
        testProvider: 'モデルテスト',
        configureUsage: '使用量クエリ設定',
        deleteProvider: 'プロバイダーを削除',
        skills: 'Skills 管理',
        prompts: 'Prompts 管理',
        sessions: 'セッション管理',
        mcp: 'MCP 管理',
        workspace: 'Workspace ファイル管理',
        env: '環境変数',
        tools: 'ツール権限',
        agents: 'Agents 設定',
        memory: '記憶管理',
        dashboard: 'Hermes Web UI を開く',
      },
      tabs: {
        provider: 'プロバイダー管理',
        proxy: 'Local Routing',
        stats: '使用統計',
      },
      proxy: {
        localProxy: 'Local Routing',
        proxyDescription: 'ルーティングサービスの切り替え、ステータスとポート情報の確認',
        running: '実行中',
        stopped: '停止中',
        serviceAddress: 'サービスアドレス',
        copy: 'コピー',
        addressNote: 'アドレス/ポートを変更する前にルーティングサービスを停止してください',
        currentProvider: '現在のプロバイダー',
        waitingRequest: '最初のリクエストを待機中...',
        proxyEnable: 'アプリルーティング',
        enableLogging: 'ログ記録を有効化',
        loggingNote: 'トラブルシューティングのために全てのルーティングリクエストを記録',
        failoverQueue: 'フェイルオーバーキュー',
        normal: '正常',
        activeConnections: 'アクティブ接続',
        totalRequests: '総リクエスト数',
        successRate: '成功率',
        uptime: '稼働時間',
      },
      stats: {
        title: '使用統計',
        subtitle: '期間別にリクエスト、トークン、キャッシュ、コストを確認',
        periods: {
          hours24: '今日',
          days1: '1日',
          days7: '7日間',
          days14: '14日間',
          days30: '30日間',
        },
        totalRequests: '総リクエスト数',
        totalCost: '総コスト',
        totalTokens: '総トークン数',
        cacheTokens: 'キャッシュトークン',
        trend: '使用傾向',
        past: '過去',
        requests: 'リクエスト数',
        cost: 'コスト',
        inputToken: '入力トークン',
        outputToken: '出力トークン',
        writeCache: '書込キャッシュ',
        hitCache: 'ヒットキャッシュ',
      },
    },
    // Pricing Section
    pricing: {
      title: 'シンプルで透明な価格設定',
      subtitle: 'オープンソースで無料、無制限で永久使用可能',
      recommended: 'おすすめ',
      planName: 'オープンソース無料',
      price: '$0',
      priceNote: '永久無料、隠れた料金なし',
      downloadBtn: '今すぐダウンロード',
      enterprise: 'エンタープライズサポートが必要ですか？',
      contactUs: 'お問い合わせ',
      features: [
        '無制限のプロバイダー設定',
        'Local Routing とホットスイッチ',
        '自動フェイルオーバー',
        '使用量・クォータ・コスト追跡',
        'MCP/Skills/Prompts/セッション管理',
        'Hermes Memory と OpenClaw Workspace',
        'クロスプラットフォーム対応 (macOS/Win/Linux)',
        'コミュニティサポート',
        'オープンソースへのアクセス',
      ],
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
          question: 'どの AI CLI ツールに対応していますか？',
          answer: 'Claude Code、Codex、Gemini CLI、OpenCode、OpenClaw、Hermes Agent に対応し、それぞれにプロバイダープリセット、設定書き込み、セッション機能を提供します。',
        },
        {
          question: 'API キーは安全ですか？',
          answer: '絶対に安全です。全ての API キーと設定はローカルの SQLite データベースに保存され、サーバーにアップロードされることはありません。',
        },
        {
          question: 'Local Routing はリクエスト速度に影響しますか？',
          answer: '影響はごくわずかです。Local Routing は Rust で構築されており、形式変換、リクエストログ、ヘルスチェック、フェイルオーバーも提供します。',
        },
        {
          question: 'どうすれば貢献できますか？',
          answer: 'GitHub での Issue や Pull Request を歓迎します。詳細な貢献ガイドラインがあり、すぐに始められます。',
        },
        {
          question: '問題が発生した場合、どのようにヘルプを得られますか？',
          answer: 'GitHub Issues で問題を報告するか、Discord コミュニティに参加して他のユーザーと交流できます。',
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
          content: '6つの CLI ツールを一箇所で管理できるのは本当に便利です。1つのインターフェースですべての設定ができます。異なる設定ファイル間を行き来する必要がなくなりました。',
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
      subtitle: 'CC Switch をダウンロードして、AI コーディング CLI ワークフローの統一管理を始めましょう',
      downloadBtn: '今すぐダウンロード',
      githubBtn: 'GitHub を見る',
      platforms: 'macOS · Windows · Linux',
    },
    // Footer
    footer: {
      tagline: 'AI コーディング CLI ワークフローを統一管理',
      product: {
        title: '製品',
        features: '機能',
        download: 'ダウンロード',
        changelog: '更新履歴',
        roadmap: 'ロードマップ',
      },
      resources: {
        title: 'リソース',
        docs: 'ドキュメント',
        tutorials: 'チュートリアル',
        changelog: '更新履歴',
        api: 'API リファレンス',
        examples: 'サンプル',
      },
      community: {
        title: 'コミュニティ',
        github: 'GitHub',
        discord: 'Discord',
        contributing: '貢献ガイド',
        issues: '問題報告',
        sponsors: 'スポンサー',
      },
      legal: {
        title: '法的情報',
        privacy: 'プライバシーポリシー',
        terms: '利用規約',
        license: 'MIT ライセンス',
      },
      copyright: '© 2025 CC Switch. MIT ライセンスでオープンソース。',
      madeWith: 'Made with ❤️ by CC Switch Team',
    },
    // Sponsors Page
    sponsorsPage: {
      section: {
        title: 'スポンサーの皆さまに感謝',
        subtitle: '安定でコスパに優れた API 中継サービスをお探しなら、CC Switch のスポンサーもぜひご検討ください。',
        viewAll: 'すべてのスポンサーを見る',
        becomeSponsor: 'スポンサーになる',
      },
      hero: {
        badge: 'オープンソース · コミュニティ駆動',
        title: 'すべてのサポーターに感謝',
        subtitle: 'CC Switch は開発者向けのオープンソースプロジェクトで、コミュニティとスポンサーの支援によって支えられています。すべてのご支援が、プロジェクトをさらに前へ進める力になります。',
        becomeSponsor: 'スポンサーになる',
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
        since: '{date} よりサポート',
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
            a: '2 つの提携プランをご用意しています。両プランとも、公式サイトのスポンサーページ掲載、アプリ内プリセットプロバイダー連携とハイライト推薦、優先技術サポートが含まれます。フルプランではこれに加えて、GitHub README バナー掲載（英語・中国語・日本語の 3 言語対応）が含まれます。提携の詳細についてはメールでお問い合わせください。',
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
            description: '英語・中国語・日本語の 3 言語に対応し、GitHub のグローバル開発者にリーチ。',
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
          mcp: 'MCP サーバー',
          prompts: 'プロンプト',
          skills: 'スキル',
          sessions: 'セッションマネージャー',
          workspace: 'ワークスペースとメモリー',
          service: 'ルーティングサービス',
          routing: 'アプリルーティング',
          takeover: 'アプリルーティング',
          failover: 'フェイルオーバー',
          usage: '使用統計',
          'model-test': 'モデルテスト',
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
