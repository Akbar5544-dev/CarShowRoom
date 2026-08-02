import {useCallback, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {showMessage} from 'react-native-flash-message';
import {getApiErrorMessage} from '../../../api';
import type {HomeStackParamList} from '../../../navigation/types';
import {publicSiteJobsService} from '../../../services';
import {asRecord, pickNumber, unwrapList} from '../../../utils/apiHelpers';
import {mapPublicJobListItem} from '../../../utils/publicJobs';
import type {OpenPositionItem, OpenPositionsController} from './module';

type OpenPositionsNav = NativeStackNavigationProp<
  HomeStackParamList,
  'OpenPositions'
>;

function mapPosition(item: unknown): OpenPositionItem {
  const mapped = mapPublicJobListItem(item);
  const row = asRecord(item);
  const applicants = pickNumber(row, [
    'applicant_count',
    'applications_count',
    'applicants',
  ]);
  const statusRaw = String(row.status || 'open').toLowerCase();
  let status: OpenPositionItem['status'] = 'open';
  if (statusRaw.includes('close')) {
    status = 'closed';
  } else if (statusRaw.includes('interview')) {
    status = 'interviewing';
  }

  return {
    id: mapped.id,
    title: mapped.title,
    department: mapped.department,
    employmentType: mapped.employmentType,
    status,
    location: mapped.city,
    applicantCount: applicants,
    salaryRange: mapped.salaryLabel,
  };
}

export function useOpenPositionsController(): OpenPositionsController {
  const navigation = useNavigation<OpenPositionsNav>();
  const [positions, setPositions] = useState<OpenPositionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPositions = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await publicSiteJobsService.listPublicJobs({per_page: 50});
      setPositions(unwrapList(res).map(mapPosition));
    } catch (error) {
      showMessage({
        message: getApiErrorMessage(error, 'Failed to load open positions'),
        type: 'danger',
      });
      setPositions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onPostJobPress = useCallback(() => {
    navigation.navigate('PostJob');
  }, [navigation]);

  const onViewApplicantsPress = useCallback(
    (jobId: string) => {
      navigation.navigate('Applications', {jobId});
    },
    [navigation],
  );

  const openCount = positions.filter(item => item.status === 'open').length;

  return {
    isLoading,
    summary: isLoading
      ? 'Loading positions…'
      : `${openCount} open · ${positions.length} total on public board`,
    positions,
    emptyMessage:
      'No public job posts yet. Post Job UI is ready, but the API has no create endpoint for hiring posts — only /public/jobs browse + apply.',
    onBackPress,
    onPostJobPress,
    onViewApplicantsPress,
    onRefresh: fetchPositions,
  };
}
