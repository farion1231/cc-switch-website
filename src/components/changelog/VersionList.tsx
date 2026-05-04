import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChangelogIndexEntry } from '@/lib/changelog';

export interface VersionListProps {
  versions: ChangelogIndexEntry[];
  activeVersion: string | undefined;
  onSelect: (version: string) => void;
  betaLabel: string;
}

export function VersionList({ versions, activeVersion, onSelect, betaLabel }: VersionListProps) {
  return (
    <div className="space-y-1">
      {versions.map((entry) => {
        const isActive = activeVersion === entry.version;
        return (
          <button
            key={entry.version}
            onClick={() => onSelect(entry.version)}
            className={cn(
              'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-all duration-200',
              isActive
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <ChevronRight
              className={cn('w-3 h-3 transition-transform', isActive && 'rotate-90')}
            />
            <span className="flex-1">v{entry.version}</span>
            {entry.isPreRelease && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-warning/20 text-warning">
                {betaLabel}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
