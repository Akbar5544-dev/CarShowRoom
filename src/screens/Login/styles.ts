import {StyleSheet} from 'react-native';
import {type AppColors} from '../../theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingTop: 20,
      paddingBottom: 32,
    },
    brandRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 28,
    },
    brandBadge: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.brandBlue,
      alignItems: 'center',
      justifyContent: 'center',
    },
    brandBadgeText: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.white,
    },
    brandName: {
      fontSize: 20,
      fontWeight: '800',
      color: colors.textDark,
      letterSpacing: -0.3,
    },
    title: {
      fontSize: 28,
      lineHeight: 34,
      fontWeight: '800',
      color: colors.textDark,
      letterSpacing: -0.5,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.textSoft,
      marginBottom: 22,
    },
    socialBtn: {
      height: 48,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
    },
    socialBtnText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textDark,
    },
    orRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginTop: 8,
      marginBottom: 18,
    },
    orLine: {
      flex: 1,
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border,
    },
    orText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textSoft,
      letterSpacing: 0.6,
    },
    form: {
      gap: 14,
    },
    field: {
      gap: 8,
    },
    label: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textDark,
    },
    input: {
      height: 48,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 14,
      paddingHorizontal: 16,
      fontSize: 14,
      color: colors.text,
      backgroundColor: colors.white,
    },
    inputError: {
      borderColor: '#EF4444',
    },
    errorText: {
      fontSize: 12,
      fontWeight: '500',
      color: '#EF4444',
    },
    passwordWrap: {
      position: 'relative',
      justifyContent: 'center',
    },
    passwordInput: {
      paddingRight: 48,
    },
    eyeBtn: {
      position: 'absolute',
      right: 14,
      width: 28,
      height: 28,
      alignItems: 'center',
      justifyContent: 'center',
    },
    optionsRow: {
      marginTop: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    rememberRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      flexShrink: 1,
    },
    checkbox: {
      width: 18,
      height: 18,
      borderRadius: 9,
      borderWidth: 1.5,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxChecked: {
      borderColor: colors.brandBlue,
      backgroundColor: colors.brandBlue,
    },
    checkboxDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.white,
    },
    rememberText: {
      fontSize: 13,
      color: colors.textSoft,
    },
    forgotText: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.brandBlue,
    },
    primaryBtn: {
      marginTop: 22,
      height: 52,
      borderRadius: 999,
      backgroundColor: colors.brandBlue,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryBtnDisabled: {
      opacity: 0.7,
    },
    primaryBtnText: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.white,
    },
    switchRow: {
      marginTop: 20,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    switchText: {
      fontSize: 13,
      color: colors.textSoft,
    },
    switchLink: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.brandBlue,
    },
  });
