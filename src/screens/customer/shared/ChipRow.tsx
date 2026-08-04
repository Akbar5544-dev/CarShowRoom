import React, {memo, useMemo} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {C} from './tokens';

type Props = {
  chips: string[];
  active: string;
  onChange: (chip: string) => void;
};

export const ChipRow = memo(function ChipRow({chips, active, onChange}: Props) {
  const {width} = useWindowDimensions();
  const compact = width < 360;
  const dynamic = useMemo(
    () => ({
      content: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: compact ? 6 : 8,
        paddingHorizontal: Math.max(12, Math.round(width * 0.035)),
      },
      chip: {
        flexShrink: 0,
        paddingHorizontal: compact ? 10 : width < 400 ? 12 : 14,
        paddingVertical: compact ? 5 : 6,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: C.border,
        backgroundColor: C.white,
      },
      text: {
        fontSize: compact ? 10 : width < 400 ? 11 : 12,
        fontWeight: '500' as const,
        color: C.muted,
      },
    }),
    [compact, width],
  );

  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        decelerationRate="fast"
        contentContainerStyle={dynamic.content}>
        {chips.map(chip => {
          const on = chip === active;
          return (
            <Pressable
              key={chip}
              style={[dynamic.chip, on && styles.chipOn]}
              onPress={() => onChange(chip)}
              hitSlop={4}>
              <Text numberOfLines={1} style={[dynamic.text, on && styles.textOn]}>
                {chip}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    backgroundColor: C.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.border,
    paddingVertical: 8,
  },
  chipOn: {
    backgroundColor: C.primary,
    borderColor: C.primary,
  },
  textOn: {
    color: C.white,
    fontWeight: '600',
  },
});
