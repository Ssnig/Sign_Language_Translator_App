import type { VoiceSpeed, VoiceType } from '@/types';

// TODO: Integrate with TTS (Text-to-Speech) API
export const speechService = {
  /**
   * TODO: Generate audio from Myanmar text using TTS engine
   */
  generateSpeech: async (_text: string, _voiceType: VoiceType, _speed: VoiceSpeed): Promise<string> => {
    throw new Error('Not implemented');
  },

  /**
   * TODO: Play audio from URL using expo-av
   */
  playAudio: async (_audioUrl: string): Promise<void> => {
    throw new Error('Not implemented');
  },

  /**
   * TODO: Stop currently playing audio
   */
  stopAudio: async (): Promise<void> => {
    throw new Error('Not implemented');
  },
};
