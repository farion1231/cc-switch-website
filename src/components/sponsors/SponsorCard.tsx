import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/i18n/useLanguage';
import type { Sponsor, SponsorTier } from '@/content/sponsors';
import { fadeInUpItem } from '@/lib/motion';
import { displayDomain } from '@/lib/utils';

interface SponsorCardProps {
  sponsor: Sponsor;
  variant?: SponsorTier;
}

export function SponsorCard({ sponsor, variant }: SponsorCardProps) {
  const { language, t } = useLanguage();
  const tagline = sponsor.tagline[language];
  const description = sponsor.description[language];
  const visitLabel = t.sponsorsPage.card.visit;
  const sinceLabel = sponsor.since
    ? t.sponsorsPage.card.since.replace('{date}', sponsor.since)
    : null;
  const tier = variant ?? sponsor.tier;

  if (tier === 'flagship') {
    return (
      <motion.a
        id={sponsor.id}
        href={sponsor.url}
        target="_blank"
        rel="noopener noreferrer"
        variants={fadeInUpItem}
        className="group relative flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-xl sm:p-8 md:flex-row md:items-start md:gap-8 md:p-10"
      >
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary/10 transition-colors group-hover:bg-primary/20 md:h-24 md:w-24">
          <img src={sponsor.icon} alt={sponsor.name} className="h-12 w-12 md:h-14 md:w-14" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="text-2xl font-bold text-foreground transition-colors group-hover:text-primary md:text-3xl">
              {sponsor.name}
            </h3>
            {sinceLabel && (
              <span className="text-xs text-muted-foreground md:text-sm">{sinceLabel}</span>
            )}
          </div>
          <p className="mt-1 text-sm font-medium text-primary md:text-base">{tagline}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            {description}
          </p>
          <span className="mt-4 inline-flex max-w-full items-center gap-1.5 text-sm text-primary group-hover:underline">
            <span className="truncate">{visitLabel} · {displayDomain(sponsor.url)}</span>
            <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </motion.a>
    );
  }

  if (tier === 'gold') {
    return (
      <motion.a
        id={sponsor.id}
        href={sponsor.url}
        target="_blank"
        rel="noopener noreferrer"
        variants={fadeInUpItem}
        className="group relative flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/50 hover:shadow-xl sm:p-6 md:p-8"
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20 md:h-16 md:w-16">
          <img src={sponsor.icon} alt={sponsor.name} className="h-8 w-8 md:h-10 md:w-10" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-foreground transition-colors group-hover:text-primary md:text-2xl">
            {sponsor.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">{tagline}</p>
          <span className="mt-2 flex min-w-0 max-w-full items-center gap-1 text-sm text-primary group-hover:underline">
            <span className="min-w-0 flex-1 truncate">{displayDomain(sponsor.url)}</span>
            <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </motion.a>
    );
  }

  return (
    <motion.a
      id={sponsor.id}
      href={sponsor.url}
      target="_blank"
      rel="noopener noreferrer"
      variants={fadeInUpItem}
      className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-5 text-center transition-all duration-300 hover:border-primary/50 hover:shadow-md"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
        <img src={sponsor.icon} alt={sponsor.name} className="h-7 w-7" />
      </div>
      <div className="min-w-0">
        <h3 className="truncate text-base font-semibold text-foreground transition-colors group-hover:text-primary">
          {sponsor.name}
        </h3>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{tagline}</p>
      </div>
    </motion.a>
  );
}
