import {useCallback, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {HomeStackParamList} from '../../../navigation/types';
import type {
  ScheduleInterviewController,
  ScheduleInterviewForm,
} from './module';

type ScheduleNav = NativeStackNavigationProp<
  HomeStackParamList,
  'ScheduleInterview'
>;

const INITIAL_FORM: ScheduleInterviewForm = {
  date: '',
  time: '',
  candidate: '',
  position: '',
  duration: '',
  mode: '',
  location: '',
  interviewers: '',
  emailSubject: '',
  message: '',
};

export function useScheduleInterviewController(): ScheduleInterviewController {
  const navigation = useNavigation<ScheduleNav>();
  const [form, setForm] = useState<ScheduleInterviewForm>(INITIAL_FORM);

  const setField = useCallback(
    <K extends keyof ScheduleInterviewForm>(
      key: K,
      value: ScheduleInterviewForm[K],
    ) => {
      setForm(prev => ({...prev, [key]: value}));
    },
    [],
  );

  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onCancelPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onSchedulePress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return {
    headerSubtitle: 'Ali Hasan · Senior Fleet Manager',
    form,
    setField,
    onBackPress,
    onCancelPress,
    onSchedulePress,
  };
}
