import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Layers, Plug } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n/useLanguage';
import { AppWindow, type DemoScene } from './demo/AppWindow';
import { SectionHeader } from './SectionHeader';

const tabIcons = {
  provider: Plug,
  proxy: Layers,
  stats: BarChart3,
};

export function DemoSection() {
  // The tabs jump to a scene; the window reports back where the visitor clicked to.
  const [activeTab, setActiveTab] = useState<DemoScene | null>('provider');
  const [request, setRequest] = useState<{ scene: DemoScene; nonce: number }>();
  const { t } = useLanguage();
  const showScene = (scene: DemoScene) => setRequest((current) => ({ scene, nonce: (current?.nonce ?? 0) + 1 }));
  const onSceneChange = useCallback((scene: DemoScene | null) => setActiveTab(scene), []);

  const tabs = [
    { id: 'provider', label: t.demo.tabs.provider, icon: tabIcons.provider },
    { id: 'proxy', label: t.demo.tabs.proxy, icon: tabIcons.proxy },
    { id: 'stats', label: t.demo.tabs.stats, icon: tabIcons.stats },
  ] satisfies Array<{ id: DemoScene; label: string; icon: typeof Layers }>;

  return (
    <section className="section-y bg-muted/30 overflow-hidden">
      <div className="container">
        <SectionHeader
          title={t.demo.title}
          subtitle={t.demo.subtitle}
          className="mb-8 sm:mb-10 md:mb-16"
        />

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
                onClick={() => showScene(tab.id)}
                aria-pressed={activeTab === tab.id}
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
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-blue-500/15 to-sky-500/10 opacity-50 blur-3xl sm:-inset-4" />

          <AppWindow
            request={request}
            onSceneChange={onSceneChange}
            className="relative h-[640px] rounded-xl border border-border shadow-2xl sm:rounded-2xl md:h-[650px]"
          />
        </motion.div>
      </div>
    </section>
  );
}
