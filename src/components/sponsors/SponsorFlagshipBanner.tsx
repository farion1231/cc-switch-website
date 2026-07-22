import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/i18n/useLanguage';
import {
  resolveLocalizedAsset,
  resolveSponsorName,
  resolveSponsorUrl,
  type Sponsor,
} from '@/content/sponsors';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SponsorPerkBadge } from './SponsorPerkBadge';

interface SponsorFlagshipBannerProps {
  sponsor: Sponsor;
}

export function SponsorFlagshipBanner({ sponsor }: SponsorFlagshipBannerProps) {
  const { language, t } = useLanguage();

  if (!sponsor.banner) return null;

  const tagline = sponsor.tagline[language];
  const description = sponsor.description[language];
  const perk = sponsor.perk?.[language];
  const bannerSrc = resolveLocalizedAsset(sponsor.banner, language);
  const name = resolveSponsorName(sponsor.name, language);
  const url = resolveSponsorUrl(sponsor.url, language);

  return (
    <motion.article
      id={sponsor.id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      className="group relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-border bg-card shadow-lg transition-all duration-300 hover:border-primary/50 hover:shadow-xl"
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${name} — ${tagline}`}
        className="block"
      >
        <div className="relative aspect-[4/1] w-full overflow-hidden bg-muted">
          <img
            src={bannerSrc}
            alt={`${name} banner`}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
            loading="eager"
            decoding="async"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card/40 to-transparent" />
        </div>

        <div className="space-y-4 p-6 sm:p-8 md:p-10">
          <h3 className="text-2xl font-bold text-foreground transition-colors group-hover:text-primary md:text-3xl">
            {name}
          </h3>

          <p className="text-sm font-medium text-primary md:text-base">{tagline}</p>

          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            {description}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {perk && <SponsorPerkBadge text={perk} size="md" />}
            <span
              className={cn(
                buttonVariants({ variant: 'hero', shape: 'pill' }),
                'ml-auto px-5 py-2.5 text-sm font-medium md:text-base',
              )}
            >
              {t.sponsorsPage.card.visitWithCoupon ?? t.sponsorsPage.card.visit}
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </a>
    </motion.article>
  );
}
