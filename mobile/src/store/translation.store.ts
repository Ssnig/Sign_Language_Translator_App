import { create } from 'zustand';
import type { Translation, TranslationStatus } from '@/types';

interface TranslationState {
  currentTranslation: Translation | null;
  status: TranslationStatus;
  isProcessing: boolean;
  setTranslation: (t: Translation) => void;
  setStatus: (s: TranslationStatus) => void;
  setProcessing: (v: boolean) => void;
  reset: () => void;
}

export const useTranslationStore = create<TranslationState>((set) => ({
  currentTranslation: null,
  status: 'idle',
  isProcessing: false,
  setTranslation: (t) => set({ currentTranslation: t }),
  setStatus: (s) => set({ status: s }),
  setProcessing: (v) => set({ isProcessing: v }),
  reset: () => set({ currentTranslation: null, status: 'idle', isProcessing: false }),
}));
