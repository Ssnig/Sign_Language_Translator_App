import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LanguageChip } from './LanguageChip';
import { Colors, Radius, Shadow, Spacing, Typography } from '@/constants/theme';
import type { Translation } from '@/types';

export interface TranslationCardProps {
  translation: Translation;
  /**
   * Renders a condensed layout: smaller padding, no confidence footer.
   * Use in lists where space is limited.
   */
  compact?: boolean;
  /** Called when the card is tapped. */
  onPress?: () => void;
  style?: ViewStyle;
}

/**
 * Displays a sign-to-Myanmar translation pair.
 * Full mode shows language chips, both texts, and confidence score.
 * Compact mode hides the confidence footer and reduces padding.
 */
export const TranslationCard: React.FC<TranslationCardProps> = ({
  translation,
  compact = false,
  onPress,
  style,
}) => {
  const card = (
    <Animated.View
      entering={FadeInUp.springify()}
      style={[styles.card, compact && styles.compact, style]}
    >
      {/* Language chip row */}
      <View style={styles.chips}>
        <LanguageChip label="ASL" variant="primary" />
        <View style={styles.arrowWrap}>
          <Text style={styles.arrow}>→</Text>
        </View>
        <LanguageChip label="Myanmar" variant="accent" />
      </View>

      {/* Text content */}
      <View style={styles.textGroup}>
        <Text style={styles.english}>{translation.englishText}</Text>
        <Text style={styles.myanmar}>{translation.myanmarText}</Text>
      </View>

      {/* Confidence footer (full mode only) */}
      {!compact && (
        <View style={styles.footer}>
          <View style={styles.confidenceRow}>
            <View style={styles.dot} />
            <Text style={styles.confidenceText}>
              {translation.confidence}% confidence
            </Text>
          </View>
        </View>
      )}
    </Animated.View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.75}>
        {card}
      </TouchableOpacity>
    );
  }

  return card;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius:    Radius.xl,
    padding:         Spacing.lg,
    gap:             Spacing.md,
    borderWidth:     1,
    borderColor:     Colors.glassBorder,
    ...Shadow.md,
  },
  compact: {
    padding: Spacing.md,
    gap:     Spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing.sm,
  },
  arrowWrap: { flex: 1 },
  arrow:     { color: Colors.textMuted, fontSize: 16, textAlign: 'center' },
  textGroup: { gap: Spacing.xs },
  english:   { ...Typography.bodyMedium, color: Colors.text },
  myanmar:   { ...Typography.heading,   color: Colors.text, fontWeight: '700' },
  footer: {
    borderTopWidth:  1,
    borderTopColor:  Colors.glassBorder,
    paddingTop:      Spacing.sm,
  },
  confidenceRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing.xs,
  },
  dot: {
    width: 7, height: 7,
    borderRadius:    4,
    backgroundColor: Colors.accent,
  },
  confidenceText: { ...Typography.caption, color: Colors.textSecondary },
});
