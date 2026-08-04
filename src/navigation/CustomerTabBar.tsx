import React from 'react';
import {Keyboard, Pressable, StyleSheet, Text, View} from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Icon} from '../components';
import {IconName} from '../assets/iconXml';
import {type AppColors, useThemedStyles} from '../theme';

const FEED_PRIMARY = '#2563eb';
const FEED_MUTED = '#6b7280';
const FEED_BORDER = '#e5e7eb';

const TAB_CONFIG: Record<string, {label: string; icon: IconName}> = {
  CustomerHomeTab: {label: 'Home', icon: 'navHome'},
  CustomerShowroomsTab: {label: 'Showroom', icon: 'navShowroom'},
  CustomerMechanicsTab: {label: 'Mechanics', icon: 'activityWrench'},
  CustomerAuctionTab: {label: 'Auction', icon: 'gavel'},
  CustomerJobsTab: {label: 'Jobs', icon: 'navJobs'},
};

export function CustomerTabBar({state, navigation}: BottomTabBarProps) {
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, {paddingBottom: Math.max(insets.bottom, 10)}]}>
      {state.routes.map((route, index) => {
        const config = TAB_CONFIG[route.name];
        if (!config) {
          return null;
        }
        const focused = state.index === index;

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={focused ? {selected: true} : {}}
            style={styles.tab}
            onPress={() => {
              Keyboard.dismiss();
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }}>
            <Icon
              name={config.icon}
              size={22}
              color={focused ? FEED_PRIMARY : FEED_MUTED}
            />
            <Text style={[styles.label, focused && styles.labelActive]}>
              {config.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function createStyles(_c: AppColors) {
  return StyleSheet.create({
    bar: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: '#fff',
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: FEED_BORDER,
      paddingTop: 10,
      paddingHorizontal: 4,
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
    },
    label: {
      fontSize: 10,
      fontWeight: '500',
      color: FEED_MUTED,
    },
    labelActive: {
      color: FEED_PRIMARY,
      fontWeight: '600',
    },
  });
}
