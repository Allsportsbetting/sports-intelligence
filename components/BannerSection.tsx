'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useVideoContentStore } from '@/store/videoContentStore';
import AutoPlayVideo from '@/components/AutoPlayVideo';

export default function BannerSection() {
  const [isLoading, setIsLoading] = useState(false);
  const { videoContent, fetchVideoContent, subscribeToRealtime, unsubscribeFromRealtime } = useVideoContentStore();
  const bannerVideo = videoContent.get('banner_video');

  useEffect(() => {
    fetchVideoContent();
    subscribeToRealtime();
    return () => unsubscribeFromRealtime();
  }, [fetchVideoContent, subscribeToRealtime, unsubscribeFromRealtime]);

  const handleCreateAccount = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session-no-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
              className="text-slate-300 text-center text-lg leading-relaxed mb-8"
            >
              {bannerVideo.description}
            </motion.p>
          )}

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center"
          >
            <button
              onClick={handleCreateAccount}
              disabled={isLoading}
              className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                'Create Your Account'
              )}
            </button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
