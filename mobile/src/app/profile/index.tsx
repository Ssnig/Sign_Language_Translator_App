import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Header } from '@/components/Header';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Colors, Radius, Shadow, Spacing, Typography } from '@/constants/theme';
import { useHistoryStore } from '@/store/history.store';

const MOCK_USER = {
  username: 'Demo User',
  joinedAt: new Date('2025-01-01'),
};

const AvatarPlaceholder = () => (
  <Svg width={88} height={88} viewBox="0 0 88 88">
    <Defs>
      <LinearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor={Colors.primary} />
        <Stop offset="100%" stopColor="#7C3AED" />
      </LinearGradient>
    </Defs>
    <Circle cx={44} cy={44} r={44} fill="url(#avatarGrad)" />
    <Circle cx={44} cy={36} r={14} fill="rgba(255,255,255,0.9)" />
    <Path d="M16 72c0-15.46 12.54-28 28-28s28 12.54 28 28" fill="rgba(255,255,255,0.9)" />
  </Svg>
);

const SettingsIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={3} stroke={Colors.textSecondary} strokeWidth={2} />
    <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33" stroke={Colors.textSecondary} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const items = useHistoryStore((s) => s.items);
  const favorites = items.filter((i) => i.isFavorite).length;

  const stats = [
    { value: items.length.toString(), label: 'Total Translations' },
    { value: favorites.toString(), label: 'Favorite Phrases' },
    { value: '98%', label: 'Avg. Accuracy' },
  ];

  return (
    <View style={styles.root}>
      <Header
        title="Profile"
        rightAction={
          <TouchableOpacity onPress={() => router.push('/settings' as Href)} style={styles.settingsBtn}>
            <SettingsIcon />
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 80 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile card */}
        <Animated.View entering={FadeInDown.delay(50).springify()} style={styles.profileCard}>
          <View style={styles.avatarRing}>
            <AvatarPlaceholder />
          </View>
          <Text style={styles.username}>{MOCK_USER.username}</Text>
          <Text style={styles.joinDate}>
            Member since {MOCK_USER.joinedAt.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
          </Text>

          {/* Badge */}
          <View style={styles.badge}>
            <View style={[styles.badgeDot, { backgroundColor: Colors.accent }]} />
            <Text style={styles.badgeText}>Active Translator</Text>
          </View>
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInDown.delay(150).springify()}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, i) => (
              <Animated.View
                key={stat.label}
                entering={FadeInUp.delay(i * 80).springify()}
                style={styles.statCard}
              >
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Recent Activity */}
        <Animated.View entering={FadeInDown.delay(250).springify()}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            {items.slice(0, 5).map((item, i) => (
              <View key={item.id} style={styles.activityRow}>
                <View style={styles.activityDot} />
                <View style={styles.activityText}>
                  <Text style={styles.activityPrimary}>{item.englishText} → {item.myanmarText}</Text>
                  <Text style={styles.activityTime}>
                    {new Date(item.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </Text>
                </View>
                <Text style={styles.activityScore}>{item.confidence}%</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Quick settings */}
        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <TouchableOpacity onPress={() => router.push('/settings' as Href)} style={styles.settingsLink}>
            <Text style={styles.settingsLinkText}>Go to Settings</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, gap: Spacing.lg },
  profileCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    ...Shadow.md,
  },
  avatarRing: {
    padding: 3,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginBottom: Spacing.sm,
  },
  username: { ...Typography.heading, color: Colors.text },
  joinDate: { ...Typography.caption, color: Colors.textSecondary },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: `${Colors.accent}15`,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    marginTop: Spacing.xs,
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { ...Typography.small, color: Colors.accent, fontWeight: '600' },
  sectionTitle: { ...Typography.subheading, color: Colors.text, marginBottom: Spacing.sm },
  statsGrid: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  statCard: {
    flex: 1,
    minWidth: '28%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  statValue: { ...Typography.heading, color: Colors.primary },
  statLabel: { ...Typography.small, color: Colors.textSecondary, textAlign: 'center' },
  activityList: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.glassBorder,
  },
  activityDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  activityText: { flex: 1, gap: 2 },
  activityPrimary: { ...Typography.caption, color: Colors.text },
  activityTime: { ...Typography.small, color: Colors.textMuted },
  activityScore: { ...Typography.small, color: Colors.accent, fontWeight: '600' },
  settingsBtn: { padding: Spacing.xs },
  settingsLink: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  settingsLinkText: { ...Typography.bodyMedium, color: Colors.primary },
});
