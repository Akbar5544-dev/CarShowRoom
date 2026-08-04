import {useCallback, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {showMessage} from 'react-native-flash-message';
import {getApiErrorMessage} from '../../../api';
import type {CustomerJobsStackParamList} from '../../../navigation/types';
import {publicSiteJobsService} from '../../../services';
import {unwrapList} from '../../../utils/apiHelpers';
import {
  mapPublicJobFilters,
  mapPublicJobListItem,
  type PublicJobListItem,
} from '../../../utils/publicJobs';
type Nav = NativeStackNavigationProp<
  CustomerJobsStackParamList,
  'CustomerJobsList'
>;

export function useCustomerJobsController() {
  const navigation = useNavigation<Nav>();
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [jobs, setJobs] = useState<PublicJobListItem[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<string[]>([]);
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null,
  );
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, unknown> = {per_page: 50};
      const query = search.trim();
      if (query) {
        params.search = query;
      }
      if (selectedDepartment) {
        params.department = selectedDepartment;
      }
      if (selectedCity) {
        params.city = selectedCity;
      }

      const [jobsRes, filtersRes] = await Promise.all([
        publicSiteJobsService.listPublicJobs(params),
        publicSiteJobsService.getPublicJobsFilters().catch(() => null),
      ]);

      setJobs(unwrapList(jobsRes).map(mapPublicJobListItem));

      if (filtersRes) {
        const filters = mapPublicJobFilters(filtersRes);
        setDepartmentOptions(filters.departments);
        setCityOptions(filters.cities);
      }
    } catch (error) {
      showMessage({
        message: getApiErrorMessage(error, 'Failed to load jobs'),
        type: 'danger',
      });
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedCity, selectedDepartment]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs();
    }, search ? 350 : 0);
    return () => clearTimeout(timer);
  }, [fetchJobs, search]);

  const onJobPress = useCallback(
    (job: PublicJobListItem) => {
      navigation.navigate('CustomerJobDetail', {
        idOrSlug: job.slug || job.id,
        title: job.title,
      });
    },
    [navigation],
  );

  return {
    isLoading,
    search,
    jobs,
    departmentOptions,
    cityOptions,
    selectedDepartment,
    selectedCity,
    emptyMessage:
      'No open roles right now. Check back soon — showrooms post openings here.',
    setSearch,
    setSelectedDepartment,
    setSelectedCity,
    onRefresh: fetchJobs,
    onJobPress,
  };
}
