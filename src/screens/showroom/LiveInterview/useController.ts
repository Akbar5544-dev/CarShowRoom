import {colors as defaultColors, useThemeColors} from '../../../theme';
import {useCallback, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {HomeStackParamList} from '../../../navigation/types';
import type {
  CallControl,
  ChatMessage,
  LiveInterviewController,
  LiveParticipant,
  ScorecardCriterion,
} from './module';

type LiveNav = NativeStackNavigationProp<HomeStackParamList, 'LiveInterview'>;

const PARTICIPANTS: LiveParticipant[] = [
  {
    id: 'ali',
    name: 'Ali Hasan',
    role: 'Candidate',
    initials: 'AH',
    color: defaultColors.brandBlue,
    isActive: true,
  },
  {
    id: 'sarah',
    name: 'Sarah Khan',
    role: 'HR',
    initials: 'SK',
    color: '#20B46B',
  },
  {
    id: 'ahmed',
    name: 'Ahmed Rauf',
    role: 'Director',
    initials: 'AR',
    color: '#64748B',
    isMono: true,
  },
  {
    id: 'you',
    name: 'You',
    role: 'Interviewer',
    initials: 'YO',
    color: defaultColors.actionBlue,
    isYou: true,
  },
];

const CALL_CONTROLS: CallControl[] = [
  {id: 'mic', icon: 'mic', label: 'Mute'},
  {id: 'camera', icon: 'videoCamera', label: 'Camera'},
  {id: 'share', icon: 'screenShare', label: 'Share'},
  {id: 'chat', icon: 'chatBubble', label: 'Chat'},
  {id: 'people', icon: 'employees', label: 'People'},
  {id: 'more', icon: 'moreDots', label: 'More'},
];

const SCORECARD: ScorecardCriterion[] = [
  {id: 'communication', label: 'Communication'},
  {id: 'domain', label: 'Domain knowledge'},
  {id: 'problem', label: 'Problem solving'},
  {id: 'culture', label: 'Culture fit'},
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    sender: 'Sarah',
    text: "Let's move to case study.",
  },
  {
    id: 'm2',
    sender: 'You',
    text: 'Sounds good.',
    isYou: true,
  },
];

export function useLiveInterviewController(): LiveInterviewController {
  const colors = useThemeColors();
  const navigation = useNavigation<LiveNav>();
  const [scores, setScores] = useState<Record<string, number>>({
    communication: 3,
    domain: 3,
    problem: 3,
    culture: 3,
  });
  const [notes, setNotes] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] =
    useState<ChatMessage[]>(INITIAL_MESSAGES);

  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onEndCallPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const setScore = useCallback((criterionId: string, value: number) => {
    setScores(prev => ({...prev, [criterionId]: value}));
  }, []);

  const onSendMessage = useCallback(() => {
    const trimmed = chatInput.trim();
    if (!trimmed) {
      return;
    }
    setChatMessages(prev => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        sender: 'You',
        text: trimmed,
        isYou: true,
      },
    ]);
    setChatInput('');
  }, [chatInput]);

  return {
    eyebrow: 'Live · Interview',
    title: 'Ali Hasan — Senior Fleet Manager',
    recordingLabel: 'Recording · 04:12',
    participants: PARTICIPANTS,
    callControls: CALL_CONTROLS,
    scorecard: SCORECARD,
    scores,
    notes,
    chatMessages,
    chatInput,
    setScore,
    setNotes,
    setChatInput,
    onSendMessage,
    onBackPress,
    onEndCallPress,
  };
}
