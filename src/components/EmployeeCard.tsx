import React, {memo} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Icon} from './Icon';
import {StatusBadge} from './StatusBadge';
import {type AppColors, useThemedStyles, useThemeColors} from '../theme';

export type EmployeeCardData = {
  id: string;
  name: string;
  role: string;
  employeeId: string;
  status: string;
  salary: string;
  phone: string;
  email: string;
  initials: string;
  avatarColor: string;
};

type EmployeeCardProps = {
  employee: EmployeeCardData;
  onPress?: (employee: EmployeeCardData) => void;
  onProfilePress?: (employee: EmployeeCardData) => void;
};

export const EmployeeCard = memo(function EmployeeCard({
  employee,
  onPress,
  onProfilePress,
}: EmployeeCardProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const openProfile = () => {
    onProfilePress?.(employee);
    onPress?.(employee);
  };

  return (
    <Pressable style={styles.card} onPress={openProfile}>
      <View style={styles.salaryRow}>
        <View>
          <Text style={styles.salaryLabel}>Salary</Text>
          <Text style={styles.salaryValue}>{employee.salary}</Text>
        </View>
        <Pressable style={styles.profileBtn} onPress={openProfile}>
          <Text style={styles.profileText}>Profile</Text>
          <Icon name="profileArrow" size={12} />
        </Pressable>
      </View>

      <View style={styles.body}>
        <View style={[styles.avatar, {backgroundColor: employee.avatarColor}]}>
          <Text style={styles.avatarText}>{employee.initials}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{employee.name}</Text>
          <Text style={styles.role}>{employee.role}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.empId}>{employee.employeeId}</Text>
            <StatusBadge label={employee.status} />
          </View>
        </View>
      </View>

      <View style={styles.contacts}>
        <View style={styles.contactRow}>
          <Icon name="phone" size={11} />
          <Text style={styles.contactText}>{employee.phone}</Text>
        </View>
        <View style={styles.contactRow}>
          <Icon name="email" size={11} />
          <Text style={styles.contactText}>{employee.email}</Text>
        </View>
      </View>
    </Pressable>
  );
});

function createStyles(c: AppColors) {
  return StyleSheet.create({
  card: {
    backgroundColor: c.surface,
    borderRadius: 21,
    borderWidth: 0.75,
    borderColor: c.borderSoft,
    padding: 13,
    gap: 9,
  },
  salaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.75,
    borderBottomColor: c.borderSoft,
    paddingBottom: 8,
  },
  salaryLabel: {
    fontSize: 7.5,
    color: c.textSoft,
    letterSpacing: 0.75,
    textTransform: 'uppercase',
  },
  salaryValue: {
    fontSize: 10.5,
    fontWeight: '700',
    color: c.textDark,
  },
  profileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 9,
  },
  profileText: {
    fontSize: 9,
    fontWeight: '500',
    color: c.actionBlue,
  },
  body: {
    flexDirection: 'row',
    gap: 9,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: c.white,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 12,
    fontWeight: '600',
    color: c.textDark,
  },
  role: {
    fontSize: 9,
    color: c.textSoft,
    marginTop: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  empId: {
    fontSize: 8,
    color: c.actionBlue,
  },
  contacts: {
    gap: 4,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contactText: {
    fontSize: 9,
    color: c.textSoft,
  },
});
}
