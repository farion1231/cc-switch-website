import { useState, useEffect, useMemo } from 'react';
import { cn, scrollToAnchor, slugify } from '@/lib/utils';
import { useLanguage } from '@/i18n/useLanguage';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  className?: string;
}

export function TableOfContents({ content, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const { t } = useLanguage();

  // Extract headings from markdown content
  const headings = useMemo(() => {
    const regex = /^(#{1,3})\s+(.+)$/gm;
    const items: TocItem[] = [];
    let match;

    while ((match = regex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();

      if (level <= 3) {
        items.push({ id: slugify(text), text, level });
      }
    }

    return items;
  }, [content]);

  // Track scroll position to highlight active heading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 0,
      }
    );

    // Observe all headings
    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = (id: string) => scrollToAnchor(id);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className={cn('text-sm', className)}>
      <h4 className="font-semibold text-foreground mb-4">{t.docs.toc.title}</h4>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
          >
            <button
              onClick={() => handleClick(heading.id)}
              className={cn(
                'text-left w-full py-1 transition-colors duration-200 hover:text-foreground',
                activeId === heading.id
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground'
              )}
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
