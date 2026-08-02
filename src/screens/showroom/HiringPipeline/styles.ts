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
    fontSize: 12,
    fontWeight: '400',
    color: colors.textSoft,
    lineHeight: 16,
  },
  columnsList: {
    gap: 12,
  },
  columnCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 14,
    gap: 12,
  },
  columnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  columnTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textDark,
  },
  countBadge: {
    minWidth: 28,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: colors.track,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  candidatesList: {
    gap: 8,
  },
  candidateRow: {
    borderRadius: 12,
    backgroundColor: colors.track,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 2,
  },
  candidateName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textDark,
  },
  candidateMeta: {
    fontSize: 10,
    fontWeight: '400',
    color: colors.textSoft,
  },
  moreText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSoft,
    textAlign: 'center',
    marginTop: 2,
  },
});
