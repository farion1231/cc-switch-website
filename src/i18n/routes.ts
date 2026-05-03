import type { Language } from './translations';

export const DEFAULT_LANGUAGE: Language = 'zh';
export const SUPPORTED_LANGUAGES = ['zh', 'en', 'ja'] as const satisfies readonly Language[];

export function isSupportedLanguage(value: string | null | undefined): value is Language {
  return value === 'zh' || value === 'en' || value === 'ja';
}

export function getLanguageFromPathname(pathname: string): Language | null {
  const segment = pathname.split('/').filter(Boolean)[0];
  return isSupportedLanguage(segment) ? segment : null;
}

export function stripLanguageFromPathname(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length > 0 && isSupportedLanguage(segments[0])) {
    const nextPath = `/${segments.slice(1).join('/')}`;
    return nextPath === '/' ? '/' : nextPath;
  }

  return pathname || '/';
}

export function withLanguagePath(pathname: string, language: Language) {
  const basePath = stripLanguageFromPathname(pathname);
  const normalizedBase = basePath.startsWith('/') ? basePath : `/${basePath}`;

  return normalizedBase === '/' ? `/${language}/` : `/${language}${normalizedBase}`;
}

export function getLocalizedPath(to: string, language: Language) {
  if (/^(https?:|mailto:|ccswitch:)/.test(to)) return to;

  const queryIndex = to.indexOf('?');
  const hashIndex = to.indexOf('#');
  const splitIndexes = [queryIndex, hashIndex].filter((index) => index >= 0);
  const splitIndex = splitIndexes.length > 0 ? Math.min(...splitIndexes) : -1;
  const pathname = splitIndex >= 0 ? to.slice(0, splitIndex) || '/' : to || '/';
  const suffix = splitIndex >= 0 ? to.slice(splitIndex) : '';

  return `${withLanguagePath(pathname, language)}${suffix}`;
}
