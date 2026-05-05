import { X } from 'lucide-react';
import { useLanguage } from '@/i18n/useLanguage';
import { cn } from '@/lib/utils';
import type { TutorialCategory, TutorialSource } from '@/content/tutorials';

interface TutorialFiltersProps {
  categories: TutorialCategory[];
  sources: TutorialSource[];
  activeCategory: TutorialCategory | 'all';
  activeSource: TutorialSource | 'all';
  onCategoryChange: (value: TutorialCategory | 'all') => void;
  onSourceChange: (value: TutorialSource | 'all') => void;
}

export function TutorialFilters({
  categories,
  sources,
  activeCategory,
  activeSource,
  onCategoryChange,
  onSourceChange,
}: TutorialFiltersProps) {
  const { t } = useLanguage();
  const copy = t.tutorials.filters;
  const categoryLabel = t.tutorials.categories;
  const sourceLabel = t.tutorials.sources;

  const isFiltered = activeCategory !== 'all' || activeSource !== 'all';

  return (
    <div className="mb-8 space-y-4 md:mb-10">
      <FilterRow label={copy.category}>
        <Chip
          active={activeCategory === 'all'}
          onClick={() => onCategoryChange('all')}
        >
          {copy.all}
        </Chip>
        {categories.map((category) => (
          <Chip
            key={category}
            active={activeCategory === category}
            onClick={() => onCategoryChange(category)}
          >
            {categoryLabel[category]}
          </Chip>
        ))}
      </FilterRow>

      <FilterRow label={copy.source}>
        <Chip
          active={activeSource === 'all'}
          onClick={() => onSourceChange('all')}
        >
          {copy.all}
        </Chip>
        {sources.map((source) => (
          <Chip
            key={source}
            active={activeSource === source}
            onClick={() => onSourceChange(source)}
          >
            {sourceLabel[source]}
          </Chip>
        ))}

        {isFiltered && (
          <button
            type="button"
            onClick={() => {
              onCategoryChange('all');
              onSourceChange('all');
            }}
            className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            {copy.clear}
          </button>
        )}
      </FilterRow>
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground sm:w-20">
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1 text-xs font-medium transition-colors sm:text-sm',
        active
          ? 'border-primary/50 bg-primary/10 text-primary'
          : 'border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground',
      )}
    >
      {children}
    </button>
  );
}
