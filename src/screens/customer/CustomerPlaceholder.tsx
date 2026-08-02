import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Icon, Screen} from '../../components';
import type {IconName} from '../../assets/iconXml';
import {type AppColors, useThemedStyles, useThemeColors} from '../../theme';

type CustomerPlaceholderProps = {
  title: string;
  subtitle: string;
  icon: IconName;
};

/** Shared shell for customer tabs whose designs are not built yet. */
export function CustomerPlaceholder({
  title,
  subtitle,
  icon,
}: CustomerPlaceholderProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  return (
    <Screen style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Icon name={icon} size={26} color={colors.actionBlue} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </Screen>
  );
}

function createStyles(c: AppColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
      gap: 10,
    },
    iconWrap: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: c.actionTint1,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 6,
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: c.textDark,
    },
    subtitle: {
      fontSize: 13,
      lineHeight: 19,
      color: c.textSoft,
      textAlign: 'center',
    },
  });
}
