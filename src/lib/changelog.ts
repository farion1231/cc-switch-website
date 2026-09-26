import { extractHeadings } from './headings';

export interface ChangelogVersion {
  version: string;
  date: string;
  content: string;
  isPreRelease: boolean;
}

export interface ChangelogIndexEntry {
  version: string;
  date: string;
  isPreRelease: boolean;
  summary?: string;
}

export interface ChangelogIndex {
  versions: ChangelogIndexEntry[];
}

export interface ChangelogTocItem {
  text: string;
  id: string;
}

const sectionTitleExclusions = new Set([
  'added',
  'changed',
  'fixed',
  'removed',
  'deprecated',
  'security',
  'improved',
  'stats',
  'technical',
  'notes',
  'dependencies',
  'beta release',
  'stable release',
  'migration notes',
  'new features',
  'bug fixes',
  'improvements',
  'breaking changes',
  'reverted',
  'statistics',
  'strategic positioning',
]);

const VERSION_HEADING = /^## \[([^\]]+)\]\s*-\s*(\d{4}-\d{2}-\d{2})/m;

export function parseSingleVersion(markdown: string): ChangelogVersion | null {
  const match = markdown.match(VERSION_HEADING);
  if (!match) return null;
  const version = match[1];
  const date = match[2];
  return {
    version,
    date,
    content: markdown.trim(),
    isPreRelease: isPreRelease(version),
  };
}

export function isPreRelease(version: string): boolean {
  return version.includes('-') || version.includes('beta') || version.includes('alpha');
}

export function stripChangelogVersionHeading(content: string) {
  return content.replace(/^## \[[^\]]+\]\s*-\s*\d{4}-\d{2}-\d{2}\s*\n*/m, '');
}

// Ids come from the same content VersionCard renders, so repeated headings
// get the same -1, -2 suffixes as on the page.
export function getVersionTocItems(content: string): ChangelogTocItem[] {
  const items: ChangelogTocItem[] = [];

  for (const heading of extractHeadings(stripChangelogVersionHeading(content))) {
    if (heading.level !== 3) continue;
    const text = heading.text.replace(/^[\p{Extended_Pictographic}️\s]+/u, '');
    if (sectionTitleExclusions.has(text.toLowerCase())) continue;

    items.push({ text, id: heading.id });
  }

  return items;
}
