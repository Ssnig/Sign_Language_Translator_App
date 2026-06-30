import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Colors, Shadow } from '@/constants/theme';

/** Visual style of the button background. */
export type IconButtonVariant = 'filled' | 'glass' | 'ghost';

export interface IconButtonProps {
  /** SVG icon or any ReactNode to render centered. */
  icon: React.ReactNode;
  onPress: () => void;
  variant?: IconButtonVariant;
  /** Diameter of the circular button. Defaults to 48. */
  size?: number;
  /** Accessibility label for screen readers. */
  accessibilityLabel?: string;
  style?: ViewStyle;
}

/**
 * Circular icon button with spring press animation.
 * Use `variant="filled"` for primary actions, `"glass"` for camera overlays,
 * and `"ghost"` for minimal surfaces.
 */
export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  variant = 'glass',
  size = 48,
  accessibilityLabel,
  style,
}) => {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity
        onPress={onPress}
        // eslint-disable-next-line react-hooks/immutability -- Reanimated useSharedValue requires direct mutation
        onPressIn={() => { scale.value = withSpring(0.88, { damping: 15 }); }}
        // eslint-disable-next-line react-hooks/immutability -- Reanimated useSharedValue requires direct mutation
        onPressOut={() => { scale.value = withSpring(1,    { damping: 15 }); }}
        activeOpacity={1}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        style={[
          styles.base,
          { width: size, height: size, borderRadius: size / 2 },
          variant === 'filled' && styles.filled,
          variant === 'glass'  && styles.glass,
          style,
        ]}
      >
        {icon}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  filled: {
    backgroundColor: Colors.primary,
    ...Shadow.md,
  },
  glass: {
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    ...Shadow.sm,
  },
});
