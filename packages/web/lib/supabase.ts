import { createClient } from '@supabase/supabase-js';

// Use placeholder values if env vars are not available (for build time)
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
) {
  console.warn(
    'Supabase credentials not configured. Cloud features will be unavailable.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
        };
        Insert: {
          id: string;
          created_at?: string;
          updated_at?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
        };
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          style_id: string;
          pack_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          style_id: string;
          pack_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          style_id?: string;
          pack_id?: string;
          created_at?: string;
        };
      };
      purchases: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          product_type: 'subscription' | 'pack';
          status: 'active' | 'cancelled' | 'expired';
          purchased_at: string;
          expires_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          product_type: 'subscription' | 'pack';
          status?: 'active' | 'cancelled' | 'expired';
          purchased_at?: string;
          expires_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          product_type?: 'subscription' | 'pack';
          status?: 'active' | 'cancelled' | 'expired';
          purchased_at?: string;
          expires_at?: string | null;
        };
      };
      analytics: {
        Row: {
          id: string;
          user_id: string | null;
          event_name: string;
          event_data: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          event_name: string;
          event_data?: Record<string, unknown>;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          event_name?: string;
          event_data?: Record<string, unknown>;
          created_at?: string;
        };
      };
    };
  };
};
