import { useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n/useLanguage';
import { getLocalizedPath } from '@/i18n/routes';
import ccSwitchLogo from '@/assets/cc-switch-logo.png';
import { AppWindow } from './demo/AppWindow';
import { useGitHubStats } from '@/hooks/useGitHubStars';

// The demo window is laid out at 1000×650 and scaled to fit its column, so it never runs off
// the edge on narrow screens; it stops growing at 0.92.
const WINDOW_WIDTH = 1000;
const WINDOW_HEIGHT = 650;
const MAX_SCALE = 0.92;

function AppPreview() {
  const frame = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.72);

  useLayoutEffect(() => {
    const element = frame.current;
    if (!element) return;
    const fit = () => setScale(Math.min(MAX_SCALE, element.clientWidth / WINDOW_WIDTH));
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={frame}
      className="relative w-full overflow-hidden"
      style={{ height: WINDOW_HEIGHT * scale, borderRadius: 24 * scale }}
    >
      <div className="origin-top-left" style={{ width: WINDOW_WIDTH, height: WINDOW_HEIGHT, transform: `scale(${scale})` }}>
        <AppWindow className="relative h-full w-full rounded-2xl border border-border shadow-2xl" />
      </div>
    </div>
  );
}

export function HeroSection() {
  const { version } = useGitHubStats();
  const { language, t } = useLanguage();

  return (
    <section className="relative flex items-start overflow-hidden pt-24 pb-16 sm:pt-28 sm:pb-20 xl:min-h-screen xl:items-center xl:pt-20 xl:pb-0">
      {/* Simple Background */}
      <div className="absolute inset-0 bg-background" />

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent dark:from-primary/10" />

      {/* Grid Pattern - more subtle */}
      <div className="absolute inset-0 bg-grid opacity-20 dark:opacity-10" />

      {/* Content */}
      <div className="relative z-10 container px-4 py-4 sm:py-6 md:py-12 max-w-[1600px] mx-auto">
        {/* Side by side from xl: the text column never gets narrower than its content, the window takes what is
            left. Below xl the window would shrink to a thumbnail beside the text, so it goes underneath instead. */}
        <div className="grid xl:grid-cols-[minmax(min-content,4fr)_minmax(0,7fr)] gap-6 lg:gap-12 xl:gap-4 items-center">
          {/* Left: Text Content */}
          <div className="text-center xl:text-left xl:pl-8 xl:pr-4 mx-auto xl:mx-0">
            {/* Upper Section: Badge + Title + Slogan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 sm:mb-8"
            >
              {/* Version Badge */}
              <div className="flex flex-wrap items-center justify-center xl:justify-start gap-2 mb-8 sm:mb-10">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-sm font-medium text-foreground dark:bg-primary/20 sm:px-4 sm:py-2 sm:text-base">
                  🎉 v{version || '...'} {t.hero.versionBadge}
                </span>
              </div>

              {/* Main Title with Logo */}
              <div className="flex items-center justify-center xl:justify-start gap-4 sm:gap-5 mb-6 sm:mb-8">
                <img src={ccSwitchLogo} alt="CC Switch" className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16" />
                <h1 className="whitespace-nowrap text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground">CC Switch</h1>
              </div>

              {/* Slogan */}
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-muted-foreground font-medium">
                {t.hero.slogan}
              </p>
            </motion.div>

            {/* Spacer between upper and lower sections */}
            <div className="h-14 sm:h-20 md:h-32 xl:h-44" />

            {/* Lower Section: CTA + Platforms */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center xl:justify-start max-w-3xl mx-auto xl:mx-0">
                <Link to={getLocalizedPath('/download', language)} className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="hero"
                    className="w-full sm:w-auto border border-transparent shadow-xl hover:shadow-2xl hover:scale-105 px-6 md:px-10 py-6 md:py-7 text-base sm:text-lg md:text-xl font-semibold"
                  >
                    <Download className="w-5 h-5" />
                    {t.hero.downloadBtn}
                  </Button>
                </Link>
                <Link to={getLocalizedPath('/docs', language)} className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-border bg-background/50 backdrop-blur-sm hover:bg-accent px-6 md:px-10 py-6 md:py-7 text-base sm:text-lg md:text-xl font-semibold gap-2"
                  >
                    {t.hero.docsBtn}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>

              {/* Supported Platforms */}
              <p className="mt-4 text-sm text-muted-foreground text-center xl:text-left">
                {t.hero.platforms}
              </p>
            </motion.div>
          </div>

          {/* Right: App Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            // Side by side, the same inset as the text column: the window sits as far from the right edge as the text from the left.
            className="hidden min-w-0 lg:flex justify-center xl:justify-end xl:pr-8"
          >
            <div className="relative w-full max-w-[920px]">
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
