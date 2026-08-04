import React, {useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
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
import type {PublicJobListItem} from '../../../utils/publicJobs';
import {JOB_CHIPS} from './module';
import {useCustomerJobsController} from './useController';

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
  }
  return (parts[0] || 'JB').slice(0, 2).toUpperCase();
}

export function CustomerJobs() {
  const {
    isLoading,
    search,
    setSearch,
    jobs,
    onJobPress,
    emptyMessage,
  } = useCustomerJobsController();
  const [chip, setChip] = useState('All');

  const data = useMemo(() => {
    return jobs.filter(j => {
      if (chip === 'Full-time' && !j.employmentType.toLowerCase().includes('full')) {
        return false;
      }
      if (chip === 'Part-time' && !j.employmentType.toLowerCase().includes('part')) {
        return false;
      }
      if (
        chip === 'Sales' &&
        !j.department.toLowerCase().includes('sales') &&
        !j.title.toLowerCase().includes('sales')
      ) {
        return false;
      }
      if (
        chip === 'Mechanic' &&
        !j.department.toLowerCase().includes('mechanic') &&
        !j.title.toLowerCase().includes('mechanic')
      ) {
        return false;
      }
      return true;
    });
  }, [chip, jobs]);

  const renderItem = ({item}: {item: PublicJobListItem}) => (
    <View style={styles.card}>
      <View style={styles.top}>
        <InitialsAvatar
          initials={initials(item.showroomName || item.title)}
          tone="cc"
          size={44}
          radius={11}
        />
        <View style={{flex: 1, minWidth: 0}}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.companyRow}>
            <Text style={styles.company}>{item.showroomName}</Text>
          </View>
        </View>
      </View>
      <View style={styles.tags}>
        <View style={[styles.tag, styles.tagRole]}>
          <Text style={[styles.tagText, styles.tagRoleText]}>
            {item.department}
          </Text>
        </View>
        <View style={[styles.tag, styles.tagType]}>
          <Text style={[styles.tagText, styles.tagTypeText]}>
            {item.employmentType}
          </Text>
        </View>
        <View style={[styles.tag, styles.tagPay]}>
          <Text style={[styles.tagText, styles.tagPayText]}>
            {item.salaryLabel}
          </Text>
        </View>
      </View>
      <Text style={styles.desc} numberOfLines={2}>
        {item.city}
        {item.experienceLabel ? ` · ${item.experienceLabel}` : ''}
      </Text>
      <View style={styles.foot}>
        <Text style={styles.footMeta}>{item.postedLabel || 'Open role'}</Text>
        <Pressable style={styles.apply} onPress={() => onJobPress(item)}>
          <Text style={styles.applyText}>Apply</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <Screen style={styles.container} edges={['top', 'left', 'right']}>
      <CustomerListHeader
        search={search}
        onChangeSearch={setSearch}
        placeholder="Search jobs..."
      />
      <Text style={styles.pageTitle}>Jobs</Text>
      <CustomerChips chips={JOB_CHIPS} active={chip} onSelect={setChip} />
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
              <Text style={styles.empty}>{emptyMessage}</Text>
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
    padding: 13,
    gap: 10,
  },
  top: {flexDirection: 'row', gap: 11, alignItems: 'center'},
  title: {fontSize: 14, fontWeight: '700', color: C.text},
  companyRow: {flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2},
  company: {fontSize: 11, color: C.muted, fontWeight: '600'},
  tags: {flexDirection: 'row', flexWrap: 'wrap', gap: 6},
  tag: {paddingHorizontal: 8, paddingVertical: 4, borderRadius: 7},
  tagText: {fontSize: 10, fontWeight: '700'},
  tagRole: {backgroundColor: '#fff7ed'},
  tagRoleText: {color: '#c2410c'},
  tagType: {backgroundColor: '#eff6ff'},
  tagTypeText: {color: C.primary},
  tagPay: {backgroundColor: '#f0fdf4'},
  tagPayText: {color: C.green},
  desc: {fontSize: 11, color: C.muted, lineHeight: 15},
  foot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.border,
    paddingTop: 10,
    gap: 8,
  },
  footMeta: {flex: 1, fontSize: 10, color: C.muted},
  apply: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 9,
    backgroundColor: C.primary,
  },
  applyText: {color: '#fff', fontSize: 11, fontWeight: '700'},
  emptyWrap: {paddingTop: 40, alignItems: 'center', paddingHorizontal: 24},
  empty: {textAlign: 'center', color: C.muted, fontWeight: '600'},
});
