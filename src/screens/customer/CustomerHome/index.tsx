import React, {useCallback} from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {Icon, Screen} from '../../../components';
import {useThemedStyles} from '../../../theme';
import {FeedFilterSheet} from './FeedFilterSheet';
import {FeedPostCard} from './FeedPostCard';
import type {FeedPost} from './module';
import {FEED_CHIPS, FEED_MUTED, FEED_PRIMARY} from './module';
import {ProfileSidebar} from './ProfileSidebar';
import {createStyles} from './styles';
import {useCustomerHomeController} from './useController';

export function CustomerHome() {
  const styles = useThemedStyles(createStyles);
  const {
    search,
    setSearch,
    activeChip,
    onChipPress,
    hasNotifications,
    isLoading,
    posts,
    activeFilters,
    filterCount,
    filterSheetVisible,
    draftFilters,
    draftResultCount,
    sidebarVisible,
    sidebarActiveItem,
    userName,
    userEmail,
    onOpenFilters,
    onCloseFilters,
    onResetFilters,
    onApplyFilters,
    onDraftChange,
    onRemoveActiveFilter,
    onProfilePress,
    onCloseSidebar,
    onSidebarItemPress,
    onNotificationsPress,
    onMessagesPress,
    onPostPress,
    onToggleLike,
    onToggleSave,
    onShare,
  } = useCustomerHomeController();

  const renderItem = useCallback<ListRenderItem<FeedPost>>(
    ({item}) => (
      <FeedPostCard
        post={item}
        onPress={onPostPress}
        onToggleLike={onToggleLike}
        onToggleSave={onToggleSave}
        onShare={onShare}
      />
    ),
    [onPostPress, onShare, onToggleLike, onToggleSave],
  );

  return (
    <Screen style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Pressable
          style={styles.avatarBtn}
          accessibilityLabel="Profile"
          onPress={onProfilePress}>
          <Icon name="userOutline" size={18} color={FEED_PRIMARY} />
        </Pressable>

        <View style={styles.searchBar}>
          <Icon name="search" size={14} color={FEED_MUTED} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search listings..."
            placeholderTextColor={FEED_MUTED}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>

        <View style={styles.hdrActions}>
          <Pressable
            style={styles.msgBtn}
            accessibilityLabel="Notifications"
            onPress={onNotificationsPress}>
            <Icon name="bell" size={16} color={FEED_MUTED} />
            {hasNotifications ? <View style={styles.badge} /> : null}
          </Pressable>
          <Pressable
            style={styles.msgBtn}
            accessibilityLabel="Messages"
            onPress={onMessagesPress}>
            <Icon name="message" size={16} color={FEED_MUTED} />
          </Pressable>
        </View>
      </View>

      <View style={styles.filtersRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScroll}
          contentContainerStyle={styles.chipsContent}>
          {FEED_CHIPS.map(chip => {
            const on = activeChip === chip;
            return (
              <Pressable
                key={chip}
                style={[styles.fchip, on && styles.fchipOn]}
                onPress={() => onChipPress(chip)}>
                <Text style={[styles.fchipText, on && styles.fchipTextOn]}>
                  {chip}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Pressable
          style={[styles.filterBtn, filterCount > 0 && styles.filterBtnActive]}
          accessibilityLabel="Filters"
          onPress={onOpenFilters}>
          <Icon
            name="filterFunnel"
            size={16}
            color={filterCount > 0 ? FEED_PRIMARY : '#111827'}
          />
          {filterCount > 0 ? (
            <View style={styles.filterCount}>
              <Text style={styles.filterCountText}>{filterCount}</Text>
            </View>
          ) : null}
        </Pressable>
      </View>

      {activeFilters.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.activeFiltersRow}>
          {activeFilters.map(filter => (
            <View key={filter.key} style={styles.afilter}>
              <Text style={styles.afilterText}>{filter.label}</Text>
              <Pressable
                style={styles.afilterRemove}
                hitSlop={6}
                onPress={() => onRemoveActiveFilter(filter.key)}>
                <Text style={styles.afilterRemoveText}>×</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      ) : null}

      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.empty}>
            {isLoading ? (
              <ActivityIndicator color={FEED_PRIMARY} />
            ) : (
              <Text style={styles.emptyTitle}>No cars available</Text>
            )}
          </View>
        }
      />

      <FeedFilterSheet
        visible={filterSheetVisible}
        draft={draftFilters}
        resultCount={draftResultCount}
        onChange={onDraftChange}
        onClose={onCloseFilters}
        onReset={onResetFilters}
        onApply={onApplyFilters}
      />

      <ProfileSidebar
        visible={sidebarVisible}
        userName={userName}
        userEmail={userEmail}
        activeItem={sidebarActiveItem}
        onClose={onCloseSidebar}
        onItemPress={onSidebarItemPress}
      />
    </Screen>
  );
}
