// Sync one release from the main repo into the site:
//   node scripts/sync-release.mjs 3.20.5 [--repo ../cc-switch] [--check]
//
// For zh / en / ja this reads docs/release-notes/v<version>-<lang>.md from the
// main repo, rewrites it into a changelog entry (drops the title and the
// language switcher, demotes headings one level, points relative links at this
// site's routes) and upserts it into public/docs/changelog/<lang>.md. The raw
// release notes are mirrored to public/docs/release-notes/. The entry date comes
// from the main repo's CHANGELOG.md.
//
// A stable release newer than src/lib/seo.ts CC_SWITCH_VERSION bumps it. The
// per-version files and the sitemap are regenerated afterwards.
//
// --check writes nothing and only reports whether the existing entries match.

import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, posix, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LANGUAGES = ['zh', 'en', 'ja'];
const GITHUB_BLOB = 'https://github.com/farion1231/cc-switch/blob/main';

const args = process.argv.slice(2);
const version = args.find((arg) => /^\d+\.\d+\.\d+(-[\w.]+)?$/.test(arg));
const repoFlag = args.indexOf('--repo');
const repo = resolve(ROOT, repoFlag >= 0 ? args[repoFlag + 1] : '../cc-switch');
const checkOnly = args.includes('--check');

if (!version) {
  console.error('Usage: node scripts/sync-release.mjs <version> [--repo ../cc-switch] [--check]');
  process.exit(1);
}

// Same rule as normalizeAnchor in src/content/docs/index.ts: GitHub keeps
// repeated dashes and variation selectors that this site's heading ids drop.
function normalizeAnchor(hash) {
  return hash
    .replace(/[^\p{L}\p{N}-]/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function withAnchor(path, hash) {
  const anchor = hash ? normalizeAnchor(decodeURIComponent(hash)) : '';
  return anchor ? `${path}#${anchor}` : path;
}

// Manual file -> docs route, read from the site's own path map so the two
// cannot drift. The first non-default item for a file wins, as in index.ts.
function loadDocRoutes() {
  const source = readFileSync(join(ROOT, 'src/content/docs/index.ts'), 'utf8');
  const mapSource = source.slice(source.indexOf('const docPathMap'), source.indexOf('};', source.indexOf('const docPathMap')));
  const routes = new Map();
  let section = null;
  for (const line of mapSource.split('\n')) {
    const sectionMatch = /^ {2}'?([\w-]+)'?: \{$/.exec(line);
    if (sectionMatch) {
      section = sectionMatch[1];
      continue;
    }
    const itemMatch = /^ {4}'?([\w-]+)'?: '([^']+)',$/.exec(line);
    if (section && itemMatch && itemMatch[1] !== 'default' && !routes.has(itemMatch[2])) {
      routes.set(itemMatch[2], `section=${section}&item=${itemMatch[1]}`);
    }
  }
  return routes;
}

function rewriteLink(href, language, docRoutes) {
  if (/^[a-z]+:/i.test(href) || href.startsWith('/')) return href;
  const [path, hash = ''] = href.split('#');
  if (!path) return withAnchor('', hash);

  const manual = new RegExp(`^\\.\\./user-manual/${language}/(.+\\.md)$`).exec(path);
  if (manual) {
    const route = docRoutes.get(manual[1]);
    if (!route) throw new Error(`No docs route for user-manual/${language}/${manual[1]}`);
    return withAnchor(`/${language}/docs?${route}`, hash);
  }

  const releaseNotes = new RegExp(`^v(\\d+\\.\\d+\\.\\d+(?:-[\\w.]+)?)-${language}\\.md$`).exec(path);
  if (releaseNotes) return withAnchor(`/${language}/changelog/${releaseNotes[1]}`, hash);

  const guide = new RegExp(`^\\.\\./guides/(.+)-${language}\\.md$`).exec(path);
  if (guide) return withAnchor(`/${language}/tutorials/${guide[1]}`, hash);

  // Anything else in the main repo (README, CHANGELOG, other docs) opens on GitHub.
  const target = posix.normalize(posix.join('docs/release-notes', path));
  return `${GITHUB_BLOB}/${target}${hash ? `#${hash}` : ''}`;
}

function toChangelogEntry(markdown, language, date, docRoutes) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const out = [`## [${version}] - ${date}`, ''];
  let inSwitcher = false;
  let skipBlank = false;

  lines.forEach((line, index) => {
    if (skipBlank && line.trim() === '') return;
    skipBlank = false;
    if (index === 0 && line.startsWith('# ')) {
      skipBlank = true;
      return;
    }
    // The "**[English →](…) | [日本語版 →](…)**" line and the rule after it.
    if (line.startsWith('**[') && line.includes('→')) {
      inSwitcher = true;
      return;
    }
    if (inSwitcher) {
      if (line.trim() === '') return;
      inSwitcher = false;
      if (line.trim() === '---') {
        skipBlank = true;
        return;
      }
    }
    // GitHub-only HTML (`<p align="center"><img …></p>`) shows up as raw text here.
    const html = /^<p align="center"><img src="([^"]+)" alt="([^"]*)"[^>]*><\/p>$/.exec(line.trim());
    if (html) {
      out.push(`![${html[2].replace(/[[\]]/g, '\\$&')}](${html[1]})`);
      return;
    }
    const demoted = /^#{2,5} /.test(line) ? `#${line}` : line;
    out.push(demoted.replace(/\]\(([^)\s]+)\)/g, (_, href) => `](${rewriteLink(href, language, docRoutes)})`));
  });

  return `${out.join('\n').trimEnd()}\n`;
}

