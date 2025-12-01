'use client';

import { useEffect } from 'react';
import { useGlobalStore } from '@/store/globalStore';
import Header from '@/components/Header';
import BannerSection from '@/components/BannerSection';
import PremiumMembershipSection from '@/components/PremiumMembershipSection';
import SubscribeSection from '@/components/SubscribeSection';
import MapSection from '@/components/MapSection';
import UnlockReveal from '@/components/UnlockReveal';
import Footer from '@/components/Footer';

export default function Home() {
  const fetchInitialData = useGlobalStore((state) => state.fetchInitialData);
  const subscribeToRealtime = useGlobalStore((state) => state.subscribeToRealtime);
  const unsubscribeFromRealtime = useGlobalStore((state) => state.unsubscribeFromRealtime);

  useEffect(() => {
    // Fetch initial data on mount
    fetchInitialData();
    
    // Subscribe to real-time updates
    subscribeToRealtime();
    
    // Cleanup on unmount
    return () => {
      unsubscribeFromRealtime();
    };
  }, [fetchInitialData, subscribeToRealtime, unsubscribeFromRealtime]);

  return (
    <div className="flex flex-col bg-gradient-to-br from-navy-950 via-navy-900 to-purple-950">
      {/* Header */}
      <Header />
      
      {/* 1. Banner Section with Video */}
      <BannerSection />
      
      {/* 2. Payment / Premium Membership Section */}
      <PremiumMembershipSection />
      
      {/* 3. CTA Subscribe Section with Video */}
      <SubscribeSection />
      
      {/* 4. Map Section with Video Overlay + Subscribe Form */}
      <MapSection />
      
      {/* Footer */}
      <Footer />
      
      {/* Conditional Unlock Reveal */}
      <UnlockReveal />
    </div>
  );
}
