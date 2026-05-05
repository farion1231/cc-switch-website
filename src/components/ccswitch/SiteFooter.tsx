import { Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/i18n/useLanguage';
import { getLocalizedPath } from '@/i18n/routes';
import ccSwitchLogo from '@/assets/cc-switch-logo.png';

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/farion1231/cc-switch', icon: Github },
];

type FooterLink = {
  label: string;
  href: string;
  internal?: boolean;
};

type FooterSection = {
  title: string;
  links: FooterLink[];
};

export function SiteFooter() {
  const { language, t } = useLanguage();

  const footerSections: FooterSection[] = [
    {
      title: t.footer.product.title,
      links: [
        { label: t.footer.product.features, href: '/#features', internal: true },
        { label: t.footer.product.download, href: 'https://github.com/farion1231/cc-switch/releases' },
      ],
    },
    {
      title: t.footer.resources.title,
      links: [
        { label: t.footer.resources.docs, href: '/docs', internal: true },
        { label: t.footer.resources.tutorials, href: '/tutorials', internal: true },
        { label: t.footer.resources.changelog, href: '/changelog', internal: true },
      ],
    },
    {
      title: t.footer.community.title,
      links: [
        { label: t.footer.community.github, href: 'https://github.com/farion1231/cc-switch' },
        { label: t.footer.community.contributing, href: 'https://github.com/farion1231/cc-switch#contributing' },
        { label: t.footer.community.issues, href: 'https://github.com/farion1231/cc-switch/issues' },
        { label: t.footer.community.sponsors, href: '/sponsors', internal: true },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-card py-12 dark:bg-background md:py-20">
      <div className="container">
        {/* Main Footer Content */}
        <div className="mb-10 grid grid-cols-1 gap-8 sm:grid-cols-2 md:mb-16 md:grid-cols-5 md:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={ccSwitchLogo} alt="CC Switch Logo" className="w-8 h-8" />
              <span className="font-bold text-lg text-foreground">CC Switch</span>
            </div>
            <p className="text-muted-foreground text-sm mb-6">
              {t.footer.tagline}
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-foreground mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.internal ? (
                      <Link
                        to={getLocalizedPath(link.href, language)}
                        className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-start justify-between gap-3 border-t border-border pt-8 sm:items-center md:flex-row md:gap-4">
          <p className="text-sm text-muted-foreground">
            {t.footer.copyright}
          </p>
          <p className="text-muted-foreground text-sm">
            {t.footer.madeWith}
          </p>
        </div>
      </div>
    </footer>
  );
}
