import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface SponsorLogoProps {
  src: string;
  name: string;
  className?: string;
  followsTheme?: boolean;
  loading?: 'eager' | 'lazy';
}

export function SponsorLogo({
  src,
  name,
  className,
  followsTheme = false,
  loading = 'lazy',
}: SponsorLogoProps) {
  if (followsTheme) {
    const maskImage = `url("${src}")`;
    const maskStyle: CSSProperties = {
      WebkitMaskImage: maskImage,
      maskImage,
      WebkitMaskPosition: 'center',
      maskPosition: 'center',
      WebkitMaskRepeat: 'no-repeat',
      maskRepeat: 'no-repeat',
      WebkitMaskSize: 'contain',
      maskSize: 'contain',
    };

    return (
      <span
        role="img"
        aria-label={name}
        className={cn('inline-block bg-foreground', className)}
        style={maskStyle}
      />
    );
  }

  return (
    <img
      src={src}
      alt={name}
      className={className}
      loading={loading}
      decoding="async"
    />
  );
}
