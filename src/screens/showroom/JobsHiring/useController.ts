import {useCallback, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {showMessage} from 'react-native-flash-message';
import {getApiErrorMessage} from '../../../api';
import type {MetricCardData} from '../../../components';
import type {HomeStackParamList} from '../../../navigation/types';
import {publicSiteJobsService} from '../../../services';
import {colors as defaultColors, useThemeColors} from '../../../theme';
import {unwrapList} from '../../../utils/apiHelpers';
import {mapPublicJobListItem} from '../../../utils/publicJobs';
import type {
  CandidateItem,
  JobsHiringController,
  PipelineStage,
} from './module';

type JobsHiringNav = NativeStackNavigationProp<
  HomeStackParamList,
  'JobsHiring'
>;

function buildMetrics(openPositions: number): MetricCardData[] {
  return [
    {
      id: 'open-positions',
      label: 'Open Positions',
      value: String(openPositions),
      change: 'live',
      positive: true,
      backgroundColor: defaultColors.staffMetricBlue,
      icon: 'briefcase',
      iconBg: defaultColors.actionTint12,
      sparklineColor: defaultColors.actionBlue,
      sparklinePoints: [3, 4, 3, 4, 5, 4, 5, openPositions || 1],
    },
    {
      id: 'applications',
      label: 'Applications',
      value: '—',
      change: 'API n/a',
      positive: true,
      backgroundColor: defaultColors.staffMetricGreen,
      icon: 'customers',
      iconBg: 'rgba(32,180,107,0.12)',
      sparklineColor: defaultColors.successBright,
      sparklinePoints: [1, 1, 1, 1, 1, 1, 1, 1],
    },
    {
      id: 'interviews',
      label: 'Interviews',
      value: '—',
      change: 'API n/a',
      positive: true,
      backgroundColor: defaultColors.staffMetricOrange,
      icon: 'videoCamera',
      iconBg: 'rgba(245,158,11,0.14)',
      sparklineColor: defaultColors.late,
      sparklinePoints: [1, 1, 1, 1, 1, 1, 1, 1],
    },
    {
      id: 'hired',
      label: 'Hired (MTD)',
      value: '—',
      change: 'API n/a',
      positive: true,
      backgroundColor: defaultColors.staffMetricPurple,
      icon: 'hiredPerson',
      iconBg: 'rgba(139,92,246,0.12)',
      sparklineColor: defaultColors.deptSales,
      sparklinePoints: [1, 1, 1, 1, 1, 1, 1, 1],
    },
  ];
}

function buildPipeline(openPositions: number): PipelineStage[] {
  return [
    {
      id: 'applied',
      label: 'Applied',
      count: 0,
      background: defaultColors.statusRented,
    },
    {
      id: 'screening',
      label: 'Screening',
      count: 0,
      background: '#8B5CF6',
    },
    {
      id: 'interview',
      label: 'Interview',
      count: 0,
      background: '#F59E0B',
    },
    {
      id: 'offer',
      label: 'Offer',
      count: 0,
      background: '#20B46B',
      wide: true,
    },
    {
      id: 'hired',
      label: 'Open roles',
      count: openPositions,
      background: defaultColors.actionBlue,
      wide: true,
    },
  ];
}

export function useJobsHiringController(): JobsHiringController {
  useThemeColors();
  const navigation = useNavigation<JobsHiringNav>();
  const [metrics, setMetrics] = useState<MetricCardData[]>(() =>
    buildMetrics(0),
  );
  const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>(() =>
    buildPipeline(0),
  );
  const [candidates] = useState<CandidateItem[]>([]);
  const [summary, setSummary] = useState('Loading hiring board…');

  const fetchData = useCallback(async () => {
    try {
      const res = await publicSiteJobsService.listPublicJobs({per_page: 50});
      const jobs = unwrapList(res).map(mapPublicJobListItem);
      const openCount = jobs.length;
      setMetrics(buildMetrics(openCount));
      setPipelineStages(buildPipeline(openCount));
      setSummary(
        openCount > 0
          ? `${openCount} public openings · applications/interviews APIs not in backend`
          : 'No public openings yet · hiring CRUD APIs not available in Swagger',
      );
    } catch (error) {
      showMessage({
        message: getApiErrorMessage(error, 'Failed to load jobs board'),
        type: 'danger',
      });
      setSummary('Could not load public jobs');
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onInterviewsPress = useCallback(() => {
    navigation.navigate('InterviewSchedule');
  }, [navigation]);

  const onOpenPositionsPress = useCallback(() => {
    navigation.navigate('OpenPositions');
  }, [navigation]);

  const onPipelinePress = useCallback(() => {
    navigation.navigate('HiringPipeline');
  }, [navigation]);

  const onCandidatePress = useCallback(
    (id: string) => {
      navigation.navigate('ReviewApplication', {applicationId: id});
    },
    [navigation],
  );

  return {
    summary,
    metrics,
    pipelineStages,
    candidates,
    onBackPress,
    onInterviewsPress,
    onOpenPositionsPress,
    onPipelinePress,
    onCandidatePress,
  };
}
