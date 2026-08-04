import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {Images} from '../../../assets';
import {
  Icon,
  Screen,
  UploadDocumentModal,
} from '../../../components';
import {useThemedStyles, useThemeColors} from '../../../theme';
import type {VehicleDetailTabId} from './module';
import {createStyles} from './styles';
import {useVehicleDetailController} from './useController';
import {VehicleOverviewPanel} from './VehicleOverviewPanel';
import {VehicleAvailabilityCalendar} from './VehicleAvailabilityCalendar';
import {VehicleDetailHeroCard} from './VehicleDetailHeroCard';

const TONE_MAP = {
  green: {bg: 'rgba(32,180,107,0.14)', color: '#20B46B'},
  blue: {bg: 'rgba(59,130,246,0.14)', color: '#3B82F6'},
  amber: {bg: 'rgba(245,158,11,0.16)', color: '#D97706'},
  purple: {bg: 'rgba(139,92,246,0.14)', color: '#7C3AED'},
};


function PanelHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.panelHeader}>
      {eyebrow ? <Text style={styles.panelEyebrow}>{eyebrow}</Text> : null}
      <View style={{flexDirection: 'row', justifyContent: 'space-between', gap: 8}}>
        <View style={{flex: 1, gap: 3}}>
          <Text style={styles.panelTitle}>{title}</Text>
          {subtitle ? <Text style={styles.panelSubtitle}>{subtitle}</Text> : null}
        </View>
        {action}
      </View>
    </View>
  );
}

