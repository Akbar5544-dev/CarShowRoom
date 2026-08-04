import {useCallback, useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {showMessage} from 'react-native-flash-message';
import {getApiErrorMessage} from '../../../api';
import {EmployeeCardData} from '../../../components/EmployeeCard';
import type {StaffStackParamList} from '../../../navigation/types';
import {staffManagementSalariesService, staffManagementStaffService} from '../../../services';
import {
  AnyRecord,
  asRecord,
  avatarColorFromId,
  formatCount,
  formatMoney,
  initialsFromName,
  pickNumber,
  pickString,
  titleCase,
  unwrapList,
  unwrapMeta,
} from '../../../utils/apiHelpers';
import type {AllEmployeesController} from './module';

type AllEmployeesNav = NativeStackNavigationProp<
  StaffStackParamList,
  'AllEmployees'
>;

function mapEmployeeRow(item: AnyRecord): EmployeeCardData {
  const row = asRecord(item);
  const id = pickString(row, ['id'], '0');
  const name =
    pickString(row, ['name']) ||
    [pickString(row, ['first_name']), pickString(row, ['last_name'])]
      .filter(Boolean)
      .join(' ') ||
    'Employee';
  const designation = pickString(row, ['designation']);
  const department = pickString(row, ['department']);
  const role = [designation, department].filter(Boolean).join(' · ') || 'Staff';
  const employeeId = pickString(row, ['employee_code', 'employee_id'], `EMP-${id}`);
  const status = titleCase(pickString(row, ['status'], 'active'));

  return {
    id,
    name,
    role,
    employeeId,
    status,
    salary: formatMoney(
      pickNumber(row, [
        'basic_salary',
        'basicSalary',
        'base_salary',
        'baseSalary',
        'salary',
        'monthly_salary',
        'monthlySalary',
        'net_salary',
        'netSalary',
      ]),
    ),
    phone: pickString(row, ['phone'], '—'),
    email: pickString(row, ['email'], '—'),
    initials: initialsFromName(name),
    avatarColor: avatarColorFromId(id),
  };
}

function pickSalaryStaffId(row: AnyRecord): string {
  return pickString(
    row,
    ['staff_id', 'employee_id', 'staffId', 'employeeId', 'user_id'],
    '',
  );
}

function pickSalaryAmount(row: AnyRecord): number {
  return pickNumber(row, [
    'basic_salary',
    'base_salary',
    'salary',
    'monthly_salary',
    'net_salary',
    'amount',
    'paid_amount',
  ]);
}

function salarySortStamp(row: AnyRecord): number {
  const year = pickNumber(row, ['year', 'pay_year', 'paid_year'], 0);
  const month = pickNumber(row, ['month', 'pay_month'], 0);
  if (year > 0 && month > 0) {
    return year * 100 + month;
  }
  const dateRaw = pickString(row, ['paid_at', 'date', 'created_at', 'updated_at']);
  const parsed = new Date(dateRaw).getTime();
  if (Number.isFinite(parsed)) {
    return parsed;
  }
  return pickNumber(row, ['id'], 0);
}

export function useAllEmployeesController(): AllEmployeesController {
  const navigation = useNavigation<AllEmployeesNav>();
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState<EmployeeCardData[]>([]);
  const [summary, setSummary] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchData = useCallback(async (query: string) => {
    try {
      const [response, salariesResponse] = await Promise.all([
        staffManagementStaffService.listStaff({
          search: query || undefined,
          per_page: 50,
        }),
        staffManagementSalariesService
          .listSalaries({per_page: 200})
          .catch(() => null),
      ]);
      const rows = unwrapList(response);
      const meta = unwrapMeta(response);

      const salaryRows = salariesResponse ? unwrapList(salariesResponse) : [];
      const latestSalaryByStaffId = new Map<string, number>();
      salaryRows
        .map(item => asRecord(item))
        .sort((a, b) => salarySortStamp(b) - salarySortStamp(a))
        .forEach(row => {
          const staffId = pickSalaryStaffId(row);
          if (!staffId || latestSalaryByStaffId.has(staffId)) {
            return;
          }
          latestSalaryByStaffId.set(staffId, pickSalaryAmount(row));
        });

      setEmployees(
        rows.map(item => {
          const row = asRecord(item);
          const mapped = mapEmployeeRow(row);
          const staffId = pickString(row, ['id'], '');
          const salaryFromSalaryApi = latestSalaryByStaffId.get(staffId);
          if (
            salaryFromSalaryApi != null &&
            Number.isFinite(salaryFromSalaryApi) &&
            salaryFromSalaryApi > 0
          ) {
            return {...mapped, salary: formatMoney(salaryFromSalaryApi)};
          }
          return mapped;
        }),
      );

      const departments = new Set(
        rows
          .map(item => pickString(asRecord(item), ['department']))
          .filter(Boolean),
      );
      const total = meta.total || rows.length;
      setSummary(
        `${formatCount(total)} employees across ${departments.size || 1} departments`,
      );
    } catch (error) {
      showMessage({
        message: getApiErrorMessage(error, 'Failed to load employees'),
        type: 'danger',
      });
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      fetchData(searchQuery.trim());
    }, 300);
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery, fetchData]);

  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onAddEmployeePress = useCallback(() => {
    navigation.navigate('AddEmployee');
  }, [navigation]);

  const onFilterPress = useCallback(() => {}, []);

  const onProfilePress = useCallback(
    (employee: EmployeeCardData) => {
      navigation.navigate('StaffOverview', {employeeId: employee.id});
    },
    [navigation],
  );

  const onSalaryPress = useCallback(
    (employee: EmployeeCardData) => {
      navigation.navigate('StaffOverview', {
        employeeId: employee.id,
        initialTab: 'salary',
      });
    },
    [navigation],
  );

  return {
    isLoading: false,
    summary,
    searchQuery,
    filteredEmployees: employees,
    setSearchQuery,
    onBackPress,
    onAddEmployeePress,
    onFilterPress,
    onProfilePress,
    onSalaryPress,
  };
}
