"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { updateProfileSchema, updateNotificationSettingsSchema } from "@/lib/schemas/user-settings"

export async function updateUserProfile(formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const rawFormData = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    phone: formData.get("phone") as string,
    company: formData.get("company") as string,
    bio: formData.get("bio") as string,
    timezone: formData.get("timezone") as string,
    language: formData.get("language") as string,
  }

  try {
    const validatedData = updateProfileSchema.parse(rawFormData)

    // Map form fields to database columns
    const updateData = {
      first_name: validatedData.firstName,
      last_name: validatedData.lastName,
      phone: validatedData.phone,
      company: validatedData.company,
      bio: validatedData.bio,
      timezone: validatedData.timezone,
      language: validatedData.language,
    }

    const { error } = await supabase.from("user_profiles").update(updateData).eq("id", user.id)

    if (error) {
      console.error("Database error:", error)
      return { error: "Failed to update profile" }
    }

    revalidatePath("/dashboard/settings")
    return { success: true }
  } catch (error) {
    console.error("Validation error:", error)
    return { error: "Invalid form data" }
  }
}

export async function updateNotificationSettings(formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const rawFormData = {
    emailNotifications: formData.get("emailNotifications") === "on",
    pushNotifications: formData.get("pushNotifications") === "on",
    marketingEmails: formData.get("marketingEmails") === "on",
    dealAlerts: formData.get("dealAlerts") === "on",
    priceDropAlerts: formData.get("priceDropAlerts") === "on",
    newListingAlerts: formData.get("newListingAlerts") === "on",
    weeklyReports: formData.get("weeklyReports") === "on",
  }

  try {
    const validatedData = updateNotificationSettingsSchema.parse(rawFormData)

    // Map form fields to database columns
    const updateData = {
      email_notifications: validatedData.emailNotifications,
      push_notifications: validatedData.pushNotifications,
      marketing_emails: validatedData.marketingEmails,
      deal_alerts: validatedData.dealAlerts,
      price_drop_alerts: validatedData.priceDropAlerts,
      new_listing_alerts: validatedData.newListingAlerts,
      weekly_reports: validatedData.weeklyReports,
      user_id: user.id,
    }

    const { error } = await supabase.from("notification_settings").upsert(updateData)

    if (error) {
      console.error("Database error:", error)
      return { error: "Failed to update notification settings" }
    }

    revalidatePath("/dashboard/settings")
    return { success: true }
  } catch (error) {
    console.error("Validation error:", error)
    return { error: "Invalid form data" }
  }
}

export async function deleteUserAccount(formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const confirmEmail = formData.get("confirmEmail") as string

  if (confirmEmail !== user.email) {
    return { error: "Email confirmation does not match" }
  }

  try {
    // Delete user data from all tables (handled by CASCADE)
    const { error: profileError } = await supabase.from("user_profiles").delete().eq("id", user.id)

    if (profileError) {
      console.error("Error deleting profile:", profileError)
      return { error: "Failed to delete account data" }
    }

    // Delete the auth user (requires service role key)
    const { error: authError } = await supabase.auth.admin.deleteUser(user.id)

    if (authError) {
      console.error("Error deleting auth user:", authError)
      return { error: "Failed to delete account" }
    }

    redirect("/")
  } catch (error) {
    console.error("Unexpected error:", error)
    return { error: "Failed to delete account" }
  }
}
