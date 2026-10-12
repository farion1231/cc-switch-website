import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Heart,
  MousePointerClick,
  Plug,
  ShieldCheck,
  Wallet,
  Wand2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SiteFooter } from '@/components/ccswitch/SiteFooter';
import { buttonVariants } from '@/components/ui/button';
import { useLanguage } from '@/i18n/useLanguage';
import { getLocalizedPath } from '@/i18n/routes';
import { cn } from '@/lib/utils';

// 先只出中文：英文、日文定稿后再把文案挪进 translations.ts
const copy = {
  hero: {
    badge: '站长接入',
    title: '让你的用户一键接入 CC Switch',
    subtitle:
      '在控制台放一个「导入到 CC Switch」按钮：用户点一下，你的地址、Key、模型和余额查询就加进 Claude Code、Codex 等应用，不用再手动填表。接入免费，不需要向我们申请。',
    generator: '打开链接生成器',
    guide: '阅读接入指南',
  },
  flow: {
    title: '用户点了按钮之后',
    steps: [
      {
        title: '唤起 CC Switch',
        description: '浏览器询问是否打开 CC Switch，用户同意后弹出导入确认框。没开着的 CC Switch 会先启动。',
      },
      {
        title: '核对后导入',
        description: '确认框列出地址、打码后的 Key、模型和余额查询脚本，可疑内容标黄提示。用户确认无误再点「导入」。',
      },
      {
        title: '直接看到余额',
        description: '链接带了用量查询脚本，导入后供应商卡片就会显示余额或套餐用量，切换也只要点一下。',
      },
    ],
  },
  builtin: {
    title: '已经在用 New API 或 Sub2API？',
    subtitle: '这两个系统的 Key 列表里都自带「导入到 CC Switch」按钮，开箱即用，不用自己开发。',
    items: [
      {
        name: 'New API',
        apps: '支持 Claude Code、Codex、Gemini CLI',
        usage: '链接不带用量查询脚本，用户导入后卡片上看不到余额。用户可以在 CC Switch 的「配置用量查询」里选 NewAPI 模板补上，需要填系统访问令牌和用户 ID。',
      },
      {
        name: 'Sub2API',
        apps: '支持 Claude Code、Codex、Gemini CLI、Grok Build',
        usage: '链接自带用量查询脚本，导入后直接显示余额。CC Switch v4.0.10 起也内置了 Sub2API 模板，用户手动添加时一样能选用。',
      },
    ],
    note: '想补上余额、带上你的图标，或者支持 OpenCode、Pi 等更多应用，可以按接入指南自己生成链接。',
  },
  diy: {
    title: '自己做按钮：三步',
    steps: [
      {
        title: '后端按用户生成链接',
        description: '导入供应商时 API Key 是必填的，所以链接要由后端用这个用户自己的 Key 拼出来，按钮只放在登录后的控制台里。',
      },
      {
        title: '点击时取链接并跳转',
        description: '按钮本身不带链接。用户点击时向后端要链接，拿到后跳转，Key 不会写进页面源码。',
      },
      {
        title: '带上余额查询',
        description: '把一段用量查询脚本放进链接，用户导入后就能看到余额。NewAPI、Sub2API 系的站有现成脚本可以照抄。',
      },
    ],
    codeCaption: '最短的写法（Node.js）',
  },
  notes: {
    title: '接入前要知道',
    items: [
      '带 Key 的链接等同于 Key 本身，只在用户登录后生成，不要放进公开页面、邮件或社群公告。',
      '一条链接只导入到一个应用。同时支持 Claude Code、Codex 等几个应用时，每个应用放一个按钮。',
      '网页无法判断用户是否装了 CC Switch。按钮旁边常驻一句提示，并附上下载地址。',
      '接口格式（apiFormat）、自定义图标（iconUrl）和 Pi 供应商需要 CC Switch v4.0.10 及以上。',
    ],
  },
  sponsor: {
    title: '想出现在 CC Switch 的预设列表里？',
    description:
      '放导入按钮不需要任何合作。CC Switch 应用内的供应商预设只收录原厂、云平台和大型聚合平台；中转和聚合服务想进入预设列表、获得推荐位，请了解赞助计划。',
    cta: '了解赞助计划',
  },
};

const STEP_ICONS = [MousePointerClick, ShieldCheck, Wallet];

const CODE = `// 后端：按当前登录用户返回链接
app.post("/api/ccswitch-link", requireLogin, (req, res) => {
  const params = new URLSearchParams({
    resource: "provider",
    app: "claude",
    name: "Example AI",
    endpoint: "https://api.example.com",
    apiKey: req.user.apiKey,
  });
  res.set("Cache-Control", "no-store");
  res.json({ link: \`ccswitch://v1/import?\${params}\` });
});

// 前端：用户点击时再取链接，然后跳转
async function importToCcSwitch() {
  const res = await fetch("/api/ccswitch-link", { method: "POST" });
  const { link } = await res.json();
  window.location.href = link;
}`;

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5 },
};

