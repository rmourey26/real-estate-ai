export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          full_name: string | null
          phone: string | null
          company: string | null
          bio: string | null
          avatar_url: string | null
          timezone: string
          language: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          company?: string | null
          bio?: string | null
          avatar_url?: string | null
          timezone?: string
          language?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          company?: string | null
          bio?: string | null
          avatar_url?: string | null
          timezone?: string
          language?: string
          created_at?: string
          updated_at?: string
        }
      }
      notification_settings: {
        Row: {
          id: string
          user_id: string
          email_notifications: boolean
          push_notifications: boolean
          marketing_emails: boolean
          deal_alerts: boolean
          price_drop_alerts: boolean
          new_listing_alerts: boolean
          weekly_reports: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email_notifications?: boolean
          push_notifications?: boolean
          marketing_emails?: boolean
          deal_alerts?: boolean
          price_drop_alerts?: boolean
          new_listing_alerts?: boolean
          weekly_reports?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email_notifications?: boolean
          push_notifications?: boolean
          marketing_emails?: boolean
          deal_alerts?: boolean
          price_drop_alerts?: boolean
          new_listing_alerts?: boolean
          weekly_reports?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      privacy_settings: {
        Row: {
          id: string
          user_id: string
          profile_visibility: "public" | "private"
          show_email: boolean
          show_phone: boolean
          data_sharing: boolean
          analytics_tracking: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          profile_visibility?: "public" | "private"
          show_email?: boolean
          show_phone?: boolean
          data_sharing?: boolean
          analytics_tracking?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          profile_visibility?: "public" | "private"
          show_email?: boolean
          show_phone?: boolean
          data_sharing?: boolean
          analytics_tracking?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      subscription_plans: {
        Row: {
          id: string
          name: string
          description: string | null
          price_monthly: number | null
          price_yearly: number | null
          features: Json
          limits: Json
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price_monthly?: number | null
          price_yearly?: number | null
          features?: Json
          limits?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price_monthly?: number | null
          price_yearly?: number | null
          features?: Json
          limits?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          status: "active" | "inactive" | "cancelled" | "past_due"
          current_period_start: string | null
          current_period_end: string | null
          stripe_subscription_id: string | null
          stripe_customer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_id: string
          status?: "active" | "inactive" | "cancelled" | "past_due"
          current_period_start?: string | null
          current_period_end?: string | null
          stripe_subscription_id?: string | null
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_id?: string
          status?: "active" | "inactive" | "cancelled" | "past_due"
          current_period_start?: string | null
          current_period_end?: string | null
          stripe_subscription_id?: string | null
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      billing_history: {
        Row: {
          id: string
          user_id: string
          subscription_id: string | null
          amount: number
          currency: string
          status: "pending" | "paid" | "failed" | "refunded"
          stripe_invoice_id: string | null
          invoice_url: string | null
          billing_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subscription_id?: string | null
          amount: number
          currency?: string
          status?: "pending" | "paid" | "failed" | "refunded"
          stripe_invoice_id?: string | null
          invoice_url?: string | null
          billing_date?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subscription_id?: string | null
          amount?: number
          currency?: string
          status?: "pending" | "paid" | "failed" | "refunded"
          stripe_invoice_id?: string | null
          invoice_url?: string | null
          billing_date?: string
          created_at?: string
        }
      }
      real_estate_listings: {
        Row: {
          id: string
          address: string
          city: string
          state: string
          zip_code: string
          price: number
          bedrooms: number | null
          bathrooms: number | null
          square_feet: number | null
          lot_size: number | null
          year_built: number | null
          property_type: string
          listing_status: "active" | "pending" | "sold" | "off_market"
          deal_score: number
          deal_reasons: string[] | null
          listing_url: string | null
          image_url: string | null
          images: string[] | null
          description: string | null
          features: string[] | null
          neighborhood: string | null
          school_district: string | null
          hoa_fee: number | null
          property_taxes: number | null
          days_on_market: number
          price_per_sqft: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          address: string
          city: string
          state: string
          zip_code: string
          price: number
          bedrooms?: number | null
          bathrooms?: number | null
          square_feet?: number | null
          lot_size?: number | null
          year_built?: number | null
          property_type: string
          listing_status?: "active" | "pending" | "sold" | "off_market"
          deal_score?: number
          deal_reasons?: string[] | null
          listing_url?: string | null
          image_url?: string | null
          images?: string[] | null
          description?: string | null
          features?: string[] | null
          neighborhood?: string | null
          school_district?: string | null
          hoa_fee?: number | null
          property_taxes?: number | null
          days_on_market?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          address?: string
          city?: string
          state?: string
          zip_code?: string
          price?: number
          bedrooms?: number | null
          bathrooms?: number | null
          square_feet?: number | null
          lot_size?: number | null
          year_built?: number | null
          property_type?: string
          listing_status?: "active" | "pending" | "sold" | "off_market"
          deal_score?: number
          deal_reasons?: string[] | null
          listing_url?: string | null
          image_url?: string | null
          images?: string[] | null
          description?: string | null
          features?: string[] | null
          neighborhood?: string | null
          school_district?: string | null
          hoa_fee?: number | null
          property_taxes?: number | null
          days_on_market?: number
          created_at?: string
          updated_at?: string
        }
      }
      market_trends: {
        Row: {
          id: string
          region: string
          region_type: "city" | "zip" | "state" | "neighborhood"
          median_price: number
          price_change_pct: number | null
          avg_days_on_market: number | null
          inventory_count: number | null
          month: number
          year: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          region: string
          region_type?: "city" | "zip" | "state" | "neighborhood"
          median_price: number
          price_change_pct?: number | null
          avg_days_on_market?: number | null
          inventory_count?: number | null
          month: number
          year: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          region?: string
          region_type?: "city" | "zip" | "state" | "neighborhood"
          median_price?: number
          price_change_pct?: number | null
          avg_days_on_market?: number | null
          inventory_count?: number | null
          month?: number
          year?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_saved_listings: {
        Row: {
          id: string
          user_id: string
          listing_id: string
          notes: string | null
          tags: string[] | null
          is_favorite: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          listing_id: string
          notes?: string | null
          tags?: string[] | null
          is_favorite?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          listing_id?: string
          notes?: string | null
          tags?: string[] | null
          is_favorite?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      property_analysis: {
        Row: {
          id: string
          listing_id: string
          user_id: string | null
          analysis_type: "investment" | "cma" | "rental" | "flip"
          analysis_data: Json
          confidence_score: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          user_id?: string | null
          analysis_type: "investment" | "cma" | "rental" | "flip"
          analysis_data: Json
          confidence_score?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          user_id?: string | null
          analysis_type?: "investment" | "cma" | "rental" | "flip"
          analysis_data?: Json
          confidence_score?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      search_history: {
        Row: {
          id: string
          user_id: string
          search_query: string
          filters: Json | null
          results_count: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          search_query: string
          filters?: Json | null
          results_count?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          search_query?: string
          filters?: Json | null
          results_count?: number | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
