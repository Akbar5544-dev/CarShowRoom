import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {AppHeader, Icon, Screen} from '../../../components';
import {Images} from '../../../assets';
import {useThemedStyles, useThemeColors} from '../../../theme';
import type {OrderStatus} from './module';
import {createStyles} from './styles';
import {useHomeController} from './useController';

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function Home() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const STATUS_STYLE: Record<
    OrderStatus,
    {
      background: string;
      color: string;
      icon: 'statusActive' | 'statusPending' | 'statusOverdue';
    }
  > = {
    Active: {
      background: colors.badgeActiveBg,
      color: colors.successBright,
      icon: 'statusActive',
    },
    Pending: {
      background: colors.badgePendingBg,
      color: colors.warning,
      icon: 'statusPending',
    },
    Overdue: {
      background: colors.badgeOverdueBg,
      color: colors.error,
      icon: 'statusOverdue',
    },
  };
  const {
    userName,
    dateLabel,
    fleet,
    metrics,
    statusItems,
    revenueTotal,
    revenueGrowth,
    revenuePeriod,
    revenueBars,
    orders,
    activities,
    setRevenuePeriod,
    onSettingsPress,
  } = useHomeController();

  const statusTotal = statusItems.reduce((sum, item) => sum + item.count, 0);

  return (
    <Screen style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <AppHeader
          dateLabel={dateLabel}
          userName={userName}
          onSettingsPress={onSettingsPress}
        />

        <View style={styles.main}>
          <View style={styles.fleetCard}>
              <View style={styles.fleetTop}>
                <View>
                  <View style={styles.fleetBadge}>
                    <Text style={styles.fleetBadgeText}>Fleet Overview</Text>
                  </View>
                  <Text style={styles.fleetTitle}>Your fleet at a glance</Text>
                  <Text style={styles.fleetSubtitle}>
                    Real-time · {fleet.total} vehicles
                  </Text>
                </View>
                <Pressable style={styles.exploreButton}>
                  <Text style={styles.exploreText}>Explore</Text>
                </Pressable>
              </View>
              <View style={styles.fleetImageWrap}>
                <Image
                  source={Images.fleetVehicle}
                  style={styles.fleetImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.fleetStats}>
                <View style={styles.fleetStat}>
                  <Text style={styles.fleetStatValue}>{fleet.available}</Text>
                  <Text style={styles.fleetStatLabel}>Available</Text>
                </View>
                <View style={styles.fleetStat}>
                  <Text style={styles.fleetStatValue}>{fleet.booked}</Text>
                  <Text style={styles.fleetStatLabel}>Booked</Text>
                </View>
                <View style={styles.fleetStat}>
                  <Text style={styles.fleetStatValue}>{fleet.service}</Text>
                  <Text style={styles.fleetStatLabel}>Service</Text>
                </View>
              </View>
          </View>

          <View style={styles.metricsGrid}>
              {metrics.map(metric => (
                <View
                  key={metric.id}
                  style={[styles.metricCard, {backgroundColor: metric.background}]}>
                  <View style={styles.metricTop}>
                    <View style={styles.metricIconWrap}>
                      <Icon name={metric.icon} size={18} />
                    </View>
                    <View style={styles.changeBadge}>
                      <Icon
                        name={metric.positive ? 'trendUp' : 'trendDown'}
                        size={12}
                      />
                      <Text
                        style={[
                          styles.changeText,
                          metric.positive
                            ? styles.changePositive
                            : styles.changeNegative,
                        ]}>
                        {metric.change}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.metricLabel}>{metric.label}</Text>
                  <Text style={styles.metricValue}>{metric.value}</Text>
                </View>
              ))}
          </View>

          <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionEyebrow}>Vehicle Status</Text>
                  <Text style={styles.sectionTitle}>Distribution</Text>
                </View>
                <Text style={styles.sectionMeta}>Total {statusTotal}</Text>
              </View>
              <View style={styles.statusBar}>
                {statusItems.map(item => (
                  <View
                    key={item.label}
                    style={[
                      styles.statusSegment,
                      {
                        backgroundColor: item.color,
                        flex: item.count,
                      },
                    ]}
                  />
                ))}
              </View>
              <View style={styles.statusGrid}>
                {statusItems.map(item => (
                  <View key={item.label} style={styles.statusItem}>
                    <View style={styles.statusLeft}>
                      <View
                        style={[styles.statusDot, {backgroundColor: item.color}]}
                      />
                      <Text style={styles.statusLabel}>{item.label}</Text>
                    </View>
                    <Text style={styles.statusCount}>{item.count}</Text>
                  </View>
                ))}
              </View>
          </View>

          <View style={[styles.card, {gap: 16}]}>
              <View style={styles.revenueHeader}>
                <View>
                  <Text style={styles.sectionEyebrow}>Revenue</Text>
                  <Text style={styles.sectionTitle}>This Week</Text>
                  <View style={styles.revenueAmountRow}>
                    <Text style={styles.revenueAmount}>{revenueTotal}</Text>
                    <Text style={styles.revenueGrowth}>{revenueGrowth}</Text>
                  </View>
                </View>
                <View style={styles.periodToggle}>
                  {(['D', 'W', 'M'] as const).map(period => {
                    const active = revenuePeriod === period;
                    return (
                      <Pressable
                        key={period}
                        onPress={() => setRevenuePeriod(period)}
                        style={[
                          styles.periodButton,
                          active && styles.periodButtonActive,
                        ]}>
                        <Text
                          style={[
                            styles.periodText,
                            active && styles.periodTextActive,
                          ]}>
                          {period}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
              <View style={styles.chart}>
                {revenueBars.map((value, index) => (
                  <View
                    key={`${DAY_LABELS[index]}-${index}`}
                    style={styles.chartColumn}>
                    <View
                      style={[
                        styles.chartBar,
                        {
                          height: Math.max(8, value * 100),
                          opacity: 0.35 + value * 0.65,
                        },
                      ]}
                    />
                    <Text style={styles.chartLabel}>{DAY_LABELS[index]}</Text>
                  </View>
                ))}
              </View>
          </View>

          <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionEyebrow}>Recent Rentals</Text>
                  <Text style={styles.sectionTitle}>Latest orders</Text>
                </View>
                <Pressable>
                  <Text style={styles.link}>View all</Text>
                </Pressable>
              </View>
              <View>
                {orders.length === 0 ? (
                  <Text style={styles.emptyHint}>No recent rentals</Text>
                ) : (
                  orders.map((order, index) => {
                    const status = STATUS_STYLE[order.status];
                    const isLast = index === orders.length - 1;
                    return (
                      <View
                        key={order.id}
                        style={[styles.orderRow, isLast && styles.orderRowLast]}>
                        <View style={styles.avatar}>
                          <Text style={styles.avatarText}>{order.initials}</Text>
                        </View>
                        <View style={styles.orderInfo}>
                          <Text style={styles.orderName}>{order.name}</Text>
                          <Text style={styles.orderDetail}>{order.detail}</Text>
                        </View>
                        <View
                          style={[
                            styles.statusBadge,
                            {backgroundColor: status.background},
                          ]}>
                          <Icon name={status.icon} size={12} />
                          <Text
                            style={[
                              styles.statusBadgeText,
                              {color: status.color},
                            ]}>
                            {order.status}
                          </Text>
                        </View>
                      </View>
                    );
                  })
                )}
              </View>
          </View>

          <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionEyebrow}>Activity</Text>
                  <Text style={styles.sectionTitle}>Timeline</Text>
                </View>
                <Icon name="activityMenu" size={16} />
              </View>
              <View style={{gap: 12}}>
                {activities.length === 0 ? (
                  <Text style={styles.emptyHint}>No recent activity</Text>
                ) : (
                  activities.map(activity => (
                    <View key={activity.id} style={styles.activityRow}>
                      <View
                        style={[
                          styles.activityIcon,
                          {backgroundColor: activity.background},
                        ]}>
                        <Icon name={activity.icon} size={16} />
                      </View>
                      <View style={styles.activityInfo}>
                        <Text style={styles.activityMessage}>
                          {activity.message}
                        </Text>
                        <Text style={styles.activityTime}>{activity.time}</Text>
                      </View>
                    </View>
                  ))
                )}
              </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
