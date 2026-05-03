import { motion } from 'framer-motion';
import { Download, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n/useLanguage';
import { getLocalizedPath } from '@/i18n/routes';
import ccSwitchLogo from '@/assets/cc-switch-logo.png';
import { ProviderContent } from './demo/ProviderDemo';
import { useGitHubStats } from '@/hooks/useGitHubStars';

function AppPreview() {
  return (
    <div className="relative h-[468px] w-[720px] xl:h-[546px] xl:w-[840px] 2xl:h-[598px] 2xl:w-[920px]">
      <div className="relative flex h-[650px] w-[1000px] origin-top-left scale-[0.72] xl:scale-[0.84] 2xl:scale-[0.92] flex-col bg-card/95 backdrop-blur-2xl rounded-2xl border border-border/50 shadow-2xl overflow-hidden">
        {/* macOS Window Bar */}
        <div className="flex h-11 shrink-0 items-center gap-2 px-4 bg-muted/50 border-b border-border">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden">
          <ProviderContent />
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  const { version } = useGitHubStats();
  const { language, t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-12 lg:pb-0">
      {/* Simple Background */}
      <div className="absolute inset-0 bg-background" />

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent dark:from-primary/10" />

      {/* Grid Pattern - more subtle */}
      <div className="absolute inset-0 bg-grid opacity-20 dark:opacity-10" />

      {/* Content */}
      <div className="relative z-10 container px-4 py-8 md:py-12 max-w-[1600px] mx-auto">
        <div className="grid lg:grid-cols-[5fr,7fr] gap-6 lg:gap-4 items-center">
          {/* Left: Text Content */}
          <div className="text-center lg:text-left lg:pl-4 xl:pl-8 lg:pr-4 mx-auto lg:mx-0">
            {/* Upper Section: Badge + Title + Slogan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              {/* Version Badge */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-10">
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 text-foreground text-base font-medium">
                  🎉 v{version || '...'} {t.hero.versionBadge}
                </span>
              </div>

              {/* Main Title with Logo */}
              <div className="flex items-center justify-center lg:justify-start gap-5 mb-8">
                <img src={ccSwitchLogo} alt="CC Switch" className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16" />
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground">CC Switch</h1>
              </div>

              {/* Slogan */}
              <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl text-muted-foreground font-medium">
                {t.hero.slogan}
              </p>
            </motion.div>

            {/* Spacer between upper and lower sections */}
            <div className="h-32 md:h-44" />

            {/* Lower Section: CTA + Platforms */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start max-w-3xl mx-auto lg:mx-0">
                <a href="https://github.com/farion1231/cc-switch/releases" target="_blank" rel="noopener noreferrer">
                  <Button
                    size="lg"
                    className="hero-gradient text-white hover:opacity-90 shadow-xl hover:shadow-2xl hover:scale-105 transition-all px-8 md:px-10 py-6 md:py-7 text-lg md:text-xl font-semibold gap-2"
                  >
                    <Download className="w-5 h-5" />
                    {t.hero.downloadBtn}
                  </Button>
                </a>
                <Link to={getLocalizedPath('/docs', language)}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-border bg-background/50 backdrop-blur-sm hover:bg-accent px-8 md:px-10 py-6 md:py-7 text-lg md:text-xl font-semibold gap-2"
                  >
                    {t.hero.docsBtn}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>

              {/* Supported Platforms */}
              <p className="mt-4 text-sm text-muted-foreground text-center lg:text-left">
                {t.hero.platforms}
              </p>
            </motion.div>
          </div>

          {/* Right: App Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:flex justify-end"
          >
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute -inset-10 bg-gradient-to-br from-primary/20 to-purple/20 rounded-3xl blur-2xl" />

              <AppPreview />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
