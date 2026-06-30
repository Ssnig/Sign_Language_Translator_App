import {
  ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  AppLogoIcon, SettingsIcon, CameraIcon, HistoryIcon, ProfileIcon,
} from '@/components/icons';
import { PrimaryButton } from '@/components/PrimaryButton';
import { IconButton } from '@/components/IconButton';
import { SectionTitle } from '@/components/SectionTitle';
import { TranslationCard } from '@/components/TranslationCard';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Colors, Radius, Shadow, Spacing, Typography } from '@/constants/theme';
import { useHistoryStore } from '@/store/history.store';

// ─── Sub-components ───────────────────────────────────────────────────────────

interface StatCardProps {
  value: string;
  label: string;
  accent?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ value, label, accent }) => (
  <View style={[styles.statCard, accent && styles.statCardAccent]}>
    <Text style={[styles.statValue, accent && styles.statValueAccent]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

interface HeroCardProps { onStart: () => void }

const HeroCard: React.FC<HeroCardProps> = ({ onStart }) => (
  <View style={styles.heroCard}>
    <View style={styles.heroGlow} />
    <AppLogoIcon size={64} />
    <View style={styles.heroText}>
      <Text style={styles.heroTitle}>Sign Language{'\n'}to Myanmar</Text>
      <Text style={styles.heroDesc}>
        Point your camera at sign gestures and get instant Myanmar translations with voice output.
      </Text>
    </View>
    <PrimaryButton label="Start Translation" onPress={onStart} style={styles.heroBtn} />
    <View style={styles.heroHint}>
      <View style={[styles.hintDot, { backgroundColor: Colors.accent }]} />
      <Text style={styles.hintText}>AI-powered · Real-time · Voice output</Text>
    </View>
  </View>
);

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}

const QuickAction: React.FC<QuickActionProps> = ({ icon, label, onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.75} style={styles.quickAction}>
    <View style={styles.quickActionIcon}>{icon}</View>
    <Text style={styles.quickActionLabel}>{label}</Text>
  </TouchableOpacity>
);

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const items         = useHistoryStore((s) => s.items);
  const recentItems   = items.slice(0, 3);
  const totalCount    = items.length;
  const favoriteCount = items.filter((i) => i.isFavorite).length;
  const avgAccuracy   = totalCount > 0
    ? Math.round(items.reduce((sum, i) => sum + i.confidence, 0) / totalCount)
    : 0;

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.md }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Top bar */}
        <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.topBar}>
          <View>
            <Text style={styles.greeting}>Welcome back 👋</Text>
            <Text style={styles.appName}>Sign Translator</Text>
          </View>
          <IconButton
            icon={<SettingsIcon color={Colors.textSecondary} />}
            onPress={() => router.push('/settings' as Href)}
            accessibilityLabel="Settings"
          />
        </Animated.View>

        {/* Hero */}
        <Animated.View entering={FadeInDown.delay(80).springify()}>
          <HeroCard onStart={() => router.push('/translate/camera')} />
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInDown.delay(160).springify()} style={styles.statsRow}>
          <StatCard value={String(totalCount)}    label="Translations" />
          <StatCard value={`${avgAccuracy}%`}     label="Accuracy" accent />
          <StatCard value={String(favoriteCount)} label="Favorites" />
        </Animated.View>

        {/* Quick actions */}
        <Animated.View entering={FadeInDown.delay(220).springify()} style={styles.quickRow}>
          <QuickAction
            icon={<HistoryIcon color={Colors.primary} size={20} />}
            label="History"
            onPress={() => router.push('/history' as Href)}
          />
          <QuickAction
            icon={<CameraIcon color={Colors.primary} size={20} />}
            label="Camera"
            onPress={() => router.push('/translate/camera')}
          />
          <QuickAction
            icon={<ProfileIcon color={Colors.primary} size={20} />}
            label="Profile"
            onPress={() => router.push('/profile' as Href)}
          />
        </Animated.View>

        {/* Recent translations */}
        {recentItems.length > 0 && (
          <Animated.View entering={FadeInDown.delay(280).springify()}>
            <SectionTitle
              title="Recent Translations"
              action={
                <TouchableOpacity onPress={() => router.push('/history' as Href)}>
                  <Text style={styles.seeAll}>See all</Text>
                </TouchableOpacity>
              }
            />
            {recentItems.map((item) => (
              <TranslationCard key={item.id} translation={item} compact style={styles.card} />
            ))}
          </Animated.View>
        )}

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>

      <BottomNavigation />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: Colors.background },
  scroll:  { flex: 1 },
  content: { paddingHorizontal: Spacing.md, gap: Spacing.lg },

  topBar:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { ...Typography.caption,  color: Colors.textSecondary },
  appName:  { ...Typography.heading,  color: Colors.text },

  heroCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    overflow: 'hidden',
    ...Shadow.lg,
  },
  heroGlow: {
    position: 'absolute',
    top: -60, left: -60, right: -60,
    height: 220,
    backgroundColor: `${Colors.primary}08`,
    borderRadius: 999,
  },
  heroText:  { alignItems: 'center', gap: Spacing.sm },
  heroTitle: { ...Typography.title, color: Colors.text, textAlign: 'center' },
  heroDesc:  { ...Typography.body,  color: Colors.textSecondary, textAlign: 'center', lineHeight: 24 },
  heroBtn:   { marginTop: Spacing.xs },
  heroHint:  { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  hintDot:   { width: 6, height: 6, borderRadius: 3 },
  hintText:  { ...Typography.small, color: Colors.textMuted },

  statsRow: { flexDirection: 'row', gap: Spacing.sm },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  statCardAccent:  { borderColor: `${Colors.primary}40`, backgroundColor: `${Colors.primary}0D` },
  statValue:       { ...Typography.heading, color: Colors.primary },
  statValueAccent: { color: Colors.accent },
  statLabel:       { ...Typography.small, color: Colors.textSecondary, textAlign: 'center' },

  quickRow: { flexDirection: 'row', gap: Spacing.sm },
  quickAction: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  quickActionIcon: {
    width: 40, height: 40,
    borderRadius: 12,
    backgroundColor: `${Colors.primary}18`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: { ...Typography.small, color: Colors.textSecondary, fontWeight: '500' },

  seeAll: { ...Typography.caption, color: Colors.primary, fontWeight: '600' },
  card:   { marginBottom: Spacing.sm },
});
