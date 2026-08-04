import React, {useMemo} from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import Svg, {Defs, LinearGradient, Line, Path, Stop, Text as SvgText} from 'react-native-svg';
import {
  CreateInvoiceModal,
  DateRangeFilterModal,
  ExportPdfModal,
  Icon,
  MetricCard,
  Screen,
  SendRemindersModal,
} from '../../../components';
import type {DateRangePreset, MetricCardData} from '../../../components';
import {useThemedStyles, useThemeColors, colors} from '../../../theme';
import type {
  HistoryCompletedRow,
  InvoiceRow,
  InvoiceStatus,
  LateReturnItem,
  OrderStatus,
  PaymentStatus,
  RentalOrderRow,
  RentalOrdersTabId,
} from './module';
import {createStyles} from './styles';
import {useRentalOrdersController} from './useController';

const PAYMENT_STYLE: Record<
  PaymentStatus,
  {background: string; color: string}
> = {
  Paid: {background: '#E8F8EF', color: '#1FA85A'},
  Partial: {background: '#FFF1DF', color: '#D97706'},
  Pending: {background: '#EEF2F6', color: '#64748B'},
  Refund: {background: '#F1E9FF', color: '#7C3AED'},
};

const STATUS_STYLE: Record<
  OrderStatus,
  {background: string; color: string}
> = {
  Active: {background: '#E8F1FF', color: colors.actionBlue},
  Overdue: {background: '#FFE8EC', color: '#E11D48'},
  Reserved: {background: '#FFF1DF', color: '#D97706'},
  Completed: {background: '#E8F8EF', color: '#1FA85A'},
  Cancelled: {background: '#EEF2F6', color: '#64748B'},
};

const INVOICE_STATUS_STYLE: Record<
  InvoiceStatus,
  {background: string; color: string}
> = {
  Paid: {background: '#E8F8EF', color: '#1FA85A'},
  Completed: {background: '#E8F8EF', color: '#1FA85A'},
  Pending: {background: '#FFF1DF', color: '#D97706'},
  Overdue: {background: '#FFE8EC', color: '#E11D48'},
  Draft: {background: '#EEF2F6', color: '#64748B'},
};

const TAB_HEADER: Record<
  RentalOrdersTabId,
  {
    title: string;
    icon: 'navRentals' | 'shiftClock' | 'statusOverdue' | 'documentFile';
  }
> = {
  orders: {title: 'Rental Orders', icon: 'navRentals'},
  history: {title: 'Rental History', icon: 'shiftClock'},
  late: {title: 'Late Returns', icon: 'statusOverdue'},
  invoices: {title: 'Rental Invoices', icon: 'documentFile'},
};

