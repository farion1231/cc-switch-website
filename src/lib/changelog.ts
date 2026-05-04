import { slugify } from './utils';

export interface ChangelogVersion {
  version: string;
  date: string;
  content: string;
  isPreRelease: boolean;
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

export function parseChangelog(markdown: string): ChangelogVersion[] {
  const entries: ChangelogVersion[] = [];
  const versionRegex = /^## \[([^\]]+)\]\s*-\s*(\d{4}-\d{2}-\d{2})/gm;
  const parts = markdown.split(versionRegex);

  for (let i = 1; i < parts.length; i += 3) {
    const version = parts[i];
    const date = parts[i + 1];
    const content = parts[i + 2]?.trim() ?? '';

    if (version && date) {
      entries.push({
        version,
        date,
        content: `## [${version}] - ${date}\n\n${content}`,
        isPreRelease: version.includes('-') || version.includes('beta') || version.includes('alpha'),
      });
    }
  }

  return entries;
}

export function stripChangelogVersionHeading(content: string) {
  return content.replace(/^## \[[^\]]+\]\s*-\s*\d{4}-\d{2}-\d{2}\s*\n*/m, '');
}

export function getVersionTocItems(content: string): ChangelogTocItem[] {
  const regex = /^### (.+)$/gm;
  const items: ChangelogTocItem[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    const text = match[1].trim().replace(/^[\p{Extended_Pictographic}\uFE0F\s]+/u, '');
    const lowerText = text.toLowerCase();
    if (sectionTitleExclusions.has(lowerText)) continue;

    items.push({ text, id: slugify(text) });
  }

  return items;
}
