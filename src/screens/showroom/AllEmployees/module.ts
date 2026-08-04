import {EmployeeCardData} from '../../../components/EmployeeCard';

export type AllEmployeesController = {
  isLoading: boolean;
  summary: string;
  searchQuery: string;
  filteredEmployees: EmployeeCardData[];
  setSearchQuery: (query: string) => void;
  onBackPress: () => void;
  onAddEmployeePress: () => void;
  onFilterPress: () => void;
  onProfilePress: (employee: EmployeeCardData) => void;
  onSalaryPress: (employee: EmployeeCardData) => void;
};
