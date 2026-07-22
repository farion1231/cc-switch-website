import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Check, Copy, Sparkles } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { useLanguage } from '@/i18n/useLanguage';
import {
  resolveLocalizedAsset,
  resolveSponsorName,
  resolveSponsorUrl,
  sponsors,
} from '@/content/sponsors';
import { cn, displayDomain } from '@/lib/utils';

const lightLogoBg = 'bg-white dark:bg-white/95 p-1';
const darkLogoBg = 'bg-[#0b0b10] p-1';

function logoBgClass(iconBg?: 'light' | 'dark' | 'auto'): string {
  if (iconBg === 'light') return lightLogoBg;
  if (iconBg === 'dark') return darkLogoBg;
  return 'bg-primary/10';
}

export function SponsorPerksTable() {
  const { language, t } = useLanguage();
  const copy = t.sponsorsPage.perksTable;
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const items = sponsors.filter((sponsor) => sponsor.perk);
  if (items.length === 0) return null;

  async function handleCopy(code: string, id: string) {
    let copied = false;
    try {
      await navigator.clipboard.writeText(code);
      copied = true;
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = code;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        copied = document.execCommand('copy');
      } catch {
        copied = false;
      }
      document.body.removeChild(textarea);
    }

    if (copied) {
      setCopiedId(id);
      toast.success(t.sponsorsPage.card.copied);
      window.setTimeout(() => {
        setCopiedId((current) => (current === id ? null : current));
      }, 1500);
    }
  }

  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary md:text-sm">
            <Sparkles className="h-3.5 w-3.5" />
            {copy.badge}
          </span>
          <h2 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
            {copy.title}
          </h2>
          <p className="mx-auto mt-3 text-sm text-muted-foreground md:text-base">
            {copy.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
        >
          <div className="hidden md:block">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="w-[26%] px-5 py-3 font-semibold text-foreground">
                    {copy.headers.sponsor}
                  </th>
                  <th className="w-[40%] px-5 py-3 font-semibold text-foreground">
                    {copy.headers.perk}
                  </th>
                  <th className="w-[20%] px-5 py-3 font-semibold text-foreground">
                    {copy.headers.coupon}
                  </th>
                  <th className="w-[14%] px-5 py-3 text-right font-semibold text-foreground">
                    {copy.headers.link}
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((sponsor, index) => {
                  const perk = sponsor.perk![language];
                  const isCopied = copiedId === sponsor.id;
                  const iconSrc = resolveLocalizedAsset(sponsor.icon, language);
                  const name = resolveSponsorName(sponsor.name, language);
                  const url = resolveSponsorUrl(sponsor.url, language);

                  return (
                    <tr
                      key={sponsor.id}
                      className={cn(
                        'border-t border-border transition-colors hover:bg-muted/40',
                        index % 2 === 1 && 'bg-muted/10',
                      )}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg',
                              logoBgClass(sponsor.iconBg),
                            )}
                          >
                            <img
                              src={iconSrc}
                              alt={name}
                              className="h-full w-full object-contain"
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                          <span className="font-medium text-foreground">{name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">{perk}</td>
                      <td className="px-5 py-4">
                        {sponsor.couponCode ? (
                          <button
                            type="button"
                            onClick={() => handleCopy(sponsor.couponCode!, sponsor.id)}
                            className="group inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1 font-mono text-xs text-foreground transition-colors hover:border-primary/50 hover:text-primary"
                            aria-label={`${t.sponsorsPage.card.copyCoupon}: ${sponsor.couponCode}`}
                          >
                            <span>{sponsor.couponCode}</span>
                            {isCopied ? (
                              <Check className="h-3.5 w-3.5 text-primary" />
                            ) : (
                              <Copy className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-primary" />
                            )}
                          </button>
                        ) : (
                          <span className="text-xs text-muted-foreground/70">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          {copy.headers.link}
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <ul className="divide-y divide-border md:hidden">
            {items.map((sponsor) => {
              const perk = sponsor.perk![language];
              const isCopied = copiedId === sponsor.id;
              const iconSrc = resolveLocalizedAsset(sponsor.icon, language);
              const name = resolveSponsorName(sponsor.name, language);
              const url = resolveSponsorUrl(sponsor.url, language);

              return (
                <li key={sponsor.id} className="space-y-3 p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg',
                        logoBgClass(sponsor.iconBg),
                      )}
                    >
                      <img
                        src={iconSrc}
                        alt={name}
                        className="h-full w-full object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-foreground">{name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {displayDomain(url)}
                      </p>
                    </div>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-primary"
                      aria-label={copy.headers.link}
                    >
                      <ArrowUpRight className="h-5 w-5" />
                    </a>
                  </div>
                  <p className="text-sm text-muted-foreground">{perk}</p>
                  {sponsor.couponCode && (
                    <button
                      type="button"
                      onClick={() => handleCopy(sponsor.couponCode!, sponsor.id)}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1 font-mono text-xs text-foreground transition-colors hover:border-primary/50 hover:text-primary"
                      aria-label={`${t.sponsorsPage.card.copyCoupon}: ${sponsor.couponCode}`}
                    >
                      <span>{sponsor.couponCode}</span>
                      {isCopied ? (
                        <Check className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
