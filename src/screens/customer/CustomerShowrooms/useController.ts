import {useCallback, useEffect, useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';
import {getApiErrorMessage} from '../../../api';
import {
  publicSiteFollowService,
  publicSiteShowroomsService,
} from '../../../services';
import {
  mapPublicShowroomList,
  type PublicShowroom,
} from '../../../utils/publicShowrooms';

export function useCustomerShowroomsController() {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');
  const [chip, setChip] = useState('All');
  const [rows, setRows] = useState<PublicShowroom[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchShowrooms = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, unknown> = {per_page: 50};
      const q = search.trim();
      if (q) {
        params.search = q;
      }
      const res = await publicSiteShowroomsService.listPublicShowrooms(params);
      setRows(mapPublicShowroomList(res));
    } catch (error) {
      showMessage({
        message: getApiErrorMessage(error, 'Failed to load showrooms'),
        type: 'danger',
      });
      setRows([]);
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(() => fetchShowrooms(), search ? 350 : 0);
    return () => clearTimeout(t);
  }, [fetchShowrooms, search]);

  const data = useMemo(() => {
    return rows.filter(item => {
      if (chip === 'Verified' && !item.verified) return false;
      if (chip === 'Nearby' && !item.nearby) return false;
      if (chip === 'Top Rated' && !item.topRated) return false;
      if (chip === 'Following' && !item.following) return false;
      return true;
    });
  }, [chip, rows]);

  const toggleFollow = useCallback(async (item: PublicShowroom) => {
    const nextFollowing = !item.following;
    setRows(prev =>
      prev.map(s =>
        s.id === item.id ? {...s, following: nextFollowing} : s,
      ),
    );
    try {
      if (nextFollowing) {
        await publicSiteFollowService.createPublicFollows({
          showroom_id: item.showroomId || item.id,
        });
      } else {
        await publicSiteFollowService.deletePublicFollowsById(
          item.showroomId || item.id,
        );
      }
    } catch (error) {
      setRows(prev =>
        prev.map(s =>
          s.id === item.id ? {...s, following: !nextFollowing} : s,
        ),
      );
      showMessage({
        message: getApiErrorMessage(error, 'Could not update follow'),
        type: 'danger',
      });
    }
  }, []);

  const onOpenShowroom = useCallback(
    (item: PublicShowroom) => {
      navigation.navigate('CustomerShowroomDetail', {
        showroomId: item.slug || item.id,
      });
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
    onRefresh: fetchShowrooms,
    toggleFollow,
    onOpenShowroom,
  };
}
