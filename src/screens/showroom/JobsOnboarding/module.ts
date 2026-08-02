export type NewHireItem = {
  id: string;
  name: string;
  role: string;
  progress: number;
  initials: string;
  avatarColor: string;
};

export type OnboardingTask = {
  id: string;
  label: string;
  completed: boolean;
};

export type JobsOnboardingController = {
  summary: string;
  newHires: NewHireItem[];
  checklistRole: string;
  checklistTitle: string;
  checklist: OnboardingTask[];
  onBackPress: () => void;
  onHiringPress: () => void;
  onAssignPress: (taskId: string) => void;
};
