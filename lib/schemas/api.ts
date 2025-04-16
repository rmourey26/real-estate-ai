import { z } from "zod"

// API error schema
export const ApiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional(),
  }),
})

export type ApiError = z.infer<typeof ApiErrorSchema>

// API success schema
export const ApiSuccessSchema = z.object({
  success: z.boolean(),
  data: z.any(),
})

export type ApiSuccess = z.infer<typeof ApiSuccessSchema>

// API pagination schema
export const ApiPaginationSchema = z.object({
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  totalItems: z.number().int().nonnegative(),
  totalPages: z.number().int().positive(),
})

export type ApiPagination = z.infer<typeof ApiPaginationSchema>

// API paginated response schema
export const ApiPaginatedResponseSchema = z.object({
  data: z.array(z.any()),
  pagination: ApiPaginationSchema,
})

export type ApiPaginatedResponse = z.infer<typeof ApiPaginatedResponseSchema>
