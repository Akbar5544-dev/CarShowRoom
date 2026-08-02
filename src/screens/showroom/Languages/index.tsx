import React from 'react';
import {Pressable, ScrollView, Text, useWindowDimensions, View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {iconXml} from '../../../assets/iconXml';
import {Icon, Screen} from '../../../components';
import {useThemedStyles, useThemeColors} from '../../../theme';
import {createStyles} from './styles';
import {useLanguagesController} from './useController';
import type {IconName} from '../../../assets/iconXml';

function FlagIcon({name}: {name: IconName}) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.flagWrap}>
      <SvgXml xml={iconXml[name]} width={22} height={16} />
    </View>
  );
}

export function Languages() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {width} = useWindowDimensions();
  const {
    options,
    selectedId,
    onSelect,
    onBackPress,
  } = useLanguagesController();

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
              <Icon name="settingsLanguages" size={18} color={colors.white} />
            </View>
            <View style={styles.sectionCopy}>
              <Text style={styles.sectionTitle}>Language & Region</Text>
              <Text style={styles.sectionSubtitle}>
                Interface language, date and number formats
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardEyebrow}>Choose one</Text>
              <Text style={styles.cardTitle}>Interface Language</Text>
            </View>

            <View style={styles.grid}>
              {options.map(option => {
                const selected = option.id === selectedId;
                return (
                  <Pressable
                    key={option.id}
                    style={[styles.option, selected && styles.optionSelected]}
                    onPress={() => onSelect(option.id)}
                    accessibilityRole="button"
                    accessibilityState={{selected}}>
                    <FlagIcon name={option.flag} />
                    <View style={styles.optionCopy}>
                      <Text style={styles.optionLabel} numberOfLines={1}>
                        {option.label}
                      </Text>
                      <Text style={styles.optionRegion} numberOfLines={1}>
                        {option.region}
                      </Text>
                    </View>
                    {selected ? (
                      <View style={styles.checkWrap}>
                        <Icon name="langCheck" size={18} />
                      </View>
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
