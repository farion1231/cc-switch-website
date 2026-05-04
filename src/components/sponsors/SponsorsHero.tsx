import { motion } from 'framer-motion';
import { Heart, Mail } from 'lucide-react';
import { useLanguage } from '@/i18n/useLanguage';
import { SPONSOR_CONTACT_EMAIL, SPONSOR_CONTACT_URL } from '@/lib/seo';

export function SponsorsHero() {
  const { t } = useLanguage();
  const copy = t.sponsorsPage.hero;

  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
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

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={SPONSOR_CONTACT_URL}
              className="hero-gradient inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md sm:w-auto md:text-base"
            >
              <Heart className="h-4 w-4" />
              {copy.becomeSponsor}
            </a>
            <a
              href={SPONSOR_CONTACT_URL}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-all hover:border-foreground/30 hover:bg-accent sm:w-auto md:text-base"
            >
              <Mail className="h-4 w-4" />
              {SPONSOR_CONTACT_EMAIL}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
