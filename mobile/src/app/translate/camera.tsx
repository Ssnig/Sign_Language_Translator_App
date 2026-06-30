import { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { IconButton } from '@/components/IconButton';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useTranslationStore } from '@/store/translation.store';

const { width: SW, height: SH } = Dimensions.get('window');

// ─── Icons ────────────────────────────────────────────────────────────────────

const BackIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 18l-6-6 6-6"
      stroke={Colors.text} strokeWidth={2.5}
      strokeLinecap="round" strokeLinejoin="round"
    />
  </Svg>
);

const FlashOffIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path
      d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
      stroke={Colors.textSecondary} strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round"
    />
  </Svg>
);

const FlashOnIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path
      d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
      stroke={Colors.warning} strokeWidth={2}
      fill={`${Colors.warning}25`}
      strokeLinecap="round" strokeLinejoin="round"
    />
  </Svg>
);

const MicOffIcon = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Rect x={9} y={2} width={6} height={12} rx={3}
      stroke={Colors.textSecondary} strokeWidth={2} />
    <Path d="M5 10a7 7 0 0 0 14 0"
      stroke={Colors.textSecondary} strokeWidth={2} strokeLinecap="round" />
    <Path d="M12 19v3"
      stroke={Colors.textSecondary} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const MicOnIcon = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Rect x={9} y={2} width={6} height={12} rx={3}
      stroke={Colors.accent} strokeWidth={2} fill={`${Colors.accent}25`} />
    <Path d="M5 10a7 7 0 0 0 14 0"
      stroke={Colors.accent} strokeWidth={2} strokeLinecap="round" />
    <Path d="M12 19v3"
      stroke={Colors.accent} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const FlipIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 7h-9m0 0l3-3m-3 3l3 3M4 17h9m0 0l-3 3m3-3l-3-3"
      stroke={Colors.text} strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round"
    />
  </Svg>
);

// ─── Viewfinder overlay ───────────────────────────────────────────────────────

// Size of the detection zone drawn in the center of the preview
const ZONE_W = SW * 0.72;
const ZONE_H = SH * 0.42;
const ZONE_X = (SW - ZONE_W) / 2;
const ZONE_Y = (SH - ZONE_H) / 2 - 40; // slightly above center
const BRACKET = 28; // corner bracket arm length

const ViewfinderOverlay = ({ active }: { active: boolean }) => (
  <Svg
    width={SW} height={SH}
    viewBox={`0 0 ${SW} ${SH}`}
    style={StyleSheet.absoluteFill}
    pointerEvents="none"
  >
    {/* Dimmed outer mask — four rectangles around the detection zone */}
    <Rect x={0} y={0} width={SW} height={ZONE_Y}
      fill="rgba(0,0,0,0.55)" />
    <Rect x={0} y={ZONE_Y} width={ZONE_X} height={ZONE_H}
      fill="rgba(0,0,0,0.55)" />
    <Rect x={ZONE_X + ZONE_W} y={ZONE_Y} width={SW - ZONE_X - ZONE_W} height={ZONE_H}
      fill="rgba(0,0,0,0.55)" />
    <Rect x={0} y={ZONE_Y + ZONE_H} width={SW} height={SH - ZONE_Y - ZONE_H}
      fill="rgba(0,0,0,0.55)" />

    {/* Corner brackets */}
    {/* top-left */}
    <Path
      d={`M${ZONE_X} ${ZONE_Y + BRACKET} L${ZONE_X} ${ZONE_Y} L${ZONE_X + BRACKET} ${ZONE_Y}`}
      stroke={active ? Colors.accent : Colors.primary}
      strokeWidth={3} fill="none" strokeLinecap="round"
    />
    {/* top-right */}
    <Path
      d={`M${ZONE_X + ZONE_W - BRACKET} ${ZONE_Y} L${ZONE_X + ZONE_W} ${ZONE_Y} L${ZONE_X + ZONE_W} ${ZONE_Y + BRACKET}`}
      stroke={active ? Colors.accent : Colors.primary}
      strokeWidth={3} fill="none" strokeLinecap="round"
    />
    {/* bottom-left */}
    <Path
      d={`M${ZONE_X} ${ZONE_Y + ZONE_H - BRACKET} L${ZONE_X} ${ZONE_Y + ZONE_H} L${ZONE_X + BRACKET} ${ZONE_Y + ZONE_H}`}
      stroke={active ? Colors.accent : Colors.primary}
      strokeWidth={3} fill="none" strokeLinecap="round"
    />
    {/* bottom-right */}
    <Path
      d={`M${ZONE_X + ZONE_W - BRACKET} ${ZONE_Y + ZONE_H} L${ZONE_X + ZONE_W} ${ZONE_Y + ZONE_H} L${ZONE_X + ZONE_W} ${ZONE_Y + ZONE_H - BRACKET}`}
      stroke={active ? Colors.accent : Colors.primary}
      strokeWidth={3} fill="none" strokeLinecap="round"
    />

    {/* Center dot */}
    <Circle
      cx={ZONE_X + ZONE_W / 2}
      cy={ZONE_Y + ZONE_H / 2}
      r={3}
      fill={active ? Colors.accent : `${Colors.primary}80`}
    />
  </Svg>
);

