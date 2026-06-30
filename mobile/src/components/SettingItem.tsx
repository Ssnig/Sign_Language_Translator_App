import { StyleSheet, Switch, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { ChevronRightIcon } from './icons';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

interface BaseProps {
  /** Optional icon rendered in a tinted square pill. */
  icon?: React.ReactNode;
  label: string;
  /** Secondary description line below the label. */
  description?: string;
  style?: ViewStyle;
}

interface ToggleProps extends BaseProps {
  type: 'toggle';
  value: boolean;
  onToggle: (value: boolean) => void;
}

interface ActionProps extends BaseProps {
  type: 'action';
  /** Current value string shown before the chevron (e.g. "Normal"). */
  value?: string;
  onPress: () => void;
}

export type SettingItemProps = ToggleProps | ActionProps;

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * A single settings row.
 *
 * - `type="toggle"` — renders a Switch on the right.
 * - `type="action"` — renders a current-value string + chevron; the whole row is tappable.
 *
 * @example
 * <SettingItem type="toggle" label="Dark Mode" value={dark} onToggle={setDark} />
 * <SettingItem type="action" label="Voice Speed" value="Normal" onPress={openPicker} />
 */
export const SettingItem: React.FC<SettingItemProps> = (props) => {
  const rowContent = (
    <View style={[styles.row, props.style]}>
      {props.icon ? <View style={styles.iconWrap}>{props.icon}</View> : null}

      <View style={styles.labelGroup}>
        <Text style={styles.label}>{props.label}</Text>
        {props.description ? <Text style={styles.description}>{props.description}</Text> : null}
      </View>

      {props.type === 'toggle' ? (
        <Switch
          value={props.value}
          onValueChange={props.onToggle}
          trackColor={{ true: Colors.primary, false: Colors.border }}
          thumbColor={Colors.text}
          accessibilityLabel={props.label}
        />
      ) : (
        <View style={styles.actionRight}>
          {props.value ? <Text style={styles.currentValue}>{props.value}</Text> : null}
          <ChevronRightIcon />
        </View>
      )}
    </View>
  );

  if (props.type === 'action') {
    return (
      <TouchableOpacity
        onPress={props.onPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={props.label}
      >
        {rowContent}
      </TouchableOpacity>
    );
  }

  return rowContent;
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: `${Colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelGroup:   { flex: 1, gap: 2 },
  label:        { ...Typography.bodyMedium, color: Colors.text },
  description:  { ...Typography.small,      color: Colors.textSecondary },
  actionRight:  { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  currentValue: { ...Typography.caption,    color: Colors.textSecondary },
});
