export type InterviewStatus = 'Upcoming' | 'Scheduled';

export type InterviewCardData = {
  id: string;
  candidateName: string;
  position: string;
  status: InterviewStatus;
  scheduleLabel: string;
  mode: string;
  interviewers: string;
};

export type InterviewScheduleController = {
  subtitle: string;
  interviews: InterviewCardData[];
  onBackPress: () => void;
  onSchedulePress: () => void;
  onReschedulePress: (interviewId: string) => void;
  onJoinCallPress: (interviewId: string) => void;
};