export default function IntegratePage() {
  const { language } = useLanguage();
  const guideHref = getLocalizedPath('/tutorials/deeplink-site-integration-guide', language);

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-20 md:pt-24">
        {/* Hero */}
        <section className="relative overflow-hidden pt-6 pb-10 md:pt-10 md:pb-14">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-primary/[0.07] via-transparent to-transparent" />
          <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-3xl text-center"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary md:text-sm">
                <Plug className="h-3.5 w-3.5" />
                {copy.hero.badge}
              </span>
              <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                {copy.hero.title}
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {copy.hero.subtitle}
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                {/* 生成器是 public/ 下的静态页，不走前端路由 */}
                <a
                  href="/deplink.html"
                  className={cn(
                    buttonVariants({ variant: 'hero', shape: 'pill' }),
                    'h-auto w-full border border-transparent px-6 py-3 text-sm font-medium shadow-sm hover:shadow-md sm:w-auto md:text-base',
                  )}
                >
                  <Wand2 className="h-4 w-4" />
                  {copy.hero.generator}
                </a>
                <Link
                  to={guideHref}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-all hover:border-foreground/30 hover:bg-accent sm:w-auto md:text-base"
                >
                  <BookOpen className="h-4 w-4" />
                  {copy.hero.guide}
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 用户点了按钮之后 */}
        <section className="py-12 md:py-16">
          <div className="container">
            <motion.h2 {...fadeIn} className="text-center text-2xl font-bold text-foreground sm:text-3xl">
              {copy.flow.title}
            </motion.h2>
            <motion.div {...fadeIn} className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
              {copy.flow.steps.map((step, index) => {
                const Icon = STEP_ICONS[index];
                return (
                  <div key={step.title} className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center gap-3">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">0{index + 1}</span>
                    </div>
                    <h3 className="text-base font-semibold text-foreground md:text-lg">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* New API / Sub2API 自带的按钮 */}
        <section className="bg-muted/30 py-12 md:py-16">
          <div className="container">
            <motion.div {...fadeIn} className="mx-auto max-w-3xl text-center">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{copy.builtin.title}</h2>
              <p className="mt-3 text-sm text-muted-foreground md:text-base">{copy.builtin.subtitle}</p>
            </motion.div>
            <motion.div {...fadeIn} className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
              {copy.builtin.items.map((item) => (
                <div key={item.name} className="flex h-full flex-col gap-2 rounded-2xl border border-border bg-card p-5">
                  <h3 className="text-lg font-semibold text-foreground">{item.name}</h3>
                  <p className="text-xs font-medium text-primary">{item.apps}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.usage}</p>
                </div>
              ))}
            </motion.div>
            <motion.p {...fadeIn} className="mx-auto mt-6 max-w-3xl text-center text-sm text-muted-foreground">
              {copy.builtin.note}{' '}
              <Link to={guideHref} className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
                {copy.hero.guide}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.p>
          </div>
        </section>

        {/* 自己做按钮 */}
        <section className="py-12 md:py-16">
          <div className="container">
            <motion.h2 {...fadeIn} className="text-center text-2xl font-bold text-foreground sm:text-3xl">
              {copy.diy.title}
            </motion.h2>
            <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-[2fr_3fr]">
              <motion.ol {...fadeIn} className="flex flex-col gap-5">
                {copy.diy.steps.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                    </div>
                  </li>
                ))}
              </motion.ol>
              <motion.figure {...fadeIn} className="min-w-0">
                <figcaption className="mb-2 text-xs font-medium text-muted-foreground">{copy.diy.codeCaption}</figcaption>
                <pre className="max-w-full overflow-x-auto rounded-xl border border-border bg-card p-4 font-mono text-xs leading-relaxed text-foreground md:text-sm">
                  <code>{CODE}</code>
                </pre>
              </motion.figure>
            </div>
          </div>
        </section>

        {/* 接入前要知道 */}
        <section className="bg-muted/30 py-12 md:py-16">
          <div className="container">
            <motion.div {...fadeIn} className="mx-auto max-w-3xl">
              <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">{copy.notes.title}</h2>
              <ul className="mt-8 flex flex-col gap-3">
                {copy.notes.items.map((item) => (
                  <li key={item} className="flex gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* 赞助商 */}
        <section className="py-12 md:py-20">
          <div className="container">
            <motion.div {...fadeIn} className="mx-auto max-w-3xl rounded-2xl border border-primary/30 bg-primary/[0.04] p-6 text-center md:p-10">
              <h2 className="text-xl font-bold text-foreground sm:text-2xl">{copy.sponsor.title}</h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                {copy.sponsor.description}
              </p>
              <Link
                to={getLocalizedPath('/sponsors', language)}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-all hover:border-foreground/30 hover:bg-accent md:text-base"
              >
                <Heart className="h-4 w-4" />
                {copy.sponsor.cta}
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
