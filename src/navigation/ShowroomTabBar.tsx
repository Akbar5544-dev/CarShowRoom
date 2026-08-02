import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Icon} from '../components';
import {IconName} from '../assets/iconXml';
import {type AppColors, useThemedStyles, useThemeColors} from '../theme';

export const TAB_BAR_HEIGHT = 72;
/** Gap between floating module bottom and FAB top. */
const MENU_FAB_GAP = 38;
/** How far FAB top sits above the dock top edge. */
const FAB_OVERHANG = 12;

const TAB_CONFIG: Record<string, {label: string; icon: IconName}> = {
  Home: {label: 'Home', icon: 'navHome'},
  Rentals: {label: 'Rentals', icon: 'navRentals'},
  Staff: {label: 'Staff', icon: 'navStaff'},
  Vehicles: {label: 'Vehicles', icon: 'navVehicles'},
};

const HIDDEN_TAB_ROUTES = new Set([
  'Settings',
  'MyProfile',
  'CompanyProfile',
  'Languages',
  'Notifications',
  'Security',
  'Theme',
  'BackupRestore',
  'RolesPermissions',
  'ManageRoles',
  'CreateRole',
  'ActivityLog',
  'RoleOverview',
  'EditRole',
  'JobsHiring',
  'OpenPositions',
  'PostJob',
  'InterviewSchedule',
  'LiveInterview',
  'ScheduleInterview',
  'RescheduleInterview',
  'Applications',
  'ReviewApplication',
  'JobsOnboarding',
  'HiringPipeline',
  'Accounting',
  'Invoices',
]);

const QUICK_ACTIONS: {
  id: string;
  label: string;
  icon: IconName;
}[] = [
  {id: 'roles', label: 'Roles', icon: 'settingsSecurity'},
  {id: 'job', label: 'Job', icon: 'briefcase'},
  {id: 'accounting', label: 'Accounting', icon: 'activityDollar'},
];

function useIsKeyboardVisible() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, () => setVisible(true));
    const hideSub = Keyboard.addListener(hideEvent, () => setVisible(false));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return visible;
}

export function ShowroomTabBar({state, navigation}: BottomTabBarProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();
  const keyboardVisible = useIsKeyboardVisible();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState('roles');
  const bottomPad = Math.max(insets.bottom, 10);
  const screenHeight = Dimensions.get('window').height;

  const focusedRoute = state.routes[state.index];
  const nestedRouteName =
    getFocusedRouteNameFromRoute(focusedRoute) ?? focusedRoute.name;

  // Hide tabs on Settings flow screens.
  if (HIDDEN_TAB_ROUTES.has(nestedRouteName)) {
    return null;
  }

  // Normal app flow: hide bottom tabs while typing so keypad has full space.
  if (keyboardVisible) {
    return null;
  }

  const closeMenu = () => setMenuOpen(false);

  const toggleMenu = () => {
    Keyboard.dismiss();
    setMenuOpen(prev => !prev);
  };

  const dockHeight = TAB_BAR_HEIGHT + 8 + bottomPad;
  const menuBottom = dockHeight + MENU_FAB_GAP - FAB_OVERHANG;

  return (
    <View style={styles.root} pointerEvents="box-none">
      {menuOpen ? (
        // height:0 anchor — overlay never stretches the tab-bar layout / safe-area.
        <View style={styles.overlayAnchor} pointerEvents="box-none">
          <Pressable
            style={[styles.backdrop, {height: screenHeight}]}
            onPress={closeMenu}
          />
          <View
            style={[styles.menuWrap, {bottom: menuBottom}]}
            pointerEvents="box-none">
            <View style={styles.menu}>
              {QUICK_ACTIONS.map(action => {
                const active = selectedAction === action.id;
                return (
                  <Pressable
                    key={action.id}
                    style={styles.menuItem}
                    onPress={() => {
                      setSelectedAction(action.id);
                      closeMenu();
                      if (action.id === 'roles') {
                        navigation.navigate('Home', {
                          screen: 'RolesPermissions',
                        });
                      }
                      if (action.id === 'job') {
                        navigation.navigate('Home', {
                          screen: 'JobsHiring',
                        });
                      }
                      if (action.id === 'accounting') {
                        navigation.navigate('Home', {
                          screen: 'Accounting',
                        });
                      }
                    }}>
                    <Icon
                      name={action.icon}
                      size={22}
                      color={active ? colors.actionBlue : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.menuLabel,
                        active && styles.menuLabelActive,
                      ]}>
                      {action.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      ) : null}

      <View
        style={[
          styles.dock,
          {
            paddingBottom: bottomPad,
            // Transparent while menu is open so dim overlay covers the strip under tabs.
            backgroundColor: menuOpen ? 'transparent' : colors.background,
          },
        ]}>
        <View style={styles.bar}>
          {state.routes.map((route, index) => {
            const focused = state.index === index;
            const config = TAB_CONFIG[route.name];
            if (!config) {
              return null;
            }

            const item = (
              <Pressable
                key={route.key}
                accessibilityRole="button"
                accessibilityState={focused ? {selected: true} : {}}
                onPress={() => {
                  Keyboard.dismiss();
                  closeMenu();
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                  });
                  if (!focused && !event.defaultPrevented) {
                    navigation.navigate(route.name);
                  }
                }}
                style={styles.tab}>
                <Icon name={config.icon} size={20} />
                <Text style={[styles.label, focused && styles.labelActive]}>
                  {config.label}
                </Text>
              </Pressable>
            );

            if (index === 1) {
              return (
                <React.Fragment key={route.key}>
                  {item}
                  <View style={styles.fabSpacer} />
                </React.Fragment>
              );
            }

            return item;
          })}

          <Pressable
            style={styles.fab}
            accessibilityLabel={
              menuOpen ? 'Close quick actions' : 'Open quick actions'
            }
            onPress={toggleMenu}>
            <View
              style={[styles.fabFill, {backgroundColor: colors.actionBlue}]}
            />
            <Icon
              name={menuOpen ? 'closeCross' : 'navAdd'}
              size={24}
              color={colors.white}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function createStyles(c: AppColors) {
  return StyleSheet.create({
  root: {
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  /** Zero-height host so menu/backdrop never grow the tab bar (no white strip). */
  overlayAnchor: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 0,
    zIndex: 20,
    overflow: 'visible',
  },
  backdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(11, 17, 31, 0.35)',
  },
  menuWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 21,
  },
  menu: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: c.surface,
    borderRadius: 22,
    paddingHorizontal: 10,
    paddingVertical: 12,
    gap: 4,
    shadowColor: '#0B152C',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 10,
    minWidth: 260,
  },
  menuItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  menuLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: c.textSecondary,
  },
  menuLabelActive: {
    color: c.actionBlue,
  },
  dock: {
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: 'transparent',
    zIndex: 30,
  },
  bar: {
    height: TAB_BAR_HEIGHT,
    backgroundColor: c.surface,
    borderRadius: 24,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#0B152C',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  fabSpacer: {
    width: 56,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: c.textSecondary,
  },
  labelActive: {
    color: c.secondary,
  },
  fab: {
    position: 'absolute',
    alignSelf: 'center',
    left: '50%',
    marginLeft: -28,
    top: -20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'transparent',
    zIndex: 40,
  },
  fabFill: {
    ...StyleSheet.absoluteFill,
  },
});
}
