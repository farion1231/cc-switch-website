import { useState, type ReactNode } from 'react';
import { ChevronDown, ChevronRight, Monitor, Moon, SlidersHorizontal, Sun } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '@/i18n/useLanguage';
import { Btn, DemoSwitch, HelpTip, PaneHeader, Segmented } from './parts';
import { useShell } from './shellContext';

const LANGUAGE_NAME = { zh: '简体中文', en: 'English', ja: '日本語' } as const;

/** Settings › General, the first screen of the settings page. */
export function SettingsPane() {
  const { t, language } = useLanguage();
  const { openPage } = useShell();
  const st = t.demo.window.pages.settings;
  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>('system');
  const [switches, setSwitches] = useState({ profile: false, toolUpdates: false, launch: false, silent: false, tray: true });
  const flip = (key: keyof typeof switches) => (on: boolean) => setSwitches((current) => ({ ...current, [key]: on }));

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PaneHeader icon={<SlidersHorizontal className="h-5 w-5" strokeWidth={1.5} />} title={st.sections.general} />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[760px] space-y-7 px-4 pb-10 pt-6 sm:px-6">
          <Block title={st.appearance}>
            <Row label={st.language}>
              <FakeSelect value={LANGUAGE_NAME[language]} />
            </Row>
            <Row label={st.theme}>
              <Segmented
                small
                layoutId="demo-settings-theme"
                value={theme}
                onChange={setTheme}
                items={[
                  { id: 'system', label: st.themeSystem, icon: Monitor },
                  { id: 'light', label: st.themeLight, icon: Sun },
                  { id: 'dark', label: st.themeDark, icon: Moon },
                ]}
              />
            </Row>
          </Block>

          <Block title={st.sidebarAndHeader}>
            <Row label={st.visibleApps}>
              <Btn variant="quiet" compact trailingIcon={ChevronRight} onClick={() => openPage('apps')}>
                {st.goToApps}
              </Btn>
            </Row>
            <Row label={st.showProfileSwitcher} help={st.showProfileSwitcherHelp}>
              <DemoSwitch checked={switches.profile} onChange={flip('profile')} label={st.showProfileSwitcher} />
            </Row>
          </Block>

          <Block title={st.updates}>
            <Row label={st.checkToolUpdates} help={st.checkToolUpdatesHelp}>
              <DemoSwitch checked={switches.toolUpdates} onChange={flip('toolUpdates')} label={st.checkToolUpdates} />
            </Row>
          </Block>

          <Block title={st.windowAndTerminal}>
            <Row label={st.launchOnStartup}>
              <DemoSwitch checked={switches.launch} onChange={flip('launch')} label={st.launchOnStartup} />
            </Row>
            <AnimatePresence initial={false}>
              {switches.launch && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <Row label={st.silentStartup} help={st.silentStartupHelp}>
                    <DemoSwitch checked={switches.silent} onChange={flip('silent')} label={st.silentStartup} />
                  </Row>
                </motion.div>
              )}
            </AnimatePresence>
            <Row label={st.minimizeToTray} help={st.minimizeToTrayHelp}>
              <DemoSwitch checked={switches.tray} onChange={flip('tray')} label={st.minimizeToTray} />
            </Row>
            <Row label={st.preferredTerminal} help={st.terminalHelp}>
              <FakeSelect value="Terminal.app" />
            </Row>
          </Block>
        </div>
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h4 className="flex min-h-7 items-center text-[15px] font-semibold text-foreground">{title}</h4>
      <div className="divide-y divide-border overflow-hidden rounded-[10px] border border-border bg-[var(--app-surface)]">{children}</div>
    </section>
  );
}

function Row({ label, help, children }: { label: string; help?: string; children: ReactNode }) {
  return (
    <div className="px-4 py-3">
      <div className="flex min-h-7 flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <span className="text-[13px] font-medium text-foreground">{label}</span>
          {help && <HelpTip title={label} body={help} />}
        </div>
        <div className="flex shrink-0 items-center gap-2">{children}</div>
      </div>
    </div>
  );
}

function FakeSelect({ value }: { value: string }) {
  return (
    <span className="inline-flex h-8 w-[160px] items-center justify-between rounded-md border border-[var(--app-border-strong)] bg-[var(--app-surface)] px-2.5 text-[13px] text-foreground">
      {value}
      <ChevronDown className="h-3.5 w-3.5 text-[var(--app-fg2)]" />
    </span>
  );
}
