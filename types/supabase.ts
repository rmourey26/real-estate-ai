export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          full_name: string | null
          avatar_url: string | null
          subscription_tier: "free" | "basic" | "premium" | null
          subscription_status: "active" | "inactive" | "trial" | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: "free" | "basic" | "premium" | null
          subscription_status?: "active" | "inactive" | "trial" | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: "free" | "basic" | "premium" | null
          subscription_status?: "active" | "inactive" | "trial" | null
        }
      }
      real_estate_listings: {
        Row: {
          id: string
          created_at: string
          address: string
          city: string
          state: string
          zip_code: string
          price: number
          bedrooms: number
          bathrooms: number
          square_feet: number
          year_built: number
          property_type: string
          listing_status: "active" | "pending" | "sold"
          deal_score: number
          deal_reasons: string[] | null
          listing_url: string | null
          image_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          address: string
          city: string
          state: string
          zip_code: string
          price: number
          bedrooms: number
          bathrooms: number
          square_feet: number
          year_built: number
          property_type: string
          listing_status: "active" | "pending" | "sold"
          deal_score: number
          deal_reasons?: string[] | null
          listing_url?: string | null
          image_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          address?: string
          city?: string
          state?: string
          zip_code?: string
          price?: number
          bedrooms?: number
          bathrooms?: number
          square_feet?: number
          year_built?: number
          property_type?: string
          listing_status?: "active" | "pending" | "sold"
          deal_score?: number
          deal_reasons?: string[] | null
          listing_url?: string | null
          image_url?: string | null
        }
      }
      market_trends: {
        Row: {
          id: string
          created_at: string
          region: string
          region_type: "city" | "zip" | "state" | "neighborhood"
          median_price: number
          price_change_pct: number
          avg_days_on_market: number
          inventory_count: number
          month: number
          year: number
        }
        Insert: {
          id?: string
          created_at?: string
          region: string
          region_type: "city" | "zip" | "state" | "neighborhood"
          median_price: number
          price_change_pct: number
          avg_days_on_market: number
          inventory_count: number
          month: number
          year: number
        }
        Update: {
          id?: string
          created_at?: string
          region?: string
          region_type?: "city" | "zip" | "state" | "neighborhood"
          median_price?: number
          price_change_pct?: number
          avg_days_on_market?: number
          inventory_count?: number
          month?: number
          year?: number
        }
      }
      user_saved_listings: {
        Row: {
          id: string
          created_at: string
          user_id: string
          listing_id: string
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          listing_id: string
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          listing_id?: string
          notes?: string | null
        }
      }
      ai_agent_logs: {
        Row: {
          id: string
          created_at: string
          agent_name: string
          action_type: string
          details: Json
          success: boolean
          error_message: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          agent_name: string
          action_type: string
          details: Json
          success: boolean
          error_message?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          agent_name?: string
          action_type?: string
          details?: Json
          success?: boolean
          error_message?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      match_listings_to_embeddings: {
        Args: {
          query_embedding: string
          match_threshold: number
          match_count: number
        }
        Returns: {
          id: string
          content: string
          similarity: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
