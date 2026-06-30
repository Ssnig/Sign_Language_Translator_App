import { useEffect } from 'react';
import { ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown, FadeInUp,
  useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming,
} from 'react-native-reanimated';
import { CheckIcon, CopyIcon, ShareIcon } from '@/components/icons';
import { Header } from '@/components/Header';
import { PrimaryButton } from '@/components/PrimaryButton';
import { AudioPlayer } from '@/components/AudioPlayer';
import { LanguageChip } from '@/components/LanguageChip';
import { AnimatedProgress } from '@/components/AnimatedProgress';
import { Toast } from '@/components/Toast';
import { Colors, Radius, Shadow, Spacing, Typography } from '@/constants/theme';
import { useTranslationStore } from '@/store/translation.store';
import { useHistoryStore } from '@/store/history.store';
import { useToast } from '@/hooks/use-toast';
import { generateId } from '@/utils/id';

export default function ResultScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentTranslation, reset } = useTranslationStore();
  const { addItem } = useHistoryStore();
  const { toast, showToast, hideToast } = useToast();

  const successScale = useSharedValue(0);
  const cardBorder   = useSharedValue(0);

  useEffect(() => {
    successScale.value = withSpring(1, { damping: 12 });
    cardBorder.value   = withSequence(
      withTiming(1,   { duration: 300 }),
      withTiming(0.3, { duration: 800 }),
    );
    if (currentTranslation) {
      // Persist to history with a fresh ID so duplicates don't collide
      addItem({ ...currentTranslation, id: generateId() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Only run once on mount
  }, []);

  const successStyle = useAnimatedStyle(() => ({
    transform: [{ scale: successScale.value }],
  }));
  const cardStyle = useAnimatedStyle(() => ({
    borderColor: `rgba(79, 70, 229, ${cardBorder.value})`,
  }));

  const handleCopy = () => showToast('Copied to clipboard', 'info');

  const handleShare = async () => {
    if (!currentTranslation) return;
    await Share.share({
      message: `${currentTranslation.englishText} → ${currentTranslation.myanmarText}`,
    });
  };

  const handleAgain = () => {
    reset();
    router.replace('/translate/camera');
  };

  if (!currentTranslation) {
    return (
      <View style={styles.root}>
        <Header title="Result" showBack onBack={() => router.replace('/')} />
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No translation found</Text>
          <PrimaryButton
            label="Try Again"
            onPress={() => router.replace('/translate/camera')}
            fullWidth={false}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <Header title="Translation Result" showBack onBack={() => router.replace('/')} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Success row */}
        <Animated.View entering={FadeInDown.springify()} style={styles.successRow}>
          <Animated.View style={successStyle}>
            <CheckIcon />
          </Animated.View>
          <Text style={styles.successText}>Translation Complete</Text>
        </Animated.View>

        {/* Main card */}
        <Animated.View entering={FadeInUp.delay(100).springify()} style={[styles.mainCard, cardStyle]}>
          <View style={styles.chips}>
            <LanguageChip label="Sign Language" variant="primary" />
            <Text style={styles.arrow}>→</Text>
            <LanguageChip label="Myanmar" variant="accent" />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Detected Sign</Text>
            <Text style={styles.englishText}>{currentTranslation.englishText}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Myanmar Translation</Text>
            <Text style={styles.myanmarText}>{currentTranslation.myanmarText}</Text>
          </View>

          <View style={styles.confidenceArea}>
            <AnimatedProgress
              progress={currentTranslation.confidence}
              label="Confidence Score"
              showPercent
            />
          </View>
        </Animated.View>

        {/* Audio */}
        <Animated.View entering={FadeInUp.delay(200).springify()}>
          <AudioPlayer text={currentTranslation.myanmarText} />
        </Animated.View>

        {/* Actions */}
        <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.actions}>
          <TouchableOpacity onPress={handleCopy}  style={styles.actionBtn}>
            <CopyIcon />
            <Text style={styles.actionLabel}>Copy</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.actionBtn}>
            <ShareIcon />
            <Text style={styles.actionLabel}>Share</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400).springify()}>
          <PrimaryButton label="Translate Again" onPress={handleAgain} />
        </Animated.View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>

      <Toast {...toast} onHide={hideToast} />
    </View>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, gap: Spacing.md },

  successRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: Spacing.sm, justifyContent: 'center',
    paddingVertical: Spacing.sm,
  },
  successText: { ...Typography.bodyMedium, color: Colors.accent },

  mainCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.glassBorder,
    ...Shadow.lg,
  },
  chips:   { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  arrow:   { flex: 1, textAlign: 'center', color: Colors.textMuted, fontSize: 16 },
  section: { gap: 4 },
  sectionLabel: { ...Typography.label, color: Colors.textMuted },
  englishText:  { ...Typography.subheading, color: Colors.text },
  myanmarText:  { fontSize: 32, fontWeight: '800', color: Colors.text, letterSpacing: 0.5 },
  divider:      { height: 1, backgroundColor: Colors.glassBorder },
  confidenceArea: { paddingTop: Spacing.xs },

  actions: { flexDirection: 'row', gap: Spacing.sm },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionLabel: { ...Typography.bodyMedium, color: Colors.textSecondary },
  empty:       { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.lg },
  emptyText:   { ...Typography.body, color: Colors.textSecondary },
});
