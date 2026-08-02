import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {AppHeader, Screen} from '../../components';
import {colors, typography} from '../../theme';

type PlaceholderScreenProps = {
  title: string;
  subtitle?: string;
  showMainHeader?: boolean;
};

export function PlaceholderScreen({
  title,
  subtitle = 'Coming soon',
  showMainHeader = false,
}: PlaceholderScreenProps) {
  return (
    <Screen style={styles.container}>
      {showMainHeader ? (
        <View style={styles.headerWrap}>
          <AppHeader dateLabel="Mon, Jul 13" userName="Ali" />
        </View>
      ) : null}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerWrap: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    ...typography.h2,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 8,
  },
});
