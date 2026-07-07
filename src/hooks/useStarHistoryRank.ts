import { useState, useEffect } from 'react';

/**
 * Fetches the star-history.com badge SVG and extracts the repo's
 * real-time GitHub global star rank (the "Global Rank #N" text).
 * Returns null until loaded, or on fetch/parse failure.
 */
export function useStarHistoryRank(repo: string = 'farion1231/cc-switch'): number | null {
  const [rank, setRank] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchRank = async () => {
      try {
        const response = await fetch(`https://api.star-history.com/badge?repo=${repo}`);
        if (!response.ok) return;
        const svg = await response.text();
        const match = svg.match(/Global Rank #([\d,]+)/i);
        if (match && !cancelled) {
          setRank(Number(match[1].replace(/,/g, '')));
        }
      } catch (error) {
        console.error('Failed to fetch star-history rank:', error);
      }
    };

    fetchRank();
    return () => {
      cancelled = true;
    };
  }, [repo]);

  return rank;
}
