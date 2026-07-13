export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      managed_pages: {
        Row: { id: string; page_key: string; route_path: string; title: string; subtitle: string | null; content: Json; visibility: 'public' | 'authenticated'; is_published: boolean; version_label: string | null; updated_by: string | null; created_at: string; updated_at: string }
        Insert: { id?: string; page_key: string; route_path: string; title: string; subtitle?: string | null; content: Json; visibility: 'public' | 'authenticated'; is_published?: boolean; version_label?: string | null; updated_by?: string | null; created_at?: string; updated_at?: string }
        Update: Partial<Database['public']['Tables']['managed_pages']['Insert']>
        Relationships: [{ foreignKeyName: 'managed_pages_updated_by_fkey'; columns: ['updated_by']; isOneToOne: false; referencedRelation: 'users'; referencedColumns: ['id'] }]
      }
      brand_settings: {
        Row: {
          id: string; singleton: boolean; logo_url: string | null; favicon_url: string | null; og_image_url: string | null;
          background_image_url: string | null; logo_on_dark_url: string | null; logo_on_light_url: string | null;
          card_bg_dark_image_1_url: string | null; card_bg_dark_image_2_url: string | null; card_bg_light_image_3_url: string | null;
          card_bg_light_image_4_url: string | null; apple_touch_icon_url: string | null; browser_title: string | null;
          apple_touch_title: string | null; primary_color: string; secondary_color: string; background_color: string;
          surface_color: string; text_color: string; visual_variant_settings: Json | null; created_at: string; updated_at: string;
        }
        Insert: Partial<Database['public']['Tables']['brand_settings']['Row']> & { singleton?: boolean }
        Update: Partial<Database['public']['Tables']['brand_settings']['Row']>
        Relationships: []
      }
      password_reset_rate_limits: {
        Row: { key_hash: string; attempt_count: number; window_started_at: string; updated_at: string }
        Insert: { key_hash: string; attempt_count?: number; window_started_at?: string; updated_at?: string }
        Update: Partial<Database['public']['Tables']['password_reset_rate_limits']['Row']>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: { consume_password_reset_rate_limit: { Args: { p_key_hash: string; p_limit?: number; p_window_seconds?: number }; Returns: boolean } }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
