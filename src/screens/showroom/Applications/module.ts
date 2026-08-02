export type ApplicationStage =
  | 'Shortlisted'
  | 'New'
  | 'Interview'
  | 'Rejected';

export type ApplicationCardData = {
  id: string;
  name: string;
  role: string;
  experience: string;
  matchPercent: number;
  stage: ApplicationStage;
  avatarColor: string;
};

export type ApplicationsController = {
  subtitle: string;
  searchQuery: string;
  applications: ApplicationCardData[];
  setSearchQuery: (query: string) => void;
  onStageFilterPress: () => void;
  onPositionFilterPress: () => void;
  onBackPress: () => void;
  onOnboardingPress: () => void;
  onReviewPress: (applicationId: string) => void;
};
