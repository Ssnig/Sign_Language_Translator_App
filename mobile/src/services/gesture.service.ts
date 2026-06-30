// TODO: Integrate with AI gesture recognition model
export const gestureService = {
  /**
   * TODO: Send camera frame to gesture detection model
   * Returns detected hand landmarks and gesture class
   */
  detectGesture: async (_frameData: unknown): Promise<string> => {
    throw new Error('Not implemented');
  },

  /**
   * TODO: Start real-time gesture detection stream
   */
  startStream: async (): Promise<void> => {
    throw new Error('Not implemented');
  },

  /**
   * TODO: Stop gesture detection stream
   */
  stopStream: async (): Promise<void> => {
    throw new Error('Not implemented');
  },
};
