import { type ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  LANGUAGE_STORAGE_KEY,
  LanguageContext,
  type LanguageContextValue,
} from './language-context';
import { type Language, translations } from './translations';
import { DEFAULT_LANGUAGE, getLanguageFromPathname, isSupportedLanguage } from './routes';

function getStoredOrBrowserLanguage(): Language {
  if (typeof window === 'undefined') return 'zh';

  const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (isSupportedLanguage(savedLanguage)) return savedLanguage;

  const browserLanguage = navigator.language.toLowerCase();
  if (browserLanguage.startsWith('ja')) return 'ja';
  if (browserLanguage.startsWith('en')) return 'en';

  return DEFAULT_LANGUAGE;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const pathLanguage = getLanguageFromPathname(location.pathname);
  // Only for paths without a language prefix (such as "/"): the last language used, else the browser's.
  const [fallbackLanguage, setFallbackLanguage] = useState<Language>(getStoredOrBrowserLanguage);
  // The URL decides. Keeping a second copy in state let a switch flash old → new → old → new:
  // React Router commits navigations in a transition, so the copy changed a frame before the URL.
  const language = pathLanguage ?? fallbackLanguage;

  useEffect(() => {
    if (!pathLanguage) return;
    setFallbackLanguage(pathLanguage);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, pathLanguage);
  }, [pathLanguage]);

  const value: LanguageContextValue = {
    language,
    t: translations[language],
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
