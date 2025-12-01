'use client';

import { useEffect } from 'react';
import { useGlobalStore } from '@/store/globalStore';
import Header from '@/components/Header';
import BannerSection from '@/components/BannerSection';
import HeroSection from '@/components/HeroSection';
import Legend from '@/components/Legend';
import SubscribeSection from '@/components/SubscribeSection';
import UnlockReveal from '@/components/UnlockReveal';
import PremiumMembershipSection from '@/components/PremiumMembershipSection';
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
      
      {/* 1. Banner Section with Video - 100vh */}
      <BannerSection />
      
      {/* 2. Map Section - 100vh */}
      <section className="h-screen flex flex-col overflow-hidden">
        {/* Hero Section with Map */}
        <HeroSection />
        
        {/* Legend */}
        <Legend />
      </section>
      
      {/* 3. Subscribe Section with Video - 100vh */}
      <SubscribeSection />
      
      {/* 4. Premium Membership / Payment Section */}
      <PremiumMembershipSection />
      
      {/* Footer */}
      <Footer />
      
      {/* Conditional Unlock Reveal */}
      <UnlockReveal />
    </div>
  );
}
