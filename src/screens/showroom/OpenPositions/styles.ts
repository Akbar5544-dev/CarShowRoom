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
    flexGrow: 1,
    paddingBottom: 40,
    gap: 16,
  },
  main: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    paddingHorizontal: 20,
    gap: 14,
  },
  pageHeader: {
    marginTop: 8,
    gap: 12,
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
    minWidth: 0,
    gap: 2,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  pageSubtitle: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.textSoft,
    lineHeight: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 30,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.actionBlue,
  },
  primaryBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.white,
  },
  list: {
    gap: 12,
  },
  jobCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 0.75,
    borderColor: colors.borderSoft,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    gap: 12,
    shadowColor: '#0B152C',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  jobTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  jobTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  jobMeta: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.textSoft,
    marginTop: -4,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  salaryText: {
    marginLeft: 'auto',
    fontSize: 12,
    fontWeight: '700',
    color: colors.actionBlue,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  jobFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  viewApplicantsBtn: {
    height: 32,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: colors.actionBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewApplicantsText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
});
