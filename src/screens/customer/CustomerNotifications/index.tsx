import React, {useCallback, useMemo, useState} from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Icon, Screen} from '../../../components';
import type {AppColors} from '../../../theme';
import {useThemedStyles} from '../../../theme';
import {
  FEED_BG,
  FEED_BORDER,
  FEED_MUTED,
  FEED_PRIMARY,
  NOTIFICATIONS,
  NOTIF_CHIPS,
  type NotificationItem,
  type NotifChip,
} from './module';

export function CustomerNotifications() {
  const styles = useThemedStyles(createStyles);
  const navigation = useNavigation();
  const [chip, setChip] = useState<NotifChip>('All');
  const [items, setItems] = useState(NOTIFICATIONS);

  const filtered = useMemo(() => {
    return items.filter(item => {
      if (chip === 'Unread') {
        return item.unread;
      }
      if (chip === 'Likes') {
        return item.category === 'Likes';
      }
      if (chip === 'Messages') {
        return item.category === 'Messages';
      }
      if (chip === 'Jobs') {
        return item.category === 'Jobs';
      }
      return true;
    });
  }, [chip, items]);

  const onMarkAllRead = useCallback(() => {
    setItems(prev => prev.map(item => ({...item, unread: false})));
  }, []);

  const onPressItem = useCallback((item: NotificationItem) => {
    setItems(prev =>
      prev.map(row => (row.id === item.id ? {...row, unread: false} : row)),
    );
  }, []);

  return (
    <Screen style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.topbar}>
        <Pressable
          style={styles.backBtn}
          accessibilityLabel="Back"
          onPress={() => navigation.goBack()}>
          <Icon name="chevronLeft" size={16} color="#111827" />
        </Pressable>
        <Text style={styles.title}>Notifications</Text>
        <Pressable onPress={onMarkAllRead} hitSlop={8}>
          <Text style={styles.markAll}>Mark all read</Text>
        </Pressable>
      </View>

      <View style={styles.filtersRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContent}>
          {NOTIF_CHIPS.map(item => {
            const on = chip === item;
            return (
              <Pressable
                key={item}
                style={[styles.fchip, on && styles.fchipOn]}
                onPress={() => setChip(item)}>
                <Text style={[styles.fchipText, on && styles.fchipTextOn]}>
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No notifications</Text>
          </View>
        }
        renderItem={({item}) => (
          <>
            <Pressable
              style={[styles.item, item.unread && styles.itemUnread]}
              onPress={() => onPressItem(item)}>
              <View
                style={[styles.iconWrap, {backgroundColor: item.iconBg}]}>
                <Icon name={item.icon} size={18} color={item.iconColor} />
              </View>
              <View style={styles.body}>
                <Text style={styles.bodyText}>
                  {item.parts.map((part, index) => (
                    <Text
                      key={`${item.id}-${index}`}
                      style={part.bold ? styles.bold : undefined}>
                      {part.text}
                    </Text>
                  ))}
                </Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
              {item.unread ? <View style={styles.dot} /> : null}
            </Pressable>
            {item.gapAfter ? <View style={styles.gap} /> : null}
          </>
        )}
      />
    </Screen>
  );
}

function createStyles(_c: AppColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    topbar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 14,
      paddingTop: 8,
      paddingBottom: 12,
      backgroundColor: '#fff',
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: FEED_BORDER,
    },
    backBtn: {
      width: 34,
      height: 34,
      borderRadius: 17,
      borderWidth: 1,
      borderColor: FEED_BORDER,
      backgroundColor: FEED_BG,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      flex: 1,
      fontSize: 16,
      fontWeight: '700',
      color: '#111827',
    },
    markAll: {
      fontSize: 12,
      fontWeight: '600',
      color: FEED_PRIMARY,
    },
    filtersRow: {
      backgroundColor: '#fff',
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: FEED_BORDER,
      paddingVertical: 8,
    },
    chipsContent: {
      flexDirection: 'row',
      gap: 7,
      paddingHorizontal: 14,
    },
    fchip: {
      paddingHorizontal: 13,
      paddingVertical: 6,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: FEED_BORDER,
      backgroundColor: '#fff',
    },
    fchipOn: {
      backgroundColor: FEED_PRIMARY,
      borderColor: FEED_PRIMARY,
    },
    fchipText: {
      fontSize: 11,
      fontWeight: '500',
      color: FEED_MUTED,
    },
    fchipTextOn: {
      color: '#fff',
    },
    listContent: {
      paddingBottom: 24,
      flexGrow: 1,
    },
    item: {
      flexDirection: 'row',
      gap: 11,
      paddingHorizontal: 14,
      paddingVertical: 12,
      backgroundColor: '#fff',
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: FEED_BORDER,
      alignItems: 'flex-start',
    },
    itemUnread: {
      backgroundColor: '#f0f7ff',
    },
    iconWrap: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    body: {
      flex: 1,
      minWidth: 0,
    },
    bodyText: {
      fontSize: 12,
      lineHeight: 17,
      color: '#374151',
    },
    bold: {
      color: '#111827',
      fontWeight: '700',
    },
    time: {
      fontSize: 10,
      color: FEED_MUTED,
      marginTop: 3,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: FEED_PRIMARY,
      marginTop: 6,
    },
    gap: {
      height: 8,
      backgroundColor: FEED_BG,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: FEED_BORDER,
    },
    empty: {
      paddingTop: 48,
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 14,
      fontWeight: '600',
      color: FEED_MUTED,
    },
  });
}
