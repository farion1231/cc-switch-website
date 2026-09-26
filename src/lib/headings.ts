import { slugify } from './utils';

// Heading ids follow GitHub: the rendered text is slugified, and repeated
// headings get -1, -2... suffixes in document order. The markdown renderer
// (from the rendered tree) and every table of contents (from the markdown
// source) must produce the same ids, so both go through this module.

export function createSlugger(): (text: string) => string {
  const occurrences = new Map<string, number>();
  return (text) => {
    const base = slugify(text);
    let id = base;
    while (occurrences.has(id)) {
      const count = (occurrences.get(base) ?? 0) + 1;
      occurrences.set(base, count);
      id = `${base}-${count}`;
    }
    occurrences.set(id, 0);
    return id;
  };
}

// Reduce a heading's markdown source to the text it renders as.
function headingPlainText(source: string): string {
  return source
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/`+([^`]*)`+/g, '$1')
    .replace(/(\*\*|__)(.+?)\1/g, '$2')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/\\([\\`*_{}[\]()#+\-.!])/g, '$1')
    .trim();
}

export interface MarkdownHeading {
  level: number;
  text: string;
  id: string;
}

// ATX headings outside fenced code blocks, with the ids the renderer assigns.
export function extractHeadings(markdown: string): MarkdownHeading[] {
  const slug = createSlugger();
  const headings: MarkdownHeading[] = [];
  let fence: string | null = null;

  for (const line of markdown.split('\n')) {
    const fenceMatch = /^ {0,3}(`{3,}|~{3,})/.exec(line);
    if (fence) {
      const closing = fenceMatch?.[1];
      if (closing && closing[0] === fence[0] && closing.length >= fence.length && !line.trim().slice(closing.length)) {
        fence = null;
      }
      continue;
    }
    if (fenceMatch) {
      fence = fenceMatch[1];
      continue;
    }

    const match = /^ {0,3}(#{1,6})\s+(.+?)(?:\s+#+)?\s*$/.exec(line);
    if (!match) continue;
    const text = headingPlainText(match[2]);
    headings.push({ level: match[1].length, text, id: slug(text) });
  }

  return headings;
}

interface HastNode {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

function textContent(node: HastNode): string {
  if (node.type === 'text') return node.value ?? '';
  return node.children?.map(textContent).join('') ?? '';
}

// Rehype plugin: assign heading ids from the rendered text, deduplicated.
export function rehypeHeadingIds() {
  return (tree: HastNode) => {
    const slug = createSlugger();
    const visit = (node: HastNode) => {
      if (node.type === 'element' && node.tagName && /^h[1-6]$/.test(node.tagName)) {
        node.properties = { ...node.properties, id: slug(textContent(node)) };
        return;
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}
