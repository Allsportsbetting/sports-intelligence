'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGlobalStore } from '@/store/globalStore';
import { useVideoContentStore } from '@/store/videoContentStore';
import WorldMapContainer from '@/components/WorldMapContainer';
import Legend from '@/components/Legend';
import SubscribeForm from '@/components/SubscribeForm';

export default function MapSection() {
  const countryStates = useGlobalStore((state) => state.countryStates);
  const setHoveredCountry = useGlobalStore((state) => state.setHoveredCountry);

  const { videoContent, fetchVideoContent, subscribeToRealtime, unsubscribeFromRealtime } = useVideoContentStore();
  const mapVideo = videoContent.get('map_video');

  useEffect(() => {
    fetchVideoContent();
    subscribeToRealtime();
    return () => unsubscribeFromRealtime();
  }, [fetchVideoContent, subscribeToRealtime, unsubscribeFromRealtime]);

  return (
    <section className="flex flex-col py-12">
      {/* Video Card Above Map */}
      {mapVideo?.show_video && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="px-4 mb-8"
        >
          <div className="max-w-4xl mx-auto bg-slate-900/60 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-8 md:p-10 shadow-2xl shadow-cyan-500/10">
            {/* Title */}
            {mapVideo.show_title && mapVideo.title && (
              <h2 className="text-2xl md:text-4xl font-bold text-center bg-gradient-to-r from-cyan-300 via-purple-300 to-cyan-400 bg-clip-text text-transparent mb-4">
                {mapVideo.title}
              </h2>
            )}

            {/* Subtitle */}
            {mapVideo.show_subtitle && mapVideo.subtitle && (
              <p className="text-slate-300 text-center text-lg mb-6">
                {mapVideo.subtitle}
              </p>
            )}

            {/* Video */}
            {mapVideo.video_url && (
              <div className="relative aspect-video bg-black rounded-2xl overflow-hidden mb-6 shadow-lg shadow-purple-500/20">
                <iframe
                  src={mapVideo.video_url}
                  title={mapVideo.title || 'Map Section Video'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full rounded-2xl"
                />
              </div>
            )}

            {/* Description */}
            {mapVideo.show_description && mapVideo.description && (
              <p className="text-slate-400 text-center leading-relaxed">
                {mapVideo.description}
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* World Map */}
      <div className="relative flex items-center justify-center px-4 sm:px-8 py-8">
        <div className="w-full max-w-7xl flex items-center justify-center">
          <WorldMapContainer
            countryStates={countryStates}
            onCountryHover={setHoveredCountry}
          />
        </div>
        <Legend />
      </div>

      {/* Subscribe Form Below Map */}
      <div className="px-4 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto bg-slate-900/60 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-center bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent mb-4">
            Join the Global Movement
          </h3>
          <SubscribeForm source="map_section" variant="compact" />
        </motion.div>
      </div>
    </section>
  );
}
