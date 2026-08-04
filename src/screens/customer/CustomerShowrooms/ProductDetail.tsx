import React, {useRef, useState} from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {useNavigation, useRoute, type RouteProp} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Icon, Screen} from '../../../components';
import {InitialsAvatar} from '../shared/CustomerListHeader';
import {C} from '../shared/tokens';
import {productById, showroomById} from './module';

type Params = {
  CustomerProductDetail: {productId: string; showroomId: string};
};

const SLIDES = ['#1e3a8a', '#0f172a', '#334155', '#1d4ed8'];

export function CustomerProductDetail() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<Params, 'CustomerProductDetail'>>();
  const insets = useSafeAreaInsets();
  const {width} = useWindowDimensions();
  const product = productById(route.params.productId);
  const showroom = showroomById(route.params.showroomId || product.showroomId);
  const heroH = Math.round(Math.min(280, Math.max(220, width * 0.58)));
  const [index, setIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const listRef = useRef<FlatList>(null);
  const topPad = insets.top + 6;

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    setIndex(i);
  };

  return (
    <Screen style={styles.container} edges={['left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{height: heroH}}>
          <FlatList
            ref={listRef}
            data={SLIDES}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            keyExtractor={(_, i) => String(i)}
            renderItem={({item, index: i}) => (
              <View
                style={{
                  width,
                  height: heroH,
                  backgroundColor: item,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={styles.slideLabel}>
                  {product.title} · {i + 1}
                </Text>
              </View>
            )}
          />
          <Pressable
            style={[styles.iconBtn, {top: topPad, left: 14}]}
            onPress={() => navigation.goBack()}>
            <Icon name="chevronLeft" size={16} color={C.text} />
          </Pressable>
          <Pressable
            style={[styles.iconBtn, {top: topPad, right: 56}]}
            onPress={() => setSaved(v => !v)}>
            <Icon
              name={saved ? 'bookmarkFill' : 'bookmark'}
              size={16}
              color={saved ? C.primary : C.text}
            />
          </Pressable>
          <Pressable
            style={[styles.iconBtn, {top: topPad, right: 14}]}
            onPress={() =>
              Share.share({message: `${product.title}\n${product.price}`})
            }>
            <Icon name="shareUpload" size={16} color={C.text} />
          </Pressable>
          <View style={styles.saleTag}>
            <Text style={styles.saleTagText}>{product.tag}</Text>
          </View>
          <View style={styles.count}>
            <Text style={styles.countText}>
              {index + 1}/{SLIDES.length}
            </Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbs}>
          {SLIDES.map((color, i) => (
            <Pressable
              key={i}
              style={[
                styles.thumb,
                {backgroundColor: color},
                i === index && styles.thumbOn,
              ]}
              onPress={() =>
                listRef.current?.scrollToIndex({index: i, animated: true})
              }
            />
          ))}
        </ScrollView>

        <View style={styles.body}>
          <Text style={styles.price}>{product.price}</Text>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.posted}>
            Posted by {showroom.name} · 2 hours ago
          </Text>

          <View style={styles.specs}>
            {[
              ['Year', product.year],
              ['Mileage', product.mileage],
              ['Transmission', product.transmission],
              ['Fuel', product.fuel],
            ].map(([label, value]) => (
              <View key={label} style={styles.spec}>
                <Text style={styles.specLabel}>{label}</Text>
                <Text style={styles.specValue}>{value}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.section}>Description</Text>
          <Text style={styles.desc}>{product.description}</Text>

          <Text style={styles.section}>Listed by</Text>
          <View style={styles.seller}>
            <InitialsAvatar
              initials={showroom.initials}
              tone={showroom.tone}
              size={40}
            />
            <View style={{flex: 1}}>
              <View style={styles.nameRow}>
                <Text style={styles.sellerName}>{showroom.name}</Text>
                {showroom.verified ? (
                  <Icon name="verifiedCheck" size={12} color={C.primary} />
                ) : null}
              </View>
              <Text style={styles.sellerSub}>
                {showroom.followersLabel} Followers · Verified dealer
              </Text>
            </View>
            <Pressable
              style={styles.viewBtn}
              onPress={() =>
                navigation.navigate('CustomerShowroomDetail', {
                  showroomId: showroom.id,
                })
              }>
              <Text style={styles.viewText}>View</Text>
            </Pressable>
          </View>

          <Text style={styles.section}>Highlights</Text>
          {[
            'Original documents / Verified paperwork',
            'Showroom ready / Inspected & detailed',
            'Lahore pickup / Showroom available',
          ].map(line => (
            <View key={line} style={styles.highlight}>
              <Icon name="verifiedCheck" size={14} color={C.primary} />
              <Text style={styles.highlightText}>{line}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: C.bg},
  slideLabel: {color: '#fff', fontWeight: '700', fontSize: 14, paddingHorizontal: 20, textAlign: 'center'},
  iconBtn: {
    position: 'absolute',
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saleTag: {
    position: 'absolute',
    left: 14,
    bottom: 14,
    backgroundColor: '#16a34a',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  saleTagText: {color: '#fff', fontSize: 11, fontWeight: '700'},
  count: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  countText: {color: '#fff', fontSize: 10, fontWeight: '700'},
  thumbs: {gap: 8, paddingHorizontal: 14, paddingVertical: 10},
  thumb: {width: 56, height: 44, borderRadius: 8, borderWidth: 2, borderColor: 'transparent'},
  thumbOn: {borderColor: C.primary},
  body: {paddingHorizontal: 16, paddingBottom: 32, gap: 8},
  price: {fontSize: 22, fontWeight: '700', color: C.primary},
  title: {fontSize: 18, fontWeight: '700', color: C.text},
  posted: {fontSize: 11, color: C.muted},
  specs: {flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6},
  spec: {
    width: '48%',
    flexGrow: 1,
    maxWidth: '48.5%',
    backgroundColor: C.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    padding: 10,
  },
  specLabel: {fontSize: 10, color: C.muted, fontWeight: '600'},
  specValue: {fontSize: 13, fontWeight: '700', color: C.text, marginTop: 3},
  section: {
    marginTop: 10,
    fontSize: 11,
    fontWeight: '700',
    color: C.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  desc: {fontSize: 12, color: '#374151', lineHeight: 18},
  seller: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: C.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    padding: 10,
  },
  nameRow: {flexDirection: 'row', alignItems: 'center', gap: 4},
  sellerName: {fontSize: 13, fontWeight: '700', color: C.text},
  sellerSub: {fontSize: 10, color: C.muted, marginTop: 2},
  viewBtn: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  viewText: {color: C.primary, fontWeight: '700', fontSize: 12},
  highlight: {flexDirection: 'row', alignItems: 'center', gap: 8},
  highlightText: {fontSize: 12, color: C.text, flex: 1},
});
