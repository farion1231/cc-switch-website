import { motion, LayoutGroup, Reorder, useDragControls } from "framer-motion";
import { RefreshCw, Play, Check, Copy, BarChart3, Trash2, SquarePen, Clock, TestTube2 } from "lucide-react";
import type { MouseEvent } from "react";
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

  const getBorderColor = () => {
    if (!isActive) return "border-border/50";
    return proxyEnabled ? "border-success" : "border-info";
  };

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
        "group relative flex items-center gap-2.5 bg-muted/30 rounded-xl border-2 cursor-pointer transition-colors hover:bg-muted/50 sm:gap-3",
        getBorderColor(),
        compact ? "p-2.5" : "p-3 sm:p-4",
      )}
    >
      {/* Drag Handle - 6 dots */}
      <div
        className="flex flex-col gap-0.5 cursor-grab active:cursor-grabbing"
        onPointerDown={(e) => {
          e.stopPropagation();
          onActionEnd?.();
          dragControls.start(e);
        }}
      >
        <div className="flex gap-0.5">
          <div className={cn("rounded-full bg-muted-foreground/40", compact ? "w-0.5 h-0.5" : "w-1 h-1")} />
          <div className={cn("rounded-full bg-muted-foreground/40", compact ? "w-0.5 h-0.5" : "w-1 h-1")} />
        </div>
        <div className="flex gap-0.5">
          <div className={cn("rounded-full bg-muted-foreground/40", compact ? "w-0.5 h-0.5" : "w-1 h-1")} />
          <div className={cn("rounded-full bg-muted-foreground/40", compact ? "w-0.5 h-0.5" : "w-1 h-1")} />
        </div>
        <div className="flex gap-0.5">
          <div className={cn("rounded-full bg-muted-foreground/40", compact ? "w-0.5 h-0.5" : "w-1 h-1")} />
          <div className={cn("rounded-full bg-muted-foreground/40", compact ? "w-0.5 h-0.5" : "w-1 h-1")} />
        </div>
      </div>

      {/* Provider Icon */}
      <div
        className={cn(
          "rounded-xl flex items-center justify-center shrink-0",
          provider.iconBg,
          compact ? "w-8 h-8" : "w-10 h-10",
        )}
      >
        {provider.isSvgUrl ? (
          <img
            src={provider.icon}
            alt={provider.name}
            className={cn("text-foreground", compact ? "w-4 h-4" : "w-5 h-5")}
          />
        ) : provider.isText ? (
          <span className={cn("font-medium text-muted-foreground", compact ? "text-xs" : "text-sm")}>
            {provider.icon}
          </span>
        ) : (
          <span className={compact ? "text-sm" : "text-lg"}>{provider.icon}</span>
        )}
      </div>

      {/* Provider Info */}
      <div className="flex-1 min-w-0">
        <div className={cn("font-semibold text-foreground", compact ? "text-sm" : "text-base")}>{provider.name}</div>
        {provider.isUrl ? (
          <a
            href={provider.subtitle}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "truncate block text-success hover:text-success/80 hover:underline transition-colors cursor-pointer",
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
                  "flex items-center gap-1.5 bg-success hover:bg-success/90 rounded-lg text-success-foreground font-medium transition-colors",
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
      <motion.div layout className="flex items-center justify-end gap-2 text-muted-foreground mb-0.5">
        <span>⏱ {timeLabel}</span>
        <RefreshCw className={compact ? "w-2.5 h-2.5" : "w-3 h-3"} />
      </motion.div>
      <motion.div layout className="text-muted-foreground">
        {t.provider.used}: {provider.used} {t.provider.remaining}:{" "}
        <span className="text-success font-semibold">{provider.remaining}</span> USD
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
