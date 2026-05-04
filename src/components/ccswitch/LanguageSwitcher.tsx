import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check } from 'lucide-react';
import { useLanguage } from '@/i18n/useLanguage';
import { Language } from '@/i18n/translations';
import { getLocalizedPath } from '@/i18n/routes';
import { cn } from '@/lib/utils';

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
];

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen]);

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Select language (current: ${currentLang.label})`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-muted/80 hover:bg-muted transition-colors text-sm font-medium"
      >
        <Globe className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
        <span className="text-foreground" aria-hidden="true">{currentLang.flag}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Dropdown */}
            <motion.ul
              role="listbox"
              aria-label="Language"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 z-50 min-w-[140px] bg-popover border border-border rounded-lg shadow-lg overflow-hidden"
            >
              {languages.map((lang) => {
                const selected = language === lang.code;
                return (
                  <li key={lang.code} role="option" aria-selected={selected}>
                    <button
                      type="button"
                      onClick={() => {
                        setLanguage(lang.code);
                        navigate(`${getLocalizedPath(location.pathname, lang.code)}${location.search}${location.hash}`);
                        setIsOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center gap-2 px-3 py-2.5 text-sm transition-colors',
                        selected
                          ? 'bg-accent text-accent-foreground'
                          : 'hover:bg-muted text-foreground'
                      )}
                    >
                      <span className="text-base" aria-hidden="true">{lang.flag}</span>
                      <span className="flex-1 text-left">{lang.label}</span>
                      {selected && (
                        <Check className="w-4 h-4 text-primary" aria-hidden="true" />
                      )}
                    </button>
                  </li>
                );
              })}
            </motion.ul>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
