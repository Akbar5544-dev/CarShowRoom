import {useCallback, useEffect, useMemo, useState} from 'react';
import {Share} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {showMessage} from 'react-native-flash-message';
import {getApiErrorMessage} from '../../../api';
import type {MetricCardData} from '../../../components/MetricCard';
import type {HomeStackParamList} from '../../../navigation/types';
import {
  accountingExpensesService,
  accountingSalesService,
} from '../../../services';
import {useThemeColors, type AppColors} from '../../../theme';
import {
  asRecord,
  formatMoney,
  pickNumber,
  pickString,
  toIsoDate,
  unwrapList,
} from '../../../utils/apiHelpers';
import type {
  CreateInvoiceForm,
  InvoiceLineItem,
  InvoiceStatus,
  InvoiceType,
  InvoicesController,
  LedgerInvoice,
} from './module';

type Nav = NativeStackNavigationProp<HomeStackParamList, 'Invoices'>;

function newLine(): InvoiceLineItem {
  return {
    id: `line-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    description: '',
    qty: '1',
    price: '',
  };
}

const EMPTY_CREATE: CreateInvoiceForm = {
  type: 'Receivable',
  category: 'Sales',
  status: 'Draft',
  partyName: '',
  partyEmail: '',
  dueDate: '',
  notes: '',
  lineItems: [newLine()],
};

const SEED: LedgerInvoice[] = [
  {
    id: '1',
    code: 'AR-1088',
    type: 'Receivable',
    party: 'Corporate Fleet Co.',
    email: 'billing@corporatefleet.co',
    amount: 12400,
    amountLabel: '$12,400',
    category: 'Rental',
    status: 'Sent',
    dueDate: '2026-08-12',
    notes: 'Monthly billing cycle',
    lineItems: [
      {
        id: 'l1',
        description: 'Monthly fleet rental - 4 vehicles',
        qty: '1',
        price: '12400',
      },
    ],
    shareUrl: 'https://drivehub.co/i/AR-1088',
  },
  {
    id: '2',
    code: 'AP-441',
    type: 'Payable',
    party: 'City Insurance Ltd.',
    email: 'accounts@cityinsure.com',
    amount: 8200,
    amountLabel: '$8,200',
    category: 'Insurance',
    status: 'Overdue',
    dueDate: '2026-07-20',
    notes: '',
    lineItems: [
      {
        id: 'l2',
        description: 'Fleet insurance premium - Q3',
        qty: '1',
        price: '8200',
      },
    ],
    shareUrl: 'https://drivehub.co/i/AP-441',
  },
  {
    id: '3',
    code: 'AR-1091',
    type: 'Receivable',
    party: 'Nova Logistics',
    email: 'finance@novalogistics.com',
    amount: 15000,
    amountLabel: '$15,000',
    category: 'Sales',
    status: 'Paid',
    dueDate: '2026-07-05',
    notes: '',
    lineItems: [
      {
        id: 'l3',
        description: 'Vehicle sale deposit settlement',
        qty: '1',
        price: '15000',
      },
    ],
    shareUrl: 'https://drivehub.co/i/AR-1091',
  },
];

function lineTotal(item: InvoiceLineItem): number {
  const qty = Number(item.qty.replace(/[^0-9.]/g, '')) || 0;
  const price = Number(item.price.replace(/[^0-9.]/g, '')) || 0;
  return qty * price;
}

function formTotal(form: CreateInvoiceForm): number {
  return form.lineItems.reduce((sum, item) => sum + lineTotal(item), 0);
}

function buildMetrics(
  colors: AppColors,
  invoices: LedgerInvoice[],
): MetricCardData[] {
  const receivable = invoices
    .filter(i => i.type === 'Receivable' && i.status !== 'Paid')
    .reduce((s, i) => s + i.amount, 0);
  const payable = invoices
    .filter(i => i.type === 'Payable' && i.status !== 'Paid')
    .reduce((s, i) => s + i.amount, 0);
  const collected = invoices
    .filter(i => i.type === 'Receivable' && i.status === 'Paid')
    .reduce((s, i) => s + i.amount, 0);
  const overdue = invoices
    .filter(i => i.status === 'Overdue')
    .reduce((s, i) => s + i.amount, 0);

  return [
    {
      id: 'receivable',
      label: 'Receivable',
      value: formatMoney(receivable || 27400),
      change: '7.4%',
      positive: true,
      backgroundColor: colors.metricBlue,
      icon: 'activityDollar',
      iconBg: colors.actionTint12,
      sparklineColor: colors.actionBlue,
      sparklinePoints: [10, 12, 11, 15, 14, 18, 17, 20],
    },
    {
      id: 'payable',
      label: 'Payable',
      value: formatMoney(payable || 14860),
      change: '2%',
      positive: false,
      backgroundColor: colors.metricOrange,
      icon: 'trendDown',
      iconBg: 'rgba(245,158,11,0.14)',
      sparklineColor: colors.late,
      sparklinePoints: [18, 17, 16, 15, 14, 13, 12, 11],
    },
    {
      id: 'collected',
      label: 'Collected (MTD)',
      value: formatMoney(collected || 32110),
      change: '11%',
      positive: true,
      backgroundColor: colors.metricGreen,
      icon: 'trendUp',
      iconBg: 'rgba(32,180,107,0.15)',
      sparklineColor: colors.successBright,
      sparklinePoints: [8, 10, 12, 14, 13, 17, 18, 22],
    },
    {
      id: 'overdue',
      label: 'Overdue',
      value: formatMoney(overdue || 4120),
      change: '3.2%',
      positive: true,
      backgroundColor: colors.metricPurple,
      icon: 'statusOverdue',
      iconBg: 'rgba(139,92,246,0.12)',
      sparklineColor: colors.deptSales,
      sparklinePoints: [12, 11, 13, 12, 14, 13, 15, 14],
    },
  ];
}

function mapSaleToInvoice(row: Record<string, any>, index: number): LedgerInvoice {
  const id = String(row.id ?? index + 1);
  const amount = pickNumber(row, ['sale_price', 'amount', 'total', 'price']);
  const party =
    pickString(row, ['buyer_name', 'customer_name', 'customer'], '') ||
    pickString(asRecord(row.customer), ['name'], `Customer ${id}`);
  const code = pickString(row, ['invoice_no', 'code'], `AR-${1000 + index}`);
  return {
    id,
    code,
    type: 'Receivable',
    party,
    email: pickString(row, ['email', 'buyer_email'], ''),
    amount,
    amountLabel: formatMoney(amount),
    category: 'Sales',
    status: 'Sent',
    dueDate: pickString(row, ['sale_date', 'due_date', 'created_at'], ''),
    notes: pickString(row, ['notes', 'remarks'], ''),
    lineItems: [
      {
        id: `sale-${id}`,
        description: pickString(row, ['vehicle_name', 'description'], 'Vehicle sale'),
        qty: '1',
        price: String(amount || 0),
      },
    ],
    shareUrl: `https://drivehub.co/i/${code}`,
  };
}

