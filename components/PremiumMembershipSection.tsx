'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useVideoContentStore } from '@/store/videoContentStore';

export default function PremiumMembershipSection() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { videoContent, fetchVideoContent, subscribeToRealtime, unsubscribeFromRealtime } = useVideoContentStore();
  const homepageVideo = videoContent.get('homepage_video');

  useEffect(() => {
    fetchVideoContent();
    subscribeToRealtime();
    return () => unsubscribeFromRealtime();
  }, [fetchVideoContent, subscribeToRealtime, unsubscribeFromRealtime]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout URL
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setError(error.message || 'Failed to process payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      id="membership"
      className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-navy-950 via-navy-900 to-purple-950"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-slate-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-8 md:p-12 shadow-2xl shadow-cyan-500/20">
          {/* Title */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mb-4"
            >
              <span className="text-5xl">🚀</span>
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-300 via-purple-300 to-cyan-400 bg-clip-text text-transparent mb-3">
              All Sports Intelligence
            </h2>
            <p className="text-slate-300 text-base md:text-lg">
              who we're & what we offer
            </p>
          </div>

          {/* Video Section */}
          <div className="mb-8 bg-slate-950/50 border border-cyan-500/20 rounded-2xl p-6">
            {homepageVideo?.show_title && homepageVideo?.title && (
              <h3 className="text-xl font-bold text-white text-center mb-2">
                {homepageVideo.title}
              </h3>
            )}
            
            {homepageVideo?.show_subtitle && homepageVideo?.subtitle && (
              <p className="text-slate-300 text-center mb-4">
                {homepageVideo.subtitle}
              </p>
            )}
            
            {/* YouTube Video Embed */}
            {homepageVideo?.show_video && homepageVideo?.video_url && (
              <div className="relative aspect-video bg-black rounded-xl mb-4 overflow-hidden">
                <iframe
                  src={homepageVideo.video_url}
                  title={homepageVideo.title || 'Video'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full rounded-xl"
                />
              </div>
            )}

            {/* Video Description */}
            {homepageVideo?.show_description && homepageVideo?.description && (
              <p className="text-slate-400 text-sm text-center leading-relaxed">
                {homepageVideo.description}
              </p>
            )}
          </div>

          {/* Why Join Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white text-center mb-6">
              Why Join?
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">🎁</span>
                <div>
                  <h4 className="text-white font-semibold text-base mb-1">Exclusive Gift Rewards</h4>
                  <p className="text-slate-400 text-sm">Special bonuses for members only</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">⭐</span>
                <div>
                  <h4 className="text-white font-semibold text-base mb-1">Premium Picks</h4>
                  <p className="text-slate-400 text-sm">Curated insights and advanced analytics</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">💬</span>
                <div>
                  <h4 className="text-white font-semibold text-base mb-1">VIP Community</h4>
                  <p className="text-slate-400 text-sm">Private Telegram channel with elite specialists</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">🏆</span>
                <div>
                  <h4 className="text-white font-semibold text-base mb-1">Special Challenges & Rewards</h4>
                  <p className="text-slate-400 text-sm">Compete, share, and earn recognition</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="mb-6 text-center">
            <div className="text-slate-400 text-sm mb-2">Limited-Time Launch Offer</div>
            <div className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
              $2
            </div>
            <div className="text-amber-400 text-sm font-semibold mb-1">
              ⚡ Limited Time Entry Price
            </div>
            <div className="text-slate-400 text-xs">
              Price will increase after launch
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                autoComplete="email"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl border bg-red-500/10 border-red-500/30 text-red-300"
              >
                <p className="text-sm">{error}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold text-base md:text-lg rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-cyan-500 disabled:hover:to-purple-500"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                'Create Your Account & Unlock the Video'
              )}
            </button>
          </form>

          {/* Footer Note */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Secure payment powered by Stripe
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
