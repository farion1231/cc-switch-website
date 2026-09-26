import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DocsSidebar } from '@/components/docs/DocsSidebar';
import { DocsMobileNav } from '@/components/docs/DocsMobileNav';
import { MarkdownRenderer } from '@/components/docs/MarkdownRenderer';
import { DocsSearch } from '@/components/docs/DocsSearch';
import { TableOfContents } from '@/components/docs/TableOfContents';
import { fetchDocContent, getDocSourcePath, normalizeAnchor } from '@/content/docs';
import { getDocSections } from '@/content/docs/navigation';
import { SiteFooter } from '@/components/ccswitch/SiteFooter';
import { ChevronLeft, ChevronRight, Edit, Clock, Search } from 'lucide-react';
import { useLanguage } from '@/i18n/useLanguage';

type FlattenedDocNavItem = {
  sectionId: string;
  itemId?: string;
  title: string;
};

export default function DocsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState(searchParams.get('section') || 'getting-started');
  const [activeItem, setActiveItem] = useState<string | undefined>(searchParams.get('item') || undefined);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  // Anchor from the incoming URL (cross-page manual links). Updating the query
  // below drops the hash, so remember it until the doc has rendered. GitHub-style
  // anchors typed or linked from outside are normalized to this site's heading ids.
  const pendingAnchorRef = useRef(normalizeAnchor(decodeURIComponent(window.location.hash.slice(1))));
  const { language, t } = useLanguage();
  const docSections = useMemo(() => getDocSections(t), [t]);

  useEffect(() => {
    if (activeSection === 'proxy' && activeItem === 'takeover') {
      setActiveItem('routing');
    }
  }, [activeSection, activeItem]);

  useEffect(() => {
    setIsLoading(true);
    fetchDocContent(language, activeSection, activeItem).then((newContent) => {
      setContent(newContent);
      setIsLoading(false);
    });

    // Update URL
    const params = new URLSearchParams();
    params.set('section', activeSection);
    if (activeItem) {
      params.set('item', activeItem);
    }
    setSearchParams(params, { replace: true });

    // Scroll to top
    window.scrollTo(0, 0);
  }, [language, activeSection, activeItem, setSearchParams]);

  // Jump instantly like native anchors; headings carry scroll-mt-24 for the fixed header.
  useEffect(() => {
    if (isLoading || !pendingAnchorRef.current) return;
    document.getElementById(pendingAnchorRef.current)?.scrollIntoView();
    pendingAnchorRef.current = '';
  }, [isLoading, content]);

  // Keyboard shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = useCallback((sectionId: string, itemId?: string) => {
    setActiveSection(sectionId);
    setActiveItem(itemId);
  }, []);

  const flattenedNav = useMemo<FlattenedDocNavItem[]>(() => (
    docSections.flatMap((section) => {
      const items: FlattenedDocNavItem[] = [{ sectionId: section.id, title: section.title }];
      section.items?.forEach((item) => {
        items.push({ sectionId: section.id, itemId: item.id, title: item.title });
      });
      return items;
    })
  ), [docSections]);

  const currentIndex = flattenedNav.findIndex(
    nav => nav.sectionId === activeSection && nav.itemId === activeItem
  );
  const prevNav = currentIndex > 0 ? flattenedNav[currentIndex - 1] : null;
  const nextNav = currentIndex < flattenedNav.length - 1 ? flattenedNav[currentIndex + 1] : null;
  const editPath = getDocSourcePath(language, activeSection, activeItem);

  return (
    <div className="min-h-screen bg-background">
      {/* Search Modal */}
      <DocsSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />
      
      <div className="pt-20 md:pt-24">
        <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-4">
          <div className="flex gap-8 py-4 sm:py-6">
            {/* Sidebar - Desktop */}
            <div className="hidden lg:block">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-full mb-4 flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors text-sm"
              >
                <Search className="w-4 h-4" />
                <span className="flex-1 text-left">{t.docs.search.trigger}</span>
                <kbd className="text-xs px-1.5 py-0.5 rounded bg-background border border-border">⌘K</kbd>
              </button>
              <DocsSidebar
                sections={docSections}
                activeSection={activeSection}
                activeItem={activeItem}
                onNavigate={handleNavigate}
              />
            </div>

            {/* Main Content */}
            <main className="min-w-0 flex-1">
              <motion.article
                key={`${language}-${activeSection}-${activeItem}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-none xl:max-w-3xl"
              >
                {/* Content */}
                <div className="pb-8">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <MarkdownRenderer content={content} />
                  )}
                </div>

                {/* Page Footer */}
                <div className="mt-8 border-t border-border pt-6">
                  <div className="mb-8 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      {editPath && (
                        <a
                          href={`https://github.com/farion1231/cc-switch/edit/main/${editPath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          {t.docs.footer.edit}
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {t.docs.footer.lastUpdated.replace('{date}', '2026-05-16')}
                    </div>
                  </div>

                  {/* Prev/Next Navigation */}
                  <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                    {prevNav ? (
                      <button
                        onClick={() => handleNavigate(prevNav.sectionId, prevNav.itemId)}
                        className="group flex flex-col items-start rounded-xl border border-border bg-card p-4 text-left transition-colors hover:bg-muted/50"
                      >
                        <span className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                          {t.docs.pagination.previous}
                        </span>
                        <span className="font-medium text-foreground break-words">{prevNav.title}</span>
                      </button>
                    ) : (
                      <div />
                    )}
                    
                    {nextNav ? (
                      <button
                        onClick={() => handleNavigate(nextNav.sectionId, nextNav.itemId)}
                        className="group flex flex-col items-start rounded-xl border border-border bg-card p-4 text-left transition-colors hover:bg-muted/50 sm:items-end sm:text-right"
                      >
                        <span className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                          {t.docs.pagination.next}
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <span className="font-medium text-foreground break-words">{nextNav.title}</span>
                      </button>
                    ) : (
                      <div />
                    )}
                  </div>
                </div>
              </motion.article>
            </main>

            {/* Table of Contents - Desktop */}
            <div className="hidden xl:block w-56 shrink-0">
              <div className="sticky top-36">
                <TableOfContents content={content} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <DocsMobileNav
        sections={docSections}
        activeSection={activeSection}
        activeItem={activeItem}
        onNavigate={handleNavigate}
      />

      <SiteFooter />
    </div>
  );
}
