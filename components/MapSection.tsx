'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGlobalStore } from '@/store/globalStore';
import { useVideoContentStore } from '@/store/videoContentStore';
import WorldMapContainer from '@/components/WorldMapContainer';
import Legend from '@/components/Legend';
import SubscribeForm from '@/components/SubscribeForm';

export default function MapSection() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLIFrameElement>(null);
  
  const countryStates = useGlobalStore((state) => state.countryStates);
  const setHoveredCountry = useGlobalStore((state) => state.setHoveredCountry);
  
  const { videoContent, fetchVideoContent, subscribeToRealtime, unsubscribeFromRealtime } = useVideoContentStore();
  const mapVideo = videoContent.get('homepage_video'); // Reusing homepage_video for map overlay

  useEffect(() => {
    fetchVideoContent();
    subscribeToRealtime();
    return () => unsubscribeFromRealtime();
  }, [fetchVideoContent, subscribeToRealtime, unsubscribeFromRealtime]);

  const handlePlayVideo = () => {
    setIsVideoPlaying(true);
  };

  const handleCloseVideo = () => {
    setIsVideoPlaying(false);
  };

  return (
    <section className="min-h-screen flex flex-col relative">
      {/* Map Container with Video Overlay */}
      <div className="flex-1 relative flex items-center justify-center px-4 sm:px-8 pt-20 pb-6">
        {/* World Map */}
        <div className="w-full max-w-7xl flex items-center justify-center relative">
          <WorldMapContainer
            countryStates={countryStates}
            onCountryHover={setHoveredCountry}
          />
          
          {/* Transparent Video Overlay - shows when not playing */}
          {mapVideo?.show_video && mapVideo?.video_url && !isVideoPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="relative w-full max-w-2xl aspect-video">
                {/* Semi-transparent overlay with play button */}
                <div 
                  className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px] rounded-2xl border border-cyan-500/20 flex items-center justify-center cursor-pointer pointer-events-auto hover:bg-slate-900/40 transition-all"
                  onClick={handlePlayVideo}
                >
                  <div className="flex flex-col items-center gap-4">
                    {/* Play Button */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-500/50"
                    >
                      <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </motion.div>
                    {mapVideo.show_title && mapVideo.title && (
                      <p className="text-white font-semibold text-lg">{mapVideo.title}</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Full Video Player - shows when playing */}
        {isVideoPlaying && mapVideo?.video_url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 bg-navy-950/95 flex items-center justify-center p-8"
          >
            <div className="relative w-full max-w-5xl">
              {/* Close Button */}
              <button
                onClick={handleCloseVideo}
                className="absolute -top-12 right-0 text-white hover:text-cyan-400 transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/30">
                <iframe
                  ref={videoRef}
                  src={`${mapVideo.video_url}?autoplay=1`}
                  title={mapVideo.title || 'Video'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full rounded-2xl"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Legend */}
        <Legend />
      </div>

      {/* Subscribe Form Below Map */}
      <div className="px-4 pb-12">
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
