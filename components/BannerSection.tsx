'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useVideoContentStore } from '@/store/videoContentStore';
import AutoPlayVideo from '@/components/AutoPlayVideo';

export default function BannerSection() {
  const { videoContent, fetchVideoContent, subscribeToRealtime, unsubscribeFromRealtime } = useVideoContentStore();
  const bannerVideo = videoContent.get('banner_video');

  useEffect(() => {
    fetchVideoContent();
    subscribeToRealtime();
    return () => unsubscribeFromRealtime();
  }, [fetchVideoContent, subscribeToRealtime, unsubscribeFromRealtime]);

  // Don't render if video is hidden
  if (!bannerVideo?.show_video) return null;

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20 pt-28">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl"
      >
        <div className="bg-slate-900/60 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-8 md:p-12 shadow-2xl shadow-cyan-500/10">
          {/* Title */}
          {bannerVideo?.show_title && bannerVideo?.title && (
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-5xl font-bold text-center bg-gradient-to-r from-cyan-300 via-purple-300 to-cyan-400 bg-clip-text text-transparent mb-6"
            >
              {bannerVideo.title}
            </motion.h2>
          )}

          {/* Video */}
          {bannerVideo?.video_url && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6 shadow-lg shadow-purple-500/20"
            >
              <AutoPlayVideo
                src={bannerVideo.video_url}
                title={bannerVideo.title || 'Banner Video'}
              />
            </motion.div>
          )}

          {/* Description */}
          {bannerVideo?.show_description && bannerVideo?.description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-slate-300 text-center text-lg leading-relaxed"
            >
              {bannerVideo.description}
            </motion.p>
          )}
        </div>
      </motion.div>
    </section>
  );
}
