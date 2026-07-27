import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, ArrowUpRight, Github, Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n/useLanguage';
import { useDownloadManifest } from '@/hooks/useDownloadManifest';
import { htmlLang, RELEASES_URL } from '@/lib/seo';
import {
  detectArch,
  detectPlatform,
  formatBytes,
  pickPrimaryFile,
  PLATFORM_NAMES,
  type DownloadArch,
  type DownloadFile,
  type DownloadKind,
  type DownloadManifest,
  type DownloadPlatform,
} from '@/lib/downloads';

const HOMEBREW_COMMAND = 'brew install --cask cc-switch';

const PLATFORM_ORDER: readonly DownloadPlatform[] = ['macos', 'windows', 'linux'];

// Row order per platform; the first kind is the recommended default.
const KIND_ORDER: Record<DownloadPlatform, readonly DownloadKind[]> = {
  macos: ['dmg', 'zip'],
  windows: ['msi', 'portable'],
  linux: ['appimage', 'deb', 'rpm'],
};

const ARCH_ORDER: readonly DownloadArch[] = ['universal', 'x64', 'arm64'];

const ARCH_LABELS: Record<DownloadArch, string> = {
  universal: 'Universal',
  x64: 'x64',
  arm64: 'ARM64',
};

function FallbackCard() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-xl rounded-xl border border-border bg-card p-8 text-center">
      <h2 className="mb-2 text-xl font-semibold text-foreground">{t.downloadPage.fallback.title}</h2>
      <p className="mb-6 text-sm text-muted-foreground">{t.downloadPage.fallback.note}</p>
      <a href={RELEASES_URL} target="_blank" rel="noopener noreferrer">
        <Button variant="hero" className="gap-2">
          <Github className="h-5 w-5" />
          {t.downloadPage.fallback.button}
        </Button>
      </a>
    </div>
  );
}

function PrimaryDownload({
  manifest,
  platform,
  arch,
}: {
  manifest: DownloadManifest;
  platform: DownloadPlatform;
  arch: Exclude<DownloadArch, 'universal'> | null;
}) {
  const { t } = useLanguage();
  const primary = pickPrimaryFile(manifest, platform, arch);

  if (!primary) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex flex-col items-center gap-4"
    >
      <a href={primary.url} className="w-full sm:w-auto">
        <Button
          size="lg"
          variant="hero"
          className="w-full gap-2 border border-transparent px-8 py-7 text-lg font-semibold shadow-xl transition-all hover:scale-105 hover:shadow-2xl sm:w-auto"
        >
          <Download className="h-5 w-5" />
          {t.downloadPage.downloadFor.replace('{platform}', PLATFORM_NAMES[platform])}
          <span className="font-normal opacity-80">· {formatBytes(primary.size)}</span>
        </Button>
      </a>

      {platform === 'macos' && (
        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
          <p>{t.downloadPage.universalNote}</p>
          <p className="flex flex-wrap items-center justify-center gap-2">
            {t.downloadPage.brewNote}
            <code className="rounded-md bg-muted px-2 py-1 font-mono text-xs text-foreground">{HOMEBREW_COMMAND}</code>
          </p>
        </div>
      )}
      {platform === 'windows' && (
        <p className="text-sm text-muted-foreground">{t.downloadPage.windowsArchHint}</p>
      )}

      <p className="text-xs text-muted-foreground/80">{t.downloadPage.otherPlatformsHint}</p>
    </motion.div>
  );
}

function AssetButton({ file }: { file: DownloadFile }) {
  return (
    <a href={file.url}>
      <Button variant="outline" size="sm" className="gap-1.5 font-mono text-xs">
        <Download className="h-3.5 w-3.5" />
        {ARCH_LABELS[file.arch]}
        <span className="text-muted-foreground">· {formatBytes(file.size)}</span>
      </Button>
    </a>
  );
}

function HashChip({ arch, sha256 }: { arch: DownloadArch; sha256: string }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard
      .writeText(sha256)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  };

  return (
    <button
      type="button"
      onClick={copy}
      title={sha256}
      aria-label={`${ARCH_LABELS[arch]}: ${t.downloadPage.copyHash}`}
      className="group inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 font-mono text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <span className="font-sans font-medium">{ARCH_LABELS[arch]}</span>
      <span>
        {sha256.slice(0, 10)}…{sha256.slice(-6)}
      </span>
      {copied ? (
        <>
          <Check className="h-3 w-3 text-primary" />
          <span className="font-sans text-primary">{t.downloadPage.hashCopied}</span>
        </>
      ) : (
        <Copy className="h-3 w-3 opacity-50 transition-opacity group-hover:opacity-100" />
      )}
    </button>
  );
}

