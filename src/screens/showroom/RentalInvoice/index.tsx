import React from 'react';
import {ActivityIndicator, Pressable, ScrollView, Text, View} from 'react-native';
import {Icon, Screen} from '../../../components';
import {useThemedStyles, useThemeColors} from '../../../theme';
import {createStyles} from './styles';
import {useRentalInvoiceController} from './useController';

export function RentalInvoice() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {
    isLoading,
    invoiceId,
    status,
    statusTone,
    issuedOn,
    dueOn,
    customerName,
    customerEmail,
    customerPhone,
    customerLicense,
    vehicleTitle,
    vehiclePlate,
    pickupLocation,
    pickupWhen,
    returnLocation,
    returnWhen,
    lineItems,
    subtotal,
    taxLabel,
    tax,
    totalDue,
    paymentMethod,
    paymentStatus,
    onBackPress,
    onPrintPress,
    onMarkPaidPress,
    onDownloadPress,
    onEmailPress,
  } = useRentalInvoiceController();

  const statusPillStyle =
    statusTone === 'paid'
      ? styles.statusPillPaid
      : statusTone === 'overdue'
        ? styles.statusPillOverdue
        : null;
  const statusTextStyle =
    statusTone === 'paid'
      ? styles.statusTextPaid
      : statusTone === 'overdue'
        ? styles.statusTextOverdue
        : null;
  const statusIconColor =
    statusTone === 'paid'
      ? colors.successBright
      : statusTone === 'overdue'
        ? colors.error
        : colors.actionBlue;

  if (isLoading) {
    return (
      <Screen style={styles.container}>
        <View style={[styles.main, {flex: 1, justifyContent: 'center'}]}>
          <ActivityIndicator color={colors.actionBlue} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.main}>
          <View style={styles.topBar}>
            <Pressable
              style={styles.iconBtn}
              onPress={onBackPress}
              accessibilityLabel="Go back"
              hitSlop={8}>
              <Icon name="arrowLeft" size={12} color={colors.textDark} />
            </Pressable>
            <Pressable
              style={styles.iconBtn}
              onPress={onPrintPress}
              accessibilityLabel="Print invoice"
              hitSlop={8}>
              <Icon name="print" size={14} color={colors.textDark} />
            </Pressable>
          </View>

          <View style={styles.card}>
            <View style={styles.invoiceTop}>
              <View>
                <Text style={styles.invoiceEyebrow}>Invoice</Text>
                <Text style={styles.invoiceId}>{invoiceId}</Text>
              </View>
              <View style={[styles.statusPill, statusPillStyle]}>
                <Icon
                  name={statusTone === 'paid' ? 'activityCheck' : 'shiftClock'}
                  size={11}
                  color={statusIconColor}
                />
                <Text style={[styles.statusText, statusTextStyle]}>
                  {status}
                </Text>
              </View>
            </View>

            <View style={styles.datesRow}>
              <View style={styles.dateCol}>
                <Text style={styles.dateLabel}>Issued on</Text>
                <Text style={styles.dateValue}>{issuedOn}</Text>
              </View>
              <View style={styles.dateCol}>
                <Text style={styles.dateLabel}>Due on</Text>
                <Text style={styles.dateValue}>{dueOn}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.sectionHead}>
              <Icon name="customers" size={12} color={colors.actionBlue} />
              <Text style={styles.sectionTitle}>Bill to</Text>
            </View>
            <Text style={styles.customerName}>{customerName}</Text>
            <View style={styles.contactRow}>
              <Icon name="email" size={10} color={colors.textSoft} />
              <Text style={styles.contactText}>{customerEmail}</Text>
            </View>
            <View style={styles.contactRow}>
              <Icon name="phone" size={10} color={colors.textSoft} />
              <Text style={styles.contactText}>{customerPhone}</Text>
            </View>
            <Text style={styles.licenseText}>License · {customerLicense}</Text>

            <View style={styles.divider} />

            <View style={styles.sectionHead}>
              <Icon name="vehicles" size={12} color={colors.actionBlue} />
              <Text style={styles.sectionTitle}>Vehicle</Text>
            </View>
            <View style={styles.vehicleBox}>
              <Text style={styles.vehicleTitle}>{vehicleTitle}</Text>
              <Text style={styles.vehiclePlate}>{vehiclePlate}</Text>
            </View>
            <View style={styles.tripRow}>
              <View style={styles.tripCard}>
                <View style={styles.contactRow}>
                  <Icon name="location" size={10} color={colors.actionBlue} />
                  <Text style={styles.tripLabel}>Pickup</Text>
                </View>
                <Text style={styles.tripLocation}>{pickupLocation}</Text>
                <Text style={styles.tripWhen}>{pickupWhen}</Text>
              </View>
              <View style={styles.tripCard}>
                <View style={styles.contactRow}>
                  <Icon
                    name="calendarField"
                    size={10}
                    color={colors.actionBlue}
                  />
                  <Text style={styles.tripLabel}>Return</Text>
                </View>
                <Text style={styles.tripLocation}>{returnLocation}</Text>
                <Text style={styles.tripWhen}>{returnWhen}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>Charges</Text>
            </View>
            {lineItems.map(item => (
              <View key={item.id} style={styles.chargeRow}>
                <View style={styles.chargeCopy}>
                  <Text style={styles.chargeLabel}>{item.label}</Text>
                  {item.detail ? (
                    <Text style={styles.chargeDetail}>{item.detail}</Text>
                  ) : null}
                </View>
                <Text style={styles.chargeAmount}>{item.amount}</Text>
              </View>
            ))}

            <View style={styles.totalsBox}>
              <View style={styles.totalLine}>
                <Text style={styles.totalMuted}>Subtotal</Text>
                <Text style={styles.totalMutedValue}>{subtotal}</Text>
              </View>
              <View style={styles.totalLine}>
                <Text style={styles.totalMuted}>{taxLabel}</Text>
                <Text style={styles.totalMutedValue}>{tax}</Text>
              </View>
              <View style={styles.totalLine}>
                <Text style={styles.totalDueLabel}>Total due</Text>
                <Text style={styles.totalDueValue}>{totalDue}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.sectionHead}>
              <Icon name="creditCard" size={12} color={colors.actionBlue} />
              <Text style={styles.sectionTitle}>Payment</Text>
            </View>
            <View style={styles.paymentBox}>
              <View style={styles.paymentCopy}>
                <Text style={styles.paymentMethod}>{paymentMethod}</Text>
                <Text style={styles.paymentStatus}>{paymentStatus}</Text>
              </View>
              {statusTone !== 'paid' ? (
                <Pressable style={styles.markPaidBtn} onPress={onMarkPaidPress}>
                  <Text style={styles.markPaidText}>Mark as paid</Text>
                </Pressable>
              ) : null}
            </View>
          </View>

          <View style={styles.footerActions}>
            <Pressable style={styles.downloadBtn} onPress={onDownloadPress}>
              <Icon name="download" size={14} color={colors.white} />
              <Text style={styles.downloadText}>Download invoice</Text>
            </Pressable>
            <Pressable style={styles.emailBtn} onPress={onEmailPress}>
              <Icon name="sendPlane" size={14} color={colors.actionBlue} />
              <Text style={styles.emailText}>Email to customer</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
