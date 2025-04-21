import { type NextRequest, NextResponse } from "next/server"
import { getOpportunityZones } from "@/lib/api/real-estate"
import { z } from "zod"

// Define the request schema
const RequestSchema = z.object({
  region: z.string().min(1, { message: "Region is required" }),
  regionType: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const region = searchParams.get("region")
    const regionType = searchParams.get("regionType") || undefined

    // Validate the request parameters
    const result = RequestSchema.safeParse({ region, regionType })

    if (!result.success) {
      return NextResponse.json({ error: "Invalid request parameters", details: result.error.format() }, { status: 400 })
    }

    const zones = await getOpportunityZones({
      region: region!,
      regionType: regionType as any,
    })

    return NextResponse.json(zones)
  } catch (error) {
    console.error("Error in opportunity zones API route:", error)
    return NextResponse.json({ error: "Failed to fetch opportunity zones" }, { status: 500 })
  }
}
