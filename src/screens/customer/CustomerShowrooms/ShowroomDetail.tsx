import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {useNavigation, useRoute, type RouteProp} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {showMessage} from 'react-native-flash-message';
import {getApiErrorMessage} from '../../../api';
import {Icon, Screen} from '../../../components';
import {
  publicSiteFollowService,
  publicSiteShowroomsService,
  publicSiteVehiclesService,
} from '../../../services';
import {unwrapList} from '../../../utils/apiHelpers';
import {
  mapPublicShowroomDetail,
  type PublicShowroom,
} from '../../../utils/publicShowrooms';
import {InitialsAvatar} from '../shared/CustomerListHeader';
import {C} from '../shared/tokens';
import {inventoryForShowroom} from './module';

type Params = {CustomerShowroomDetail: {showroomId: string}};

type InvItem = {
  id: string;
  title: string;
  price: string;
  tag: 'For Sale' | 'For Rent';
  showroomId: string;
};

export function CustomerShowroomDetail() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<Params, 'CustomerShowroomDetail'>>();
  const insets = useSafeAreaInsets();
  const {width} = useWindowDimensions();
  const slug = route.params.showroomId;
  const [showroom, setShowroom] = useState<PublicShowroom | null>(null);
  const [inventory, setInventory] = useState<InvItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [stars, setStars] = useState(0);
  const bannerH = Math.round(Math.min(200, Math.max(150, width * 0.42)));
  const topPad = insets.top + 6;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await publicSiteShowroomsService.getPublicShowroomsById(slug);
      const mapped = mapPublicShowroomDetail(res);
      setShowroom(mapped);
      setFollowing(mapped.following);
      setStars(mapped.rating > 0 ? Math.round(mapped.rating) : 0);
      try {
        const vehiclesRes = await publicSiteVehiclesService.listPublicVehicles({
          showroom_id: mapped.showroomId,
          per_page: 20,
        });
        const list = unwrapList(vehiclesRes).map((item: any, index: number) => ({
          id: String(item.id ?? item.slug ?? index),
          title:
            item.title ||
            [item.make, item.model].filter(Boolean).join(' ') ||
            'Vehicle',
          price:
            item.price_label ||
            (item.sale_price
              ? `PKR ${Number(item.sale_price).toLocaleString()}`
              : 'Price on request'),
          tag: String(item.usage || item.listing_type || '')
            .toLowerCase()
            .includes('rent')
            ? ('For Rent' as const)
            : ('For Sale' as const),
          showroomId: mapped.id,
        }));
        setInventory(
          list.length
            ? list
            : (inventoryForShowroom(mapped.id) as InvItem[]),
        );
      } catch {
        setInventory([]);
      }
    } catch (error) {
      showMessage({
        message: getApiErrorMessage(error, 'Failed to load showroom'),
        type: 'danger',
      });
      setShowroom(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  const onToggleFollow = useCallback(async () => {
    if (!showroom) {
      return;
    }
    const next = !following;
    setFollowing(next);
    try {
      if (next) {
        await publicSiteFollowService.createPublicFollows({
          showroom_id: showroom.showroomId || showroom.id,
        });
      } else {
        await publicSiteFollowService.deletePublicFollowsById(
          showroom.showroomId || showroom.id,
        );
      }
    } catch (error) {
      setFollowing(!next);
      showMessage({
        message: getApiErrorMessage(error, 'Could not update follow'),
        type: 'danger',
      });
    }
  }, [following, showroom]);

  if (loading) {
    return (
      <Screen style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.loader}>
          <ActivityIndicator color={C.primary} />
        </View>
      </Screen>
    );
  }

  if (!showroom) {
    return (
      <Screen style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.loader}>
          <Text style={{color: C.muted, fontWeight: '600'}}>
            Showroom not found
          </Text>
          <Pressable onPress={() => navigation.goBack()} style={{marginTop: 12}}>
            <Text style={{color: C.primary, fontWeight: '700'}}>Go back</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  return (
    <Screen style={styles.container} edges={['left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.banner, {height: bannerH}]}>
          <Text style={styles.bannerText}>{showroom.name}</Text>
          <Pressable
            style={[styles.back, {top: topPad}]}
            onPress={() => navigation.goBack()}>
            <Icon name="chevronLeft" size={16} color={C.text} />
          </Pressable>
        </View>

        <View style={styles.panel}>
          <View style={styles.profileRow}>
            <InitialsAvatar
              initials={showroom.initials}
              tone={showroom.tone}
              size={56}
              radius={16}
            />
            <View style={{flex: 1}}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{showroom.name}</Text>
                {showroom.verified ? (
                  <Icon name="verifiedCheck" size={14} color={C.primary} />
                ) : null}
              </View>
              <Text style={styles.sub}>{showroom.subtitle}</Text>
            </View>
            <Pressable
              style={[styles.follow, following && styles.following]}
              onPress={onToggleFollow}>
              <Text
                style={[styles.followText, following && styles.followingText]}>
                {following ? 'Following' : 'Follow'}
              </Text>
            </Pressable>
          </View>

          <Text style={styles.desc}>{showroom.description}</Text>

          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{showroom.followersLabel}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>
                {showroom.rating > 0 ? showroom.rating.toFixed(1) : '—'}
              </Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>
                {showroom.vehicles || inventory.length}
              </Text>
              <Text style={styles.statLabel}>Vehicles</Text>
            </View>
          </View>

          <Text style={styles.section}>Your rating</Text>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map(n => (
              <Pressable key={n} onPress={() => setStars(n)}>
                <Icon
                  name="starFill"
                  size={22}
                  color={n <= stars ? '#F59E0B' : '#d1d5db'}
                />
              </Pressable>
            ))}
          </View>

          <View style={styles.infoRow}>
            <Icon name="phoneOutline" size={14} color={C.muted} />
            <Text style={styles.infoText}>{showroom.phone || '—'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="clockOutline" size={14} color={C.muted} />
            <Text style={styles.infoText}>{showroom.hours}</Text>
          </View>

          <View style={styles.ctaRow}>
            <Pressable
              style={styles.callBtn}
              onPress={() =>
                showroom.phone
                  ? Linking.openURL(`tel:${showroom.phone}`)
                  : undefined
              }>
              <Icon name="phoneOutline" size={14} color={C.primary} />
              <Text style={styles.callText}>Call</Text>
            </Pressable>
            <Pressable
              style={styles.smsBtn}
              onPress={() =>
                navigation.navigate('CustomerHomeTab', {
                  screen: 'CustomerMessages',
                })
              }>
              <Icon name="message" size={14} color="#fff" />
              <Text style={styles.smsText}>Message</Text>
            </Pressable>
          </View>

          <Text style={styles.section}>Inventory ({inventory.length})</Text>
          <View style={styles.invGrid}>
            {inventory.map(item => (
              <Pressable
                key={item.id}
                style={styles.invCard}
                onPress={() =>
                  navigation.navigate('CustomerProductDetail', {
                    productId: item.id,
                    showroomId: showroom.id,
                  })
                }>
                <View style={styles.invImage}>
                  <Text style={styles.invImageText} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <View
                    style={[
                      styles.tag,
                      item.tag === 'For Sale' ? styles.tagSale : styles.tagRent,
                    ]}>
                    <Text style={styles.tagText}>{item.tag}</Text>
                  </View>
                </View>
                <Text style={styles.invTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.invPrice}>{item.price}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: C.bg},
  loader: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  banner: {
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
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
  panel: {
    marginTop: -20,
    backgroundColor: C.bg,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 16,
    paddingBottom: 32,
    gap: 10,
  },
  profileRow: {flexDirection: 'row', alignItems: 'center', gap: 12},
  nameRow: {flexDirection: 'row', alignItems: 'center', gap: 4},
  name: {fontSize: 16, fontWeight: '700', color: C.text},
  sub: {fontSize: 11, color: C.muted, marginTop: 2},
  follow: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: C.primary,
  },
  following: {backgroundColor: '#f3f4f6', borderWidth: 1, borderColor: C.border},
  followText: {color: '#fff', fontSize: 11, fontWeight: '700'},
  followingText: {color: C.muted},
  desc: {fontSize: 12, color: C.muted, lineHeight: 17},
  stats: {
    flexDirection: 'row',
    backgroundColor: C.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    paddingVertical: 12,
  },
  stat: {flex: 1, alignItems: 'center'},
  statValue: {fontSize: 15, fontWeight: '700', color: C.text},
  statLabel: {fontSize: 10, color: C.muted, marginTop: 2},
  section: {
    fontSize: 11,
    fontWeight: '700',
    color: C.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginTop: 8,
  },
  stars: {flexDirection: 'row', gap: 6},
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: C.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    padding: 10,
  },
  infoText: {fontSize: 12, color: C.text, flex: 1},
  ctaRow: {flexDirection: 'row', gap: 8},
  callBtn: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#dbeafe',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  callText: {color: C.primary, fontWeight: '700', fontSize: 12},
  smsBtn: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    backgroundColor: C.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  smsText: {color: '#fff', fontWeight: '700', fontSize: 12},
  invGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 10},
  invCard: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: C.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
  },
  invImage: {
    height: 90,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  invImageText: {
    fontSize: 11,
    fontWeight: '600',
    color: C.muted,
    textAlign: 'center',
  },
  tag: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagSale: {backgroundColor: '#dbeafe'},
  tagRent: {backgroundColor: '#ffedd5'},
  tagText: {fontSize: 9, fontWeight: '700', color: C.text},
  invTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: C.text,
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  invPrice: {
    fontSize: 11,
    fontWeight: '600',
    color: C.primary,
    paddingHorizontal: 8,
    paddingBottom: 10,
    paddingTop: 2,
  },
});
