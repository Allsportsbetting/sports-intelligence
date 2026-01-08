// Google Analytics 4 Event Tracking Utilities

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
  }
}

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-QQ9X5X4NB8', {
      page_path: url,
    });
  }
};

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Predefined event trackers for common actions
export const analytics = {
  // User interactions
  trackMapInteraction: (country: string) => {
    trackEvent('map_interaction', 'engagement', country);
  },

  trackLockerInteraction: () => {
    trackEvent('locker_click', 'engagement', 'locker_component');
  },

  trackSubscription: (plan: string) => {
    trackEvent('subscription', 'conversion', plan);
  },

  trackLogin: (method: string) => {
    trackEvent('login', 'authentication', method);
  },

  trackSignup: (method: string) => {
    trackEvent('sign_up', 'authentication', method);
  },

  // Content engagement
  trackVideoPlay: (videoId: string) => {
    trackEvent('video_play', 'engagement', videoId);
  },

  trackFormSubmission: (formName: string) => {
    trackEvent('form_submit', 'engagement', formName);
  },

  // Business metrics
  trackLeadGeneration: (source: string) => {
    trackEvent('generate_lead', 'business', source);
  },

  trackPremiumFeatureAccess: (feature: string) => {
    trackEvent('premium_feature', 'engagement', feature);
  },

  // Error tracking
  trackError: (errorType: string, errorMessage: string) => {
    trackEvent('error', 'technical', `${errorType}: ${errorMessage}`);
  },
};

export default analytics;