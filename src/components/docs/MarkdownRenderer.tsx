import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn, slugify } from '@/lib/utils';
import { Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

type PrismModule = typeof import('prismjs');

const normalizePrismLanguage = (language: string) => {
  const normalized = language.toLowerCase();

  if (normalized === 'js') return 'javascript';
  if (normalized === 'ts') return 'typescript';
  if (['shell', 'sh', 'zsh', 'terminal'].includes(normalized)) return 'bash';
  if (normalized === 'py') return 'python';

  return normalized;
};

let prismPromise: Promise<PrismModule> | null = null;
const prismLanguagePromises = new Map<string, Promise<unknown>>();

const loadPrismCore = () => {
  prismPromise ??= import('prismjs');
  return prismPromise;
};

const prismLanguageLoaders: Record<string, () => Promise<unknown>> = {
  javascript: () => import('prismjs/components/prism-javascript'),
  typescript: async () => {
    await loadPrismLanguage('javascript');
    return import('prismjs/components/prism-typescript');
  },
  jsx: async () => {
    await loadPrismLanguage('javascript');
    return import('prismjs/components/prism-jsx');
  },
  tsx: async () => {
    await loadPrismLanguage('jsx');
    await loadPrismLanguage('typescript');
    return import('prismjs/components/prism-tsx');
  },
  bash: () => import('prismjs/components/prism-bash'),
  json: () => import('prismjs/components/prism-json'),
  css: () => import('prismjs/components/prism-css'),
  sql: () => import('prismjs/components/prism-sql'),
  python: () => import('prismjs/components/prism-python'),
  lua: () => import('prismjs/components/prism-lua'),
};

async function loadPrismLanguage(language: string) {
  await loadPrismCore();

  const normalized = normalizePrismLanguage(language);
  const loader = prismLanguageLoaders[normalized];

  if (!loader) return;

  if (!prismLanguagePromises.has(normalized)) {
    prismLanguagePromises.set(normalized, loader());
  }

  await prismLanguagePromises.get(normalized);
}

async function loadPrism(language: string) {
  const prism = await loadPrismCore();
  await loadPrismLanguage(language);
  return prism;
}

function CodeBlock({ className, children }: { className?: string; children: string }) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);
  
  // Extract language from className (e.g., "language-javascript")
  const language = className?.replace('language-', '') || 'text';
  
  useEffect(() => {
    let isActive = true;
    const codeElement = codeRef.current;

    if (!codeElement) return;

    loadPrism(language)
      .then((Prism) => {
        if (isActive) {
          Prism.highlightElement(codeElement);
        }
      })
      .catch((error: unknown) => {
        if (import.meta.env.DEV) {
          console.warn('Failed to load Prism language:', language, error);
        }
      });

    return () => {
      isActive = false;
    };
  }, [children, language]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative max-w-full">
      <div className="absolute right-2 top-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
        <button
          onClick={handleCopy}
          className="p-2 rounded-lg bg-muted/80 hover:bg-muted border border-border/50 transition-colors"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      </div>
      <div className="absolute left-3 top-2 text-xs text-muted-foreground/60 uppercase tracking-wider">
        {language}
      </div>
      <pre className="max-w-full overflow-x-auto rounded-xl border border-border bg-card px-4 pb-4 pt-10 text-sm">
        <code ref={codeRef} className={`language-${language}`}>
          {children}
        </code>
      </pre>
    </div>
  );
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn('prose-docs max-w-full [overflow-wrap:anywhere]', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => {
            const id = slugify(String(children));
            return (
              <h1 id={id} className="mb-6 mt-8 scroll-mt-24 border-b border-border pb-4 text-3xl font-bold text-foreground first:mt-0 md:text-4xl">
                {children}
              </h1>
            );
          },
          h2: ({ children }) => {
            const id = slugify(String(children));
            return (
              <h2 id={id} className="mb-4 mt-10 scroll-mt-24 text-2xl font-semibold text-foreground md:text-3xl">
                {children}
              </h2>
            );
          },
          h3: ({ children }) => {
            const id = slugify(String(children));
            return (
              <h3 id={id} className="mb-3 mt-8 scroll-mt-24 text-xl font-semibold text-foreground md:text-2xl">
                {children}
              </h3>
            );
          },
          h4: ({ children }) => {
            const id = slugify(String(children));
            return (
              <h4 id={id} className="text-lg font-semibold text-foreground mb-2 mt-6 scroll-mt-24">
                {children}
              </h4>
            );
          },
          p: ({ children }) => (
            <p className="mb-4 leading-7 text-muted-foreground">
              {children}
            </p>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 ml-5 list-outside list-disc space-y-2 text-muted-foreground sm:ml-6">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 ml-5 list-outside list-decimal space-y-2 text-muted-foreground sm:ml-6">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-7">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/50 pl-4 py-2 my-4 bg-muted/30 rounded-r-lg text-muted-foreground">
              {children}
            </blockquote>
          ),
          code: ({ className, children, ...props }) => {
            const codeString = String(children).replace(/\n$/, '');
            // Block code: has a language class OR contains newlines (multi-line)
            const isBlock = className?.includes('language-') || codeString.includes('\n');
            
            if (isBlock) {
              return <CodeBlock className={className}>{codeString}</CodeBlock>;
            }
            
            return (
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary break-all" {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => {
            // Just pass through - the code component handles the pre styling
            return <>{children}</>;
          },
          table: ({ children }) => (
            <div className="mb-6 max-w-full overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-max border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted/50">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="border-b border-border px-3 py-3 text-left font-semibold text-foreground sm:px-4">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-border px-3 py-3 text-muted-foreground sm:px-4">
              {children}
            </td>
          ),
          hr: () => (
            <hr className="border-border my-8" />
          ),
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt}
              className="my-6 max-w-full rounded-xl border border-border shadow-lg"
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
