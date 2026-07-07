import { motion } from 'framer-motion';
import {
  Layers,
  Zap,
  DollarSign,
  Shield,
  Settings,
  GitBranch,
  Star,
  Download,
  Trophy,
  TrendingUp,
  type LucideIcon
} from 'lucide-react';
import { useLanguage } from '@/i18n/useLanguage';
import { useGitHubStats } from '@/hooks/useGitHubStars';
import { useStarHistoryRank } from '@/hooks/useStarHistoryRank';
import { SectionHeader } from './SectionHeader';

const featureIcons: LucideIcon[] = [Layers, Zap, DollarSign, Shield, Settings, GitBranch];

const featureCardClass =
  'bg-gradient-to-br from-primary/5 to-accent-warm/5 dark:from-primary/10 dark:to-accent-warm/10';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0, 0, 0.2, 1] as const,
    },
  },
};

export function FeaturesSection() {
  const { t } = useLanguage();
  const { formattedStars, formattedDownloads } = useGitHubStats();
  const globalRank = useStarHistoryRank();

  return (
    <section id="features" className="section-y bg-background">
      <div className="container">
        <SectionHeader
          title={t.features.title}
          subtitle={t.features.subtitle}
          className="mb-12 md:mb-20"
          subtitleClassName="text-lg md:text-xl max-w-2xl mx-auto mb-8"
        >
          {/* Trust Bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            <div className="flex items-center gap-2 text-foreground">
              <Star className="w-5 h-5 text-warning" />
              <span className="font-semibold">{formattedStars}</span>
              <span className="text-muted-foreground">{t.hero.stars}</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Download className="w-5 h-5 text-primary" />
              <span className="font-semibold">{formattedDownloads}</span>
              <span className="text-muted-foreground">{t.hero.downloads}</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Layers className="w-5 h-5 text-success" />
              <span className="font-semibold">7</span>
              <span className="text-muted-foreground">{t.hero.supportedCli}</span>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-warm/10 border border-accent-warm/30 text-accent-warm text-sm font-medium">
              <Trophy className="w-4 h-4" />
              {t.hero.rustBadge}
            </span>
            {globalRank !== null && (
              <a
                href="https://www.star-history.com/#farion1231/cc-switch&Date"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-warm/10 border border-accent-warm/30 text-accent-warm text-sm font-medium transition-colors hover:bg-accent-warm/20"
              >
                <TrendingUp className="w-4 h-4" />
                {t.hero.starRankBadge.replace('{rank}', String(globalRank))}
              </a>
            )}
          </div>
        </SectionHeader>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {t.features.items.map((feature, index) => {
            const Icon = featureIcons[index];

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`group relative p-6 md:p-8 rounded-2xl ${featureCardClass} border border-border/50 hover:shadow-xl transition-all duration-300`}
              >
                {/* Icon */}
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary text-primary-foreground flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 md:w-7 md:h-7" />
                </div>

                {/* Title */}
                <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2 md:mb-3">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative Glow */}
                <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-primary/5 rounded-full blur-3xl -z-10 group-hover:scale-150 transition-transform duration-500" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
