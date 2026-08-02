import React from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {
  AppHeader,
  AttendanceChart,
  DepartmentDonut,
  Icon,
  MetricCard,
  Screen,
  SectionHeader,
  ScreenLoader,
} from '../../../components';
import {useThemedStyles, useThemeColors} from '../../../theme';
import {createStyles} from './styles';
import {useStaffController} from './useController';

export function Staff() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {
    userName,
    dateLabel,
    summary,
    metrics,
    attendanceDays,
    attendanceAvg,
    departments,
    departmentTotal,
    isLoading,
    onViewEmployeesPress,
  } = useStaffController();

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
              <Text style={styles.pageTitle}>Staff Management</Text>
              <Text style={styles.pageSubtitle}>{summary}</Text>
            </View>
            <View style={styles.actions}>
              <Pressable
                style={styles.primaryBtn}
                onPress={onViewEmployeesPress}>
                <Icon name="addUser" size={12} color={colors.white} />
                <Text style={styles.primaryBtnText}>View Employees</Text>
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
              eyebrow="Attendance"
              title="This Week"
              right={
                <View style={styles.avgBadge}>
                  <Icon name="growthGreen" size={9} />
                  <Text style={styles.avgText}>{attendanceAvg}</Text>
                </View>
              }
            />
            <AttendanceChart days={attendanceDays} />
          </View>

          <View style={styles.card}>
            <SectionHeader eyebrow="Departments" title="Distribution" />
            <DepartmentDonut items={departments} total={departmentTotal} />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
