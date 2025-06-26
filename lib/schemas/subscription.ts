import { z } from "zod"

export const subscriptionPlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  interval: z.enum(["month", "year"]),
  features: z.array(z.string()),
  maxProperties: z.number(),
  maxSearches: z.number(),
  aiAnalysisIncluded: z.boolean(),
  priority: z.number(),
})

export const userSubscriptionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  planId: z.string(),
  status: z.enum(["active", "canceled", "past_due", "trialing"]),
  currentPeriodStart: z.date(),
  currentPeriodEnd: z.date(),
  cancelAtPeriodEnd: z.boolean(),
  stripeSubscriptionId: z.string().optional(),
  stripeCustomerId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const billingHistorySchema = z.object({
  id: z.string(),
  userId: z.string(),
  subscriptionId: z.string(),
  amount: z.number(),
  currency: z.string(),
  status: z.enum(["paid", "pending", "failed"]),
  invoiceUrl: z.string().optional(),
  description: z.string(),
  createdAt: z.date(),
})

export type SubscriptionPlan = z.infer<typeof subscriptionPlanSchema>
export type UserSubscription = z.infer<typeof userSubscriptionSchema>
export type BillingHistory = z.infer<typeof billingHistorySchema>
