import {useCallback, useEffect, useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';
import {getApiErrorMessage} from '../../../api';
import {publicSiteAuctionsService} from '../../../services';
import {
  mapPublicAuctionList,
  type PublicAuction,
} from '../../../utils/publicAuctions';

export function useCustomerAuctionController() {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');
  const [chip, setChip] = useState('Live');
  const [rows, setRows] = useState<PublicAuction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAuctions = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, unknown> = {per_page: 50};
      const q = search.trim();
      if (q) {
        params.search = q;
      }
      const res = await publicSiteAuctionsService.listAuctions(params);
      setRows(mapPublicAuctionList(res));
    } catch (error) {
      showMessage({
        message: getApiErrorMessage(error, 'Failed to load auctions'),
        type: 'danger',
      });
      setRows([]);
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(() => fetchAuctions(), search ? 350 : 0);
    return () => clearTimeout(t);
  }, [fetchAuctions, search]);

  const data = useMemo(() => {
    return rows.filter(a => {
      if (chip === 'Ending soon' && !a.endingSoon) return false;
      if (chip === 'Watching' && !a.watching) return false;
      if (chip === 'Won') return false;
      return true;
    });
  }, [chip, rows]);

  const toggleWatch = useCallback(async (item: PublicAuction) => {
    const next = !item.watching;
    setRows(prev =>
      prev.map(a =>
        a.id === item.id
          ? {
              ...a,
              watching: next,
              watchers: next ? a.watchers + 1 : Math.max(0, a.watchers - 1),
            }
          : a,
      ),
    );
    try {
      if (next) {
        await publicSiteAuctionsService.watch(item.id);
      } else {
        await publicSiteAuctionsService.unwatch(item.id);
      }
    } catch (error) {
      setRows(prev =>
        prev.map(a =>
          a.id === item.id
            ? {
                ...a,
                watching: !next,
                watchers: !next
                  ? a.watchers + 1
                  : Math.max(0, a.watchers - 1),
              }
            : a,
        ),
      );
      showMessage({
        message: getApiErrorMessage(error, 'Could not update watchlist'),
        type: 'danger',
      });
    }
  }, []);

  const onPlaceBid = useCallback(
    (item: PublicAuction) => {
      navigation.navigate('CustomerPlaceBid', {auctionId: item.id});
    },
    [navigation],
  );

  return {
    search,
    setSearch,
    chip,
    setChip,
    data,
    isLoading,
    onRefresh: fetchAuctions,
    toggleWatch,
    onPlaceBid,
  };
}
