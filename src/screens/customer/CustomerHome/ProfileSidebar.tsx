import React, {memo, useEffect, useMemo, useRef, useState} from 'react';
import {
  Animated,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Svg, {Defs, LinearGradient, Rect, Stop} from 'react-native-svg';
import {Icon} from '../../../components';
import type {IconName} from '../../../assets/iconXml';
import {FEED_BORDER, FEED_PRIMARY, type SidebarItemId} from './module';

type NavItem = {
  id: Exclude<SidebarItemId, 'logout'>;
  label: string;
  icon: IconName;
};

const NAV_ITEMS: NavItem[] = [
  {id: 'profile', label: 'Profile', icon: 'userOutline'},
  {id: 'settings', label: 'Settings', icon: 'settingsGear'},
  {id: 'saved', label: 'Saved', icon: 'bookmark'},
  {id: 'liked', label: 'Liked', icon: 'heart'},
  {id: 'shared', label: 'Shared', icon: 'shareUpload'},
];

type ProfileSidebarProps = {
  visible: boolean;
  userName: string;
  userEmail: string;
  avatarUri?: string | null;
  activeItem?: Exclude<SidebarItemId, 'logout'>;
  onClose: () => void;
  onItemPress: (id: SidebarItemId) => void;
};

export const ProfileSidebar = memo(function ProfileSidebar({
  visible,
  userName,
  userEmail,
  avatarUri,
  activeItem = 'profile',
  onClose,
  onItemPress,
}: ProfileSidebarProps) {
  const insets = useSafeAreaInsets();
  const {width} = useWindowDimensions();
  const drawerWidth = Math.min(300, Math.round(width * 0.78));
  const translateX = useRef(new Animated.Value(-drawerWidth)).current;
  const scrimOpacity = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(visible);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      translateX.setValue(-drawerWidth);
      scrimOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(scrimOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration: 260,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    if (!mounted) {
      return;
    }

    Animated.parallel([
      Animated.timing(scrimOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: -drawerWidth,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(({finished}) => {
      if (finished) {
        setMounted(false);
      }
    });
  }, [drawerWidth, mounted, scrimOpacity, translateX, visible]);

  const initials = useMemo(() => {
    const parts = userName.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) {
      return 'U';
    }
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
  }, [userName]);

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent>
      <View style={styles.root}>
        <Animated.View style={[styles.scrim, {opacity: scrimOpacity}]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        <Animated.View
          style={[
            styles.sidebar,
            {
              width: drawerWidth,
              paddingTop: Math.max(insets.top, 12),
              transform: [{translateX}],
            },
          ]}>
          <View style={styles.head}>
            <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
              <Defs>
                <LinearGradient
                  id="sidebarHeadGrad"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1">
                  <Stop offset="0" stopColor="#0f172a" stopOpacity="0.92" />
                  <Stop offset="1" stopColor="#1e3a8a" stopOpacity="0.95" />
                </LinearGradient>
              </Defs>
              <Rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                fill="url(#sidebarHeadGrad)"
              />
            </Svg>

            <View style={styles.headContent}>
              <View style={styles.avatar}>
                {avatarUri ? (
                  <Image source={{uri: avatarUri}} style={styles.avatarImage} />
                ) : (
                  <Text style={styles.avatarInitials}>{initials}</Text>
                )}
              </View>
              <Text style={styles.name} numberOfLines={1}>
                {userName}
              </Text>
              <Text style={styles.email} numberOfLines={1}>
                {userEmail}
              </Text>
            </View>
          </View>

          <ScrollView
            style={styles.nav}
            contentContainerStyle={styles.navContent}
            showsVerticalScrollIndicator={false}>
            {NAV_ITEMS.map(item => {
              const on = activeItem === item.id;
              return (
                <Pressable
                  key={item.id}
                  style={[styles.item, on && styles.itemOn]}
                  onPress={() => onItemPress(item.id)}>
                  <View style={[styles.icoWrap, on && styles.icoWrapOn]}>
                    <Icon
                      name={item.icon}
                      size={18}
                      color={on ? FEED_PRIMARY : '#4b5563'}
                    />
                  </View>
                  <Text style={[styles.itemLabel, on && styles.itemLabelOn]}>
                    {item.label}
                  </Text>
                  <Icon
                    name="chevronRight"
                    size={16}
                    color={on ? FEED_PRIMARY : '#9ca3af'}
                    style={styles.chev}
                  />
                </Pressable>
              );
            })}
          </ScrollView>

          <View
            style={[
              styles.foot,
              {paddingBottom: Math.max(insets.bottom, 28)},
            ]}>
            <Pressable
              style={styles.item}
              onPress={() => onItemPress('logout')}>
              <View style={styles.logoutIcoWrap}>
                <Icon name="logout" size={18} color="#dc2626" />
              </View>
              <Text style={styles.logoutLabel}>Log out</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 8, height: 0},
    shadowOpacity: 0.18,
    shadowRadius: 32,
    elevation: 16,
  },
  head: {
    minHeight: 148,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  headContent: {
    paddingHorizontal: 18,
    paddingBottom: 18,
    paddingTop: 20,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarInitials: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  email: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  nav: {
    flex: 1,
  },
  navContent: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    gap: 2,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
  },
  itemOn: {
    backgroundColor: '#eff6ff',
  },
  icoWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icoWrapOn: {
    backgroundColor: '#dbeafe',
  },
  itemLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  itemLabelOn: {
    color: FEED_PRIMARY,
  },
  chev: {
    marginLeft: 'auto',
  },
  foot: {
    paddingHorizontal: 14,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: FEED_BORDER,
  },
  logoutIcoWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#dc2626',
  },
});
