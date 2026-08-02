import React from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {Icon, Screen} from '../../../components';
import {useThemedStyles, useThemeColors} from '../../../theme';
import {CarListingCard} from './CarListingCard';
import {createStyles} from './styles';
import {useCustomerHomeController} from './useController';

export function CustomerHome() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {
    userName,
    dateLabel,
    hasNotifications,
    saleListings,
    rentalListings,
    onNotificationsPress,
    onSettingsPress,
    onListingPress,
    onSeeAllSalePress,
    onSeeAllRentalPress,
  } = useCustomerHomeController();

  return (
    <Screen style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoBadge}>
              <Icon name="logoCar" size={20} color={colors.white} />
            </View>
            <View>
              <Text style={styles.dateLabel}>{dateLabel}</Text>
              <Text style={styles.welcome}>
                Welcome, <Text style={styles.welcomeName}>{userName}</Text>
              </Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <Pressable
              style={styles.iconButton}
              accessibilityLabel="Notifications"
              onPress={onNotificationsPress}>
              <Icon name="bell" size={18} />
              {hasNotifications ? <View style={styles.notificationDot} /> : null}
            </Pressable>
            <Pressable
              style={styles.iconButton}
              accessibilityLabel="Settings"
              onPress={onSettingsPress}>
              <Icon name="settings" size={18} />
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Cars from top showrooms</Text>
            <Pressable onPress={onSeeAllSalePress} hitSlop={8}>
              <Text style={styles.seeAll}>See all</Text>
            </Pressable>
          </View>
          <View style={styles.grid}>
            {saleListings.map(listing => (
              <View key={listing.id} style={styles.gridItem}>
                <CarListingCard listing={listing} onPress={onListingPress} />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Flexible car rentals near you</Text>
            <Pressable onPress={onSeeAllRentalPress} hitSlop={8}>
              <Text style={styles.seeAll}>See all</Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.railContent}>
            {rentalListings.map(listing => (
              <View key={listing.id} style={styles.railItem}>
                <CarListingCard listing={listing} onPress={onListingPress} />
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </Screen>
  );
}
