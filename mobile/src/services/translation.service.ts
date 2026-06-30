import type { Translation } from '@/types';

// TODO: Integrate with translation API
export const translationService = {
  /**
   * TODO: Translate detected English sign gesture to Myanmar text
   */
  translate: async (_englishText: string): Promise<Translation> => {
    throw new Error('Not implemented');
  },

  /**
   * TODO: Fetch translation history from backend
   */
  getHistory: async (): Promise<Translation[]> => {
    throw new Error('Not implemented');
  },

  /**
   * TODO: Save translation to backend
   */
  saveTranslation: async (_translation: Translation): Promise<void> => {
    throw new Error('Not implemented');
  },
};
