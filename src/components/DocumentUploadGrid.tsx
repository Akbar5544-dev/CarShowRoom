import React, {memo} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Icon} from './Icon';
import {type AppColors, useThemedStyles, useThemeColors} from '../theme';

export type DocumentUploadItem = {
  id: string;
  title: string;
  fileName?: string | null;
  count?: number;
};

type DocumentUploadCardProps = {
  item: DocumentUploadItem;
  onPress?: (item: DocumentUploadItem) => void;
};

export const DocumentUploadCard = memo(function DocumentUploadCard({
  item,
  onPress,
}: DocumentUploadCardProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const selected = Boolean(item.fileName) || (item.count ?? 0) > 0;
  return (
    <Pressable
      style={[styles.card, selected && styles.cardSelected]}
      onPress={() => onPress?.(item)}
      accessibilityRole="button"
      accessibilityLabel={`Upload ${item.title}`}>
      <View style={styles.iconWrap}>
        <Icon
          name={selected ? 'activityCheck' : 'uploadDoc'}
          size={15}
          color={colors.actionBlue}
        />
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.hint} numberOfLines={2}>
        {selected
          ? item.fileName ??
            `${item.count} photo${item.count === 1 ? '' : 's'} selected`
          : 'Tap to add photos · multi-select'}
      </Text>
    </Pressable>
  );
});

type DocumentUploadGridProps = {
  items: DocumentUploadItem[];
  onPress?: (item: DocumentUploadItem) => void;
};

export const DocumentUploadGrid = memo(function DocumentUploadGrid({
  items,
  onPress,
}: DocumentUploadGridProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.grid}>
      {items.map(item => (
        <View key={item.id} style={styles.cell}>
          <DocumentUploadCard item={item} onPress={onPress} />
        </View>
      ))}
    </View>
  );
});

function createStyles(c: AppColors) {
  return StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
    width: '100%',
  },
  cell: {
    width: '48%',
  },
  card: {
    minHeight: 110,
    borderRadius: 15,
    borderWidth: 1.2,
    borderStyle: 'dashed',
    borderColor: c.actionBlue,
    backgroundColor: c.actionSoftFill,
    paddingHorizontal: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  cardSelected: {
    borderStyle: 'solid',
    backgroundColor: c.actionTint12,
  },
  iconWrap: {
    width: 21,
    height: 21,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    color: c.textDark,
    textAlign: 'center',
    lineHeight: 14,
  },
  hint: {
    fontSize: 7,
    fontWeight: '600',
    color: c.textSoft,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    textAlign: 'center',
    lineHeight: 10,
  },
});
}
