import React from 'react';
import {
  Pressable,
  ScrollView,
  Switch,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {Icon, Screen} from '../../../components';
import {useThemedStyles, useThemeColors} from '../../../theme';
import {createStyles} from './styles';
import {useBackupRestoreController} from './useController';

export function BackupRestore() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {width} = useWindowDimensions();
  const {
    storageUsed,
    storageTotal,
    storagePercent,
    lastBackupTitle,
    lastBackupMeta,
    retentionTitle,
    retentionMeta,
    scheduleItems,
    history,
    onToggleSchedule,
    onRestorePress,
    onDownloadPress,
    onRunBackupPress,
    onBackPress,
  } = useBackupRestoreController();

  const horizontalPadding = width >= 768 ? 32 : 20;

  return (
    <Screen style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        <View style={[styles.main, {paddingHorizontal: horizontalPadding}]}>
          <View style={styles.pageHeader}>
            <View style={styles.titleRow}>
              <Pressable
                style={styles.backBtn}
                onPress={onBackPress}
                accessibilityLabel="Go back"
                hitSlop={8}>
                <Icon name="arrowLeft" size={14} color={colors.white} />
              </Pressable>
              <Text style={styles.pageTitle}>Settings</Text>
            </View>
            <Text style={styles.pageSubtitle}>
              Configure your account, workspace and preferences
            </Text>
          </View>

          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Icon name="settingsBackup" size={18} color={colors.white} />
            </View>
            <View style={styles.sectionCopy}>
              <Text style={styles.sectionTitle}>Backup & Restore</Text>
              <Text style={styles.sectionSubtitle}>
                Automatic snapshots, cloud sync and disaster recovery
              </Text>
            </View>
          </View>

          <View style={styles.actionsRow}>
            <Pressable style={styles.outlineBtn} onPress={onRestorePress}>
              <Icon name="uploadArrow" size={14} color={colors.textDark} />
              <Text style={styles.outlineBtnText}>Restore</Text>
            </Pressable>
            <Pressable style={styles.outlineBtn} onPress={onDownloadPress}>
              <Icon name="download" size={14} color={colors.textDark} />
              <Text style={styles.outlineBtnText}>Download Latest</Text>
            </Pressable>
            <Pressable style={styles.primaryBtn} onPress={onRunBackupPress}>
              <Icon name="settingsBackup" size={14} color={colors.white} />
              <Text style={styles.primaryBtnText}>Run Backup Now</Text>
            </Pressable>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardEyebrow}>Used</Text>
              <Text style={styles.cardTitle}>Storage</Text>
            </View>
            <View style={styles.storageRow}>
              <View style={styles.storageIcon}>
                <Icon name="settingsBackup" size={18} color={colors.actionBlue} />
              </View>
              <View style={styles.storageCopy}>
                <Text style={styles.bigValue}>{storageUsed}</Text>
                <Text style={styles.metaText}>
                  of {storageTotal} · {storagePercent}% used
                </Text>
              </View>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, {width: `${storagePercent}%`}]}
              />
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardEyebrow}>Snapshot</Text>
              <Text style={styles.cardTitle}>Last Backup</Text>
            </View>
            <Text style={styles.bigValue}>{lastBackupTitle}</Text>
            <Text style={styles.metaText}>{lastBackupMeta}</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardEyebrow}>Policy</Text>
              <Text style={styles.cardTitle}>Retention</Text>
            </View>
            <Text style={styles.bigValue}>{retentionTitle}</Text>
            <Text style={styles.metaText}>{retentionMeta}</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardEyebrow}>Automation</Text>
              <Text style={styles.cardTitle}>Backup Schedule</Text>
            </View>
            <View style={styles.scheduleList}>
              {scheduleItems.map(item => (
                <View key={item.id} style={styles.scheduleRow}>
                  <View style={styles.scheduleIcon}>
                    <Icon
                      name="settingsLanguages"
                      size={14}
                      color={colors.actionBlue}
                    />
                  </View>
                  <View style={styles.scheduleCopy}>
                    <Text style={styles.scheduleTitle}>{item.title}</Text>
                    <Text style={styles.scheduleSubtitle}>{item.subtitle}</Text>
                  </View>
                  <Switch
                    style={styles.toggle}
                    value={item.enabled}
                    onValueChange={value => onToggleSchedule(item.id, value)}
                    trackColor={{false: colors.track, true: colors.actionBlue}}
                    thumbColor={colors.white}
                    ios_backgroundColor={colors.track}
                  />
                </View>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardEyebrow}>Recent</Text>
              <Text style={styles.cardTitle}>Backup History</Text>
            </View>

            <View style={styles.historyHeader}>
              <Text style={[styles.historyCol, styles.historyColSize]}>
                Size
              </Text>
              <Text style={[styles.historyCol, styles.historyColType]}>
                Type
              </Text>
              <Text style={[styles.historyCol, styles.historyColStatus]}>
                Status
              </Text>
            </View>

            {history.map((row, index) => {
              const isLast = index === history.length - 1;
              const success = row.status === 'Success';
              return (
                <View
                  key={row.id}
                  style={[styles.historyRow, isLast && styles.historyRowLast]}>
                  <Text style={styles.historySize}>{row.size}</Text>
                  <Text style={styles.historyType}>{row.type}</Text>
                  <View style={styles.statusWrap}>
                    <View
                      style={[
                        styles.statusBadge,
                        success ? styles.statusSuccess : styles.statusFailed,
                      ]}>
                      <Text
                        style={[
                          styles.statusText,
                          success
                            ? styles.statusTextSuccess
                            : styles.statusTextFailed,
                        ]}>
                        {row.status}
                      </Text>
                    </View>
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
