// Download manifest contract shared with the R2 sync job in the main repo
// (cc-switch scripts/generate-download-manifest.mjs). The manifest lives at
// DOWNLOAD_MANIFEST_URL and is regenerated on every release.

export const DOWNLOAD_BASE_URL = (import.meta.env.VITE_DOWNLOAD_BASE_URL || 'https://dl.ccswitch.io').replace(/\/+$/, '');
export const DOWNLOAD_MANIFEST_URL = `${DOWNLOAD_BASE_URL}/manifest.json`;

export type DownloadPlatform = 'macos' | 'windows' | 'linux';
export type DownloadArch = 'universal' | 'x64' | 'arm64';
export type DownloadKind = 'dmg' | 'zip' | 'msi' | 'portable' | 'appimage' | 'deb' | 'rpm';

export interface DownloadFile {
  platform: DownloadPlatform;
  kind: DownloadKind;
  arch: DownloadArch;
  name: string;
  size: number;
  url: string;
}

export interface DownloadManifest {
  version: string;
  tag: string;
  pubDate: string;
  files: DownloadFile[];
}

export const PLATFORM_NAMES: Record<DownloadPlatform, string> = {
  macos: 'macOS',
  windows: 'Windows',
  linux: 'Linux',
};

const PLATFORMS: readonly DownloadPlatform[] = ['macos', 'windows', 'linux'];
const ARCHES: readonly DownloadArch[] = ['universal', 'x64', 'arm64'];
const KINDS: readonly DownloadKind[] = ['dmg', 'zip', 'msi', 'portable', 'appimage', 'deb', 'rpm'];

function isDownloadFile(value: unknown): value is DownloadFile {
  if (typeof value !== 'object' || value === null) return false;
  const file = value as Record<string, unknown>;
  return (
    PLATFORMS.includes(file.platform as DownloadPlatform) &&
    KINDS.includes(file.kind as DownloadKind) &&
    ARCHES.includes(file.arch as DownloadArch) &&
    typeof file.name === 'string' &&
    typeof file.size === 'number' &&
    typeof file.url === 'string' &&
    /^https:\/\//.test(file.url)
  );
}

export function parseDownloadManifest(value: unknown): DownloadManifest | null {
  if (typeof value !== 'object' || value === null) return null;
  const manifest = value as Record<string, unknown>;

  if (typeof manifest.version !== 'string' || typeof manifest.tag !== 'string') return null;
  if (typeof manifest.pubDate !== 'string' || !Array.isArray(manifest.files)) return null;

  const files = manifest.files.filter(isDownloadFile);
  if (files.length === 0) return null;

  return { version: manifest.version, tag: manifest.tag, pubDate: manifest.pubDate, files };
}

// User-Agent Client Hints are Chromium-only; treat them as progressive
// enhancement and fall back to UA sniffing (and to x64 on Windows).
interface NavigatorUAData {
  platform?: string;
  getHighEntropyValues?: (hints: string[]) => Promise<{ architecture?: string }>;
}

function getUAData(): NavigatorUAData | undefined {
  return (navigator as Navigator & { userAgentData?: NavigatorUAData }).userAgentData;
}

export function detectPlatform(): DownloadPlatform | null {
  const ua = navigator.userAgent;
  // Mobile devices cannot install the desktop app; show the neutral layout.
  if (/Android|iPhone|iPad|iPod/i.test(ua)) return null;

  const uaPlatform = getUAData()?.platform;
  if (uaPlatform === 'macOS') return 'macos';
  if (uaPlatform === 'Windows') return 'windows';
  if (uaPlatform === 'Linux') return 'linux';

  if (/Mac/i.test(ua)) return 'macos';
  if (/Win/i.test(ua)) return 'windows';
  if (/Linux|X11/i.test(ua)) return 'linux';
  return null;
}

export async function detectArch(): Promise<Exclude<DownloadArch, 'universal'> | null> {
  try {
    const uaData = getUAData();
    if (!uaData?.getHighEntropyValues) return null;
    const { architecture } = await uaData.getHighEntropyValues(['architecture']);
    if (architecture === 'arm') return 'arm64';
    if (architecture === 'x86') return 'x64';
  } catch {
    // Client hints unavailable or blocked; callers fall back to defaults.
  }
  return null;
}

// The one-click default per platform: macOS dmg, Windows msi, Linux AppImage.
export function pickPrimaryFile(
  manifest: DownloadManifest,
  platform: DownloadPlatform,
  arch: Exclude<DownloadArch, 'universal'> | null,
): DownloadFile | null {
  const kind: DownloadKind = platform === 'macos' ? 'dmg' : platform === 'windows' ? 'msi' : 'appimage';
  const candidates = manifest.files.filter((file) => file.platform === platform && file.kind === kind);
  if (candidates.length === 0) return null;
  return (
    candidates.find((file) => file.arch === 'universal') ??
    candidates.find((file) => file.arch === (arch ?? 'x64')) ??
    candidates[0]
  );
}

export function formatBytes(size: number): string {
  if (size >= 1024 * 1024 * 1024) return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(size / 1024))} KB`;
}
