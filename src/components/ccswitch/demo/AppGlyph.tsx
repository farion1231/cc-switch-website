import { InlineSvgIcon } from '@/components/ccswitch/InlineSvgIcon';
import { cn } from '@/lib/utils';
import type { DemoApp } from './apps';

export function AppGlyph({
  app,
  size = 16,
  className,
  badgeClassName = 'border-[var(--app-sidebar)] bg-[var(--app-sidebar)]',
}: {
  app: DemoApp;
  size?: number;
  className?: string;
  /** The badge is cut out of whatever it sits on, so it takes that background. */
  badgeClassName?: string;
}) {
  const Badge = app.badge;
  const style = { width: size, height: size };

  return (
    <span className={cn('relative inline-flex shrink-0 items-center justify-center', className)} style={style}>
      {app.iconSvg ? (
        <InlineSvgIcon svg={app.iconSvg} label={app.label} color="currentColor" className="h-full w-full" />
      ) : (
        <img src={app.icon} alt={app.label} className="h-full w-full object-contain" />
      )}
      {Badge && (
        <span
          className={cn('absolute -bottom-[3px] -right-[3px] flex items-center justify-center rounded-[3px] border text-foreground', badgeClassName)}
          style={{ width: size * 0.62, height: size * 0.62 }}
          aria-hidden="true"
        >
          <Badge style={{ width: size * 0.48, height: size * 0.48 }} strokeWidth={2.5} />
        </span>
      )}
    </span>
  );
}
