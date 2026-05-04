import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/i18n/useLanguage';
import { getLocalizedPath } from '@/i18n/routes';
import { featuredSponsors } from '@/content/sponsors';
import { fadeInUpStaggerContainer } from '@/lib/motion';
import { SPONSOR_CONTACT_URL } from '@/lib/seo';
import { SponsorCard } from '@/components/sponsors/SponsorCard';

export function SponsorsSection() {
    const { language, t } = useLanguage();
    const copy = t.sponsorsPage.section;

    if (featuredSponsors.length === 0) return null;

    return (
        <section className="bg-muted/30 py-16 sm:py-20 md:py-32">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12 md:mb-16"
                >
                    <h2 className="text-display-md text-foreground mb-4">
                        {copy.title}
                    </h2>
                    <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
                        {copy.subtitle}
                    </p>
                </motion.div>

                <motion.div
                    variants={fadeInUpStaggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-3xl mx-auto"
                >
                    {featuredSponsors.map((sponsor) => (
                        <SponsorCard key={sponsor.id} sponsor={sponsor} variant="gold" />
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-12 md:mt-16 flex flex-col sm:flex-row items-center justify-center gap-3"
                >
                    <Link
                        to={getLocalizedPath('/sponsors', language)}
                        className="hero-gradient inline-flex items-center gap-2 px-6 py-3 rounded-full
                            text-white
                            hover:opacity-90 hover:shadow-md
                            transition-all duration-300 group"
                    >
                        <span>{copy.viewAll}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <a
                        href={SPONSOR_CONTACT_URL}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full
                            bg-card border border-border
                            hover:border-primary/50 hover:bg-accent
                            text-foreground hover:text-primary
                            transition-all duration-300 group"
                    >
                        <span className="text-primary">♥</span>
                        <span>{copy.becomeSponsor}</span>
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
