import { Tag } from 'lucide-react';
import { VersionList, type VersionListProps } from './VersionList';

interface VersionSidebarProps extends VersionListProps {
  versionsLabel: string;
}

export function VersionSidebar({
  versions,
  activeVersion,
  onSelect,
  versionsLabel,
  betaLabel,
}: VersionSidebarProps) {
  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <nav className="sticky top-24 space-y-1">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Tag className="w-4 h-4" />
          {versionsLabel}
        </h4>
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
          <VersionList
            versions={versions}
            activeVersion={activeVersion}
            onSelect={onSelect}
            betaLabel={betaLabel}
          />
        </div>
      </nav>
    </aside>
  );
}
