import { createClient } from "@/utils/supabase/server"
import type { Database } from "@/types/supabase"

type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"]
type UserProfileInsert = Database["public"]["Tables"]["user_profiles"]["Insert"]
type UserProfileUpdate = Database["public"]["Tables"]["user_profiles"]["Update"]

export class UserService {
  private supabase = createClient()

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await this.supabase.from("user_profiles").select("*").eq("id", userId).single()

      if (error) {
        console.error("Error fetching user profile:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Unexpected error fetching user profile:", error)
      return null
    }
  }

  async createUserProfile(profile: UserProfileInsert): Promise<UserProfile | null> {
    try {
      const { data, error } = await this.supabase.from("user_profiles").insert(profile).select().single()

      if (error) {
        console.error("Error creating user profile:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Unexpected error creating user profile:", error)
      return null
    }
  }

  async updateUserProfile(userId: string, updates: UserProfileUpdate): Promise<UserProfile | null> {
    try {
      const { data, error } = await this.supabase
        .from("user_profiles")
        .update(updates)
        .eq("id", userId)
        .select()
        .single()

      if (error) {
        console.error("Error updating user profile:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Unexpected error updating user profile:", error)
      return null
    }
  }

  async deleteUserProfile(userId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.from("user_profiles").delete().eq("id", userId)

      if (error) {
        console.error("Error deleting user profile:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Unexpected error deleting user profile:", error)
      return false
    }
  }

  async getUserNotificationSettings(userId: string) {
    try {
      const { data, error } = await this.supabase
        .from("notification_settings")
        .select("*")
        .eq("user_id", userId)
        .single()

      if (error) {
        console.error("Error fetching notification settings:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Unexpected error fetching notification settings:", error)
      return null
    }
  }

  async updateUserNotificationSettings(userId: string, settings: any) {
    try {
      const { data, error } = await this.supabase
        .from("notification_settings")
        .upsert({ ...settings, user_id: userId })
        .select()
        .single()

      if (error) {
        console.error("Error updating notification settings:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Unexpected error updating notification settings:", error)
      return null
    }
  }

  async getUserPrivacySettings(userId: string) {
    try {
      const { data, error } = await this.supabase.from("privacy_settings").select("*").eq("user_id", userId).single()

      if (error) {
        console.error("Error fetching privacy settings:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Unexpected error fetching privacy settings:", error)
      return null
    }
  }

  async updateUserPrivacySettings(userId: string, settings: any) {
    try {
      const { data, error } = await this.supabase
        .from("privacy_settings")
        .upsert({ ...settings, user_id: userId })
        .select()
        .single()

      if (error) {
        console.error("Error updating privacy settings:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Unexpected error updating privacy settings:", error)
      return null
    }
  }
}

export const userService = new UserService()
