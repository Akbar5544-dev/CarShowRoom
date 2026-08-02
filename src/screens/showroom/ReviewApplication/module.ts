export type ReviewTabId = 'profile' | 'resume' | 'screening' | 'notes';

export type ReviewTab = {
  id: ReviewTabId;
  label: string;
};

export type SkillBar = {
  id: string;
  label: string;
  percent: number;
};

export type ScreeningItem = {
  id: string;
  question: string;
  answer: string;
};

export type FeedbackCriterion = {
  id: string;
  label: string;
};

export type ApplicationProfile = {
  name: string;
  role: string;
  matchPercent: number;
  email: string;
  phone: string;
  location: string;
  experience: string;
  education: string;
  appliedDate: string;
  about: string;
  initials: string;
  avatarColor: string;
};

export type ReviewApplicationController = {
  applicationId: string;
  subtitle: string;
  profile: ApplicationProfile;
  tabs: ReviewTab[];
  activeTab: ReviewTabId;
  skills: SkillBar[];
  experienceTitle: string;
  experienceSubtitle: string;
  screening: ScreeningItem[];
  feedbackCriteria: FeedbackCriterion[];
  feedbackScores: Record<string, number>;
  setActiveTab: (tab: ReviewTabId) => void;
  setFeedbackScore: (criterionId: string, value: number) => void;
  onBackPress: () => void;
  onCvPress: () => void;
  onSharePress: () => void;
  onMoveToInterviewPress: () => void;
  onShortlistPress: () => void;
  onRejectPress: () => void;
  onDownloadPdfPress: () => void;
};
