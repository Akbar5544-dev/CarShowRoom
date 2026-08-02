import {useCallback, useEffect, useMemo, useState} from 'react';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {showMessage} from 'react-native-flash-message';
import {getApiErrorMessage} from '../../../api';
import {
  AttendanceDayCell,
  AttendanceStatusChoice,
  AttendanceSummary,
} from '../../../components/AttendancePanel';
import {BonusItem} from '../../../components/BonusesPanel';
import {DocumentItem} from '../../../components/DocumentsPanel';
import {InfoStatCardData} from '../../../components/InfoStatCard';
import {ProfileDetailRow, ProfileInfo} from '../../../components/ProfileInfoCard';
import {ProfileTabId} from '../../../components/ProfileTabs';
import {QuickStat} from '../../../components/QuickStatsRow';
import {SalaryRow} from '../../../components/SalaryPanel';
import {ShiftItem, ShiftKind} from '../../../components/ShiftsPanel';
import type {StaffStackParamList} from '../../../navigation/types';
import {
  accountingBonusesService,
  staffManagementAttendanceService,
  staffManagementSalariesService,
  staffManagementShiftsService,
  staffManagementStaffService,
} from '../../../services';
import {useAppSelector} from '../../../store/hooks';
import {colors as defaultColors, useThemeColors} from '../../../theme';
import {
  AnyRecord,
  asRecord,
  avatarColorFromId,
  formatMoney,
  initialsFromName,
  parseMoneyInput,
  pickNumber,
  pickString,
  titleCase,
  todayLabel,
  toIsoDate,
  unwrapData,
  unwrapList,
} from '../../../utils/apiHelpers';
import {
  createMediaFormData,
  pickFromGallery,
  type PickedMedia,
} from '../../../utils/mediaPicker';
import type {StaffOverviewController} from './module';

type OverviewRoute = RouteProp<StaffStackParamList, 'StaffOverview'>;
type OverviewNav = NativeStackNavigationProp<StaffStackParamList, 'StaffOverview'>;

const TABS: {id: ProfileTabId; label: string}[] = [
  {id: 'overview', label: 'Overview'},
  {id: 'attendance', label: 'Attendance'},
  {id: 'salary', label: 'Salary'},
  {id: 'bonuses', label: 'Bonuses'},
  {id: 'shifts', label: 'Shifts'},
  {id: 'documents', label: 'Documents'},
];

const TREND_VALUES = [42, 48, 45, 55, 52, 61, 58, 66, 70, 68, 74, 80];

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const QUICK_STATS: QuickStat[] = [
  {id: 'rentals', label: 'Total Rentals Handled', value: '—', color: defaultColors.actionBlue},
  {id: 'ontime', label: 'On-time Rate', value: '—', color: defaultColors.successBright},
  {id: 'rating', label: 'Customer Rating', value: '—', color: defaultColors.late},
  {id: 'ot', label: 'Overtime Hours', value: '—', color: defaultColors.deptSales},
];

const DOCUMENT_ITEMS: DocumentItem[] = [];

const EMPTY_PROFILE: ProfileInfo = {
  name: 'Employee',
  title: 'Staff',
  employeeId: '—',
  initials: 'NA',
  avatarColor: defaultColors.actionBlue,
  online: false,
  details: [],
  emergencyName: 'Not provided',
  emergencyPhone: '',
};

const EMPTY_STATS: InfoStatCardData[] = [
  {id: 'shift', label: 'Current Shift', value: 'Not assigned', icon: 'shiftClock', iconBg: defaultColors.actionTint12},
  {id: 'present', label: 'Present Days', value: '0 / 0', icon: 'presentDays', iconBg: 'rgba(32,180,107,0.12)'},
  {id: 'leave', label: 'Leave Balance', value: '0 days', icon: 'leaveBalance', iconBg: 'rgba(245,158,11,0.14)'},
  {id: 'salary', label: 'Monthly Salary', value: '$0', icon: 'monthlySalary', iconBg: 'rgba(139,92,246,0.12)'},
];

