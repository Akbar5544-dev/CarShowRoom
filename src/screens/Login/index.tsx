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
import {useLoginController} from './useController';

export function Login() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {
    email,
    password,
    passwordVisible,
    rememberMe,
    errors,
    loading,
    setEmail,
    setPassword,
    onTogglePassword,
    onToggleRememberMe,
    onForgotPasswordPress,
    onLogin,
    onSignUpPress,
    onGooglePress,
    onApplePress,
  } = useLoginController();

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

        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>
          Sign in to continue to your Motorly account.
        </Text>

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

        <View style={styles.optionsRow}>
          <Pressable style={styles.rememberRow} onPress={onToggleRememberMe}>
            <View
              style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
              {rememberMe ? <View style={styles.checkboxDot} /> : null}
            </View>
            <Text style={styles.rememberText}>Remember me</Text>
          </Pressable>
          <Pressable onPress={onForgotPasswordPress}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </Pressable>
        </View>

        <Pressable
          style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
          onPress={onLogin}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.primaryBtnText}>Sign in</Text>
          )}
        </Pressable>

        <View style={styles.switchRow}>
          <Text style={styles.switchText}>New to Motorly? </Text>
          <Pressable onPress={onSignUpPress}>
            <Text style={styles.switchLink}>Create account</Text>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
    </Screen>
  );
}
