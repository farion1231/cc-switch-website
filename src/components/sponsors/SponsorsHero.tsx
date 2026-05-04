import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useLanguage } from '@/i18n/useLanguage';

export function SponsorsHero() {
  const { t } = useLanguage();
  const copy = t.sponsorsPage.hero;

  return (
    <section className="relative overflow-hidden pt-6 pb-4 md:pt-10 md:pb-6">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-primary/[0.07] via-transparent to-transparent" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary md:text-sm">
            <Heart className="h-3.5 w-3.5" />
            {copy.badge}
          </span>

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
            {copy.title}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {copy.subtitle}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
