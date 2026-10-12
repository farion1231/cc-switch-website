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

const STEP_ICONS = [MousePointerClick, ShieldCheck, Wallet];

// 代码注释跟随页面语言，其余部分保持原样
function buildCode(backendComment: string, frontendComment: string) {
  return `${backendComment}
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

${frontendComment}
async function importToCcSwitch() {
  const res = await fetch("/api/ccswitch-link", { method: "POST" });
  const { link } = await res.json();
  window.location.href = link;
}`;
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5 },
};

export default function IntegratePage() {
  const { t, language } = useLanguage();
  const copy = t.integratePage;
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
                  <code>{buildCode(copy.diy.codeBackend, copy.diy.codeFrontend)}</code>
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
