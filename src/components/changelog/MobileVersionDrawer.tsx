import { AnimatePresence, motion } from 'framer-motion';
import { Tag, X } from 'lucide-react';
import { VersionList, type VersionListProps } from './VersionList';

interface MobileVersionDrawerProps extends VersionListProps {
  open: boolean;
  onClose: () => void;
  versionsLabel: string;
  closeLabel: string;
}

export function MobileVersionDrawer({
  open,
  onClose,
  versions,
  activeVersion,
  onSelect,
  versionsLabel,
  closeLabel,
  betaLabel,
}: MobileVersionDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-background border-r border-border shadow-xl overflow-y-auto"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-semibold text-foreground flex items-center gap-2">
                <Tag className="w-4 h-4" />
                {versionsLabel}
              </span>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label={closeLabel}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <VersionList
                versions={versions}
                activeVersion={activeVersion}
                onSelect={onSelect}
                betaLabel={betaLabel}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
