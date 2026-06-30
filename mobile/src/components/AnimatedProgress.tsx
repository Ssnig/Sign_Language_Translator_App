import { useEffect } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

export interface AnimatedProgressProps {
  /** Value between 0 and 100. */
  progress: number;
  /** Label shown on the left above the track. */
  label?: string;
  /** Shows the numeric percentage on the right above the track. */
  showPercent?: boolean;
  /** Accent color for the filled portion. Defaults to primary. */
  color?: string;
  /** Height of the progress track in pixels. Defaults to 6. */
  trackHeight?: number;
  style?: ViewStyle;
}

/**
 * Animated horizontal progress bar.
 * The fill width transitions smoothly whenever `progress` changes.
 *
 * @example
 * <AnimatedProgress progress={75} label="Confidence" showPercent />
 */
export const AnimatedProgress: React.FC<AnimatedProgressProps> = ({
  progress,
  label,
  showPercent = false,
  color = Colors.primary,
  trackHeight = 6,
  style,
}) => {
  // Clamp to valid range
  const clamped = Math.min(100, Math.max(0, progress));
  const widthPct = useSharedValue(0);

  useEffect(() => {
    widthPct.value = withTiming(clamped, {
      duration: 600,
      easing: Easing.out(Easing.exp),
    });
  }, [clamped, widthPct]);

  // Use scaleX instead of width-percent to stay on the UI thread
  const fillStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: widthPct.value / 100 }],
  }));

  return (
    <View style={[styles.container, style]}>
      {(label || showPercent) && (
        <View style={styles.header}>
          {label     ? <Text style={styles.label}>{label}</Text>          : null}
          {showPercent ? <Text style={[styles.percent, { color }]}>{Math.round(clamped)}%</Text> : null}
        </View>
      )}
      <View style={[styles.track, { height: trackHeight }]}>
        {/* Full-width base so scaleX anchors from the left */}
        <Animated.View
          style={[
            styles.fill,
            fillStyle,
            { backgroundColor: color, height: trackHeight },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: Spacing.xs },
  header:    { flexDirection: 'row', justifyContent: 'space-between' },
  label:     { ...Typography.caption, color: Colors.textSecondary },
  percent:   { ...Typography.caption, fontWeight: '600' },
  track: {
    backgroundColor: Colors.border,
    borderRadius:    Radius.full,
    overflow:        'hidden',
  },
  fill: {
    width:           '100%',
    borderRadius:    Radius.full,
    transformOrigin: 'left',   // keep scale anchored at start
  },
});
