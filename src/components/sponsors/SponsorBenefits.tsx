import { motion } from 'framer-motion';
import { Globe, Heart, LifeBuoy, Mail, Megaphone, Sparkles, Zap } from 'lucide-react';
import { useLanguage } from '@/i18n/useLanguage';
import { SPONSOR_CONTACT_EMAIL, SPONSOR_CONTACT_URL } from '@/lib/seo';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const PERK_ICONS = [Megaphone, Zap, Globe, LifeBuoy];

export function SponsorBenefits() {
  const { t } = useLanguage();
  const copy = t.sponsorsPage.benefits;

  return (
    <section className="relative overflow-hidden py-12 md:py-20">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-primary/[0.04] to-transparent" />

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary md:text-sm">
            <Sparkles className="h-3.5 w-3.5" />
            {copy.badge}
          </span>
          <h2 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
            {copy.title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
            {copy.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {copy.perks.map((perk, index) => {
            const Icon = PERK_ICONS[index] ?? Sparkles;
            return (
              <div
                key={index}
                className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-foreground md:text-lg">
                  {perk.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{perk.description}</p>
              </div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <a
            href={SPONSOR_CONTACT_URL}
            className={cn(
              buttonVariants({ variant: 'hero', shape: 'pill' }),
              'w-full px-6 py-3 text-sm font-medium shadow-sm hover:shadow-md sm:w-auto md:text-base',
            )}
          >
            <Heart className="h-4 w-4" />
            {copy.cta}
          </a>
          <a
            href={SPONSOR_CONTACT_URL}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-all hover:border-foreground/30 hover:bg-accent sm:w-auto md:text-base"
          >
            <Mail className="h-4 w-4" />
            {SPONSOR_CONTACT_EMAIL}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
