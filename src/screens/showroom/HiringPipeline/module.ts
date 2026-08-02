export type PipelineCandidate = {
  id: string;
  name: string;
  movedLabel: string;
};

export type PipelineColumn = {
  id: string;
  label: string;
  count: number;
  borderColor: string;
  candidates: PipelineCandidate[];
  extraCount: number;
};

export type HiringPipelineController = {
  summary: string;
  columns: PipelineColumn[];
  onBackPress: () => void;
};
