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
      paddingBottom: 110,
    },
    main: {
      paddingHorizontal: 20,
      paddingTop: 14,
      gap: 12,
    },
    pageHeader: {
      gap: 4,
    },
    pageTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.textDark,
      letterSpacing: -0.6,
    },
    pageSubtitle: {
      fontSize: 10.5,
      color: colors.textSoft,
      lineHeight: 15,
    },

    /* Stepper */
    stepperCard: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      borderWidth: 0.75,
      borderColor: colors.borderSoft,
      paddingVertical: 14,
      paddingHorizontal: 10,
      shadowColor: '#0F172A',
      shadowOffset: {width: 0, height: 3},
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    stepperRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    stepItem: {
      flex: 1,
      alignItems: 'center',
      gap: 6,
    },
    stepCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.track,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepCircleActive: {
      backgroundColor: colors.actionBlue,
    },
    stepLabel: {
      fontSize: 8.5,
      fontWeight: '500',
      color: colors.textSoft,
      textAlign: 'center',
    },
    stepLabelActive: {
      color: colors.textDark,
      fontWeight: '700',
    },

    /* Step card */
    card: {
      backgroundColor: colors.surface,
      borderRadius: 20,
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
    stepEyebrow: {
      fontSize: 8.5,
      fontWeight: '600',
      color: colors.textSoft,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    stepTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: colors.textDark,
      letterSpacing: -0.35,
      marginTop: 3,
    },
    stack: {
      gap: 11,
    },

    /* Existing customer banner */
    customerBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      borderRadius: 14,
      backgroundColor: colors.actionTint08,
      borderWidth: 0.75,
      borderColor: colors.actionTint15,
      padding: 10,
    },
    customerAvatar: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: colors.actionBlue,
      alignItems: 'center',
      justifyContent: 'center',
    },
    customerCopy: {
      flex: 1,
      gap: 2,
    },
    customerHint: {
      fontSize: 8.5,
      color: colors.textSoft,
    },
    customerName: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.textDark,
    },

    /* Fields */
    row: {
      flexDirection: 'row',
      gap: 10,
    },
    col: {
      flex: 1,
      minWidth: 0,
    },
    field: {
      gap: 5,
    },
    fieldLabel: {
      fontSize: 9,
      fontWeight: '500',
      color: colors.textSoft,
    },
    input: {
      height: 31,
      borderRadius: 9,
      borderWidth: 0.75,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      paddingHorizontal: 10,
      paddingVertical: 0,
      fontSize: 10.5,
      color: colors.textDark,
    },
    inputError: {
      borderColor: colors.error,
    },
    fieldError: {
      fontSize: 9,
      fontWeight: '600',
      color: colors.error,
    },
    dateInput: {
      height: 31,
      borderRadius: 9,
      borderWidth: 0.75,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      paddingHorizontal: 10,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    dateText: {
      flex: 1,
      fontSize: 10,
      color: colors.textDark,
      padding: 0,
    },

    /* Buttons */
    footerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      paddingTop: 2,
    },
    footerRowEnd: {
      justifyContent: 'flex-end',
    },
    backBtn: {
      height: 30,
      borderRadius: 16,
      borderWidth: 0.75,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      paddingHorizontal: 14,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    backBtnText: {
      fontSize: 10.5,
      fontWeight: '500',
      color: colors.textDark,
    },
    primaryBtn: {
      height: 30,
      minWidth: 108,
      borderRadius: 16,
      backgroundColor: colors.actionBlue,
      paddingHorizontal: 15,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
    },
    primaryBtnText: {
      fontSize: 10.5,
      fontWeight: '600',
      color: colors.white,
    },

    /* Vehicle step */
    vehicleCard: {
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.borderSoft,
      backgroundColor: colors.surface,
      padding: 12,
      gap: 7,
    },
    vehicleCardSelected: {
      borderColor: colors.actionBlue,
      backgroundColor: colors.actionTint06,
    },
    vehicleTop: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 10,
    },
    vehicleIcon: {
      width: 26,
      height: 26,
      borderRadius: 8,
      backgroundColor: colors.actionTint12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    vehiclePriceBox: {
      alignItems: 'flex-end',
    },
    vehiclePriceLabel: {
      fontSize: 8,
      color: colors.textSoft,
    },
    vehiclePrice: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.actionBlue,
    },
    vehicleSegment: {
      fontSize: 8.5,
      color: colors.textSoft,
    },
    vehicleTitle: {
      fontSize: 12.5,
      fontWeight: '700',
      color: colors.textDark,
    },
    chipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      paddingTop: 2,
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      borderRadius: 999,
      backgroundColor: colors.track,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    chipText: {
      fontSize: 8,
      fontWeight: '500',
      color: colors.textSoft,
    },

    /* Add-ons */
    sectionLabel: {
      fontSize: 8.5,
      fontWeight: '600',
      color: colors.textSoft,
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      paddingTop: 2,
    },
    addonGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    addonTile: {
      width: '48%',
      flexGrow: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
      borderRadius: 10,
      borderWidth: 0.75,
      borderColor: colors.borderSoft,
      backgroundColor: colors.searchBg,
      paddingHorizontal: 9,
      paddingVertical: 8,
    },
    addonTileSelected: {
      borderColor: colors.actionTint35,
      backgroundColor: colors.actionTint06,
    },
    checkbox: {
      width: 14,
      height: 14,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxError: {
      borderColor: colors.error,
    },
    checkboxChecked: {
      backgroundColor: colors.actionBlue,
      borderColor: colors.actionBlue,
    },
    addonText: {
      flex: 1,
      fontSize: 9.5,
      fontWeight: '500',
      color: colors.textDark,
    },

    /* Pricing */
    promoBox: {
      borderRadius: 14,
      backgroundColor: colors.actionTint08,
      borderWidth: 0.75,
      borderColor: colors.actionTint15,
      padding: 12,
      gap: 8,
    },
    promoLabel: {
      fontSize: 9,
      fontWeight: '500',
      color: colors.textSoft,
    },
    promoChipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
    },
    promoChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      borderRadius: 999,
      borderWidth: 0.75,
      borderColor: colors.actionTint15,
      backgroundColor: colors.surface,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    promoChipActive: {
      borderColor: colors.actionBlue,
      backgroundColor: colors.actionTint12,
    },
    promoChipText: {
      fontSize: 8,
      fontWeight: '600',
      color: colors.actionBlue,
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    priceLabel: {
      fontSize: 10.5,
      color: colors.textSoft,
    },
    priceValue: {
      fontSize: 10.5,
      fontWeight: '600',
      color: colors.textDark,
    },
    priceStrong: {
      fontWeight: '700',
      color: colors.textDark,
    },
    divider: {
      height: 0.75,
      backgroundColor: colors.border,
      marginVertical: 3,
    },
    totalRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    totalLabel: {
      fontSize: 12.5,
      fontWeight: '700',
      color: colors.textDark,
    },
    totalValue: {
      fontSize: 19,
      fontWeight: '700',
      color: colors.actionBlue,
      letterSpacing: -0.4,
    },

    /* Payment */
    payMethodRow: {
      flexDirection: 'row',
      gap: 8,
    },
    payMethod: {
      flex: 1,
      minHeight: 56,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.borderSoft,
      backgroundColor: colors.surface,
      paddingHorizontal: 9,
      paddingVertical: 9,
      gap: 7,
      justifyContent: 'space-between',
    },
    payMethodSelected: {
      borderColor: colors.actionBlue,
      backgroundColor: colors.actionTint06,
    },
    payMethodLabel: {
      fontSize: 9.5,
      fontWeight: '500',
      color: colors.textDark,
    },

    /* Agreement */
    termsBox: {
      borderRadius: 14,
      backgroundColor: colors.searchBg,
      borderWidth: 0.75,
      borderColor: colors.borderSoft,
      padding: 12,
      gap: 10,
    },
    termTitle: {
      fontSize: 10,
      fontWeight: '700',
      color: colors.textDark,
      marginBottom: 3,
    },
    termBody: {
      fontSize: 9,
      color: colors.textSoft,
      lineHeight: 13,
    },
    agreeRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 9,
      borderRadius: 12,
      borderWidth: 0.75,
      borderColor: colors.borderSoft,
      backgroundColor: colors.surface,
      padding: 11,
    },
    agreeText: {
      flex: 1,
      fontSize: 9,
      color: colors.textSoft,
      lineHeight: 13,
    },
    signatureInput: {
      height: 31,
      borderRadius: 9,
      borderWidth: 0.75,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      paddingHorizontal: 10,
      paddingVertical: 0,
      fontSize: 10.5,
      fontStyle: 'italic',
      color: colors.textDark,
    },

    /* Live estimate */
    summaryCard: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      borderWidth: 0.75,
      borderColor: colors.borderSoft,
      padding: 16,
      gap: 10,
      shadowColor: '#0F172A',
      shadowOffset: {width: 0, height: 3},
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    summaryEyebrow: {
      fontSize: 8.5,
      fontWeight: '600',
      color: colors.textSoft,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    summaryTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.textDark,
      marginTop: 2,
    },
    summaryHero: {
      borderRadius: 12,
      backgroundColor: colors.actionTint08,
      padding: 11,
      gap: 9,
    },
    summaryHeroBlock: {
      gap: 2,
    },
    summaryHeroLabel: {
      fontSize: 8,
      fontWeight: '600',
      color: colors.textSoft,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
    },
    summaryHeroValue: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.textDark,
    },
    summaryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    summaryLabel: {
      fontSize: 10,
      color: colors.textSoft,
    },
    summaryValue: {
      fontSize: 10,
      fontWeight: '500',
      color: colors.textDark,
    },
    summaryTotalLabel: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.textDark,
    },
    summaryTotalValue: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.actionBlue,
    },
  });
