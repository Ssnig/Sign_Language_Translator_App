import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { HeartIcon, TrashIcon } from './icons';
import { Colors, Radius, Shadow, Spacing, Typography } from '@/constants/theme';
import { formatRelativeDate } from '@/utils/format';
import type { HistoryItem } from '@/types';

export interface HistoryCardProps {
  item: HistoryItem;
  /**
   * Position index used to stagger the entrance animation.
   * Pass 0 when index is unknown.
   */
  index?: number;
  onFavorite: () => void;
  onDelete: () => void;
  /** Called when the card body is tapped. */
  onPress?: () => void;
}

const HeartFilled = () => <HeartIcon color={Colors.accent} filled />;
const HeartEmpty  = () => <HeartIcon color={Colors.textSecondary} />;
const Trash       = () => <TrashIcon />;

/**
 * Card representing a single history entry.
 * Displays sign/translation pair, relative date, confidence badge,
 * and favorite/delete action buttons.
 */
export const HistoryCard: React.FC<HistoryCardProps> = ({
  item,
  index = 0,
  onFavorite,
  onDelete,
  onPress,
}) => (
  <Animated.View
    entering={FadeInRight.delay(Math.min(index, 8) * 60).springify()}
    style={styles.card}
  >
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.75 : 1}
      style={styles.body}
    >
      <View style={styles.textGroup}>
        <Text style={styles.english}>{item.englishText}</Text>
        <Text style={styles.myanmar}>{item.myanmarText}</Text>
        <Text style={styles.date}>{formatRelativeDate(new Date(item.timestamp))}</Text>
      </View>
      <View style={styles.badge}>
        <Text style={styles.confidence}>{item.confidence}%</Text>
      </View>
    </TouchableOpacity>

    <View style={styles.actions}>
      <TouchableOpacity
        onPress={onFavorite}
        style={styles.actionBtn}
        accessibilityLabel={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {item.isFavorite ? <HeartFilled /> : <HeartEmpty />}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onDelete}
        style={styles.actionBtn}
        accessibilityLabel="Delete translation"
      >
        <Trash />
      </TouchableOpacity>
    </View>
  </Animated.View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius:    Radius.lg,
    padding:         Spacing.md,
    marginBottom:    Spacing.sm,
    borderWidth:     1,
    borderColor:     Colors.glassBorder,
    flexDirection:   'row',
    alignItems:      'center',
    gap:             Spacing.sm,
    ...Shadow.sm,
  },
  body: {
    flex:          1,
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing.sm,
  },
  textGroup: { flex: 1, gap: 2 },
  english:   { ...Typography.bodyMedium, color: Colors.text },
  myanmar:   { ...Typography.caption,    color: Colors.textSecondary },
  date:      { ...Typography.small,      color: Colors.textMuted, marginTop: 2 },
  badge: {
    backgroundColor:  `${Colors.accent}20`,
    paddingHorizontal: Spacing.sm,
    paddingVertical:   3,
    borderRadius:      Radius.full,
  },
  confidence: { ...Typography.small, color: Colors.accent, fontWeight: '600' },
  actions:    { flexDirection: 'row', gap: Spacing.xs },
  actionBtn:  { padding: Spacing.xs + 2 },
});
