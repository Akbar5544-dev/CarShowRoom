import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {Icon, Screen} from '../../../components';
import {
  CustomerChips,
  CustomerListHeader,
  InitialsAvatar,
} from '../shared/CustomerListHeader';
import {C} from '../shared/tokens';
import {SHOWROOM_CHIPS} from './module';
import type {PublicShowroom} from '../../../utils/publicShowrooms';
import {useCustomerShowroomsController} from './useController';

export function CustomerShowrooms() {
  const {width} = useWindowDimensions();
  const imageH = Math.round(Math.min(160, Math.max(120, width * 0.32)));
  const {
    search,
    setSearch,
    chip,
    setChip,
    data,
    isLoading,
    toggleFollow,
    onOpenShowroom,
  } = useCustomerShowroomsController();

  const renderCard = ({item}: {item: PublicShowroom}) => (
    <Pressable style={styles.card} onPress={() => onOpenShowroom(item)}>
      <View style={styles.head}>
        <InitialsAvatar initials={item.initials} tone={item.tone} size={34} />
        <View style={styles.headMeta}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{item.name}</Text>
            {item.verified ? (
              <Icon name="verifiedCheck" size={12} color={C.primary} />
            ) : null}
          </View>
          <Text style={styles.sub}>{item.subtitle}</Text>
        </View>
        <Pressable
          style={[styles.follow, item.following && styles.following]}
          onPress={() => toggleFollow(item)}>
          <Text
            style={[styles.followText, item.following && styles.followingText]}>
            {item.following ? 'Following' : 'Follow'}
          </Text>
        </Pressable>
      </View>

      <View style={[styles.cover, {height: imageH}]}>
        <Text style={styles.coverText}>{item.name}</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.desc} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.meta}>
          <View
            style={[
              styles.chip,
              item.verified ? styles.chipVerified : styles.chipUnverified,
            ]}>
            <Text
              style={[
                styles.chipText,
                item.verified ? styles.chipVerifiedText : styles.chipMutedText,
              ]}>
              {item.verified ? 'Verified' : 'Not verified'}
            </Text>
          </View>
          <Text style={styles.followers}>{item.followersLabel} Followers</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <Screen style={styles.container} edges={['top', 'left', 'right']}>
      <CustomerListHeader
        search={search}
        onChangeSearch={setSearch}
        placeholder="Search showrooms..."
      />
      <CustomerChips chips={SHOWROOM_CHIPS} active={chip} onSelect={setChip} />
      <FlatList
        data={data}
        keyExtractor={i => i.id}
        renderItem={renderCard}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            {isLoading ? (
              <ActivityIndicator color={C.primary} />
            ) : (
              <Text style={styles.empty}>No showrooms available</Text>
            )}
          </View>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: C.bg},
  list: {padding: 14, gap: 12, paddingBottom: 28, flexGrow: 1},
  card: {
    backgroundColor: C.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: 12,
    paddingTop: 11,
    paddingBottom: 8,
  },
  headMeta: {flex: 1, minWidth: 0},
  nameRow: {flexDirection: 'row', alignItems: 'center', gap: 3},
  name: {fontSize: 12, fontWeight: '700', color: C.text},
  sub: {fontSize: 10, color: C.muted, marginTop: 1},
  follow: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: C.primary,
  },
  following: {backgroundColor: '#f3f4f6', borderWidth: 1, borderColor: C.border},
  followText: {fontSize: 11, fontWeight: '700', color: '#fff'},
  followingText: {color: C.muted},
  cover: {
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverText: {fontSize: 13, fontWeight: '600', color: C.muted},
  body: {padding: 12, gap: 6},
  title: {fontSize: 14, fontWeight: '700', color: C.text},
  desc: {fontSize: 11, color: C.muted, lineHeight: 15},
  meta: {flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4},
  chip: {paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6},
  chipVerified: {backgroundColor: '#eff6ff'},
  chipUnverified: {backgroundColor: '#f3f4f6'},
  chipText: {fontSize: 9, fontWeight: '700', textTransform: 'uppercase'},
  chipVerifiedText: {color: C.primary},
  chipMutedText: {color: C.muted},
  followers: {
    fontSize: 11,
    fontWeight: '600',
    color: C.text,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    overflow: 'hidden',
  },
  emptyWrap: {paddingTop: 40, alignItems: 'center'},
  empty: {color: C.muted, fontWeight: '600'},
});
