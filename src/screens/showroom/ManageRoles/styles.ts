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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.actionBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
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
    lineHeight: 18,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: colors.actionBlue,
  },
  createBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  list: {
    gap: 12,
  },
  roleCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 0.75,
    borderColor: colors.borderSoft,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    gap: 12,
    shadowColor: '#0B152C',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  roleTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleMenuBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleBody: {
    gap: 4,
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
  },
  roleDescription: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.textSoft,
    lineHeight: 18,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  roleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userCount: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.actionBlue,
  },
  manageText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.actionBlue,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 13,
    color: colors.textSoft,
    paddingVertical: 24,
  },
});
