import type {MetricCardData} from '../../../components/MetricCard';

export type InvoiceType = 'Receivable' | 'Payable';
export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue';

export type InvoiceLineItem = {
  id: string;
  description: string;
  qty: string;
  price: string;
};

export type LedgerInvoice = {
  id: string;
  code: string;
  type: InvoiceType;
  party: string;
  email: string;
  amount: number;
  amountLabel: string;
  category: string;
  status: InvoiceStatus;
  dueDate: string;
  notes: string;
  lineItems: InvoiceLineItem[];
  shareUrl: string;
};

export type CreateInvoiceForm = {
  type: InvoiceType;
  category: string;
  status: InvoiceStatus;
  partyName: string;
  partyEmail: string;
  dueDate: string;
  notes: string;
  lineItems: InvoiceLineItem[];
};

export type InvoicesController = {
  isLoading: boolean;
  metrics: MetricCardData[];
  search: string;
  invoices: LedgerInvoice[];
  isCreateVisible: boolean;
  isDetailsVisible: boolean;
  isShareVisible: boolean;
  selectedInvoice: LedgerInvoice | null;
  createForm: CreateInvoiceForm;
  createTotalLabel: string;
  shareEmail: string;
  shareMessage: string;
  setSearch: (text: string) => void;
  setShareEmail: (text: string) => void;
  setShareMessage: (text: string) => void;
  updateCreateField: <K extends keyof CreateInvoiceForm>(
    key: K,
    value: CreateInvoiceForm[K],
  ) => void;
  updateLineItem: (
    id: string,
    key: keyof Omit<InvoiceLineItem, 'id'>,
    value: string,
  ) => void;
  onAddLineRow: () => void;
  onRemoveLineRow: (id: string) => void;
  onBackPress: () => void;
  onExportPress: () => void;
  onOpenCreate: () => void;
  onCloseCreate: () => void;
  onConfirmCreate: () => void;
  onOpenDetails: (invoice: LedgerInvoice) => void;
  onCloseDetails: () => void;
  onOpenShare: (invoice?: LedgerInvoice) => void;
  onCloseShare: () => void;
  onSendShare: () => void;
  onCopyLink: () => void;
  onQuickShare: (channel: 'email' | 'whatsapp' | 'copy') => void;
  onDownloadPress: (invoice: LedgerInvoice) => void;
};
