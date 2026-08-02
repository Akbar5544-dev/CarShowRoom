import {colors as defaultColors, useThemeColors} from '../../../theme';
import {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {HomeStackParamList} from '../../../navigation/types';
import type {
  JobsOnboardingController,
  NewHireItem,
  OnboardingTask,
} from './module';

type JobsOnboardingNav = NativeStackNavigationProp<
  HomeStackParamList,
  'JobsOnboarding'
>;

const NEW_HIRES: NewHireItem[] = [
  {
    id: 'hire-1',
    name: 'Nadia Iqbal',
    role: 'Rental Agent · starts Nov 25',
    progress: 60,
    initials: 'NI',
    avatarColor: defaultColors.brandBlue,
  },
  {
    id: 'hire-2',
    name: 'Ali Hasan',
    role: 'Fleet Manager · starts Dec 01',
    progress: 20,
    initials: 'AH',
    avatarColor: '#8B5CF6',
  },
  {
    id: 'hire-3',
    name: 'Zainab Aslam',
    role: 'Auto Technician · starts Dec 05',
    progress: 10,
    initials: 'ZA',
    avatarColor: '#20B46B',
  },
];

const NADIA_CHECKLIST: OnboardingTask[] = [
  {id: 'task-1', label: 'Sign employment contract', completed: true},
  {id: 'task-2', label: 'Complete tax documentation', completed: true},
  {id: 'task-3', label: 'IT setup (laptop, email, VPN)', completed: true},
  {id: 'task-4', label: 'HR orientation', completed: false},
  {id: 'task-5', label: 'Department training', completed: false},
  {id: 'task-6', label: 'Fleet system access', completed: false},
  {id: 'task-7', label: 'Uniform & ID card', completed: false},
];

export function useJobsOnboardingController(): JobsOnboardingController {
  const colors = useThemeColors();
  const navigation = useNavigation<JobsOnboardingNav>();

  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onHiringPress = useCallback(() => {
    navigation.navigate('HiringPipeline');
  }, [navigation]);

  const onAssignPress = useCallback((_taskId: string) => {}, []);

  return {
    summary: '3 new hires in progress · 1 completing this week',
    newHires: NEW_HIRES,
    checklistRole: 'Rental Agent',
    checklistTitle: 'Nadia Iqbal · Checklist',
    checklist: NADIA_CHECKLIST,
    onBackPress,
    onHiringPress,
    onAssignPress,
  };
}
