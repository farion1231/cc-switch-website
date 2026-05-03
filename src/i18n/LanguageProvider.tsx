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
  const [language, setLanguageState] = useState<Language>(() => pathLanguage ?? getStoredOrBrowserLanguage());

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    }
  };

  useEffect(() => {
    if (!pathLanguage || pathLanguage === language) return;

    setLanguageState(pathLanguage);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, pathLanguage);
  }, [language, pathLanguage]);

  const value: LanguageContextValue = {
    language,
    setLanguage,
    t: translations[language],
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
