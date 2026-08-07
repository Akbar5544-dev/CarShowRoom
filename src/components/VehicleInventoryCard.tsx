import React, {memo} from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Images} from '../assets';
import {type AppColors, useThemedStyles, useThemeColors} from '../theme';
import {Icon} from './Icon';

export type VehicleInventoryStatus =
  | 'Available'
  | 'Rented'
  | 'Maintenance'
  | 'Reserved';

export type VehicleInventoryItem = {
  id: string;
  make: string;
  model: string;
  year: string;
  plateNo: string;
  status: VehicleInventoryStatus;
  statusBg: string;
  statusColor: string;
  imageUri: string | null;
  imageTint: string;
  fuelType: string;
  transmission: string;
  seats: string;
  rangeLabel: string;
  dailyRate: string;
  /** Asking / sale price used as auction starting-bid default */
  askingPrice?: string;
  /** Whether vehicle is published to public marketplace */
  isPublished: boolean;
};

type VehicleInventoryCardProps = {
  item: VehicleInventoryItem;
  onViewPress?: (item: VehicleInventoryItem) => void;
  onPostPress?: (item: VehicleInventoryItem) => void;
  onAuctionPress?: (item: VehicleInventoryItem) => void;
  onItemPress?: (item: VehicleInventoryItem) => void;
};

type SpecItem = {
  icon: 'shiftSun' | 'shiftClock' | 'employees' | 'presentDays';
  label: string;
};

