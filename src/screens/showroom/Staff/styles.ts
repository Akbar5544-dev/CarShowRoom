import {StyleSheet} from 'react-native';
import {type AppColors} from '../../../theme';

export const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
    gap: 16,
  },
  main: {
    paddingHorizontal: 20,
    gap: 17,
  },
  pageHeader: {
    gap: 14,
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
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 6,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 0.75,
    borderColor: colors.borderSoft,
    padding: 19,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 4.5,
    elevation: 2,
  },
  avgBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.badgeActiveBg,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 999,
  },
  avgText: {
    fontSize: 8,
    fontWeight: '600',
    color: colors.successBright,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
