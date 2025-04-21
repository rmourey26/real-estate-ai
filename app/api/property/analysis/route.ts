import { type NextRequest, NextResponse } from "next/server"
import { getPropertyAnalysis } from "@/lib/api/real-estate"
import { z } from "zod"

// Define the request schema
const RequestSchema = z.object({
  propertyId: z.string().uuid({ message: "Property ID must be a valid UUID" }),
})

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const propertyId = searchParams.get("propertyId")

    // Validate the request parameters
    const result = RequestSchema.safeParse({ propertyId })

    if (!result.success) {
      return NextResponse.json({ error: "Invalid request parameters", details: result.error.format() }, { status: 400 })
    }

    const analysis = await getPropertyAnalysis(propertyId!)

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Error in property analysis API route:", error)
    return NextResponse.json({ error: "Failed to fetch property analysis" }, { status: 500 })
  }
}
