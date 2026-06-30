import { create } from 'zustand';
import type { AppSettings } from '@/types';

interface SettingsState extends AppSettings {
  update: (partial: Partial<AppSettings>) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  darkMode: true,
  voiceSpeed: 'normal',
  voiceType: 'female_1',
  translationLanguage: 'Myanmar',
  cameraQuality: 'high',
  update: (partial) => set((s) => ({ ...s, ...partial })),
}));
