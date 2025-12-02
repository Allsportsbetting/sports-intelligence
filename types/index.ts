import { Database } from './database.types';

// Extract database table types
export type LockerState = Database['public']['Tables']['locker_state']['Row'];
export type CountryState = Database['public']['Tables']['country_states']['Row'];
export type AuditLogEntry = Database['public']['Tables']['audit_log']['Row'];
export type Payment = Database['public']['Tables']['payments']['Row'];
export type VideoContent = Database['public']['Tables']['video_content']['Row'];
export type SubscribedUser = Database['public']['Tables']['subscribed_users']['Row'];

// Subscription source types
export type SubscriptionSource = 'cta_section' | 'map_section';

// Video placement types
export type VideoPlacement = 'homepage_video' | 'dashboard_video' | 'watch_on_youtube' | 'betting_essentials' | 'banner_video' | 'subscribe_video' | 'map_video';

// Request interfaces for admin operations
export interface CountryUpdate {
  countryCode: string;
  mode: 'increment' | 'absolute';
  value: number;
  note?: string;
}

export interface EnergyUpdate {
  mode: 'increment' | 'absolute';
  value: number;
  note?: string;
}

export interface VideoContentUpdate {
  placement: VideoPlacement;
  video_url: string;
  title: string;
  subtitle: string;
  description: string;
  show_video: boolean;
  show_title: boolean;
  show_subtitle: boolean;
  show_description: boolean;
}

// Re-export database types
export type { Database } from './database.types';
