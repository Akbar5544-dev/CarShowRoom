import React from 'react';
import {
  Image,
  Pressable,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Images} from '../../../assets';
import {Icon, Screen} from '../../../components';
import {useThemedStyles, useThemeColors} from '../../../theme';
import {createStyles} from './styles';
import {useMyProfileController} from './useController';
import type {MyProfileForm} from './module';

type FieldDef = {
  key: keyof MyProfileForm;
  label: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
};

const FIELDS: FieldDef[] = [
  {key: 'fullName', label: 'Full Name'},
  {key: 'email', label: 'Email', keyboardType: 'email-address'},
  {key: 'phone', label: 'Phone', keyboardType: 'phone-pad'},
  {key: 'role', label: 'Role'},
  {key: 'location', label: 'Location'},
  {key: 'timeZone', label: 'Time Zone'},
];

export function MyProfile() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {width} = useWindowDimensions();
  const {
    displayName,
    displayRole,
    avatarUri,
    form,
    setField,
    onBackPress,
    onUploadPress,
    onRemovePress,
    onCameraPress,
    onCancelPress,
    onSavePress,
  } = useMyProfileController();

  const horizontalPadding = width >= 768 ? 32 : 20;
  const twoColumn = width >= 360;

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

          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionEyebrow}>Profile</Text>
              <Text style={styles.sectionTitle}>Personal information</Text>
            </View>

            <View style={styles.identityRow}>
              <View style={styles.avatarWrap}>
                <View style={styles.avatarRing}>
                  <Image
                    source={
                      avatarUri
                        ? {uri: avatarUri}
                        : Images.profileAvatar
                    }
                    style={styles.avatarImage}
                    resizeMode="cover"
                  />
                </View>
                <Pressable
                  style={styles.cameraBtn}
                  onPress={onCameraPress}
                  accessibilityLabel="Change photo">
                  <Icon name="camera" size={12} color={colors.white} />
                </Pressable>
              </View>

              <View style={styles.identityCopy}>
                <View>
                  <Text style={styles.identityName}>{displayName}</Text>
                  <Text style={styles.identityRole}>{displayRole}</Text>
                </View>
                <View style={styles.identityActions}>
                  <Pressable style={styles.uploadBtn} onPress={onUploadPress}>
                    <Text style={styles.uploadBtnText}>Upload new</Text>
                  </Pressable>
                  <Pressable style={styles.removeBtn} onPress={onRemovePress}>
                    <Text style={styles.removeBtnText}>Remove</Text>
                  </Pressable>
                </View>
              </View>
            </View>

            <View style={styles.fieldsGrid}>
              {FIELDS.map(field => (
                <View
                  key={field.key}
                  style={[styles.field, twoColumn && styles.fieldHalf]}>
                  <Text style={styles.fieldLabel}>{field.label}</Text>
                  <TextInput
                    value={form[field.key]}
                    onChangeText={text => setField(field.key, text)}
                    keyboardType={field.keyboardType}
                    style={styles.fieldInput}
                    placeholderTextColor={colors.textSoft}
                  />
                </View>
              ))}
            </View>

            <View style={styles.footerActions}>
              <Pressable style={styles.cancelBtn} onPress={onCancelPress}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.saveBtn} onPress={onSavePress}>
                <Text style={styles.saveBtnText}>Save changes</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </Screen>
  );
}