// ─── Hand landmark placeholder ────────────────────────────────────────────────
// Mimics a detected hand bounding box with landmark dots

const HandLandmarkOverlay = () => {
  // Bounding box inside the detection zone
  const bx = ZONE_X + ZONE_W * 0.2;
  const by = ZONE_Y + ZONE_H * 0.15;
  const bw = ZONE_W * 0.6;
  const bh = ZONE_H * 0.7;

  // Approximate fingertip + knuckle positions (normalized 0-1 within bbox)
  const landmarks: [number, number][] = [
    // wrist
    [0.5, 0.95],
    // thumb
    [0.2, 0.75], [0.12, 0.6], [0.08, 0.45], [0.05, 0.32],
    // index
    [0.35, 0.65], [0.3, 0.45], [0.28, 0.3], [0.27, 0.12],
    // middle
    [0.5, 0.62], [0.5, 0.42], [0.5, 0.27], [0.5, 0.08],
    // ring
    [0.65, 0.65], [0.68, 0.45], [0.7, 0.3], [0.71, 0.14],
    // pinky
    [0.8, 0.7], [0.84, 0.53], [0.86, 0.4], [0.87, 0.28],
  ];

  // Skeleton connections: [from_index, to_index]
  const connections: [number, number][] = [
    [0,1],[1,2],[2,3],[3,4],
    [0,5],[5,6],[6,7],[7,8],
    [0,9],[9,10],[10,11],[11,12],
    [0,13],[13,14],[14,15],[15,16],
    [0,17],[17,18],[18,19],[19,20],
    [5,9],[9,13],[13,17],
  ];

  const pts = landmarks.map(([nx, ny]) => ({
    x: bx + nx * bw,
    y: by + ny * bh,
  }));

  return (
    <Svg width={SW} height={SH} viewBox={`0 0 ${SW} ${SH}`}
      style={StyleSheet.absoluteFill} pointerEvents="none">

      {/* Bounding box */}
      <Rect
        x={bx} y={by} width={bw} height={bh}
        stroke={Colors.accent} strokeWidth={1.5}
        fill={`${Colors.accent}08`}
        rx={8}
        strokeDasharray="6 4"
      />

      {/* Skeleton lines */}
      {connections.map(([a, b], i) => (
        <Path
          key={i}
          d={`M${pts[a].x} ${pts[a].y} L${pts[b].x} ${pts[b].y}`}
          stroke={`${Colors.accent}70`}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      ))}

      {/* Landmark dots */}
      {pts.map((p, i) => (
        <Circle
          key={i}
          cx={p.x} cy={p.y}
          r={i === 0 ? 5 : 3.5}
          fill={i === 0 ? Colors.primary : Colors.accent}
          opacity={0.9}
        />
      ))}
    </Svg>
  );
};

// ─── Scan line ────────────────────────────────────────────────────────────────

const ScanLine = () => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
      -1,
      true, // reverse — makes it bounce top↔bottom
    );
  }, [progress]);

  const lineStyle = useAnimatedStyle(() => ({
    transform: [{
      translateY: interpolate(progress.value, [0, 1], [ZONE_Y, ZONE_Y + ZONE_H]),
    }],
  }));

  return (
    <Animated.View style={[styles.scanLine, lineStyle]} pointerEvents="none">
      <View style={styles.scanLineGlow} />
    </Animated.View>
  );
};

// ─── Pulse ring (idle state) ──────────────────────────────────────────────────

const PulseRing = () => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.4, { duration: 1200, easing: Easing.out(Easing.ease) }),
        withTiming(1.0, { duration: 0 }),
      ),
      -1,
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 1200, easing: Easing.out(Easing.ease) }),
        withTiming(0.6, { duration: 0 }),
      ),
      -1,
    );
  }, [scale, opacity]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.pulseRing, ringStyle]} pointerEvents="none" />
  );
};

