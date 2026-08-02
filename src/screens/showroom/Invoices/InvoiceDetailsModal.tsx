import React, {memo} from 'react';
import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import {Icon} from '../../../components/Icon';
import {type AppColors, useThemedStyles, useThemeColors} from '../../../theme';
import {formatMoney} from '../../../utils/apiHelpers';
import type {LedgerInvoice} from './module';

type Props = {
  visible: boolean;
  invoice: LedgerInvoice | null;
  onClose: () => void;
  onDownload: () => void;
  onShare: () => void;
};

function lineTotal(qty: string, price: string) {
  return (Number(qty) || 0) * (Number(price) || 0);
}

export const InvoiceDetailsModal = memo(function InvoiceDetailsModal({
  visible,
  invoice,
  onClose,
  onDownload,
  onShare,
}: Props) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  if (!invoice) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropTap} onPress={onClose} />
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={{flex: 1, gap: 4}}>
              <Text style={styles.code}>{invoice.code}</Text>
              <View style={styles.metaRow}>
                <Text style={styles.category}>{invoice.category}</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{invoice.status}</Text>
                </View>
              </View>
            </View>
            <Pressable style={styles.closeBtn} onPress={onClose}>
              <Icon name="closeCross" size={14} color={colors.textSoft} />
            </Pressable>
          </View>

          <View style={styles.infoRow}>
            <View style={{flex: 1, gap: 4}}>
              <Text style={styles.infoLabel}>Bill to</Text>
              <Text style={styles.infoValue}>{invoice.party}</Text>
              {invoice.email ? (
                <Text style={styles.infoSoft}>{invoice.email}</Text>
              ) : null}
            </View>
            <View style={{gap: 4}}>
              <Text style={styles.infoLabel}>Due date</Text>
              <Text style={styles.infoValue}>{invoice.dueDate || '—'}</Text>
            </View>
          </View>

          <View style={styles.tableHead}>
            <Text style={[styles.th, {flex: 1.5}]}>Description</Text>
            <Text style={[styles.th, {width: 36}]}>Qty</Text>
            <Text style={[styles.th, {width: 56}]}>Price</Text>
            <Text style={[styles.th, {width: 64, textAlign: 'right'}]}>
              Total
            </Text>
          </View>
          {invoice.lineItems.map(item => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={[styles.td, {flex: 1.5}]} numberOfLines={2}>
                {item.description || '—'}
              </Text>
              <Text style={[styles.td, {width: 36}]}>{item.qty || '0'}</Text>
              <Text style={[styles.td, {width: 56}]}>
                {formatMoney(Number(item.price) || 0)}
              </Text>
              <Text style={[styles.tdBold, {width: 64, textAlign: 'right'}]}>
                {formatMoney(lineTotal(item.qty, item.price))}
              </Text>
            </View>
          ))}

          <Text style={styles.totalDue}>Total due {invoice.amountLabel}</Text>

          <View style={styles.footer}>
            <Pressable style={styles.outlineBtn} onPress={onDownload}>
              <Text style={styles.outlineText}>Download</Text>
            </Pressable>
            <Pressable style={styles.primaryBtn} onPress={onShare}>
              <Text style={styles.primaryText}>Share</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
});

function createStyles(c: AppColors) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(7, 17, 35, 0.45)',
      justifyContent: 'center',
      paddingHorizontal: 18,
    },
    backdropTap: {...StyleSheet.absoluteFill},
    card: {
      backgroundColor: c.surface,
      borderRadius: 24,
      padding: 18,
      gap: 14,
      zIndex: 1,
    },
    header: {flexDirection: 'row', gap: 10},
    code: {fontSize: 20, fontWeight: '700', color: c.textDark},
    metaRow: {flexDirection: 'row', alignItems: 'center', gap: 8},
    category: {fontSize: 12, color: c.textSoft},
    statusBadge: {
      backgroundColor: c.actionTint12,
      borderRadius: 999,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    statusText: {fontSize: 11, fontWeight: '700', color: c.actionBlue},
    closeBtn: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: c.track,
      alignItems: 'center',
      justifyContent: 'center',
    },
    infoRow: {flexDirection: 'row', gap: 16},
    infoLabel: {
      fontSize: 9,
      fontWeight: '700',
      color: c.textSoft,
      textTransform: 'uppercase',
      letterSpacing: 0.4,
    },
    infoValue: {fontSize: 13, fontWeight: '700', color: c.textDark},
    infoSoft: {fontSize: 12, color: c.textSoft},
    tableHead: {
      flexDirection: 'row',
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.border,
      paddingBottom: 8,
      gap: 6,
    },
    th: {
      fontSize: 9,
      fontWeight: '700',
      color: c.textSoft,
      textTransform: 'uppercase',
    },
    tableRow: {flexDirection: 'row', gap: 6, paddingVertical: 8},
    td: {fontSize: 12, color: c.textDark},
    tdBold: {fontSize: 12, fontWeight: '700', color: c.textDark},
    totalDue: {
      fontSize: 18,
      fontWeight: '700',
      color: c.textDark,
      marginTop: 4,
    },
    footer: {flexDirection: 'row', gap: 10},
    outlineBtn: {
      flex: 1,
      height: 42,
      borderRadius: 21,
      borderWidth: 0.75,
      borderColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    outlineText: {fontSize: 14, fontWeight: '600', color: c.textDark},
    primaryBtn: {
      flex: 1,
      height: 42,
      borderRadius: 21,
      backgroundColor: c.actionBlue,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryText: {fontSize: 14, fontWeight: '700', color: c.white},
  });
}
