import { create } from 'zustand';
import type { HistoryItem } from '@/types';

const MOCK_HISTORY: HistoryItem[] = [
  { id: '1', englishText: 'Hello', myanmarText: 'မင်္ဂလာပါ', confidence: 98, timestamp: new Date('2025-06-29T10:00:00'), isFavorite: true },
  { id: '2', englishText: 'Thank you', myanmarText: 'ကျေးဇူးတင်ပါတယ်', confidence: 95, timestamp: new Date('2025-06-29T09:30:00'), isFavorite: false },
  { id: '3', englishText: 'Good morning', myanmarText: 'မင်္ဂလာနံနက်ခင်းပါ', confidence: 92, timestamp: new Date('2025-06-28T08:15:00'), isFavorite: true },
  { id: '4', englishText: 'How are you?', myanmarText: 'နေကောင်းလား?', confidence: 89, timestamp: new Date('2025-06-28T14:00:00'), isFavorite: false },
  { id: '5', englishText: 'My name is', myanmarText: 'ကျွန်တော်နာမည်', confidence: 94, timestamp: new Date('2025-06-27T11:00:00'), isFavorite: false },
  { id: '6', englishText: 'Goodbye', myanmarText: 'သွားတော့မယ်', confidence: 97, timestamp: new Date('2025-06-27T16:45:00'), isFavorite: true },
  { id: '7', englishText: 'Please', myanmarText: 'ကျေးဇူးပြု၍', confidence: 91, timestamp: new Date('2025-06-26T09:00:00'), isFavorite: false },
  { id: '8', englishText: 'Yes', myanmarText: 'ဟုတ်ကဲ့', confidence: 99, timestamp: new Date('2025-06-26T13:20:00'), isFavorite: false },
];

interface HistoryState {
  items: HistoryItem[];
  addItem: (item: HistoryItem) => void;
  removeItem: (id: string) => void;
  toggleFavorite: (id: string) => void;
  clearAll: () => void;
}

export const useHistoryStore = create<HistoryState>((set) => ({
  items: MOCK_HISTORY,
  addItem: (item) => set((s) => ({ items: [item, ...s.items] })),
  removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
  toggleFavorite: (id) =>
    set((s) => ({
      items: s.items.map((i) => (i.id === id ? { ...i, isFavorite: !i.isFavorite } : i)),
    })),
  clearAll: () => set({ items: [] }),
}));
