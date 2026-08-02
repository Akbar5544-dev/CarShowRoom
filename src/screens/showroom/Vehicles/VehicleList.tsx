import React, {useCallback} from 'react';
import {
  FlatList,
  ListRenderItem,
  Pressable,
  Text,
  View,
} from 'react-native';
import {
  Icon,
  Screen,
  ScreenLoader,
  VehicleInventoryCard,
} from '../../../components';
import type {VehicleInventoryItem} from '../../../components/VehicleInventoryCard';
import {useThemedStyles, useThemeColors} from '../../../theme';
import {createListStyles} from './listStyles';
import {useVehicleListController} from './useListController';

export function VehicleList() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createListStyles);
  const {
    summary,
    filteredVehicles,
    isLoading,
    onBackPress,
    onAuctionPress,
    onAddVehiclePress,
    onViewVehiclePress,
    onItemPress,
  } = useVehicleListController();

  const renderVehicle = useCallback<ListRenderItem<VehicleInventoryItem>>(
    ({item}) => (
      <View style={styles.cardWrap}>
        <VehicleInventoryCard
          item={item}
          onViewPress={onViewVehiclePress}
          onItemPress={onItemPress}
        />
      </View>
    ),
    [onItemPress, onViewVehiclePress, styles.cardWrap],
  );

  const keyExtractor = useCallback((item: VehicleInventoryItem) => item.id, []);

  const listHeader = (
    <View style={styles.headerBlock}>
      <View style={styles.pageHeader}>
        <View style={styles.titleRow}>
          <Pressable
            style={styles.backBtn}
            onPress={onBackPress}
            accessibilityLabel="Go back"
            hitSlop={8}>
            <Icon name="arrowLeft" size={12} color={colors.white} />
          </Pressable>
          <View style={styles.titleBlock}>
            <Text style={styles.pageTitle}>All Vehicle</Text>
            <Text style={styles.pageSubtitle}>{summary}</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <Pressable style={styles.outlineBtn} onPress={onAuctionPress}>
            <Text style={styles.outlineBtnText}>Auction</Text>
          </Pressable>
          <Pressable style={styles.primaryBtn} onPress={onAddVehiclePress}>
            <Icon name="addPlus" size={10} color={colors.white} />
            <Text style={styles.primaryBtnText}>Add Vehicles</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <Screen style={styles.container}>
      <ScreenLoader visible={isLoading} />
      <FlatList
        data={filteredVehicles}
        keyExtractor={keyExtractor}
        renderItem={renderVehicle}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          !isLoading ? (
            <Text style={styles.emptyText}>No vehicles found</Text>
          ) : null
        }
        ItemSeparatorComponent={() => <View style={styles.cardGap} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={7}
        removeClippedSubviews
        keyboardShouldPersistTaps="handled"
      />
    </Screen>
  );
}
