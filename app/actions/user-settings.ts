"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { updateProfileSchema, updateNotificationSettingsSchema } from "@/lib/schemas/user-settings"
import { ZodError } from "zod"

// Helper function to parse errors
function getErrorMessage(error: unknown): string {
  if (error instanceof ZodError) {
    return `Invalid form data: ${error.issues.map((e) => `${e.path.join(".")} - ${e.message}`).join(", ")}`
  }
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === "string") {
    return error
  }
  return "An unknown error occurred."
}

export async function updateUserProfile(formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated. Please log in." }
  }

  try {
    const rawFormData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      phone: (formData.get("phone") as string) || undefined,
      company: (formData.get("company") as string) || undefined,
      bio: (formData.get("bio") as string) || undefined,
      timezone: formData.get("timezone") as string,
      language: formData.get("language") as string,
    }
    const validatedData = updateProfileSchema.parse(rawFormData)

    const updatePayload = {
      first_name: validatedData.firstName,
      last_name: validatedData.lastName,
      phone: validatedData.phone || null,
      company: validatedData.company || null,
      bio: validatedData.bio || null,
      timezone: validatedData.timezone,
      language: validatedData.language,
    }

    const { error } = await supabase.from("profiles").update(updatePayload).eq("id", user.id)

    if (error) {
      console.error("Database error updating profile:", error)
      return { error: `Failed to update profile: ${error.message}` }
    }

    revalidatePath("/dashboard/settings")
    return { success: "Profile updated successfully." }
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error)
    console.error(`Error in updateUserProfile: ${errorMessage}`)
    return { error: errorMessage }
  }
}

export async function updateNotificationSettings(formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated. Please log in." }
  }

  try {
    const rawFormData = {
      emailNotifications: formData.get("emailNotifications") === "on",
      pushNotifications: formData.get("pushNotifications") === "on",
      marketingEmails: formData.get("marketingEmails") === "on",
      dealAlerts: formData.get("dealAlerts") === "on",
      priceDropAlerts: formData.get("priceDropAlerts") === "on",
      newListingAlerts: formData.get("newListingAlerts") === "on",
      weeklyReports: formData.get("weeklyReports") === "on",
    }
    const validatedData = updateNotificationSettingsSchema.parse(rawFormData)

    const updateData = {
      user_id: user.id,
      email_notifications: validatedData.emailNotifications,
      push_notifications: validatedData.pushNotifications,
      marketing_emails: validatedData.marketingEmails,
      deal_alerts: validatedData.dealAlerts,
      price_drop_alerts: validatedData.priceDropAlerts,
      new_listing_alerts: validatedData.newListingAlerts,
      weekly_reports: validatedData.weeklyReports,
    }

    const { error } = await supabase.from("notification_settings").upsert(updateData, { onConflict: "user_id" })

    if (error) {
      console.error("Database error updating notification settings:", error)
      return { error: `Failed to update settings: ${error.message}` }
    }

    revalidatePath("/dashboard/settings")
    return { success: "Notification settings updated." }
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error)
    console.error(`Error in updateNotificationSettings: ${errorMessage}`)
    return { error: errorMessage }
  }
}

export async function deleteUserAccount(formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated." }
  }

  const confirmEmail = formData.get("confirmEmail") as string

  if (confirmEmail !== user.email) {
    return { error: "Email confirmation does not match." }
  }

  try {
    const { error: authError } = await supabase.auth.admin.deleteUser(user.id)

    if (authError) {
      console.error("Error deleting auth user:", authError)
      return { error: `Failed to delete account: ${authError.message}` }
    }

    redirect("/")
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error
    }
    const errorMessage = getErrorMessage(error)
    console.error(`Error in deleteUserAccount: ${errorMessage}`)
    return { error: `Failed to delete account: ${errorMessage}` }
  }
}
