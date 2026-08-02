import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SvgXml} from 'react-native-svg';
import {authIcons} from '../../assets/authIcons';
import {Screen} from '../../components';
import {useThemedStyles, useThemeColors} from '../../theme';
import {createStyles} from './styles';
import {useSignUpController} from './useController';

export function SignUp() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {
    role,
    roleOptions,
    fullName,
    email,
    phone,
    password,
    passwordVisible,
    agreedToTerms,
    errors,
    loading,
    setRole,
    setFullName,
    setEmail,
    setPhone,
    setPassword,
    onTogglePassword,
    onToggleTerms,
    onCreateAccount,
    onLoginPress,
    onGooglePress,
    onApplePress,
  } = useSignUpController();

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
          Free for buyers and renters. Showrooms get a 14-day trial.
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

        <Pressable style={styles.socialBtn} onPress={onGooglePress}>
          <Text style={styles.socialBtnText}>Continue with Google</Text>
        </Pressable>
        <Pressable style={styles.socialBtn} onPress={onApplePress}>
          <Text style={styles.socialBtnText}>Continue with Apple</Text>
        </Pressable>

        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.orLine} />
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Full name</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="----"
              placeholderTextColor={colors.textSoft}
              autoCapitalize="words"
              style={[styles.input, errors.fullName ? styles.inputError : null]}
            />
            {errors.fullName ? (
              <Text style={styles.errorText}>{errors.fullName}</Text>
            ) : null}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
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

          <View style={styles.field}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="+92 300 0000000"
              placeholderTextColor={colors.textSoft}
              keyboardType="phone-pad"
              style={[styles.input, errors.phone ? styles.inputError : null]}
            />
            {errors.phone ? (
              <Text style={styles.errorText}>{errors.phone}</Text>
            ) : null}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
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
    </Screen>
  );
}
