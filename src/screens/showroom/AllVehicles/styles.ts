import {StyleSheet} from 'react-native';
import {type AppColors} from '../../../theme';

export const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 28,
    gap: 12,
  },
  main: {
    paddingHorizontal: 20,
    gap: 16,
  },
  pageHeader: {
    marginTop: 8,
    gap: 4,
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
  rentalsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 4,
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
  searchWrap: {
    flex: 1,
    maxWidth: 168,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.searchBg,
    borderWidth: 0.75,
    borderColor: colors.borderSoft,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 11,
    color: colors.textDark,
    paddingVertical: 0,
  },
  rentalItem: {
    paddingHorizontal: 20,
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
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
});
