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
    paddingBottom: 28,
    gap: 16,
  },
  main: {
    paddingHorizontal: 20,
    gap: 16,
  },
  pageHeader: {
    gap: 12,
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
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 27,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 0.75,
    borderColor: colors.borderSoft,
  },
  secondaryBtnText: {
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
    padding: 18,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.08,
    shadowRadius: 4.5,
    elevation: 2,
  },
  sectionEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginTop: 3,
  },
  pickupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  pickupRowLast: {
    borderBottomWidth: 0,
  },
  pickupIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickupInfo: {
    flex: 1,
    gap: 1,
  },
  pickupName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textDark,
  },
  pickupVehicle: {
    fontSize: 11,
    color: colors.textSoft,
  },
  pickupMeta: {
    alignItems: 'flex-end',
    gap: 1,
  },
  pickupWhen: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textDark,
  },
  pickupId: {
    fontSize: 10,
    color: colors.textSoft,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
