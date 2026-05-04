import { lazy, Suspense, useState, type ComponentType } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3, Layers, Server } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n/useLanguage';
import { ProviderContent } from './demo/ProviderDemo';
import { ProxyContent } from './demo/ProxyDemo';
import { MacOsWindowBar } from './MacOsWindowBar';

type DemoTabId = 'provider' | 'proxy' | 'stats';

const StatsContent = lazy(() => import('./demo/StatsDemo').then((module) => ({ default: module.StatsContent })));

const demoPanels: Record<DemoTabId, ComponentType> = {
  provider: ProviderContent,
  proxy: ProxyContent,
  stats: StatsContent,
};

const tabIcons = {
  provider: Layers,
  proxy: Server,
  stats: BarChart3,
};

export function DemoSection() {
  const [activeTab, setActiveTab] = useState<DemoTabId>('provider');
  const { t } = useLanguage();
  const ActivePanel = demoPanels[activeTab];

  const tabs = [
    { id: 'provider', label: t.demo.tabs.provider, icon: tabIcons.provider },
    { id: 'proxy', label: t.demo.tabs.proxy, icon: tabIcons.proxy },
    { id: 'stats', label: t.demo.tabs.stats, icon: tabIcons.stats },
  ] satisfies Array<{ id: DemoTabId; label: string; icon: typeof Layers }>;

  return (
    <section className="py-16 sm:py-20 md:py-32 bg-muted/30 overflow-hidden">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10 md:mb-16"
        >
          <h2 className="text-display-md text-foreground mb-4 md:mb-6">
            {t.demo.title}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
            {t.demo.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-6 md:mb-8"
        >
          <div className="inline-flex max-w-full gap-1 overflow-x-auto rounded-xl border border-border bg-card p-1.5 md:gap-2 md:p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all md:px-6 md:py-3 md:text-base',
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                )}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative mx-auto w-full max-w-[1000px]"
        >
          <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-primary/20 to-purple/20 rounded-3xl blur-3xl opacity-50" />

          <div className="relative flex h-[590px] sm:h-[620px] md:h-[650px] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl sm:rounded-2xl">
            <MacOsWindowBar
              responsive
              className="h-9 shrink-0 border-b border-border bg-muted/50 px-3 sm:h-11 sm:px-4"
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="min-h-0 flex-1 overflow-auto"
              >
                <Suspense fallback={<div className="flex h-full items-center justify-center text-sm text-muted-foreground" />}>
                  <ActivePanel />
                </Suspense>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
