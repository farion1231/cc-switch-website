import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { getDocSections } from '@/content/docs/navigation';
import { getLocalizedPath, stripLanguageFromPathname, SUPPORTED_LANGUAGES } from '@/i18n/routes';
import { useLanguage } from '@/i18n/useLanguage';
import {
  absoluteUrl,
  GITHUB_REPO_URL,
  htmlLang,
  hreflang,
  OG_IMAGE_PATH,
  ogLocale,
  RELEASES_URL,
  seoCopy,
  SITE_NAME,
  SITE_URL,
} from '@/lib/seo';
import type { Language } from '@/i18n/translations';

const JSON_LD_ID = 'cc-switch-jsonld';
const INDEXABLE_PATHS = new Set(['/', '/docs', '/changelog', '/sponsors']);

type RouteKey = 'home' | 'docs' | 'changelog' | 'sponsors' | 'notFound';

function upsertMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.content = content;
}

function upsertLink(rel: string, href: string) {
  let element = document.head.querySelector(`link[rel="${rel}"]:not([hreflang])`) as HTMLLinkElement | null;

  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }

  element.href = href;
}

function setAlternateLinks(basePath: string, search: string) {
  document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((element) => element.remove());

  SUPPORTED_LANGUAGES.forEach((language) => {
    const element = document.createElement('link');
    element.rel = 'alternate';
    element.hreflang = hreflang[language];
    element.href = absoluteUrl(`${getLocalizedPath(basePath, language)}${search}`);
    document.head.appendChild(element);
  });

  const defaultElement = document.createElement('link');
  defaultElement.rel = 'alternate';
  defaultElement.hreflang = 'x-default';
  defaultElement.href = absoluteUrl(`${getLocalizedPath(basePath, 'zh')}${search}`);
  document.head.appendChild(defaultElement);
}

function setOgLocaleAlternates(language: Language) {
  document.head.querySelectorAll('meta[property="og:locale:alternate"]').forEach((element) => element.remove());

  SUPPORTED_LANGUAGES.filter((nextLanguage) => nextLanguage !== language).forEach((nextLanguage) => {
    const element = document.createElement('meta');
    element.setAttribute('property', 'og:locale:alternate');
    element.content = ogLocale[nextLanguage];
    document.head.appendChild(element);
  });
}

function upsertJsonLd(jsonLd: unknown) {
  let element = document.getElementById(JSON_LD_ID) as HTMLScriptElement | null;

  if (!element) {
    element = document.createElement('script');
    element.id = JSON_LD_ID;
    element.type = 'application/ld+json';
    document.head.appendChild(element);
  }

  element.textContent = JSON.stringify(jsonLd);
}

function getRouteKey(basePath: string): RouteKey {
  if (basePath === '/') return 'home';
  if (basePath === '/docs') return 'docs';
  if (basePath === '/changelog') return 'changelog';
  if (basePath === '/sponsors') return 'sponsors';
  return 'notFound';
}

function getNormalizedSearch(basePath: string, search: string) {
  if (basePath !== '/docs') return '';

  const currentParams = new URLSearchParams(search);
  const section = currentParams.get('section');
  const item = currentParams.get('item');

  if (!section) return '';

  const normalizedParams = new URLSearchParams();
  normalizedParams.set('section', section);

  if (item) {
    normalizedParams.set('item', section === 'proxy' && item === 'takeover' ? 'routing' : item);
  }

  return `?${normalizedParams.toString()}`;
}

function getDocsTitle(language: Language, title: string, sectionTitle?: string) {
  if (!sectionTitle) return seoCopy[language].docs.title;
  const docsLabel = language === 'en' ? 'Docs' : language === 'ja' ? 'ドキュメント' : '文档';
  const prefix = title === sectionTitle ? title : `${title} - ${sectionTitle}`;
  return `${prefix} - ${SITE_NAME} ${docsLabel}`;
}

