import { motion } from 'framer-motion';
import { ArrowUpRight, Clock, ExternalLink, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/i18n/useLanguage';
import { getLocalizedPath } from '@/i18n/routes';
import { fadeInUpItem } from '@/lib/motion';
import { cn } from '@/lib/utils';
import {
  isInSiteTutorial,
  tutorialAvailableInLanguage,
  type Tutorial,
} from '@/content/tutorials';

interface TutorialCardProps {
  tutorial: Tutorial;
}

const accentClass: Record<NonNullable<Tutorial['accent']>, string> = {
  blue: 'from-blue-500/20 to-blue-500/5 text-blue-500',
  purple: 'from-purple-500/20 to-purple-500/5 text-purple-500',
  amber: 'from-amber-500/20 to-amber-500/5 text-amber-500',
  emerald: 'from-emerald-500/20 to-emerald-500/5 text-emerald-500',
  rose: 'from-rose-500/20 to-rose-500/5 text-rose-500',
};

export function TutorialCard({ tutorial }: TutorialCardProps) {
  const { language, t } = useLanguage();
  const card = t.tutorials.card;
  const sourceLabel = t.tutorials.sources;
  const categoryLabel = t.tutorials.categories;

  const title = tutorial.title[language] ?? tutorial.title.en;
  const summary = tutorial.summary[language] ?? tutorial.summary.en;
  const isExternal = !isInSiteTutorial(tutorial);
  const available = tutorialAvailableInLanguage(tutorial, language);

  const accent = tutorial.accent ?? 'blue';
  const coverGradient = accentClass[accent];

  const innerContent = (
    <>
      {/* Cover */}
      <div
        className={cn(
          'relative flex h-32 shrink-0 items-center justify-center bg-gradient-to-br',
          coverGradient,
        )}
      >
        <span className="text-5xl">{tutorial.emoji ?? '📘'}</span>
        <div className="absolute left-3 top-3 flex items-center gap-1.5">
          <span
            className={cn(
              'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider',
              tutorial.source === 'official'
                ? 'border-primary/30 bg-primary/10 text-primary'
                : 'border-border bg-background/80 text-muted-foreground backdrop-blur',
            )}
          >
            {sourceLabel[tutorial.source]}
          </span>
          <span className="inline-flex items-center rounded-full border border-border bg-background/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground backdrop-blur">
            {categoryLabel[tutorial.category]}
          </span>
        </div>
        {isExternal && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-border bg-background/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground backdrop-blur">
            <ExternalLink className="h-3 w-3" />
            {card.external}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary md:text-lg">
          {title}
        </h3>

        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {summary}
        </p>

        {!available && !isExternal && (
          <span className="inline-flex w-fit items-center rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-400">
            {card.unavailable}
          </span>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 truncate">
            <User className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{tutorial.author.name}</span>
          </span>
          <span className="inline-flex shrink-0 items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {card.readMin.replace('{n}', String(tutorial.readMinutes))}
          </span>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <ArrowUpRight className="absolute right-5 top-[148px] h-4 w-4 -translate-y-2 text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:text-primary group-hover:opacity-100" />
    </>
  );

  const baseClass =
    'group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-xl';

  if (isExternal) {
    return (
      <motion.a
        href={tutorial.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        variants={fadeInUpItem}
        className={baseClass}
      >
        {innerContent}
      </motion.a>
    );
  }

  return (
    <motion.div variants={fadeInUpItem} className={baseClass}>
      <Link
        to={getLocalizedPath(`/tutorials/${tutorial.slug}`, language)}
        className="flex flex-1 flex-col"
        aria-label={title}
      >
        {innerContent}
      </Link>
    </motion.div>
  );
}
