import { createContext, useContext } from 'react';
import type { AppId } from './apps';

export type GlobalPage = 'mcp' | 'skills' | 'prompts' | 'sessions' | 'auth' | 'usage' | 'apps' | 'settings';

export interface DemoToast {
  text: string;
  /** Second line, the consequence (as the app's toasts do). */
  detail?: string;
  undo?: () => void;
}

interface ShellValue {
  /** Apps shown in the sidebar and in the MCP / Skills columns and the app pickers (Apps page switch). */
  visibleApps: AppId[];
  setAppVisible: (app: AppId, visible: boolean) => void;
  toast: (toast: DemoToast) => void;
  openPage: (page: GlobalPage) => void;
}

export const ShellContext = createContext<ShellValue>({
  visibleApps: [],
  setAppVisible: () => undefined,
  toast: () => undefined,
  openPage: () => undefined,
});

export const useShell = () => useContext(ShellContext);
