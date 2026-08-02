import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  Switch,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Icon, Screen} from '../../../components';
import {useThemedStyles, useThemeColors} from '../../../theme';
import {createStyles} from './styles';
import {useSecurityController} from './useController';

export function Security() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {width} = useWindowDimensions();
  const {
    passwordForm,
    authenticatorEnabled,
    smsBackupEnabled,
    sessions,
    isLoggingOut,
    setPasswordField,
    onToggleAuthenticator,
    onToggleSmsBackup,
    onUpdatePassword,
    onRevokeSession,
    onBackPress,
    onLogoutPress,
  } = useSecurityController();

  const horizontalPadding = width >= 768 ? 32 : 20;

  return (
    <Screen style={styles.container}>
      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={24}
        keyboardOpeningTime={0}
        enableAutomaticScroll>

        <View style={[styles.main, {paddingHorizontal: horizontalPadding}]}>
          <View style={styles.pageHeader}>
            <View style={styles.titleRow}>
              <Pressable
                style={styles.backBtn}
                onPress={onBackPress}
                accessibilityLabel="Go back"
                hitSlop={8}>
                <Icon name="arrowLeft" size={14} color={colors.white} />
              </Pressable>
              <Text style={styles.pageTitle}>Settings</Text>
            </View>
            <Text style={styles.pageSubtitle}>
              Configure your account, workspace and preferences
            </Text>
          </View>

          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Icon name="settingsSecurity" size={18} color={colors.white} />
            </View>
            <View style={styles.sectionCopy}>
              <Text style={styles.sectionTitle}>Security</Text>
              <Text style={styles.sectionSubtitle}>
                Password, 2FA and active sessions
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardEyebrow}>Update</Text>
              <Text style={styles.cardTitle}>Password</Text>
            </View>

            <View style={styles.fields}>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Current password</Text>
                <TextInput
                  value={passwordForm.currentPassword}
                  onChangeText={text => setPasswordField('currentPassword', text)}
                  secureTextEntry
                  style={styles.fieldInput}
                  placeholderTextColor={colors.textSoft}
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>New password</Text>
                <TextInput
                  value={passwordForm.newPassword}
                  onChangeText={text => setPasswordField('newPassword', text)}
                  secureTextEntry
                  style={styles.fieldInput}
                  placeholderTextColor={colors.textSoft}
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Confirm new password</Text>
                <TextInput
                  value={passwordForm.confirmPassword}
                  onChangeText={text =>
                    setPasswordField('confirmPassword', text)
                  }
                  secureTextEntry
                  style={styles.fieldInput}
                  placeholderTextColor={colors.textSoft}
                />
              </View>
            </View>

            <Pressable style={styles.updateBtn} onPress={onUpdatePassword}>
              <Icon name="activityKey" size={14} color={colors.white} />
              <Text style={styles.updateBtnText}>Update Password</Text>
            </Pressable>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardEyebrow}>Extra layer</Text>
              <Text style={styles.cardTitle}>Two-Factor Authentication</Text>
            </View>

            <View style={styles.optionList}>
              <View style={styles.optionRow}>
                <View
                  style={[
                    styles.optionIcon,
                    {backgroundColor: 'rgba(32,180,107,0.12)'},
                  ]}>
                  <Icon
                    name="settingsSecurity"
                    size={16}
                    color={colors.successBright}
                  />
                </View>
                <View style={styles.optionCopy}>
                  <Text style={styles.optionTitle}>Authenticator app</Text>
                  <Text style={styles.optionSubtitle}>
                    Google Authenticator connected
                  </Text>
                </View>
                <Switch
                  style={styles.toggle}
                  value={authenticatorEnabled}
                  onValueChange={onToggleAuthenticator}
                  trackColor={{false: colors.track, true: colors.actionBlue}}
                  thumbColor={colors.white}
                  ios_backgroundColor={colors.track}
                />
              </View>

              <View style={styles.optionRow}>
                <View
                  style={[
                    styles.optionIcon,
                    {backgroundColor: colors.actionTint1},
                  ]}>
                  <Icon name="phone" size={16} color={colors.actionBlue} />
                </View>
                <View style={styles.optionCopy}>
                  <Text style={styles.optionTitle}>SMS backup</Text>
                  <Text style={styles.optionSubtitle}>+92 300 111-4433</Text>
                </View>
                <Switch
                  style={styles.toggle}
                  value={smsBackupEnabled}
                  onValueChange={onToggleSmsBackup}
                  trackColor={{false: colors.track, true: colors.actionBlue}}
                  thumbColor={colors.white}
                  ios_backgroundColor={colors.track}
                />
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardEyebrow}>Devices</Text>
              <Text style={styles.cardTitle}>Active Sessions</Text>
            </View>

            <View style={styles.sessionList}>
              {sessions.map(session => (
                <View key={session.id} style={styles.sessionRow}>
                  <View style={styles.sessionIcon}>
                    <Icon name="phone" size={16} color={colors.actionBlue} />
                  </View>
                  <View style={styles.sessionCopy}>
                    <Text style={styles.sessionTitle}>{session.device}</Text>
                    <Text style={styles.sessionMeta}>{session.meta}</Text>
                  </View>
                  {session.current ? (
                    <View style={styles.currentBadge}>
                      <Text style={styles.currentBadgeText}>Current</Text>
                    </View>
                  ) : (
                    <Pressable
                      style={styles.revokeBtn}
                      onPress={() => onRevokeSession(session.id)}>
                      <Text style={styles.revokeBtnText}>Revoke</Text>
                    </Pressable>
                  )}
                </View>
              )              )}
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardEyebrow}>Session</Text>
              <Text style={styles.cardTitle}>Sign out</Text>
            </View>
            <Pressable
              style={[styles.updateBtn, {backgroundColor: colors.error}]}
              onPress={onLogoutPress}
              disabled={isLoggingOut}>
              {isLoggingOut ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.updateBtnText}>Log out</Text>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </Screen>
  );
}
