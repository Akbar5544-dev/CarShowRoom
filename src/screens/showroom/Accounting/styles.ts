import {StyleSheet} from 'react-native';
import {type AppColors} from '../../../theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    loading: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 40,
      gap: 14,
    },
    main: {
      paddingHorizontal: 20,
      gap: 14,
    },
    pageHeader: {
      gap: 10,
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
      marginTop: 2,
    },
    titleCopy: {
      flex: 1,
      minWidth: 0,
      gap: 3,
    },
    pageTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.textDark,
      letterSpacing: -0.5,
    },
    pageSubtitle: {
      fontSize: 12,
      color: colors.textSoft,
      lineHeight: 17,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 8,
    },
    secondaryBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      height: 36,
      paddingHorizontal: 14,
      borderRadius: 18,
      borderWidth: 0.75,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    secondaryBtnText: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.textDark,
    },
    primaryBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      height: 36,
      paddingHorizontal: 14,
      borderRadius: 18,
      backgroundColor: colors.actionBlue,
    },
    primaryBtnText: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.white,
    },
    metricsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      rowGap: 12,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 24,
      borderWidth: 0.75,
      borderColor: colors.borderSoft,
      padding: 16,
      gap: 14,
      shadowColor: '#0B152C',
      shadowOffset: {width: 0, height: 6},
      shadowOpacity: 0.06,
      shadowRadius: 12,
      elevation: 2,
    },
    sectionEyebrow: {
      fontSize: 10,
      fontWeight: '700',
      color: colors.textSoft,
      letterSpacing: 0.8,
      textTransform: 'uppercase',
    },
    sectionTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: colors.textDark,
      letterSpacing: -0.3,
    },
    sectionHeader: {
      gap: 2,
    },
    sectionHeaderRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 10,
    },
    positiveBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: colors.badgeActiveBg,
      borderRadius: 999,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    positiveBadgeText: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.successBright,
    },
    chartWrap: {
      width: '100%',
      marginTop: 4,
    },
    legendRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      marginTop: 8,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    legendDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    legendText: {
      fontSize: 12,
      color: colors.textSoft,
      textTransform: 'lowercase',
    },
    expenseList: {
      gap: 14,
    },
    expenseRow: {
      gap: 6,
    },
    expenseTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
    },
    expenseLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.textDark,
    },
    expenseAmount: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textDark,
    },
    progressTrack: {
      height: 6,
      borderRadius: 999,
      backgroundColor: colors.track,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 999,
      backgroundColor: colors.actionBlue,
    },
    axisRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 6,
      paddingHorizontal: 2,
    },
    axisLabel: {
      fontSize: 10,
      color: colors.textSoft,
      fontWeight: '500',
    },
  });
