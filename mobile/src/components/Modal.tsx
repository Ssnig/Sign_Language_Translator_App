import { useEffect } from 'react';
import {
  Modal as RNModal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Colors, Radius, Shadow, Spacing, Typography } from '@/constants/theme';

export interface ModalProps {
  visible: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  /** Whether tapping the backdrop dismisses the modal. Defaults to true. */
  dismissOnBackdrop?: boolean;
}

/**
 * Centered modal sheet with an animated scale-in entrance.
 * Backdrop tap calls `onClose` unless `dismissOnBackdrop` is false.
 *
 * @example
 * <Modal visible={open} title="Select Speed" onClose={() => setOpen(false)}>
 *   <Text>Content here</Text>
 * </Modal>
 */
export const Modal: React.FC<ModalProps> = ({
  visible,
  title,
  children,
  onClose,
  dismissOnBackdrop = true,
}) => {
  const opacity = useSharedValue(0);
  const scale   = useSharedValue(0.92);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1,    { duration: 180 });
      scale.value   = withSpring(1,    { damping: 18, stiffness: 200 });
    } else {
      opacity.value = withTiming(0,    { duration: 160 });
      scale.value   = withTiming(0.92, { duration: 160 });
    }
  }, [visible, opacity, scale]);

  const overlayStyle  = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const contentStyle  = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <RNModal
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="none"
      statusBarTranslucent
    >
      {/* Backdrop */}
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={dismissOnBackdrop ? onClose : undefined}
          accessibilityLabel="Close modal"
        />

        {/* Sheet */}
        <Animated.View style={[styles.sheet, contentStyle]}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              accessibilityLabel="Close"
              accessibilityRole="button"
              hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
            >
              <Text style={styles.closeGlyph}>✕</Text>
            </TouchableOpacity>
          </View>

          {children}
        </Animated.View>
      </Animated.View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex:            1,
    backgroundColor: Colors.overlay,
    justifyContent:  'center',
    alignItems:      'center',
    padding:         Spacing.lg,
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderRadius:    Radius.xl,
    padding:         Spacing.lg,
    width:           '100%',
    borderWidth:     1,
    borderColor:     Colors.glassBorder,
    ...Shadow.lg,
  },
  header: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    marginBottom:   Spacing.md,
  },
  title:      { ...Typography.subheading, color: Colors.text },
  closeBtn:   { padding: Spacing.xs },
  closeGlyph: { ...Typography.bodyMedium, color: Colors.textSecondary },
});
