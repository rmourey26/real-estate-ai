"use server"

import type { z } from "zod"
import { createClient } from "@/utils/supabase/server"
import { propertySchema } from "@/lib/schemas"

export async function createProperty(values: z.infer<typeof propertySchema>) {
  const supabase = createClient()

  // Validate input data
  const validatedFields = propertySchema.safeParse(values)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Property.",
    }
  }

  const { data, error } = await supabase.from("real_estate_listings").insert([validatedFields.data])

  if (error) {
    console.error("Supabase error:", error)
    return { message: "Database Error: Failed to Create Property." }
  }

  return { message: "Created Property" }
}
