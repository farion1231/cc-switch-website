import { writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const siteUrl = (process.env.VITE_SITE_URL || 'https://ccswitch.ai').replace(/\/+$/, '');

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
  ...docSections.flatMap((section) => (
    section.items.map((item) => `/docs?section=${section.id}&item=${item}`)
  )),
];

const urls = routePaths.flatMap((path) => (
  languages.map((language) => ({ path, language: language.code }))
));

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(({ path, language }) => `  <url>
    <loc>${escapeXml(absoluteUrl(path, language))}</loc>
    <lastmod>${lastmod}</lastmod>
${languages.map((alternate) => `    <xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${escapeXml(absoluteUrl(path, alternate.code))}" />`).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(absoluteUrl(path, 'zh'))}" />
  </url>`).join('\n')}
</urlset>
`;

writeFileSync('public/sitemap.xml', xml);
