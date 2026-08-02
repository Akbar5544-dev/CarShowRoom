import React, {memo} from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, {Defs, LinearGradient, Rect, Stop} from 'react-native-svg';
import {Icon} from '../../../components';
import {type AppColors, useThemedStyles, useThemeColors} from '../../../theme';

type VehicleDetailHeroCardProps = {
  status: string;
  statusBg: string;
  statusColor: string;
  make: string;
  year: string;
  title: string;
  description: string;
  dailyRate: string;
  rating: string;
  imageSource: ImageSourcePropType;
  onRentNowPress: () => void;
  onEditPress: () => void;
};

export const VehicleDetailHeroCard = memo(function VehicleDetailHeroCard({
  status,
  statusBg,
  statusColor,
  make,
  year,
  title,
  description,
  dailyRate,
  rating,
  imageSource,
  onRentNowPress,
  onEditPress,
}: VehicleDetailHeroCardProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.heroCard}>
      <View style={styles.heroGradient} pointerEvents="none">
        <Svg width="100%" height="100%">
          <Defs>
            <LinearGradient id="vehicleHeroGradient" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#EAF2FF" stopOpacity="0.95" />
              <Stop offset="45%" stopColor="#FFFFFF" stopOpacity="1" />
              <Stop offset="100%" stopColor="#EEF3FF" stopOpacity="0.92" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#vehicleHeroGradient)" />
        </Svg>
      </View>

      <View style={styles.heroContent}>
        <View style={[styles.statusBadge, {backgroundColor: statusBg}]}>
          <Text style={[styles.statusText, {color: statusColor}]}>{status}</Text>
        </View>

        <Text style={styles.makeYear}>
          {make} · {year}
        </Text>
        <Text style={styles.heroTitle}>{title}</Text>
        <Text style={styles.heroDescription}>{description}</Text>

        <View style={styles.priceRow}>
          <Text>
            <Text style={styles.priceValue}>{dailyRate}</Text>
            <Text style={styles.priceSuffix}> / day</Text>
          </Text>
          <View style={styles.ratingRow}>
            <Icon name="star" size={12} color="#F5B301" />
            <Text style={styles.ratingText}>{rating}</Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <Pressable style={styles.rentBtn} onPress={onRentNowPress}>
            <Text style={styles.rentBtnText}>Rent Now</Text>
            <Icon name="profileArrow" size={11} color={colors.white} />
          </Pressable>
          <Pressable style={styles.editBtn} onPress={onEditPress}>
            <Text style={styles.editBtnText}>Edit</Text>
            <Icon name="profileArrow" size={11} color={colors.textDark} />
          </Pressable>
        </View>
      </View>

      <View style={styles.imageSection}>
        <View style={styles.imageGlow} />
        <Image source={imageSource} style={styles.image} resizeMode="contain" />
      </View>
    </View>
  );
});

function createStyles(c: AppColors) {
  return StyleSheet.create({
    heroCard: {
      borderRadius: 32,
      overflow: 'hidden',
      borderWidth: 0.75,
      borderColor: 'rgba(148,163,184,0.22)',
      backgroundColor: c.surface,
      shadowColor: '#0F172A',
      shadowOffset: {width: 0, height: 8},
      shadowOpacity: 0.1,
      shadowRadius: 18,
      elevation: 4,
    },
    heroGradient: {
      ...StyleSheet.absoluteFill,
    },
    heroContent: {
      paddingHorizontal: 22,
      paddingTop: 22,
      gap: 10,
    },
    statusBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 999,
    },
    statusText: {
      fontSize: 10,
      fontWeight: '700',
    },
    makeYear: {
      fontSize: 11,
      fontWeight: '700',
      color: c.actionBlue,
      letterSpacing: 0.2,
    },
    heroTitle: {
      fontSize: 28,
      fontWeight: '800',
      color: c.textDark,
      letterSpacing: -0.8,
      lineHeight: 32,
    },
    heroDescription: {
      fontSize: 11.5,
      color: '#5F6368',
      lineHeight: 17,
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 2,
    },
    priceValue: {
      fontSize: 24,
      fontWeight: '800',
      color: c.actionBlue,
      letterSpacing: -0.6,
    },
    priceSuffix: {
      fontSize: 12,
      fontWeight: '500',
      color: c.textSoft,
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    ratingText: {
      fontSize: 12,
      fontWeight: '700',
      color: c.textDark,
    },
    actionRow: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 2,
    },
    rentBtn: {
      flex: 1,
      height: 40,
      borderRadius: 22,
      backgroundColor: c.actionBlue,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      shadowColor: c.actionBlue,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.28,
      shadowRadius: 8,
      elevation: 3,
    },
    rentBtnText: {
      fontSize: 12,
      fontWeight: '700',
      color: c.white,
    },
    editBtn: {
      height: 40,
      paddingHorizontal: 18,
      borderRadius: 22,
      borderWidth: 0.75,
      borderColor: 'rgba(148,163,184,0.25)',
      backgroundColor: c.surface,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
      shadowColor: '#0F172A',
      shadowOffset: {width: 0, height: 3},
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    },
    editBtnText: {
      fontSize: 12,
      fontWeight: '600',
      color: c.textDark,
    },
    imageSection: {
      height: 168,
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginTop: 6,
      paddingBottom: 8,
    },
    imageGlow: {
      position: 'absolute',
      bottom: 18,
      width: '72%',
      height: 28,
      borderRadius: 999,
      backgroundColor: 'rgba(59,130,246,0.22)',
    },
    image: {
      width: '96%',
      height: 150,
    },
  });
}
