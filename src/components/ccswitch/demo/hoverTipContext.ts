import { createContext, useContext, type MouseEvent } from 'react';

/** `title`, when given, is shown as a bold first line (the app's HelpTip). */
export type TipProps = (text: string, title?: string) => {
  onMouseEnter: (event: MouseEvent<HTMLElement>) => void;
  onMouseLeave: () => void;
};

export const HoverTipContext = createContext<{ tip: TipProps; hide: () => void }>({
  tip: () => ({ onMouseEnter: () => undefined, onMouseLeave: () => undefined }),
  hide: () => undefined,
});

export const useHoverTip = () => useContext(HoverTipContext);
