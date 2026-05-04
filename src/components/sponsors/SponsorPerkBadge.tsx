import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SponsorPerkBadgeProps {
  text: string;
  size?: 'sm' | 'md';
  className?: string;
  withIcon?: boolean;
}

export function SponsorPerkBadge({
  text,
  size = 'sm',
  className,
  withIcon = true,
}: SponsorPerkBadgeProps) {
  const sizeClass =
    size === 'md'
      ? 'px-3 py-1 text-sm'
      : 'px-2.5 py-0.5 text-xs';

  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center gap-1 rounded-full bg-primary/10 font-medium text-primary',
        sizeClass,
        className,
      )}
    >
      {withIcon && <Sparkles className="h-3 w-3 shrink-0" aria-hidden />}
      <span className="truncate">{text}</span>
    </span>
  );
}
