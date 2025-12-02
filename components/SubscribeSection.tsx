'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useVideoContentStore } from '@/store/videoContentStore';
import SubscribeForm from '@/components/SubscribeForm';
import AutoPlayVideo from '@/components/AutoPlayVideo';

export default function SubscribeSection() {
  const { videoContent, fetchVideoContent, subscribeToRealtime, unsubscribeFromRealtime } = useVideoContentStore();
  const subscribeVideo = videoContent.get('subscribe_video');

  useEffect(() => {
    fetchVideoContent();
    subscribeToRealtime();
    return () => unsubscribeFromRealtime();
  }, [fetchVideoContent, subscribeToRealtime, unsubscribeFromRealtime]);

  // Don't render if video is hidden
  if (!subscribeVideo?.show_video) return null;

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-b from-transparent via-purple-950/30 to-transparent">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl"
      >
        <div className="bg-slate-900/60 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-8 md:p-12 shadow-2xl shadow-purple-500/10">
          {/* Title */}
          {subscribeVideo?.show_title && subscribeVideo?.title && (
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-5xl font-bold text-center bg-gradient-to-r from-purple-300 via-cyan-300 to-purple-400 bg-clip-text text-transparent mb-3"
            >
              {subscribeVideo.title}
            </motion.h2>
          )}

          {/* Subtitle */}
          {subscribeVideo?.show_subtitle && subscribeVideo?.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-slate-300 text-center text-lg mb-8"
            >
              {subscribeVideo.subtitle}
            </motion.p>
          )}

          {/* Video */}
          {subscribeVideo?.video_url && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 shadow-lg shadow-cyan-500/20"
            >
              <AutoPlayVideo
                src={subscribeVideo.video_url}
                title={subscribeVideo.title || 'Subscribe Video'}
              />
            </motion.div>
          )}

          {/* Description */}
          {subscribeVideo?.show_description && subscribeVideo?.description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-slate-400 text-center mb-8 leading-relaxed"
            >
              {subscribeVideo.description}
            </motion.p>
          )}

          {/* Subscribe Form with Country Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <SubscribeForm source="cta_section" />
          </motion.div>

          {/* YouTube Icon */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center mt-8"
          >
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span className="text-sm font-medium">YouTube Channel</span>
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
