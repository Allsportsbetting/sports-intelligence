'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { SubscriptionSource } from '@/types';
import { COUNTRY_NAMES } from '@/lib/countryNames';

interface SubscribeFormProps {
  source: SubscriptionSource;
  variant?: 'default' | 'compact';
}

export default function SubscribeForm({ source, variant = 'default' }: SubscribeFormProps) {
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!email.trim()) {
      setMessage({ type: 'error', text: 'Please enter your email address' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    if (!countryCode) {
      setMessage({ type: 'error', text: 'Please select your country' });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('subscribed_users').insert({
        email: email.trim(),
        country_code: countryCode,
        source,
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Thanks for subscribing!' });
      setEmail('');
      setCountryCode('');
    } catch (error) {
      console.error('Subscription error:', error);
      setMessage({ type: 'error', text: 'Failed to subscribe. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCompact = variant === 'compact';

  return (
    <form onSubmit={handleSubscribe} className={isCompact ? 'space-y-3' : 'space-y-4'}>
      <div className={`flex flex-col ${isCompact ? 'sm:flex-row' : 'md:flex-row'} gap-3`}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          disabled={isSubmitting}
          className={`flex-1 px-4 ${isCompact ? 'py-3' : 'py-4'} bg-slate-800/50 border border-purple-500/30 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all disabled:opacity-50`}
        />
        <select
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
          disabled={isSubmitting}
          className={`${isCompact ? 'w-full sm:w-40' : 'w-full md:w-48'} px-4 ${isCompact ? 'py-3' : 'py-4'} bg-slate-800/50 border border-purple-500/30 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all disabled:opacity-50 appearance-none cursor-pointer`}
        >
          <option value="" className="bg-slate-800">Select Country</option>
          {Object.entries(COUNTRY_NAMES).map(([code, name]) => (
            <option key={code} value={code} className="bg-slate-800">
              {name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 ${isCompact ? 'py-3' : 'py-4'} bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </span>
          ) : (
            'Subscribe'
          )}
        </button>
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-xl text-center text-sm ${
            message.type === 'success'
              ? 'bg-green-500/10 border border-green-500/30 text-green-300'
              : 'bg-red-500/10 border border-red-500/30 text-red-300'
          }`}
        >
          {message.text}
        </motion.div>
      )}
    </form>
  );
}
