import { createContext } from 'react';
import { translations, type Language } from './translations';

// `translations` is declared `as const`, so every language carries its own
// literal types. Widen them to one shared shape: zh stays the structural
// authority, and a key missing from en or ja fails the typecheck.
type Widen<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends readonly (infer U)[]
        ? readonly Widen<U>[]
        : { readonly [K in keyof T]: Widen<T[K]> };

export type Translations = Widen<typeof translations.zh>;

export interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translations;
}

export const LANGUAGE_STORAGE_KEY = 'cc-switch-language';

export const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);
