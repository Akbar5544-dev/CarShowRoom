import {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {HomeStackParamList} from '../../../navigation/types';
import type {
  InterviewCardData,
  InterviewScheduleController,
} from './module';

type InterviewNav = NativeStackNavigationProp<
  HomeStackParamList,
  'InterviewSchedule'
>;

const INTERVIEWS: InterviewCardData[] = [
  {
    id: 'ali-hasan',
    candidateName: 'Ali Hasan',
    position: 'Senior Fleet Manager',
    status: 'Upcoming',
    scheduleLabel: 'Today · 15:00',
    mode: 'Video call',
    interviewers: '3 interviewers',
  },
  {
    id: 'faisal-rehman',
    candidateName: 'Faisal Rehman',
    position: 'Rental Agent',
    status: 'Upcoming',
    scheduleLabel: 'Tomorrow · 11:30',
    mode: 'In-person',
    interviewers: 'HR + Manager',
  },
  {
    id: 'usman-javed',
    candidateName: 'Usman Javed',
    position: 'Data Analyst',
    status: 'Scheduled',
    scheduleLabel: 'Nov 23 · 14:00',
    mode: 'Video call',
    interviewers: '2 interviewers',
  },
  {
    id: 'zainab-aslam',
    candidateName: 'Zainab Aslam',
    position: 'Automotive Technician',
    status: 'Scheduled',
    scheduleLabel: 'Nov 24 · 10:00',
    mode: 'In-person',
    interviewers: 'Chief Mechanic',
  },
];

export function useInterviewScheduleController(): InterviewScheduleController {
  const navigation = useNavigation<InterviewNav>();

  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onSchedulePress = useCallback(() => {
    navigation.navigate('ScheduleInterview');
  }, [navigation]);

  const onReschedulePress = useCallback(
    (interviewId: string) => {
      navigation.navigate('RescheduleInterview', {interviewId});
    },
    [navigation],
  );

  const onJoinCallPress = useCallback(
    (_interviewId: string) => {
      navigation.navigate('LiveInterview');
    },
    [navigation],
  );

  return {
    subtitle: '8 interviews this week · 4 upcoming today',
    interviews: INTERVIEWS,
    onBackPress,
    onSchedulePress,
    onReschedulePress,
    onJoinCallPress,
  };
}
