import React from 'react';
import {Pressable, ScrollView, Text, useWindowDimensions, View} from 'react-native';
import {Icon, Screen} from '../../../components';
import {useThemedStyles, useThemeColors} from '../../../theme';
import {createStyles} from './styles';
import {useSettingsController} from './useController';

export function Settings() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {width} = useWindowDimensions();
  const {items, activeId, onBackPress, onItemPress} = useSettingsController();

  const horizontalPadding = width >= 768 ? 32 : 20;
  const iconSize = width < 360 ? 16 : 18;

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

          <View style={styles.card}>
            <View style={styles.list}>
              {items.map(item => {
                const active = item.id === activeId;
                return (
                  <Pressable
                    key={item.id}
                    style={[styles.item, active && styles.itemActive]}
                    onPress={() => onItemPress(item.id)}
                    accessibilityRole="button"
                    accessibilityState={{selected: active}}>
                    <Icon
                      name={item.icon}
                      size={iconSize}
                      color={active ? colors.white : colors.textDark}
                      style={styles.itemIcon}
                    />
                    <View style={styles.itemContent}>
                      <Text
                        style={[
                          styles.itemTitle,
                          active && styles.itemTitleActive,
                        ]}
                        numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text
                        style={[
                          styles.itemSubtitle,
                          active && styles.itemSubtitleActive,
                        ]}
                        numberOfLines={1}>
                        {item.subtitle}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
