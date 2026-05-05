import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit,
  ExternalLink,
  User,
} from 'lucide-react';
import { useLanguage } from '@/i18n/useLanguage';
import { getLocalizedPath } from '@/i18n/routes';
import { MarkdownRenderer } from '@/components/docs/MarkdownRenderer';
import { TableOfContents } from '@/components/docs/TableOfContents';
import { SiteFooter } from '@/components/ccswitch/SiteFooter';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  getTutorialBySlug,
  isInSiteTutorial,
  tutorialAvailableInLanguage,
  tutorials,
  type Tutorial,
} from '@/content/tutorials';

const contentCache = new Map<string, string>();

const GITHUB_EDIT_BASE = 'https://github.com/farion1231/cc-switch-website/edit/main/public/docs/tutorials';

// Strip the first H1 from the markdown body — the article header above already
// renders the title, and we don't want it to appear twice.
function stripLeadingTitle(markdown: string): string {
  return markdown.replace(/^\s*#\s+[^\n]*\n+/, '');
}

function fetchTutorialContent(language: string, slug: string) {
  const cacheKey = `${language}/${slug}`;
  const cached = contentCache.get(cacheKey);
  if (cached !== undefined) return Promise.resolve(cached);

  return fetch(`/docs/tutorials/${language}/${slug}.md`)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.text();
    })
    .then((text) => {
      const stripped = stripLeadingTitle(text);
      contentCache.set(cacheKey, stripped);
      return stripped;
    });
}

export default function TutorialDetailPage() {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const detail = t.tutorials.detail;

  const tutorial = slug ? getTutorialBySlug(slug) : undefined;

  // Bounce out for unknown slug or external-only tutorials.
  useEffect(() => {
    if (!slug) return;
    if (!tutorial || !isInSiteTutorial(tutorial)) {
      navigate(getLocalizedPath('/tutorials', language), { replace: true });
    }
  }, [slug, tutorial, language, navigate]);

  const available = tutorial ? tutorialAvailableInLanguage(tutorial, language) : false;

  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Skip fetch for unknown / external-only tutorials — the bounce-out effect
    // above will navigate away on the next tick, and we don't want a stray 404
    // request to /docs/tutorials/<lang>/<slug>.md in the meantime.
    if (!tutorial || !isInSiteTutorial(tutorial) || !available) {
      setIsLoading(false);
      return;
    }

    let isActive = true;
    setIsLoading(true);
    setHasError(false);

    fetchTutorialContent(language, tutorial.slug)
      .then((text) => {
        if (!isActive) return;
        setContent(text);
        setIsLoading(false);
      })
      .catch(() => {
        if (!isActive) return;
        setHasError(true);
        setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [tutorial, available, language]);

  const { prev, next } = useMemo(() => {
    if (!tutorial) return { prev: undefined, next: undefined };
    const inSiteList: Tutorial[] = tutorials.filter(isInSiteTutorial);
    const index = inSiteList.findIndex((item) => item.slug === tutorial.slug);
    return {
      prev: index > 0 ? inSiteList[index - 1] : undefined,
      next: index >= 0 && index < inSiteList.length - 1 ? inSiteList[index + 1] : undefined,
    };
  }, [tutorial]);

  if (!tutorial) return null;

  const title = tutorial.title[language] ?? tutorial.title.en;
  const sourceLabel = t.tutorials.sources[tutorial.source];
  const categoryLabel = t.tutorials.categories[tutorial.category];

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-20 md:pt-24">
        <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-4">
          <div className="flex gap-8 py-4 sm:py-6">
            <main className="min-w-0 flex-1">
              <motion.article
                key={`${language}-${tutorial.slug}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-none xl:max-w-3xl"
              >
                {/* Back link */}
                <Link
                  to={getLocalizedPath('/tutorials', language)}
                  className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {detail.back}
                </Link>

                {/* Article header */}
                <header className="mb-8 border-b border-border pb-6">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {categoryLabel}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-border bg-card px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      {sourceLabel}
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                    {title}
                  </h1>
                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <User className="h-4 w-4" />
                      {tutorial.author.name}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {detail.published.replace('{date}', tutorial.date)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {detail.readMin.replace('{n}', String(tutorial.readMinutes))}
                    </span>
                    {tutorial.author.url && (
                      <a
                        href={tutorial.author.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        {detail.bySource.replace('{source}', tutorial.author.name)}
                      </a>
                    )}
                  </div>
                </header>

                {/* Body */}
                <div className="pb-8">
                  {!available ? (
                    <NotAvailableBlock
                      title={detail.notAvailable.title}
                      subtitle={detail.notAvailable.subtitle}
                    />
                  ) : isLoading ? (
                    <LoadingSpinner />
                  ) : hasError ? (
                    <NotAvailableBlock
                      title={detail.notAvailable.title}
                      subtitle={detail.notAvailable.subtitle}
                    />
                  ) : (
                    <MarkdownRenderer content={content} />
                  )}
                </div>

                {/* Footer / pagination */}
                <div className="mt-8 border-t border-border pt-6">
                  <div className="mb-8 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                    <a
                      href={`${GITHUB_EDIT_BASE}/${language}/${tutorial.slug}.md`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                      {detail.edit}
                    </a>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                    {prev ? (
                      <Link
                        to={getLocalizedPath(`/tutorials/${prev.slug}`, language)}
                        className="group flex flex-col items-start rounded-xl border border-border bg-card p-4 text-left transition-colors hover:bg-muted/50"
                      >
                        <span className="mb-1 inline-flex items-center gap-1 text-sm text-muted-foreground">
                          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                          {detail.prev}
                        </span>
                        <span className="font-medium text-foreground">
                          {prev.title[language] ?? prev.title.en}
                        </span>
                      </Link>
                    ) : (
                      <div />
                    )}

                    {next ? (
                      <Link
                        to={getLocalizedPath(`/tutorials/${next.slug}`, language)}
                        className="group flex flex-col items-start rounded-xl border border-border bg-card p-4 text-left transition-colors hover:bg-muted/50 sm:items-end sm:text-right"
                      >
                        <span className="mb-1 inline-flex items-center gap-1 text-sm text-muted-foreground">
                          {detail.next}
                          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                        <span className="font-medium text-foreground">
                          {next.title[language] ?? next.title.en}
                        </span>
                      </Link>
                    ) : (
                      <div />
                    )}
                  </div>
                </div>
              </motion.article>
            </main>

            {/* TOC */}
            <aside className="hidden w-56 shrink-0 xl:block">
              <div className="sticky top-36">
                {available && content ? <TableOfContents content={content} /> : null}
              </div>
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function NotAvailableBlock({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}
