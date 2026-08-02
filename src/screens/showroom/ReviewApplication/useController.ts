import {colors as defaultColors, useThemeColors} from '../../../theme';
import {useCallback, useMemo, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {HomeStackParamList} from '../../../navigation/types';
import type {
  ApplicationProfile,
  FeedbackCriterion,
  ReviewApplicationController,
  ReviewTab,
  ReviewTabId,
  ScreeningItem,
  SkillBar,
} from './module';

type ReviewNav = NativeStackNavigationProp<
  HomeStackParamList,
  'ReviewApplication'
>;
type ReviewRoute = RouteProp<HomeStackParamList, 'ReviewApplication'>;

const TABS: ReviewTab[] = [
  {id: 'profile', label: 'Profile'},
  {id: 'resume', label: 'Resume'},
  {id: 'screening', label: 'Screening'},
  {id: 'notes', label: 'Notes & Score'},
];

const SKILLS: SkillBar[] = [
  {id: 'fleet', label: 'Fleet Operations', percent: 95},
  {id: 'leadership', label: 'Team Leadership', percent: 90},
  {id: 'cost', label: 'Cost Optimization', percent: 88},
  {id: 'erp', label: 'ERP Systems', percent: 82},
];

const SCREENING: ScreeningItem[] = [
  {
    id: 'q1',
    question: 'Why do you want to join DriveHub?',
    answer:
      'Your growth trajectory and focus on premium fleet ops match my strengths.',
  },
  {
    id: 'q2',
    question: 'Expected salary?',
    answer: 'USD 5,200 / month',
  },
];

const FEEDBACK: FeedbackCriterion[] = [
  {id: 'communication', label: 'Communication'},
  {id: 'problem', label: 'Problem solving'},
];

const PROFILES: Record<string, ApplicationProfile> = {
  'faisal-rehman': {
    name: 'Faisal Rehman',
    role: 'Rental Agent',
    matchPercent: 92,
    email: 'ali.hasan@mail.com',
    phone: '+92 300 1234567',
    location: 'Lahore, PK',
    experience: '9 years experience',
    education: 'MBA — LUMS',
    appliedDate: 'Applied Nov 18, 2025',
    about:
      'Seasoned fleet operations leader with 9+ years managing 200+ vehicle rental fleets across Pakistan and the UAE. Track record of reducing operating cost by 22% while maintaining a 98% availability SLA.',
    initials: 'FR',
    avatarColor: defaultColors.brandBlue,
  },
};

const DEFAULT_PROFILE = PROFILES['faisal-rehman'];

export function useReviewApplicationController(): ReviewApplicationController {
  const colors = useThemeColors();
  const navigation = useNavigation<ReviewNav>();
  const route = useRoute<ReviewRoute>();
  const applicationId = route.params.applicationId;

  const profile = useMemo(
    () => PROFILES[applicationId] ?? DEFAULT_PROFILE,
    [applicationId],
  );

  const [activeTab, setActiveTab] = useState<ReviewTabId>('profile');
  const [feedbackScores, setFeedbackScores] = useState<Record<string, number>>({
    communication: 0,
    problem: 0,
  });

  const subtitle = `${profile.name} — applied for ${profile.role}`;

  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const setFeedbackScore = useCallback((criterionId: string, value: number) => {
    setFeedbackScores(prev => ({...prev, [criterionId]: value}));
  }, []);
  const onCvPress = useCallback(() => {}, []);
  const onSharePress = useCallback(() => {}, []);
  const onMoveToInterviewPress = useCallback(() => {}, []);
  const onShortlistPress = useCallback(() => {}, []);
  const onRejectPress = useCallback(() => {}, []);
  const onDownloadPdfPress = useCallback(() => {}, []);

  return {
    applicationId,
    subtitle,
    profile,
    tabs: TABS,
    activeTab,
    skills: SKILLS,
    experienceTitle: 'Head of Fleet Ops · Careem',
    experienceSubtitle: 'Managed 320 vehicles across 4 cities.',
    screening: SCREENING,
    feedbackCriteria: FEEDBACK,
    feedbackScores,
    setActiveTab,
    setFeedbackScore,
    onBackPress,
    onCvPress,
    onSharePress,
    onMoveToInterviewPress,
    onShortlistPress,
    onRejectPress,
    onDownloadPdfPress,
  };
}
