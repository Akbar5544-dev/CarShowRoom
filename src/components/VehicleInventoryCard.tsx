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
};

type VehicleInventoryCardProps = {
  item: VehicleInventoryItem;
  onViewPress?: (item: VehicleInventoryItem) => void;
  onItemPress?: (item: VehicleInventoryItem) => void;
};

type SpecItem = {
  icon: 'shiftSun' | 'shiftClock' | 'employees' | 'presentDays';
  label: string;
};

export const VehicleInventoryCard = memo(function VehicleInventoryCard({
  item,
  onViewPress,
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
        <View
          style={[styles.statusBadge, {backgroundColor: item.statusBg}]}>
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
        <View style={styles.titleRow}>
          <View style={styles.titleBlock}>
            <Text style={styles.makeYear} numberOfLines={1}>
              {item.make}
              {item.year ? ` · ${item.year}` : ''}
            </Text>
            <Text style={styles.model} numberOfLines={1}>
              {item.model}
            </Text>
          </View>
          <Pressable
            onPress={() => onViewPress?.(item)}
            hitSlop={8}
            style={styles.viewBtn}>
            <Text style={styles.viewLink}>View</Text>
          </Pressable>
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

        <View style={styles.footer}>
          <View>
            <Text style={styles.rentalLabel}>RENTAL</Text>
            <Text style={styles.rentalPrice}>
              {item.dailyRate}
              <Text style={styles.rentalSuffix}>/day</Text>
            </Text>
          </View>
          <Pressable
            style={styles.rentBtn}
            onPress={() => onItemPress?.(item)}
            hitSlop={6}>
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
      gap: 14,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
    },
    titleBlock: {
      flex: 1,
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
    viewBtn: {
      paddingTop: 2,
    },
    viewLink: {
      fontSize: 10.5,
      fontWeight: '600',
      color: c.actionBlue,
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
    footer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
    },
    rentalLabel: {
      fontSize: 8.5,
      fontWeight: '700',
      color: c.textSoft,
      letterSpacing: 0.6,
      marginBottom: 2,
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
    rentBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      height: 32,
      paddingHorizontal: 14,
      borderRadius: 999,
      backgroundColor: c.actionBlue,
    },
    rentBtnText: {
      fontSize: 11,
      fontWeight: '600',
      color: c.white,
    },
  });
}
