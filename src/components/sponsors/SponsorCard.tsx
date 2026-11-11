import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/i18n/useLanguage';
import {
  resolveLocalizedAsset,
  resolveSponsorName,
  resolveSponsorUrl,
  type Sponsor,
  type SponsorTier,
} from '@/content/sponsors';
import { fadeInUpItem } from '@/lib/motion';
import { cn, displayDomain } from '@/lib/utils';
import { SponsorLogo } from './SponsorLogo';
import { SponsorPerkBadge } from './SponsorPerkBadge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface SponsorCardProps {
  sponsor: Sponsor;
  variant?: SponsorTier;
}

const lightLogoBg = 'bg-white p-1.5 dark:bg-white/95';
const darkLogoBg = 'bg-[#0b0b10] p-1.5';

export function SponsorCard({ sponsor, variant }: SponsorCardProps) {
  const { language, t } = useLanguage();
  const tagline = sponsor.tagline[language];
  const description = sponsor.description[language];
  const perk = sponsor.perk?.[language];
  const visitLabel = t.sponsorsPage.card.visit;
  const tier = variant ?? sponsor.tier;
  const iconSrc = resolveLocalizedAsset(sponsor.icon, language);
  const name = resolveSponsorName(sponsor.name, language);
  const url = resolveSponsorUrl(sponsor.url, language);
  const isLightLogo = sponsor.iconBg === 'light';
  const isDarkLogo = sponsor.iconBg === 'dark';
  const hasCustomBg = isLightLogo || isDarkLogo;
  const customBgClass = isLightLogo ? lightLogoBg : isDarkLogo ? darkLogoBg : '';
  // 自带底色的 tile 图标（如 hao.ai 的绿方块）铺满整框，不再缩小居中、
  // 也不再垫衬底色，否则会变成「框里嵌一块更小的方块」
  const isTileLogo = sponsor.iconTile === true;
  // tile 图标自身已带透明圆角，不叠衬底也不用容器裁角：容器圆角（8px）和
  // SVG 的圆角半径往往不一致，裁了反而在四角切出细缝
  const boxClass = isTileLogo
    ? ''
    : cn(
        hasCustomBg ? customBgClass : 'bg-primary/10',
        'group-hover:bg-primary/20',
      );
  const logoClass = isTileLogo
    ? 'h-full w-full object-cover'
    : hasCustomBg
      ? 'h-full w-full object-contain'
      : '';

  if (tier === 'flagship') {
    return (
      <motion.a
        id={sponsor.id}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        variants={fadeInUpItem}
        className="group relative flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-xl sm:p-8 md:flex-row md:items-start md:gap-8 md:p-10"
      >
        <div
          className={cn(
            'flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl transition-colors md:h-24 md:w-24',
            boxClass,
          )}
        >
          <SponsorLogo
            src={iconSrc}
            name={name}
            followsTheme={sponsor.iconFollowsTheme}
            className={cn(
              'h-12 w-12 md:h-14 md:w-14',
              logoClass,
            )}
            loading="eager"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="text-2xl font-bold text-foreground transition-colors group-hover:text-primary md:text-3xl">
              {name}
            </h3>
          </div>
          <p className="mt-1 text-sm font-medium text-primary md:text-base">{tagline}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            {description}
          </p>
          {perk && (
            <div className="mt-4">
              <SponsorPerkBadge text={perk} size="md" />
            </div>
          )}
          <span className="mt-4 inline-flex max-w-full items-center gap-1.5 text-sm text-primary group-hover:underline">
            <span className="truncate">
              {visitLabel} · {displayDomain(url)}
            </span>
            <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </motion.a>
    );
  }

  if (tier === 'gold') {
    return (
      <motion.a
        id={sponsor.id}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        variants={fadeInUpItem}
        className="group relative flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/50 hover:shadow-xl sm:p-6 md:p-7"
      >
        <div className="flex items-start gap-4">
          <div
            className={cn(
              'flex h-14 w-14 shrink-0 items-center justify-center rounded-xl transition-colors md:h-16 md:w-16',
              boxClass,
            )}
          >
            <SponsorLogo
              src={iconSrc}
              name={name}
              followsTheme={sponsor.iconFollowsTheme}
              className={cn('h-8 w-8 md:h-10 md:w-10', logoClass)}
              loading="lazy"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-bold text-foreground transition-colors group-hover:text-primary md:text-2xl">
              {name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground md:text-base">{tagline}</p>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {description}
        </p>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-2 pt-1">
          {perk && <SponsorPerkBadge text={perk} />}
          <span className="inline-flex min-w-0 items-center gap-1 text-sm text-primary group-hover:underline">
            <span className="min-w-0 max-w-[10rem] truncate sm:max-w-[14rem]">
              {displayDomain(url)}
            </span>
            <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </motion.a>
    );
  }

  return (
    <motion.a
      id={sponsor.id}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      variants={fadeInUpItem}
      className="group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:border-primary/50 hover:shadow-md"
    >
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <span className="absolute inset-0" />
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          collisionPadding={16}
          className="max-w-64 whitespace-normal break-words text-xs leading-relaxed"
        >
          {description}
        </TooltipContent>
      </Tooltip>
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors',
            boxClass,
          )}
        >
          <SponsorLogo
            src={iconSrc}
            name={name}
            followsTheme={sponsor.iconFollowsTheme}
            className={cn('h-6 w-6', logoClass)}
            loading="lazy"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary md:text-base">
            {name}
          </h3>
          <p className="truncate text-xs text-muted-foreground">{tagline}</p>
        </div>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>
      {perk && (
        <SponsorPerkBadge text={perk} className="self-start" />
      )}
    </motion.a>
  );
}
