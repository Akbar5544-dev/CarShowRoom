import {StyleSheet} from 'react-native';
import {type AppColors} from '../../../theme';

export const createStyles = (c: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: 28,
      gap: 22,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 16,
      gap: 12,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flexShrink: 1,
    },
    logoBadge: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: c.brandBlue,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dateLabel: {
      fontSize: 11,
      color: c.textSecondary,
      letterSpacing: 0.55,
      textTransform: 'uppercase',
    },
    welcome: {
      fontSize: 16,
      fontWeight: '700',
      color: c.text,
      marginTop: 2,
    },
    welcomeName: {
      color: c.secondary,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    iconButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: c.surface,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#0B152C',
      shadowOffset: {width: 0, height: 8},
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 3,
    },
    notificationDot: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: c.notification,
    },
    section: {
      gap: 12,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      gap: 12,
    },
    sectionTitle: {
      flex: 1,
      fontSize: 19,
      fontWeight: '700',
      color: c.textDark,
      letterSpacing: -0.4,
    },
    seeAll: {
      fontSize: 12,
      fontWeight: '600',
      color: c.actionBlue,
    },
    grid: {
      paddingHorizontal: 20,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    gridItem: {
      width: '48%',
      flexGrow: 1,
      maxWidth: '48.5%',
    },
    railContent: {
      paddingHorizontal: 20,
      gap: 12,
    },
    railItem: {
      width: 210,
    },
  });

export const createCardStyles = (c: AppColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: c.surface,
      borderRadius: 18,
      borderWidth: 0.75,
      borderColor: c.borderSoft,
      overflow: 'hidden',
      shadowColor: '#0F172A',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.07,
      shadowRadius: 10,
      elevation: 2,
    },
    imageWrap: {
      height: 116,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 10,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    badgeRow: {
      position: 'absolute',
      top: 8,
      left: 8,
      right: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 6,
      zIndex: 2,
    },
    badgeGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      flexShrink: 1,
    },
    badge: {
      paddingHorizontal: 7,
      paddingVertical: 3,
      borderRadius: 999,
    },
    badgeText: {
      fontSize: 7.5,
      fontWeight: '800',
      letterSpacing: 0.4,
      textTransform: 'uppercase',
    },
    body: {
      paddingHorizontal: 10,
      paddingTop: 10,
      paddingBottom: 11,
      gap: 9,
    },
    title: {
      fontSize: 11.5,
      fontWeight: '700',
      color: c.textDark,
      lineHeight: 15,
    },
    subtitle: {
      fontSize: 8.5,
      color: c.textSoft,
      marginTop: 2,
    },
    specsRow: {
      flexDirection: 'row',
      gap: 4,
    },
    specPill: {
      flex: 1,
      minWidth: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 3,
      height: 24,
      borderRadius: 8,
      backgroundColor: c.searchBg,
      borderWidth: 0.75,
      borderColor: c.borderSoft,
      paddingHorizontal: 3,
    },
    specLabel: {
      fontSize: 7.5,
      fontWeight: '600',
      color: c.textDark,
      flexShrink: 1,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: c.border,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 8,
    },
    showroomBlock: {
      flex: 1,
      minWidth: 0,
      gap: 2,
    },
    showroomRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    showroomName: {
      fontSize: 8.5,
      fontWeight: '700',
      color: c.textDark,
      flexShrink: 1,
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
    },
    locationLabel: {
      fontSize: 7.5,
      color: c.textSoft,
      flexShrink: 1,
    },
    priceBlock: {
      alignItems: 'flex-end',
    },
    price: {
      fontSize: 11,
      fontWeight: '800',
      color: c.actionBlue,
      letterSpacing: -0.2,
    },
    priceSuffix: {
      fontSize: 6.5,
      fontWeight: '700',
      color: c.textSoft,
      letterSpacing: 0.4,
      marginTop: 1,
    },
  });
