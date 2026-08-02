import {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {HomeStackParamList} from '../../../navigation/types';
import type {HiringPipelineController, PipelineColumn} from './module';

type HiringPipelineNav = NativeStackNavigationProp<
  HomeStackParamList,
  'HiringPipeline'
>;

const COLUMNS: PipelineColumn[] = [
  {
    id: 'applied',
    label: 'Applied',
    count: 157,
    borderColor: '#93C5FD',
    candidates: [
      {id: 'c1', name: 'Marium Tariq', movedLabel: 'Moved 2h ago'},
      {id: 'c2', name: 'Hira Ahmed', movedLabel: 'Moved 2h ago'},
      {id: 'c3', name: 'Faisal Rehman', movedLabel: 'Moved 2h ago'},
    ],
    extraCount: 154,
  },
  {
    id: 'screening',
    label: 'Screening',
    count: 48,
    borderColor: '#60A5FA',
    candidates: [
      {id: 'c4', name: 'Zainab Aslam', movedLabel: 'Moved 2h ago'},
      {id: 'c5', name: 'Usman Javed', movedLabel: 'Moved 2h ago'},
    ],
    extraCount: 46,
  },
  {
    id: 'interview',
    label: 'Interview',
    count: 22,
    borderColor: '#FDBA74',
    candidates: [
      {id: 'c6', name: 'Ali Hasan', movedLabel: 'Moved 2h ago'},
      {id: 'c7', name: 'Faisal Rehman', movedLabel: 'Moved 2h ago'},
    ],
    extraCount: 20,
  },
  {
    id: 'offer',
    label: 'Offer',
    count: 6,
    borderColor: '#C4B5FD',
    candidates: [
      {id: 'c8', name: 'Ali Hasan', movedLabel: 'Moved 2h ago'},
    ],
    extraCount: 5,
  },
  {
    id: 'hired',
    label: 'Hired',
    count: 3,
    borderColor: '#86EFAC',
    candidates: [
      {id: 'c9', name: 'Nadia Iqbal', movedLabel: 'Moved 2h ago'},
    ],
    extraCount: 2,
  },
];

export function useHiringPipelineController(): HiringPipelineController {
  const navigation = useNavigation<HiringPipelineNav>();

  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return {
    summary: '236 candidates in pipeline · 3 offers extended this week',
    columns: COLUMNS,
    onBackPress,
  };
}
