/** Background refresh after this window (ms). No spinner on revisit within window. */
export const CACHE_STALE_MS = 5 * 60 * 1000;

export function isCacheStale(
  fetchedAt: number | null | undefined,
  staleMs = CACHE_STALE_MS,
): boolean {
  if (fetchedAt == null) {
    return true;
  }
  return Date.now() - fetchedAt > staleMs;
}

export function hasCache(fetchedAt: number | null | undefined): boolean {
  return fetchedAt != null;
}
