import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {type AppColors, spacing, typography, useThemedStyles, useThemeColors} from '../theme';

type ButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[styles.button, isDisabled && styles.disabled, style]}>
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={[styles.label, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

function createStyles(c: AppColors) {
  return StyleSheet.create({
  button: {
    backgroundColor: c.secondary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
  label: {
    ...typography.button,
    color: c.white,
  },
});
}
