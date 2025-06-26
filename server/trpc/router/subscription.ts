import { z } from "zod"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc"
import { createClient } from "@/utils/supabase/server"

export const subscriptionRouter = createTRPCRouter({
  getPlans: publicProcedure.query(async () => {
    const supabase = createClient()
    const { data: plans, error } = await supabase
      .from("subscription_plans")
      .select("*")
      .order("priority", { ascending: true })

    if (error) throw new Error("Failed to fetch subscription plans")
    return plans
  }),

  getCurrentSubscription: protectedProcedure.query(async ({ ctx }) => {
    const supabase = createClient()
    const { data: subscription, error } = await supabase
      .from("user_subscriptions")
      .select(`
        *,
        subscription_plans (*)
      `)
      .eq("user_id", ctx.user.id)
      .eq("status", "active")
      .single()

    if (error && error.code !== "PGRST116") {
      throw new Error("Failed to fetch subscription")
    }
    return subscription
  }),

  getBillingHistory: protectedProcedure.query(async ({ ctx }) => {
    const supabase = createClient()
    const { data: history, error } = await supabase
      .from("billing_history")
      .select("*")
      .eq("user_id", ctx.user.id)
      .order("created_at", { ascending: false })

    if (error) throw new Error("Failed to fetch billing history")
    return history
  }),

  createCheckoutSession: protectedProcedure.input(z.object({ planId: z.string() })).mutation(async ({ ctx, input }) => {
    // This would integrate with Stripe to create a checkout session
    // For now, we'll return a mock response
    return {
      checkoutUrl: `https://checkout.stripe.com/session_${input.planId}`,
      sessionId: `cs_${Math.random().toString(36).substr(2, 9)}`,
    }
  }),

  cancelSubscription: protectedProcedure
    .input(z.object({ immediate: z.boolean().default(false) }))
    .mutation(async ({ ctx, input }) => {
      const supabase = createClient()

      if (input.immediate) {
        // Cancel immediately
        const { error } = await supabase
          .from("user_subscriptions")
          .update({
            status: "canceled",
            cancel_at_period_end: false,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", ctx.user.id)
          .eq("status", "active")

        if (error) throw new Error("Failed to cancel subscription")
      } else {
        // Cancel at period end
        const { error } = await supabase
          .from("user_subscriptions")
          .update({
            cancel_at_period_end: true,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", ctx.user.id)
          .eq("status", "active")

        if (error) throw new Error("Failed to schedule cancellation")
      }

      return { success: true }
    }),

  reactivateSubscription: protectedProcedure.mutation(async ({ ctx }) => {
    const supabase = createClient()
    const { error } = await supabase
      .from("user_subscriptions")
      .update({
        cancel_at_period_end: false,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", ctx.user.id)
      .eq("status", "active")

    if (error) throw new Error("Failed to reactivate subscription")
    return { success: true }
  }),
})
