import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Unicode-aware slug generator. Must stay in sync between the markdown
// renderer (which assigns heading IDs) and any TOC that links to them —
// previously diverged and silently broke zh/ja anchor jumps.
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function scrollToAnchor(id: string, offset = 100): void {
  const element = document.getElementById(id);
  if (!element) return;
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;
  window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
}

// Jump to a deep-linked heading the way a native #anchor does. Screenshots
// above it have no reserved size, so each one that finishes loading pushes the
// heading down; re-align after every load until the reader scrolls or 5s pass.
// Returns a cleanup that stops re-aligning.
export function jumpToHeading(id: string): () => void {
  const target = document.getElementById(id);
  if (!target) return () => {};
  target.scrollIntoView();

  const pending = [...document.querySelectorAll('img')].filter(
    (img) => !img.complete && img.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING,
  );
  if (pending.length === 0) return () => {};

  const realign = () => target.scrollIntoView();
  const stop = () => {
    window.clearTimeout(timer);
    pending.forEach((img) => img.removeEventListener('load', realign));
    ['wheel', 'touchmove', 'keydown'].forEach((type) => window.removeEventListener(type, stop));
  };
  const timer = window.setTimeout(stop, 5000);
  pending.forEach((img) => img.addEventListener('load', realign));
  ['wheel', 'touchmove', 'keydown'].forEach((type) => window.addEventListener(type, stop, { passive: true }));
  return stop;
}

export function displayDomain(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
}
