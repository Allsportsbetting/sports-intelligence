import { create } from 'zustand';
import { VideoContent, VideoPlacement } from '@/types';
import { supabase } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

interface VideoContentStore {
  videoContent: Map<VideoPlacement, VideoContent>;
  isLoading: boolean;
  error: string | null;
  realtimeChannel: RealtimeChannel | null;

  // Actions
  setVideoContent: (placement: VideoPlacement, content: VideoContent) => void;
  setAllVideoContent: (contents: VideoContent[]) => void;
  getVideoContent: (placement: VideoPlacement) => VideoContent | undefined;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Data fetching and subscriptions
  fetchVideoContent: () => Promise<void>;
  subscribeToRealtime: () => void;
  unsubscribeFromRealtime: () => void;
}

export const useVideoContentStore = create<VideoContentStore>((set, get) => ({
  videoContent: new Map(),
  isLoading: false,
  error: null,
  realtimeChannel: null,

  setVideoContent: (placement, content) =>
    set((prev) => {
      const newMap = new Map(prev.videoContent);
      newMap.set(placement, content);
      return { videoContent: newMap };
    }),

  setAllVideoContent: (contents) => {
    const newMap = new Map<VideoPlacement, VideoContent>();
    contents.forEach((content) => {
      newMap.set(content.placement as VideoPlacement, content);
    });
    set({ videoContent: newMap });
  },

  getVideoContent: (placement) => get().videoContent.get(placement),

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  fetchVideoContent: async () => {
    const { setLoading, setError, setAllVideoContent } = get();

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('video_content')
        .select('*')
        .order('placement');

      if (error) throw error;
      if (data) setAllVideoContent(data);
    } catch (error) {
      console.error('Error fetching video content:', error);
      setError(error instanceof Error ? error.message : 'Failed to load video content');
    } finally {
      setLoading(false);
    }
  },

  subscribeToRealtime: () => {
    const { setVideoContent } = get();

    const channel = supabase
      .channel('video_content_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'video_content',
        },
        (payload) => {
          if (payload.new) {
            const content = payload.new as VideoContent;
            setVideoContent(content.placement as VideoPlacement, content);
          }
        }
      )
      .subscribe();

    set({ realtimeChannel: channel });
  },

  unsubscribeFromRealtime: () => {
    const { realtimeChannel } = get();
    if (realtimeChannel) {
      supabase.removeChannel(realtimeChannel);
      set({ realtimeChannel: null });
    }
  },
}));