function mapExpenseToInvoice(
  row: Record<string, any>,
  index: number,
): LedgerInvoice {
  const id = String(row.id ?? `e-${index}`);
  const amount = pickNumber(row, ['amount', 'total', 'value']);
  const code = pickString(row, ['reference', 'code'], `AP-${400 + index}`);
  return {
    id,
    code,
    type: 'Payable',
    party: pickString(row, ['vendor', 'supplier', 'title'], 'Vendor'),
    email: pickString(row, ['email'], ''),
    amount,
    amountLabel: formatMoney(amount),
    category: pickString(row, ['category', 'category_name'], 'Other'),
    status: 'Draft',
    dueDate: pickString(row, ['expense_date', 'date', 'created_at'], ''),
    notes: pickString(row, ['notes', 'description'], ''),
    lineItems: [
      {
        id: `exp-${id}`,
        description: pickString(row, ['title', 'description'], 'Expense'),
        qty: '1',
        price: String(amount || 0),
      },
    ],
    shareUrl: `https://drivehub.co/i/${code}`,
  };
}

export function useInvoicesController(): InvoicesController {
  const colors = useThemeColors();
  const navigation = useNavigation<Nav>();
  const [search, setSearch] = useState('');
  const [invoices, setInvoices] = useState<LedgerInvoice[]>(SEED);
  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [isShareVisible, setIsShareVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<LedgerInvoice | null>(
    null,
  );
  const [createForm, setCreateForm] = useState<CreateInvoiceForm>(EMPTY_CREATE);
  const [shareEmail, setShareEmail] = useState('');
  const [shareMessage, setShareMessage] = useState('');

  const metrics = useMemo(
    () => buildMetrics(colors, invoices),
    [colors, invoices],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return invoices;
    }
    return invoices.filter(
      item =>
        item.code.toLowerCase().includes(q) ||
        item.party.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q),
    );
  }, [invoices, search]);

  const createTotalLabel = useMemo(
    () => formatMoney(formTotal(createForm)),
    [createForm],
  );

  const fetchData = useCallback(async () => {
    try {
      const [salesRes, expensesRes] = await Promise.all([
        accountingSalesService.listSales({per_page: 30}).catch(() => null),
        accountingExpensesService.listExpenses({per_page: 30}).catch(() => null),
      ]);
      const sales = salesRes
        ? unwrapList(salesRes).map((row, i) =>
            mapSaleToInvoice(asRecord(row), i),
          )
        : [];
      const expenses = expensesRes
        ? unwrapList(expensesRes)
            .slice(0, 8)
            .map((row, i) => mapExpenseToInvoice(asRecord(row), i))
        : [];
      const merged = [...sales, ...expenses];
      if (merged.length) {
        setInvoices(merged);
      }
    } catch (error) {
      showMessage({
        message: getApiErrorMessage(error, 'Failed to load invoices'),
        type: 'danger',
      });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateCreateField = useCallback(
    <K extends keyof CreateInvoiceForm>(key: K, value: CreateInvoiceForm[K]) => {
      setCreateForm(prev => ({...prev, [key]: value}));
    },
    [],
  );

  const updateLineItem = useCallback(
    (id: string, key: keyof Omit<InvoiceLineItem, 'id'>, value: string) => {
      setCreateForm(prev => ({
        ...prev,
        lineItems: prev.lineItems.map(item =>
          item.id === id ? {...item, [key]: value} : item,
        ),
      }));
    },
    [],
  );

  const onAddLineRow = useCallback(() => {
    setCreateForm(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, newLine()],
    }));
  }, []);

  const onRemoveLineRow = useCallback((id: string) => {
    setCreateForm(prev => ({
      ...prev,
      lineItems:
        prev.lineItems.length <= 1
          ? prev.lineItems
          : prev.lineItems.filter(item => item.id !== id),
    }));
  }, []);

  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onExportPress = useCallback(() => {
    showMessage({message: 'Export queued', type: 'info'});
  }, []);

  const onOpenCreate = useCallback(() => {
    setCreateForm({...EMPTY_CREATE, lineItems: [newLine()]});
    setIsCreateVisible(true);
  }, []);

  const onCloseCreate = useCallback(() => {
    setIsCreateVisible(false);
  }, []);

  const onConfirmCreate = useCallback(() => {
    if (!createForm.partyName.trim()) {
      showMessage({message: 'Enter party name', type: 'warning'});
      return;
    }
    const total = formTotal(createForm);
    const prefix = createForm.type === 'Receivable' ? 'AR' : 'AP';
    const code = `${prefix}-${1100 + invoices.length}`;
    const created: LedgerInvoice = {
      id: `local-${Date.now()}`,
      code,
      type: createForm.type,
      party: createForm.partyName.trim(),
      email: createForm.partyEmail.trim(),
      amount: total,
      amountLabel: formatMoney(total),
      category: createForm.category,
      status: createForm.status,
      dueDate: toIsoDate(createForm.dueDate) || createForm.dueDate,
      notes: createForm.notes,
      lineItems: createForm.lineItems,
      shareUrl: `https://drivehub.co/i/${code}`,
    };
    setInvoices(prev => [created, ...prev]);
    setIsCreateVisible(false);
    showMessage({message: 'Invoice created', type: 'success'});
  }, [createForm, invoices.length]);

  const onOpenDetails = useCallback((invoice: LedgerInvoice) => {
    setSelectedInvoice(invoice);
    setIsDetailsVisible(true);
  }, []);

  const onCloseDetails = useCallback(() => {
    setIsDetailsVisible(false);
  }, []);

  const onOpenShare = useCallback(
    (invoice?: LedgerInvoice) => {
      const target = invoice || selectedInvoice;
      if (!target) {
        return;
      }
      setSelectedInvoice(target);
      setShareEmail(target.email);
      setShareMessage(`Please find invoice ${target.code} attached.`);
      setIsDetailsVisible(false);
      setIsShareVisible(true);
    },
    [selectedInvoice],
  );

  const onCloseShare = useCallback(() => {
    setIsShareVisible(false);
  }, []);

  const onCopyLink = useCallback(async () => {
    if (!selectedInvoice) {
      return;
    }
    try {
      await Share.share({
        message: selectedInvoice.shareUrl,
        title: selectedInvoice.code,
      });
    } catch {
      showMessage({message: selectedInvoice.shareUrl, type: 'info'});
    }
  }, [selectedInvoice]);

  const onQuickShare = useCallback(
    async (channel: 'email' | 'whatsapp' | 'copy') => {
      if (!selectedInvoice) {
        return;
      }
      const text = `${selectedInvoice.code} · ${selectedInvoice.amountLabel}\n${selectedInvoice.shareUrl}`;
      if (channel === 'copy' || channel === 'whatsapp' || channel === 'email') {
        try {
          await Share.share({message: text, title: selectedInvoice.code});
        } catch {
          showMessage({message: text, type: 'info'});
        }
      }
    },
    [selectedInvoice],
  );

  const onSendShare = useCallback(() => {
    if (!shareEmail.trim()) {
      showMessage({message: 'Enter recipient email', type: 'warning'});
      return;
    }
    showMessage({message: 'Invoice sent', type: 'success'});
    setIsShareVisible(false);
  }, [shareEmail]);

  const onDownloadPress = useCallback((invoice: LedgerInvoice) => {
    showMessage({message: `${invoice.code} downloaded`, type: 'success'});
  }, []);

  return {
    isLoading: false,
    metrics,
    search,
    invoices: filtered,
    isCreateVisible,
    isDetailsVisible,
    isShareVisible,
    selectedInvoice,
    createForm,
    createTotalLabel,
    shareEmail,
    shareMessage,
    setSearch,
    setShareEmail,
    setShareMessage,
    updateCreateField,
    updateLineItem,
    onAddLineRow,
    onRemoveLineRow,
    onBackPress,
    onExportPress,
    onOpenCreate,
    onCloseCreate,
    onConfirmCreate,
    onOpenDetails,
    onCloseDetails,
    onOpenShare,
    onCloseShare,
    onSendShare,
    onCopyLink,
    onQuickShare,
    onDownloadPress,
  };
}
