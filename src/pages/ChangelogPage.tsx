import { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { SiteNavbar } from '@/components/ccswitch/SiteNavbar';
import { SiteFooter } from '@/components/ccswitch/SiteFooter';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorBlock } from '@/components/ui/error-block';
import { VersionSidebar } from '@/components/changelog/VersionSidebar';
import { MobileVersionDrawer } from '@/components/changelog/MobileVersionDrawer';
import { VersionCard } from '@/components/changelog/VersionCard';
import { VersionToc } from '@/components/changelog/VersionToc';
import {
  type ChangelogIndex,
  parseSingleVersion,
} from '@/lib/changelog';
import { getLocalizedPath } from '@/i18n/routes';
import { useLanguage } from '@/i18n/useLanguage';

const indexCache = new Map<string, ChangelogIndex>();
const versionCache = new Map<string, string>();

export default function ChangelogPage() {
  const { language, t } = useLanguage();
  const { version: versionParam } = useParams<{ version?: string }>();
  const navigate = useNavigate();

  const [index, setIndex] = useState<ChangelogIndex | null>(() => indexCache.get(language) ?? null);
  const [indexError, setIndexError] = useState(false);
  const [versionMarkdown, setVersionMarkdown] = useState<string>('');
  const [isVersionLoading, setIsVersionLoading] = useState(false);
  const [versionError, setVersionError] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Load index for the current language.
  useEffect(() => {
    let isActive = true;
    const cached = indexCache.get(language);
    if (cached) {
      setIndex(cached);
      setIndexError(false);
      return;
    }

    setIndex(null);
    setIndexError(false);

    fetch(`/docs/changelog/${language}/index.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<ChangelogIndex>;
      })
      .then((data) => {
        if (!isActive) return;
        indexCache.set(language, data);
        setIndex(data);
      })
      .catch(() => {
        if (!isActive) return;
        setIndexError(true);
      });

    return () => {
      isActive = false;
    };
  }, [language]);

  // Legacy hash redirect: /changelog#version-3.14.0 -> /changelog/3.14.0
  useEffect(() => {
    if (versionParam) return;
    const hash = window.location.hash;
    const match = /^#version-(.+)$/.exec(hash);
    if (!match) return;
    navigate(getLocalizedPath(`/changelog/${match[1]}`, language), { replace: true });
  }, [versionParam, navigate, language]);

  // Load the requested version's markdown.
  useEffect(() => {
    if (!versionParam) return;

    let isActive = true;
    const cacheKey = `${language}/${versionParam}`;
    const cached = versionCache.get(cacheKey);
    if (cached) {
      setVersionMarkdown(cached);
      setIsVersionLoading(false);
      setVersionError(false);
      return;
    }

    setVersionMarkdown('');
    setIsVersionLoading(true);
    setVersionError(false);

    fetch(`/docs/changelog/${language}/${encodeURIComponent(versionParam)}.md`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((text) => {
        if (!isActive) return;
        versionCache.set(cacheKey, text);
        setVersionMarkdown(text);
        setIsVersionLoading(false);
      })
      .catch(() => {
        if (!isActive) return;
        setIsVersionLoading(false);
        setVersionError(true);
      });

    return () => {
      isActive = false;
    };
  }, [language, versionParam]);

  // Scroll to top when version changes.
  useEffect(() => {
    if (!versionParam) return;
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [versionParam]);

  const versions = useMemo(() => index?.versions ?? [], [index]);
  const activeEntry = useMemo(
    () => versions.find((v) => v.version === versionParam),
    [versions, versionParam],
  );
  const versionData = useMemo(
    () => (versionMarkdown ? parseSingleVersion(versionMarkdown) : null),
    [versionMarkdown],
  );

  // No /:version in URL → redirect to latest once index is ready.
  if (!versionParam && index && versions.length > 0) {
    return <Navigate to={getLocalizedPath(`/changelog/${versions[0].version}`, language)} replace />;
  }

  const handleVersionClick = (version: string) => {
    navigate(getLocalizedPath(`/changelog/${version}`, language));
    setIsMobileNavOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteNavbar />

      <main className="pt-20 md:pt-24">
        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {!index && !indexError ? (
            <LoadingSpinner />
          ) : indexError ? (
            <ErrorBlock title={t.changelog.error} description={t.changelog.description} />
          ) : (
            <div className="flex gap-8">
              <VersionSidebar
                versions={versions}
                activeVersion={versionParam}
                onSelect={handleVersionClick}
                versionsLabel={t.changelog.versions}
                betaLabel="beta"
              />

              <div className="flex-1 min-w-0">
                {isVersionLoading ? (
                  <LoadingSpinner />
                ) : versionError || !versionData ? (
                  <ErrorBlock title={t.changelog.error} description={t.changelog.description} />
                ) : (
                  <VersionCard entry={versionData} betaLabel={t.changelog.betaRelease} />
                )}
              </div>

              {activeEntry && versionData && (
                <aside className="hidden xl:block w-56 shrink-0">
                  <div className="sticky top-24">
                    <h4 className="font-semibold text-foreground mb-4 text-sm">
                      {t.changelog.inVersion.replace('{version}', activeEntry.version)}
                    </h4>
                    <VersionToc content={versionData.content} />
                  </div>
                </aside>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Mobile Navigation Button */}
      <button
        onClick={() => setIsMobileNavOpen(true)}
        className="fixed bottom-6 right-6 z-40 rounded-full bg-primary p-4 text-primary-foreground shadow-lg transition-colors hover:bg-primary/90 lg:hidden"
        aria-label={t.changelog.openVersions}
      >
        <Menu className="w-6 h-6" />
      </button>

      <MobileVersionDrawer
        open={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        versions={versions}
        activeVersion={versionParam}
        onSelect={handleVersionClick}
        versionsLabel={t.changelog.versions}
        closeLabel={t.changelog.closeVersions}
        betaLabel="beta"
      />

      <SiteFooter />
    </div>
  );
}
