export type ScheduleInterviewForm = {
  date: string;
  time: string;
  candidate: string;
  position: string;
  duration: string;
  mode: string;
  location: string;
  interviewers: string;
  emailSubject: string;
  message: string;
};

export type ScheduleInterviewController = {
  headerSubtitle: string;
  form: ScheduleInterviewForm;
  setField: <K extends keyof ScheduleInterviewForm>(
    key: K,
    value: ScheduleInterviewForm[K],
  ) => void;
  onBackPress: () => void;
  onCancelPress: () => void;
  onSchedulePress: () => void;
};
