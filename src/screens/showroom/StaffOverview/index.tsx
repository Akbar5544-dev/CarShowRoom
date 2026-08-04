import React from 'react';
import {Modal, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
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
    uploadCount,
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
    isMonthlyFilterModalVisible,
    onOpenMonthlyFilterPress,
    onCloseMonthlyFilterModal,
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
                onFilterPress={onOpenMonthlyFilterPress}
              />
            ) : activeTab === 'bonuses' ? (
              <BonusesPanel
                total={bonusTotal}
                items={bonusItems}
                searchValue={bonusSearch}
                onSearchChange={setBonusSearch}
                onAddPress={onAddBonusPress}
                onFilterPress={onOpenMonthlyFilterPress}
              />
            ) : activeTab === 'shifts' ? (
              <ShiftsPanel
                items={shiftItems}
                searchValue={shiftSearch}
                onSearchChange={setShiftSearch}
                onAssignPress={onAssignShiftPress}
                onFilterPress={onOpenMonthlyFilterPress}
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
        selectedCount={uploadCount}
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

      <Modal
        visible={isMonthlyFilterModalVisible}
        transparent
        animationType="fade"
        onRequestClose={onCloseMonthlyFilterModal}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(7, 17, 35, 0.45)',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 20,
          }}>
          <Pressable
            style={{...StyleSheet.absoluteFill}}
            onPress={onCloseMonthlyFilterModal}
          />
          <View
            style={{
              width: '100%',
              maxWidth: 360,
              backgroundColor: colors.surface,
              borderRadius: 28,
              borderWidth: 0.75,
              borderColor: colors.borderSoft,
              paddingHorizontal: 22,
              paddingTop: 24,
              paddingBottom: 18,
            }}>
            <Text style={{fontSize: 11, fontWeight: '700', color: colors.actionBlue, textTransform: 'uppercase'}}>
              FILTER
            </Text>
            <Text style={{fontSize: 20, fontWeight: '700', color: colors.textDark, marginTop: 4}}>
              Monthly Basis
            </Text>

            <ScrollView style={{marginTop: 14}} showsVerticalScrollIndicator={false}>
              <Text style={{fontSize: 12, fontWeight: '600', color: colors.textSoft, marginBottom: 10}}>
                Month
              </Text>
              <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8}}>
                {attendanceMonthOptions.map(m => {
                  const active = m === attendanceMonth;
                  return (
                    <Pressable
                      key={m}
                      onPress={() => {
                        onAttendanceMonthChange(m);
                        onCloseMonthlyFilterModal();
                      }}
                      style={{
                        paddingHorizontal: 12,
                        height: 30,
                        borderRadius: 999,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: active ? colors.actionBlue : 'rgba(241,244,248,0.9)',
                        borderWidth: 0.75,
                        borderColor: active ? colors.actionBlue : colors.borderSoft,
                      }}>
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: active ? '700' : '600',
                          color: active ? colors.white : colors.textDark,
                        }}>
                        {m}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={{fontSize: 12, fontWeight: '600', color: colors.textSoft, marginVertical: 14}}>
                Year
              </Text>
              <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8}}>
                {attendanceYearOptions.map(y => {
                  const active = y === attendanceYear;
                  return (
                    <Pressable
                      key={y}
                      onPress={() => {
                        onAttendanceYearChange(y);
                        onCloseMonthlyFilterModal();
                      }}
                      style={{
                        paddingHorizontal: 12,
                        height: 30,
                        borderRadius: 999,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: active ? colors.actionBlue : 'rgba(241,244,248,0.9)',
                        borderWidth: 0.75,
                        borderColor: active ? colors.actionBlue : colors.borderSoft,
                      }}>
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: active ? '700' : '600',
                          color: active ? colors.white : colors.textDark,
                        }}>
                        {y}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}
