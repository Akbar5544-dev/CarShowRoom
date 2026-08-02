import React, {useCallback} from 'react';
import {
  FlatList,
  ListRenderItem,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import {ActiveRentalCard, Icon, Screen, ScreenLoader} from '../../../components';
import type {ActiveRental} from '../../../components/ActiveRentalCard';
import {useThemedStyles, useThemeColors} from '../../../theme';
import {createStyles} from './styles';
import {useAllVehiclesController} from './useController';

export function AllVehicles() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {
    isLoading,
    summary,
    searchQuery,
    filteredRentals,
    setSearchQuery,
    onReturnPress,
    onInvoicePress,
    onBackPress,
  } = useAllVehiclesController();

  const renderRental = useCallback<ListRenderItem<ActiveRental>>(
    ({item}) => (
      <View style={styles.rentalItem}>
        <ActiveRentalCard
          item={item}
          onReturnPress={onReturnPress}
          onInvoicePress={onInvoicePress}
        />
      </View>
    ),
    [onInvoicePress, onReturnPress, styles.rentalItem],
  );

  const keyExtractor = useCallback((item: ActiveRental) => item.id, []);

  const listHeader = (
    <View style={styles.main}>
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
            <Text style={styles.pageTitle}>Rental Vehicle</Text>
            <Text style={styles.pageSubtitle}>{summary}</Text>
          </View>
        </View>
      </View>

      <View style={styles.rentalsHeader}>
        <View>
          <Text style={styles.sectionEyebrow}>Booked Rentals</Text>
          <Text style={styles.sectionTitle}>Out on rent</Text>
        </View>
        <View style={styles.searchWrap}>
          <Icon name="search" size={12} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search rentals..."
            placeholderTextColor={colors.textSoft}
            style={styles.searchInput}
            returnKeyType="search"
          />
        </View>
      </View>
    </View>
  );

  return (
    <Screen style={styles.container}>
      <ScreenLoader visible={isLoading} />
      <FlatList
        style={styles.list}
        data={filteredRentals}
        keyExtractor={keyExtractor}
        renderItem={renderRental}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {isLoading ? 'Loading…' : 'No active rentals'}
          </Text>
        }
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
