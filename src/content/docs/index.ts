import type { Language } from '@/i18n/translations';

// Documentation file path mapping
const docPathMap: Record<string, Record<string, string>> = {
  'getting-started': {
    default: '1-getting-started/1.1-introduction.md',
    introduction: '1-getting-started/1.1-introduction.md',
    installation: '1-getting-started/1.2-installation.md',
    interface: '1-getting-started/1.3-interface.md',
    quickstart: '1-getting-started/1.4-quickstart.md',
    settings: '1-getting-started/1.5-settings.md',
  },
  providers: {
    default: '2-providers/2.1-add.md',
    add: '2-providers/2.1-add.md',
    switch: '2-providers/2.2-switch.md',
    edit: '2-providers/2.3-edit.md',
    'sort-duplicate': '2-providers/2.4-sort-duplicate.md',
    'usage-query': '2-providers/2.5-usage-query.md',
    'claude-desktop': '2-providers/2.6-claude-desktop.md',
  },
  extensions: {
    default: '3-extensions/3.1-mcp.md',
    mcp: '3-extensions/3.1-mcp.md',
    prompts: '3-extensions/3.2-prompts.md',
    skills: '3-extensions/3.3-skills.md',
    sessions: '3-extensions/3.4-sessions.md',
    workspace: '3-extensions/3.5-workspace.md',
  },
  proxy: {
    default: '4-proxy/4.1-service.md',
    service: '4-proxy/4.1-service.md',
    routing: '4-proxy/4.2-routing.md',
    takeover: '4-proxy/4.2-routing.md',
    failover: '4-proxy/4.3-failover.md',
    usage: '4-proxy/4.4-usage.md',
    'model-test': '4-proxy/4.5-model-test.md',
    aggregation: '4-proxy/4.6-aggregation.md',
  },
  faq: {
    default: '5-faq/5.2-questions.md',
    'config-files': '5-faq/5.1-config-files.md',
    questions: '5-faq/5.2-questions.md',
    deeplink: '5-faq/5.3-deeplink.md',
    'env-conflict': '5-faq/5.4-env-conflict.md',
  },
};

// Cache for loaded documents
const docCache: Record<string, string> = {};

const docMessages: Record<Language, { notFound: string; loadFailed: string; loading: string }> = {
  zh: {
    notFound: '# 页面未找到\n\n请求的文档页面不存在。',
    loadFailed: '# 加载失败\n\n无法加载文档内容，请稍后重试。',
    loading: '# 加载中...\n\n正在加载文档内容...',
  },
  en: {
    notFound: '# Page Not Found\n\nThe requested documentation page does not exist.',
    loadFailed: '# Load Failed\n\nUnable to load the documentation. Please try again later.',
    loading: '# Loading...\n\nLoading documentation content...',
  },
  ja: {
    notFound: '# ページが見つかりません\n\n要求されたドキュメントページは存在しません。',
    loadFailed: '# 読み込み失敗\n\nドキュメントを読み込めませんでした。しばらくしてからもう一度お試しください。',
    loading: '# 読み込み中...\n\nドキュメントを読み込んでいます...',
  },
};

const docRouteByPath = new Map<string, { sectionId: string; itemId: string }>();

for (const [sectionId, items] of Object.entries(docPathMap)) {
  for (const [itemId, relativePath] of Object.entries(items)) {
    if (itemId === 'default' || docRouteByPath.has(relativePath)) continue;
    docRouteByPath.set(relativePath, { sectionId, itemId });
  }
}

function getDocRelativePath(sectionId: string, itemId?: string): string | null {
  const section = docPathMap[sectionId];
  if (!section) return null;

  if (itemId && section[itemId]) {
    return section[itemId];
  }

  return section.default || null;
}

export function getDocFilePath(language: Language, sectionId: string, itemId?: string): string | null {
  const relativePath = getDocRelativePath(sectionId, itemId);
  if (!relativePath) return null;

  return `/docs/${language}/${relativePath}`;
}

