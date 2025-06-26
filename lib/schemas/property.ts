import { z } from "zod"

export const propertySchema = z.object({
  address: z.string().min(5),
  city: z.string(),
  state: z.string(),
  zipCode: z.string().regex(/^\d{5}$/),
  price: z.number().min(10000),
  bedrooms: z.number().min(1),
  bathrooms: z.number().min(1),
})
