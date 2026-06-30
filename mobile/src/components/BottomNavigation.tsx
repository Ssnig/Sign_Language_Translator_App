import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { usePathname, useRouter, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { HomeIcon, CameraIcon, HistoryIcon, ProfileIcon } from './icons';
import { Colors, Radius, Shadow, Spacing, Typography } from '@/constants/theme';

// ─── Nav item definition ──────────────────────────────────────────────────────

interface NavItemDef {
  label: string;
  href: string;
  Icon: React.FC<{ color: string; filled?: boolean }>;
}

const NAV_ITEMS: NavItemDef[] = [
  { label: 'Home',    href: '/',                 Icon: HomeIcon    },
  { label: 'Camera',  href: '/translate/camera', Icon: CameraIcon  },
  { label: 'History', href: '/history',           Icon: HistoryIcon },
  { label: 'Profile', href: '/profile',           Icon: ProfileIcon },
];

// ─── Single tab ───────────────────────────────────────────────────────────────

const NavTab: React.FC<NavItemDef & { active: boolean }> = ({
  label, href, active, Icon,
}) => {
  const router = useRouter();
  const scale  = useSharedValue(1);
  const color  = active ? Colors.primary : Colors.textSecondary;

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <TouchableOpacity
      onPress={() => router.push(href as Href)}
      // eslint-disable-next-line react-hooks/immutability -- Reanimated useSharedValue requires direct mutation
      onPressIn={() => { scale.value = withSpring(0.85, { damping: 14 }); }}
      // eslint-disable-next-line react-hooks/immutability -- Reanimated useSharedValue requires direct mutation
      onPressOut={() => { scale.value = withSpring(1,    { damping: 14 }); }}
      activeOpacity={1}
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      style={styles.tab}
    >
      <Animated.View style={[styles.tabInner, animStyle]}>
        {active && <View style={styles.indicator} />}
        <Icon color={color} filled={active} />
        <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
          {label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

// ─── Bottom navigation bar ────────────────────────────────────────────────────

/**
 * Fixed bottom navigation bar with four tabs.
 * Active tab is derived from the current Expo Router pathname.
 * Renders above the device home indicator using safe-area inset.
 */
export const BottomNavigation: React.FC = () => {
  const insets   = useSafeAreaInsets();
  const pathname = usePathname();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + Spacing.xs }]}>
      {NAV_ITEMS.map((item) => (
        <NavTab
          key={item.href}
          {...item}
          active={
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href)
          }
        />
      ))}
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    paddingTop: Spacing.sm + 2,
    paddingHorizontal: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.glassBorder,
    ...Shadow.md,
  },
  tab:      { flex: 1, alignItems: 'center' },
  tabInner: { alignItems: 'center', gap: 3, paddingVertical: Spacing.xs },
  indicator: {
    position: 'absolute',
    top: -(Spacing.sm + 2),
    width: 24,
    height: 3,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
  },
  tabLabel:       { ...Typography.small, color: Colors.textSecondary },
  tabLabelActive: { color: Colors.primary, fontWeight: '600' },
});
