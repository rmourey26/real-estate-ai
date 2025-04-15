import { z } from "zod"

export const createAgentSchema = z.object({
  name: z.string().min(3).max(255),
  description: z.string().optional(),
  system_prompt: z.string().min(3),
  model_id: z.string().uuid(),
  temperature: z.number().min(0).max(1),
  max_tokens: z.number().min(100).max(4000),
})

export const updateAgentSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3).max(255),
  description: z.string().optional(),
  system_prompt: z.string().min(3),
  model_id: z.string().uuid(),
  temperature: z.number().min(0).max(1),
  max_tokens: z.number().min(100).max(4000),
})

export type CreateAIAgent = z.infer<typeof createAgentSchema>
export type UpdateAIAgent = z.infer<typeof updateAgentSchema>

// Zod schema for the ai_workflows table
export const aiWorkflowSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(255),
  description: z.string().nullable().optional(),
  steps: z.array(z.record(z.any())),
  trigger_type: z.string().nullable().optional(),
  trigger_config: z.record(z.any()).default({}),
  is_active: z.boolean().default(true),
  user_id: z.string().uuid(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
})

export type AIWorkflow = z.infer<typeof aiWorkflowSchema>

// Zod schema for the developer_tools table
export const developerToolSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(255),
  tool_type: z.string().min(1).max(100),
  configuration: z.record(z.any()),
  description: z.string().nullable().optional(),
  is_active: z.boolean().default(true),
  user_id: z.string().uuid(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
})

export type DeveloperTool = z.infer<typeof developerToolSchema>

// Zod schema for the shipping table
export const shippingSchema = z.object({
  id: z.string().uuid().optional(),
  tracking_number: z.string().min(1).max(255),
  origin_address: z.record(z.any()),
  destination_address: z.record(z.any()),
  package_ids: z.array(z.string()).default([]),
  carrier: z.string().nullable().optional(),
  shipping_date: z.string().datetime().nullable().optional(),
  estimated_delivery: z.string().datetime().nullable().optional(),
  actual_delivery: z.string().datetime().nullable().optional(),
  status: z
    .enum(["created", "pending", "in_transit", "delivered", "delayed", "cancelled", "exception"])
    .default("pending"),
  cost: z.number().nullable().optional(),
  weight: z.number().nullable().optional(),
  dimensions: z.record(z.any()).nullable().optional(),
  metadata: z.record(z.any()).default({}),
  current_location: z.record(z.any()).nullable().optional(),
  transit_events: z.array(z.record(z.any())).default([]),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
})

export type Shipping = z.infer<typeof shippingSchema>

// Zod schema for the package_utilization view
export const packageUtilizationSchema = z.object({
  id: z.string().uuid().optional(),
  package_id: z.string().min(1).max(255).optional(),
  name: z.string().min(1).max(255).optional(),
  reuse_count: z.number().optional(),
  status: z.string().optional(),
  shipment_count: z.number().optional(),
  last_used_date: z.string().datetime().nullable().optional(),
  created_at: z.string().datetime().optional(),
  days_since_creation: z.number().optional(),
  reuses_per_day: z.number().optional(),
})

export type PackageUtilization = z.infer<typeof packageUtilizationSchema>

// Zod schema for the shipping_analytics view
export const shippingAnalyticsSchema = z.object({
  shipping_day: z.string().datetime().optional(),
  total_shipments: z.number().optional(),
  avg_estimated_delivery_days: z.number().optional(),
  avg_actual_delivery_days: z.number().optional(),
  total_cost: z.number().optional(),
  avg_cost: z.number().optional(),
  total_weight: z.number().optional(),
  avg_weight: z.number().optional(),
  delivered_count: z.number().optional(),
  in_transit_count: z.number().optional(),
  delayed_count: z.number().optional(),
})

export type ShippingAnalytics = z.infer<typeof shippingAnalyticsSchema>

// Schema for ai_models table
export const aiModelSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  provider: z.string().min(1).max(100),
  model_id: z.string().min(1).max(255),
  description: z.string().nullable(),
  capabilities: z.array(z.string()),
  parameters: z.record(z.any()),
  cost_per_1k_tokens: z.number().nullable(),
  is_active: z.boolean().default(true),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

export type AIModel = z.infer<typeof aiModelSchema>

// Schema for ai_agents table
export const aiAgentSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().nullable(),
  system_prompt: z.string().nullable(),
  model_id: z.string().uuid(),
  user_id: z.string().uuid(),
  parameters: z.record(z.any()),
  tools: z.array(z.any()),
  is_active: z.boolean().default(true),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  max_tokens: z.number().optional(),
})

export type AIAgent = z.infer<typeof aiAgentSchema>

// Schema for data_embeddings table
