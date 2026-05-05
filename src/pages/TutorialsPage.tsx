import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/i18n/useLanguage';
import { fadeInUpStaggerContainer } from '@/lib/motion';
import {
  tutorials,
  type Tutorial,
  type TutorialCategory,
  type TutorialSource,
} from '@/content/tutorials';
import { SiteFooter } from '@/components/ccswitch/SiteFooter';
import { TutorialsHero } from '@/components/tutorials/TutorialsHero';
import { TutorialFilters } from '@/components/tutorials/TutorialFilters';
import { TutorialCard } from '@/components/tutorials/TutorialCard';
import { TutorialsCTA } from '@/components/tutorials/TutorialsCTA';

const orderedCategories: TutorialCategory[] = [
  'getting-started',
  'practice',
  'integration',
  'troubleshooting',
  'video',
];

const orderedSources: TutorialSource[] = ['official', 'community'];

function sortTutorials(items: Tutorial[]): Tutorial[] {
  return [...items].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return b.date.localeCompare(a.date);
  });
}

export default function TutorialsPage() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<TutorialCategory | 'all'>('all');
  const [activeSource, setActiveSource] = useState<TutorialSource | 'all'>('all');

  const visibleTutorials = useMemo(() => {
    const filtered = tutorials.filter((tutorial) => {
      if (activeCategory !== 'all' && tutorial.category !== activeCategory) return false;
      if (activeSource !== 'all' && tutorial.source !== activeSource) return false;
      return true;
    });
    return sortTutorials(filtered);
  }, [activeCategory, activeSource]);

  const empty = t.tutorials.empty;

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-20 md:pt-24">
        <TutorialsHero />

        <section className="pb-8 pt-4 md:pb-12 md:pt-6">
          <div className="container">
            <div className="mx-auto max-w-6xl">
              <TutorialFilters
                categories={orderedCategories}
                sources={orderedSources}
                activeCategory={activeCategory}
                activeSource={activeSource}
                onCategoryChange={setActiveCategory}
                onSourceChange={setActiveSource}
              />

              {visibleTutorials.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center">
                  <h3 className="text-lg font-semibold text-foreground">{empty.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{empty.subtitle}</p>
                </div>
              ) : (
                <motion.div
                  variants={fadeInUpStaggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {visibleTutorials.map((tutorial) => (
                    <TutorialCard key={tutorial.slug} tutorial={tutorial} />
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </section>

        <TutorialsCTA />
      </main>
      <SiteFooter />
    </div>
  );
}
