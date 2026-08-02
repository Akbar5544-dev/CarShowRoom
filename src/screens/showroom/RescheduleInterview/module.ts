export type RescheduleInterviewForm = {
  date: string;
  time: string;
  duration: string;
  reason: string;
  message: string;
};

export type SuggestedSlot = {
  id: string;
  label: string;
};

export type RescheduleInterviewController = {
  headerSubtitle: string;
  originalSlot: string;
  notice: string;
  form: RescheduleInterviewForm;
  suggestedSlots: SuggestedSlot[];
  setField: <K extends keyof RescheduleInterviewForm>(
    key: K,
    value: RescheduleInterviewForm[K],
  ) => void;
  onUseSlot: (slotId: string) => void;
  onBackPress: () => void;
  onCancelPress: () => void;
  onCancelInterviewPress: () => void;
  onReschedulePress: () => void;
};