function parseDate(value: string): Date | null {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function mapProfile(staff: AnyRecord): ProfileInfo {
  const firstName = pickString(staff, ['first_name']);
  const lastName = pickString(staff, ['last_name']);
  const name =
    pickString(staff, ['name']) ||
    [firstName, lastName].filter(Boolean).join(' ') ||
    'Employee';
  const id = pickString(staff, ['id'], '0');
  const employeeId = pickString(staff, ['employee_code', 'employee_id'], `EMP-${id}`);
  const department = pickString(staff, ['department']);
  const office = pickString(staff, ['office', 'branch'], department || 'Head Office');
  const address = pickString(staff, ['address']);
  const city = pickString(staff, ['city']);
  const dob = pickString(staff, ['dob', 'date_of_birth']);
  const phone = pickString(staff, ['phone']);
  const email = pickString(staff, ['email']);

  const details: ProfileDetailRow[] = [
    {id: 'dept', icon: 'briefcase', label: department || 'Department not set'},
    {id: 'office', icon: 'building', label: office},
    {id: 'phone', icon: 'phone', label: phone || 'No phone on file'},
    {id: 'email', icon: 'email', label: email || 'No email on file'},
    {
      id: 'address',
      icon: 'location',
      label: [address, city].filter(Boolean).join(', ') || 'No address on file',
    },
    {id: 'birthday', icon: 'birthday', label: dob || 'Not set'},
  ];

  const emergencyName =
    pickString(staff, ['emergency_contact_name', 'emergency_name']) ||
    pickString(staff, ['emergency_contact']) ||
    'Not provided';
  const emergencyPhone = pickString(staff, ['emergency_contact_phone', 'emergency_phone']);

  return {
    name,
    title: pickString(staff, ['designation'], 'Staff'),
    employeeId,
    initials: initialsFromName(name),
    avatarColor: avatarColorFromId(id),
    online: true,
    details,
    emergencyName,
    emergencyPhone,
  };
}

function mapShiftKind(value: string): ShiftKind {
  const key = value.toLowerCase();
  if (key.includes('night')) {
    return 'night';
  }
  if (key.includes('even') || key.includes('after')) {
    return 'evening';
  }
  return 'morning';
}

function mapShiftItem(item: AnyRecord, index: number): ShiftItem {
  const row = asRecord(item);
  const id = pickString(row, ['id'], String(index));
  const name = pickString(row, ['name', 'shift_name', 'title'], 'Shift');
  const day = pickString(row, ['day', 'weekday']);
  const startTime = pickString(row, ['start_time', 'from']);
  const endTime = pickString(row, ['end_time', 'to']);
  const time = [startTime, endTime].filter(Boolean).join(' – ') || 'Time TBD';
  return {
    id,
    title: [day, name].filter(Boolean).join(' · ') || name,
    time,
    kind: mapShiftKind(pickString(row, ['type', 'shift_type', 'name'])),
  };
}

function mapSalaryRow(item: AnyRecord, index: number): SalaryRow {
  const row = asRecord(item);
  const id = pickString(row, ['id'], String(index));
  const monthLabel =
    pickString(row, ['month', 'period', 'pay_period']) ||
    (() => {
      const date = parseDate(pickString(row, ['created_at', 'date', 'paid_at']));
      return date
        ? date.toLocaleDateString('en-US', {month: 'short', year: 'numeric'})
        : '';
    })();
  const bonusVal = pickNumber(row, ['bonus', 'bonus_amount']);
  const deductionVal = pickNumber(row, ['deduction', 'deductions']);
  return {
    id,
    month: monthLabel || 'N/A',
    base: formatMoney(pickNumber(row, ['basic_salary', 'base_salary', 'net_salary'])),
    bonus: `+${formatMoney(bonusVal)}`,
    deduction: `-${formatMoney(deductionVal)}`,
  };
}

function mapBonusItem(item: AnyRecord, index: number): BonusItem {
  const row = asRecord(item);
  const id = pickString(row, ['id'], String(index));
  const title = pickString(row, ['title', 'reason', 'description'], 'Bonus');
  const date = pickString(row, ['date', 'created_at']).slice(0, 10);
  const reference = pickString(row, ['reference', 'code'], `B-${id}`);
  const statusRaw = pickString(row, ['status'], 'pending').toLowerCase();
  const status: BonusItem['status'] =
    statusRaw.includes('approve') || statusRaw.includes('paid')
      ? 'approved'
      : 'pending';
  return {
    id,
    title,
    meta: [date, reference].filter(Boolean).join(' · '),
    amount: `+${formatMoney(pickNumber(row, ['amount']))}`,
    status,
  };
}

function mapAttendanceStatus(raw: string): AttendanceDayCell['status'] {
  const status = raw.toLowerCase();
  if (status.includes('present') || status === 'p') {
    return 'P';
  }
  if (status.includes('absent') || status === 'a') {
    return 'A';
  }
  if (status.includes('leave') || status === 'l') {
    return 'L';
  }
  return null;
}

function buildAttendanceDayMap(
  rows: AnyRecord[],
  year: number,
  monthIndex: number,
): Record<number, {status: AttendanceDayCell['status']; recordId: string | null}> {
  const map: Record<
    number,
    {status: AttendanceDayCell['status']; recordId: string | null}
  > = {};
  rows.forEach(item => {
    const row = asRecord(item);
    const date = parseDate(
      pickString(row, ['date', 'attendance_date', 'created_at']),
    );
    if (!date || date.getFullYear() !== year || date.getMonth() !== monthIndex) {
      return;
    }
    const code = mapAttendanceStatus(pickString(row, ['status'], ''));
    if (!code) {
      return;
    }
    map[date.getDate()] = {
      status: code,
      recordId: pickString(row, ['id'], '') || null,
    };
  });
  return map;
}

function buildMonthCells(
  year: number,
  monthIndex: number,
  dayMap: Record<
    number,
    {status: AttendanceDayCell['status']; recordId: string | null}
  >,
): AttendanceDayCell[] {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const startWeekday = new Date(year, monthIndex, 1).getDay();
  const cells: AttendanceDayCell[] = [];

  for (let i = 0; i < startWeekday; i += 1) {
    cells.push({day: null, status: null});
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const weekday = new Date(year, monthIndex, day).getDay();
    const isWeekend = weekday === 0 || weekday === 6;
    const entry = dayMap[day];
    cells.push({
      day,
      status: entry?.status ?? null,
      isWeekend,
      recordId: entry?.recordId ?? null,
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push({day: null, status: null});
  }

  return cells;
}

function summarizeAttendance(
  dayMap: Record<
    number,
    {status: AttendanceDayCell['status']; recordId: string | null}
  >,
): AttendanceSummary {
  return Object.values(dayMap).reduce(
    (acc, entry) => {
      if (entry.status === 'P') {
        acc.present += 1;
      } else if (entry.status === 'A') {
        acc.absent += 1;
      } else if (entry.status === 'L') {
        acc.onLeave += 1;
      }
      return acc;
    },
    {present: 0, absent: 0, onLeave: 0},
  );
}

const MONTH_OPTIONS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

function buildYearOptions(centerYear: number): string[] {
  return [
    String(centerYear - 1),
    String(centerYear),
    String(centerYear + 1),
  ];
}

export function useStaffOverviewController(): StaffOverviewController {
  const colors = useThemeColors();
  const navigation = useNavigation<OverviewNav>();
  const route = useRoute<OverviewRoute>();
  const userName = useAppSelector(state => state.app.userName);
  const employeeId = route.params.employeeId;

  const [activeTab, setActiveTab] = useState<ProfileTabId>(
    route.params.initialTab ?? 'overview',
  );
  const [salarySearch, setSalarySearch] = useState('');
  const [bonusSearch, setBonusSearch] = useState('');
  const [shiftSearch, setShiftSearch] = useState('');
  const [documentSearch, setDocumentSearch] = useState('');
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [uploadMedia, setUploadMedia] = useState<PickedMedia | null>(null);
  const [isAddSalaryModalVisible, setIsAddSalaryModalVisible] = useState(false);
  const [isAddBonusModalVisible, setIsAddBonusModalVisible] = useState(false);
  const [isAssignShiftModalVisible, setIsAssignShiftModalVisible] =
    useState(false);
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  const [profile, setProfile] = useState<ProfileInfo>(EMPTY_PROFILE);
  const [stats, setStats] = useState<InfoStatCardData[]>(EMPTY_STATS);
  const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary>({
    present: 0,
    absent: 0,
    onLeave: 0,
  });
  const [attendanceLegend, setAttendanceLegend] = useState({
    present: 0,
    absent: 0,
    leave: 0,
  });
  const [attendanceCells, setAttendanceCells] = useState<AttendanceDayCell[]>([]);
  const [isSavingAttendance, setIsSavingAttendance] = useState(false);
  const [salaryYtd, setSalaryYtd] = useState('$0');
  const [allSalaryRows, setAllSalaryRows] = useState<SalaryRow[]>([]);
  const [bonusTotal, setBonusTotal] = useState('$0');
  const [allBonusItems, setAllBonusItems] = useState<BonusItem[]>([]);
  const [allShiftItems, setAllShiftItems] = useState<ShiftItem[]>([]);

  const now = useMemo(() => new Date(), []);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const attendanceMonth = MONTH_OPTIONS[selectedMonthIndex];
  const attendanceYear = String(selectedYear);
  const attendanceMonthOptions = MONTH_OPTIONS;
  const attendanceYearOptions = useMemo(
    () => buildYearOptions(now.getFullYear()),
    [now],
  );

  const applyAttendanceRows = useCallback(
    (attendanceRows: AnyRecord[], year: number, monthIndex: number) => {
      const dayMap = buildAttendanceDayMap(attendanceRows, year, monthIndex);
      const cells = buildMonthCells(year, monthIndex, dayMap);
      const counts = summarizeAttendance(dayMap);
      setAttendanceCells(cells);
      setAttendanceSummary(counts);
      setAttendanceLegend({
        present: counts.present,
        absent: counts.absent,
        leave: counts.onLeave,
      });
      return counts;
    },
    [],
  );

  const fetchAttendanceForMonth = useCallback(
    async (year: number, monthIndex: number) => {
      const dateFrom = `${year}-${String(monthIndex + 1).padStart(2, '0')}-01`;
      const lastDay = new Date(year, monthIndex + 1, 0).getDate();
      const dateTo = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
      const attendanceRes = await staffManagementAttendanceService
        .listAttendance({
          staff_id: Number(employeeId),
          date_from: dateFrom,
          date_to: dateTo,
          per_page: 100,
        })
        .catch(() => null);
      const attendanceRows = attendanceRes ? unwrapList(attendanceRes) : [];
      return applyAttendanceRows(attendanceRows, year, monthIndex);
    },
    [applyAttendanceRows, employeeId],
  );

  const fetchData = useCallback(async () => {
    try {
      const dateFrom = `${selectedYear}-${String(selectedMonthIndex + 1).padStart(2, '0')}-01`;
      const lastDay = new Date(selectedYear, selectedMonthIndex + 1, 0).getDate();
      const dateTo = `${selectedYear}-${String(selectedMonthIndex + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

      const [staffRes, attendanceRes, salariesRes, bonusesRes, shiftsRes] =
        await Promise.all([
          staffManagementStaffService.getStaffById(employeeId),
          staffManagementAttendanceService
            .listAttendance({
              staff_id: Number(employeeId),
              date_from: dateFrom,
              date_to: dateTo,
              per_page: 100,
            })
            .catch(() => null),
          staffManagementSalariesService
            .listSalaries({staff_id: employeeId, per_page: 50})
            .catch(() => null),
          accountingBonusesService
            .listBonuses({staff_id: employeeId, per_page: 50})
            .catch(() => null),
          staffManagementShiftsService
            .listShifts({staff_id: employeeId, per_page: 50})
            .catch(() => null),
        ]);

      const staff = asRecord(unwrapData(staffRes));
      const attendanceRows = attendanceRes ? unwrapList(attendanceRes) : [];
      const salaryRows = salariesRes ? unwrapList(salariesRes) : [];
      const bonusRows = bonusesRes ? unwrapList(bonusesRes) : [];
      const shiftRows = shiftsRes ? unwrapList(shiftsRes) : [];

      setProfile(mapProfile(staff));

      const year = selectedYear;
      const monthIndex = selectedMonthIndex;
      const counts = applyAttendanceRows(attendanceRows, year, monthIndex);

      const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

      const mappedShifts = shiftRows.map(mapShiftItem);
      setAllShiftItems(mappedShifts);

      const mappedSalaries = salaryRows.map(mapSalaryRow);
      setAllSalaryRows(mappedSalaries);
      const ytdTotal = salaryRows.reduce(
        (sum, item) =>
          sum +
          pickNumber(asRecord(item), [
            'basic_salary',
            'base_salary',
            'net_salary',
          ]),
        0,
      );
      setSalaryYtd(formatMoney(ytdTotal));

      const mappedBonuses = bonusRows.map(mapBonusItem);
      setAllBonusItems(mappedBonuses);
      const bonusesTotal = bonusRows.reduce(
        (sum, item) => sum + pickNumber(asRecord(item), ['amount']),
        0,
      );
      setBonusTotal(formatMoney(bonusesTotal));

      const monthlySalary =
        pickNumber(staff, ['basic_salary']) ||
        pickNumber(asRecord(salaryRows[0]), ['basic_salary', 'base_salary']);
      const leaveBalance = pickNumber(staff, ['leave_balance', 'remaining_leaves']);
      const currentShift = mappedShifts[0];

      setStats([
        {
          id: 'shift',
          label: 'Current Shift',
          value: currentShift
            ? `${titleCase(currentShift.kind)} · ${currentShift.time}`
            : 'Not assigned',
          icon: 'shiftClock',
          iconBg: colors.actionTint12,
        },
        {
          id: 'present',
          label: 'Present Days',
          value: `${counts.present} / ${daysInMonth}`,
          icon: 'presentDays',
          iconBg: 'rgba(32,180,107,0.12)',
        },
        {
          id: 'leave',
          label: 'Leave Balance',
          value: `${leaveBalance} days`,
          icon: 'leaveBalance',
          iconBg: 'rgba(245,158,11,0.14)',
        },
        {
          id: 'salary',
          label: 'Monthly Salary',
          value: formatMoney(monthlySalary),
          icon: 'monthlySalary',
          iconBg: 'rgba(139,92,246,0.12)',
        },
      ]);
    } catch (error) {
      showMessage({
        message: getApiErrorMessage(error, 'Failed to load employee profile'),
        type: 'danger',
      });
    }
  }, [
    applyAttendanceRows,
    employeeId,
    selectedMonthIndex,
    selectedYear,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onAttendanceMonthChange = useCallback((month: string) => {
    const index = MONTH_OPTIONS.findIndex(item => item === month);
    if (index >= 0) {
      setSelectedMonthIndex(index);
    }
  }, []);

  const onAttendanceYearChange = useCallback((year: string) => {
    const parsed = Number(year);
    if (Number.isFinite(parsed)) {
      setSelectedYear(parsed);
    }
  }, []);

  const onAttendanceTodayPress = useCallback(() => {
    const today = new Date();
    setSelectedMonthIndex(today.getMonth());
    setSelectedYear(today.getFullYear());
  }, []);

  const onDayStatusSelect = useCallback(
    async (
      day: number,
      status: AttendanceStatusChoice,
      recordId?: string | null,
    ) => {
      const date = `${selectedYear}-${String(selectedMonthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      setIsSavingAttendance(true);
      try {
        if (recordId) {
          await staffManagementAttendanceService.updateAttendanceById(recordId, {
            status,
          });
        } else {
          await staffManagementAttendanceService.createAttendance({
            staff_id: Number(employeeId),
            date,
            status,
          });
        }
        const counts = await fetchAttendanceForMonth(
          selectedYear,
          selectedMonthIndex,
        );
        const daysInMonth = new Date(
          selectedYear,
          selectedMonthIndex + 1,
          0,
        ).getDate();
        setStats(prev =>
          prev.map(item =>
            item.id === 'present'
              ? {...item, value: `${counts.present} / ${daysInMonth}`}
              : item,
          ),
        );
        showMessage({
          message: `Marked ${status} for ${date}`,
          type: 'success',
        });
      } catch (error) {
        showMessage({
          message: getApiErrorMessage(error, 'Failed to save attendance'),
          type: 'danger',
        });
      } finally {
        setIsSavingAttendance(false);
      }
    },
    [employeeId, fetchAttendanceForMonth, selectedMonthIndex, selectedYear],
  );
  const salaryRows = useMemo(() => {
    const query = salarySearch.trim().toLowerCase();
    if (!query) {
      return allSalaryRows;
    }
    return allSalaryRows.filter(row => row.month.toLowerCase().includes(query));
  }, [allSalaryRows, salarySearch]);

  const bonusItems = useMemo(() => {
    const query = bonusSearch.trim().toLowerCase();
    if (!query) {
      return allBonusItems;
    }
    return allBonusItems.filter(
      item =>
        item.title.toLowerCase().includes(query) ||
        item.meta.toLowerCase().includes(query),
    );
  }, [allBonusItems, bonusSearch]);

  const shiftItems = useMemo(() => {
    const query = shiftSearch.trim().toLowerCase();
    if (!query) {
      return allShiftItems;
    }
    return allShiftItems.filter(
      item =>
        item.title.toLowerCase().includes(query) ||
        item.time.toLowerCase().includes(query),
    );
  }, [allShiftItems, shiftSearch]);

  const documentItems = useMemo(() => {
    const query = documentSearch.trim().toLowerCase();
    if (!query) {
      return DOCUMENT_ITEMS;
    }
    return DOCUMENT_ITEMS.filter(
      item =>
        item.title.toLowerCase().includes(query) ||
        item.meta.toLowerCase().includes(query),
    );
  }, [documentSearch]);

  const onDownloadPress = useCallback(() => {}, []);
  const onUploadDocumentPress = useCallback(() => {
    setUploadMedia(null);
    setIsUploadModalVisible(true);
  }, []);
  const onCloseUploadModal = useCallback(() => {
    setIsUploadModalVisible(false);
    setUploadMedia(null);
  }, []);
  const onPickUploadDocument = useCallback(async () => {
    const media = await pickFromGallery();
    if (!media) {
      return;
    }
    setUploadMedia(media);
  }, []);
  const onConfirmUploadPress = useCallback(async () => {
    if (!uploadMedia) {
      showMessage({message: 'Select a file first', type: 'warning'});
      return;
    }
    setIsSubmittingAction(true);
    try {
      await staffManagementStaffService.uploadDocuments(
        employeeId,
        createMediaFormData('document', uploadMedia, {
          type: 'other',
        }),
      );
      showMessage({message: 'Document uploaded', type: 'success'});
      setIsUploadModalVisible(false);
      setUploadMedia(null);
      await fetchData();
    } catch (error) {
      showMessage({
        message: getApiErrorMessage(error, 'Failed to upload document'),
        type: 'danger',
      });
    } finally {
      setIsSubmittingAction(false);
    }
  }, [employeeId, fetchData, uploadMedia]);
  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onAddSalaryPress = useCallback(() => {
    setIsAddSalaryModalVisible(true);
  }, []);
  const onCloseAddSalaryModal = useCallback(() => {
    setIsAddSalaryModalVisible(false);
  }, []);
  const onConfirmAddSalary = useCallback(
    async (values: {
      month: string;
      base: string;
      bonus: string;
      deduct: string;
    }) => {
      const basic = parseMoneyInput(values.base);
      if (basic == null) {
        showMessage({message: 'Enter base salary', type: 'warning'});
        return;
      }
      const monthIndex =
        [
          'january',
          'february',
          'march',
          'april',
          'may',
          'june',
          'july',
          'august',
          'september',
          'october',
          'november',
          'december',
        ].indexOf(values.month.trim().toLowerCase()) + 1;
      setIsSubmittingAction(true);
      try {
        await staffManagementSalariesService.createSalaries({
          staff_id: Number(employeeId),
          month: monthIndex || new Date().getMonth() + 1,
          year: new Date().getFullYear(),
          basic_salary: basic,
          bonus_amount: parseMoneyInput(values.bonus),
          deductions: parseMoneyInput(values.deduct),
        });
        showMessage({message: 'Salary added', type: 'success'});
        setIsAddSalaryModalVisible(false);
        await fetchData();
      } catch (error) {
        showMessage({
          message: getApiErrorMessage(error, 'Failed to add salary'),
          type: 'danger',
        });
      } finally {
        setIsSubmittingAction(false);
      }
    },
    [employeeId, fetchData],
  );

  const onAddBonusPress = useCallback(() => {
    setIsAddBonusModalVisible(true);
  }, []);
  const onCloseAddBonusModal = useCallback(() => {
    setIsAddBonusModalVisible(false);
  }, []);
  const onConfirmAddBonus = useCallback(
    async (values: {
      bonusType: string;
      name: string;
      date: string;
      amount: string;
    }) => {
      const amount = parseMoneyInput(values.amount);
      const date = toIsoDate(values.date);
      if (amount == null) {
        showMessage({message: 'Enter bonus amount', type: 'warning'});
        return;
      }
      if (!date) {
        showMessage({message: 'Enter a valid date', type: 'warning'});
        return;
      }
      const typeMap: Record<string, string> = {
        performance: 'performance',
        festival: 'festival',
        commission: 'commission',
        other: 'other',
      };
      const bonusType =
        typeMap[values.bonusType.trim().toLowerCase()] || 'other';
      setIsSubmittingAction(true);
      try {
        await accountingBonusesService.createBonuses({
          staff_id: Number(employeeId),
          bonus_type: bonusType,
          amount,
          date,
          reason: values.name.trim() || undefined,
        });
        showMessage({message: 'Bonus added', type: 'success'});
        setIsAddBonusModalVisible(false);
        await fetchData();
      } catch (error) {
        showMessage({
          message: getApiErrorMessage(error, 'Failed to add bonus'),
          type: 'danger',
        });
      } finally {
        setIsSubmittingAction(false);
      }
    },
    [employeeId, fetchData],
  );

  const onAssignShiftPress = useCallback(() => {
    setIsAssignShiftModalVisible(true);
  }, []);
  const onCloseAssignShiftModal = useCallback(() => {
    setIsAssignShiftModalVisible(false);
  }, []);
  const onConfirmAssignShift = useCallback(
    async (values: {
      shiftType: string;
      period: string;
      date: string;
      startTime: string;
      endTime: string;
    }) => {
      const effectiveFrom = toIsoDate(values.date);
      if (!effectiveFrom) {
        showMessage({message: 'Enter a valid date', type: 'warning'});
        return;
      }
      if (!values.startTime.trim() || !values.endTime.trim()) {
        showMessage({message: 'Enter start and end time', type: 'warning'});
        return;
      }
      setIsSubmittingAction(true);
      try {
        const created = await staffManagementShiftsService.createShifts({
          name: `${values.period} ${values.shiftType}`.trim(),
          start_time: values.startTime.trim(),
          end_time: values.endTime.trim(),
          description: `${values.shiftType} · ${values.period}`,
        });
        const shift = asRecord(unwrapData(created));
        const shiftId = shift.id;
        if (shiftId == null) {
          throw new Error('Shift created but id missing');
        }
        await staffManagementShiftsService.assignShift(shiftId, {
          staff_id: Number(employeeId),
          effective_from: effectiveFrom,
        });
        showMessage({message: 'Shift assigned', type: 'success'});
        setIsAssignShiftModalVisible(false);
        await fetchData();
      } catch (error) {
        showMessage({
          message: getApiErrorMessage(error, 'Failed to assign shift'),
          type: 'danger',
        });
      } finally {
        setIsSubmittingAction(false);
      }
    },
    [employeeId, fetchData],
  );

  return {
    isLoading: false,
    userName: userName || 'User',
    dateLabel: todayLabel(),
    stats,
    rating: 4.9,
    ratingCaption: 'Top 4% of your department',
    profile,
    tabs: TABS,
    activeTab,
    quickStats: QUICK_STATS,
    trendValues: TREND_VALUES,
    trendGrowth: '14%',
    attendanceSummary,
    attendanceLegend,
    attendanceMonth,
    attendanceYear,
    attendanceMonthOptions,
    attendanceYearOptions,
    attendanceWeekDays: WEEK_DAYS,
    attendanceCells,
    isSavingAttendance,
    onAttendanceMonthChange,
    onAttendanceYearChange,
    onAttendanceTodayPress,
    onDayStatusSelect,
    salaryYtd,
    salaryRows,
    salarySearch,
    bonusTotal,
    bonusItems,
    bonusSearch,
    shiftItems,
    shiftSearch,
    documentTotalLabel: `${documentItems.length} documents`,
    documentItems,
    documentSearch,
    isUploadModalVisible,
    uploadFileName: uploadMedia?.name ?? null,
    isAddSalaryModalVisible,
    isAddBonusModalVisible,
    isAssignShiftModalVisible,
    isSubmittingAction,
    setActiveTab,
    setSalarySearch,
    setBonusSearch,
    setShiftSearch,
    setDocumentSearch,
    onUploadDocumentPress,
    onCloseUploadModal,
    onPickUploadDocument,
    onConfirmUploadPress,
    onAddSalaryPress,
    onCloseAddSalaryModal,
    onConfirmAddSalary,
    onAddBonusPress,
    onCloseAddBonusModal,
    onConfirmAddBonus,
    onAssignShiftPress,
    onCloseAssignShiftModal,
    onConfirmAssignShift,
    onDownloadPress,
    onBackPress,
  };
}
