import { useMemo } from 'react';
import { scrollToAnchor } from '@/lib/utils';
import { getVersionTocItems } from '@/lib/changelog';

interface VersionTocProps {
  content: string;
}

export function VersionToc({ content }: VersionTocProps) {
  const headings = useMemo(() => getVersionTocItems(content), [content]);

  if (headings.length === 0) return null;

  return (
    <ul className="space-y-2 text-sm">
      {headings.map((heading) => (
        <li key={heading.id}>
          <button
            type="button"
            onClick={() => scrollToAnchor(heading.id)}
            className="text-left w-full py-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            {heading.text}
          </button>
        </li>
      ))}
    </ul>
  );
}
