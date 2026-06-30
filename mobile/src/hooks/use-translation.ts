import { useTranslationStore } from '@/store/translation.store';
import { useHistoryStore } from '@/store/history.store';
import { generateId } from '@/utils/id';
import type { Translation } from '@/types';

/**
 * Convenience hook that wraps translation store actions
 * and wires up history persistence.
 */
export function useTranslation() {
  const store = useTranslationStore();
  const addToHistory = useHistoryStore((s) => s.addItem);

  function completeTranslation(result: Omit<Translation, 'id' | 'timestamp' | 'isFavorite'>) {
    const translation: Translation = {
      ...result,
      id: generateId(),
      timestamp: new Date(),
      isFavorite: false,
    };
    store.setTranslation(translation);
    store.setStatus('complete');
    store.setProcessing(false);
    addToHistory(translation);
    return translation;
  }

  return {
    ...store,
    completeTranslation,
  };
}
