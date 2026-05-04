import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Tag, ChevronRight, Menu, X } from 'lucide-react';
import { cn, scrollToAnchor } from '@/lib/utils';
import { SiteNavbar } from '@/components/ccswitch/SiteNavbar';
import { SiteFooter } from '@/components/ccswitch/SiteFooter';
import { MarkdownRenderer } from '@/components/docs/MarkdownRenderer';
import { getVersionTocItems, parseChangelog, stripChangelogVersionHeading } from '@/lib/changelog';
import { useLanguage } from '@/i18n/useLanguage';

export default function ChangelogPage() {
  const { language, t } = useLanguage();
  const [activeVersion, setActiveVersion] = useState<string>('');
  const [changelogMarkdown, setChangelogMarkdown] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    let isActive = true;

    setIsLoading(true);
    setActiveVersion('');

    fetch(`/docs/changelog/${language}.md`)
      .then(res => res.text())
      .then(content => {
        if (!isActive) return;
        setChangelogMarkdown(content);
        setIsLoading(false);
      })
      .catch(() => {
        if (!isActive) return;
        setChangelogMarkdown(`# ${t.changelog.error}\n\n${t.changelog.description}`);
        setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [language, t.changelog.description, t.changelog.error]);

  const versions = useMemo(() => parseChangelog(changelogMarkdown), [changelogMarkdown]);

  // Set first version as active and expanded by default
  useEffect(() => {
    if (versions.length > 0 && !versions.some((version) => version.version === activeVersion)) {
      setActiveVersion(versions[0].version);
    }
  }, [versions, activeVersion]);

  const handleVersionClick = (version: string) => {
    setActiveVersion(version);
    scrollToAnchor(`version-${version}`);
  };

  // Track scroll position to highlight active version
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      
      for (const version of versions) {
        const element = document.getElementById(`version-${version.version}`);
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          const elementTop = top + window.scrollY;
          const elementBottom = bottom + window.scrollY;
          
          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            setActiveVersion(version.version);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [versions]);

  const activeVersionData = versions.find(v => v.version === activeVersion);

  return (
    <>
      <div className="min-h-screen bg-background">
        <SiteNavbar />
        
        <main className="pt-20 md:pt-24">
          {/* Content */}
          <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="flex gap-8">
                {/* Version Sidebar */}
                <aside className="hidden lg:block w-64 shrink-0">
                  <nav className="sticky top-24 space-y-1">
                    <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      {t.changelog.versions}
                    </h4>
                    <div className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                      {versions.map((entry) => (
                        <button
                          key={entry.version}
                          onClick={() => handleVersionClick(entry.version)}
                          className={cn(
                            'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-all duration-200',
                            activeVersion === entry.version
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                          )}
                        >
                          <ChevronRight className={cn(
                            'w-3 h-3 transition-transform',
                            activeVersion === entry.version && 'rotate-90'
                          )} />
                          <span className="flex-1">v{entry.version}</span>
                          {entry.isPreRelease && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400">
                              beta
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </nav>
                </aside>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  {/* Version Cards */}
                  <div className="space-y-6 sm:space-y-8">
                    {versions.map((entry, index) => (
                      <motion.div
                        key={entry.version}
                        id={`version-${entry.version}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className={cn(
                          'overflow-hidden rounded-xl border border-border transition-all duration-300',
                          activeVersion === entry.version
                            ? 'ring-2 ring-primary/30 shadow-lg shadow-primary/5'
                            : 'hover:border-primary/30'
                        )}
                      >
                        {/* Version Header */}
                        <div className={cn(
                          'flex flex-col gap-3 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6',
                          entry.isPreRelease ? 'bg-amber-500/5' : 'bg-muted/50'
                        )}>
                          <div className="flex min-w-0 flex-wrap items-center gap-3">
                            <span className={cn(
                              'text-xl font-bold',
                              entry.isPreRelease ? 'text-amber-600 dark:text-amber-400' : 'text-foreground'
                            )}>
                              v{entry.version}
                            </span>
                            {entry.isPreRelease && (
                              <span className="text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-medium">
                                {t.changelog.betaRelease}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 shrink-0" />
                            <span>{entry.date}</span>
                          </div>
                        </div>

                        {/* Version Content */}
                        <div className="p-4 sm:p-6">
                          <MarkdownRenderer 
                            content={stripChangelogVersionHeading(entry.content)}
                            className="changelog-content"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Table of Contents for active version */}
                {activeVersionData && (
                  <aside className="hidden xl:block w-56 shrink-0">
                    <div className="sticky top-24">
                      <h4 className="font-semibold text-foreground mb-4 text-sm">
                        {t.changelog.inVersion.replace('{version}', activeVersion)}
                      </h4>
                      <VersionToc content={activeVersionData.content} />
                    </div>
                  </aside>
                )}
              </div>
            )}
          </div>
        </main>

        {/* Mobile Navigation Button */}
        <button
          onClick={() => setIsMobileNavOpen(true)}
          className="fixed bottom-6 right-6 z-40 rounded-full bg-primary p-4 text-primary-foreground shadow-lg transition-colors hover:bg-primary/90 lg:hidden"
          aria-label={t.changelog.openVersions}
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Mobile Navigation Overlay */}
        <AnimatePresence>
          {isMobileNavOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
                onClick={() => setIsMobileNavOpen(false)}
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="lg:hidden fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-background border-r border-border shadow-xl overflow-y-auto"
              >
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <span className="font-semibold text-foreground flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    {t.changelog.versions}
                  </span>
                  <button
                    onClick={() => setIsMobileNavOpen(false)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                    aria-label={t.changelog.closeVersions}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4 space-y-1">
                  {versions.map((entry) => (
                    <button
                      key={entry.version}
                      onClick={() => {
                        handleVersionClick(entry.version);
                        setIsMobileNavOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-all duration-200',
                        activeVersion === entry.version
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      <ChevronRight className={cn(
                        'w-3 h-3 transition-transform',
                        activeVersion === entry.version && 'rotate-90'
                      )} />
                      <span className="flex-1">v{entry.version}</span>
                      {entry.isPreRelease && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400">
                          beta
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <SiteFooter />
      </div>
    </>
  );
}

// Simple TOC for version sections
function VersionToc({ content }: { content: string }) {
  const headings = useMemo(() => getVersionTocItems(content), [content]);

  if (headings.length === 0) return null;

  return (
    <ul className="space-y-2 text-sm">
      {headings.map((heading) => (
        <li key={heading.id}>
          <button
            type="button"
            onClick={() => scrollToAnchor(heading.id)}
            className="text-left w-full py-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            {heading.text}
          </button>
        </li>
      ))}
    </ul>
  );
}
