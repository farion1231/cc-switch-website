import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MarkdownRenderer } from '@/components/docs/MarkdownRenderer';
import { stripChangelogVersionHeading } from '@/lib/changelog';

interface VersionCardProps {
  entry: { version: string; date: string; content: string; isPreRelease: boolean };
  betaLabel: string;
}

export function VersionCard({ entry, betaLabel }: VersionCardProps) {
  return (
    <motion.div
      key={entry.version}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="overflow-hidden rounded-xl border border-border ring-2 ring-primary/30 shadow-lg shadow-primary/5"
    >
      <div
        className={cn(
          'flex flex-col gap-3 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6',
          entry.isPreRelease ? 'bg-warning/5' : 'bg-muted/50',
        )}
      >
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <span
            className={cn(
              'text-xl font-bold',
              entry.isPreRelease ? 'text-warning' : 'text-foreground',
            )}
          >
            v{entry.version}
          </span>
          {entry.isPreRelease && (
            <span className="text-xs px-2 py-1 rounded-full bg-warning/20 text-warning font-medium">
              {betaLabel}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 shrink-0" />
          <span>{entry.date}</span>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <MarkdownRenderer
          content={stripChangelogVersionHeading(entry.content)}
          className="changelog-content"
        />
      </div>
    </motion.div>
  );
}
