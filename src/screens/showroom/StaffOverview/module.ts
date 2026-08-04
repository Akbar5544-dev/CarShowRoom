import {
  AttendanceDayCell,
  AttendanceStatusChoice,
  AttendanceSummary,
} from '../../../components/AttendancePanel';
import {BonusItem} from '../../../components/BonusesPanel';
import {DocumentItem} from '../../../components/DocumentsPanel';
import {InfoStatCardData} from '../../../components/InfoStatCard';
import {ProfileInfo} from '../../../components/ProfileInfoCard';
import {ProfileTabId} from '../../../components/ProfileTabs';
import {QuickStat} from '../../../components/QuickStatsRow';
import {SalaryRow} from '../../../components/SalaryPanel';
import {ShiftItem} from '../../../components/ShiftsPanel';

export type StaffOverviewParams = {
  employeeId: string;
  initialTab?: ProfileTabId;
};

export type StaffOverviewControllerState = {
  isLoading: boolean;
  userName: string;
  dateLabel: string;
  stats: InfoStatCardData[];
  rating: number;
  ratingCaption: string;
  profile: ProfileInfo;
  tabs: {id: ProfileTabId; label: string}[];
  activeTab: ProfileTabId;
  quickStats: QuickStat[];
  trendValues: number[];
  trendGrowth: string;
  attendanceSummary: AttendanceSummary;
  attendanceLegend: {present: number; absent: number; leave: number};
  attendanceMonth: string;
  attendanceYear: string;
  attendanceMonthOptions: readonly string[];
  attendanceYearOptions: string[];
  attendanceWeekDays: string[];
  attendanceCells: AttendanceDayCell[];
  isSavingAttendance: boolean;
  onAttendanceMonthChange: (month: string) => void;
  onAttendanceYearChange: (year: string) => void;
  onAttendanceTodayPress: () => void;
  onDayStatusSelect: (
    day: number,
    status: AttendanceStatusChoice,
    recordId?: string | null,
  ) => void;
  salaryYtd: string;
  salaryRows: SalaryRow[];
  salarySearch: string;
  bonusTotal: string;
  bonusItems: BonusItem[];
  bonusSearch: string;
  shiftItems: ShiftItem[];
  shiftSearch: string;
  documentTotalLabel: string;
  documentItems: DocumentItem[];
  documentSearch: string;
  isUploadModalVisible: boolean;
  uploadFileName: string | null;
  uploadCount: number;
  isMonthlyFilterModalVisible: boolean;
  isAddSalaryModalVisible: boolean;
  isAddBonusModalVisible: boolean;
  isAssignShiftModalVisible: boolean;
  isSubmittingAction: boolean;
  setActiveTab: (tab: ProfileTabId) => void;
  setSalarySearch: (text: string) => void;
  setBonusSearch: (text: string) => void;
  setShiftSearch: (text: string) => void;
  setDocumentSearch: (text: string) => void;
  onUploadDocumentPress: () => void;
  onCloseUploadModal: () => void;
  onPickUploadDocument: () => void;
  onConfirmUploadPress: () => void;
  onOpenMonthlyFilterPress: () => void;
  onCloseMonthlyFilterModal: () => void;
  onAddSalaryPress: () => void;
  onCloseAddSalaryModal: () => void;
  onConfirmAddSalary: (values: {
    month: string;
    base: string;
    bonus: string;
    deduct: string;
  }) => void;
  onAddBonusPress: () => void;
  onCloseAddBonusModal: () => void;
  onConfirmAddBonus: (values: {
    bonusType: string;
    name: string;
    date: string;
    amount: string;
  }) => void;
  onAssignShiftPress: () => void;
  onCloseAssignShiftModal: () => void;
  onConfirmAssignShift: (values: {
    shiftType: string;
    period: string;
    date: string;
    startTime: string;
    endTime: string;
  }) => void;
  onDownloadPress: () => void;
  onBackPress: () => void;
};

export type StaffOverviewController = StaffOverviewControllerState;
