import {useCallback, useEffect, useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {showMessage} from 'react-native-flash-message';
import {getApiErrorMessage} from '../../../api';
import type {MetricCardData} from '../../../components/MetricCard';
import type {HomeStackParamList} from '../../../navigation/types';
import {
  accountingExpensesService,
  accountingLedgerService,
  accountingSalesService,
} from '../../../services';
import {useThemeColors, type AppColors} from '../../../theme';
import {
  asRecord,
  formatMoney,
  pickNumber,
  pickString,
  unwrapData,
  unwrapList,
} from '../../../utils/apiHelpers';
import type {
  AccountingController,
  ExpenseBreakdownItem,
  ProfitLossPoint,
} from './module';

type Nav = NativeStackNavigationProp<HomeStackParamList, 'Accounting'>;

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const DEFAULT_PROFIT_LOSS: ProfitLossPoint[] = [
  {label: 'Jan', income: 42, expense: 28},
  {label: 'Feb', income: 55, expense: 32},
  {label: 'Mar', income: 48, expense: 36},
  {label: 'Apr', income: 70, expense: 40},
  {label: 'May', income: 62, expense: 38},
  {label: 'Jun', income: 78, expense: 45},
  {label: 'Jul', income: 85, expense: 50},
  {label: 'Aug', income: 72, expense: 44},
  {label: 'Sep', income: 90, expense: 52},
  {label: 'Oct', income: 68, expense: 41},
  {label: 'Nov', income: 80, expense: 48},
  {label: 'Dec', income: 95, expense: 55},
];

const DEFAULT_CASH_FLOW = [
  1.2, 1.8, 1.5, 2.4, 2.1, 3.2, 2.8, 3.8, 3.4, 4.2, 4.8, 5.4,
];

function compactMoney(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (abs >= 1000) {
    return `$${Math.round(value / 1000)}K`;
  }
  return formatMoney(value);
}

function buildMetrics(
  colors: AppColors,
  revenue: number,
  expenses: number,
  profit: number,
  cash: number,
): MetricCardData[] {
  return [
    {
      id: 'revenue',
      label: 'Total Revenue',
      value: compactMoney(revenue),
      change: '12.4%',
      positive: true,
      backgroundColor: colors.metricGreen,
      icon: 'trendUp',
      iconBg: 'rgba(32,180,107,0.15)',
      sparklineColor: colors.successBright,
      sparklinePoints: [10, 14, 12, 18, 16, 22, 20, 26],
    },
    {
      id: 'expenses',
      label: 'Expenses',
      value: compactMoney(expenses),
      change: '4.1%',
      positive: true,
      backgroundColor: colors.metricOrange,
      icon: 'trendDown',
      iconBg: 'rgba(245,158,11,0.14)',
      sparklineColor: colors.late,
      sparklinePoints: [18, 16, 17, 14, 15, 13, 14, 12],
    },
    {
      id: 'profit',
      label: 'Net Profit',
      value: compactMoney(profit),
      change: '18.2%',
      positive: true,
      backgroundColor: colors.metricBlue,
      icon: 'activityDollar',
      iconBg: colors.actionTint12,
      sparklineColor: colors.actionBlue,
      sparklinePoints: [8, 12, 11, 16, 15, 20, 19, 24],
    },
    {
      id: 'cash',
      label: 'Cash Balance',
      value: compactMoney(cash),
      change: '2.8%',
      positive: true,
      backgroundColor: colors.metricPurple,
      icon: 'payroll',
      iconBg: 'rgba(139,92,246,0.12)',
      sparklineColor: colors.deptSales,
      sparklinePoints: [14, 15, 14, 16, 17, 16, 18, 19],
    },
  ];
}

function buildExpenseBreakdown(
  rows: ReturnType<typeof unwrapList>,
): ExpenseBreakdownItem[] {
  const totals = new Map<string, number>();
  rows.forEach(item => {
    const row = asRecord(item);
    const category =
      pickString(row, ['category', 'category_name', 'type'], 'Other') ||
      'Other';
    const amount = pickNumber(row, ['amount', 'total', 'value']);
    totals.set(category, (totals.get(category) ?? 0) + amount);
  });

  if (!totals.size) {
    return [
      {id: 'maintenance', label: 'Maintenance', amount: '$12,400', progress: 0.18},
      {id: 'payroll', label: 'Payroll', amount: '$96,000', progress: 0.72},
      {id: 'insurance', label: 'Insurance', amount: '$8,200', progress: 0.1},
      {id: 'fuel', label: 'Fuel', amount: '$4,600', progress: 0.06},
      {id: 'other', label: 'Other', amount: '$3,800', progress: 0.05},
    ];
  }

  const entries = Array.from(totals.entries()).sort((a, b) => b[1] - a[1]);
  const max = Math.max(...entries.map(([, value]) => value), 1);
  return entries.slice(0, 5).map(([label, value]) => ({
    id: label.toLowerCase().replace(/\s+/g, '-'),
    label,
    amount: formatMoney(value),
    progress: Math.max(0.04, value / max),
  }));
}

export function useAccountingController(): AccountingController {
  const colors = useThemeColors();
  const navigation = useNavigation<Nav>();
  const [revenue, setRevenue] = useState(124000);
  const [expenses, setExpenses] = useState(54000);
  const [cash, setCash] = useState(312000);
  const [expenseBreakdown, setExpenseBreakdown] = useState<
    ExpenseBreakdownItem[]
  >(() => buildExpenseBreakdown([]));
  const [profitLoss, setProfitLoss] =
    useState<ProfitLossPoint[]>(DEFAULT_PROFIT_LOSS);
  const [cashFlow, setCashFlow] = useState(DEFAULT_CASH_FLOW);

  const profit = revenue - expenses;

  const metrics = useMemo(
    () => buildMetrics(colors, revenue, expenses, profit, cash),
    [cash, colors, expenses, profit, revenue],
  );

  const subtitle = useMemo(() => {
    const mom = profit > 0 ? '14.6%' : '0%';
    return `Net profit up ${mom} MoM • ${compactMoney(revenue)} income this month`;
  }, [profit, revenue]);

  const fetchData = useCallback(async () => {
    try {
      const [summaryRes, expensesRes, salesRes] = await Promise.all([
        accountingLedgerService.getLedgerSummary().catch(() => null),
        accountingExpensesService
          .listExpenses({per_page: 100})
          .catch(() => null),
        accountingSalesService.listSales({per_page: 50}).catch(() => null),
      ]);

      const summary = asRecord(unwrapData(summaryRes));
      const expenseRows = expensesRes ? unwrapList(expensesRes) : [];
      const salesRows = salesRes ? unwrapList(salesRes) : [];

      const incomeFromSummary = pickNumber(summary, [
        'income',
        'total_income',
        'revenue',
        'total_revenue',
      ]);
      const expenseFromSummary = pickNumber(summary, [
        'expense',
        'expenses',
        'total_expense',
        'total_expenses',
      ]);
      const cashFromSummary = pickNumber(summary, [
        'cash_balance',
        'balance',
        'cash',
        'net_balance',
      ]);

      const salesTotal = salesRows.reduce((sum, item) => {
        const row = asRecord(item);
        return sum + pickNumber(row, ['sale_price', 'amount', 'total', 'price']);
      }, 0);
      const expenseTotal = expenseRows.reduce((sum, item) => {
        const row = asRecord(item);
        return sum + pickNumber(row, ['amount', 'total', 'value']);
      }, 0);

      const nextRevenue = incomeFromSummary || salesTotal || 124000;
      const nextExpenses = expenseFromSummary || expenseTotal || 54000;
      const nextCash =
        cashFromSummary ||
        Math.max(0, nextRevenue - nextExpenses + 240000) ||
        312000;

      setRevenue(nextRevenue);
      setExpenses(nextExpenses);
      setCash(nextCash);
      setExpenseBreakdown(buildExpenseBreakdown(expenseRows));

      const monthly = asRecord(summary.monthly ?? summary.months ?? {});
      if (Array.isArray(monthly) && monthly.length) {
        setProfitLoss(
          monthly.slice(0, 12).map((item: unknown, index: number) => {
            const row = asRecord(item);
            return {
              label:
                pickString(row, ['label', 'month'], MONTHS[index]) ||
                MONTHS[index],
              income: pickNumber(row, ['income', 'revenue'], 40 + index * 3),
              expense: pickNumber(row, ['expense', 'expenses'], 25 + index * 2),
            };
          }),
        );
      }

      const flow = Array.isArray(summary.cash_flow)
        ? summary.cash_flow.map((v: unknown) => Number(v) || 0)
        : null;
      if (flow?.length) {
        setCashFlow(flow);
      }
    } catch (error) {
      showMessage({
        message: getApiErrorMessage(error, 'Failed to load accounting'),
        type: 'danger',
      });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onExportPress = useCallback(() => {
    showMessage({message: 'Export ready soon', type: 'info'});
  }, []);

  const onInvoicePress = useCallback(() => {
    navigation.navigate('Invoices');
  }, [navigation]);

  return {
    isLoading: false,
    subtitle,
    metrics,
    profitLoss,
    expenseBreakdown,
    cashFlow,
    cashFlowPositive: cashFlow[cashFlow.length - 1] >= cashFlow[0],
    onBackPress,
    onExportPress,
    onInvoicePress,
  };
}