// ─── Status pill ──────────────────────────────────────────────────────────────

interface StatusPillProps {
  detecting: boolean;
  handDetected: boolean;
}

const StatusPill: React.FC<StatusPillProps> = ({ detecting, handDetected }) => {
  const dotColor = detecting
    ? handDetected ? Colors.accent : Colors.warning
    : Colors.textMuted;

  const label = detecting
    ? handDetected ? 'Hand detected — ready to capture' : 'Scanning for hand...'
    : 'Aim camera at your hand';

  return (
    <View style={styles.statusPill}>
      <Animated.View
        style={[styles.statusDot, { backgroundColor: dotColor }]}
      />
      <Text style={styles.statusText}>{label}</Text>
    </View>
  );
};

// ─── Camera placeholder ───────────────────────────────────────────────────────

const CameraPlaceholder = () => (
  <View style={styles.cameraPlaceholder}>
    <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
      <Path
        d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
        stroke={`${Colors.text}20`} strokeWidth={1.5}
      />
      <Circle cx={12} cy={13} r={4} stroke={`${Colors.text}20`} strokeWidth={1.5} />
    </Svg>
    <Text style={styles.placeholderTitle}>Camera Preview</Text>
    <Text style={styles.placeholderSub}>
      Camera feed will appear here{'\n'}when device permissions are granted
    </Text>
  </View>
);

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function CameraScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setStatus, setProcessing, reset } = useTranslationStore();

  const [flashOn, setFlashOn] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [handDetected, setHandDetected] = useState(false);

  const detectionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Ambient background pulse
  const ambientScale = useSharedValue(1);
  useEffect(() => {
    ambientScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.0, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
    );
  }, [ambientScale]);
  const ambientStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ambientScale.value }],
  }));

  // Bottom panel slide-in spring
  const panelY = useSharedValue(120);
  useEffect(() => {
    panelY.value = withSpring(0, { damping: 18, stiffness: 120 });
  }, [panelY]);
  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: panelY.value }],
  }));

  // Cleanup on unmount
  useEffect(() => () => {
    if (detectionTimer.current) clearTimeout(detectionTimer.current);
    if (navigationTimer.current) clearTimeout(navigationTimer.current);
  }, []);

  const handleStartDetecting = useCallback(() => {
    reset();
    setDetecting(true);
    setHandDetected(false);
    setStatus('detecting');
    setProcessing(true);

    // Simulate hand appearing after ~1.4s
    detectionTimer.current = setTimeout(() => {
      setHandDetected(true);
      setStatus('recognizing');

      // Navigate to processing after hand is "held steady" for 1.2s
      navigationTimer.current = setTimeout(() => {
        setStatus('translating');
        router.push('/translate/processing');
      }, 1200);
    }, 1400);
  }, [reset, setStatus, setProcessing, router]);

  const handleCancel = useCallback(() => {
    if (detectionTimer.current) clearTimeout(detectionTimer.current);
    if (navigationTimer.current) clearTimeout(navigationTimer.current);
    setDetecting(false);
    setHandDetected(false);
    reset();
  }, [reset]);

  return (
    <View style={styles.root}>

      {/* ── Camera background ── */}
      <View style={styles.cameraBg}>
        <Animated.View style={[styles.ambientGlow, ambientStyle]} />
        <CameraPlaceholder />
      </View>

      {/* ── Viewfinder with dimmed mask ── */}
      <ViewfinderOverlay active={detecting} />

      {/* ── Scan line (only while detecting) ── */}
      {detecting && <ScanLine />}

      {/* ── Pulse ring (idle, inside detection zone) ── */}
      {!detecting && <PulseRing />}

      {/* ── Hand landmark overlay (after hand detected) ── */}
      {handDetected && (
        <Animated.View entering={FadeIn.duration(300)} style={StyleSheet.absoluteFill}>
          <HandLandmarkOverlay />
        </Animated.View>
      )}

      {/* ── Top bar ── */}
      <Animated.View
        entering={FadeInDown.delay(100).springify()}
        style={[styles.topBar, { paddingTop: insets.top + Spacing.xs }]}
      >
        <IconButton
          icon={<BackIcon />}
          onPress={() => { handleCancel(); router.back(); }}
          size={44}
        />

        <View style={styles.topCenter}>
          <Text style={styles.topTitle}>Sign Detector</Text>
          {detecting && (
            <Animated.View entering={FadeIn} style={styles.recordingBadge}>
              <View style={styles.recordingDot} />
              <Text style={styles.recordingText}>LIVE</Text>
            </Animated.View>
          )}
        </View>

        <View style={styles.topActions}>
          <IconButton
            icon={flashOn ? <FlashOnIcon /> : <FlashOffIcon />}
            onPress={() => setFlashOn((f) => !f)}
            size={44}
            style={flashOn ? styles.flashActiveBtn : undefined}
          />
          <IconButton
            icon={<FlipIcon />}
            onPress={() => {}}
            size={44}
          />
        </View>
      </Animated.View>

      {/* ── Zone label ── */}
      <Animated.View
        entering={FadeInUp.delay(200).springify()}
        style={[styles.zoneLabel, { top: ZONE_Y - 36 }]}
        pointerEvents="none"
      >
        <Text style={styles.zoneLabelText}>DETECTION ZONE</Text>
      </Animated.View>

      {/* ── Bottom panel ── */}
      <Animated.View
        style={[
          styles.bottomPanel,
          panelStyle,
          { paddingBottom: Math.max(insets.bottom, Spacing.md) + Spacing.md },
        ]}
      >
        {/* Status pill */}
        <StatusPill detecting={detecting} handDetected={handDetected} />

        {/* Controls row */}
        <View style={styles.controls}>

          {/* Mic toggle */}
          <IconButton
            icon={micActive ? <MicOnIcon /> : <MicOffIcon />}
            onPress={() => setMicActive((m) => !m)}
            size={52}
            style={micActive ? styles.micActiveBtn : undefined}
          />

          {/* Primary action */}
          <View style={styles.mainActionWrap}>
            {detecting ? (
              <PrimaryButton
                label="Cancel"
                onPress={handleCancel}
                variant="secondary"
              />
            ) : (
              <PrimaryButton
                label="Start Detecting"
                onPress={handleStartDetecting}
              />
            )}
          </View>

        </View>

        {/* Hint */}
        {!detecting && (
          <Animated.View entering={FadeIn.delay(400)}>
            <Text style={styles.hint}>
              Hold your hand steady inside the frame
            </Text>
          </Animated.View>
        )}
      </Animated.View>

    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },

  // Camera background
  cameraBg: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#060D1A',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ambientGlow: {
    position: 'absolute',
    width: SW * 1.4,
    height: SW * 1.4,
    borderRadius: SW * 0.7,
    backgroundColor: `${Colors.primary}07`,
  },
  cameraPlaceholder: {
    alignItems: 'center',
    gap: Spacing.sm,
    opacity: 0.4,
  },
  placeholderTitle: {
    ...Typography.bodyMedium,
    color: Colors.text,
  },
  placeholderSub: {
    ...Typography.small,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },

  // Scan line
  scanLine: {
    position: 'absolute',
    left: ZONE_X,
    width: ZONE_W,
    height: 2,
    zIndex: 10,
  },
  scanLineGlow: {
    flex: 1,
    backgroundColor: Colors.accent,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 6,
  },

  // Pulse ring
  pulseRing: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: Colors.primary,
    top: ZONE_Y + ZONE_H / 2 - 28,
    left: SW / 2 - 28,
  },

  // Top bar
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  topCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  topTitle: {
    ...Typography.subheading,
    color: Colors.text,
  },
  recordingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: `${Colors.error}25`,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: `${Colors.error}50`,
  },
  recordingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.error,
  },
  recordingText: {
    ...Typography.label,
    color: Colors.error,
    fontSize: 10,
  },
  topActions: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  flashActiveBtn: {
    backgroundColor: `${Colors.warning}20`,
    borderColor: `${Colors.warning}60`,
  },

  // Zone label
  zoneLabel: {
    position: 'absolute',
    left: ZONE_X,
    width: ZONE_W,
    alignItems: 'center',
  },
  zoneLabelText: {
    ...Typography.label,
    color: `${Colors.primary}80`,
    fontSize: 10,
    letterSpacing: 2,
  },

  // Status pill
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: `${Colors.surface}CC`,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    alignSelf: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },

  // Bottom panel
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.glass,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    borderTopWidth: 1,
    borderColor: Colors.glassBorder,
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },

  // Controls row
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  mainActionWrap: {
    flex: 1,
  },
  micActiveBtn: {
    backgroundColor: `${Colors.accent}20`,
    borderColor: `${Colors.accent}60`,
  },

  // Hint
  hint: {
    ...Typography.small,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingBottom: Spacing.xs,
  },
});
