import { z } from "zod"

export const userProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  company: z.string().optional(),
  bio: z.string().max(500).optional(),
  avatar: z.string().url().optional(),
  timezone: z.string().default("UTC"),
  language: z.string().default("en"),
})

export const notificationSettingsSchema = z.object({
  userId: z.string(),
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
  dealAlerts: z.boolean().default(true),
  priceDropAlerts: z.boolean().default(true),
  newListingAlerts: z.boolean().default(true),
  weeklyReports: z.boolean().default(true),
})

export const privacySettingsSchema = z.object({
  userId: z.string(),
  profileVisibility: z.enum(["public", "private"]).default("private"),
  showEmail: z.boolean().default(false),
  showPhone: z.boolean().default(false),
  dataSharing: z.boolean().default(false),
  analyticsTracking: z.boolean().default(true),
})

export const updateProfileSchema = userProfileSchema.omit({ id: true }).partial()
export const updateNotificationSettingsSchema = notificationSettingsSchema.omit({ userId: true })
export const updatePrivacySettingsSchema = privacySettingsSchema.omit({ userId: true })

export type UserProfile = z.infer<typeof userProfileSchema>
export type NotificationSettings = z.infer<typeof notificationSettingsSchema>
export type PrivacySettings = z.infer<typeof privacySettingsSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type UpdateNotificationSettingsInput = z.infer<typeof updateNotificationSettingsSchema>
export type UpdatePrivacySettingsInput = z.infer<typeof updatePrivacySettingsSchema>
