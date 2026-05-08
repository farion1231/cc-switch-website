import { cn } from '@/lib/utils';

interface InlineSvgIconProps {
  svg: string;
  label: string;
  color?: string;
  className?: string;
}

export function InlineSvgIcon({ svg, label, color, className }: InlineSvgIconProps) {
  return (
    <span
      aria-label={label}
      className={cn('inline-flex shrink-0 items-center justify-center [&>svg]:block [&>svg]:h-full [&>svg]:w-full', className)}
      role="img"
      style={{ color: color === 'currentColor' ? undefined : color }}
      title={label}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
