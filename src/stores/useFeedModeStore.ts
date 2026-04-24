import { create } from 'zustand';
import { FeedMode } from '@/types';

interface FeedModeState {
  mode: FeedMode;
  selectedTopic: string;
  setMode: (mode: FeedMode) => void;
  setSelectedTopic: (topic: string) => void;
}

export const useFeedModeStore = create<FeedModeState>((set) => ({
  mode: 'chronological',
  selectedTopic: '',
  setMode: (mode) => set({ mode }),
  setSelectedTopic: (topic) => set({ selectedTopic: topic }),
}));
