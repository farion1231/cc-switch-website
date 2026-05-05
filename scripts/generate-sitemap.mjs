import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const siteUrl = (process.env.VITE_SITE_URL || 'https://ccswitch.io').replace(/\/+$/, '');

function resolveLastmod() {
  if (process.env.SITEMAP_LASTMOD) return process.env.SITEMAP_LASTMOD;
  try {
    const gitDate = execSync('git log -1 --format=%cs', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(gitDate)) return gitDate;
  } catch {
    // fall through to today's date
  }
  return new Date().toISOString().slice(0, 10);
}

const lastmod = resolveLastmod();
const languages = [
  { code: 'zh', hreflang: 'zh-CN' },
  { code: 'en', hreflang: 'en' },
  { code: 'ja', hreflang: 'ja' },
];

const docSections = [
  {
    id: 'getting-started',
    items: ['introduction', 'installation', 'interface', 'quickstart', 'settings'],
  },
  {
    id: 'providers',
    items: ['add', 'switch', 'edit', 'sort-duplicate', 'usage-query'],
  },
  {
    id: 'extensions',
    items: ['mcp', 'prompts', 'skills', 'sessions', 'workspace'],
  },
  {
    id: 'proxy',
    items: ['service', 'routing', 'failover', 'usage', 'model-test'],
  },
  {
    id: 'faq',
    items: ['config-files', 'questions', 'deeplink', 'env-conflict'],
  },
];

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function localizedPath(path, language) {
  return path === '/' ? `/${language}/` : `/${language}${path}`;
}

function absoluteUrl(path, language) {
  return `${siteUrl}${localizedPath(path, language)}`;
}

const routePaths = [
  '/',
  '/docs',
  '/changelog',
  '/tutorials',
  ...docSections.flatMap((section) => (
    section.items.map((item) => `/docs?section=${section.id}&item=${item}`)
  )),
];

// Tutorials: each in-site article gets a per-language entry only when the
// markdown file actually exists for that language. External-only tutorials
// (no markdown) are skipped — their card just links out.
function loadTutorialSlugsByLanguage() {
  const result = new Map();
  for (const language of languages) {
    try {
      const files = readdirSync(`public/docs/tutorials/${language.code}`);
      const slugs = files
        .filter((name) => name.endsWith('.md'))
        .map((name) => name.replace(/\.md$/, ''));
      result.set(language.code, new Set(slugs));
    } catch {
      result.set(language.code, new Set());
    }
  }
  return result;
}

const tutorialSlugsByLang = loadTutorialSlugsByLanguage();
const allTutorialSlugs = new Set();
for (const slugs of tutorialSlugsByLang.values()) {
  for (const slug of slugs) allTutorialSlugs.add(slug);
}

// Per-language changelog version paths. A version is only included for a
// language whose split index actually contains it — old versions sometimes
// aren't translated, and we don't want hreflang alternates pointing at 404s.
function loadChangelogVersionsByLanguage() {
  const result = new Map();
  for (const language of languages) {
    try {
      const raw = readFileSync(`public/docs/changelog/${language.code}/index.json`, 'utf8');
      const parsed = JSON.parse(raw);
      const versions = (parsed.versions ?? []).map((entry) => entry.version);
      result.set(language.code, new Set(versions));
    } catch {
      result.set(language.code, new Set());
    }
  }
  return result;
}

const changelogVersionsByLang = loadChangelogVersionsByLanguage();
const allChangelogVersions = new Set();
for (const versions of changelogVersionsByLang.values()) {
  for (const v of versions) allChangelogVersions.add(v);
}

const sharedUrls = routePaths.flatMap((path) => (
  languages.map((language) => ({
    path,
    language: language.code,
    alternates: languages.map((alt) => alt.code),
  }))
));

const changelogUrls = [];
for (const version of allChangelogVersions) {
  const supportedLangs = languages.filter((lang) => changelogVersionsByLang.get(lang.code)?.has(version));
  if (supportedLangs.length === 0) continue;
  for (const language of supportedLangs) {
    changelogUrls.push({
      path: `/changelog/${version}`,
      language: language.code,
      alternates: supportedLangs.map((lang) => lang.code),
    });
  }
}

const tutorialUrls = [];
for (const slug of allTutorialSlugs) {
  const supportedLangs = languages.filter((lang) => tutorialSlugsByLang.get(lang.code)?.has(slug));
  if (supportedLangs.length === 0) continue;
  for (const language of supportedLangs) {
    tutorialUrls.push({
      path: `/tutorials/${slug}`,
      language: language.code,
      alternates: supportedLangs.map((lang) => lang.code),
    });
  }
}

const urls = [...sharedUrls, ...changelogUrls, ...tutorialUrls];

function alternateLinks(alternates, path) {
  const tags = alternates.map((code) => {
    const lang = languages.find((l) => l.code === code);
    return `    <xhtml:link rel="alternate" hreflang="${lang.hreflang}" href="${escapeXml(absoluteUrl(path, code))}" />`;
  });
  if (alternates.includes('zh')) {
    tags.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(absoluteUrl(path, 'zh'))}" />`);
  }
  return tags.join('\n');
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(({ path, language, alternates }) => `  <url>
    <loc>${escapeXml(absoluteUrl(path, language))}</loc>
    <lastmod>${lastmod}</lastmod>
${alternateLinks(alternates, path)}
  </url>`).join('\n')}
</urlset>
`;

writeFileSync('public/sitemap.xml', xml);
