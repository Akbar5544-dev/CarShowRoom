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
import {useNotificationsController} from './useController';

export function Notifications() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {width} = useWindowDimensions();
  const {
    sections,
    onToggle,
    onBackPress,
    onSavePress,
  } = useNotificationsController();

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
              <Icon
                name="settingsNotifications"
                size={18}
                color={colors.white}
              />
            </View>
            <View style={styles.sectionCopy}>
              <Text style={styles.sectionTitle}>Notifications</Text>
              <Text style={styles.sectionSubtitle}>
                Email, SMS and push alert preferences
              </Text>
            </View>
            <Pressable style={styles.saveBtn} onPress={onSavePress}>
              <Text style={styles.saveBtnText}>Save</Text>
            </Pressable>
          </View>

          {sections.map(section => (
            <View key={section.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardEyebrow}>Channels</Text>
                <Text style={styles.cardTitle}>{section.title}</Text>
              </View>

              <View style={styles.columnHeader}>
                <Text style={styles.eventColHeader}>Event</Text>
                <Text style={styles.toggleColHeader}>Email</Text>
                <Text style={styles.toggleColHeader}>SMS</Text>
              </View>

              {section.events.map((event, index) => {
                const isLast = index === section.events.length - 1;
                return (
                  <View
                    key={event.id}
                    style={[styles.row, isLast && styles.rowLast]}>
                    <View style={styles.eventCopy}>
                      <Text style={styles.eventTitle}>{event.title}</Text>
                      <Text style={styles.eventSubtitle}>{event.subtitle}</Text>
                    </View>
                    <View style={styles.toggleCol}>
                      <Switch
                        style={styles.toggle}
                        value={event.email}
                        onValueChange={value =>
                          onToggle(section.id, event.id, 'email', value)
                        }
                        trackColor={{
                          false: colors.track,
                          true: colors.actionBlue,
                        }}
                        thumbColor={colors.white}
                        ios_backgroundColor={colors.track}
                      />
                    </View>
                    <View style={styles.toggleCol}>
                      <Switch
                        style={styles.toggle}
                        value={event.sms}
                        onValueChange={value =>
                          onToggle(section.id, event.id, 'sms', value)
                        }
                        trackColor={{
                          false: colors.track,
                          true: colors.actionBlue,
                        }}
                        thumbColor={colors.white}
                        ios_backgroundColor={colors.track}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}
