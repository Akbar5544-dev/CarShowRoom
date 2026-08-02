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
    paddingBottom: 32,
    gap: 16,
  },
  main: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 16,
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
  },
  pageHeader: {
    marginTop: 8,
    gap: 3,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.actionBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    letterSpacing: -0.68,
    lineHeight: 30,
  },
  pageSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.textSoft,
    lineHeight: 18,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 0.75,
    borderColor: colors.borderSoft,
    padding: 10,
    width: '100%',
  },
  list: {
    gap: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 18,
    overflow: 'hidden',
    width: '100%',
  },
  itemActive: {
    backgroundColor: colors.actionBlue,
  },
  itemIcon: {
    zIndex: 1,
  },
  itemContent: {
    flex: 1,
    minWidth: 0,
    gap: 1,
    zIndex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
    lineHeight: 20,
  },
  itemTitleActive: {
    color: colors.white,
  },
  itemSubtitle: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.textSoft,
    lineHeight: 16,
  },
  itemSubtitleActive: {
    color: colors.white,
  },
});
