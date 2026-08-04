import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Icon, Screen} from '../../../components';
import {
  CustomerChips,
  CustomerListHeader,
  InitialsAvatar,
} from '../shared/CustomerListHeader';
import {C} from '../shared/tokens';
import type {PublicMechanic} from '../../../utils/publicMechanics';
import {MECHANIC_CHIPS} from './module';
import {useCustomerMechanicsController} from './useController';

export function CustomerMechanics() {
  const {
    search,
    setSearch,
    chip,
    setChip,
    data,
    isLoading,
    navigation,
  } = useCustomerMechanicsController();

  const renderItem = ({item}: {item: PublicMechanic}) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <InitialsAvatar
          initials={item.initials}
          tone={item.tone}
          size={48}
          radius={12}
        />
        <View style={{flex: 1, minWidth: 0}}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{item.name}</Text>
            {item.verified ? (
              <Icon name="verifiedCheck" size={12} color={C.primary} />
            ) : null}
          </View>
          <Text style={styles.spec}>{item.specialty}</Text>
          <View style={styles.locRow}>
            <Icon name="mapPin" size={11} color={C.muted} />
            <Text style={styles.loc}>{item.location}</Text>
          </View>
          <View style={styles.ratingRow}>
            <Icon name="starFill" size={12} color="#F59E0B" />
            <Text style={styles.rating}>
              {item.rating > 0 ? item.rating.toFixed(1) : '—'} · {item.reviews}{' '}
              reviews
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.actions}>
        <Pressable
          style={styles.call}
          onPress={() =>
            item.phone ? Linking.openURL(`tel:${item.phone}`) : undefined
          }>
          <Icon name="phoneOutline" size={14} color={C.primary} />
          <Text style={styles.callText}>Call</Text>
        </Pressable>
        <Pressable
          style={styles.msg}
          onPress={() =>
            navigation.navigate('CustomerHomeTab', {
              screen: 'CustomerMessages',
            })
          }>
          <Icon name="message" size={14} color="#fff" />
          <Text style={styles.msgText}>Message</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <Screen style={styles.container} edges={['top', 'left', 'right']}>
      <CustomerListHeader
        search={search}
        onChangeSearch={setSearch}
        placeholder="Search mechanics..."
      />
      <Text style={styles.pageTitle}>Mechanics</Text>
      <CustomerChips chips={MECHANIC_CHIPS} active={chip} onSelect={setChip} />
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
              <Text style={styles.empty}>No mechanics available</Text>
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
    padding: 12,
    gap: 12,
  },
  row: {flexDirection: 'row', gap: 12},
  nameRow: {flexDirection: 'row', alignItems: 'center', gap: 4},
  name: {fontSize: 14, fontWeight: '700', color: C.text},
  spec: {fontSize: 11, color: C.muted, marginTop: 3},
  locRow: {flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4},
  loc: {fontSize: 10, color: C.muted},
  ratingRow: {flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 5},
  rating: {fontSize: 11, fontWeight: '600', color: C.text},
  actions: {flexDirection: 'row', gap: 8},
  call: {
    flex: 1,
    height: 40,
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
  msg: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: C.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  msgText: {color: '#fff', fontWeight: '700', fontSize: 12},
  emptyWrap: {paddingTop: 40, alignItems: 'center'},
  empty: {color: C.muted, fontWeight: '600'},
});
