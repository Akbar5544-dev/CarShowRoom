import React from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {
  AppHeader,
  Icon,
  MetricCard,
  RentalsReturnsChart,
  Screen,
} from '../../../components';
import {useThemedStyles, useThemeColors} from '../../../theme';
import {createStyles} from './styles';
import {useRentalsController} from './useController';

export function Rentals() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {
    userName,
    dateLabel,
    summary,
    metrics,
    rentalsSeries,
    returnsSeries,
    upcomingPickups,
    onViewVehiclesPress,
    onNewRentalPress,
  } = useRentalsController();

  return (
    <Screen style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <AppHeader dateLabel={dateLabel} userName={userName} />

        <View style={styles.main}>
          <View style={styles.pageHeader}>
            <View>
              <Text style={styles.pageTitle}>Rental Operations</Text>
              <Text style={styles.pageSubtitle}>{summary}</Text>
            </View>
            <View style={styles.actions}>
              <Pressable
                style={styles.secondaryBtn}
                onPress={onViewVehiclesPress}>
                <Icon name="addPlus" size={12} color={colors.textDark} />
                <Text style={styles.secondaryBtnText}>View Vehicles</Text>
              </Pressable>
              <Pressable style={styles.primaryBtn} onPress={onNewRentalPress}>
                <Icon name="addPlus" size={12} color={colors.white} />
                <Text style={styles.primaryBtnText}>New Rental</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.metricsGrid}>
            {metrics.map(item => (
              <MetricCard key={item.id} item={item} />
            ))}
          </View>

          <RentalsReturnsChart rentals={rentalsSeries} returns={returnsSeries} />

          <View style={styles.card}>
            <View>
              <Text style={styles.sectionEyebrow}>Upcoming Pickups</Text>
              <Text style={styles.sectionTitle}>Next 48 hours</Text>
            </View>
            {upcomingPickups.map((item, index) => {
              const isLast = index === upcomingPickups.length - 1;
              return (
                <View
                  key={item.id}
                  style={[styles.pickupRow, isLast && styles.pickupRowLast]}>
                  <View
                    style={[styles.pickupIcon, {backgroundColor: item.iconBg}]}>
                    <Icon name="activityKey" size={14} />
                  </View>
                  <View style={styles.pickupInfo}>
                    <Text style={styles.pickupName}>{item.name}</Text>
                    <Text style={styles.pickupVehicle}>{item.vehicle}</Text>
                  </View>
                  <View style={styles.pickupMeta}>
                    <Text style={styles.pickupWhen}>{item.when}</Text>
                    <Text style={styles.pickupId}>{item.rentalId}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
