import { useState, useEffect } from 'react';

interface RepoStats {
  stars: number | null;
  downloads: number | null;
  version: string | null;
  forks: number | null;
  loading: boolean;
  formattedStars: string;
  formattedDownloads: string;
}

type FetchedStats = Pick<RepoStats, 'stars' | 'downloads' | 'version' | 'forks'>;

interface GitHubRelease {
  tag_name?: string;
  draft?: boolean;
  prerelease?: boolean;
  assets?: Array<{ download_count?: number }>;
}

// The hero and the features section both read these stats; share one request
// per page load so the unauthenticated GitHub rate limit (60/hour) lasts.
const statsRequests = new Map<string, Promise<FetchedStats>>();

async function fetchStats(repo: string): Promise<FetchedStats> {
  const stats: FetchedStats = { stars: null, downloads: null, version: null, forks: null };
  try {
    const repoResponse = await fetch(`https://api.github.com/repos/${repo}`);
    if (repoResponse.ok) {
      const data = await repoResponse.json();
      stats.stars = data.stargazers_count;
      stats.forks = data.forks_count;
    }

    // One page of 100 covers every release so far; the default page of 30 undercounted downloads.
    const releasesResponse = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=100`);
    if (releasesResponse.ok) {
      const releases: GitHubRelease[] = await releasesResponse.json();
      // The hero badge says "released", so skip pre-releases.
      const latest = releases.find((release) => !release.draft && !release.prerelease);
      stats.version = latest?.tag_name?.replace(/^v/, '') || null;
      stats.downloads = releases.reduce(
        (total, release) =>
          total + (release.assets ?? []).reduce((sum, asset) => sum + (asset.download_count ?? 0), 0),
        0,
      );
    }
  } catch (error) {
    console.error('Failed to fetch stats:', error);
  }
  return stats;
}

export function useGitHubStats(repo: string = 'farion1231/cc-switch'): RepoStats {
  const [stats, setStats] = useState<FetchedStats | null>(null);

  useEffect(() => {
    let active = true;
    let request = statsRequests.get(repo);
    if (!request) {
      request = fetchStats(repo);
      statsRequests.set(repo, request);
    }
    request.then((result) => {
      if (active) setStats(result);
    });
    return () => {
      active = false;
    };
  }, [repo]);

  const formatNumber = (count: number | null): string => {
    if (count === null) return '...';
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return {
    stars: stats?.stars ?? null,
    downloads: stats?.downloads ?? null,
    version: stats?.version ?? null,
    forks: stats?.forks ?? null,
    loading: stats === null,
    formattedStars: formatNumber(stats?.stars ?? null),
    formattedDownloads: formatNumber(stats?.downloads ?? null),
  };
}
