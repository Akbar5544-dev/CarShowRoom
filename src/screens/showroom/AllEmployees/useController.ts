import {useCallback, useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {showMessage} from 'react-native-flash-message';
import {getApiErrorMessage} from '../../../api';
import {EmployeeCardData} from '../../../components/EmployeeCard';
import type {StaffStackParamList} from '../../../navigation/types';
import {staffManagementStaffService} from '../../../services';
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
    salary: formatMoney(pickNumber(row, ['basic_salary', 'salary'])),
    phone: pickString(row, ['phone'], '—'),
    email: pickString(row, ['email'], '—'),
    initials: initialsFromName(name),
    avatarColor: avatarColorFromId(id),
  };
}

export function useAllEmployeesController(): AllEmployeesController {
  const navigation = useNavigation<AllEmployeesNav>();
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState<EmployeeCardData[]>([]);
  const [summary, setSummary] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchData = useCallback(async (query: string) => {
    try {
      const response = await staffManagementStaffService.listStaff({
        search: query || undefined,
        per_page: 50,
      });
      const rows = unwrapList(response);
      const meta = unwrapMeta(response);
      setEmployees(rows.map(mapEmployeeRow));

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
  };
}
