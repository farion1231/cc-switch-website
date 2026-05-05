import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { useLanguage } from '@/i18n/useLanguage';
import { SPONSOR_CONTACT_URL } from '@/lib/seo';

export function TutorialsCTA() {
  const { t } = useLanguage();
  const copy = t.tutorials.cta;

  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-8 text-center md:p-10"
        >
          <h2 className="text-xl font-bold text-foreground sm:text-2xl md:text-3xl">
            {copy.title}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
            {copy.subtitle}
          </p>
          <a
            href={SPONSOR_CONTACT_URL}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Mail className="h-4 w-4" />
            {copy.action}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
