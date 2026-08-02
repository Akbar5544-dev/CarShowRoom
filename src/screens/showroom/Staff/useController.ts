import {useCallback, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {showMessage} from 'react-native-flash-message';
import {getApiErrorMessage} from '../../../api';
import {AttendanceDay} from '../../../components/AttendanceChart';
import {DepartmentItem} from '../../../components/DepartmentDonut';
import {MetricCardData} from '../../../components/MetricCard';
import type {StaffStackParamList} from '../../../navigation/types';
import {
  staffManagementAttendanceService,
  staffManagementSalariesService,
  staffManagementStaffService,
} from '../../../services';
import {useAppSelector} from '../../../store/hooks';
import {useSmartFocusFetch} from '../../../hooks/useSmartFocusFetch';
import {useThemeColors, type AppColors} from '../../../theme';
import {
  AnyRecord,
  asRecord,
  formatCount,
  formatMoney,
  pickNumber,
  pickString,
  todayLabel,
  unwrapList,
  unwrapMeta,
} from '../../../utils/apiHelpers';
import type {StaffController} from './module';

type StaffNav = NativeStackNavigationProp<StaffStackParamList, 'StaffList'>;

function departmentColors(c: AppColors) {
  return [
    c.deptOperations,
    c.deptSales,
    c.deptSupport,
    c.deptMechanics,
    c.deptAdmin,
  ];
}

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function metricBase(c: AppColors): Omit<MetricCardData, 'value'>[] {
  return [
    {
      id: 'employees',
      label: 'Total Employees',
      change: '',
      positive: true,
      backgroundColor: c.staffMetricBlue,
      icon: 'employees',
      iconBg: c.actionTint1,
      sparklineColor: c.actionBlue,
    },
    {
      id: 'present',
      label: 'Present Today',
      change: '',
      positive: true,
      backgroundColor: c.staffMetricGreen,
      icon: 'present',
      iconBg: 'rgba(32,180,107,0.1)',
      sparklineColor: c.successBright,
    },
    {
      id: 'leave',
      label: 'On Leave',
      change: '',
      positive: false,
      backgroundColor: c.staffMetricOrange,
      icon: 'onLeave',
      iconBg: 'rgba(245,158,11,0.12)',
      sparklineColor: c.late,
    },
    {
      id: 'payroll',
      label: 'Monthly Payroll',
      change: '',
      positive: true,
      backgroundColor: c.staffMetricPurple,
      icon: 'payroll',
      iconBg: 'rgba(139,92,246,0.12)',
      sparklineColor: c.deptSales,
    },
  ];
}

function emptyMetrics(c: AppColors): MetricCardData[] {
  return metricBase(c).map(base => ({...base, value: '0'}));
}

function emptyAttendanceDays(): AttendanceDay[] {
  return WEEKDAY_LABELS.map(label => ({label, present: 0, late: 0, absent: 0}));
}

function parseDate(value: string): Date | null {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildDepartments(
  staffRows: AnyRecord[],
  colors: AppColors,
): {
  items: DepartmentItem[];
  total: number;
} {
  const palette = departmentColors(colors);
  const counts = new Map<string, number>();
  staffRows.forEach(item => {
    const row = asRecord(item);
    const department = pickString(row, ['department']) || 'Unassigned';
    counts.set(department, (counts.get(department) ?? 0) + 1);
  });
  const items: DepartmentItem[] = Array.from(counts.entries()).map(
    ([label, count], index) => ({
      id: label.toLowerCase().replace(/\s+/g, '-'),
      label,
      count,
      color: palette[index % palette.length],
    }),
  );
  return {items, total: staffRows.length};
}

function buildAttendanceDays(attendanceRows: AnyRecord[]): AttendanceDay[] {
  const buckets = emptyAttendanceDays();
  attendanceRows.forEach(item => {
    const row = asRecord(item);
    const date = parseDate(
      pickString(row, ['date', 'attendance_date', 'created_at']),
    );
    if (!date) {
      return;
    }
    const bucket = buckets[date.getDay()];
    const status = pickString(row, ['status'], 'present').toLowerCase();
    if (status.includes('late')) {
      bucket.late += 1;
    } else if (status.includes('absent')) {
      bucket.absent += 1;
    } else if (status.includes('present')) {
      bucket.present += 1;
    }
  });
  return buckets;
}

export function useStaffController(): StaffController {
  const colors = useThemeColors();
  const navigation = useNavigation<StaffNav>();
  const userName = useAppSelector(state => state.app.userName);
  const [summary, setSummary] = useState('');
  const [metrics, setMetrics] = useState<MetricCardData[]>(() =>
    emptyMetrics(colors),
  );
  const [attendanceDays, setAttendanceDays] = useState<AttendanceDay[]>(
    emptyAttendanceDays(),
  );
  const [attendanceAvg, setAttendanceAvg] = useState('0% avg');
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [departmentTotal, setDepartmentTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedAt, setFetchedAt] = useState<number | null>(null);
  const fetchedAtRef = useRef<number | null>(null);

  const fetchData = useCallback(
    async (options?: {silent?: boolean}) => {
      const silent = options?.silent ?? false;
      if (!silent && fetchedAtRef.current == null) {
        setIsLoading(true);
      }
      try {
      const [staffRes, attendanceRes, salariesRes] = await Promise.all([
        staffManagementStaffService.listStaff({per_page: 50}),
        staffManagementAttendanceService
          .listAttendance({per_page: 100})
          .catch(() => null),
        staffManagementSalariesService
          .listSalaries({per_page: 50})
          .catch(() => null),
      ]);

      const staffRows = unwrapList(staffRes);
      const staffMeta = unwrapMeta(staffRes);
      const attendanceRows = attendanceRes ? unwrapList(attendanceRes) : [];
      const salaryRows = salariesRes ? unwrapList(salariesRes) : [];

      const today = new Date();
      let presentToday = 0;
      let onLeave = 0;
      attendanceRows.forEach(item => {
        const row = asRecord(item);
        const status = pickString(row, ['status'], '').toLowerCase();
        const date = parseDate(
          pickString(row, ['date', 'attendance_date', 'created_at']),
        );
        if (date && isSameDay(date, today) && status.includes('present')) {
          presentToday += 1;
        }
        if (status.includes('leave')) {
          onLeave += 1;
        }
      });

      const monthlyPayroll = salaryRows.reduce((sum, item) => {
        const row = asRecord(item);
        return (
          sum +
          pickNumber(row, [
            'basic_salary',
            'paid_amount',
            'net_salary',
            'amount',
          ])
        );
      }, 0);

      // Prefer staff list length; meta.total can be 0/missing on some APIs
      const totalStaff = staffRows.length || staffMeta.total || 0;

      // Payroll fallback from staff basic_salary when salaries endpoint is empty
      const payrollFromStaff =
        monthlyPayroll ||
        staffRows.reduce((sum, item) => {
          const row = asRecord(item);
          return sum + pickNumber(row, ['basic_salary', 'salary']);
        }, 0);

      const bases = metricBase(colors);
      setMetrics([
        {...bases[0], value: formatCount(totalStaff)},
        {...bases[1], value: formatCount(presentToday)},
        {...bases[2], value: formatCount(onLeave)},
        {...bases[3], value: formatMoney(payrollFromStaff)},
      ]);

      const {items: departmentItems, total} = buildDepartments(
        staffRows,
        colors,
      );
      setDepartments(departmentItems);
      setDepartmentTotal(total);

      const days = buildAttendanceDays(attendanceRows);
      setAttendanceDays(days);
      const totalPresent = days.reduce((sum, day) => sum + day.present, 0);
      const totalMarked = days.reduce(
        (sum, day) => sum + day.present + day.late + day.absent,
        0,
      );
      setAttendanceAvg(
        totalMarked
          ? `${Math.round((totalPresent / totalMarked) * 100)}% avg`
          : '0% avg',
      );

      setSummary(
        `${formatCount(totalStaff)} employees across ${
          departmentItems.length || 1
        } departments · ${formatCount(presentToday)} present today`,
      );
      const at = Date.now();
      fetchedAtRef.current = at;
      setFetchedAt(at);
    } catch (error) {
      showMessage({
        message: getApiErrorMessage(error, 'Failed to load staff data'),
        type: 'danger',
      });
    } finally {
      setIsLoading(false);
    }
  }, [colors]);

  useSmartFocusFetch(fetchedAt, fetchData);

  const onViewEmployeesPress = useCallback(() => {
    navigation.navigate('AllEmployees');
  }, [navigation]);

  return {
    userName: userName || 'User',
    dateLabel: todayLabel(),
    summary,
    metrics,
    attendanceDays,
    attendanceAvg,
    departments,
    departmentTotal,
    isLoading,
    onViewEmployeesPress,
  };
}
