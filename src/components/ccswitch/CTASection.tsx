import { motion } from 'framer-motion';
import { Download, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n/useLanguage';
import { getLocalizedPath } from '@/i18n/routes';

export function CTASection() {
  const { language, t } = useLanguage();

  return (
    <section className="section-y relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 hero-gradient" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid opacity-10" />
      
      {/* Floating Orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-1/4 top-1/4 hidden h-64 w-64 rounded-full bg-white/20 blur-3xl sm:block"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-1/4 right-1/4 hidden h-64 w-64 rounded-full bg-white/20 blur-3xl sm:block"
      />

      {/* Content */}
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
            {t.cta.title}
            <br className="hidden sm:block" />
            {t.cta.titleLine2}
          </h2>

          {/* Subtitle */}
          <p className="mx-auto mb-8 max-w-2xl text-base text-white/80 sm:text-lg md:mb-10 md:text-xl">
            {t.cta.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            <Link to={getLocalizedPath('/download', language)} className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full gap-2 border-2 border-transparent bg-white px-8 py-6 text-base font-semibold text-primary shadow-xl transition-all hover:scale-105 hover:bg-white/90 hover:shadow-2xl sm:w-auto sm:text-lg"
              >
                <Download className="w-5 h-5" />
                {t.cta.downloadBtn}
              </Button>
            </Link>
            <a href="https://github.com/farion1231/cc-switch" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full gap-2 border-2 border-white/30 bg-transparent px-8 py-6 text-base font-semibold text-white hover:bg-white/10 sm:w-auto sm:text-lg"
              >
                {t.cta.githubBtn}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </a>
          </div>

          {/* Platforms */}
          <p className="mt-8 text-white/60 text-sm">
            {t.cta.platforms}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
