export type JobStatus = 'open' | 'interviewing' | 'closed';

export type OpenPositionItem = {
  id: string;
  title: string;
  department: string;
  employmentType: string;
  status: JobStatus;
  location: string;
  applicantCount: number;
  salaryRange: string;
};

export type OpenPositionsController = {
  isLoading: boolean;
  summary: string;
  positions: OpenPositionItem[];
  emptyMessage: string;
  onBackPress: () => void;
  onPostJobPress: () => void;
  onViewApplicantsPress: (jobId: string) => void;
  onRefresh: () => void;
};
