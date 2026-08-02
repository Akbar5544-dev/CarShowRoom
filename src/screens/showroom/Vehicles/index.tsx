import React from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {
  AppHeader,
  DepartmentDonut,
  FleetUsageChart,
  MetricCard,
  Screen,
  SectionHeader,
  ScreenLoader,
} from '../../../components';
import {useThemedStyles} from '../../../theme';
import {createStyles} from './styles';
import {useVehiclesController} from './useController';

export function Vehicles() {
  const styles = useThemedStyles(createStyles);
  const {
    userName,
    dateLabel,
    summary,
    metrics,
    fleetUsage,
    categories,
    categoryTotal,
    isLoading,
    onAuctionPress,
    onVehiclesPress,
  } = useVehiclesController();

  return (
    <Screen style={styles.container}>
      <ScreenLoader visible={isLoading} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <AppHeader dateLabel={dateLabel} userName={userName} />

        <View style={styles.main}>
          <View style={styles.pageHeader}>
            <View>
              <Text style={styles.pageTitle}>Vehicle Inventory</Text>
              <Text style={styles.pageSubtitle}>{summary}</Text>
            </View>
            <View style={styles.actions}>
              <Pressable style={styles.outlineBtn} onPress={onAuctionPress}>
                <Text style={styles.outlineBtnText}>Auction</Text>
              </Pressable>
              <Pressable style={styles.primaryBtn} onPress={onVehiclesPress}>
                <Text style={styles.primaryBtnText}>Vehicles</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.metricsGrid}>
            {metrics.map(metric => (
              <MetricCard key={metric.id} item={metric} />
            ))}
          </View>

          <View style={styles.card}>
            <SectionHeader
              eyebrow="Fleet Usage"
              title="Utilization by month"
            />
            <FleetUsageChart months={fleetUsage} />
          </View>

          <View style={styles.card}>
            <SectionHeader eyebrow="Categories" title="Distribution" />
            <DepartmentDonut
              items={categories}
              total={categoryTotal}
              centerLabel="Fleet"
              legendColumns={2}
            />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
