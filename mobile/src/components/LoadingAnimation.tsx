import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Colors, Spacing, Typography } from '@/constants/theme';
import type { TranslationStatus } from '@/types';

// ─── Status copy ──────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<TranslationStatus, string> = {
  idle:             'Ready',
  detecting:        'Detecting hand...',
  recognizing:      'Recognizing gesture...',
  translating:      'Translating...',
  generating_speech:'Generating speech...',
  complete:         'Complete',
  error:            'Error occurred',
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LoadingAnimationProps {
  status: TranslationStatus;
}

// ─── Pulse dot ────────────────────────────────────────────────────────────────

const PulseDot: React.FC<{ delay: number }> = ({ delay }) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    // Offset start time by cancelling and re-scheduling after delay
    const t = setTimeout(() => {
      opacity.value = withRepeat(
        withSequence(
          withTiming(1,   { duration: 450 }),
          withTiming(0.3, { duration: 450 }),
        ),
        -1,
      );
    }, delay);
    return () => clearTimeout(t);
  }, [delay, opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return <Animated.View style={[styles.dot, style]} />;
};

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * Animated processing indicator used on the processing screen.
 * Shows a spinning outer ring, pulsing glow, scan-line, and status text.
 *
 * @example
 * <LoadingAnimation status="translating" />
 */
export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ status }) => {
  const pulse    = useSharedValue(0);
  const scanLine = useSharedValue(0);
  const rotate   = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
    );

    // Bounce scan line top↔bottom using reverse repeat
    scanLine.value = withRepeat(
      withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );

    rotate.value = withRepeat(
      withTiming(1, { duration: 2400, easing: Easing.linear }),
      -1,
    );
  }, [pulse, scanLine, rotate]);

  const outerStyle = useAnimatedStyle(() => ({
    opacity:   interpolate(pulse.value, [0, 1], [0.3, 1]),
    transform: [{ scale: interpolate(pulse.value, [0, 1], [0.92, 1.0]) }],
  }));

  // translateY instead of top-% string — runs on UI thread
  const scanStyle = useAnimatedStyle(() => ({
    transform: [{
      translateY: interpolate(scanLine.value, [0, 1], [0, 96]),
    }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value * 360}deg` }],
  }));

  return (
    <View style={styles.container}>
      {/* Orb */}
      <View style={styles.orb}>
        <Animated.View style={[styles.outerRing, outerStyle]} />
        <Animated.View style={[styles.spinRing, ringStyle]} />
        <View style={styles.innerCircle}>
          <Animated.View style={[styles.scanLine, scanStyle]} />
        </View>
      </View>

      {/* Status text */}
      <Text style={styles.status}>{STATUS_LABELS[status]}</Text>

      {/* Staggered pulse dots */}
      <View style={styles.dots}>
        <PulseDot delay={0}   />
        <PulseDot delay={180} />
        <PulseDot delay={360} />
      </View>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: Spacing.lg },

  orb: {
    width: 160, height: 160,
    alignItems: 'center', justifyContent: 'center',
  },
  outerRing: {
    position:  'absolute',
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: `${Colors.primary}15`,
    borderWidth: 1.5, borderColor: `${Colors.primary}40`,
  },
  spinRing: {
    position: 'absolute',
    width: 130, height: 130, borderRadius: 65,
    borderWidth: 2,
    borderColor:      'transparent',
    borderTopColor:   Colors.primary,
    borderRightColor: `${Colors.primary}50`,
  },
  innerCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: Colors.surface,
    overflow: 'hidden',
    borderWidth: 1, borderColor: Colors.glassBorder,
    justifyContent: 'flex-start',
  },
  scanLine: {
    width: '100%', height: 2,
    backgroundColor: Colors.accent,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
  },

  status: { ...Typography.bodyMedium, color: Colors.text },

  dots: { flexDirection: 'row', gap: Spacing.xs },
  dot:  { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
});
