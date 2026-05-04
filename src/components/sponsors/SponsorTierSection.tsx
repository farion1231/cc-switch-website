import { motion } from 'framer-motion';
import { useLanguage } from '@/i18n/useLanguage';
import { sponsorsByTier, type SponsorTier } from '@/content/sponsors';
import { fadeInUpStaggerContainer } from '@/lib/motion';
import { SponsorCard } from './SponsorCard';

interface SponsorTierSectionProps {
  tier: SponsorTier;
}

const tierGridClass: Record<SponsorTier, string> = {
  flagship: 'grid grid-cols-1 gap-6 md:gap-8',
  gold: 'grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8',
  supporter: 'grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-5',
};

const tierMaxWidth: Record<SponsorTier, string> = {
  flagship: 'max-w-4xl',
  gold: 'max-w-3xl',
  supporter: 'max-w-5xl',
};

export function SponsorTierSection({ tier }: SponsorTierSectionProps) {
  const { t } = useLanguage();
  const items = sponsorsByTier(tier);

  if (items.length === 0) return null;

  const copy = t.sponsorsPage.tiers[tier];

  return (
    <section className="py-12 md:py-16">
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
          {items.map((sponsor) => (
            <SponsorCard key={sponsor.id} sponsor={sponsor} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
