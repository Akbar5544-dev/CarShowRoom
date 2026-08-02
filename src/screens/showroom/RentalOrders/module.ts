import type {IconName} from '../../../assets/iconXml';
import type {MetricCardData} from '../../../components';

export type RentalOrdersTabId =
  | 'orders'
  | 'history'
  | 'late'
  | 'invoices';

export type PaymentStatus = 'Paid' | 'Partial' | 'Pending' | 'Refund';
export type OrderStatus =
  | 'Active'
  | 'Overdue'
  | 'Reserved'
  | 'Completed'
  | 'Cancelled';

export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue' | 'Draft';

export type RentalOrderRow = {
  id: string;
  orderId: string;
  customer: string;
  amount: string;
  payment: PaymentStatus;
  status: OrderStatus;
};

export type LateReturnItem = {
  id: string;
  customer: string;
  orderId: string;
  vehicle: string;
  overdueLabel: string;
  lateFee: string;
};

export type InvoiceRow = {
  id: string;
  invoiceId: string;
  customer: string;
  amount: string;
  due: string;
  status: InvoiceStatus;
};

export type HistoryCompletedRow = {
  id: string;
  vehicle: string;
  days: string;
  amount: string;
};

export type RentalOrdersTab = {
  id: RentalOrdersTabId;
  label: string;
  icon: IconName;
};

export type RentalOrdersController = {
  tabs: RentalOrdersTab[];
  activeTab: RentalOrdersTabId;
  ordersSummary: string;
  historySummary: string;
  lateSummary: string;
  invoicesSummary: string;
  searchQuery: string;
  invoiceSearchQuery: string;
  showingLabel: string;
  orders: RentalOrderRow[];
  lateReturns: LateReturnItem[];
  invoiceMetrics: MetricCardData[];
  invoices: InvoiceRow[];
  historyRentalsSeries: number[];
  historyRevenueSeries: number[];
  historyCompleted: HistoryCompletedRow[];
  onBackPress: () => void;
  setActiveTab: (tab: RentalOrdersTabId) => void;
  setSearchQuery: (query: string) => void;
  setInvoiceSearchQuery: (query: string) => void;
  onExportPress: () => void;
  onExportPdfPress: () => void;
  isExportPdfModalVisible: boolean;
  onCloseExportPdfModal: () => void;
  onConfirmExportPdf: () => void;
  onPrintPress: () => void;
  onCreateInvoicePress: () => void;
  isCreateInvoiceModalVisible: boolean;
  onCloseCreateInvoiceModal: () => void;
  onConfirmCreateInvoice: () => void;
  onSendRemindersPress: () => void;
  isSendRemindersModalVisible: boolean;
  onCloseSendRemindersModal: () => void;
  onConfirmSendReminders: () => void;
  onStatusFilterPress: () => void;
  onDateFilterPress: () => void;
  onOrderPress: (orderId: string) => void;
  onInvoicePress: (invoiceId: string) => void;
  onViewInvoicePress: (invoiceId: string) => void;
  onCallPress: (id: string) => void;
  onEmailPress: (id: string) => void;
  onChargeFeePress: (id: string) => void;
};
