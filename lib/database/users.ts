import { createClient } from "@/utils/supabase/server" // Assuming server client for service layer
import type { Database } from "@/types/supabase"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]
type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"]
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"]

// Define types for notification and privacy settings if needed for return types
type NotificationSettings = Database["public"]["Tables"]["notification_settings"]["Row"]
type NotificationSettingsUpdate = Database["public"]["Tables"]["notification_settings"]["Update"]
type PrivacySettings = Database["public"]["Tables"]["privacy_settings"]["Row"]
type PrivacySettingsUpdate = Database["public"]["Tables"]["privacy_settings"]["Update"]

export class UserService {
  private supabase = createClient()

  async getUserProfile(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await this.supabase.from("profiles").select("*").eq("id", userId).single()

      if (error) {
        console.error("Error fetching user profile:", error.message)
        return null
      }

      return data
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"
      console.error("Unexpected error fetching user profile:", message)
      return null
    }
  }

  async createUserProfile(profile: ProfileInsert): Promise<Profile | null> {
    try {
      const { data, error } = await this.supabase.from("profiles").insert(profile).select().single()

      if (error) {
        console.error("Error creating user profile:", error.message)
        return null
      }

      return data
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"
      console.error("Unexpected error creating user profile:", message)
      return null
    }
  }

  async updateUserProfile(userId: string, updates: ProfileUpdate): Promise<Profile | null> {
    try {
      const { data, error } = await this.supabase.from("profiles").update(updates).eq("id", userId).select().single()

      if (error) {
        console.error("Error updating user profile:", error.message)
        return null
      }

      return data
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"
      console.error("Unexpected error updating user profile:", message)
      return null
    }
  }

  async deleteUserProfile(userId: string): Promise<boolean> {
    // This should typically be handled by deleting the auth.user, which cascades to profiles
    // Direct deletion from profiles might leave an orphaned auth.user
    // For now, implementing as requested, but review auth deletion strategy
    try {
      const { error } = await this.supabase.from("profiles").delete().eq("id", userId)

      if (error) {
        console.error("Error deleting user profile:", error.message)
        return false
      }

      return true
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"
      console.error("Unexpected error deleting user profile:", message)
      return false
    }
  }

  async getUserNotificationSettings(userId: string): Promise<NotificationSettings | null> {
    try {
      const { data, error } = await this.supabase
        .from("notification_settings")
        .select("*")
        .eq("user_id", userId)
        .single()

      if (error) {
        // It's common for settings not to exist initially, treat as non-critical error or return defaults
        if (error.code === "PGRST116") {
          // PGRST116: "Searched item was not found"
          console.warn("Notification settings not found for user:", userId, "Returning null.")
          return null
        }
        console.error("Error fetching notification settings:", error.message)
        return null
      }

      return data
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"
      console.error("Unexpected error fetching notification settings:", message)
      return null
    }
  }

  async updateUserNotificationSettings(
    userId: string,
    settings: Partial<NotificationSettingsUpdate>,
  ): Promise<NotificationSettings | null> {
    try {
      const { data, error } = await this.supabase
        .from("notification_settings")
        .upsert({ ...settings, user_id: userId } as NotificationSettingsUpdate) // Cast to ensure user_id is included
        .select()
        .single()

      if (error) {
        console.error("Error updating notification settings:", error.message)
        return null
      }

      return data
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"
      console.error("Unexpected error updating notification settings:", message)
      return null
    }
  }

  async getUserPrivacySettings(userId: string): Promise<PrivacySettings | null> {
    try {
      const { data, error } = await this.supabase.from("privacy_settings").select("*").eq("user_id", userId).single()

      if (error) {
        if (error.code === "PGRST116") {
          console.warn("Privacy settings not found for user:", userId, "Returning null.")
          return null
        }
        console.error("Error fetching privacy settings:", error.message)
        return null
      }

      return data
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"
      console.error("Unexpected error fetching privacy settings:", message)
      return null
    }
  }

  async updateUserPrivacySettings(
    userId: string,
    settings: Partial<PrivacySettingsUpdate>,
  ): Promise<PrivacySettings | null> {
    try {
      const { data, error } = await this.supabase
        .from("privacy_settings")
        .upsert({ ...settings, user_id: userId } as PrivacySettingsUpdate)
        .select()
        .single()

      if (error) {
        console.error("Error updating privacy settings:", error.message)
        return null
      }

      return data
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"
      console.error("Unexpected error updating privacy settings:", message)
      return null
    }
  }
}

export const userService = new UserService()
