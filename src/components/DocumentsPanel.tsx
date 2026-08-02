import React, {memo} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Icon} from './Icon';
import {ProfileActionHeader} from './ProfileActionHeader';
import {type AppColors, useThemedStyles, useThemeColors} from '../theme';

export type DocumentItem = {
  id: string;
  title: string;
  meta: string;
};

type DocumentsPanelProps = {
  totalLabel: string;
  items: DocumentItem[];
  searchValue: string;
  onSearchChange: (text: string) => void;
  onFilterPress?: () => void;
  onUploadPress?: () => void;
  onRemovePress?: (item: DocumentItem) => void;
  onDownloadPress?: (item: DocumentItem) => void;
};

export const DocumentsPanel = memo(function DocumentsPanel({
  totalLabel,
  items,
  searchValue,
  onSearchChange,
  onFilterPress,
  onUploadPress,
  onRemovePress,
  onDownloadPress,
}: DocumentsPanelProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.wrap}>
      <ProfileActionHeader
        eyebrow="Total documents"
        title={totalLabel}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        actionLabel="upload document"
        onActionPress={onUploadPress}
        onFilterPress={onFilterPress}
      />
      <View style={styles.list}>
        {items.map(item => (
          <View key={item.id} style={styles.card}>
            <Pressable
              onPress={() => onRemovePress?.(item)}
              hitSlop={8}
              style={styles.closeBtn}
              accessibilityLabel={`Remove ${item.title}`}>
              <Icon name="closeCross" size={18} />
            </Pressable>
            <View style={styles.row}>
              <View style={styles.left}>
                <View style={styles.iconWrap}>
                  <Icon name="documentFile" size={16} />
                </View>
                <View style={styles.copy}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.meta}>{item.meta}</Text>
                </View>
              </View>
              <Pressable
                onPress={() => onDownloadPress?.(item)}
                hitSlop={8}
                accessibilityLabel={`Download ${item.title}`}>
                <Icon name="download" size={20} />
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
});

function createStyles(c: AppColors) {
  return StyleSheet.create({
  wrap: {
    gap: 12,
  },
  list: {
    backgroundColor: '#F8FAFC',
    borderRadius: 22,
    paddingHorizontal: 10,
    paddingVertical: 16,
    gap: 11,
  },
  card: {
    backgroundColor: c.surface,
    borderRadius: 24,
    borderWidth: 0.75,
    borderColor: c.borderSoft,
    paddingTop: 10,
    paddingHorizontal: 13,
    paddingBottom: 13,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 22,
    backgroundColor: c.actionTint12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: c.textDark,
  },
  meta: {
    fontSize: 8,
    fontWeight: '600',
    color: c.textSoft,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
}
