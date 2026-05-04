import { cn } from '@/lib/utils';

interface MacOsWindowBarProps {
  size?: 'sm' | 'md';
  responsive?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const dotBase = 'rounded-full';
const dotSize: Record<NonNullable<MacOsWindowBarProps['size']>, string> = {
  sm: 'h-2.5 w-2.5',
  md: 'h-3 w-3',
};
const responsiveDot = 'h-2.5 w-2.5 sm:h-3 sm:w-3';

export function MacOsWindowBar({
  size = 'md',
  responsive = false,
  className,
  children,
}: MacOsWindowBarProps) {
  const dotClass = responsive ? responsiveDot : dotSize[size];
  return (
    <div
      aria-hidden="true"
      className={cn('flex items-center gap-2', className)}
    >
      <div className="flex gap-1.5 sm:gap-2">
        <div className={cn(dotBase, dotClass, 'bg-red-500')} />
        <div className={cn(dotBase, dotClass, 'bg-yellow-500')} />
        <div className={cn(dotBase, dotClass, 'bg-green-500')} />
      </div>
      {children}
    </div>
  );
}
