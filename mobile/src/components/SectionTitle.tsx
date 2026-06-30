import { StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing, Typography } from '@/constants/theme';

export interface SectionTitleProps {
  title: string;
  /** Optional subdued subtitle below the title. */
  subtitle?: string;
  /** Optional right-aligned slot — commonly a "See all" link. */
  action?: React.ReactNode;
}

/**
 * Section heading row used above lists or grouped content.
 * Accepts an optional right-side action slot.
 */
export const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle, action }) => (
  <View style={styles.container}>
    <View style={styles.textGroup}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
    {action}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  textGroup: { gap: 2 },
  title:    { ...Typography.subheading, color: Colors.text },
  subtitle: { ...Typography.caption,    color: Colors.textSecondary },
});
