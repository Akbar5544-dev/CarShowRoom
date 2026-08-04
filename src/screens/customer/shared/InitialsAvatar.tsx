import React, {memo} from 'react';
import {StyleSheet, Text, View, type ViewStyle} from 'react-native';
import {TONES, type ToneKey} from './tokens';

type Props = {
  initials: string;
  tone?: ToneKey;
  size?: number;
  radius?: number;
  style?: ViewStyle;
  online?: boolean;
};

export const InitialsAvatar = memo(function InitialsAvatar({
  initials,
  tone = 'aw',
  size = 46,
  radius,
  style,
  online,
}: Props) {
  const r = radius ?? size / 2;
  return (
    <View
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: r,
          backgroundColor: TONES[tone],
        },
        style,
      ]}>
      <Text style={[styles.text, {fontSize: Math.max(10, size * 0.28)}]}>
        {initials}
      </Text>
      {online ? <View style={styles.online} /> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '700',
    color: '#fff',
  },
  online: {
    position: 'absolute',
    right: 1,
    bottom: 1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#16a34a',
    borderWidth: 2,
    borderColor: '#fff',
  },
});
