import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { LoadingAnimation } from '@/components/LoadingAnimation';
import { AnimatedProgress } from '@/components/AnimatedProgress';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useTranslationStore } from '@/store/translation.store';
import type { TranslationStatus } from '@/types';

const STEPS: { status: TranslationStatus; label: string; duration: number }[] = [
  { status: 'detecting', label: 'Detecting hand...', duration: 1200 },
  { status: 'recognizing', label: 'Recognizing gesture...', duration: 1400 },
  { status: 'translating', label: 'Translating to Myanmar...', duration: 1200 },
  { status: 'generating_speech', label: 'Generating speech...', duration: 1000 },
  { status: 'complete', label: 'Complete!', duration: 500 },
];

export default function ProcessingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setStatus, setTranslation } = useTranslationStore();
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let current = 0;

    const runStep = (index: number) => {
      if (index >= STEPS.length) return;
      const step = STEPS[index];
      setStatus(step.status);
      setProgress(((index + 1) / STEPS.length) * 100);

      setTimeout(() => {
        current = index + 1;
        setStepIndex(current);
        if (step.status === 'complete') {
          // Inject mock translation result
          setTranslation({
            id: Date.now().toString(),
            englishText: 'Hello',
            myanmarText: 'မင်္ဂလာပါ',
            confidence: 98,
            timestamp: new Date(),
            isFavorite: false,
          });
          router.replace('/translate/result');
        } else {
          runStep(current);
        }
      }, step.duration);
    };

    runStep(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Only run once on mount
  }, []);

  const currentStep = STEPS[Math.min(stepIndex, STEPS.length - 1)];

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <Animated.View entering={FadeIn} style={styles.content}>
        <Text style={styles.title}>Processing</Text>
        <Text style={styles.subtitle}>Please hold steady...</Text>

        <View style={styles.animationArea}>
          <LoadingAnimation status={currentStep?.status ?? 'detecting'} />
        </View>

        <View style={styles.progressArea}>
          <AnimatedProgress progress={progress} label={currentStep?.label} showPercent />
        </View>

        <View style={styles.stepList}>
          {STEPS.slice(0, -1).map((step, i) => (
            <View key={step.status} style={styles.stepRow}>
              <View style={[
                styles.stepDot,
                i < stepIndex && styles.stepDone,
                i === stepIndex && styles.stepActive,
              ]} />
              <Text style={[
                styles.stepLabel,
                i < stepIndex && styles.stepLabelDone,
                i === stepIndex && styles.stepLabelActive,
              ]}>
                {step.label}
              </Text>
            </View>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl, gap: Spacing.lg },
  title: { ...Typography.title, color: Colors.text },
  subtitle: { ...Typography.body, color: Colors.textSecondary },
  animationArea: { marginVertical: Spacing.lg },
  progressArea: { width: '100%' },
  stepList: { width: '100%', gap: Spacing.sm },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  stepDot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: Colors.border,
  },
  stepActive: { backgroundColor: Colors.primary },
  stepDone: { backgroundColor: Colors.accent },
  stepLabel: { ...Typography.body, color: Colors.textMuted },
  stepLabelActive: { color: Colors.text },
  stepLabelDone: { color: Colors.textSecondary },
});