export const VehicleInventoryCard = memo(function VehicleInventoryCard({
  item,
  onViewPress,
  onPostPress,
  onAuctionPress,
  onItemPress,
}: VehicleInventoryCardProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  const imageSource: ImageSourcePropType = item.imageUri
    ? {uri: item.imageUri}
    : Images.fleetVehicle;

  const specs: SpecItem[] = [
    {icon: 'shiftSun', label: item.fuelType},
    {icon: 'shiftClock', label: item.transmission},
    {icon: 'employees', label: item.seats},
    {icon: 'presentDays', label: item.rangeLabel},
  ];

  return (
    <View style={styles.card}>
      <View style={[styles.imageWrap, {backgroundColor: item.imageTint}]}>
        <View style={[styles.statusBadge, {backgroundColor: item.statusBg}]}>
          <Text style={[styles.statusText, {color: item.statusColor}]}>
            {item.status}
          </Text>
        </View>
        <View style={styles.plateBadge}>
          <Text style={styles.plateText}>{item.plateNo}</Text>
        </View>
        <Image source={imageSource} style={styles.image} resizeMode="contain" />
      </View>

      <View style={styles.body}>
        <View style={styles.titleBlock}>
          <Text style={styles.makeYear} numberOfLines={1}>
            {item.make}
            {item.year ? ` · ${item.year}` : ''}
          </Text>
          <Text style={styles.model} numberOfLines={1}>
            {item.model}
          </Text>
        </View>

        <View style={styles.specsRow}>
          {specs.map(spec => (
            <View key={`${spec.icon}-${spec.label}`} style={styles.specPill}>
              <Icon name={spec.icon} size={9} color={colors.actionBlue} />
              <Text style={styles.specLabel} numberOfLines={1}>
                {spec.label}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.rentalLabel}>RENTAL</Text>
          <Text style={styles.rentalPrice}>
            {item.dailyRate}
            <Text style={styles.rentalSuffix}>/day</Text>
          </Text>
        </View>

        <View style={styles.actionsRow}>
          <Pressable
            style={styles.actionBtn}
            onPress={() => onViewPress?.(item)}
            hitSlop={4}>
            <Text style={styles.actionBtnText}>View</Text>
          </Pressable>
          <Pressable
            style={[
              styles.actionBtn,
              item.isPublished ? styles.unpostBtn : null,
            ]}
            onPress={() => onPostPress?.(item)}
            hitSlop={4}>
            <Text
              style={[
                styles.actionBtnText,
                item.isPublished ? styles.unpostBtnText : null,
              ]}>
              {item.isPublished ? 'Unpost' : 'Post'}
            </Text>
          </Pressable>
          <Pressable
            style={styles.actionBtn}
            onPress={() => onAuctionPress?.(item)}
            hitSlop={4}>
            <Text style={styles.actionBtnText}>Auction</Text>
          </Pressable>
          <Pressable
            style={[styles.actionBtn, styles.rentBtn]}
            onPress={() => onItemPress?.(item)}
            hitSlop={4}>
            <Text style={styles.rentBtnText}>Rent</Text>
            <Icon name="profileArrow" size={9} color={colors.white} />
          </Pressable>
        </View>
      </View>
    </View>
  );
});

function createStyles(c: AppColors) {
  return StyleSheet.create({
    card: {
      backgroundColor: c.surface,
      borderRadius: 24,
      borderWidth: 0.75,
      borderColor: c.borderSoft,
      overflow: 'hidden',
      shadowColor: '#0F172A',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 3,
    },
    imageWrap: {
      height: 156,
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 16,
      paddingTop: 8,
    },
    image: {
      width: '100%',
      height: 128,
    },
    statusBadge: {
      position: 'absolute',
      top: 12,
      left: 12,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      zIndex: 2,
    },
    statusText: {
      fontSize: 9,
      fontWeight: '700',
    },
    plateBadge: {
      position: 'absolute',
      top: 12,
      right: 12,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 10,
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderWidth: 0.75,
      borderColor: c.borderSoft,
      zIndex: 2,
    },
    plateText: {
      fontSize: 9,
      fontWeight: '700',
      color: c.textDark,
      letterSpacing: 0.4,
    },
    body: {
      paddingHorizontal: 16,
      paddingTop: 14,
      paddingBottom: 16,
      gap: 12,
    },
    titleBlock: {
      gap: 3,
    },
    makeYear: {
      fontSize: 10.5,
      color: c.textSoft,
      fontWeight: '500',
    },
    model: {
      fontSize: 16,
      fontWeight: '700',
      color: c.textDark,
      letterSpacing: -0.4,
      lineHeight: 20,
    },
    specsRow: {
      flexDirection: 'row',
      gap: 6,
    },
    specPill: {
      flex: 1,
      minWidth: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      height: 30,
      borderRadius: 10,
      backgroundColor: 'rgba(237,242,248,0.95)',
      borderWidth: 0.75,
      borderColor: c.borderSoft,
      paddingHorizontal: 4,
    },
    specLabel: {
      fontSize: 8.5,
      fontWeight: '600',
      color: c.textDark,
      flexShrink: 1,
    },
    priceRow: {
      gap: 2,
    },
    rentalLabel: {
      fontSize: 8.5,
      fontWeight: '700',
      color: c.textSoft,
      letterSpacing: 0.6,
    },
    rentalPrice: {
      fontSize: 18,
      fontWeight: '700',
      color: c.actionBlue,
      letterSpacing: -0.4,
    },
    rentalSuffix: {
      fontSize: 13,
      fontWeight: '600',
      color: c.actionBlue,
    },
    actionsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    actionBtn: {
      flex: 1,
      height: 34,
      borderRadius: 999,
      borderWidth: 0.75,
      borderColor: c.border,
      backgroundColor: c.background,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 4,
    },
    actionBtnText: {
      fontSize: 11,
      fontWeight: '600',
      color: c.textDark,
    },
    unpostBtn: {
      borderColor: '#FECACA',
      backgroundColor: '#FEF2F2',
    },
    unpostBtnText: {
      color: '#DC2626',
    },
    rentBtn: {
      flexDirection: 'row',
      gap: 4,
      borderColor: c.actionBlue,
      backgroundColor: c.actionBlue,
    },
    rentBtnText: {
      fontSize: 11,
      fontWeight: '600',
      color: c.white,
    },
  });
}
