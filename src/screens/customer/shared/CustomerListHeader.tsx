import React, {useMemo} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Icon} from '../../../components';
import {AVATAR_COLORS, C, type AvatarTone} from './tokens';

type HeaderProps = {
  search: string;
  onChangeSearch: (value: string) => void;
  placeholder: string;
  onProfilePress?: () => void;
  showActions?: boolean;
};

export function CustomerListHeader({
  search,
  onChangeSearch,
  placeholder,
  onProfilePress,
  showActions = true,
}: HeaderProps) {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.header}>
      <Pressable
        style={styles.avatar}
        accessibilityLabel="Profile"
        onPress={onProfilePress}>
        <Icon name="userOutline" size={18} color={C.primary} />
      </Pressable>
      <View style={styles.search}>
        <Icon name="search" size={14} color={C.muted} />
        <TextInput
          style={styles.input}
          value={search}
          onChangeText={onChangeSearch}
          placeholder={placeholder}
          placeholderTextColor={C.muted}
          returnKeyType="search"
        />
      </View>
      {showActions ? (
        <View style={styles.actions}>
          <Pressable
            style={styles.btn}
            accessibilityLabel="Notifications"
            onPress={() =>
              navigation.navigate('CustomerHomeTab', {
                screen: 'CustomerNotifications',
              })
            }>
            <Icon name="bell" size={16} color={C.muted} />
            <View style={styles.badge} />
          </Pressable>
          <Pressable
            style={styles.btn}
            accessibilityLabel="Messages"
            onPress={() =>
              navigation.navigate('CustomerHomeTab', {
                screen: 'CustomerMessages',
              })
            }>
            <Icon name="message" size={16} color={C.muted} />
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

type ChipsProps = {
  chips: readonly string[] | string[];
  active: string;
  onSelect: (chip: string) => void;
};

export function CustomerChips({chips, active, onSelect}: ChipsProps) {
  const {width} = useWindowDimensions();
  const chipStyles = useMemo(() => {
    const compact = width < 360;
    const padH = compact ? 10 : width < 400 ? 12 : 14;
    const padV = compact ? 5 : 6;
    const fontSize = compact ? 10 : width < 400 ? 11 : 12;
    const gap = compact ? 6 : 8;
    return {
      content: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap,
        paddingHorizontal: Math.max(12, Math.round(width * 0.035)),
        paddingVertical: compact ? 7 : 8,
      },
      chip: {
        flexShrink: 0,
        paddingHorizontal: padH,
        paddingVertical: padV,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: C.border,
        backgroundColor: C.white,
      },
      text: {
        fontSize,
        fontWeight: '500' as const,
        color: C.muted,
      },
    };
  }, [width]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      bounces={false}
      decelerationRate="fast"
      contentContainerStyle={chipStyles.content}
      style={styles.chipsScroll}>
      {chips.map(chip => {
        const on = chip === active;
        return (
          <Pressable
            key={chip}
            style={[chipStyles.chip, on && styles.chipOn]}
            onPress={() => onSelect(chip)}
            hitSlop={4}>
            <Text
              numberOfLines={1}
              style={[chipStyles.text, on && styles.chipTextOn]}>
              {chip}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

type AvatarProps = {
  initials: string;
  tone: AvatarTone | string;
  size?: number;
  radius?: number;
};

export function InitialsAvatar({
  initials,
  tone,
  size = 40,
  radius,
}: AvatarProps) {
  const bg =
    AVATAR_COLORS[tone as AvatarTone] ??
    (typeof tone === 'string' && tone.startsWith('#') ? tone : C.primary);
  const r = radius ?? size / 2;
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: r,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text style={{color: '#fff', fontWeight: '700', fontSize: size * 0.28}}>
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 10,
    backgroundColor: C.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.border,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  search: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 38,
  },
  input: {
    flex: 1,
    fontSize: 12,
    color: C.text,
    padding: 0,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  btn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  chipsScroll: {
    flexGrow: 0,
    flexShrink: 0,
    width: '100%',
    backgroundColor: C.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.border,
  },
  chipOn: {
    backgroundColor: C.primary,
    borderColor: C.primary,
  },
  chipTextOn: {
    color: C.white,
    fontWeight: '600',
  },
});
