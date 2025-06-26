import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "../trpc"
import {
  updateProfileSchema,
  updateNotificationSettingsSchema,
  updatePrivacySettingsSchema,
} from "@/lib/schemas/user-settings"
import { createClient } from "@/utils/supabase/server"

export const userRouter = createTRPCRouter({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const supabase = createClient()
    const { data: profile, error } = await supabase.from("user_profiles").select("*").eq("id", ctx.user.id).single()

    if (error) throw new Error("Failed to fetch profile")
    return profile
  }),

  updateProfile: protectedProcedure.input(updateProfileSchema).mutation(async ({ ctx, input }) => {
    const supabase = createClient()
    const { data, error } = await supabase.from("user_profiles").update(input).eq("id", ctx.user.id).select().single()

    if (error) throw new Error("Failed to update profile")
    return data
  }),

  getNotificationSettings: protectedProcedure.query(async ({ ctx }) => {
    const supabase = createClient()
    const { data: settings, error } = await supabase
      .from("notification_settings")
      .select("*")
      .eq("user_id", ctx.user.id)
      .single()

    if (error) throw new Error("Failed to fetch notification settings")
    return settings
  }),

  updateNotificationSettings: protectedProcedure
    .input(updateNotificationSettingsSchema)
    .mutation(async ({ ctx, input }) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("notification_settings")
        .upsert({ ...input, user_id: ctx.user.id })
        .select()
        .single()

      if (error) throw new Error("Failed to update notification settings")
      return data
    }),

  getPrivacySettings: protectedProcedure.query(async ({ ctx }) => {
    const supabase = createClient()
    const { data: settings, error } = await supabase
      .from("privacy_settings")
      .select("*")
      .eq("user_id", ctx.user.id)
      .single()

    if (error) throw new Error("Failed to fetch privacy settings")
    return settings
  }),

  updatePrivacySettings: protectedProcedure.input(updatePrivacySettingsSchema).mutation(async ({ ctx, input }) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("privacy_settings")
      .upsert({ ...input, user_id: ctx.user.id })
      .select()
      .single()

    if (error) throw new Error("Failed to update privacy settings")
    return data
  }),

  deleteAccount: protectedProcedure
    .input(z.object({ confirmEmail: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      if (input.confirmEmail !== ctx.user.email) {
        throw new Error("Email confirmation does not match")
      }

      const supabase = createClient()
      const { error } = await supabase.auth.admin.deleteUser(ctx.user.id)

      if (error) throw new Error("Failed to delete account")
      return { success: true }
    }),
})
