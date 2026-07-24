import { useEffect, useState } from 'react';
import { DOWNLOAD_MANIFEST_URL, parseDownloadManifest, type DownloadManifest } from '@/lib/downloads';

// Module-level cache so navigating back to the page doesn't refetch.
let cachedManifest: DownloadManifest | null = null;
let pendingFetch: Promise<DownloadManifest | null> | null = null;

async function fetchManifest(): Promise<DownloadManifest | null> {
  try {
    const response = await fetch(DOWNLOAD_MANIFEST_URL);
    if (!response.ok) return null;
    return parseDownloadManifest(await response.json());
  } catch {
    return null;
  }
}

interface DownloadManifestState {
  manifest: DownloadManifest | null;
  loading: boolean;
}

export function useDownloadManifest(): DownloadManifestState {
  const [manifest, setManifest] = useState<DownloadManifest | null>(cachedManifest);
  const [loading, setLoading] = useState(cachedManifest === null);

  useEffect(() => {
    if (cachedManifest) return;

    let cancelled = false;
    pendingFetch ??= fetchManifest();

    pendingFetch.then((result) => {
      if (result) {
        cachedManifest = result;
      } else {
        // Failed fetches are not cached so a later visit can retry.
        pendingFetch = null;
      }
      if (!cancelled) {
        setManifest(result);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { manifest, loading };
}
