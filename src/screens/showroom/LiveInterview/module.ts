import type {IconName} from '../../../assets/iconXml';

export type LiveParticipant = {
  id: string;
  name: string;
  role: string;
  initials: string;
  color: string;
  isYou?: boolean;
  isActive?: boolean;
  isMono?: boolean;
};

export type ScorecardCriterion = {
  id: string;
  label: string;
};

export type ChatMessage = {
  id: string;
  sender: string;
  text: string;
  isYou?: boolean;
};

export type CallControl = {
  id: string;
  icon: IconName;
  label: string;
};

export type LiveInterviewController = {
  eyebrow: string;
  title: string;
  recordingLabel: string;
  participants: LiveParticipant[];
  callControls: CallControl[];
  scorecard: ScorecardCriterion[];
  scores: Record<string, number>;
  notes: string;
  chatMessages: ChatMessage[];
  chatInput: string;
  setScore: (criterionId: string, value: number) => void;
  setNotes: (text: string) => void;
  setChatInput: (text: string) => void;
  onSendMessage: () => void;
  onBackPress: () => void;
  onEndCallPress: () => void;
};
