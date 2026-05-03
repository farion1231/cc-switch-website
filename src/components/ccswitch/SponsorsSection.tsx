import { motion } from 'framer-motion';
import { useLanguage } from '@/i18n/useLanguage';

// Import the same icons as ProviderCard
import packyCodeIcon from '@/assets/icons/packycode.svg';
import minimaxIcon from '@/assets/icons/minimax.svg';

// Only PackyAPI and MiniMax sponsors
const sponsors = [
    {
        name: 'PackyAPI',
        icon: packyCodeIcon,
        url: 'https://www.packyapi.com',
        description: 'AI API 聚合服务',
        descriptionEn: 'AI API Aggregation Service'
    },
    {
        name: 'MiniMax',
        icon: minimaxIcon,
        url: 'https://platform.minimaxi.com',
        description: 'AI 编程套餐平台',
        descriptionEn: 'AI Coding Plan Platform'
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0, 0, 0.2, 1] as const,
        },
    },
};

export function SponsorsSection() {
    const { language } = useLanguage();

    const title = language === 'zh' ? '感谢赞助商的支持' : 'Supported by the best';
    const subtitle = language === 'zh'
        ? 'CC Switch 得到了优秀合作伙伴的支持，让我们能够持续开发和维护这个项目。'
        : 'CC Switch is supported by amazing partners who make it possible to maintain this project.';

    return (
        <section className="py-20 md:py-32 bg-muted/30">
            <div className="container">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12 md:mb-16"
                >
                    <h2 className="text-display-md text-foreground mb-4">
                        {title}
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        {subtitle}
                    </p>
                </motion.div>

                {/* Sponsors Grid - 2 columns centered */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-3xl mx-auto"
                >
                    {sponsors.map((sponsor, index) => (
                        <motion.a
                            key={index}
                            href={sponsor.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            variants={itemVariants}
                            className="group relative flex items-center gap-4 p-6 md:p-8 rounded-2xl 
                                bg-card border border-border 
                                hover:border-emerald-500/50 hover:shadow-xl
                                transition-all duration-300"
                        >
                            {/* Logo */}
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                                <img
                                    src={sponsor.icon}
                                    alt={sponsor.name}
                                    className="w-8 h-8 md:w-10 md:h-10"
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-emerald-500 transition-colors">
                                    {sponsor.name}
                                </h3>
                                <p className="text-sm md:text-base text-muted-foreground mt-1">
                                    {language === 'zh' ? sponsor.description : sponsor.descriptionEn}
                                </p>
                                <span className="inline-flex items-center gap-1 text-emerald-500 text-sm mt-2 group-hover:underline">
                                    {sponsor.url.replace('https://', '').replace('www.', '')}
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </span>
                            </div>

                            {/* Hover Glow */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </motion.a>
                    ))}
                </motion.div>

                {/* Become a Sponsor Link */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-center mt-12 md:mt-16"
                >
                    <a
                        href="https://github.com/sponsors/farion1231"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full 
                            bg-card border border-border 
                            hover:border-primary/50 hover:bg-accent
                            text-foreground hover:text-primary 
                            transition-all duration-300 group"
                    >
                        <span className="text-primary">♥</span>
                        <span>{language === 'zh' ? '成为赞助商' : 'Become a sponsor'}</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