export function getDocSourcePath(language: Language, sectionId: string, itemId?: string): string | null {
  const relativePath = getDocRelativePath(sectionId, itemId);
  if (!relativePath) return null;

  return `docs/user-manual/${language}/${relativePath}`;
}

// The manual is written against GitHub's heading anchors, which keep repeated
// dashes and some symbols (`codex--grok-build-…`, `️-风险提示`). This site's
// slugify drops them, so rewrite every anchor into the site's form.
export function normalizeAnchor(hash: string): string {
  return hash
    .replace(/[^\p{L}\p{N}-]/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function withAnchor(path: string, hash: string) {
  const anchor = normalizeAnchor(hash);
  return anchor ? `${path}#${anchor}` : path;
}

function resolveDocLink(currentRelativePath: string, href: string) {
  const [rawPath, hash = ''] = href.split('#');
  const resolvedPath = new URL(rawPath, `https://ccswitch.local/${currentRelativePath}`).pathname.replace(/^\//, '');
  const route = docRouteByPath.get(resolvedPath);

  if (!route) return href;

  const query = `?section=${encodeURIComponent(route.sectionId)}&item=${encodeURIComponent(route.itemId)}`;
  return withAnchor(query, hash);
}

function processDocContent(content: string, currentRelativePath: string) {
  return content
    // Release screenshots live in the main repo's root assets/, like the changelog's.
    .replace(
      /!\[([^\]]*)\]\((?:\.\.\/){4}assets\/(release-notes\/[^)]+)\)/g,
      '![$1](https://raw.githubusercontent.com/farion1231/cc-switch/main/assets/$2)'
    )
    .replace(
      /!\[([^\]]*)\]\(\.\.\/(?:\.\.\/)?assets\/([^)]+)\)/g,
      '![$1](/docs/assets/$2)'
    )
    // Release notes render on the changelog pages, not as raw markdown.
    .replace(
      /\]\(\.\.\/\.\.\/\.\.\/release-notes\/v([\d.]+)-(zh|en|ja)\.md(?:#([^)]+))?\)/g,
      (_, version: string, lang: string, hash = '') => `](${withAnchor(`/${lang}/changelog/${version}`, hash)})`
    )
    .replace(
      /\]\(\.\.\/\.\.\/\.\.\/guides\/([a-z0-9-]+)-(zh|en|ja)\.md(?:#([^)]+))?\)/g,
      (_, slug: string, lang: string, hash = '') => `](${withAnchor(`/${lang}/tutorials/${slug}`, hash)})`
    )
    .replace(
      /\]\(((?!https?:\/\/|mailto:|#|\/|\?)[^)]+\.md(?:#[^)]+)?)\)/g,
      (_, href: string) => `](${resolveDocLink(currentRelativePath, href)})`
    )
    .replace(/\]\(#([^)]+)\)/g, (_, hash: string) => `](${withAnchor('', hash)})`);
}

export async function fetchDocContent(language: Language, sectionId: string, itemId?: string): Promise<string> {
  const filePath = getDocFilePath(language, sectionId, itemId);

  if (!filePath) {
    return docMessages[language].notFound;
  }

  // Check cache
  const cacheKey = `${language}-${sectionId}-${itemId || 'default'}`;
  if (docCache[cacheKey]) {
    return docCache[cacheKey];
  }

  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const content = await response.text();
    const processedContent = processDocContent(content, filePath.replace(`/docs/${language}/`, ''));

    // Cache the result
    docCache[cacheKey] = processedContent;

    return processedContent;
  } catch (error) {
    console.error('Failed to load document:', error);
    return docMessages[language].loadFailed;
  }
}

// Synchronous version for backward compatibility (returns placeholder)
export function getDocContent(language: Language, sectionId: string, itemId?: string): string {
  const cacheKey = `${language}-${sectionId}-${itemId || 'default'}`;
  if (docCache[cacheKey]) {
    return docCache[cacheKey];
  }
  return docMessages[language].loading;
}
