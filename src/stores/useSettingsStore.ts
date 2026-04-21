import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface FeedConfig {
  defaultType: 'chronological' | 'topic-filtered' | 'curated';
  defaultScope: 'everyone' | 'people-you-follow' | 'topics-you-follow';
  paginationSize: 10 | 25 | 50;
  languages: string[];
  showReplyThreadsInline: boolean;
  collapseLongPosts: boolean;
}

interface ProvenanceConfig {
  tagDefaultState: 'collapsed' | 'expanded' | 'full-chain';
  colorCoding: boolean;
  showFundingWarnings: 'always' | 'funded-only' | 'never';
  proportionalityOverlay: boolean;
  sourceConcentrationWarnings: boolean;
}

interface AccessibilityConfig {
  interfaceLanguage: string;
  textSize: 'small' | 'medium' | 'large' | 'extra-large';
  highContrast: boolean;
  reduceMotion: boolean;
  altTextReminder: boolean;
  screenReaderOptimised: boolean;
  keyboardHints: boolean;
}

interface SettingsState {
  feed: FeedConfig;
  provenance: ProvenanceConfig;
  accessibility: AccessibilityConfig;
  
  // Actions
  updateFeed: (config: Partial<FeedConfig>) => void;
  updateProvenance: (config: Partial<ProvenanceConfig>) => void;
  updateAccessibility: (config: Partial<AccessibilityConfig>) => void;
  resetAll: () => void;
}

const DEFAULT_FEED: FeedConfig = {
  defaultType: 'chronological',
  defaultScope: 'everyone',
  paginationSize: 25,
  languages: ['en'],
  showReplyThreadsInline: true,
  collapseLongPosts: true,
};

const DEFAULT_PROVENANCE: ProvenanceConfig = {
  tagDefaultState: 'collapsed',
  colorCoding: true,
  showFundingWarnings: 'funded-only',
  proportionalityOverlay: false,
  sourceConcentrationWarnings: true,
};

const DEFAULT_ACCESSIBILITY: AccessibilityConfig = {
  interfaceLanguage: 'en',
  textSize: 'medium',
  highContrast: false,
  reduceMotion: false,
  altTextReminder: true,
  screenReaderOptimised: false,
  keyboardHints: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      feed: DEFAULT_FEED,
      provenance: DEFAULT_PROVENANCE,
      accessibility: DEFAULT_ACCESSIBILITY,

      updateFeed: (config) =>
        set((state) => ({ feed: { ...state.feed, ...config } })),
      
      updateProvenance: (config) =>
        set((state) => ({ provenance: { ...state.provenance, ...config } })),
      
      updateAccessibility: (config) =>
        set((state) => ({ accessibility: { ...state.accessibility, ...config } })),
      
      resetAll: () =>
        set({
          feed: DEFAULT_FEED,
          provenance: DEFAULT_PROVENANCE,
          accessibility: DEFAULT_ACCESSIBILITY,
        }),
    }),
    {
      name: 'agora_settings_storage', // Shared prefix for overall state if needed, but user asked for specific keys
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// We define separate stores or use partialize if we strictly want different localStorage keys as requested.
// The user asked for specific keys: `agora_feed_config`, `agora_provenance_config`, `agora_accessibility_config`.
// I will split them into three separate stores to respect the exact key requirement.

export const useFeedStore = create<FeedConfig & { update: (c: Partial<FeedConfig>) => void; reset: () => void }>()(
  persist(
    (set) => ({
      ...DEFAULT_FEED,
      update: (config) => set((state) => ({ ...state, ...config })),
      reset: () => set(DEFAULT_FEED),
    }),
    {
      name: 'agora_feed_config',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useProvenanceStore = create<ProvenanceConfig & { update: (c: Partial<ProvenanceConfig>) => void; reset: () => void }>()(
  persist(
    (set) => ({
      ...DEFAULT_PROVENANCE,
      update: (config) => set((state) => ({ ...state, ...config })),
      reset: () => set(DEFAULT_PROVENANCE),
    }),
    {
      name: 'agora_provenance_config',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useAccessibilityStore = create<AccessibilityConfig & { update: (c: Partial<AccessibilityConfig>) => void; reset: () => void }>()(
  persist(
    (set) => ({
      ...DEFAULT_ACCESSIBILITY,
      update: (config) => set((state) => ({ ...state, ...config })),
      reset: () => set(DEFAULT_ACCESSIBILITY),
    }),
    {
      name: 'agora_accessibility_config',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
