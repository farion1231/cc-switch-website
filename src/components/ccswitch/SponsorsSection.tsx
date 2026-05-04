import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/i18n/useLanguage';
import { getLocalizedPath } from '@/i18n/routes';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SectionHeader } from './SectionHeader';

export function SponsorsSection() {
    const { language, t } = useLanguage();
    const copy = t.sponsorsPage.section;

    return (
        <section className="section-y bg-muted/30">
            <div className="container">
                <SectionHeader
                    title={copy.title}
                    subtitle={copy.subtitle}
                    titleClassName="mb-4"
                    subtitleClassName="mx-auto max-w-2xl text-base sm:text-lg"
                />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mt-8 flex justify-center md:mt-10"
                >
                    <Link
                        to={getLocalizedPath('/sponsors', language)}
                        className={cn(
                            buttonVariants({ variant: 'hero', shape: 'pill' }),
                            'gap-2 px-6 py-3 hover:shadow-md duration-300 group',
                        )}
                    >
                        <span>{copy.viewAll}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
