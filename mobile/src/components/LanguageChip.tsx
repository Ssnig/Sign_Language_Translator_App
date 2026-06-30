import { StyleSheet, Text, View } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

export type LanguageChipVariant = 'primary' | 'accent' | 'muted';

export interface LanguageChipProps {
  label: string;
  variant?: LanguageChipVariant;
}

/**
 * Small pill badge used to indicate a language or label category.
 * Variants: `primary` (indigo), `accent` (green), `muted` (surface grey).
 */
export const LanguageChip: React.FC<LanguageChipProps> = ({ label, variant = 'primary' }) => {
  const bgColor =
    variant === 'primary' ? `${Colors.primary}25` :
    variant === 'accent'  ? `${Colors.accent}25`  :
    Colors.surface;

  const textColor =
    variant === 'primary' ? Colors.primaryLight :
    variant === 'accent'  ? Colors.accent        :
    Colors.textSecondary;

  return (
    <View style={[styles.chip, { backgroundColor: bgColor }]}>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical:   Spacing.xs + 2,
    borderRadius:      Radius.full,
  },
  label: { ...Typography.small, fontWeight: '600' },
});
