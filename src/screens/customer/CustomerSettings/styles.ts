import {StyleSheet} from 'react-native';
import {type AppColors} from '../../../theme';

export const FEED_PRIMARY = '#2563eb';
export const FEED_MUTED = '#6b7280';
export const FEED_BORDER = '#e5e7eb';
export const FEED_BG = '#f9fafb';

export type ThemeOptionId = 'light' | 'dark' | 'system';
export type LanguageOptionId = 'en' | 'ur' | 'ar';

export const createStyles = (_c: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: FEED_BG,
    },
    topbar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 14,
      paddingTop: 8,
      paddingBottom: 12,
      backgroundColor: '#fff',
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: FEED_BORDER,
    },
    backBtn: {
      width: 34,
      height: 34,
      borderRadius: 17,
      borderWidth: 1,
      borderColor: FEED_BORDER,
      backgroundColor: FEED_BG,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      flex: 1,
      fontSize: 16,
      fontWeight: '700',
      color: '#111827',
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 28,
    },
    section: {
      marginBottom: 14,
    },
    sectionLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: FEED_MUTED,
      textTransform: 'uppercase',
      letterSpacing: 0.4,
      marginBottom: 8,
      paddingLeft: 2,
    },
    card: {
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: FEED_BORDER,
      borderRadius: 14,
      overflow: 'hidden',
      shadowColor: '#0F172A',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 1,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 12,
      paddingVertical: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: FEED_BORDER,
    },
    optionLast: {
      borderBottomWidth: 0,
    },
    icoWrap: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: '#f3f4f6',
      alignItems: 'center',
      justifyContent: 'center',
    },
    icoWrapOn: {
      backgroundColor: '#dbeafe',
    },
    optionText: {
      flex: 1,
      minWidth: 0,
    },
    optionTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: '#111827',
    },
    optionSubtitle: {
      fontSize: 10,
      color: FEED_MUTED,
      marginTop: 2,
    },
    check: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: '#d1d5db',
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkOn: {
      backgroundColor: FEED_PRIMARY,
      borderColor: FEED_PRIMARY,
    },
    toggleTrack: {
      width: 44,
      height: 26,
      borderRadius: 13,
      backgroundColor: '#d1d5db',
      padding: 3,
      justifyContent: 'center',
    },
    toggleTrackOn: {
      backgroundColor: FEED_PRIMARY,
    },
    toggleThumb: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 2,
    },
    toggleThumbOn: {
      alignSelf: 'flex-end',
    },
    toggleThumbOff: {
      alignSelf: 'flex-start',
    },
  });
