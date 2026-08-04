import React, {memo} from 'react';
import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NavigationProp} from '@react-navigation/native';
import {Icon} from '../../../components';
import type {CustomerHomeStackParamList} from '../../../navigation/types';
import {C} from './tokens';

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  onProfilePress?: () => void;
  showBadge?: boolean;
};

export const CustomerChromeHeader = memo(function CustomerChromeHeader({
  search,
  onSearchChange,
  placeholder = 'Search...',
  onProfilePress,
  showBadge = true,
}: Props) {
  const navigation =
    useNavigation<NavigationProp<Record<string, object | undefined>>>();

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
          onChangeText={onSearchChange}
          placeholder={placeholder}
          placeholderTextColor={C.muted}
          returnKeyType="search"
        />
      </View>
      <View style={styles.actions}>
        <Pressable
          style={styles.btn}
          accessibilityLabel="Notifications"
          onPress={() => navigation.navigate('CustomerNotifications' as never)}>
          <Icon name="bell" size={16} color={C.muted} />
          {showBadge ? <View style={styles.badge} /> : null}
        </Pressable>
        <Pressable
          style={styles.btn}
          accessibilityLabel="Messages"
          onPress={() => navigation.navigate('CustomerMessages' as never)}>
          <Icon name="message" size={16} color={C.muted} />
        </Pressable>
      </View>
    </View>
  );
});

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
    backgroundColor: C.like,
    borderWidth: 1.5,
    borderColor: C.white,
  },
});
