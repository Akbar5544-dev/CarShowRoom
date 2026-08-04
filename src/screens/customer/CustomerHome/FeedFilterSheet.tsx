import React, {memo} from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useThemedStyles} from '../../../theme';
import type {ListingType, SheetFilters} from './module';
import {createSheetStyles} from './styles';

type FeedFilterSheetProps = {
  visible: boolean;
  draft: SheetFilters;
  resultCount: number;
  onChange: (next: SheetFilters) => void;
  onClose: () => void;
  onReset: () => void;
  onApply: () => void;
};

const TYPES: Array<'All' | ListingType> = ['All', 'For Sale', 'For Rent'];
const PRICE_PRESETS = ['Under 30L', '20–100L', '100L+'] as const;
const CITIES = ['Lahore', 'Karachi', 'Islamabad', 'Multan'] as const;
const MAKES = ['Toyota', 'Honda', 'BMW', 'Mercedes'] as const;
const SORTS = ['Newest', 'Price ↑', 'Popular'] as const;

export const FeedFilterSheet = memo(function FeedFilterSheet({
  visible,
  draft,
  resultCount,
  onChange,
  onClose,
  onReset,
  onApply,
}: FeedFilterSheetProps) {
  const styles = useThemedStyles(createSheetStyles);
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropTap} onPress={onClose} />
        <View style={[styles.sheet, {paddingBottom: Math.max(insets.bottom, 14)}]}>
          <View style={styles.handle} />
          <View style={styles.head}>
            <Text style={styles.headTitle}>Filters</Text>
            <Pressable onPress={onReset} hitSlop={8}>
              <Text style={styles.reset}>Reset</Text>
            </Pressable>
          </View>

          <ScrollView
            style={{maxHeight: 420}}
            contentContainerStyle={styles.body}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <View style={styles.block}>
              <Text style={styles.label}>Listing type</Text>
              <View style={styles.chips}>
                {TYPES.map(type => {
                  const on = draft.type === type;
                  return (
                    <Pressable
                      key={type}
                      style={[styles.chip, on && styles.chipOn]}
                      onPress={() => onChange({...draft, type})}>
                      <Text style={[styles.chipText, on && styles.chipTextOn]}>
                        {type}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.block}>
              <Text style={styles.label}>Price (PKR Lakh)</Text>
              <View style={styles.rangeRow}>
                <TextInput
                  style={styles.rangeInput}
                  placeholder="Min"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                  value={draft.priceMin}
                  onChangeText={priceMin =>
                    onChange({...draft, priceMin, pricePreset: null})
                  }
                />
                <Text style={styles.rangeTo}>to</Text>
                <TextInput
                  style={styles.rangeInput}
                  placeholder="Max"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                  value={draft.priceMax}
                  onChangeText={priceMax =>
                    onChange({...draft, priceMax, pricePreset: null})
                  }
                />
              </View>
              <View style={styles.chips}>
                {PRICE_PRESETS.map(preset => {
                  const on = draft.pricePreset === preset;
                  return (
                    <Pressable
                      key={preset}
                      style={[styles.chip, on && styles.chipOn]}
                      onPress={() =>
                        onChange({
                          ...draft,
                          pricePreset: on ? null : preset,
                          priceMin:
                            preset === 'Under 30L'
                              ? ''
                              : preset === '20–100L'
                                ? '20'
                                : '100',
                          priceMax:
                            preset === 'Under 30L'
                              ? '30'
                              : preset === '20–100L'
                                ? '100'
                                : '',
                        })
                      }>
                      <Text style={[styles.chipText, on && styles.chipTextOn]}>
                        {preset}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.block}>
              <Text style={styles.label}>City</Text>
              <View style={styles.chips}>
                {CITIES.map(city => {
                  const on = draft.city === city;
                  return (
                    <Pressable
                      key={city}
                      style={[styles.chip, on && styles.chipOn]}
                      onPress={() =>
                        onChange({...draft, city: on ? null : city})
                      }>
                      <Text style={[styles.chipText, on && styles.chipTextOn]}>
                        {city}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.block}>
              <Text style={styles.label}>Make</Text>
              <View style={styles.chips}>
                {MAKES.map(make => {
                  const on = draft.make === make;
                  return (
                    <Pressable
                      key={make}
                      style={[styles.chip, on && styles.chipOn]}
                      onPress={() =>
                        onChange({...draft, make: on ? null : make})
                      }>
                      <Text style={[styles.chipText, on && styles.chipTextOn]}>
                        {make}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.block}>
              <Text style={styles.label}>Sort by</Text>
              <View style={styles.chips}>
                {SORTS.map(sort => {
                  const on = draft.sort === sort;
                  return (
                    <Pressable
                      key={sort}
                      style={[styles.chip, on && styles.chipOn]}
                      onPress={() => onChange({...draft, sort})}>
                      <Text style={[styles.chipText, on && styles.chipTextOn]}>
                        {sort}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          <View style={styles.foot}>
            <Pressable style={[styles.btn, styles.btnGhost]} onPress={onClose}>
              <Text style={styles.btnGhostText}>Close</Text>
            </Pressable>
            <Pressable
              style={[styles.btn, styles.btnPrimary]}
              onPress={onApply}>
              <Text style={styles.btnPrimaryText}>
                {resultCount === 0
                  ? 'No cars available'
                  : `Show ${resultCount} result${resultCount === 1 ? '' : 's'}`}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
});
