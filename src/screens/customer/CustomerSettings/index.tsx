import React from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {Icon, Screen} from '../../../components';
import type {IconName} from '../../../assets/iconXml';
import {useThemedStyles} from '../../../theme';
import {
  FEED_PRIMARY,
  createStyles,
  type LanguageOptionId,
  type ThemeOptionId,
} from './styles';
import {useCustomerSettingsController} from './useController';

type OptionRowProps = {
  icon: IconName;
  title: string;
  subtitle: string;
  selected: boolean;
  last?: boolean;
  onPress: () => void;
};

function OptionRow({
  icon,
  title,
  subtitle,
  selected,
  last,
  onPress,
}: OptionRowProps) {
  const styles = useThemedStyles(createStyles);
  return (
    <Pressable
      style={[styles.option, last && styles.optionLast]}
      onPress={onPress}>
      <View style={[styles.icoWrap, selected && styles.icoWrapOn]}>
        <Icon
          name={icon}
          size={18}
          color={selected ? FEED_PRIMARY : '#4b5563'}
        />
      </View>
      <View style={styles.optionText}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionSubtitle}>{subtitle}</Text>
      </View>
      <View style={[styles.check, selected && styles.checkOn]}>
        {selected ? <Icon name="checkWhite" size={12} color="#fff" /> : null}
      </View>
    </Pressable>
  );
}

const THEMES: Array<{
  id: ThemeOptionId;
  title: string;
  subtitle: string;
  icon: IconName;
}> = [
  {
    id: 'light',
    title: 'Light',
    subtitle: 'Bright & clean look',
    icon: 'sun',
  },
  {
    id: 'dark',
    title: 'Dark',
    subtitle: 'Easy on the eyes',
    icon: 'moon',
  },
  {
    id: 'system',
    title: 'System',
    subtitle: 'Match device setting',
    icon: 'settingsGear',
  },
];

const LANGUAGES: Array<{
  id: LanguageOptionId;
  title: string;
  subtitle: string;
}> = [
  {id: 'en', title: 'English', subtitle: 'Default language'},
  {id: 'ur', title: 'اردو', subtitle: 'Urdu'},
  {id: 'ar', title: 'العربية', subtitle: 'Arabic'},
];

export function CustomerSettings() {
  const styles = useThemedStyles(createStyles);
  const {
    theme,
    language,
    notifications,
    onBack,
    onSelectTheme,
    onSelectLanguage,
    onToggleNotifications,
  } = useCustomerSettingsController();

  return (
    <Screen style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.topbar}>
        <Pressable
          style={styles.backBtn}
          accessibilityLabel="Back"
          onPress={onBack}>
          <Icon name="chevronLeft" size={16} color="#111827" />
        </Pressable>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Theme</Text>
          <View style={styles.card}>
            {THEMES.map((item, index) => (
              <OptionRow
                key={item.id}
                icon={item.icon}
                title={item.title}
                subtitle={item.subtitle}
                selected={theme === item.id}
                last={index === THEMES.length - 1}
                onPress={() => onSelectTheme(item.id)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Language</Text>
          <View style={styles.card}>
            {LANGUAGES.map((item, index) => (
              <OptionRow
                key={item.id}
                icon="globe"
                title={item.title}
                subtitle={item.subtitle}
                selected={language === item.id}
                last={index === LANGUAGES.length - 1}
                onPress={() => onSelectLanguage(item.id)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Preferences</Text>
          <View style={styles.card}>
            <View style={[styles.option, styles.optionLast]}>
              <View
                style={[styles.icoWrap, notifications && styles.icoWrapOn]}>
                <Icon
                  name="bell"
                  size={18}
                  color={notifications ? FEED_PRIMARY : '#4b5563'}
                />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Notifications</Text>
                <Text style={styles.optionSubtitle}>Alerts & updates</Text>
              </View>
              <Pressable
                accessibilityRole="switch"
                accessibilityState={{checked: notifications}}
                style={[
                  styles.toggleTrack,
                  notifications && styles.toggleTrackOn,
                ]}
                onPress={onToggleNotifications}>
                <View
                  style={[
                    styles.toggleThumb,
                    notifications
                      ? styles.toggleThumbOn
                      : styles.toggleThumbOff,
                  ]}
                />
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
