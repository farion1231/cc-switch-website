import { motion, LayoutGroup, Reorder, useDragControls } from "framer-motion";
import { RefreshCw, Play, Check, Copy, BarChart3, Trash2, SquarePen, Clock, TestTube2, GripVertical } from "lucide-react";
import type { MouseEvent } from "react";
import { InlineSvgIcon } from "@/components/ccswitch/InlineSvgIcon";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/useLanguage";
import type { Provider } from "@/content/providers";

interface ProviderCardProps {
  provider: Provider;
  index: number;
  isActive: boolean;
  proxyEnabled: boolean;
  onSelect: () => void;
  onAction?: (name: string, event: MouseEvent<HTMLElement>) => void;
  onActionEnd?: () => void;
  compact?: boolean;
}

export function ProviderCard({
  provider,
  index,
  isActive,
  proxyEnabled,
  onSelect,
  onAction,
  onActionEnd,
  compact = false,
}: ProviderCardProps) {
  const dragControls = useDragControls();
  const { t } = useLanguage();
  const handleSelect = () => {
    onSelect();
  };
  const handleButtonAction = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };
  const getActionHoverProps = (name: string) => ({
    onMouseEnter: (event: MouseEvent<HTMLElement>) => onAction?.(name, event),
    onMouseLeave: onActionEnd,
  });

  const activeBorderClass = proxyEnabled
    ? "border-emerald-500/60 shadow-sm shadow-emerald-500/10"
    : "border-blue-500/60 shadow-sm shadow-blue-500/10";

  const timeLabel = (() => {
    if (!provider.time) return "";
    const minutes = parseInt(String(provider.time).replace(/[^0-9]/g, ""), 10);
    if (Number.isFinite(minutes) && !Number.isNaN(minutes)) return `${minutes} ${t.provider.minutesAgo}`;
    return String(provider.time);
  })();

  return (
    <Reorder.Item
      value={provider}
      dragListener={false}
      dragControls={dragControls}
      layout
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{
        delay: index * 0.08,
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
        layout: { duration: 0.28 },
      }}
      onClick={handleSelect}
      className={cn(
        "group relative flex cursor-pointer items-center gap-2 overflow-hidden rounded-xl border border-border bg-card text-card-foreground transition-all duration-300 hover:shadow-sm sm:gap-3",
        isActive ? activeBorderClass : "hover:border-primary/40",
        compact ? "p-2.5" : "p-3 sm:p-4",
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-r to-transparent transition-opacity duration-500",
          proxyEnabled ? "from-emerald-500/10" : "from-blue-500/10",
          isActive ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Drag Handle */}
      <div
        className="-ml-1.5 flex shrink-0 cursor-grab p-1.5 text-muted-foreground/50 transition-colors hover:text-muted-foreground active:cursor-grabbing"
        onPointerDown={(e) => {
          e.stopPropagation();
          onActionEnd?.();
          dragControls.start(e);
        }}
      >
        <GripVertical className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
      </div>

      {/* Provider Icon */}
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-card-foreground transition-transform duration-300 group-hover:scale-105",
          compact ? "h-8 w-8" : "h-8 w-8",
        )}
      >
        <ProviderLogo provider={provider} compact={compact} />
      </div>

      {/* Provider Info */}
      <div className="flex-1 min-w-0">
        <div className={cn("font-semibold leading-none text-foreground", compact ? "text-sm" : "text-base")}>{provider.name}</div>
        {provider.isUrl ? (
          <a
            href={provider.subtitle}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "mt-1 block truncate text-blue-500 transition-colors hover:underline dark:text-blue-400",
              compact ? "text-xs" : "text-sm",
            )}
          >
            {provider.subtitle}
          </a>
        ) : (
          <div
            className={cn(
              "truncate text-muted-foreground",
              compact ? "text-xs" : "text-sm",
            )}
          >
            {provider.subtitle}
          </div>
        )}
      </div>

      <div className="ml-auto flex min-w-0 items-center gap-3">
        <div className="ml-auto">
          {provider.quota ? (
            <QuotaSummary provider={provider} compact={compact} />
          ) : provider.used ? (
            <UsageSummary provider={provider} compact={compact} timeLabel={timeLabel} />
          ) : null}
        </div>

        {/* Action Button & Icons - fixed in layout, opacity only on hover */}
        <div className="hidden shrink-0 items-center gap-2 opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 group-hover:pointer-events-auto group-focus-within:pointer-events-auto sm:flex">
          <div className={cn("flex justify-end", compact ? "w-[58px]" : "w-[78px]")}>
            {isActive ? (
              <div
                {...getActionHoverProps(t.provider.inUse)}
                className={cn(
                  "flex items-center gap-1.5 bg-muted rounded-lg text-muted-foreground",
                  compact ? "px-2 py-1 text-[10px]" : "px-3 py-1.5 text-xs",
                )}
              >
                <Check className={compact ? "w-2.5 h-2.5" : "w-3 h-3"} />
                {t.provider.inUse}
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(event) => {
                  event.stopPropagation();
                  onSelect();
                }}
                {...getActionHoverProps(t.demo.actionNames.activateProvider)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg font-medium text-primary-foreground transition-colors",
                  proxyEnabled
                    ? "bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                    : "bg-primary hover:bg-primary/90",
                  compact ? "px-2 py-1 text-[10px]" : "px-3 py-1.5 text-xs",
                )}
              >
                <Play className={compact ? "w-2.5 h-2.5" : "w-3 h-3"} />
                {t.provider.enable}
              </motion.button>
            )}
          </div>

          <div className="flex items-center gap-0.5">
            {[
              { Icon: SquarePen, label: t.demo.actionNames.editProvider },
              { Icon: Copy, label: t.demo.actionNames.duplicateProvider },
              { Icon: TestTube2, label: t.demo.actionNames.testProvider },
              { Icon: BarChart3, label: t.demo.actionNames.configureUsage },
              { Icon: Trash2, label: t.demo.actionNames.deleteProvider },
            ].map(({ Icon, label }) => (
              <motion.button
                key={label}
                whileHover={{ scale: 1.1, backgroundColor: "hsl(var(--muted))" }}
                whileTap={{ scale: 0.9 }}
                aria-label={label}
                className={cn("rounded-md transition-colors", compact ? "p-1" : "p-1.5")}
                onClick={handleButtonAction}
                {...getActionHoverProps(label)}
              >
                <Icon className={cn("text-muted-foreground", compact ? "w-3 h-3" : "w-4 h-4")} />
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </Reorder.Item>
  );
}

function quotaColor(utilization: number) {
  if (utilization >= 90) return "text-destructive";
  if (utilization >= 70) return "text-warning";
  return "text-success";
}

function ProviderLogo({ provider, compact }: { provider: Provider; compact: boolean }) {
  const sizeClass = compact ? "h-4 w-4" : "h-5 w-5";

  if (provider.isText) {
    return (
      <span
        className={cn("font-semibold", compact ? "text-xs" : "text-sm")}
        style={{ color: provider.iconColor === "currentColor" ? undefined : provider.iconColor }}
      >
        {provider.icon}
      </span>
    );
  }

  if (provider.iconSvg) {
    return <InlineSvgIcon svg={provider.iconSvg} label={provider.name} color={provider.iconColor} className={sizeClass} />;
  }

  if (provider.isSvgUrl && provider.iconColor) {
    return (
      <span
        className={cn("inline-block shrink-0 bg-current", sizeClass)}
        style={{
          color: provider.iconColor === "currentColor" ? undefined : provider.iconColor,
          WebkitMask: `url(${provider.icon}) center / contain no-repeat`,
          mask: `url(${provider.icon}) center / contain no-repeat`,
        }}
        aria-label={provider.name}
        role="img"
      />
    );
  }

  if (provider.isSvgUrl) {
    return <img src={provider.icon} alt={provider.name} className={cn("object-contain", sizeClass)} />;
  }

  return <span className={compact ? "text-sm" : "text-lg"}>{provider.icon}</span>;
}

function UsageSummary({
  provider,
  compact,
  timeLabel,
}: {
  provider: Provider;
  compact: boolean;
  timeLabel: string;
}) {
  const { t } = useLanguage();

  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn("hidden sm:block shrink-0 text-right", compact ? "text-[10px]" : "text-xs")}
    >
      <motion.div layout className="mb-0.5 flex items-center justify-end gap-2 text-muted-foreground">
        <span className="flex items-center gap-1 text-[10px] text-muted-foreground/70">
          <Clock className={compact ? "h-2.5 w-2.5" : "h-3 w-3"} />
          {timeLabel}
        </span>
        <RefreshCw className={compact ? "h-2.5 w-2.5" : "h-3 w-3"} />
      </motion.div>
      <motion.div layout className="text-muted-foreground">
        {t.provider.used}: {provider.used} {t.provider.remaining}:{" "}
        <span className="font-semibold text-green-600 dark:text-green-400">{provider.remaining}</span> USD
      </motion.div>
    </motion.div>
  );
}

