import { motion } from 'framer-motion';
import { useLanguage } from '@/i18n/useLanguage';
import { sponsorsByTier, type SponsorTier } from '@/content/sponsors';
import { fadeInUpStaggerContainer } from '@/lib/motion';
import { SponsorCard } from './SponsorCard';
import { SponsorFlagshipBanner } from './SponsorFlagshipBanner';

interface SponsorTierSectionProps {
  tier: SponsorTier;
}

const tierGridClass: Record<SponsorTier, string> = {
  flagship: 'flex flex-col gap-6 md:gap-8',
  gold: 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-6 lg:gap-7',
  standard: 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-5',
};

const tierMaxWidth: Record<SponsorTier, string> = {
  flagship: 'max-w-5xl',
  gold: 'max-w-5xl',
  standard: 'max-w-6xl',
};

export function SponsorTierSection({ tier }: SponsorTierSectionProps) {
  const { t } = useLanguage();
  const items = sponsorsByTier(tier);

  if (items.length === 0) return null;

  const copy = t.sponsorsPage.tiers[tier];

  return (
    <section className="py-8 md:py-12">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center md:mb-12"
        >
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
            {copy.title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
            {copy.subtitle}
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUpStaggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className={`mx-auto ${tierMaxWidth[tier]} ${tierGridClass[tier]}`}
        >
          {items.map((sponsor) =>
            tier === 'flagship' && sponsor.banner ? (
              <SponsorFlagshipBanner key={sponsor.id} sponsor={sponsor} />
            ) : (
              <SponsorCard key={sponsor.id} sponsor={sponsor} />
            ),
          )}
        </motion.div>
      </div>
    </section>
  );
}
