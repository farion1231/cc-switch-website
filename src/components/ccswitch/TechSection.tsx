import { motion } from 'framer-motion';
import { Database, Code, TestTube } from 'lucide-react';
import { useLanguage } from '@/i18n/useLanguage';
import { MacOsWindowBar } from './MacOsWindowBar';

const techIcons = [Database, Code, TestTube];
const techColors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500'];

export function TechSection() {
  const { t } = useLanguage();

  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left: Code Example */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="min-w-0"
          >
            {/* Badge */}
            <div className="mb-6">
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {t.tech.badge}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-display-sm text-foreground mb-4 md:mb-6">
              {t.tech.title}
            </h2>

            {/* Description */}
            <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 leading-relaxed">
              {t.tech.description}
            </p>

            {/* Code Block - Always dark background */}
            <div className="max-w-full overflow-hidden rounded-xl bg-[#1a1a1a]">
              <MacOsWindowBar size="sm" className="px-4 py-3 bg-[#252525] border-b border-white/10">
                <span className="text-xs text-white/50 ml-2">~/.claude/settings.json</span>
              </MacOsWindowBar>
              <pre className="p-4 md:p-6 overflow-x-auto text-xs md:text-sm">
                <code className="text-green-400 font-mono">
                  {`{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "PROXY_MANAGED",
    "ANTHROPIC_BASE_URL": "http://127.0.0.1:15721"
  }
}`}
                </code>
              </pre>
            </div>
          </motion.div>

          {/* Right: Feature List */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="min-w-0 space-y-6 md:space-y-8"
          >
            {t.tech.features.map((feature, index) => {
              const Icon = techIcons[index];
              const color = techColors[index];

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="flex gap-4"
                >
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${color} text-white flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
