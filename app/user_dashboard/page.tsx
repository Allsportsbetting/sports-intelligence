'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { useVideoContentStore } from '@/store/videoContentStore';

export default function UserDashboard() {
  const [bankrollPercentage, setBankrollPercentage] = useState(70);
  const { videoContent, fetchVideoContent, subscribeToRealtime, unsubscribeFromRealtime } = useVideoContentStore();
  
  const dashboardVideo = videoContent.get('dashboard_video');
  const watchOnYoutube = videoContent.get('watch_on_youtube');
  const bettingEssentials = videoContent.get('betting_essentials');

  useEffect(() => {
    fetchVideoContent();
    subscribeToRealtime();
    return () => unsubscribeFromRealtime();
  }, [fetchVideoContent, subscribeToRealtime, unsubscribeFromRealtime]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-purple-950">
      {/* Header */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-6xl px-4">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-full px-6 py-3 shadow-2xl shadow-cyan-500/20">
          <div className="flex items-center justify-between gap-6">
            <Link href="/">
              <h1 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-cyan-300 via-purple-300 to-cyan-400 bg-clip-text text-transparent whitespace-nowrap cursor-pointer hover:opacity-80 transition-opacity">
                All Sports Intelligence
              </h1>
            </Link>
            <div className="text-sm text-slate-400">Premium Dashboard</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-300 via-purple-300 to-cyan-400 bg-clip-text text-transparent mb-4">
            Premium Dashboard
          </h2>
          <p className="text-slate-300 text-lg">
            Your hub for expert picks and elite benefits
          </p>
        </motion.div>

        {/* Bankroll Adjuster */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 bg-slate-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-8 shadow-2xl shadow-cyan-500/20"
        >
          <h3 className="text-2xl font-bold text-white text-center mb-6">
            Bankroll Adjuster
          </h3>
          
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="range"
                min="0"
                max="100"
                value={bankrollPercentage}
                onChange={(e) => setBankrollPercentage(Number(e.target.value))}
                className="w-full h-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #06b6d4 0%, #a855f7 ${bankrollPercentage}%, #1e293b ${bankrollPercentage}%, #1e293b 100%)`,
                }}
              />
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent min-w-[80px] text-right">
              {bankrollPercentage}%
            </div>
          </div>
        </motion.div>

        {/* Today's Expert Pick */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 bg-slate-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-8 shadow-2xl shadow-cyan-500/20"
        >
          {dashboardVideo?.show_title && dashboardVideo?.title && (
            <h3 className="text-2xl font-bold text-white text-center mb-2">
              {dashboardVideo.title}
            </h3>
          )}
          
          {dashboardVideo?.show_subtitle && dashboardVideo?.subtitle && (
            <p className="text-slate-300 text-center mb-4">
              {dashboardVideo.subtitle}
            </p>
          )}
          
          {/* YouTube Video Embed */}
          {dashboardVideo?.show_video && dashboardVideo?.video_url && (
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden">
              <iframe
                src={dashboardVideo.video_url}
                title={dashboardVideo.title || 'Video'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full rounded-2xl"
              />
            </div>
          )}

          {dashboardVideo?.show_description && dashboardVideo?.description && (
            <p className="text-slate-400 text-sm text-center mt-4 leading-relaxed">
              {dashboardVideo.description}
            </p>
          )}
        </motion.div>

        {/* Quick Links Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
        >
          {/* Bookmakers */}
          <a
            href="https://www.bet365.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 hover:border-cyan-400/50 transition-all duration-300 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div>
                <h4 className="text-white font-semibold text-lg mb-1">Bookmakers</h4>
                <p className="text-slate-400 text-sm">Access recommended platforms</p>
              </div>
            </div>
          </a>

          {/* Premium Privileges */}
          <a
            href="#"
            className="bg-slate-900/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 hover:border-purple-400/50 transition-all duration-300 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">⭐</span>
              </div>
              <div>
                <h4 className="text-white font-semibold text-lg mb-1">Premium Privileges</h4>
                <p className="text-slate-400 text-sm">Exclusive member benefits</p>
              </div>
            </div>
          </a>

          {/* Telegram Channel */}
          <a
            href="https://t.me/all_sports_betting"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 hover:border-cyan-400/50 transition-all duration-300 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                </svg>
              </div>
              <div>
                <h4 className="text-white font-semibold text-lg mb-1">Telegram Channel</h4>
                <p className="text-slate-400 text-sm">Join our VIP community</p>
              </div>
            </div>
          </a>

          {/* Watch on YouTube */}
          {watchOnYoutube?.show_video && watchOnYoutube?.video_url && (
            <a
              href={watchOnYoutube.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-900/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 hover:border-purple-400/50 transition-all duration-300 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <div>
                  {watchOnYoutube.show_title && watchOnYoutube.title && (
                    <h4 className="text-white font-semibold text-lg mb-1">{watchOnYoutube.title}</h4>
                  )}
                  {watchOnYoutube.show_subtitle && watchOnYoutube.subtitle && (
                    <p className="text-slate-400 text-sm">{watchOnYoutube.subtitle}</p>
                  )}
                </div>
              </div>
            </a>
          )}
        </motion.div>

        {/* Additional Sections */}
        {bettingEssentials?.show_video && bettingEssentials?.video_url && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {/* Betting Essentials */}
            <a
              href={bettingEssentials.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-slate-900/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 hover:border-purple-400/50 transition-all duration-300 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  {bettingEssentials.show_title && bettingEssentials.title && (
                    <h4 className="text-white font-semibold text-lg mb-1">{bettingEssentials.title}</h4>
                  )}
                  {bettingEssentials.show_subtitle && bettingEssentials.subtitle && (
                    <p className="text-slate-400 text-sm">{bettingEssentials.subtitle}</p>
                  )}
                </div>
              </div>
            </a>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
