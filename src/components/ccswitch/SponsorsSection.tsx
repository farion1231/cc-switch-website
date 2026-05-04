import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/i18n/useLanguage';
import { getLocalizedPath } from '@/i18n/routes';
import { featuredSponsors } from '@/content/sponsors';
import { fadeInUpStaggerContainer, fadeInUpItem } from '@/lib/motion';
import { displayDomain } from '@/lib/utils';
import { SPONSOR_CONTACT_URL } from '@/lib/seo';

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
                        <motion.a
                            key={sponsor.id}
                            href={sponsor.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            variants={fadeInUpItem}
                            className="group relative flex items-center gap-4 rounded-2xl p-5 sm:p-6 md:p-8
                                bg-card border border-border
                                hover:border-primary/50 hover:shadow-xl
                                transition-all duration-300"
                        >
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                                <img
                                    src={sponsor.icon}
                                    alt={sponsor.name}
                                    className="w-8 h-8 md:w-10 md:h-10"
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                                    {sponsor.name}
                                </h3>
                                <p className="text-sm md:text-base text-muted-foreground mt-1">
                                    {sponsor.tagline[language]}
                                </p>
                                <span className="mt-2 flex min-w-0 max-w-full items-center gap-1 text-sm text-primary group-hover:underline">
                                    <span className="min-w-0 flex-1 truncate">{displayDomain(sponsor.url)}</span>
                                    <svg className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </span>
                            </div>

                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </motion.a>
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