function QuotaSummary({ provider, compact }: { provider: Provider; compact: boolean }) {
  const { t } = useLanguage();

  if (!provider.quota) return null;

  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn(
        "hidden sm:flex flex-col items-end gap-1 shrink-0 text-right whitespace-nowrap",
        compact ? "text-[10px]" : "text-xs",
      )}
    >
      <motion.div layout className="flex items-center justify-end gap-2 text-muted-foreground">
        <span className="flex items-center gap-1 text-[10px] text-muted-foreground/70">
          <Clock className={compact ? "w-2.5 h-2.5" : "w-3 h-3"} />
          {provider.quota.updatedMinutes} {t.provider.minutesAgo}
        </span>
        <RefreshCw className={compact ? "w-2.5 h-2.5" : "w-3 h-3"} />
      </motion.div>
      <motion.div layout className="flex flex-wrap items-center justify-end gap-x-2 gap-y-1">
        {provider.quota.tiers.map((tier) => (
          <span key={tier.label} className="inline-flex items-center gap-0.5 text-muted-foreground">
            <span>{tier.label}:</span>
            <span className={cn("font-semibold tabular-nums", quotaColor(tier.utilization))}>
              {Math.round(tier.utilization)}%
            </span>
            {tier.resetsIn && (
              <span className="ml-0.5 inline-flex items-center gap-px text-muted-foreground/60">
                <Clock className="w-2.5 h-2.5" />
                {tier.resetsIn}
              </span>
            )}
          </span>
        ))}
      </motion.div>
    </motion.div>
  );
}

