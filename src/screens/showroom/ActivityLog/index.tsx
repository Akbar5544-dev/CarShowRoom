import React from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {Icon, Screen, ScreenLoader} from '../../../components';
import {useThemedStyles, useThemeColors} from '../../../theme';
import {createStyles} from './styles';
import {useActivityLogController} from './useController';

export function ActivityLog() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {summary, items, isLoading, onBackPress} = useActivityLogController();

  return (
    <Screen style={styles.container}>
      <ScreenLoader visible={isLoading} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.main}>
          <View style={styles.pageHeader}>
            <View style={styles.titleLeft}>
              <Pressable
                style={styles.backBtn}
                onPress={onBackPress}
                accessibilityLabel="Go back"
                hitSlop={8}>
                <Icon name="arrowLeft" size={14} color={colors.white} />
              </Pressable>
              <View style={styles.titleBlock}>
                <Text style={styles.pageTitle} numberOfLines={1}>
                  Activity Log
                </Text>
                <Text style={styles.pageSubtitle} numberOfLines={1}>
                  {summary}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            {items.length === 0 && !isLoading ? (
              <Text style={styles.emptyText}>No activity recorded yet</Text>
            ) : (
              items.map(item => (
                <View key={item.id} style={styles.item}>
                  <View style={styles.itemLeft}>
                    <Text style={styles.userName}>{item.userName}</Text>
                    <Text style={styles.action}>{item.action}</Text>
                  </View>
                  <View style={styles.itemRight}>
                    <Text style={styles.timeAgo}>{item.timeAgo}</Text>
                    <Text style={styles.ip}>{item.ip}</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
