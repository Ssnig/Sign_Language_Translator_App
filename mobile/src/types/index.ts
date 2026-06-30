export interface Translation {
  id: string;
  englishText: string;
  myanmarText: string;
  confidence: number;
  timestamp: Date;
  isFavorite: boolean;
  audioUrl?: string;
}

export interface HistoryItem extends Translation {
  duration?: number;
}

export type TranslationStatus =
  | 'idle'
  | 'detecting'
  | 'recognizing'
  | 'translating'
  | 'generating_speech'
  | 'complete'
  | 'error';

export type VoiceSpeed = 'slow' | 'normal' | 'fast';
export type CameraQuality = 'low' | 'medium' | 'high';
export type VoiceType = 'female_1' | 'female_2' | 'male_1' | 'male_2';

export interface AppSettings {
  darkMode: boolean;
  voiceSpeed: VoiceSpeed;
  voiceType: VoiceType;
  translationLanguage: string;
  cameraQuality: CameraQuality;
}

export interface UserProfile {
  id: string;
  username: string;
  avatarUrl?: string;
  totalTranslations: number;
  favoritePhrases: number;
  joinedAt: Date;
}
