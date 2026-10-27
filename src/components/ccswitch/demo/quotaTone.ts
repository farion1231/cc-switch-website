/** cc-switch quotaRules: orange below 20% left, red once used up; only the number takes the color. */
export const WARN_BELOW_PERCENT = 20;

export type QuotaTone = 'normal' | 'warning' | 'danger';

export const quotaTone = (left: number): QuotaTone =>
  left <= 0 ? 'danger' : left < WARN_BELOW_PERCENT ? 'warning' : 'normal';

/** cc-switch QuotaLines TONE_TEXT (the v3 green / orange / red). */
export const QUOTA_TONE_TEXT: Record<QuotaTone, string> = {
  normal: 'text-green-600 dark:text-green-400',
  warning: 'text-orange-500 dark:text-orange-400',
  danger: 'text-red-500 dark:text-red-400',
};

export const QUOTA_TONE_FILL: Record<QuotaTone, string> = {
  normal: 'bg-[var(--app-chart)]',
  warning: 'bg-[var(--app-warning)]',
  danger: 'bg-[var(--app-danger)]',
};
