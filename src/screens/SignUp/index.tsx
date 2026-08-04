import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SvgXml} from 'react-native-svg';
import {authIcons} from '../../assets/authIcons';
import {Screen} from '../../components';
import {useThemedStyles, useThemeColors} from '../../theme';
import {COUNTRY_OPTIONS} from './module';
import {createStyles} from './styles';
import {useSignUpController} from './useController';

function RequiredLabel({
  label,
  optional,
  styles,
}: {
  label: string;
  optional?: boolean;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <Text style={styles.label}>
      {label}
      {optional ? (
        <Text style={styles.optional}> (optional)</Text>
      ) : (
        <Text style={styles.required}> *</Text>
      )}
    </Text>
  );
}

export function SignUp() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const [picker, setPicker] = useState<'country' | 'city' | null>(null);
  const {
    role,
    roleOptions,
    fullName,
    showroomName,
    logo,
    country,
    city,
    address,
    email,
    phone,
    password,
    passwordVisible,
    agreedToTerms,
    cityOptions,
    errors,
    loading,
    setRole,
    setFullName,
    setShowroomName,
    onPickLogo,
    onClearLogo,
    setCountry,
    setCity,
    setAddress,
    setEmail,
    setPhone,
    setPassword,
    onTogglePassword,
    onToggleTerms,
    onCreateAccount,
    onLoginPress,
  } = useSignUpController();

  const isAdmin = role === 'admin';

  return (
    <Screen style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={24}
        keyboardOpeningTime={0}
        enableAutomaticScroll>
        <View style={styles.brandRow}>
          <View style={styles.brandBadge}>
            <Text style={styles.brandBadgeText}>M</Text>
          </View>
          <Text style={styles.brandName}>Motorly</Text>
        </View>

        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>
          {isAdmin
            ? 'Register your showroom and start managing inventory.'
            : 'Free for buyers and renters. Save cars and message dealers.'}
        </Text>

        <View style={styles.roleRow}>
          {roleOptions.map(option => {
            const selected = option.id === role;
            return (
              <Pressable
                key={option.id}
                style={[styles.roleCard, selected && styles.roleCardSelected]}
                onPress={() => setRole(option.id)}>
                <Text style={styles.roleTitle}>{option.title}</Text>
                <Text style={styles.roleDescription}>{option.description}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <RequiredLabel label="Full name" styles={styles} />
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Your full name"
              placeholderTextColor={colors.textSoft}
              autoCapitalize="words"
              style={[styles.input, errors.fullName ? styles.inputError : null]}
            />
            {errors.fullName ? (
              <Text style={styles.errorText}>{errors.fullName}</Text>
            ) : null}
          </View>

          {isAdmin ? (
            <>
              <View style={styles.field}>
                <RequiredLabel label="Showroom name" styles={styles} />
                <TextInput
                  value={showroomName}
                  onChangeText={setShowroomName}
                  placeholder="City Motors"
                  placeholderTextColor={colors.textSoft}
                  style={[
                    styles.input,
                    errors.showroomName ? styles.inputError : null,
                  ]}
                />
                {errors.showroomName ? (
                  <Text style={styles.errorText}>{errors.showroomName}</Text>
                ) : null}
              </View>

              <View style={styles.field}>
                <RequiredLabel
                  label="Showroom logo"
                  optional
                  styles={styles}
                />
                <Pressable style={styles.uploadBox} onPress={onPickLogo}>
                  {logo ? (
                    <View style={styles.logoPreviewRow}>
                      <Image source={{uri: logo.uri}} style={styles.logoThumb} />
                      <View style={{flex: 1}}>
                        <Text style={styles.uploadTitle} numberOfLines={1}>
                          {logo.name}
                        </Text>
                        <Pressable onPress={onClearLogo}>
                          <Text style={styles.clearLogo}>Remove</Text>
                        </Pressable>
                      </View>
                    </View>
                  ) : (
                    <>
                      <Text style={styles.uploadTitle}>
                        Tap to upload logo
                      </Text>
                      <Text style={styles.uploadHint}>
                        PNG, JPG, WEBP · max 5MB
                      </Text>
                    </>
                  )}
                </Pressable>
              </View>
            </>
          ) : null}

          {!isAdmin ? (
            <View style={styles.field}>
              <RequiredLabel label="Email" styles={styles} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={colors.textSoft}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={[styles.input, errors.email ? styles.inputError : null]}
              />
              {errors.email ? (
                <Text style={styles.errorText}>{errors.email}</Text>
              ) : null}
            </View>
          ) : null}

          {!isAdmin ? (
            <View style={styles.field}>
              <RequiredLabel label="Phone" styles={styles} />
              <View style={styles.phoneRow}>
                <View style={styles.dialCode}>
                  <Text style={styles.dialFlag}>🇵🇰</Text>
                  <Text style={styles.dialText}>+92</Text>
                </View>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="3001234567"
                  placeholderTextColor={colors.textSoft}
                  keyboardType="phone-pad"
                  style={[
                    styles.input,
                    styles.phoneInput,
                    errors.phone ? styles.inputError : null,
                  ]}
                />
              </View>
              {errors.phone ? (
                <Text style={styles.errorText}>{errors.phone}</Text>
              ) : null}
            </View>
          ) : null}

          <View style={styles.field}>
            <RequiredLabel label="Country" optional styles={styles} />
            <Pressable
              style={styles.select}
              onPress={() => setPicker('country')}>
              <Text
                style={country ? styles.selectValue : styles.selectPlaceholder}>
                {country || 'Select country'}
              </Text>
              <Text style={styles.chev}>▾</Text>
            </Pressable>
          </View>

          <View style={styles.field}>
            <RequiredLabel label="City" optional styles={styles} />
            <Pressable
              style={[styles.select, !country && styles.selectDisabled]}
              disabled={!country}
              onPress={() => setPicker('city')}>
              <Text
                style={city ? styles.selectValue : styles.selectPlaceholder}>
                {city || (country ? 'Select city' : 'Select country first')}
              </Text>
              <Text style={styles.chev}>▾</Text>
            </Pressable>
          </View>

          {isAdmin ? (
            <View style={styles.field}>
              <RequiredLabel label="Address" optional styles={styles} />
              <TextInput
                value={address}
                onChangeText={setAddress}
                placeholder="Street, area"
                placeholderTextColor={colors.textSoft}
                multiline
                textAlignVertical="top"
                style={[styles.input, styles.textarea]}
              />
            </View>
          ) : null}

          {isAdmin ? (
            <View style={styles.field}>
              <RequiredLabel label="Email" styles={styles} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={colors.textSoft}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={[styles.input, errors.email ? styles.inputError : null]}
              />
              {errors.email ? (
                <Text style={styles.errorText}>{errors.email}</Text>
              ) : null}
            </View>
          ) : null}

          {isAdmin ? (
            <View style={styles.field}>
              <RequiredLabel label="Phone" styles={styles} />
              <View style={styles.phoneRow}>
                <View style={styles.dialCode}>
                  <Text style={styles.dialFlag}>🇵🇰</Text>
                  <Text style={styles.dialText}>+92</Text>
                </View>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="3001234567"
                  placeholderTextColor={colors.textSoft}
                  keyboardType="phone-pad"
                  style={[
                    styles.input,
                    styles.phoneInput,
                    errors.phone ? styles.inputError : null,
                  ]}
                />
              </View>
              {errors.phone ? (
                <Text style={styles.errorText}>{errors.phone}</Text>
              ) : null}
            </View>
          ) : null}

          <View style={styles.field}>
            <RequiredLabel label="Password" styles={styles} />
            <View style={styles.passwordWrap}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="At least 8 characters"
                placeholderTextColor={colors.textSoft}
                secureTextEntry={!passwordVisible}
                autoCapitalize="none"
                style={[
                  styles.input,
                  styles.passwordInput,
                  errors.password ? styles.inputError : null,
                ]}
              />
              <Pressable
                style={styles.eyeBtn}
                onPress={onTogglePassword}
                accessibilityLabel={
                  passwordVisible ? 'Hide password' : 'Show password'
                }>
                <SvgXml
                  xml={passwordVisible ? authIcons.eye : authIcons.eyeOff}
                  width={20}
                  height={20}
                />
              </Pressable>
            </View>
            {errors.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}
          </View>
        </View>

        <Pressable style={styles.termsRow} onPress={onToggleTerms}>
          <View
            style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
            {agreedToTerms ? <View style={styles.checkboxDot} /> : null}
          </View>
          <Text style={styles.termsText}>
            I agree to the Terms of Service and Privacy Policy.
          </Text>
        </Pressable>
        {errors.terms ? (
          <Text style={styles.errorText}>{errors.terms}</Text>
        ) : null}

        <Pressable
          style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
          onPress={onCreateAccount}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.primaryBtnText}>Create account</Text>
          )}
        </Pressable>

        <View style={styles.switchRow}>
          <Text style={styles.switchText}>Already registered? </Text>
          <Pressable onPress={onLoginPress}>
            <Text style={styles.switchLink}>Sign in</Text>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>

      <Modal
        visible={picker != null}
        transparent
        animationType="fade"
        onRequestClose={() => setPicker(null)}>
        <Pressable style={styles.modalScrim} onPress={() => setPicker(null)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {picker === 'country' ? 'Select country' : 'Select city'}
            </Text>
            <ScrollView style={{maxHeight: 320}}>
              {(picker === 'country' ? [...COUNTRY_OPTIONS] : cityOptions).map(
                option => (
                  <Pressable
                    key={option}
                    style={styles.modalItem}
                    onPress={() => {
                      if (picker === 'country') {
                        setCountry(option);
                      } else {
                        setCity(option);
                      }
                      setPicker(null);
                    }}>
                    <Text style={styles.modalItemText}>{option}</Text>
                  </Pressable>
                ),
              )}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </Screen>
  );
}
