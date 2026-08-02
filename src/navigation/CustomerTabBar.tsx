import React from 'react';
import {Keyboard, Pressable, StyleSheet, Text, View} from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Icon} from '../components';
import {IconName} from '../assets/iconXml';
import {type AppColors, useThemedStyles, useThemeColors} from '../theme';

const TAB_CONFIG: Record<string, {label: string; icon: IconName}> = {
  CustomerHomeTab: {label: 'Home', icon: 'navHome'},
  CustomerVehiclesTab: {label: 'Vehicles', icon: 'navVehicles'},
  CustomerShowroomsTab: {label: 'Showroom', icon: 'navShowroom'},
  CustomerChatTab: {label: 'Chat', icon: 'navChat'},
  CustomerJobsTab: {label: 'Jobs', icon: 'navJobs'},
};

export function CustomerTabBar({state, navigation}: BottomTabBarProps) {
  const colors = useThemeColors();
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
              color={focused ? colors.actionBlue : colors.textSecondary}
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

function createStyles(c: AppColors) {
  return StyleSheet.create({
    bar: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: c.surface,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: c.border,
      paddingTop: 10,
      paddingHorizontal: 6,
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
    },
    label: {
      fontSize: 11,
      fontWeight: '600',
      color: c.textSecondary,
    },
    labelActive: {
      color: c.actionBlue,
      fontWeight: '700',
    },
  });
}
