import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { HoverTipContext, type TipProps } from './hoverTipContext';

interface TipState {
  text: string;
  title?: string;
  x: number;
  y: number;
  left: boolean;
  up: boolean;
}

/**
 * Icon-only buttons in the app show their name on hover (HoverTip). The demo window is scaled
 * down in the hero, so the tip is portalled to <body> and placed at the cursor instead.
 */
export function HoverTipProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TipState | null>(null);
  const hide = useCallback(() => setState(null), []);
  const tip = useCallback<TipProps>(
    (text, title) => ({
      onMouseEnter: (event) =>
        setState({
          text,
          title,
          x: event.clientX,
          y: event.clientY,
          left: event.clientX > window.innerWidth - 260,
          up: event.clientY > window.innerHeight - 90,
        }),
      onMouseLeave: () => setState(null),
    }),
    [],
  );
  const value = useMemo(() => ({ tip, hide }), [tip, hide]);

  return (
    <HoverTipContext.Provider value={value}>
      {children}
      {state &&
        createPortal(
          // The outer div places the tip; framer-motion owns the inner one's transform for the scale-in.
          <div
            role="tooltip"
            className="pointer-events-none fixed z-[9999]"
            style={{
              left: state.x,
              top: state.y,
              transform: `translate(${state.left ? 'calc(-100% - 12px)' : '12px'}, ${state.up ? 'calc(-100% - 12px)' : '12px'})`,
            }}
          >
            <motion.div
              key={`${state.title ?? ''}${state.text}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.14 }}
              className="w-max max-w-[min(18rem,calc(100vw_-_2rem))] whitespace-pre-line rounded-lg border border-border bg-background/95 px-3 py-2 text-xs font-medium leading-relaxed text-foreground shadow-lg shadow-black/10 backdrop-blur"
            >
              {state.title && <span className="mb-0.5 block font-semibold">{state.title}</span>}
              {state.text}
            </motion.div>
          </div>,
          document.body,
        )}
    </HoverTipContext.Provider>
  );
}

