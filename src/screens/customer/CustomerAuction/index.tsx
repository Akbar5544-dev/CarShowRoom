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
import {CustomerChips, CustomerListHeader} from '../shared/CustomerListHeader';
import {C} from '../shared/tokens';
import type {PublicAuction} from '../../../utils/publicAuctions';
import {AUCTION_CHIPS} from './module';
import {useCustomerAuctionController} from './useController';

export function CustomerAuction() {
  const {width} = useWindowDimensions();
  const imgH = Math.round(Math.min(150, Math.max(120, width * 0.32)));
  const {
    search,
    setSearch,
    chip,
    setChip,
    data,
    isLoading,
    toggleWatch,
    onPlaceBid,
  } = useCustomerAuctionController();

  const renderItem = ({item}: {item: PublicAuction}) => (
    <Pressable style={styles.card} onPress={() => onPlaceBid(item)}>
      <View style={[styles.image, {height: imgH}]}>
        <Text style={styles.imageText}>{item.title}</Text>
        <View style={styles.live}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
        <View style={styles.timer}>
          <Text style={styles.timerText}>{item.timer}</Text>
        </View>
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.sellerRow}>
          <Text style={styles.seller}>{item.seller}</Text>
          {item.verified ? (
            <Icon name="verifiedCheck" size={11} color={C.primary} />
          ) : null}
          <Text style={styles.specs}> · {item.specs}</Text>
        </View>
        <View style={styles.stats}>
          <View>
            <Text style={styles.statLabel}>Current bid</Text>
            <Text style={styles.bid}>{item.currentBid}</Text>
          </View>
          <Text style={styles.meta}>
            {item.bids} bids · {item.watchers} watching
          </Text>
        </View>
        <View style={styles.actions}>
          <Pressable
            style={[styles.watch, item.watching && styles.watchOn]}
            onPress={() => toggleWatch(item)}>
            <Icon
              name="eye"
              size={14}
              color={item.watching ? C.primary : C.text}
            />
            <Text
              style={[styles.watchText, item.watching && styles.watchTextOn]}>
              {item.watching ? 'Watching' : 'Watch'}
            </Text>
          </Pressable>
          <Pressable style={styles.bidBtn} onPress={() => onPlaceBid(item)}>
            <Icon name="gavel" size={14} color="#fff" />
            <Text style={styles.bidBtnText}>Place Bid</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );

  return (
    <Screen style={styles.container} edges={['top', 'left', 'right']}>
      <CustomerListHeader
        search={search}
        onChangeSearch={setSearch}
        placeholder="Search auctions..."
      />
      <Text style={styles.pageTitle}>Live Auctions</Text>
      <CustomerChips chips={AUCTION_CHIPS} active={chip} onSelect={setChip} />
      <FlatList
        data={data}
        keyExtractor={i => i.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            {isLoading ? (
              <ActivityIndicator color={C.primary} />
            ) : (
              <Text style={styles.empty}>No auctions available</Text>
            )}
          </View>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: C.bg},
  pageTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: C.text,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
    backgroundColor: C.white,
  },
  list: {padding: 14, gap: 12, paddingBottom: 28, flexGrow: 1},
  card: {
    backgroundColor: C.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
  },
  image: {
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
    paddingHorizontal: 16,
    textAlign: 'center',
  },
  live: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: C.red,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  liveText: {color: '#fff', fontSize: 10, fontWeight: '800'},
  timer: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  timerText: {color: '#fff', fontSize: 11, fontWeight: '700'},
  body: {padding: 12, gap: 6},
  title: {fontSize: 14, fontWeight: '700', color: C.text},
  sellerRow: {flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap'},
  seller: {fontSize: 11, fontWeight: '600', color: C.text},
  specs: {fontSize: 11, color: C.muted},
  stats: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  statLabel: {fontSize: 10, color: C.muted},
  bid: {fontSize: 15, fontWeight: '700', color: C.primary, marginTop: 2},
  meta: {fontSize: 11, color: C.muted},
  actions: {flexDirection: 'row', gap: 8, marginTop: 6},
  watch: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: '#f3f4f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  watchOn: {backgroundColor: '#eff6ff', borderColor: '#93c5fd'},
  watchText: {fontSize: 12, fontWeight: '700', color: C.text},
  watchTextOn: {color: C.primary},
  bidBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: C.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  bidBtnText: {color: '#fff', fontWeight: '700', fontSize: 12},
  emptyWrap: {paddingTop: 40, alignItems: 'center'},
  empty: {color: C.muted, fontWeight: '600'},
});
