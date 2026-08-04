import React from 'react';
import {Pressable, Text, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  EmployeeCard,
  Icon,
  Screen,
  SearchFilterBar,
} from '../../../components';
import {useThemedStyles, useThemeColors} from '../../../theme';
import {createStyles} from './styles';
import {useAllEmployeesController} from './useController';

export function AllEmployees() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {
    summary,
    searchQuery,
    filteredEmployees,
    setSearchQuery,
    onAddEmployeePress,
    onFilterPress,
    onProfilePress,
    onSalaryPress,
    onBackPress,
  } = useAllEmployeesController();

  return (
    <Screen style={styles.container}>
      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={20}
        keyboardOpeningTime={0}
        enableAutomaticScroll>
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
                <Text style={styles.pageTitle}>All Employees</Text>
                <Text style={styles.pageSubtitle}>{summary}</Text>
              </View>
            </View>
            <View style={styles.actions}>
              <Pressable style={styles.primaryBtn} onPress={onAddEmployeePress}>
                <Icon name="addPlus" size={12} color={colors.white} />
                <Text style={styles.primaryBtnText}>Add Employee</Text>
              </Pressable>
            </View>
          </View>

          <SearchFilterBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFilterPress={onFilterPress}
            placeholder="Search employees..."
          />

          <View style={styles.directoryList}>
            {filteredEmployees.length === 0 ? (
              <Text style={styles.emptyText}>No employees found</Text>
            ) : (
              filteredEmployees.map(employee => (
                <EmployeeCard
                  key={employee.id}
                  employee={employee}
                  onProfilePress={onProfilePress}
                  onSalaryPress={onSalaryPress}
                />
              ))
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>
    </Screen>
  );
}
