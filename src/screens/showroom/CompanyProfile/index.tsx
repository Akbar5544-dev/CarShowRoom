import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Icon, Screen} from '../../../components';
import {useThemedStyles, useThemeColors} from '../../../theme';
import {createStyles} from './styles';
import {useCompanyProfileController} from './useController';
import type {CompanyForm} from './module';

type FieldDef = {
  key: keyof CompanyForm;
  label: string;
  keyboardType?: 'default' | 'email-address' | 'url';
};

const FIELDS: FieldDef[] = [
  {key: 'companyName', label: 'Company name'},
  {key: 'taxId', label: 'Tax ID (NTN)'},
  {key: 'address', label: 'Address'},
  {key: 'website', label: 'Website', keyboardType: 'url'},
  {key: 'supportEmail', label: 'Support email', keyboardType: 'email-address'},
  {key: 'currency', label: 'Currency'},
];

export function CompanyProfile() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {width} = useWindowDimensions();
  const [focusedField, setFocusedField] = useState<keyof CompanyForm | null>(
    null,
  );
  const {
    brandColors,
    selectedColorId,
    form,
    logoUri,
    isUploadingLogo,
    setField,
    onSelectColor,
    onBackPress,
    onUploadLogoPress,
    onSavePress,
  } = useCompanyProfileController();

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

          <View style={styles.companyHeader}>
            <View style={styles.companyIcon}>
              <Icon name="building" size={18} color={colors.white} />
            </View>
            <View style={styles.companyCopy}>
              <Text style={styles.companyTitle}>Company</Text>
              <Text style={styles.companySubtitle}>
                Branding, business details and legal information
              </Text>
            </View>
            <Pressable style={styles.saveBtn} onPress={onSavePress}>
              <Text style={styles.saveBtnText}>Save</Text>
            </Pressable>
          </View>

          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionEyebrow}>Logo & Colors</Text>
              <Text style={styles.sectionTitle}>Brand</Text>
            </View>

            <Pressable
              style={styles.uploadBox}
              onPress={onUploadLogoPress}
              disabled={isUploadingLogo}
              accessibilityLabel="Upload logo">
              {logoUri ? (
                <Image
                  source={{uri: logoUri}}
                  style={styles.logoPreview}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.uploadIconWrap}>
                  <Icon name="uploadArrow" size={22} color={colors.textSoft} />
                </View>
              )}
              {isUploadingLogo ? (
                <ActivityIndicator color={colors.actionBlue} />
              ) : (
                <>
                  <Text style={styles.uploadTitle}>
                    {logoUri ? 'Change logo' : 'Upload logo'}
                  </Text>
                  <Text style={styles.uploadHint}>SVG or PNG · 512 × 512</Text>
                </>
              )}
            </Pressable>

            <View style={styles.colorRow}>
              {brandColors.map(item => {
                const selected = item.id === selectedColorId;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => onSelectColor(item.id)}
                    style={[
                      styles.colorSwatch,
                      {backgroundColor: item.color},
                      selected && styles.colorSwatchSelected,
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{selected}}
                    accessibilityLabel={`${item.id} brand color`}
                  />
                );
              })}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Business Details</Text>

            <View style={styles.fieldsGrid}>
              {FIELDS.map(field => (
                <View
                  key={field.key}
                  style={[styles.field, twoColumn && styles.fieldHalf]}>
                  <Text style={styles.fieldLabel}>{field.label}</Text>
                  <TextInput
                    value={form[field.key]}
                    onChangeText={text => setField(field.key, text)}
                    onFocus={() => setFocusedField(field.key)}
                    onBlur={() => setFocusedField(null)}
                    keyboardType={field.keyboardType}
                    style={[
                      styles.fieldInput,
                      focusedField === field.key && styles.fieldInputFocused,
                    ]}
                    placeholderTextColor={colors.textSoft}
                  />
                </View>
              ))}
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </Screen>
  );
}
