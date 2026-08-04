import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import {useNavigation, useRoute, type RouteProp} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {showMessage} from 'react-native-flash-message';
import {getApiErrorMessage} from '../../../api';
import {Icon, Screen} from '../../../components';
import {publicSiteAuctionsService} from '../../../services';
import {
  mapPublicAuctionDetail,
  mapPublicBidList,
  type PublicAuction,
  type PublicBid,
} from '../../../utils/publicAuctions';
import {C} from '../shared/tokens';
import {auctionById} from './module';

type Params = {CustomerPlaceBid: {auctionId: string}};

const CHIPS = [
  {label: '+1 Lakh', delta: 1},
  {label: '+2 Lakh', delta: 2},
  {label: '+5 Lakh', delta: 5},
] as const;

export function CustomerPlaceBid() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<Params, 'CustomerPlaceBid'>>();
  const insets = useSafeAreaInsets();
  const {width} = useWindowDimensions();
  const auctionId = route.params.auctionId;
  const [auction, setAuction] = useState<PublicAuction | null>(null);
  const [bids, setBids] = useState<PublicBid[]>([]);
  const [loading, setLoading] = useState(true);
  const heroH = Math.round(Math.min(200, Math.max(160, width * 0.42)));
  const [delta, setDelta] = useState(1);
  const draft = (auction?.bidValue ?? 0) + delta;
  const [custom, setCustom] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [detailRes, bidsRes] = await Promise.all([
        publicSiteAuctionsService.getById(auctionId),
        publicSiteAuctionsService.listBids(auctionId).catch(() => null),
      ]);
      const mapped = mapPublicAuctionDetail(detailRes);
      setAuction(mapped);
      setCustom(String(mapped.bidValue + 1));
      if (bidsRes) {
        setBids(mapPublicBidList(bidsRes));
      }
    } catch (error) {
      const fallback = auctionById(auctionId);
      setAuction({
        ...fallback,
        imageUri: null,
        endsAt: null,
      });
      setCustom(String(fallback.bidValue + 1));
      showMessage({
        message: getApiErrorMessage(error, 'Auction detail unavailable'),
        type: 'warning',
      });
    } finally {
      setLoading(false);
    }
  }, [auctionId]);

  useEffect(() => {
    load();
  }, [load]);

  const amountLabel = useMemo(() => {
    const n = Number(custom);
    if (!Number.isFinite(n)) return `PKR ${draft} Lakh`;
    return `PKR ${n} Lakh`;
  }, [custom, draft]);

  const confirmBid = async () => {
    if (!auction) {
      return;
    }
    const amount = Number(custom);
    try {
      await publicSiteAuctionsService.placeBid(auction.id, {
        amount: Number.isFinite(amount) ? amount * 100000 : undefined,
        bid_amount: Number.isFinite(amount) ? amount * 100000 : undefined,
      });
      Alert.alert('Bid placed', `Your bid ${amountLabel} has been submitted.`, [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (error) {
      showMessage({
        message: getApiErrorMessage(error, 'Could not place bid'),
        type: 'danger',
      });
    }
  };

  if (loading || !auction) {
    return (
      <Screen style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.loader}>
          <ActivityIndicator color={C.primary} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen style={styles.container} edges={['left', 'right']}>
      <ScrollView
        contentContainerStyle={{paddingBottom: 90 + insets.bottom}}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, {height: heroH}]}>
          <Text style={styles.heroTitle}>{auction.title}</Text>
          <Pressable
            style={[styles.back, {top: insets.top + 6}]}
            onPress={() => navigation.goBack()}>
            <Icon name="chevronLeft" size={16} color={C.text} />
          </Pressable>
          <View style={[styles.live, {top: insets.top + 8}]}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
          <View style={styles.timer}>
            <Text style={styles.timerText}>{auction.timer}</Text>
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.title}>{auction.title}</Text>
          <View style={styles.sellerRow}>
            <Text style={styles.seller}>{auction.seller}</Text>
            {auction.verified ? (
              <Icon name="verifiedCheck" size={12} color={C.primary} />
            ) : null}
            <Text style={styles.specs}> · {auction.specs}</Text>
          </View>

          <View style={styles.current}>
            <Text style={styles.currentLabel}>Current highest bid</Text>
            <Text style={styles.currentAmt}>{auction.currentBid}</Text>
          </View>

          <Text style={styles.label}>Your bid</Text>
          <TextInput
            style={styles.input}
            value={custom}
            onChangeText={setCustom}
            keyboardType="numeric"
            placeholder="Enter amount (Lakh)"
            placeholderTextColor={C.muted}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={styles.chips}>
            {CHIPS.map(c => {
              const on = delta === c.delta;
              return (
                <Pressable
                  key={c.label}
                  style={[styles.chip, on && styles.chipOn]}
                  onPress={() => {
                    setDelta(c.delta);
                    setCustom(String(auction.bidValue + c.delta));
                  }}>
                  <Text
                    numberOfLines={1}
                    style={[styles.chipText, on && styles.chipTextOn]}>
                    {c.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <Text style={styles.section}>Recent bids</Text>
          {(bids.length
            ? bids
            : [
                {
                  id: 'draft',
                  name: 'You',
                  time: 'Just now · draft',
                  amount: `${custom || draft} Lakh`,
                },
              ]
          ).map(row => (
            <View key={row.id} style={styles.bidRow}>
              <View>
                <Text style={styles.bidName}>{row.name}</Text>
                <Text style={styles.bidTime}>{row.time}</Text>
              </View>
              <Text style={styles.bidAmt}>{row.amount}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View
        style={[styles.confirmBar, {paddingBottom: Math.max(insets.bottom, 12)}]}>
        <Pressable style={styles.confirm} onPress={confirmBid}>
          <Icon name="gavel" size={16} color="#fff" />
          <Text style={styles.confirmText}>Confirm Bid · {amountLabel}</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: C.bg},
  loader: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  hero: {
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    paddingHorizontal: 24,
    textAlign: 'center',
  },
  back: {
    position: 'absolute',
    left: 14,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  live: {
    position: 'absolute',
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: C.red,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  liveDot: {width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff'},
  liveText: {color: '#fff', fontSize: 10, fontWeight: '800'},
  timer: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  timerText: {color: '#fff', fontSize: 11, fontWeight: '700'},
  panel: {
    marginTop: -20,
    backgroundColor: C.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    gap: 10,
  },
  title: {fontSize: 16, fontWeight: '700', color: C.text},
  sellerRow: {flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap'},
  seller: {fontSize: 12, fontWeight: '600', color: C.text},
  specs: {fontSize: 12, color: C.muted},
  current: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  currentLabel: {fontSize: 11, color: C.muted, fontWeight: '600'},
  currentAmt: {fontSize: 22, fontWeight: '700', color: C.primary, marginTop: 4},
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: C.muted,
    textTransform: 'uppercase',
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    fontWeight: '700',
    color: C.text,
    backgroundColor: C.bg,
  },
  chips: {flexDirection: 'row', alignItems: 'center', gap: 8},
  chip: {
    flexShrink: 0,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.white,
  },
  chipOn: {backgroundColor: '#eff6ff', borderColor: '#93c5fd'},
  chipText: {fontSize: 11, fontWeight: '600', color: C.text},
  chipTextOn: {color: C.primary},
  section: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '700',
    color: C.muted,
    textTransform: 'uppercase',
  },
  bidRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.border,
  },
  bidName: {fontSize: 13, fontWeight: '600', color: C.text},
  bidTime: {fontSize: 10, color: C.muted, marginTop: 2},
  bidAmt: {fontSize: 13, fontWeight: '700', color: C.primary},
  confirmBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 14,
    paddingTop: 10,
    backgroundColor: C.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.border,
  },
  confirm: {
    height: 44,
    borderRadius: 12,
    backgroundColor: C.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  confirmText: {color: '#fff', fontWeight: '700', fontSize: 13},
});
