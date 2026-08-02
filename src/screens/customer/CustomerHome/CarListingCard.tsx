import React, {memo} from 'react';
import {Image, Pressable, Text, View} from 'react-native';
import {Images} from '../../../assets';
import {Icon} from '../../../components';
import {type AppColors, useThemedStyles, useThemeColors} from '../../../theme';
import type {CarListing, ListingBadgeTone} from './module';
import {createCardStyles} from './styles';

type CarListingCardProps = {
  listing: CarListing;
  onPress?: (listing: CarListing) => void;
};

function badgePalette(tone: ListingBadgeTone, c: AppColors) {
  switch (tone) {
    case 'new':
      return {background: '#DCFCE7', color: '#15803D'};
    case 'reserved':
      return {background: '#FFEDD5', color: '#C2410C'};
    case 'rent':
      return {background: c.actionTint15, color: c.actionBlue};
    default:
      return {background: c.actionTint15, color: c.actionBlue};
  }
}

export const CarListingCard = memo(function CarListingCard({
  listing,
  onPress,
}: CarListingCardProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createCardStyles);

  const [leadBadge, ...trailingBadges] = listing.badges;

  return (
    <Pressable style={styles.card} onPress={() => onPress?.(listing)}>
      <View style={[styles.imageWrap, {backgroundColor: listing.imageTint}]}>
        <View style={styles.badgeRow} pointerEvents="none">
          <View style={styles.badgeGroup}>
            {leadBadge ? (
              <View
                style={[
                  styles.badge,
                  {backgroundColor: badgePalette(leadBadge.tone, colors).background},
                ]}>
                <Text
                  style={[
                    styles.badgeText,
                    {color: badgePalette(leadBadge.tone, colors).color},
                  ]}>
                  {leadBadge.label}
                </Text>
              </View>
            ) : null}
          </View>
          <View style={styles.badgeGroup}>
            {trailingBadges.map(badge => {
              const palette = badgePalette(badge.tone, colors);
              return (
                <View
                  key={badge.label}
                  style={[styles.badge, {backgroundColor: palette.background}]}>
                  <Text style={[styles.badgeText, {color: palette.color}]}>
                    {badge.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
        <Image
          source={
            listing.imageUri ? {uri: listing.imageUri} : Images.fleetVehicle
          }
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.body}>
        <View>
          <Text style={styles.title} numberOfLines={1}>
            {listing.title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {listing.subtitle}
          </Text>
        </View>

        <View style={styles.specsRow}>
          {listing.specs.map(spec => (
            <View key={spec.label} style={styles.specPill}>
              <Icon name={spec.icon} size={8} color={colors.textSoft} />
              <Text style={styles.specLabel} numberOfLines={1}>
                {spec.label}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        <View style={styles.footer}>
          <View style={styles.showroomBlock}>
            <View style={styles.showroomRow}>
              <Text style={styles.showroomName} numberOfLines={1}>
                {listing.showroomName}
              </Text>
              {listing.showroomVerified ? (
                <Icon name="checkCircle" size={9} color={colors.actionBlue} />
              ) : null}
            </View>
            <View style={styles.locationRow}>
              <Icon name="location" size={7} color={colors.textSoft} />
              <Text style={styles.locationLabel} numberOfLines={1}>
                {listing.locationLabel}
              </Text>
            </View>
          </View>

          <View style={styles.priceBlock}>
            <Text style={styles.price} numberOfLines={1}>
              {listing.price}
            </Text>
            {listing.priceSuffix ? (
              <Text style={styles.priceSuffix}>{listing.priceSuffix}</Text>
            ) : null}
          </View>
        </View>
      </View>
    </Pressable>
  );
});
