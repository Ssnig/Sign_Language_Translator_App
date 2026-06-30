import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackIcon } from './icons';
import { IconButton } from './IconButton';
import { Colors, Spacing, Typography } from '@/constants/theme';

export interface HeaderProps {
  title: string;
  /** Renders a back chevron that calls router.back() or onBack if provided. */
  showBack?: boolean;
  /** Custom back handler. If provided, overrides router.back(). */
  onBack?: () => void;
  /** Slot for a right-side action (e.g. an IconButton). */
  rightAction?: React.ReactNode;
  /** When true the background is transparent (useful over scroll content). */
  transparent?: boolean;
  style?: ViewStyle;
}

/**
 * Screen-level header with optional back button and right action slot.
 * Automatically accounts for safe area top inset.
 */
export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBack,
  rightAction,
  transparent = false,
  style,
}) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + Spacing.sm },
        !transparent && styles.solidBg,
        style,
      ]}
    >
      <View style={styles.row}>
        {showBack ? (
          <IconButton
            icon={<BackIcon />}
            onPress={onBack || (() => router.back())}
            size={40}
            accessibilityLabel="Go back"
          />
        ) : (
          <View style={styles.placeholder} />
        )}

        <Text style={styles.title} numberOfLines={1}>{title}</Text>

        <View style={styles.rightSlot}>
          {rightAction ?? <View style={styles.placeholder} />}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  solidBg: {
    backgroundColor: Colors.background,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    ...Typography.subheading,
    color: Colors.text,
    flex: 1,
    textAlign: 'center',
  },
  rightSlot: {
    alignItems: 'flex-end',
    minWidth: 40,
  },
  placeholder: {
    width: 40,
  },
});
