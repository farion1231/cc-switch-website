import { useRef, useState } from 'react';
import { BookOpen, Check, ChevronDown, Pencil, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n/useLanguage';
import { AppGlyph } from './AppGlyph';
import { demoAppById, fill, type AppId } from './apps';
import { Btn, Floating, HelpTip, IconBtn, MoreMenu, PaneHeader, SearchField } from './parts';
import { PROMPT_APPS, PROMPT_TARGET, PROMPTS, type SamplePrompt } from './samples';
import { useShell } from './shellContext';

type PromptState = Record<string, { items: SamplePrompt[]; enabled: string | null }>;

export function PromptsPane() {
  const { t, language } = useLanguage();
  const { visibleApps, toast } = useShell();
  const p = t.demo.window.pages;
  const pr = p.prompts;
  const apps = PROMPT_APPS.filter((app) => visibleApps.includes(app) || (app === 'claude' && visibleApps.includes('claude-desktop')));
  const [app, setApp] = useState<AppId>(apps[0] ?? 'claude');
  const [state, setState] = useState<PromptState>(PROMPTS);
  const [query, setQuery] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const picker = useRef<HTMLSpanElement>(null);

  const current = state[app];
  const target = PROMPT_TARGET[app];
  const enabled = current.items.find((item) => item.id === current.enabled) ?? null;
  const q = query.trim().toLowerCase();
  const rows = q
    ? current.items.filter((item) => `${item.name[language]} ${item.description[language]}`.toLowerCase().includes(q))
    : current.items;

  const patch = (next: Partial<PromptState[string]>) => setState((s) => ({ ...s, [app]: { ...s[app], ...next } }));
  const restore = (snapshot: PromptState) => () => {
    setState(snapshot);
    toast({ text: p.common.undone });
  };

  const toggle = (item: SamplePrompt) => {
    const before = state;
    const name = item.name[language];
    if (current.enabled === item.id) {
      patch({ enabled: null });
      toast({ text: fill(pr.toastDisabled, { name, path: target.path }), undo: restore(before) });
    } else {
      patch({ enabled: item.id });
      toast({ text: fill(pr.toastEnabled, { name, path: target.path }), undo: restore(before) });
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PaneHeader
        icon={<BookOpen className="h-[18px] w-[18px]" strokeWidth={2} />}
        title={t.demo.window.nav.prompts}
        extra={
          app === 'hermes' ? (
            <HelpTip title={pr.helpHermesTitle} body={pr.helpHermes} />
          ) : (
            <HelpTip title={pr.helpTitle} body={pr.help} />
          )
        }
        actions={
          <>
            <Btn variant="solid" icon={Plus} hideLabelOnMobile>
              {pr.add}
            </Btn>
            <MoreMenu
              large
              label={pr.moreActions}
              width="w-[300px]"
              items={[
                {
                  label: fill(pr.importCurrent, { file: target.file }),
                  disabled: Boolean(enabled),
                  hint: enabled ? fill(pr.importDuplicate, { name: enabled.name[language] }) : undefined,
                },
                { label: pr.openFolder },
                { label: pr.copyFilePath, onSelect: () => toast({ text: fill(pr.copiedPath, { path: target.path }) }) },
              ]}
            />
          </>
        }
      />

      <div className="mt-0.5 flex h-14 shrink-0 items-center gap-3 px-4 sm:px-6">
        <span ref={picker} className="inline-flex">
          <Btn className="gap-2 pe-2 ps-2.5" onClick={() => setPickerOpen((open) => !open)}>
            <span className="inline-flex items-center gap-2">
              <AppGlyph app={demoAppById[app]} size={16} badgeClassName="border-[var(--app-surface)] bg-[var(--app-surface)]" />
              <span className="hidden sm:inline">{demoAppById[app].label}</span>
              <span className="text-xs font-normal tabular-nums text-[var(--app-fg2)]">{current.items.length}</span>
              <ChevronDown className="h-3.5 w-3.5 text-[var(--app-fg2)]" />
            </span>
          </Btn>
        </span>
        <Floating anchor={picker} open={pickerOpen} onClose={() => setPickerOpen(false)} align="start" className="w-[300px]">
          <div role="listbox" aria-label={pr.appSelect} className="flex flex-col">
            {apps.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setApp(id);
                  setQuery('');
                  setPickerOpen(false);
                }}
                className={cn('flex min-h-8 items-center gap-2 rounded-md pe-2 ps-2.5 text-[13px] hover:bg-[var(--app-subtle)]', id === app && 'font-medium')}
              >
                <AppGlyph app={demoAppById[id]} size={16} badgeClassName="border-[var(--app-surface)] bg-[var(--app-surface)]" />
                <span className="flex-1 text-start">{demoAppById[id].label}</span>
                <span className="text-xs tabular-nums text-[var(--app-fg2)]">{state[id].items.length}</span>
                <Check className={cn('h-3.5 w-3.5', id !== app && 'invisible')} />
              </button>
            ))}
            <div className="mx-1.5 my-1 h-px bg-border" />
            <p className="px-2.5 pb-1.5 pt-1 text-xs text-[var(--app-fg2)]">
              <span className="block">{pr.appNoteDesktop}</span>
              <span className="block">{pr.appNoteOpenclaw}</span>
            </p>
          </div>
        </Floating>
        <span className="min-w-0 shrink truncate text-xs text-[var(--app-fg2)]">
          <span className="hidden sm:inline">{pr.targetFile} </span>
          <code className="font-mono text-xs text-foreground">{target.path}</code> · {enabled ? enabled.size : pr.fileEmpty}
        </span>
        <span className="flex-1" />
        <SearchField value={query} onChange={setQuery} placeholder={pr.searchPlaceholder} className="hidden w-[220px] shrink-0 md:block" />
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-4 pb-5 sm:px-6">
        {rows.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-[10px] border border-border bg-[var(--app-surface)] px-6 py-10 text-center">
            <p className="text-[13px] text-[var(--app-fg2)]">{fill(pr.noSearchResults, { query })}</p>
            <Btn compact onClick={() => setQuery('')}>
              {pr.clearSearch}
            </Btn>
          </div>
        ) : (
          <ul className="min-h-0 overflow-y-auto rounded-[10px] border border-border bg-[var(--app-surface)]">
            {rows.map((item, index) => {
              const on = current.enabled === item.id;
              const name = item.name[language];
              return (
                <li
                  key={item.id}
                  className={cn(
                    'flex h-[60px] items-center gap-3 pe-2 ps-4 transition-colors duration-150 hover:bg-[var(--app-subtle)]',
                    index > 0 && 'border-t border-border',
                    on && 'bg-[var(--app-subtle)]',
                  )}
                >
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-[13px] font-medium text-foreground">{name}</span>
                      {on && (
                        <span className="inline-flex h-[18px] shrink-0 items-center rounded-full bg-[var(--app-success-soft)] px-[7px] text-[11px] font-medium text-[var(--app-success-text)]">
                          {pr.enabled}
                        </span>
                      )}
                    </div>
                    <span className="truncate text-xs text-[var(--app-fg2)]">
                      {item.description[language]} · {item.size} · {item.updated[language]}
                    </span>
                  </div>
                  <Btn compact className="min-w-14" onClick={() => toggle(item)}>
                    {on ? pr.disable : pr.enable}
                  </Btn>
                  <div className="flex gap-1">
                    <IconBtn icon={Pencil} label={p.common.edit} className="hidden sm:inline-flex" />
                    <MoreMenu
                      label={t.demo.window.more}
                      width="w-[240px]"
                      items={[
                        { label: pr.copyToApps },
                        { label: pr.copyContent, onSelect: () => toast({ text: fill(pr.copiedContent, { name }) }) },
                        {
                          label: p.common.delete,
                          danger: true,
                          separatorBefore: true,
                          disabled: on,
                          hint: on ? pr.deleteBlocked : undefined,
                          onSelect: () => {
                            const before = state;
                            patch({ items: current.items.filter((other) => other.id !== item.id) });
                            toast({
                              text: fill(pr.toastDeleted, { name }),
                              detail: fill(pr.toastDeletedSub, { path: target.path }),
                              undo: restore(before),
                            });
                          },
                        },
                      ]}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
