import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {Icon, Screen} from '../../../components';
import {useThemedStyles, useThemeColors} from '../../../theme';
import {createStyles} from './styles';
import {useCustomerJobsController} from './useController';

export function CustomerJobs() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {
    isLoading,
    search,
    jobs,
    departmentOptions,
    cityOptions,
    selectedDepartment,
    selectedCity,
    emptyMessage,
    setSearch,
    setSelectedDepartment,
    setSelectedCity,
    onRefresh,
    onJobPress,
  } = useCustomerJobsController();

  return (
    <Screen style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Jobs</Text>
          <Text style={styles.subtitle}>
            Browse open roles from showrooms and apply in a few taps.
          </Text>
        </View>

        <View style={styles.searchWrap}>
          <Icon name="search" size={16} color={colors.textSoft} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search roles, departments…"
            placeholderTextColor={colors.textSoft}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
        </View>

        {departmentOptions.length > 0 || cityOptions.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersRow}>
            <Pressable
              style={[styles.chip, !selectedDepartment && styles.chipActive]}
              onPress={() => setSelectedDepartment(null)}>
              <Text
                style={[
                  styles.chipText,
                  !selectedDepartment && styles.chipTextActive,
                ]}>
                All departments
              </Text>
            </Pressable>
            {departmentOptions.map(item => {
              const active = selectedDepartment === item;
              return (
                <Pressable
                  key={item}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() =>
                    setSelectedDepartment(active ? null : item)
                  }>
                  <Text
                    style={[
                      styles.chipText,
                      active && styles.chipTextActive,
                    ]}>
                    {item}
                  </Text>
                </Pressable>
              );
            })}
            {cityOptions.map(item => {
              const active = selectedCity === item;
              return (
                <Pressable
                  key={`city-${item}`}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => setSelectedCity(active ? null : item)}>
                  <Text
                    style={[
                      styles.chipText,
                      active && styles.chipTextActive,
                    ]}>
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        ) : null}

        {isLoading && jobs.length === 0 ? (
          <ActivityIndicator
            style={styles.loader}
            color={colors.actionBlue}
          />
        ) : jobs.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>No openings found</Text>
            <Text style={styles.emptyText}>{emptyMessage}</Text>
          </View>
        ) : (
          jobs.map(job => (
            <Pressable
              key={job.id}
              style={styles.card}
              onPress={() => onJobPress(job)}>
              <View style={styles.cardTop}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeBadgeText}>{job.employmentType}</Text>
                </View>
              </View>
              <Text style={styles.meta}>
                {job.showroomName} · {job.department}
              </Text>
              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <Icon name="location" size={12} color={colors.textSoft} />
                  <Text style={styles.detailText}>{job.city}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Icon name="briefcase" size={12} color={colors.textSoft} />
                  <Text style={styles.detailText}>{job.experienceLabel}</Text>
                </View>
                {job.postedLabel ? (
                  <Text style={styles.detailText}>{job.postedLabel}</Text>
                ) : null}
              </View>
              <Text style={styles.salary}>{job.salaryLabel}</Text>
            </Pressable>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}
