import React from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {
  AddBonusModal,
  AddSalaryModal,
  AssignShiftModal,
  AttendancePanel,
  BonusesPanel,
  DocumentsPanel,
  Icon,
  InfoStatCard,
  PerformanceRatingCard,
  PerformanceTrendChart,
  ProfileInfoCard,
  ProfileTabs,
  QuickStatsRow,
  SalaryPanel,
  Screen,
  ShiftsPanel,
  UploadDocumentModal,
} from '../../../components';
import {useThemedStyles, useThemeColors} from '../../../theme';
import {createStyles} from './styles';
import {useStaffOverviewController} from './useController';

export function StaffOverview() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {
    stats,
    rating,
    ratingCaption,
    profile,
    tabs,
    activeTab,
    quickStats,
    trendValues,
    trendGrowth,
    attendanceSummary,
    attendanceLegend,
    attendanceMonth,
    attendanceYear,
    attendanceMonthOptions,
    attendanceYearOptions,
    attendanceWeekDays,
    attendanceCells,
    isSavingAttendance,
    onAttendanceMonthChange,
    onAttendanceYearChange,
    onAttendanceTodayPress,
    onDayStatusSelect,
    salaryYtd,
    salaryRows,
    salarySearch,
    bonusTotal,
    bonusItems,
    bonusSearch,
    shiftItems,
    shiftSearch,
    documentTotalLabel,
    documentItems,
    documentSearch,
    isUploadModalVisible,
    uploadFileName,
    isAddSalaryModalVisible,
    isAddBonusModalVisible,
    isAssignShiftModalVisible,
    isSubmittingAction,
    setActiveTab,
    setSalarySearch,
    setBonusSearch,
    setShiftSearch,
    setDocumentSearch,
    onUploadDocumentPress,
    onCloseUploadModal,
    onPickUploadDocument,
    onConfirmUploadPress,
    onAddSalaryPress,
    onCloseAddSalaryModal,
    onConfirmAddSalary,
    onAddBonusPress,
    onCloseAddBonusModal,
    onConfirmAddBonus,
    onAssignShiftPress,
    onCloseAssignShiftModal,
    onConfirmAssignShift,
    onDownloadPress,
    onBackPress,
  } = useStaffOverviewController();

  return (
    <Screen style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.main}>
          <View style={styles.titleRow}>
            <Pressable
              style={styles.backBtn}
              onPress={onBackPress}
              accessibilityLabel="Go back"
              hitSlop={8}>
              <Icon name="arrowLeft" size={12} color={colors.white} />
            </Pressable>
            <Text style={styles.pageTitle}>Profile View</Text>
          </View>

          <View style={styles.statsGrid}>
            {stats.map(item => (
              <InfoStatCard key={item.id} item={item} />
            ))}
          </View>

          <PerformanceRatingCard rating={rating} caption={ratingCaption} />

          <ProfileInfoCard profile={profile} onDownloadPress={onDownloadPress} />

          <View style={styles.analyticsCard}>
            <ProfileTabs
              tabs={tabs}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
            {activeTab === 'overview' ? (
              <>
                <QuickStatsRow items={quickStats} />
                <PerformanceTrendChart
                  values={trendValues}
                  growthLabel={trendGrowth}
                />
              </>
            ) : activeTab === 'attendance' ? (
              <AttendancePanel
                summary={attendanceSummary}
                legend={attendanceLegend}
                monthLabel={attendanceMonth}
                yearLabel={attendanceYear}
                monthOptions={attendanceMonthOptions}
                yearOptions={attendanceYearOptions}
                weekDays={attendanceWeekDays}
                cells={attendanceCells}
                saving={isSavingAttendance}
                onMonthChange={onAttendanceMonthChange}
                onYearChange={onAttendanceYearChange}
                onTodayPress={onAttendanceTodayPress}
                onDayStatusSelect={onDayStatusSelect}
              />
            ) : activeTab === 'salary' ? (
              <SalaryPanel
                ytdTotal={salaryYtd}
                rows={salaryRows}
                searchValue={salarySearch}
                onSearchChange={setSalarySearch}
                onAddPress={onAddSalaryPress}
              />
            ) : activeTab === 'bonuses' ? (
              <BonusesPanel
                total={bonusTotal}
                items={bonusItems}
                searchValue={bonusSearch}
                onSearchChange={setBonusSearch}
                onAddPress={onAddBonusPress}
              />
            ) : activeTab === 'shifts' ? (
              <ShiftsPanel
                items={shiftItems}
                searchValue={shiftSearch}
                onSearchChange={setShiftSearch}
                onAssignPress={onAssignShiftPress}
              />
            ) : activeTab === 'documents' ? (
              <DocumentsPanel
                totalLabel={documentTotalLabel}
                items={documentItems}
                searchValue={documentSearch}
                onSearchChange={setDocumentSearch}
                onUploadPress={onUploadDocumentPress}
              />
            ) : null}
          </View>
        </View>
      </ScrollView>

      <UploadDocumentModal
        visible={isUploadModalVisible}
        submitting={isSubmittingAction}
        selectedFileName={uploadFileName}
        onClose={onCloseUploadModal}
        onPickPress={onPickUploadDocument}
        onUploadPress={onConfirmUploadPress}
      />
      <AddSalaryModal
        visible={isAddSalaryModalVisible}
        submitting={isSubmittingAction}
        onClose={onCloseAddSalaryModal}
        onConfirm={onConfirmAddSalary}
      />
      <AddBonusModal
        visible={isAddBonusModalVisible}
        submitting={isSubmittingAction}
        onClose={onCloseAddBonusModal}
        onConfirm={onConfirmAddBonus}
      />
      <AssignShiftModal
        visible={isAssignShiftModalVisible}
        submitting={isSubmittingAction}
        onClose={onCloseAssignShiftModal}
        onConfirm={onConfirmAssignShift}
      />
    </Screen>
  );
}
