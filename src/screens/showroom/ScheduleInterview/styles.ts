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
    gap: 14,
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
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 0.75,
    borderColor: colors.borderSoft,
    padding: 16,
    gap: 14,
    shadowColor: '#0B152C',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 1,
  },
  fieldsGrid: {
    gap: 12,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: 10,
  },
  field: {
    flex: 1,
    gap: 6,
  },
  fieldFull: {
    gap: 6,
  },
  label: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.textSoft,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  inputWrap: {
    height: 40,
    borderRadius: 12,
    borderWidth: 0.75,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: colors.textDark,
    paddingVertical: 0,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.track,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textDark,
  },
  submitBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.actionBlue,
  },
  submitBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.white,
  },
});
