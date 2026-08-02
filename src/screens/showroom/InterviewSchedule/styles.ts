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
    gap: 16,
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
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  primaryBtn: {
    height: 30,
    borderRadius: 10,
    backgroundColor: colors.actionBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: 12,
  },
  primaryBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.white,
  },
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 0.75,
    borderColor: colors.borderSoft,
    padding: 16,
    gap: 14,
    shadowColor: '#0B152C',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  cardMain: {
    flex: 1,
    gap: 3,
  },
  candidateName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textDark,
  },
  position: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.textSoft,
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
  metaList: {
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaIcon: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  secondaryBtn: {
    height: 30,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 0.75,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  secondaryBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textDark,
  },
  joinBtn: {
    height: 30,
    borderRadius: 10,
    backgroundColor: colors.actionBlue,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  joinBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.white,
  },
});
