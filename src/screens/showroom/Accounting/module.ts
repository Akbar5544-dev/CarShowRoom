import type {MetricCardData} from '../../../components/MetricCard';

export type ExpenseBreakdownItem = {
  id: string;
  label: string;
  amount: string;
  progress: number;
};

export type ProfitLossPoint = {
  label: string;
  income: number;
  expense: number;
};

export type AccountingController = {
  isLoading: boolean;
  subtitle: string;
  metrics: MetricCardData[];
  profitLoss: ProfitLossPoint[];
  expenseBreakdown: ExpenseBreakdownItem[];
  cashFlow: number[];
  cashFlowPositive: boolean;
  onBackPress: () => void;
  onExportPress: () => void;
  onInvoicePress: () => void;
};
