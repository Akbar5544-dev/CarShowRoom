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
    marginTop: 8,
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
  directoryList: {
    gap: 12,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSoft,
    fontSize: 12,
    paddingVertical: 16,
  },
});