export function VehicleDetail() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {
    vehicle,
    tabs,
    activeTab,
    featurePills,
    specs,
    activities,
    quickStats,
    purchaseSummary,
    maintenanceStats,
    maintenanceRows,
    rentalStats,
    rentalRows,
    documents,
    insurancePolicy,
    claims,
    serviceItems,
    activityFeed,
    calendarLegend,
    calendarMonthDate,
    calendarScheduleRows,
    isCalendarPickerVisible,
    isUploadModalVisible,
    uploadFileName,
    uploadCount,
    isUploadSubmitting,
    setActiveTab,
    onBackPress,
    onRentNowPress,
    onEditPress,
    onUploadDocumentPress,
    onCloseUploadModal,
    onPickUploadDocument,
    onConfirmUploadPress,
    onActivityPress,
    onPrevCalendarMonth,
    onNextCalendarMonth,
    onOpenCalendarPicker,
    onCloseCalendarPicker,
    onCalendarMonthChange,
  } = useVehicleDetailController();

  const imageSource = vehicle.imageUri
    ? {uri: vehicle.imageUri}
    : Images.fleetVehicle;

  const renderTabPanel = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <VehicleOverviewPanel
            specs={specs}
            featurePills={featurePills}
            activities={activities}
            quickStats={quickStats}
            purchaseSummary={purchaseSummary}
            onActivityPress={onActivityPress}
          />
        );

      case 'maintenance':
        return (
          <>
            <PanelHeader
              eyebrow="Service"
              title="Maintenance"
              subtitle="Service records for this vehicle"
            />
            <View style={styles.statGrid}>
              {maintenanceStats.map(stat => (
                <View key={stat.label} style={styles.compactStatCard}>
                  <View
                    style={[
                      styles.compactStatIcon,
                      {backgroundColor: TONE_MAP[stat.tone].bg},
                    ]}>
                    <Icon name={stat.icon} size={12} color={TONE_MAP[stat.tone].color} />
                  </View>
                  <Text style={styles.compactStatLabel} numberOfLines={1}>
                    {stat.label.toUpperCase()}
                  </Text>
                  <Text style={styles.compactStatValue} numberOfLines={1}>
                    {stat.value}
                  </Text>
                </View>
              ))}
            </View>
            <ScrollView
              style={styles.maintenanceScroll}
              contentContainerStyle={styles.maintenanceScrollContent}
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}>
              {maintenanceRows.map(row => (
                <View key={row.id} style={styles.maintenanceCard}>
                  <View style={styles.maintenanceCardTop}>
                    <View style={styles.maintenanceCardCopy}>
                      <Text style={styles.maintenanceType}>{row.type}</Text>
                      <Text style={styles.maintenanceDate}>{row.date}</Text>
                    </View>
                    <View style={styles.statusPill}>
                      <Text style={styles.statusPillText}>Completed</Text>
                    </View>
                  </View>
                  <View style={styles.maintenanceMetaRow}>
                    <View style={styles.maintenanceMetaItem}>
                      <Text style={styles.maintenanceMetaLabel}>Garage</Text>
                      <Text style={styles.maintenanceMetaValue} numberOfLines={1}>
                        {row.garage}
                      </Text>
                    </View>
                    <View style={styles.maintenanceMetaItem}>
                      <Text style={styles.maintenanceMetaLabel}>Odometer</Text>
                      <Text style={styles.maintenanceMetaValue} numberOfLines={1}>
                        {row.odometer}
                      </Text>
                    </View>
                    <View style={styles.maintenanceMetaItem}>
                      <Text style={styles.maintenanceMetaLabel}>Cost</Text>
                      <Text style={styles.maintenanceCost}>{row.cost}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </>
        );

      case 'rental-history':
        return (
          <>
            <PanelHeader
              eyebrow="Rentals"
              title="Rental History"
              subtitle="Everyone who has rented this vehicle"
            />
            <View style={styles.statGrid}>
              {rentalStats.map(stat => (
                <View key={stat.label} style={styles.compactStatCard}>
                  <View
                    style={[
                      styles.compactStatIcon,
                      {backgroundColor: TONE_MAP[stat.tone].bg},
                    ]}>
                    <Icon name={stat.icon} size={12} color={TONE_MAP[stat.tone].color} />
                  </View>
                  <Text style={styles.compactStatLabel} numberOfLines={1}>
                    {stat.label.toUpperCase()}
                  </Text>
                  <Text style={styles.compactStatValue} numberOfLines={1}>
                    {stat.value}
                  </Text>
                </View>
              ))}
            </View>
            <ScrollView
              style={styles.maintenanceScroll}
              contentContainerStyle={styles.maintenanceScrollContent}
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}>
              {rentalRows.map(row => (
                <View key={row.id} style={styles.rentalHistoryCard}>
                  <Text style={styles.rentalCustomer}>{row.customer}</Text>
                  <View style={styles.rentalHistoryMeta}>
                    <Text style={styles.rentalHistoryMetaText}>
                      {row.start} → {row.end}
                    </Text>
                    <Text style={styles.rentalDays}>{row.days} days</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </>
        );

      case 'documents':
        return (
          <>
            <PanelHeader
              eyebrow="Files"
              title="Documents"
              subtitle="Vehicle registration and related files"
            />
            {documents.map(doc => (
              <View key={doc.id} style={styles.docCard}>
                <Icon name="documentFile" size={16} />
                <View style={styles.docCopy}>
                  <Text style={styles.docTitle}>{doc.title}</Text>
                  <Text style={styles.docMeta}>{doc.meta}</Text>
                </View>
                <Icon name="download" size={12} />
              </View>
            ))}
          </>
        );

      case 'insurance':
        return (
          <>
            <View style={styles.insuranceCard}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.panelTitle}>{insurancePolicy.provider}</Text>
                <View style={styles.statusPill}>
                  <Text style={styles.statusPillText}>{insurancePolicy.status}</Text>
                </View>
              </View>
              <View style={styles.specGrid}>
                {insurancePolicy.fields.map(field => (
                  <View key={field.label} style={styles.specCell}>
                    <Text style={styles.specLabel}>{field.label}</Text>
                    <Text style={styles.specValue}>{field.value}</Text>
                  </View>
                ))}
              </View>
            </View>
            <Text style={styles.panelEyebrow}>Claim History</Text>
            {claims.map(claim => (
              <View key={claim.id} style={styles.claimCard}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text style={styles.serviceTitle}>{claim.title}</Text>
                  <View style={styles.statusPill}>
                    <Text style={styles.statusPillText}>{claim.status}</Text>
                  </View>
                </View>
                <Text style={styles.serviceCost}>{claim.amount}</Text>
              </View>
            ))}
          </>
        );

      case 'photos':
        return (
          <>
            <View style={styles.panelActions}>
              <Pressable style={styles.primaryChipBtn} onPress={onUploadDocumentPress}>
                <Icon name="addPlus" size={10} color={colors.white} />
                <Text style={styles.primaryChipText}>Upload</Text>
              </Pressable>
            </View>
            <Pressable style={styles.photoAdd} onPress={onUploadDocumentPress}>
              <Icon name="camera" size={20} color={colors.actionBlue} />
              <Text style={styles.photoAddText}>Add Photo</Text>
            </Pressable>
            {[1, 2, 3, 4].map(index => (
              <View key={index} style={styles.photoCard}>
                <Image source={imageSource} style={styles.image} resizeMode="contain" />
              </View>
            ))}
          </>
        );

      case 'service-history':
        return (
          <>
            <PanelHeader
              eyebrow="Workshop"
              title="Service History"
              subtitle="Past workshop and software services"
            />
            {serviceItems.map(item => (
              <View key={item.id} style={styles.serviceCard}>
                <View style={styles.serviceTop}>
                  <Text style={styles.serviceTitle}>{item.title}</Text>
                  <Text style={styles.serviceCost}>{item.cost}</Text>
                </View>
                <Text style={styles.activityTime}>{item.date}</Text>
                <Text style={styles.serviceDetails}>{item.details}</Text>
              </View>
            ))}
          </>
        );

      case 'activity':
        return activityFeed.map(item => {
          const tone = TONE_MAP[item.tone];
          return (
            <View key={item.id} style={styles.activityCard}>
              <View style={[styles.activityIconWrap, {backgroundColor: tone.bg}]}>
                <Icon name={item.icon} size={12} color={tone.color} />
              </View>
              <View style={styles.activityCopy}>
                <Text style={styles.activityTitle}>{item.title}</Text>
                <Text style={styles.activityTime}>{item.time}</Text>
              </View>
            </View>
          );
        });

      case 'calendar':
        return (
          <VehicleAvailabilityCalendar
            monthDate={calendarMonthDate}
            legend={calendarLegend}
            scheduleRows={calendarScheduleRows}
            isPickerVisible={isCalendarPickerVisible}
            onPrevMonth={onPrevCalendarMonth}
            onNextMonth={onNextCalendarMonth}
            onOpenPicker={onOpenCalendarPicker}
            onClosePicker={onCloseCalendarPicker}
            onMonthChange={onCalendarMonthChange}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Screen style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.main}>
          <View style={styles.titleRow}>
            <Pressable style={styles.backBtn} onPress={onBackPress} hitSlop={8}>
              <Icon name="arrowLeft" size={12} color={colors.white} />
            </Pressable>
            <Text style={styles.pageTitle}>Car Details</Text>
          </View>

          <VehicleDetailHeroCard
            status={vehicle.status ?? 'Available'}
            statusBg={vehicle.statusBg ?? 'rgba(32,180,107,0.14)'}
            statusColor={vehicle.statusColor ?? '#1E8E3E'}
            make={vehicle.make}
            year={vehicle.year}
            title={vehicle.title}
            description={vehicle.description}
            dailyRate={vehicle.dailyRate}
            rating={vehicle.rating}
            imageSource={imageSource}
            onRentNowPress={onRentNowPress}
            onEditPress={onEditPress}
          />

          <View style={styles.tabWrap}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabContent}>
              {tabs.map(tab => {
                const active = tab.id === activeTab;
                return (
                  <Pressable
                    key={tab.id}
                    style={[styles.tab, active && styles.tabActive]}
                    onPress={() => setActiveTab(tab.id as VehicleDetailTabId)}>
                    <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                      {tab.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {activeTab === 'overview' || activeTab === 'calendar' ? (
            renderTabPanel()
          ) : (
            <View style={styles.panel}>{renderTabPanel()}</View>
          )}
        </View>
      </ScrollView>

      <UploadDocumentModal
        visible={isUploadModalVisible}
        submitting={isUploadSubmitting}
        selectedFileName={uploadFileName}
        selectedCount={uploadCount}
        onClose={onCloseUploadModal}
        onPickPress={onPickUploadDocument}
        onUploadPress={onConfirmUploadPress}
      />
    </Screen>
  );
}
