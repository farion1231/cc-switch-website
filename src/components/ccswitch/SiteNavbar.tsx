import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Github, Download, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/i18n/useLanguage';
import { LanguageSwitcher } from './LanguageSwitcher';
import ccSwitchLogo from '@/assets/cc-switch-logo.png';

export function SiteNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: t.nav.home, href: '/' },
    { label: t.nav.docs, href: '/docs' },
    { label: t.nav.changelog, href: '/changelog' },
  ];

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-background/80 backdrop-blur-xl border-b border-border shadow-sm'
            : 'bg-transparent'
        )}
      >
        <div className="container">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo - Fixed width to prevent layout shift */}
            <Link to="/" className="flex items-center gap-2 md:gap-3 min-w-[140px] md:min-w-[180px]">
              <img src={ccSwitchLogo} alt="CC Switch Logo" className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0" />
              <span className="font-bold text-lg md:text-xl text-foreground whitespace-nowrap">
                CC Switch
              </span>
            </Link>

            {/* Desktop Navigation - Left aligned after logo */}
            <div className="hidden md:flex items-center ml-8">
              <div className="flex items-center gap-8">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors font-medium whitespace-nowrap"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              {/* Language Switcher */}
              <LanguageSwitcher />
              
              {/* Theme Toggle */}
              {mounted && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-muted/80 hover:bg-muted transition-colors"
                  aria-label="Toggle theme"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={theme}
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 10, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {theme === 'dark' ? (
                        <Sun className="w-5 h-5 text-foreground" />
                      ) : (
                        <Moon className="w-5 h-5 text-foreground" />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </motion.button>
              )}
              <a
                href="https://github.com/farion1231/cc-switch"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <LanguageSwitcher />
              {mounted && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-muted/80 hover:bg-muted transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-5 h-5 text-foreground" />
                  ) : (
                    <Moon className="w-5 h-5 text-foreground" />
                  )}
                </motion.button>
              )}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background pt-20 md:hidden"
          >
            <nav className="container flex flex-col gap-6 py-8">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-2xl font-semibold text-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-6 flex flex-col gap-4"
              >
                <a href="https://github.com/farion1231/cc-switch/releases" target="_blank" rel="noopener noreferrer" className="w-full">
                  <Button className="w-full hero-gradient text-white py-6 text-lg gap-2">
                    <Download className="w-5 h-5" />
                    {t.nav.download}
                  </Button>
                </a>
                <a
                  href="https://github.com/farion1231/cc-switch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-muted-foreground"
                >
                  <Github className="w-5 h-5" />
                  GitHub
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
