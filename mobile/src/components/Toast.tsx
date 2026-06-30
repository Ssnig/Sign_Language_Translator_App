import { useEffect } from 'react';
import { StyleSheet, Text, ViewStyle } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Colors, Radius, Shadow, Spacing, Typography } from '@/constants/theme';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
  message: string;
  type?: ToastType;
  visible: boolean;
  /** Called when the toast finishes its exit animation. Set visible=false here. */
  onHide: () => void;
  /** Auto-dismiss delay in milliseconds. Defaults to 2500. */
  duration?: number;
  /** Override position from the bottom of the screen. Defaults to 100. */
  bottomOffset?: number;
  style?: ViewStyle;
}

const BG: Record<ToastType, string> = {
  success: Colors.accent,
  error:   Colors.error,
  info:    Colors.primary,
};

/**
 * Non-blocking notification that slides up from the bottom and auto-dismisses.
 *
 * IMPORTANT: Render this at the root level of the screen (outside scroll views)
 * so `position: absolute` stacks correctly.
 *
 * @example
 * const { toast, showToast, hideToast } = useToast();
 * <Toast {...toast} onHide={hideToast} />
 */
export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  visible,
  onHide,
  duration = 2500,
  bottomOffset = 100,
  style,
}) => {
  const opacity    = useSharedValue(0);
  const translateY = useSharedValue(16);

  useEffect(() => {
    if (!visible) return;

    // Enter
    opacity.value    = withTiming(1,  { duration: 220 });
    translateY.value = withTiming(0,  { duration: 220 });

    // Auto-exit after duration
    const timer = setTimeout(() => {
      opacity.value    = withTiming(0,  { duration: 220 });
      translateY.value = withTiming(16, { duration: 220 }, () => {
        runOnJS(onHide)();
      });
    }, duration);

    return () => clearTimeout(timer);
  }, [visible, duration, opacity, translateY, onHide]);

  const animStyle = useAnimatedStyle(() => ({
    opacity:   opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  // Always render — hooks must not be conditional
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.toast,
        { backgroundColor: BG[type], bottom: bottomOffset },
        animStyle,
        style,
      ]}
    >
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position:          'absolute',
    alignSelf:         'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical:   Spacing.sm + 4,
    borderRadius:      Radius.full,
    ...Shadow.md,
  },
  message: { ...Typography.bodyMedium, color: Colors.text },
});
