import React from 'react';
import {Pressable, ScrollView, Text, useWindowDimensions, View} from 'react-native';
import {Icon, Screen} from '../../../components';
import {useThemedStyles, useThemeColors} from '../../../theme';
import {createStyles} from './styles';
import {useThemeController} from './useController';

export function Theme() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {width} = useWindowDimensions();
  const {
    modes,
    accents,
    selectedModeId,
    selectedAccentId,
    onSelectMode,
    onSelectAccent,
    onApplyPress,
    onBackPress,
  } = useThemeController();

  const horizontalPadding = width >= 768 ? 32 : 20;
  const swatchSize = width < 360 ? 34 : 40;

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
              <Icon name="settingsTheme" size={18} color={colors.white} />
            </View>
            <View style={styles.sectionCopy}>
              <Text style={styles.sectionTitle}>Appearance</Text>
              <Text style={styles.sectionSubtitle}>
                Personalize colors, mode and density
              </Text>
            </View>
            <Pressable style={styles.applyBtn} onPress={onApplyPress}>
              <Text style={styles.applyBtnText}>Apply</Text>
            </Pressable>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Theme Mode</Text>
            <View style={styles.modeRow}>
              {modes.map(mode => {
                const selected = mode.id === selectedModeId;
                return (
                  <Pressable
                    key={mode.id}
                    style={[styles.modeCard, selected && styles.modeCardSelected]}
                    onPress={() => onSelectMode(mode.id)}
                    accessibilityRole="button"
                    accessibilityState={{selected}}>
                    <View style={styles.modePreviewWrap}>
                      <View
                        style={[
                          styles.modePreview,
                          {backgroundColor: mode.preview},
                        ]}
                      />
                      {selected ? (
                        <View style={styles.modeCheck}>
                          <Icon name="langCheck" size={18} />
                        </View>
                      ) : null}
                    </View>
                    <Text style={styles.modeLabel}>{mode.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Accent Color</Text>
            <View style={styles.accentRow}>
              {accents.map(accent => {
                const selected = accent.id === selectedAccentId;
                return (
                  <Pressable
                    key={accent.id}
                    onPress={() => onSelectAccent(accent.id)}
                    style={[
                      styles.accentSwatch,
                      {
                        width: swatchSize,
                        height: swatchSize,
                        borderRadius: swatchSize / 2,
                        backgroundColor: accent.color,
                      },
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{selected}}
                    accessibilityLabel={`${accent.id} accent`}>
                    {selected ? (
                      <Text style={styles.accentCheckMark}>✓</Text>
                    ) : null}
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
