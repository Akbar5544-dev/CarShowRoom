import React, {memo} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Icon} from './Icon';
import {IconName} from '../assets/iconXml';
import {type AppColors, useThemedStyles, useThemeColors} from '../theme';

export type ProfileDetailRow = {
  id: string;
  icon: IconName;
  label: string;
};

export type ProfileInfo = {
  name: string;
  title: string;
  employeeId: string;
  initials: string;
  avatarColor: string;
  online?: boolean;
  details: ProfileDetailRow[];
  emergencyName: string;
  emergencyPhone: string;
};

type ProfileInfoCardProps = {
  profile: ProfileInfo;
  onDownloadPress?: () => void;
};

export const ProfileInfoCard = memo(function ProfileInfoCard({
  profile,
  onDownloadPress,
}: ProfileInfoCardProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.card}>
      <View style={styles.avatarWrap}>
        <View style={[styles.avatar, {backgroundColor: profile.avatarColor}]}>
          <Text style={styles.avatarText}>{profile.initials}</Text>
        </View>
        {profile.online !== false ? <View style={styles.onlineDot} /> : null}
      </View>

      <Text style={styles.name}>{profile.name}</Text>
      <Text style={styles.title}>{profile.title}</Text>

      <View style={styles.idRow}>
        <View style={styles.idBadge}>
          <Text style={styles.idText}>{profile.employeeId}</Text>
        </View>
        <Pressable style={styles.downloadBtn} onPress={onDownloadPress}>
          <Icon name="download" size={12} />
        </Pressable>
      </View>

      <View style={styles.details}>
        {profile.details.map(row => (
          <View key={row.id} style={styles.detailRow}>
            <Icon name={row.icon} size={12} />
            <Text style={styles.detailText}>{row.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.emergency}>
        <Text style={styles.emergencyLabel}>Emergency Contact</Text>
        <Text style={styles.emergencyName}>{profile.emergencyName}</Text>
        <Text style={styles.emergencyPhone}>{profile.emergencyPhone}</Text>
      </View>
    </View>
  );
});

function createStyles(c: AppColors) {
  return StyleSheet.create({
  card: {
    backgroundColor: c.surface,
    borderRadius: 24,
    borderWidth: 0.75,
    borderColor: c.borderSoft,
    padding: 19,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarWrap: {
    width: 98,
    height: 98,
    marginBottom: 12,
  },
  avatar: {
    width: 98,
    height: 98,
    borderRadius: 49,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: c.white,
  },
  onlineDot: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: c.successBright,
    borderWidth: 3,
    borderColor: c.surface,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: c.textDark,
  },
  title: {
    marginTop: 4,
    fontSize: 13,
    color: c.textSoft,
  },
  idRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  idBadge: {
    backgroundColor: c.actionTint12,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  idText: {
    fontSize: 11,
    fontWeight: '600',
    color: c.actionBlue,
  },
  downloadBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: c.surface,
    borderWidth: 0.75,
    borderColor: c.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    width: '100%',
    marginTop: 18,
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 12,
    color: c.textSoft,
  },
  emergency: {
    width: '100%',
    marginTop: 16,
    backgroundColor: '#FFF1F2',
    borderRadius: 16,
    borderWidth: 0.75,
    borderColor: 'rgba(239,68,68,0.15)',
    padding: 12,
  },
  emergencyLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: c.absent,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emergencyName: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '700',
    color: c.textDark,
  },
  emergencyPhone: {
    marginTop: 2,
    fontSize: 11,
    color: c.textSoft,
  },
});
}
