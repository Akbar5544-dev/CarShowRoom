import {AttendanceDay} from '../../../components/AttendanceChart';
import {DepartmentItem} from '../../../components/DepartmentDonut';
import {MetricCardData} from '../../../components/MetricCard';

export type StaffController = {
  userName: string;
  dateLabel: string;
  summary: string;
  metrics: MetricCardData[];
  attendanceDays: AttendanceDay[];
  attendanceAvg: string;
  departments: DepartmentItem[];
  departmentTotal: number;
  isLoading: boolean;
  onViewEmployeesPress: () => void;
};