interface ProviderListProps {
  providers: Provider[];
  activeProvider: number;
  proxyEnabled: boolean;
  onSelectProvider: (index: number) => void;
  onReorderProviders: (providers: Provider[]) => void;
  onAction?: (name: string, event: MouseEvent<HTMLElement>) => void;
  onActionEnd?: () => void;
  compact?: boolean;
  animationKey?: string;
}

export function ProviderList({
  providers,
  activeProvider,
  proxyEnabled,
  onSelectProvider,
  onReorderProviders,
  onAction,
  onActionEnd,
  compact = false,
  animationKey = "default",
}: ProviderListProps) {
  return (
    <LayoutGroup id={animationKey}>
      <Reorder.Group
        axis="y"
        values={providers}
        onReorder={onReorderProviders}
        className={cn("space-y-2", compact ? "space-y-2" : "space-y-3")}
      >
        {providers.map((provider, index) => (
          <ProviderCard
            key={`${animationKey}-${provider.name}`}
            provider={provider}
            index={index}
            isActive={index === activeProvider}
            proxyEnabled={proxyEnabled}
            onSelect={() => onSelectProvider(index)}
            onAction={onAction}
            onActionEnd={onActionEnd}
            compact={compact}
          />
        ))}
      </Reorder.Group>
    </LayoutGroup>
  );
}
