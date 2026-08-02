import React, {memo} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {Images} from '../assets';
import {type AppColors, useThemedStyles, useThemeColors} from '../theme';
import {Icon} from './Icon';

export type RentalStatus = 'Active' | 'Overdue' | 'Pending';

export type ActiveRental = {
  id: string;
  rentalId: string;
  customer: string;
  vehicle: string;
  location: string;
  pickup: string;
  returnDate: string;
  amount: string;
  progress: number;
  status: RentalStatus;
  imageTint: string;
};

type ActiveRentalCardProps = {
  item: ActiveRental;
  onReturnPress?: (item: ActiveRental) => void;
  onInvoicePress?: (item: ActiveRental) => void;
};

export const ActiveRentalCard = memo(function ActiveRentalCard({
  item,
  onReturnPress,
  onInvoicePress,
}: ActiveRentalCardProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const statusStyle =
    item.status === 'Active'
      ? {background: colors.badgeActiveBg, color: colors.successBright}
      : item.status === 'Pending'
        ? {background: colors.badgePendingBg, color: colors.warning}
        : {background: colors.badgeOverdueBg, color: colors.error};
  const progressColor =
    item.status === 'Overdue' ? colors.error : colors.actionBlue;

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={[styles.imageWrap, {backgroundColor: item.imageTint}]}>
          <Image
            source={Images.fleetVehicle}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <View style={styles.info}>
          <View style={styles.infoTop}>
            <View style={styles.infoMain}>
              <View style={styles.idRow}>
                <Text style={styles.rentalId}>{item.rentalId}</Text>
                <View
                  style={[
                    styles.badge,
                    {backgroundColor: statusStyle.background},
                  ]}>
                  <Text style={[styles.badgeText, {color: statusStyle.color}]}>
                    {item.status}
                  </Text>
                </View>
              </View>
              <Text style={styles.customer} numberOfLines={1}>
                {item.customer}
              </Text>
              <Text style={styles.vehicle} numberOfLines={1}>
                {item.vehicle}
              </Text>
            </View>
            <Pressable hitSlop={8} style={styles.menuBtn}>
              <Icon name="activityMenu" size={12} />
            </Pressable>
          </View>
          <View style={styles.locationRow}>
            <Icon name="location" size={9} color={colors.textSoft} />
            <Text style={styles.location} numberOfLines={1}>
              {item.location}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaCell}>
          <Text style={styles.metaLabel}>Pickup</Text>
          <Text style={styles.metaValue}>{item.pickup}</Text>
        </View>
        <View style={styles.metaCell}>
          <Text style={styles.metaLabel}>Return</Text>
          <Text style={styles.metaValue}>{item.returnDate}</Text>
        </View>
        <View style={styles.metaCell}>
          <Text style={styles.metaLabel}>Amount</Text>
          <Text style={styles.metaValue}>{item.amount}</Text>
        </View>
      </View>

      <View style={styles.progressBlock}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Progress</Text>
          <Text style={styles.progressPct}>{item.progress}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(100, Math.max(0, item.progress))}%`,
                backgroundColor: progressColor,
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={styles.returnBtn}
          onPress={() => onReturnPress?.(item)}>
          <Icon name="activityCheck" size={12} color={colors.actionBlue} />
          <Text style={styles.returnText}>Return</Text>
        </Pressable>
        <Pressable
          style={styles.invoiceBtn}
          onPress={() => onInvoicePress?.(item)}>
          <Text style={styles.invoiceText}>Invoice</Text>
          <Icon name="arrowRight" size={12} color={colors.white} />
        </Pressable>
      </View>
    </View>
  );
});

function createStyles(c: AppColors) {
  return StyleSheet.create({
  card: {
    backgroundColor: c.surface,
    borderRadius: 18,
    borderWidth: 0.75,
    borderColor: c.borderSoft,
    padding: 12,
    gap: 10,
  },
  top: {
    flexDirection: 'row',
    gap: 12,
  },
  imageWrap: {
    width: 88,
    height: 66,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: 78,
    height: 48,
  },
  info: {
    flex: 1,
    gap: 6,
  },
  infoTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoMain: {
    flex: 1,
    gap: 1,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rentalId: {
    fontSize: 10,
    fontWeight: '600',
    color: c.textSoft,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
  },
  customer: {
    fontSize: 14,
    fontWeight: '700',
    color: c.textDark,
  },
  vehicle: {
    fontSize: 11,
    color: c.textSoft,
  },
  menuBtn: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 11,
    color: c.textSoft,
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 6,
  },
  metaCell: {
    flex: 1,
    backgroundColor: c.searchBg,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 2,
  },
  metaLabel: {
    fontSize: 9,
    color: c.textSoft,
  },
  metaValue: {
    fontSize: 10,
    fontWeight: '600',
    color: c.textDark,
  },
  progressBlock: {
    gap: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 10,
    color: c.textSoft,
  },
  progressPct: {
    fontSize: 10,
    fontWeight: '600',
    color: c.textDark,
  },
  progressTrack: {
    height: 4,
    borderRadius: 999,
    backgroundColor: c.track,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  returnBtn: {
    flex: 1,
    height: 28,
    borderRadius: 14,
    backgroundColor: c.surface,
    borderWidth: 0.75,
    borderColor: c.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  returnText: {
    fontSize: 11,
    fontWeight: '600',
    color: c.textDark,
  },
  invoiceBtn: {
    flex: 1,
    height: 28,
    borderRadius: 14,
    backgroundColor: c.actionBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  invoiceText: {
    fontSize: 11,
    fontWeight: '600',
    color: c.white,
  },
});
}
