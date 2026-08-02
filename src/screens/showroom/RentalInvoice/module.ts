export type InvoiceLineItem = {
  id: string;
  label: string;
  detail?: string;
  amount: string;
};

export type InvoiceStatusTone = 'pending' | 'paid' | 'overdue' | 'active';

export type RentalInvoiceController = {
  isLoading: boolean;
  invoiceId: string;
  status: string;
  statusTone: InvoiceStatusTone;
  issuedOn: string;
  dueOn: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerLicense: string;
  vehicleTitle: string;
  vehiclePlate: string;
  pickupLocation: string;
  pickupWhen: string;
  returnLocation: string;
  returnWhen: string;
  lineItems: InvoiceLineItem[];
  subtotal: string;
  taxLabel: string;
  tax: string;
  totalDue: string;
  paymentMethod: string;
  paymentStatus: string;
  onBackPress: () => void;
  onPrintPress: () => void;
  onMarkPaidPress: () => void;
  onDownloadPress: () => void;
  onEmailPress: () => void;
};
