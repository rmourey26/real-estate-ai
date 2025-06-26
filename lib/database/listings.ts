import { createClient } from "@/utils/supabase/server"
import type { Database } from "@/types/supabase"

type Listing = Database["public"]["Tables"]["real_estate_listings"]["Row"]
type ListingInsert = Database["public"]["Tables"]["real_estate_listings"]["Insert"]
type ListingUpdate = Database["public"]["Tables"]["real_estate_listings"]["Update"]

export class ListingService {
  private supabase = createClient()

  async getAllListings(filters?: {
    city?: string
    state?: string
    minPrice?: number
    maxPrice?: number
    propertyType?: string
    minBedrooms?: number
    maxBedrooms?: number
    limit?: number
    offset?: number
  }): Promise<{ data: Listing[]; count: number | null }> {
    try {
      let query = this.supabase
        .from("real_estate_listings")
        .select("*", { count: "exact" })
        .eq("listing_status", "active")
        .order("created_at", { ascending: false })

      if (filters) {
        if (filters.city) query = query.eq("city", filters.city)
        if (filters.state) query = query.eq("state", filters.state)
        if (filters.minPrice) query = query.gte("price", filters.minPrice)
        if (filters.maxPrice) query = query.lte("price", filters.maxPrice)
        if (filters.propertyType) query = query.eq("property_type", filters.propertyType)
        if (filters.minBedrooms) query = query.gte("bedrooms", filters.minBedrooms)
        if (filters.maxBedrooms) query = query.lte("bedrooms", filters.maxBedrooms)
        if (filters.limit) query = query.limit(filters.limit)
        if (filters.offset) query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
      }

      const { data, error, count } = await query

      if (error) {
        console.error("Error fetching listings:", error)
        return { data: [], count: 0 }
      }

      return { data: data || [], count }
    } catch (error) {
      console.error("Unexpected error fetching listings:", error)
      return { data: [], count: 0 }
    }
  }

  async getListingById(id: string): Promise<Listing | null> {
    try {
      const { data, error } = await this.supabase.from("real_estate_listings").select("*").eq("id", id).single()

      if (error) {
        console.error("Error fetching listing:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Unexpected error fetching listing:", error)
      return null
    }
  }

  async createListing(listing: ListingInsert): Promise<Listing | null> {
    try {
      const { data, error } = await this.supabase.from("real_estate_listings").insert(listing).select().single()

      if (error) {
        console.error("Error creating listing:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Unexpected error creating listing:", error)
      return null
    }
  }

  async updateListing(id: string, updates: ListingUpdate): Promise<Listing | null> {
    try {
      const { data, error } = await this.supabase
        .from("real_estate_listings")
        .update(updates)
        .eq("id", id)
        .select()
        .single()

      if (error) {
        console.error("Error updating listing:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Unexpected error updating listing:", error)
      return null
    }
  }

  async deleteListing(id: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.from("real_estate_listings").delete().eq("id", id)

      if (error) {
        console.error("Error deleting listing:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Unexpected error deleting listing:", error)
      return false
    }
  }

  async getUserSavedListings(userId: string): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from("user_saved_listings")
        .select(`
          *,
          real_estate_listings (*)
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching saved listings:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Unexpected error fetching saved listings:", error)
      return []
    }
  }

  async saveListingForUser(userId: string, listingId: string, notes?: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.from("user_saved_listings").upsert({
        user_id: userId,
        listing_id: listingId,
        notes: notes || null,
      })

      if (error) {
        console.error("Error saving listing:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Unexpected error saving listing:", error)
      return false
    }
  }

  async removeSavedListing(userId: string, listingId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("user_saved_listings")
        .delete()
        .eq("user_id", userId)
        .eq("listing_id", listingId)

      if (error) {
        console.error("Error removing saved listing:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Unexpected error removing saved listing:", error)
      return false
    }
  }
}

export const listingService = new ListingService()