const DATE_RANGE_BUTTON_LABEL: Record<DateRangePreset, string> = {
  all: 'Date range',
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

function OrdersTable({
  searchQuery,
  showingLabel,
  orders,
  dateRangePreset,
  setSearchQuery,
  onStatusFilterPress,
  onDateFilterPress,
  onOrderPress,
}: {
  searchQuery: string;
  showingLabel: string;
  orders: RentalOrderRow[];
  dateRangePreset: DateRangePreset;
  setSearchQuery: (query: string) => void;
  onStatusFilterPress: () => void;
  onDateFilterPress: () => void;
  onOrderPress: (orderId: string) => void;
}) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {width: windowWidth} = useWindowDimensions();
  const tableMinWidth = Math.max(windowWidth - 76, 380);

  return (
    <View style={styles.ledgerCard}>
      <View style={styles.ledgerHeaderRow}>
        <View style={styles.ledgerTitleBlock}>
          <Text style={styles.ledgerEyebrow}>ORDERS</Text>
          <Text style={styles.ledgerTitle}>Rental Orders</Text>
        </View>
        <View style={styles.ledgerSearch}>
          <Icon name="search" size={13} color="#8A94A6" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search orders..."
            placeholderTextColor="#8A94A6"
            style={styles.ledgerSearchInput}
          />
        </View>
      </View>

      <View style={styles.filterRow}>
        <Text style={styles.showingText}>{showingLabel}</Text>
        <View style={styles.filterActions}>
          <Pressable style={styles.filterBtn} onPress={onStatusFilterPress}>
            <Icon name="filter" size={11} color={colors.textDark} />
            <Text style={styles.filterBtnText}>Status</Text>
          </Pressable>
          <Pressable
            style={[
              styles.filterBtn,
              dateRangePreset !== 'all' && styles.filterBtnActive,
            ]}
            onPress={onDateFilterPress}>
            <Icon name="filter" size={11} color={colors.textDark} />
            <Text style={styles.filterBtnText}>
              {DATE_RANGE_BUTTON_LABEL[dateRangePreset]}
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.invoiceTableScroll,
          {minWidth: tableMinWidth},
        ]}>
        <View style={[styles.invoiceTable, {minWidth: tableMinWidth}]}>
          <View style={styles.invoiceTableHeader}>
            <View style={styles.invColInvoice}>
              <Text style={styles.invHeaderText}>Order</Text>
            </View>
            <View style={styles.invColCustomer}>
              <Text style={styles.invHeaderText}>Customer</Text>
            </View>
            <View style={styles.invColAmount}>
              <Text style={styles.invHeaderText}>Amount</Text>
            </View>
            <View style={styles.orderColPayment}>
              <Text style={styles.invHeaderText}>Payment</Text>
            </View>
            <View style={styles.orderColStatus}>
              <Text style={styles.invHeaderText}>Status</Text>
            </View>
          </View>

          {orders.map((order, index) => {
            const paymentStyle = PAYMENT_STYLE[order.payment];
            const statusStyle = STATUS_STYLE[order.status];
            const isLast = index === orders.length - 1;
            return (
              <View
                key={order.id}
                style={[
                  styles.invoiceTableRow,
                  isLast && styles.invoiceTableRowLast,
                ]}>
                <View style={styles.invColInvoice}>
                  <Pressable onPress={() => onOrderPress(order.orderId)}>
                    <Text style={styles.invoiceIdLink} numberOfLines={1}>
                      {order.orderId}
                    </Text>
                  </Pressable>
                </View>
                <View style={styles.invColCustomer}>
                  <Text style={styles.invCustomerName} numberOfLines={1}>
                    {order.customer}
                  </Text>
                </View>
                <View style={styles.invColAmount}>
                  <Text style={styles.invAmountText} numberOfLines={1}>
                    {order.amount}
                  </Text>
                </View>
                <View style={styles.orderColPayment}>
                  <View
                    style={[
                      styles.invStatusBadge,
                      {backgroundColor: paymentStyle.background},
                    ]}>
                    <Text
                      style={[
                        styles.invStatusText,
                        {color: paymentStyle.color},
                      ]}
                      numberOfLines={1}>
                      {order.payment}
                    </Text>
                  </View>
                </View>
                <View style={styles.orderColStatus}>
                  <View
                    style={[
                      styles.invStatusBadge,
                      {backgroundColor: statusStyle.background},
                    ]}>
                    <Text
                      style={[
                        styles.invStatusText,
                        {color: statusStyle.color},
                      ]}
                      numberOfLines={1}>
                      {order.status}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

function LateReturnsList({
  items,
  onCallPress,
  onEmailPress,
  onChargeFeePress,
}: {
  items: LateReturnItem[];
  onCallPress: (id: string) => void;
  onEmailPress: (id: string) => void;
  onChargeFeePress: (id: string) => void;
}) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.lateListCard}>
      {items.map(item => (
        <View key={item.id} style={styles.lateItem}>
          <View style={styles.lateTop}>
            <View style={styles.lateWarnIcon}>
              <Icon name="statusOverdue" size={14} color="#E11D48" />
            </View>
            <View style={styles.lateInfo}>
              <Text style={styles.lateName}>{item.customer}</Text>
              <View style={styles.lateMeta}>
                <Text style={styles.lateOrderId}>{item.orderId}</Text>
                <Text style={styles.lateVehicle}>{item.vehicle}</Text>
              </View>
            </View>
          </View>

          <View style={styles.latePills}>
            <View style={styles.latePill}>
              <Icon name="shiftClock" size={12} color="#E11D48" />
              <Text style={styles.latePillTime}>{item.overdueLabel}</Text>
              <Text style={styles.latePillMuted}>overdue</Text>
            </View>
            <View style={styles.latePill}>
              <Text style={styles.latePillMuted}>Late fee</Text>
              <Text style={styles.latePillFee}>{item.lateFee}</Text>
            </View>
          </View>

          <View style={styles.lateActions}>
            <Pressable
              style={styles.lateOutlineBtn}
              onPress={() => onCallPress(item.id)}>
              <Icon name="phone" size={12} color={colors.textDark} />
              <Text style={styles.lateOutlineBtnText}>Call</Text>
            </Pressable>
            <Pressable
              style={styles.lateOutlineBtn}
              onPress={() => onEmailPress(item.id)}>
              <Icon name="email" size={12} color={colors.textDark} />
              <Text style={styles.lateOutlineBtnText}>Email</Text>
            </Pressable>
            <Pressable
              style={styles.latePrimaryBtn}
              onPress={() => onChargeFeePress(item.id)}>
              <Text style={styles.latePrimaryBtnText}>Charge Fee</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </View>
  );
}

function buildChartPath(
  values: number[],
  width: number,
  height: number,
  padLeft: number,
  padRight: number,
  padTop: number,
  padBottom: number,
) {
  if (!values.length) {
    return {line: '', area: ''};
  }
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;
  const stepX = chartW / Math.max(values.length - 1, 1);
  const points = values.map((value, index) => {
    const x = padLeft + index * stepX;
    const y = padTop + chartH - (Math.min(100, Math.max(0, value)) / 100) * chartH;
    return {x, y};
  });
  const line = points
    .map((point, index) =>
      `${index === 0 ? 'M' : 'L'}${point.x.toFixed(1)} ${point.y.toFixed(1)}`,
    )
    .join(' ');
  const area = `${line} L${(padLeft + chartW).toFixed(1)} ${(padTop + chartH).toFixed(1)} L${padLeft} ${(padTop + chartH).toFixed(1)} Z`;
  return {line, area};
}

function HistoryRevenueChart({
  rentals,
  revenue,
}: {
  rentals: number[];
  revenue: number[];
}) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  const {width: windowWidth} = useWindowDimensions();
  const width = Math.max(280, windowWidth - 72);
  const height = 168;
  const padLeft = 28;
  const padRight = 8;
  const padTop = 8;
  const padBottom = 24;
  const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

  const rentalsSeries =
    rentals.some(value => value > 0)
      ? rentals
      : [18, 24, 32, 28, 40, 48, 52, 58, 62, 70, 78, 86];
  const revenueSeries =
    revenue.some(value => value > 0)
      ? revenue
      : [42, 44, 40, 46, 45, 48, 47, 50, 49, 52, 51, 54];

  const paths = useMemo(() => {
    return {
      rentals: buildChartPath(
        rentalsSeries,
        width,
        height,
        padLeft,
        padRight,
        padTop,
        padBottom,
      ),
      revenue: buildChartPath(
        revenueSeries,
        width,
        height,
        padLeft,
        padRight,
        padTop,
        padBottom,
      ),
    };
  }, [height, rentalsSeries, revenueSeries, width]);

  const yLabels = [100, 75, 50, 25, 0];
  const chartH = height - padTop - padBottom;

  return (
    <View style={styles.historyCard}>
      <Text style={styles.historyEyebrow}>12 MONTHS</Text>
      <Text style={styles.historyCardTitle}>Rentals & Revenue</Text>
      <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <LinearGradient id="histRentalsFill" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={colors.actionBlue} stopOpacity={0.22} />
            <Stop offset="100%" stopColor={colors.actionBlue} stopOpacity={0.02} />
          </LinearGradient>
          <LinearGradient id="histRevenueFill" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={colors.accent} stopOpacity={0.2} />
            <Stop offset="100%" stopColor={colors.accent} stopOpacity={0.02} />
          </LinearGradient>
        </Defs>
        {yLabels.map((label, index) => {
          const y = padTop + (index / (yLabels.length - 1)) * chartH;
          return (
            <React.Fragment key={label}>
              <Line
                x1={padLeft}
                y1={y}
                x2={width - padRight}
                y2={y}
                stroke={colors.border}
                strokeWidth={StyleSheetHairline}
              />
              <SvgText
                x={0}
                y={y + 3}
                fill={colors.textSoft}
                fontSize="9"
                fontWeight="600">
                {label}
              </SvgText>
            </React.Fragment>
          );
        })}
        <Path d={paths.rentals.area} fill="url(#histRentalsFill)" />
        <Path d={paths.revenue.area} fill="url(#histRevenueFill)" />
        <Path
          d={paths.rentals.line}
          stroke={colors.actionBlue}
          strokeWidth={2.4}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d={paths.revenue.line}
          stroke={colors.accent}
          strokeWidth={2.4}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {months.map((month, index) => {
          const chartW = width - padLeft - padRight;
          const x = padLeft + (index / Math.max(months.length - 1, 1)) * chartW;
          return (
            <SvgText
              key={`${month}-${index}`}
              x={x}
              y={height - 4}
              fill={colors.textSoft}
              fontSize="9"
              fontWeight="600"
              textAnchor="middle">
              {month}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
}

const StyleSheetHairline = 0.5;

function HistoryContent({
  rentalsSeries,
  revenueSeries,
  completed,
}: {
  rentalsSeries: number[];
  revenueSeries: number[];
  completed: HistoryCompletedRow[];
}) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.historyWrap}>
      <HistoryRevenueChart rentals={rentalsSeries} revenue={revenueSeries} />

      <View style={styles.historyCard}>
        <Text style={styles.historyEyebrow}>LAST 30 DAYS</Text>
        <Text style={styles.historyCardTitle}>Recent Completed</Text>

        <View style={styles.historyTableHeader}>
          <Text style={[styles.historyColVehicle, styles.historyHeaderText]}>
            VEHICLE
          </Text>
          <Text style={[styles.historyColDays, styles.historyHeaderText]}>
            DAYS
          </Text>
          <Text style={[styles.historyColAmount, styles.historyHeaderText]}>
            AMOUNT
          </Text>
        </View>

        {completed.length ? (
          completed.map((item, index) => {
            const isLast = index === completed.length - 1;
            return (
              <View
                key={item.id}
                style={[
                  styles.historyTableRow,
                  isLast && styles.historyTableRowLast,
                ]}>
                <Text
                  style={[styles.historyColVehicle, styles.historyVehicle]}
                  numberOfLines={1}>
                  {item.vehicle}
                </Text>
                <Text style={[styles.historyColDays, styles.historyDays]}>
                  {item.days}
                </Text>
                <Text style={[styles.historyColAmount, styles.historyAmount]}>
                  {item.amount}
                </Text>
              </View>
            );
          })
        ) : (
          <Text style={styles.historyEmpty}>No completed rentals yet</Text>
        )}
      </View>
    </View>
  );
}

function InvoicesContent({
  metrics,
  invoices,
  invoiceSearchQuery,
  setInvoiceSearchQuery,
  onInvoicePress,
  onViewInvoicePress,
}: {
  metrics: MetricCardData[];
  invoices: InvoiceRow[];
  invoiceSearchQuery: string;
  setInvoiceSearchQuery: (query: string) => void;
  onInvoicePress: (invoiceId: string) => void;
  onViewInvoicePress: (invoiceId: string) => void;
}) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {width: windowWidth} = useWindowDimensions();
  const tableMinWidth = Math.max(windowWidth - 76, 340);

  return (
    <>
      <View style={styles.metricsGrid}>
        {metrics.map(item => (
          <MetricCard key={item.id} item={item} />
        ))}
      </View>

      <View style={styles.ledgerCard}>
        <View style={styles.ledgerHeaderRow}>
          <View style={styles.ledgerTitleBlock}>
            <Text style={styles.ledgerEyebrow}>LEDGER</Text>
            <Text style={styles.ledgerTitle}>All Invoices</Text>
          </View>
          <View style={styles.ledgerSearch}>
            <Icon name="search" size={13} color="#8A94A6" />
            <TextInput
              value={invoiceSearchQuery}
              onChangeText={setInvoiceSearchQuery}
              placeholder="Search invoices..."
              placeholderTextColor="#8A94A6"
              style={styles.ledgerSearchInput}
            />
          </View>
        </View>

        <ScrollView
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.invoiceTableScroll,
            {minWidth: tableMinWidth},
          ]}>
          <View style={[styles.invoiceTable, {minWidth: tableMinWidth}]}>
            <View style={styles.invoiceTableHeader}>
              <View style={styles.invColInvoice}>
                <Text style={styles.invHeaderText}>Invoice</Text>
              </View>
              <View style={styles.invColCustomer}>
                <Text style={styles.invHeaderText}>Customer</Text>
              </View>
              <View style={styles.invColAmount}>
                <Text style={styles.invHeaderText}>Amount</Text>
              </View>
              <View style={styles.invColDue}>
                <Text style={styles.invHeaderText}>Due</Text>
              </View>
              <View style={styles.invColStatus}>
                <Text style={styles.invHeaderText}>Status</Text>
              </View>
              <View style={styles.invColView} />
            </View>

            {invoices.map((invoice, index) => {
              const statusStyle = INVOICE_STATUS_STYLE[invoice.status];
              const isLast = index === invoices.length - 1;
              return (
                <View
                  key={invoice.id}
                  style={[
                    styles.invoiceTableRow,
                    isLast && styles.invoiceTableRowLast,
                  ]}>
                  <View style={styles.invColInvoice}>
                    <Pressable onPress={() => onInvoicePress(invoice.invoiceId)}>
                      <Text style={styles.invoiceIdLink} numberOfLines={1}>
                        {invoice.invoiceId}
                      </Text>
                    </Pressable>
                  </View>
                  <View style={styles.invColCustomer}>
                    <Text style={styles.invCustomerName} numberOfLines={1}>
                      {invoice.customer}
                    </Text>
                  </View>
                  <View style={styles.invColAmount}>
                    <Text style={styles.invAmountText} numberOfLines={1}>
                      {invoice.amount}
                    </Text>
                  </View>
                  <View style={styles.invColDue}>
                    <Text style={styles.invDueText} numberOfLines={1}>
                      {invoice.due}
                    </Text>
                  </View>
                  <View style={styles.invColStatus}>
                    <View
                      style={[
                        styles.invStatusBadge,
                        {backgroundColor: statusStyle.background},
                      ]}>
                      <Text
                        style={[
                          styles.invStatusText,
                          {color: statusStyle.color},
                        ]}
                        numberOfLines={1}>
                        {invoice.status}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.invColView}>
                    <Pressable
                      style={styles.invViewBtn}
                      onPress={() => onViewInvoicePress(invoice.invoiceId)}
                      hitSlop={6}>
                      <Icon name="roleEye" size={14} color={colors.textSoft} />
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </>
  );
}

export function RentalOrders() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {
    tabs,
    activeTab,
    ordersSummary,
    historySummary,
    lateSummary,
    invoicesSummary,
    searchQuery,
    invoiceSearchQuery,
    showingLabel,
    orders,
    lateReturns,
    invoiceMetrics,
    invoices,
    historyRentalsSeries,
    historyRevenueSeries,
    historyCompleted,
    onBackPress,
    setActiveTab,
    setSearchQuery,
    setInvoiceSearchQuery,
    onExportPress,
    onExportPdfPress,
    isExportPdfModalVisible,
    onCloseExportPdfModal,
    onConfirmExportPdf,
    onPrintPress,
    onCreateInvoicePress,
    isCreateInvoiceModalVisible,
    onCloseCreateInvoiceModal,
    onConfirmCreateInvoice,
    onSendRemindersPress,
    isSendRemindersModalVisible,
    onCloseSendRemindersModal,
    onConfirmSendReminders,
    onStatusFilterPress,
    dateRangePreset,
    isDateRangeModalVisible,
    onDateFilterPress,
    onCloseDateRangeModal,
    onSelectDateRange,
    onOrderPress,
    onInvoicePress,
    onViewInvoicePress,
    onCallPress,
    onEmailPress,
    onChargeFeePress,
  } = useRentalOrdersController();

  const header = TAB_HEADER[activeTab];
  const pageSubtitle =
    activeTab === 'late'
      ? lateSummary
      : activeTab === 'orders' || activeTab === 'history'
        ? activeTab === 'history'
          ? historySummary
          : ordersSummary
        : invoicesSummary;

  return (
    <Screen style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.main}>
          <View style={styles.pageHeader}>
            <View style={styles.titleRow}>
              <Pressable
                style={styles.backBtn}
                onPress={onBackPress}
                accessibilityLabel="Go back"
                hitSlop={8}>
                <Icon name="arrowLeft" size={12} color={colors.white} />
              </Pressable>
              <View style={styles.titleBlock}>
                <Text style={styles.pageTitle}>{header.title}</Text>
                <Text style={styles.pageSubtitle}>{pageSubtitle}</Text>
              </View>
            </View>

            <ScrollView
              horizontal
              nestedScrollEnabled
              showsHorizontalScrollIndicator={false}
              directionalLockEnabled
              bounces={false}
              style={styles.tabsScroll}
              contentContainerStyle={styles.tabsRow}>
              {tabs.map(tab => {
                const active = tab.id === activeTab;
                return (
                  <Pressable
                    key={tab.id}
                    style={[styles.tab, active && styles.tabActive]}
                    onPress={() => setActiveTab(tab.id)}>
                    <Icon
                      name={tab.icon}
                      size={12}
                      color={active ? colors.white : colors.textSecondary}
                    />
                    <Text
                      style={[styles.tabLabel, active && styles.tabLabelActive]}
                      numberOfLines={1}>
                      {tab.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
            {activeTab === 'orders' || activeTab === 'history' ? (
              <View style={styles.exportRow}>
                <Pressable style={styles.exportBtn} onPress={onExportPress}>
                  <Icon name="download" size={14} color={colors.textDark} />
                  <Text style={styles.exportBtnText}>Export CSV</Text>
                </Pressable>
              </View>
            ) : null}
            {activeTab === 'late' ? (
              <View style={styles.exportRow}>
                <Pressable
                  style={styles.sendRemindersBtn}
                  onPress={onSendRemindersPress}>
                  <Text style={styles.sendRemindersText}>Send Reminders</Text>
                </Pressable>
              </View>
            ) : null}
            {activeTab === 'invoices' ? (
              <View style={styles.invoiceActions}>
                <Pressable
                  style={styles.invoiceOutlineBtn}
                  onPress={onExportPdfPress}>
                  <Icon name="download" size={12} color={colors.textDark} />
                  <Text style={styles.invoiceOutlineBtnText}>Export PDF</Text>
                </Pressable>
                <Pressable
                  style={styles.invoiceOutlineBtn}
                  onPress={onPrintPress}>
                  <Icon name="print" size={12} color={colors.textDark} />
                  <Text style={styles.invoiceOutlineBtnText}>Print</Text>
                </Pressable>
                <Pressable
                  style={styles.createInvoiceBtn}
                  onPress={onCreateInvoicePress}>
                  <Icon name="addPlus" size={11} color={colors.white} />
                  <Text style={styles.createInvoiceBtnText}>
                    Create Invoice
                  </Text>
                </Pressable>
              </View>
            ) : null}
          </View>

          {activeTab === 'orders' ? (
            <OrdersTable
              searchQuery={searchQuery}
              showingLabel={showingLabel}
              orders={orders}
              dateRangePreset={dateRangePreset}
              setSearchQuery={setSearchQuery}
              onStatusFilterPress={onStatusFilterPress}
              onDateFilterPress={onDateFilterPress}
              onOrderPress={onOrderPress}
            />
          ) : null}

          {activeTab === 'late' ? (
            <LateReturnsList
              items={lateReturns}
              onCallPress={onCallPress}
              onEmailPress={onEmailPress}
              onChargeFeePress={onChargeFeePress}
            />
          ) : null}

          {activeTab === 'invoices' ? (
            <InvoicesContent
              metrics={invoiceMetrics}
              invoices={invoices}
              invoiceSearchQuery={invoiceSearchQuery}
              setInvoiceSearchQuery={setInvoiceSearchQuery}
              onInvoicePress={onInvoicePress}
              onViewInvoicePress={onViewInvoicePress}
            />
          ) : null}

          {activeTab === 'history' ? (
            <HistoryContent
              rentalsSeries={historyRentalsSeries}
              revenueSeries={historyRevenueSeries}
              completed={historyCompleted}
            />
          ) : null}
        </View>
      </ScrollView>

      <SendRemindersModal
        visible={isSendRemindersModalVisible}
        onClose={onCloseSendRemindersModal}
        onConfirm={onConfirmSendReminders}
      />
      <CreateInvoiceModal
        visible={isCreateInvoiceModalVisible}
        onClose={onCloseCreateInvoiceModal}
        onConfirm={onConfirmCreateInvoice}
      />
      <ExportPdfModal
        visible={isExportPdfModalVisible}
        onClose={onCloseExportPdfModal}
        onConfirm={onConfirmExportPdf}
      />
      <DateRangeFilterModal
        visible={isDateRangeModalVisible}
        selected={dateRangePreset}
        onClose={onCloseDateRangeModal}
        onSelect={onSelectDateRange}
      />
    </Screen>
  );
}
