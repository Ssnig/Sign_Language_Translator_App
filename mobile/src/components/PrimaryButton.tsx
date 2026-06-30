import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Colors, Radius, Shadow, Spacing, Typography } from '@/constants/theme';

/** Variant controls the visual style of the button. */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export interface PrimaryButtonProps {
  /** Button label text. */
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  /** Shows an ActivityIndicator and disables interaction. */
  loading?: boolean;
  disabled?: boolean;
  /** Stretches button to fill parent width. Defaults to true. */
  fullWidth?: boolean;
  /** Extra style applied to the outer Animated.View wrapper. */
  style?: ViewStyle;
}

/**
 * Primary action button with spring press animation.
 * Supports three visual variants: filled (primary), outlined (secondary), and text (ghost).
 */
export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = true,
  style,
}) => {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const bgColor =
    variant === 'primary'   ? Colors.primary :
    variant === 'secondary' ? Colors.surface :
    'transparent';

  const borderColor =
    variant === 'secondary' ? Colors.border :
    variant === 'ghost'     ? Colors.primary :
    'transparent';

  const labelColor =
    variant === 'ghost' ? Colors.primary : Colors.text;

  return (
    <Animated.View style={[animStyle, fullWidth ? styles.full : styles.inline, style]}>
      <TouchableOpacity
        onPress={onPress}
        // eslint-disable-next-line react-hooks/immutability -- Reanimated useSharedValue requires direct mutation
        onPressIn={() => { scale.value = withSpring(0.96, { damping: 15 }); }}
        // eslint-disable-next-line react-hooks/immutability -- Reanimated useSharedValue requires direct mutation
        onPressOut={() => { scale.value = withSpring(1, { damping: 15 }); }}
        disabled={disabled || loading}
        activeOpacity={1}
        style={[
          styles.button,
          {
            backgroundColor: bgColor,
            borderColor,
            borderWidth: variant !== 'primary' ? 1.5 : 0,
          },
          (disabled || loading) && styles.disabled,
        ]}
      >
        {loading
          ? <ActivityIndicator color={Colors.text} size="small" />
          : <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
        }
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  full:   { width: '100%' },
  inline: { alignSelf: 'flex-start' },
  button: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    ...Shadow.md,
  },
  label:    { ...Typography.bodyMedium, fontWeight: '600' },
  disabled: { opacity: 0.4 },
});
