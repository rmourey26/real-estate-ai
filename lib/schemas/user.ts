import { z } from "zod"

// Subscription tier enum
export const SubscriptionTierEnum = z.enum(["free", "basic", "premium"])
export type SubscriptionTier = z.infer<typeof SubscriptionTierEnum>

// Subscription status enum
export const SubscriptionStatusEnum = z.enum(["active", "inactive", "trial"])
export type SubscriptionStatus = z.infer<typeof SubscriptionStatusEnum>

// User profile schema
export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  full_name: z.string().nullable(),
  avatar_url: z.string().url().nullable(),
  subscription_tier: SubscriptionTierEnum.nullable(),
  subscription_status: SubscriptionStatusEnum.nullable(),
})

export type UserProfile = z.infer<typeof UserProfileSchema>

// User settings schema
export const UserSettingsSchema = z.object({
  userId: z.string().uuid(),
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(false),
  darkMode: z.boolean().default(false),
  defaultLocation: z.string().optional(),
  investmentPreferences: z
    .object({
      minPrice: z.number().positive().optional(),
      maxPrice: z.number().positive().optional(),
      propertyTypes: z.array(z.string()).optional(),
      minCashFlow: z.number().optional(),
      minCapRate: z.number().optional(),
    })
    .optional(),
})

export type UserSettings = z.infer<typeof UserSettingsSchema>