function PlatformMatrix({ manifest, initialPlatform }: { manifest: DownloadManifest; initialPlatform: DownloadPlatform }) {
  const { t } = useLanguage();
  const [activePlatform, setActivePlatform] = useState<DownloadPlatform>(initialPlatform);

  const rows = useMemo(() => (
    KIND_ORDER[activePlatform]
      .map((kind) => ({
        kind,
        files: manifest.files
          .filter((file) => file.platform === activePlatform && file.kind === kind)
          .sort((a, b) => ARCH_ORDER.indexOf(a.arch) - ARCH_ORDER.indexOf(b.arch)),
      }))
      .filter((row) => row.files.length > 0)
  ), [manifest, activePlatform]);

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-6 text-center text-2xl font-bold text-foreground">{t.downloadPage.allPlatforms}</h2>

      {/* Platform tabs */}
      <div className="mb-6 flex justify-center gap-2" role="tablist" aria-label={t.downloadPage.allPlatforms}>
        {PLATFORM_ORDER.map((platform) => (
          <button
            key={platform}
            role="tab"
            aria-selected={platform === activePlatform}
            onClick={() => setActivePlatform(platform)}
            className={cn(
              'rounded-lg px-5 py-2.5 text-sm font-medium transition-colors',
              platform === activePlatform
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            {PLATFORM_NAMES[platform]}
          </button>
        ))}
      </div>

      {/* Asset rows */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {rows.map((row, index) => {
          const hashes = row.files.filter((file) => file.sha256);
          return (
            <div key={row.kind} className={cn(index > 0 && 'border-t border-border')}>
              <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="flex items-center gap-2 font-medium text-foreground">
                    {t.downloadPage.kinds[row.kind]}
                    {index === 0 && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {t.downloadPage.recommended}
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{t.downloadPage.kindNotes[row.kind]}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {row.files.map((file) => (
                    <AssetButton key={file.name} file={file} />
                  ))}
                </div>
              </div>
              {hashes.length > 0 && (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-5 pb-3.5 pt-0">
                  <span className="text-xs font-medium text-muted-foreground/70">SHA-256</span>
                  {hashes.map((file) => (
                    <HashChip key={file.name} arch={file.arch} sha256={file.sha256!} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {activePlatform === 'windows' && (
        <p className="mt-3 text-center text-sm text-muted-foreground">{t.downloadPage.windowsArchHint}</p>
      )}
      {activePlatform === 'macos' && (
        <p className="mt-3 text-center text-sm text-muted-foreground">{t.downloadPage.macNotarized}</p>
      )}
      {rows.some((row) => row.files.some((file) => file.sha256)) && (
        <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground/90">
          {t.downloadPage.verifyIntro}{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-foreground">
            {activePlatform === 'windows' ? 'certutil -hashfile <file> SHA256' : 'shasum -a 256 <file>'}
          </code>
          {t.downloadPage.verifyOutro}
        </p>
      )}
    </div>
  );
}

export function DownloadSection() {
  const { language, t } = useLanguage();
  const { manifest, loading } = useDownloadManifest();
  const [detectedPlatform] = useState(() => detectPlatform());
  const [detectedArch, setDetectedArch] = useState<Exclude<DownloadArch, 'universal'> | null>(null);

  useEffect(() => {
    let cancelled = false;
    detectArch().then((arch) => {
      if (!cancelled) setDetectedArch(arch);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const pubDateLabel = useMemo(() => {
    if (!manifest) return null;
    const date = new Date(manifest.pubDate);
    if (Number.isNaN(date.getTime())) return null;
    return new Intl.DateTimeFormat(htmlLang[language], { dateStyle: 'medium' }).format(date);
  }, [manifest, language]);

  return (
    <section className="relative overflow-hidden pb-16 pt-10 sm:pb-20">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent dark:from-primary/10" />

      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h1 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
            {t.downloadPage.title}
          </h1>
          <p className="mx-auto mb-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            {t.downloadPage.subtitle}
          </p>
          {manifest && (
            <p className="text-sm text-muted-foreground">
              {t.downloadPage.latestVersion}{' '}
              <span className="font-semibold text-foreground">v{manifest.version}</span>
              {pubDateLabel && <> · {t.downloadPage.publishedOn} {pubDateLabel}</>}
            </p>
          )}
        </motion.div>

        {/* Primary download / loading / fallback */}
        <div className="mb-14">
          {loading && (
            <div className="text-center">
              <LoadingSpinner className="py-6" />
              <p className="text-sm text-muted-foreground">{t.downloadPage.loading}</p>
            </div>
          )}
          {!loading && !manifest && <FallbackCard />}
          {!loading && manifest && detectedPlatform && (
            <PrimaryDownload manifest={manifest} platform={detectedPlatform} arch={detectedArch} />
          )}
        </div>

        {/* Full platform matrix */}
        {manifest && <PlatformMatrix manifest={manifest} initialPlatform={detectedPlatform ?? 'windows'} />}

        {/* Previous versions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-14 max-w-3xl rounded-xl border border-border bg-card p-6 text-center"
        >
          <h2 className="mb-2 text-lg font-semibold text-foreground">{t.downloadPage.history.title}</h2>
          <p className="mb-4 text-sm text-muted-foreground">{t.downloadPage.history.note}</p>
          <a
            href={RELEASES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            {t.downloadPage.history.link}
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
