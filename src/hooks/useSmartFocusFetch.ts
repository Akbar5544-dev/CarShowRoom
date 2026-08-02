import {useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {CACHE_STALE_MS, hasCache, isCacheStale} from '../constants/cache';

type FetchOptions = {
  silent?: boolean;
  force?: boolean;
};

/**
 * Cache-first screen fetch:
 * - First visit (no cache): visible loader
 * - Revisit with fresh cache: skip network
 * - Revisit with stale cache: silent background refresh (no spinner)
 */
export function useSmartFocusFetch(
  fetchedAt: number | null | undefined,
  fetch: (options: FetchOptions) => void,
  staleMs = CACHE_STALE_MS,
) {
  useFocusEffect(
    useCallback(() => {
      if (!hasCache(fetchedAt)) {
        fetch({silent: false});
        return;
      }
      if (isCacheStale(fetchedAt, staleMs)) {
        fetch({silent: true});
      }
    }, [fetch, fetchedAt, staleMs]),
  );
}
