import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import Animated, {
  cancelAnimation, useAnimatedStyle, useSharedValue,
  withRepeat, withSequence, withTiming,
} from 'react-native-reanimated';
import { PlayIcon, PauseIcon } from './icons';
import { Colors, Radius, Shadow, Spacing, Typography } from '@/constants/theme';

export interface AudioPlayerProps {
  /** Text displayed below the player label (shown as the spoken phrase). */
  text: string;
  /** Label above the text. Defaults to "Myanmar Voice". */
  label?: string;
  /** Called when play is initiated. Wire to speech service here. */
  onPlay?: () => void;
  /** Called when the user pauses. */
  onPause?: () => void;
  style?: ViewStyle;
}

const PlayIconEl  = () => <PlayIcon />;
const PauseIconEl = () => <PauseIcon />;

/**
 * Compact audio player with animated wave ring.
 * Toggle play/pause via the circular button; the wave pulses while playing.
 * Wire `onPlay` / `onPause` to the speech service for real audio output.
 */
export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  text,
  label = 'Myanmar Voice',
  onPlay,
  onPause,
  style,
}) => {
  const [playing, setPlaying] = useState(false);
  const waveScale = useSharedValue(1);
  // Track animation state separately to avoid stale closure issues
  const isPlayingRef = useRef(false);

  useEffect(() => {
    if (playing) {
      waveScale.value = withRepeat(
        withSequence(
          withTiming(1.35, { duration: 420 }),
          withTiming(1.0,  { duration: 420 }),
        ),
        -1,
      );
    } else {
      cancelAnimation(waveScale);
      waveScale.value = withTiming(1, { duration: 200 });
    }
  }, [playing, waveScale]);

  const waveStyle = useAnimatedStyle(() => ({
    transform: [{ scale: waveScale.value }],
    opacity: playing ? 0.6 : 0,
  }));

  const handleToggle = () => {
    const next = !isPlayingRef.current;
    isPlayingRef.current = next;
    setPlaying(next);
    if (next) {
      onPlay?.();
    } else {
      onPause?.();
    }
  };

  return (
    <View style={[styles.container, style]}>
      {/* Play button with animated wave ring */}
      <View style={styles.buttonArea}>
        <Animated.View style={[styles.waveRing, waveStyle]} />
        <TouchableOpacity
          onPress={handleToggle}
          style={styles.playBtn}
          activeOpacity={0.85}
          accessibilityLabel={playing ? 'Pause audio' : 'Play audio'}
          accessibilityRole="button"
        >
          {playing ? <PauseIconEl /> : <PlayIconEl />}
        </TouchableOpacity>
      </View>

      {/* Text info */}
      <View style={styles.textArea}>
        <Text style={styles.playerLabel}>{label}</Text>
        <Text style={styles.phraseText} numberOfLines={2}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius:    Radius.xl,
    padding:         Spacing.md,
    borderWidth:     1,
    borderColor:     Colors.glassBorder,
    ...Shadow.sm,
  },
  buttonArea: {
    width: 56, height: 56,
    alignItems: 'center', justifyContent: 'center',
  },
  waveRing: {
    position:        'absolute',
    width: 56, height: 56,
    borderRadius:    28,
    backgroundColor: `${Colors.primary}35`,
  },
  playBtn: {
    width: 48, height: 48,
    borderRadius:    24,
    backgroundColor: Colors.primary,
    alignItems:      'center',
    justifyContent:  'center',
    ...Shadow.md,
  },
  textArea:    { flex: 1, gap: 2 },
  playerLabel: {
    ...Typography.small,
    color:          Colors.textSecondary,
    textTransform:  'uppercase',
    letterSpacing:  0.5,
  },
  phraseText: { ...Typography.bodyMedium, color: Colors.text },
});
