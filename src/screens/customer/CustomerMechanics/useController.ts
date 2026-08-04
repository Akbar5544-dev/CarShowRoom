import {useCallback, useEffect, useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';
import {getApiErrorMessage} from '../../../api';
import {publicSiteMechanicsService} from '../../../services';
import {
  mapPublicMechanicList,
  type PublicMechanic,
} from '../../../utils/publicMechanics';

export function useCustomerMechanicsController() {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');
  const [chip, setChip] = useState('All');
  const [rows, setRows] = useState<PublicMechanic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMechanics = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, unknown> = {per_page: 50};
      const q = search.trim();
      if (q) {
        params.search = q;
      }
      const res = await publicSiteMechanicsService.listMechanics(params);
      setRows(mapPublicMechanicList(res));
    } catch (error) {
      showMessage({
        message: getApiErrorMessage(error, 'Failed to load mechanics'),
        type: 'danger',
      });
      setRows([]);
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(() => fetchMechanics(), search ? 350 : 0);
    return () => clearTimeout(t);
  }, [fetchMechanics, search]);

  const data = useMemo(() => {
    return rows.filter(m => {
      if (chip === 'Nearby' && !m.nearby) return false;
      if (chip === 'Top Rated' && m.rating < 4.7) return false;
      if (chip === 'AC / Hybrid') {
        const s = m.specialty.toLowerCase();
        if (!s.includes('ac') && !s.includes('hybrid')) return false;
      }
      if (chip === 'Body Work' && !m.specialty.toLowerCase().includes('body')) {
        return false;
      }
      return true;
    });
  }, [chip, rows]);

  return {
    search,
    setSearch,
    chip,
    setChip,
    data,
    isLoading,
    onRefresh: fetchMechanics,
    navigation,
  };
}
