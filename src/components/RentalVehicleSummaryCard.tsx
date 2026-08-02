import React, {memo} from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Images} from '../assets';
import {type AppColors, useThemedStyles, useThemeColors} from '../theme';
import {Icon} from './Icon';

export type RentalVehicleSummary = {
  title: string;
  subtitle: string;
  fuelType: string;
  transmission: string;
  seats: string;
  mileageLabel: string;
  rating: string;
  dailyRate: string;
  durationLabel: string;
  imageUri: string | null;
  imageTint: string;
};

type RentalVehicleSummaryCardProps = {
  vehicle: RentalVehicleSummary;
};

export const RentalVehicleSummaryCard = memo(function RentalVehicleSummaryCard({
  vehicle,
}: RentalVehicleSummaryCardProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  const imageSource: ImageSourcePropType = vehicle.imageUri
    ? {uri: vehicle.imageUri}
    : Images.fleetVehicle;

  const specs = [
    vehicle.fuelType,
    vehicle.transmission,
    `${vehicle.seats} seats`,
    vehicle.mileageLabel,
  ];

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.badge}>
          <Icon name="star" size={9} color={colors.actionBlue} />
          <Text style={styles.badgeText}>RENT THIS VEHICLE</Text>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {vehicle.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {vehicle.subtitle}
        </Text>

        <View style={styles.specsRow}>
          {specs.map(spec => (
            <View key={spec} style={styles.specPill}>
              <Text style={styles.specText} numberOfLines={1}>
                {spec}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.ratingRow}>
          <Icon name="star" size={10} color="#F5B301" />
          <Text style={styles.ratingText}>{vehicle.rating} rating</Text>
        </View>

        <Text style={styles.priceLine}>
          <Text style={styles.priceValue}>{vehicle.dailyRate}</Text>
          <Text style={styles.priceSuffix}> / day · {vehicle.durationLabel}</Text>
        </Text>
      </View>

      <View style={[styles.imageWrap, {backgroundColor: vehicle.imageTint}]}>
        <Image source={imageSource} style={styles.image} resizeMode="contain" />
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
      padding: 16,
      flexDirection: 'row',
      gap: 8,
      shadowColor: '#0F172A',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 3,
      overflow: 'hidden',
    },
    content: {
      flex: 1,
      minWidth: 0,
      gap: 8,
    },
    badge: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 999,
      backgroundColor: c.actionTint06,
      borderWidth: 0.75,
      borderColor: c.actionTint15,
    },
    badgeText: {
      fontSize: 7.5,
      fontWeight: '700',
      color: c.actionBlue,
      letterSpacing: 0.4,
    },
    title: {
      fontSize: 16,
      fontWeight: '700',
      color: c.textDark,
      letterSpacing: -0.4,
      lineHeight: 20,
    },
    subtitle: {
      fontSize: 9.5,
      color: c.textSoft,
      lineHeight: 14,
    },
    specsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 4,
    },
    specPill: {
      paddingHorizontal: 7,
      paddingVertical: 4,
      borderRadius: 8,
      backgroundColor: 'rgba(237,242,248,0.95)',
      borderWidth: 0.75,
      borderColor: c.borderSoft,
    },
    specText: {
      fontSize: 8,
      fontWeight: '600',
      color: c.textDark,
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    ratingText: {
      fontSize: 9,
      fontWeight: '600',
      color: c.textDark,
    },
    priceLine: {
      marginTop: 2,
    },
    priceValue: {
      fontSize: 18,
      fontWeight: '700',
      color: c.actionBlue,
      letterSpacing: -0.4,
    },
    priceSuffix: {
      fontSize: 10,
      fontWeight: '500',
      color: c.textSoft,
    },
    imageWrap: {
      width: 118,
      height: 118,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 6,
    },
    image: {
      width: '100%',
      height: '100%',
    },
  });
}