function compareVersions(left, right) {
  const parse = (value) => value.split(/[.-]/).map((part) => (/^\d+$/.test(part) ? Number(part) : part));
  const a = parse(left);
  const b = parse(right);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i] === b[i]) continue;
    if (a[i] === undefined) return 1; // 3.20.4 > 3.20.4-rc.1
    if (b[i] === undefined) return -1;
    if (typeof a[i] === 'number' && typeof b[i] === 'number') return a[i] - b[i];
    return String(a[i]).localeCompare(String(b[i]));
  }
  return 0;
}

// Replace the entry for this version, or insert it before the first older one.
function upsertEntry(changelog, entry) {
  const heading = /^## \[([^\]]+)\] - \d{4}-\d{2}-\d{2}$/gm;
  const entries = [...changelog.matchAll(heading)].map((match) => ({ version: match[1], index: match.index }));
  const existing = entries.findIndex((item) => item.version === version);

  if (existing >= 0) {
    const start = entries[existing].index;
    const end = entries[existing + 1]?.index ?? changelog.length;
    const tail = end < changelog.length ? '\n' : '';
    return { current: changelog.slice(start, end).trimEnd() + '\n', next: changelog.slice(0, start) + entry + tail + changelog.slice(end) };
  }

  const older = entries.find((item) => compareVersions(item.version, version) < 0);
  const at = older ? older.index : changelog.length;
  return { current: null, next: changelog.slice(0, at) + entry + '\n' + changelog.slice(at) };
}

function releaseDate() {
  const changelog = readFileSync(join(repo, 'CHANGELOG.md'), 'utf8');
  const escaped = version.replace(/\./g, '\\.');
  const match = new RegExp(`^## \\[${escaped}\\] - (\\d{4}-\\d{2}-\\d{2})`, 'm').exec(changelog);
  if (!match) throw new Error(`CHANGELOG.md in ${repo} has no "## [${version}] - YYYY-MM-DD" heading`);
  return match[1];
}

function bumpSeoVersion() {
  if (version.includes('-')) return;
  const seoPath = join(ROOT, 'src/lib/seo.ts');
  const seo = readFileSync(seoPath, 'utf8');
  const current = /CC_SWITCH_VERSION = '([^']+)'/.exec(seo)?.[1];
  if (!current || compareVersions(version, current) <= 0) return;
  writeFileSync(seoPath, seo.replace(`CC_SWITCH_VERSION = '${current}'`, `CC_SWITCH_VERSION = '${version}'`));
  console.log(`[sync-release] src/lib/seo.ts: CC_SWITCH_VERSION ${current} -> ${version}`);
}

const date = releaseDate();
const docRoutes = loadDocRoutes();
let mismatched = 0;

for (const language of LANGUAGES) {
  const notesPath = join(repo, 'docs/release-notes', `v${version}-${language}.md`);
  if (!existsSync(notesPath)) throw new Error(`Missing ${notesPath}`);

  const entry = toChangelogEntry(readFileSync(notesPath, 'utf8'), language, date, docRoutes);
  const changelogPath = join(ROOT, 'public/docs/changelog', `${language}.md`);
  const { current, next } = upsertEntry(readFileSync(changelogPath, 'utf8'), entry);

  if (checkOnly) {
    const same = current === entry;
    if (!same) mismatched++;
    console.log(`[sync-release] ${language}: ${current === null ? 'no entry yet' : same ? 'matches' : 'differs'}`);
    continue;
  }

  writeFileSync(changelogPath, next);
  copyFileSync(notesPath, join(ROOT, 'public/docs/release-notes', `v${version}-${language}.md`));
  console.log(`[sync-release] ${language}: ${current === null ? 'added' : 'updated'} ${version} (${date})`);
}

if (checkOnly) process.exit(mismatched ? 1 : 0);

bumpSeoVersion();
const today = new Date().toISOString().slice(0, 10);
execFileSync('node', ['scripts/split-changelog.mjs'], { cwd: ROOT, stdio: 'inherit' });
execFileSync('node', ['scripts/generate-sitemap.mjs'], { cwd: ROOT, stdio: 'inherit', env: { ...process.env, SITEMAP_LASTMOD: today } });
