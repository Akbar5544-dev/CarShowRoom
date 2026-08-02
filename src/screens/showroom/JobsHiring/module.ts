import type {MetricCardData} from '../../../components';
import type {IconName} from '../../../assets/iconXml';

export type PipelineStage = {
  id: string;
  label: string;
  count: number;
  background: string;
  wide?: boolean;
};

export type CandidateStage = 'Interview' | 'Offer' | 'Screening';

export type CandidateItem = {
  id: string;
  name: string;
  role: string;
  score: number;
  stage: CandidateStage;
  avatarColor: string;
};

export type JobsHiringController = {
  summary: string;
  metrics: MetricCardData[];
  pipelineStages: PipelineStage[];
  candidates: CandidateItem[];
  onBackPress: () => void;
  onInterviewsPress: () => void;
  onOpenPositionsPress: () => void;
  onPipelinePress: () => void;
  onCandidatePress: (id: string) => void;
};

export type {IconName};
