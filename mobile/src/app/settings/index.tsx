import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Svg, { Path, Circle } from 'react-native-svg';
import { Header } from '@/components/Header';
import { SettingItem } from '@/components/SettingItem';
import { Modal } from '@/components/Modal';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useSettingsStore } from '@/store/settings.store';
import type { VoiceSpeed, VoiceType, CameraQuality } from '@/types';

const MoonIcon = () => <Svg width={18} height={18} viewBox="0 0 24 24" fill="none"><Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke={Colors.primary} strokeWidth={2} /></Svg>;
const VolumeIcon = () => <Svg width={18} height={18} viewBox="0 0 24 24" fill="none"><Path d="M11 5L6 9H2v6h4l5 4V5z" stroke={Colors.primary} strokeWidth={2} /><Path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke={Colors.primary} strokeWidth={2} strokeLinecap="round" /></Svg>;
const MicIcon = () => <Svg width={18} height={18} viewBox="0 0 24 24" fill="none"><Path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke={Colors.primary} strokeWidth={2} /></Svg>;
const GlobeIcon = () => <Svg width={18} height={18} viewBox="0 0 24 24" fill="none"><Circle cx={12} cy={12} r={10} stroke={Colors.primary} strokeWidth={2} /><Path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke={Colors.primary} strokeWidth={2} /></Svg>;
const CameraIcon = () => <Svg width={18} height={18} viewBox="0 0 24 24" fill="none"><Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke={Colors.primary} strokeWidth={2} /><Circle cx={12} cy={13} r={4} stroke={Colors.primary} strokeWidth={2} /></Svg>;
const InfoIcon = () => <Svg width={18} height={18} viewBox="0 0 24 24" fill="none"><Circle cx={12} cy={12} r={10} stroke={Colors.primary} strokeWidth={2} /><Path d="M12 16v-4M12 8h.01" stroke={Colors.primary} strokeWidth={2} strokeLinecap="round" /></Svg>;

const SPEED_OPTIONS: VoiceSpeed[] = ['slow', 'normal', 'fast'];
const VOICE_OPTIONS: { value: VoiceType; label: string }[] = [
  { value: 'female_1', label: 'Female Voice 1' },
  { value: 'female_2', label: 'Female Voice 2' },
  { value: 'male_1', label: 'Male Voice 1' },
  { value: 'male_2', label: 'Male Voice 2' },
];
const QUALITY_OPTIONS: CameraQuality[] = ['low', 'medium', 'high'];

function OptionModal<T extends string>({
  visible, title, options, current, onSelect, onClose,
}: {
  visible: boolean;
  title: string;
  options: { value: T; label?: string }[];
  current: T;
  onSelect: (v: T) => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} title={title} onClose={onClose}>
      <View style={styles.optionList}>
        {options.map((opt) => (
          <Text
            key={opt.value}
            onPress={() => { onSelect(opt.value); onClose(); }}
            style={[styles.option, opt.value === current && styles.optionActive]}
          >
            {opt.label ?? opt.value.charAt(0).toUpperCase() + opt.value.slice(1)}
          </Text>
        ))}
      </View>
    </Modal>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const settings = useSettingsStore();
  const [modal, setModal] = useState<'speed' | 'voice' | 'quality' | null>(null);

  return (
    <View style={styles.root}>
      <Header title="Settings" />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 80 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.delay(50).springify()} style={styles.group}>
          <Text style={styles.groupLabel}>Appearance</Text>
          <SettingItem
            type="toggle"
            icon={<MoonIcon />}
            label="Dark Mode"
            description="App appearance"
            value={settings.darkMode}
            onToggle={(v) => settings.update({ darkMode: v })}
            style={styles.item}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.group}>
          <Text style={styles.groupLabel}>Voice</Text>
          <SettingItem
            type="action"
            icon={<VolumeIcon />}
            label="Voice Speed"
            value={settings.voiceSpeed}
            onPress={() => setModal('speed')}
            style={styles.item}
          />
          <View style={styles.separator} />
          <SettingItem
            type="action"
            icon={<MicIcon />}
            label="Voice Selection"
            value={VOICE_OPTIONS.find((v) => v.value === settings.voiceType)?.label}
            onPress={() => setModal('voice')}
            style={styles.item}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150).springify()} style={styles.group}>
          <Text style={styles.groupLabel}>Translation</Text>
          <SettingItem
            type="action"
            icon={<GlobeIcon />}
            label="Translation Language"
            value={settings.translationLanguage}
            onPress={() => {}}
            style={styles.item}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.group}>
          <Text style={styles.groupLabel}>Camera</Text>
          <SettingItem
            type="action"
            icon={<CameraIcon />}
            label="Camera Quality"
            value={settings.cameraQuality}
            onPress={() => setModal('quality')}
            style={styles.item}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(250).springify()} style={styles.group}>
          <Text style={styles.groupLabel}>About</Text>
          <SettingItem
            type="action"
            icon={<InfoIcon />}
            label="Version"
            value="1.0.0"
            onPress={() => {}}
            style={styles.item}
          />
        </Animated.View>
      </ScrollView>

      <BottomNavigation />

      <OptionModal
        visible={modal === 'speed'}
        title="Voice Speed"
        options={SPEED_OPTIONS.map((v) => ({ value: v }))}
        current={settings.voiceSpeed}
        onSelect={(v) => settings.update({ voiceSpeed: v })}
        onClose={() => setModal(null)}
      />
      <OptionModal
        visible={modal === 'voice'}
        title="Voice Selection"
        options={VOICE_OPTIONS}
        current={settings.voiceType}
        onSelect={(v) => settings.update({ voiceType: v })}
        onClose={() => setModal(null)}
      />
      <OptionModal
        visible={modal === 'quality'}
        title="Camera Quality"
        options={QUALITY_OPTIONS.map((v) => ({ value: v }))}
        current={settings.cameraQuality}
        onSelect={(v) => settings.update({ cameraQuality: v })}
        onClose={() => setModal(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, gap: Spacing.lg },
  group: { gap: Spacing.xs },
  groupLabel: { ...Typography.label, color: Colors.textMuted, paddingHorizontal: Spacing.xs, marginBottom: 4 },
  item: {},
  separator: { height: 1, backgroundColor: Colors.border, marginLeft: Spacing.xl + Spacing.md },
  optionList: { gap: Spacing.xs },
  option: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    padding: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Colors.background,
  },
  optionActive: {
    color: Colors.primary,
    backgroundColor: `${Colors.primary}15`,
    fontWeight: '600',
  },
});
