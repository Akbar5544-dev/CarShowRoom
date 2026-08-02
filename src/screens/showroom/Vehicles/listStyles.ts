import {StyleSheet} from 'react-native';
import {type AppColors} from '../../../theme';

export const createListStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    listContent: {
      paddingBottom: 32,
    },
    headerBlock: {
      paddingHorizontal: 20,
      gap: 16,
      marginBottom: 12,
      marginTop: 8,
    },
    pageHeader: {
      gap: 14,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
    },
    backBtn: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.actionBlue,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 4,
    },
    titleBlock: {
      flex: 1,
      gap: 2,
    },
    pageTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.textDark,
      letterSpacing: -0.6,
    },
    pageSubtitle: {
      fontSize: 10.5,
      color: colors.textSoft,
      marginTop: 3,
      lineHeight: 16,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 6,
    },
    outlineBtn: {
      height: 27,
      paddingHorizontal: 12,
      borderRadius: 18,
      borderWidth: 0.75,
      borderColor: colors.borderSoft,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    outlineBtnText: {
      fontSize: 10.5,
      fontWeight: '500',
      color: colors.textDark,
    },
    primaryBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      height: 27,
      paddingHorizontal: 12,
      borderRadius: 18,
      backgroundColor: colors.actionBlue,
    },
    primaryBtnText: {
      fontSize: 10.5,
      fontWeight: '500',
      color: colors.white,
    },
    cardWrap: {
      marginHorizontal: 16,
    },
    cardGap: {
      height: 16,
    },
    emptyText: {
      textAlign: 'center',
      color: colors.textSoft,
      fontSize: 12,
      paddingVertical: 24,
      marginHorizontal: 20,
    },
  });
