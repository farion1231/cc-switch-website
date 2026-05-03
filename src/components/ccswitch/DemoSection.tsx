import { lazy, Suspense, useState, type ComponentType } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3, Layers, Server } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n/useLanguage';
import { ProviderContent } from './demo/ProviderDemo';
import { ProxyContent } from './demo/ProxyDemo';

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
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-display-md text-foreground mb-4 md:mb-6">
            {t.demo.title}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
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
          <div className="inline-flex gap-1 md:gap-2 p-1.5 md:p-2 rounded-xl bg-card border border-border">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-all text-sm md:text-base',
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
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple/20 rounded-3xl blur-3xl opacity-50" />

          <div className="relative flex h-[650px] flex-col bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
            <div className="flex h-11 shrink-0 items-center gap-2 px-4 bg-muted/50 border-b border-border">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
            </div>

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
