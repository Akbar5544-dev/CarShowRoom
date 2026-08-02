import {useCallback, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {HomeStackParamList} from '../../../navigation/types';
import type {
  RescheduleInterviewController,
  RescheduleInterviewForm,
  SuggestedSlot,
} from './module';

type RescheduleNav = NativeStackNavigationProp<
  HomeStackParamList,
  'RescheduleInterview'
>;

const INITIAL_FORM: RescheduleInterviewForm = {
  date: '',
  time: '',
  duration: '',
  reason: '',
  message: '',
};

const SUGGESTED_SLOTS: SuggestedSlot[] = [
  {id: 'slot-1', label: 'Tomorrow · 11:00'},
  {id: 'slot-2', label: 'Tomorrow · 15:30'},
  {id: 'slot-3', label: 'Nov 26 · 10:00'},
  {id: 'slot-4', label: 'Nov 27 · 14:00'},
];

export function useRescheduleInterviewController(): RescheduleInterviewController {
  const navigation = useNavigation<RescheduleNav>();
  const [form, setForm] = useState<RescheduleInterviewForm>(INITIAL_FORM);

  const setField = useCallback(
    <K extends keyof RescheduleInterviewForm>(
      key: K,
      value: RescheduleInterviewForm[K],
    ) => {
      setForm(prev => ({...prev, [key]: value}));
    },
    [],
  );

  const onUseSlot = useCallback((slotId: string) => {
    const slot = SUGGESTED_SLOTS.find(item => item.id === slotId);
    if (!slot) {
      return;
    }
    const [datePart, timePart] = slot.label.split(' · ');
    setForm(prev => ({
      ...prev,
      date: datePart,
      time: timePart,
    }));
  }, []);

  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onCancelPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onCancelInterviewPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onReschedulePress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return {
    headerSubtitle: 'Ali Hasan · Senior Fleet Manager',
    originalSlot: 'Today · 15:00',
    notice: 'The candidate and panel will be notified of the new time.',
    form,
    suggestedSlots: SUGGESTED_SLOTS,
    setField,
    onUseSlot,
    onBackPress,
    onCancelPress,
    onCancelInterviewPress,
    onReschedulePress,
  };
}
