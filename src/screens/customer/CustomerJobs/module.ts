import type {PublicJobListItem} from '../../../utils/publicJobs';

export type CustomerJobsController = {
  isLoading: boolean;
  search: string;
  jobs: PublicJobListItem[];
  departmentOptions: string[];
  cityOptions: string[];
  selectedDepartment: string | null;
  selectedCity: string | null;
  emptyMessage: string;
  setSearch: (value: string) => void;
  setSelectedDepartment: (value: string | null) => void;
  setSelectedCity: (value: string | null) => void;
  onRefresh: () => void;
  onJobPress: (job: PublicJobListItem) => void;
};
