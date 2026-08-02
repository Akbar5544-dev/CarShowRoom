import {StyleSheet} from 'react-native';
import {type AppColors} from '../../../theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 36,
    },
    main: {
      paddingHorizontal: 20,
      paddingTop: 8,
      gap: 14,
    },

    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    iconBtn: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: colors.surface,
      borderWidth: 0.75,
      borderColor: colors.borderSoft,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#0F172A',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.05,
      shadowRadius: 6,
      elevation: 2,
    },

    card: {
      backgroundColor: colors.surface,
      borderRadius: 22,
      borderWidth: 0.75,
      borderColor: colors.borderSoft,
      padding: 16,
      gap: 14,
      shadowColor: '#0F172A',
      shadowOffset: {width: 0, height: 3},
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },

    invoiceTop: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 12,
    },
    invoiceEyebrow: {
      fontSize: 9,
      fontWeight: '600',
      color: colors.textSoft,
      letterSpacing: 1.1,
      textTransform: 'uppercase',
    },
    invoiceId: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.textDark,
      letterSpacing: -0.5,
      marginTop: 4,
    },
    statusPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 5,
      backgroundColor: colors.actionTint12,
    },
    statusPillPaid: {
      backgroundColor: colors.badgeActiveBg,
    },
    statusPillOverdue: {
      backgroundColor: colors.badgeOverdueBg,
    },
    statusText: {
      fontSize: 10,
      fontWeight: '700',
      color: colors.actionBlue,
    },
    statusTextPaid: {
      color: colors.successBright,
    },
    statusTextOverdue: {
      color: colors.error,
    },

    datesRow: {
      flexDirection: 'row',
      gap: 16,
    },
    dateCol: {
      flex: 1,
      gap: 2,
    },
    dateLabel: {
      fontSize: 9,
      color: colors.textSoft,
    },
    dateValue: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.textDark,
    },

    divider: {
      borderTopWidth: 1,
      borderStyle: 'dashed',
      borderColor: colors.border,
    },

    sectionHead: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
    },
    sectionTitle: {
      fontSize: 10,
      fontWeight: '700',
      color: colors.textSoft,
      letterSpacing: 0.9,
      textTransform: 'uppercase',
    },

    customerName: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.textDark,
    },
    contactRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    contactText: {
      fontSize: 11,
      color: colors.textSoft,
      flex: 1,
    },
    licenseText: {
      fontSize: 11,
      fontWeight: '500',
      color: colors.textDark,
    },

    vehicleBox: {
      borderRadius: 14,
      backgroundColor: colors.searchBg,
      borderWidth: 0.75,
      borderColor: colors.borderSoft,
      paddingHorizontal: 12,
      paddingVertical: 10,
      gap: 2,
    },
    vehicleTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textDark,
    },
    vehiclePlate: {
      fontSize: 11,
      color: colors.textSoft,
    },

    tripRow: {
      flexDirection: 'row',
      gap: 8,
    },
    tripCard: {
      flex: 1,
      borderRadius: 14,
      backgroundColor: colors.searchBg,
      borderWidth: 0.75,
      borderColor: colors.borderSoft,
      padding: 11,
      gap: 5,
    },
    tripLabel: {
      fontSize: 9,
      fontWeight: '700',
      color: colors.textSoft,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },
    tripLocation: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.textDark,
    },
    tripWhen: {
      fontSize: 10,
      color: colors.textSoft,
    },

    chargeRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 12,
    },
    chargeCopy: {
      flex: 1,
      gap: 2,
    },
    chargeLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textDark,
    },
    chargeDetail: {
      fontSize: 10,
      color: colors.textSoft,
    },
    chargeAmount: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.textDark,
    },

    totalsBox: {
      borderRadius: 16,
      backgroundColor: colors.actionTint08,
      borderWidth: 0.75,
      borderColor: colors.actionTint15,
      padding: 12,
      gap: 8,
    },
    totalLine: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    totalMuted: {
      fontSize: 11,
      color: colors.textSoft,
    },
    totalMutedValue: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.textDark,
    },
    totalDueLabel: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textDark,
    },
    totalDueValue: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.actionBlue,
      letterSpacing: -0.3,
    },

    paymentBox: {
      borderRadius: 14,
      backgroundColor: colors.searchBg,
      borderWidth: 0.75,
      borderColor: colors.borderSoft,
      padding: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    paymentCopy: {
      flex: 1,
      gap: 2,
    },
    paymentMethod: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.textDark,
    },
    paymentStatus: {
      fontSize: 10,
      color: colors.textSoft,
    },
    markPaidBtn: {
      borderRadius: 12,
      backgroundColor: colors.actionTint12,
      paddingHorizontal: 10,
      paddingVertical: 7,
    },
    markPaidText: {
      fontSize: 10,
      fontWeight: '700',
      color: colors.actionBlue,
    },

    footerActions: {
      gap: 10,
      paddingTop: 2,
    },
    downloadBtn: {
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.actionBlue,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    downloadText: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.white,
    },
    emailBtn: {
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.actionBlue,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    emailText: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.actionBlue,
    },
  });