function getBreadcrumbGraph(routeKey: RouteKey, canonicalUrl: string, language: Language, pageTitle: string) {
  const homeUrl = absoluteUrl(getLocalizedPath('/', language));

  if (routeKey === 'home' || routeKey === 'notFound') return null;

  return {
    '@type': 'BreadcrumbList',
    '@id': `${canonicalUrl}#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: SITE_NAME,
        item: homeUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: pageTitle,
        item: canonicalUrl,
      },
    ],
  };
}

function getJsonLd(routeKey: RouteKey, canonicalUrl: string, language: Language, title: string, description: string, faqItems: readonly { question: string; answer: string }[]) {
  const organizationId = `${SITE_URL}/#organization`;
  const websiteId = `${SITE_URL}/#website`;
  const graph: unknown[] = [
    {
      '@type': 'Organization',
      '@id': organizationId,
      name: SITE_NAME,
      url: SITE_URL,
      logo: absoluteUrl('/favicon.png'),
      sameAs: [GITHUB_REPO_URL],
      description: seoCopy.en.home.description,
    },
    {
      '@type': 'WebSite',
      '@id': websiteId,
      url: SITE_URL,
      name: SITE_NAME,
      inLanguage: htmlLang[language],
      publisher: {
        '@id': organizationId,
      },
    },
    {
      '@type': routeKey === 'changelog' ? 'CollectionPage' : 'WebPage',
      '@id': `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: title,
      description,
      inLanguage: htmlLang[language],
      isPartOf: {
        '@id': websiteId,
      },
      publisher: {
        '@id': organizationId,
      },
    },
  ];

  const breadcrumb = getBreadcrumbGraph(routeKey, canonicalUrl, language, title);
  if (breadcrumb) graph.push(breadcrumb);

  if (routeKey === 'home') {
    graph.push(
      {
        '@type': 'SoftwareApplication',
        '@id': `${SITE_URL}/#software`,
        name: SITE_NAME,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'macOS, Windows, Linux',
        url: canonicalUrl,
        image: absoluteUrl(OG_IMAGE_PATH),
        description,
        downloadUrl: RELEASES_URL,
        codeRepository: GITHUB_REPO_URL,
        license: 'https://opensource.org/license/mit',
        isAccessibleForFree: true,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        publisher: {
          '@id': organizationId,
        },
        sameAs: [GITHUB_REPO_URL],
      },
      {
        '@type': 'FAQPage',
        '@id': `${canonicalUrl}#faq`,
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
    );
  }

  if (routeKey === 'docs') {
    graph.push({
      '@type': 'TechArticle',
      '@id': `${canonicalUrl}#article`,
      headline: title,
      description,
      inLanguage: htmlLang[language],
      url: canonicalUrl,
      publisher: {
        '@id': organizationId,
      },
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

export function Seo() {
  const location = useLocation();
  const { language, t } = useLanguage();

  const seo = useMemo(() => {
    const basePath = stripLanguageFromPathname(location.pathname);
    const routeKey = getRouteKey(basePath);
    const normalizedSearch = getNormalizedSearch(basePath, location.search);
    const copy = seoCopy[language][routeKey];
    const docSections = routeKey === 'docs' ? getDocSections(t) : [];
    const searchParams = new URLSearchParams(normalizedSearch);
    const activeSection = searchParams.get('section') || 'getting-started';
    const activeItem = searchParams.get('item') || undefined;
    const section = docSections.find((item) => item.id === activeSection);
    const item = section?.items?.find((navItem) => navItem.id === activeItem);
    const docsTitle = item?.title || section?.title || t.docs.title;
    const title = routeKey === 'docs' ? getDocsTitle(language, docsTitle, section?.title) : copy.title;
    const description = routeKey === 'docs' && section
      ? `${docsTitle}: ${copy.description}`
      : copy.description;
    const canonicalUrl = absoluteUrl(`${getLocalizedPath(INDEXABLE_PATHS.has(basePath) ? basePath : '/', language)}${normalizedSearch}`);
    const robots = routeKey === 'notFound' ? 'noindex, nofollow' : 'index, follow, max-image-preview:large';

    return {
      routeKey,
      basePath: INDEXABLE_PATHS.has(basePath) ? basePath : '/',
      canonicalUrl,
      description,
      imageUrl: absoluteUrl(OG_IMAGE_PATH),
      keywords: copy.keywords,
      normalizedSearch,
      robots,
      title,
      jsonLd: getJsonLd(routeKey, canonicalUrl, language, title, description, t.faq.items),
    };
  }, [language, location.pathname, location.search, t]);

  useEffect(() => {
    document.title = seo.title;
    document.documentElement.lang = htmlLang[language];

    upsertMeta('name', 'description', seo.description);
    upsertMeta('name', 'robots', seo.robots);
    upsertMeta('name', 'googlebot', seo.robots);
    upsertMeta('name', 'application-name', SITE_NAME);
    upsertMeta('name', 'apple-mobile-web-app-title', SITE_NAME);

    if (seo.keywords) {
      upsertMeta('name', 'keywords', seo.keywords);
    }

    upsertMeta('property', 'og:title', seo.title);
    upsertMeta('property', 'og:description', seo.description);
    upsertMeta('property', 'og:type', seo.routeKey === 'home' ? 'website' : 'article');
    upsertMeta('property', 'og:url', seo.canonicalUrl);
    upsertMeta('property', 'og:image', seo.imageUrl);
    upsertMeta('property', 'og:image:width', '1200');
    upsertMeta('property', 'og:image:height', '630');
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:locale', ogLocale[language]);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', seo.title);
    upsertMeta('name', 'twitter:description', seo.description);
    upsertMeta('name', 'twitter:image', seo.imageUrl);

    upsertLink('canonical', seo.canonicalUrl);
    setAlternateLinks(seo.basePath, seo.normalizedSearch);
    setOgLocaleAlternates(language);
    upsertJsonLd(seo.jsonLd);
  }, [language, seo]);

  return null;
}
